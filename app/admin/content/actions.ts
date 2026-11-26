"use server";

import { revalidatePath, revalidateTag, updateTag } from "next/cache";
import { requireAdminAction } from "@/lib/admin-auth";
import { runCmsSeed, type CmsSeedResult } from "@/lib/cms/server-seeder";
import { DEFAULT_SITE_SETTINGS } from "@/lib/cms/seed-data";
import type { CmsSectionType, CmsSiteSettingsBundle } from "@/lib/cms/types";
import {
  getDefaultSectionContent,
  isValidSectionType,
  normalizeSlug,
  sanitizeSectionContent,
  sanitizeSiteSettingsBundle,
  sanitizeText,
  validatePageMeta,
} from "@/lib/cms/validation";

type ActionResult<T = undefined> =
  | (T extends undefined ? { ok: true } : { ok: true } & T)
  | { ok: false; error: string };

function revalidateCmsPage(slug?: string | null, previousSlug?: string | null) {
  updateTag("cms-pages");
  revalidateTag("cms-pages", "max");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/content");

  const slugs = new Set<string>();
  if (slug) slugs.add(normalizeSlug(slug));
  if (previousSlug) slugs.add(normalizeSlug(previousSlug));

  for (const s of slugs) {
    updateTag(`cms-page:${s}`);
    revalidateTag(`cms-page:${s}`, "max");
    revalidatePath(s);
  }
}

export async function createCmsPageAction(input: {
  title: string;
  slug: string;
  page_type: string;
  meta_title?: string;
  meta_description?: string;
}): Promise<ActionResult<{ id: string }>> {
  try {
    const { supabase, user } = await requireAdminAction();
    const validation = validatePageMeta({
      title: input.title,
      slug: input.slug,
      page_type: input.page_type,
      meta_title: input.meta_title || `${input.title} | Afsha Creative Solutions`,
      meta_description: input.meta_description || "",
      canonical_url: normalizeSlug(input.slug),
    });

    if (!validation.valid) {
      return { ok: false, error: validation.errors.join(" ") };
    }

    const { data: existing } = await supabase
      .from("cms_pages")
      .select("id")
      .eq("slug", validation.data.slug)
      .maybeSingle();

    if (existing) {
      return {
        ok: false,
        error: `A page with URL "${validation.data.slug}" already exists.`,
      };
    }

    const { data: created, error } = await supabase
      .from("cms_pages")
      .insert({
        ...validation.data,
        status: "draft",
        has_unpublished_changes: true,
      })
      .select("id")
      .single();

    if (error || !created) {
      return { ok: false, error: error?.message || "Could not create page." };
    }

    const pageId = String(created.id);

    await supabase.from("cms_page_drafts").insert({
      page_id: pageId,
      ...validation.data,
      updated_by: user.id,
    });

    // Starter sections for immediate editing
    const starterHero = {
      ...getDefaultSectionContent("hero_banner"),
      heading: validation.data.title,
      highlightText: "",
      description:
        validation.data.meta_description ||
        "Crafted to order in Moradabad with bespoke architectural metalwork.",
      breadcrumbs: [
        { name: "Home", href: "/" },
        { name: validation.data.title, href: validation.data.slug },
      ],
    };

    const starterCta = getDefaultSectionContent("cta_banner");

    await supabase.from("cms_sections").insert([
      {
        page_id: pageId,
        publication_state: "draft",
        section_key: "hero-1",
        section_type: "hero_banner",
        title: "Hero Banner",
        sort_order: 0,
        is_visible: true,
        content: sanitizeSectionContent("hero_banner", starterHero),
      },
      {
        page_id: pageId,
        publication_state: "draft",
        section_key: "cta-1",
        section_type: "cta_banner",
        title: "Call To Action",
        sort_order: 1,
        is_visible: true,
        content: sanitizeSectionContent("cta_banner", starterCta),
      },
    ]);

    revalidatePath("/admin/content");
    return { ok: true, id: pageId };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to create page." };
  }
}

export type SavePageDraftInput = {
  pageId: string;
  meta: {
    title: string;
    slug: string;
    page_type: string;
    meta_title?: string | null;
    meta_description?: string | null;
    meta_keywords?: string[];
    canonical_url?: string | null;
    og_image?: string | null;
    og_image_alt?: string | null;
    structured_data?: Record<string, unknown> | Array<Record<string, unknown>> | null;
  };
  sections: Array<{
    section_key: string;
    section_type: CmsSectionType;
    title: string;
    sort_order: number;
    is_visible: boolean;
    content: unknown;
  }>;
  recordRevision?: boolean;
  revisionNote?: string;
};

