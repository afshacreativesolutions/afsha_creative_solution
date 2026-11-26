import "server-only";

import { unstable_cache } from "next/cache";
import { draftMode } from "next/headers";
import { cache } from "react";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAdminSession } from "@/lib/admin-auth";
import { DEFAULT_SITE_SETTINGS, findSeedPageBySlug, SEED_CMS_PAGES } from "./seed-data";
import { normalizeSlug, sanitizeSectionContent } from "./validation";
import type {
  CmsMediaRecord,
  CmsPageRecord,
  CmsRevisionRecord,
  CmsSectionRecord,
  CmsSectionType,
  CmsSiteSettingsBundle,
  ResolvedCmsPage,
} from "./types";

function isMissingCmsTableError(error: { code?: string; message?: string } | null | undefined): boolean {
  if (!error) return false;
  return (
    error.code === "PGRST205" ||
    error.code === "42P01" ||
    Boolean(error.message?.includes("cms_pages")) ||
    Boolean(error.message?.includes("cms_site_settings"))
  );
}

function buildSeedFallbackPage(slug: string): ResolvedCmsPage | null {
  const seed = findSeedPageBySlug(slug);
  if (!seed) return null;
  const now = new Date().toISOString();
  return {
    id: `seed-${slug}`,
    title: seed.title,
    slug: seed.slug,
    page_type: seed.page_type,
    meta_title: seed.meta_title,
    meta_description: seed.meta_description,
    meta_keywords: seed.meta_keywords,
    canonical_url: seed.canonical_url,
    og_image: seed.og_image,
    og_image_alt: seed.og_image_alt,
    structured_data: seed.structured_data,
    status: "published",
    has_unpublished_changes: false,
    published_at: now,
    created_at: now,
    updated_at: now,
    source: "pre-migration-fallback",
    sections: seed.sections.map((section, idx) => ({
      id: `seed-sec-${slug}-${idx}`,
      section_key: section.section_key,
      section_type: section.section_type,
      title: section.title,
      sort_order: section.sort_order,
      is_visible: section.is_visible,
      content: sanitizeSectionContent(section.section_type, section.content),
    })),
  };
}

function normalizeSections(rows: Record<string, unknown>[]): CmsSectionRecord[] {
  return rows
    .map((row) => {
      const sectionType = row.section_type as CmsSectionType;
      return {
        id: String(row.id),
        page_id: row.page_id ? String(row.page_id) : undefined,
        publication_state:
          row.publication_state === "published" ? ("published" as const) : ("draft" as const),
        section_key: String(row.section_key ?? ""),
        section_type: sectionType,
        title: String(row.title ?? ""),
        content: sanitizeSectionContent(sectionType, row.content),
        sort_order: Number(row.sort_order ?? 0),
        is_visible: Boolean(row.is_visible),
        created_at: row.created_at ? String(row.created_at) : undefined,
        updated_at: row.updated_at ? String(row.updated_at) : undefined,
      };
    })
    .sort((a, b) => a.sort_order - b.sort_order);
}

const getPublishedCmsPageCached = (normalizedSlug: string) =>
  unstable_cache(
    async (): Promise<ResolvedCmsPage | null> => {
      try {
        const supabase = createSupabasePublicClient();
        if (!supabase) return buildSeedFallbackPage(normalizedSlug);

        const { data: rawPage, error: pageError } = await supabase
          .from("cms_pages")
          .select("*")
          .eq("slug", normalizedSlug)
          .eq("status", "published")
          .maybeSingle();

        const page = rawPage as CmsPageRecord | null;

        if (pageError) {
          if (isMissingCmsTableError(pageError)) {
            return buildSeedFallbackPage(normalizedSlug);
          }
          console.error(`Error loading CMS page "${normalizedSlug}":`, pageError.message);
          return null;
        }

        if (!page) {
          // Table exists! Check if any rows exist at all before deciding 404 vs unseeded
          const { count } = await supabase
            .from("cms_pages")
            .select("id", { count: "exact", head: true });
          if (count === 0) {
            // Tables exist cleanly, not seeded yet — serve safe fallback until admin seeds
            return buildSeedFallbackPage(normalizedSlug);
          }
          return null;
        }

        const { data: sectionRows, error: sectionsError } = await supabase
          .from("cms_sections")
          .select("*")
          .eq("page_id", page.id)
          .eq("publication_state", "published")
          .eq("is_visible", true)
          .order("sort_order", { ascending: true });

        if (sectionsError) {
          console.error(`Error loading sections for "${normalizedSlug}":`, sectionsError.message);
          return null;
        }

        return {
          ...(page as CmsPageRecord),
          source: "cms-db",
          sections: normalizeSections((sectionRows ?? []) as Record<string, unknown>[]),
        };
      } catch {
        return buildSeedFallbackPage(normalizedSlug);
      }
    },
    ["cms-published-page", normalizedSlug],
    {
      revalidate: 300,
      tags: ["cms-pages", `cms-page:${normalizedSlug}`],
    }
  )();

/**
 * Resolves a public page by slug.
 * If Next.js Draft Mode is enabled AND the requester has a verified admin session,
 * serves the latest draft metadata + draft sections safely.
 * Public visitors always receive published-only content.
 */
