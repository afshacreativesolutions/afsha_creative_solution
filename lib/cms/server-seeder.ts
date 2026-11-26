import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import type { SupabaseClient } from "@supabase/supabase-js";
import { parseImageDimensions } from "./image-dimensions";
import { ASSET_FILE_MAP, deriveCmsMediaPublicUrl } from "./media";
import { DEFAULT_SITE_SETTINGS, SEED_CMS_PAGES } from "./seed-data";
import type { CmsImageRef, CmsSiteSettingsBundle } from "./types";
import { normalizeSlug, sanitizeSectionContent, sanitizeText } from "./validation";

export type CmsSeedResult = {
  mediaUploaded: number;
  mediaSkipped: number;
  createdPages: number;
  updatedPages: number;
  skippedPages: number;
  settingsSeeded: number;
  warnings: string[];
};

const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

function sanitizeStorageKey(relPath: string): string {
  return (
    "seed/" +
    relPath
      .replace(/\\/g, "/")
      .split("/")
      .map((part) =>
        part
          .toLowerCase()
          .replace(/[^a-z0-9._-]+/g, "-")
          .replace(/-+/g, "-")
      )
      .join("/")
  );
}

function replaceAssetRefsDeep<T>(value: T, assetMap: Map<string, CmsImageRef>): T {
  if (Array.isArray(value)) {
    return value.map((item) => replaceAssetRefsDeep(item, assetMap)) as T;
  }
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const candidateKey =
      typeof obj.url === "string" && obj.url.startsWith("asset:")
        ? obj.url
        : typeof obj.storagePath === "string" && obj.storagePath.startsWith("asset:")
          ? obj.storagePath
          : null;

    if (candidateKey && assetMap.has(candidateKey)) {
      const resolved = assetMap.get(candidateKey)!;
      return {
        ...resolved,
        alt: typeof obj.alt === "string" && obj.alt.trim() ? obj.alt.trim() : resolved.alt,
      } as T;
    }

    const next: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(obj)) {
      next[key] = replaceAssetRefsDeep(val, assetMap);
    }
    return next as T;
  }
  return value;
}

