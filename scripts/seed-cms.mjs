import { createClient } from "@supabase/supabase-js";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { readFile as readFileAsync } from "node:fs/promises";
import path from "node:path";

const require = createRequire(import.meta.url);
const ts = require("typescript");

// Lightweight TypeScript + @/ alias loader so scripts/seed-cms.mjs reuses lib/cms/* as single source of truth
const moduleCache = new Map();

function resolveTsFile(specifier, fromDir) {
  const candidates = [];
  if (specifier.startsWith("@/")) {
    const base = path.join(process.cwd(), specifier.slice(2));
    candidates.push(base, `${base}.ts`, `${base}.tsx`, path.join(base, "index.ts"));
  } else if (specifier.startsWith(".")) {
    const base = path.resolve(fromDir, specifier);
    candidates.push(base, `${base}.ts`, `${base}.tsx`, path.join(base, "index.ts"));
  }
  for (const candidate of candidates) {
    try {
      const stat = require("node:fs").statSync(candidate);
      if (stat.isFile()) return candidate;
    } catch {
      // continue
    }
  }
  return null;
}

function loadTsModule(filePath) {
  const normalized = path.resolve(filePath);
  if (moduleCache.has(normalized)) {
    return moduleCache.get(normalized).exports;
  }

  const ext = path.extname(normalized).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg", ".css"].includes(ext)) {
    const stub = { src: normalized, width: 1200, height: 800 };
    return { default: stub };
  }

  const source = readFileSync(normalized, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
      jsx: ts.JsxEmit.React,
    },
    fileName: normalized,
  });

  const mod = { exports: {} };
  moduleCache.set(normalized, mod);
  const fromDir = path.dirname(normalized);

  const localRequire = (spec) => {
    if (spec === "server-only") return {};
    const resolved = resolveTsFile(spec, fromDir);
    if (resolved) return loadTsModule(resolved);
    return require(spec);
  };

  const fn = new Function("exports", "require", "module", "__filename", "__dirname", outputText);
  fn(mod.exports, localRequire, mod, normalized, fromDir);
  return mod.exports;
}

const MIME_BY_EXT = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