export const getCmsPageForRender = cache(
  async (rawSlug: string): Promise<ResolvedCmsPage | null> => {
    const normalizedSlug = normalizeSlug(rawSlug);

    let draftEnabled = false;
    try {
      const draft = await draftMode();
      draftEnabled = draft.isEnabled;
    } catch {
      draftEnabled = false;
    }

    if (draftEnabled) {
      const admin = await getAdminSession();
      if (admin) {
        const { data: page } = await admin.supabase
          .from("cms_pages")
          .select("*")
          .eq("slug", normalizedSlug)
          .maybeSingle();

        if (page) {
          const [{ data: draftMeta }, { data: draftSections }] = await Promise.all([
            admin.supabase
              .from("cms_page_drafts")
              .select("*")
              .eq("page_id", page.id)
              .maybeSingle(),
            admin.supabase
              .from("cms_sections")
              .select("*")
              .eq("page_id", page.id)
              .eq("publication_state", "draft")
              .eq("is_visible", true)
              .order("sort_order", { ascending: true }),
          ]);

          const mergedMeta = draftMeta
            ? {
                ...(page as CmsPageRecord),
                title: draftMeta.title ?? page.title,
                slug: draftMeta.slug ?? page.slug,
                page_type: draftMeta.page_type ?? page.page_type,
                meta_title: draftMeta.meta_title ?? page.meta_title,
                meta_description: draftMeta.meta_description ?? page.meta_description,
                meta_keywords: draftMeta.meta_keywords ?? page.meta_keywords,
                canonical_url: draftMeta.canonical_url ?? page.canonical_url,
                og_image: draftMeta.og_image ?? page.og_image,
                og_image_alt: draftMeta.og_image_alt ?? page.og_image_alt,
                structured_data: draftMeta.structured_data ?? page.structured_data,
              }
            : (page as CmsPageRecord);

          return {
            ...mergedMeta,
            isDraftPreview: true,
            source: "cms-db",
            sections: normalizeSections((draftSections ?? []) as Record<string, unknown>[]),
          };
        }
      }
    }

    return getPublishedCmsPageCached(normalizedSlug);
  }
);

export const getPublishedCmsSiteSettings = unstable_cache(
  async (): Promise<CmsSiteSettingsBundle> => {
    try {
      const supabase = createSupabasePublicClient();
      if (!supabase) return DEFAULT_SITE_SETTINGS;

      const { data, error } = await supabase
        .from("cms_site_settings")
        .select("setting_key, setting_value")
        .eq("is_published", true);

      if (error || !data || data.length === 0) {
        return DEFAULT_SITE_SETTINGS;
      }

      const bundle: CmsSiteSettingsBundle = structuredClone(DEFAULT_SITE_SETTINGS);
      for (const row of data as Array<{ setting_key: string; setting_value: unknown }>) {
        if (
          row.setting_key in bundle &&
          row.setting_value &&
          typeof row.setting_value === "object"
        ) {
          const key = row.setting_key as keyof CmsSiteSettingsBundle;
          // Shallow merge over defaults to guarantee missing optional keys remain safe
          (bundle[key] as Record<string, unknown>) = {
            ...(bundle[key] as Record<string, unknown>),
            ...(row.setting_value as Record<string, unknown>),
          };
        }
      }
      return bundle;
    } catch {
      return DEFAULT_SITE_SETTINGS;
    }
  },
  ["cms-site-settings"],
  { revalidate: 300, tags: ["cms-settings"] }
);

export const getPublishedCmsRoutesForSitemap = unstable_cache(
  async (): Promise<Array<{ slug: string; updated_at: string | null; page_type: string }>> => {
    try {
      const supabase = createSupabasePublicClient();
      if (!supabase) {
        return SEED_CMS_PAGES.map((p) => ({
          slug: p.slug,
          updated_at: null,
          page_type: p.page_type,
        }));
      }

      const { data, error } = await supabase
        .from("cms_pages")
        .select("slug, updated_at, page_type")
        .eq("status", "published")
        .order("slug");

      if (error || !data || data.length === 0) {
        return SEED_CMS_PAGES.map((p) => ({
          slug: p.slug,
          updated_at: null,
          page_type: p.page_type,
        }));
      }

      return data as Array<{ slug: string; updated_at: string | null; page_type: string }>;
    } catch {
      return SEED_CMS_PAGES.map((p) => ({
        slug: p.slug,
        updated_at: null,
        page_type: p.page_type,
      }));
    }
  },
  ["cms-sitemap-routes"],
  { revalidate: 300, tags: ["cms-pages"] }
);

// =====================================================================
// ADMIN QUERIES (Require authenticated admin session via server client)
// =====================================================================

export async function checkCmsTablesStatus(): Promise<{
  ready: boolean;
  pagesCount: number;
  error?: string;
}> {
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      return { ready: false, pagesCount: 0, error: "Supabase connection not configured." };
    }
    const { count, error } = await supabase
      .from("cms_pages")
      .select("id", { count: "exact", head: true });
    if (error) {
      return { ready: false, pagesCount: 0, error: error.message };
    }
    return { ready: true, pagesCount: count ?? 0 };
  } catch (err) {
    return {
      ready: false,
      pagesCount: 0,
      error: err instanceof Error ? err.message : "Unknown database error",
    };
  }
}