export async function runCmsSeed(
  supabase: SupabaseClient,
  options: { userId?: string | null; overwriteExisting?: boolean } = {}
): Promise<CmsSeedResult> {
  const { userId = null, overwriteExisting = false } = options;
  const result: CmsSeedResult = {
    mediaUploaded: 0,
    mediaSkipped: 0,
    createdPages: 0,
    updatedPages: 0,
    skippedPages: 0,
    settingsSeeded: 0,
    warnings: [],
  };

  // 1. Upload referenced local assets into cms-media bucket and record metadata in cms_media
  const assetMap = new Map<string, CmsImageRef>();
  const { data: existingMedia } = await supabase
    .from("cms_media")
    .select("id, storage_path, public_url, alt_text, width, height");

  const existingByPath = new Map<
    string,
    { id: string; public_url: string; alt_text: string; width: number | null; height: number | null }
  >();
  for (const row of existingMedia ?? []) {
    existingByPath.set(String(row.storage_path), {
      id: String(row.id),
      public_url: String(row.public_url),
      alt_text: String(row.alt_text ?? ""),
      width: typeof row.width === "number" ? row.width : null,
      height: typeof row.height === "number" ? row.height : null,
    });
  }

  for (const [assetKey, relPath] of Object.entries(ASSET_FILE_MAP)) {
    const storagePath = sanitizeStorageKey(relPath);
    const existing = existingByPath.get(storagePath);

    if (existing) {
      assetMap.set(assetKey, {
        url: existing.public_url || deriveCmsMediaPublicUrl(storagePath),
        storagePath,
        mediaId: existing.id,
        alt: existing.alt_text,
        width: existing.width ?? undefined,
        height: existing.height ?? undefined,
      });
      result.mediaSkipped++;
      continue;
    }

    const absPath = path.join(process.cwd(), "assets", relPath);
    const ext = path.extname(relPath).toLowerCase();
    const mimeType = MIME_BY_EXT[ext] ?? "image/jpeg";

    try {
      const fileBuffer = await readFile(absPath);
      const bytes = new Uint8Array(fileBuffer);
      const dims = parseImageDimensions(bytes, mimeType);
      const { error: uploadErr } = await supabase.storage
        .from("cms-media")
        .upload(storagePath, bytes, { contentType: mimeType, upsert: true });

      if (uploadErr) {
        result.warnings.push(`Upload skipped (${relPath}): ${uploadErr.message}`);
        continue;
      }

      const publicUrl = deriveCmsMediaPublicUrl(storagePath);
      const fileName = path.basename(relPath);
      const defaultAlt = fileName
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]+/g, " ")
        .trim();

      const { data: insertedMedia, error: dbErr } = await supabase
        .from("cms_media")
        .upsert(
          {
            file_name: fileName,
            storage_bucket: "cms-media",
            storage_path: storagePath,
            public_url: publicUrl,
            alt_text: defaultAlt,
            mime_type: mimeType,
            file_size: bytes.byteLength,
            width: dims.width,
            height: dims.height,
            uploaded_by: userId,
          },
          { onConflict: "storage_path" }
        )
        .select("id, public_url, alt_text, width, height")
        .single();

      if (dbErr || !insertedMedia) {
        result.warnings.push(`DB record skipped (${relPath}): ${dbErr?.message || "unknown"}`);
        continue;
      }

      assetMap.set(assetKey, {
        url: insertedMedia.public_url,
        storagePath,
        mediaId: insertedMedia.id,
        alt: insertedMedia.alt_text || defaultAlt,
        width: insertedMedia.width ?? undefined,
        height: insertedMedia.height ?? undefined,
      });
      result.mediaUploaded++;
    } catch (err) {
      result.warnings.push(
        `Could not read local asset ${relPath}: ${err instanceof Error ? err.message : "unknown"}`
      );
    }
  }

  // 2. Seed Site Settings idempotently
  const resolvedSettings = replaceAssetRefsDeep(
    structuredClone(DEFAULT_SITE_SETTINGS),
    assetMap
  ) as CmsSiteSettingsBundle;

  const { data: existingSettings } = await supabase
    .from("cms_site_settings")
    .select("setting_key");
  const existingSettingKeys = new Set((existingSettings ?? []).map((r) => String(r.setting_key)));

  for (const key of Object.keys(resolvedSettings) as Array<keyof CmsSiteSettingsBundle>) {
    if (!overwriteExisting && existingSettingKeys.has(key)) continue;
    const { error } = await supabase.from("cms_site_settings").upsert(
      {
        setting_key: key,
        setting_value: resolvedSettings[key],
        is_published: true,
      },
      { onConflict: "setting_key" }
    );
    if (error) {
      result.warnings.push(`Site setting ${key}: ${error.message}`);
    } else {
      result.settingsSeeded++;
    }
  }

  // 3. Seed CMS Pages & Sections idempotently
  const { data: existingPages } = await supabase.from("cms_pages").select("id, slug");
  const pageBySlug = new Map<string, string>();
  for (const p of existingPages ?? []) {
    pageBySlug.set(normalizeSlug(String(p.slug)), String(p.id));
  }

  const now = new Date().toISOString();

  for (const seedPage of SEED_CMS_PAGES) {
    const slug = normalizeSlug(seedPage.slug);
    const existingId = pageBySlug.get(slug);

    if (existingId && !overwriteExisting) {
      result.skippedPages++;
      continue;
    }

    const preparedSections = seedPage.sections.map((section, idx) => {
      const withAssets = replaceAssetRefsDeep(section.content, assetMap);
      return {
        section_key: sanitizeText(section.section_key, 80) || `section-${idx + 1}`,
        section_type: section.section_type,
        title: sanitizeText(section.title, 160),
        sort_order: section.sort_order ?? idx,
        is_visible: section.is_visible !== false,
        content: sanitizeSectionContent(section.section_type, withAssets),
      };
    });

    const metaPayload = {
      title: seedPage.title,
      slug,
      page_type: seedPage.page_type,
      meta_title: seedPage.meta_title,
      meta_description: seedPage.meta_description,
      meta_keywords: seedPage.meta_keywords,
      canonical_url: seedPage.canonical_url,
      og_image: seedPage.og_image,
      og_image_alt: seedPage.og_image_alt,
      structured_data: seedPage.structured_data,
    };

    let pageId = existingId;

    if (!pageId) {
      const { data: created, error: createErr } = await supabase
        .from("cms_pages")
        .insert({
          ...metaPayload,
          status: "published",
          has_unpublished_changes: false,
          published_at: now,
        })
        .select("id")
        .single();

      if (createErr || !created) {
        result.warnings.push(`Page "${slug}" insert failed: ${createErr?.message || "unknown"}`);
        continue;
      }
      pageId = String(created.id);
      result.createdPages++;
    } else {
      const { error: updateErr } = await supabase
        .from("cms_pages")
        .update({
          ...metaPayload,
          status: "published",
          has_unpublished_changes: false,
          published_at: now,
        })
        .eq("id", pageId);

      if (updateErr) {
        result.warnings.push(`Page "${slug}" update failed: ${updateErr.message}`);
        continue;
      }
      result.updatedPages++;
    }

    await supabase.from("cms_page_drafts").upsert(
      {
        page_id: pageId,
        ...metaPayload,
        updated_by: userId,
      },
      { onConflict: "page_id" }
    );

    await supabase.from("cms_sections").delete().eq("page_id", pageId);

    const rowsToInsert = preparedSections.flatMap((sec) => [
      {
        page_id: pageId,
        publication_state: "draft",
        ...sec,
      },
      {
        page_id: pageId,
        publication_state: "published",
        ...sec,
      },
    ]);

    if (rowsToInsert.length > 0) {
      const { error: secErr } = await supabase.from("cms_sections").insert(rowsToInsert);
      if (secErr) {
        result.warnings.push(`Sections for "${slug}" failed: ${secErr.message}`);
      }
    }

    await supabase.from("cms_revisions").insert({
      page_id: pageId,
      revision_type: "seed",
      revision_data: {
        ...metaPayload,
        sections: preparedSections,
      },
      note: overwriteExisting
        ? "Re-synced from default website blueprint"
        : "Initial migration from hardcoded website content",
      created_by: userId,
    });
  }

  return result;
}