function sanitizeStorageKey(relPath) {
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

function replaceAssetRefsDeep(value, assetMap) {
  if (Array.isArray(value)) {
    return value.map((item) => replaceAssetRefsDeep(item, assetMap));
  }
  if (value && typeof value === "object") {
    const candidateKey =
      typeof value.url === "string" && value.url.startsWith("asset:")
        ? value.url
        : typeof value.storagePath === "string" && value.storagePath.startsWith("asset:")
          ? value.storagePath
          : null;

    if (candidateKey && assetMap.has(candidateKey)) {
      const resolved = assetMap.get(candidateKey);
      return {
        ...resolved,
        alt: typeof value.alt === "string" && value.alt.trim() ? value.alt.trim() : resolved.alt,
      };
    }

    const next = {};
    for (const [k, v] of Object.entries(value)) {
      next[k] = replaceAssetRefsDeep(v, assetMap);
    }
    return next;
  }
  return value;
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.");
    process.exit(1);
  }

  const overwrite = process.argv.includes("--overwrite");
  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error: tableErr } = await supabase.from("cms_pages").select("id").limit(1);
  if (tableErr) {
    console.error("CMS tables are not available yet:", tableErr.message);
    console.error("Apply supabase/migrations/202611260001_cms_and_media.sql first.");
    process.exit(1);
  }

  const { SEED_CMS_PAGES, DEFAULT_SITE_SETTINGS } = loadTsModule("lib/cms/seed-data.ts");
  const { ASSET_FILE_MAP, deriveCmsMediaPublicUrl } = loadTsModule("lib/cms/media.ts");
  const { parseImageDimensions } = loadTsModule("lib/cms/image-dimensions.ts");
  const { normalizeSlug, sanitizeSectionContent, sanitizeText } = loadTsModule("lib/cms/validation.ts");

  const assetMap = new Map();
  const { data: existingMedia } = await supabase
    .from("cms_media")
    .select("id, storage_path, public_url, alt_text, width, height");

  const existingByPath = new Map();
  for (const row of existingMedia || []) {
    existingByPath.set(row.storage_path, row);
  }

  let mediaUploaded = 0;
  let mediaSkipped = 0;

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
      mediaSkipped++;
      continue;
    }

    const absPath = path.join(process.cwd(), "assets", relPath);
    const ext = path.extname(relPath).toLowerCase();
    const mimeType = MIME_BY_EXT[ext] || "image/jpeg";
    const fileBuffer = await readFileAsync(absPath);
    const bytes = new Uint8Array(fileBuffer);
    const dims = parseImageDimensions(bytes, mimeType);

    const { error: uploadErr } = await supabase.storage
      .from("cms-media")
      .upload(storagePath, bytes, { contentType: mimeType, upsert: true });

    if (uploadErr) {
      console.warn(`Skipped asset upload ${relPath}:`, uploadErr.message);
      continue;
    }

    const publicUrl = deriveCmsMediaPublicUrl(storagePath);
    const fileName = path.basename(relPath);
    const altText = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ").trim();

    const { data: insertedMedia, error: dbErr } = await supabase
      .from("cms_media")
      .upsert(
        {
          file_name: fileName,
          storage_bucket: "cms-media",
          storage_path: storagePath,
          public_url: publicUrl,
          alt_text: altText,
          mime_type: mimeType,
          file_size: bytes.byteLength,
          width: dims.width,
          height: dims.height,
        },
        { onConflict: "storage_path" }
      )
      .select("id, public_url, alt_text, width, height")
      .single();

    if (dbErr || !insertedMedia) {
      console.warn(`Skipped DB record ${relPath}:`, dbErr?.message);
      continue;
    }

    assetMap.set(assetKey, {
      url: insertedMedia.public_url,
      storagePath,
      mediaId: insertedMedia.id,
      alt: insertedMedia.alt_text || altText,
      width: insertedMedia.width ?? undefined,
      height: insertedMedia.height ?? undefined,
    });
    mediaUploaded++;
  }

  const resolvedSettings = replaceAssetRefsDeep(
    structuredClone(DEFAULT_SITE_SETTINGS),
    assetMap
  );

  const { data: existingSettings } = await supabase
    .from("cms_site_settings")
    .select("setting_key");
  const existingKeys = new Set((existingSettings || []).map((r) => r.setting_key));

  let settingsSeeded = 0;
  for (const [key, val] of Object.entries(resolvedSettings)) {
    if (!overwrite && existingKeys.has(key)) continue;
    await supabase.from("cms_site_settings").upsert(
      {
        setting_key: key,
        setting_value: val,
        is_published: true,
      },
      { onConflict: "setting_key" }
    );
    settingsSeeded++;
  }

  const { data: existingPages } = await supabase.from("cms_pages").select("id, slug");
  const pageBySlug = new Map((existingPages || []).map((p) => [normalizeSlug(p.slug), p.id]));
  const now = new Date().toISOString();

  let createdPages = 0;
  let updatedPages = 0;
  let skippedPages = 0;

  for (const seedPage of SEED_CMS_PAGES) {
    const slug = normalizeSlug(seedPage.slug);
    const existingId = pageBySlug.get(slug);
    if (existingId && !overwrite) {
      skippedPages++;
      continue;
    }

    const preparedSections = seedPage.sections.map((section, idx) => ({
      section_key: sanitizeText(section.section_key, 80) || `section-${idx + 1}`,
      section_type: section.section_type,
      title: sanitizeText(section.title, 160),
      sort_order: section.sort_order ?? idx,
      is_visible: section.is_visible !== false,
      content: sanitizeSectionContent(
        section.section_type,
        replaceAssetRefsDeep(section.content, assetMap)
      ),
    }));

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
      const { data: created, error } = await supabase
        .from("cms_pages")
        .insert({
          ...metaPayload,
          status: "published",
          has_unpublished_changes: false,
          published_at: now,
        })
        .select("id")
        .single();
      if (error || !created) {
        console.error(`Failed page ${slug}:`, error?.message);
        continue;
      }
      pageId = created.id;
      createdPages++;
    } else {
      await supabase
        .from("cms_pages")
        .update({
          ...metaPayload,
          status: "published",
          has_unpublished_changes: false,
          published_at: now,
        })
        .eq("id", pageId);
      updatedPages++;
    }

    await supabase.from("cms_page_drafts").upsert({ page_id: pageId, ...metaPayload }, { onConflict: "page_id" });
    await supabase.from("cms_sections").delete().eq("page_id", pageId);

    const rows = preparedSections.flatMap((sec) => [
      { page_id: pageId, publication_state: "draft", ...sec },
      { page_id: pageId, publication_state: "published", ...sec },
    ]);
    if (rows.length) {
      await supabase.from("cms_sections").insert(rows);
    }

    await supabase.from("cms_revisions").insert({
      page_id: pageId,
      revision_type: "seed",
      revision_data: { ...metaPayload, sections: preparedSections },
      note: overwrite ? "Re-synced via scripts/seed-cms.mjs" : "Initial CLI CMS seed",
    });
  }

  console.log(
    JSON.stringify(
      {
        mediaUploaded,
        mediaSkipped,
        settingsSeeded,
        createdPages,
        updatedPages,
        skippedPages,
      },
      null,
      2
    )
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