export async function saveCmsPageDraftAction(
  input: SavePageDraftInput
): Promise<ActionResult<{ savedAt: string }>> {
  try {
    const { supabase, user } = await requireAdminAction();
    const validation = validatePageMeta(input.meta);
    if (!validation.valid) {
      return { ok: false, error: validation.errors.join(" ") };
    }

    const { data: currentPage, error: fetchErr } = await supabase
      .from("cms_pages")
      .select("id, slug")
      .eq("id", input.pageId)
      .maybeSingle();

    if (fetchErr || !currentPage) {
      return { ok: false, error: "Page not found." };
    }

    const { data: conflictPage } = await supabase
      .from("cms_pages")
      .select("id")
      .eq("slug", validation.data.slug)
      .neq("id", input.pageId)
      .maybeSingle();

    if (conflictPage) {
      return {
        ok: false,
        error: `Another page already uses the URL "${validation.data.slug}".`,
      };
    }

    const usedKeys = new Set<string>();
    const sanitizedSections = input.sections.map((sec, idx) => {
      if (!isValidSectionType(sec.section_type)) {
        throw new Error(`Invalid section type: ${sec.section_type}`);
      }
      let key = sanitizeText(sec.section_key, 80) || `${sec.section_type}-${idx + 1}`;
      if (usedKeys.has(key)) {
        key = `${key}-${idx + 1}`;
      }
      usedKeys.add(key);

      return {
        section_key: key,
        section_type: sec.section_type,
        title: sanitizeText(sec.title, 160) || "Untitled section",
        sort_order: idx,
        is_visible: sec.is_visible !== false,
        content: sanitizeSectionContent(sec.section_type, sec.content),
      };
    });

    const { error: rpcErr } = await supabase.rpc("save_cms_page_draft", {
      p_page_id: input.pageId,
      p_meta: validation.data,
      p_sections: sanitizedSections,
    });

    if (rpcErr) {
      return { ok: false, error: rpcErr.message };
    }

    if (input.recordRevision) {
      await supabase.from("cms_revisions").insert({
        page_id: input.pageId,
        revision_type: "draft",
        revision_data: {
          ...validation.data,
          sections: sanitizedSections,
        },
        note: sanitizeText(input.revisionNote, 200) || "Draft snapshot",
        created_by: user.id,
      });
    }

    revalidatePath(`/admin/content/${input.pageId}`);
    revalidatePath("/admin/content");

    return { ok: true, savedAt: new Date().toISOString() };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to save draft." };
  }
}

export async function publishCmsPageAction(input: {
  pageId: string;
  note?: string;
  draftPayload?: SavePageDraftInput;
}): Promise<ActionResult<{ publishedAt: string; slug: string }>> {
  try {
    const { supabase } = await requireAdminAction();

    const { data: beforePage } = await supabase
      .from("cms_pages")
      .select("slug")
      .eq("id", input.pageId)
      .maybeSingle();

    if (!beforePage) {
      return { ok: false, error: "Page not found." };
    }

    if (input.draftPayload) {
      const saveResult = await saveCmsPageDraftAction(input.draftPayload);
      if (!saveResult.ok) {
        return saveResult;
      }
    }

    const { error: pubErr } = await supabase.rpc("publish_cms_page", {
      p_page_id: input.pageId,
      p_note: sanitizeText(input.note, 200) || "Published from Visual Page Editor",
    });

    if (pubErr) {
      return { ok: false, error: pubErr.message };
    }

    const { data: afterPage } = await supabase
      .from("cms_pages")
      .select("slug")
      .eq("id", input.pageId)
      .maybeSingle();

    const newSlug = afterPage?.slug || beforePage.slug;
    revalidateCmsPage(newSlug, beforePage.slug);
    revalidatePath(`/admin/content/${input.pageId}`);

    return { ok: true, publishedAt: new Date().toISOString(), slug: newSlug };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Publish failed." };
  }
}