export async function getAdminCmsPages(): Promise<CmsPageRecord[]> {
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("cms_pages")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) return [];
    return (data ?? []) as CmsPageRecord[];
  } catch {
    return [];
  }
}

export async function getAdminCmsPageEditorData(pageId: string): Promise<{
  page: CmsPageRecord;
  draftMeta: CmsPageRecord;
  sections: CmsSectionRecord[];
  revisions: CmsRevisionRecord[];
} | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data: page, error: pageError } = await supabase
    .from("cms_pages")
    .select("*")
    .eq("id", pageId)
    .maybeSingle();

  if (pageError || !page) return null;

  const [{ data: draftMeta }, { data: draftSections }, { data: publishedSections }, { data: revisions }] =
    await Promise.all([
      supabase.from("cms_page_drafts").select("*").eq("page_id", pageId).maybeSingle(),
      supabase
        .from("cms_sections")
        .select("*")
        .eq("page_id", pageId)
        .eq("publication_state", "draft")
        .order("sort_order", { ascending: true }),
      supabase
        .from("cms_sections")
        .select("*")
        .eq("page_id", pageId)
        .eq("publication_state", "published")
        .order("sort_order", { ascending: true }),
      supabase
        .from("cms_revisions")
        .select("*")
        .eq("page_id", pageId)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

  const rawSections =
    draftSections && draftSections.length > 0 ? draftSections : publishedSections ?? [];

  const mergedDraftMeta: CmsPageRecord = draftMeta
    ? {
        ...(page as CmsPageRecord),
        title: draftMeta.title ?? page.title,
        slug: draftMeta.slug ?? page.slug,
        page_type: draftMeta.page_type ?? page.page_type,
        meta_title: draftMeta.meta_title ?? null,
        meta_description: draftMeta.meta_description ?? null,
        meta_keywords: draftMeta.meta_keywords ?? [],
        canonical_url: draftMeta.canonical_url ?? null,
        og_image: draftMeta.og_image ?? null,
        og_image_alt: draftMeta.og_image_alt ?? null,
        structured_data: draftMeta.structured_data ?? null,
      }
    : (page as CmsPageRecord);

  return {
    page: page as CmsPageRecord,
    draftMeta: mergedDraftMeta,
    sections: normalizeSections((rawSections ?? []) as Record<string, unknown>[]),
    revisions: (revisions ?? []) as CmsRevisionRecord[],
  };
}

export async function getAdminCmsMedia(search?: string): Promise<CmsMediaRecord[]> {
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return [];
    let query = supabase
      .from("cms_media")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (search && search.trim()) {
      const q = search.trim();
      query = query.or(`file_name.ilike.%${q}%,alt_text.ilike.%${q}%`);
    }
    const { data, error } = await query;
    if (error) return [];
    return (data ?? []) as CmsMediaRecord[];
  } catch {
    return [];
  }
}

export async function getAdminCmsSiteSettings(): Promise<{
  published: CmsSiteSettingsBundle;
  draft: CmsSiteSettingsBundle;
  hasUnpublishedSettings: boolean;
}> {
  const published = structuredClone(DEFAULT_SITE_SETTINGS);
  const draft = structuredClone(DEFAULT_SITE_SETTINGS);
  let hasUnpublishedSettings = false;

  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return { published, draft, hasUnpublishedSettings };

    const [{ data: pubRows }, { data: draftRows }] = await Promise.all([
      supabase.from("cms_site_settings").select("setting_key, setting_value"),
      supabase.from("cms_site_setting_drafts").select("setting_key, draft_value"),
    ]);

    for (const row of (pubRows ?? []) as Array<{ setting_key: string; setting_value: unknown }>) {
      if (
        row.setting_key in published &&
        row.setting_value &&
        typeof row.setting_value === "object"
      ) {
        const key = row.setting_key as keyof CmsSiteSettingsBundle;
        (published[key] as Record<string, unknown>) = {
          ...(published[key] as Record<string, unknown>),
          ...(row.setting_value as Record<string, unknown>),
        };
        (draft[key] as Record<string, unknown>) = {
          ...(published[key] as Record<string, unknown>),
        };
      }
    }

    if (draftRows && draftRows.length > 0) {
      for (const row of draftRows as Array<{ setting_key: string; draft_value: unknown }>) {
        if (
          row.setting_key in draft &&
          row.draft_value &&
          typeof row.draft_value === "object"
        ) {
          const key = row.setting_key as keyof CmsSiteSettingsBundle;
          (draft[key] as Record<string, unknown>) = {
            ...(draft[key] as Record<string, unknown>),
            ...(row.draft_value as Record<string, unknown>),
          };
          hasUnpublishedSettings = true;
        }
      }
    }
  } catch {
    // Fallback to defaults if unmigrated
  }

  return { published, draft, hasUnpublishedSettings };
}