export async function unpublishCmsPageAction(pageId: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdminAction();
    const { data: page } = await supabase
      .from("cms_pages")
      .select("slug")
      .eq("id", pageId)
      .maybeSingle();

    if (!page) {
      return { ok: false, error: "Page not found." };
    }

    const { error } = await supabase.rpc("unpublish_cms_page", {
      p_page_id: pageId,
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidateCmsPage(page.slug);
    revalidatePath(`/admin/content/${pageId}`);

    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to unpublish." };
  }
}

export async function restoreCmsRevisionAction(input: {
  pageId: string;
  revisionId: string;
}): Promise<ActionResult> {
  try {
    const { supabase, user } = await requireAdminAction();
    const { data: rev, error: revErr } = await supabase
      .from("cms_revisions")
      .select("*")
      .eq("id", input.revisionId)
      .eq("page_id", input.pageId)
      .maybeSingle();

    if (revErr || !rev || !rev.revision_data) {
      return { ok: false, error: "Revision not found." };
    }

    const revData = rev.revision_data as {
      title?: string;
      slug?: string;
      page_type?: string;
      meta_title?: string | null;
      meta_description?: string | null;
      meta_keywords?: string[];
      canonical_url?: string | null;
      og_image?: string | null;
      og_image_alt?: string | null;
      structured_data?: Record<string, unknown> | Array<Record<string, unknown>> | null;
      sections?: Array<{
        section_key: string;
        section_type: CmsSectionType;
        title: string;
        sort_order: number;
        is_visible: boolean;
        content: unknown;
      }>;
    };

    const saveResult = await saveCmsPageDraftAction({
      pageId: input.pageId,
      meta: {
        title: revData.title || "Restored Page",
        slug: revData.slug || "/",
        page_type: revData.page_type || "custom",
        meta_title: revData.meta_title ?? null,
        meta_description: revData.meta_description ?? null,
        meta_keywords: revData.meta_keywords ?? [],
        canonical_url: revData.canonical_url ?? null,
        og_image: revData.og_image ?? null,
        og_image_alt: revData.og_image_alt ?? null,
        structured_data: revData.structured_data ?? null,
      },
      sections: Array.isArray(revData.sections) ? revData.sections : [],
      recordRevision: false,
    });

    if (!saveResult.ok) {
      return saveResult;
    }

    await supabase.from("cms_revisions").insert({
      page_id: input.pageId,
      revision_type: "restore",
      revision_data: rev.revision_data,
      note: `Restored into draft from ${new Date(rev.created_at).toLocaleString("en-IN")}`,
      created_by: user.id,
    });

    revalidatePath(`/admin/content/${input.pageId}`);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to restore revision." };
  }
}

export async function deleteCmsPageAction(pageId: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdminAction();
    const { data: page } = await supabase
      .from("cms_pages")
      .select("id, slug, page_type")
      .eq("id", pageId)
      .maybeSingle();

    if (!page) {
      return { ok: false, error: "Page not found." };
    }

    if (page.slug === "/") {
      return {
        ok: false,
        error: "The Home page (/) cannot be deleted. You can edit all of its sections directly.",
      };
    }

    const { error } = await supabase.from("cms_pages").delete().eq("id", pageId);
    if (error) {
      return { ok: false, error: error.message };
    }

    revalidateCmsPage(page.slug);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to delete page." };
  }
}

export async function saveSiteSettingsDraftAction(
  bundle: CmsSiteSettingsBundle
): Promise<ActionResult<{ savedAt: string }>> {
  try {
    const { supabase, user } = await requireAdminAction();
    const sanitized = sanitizeSiteSettingsBundle(bundle, DEFAULT_SITE_SETTINGS);

    for (const key of Object.keys(sanitized) as Array<keyof CmsSiteSettingsBundle>) {
      // Ensure parent setting row exists cleanly before upserting draft
      const { data: existingParent } = await supabase
        .from("cms_site_settings")
        .select("setting_key")
        .eq("setting_key", key)
        .maybeSingle();

      if (!existingParent) {
        await supabase.from("cms_site_settings").insert({
          setting_key: key,
          setting_value: DEFAULT_SITE_SETTINGS[key],
          is_published: true,
        });
      }

      const { error } = await supabase.from("cms_site_setting_drafts").upsert(
        {
          setting_key: key,
          draft_value: sanitized[key],
          updated_by: user.id,
        },
        { onConflict: "setting_key" }
      );

      if (error) {
        return { ok: false, error: `Could not save draft for ${key}: ${error.message}` };
      }
    }

    revalidatePath("/admin/content/settings");
    return { ok: true, savedAt: new Date().toISOString() };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to save draft." };
  }
}

export async function publishSiteSettingsAction(
  bundle: CmsSiteSettingsBundle
): Promise<ActionResult<{ publishedAt: string }>> {
  try {
    const { supabase } = await requireAdminAction();
    const sanitized = sanitizeSiteSettingsBundle(bundle, DEFAULT_SITE_SETTINGS);

    const keys = Object.keys(sanitized) as Array<keyof CmsSiteSettingsBundle>;
    for (const key of keys) {
      const { error } = await supabase.from("cms_site_settings").upsert(
        {
          setting_key: key,
          setting_value: sanitized[key],
          is_published: true,
        },
        { onConflict: "setting_key" }
      );

      if (error) {
        return { ok: false, error: `Could not publish ${key}: ${error.message}` };
      }
    }

    await supabase.from("cms_site_setting_drafts").delete().in("setting_key", keys);

    updateTag("cms-settings");
    revalidateTag("cms-settings", "max");
    revalidatePath("/", "layout");
    revalidatePath("/admin/content/settings");

    return { ok: true, publishedAt: new Date().toISOString() };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to publish settings." };
  }
}

export async function seedDefaultCmsAction(
  overwriteExisting = false
): Promise<ActionResult<{ result: CmsSeedResult }>> {
  try {
    const { supabase, user } = await requireAdminAction();
    const seedResult = await runCmsSeed(supabase, {
      userId: user.id,
      overwriteExisting,
    });

    revalidateCmsPage();
    updateTag("cms-settings");
    revalidateTag("cms-settings", "max");
    revalidatePath("/", "layout");

    return { ok: true, result: seedResult };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Seed operation failed." };
  }
}
