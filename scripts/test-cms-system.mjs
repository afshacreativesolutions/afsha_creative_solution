// scripts/test-cms-system.mjs
// Automated verification suite for Afsha Creative Solution CMS, Validation, Sanitization & Seed Integrity

import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ts = require("typescript");

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
      if (fs.statSync(candidate).isFile()) return candidate;
    } catch {
      // continue
    }
  }
  return null;
}

function loadTsModule(filePath) {
  const normalized = path.resolve(filePath);
  if (moduleCache.has(normalized)) return moduleCache.get(normalized).exports;

  const ext = path.extname(normalized).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg", ".css"].includes(ext)) {
    return { default: { src: normalized, width: 1200, height: 800 } };
  }

  const source = fs.readFileSync(normalized, "utf8");
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

console.log("=================================================");
console.log("  Running Afsha CMS & Visual Editor Test Suite");
console.log("=================================================\n");

let passed = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(err);
    process.exit(1);
  }
}

const typesMod = loadTsModule("lib/cms/types.ts");
const validationMod = loadTsModule("lib/cms/validation.ts");
const dimMod = loadTsModule("lib/cms/image-dimensions.ts");
const mediaMod = loadTsModule("lib/cms/media.ts");
const seedMod = loadTsModule("lib/cms/seed-data.ts");

test("SQL migration 202611260001 defines all CMS tables, RLS, storage bucket, and RPCs", () => {
  const sqlPath = path.resolve(process.cwd(), "supabase/migrations/202611260001_cms_and_media.sql");
  assert.ok(fs.existsSync(sqlPath), "CMS migration file must exist");
  const sql = fs.readFileSync(sqlPath, "utf8");

  for (const table of [
    "public.cms_pages",
    "public.cms_page_drafts",
    "public.cms_sections",
    "public.cms_media",
    "public.cms_revisions",
    "public.cms_site_settings",
    "public.cms_site_setting_drafts",
  ]) {
    assert.ok(sql.includes(`create table if not exists ${table}`), `Missing table ${table}`);
    assert.ok(sql.includes(`alter table ${table} enable row level security`), `Missing RLS on ${table}`);
  }

  for (const fn of [
    "public.save_cms_page_draft",
    "public.publish_cms_page",
    "public.unpublish_cms_page",
    "public.is_cms_media_referenced",
  ]) {
    assert.ok(sql.includes(fn), `Missing RPC ${fn}`);
  }

  assert.ok(sql.includes("'cms-media'"), "Storage bucket cms-media must be configured");
  assert.ok(sql.includes("public.is_catalog_admin()"), "Admin guard must enforce is_catalog_admin()");
});

test("normalizeSlug cleans paths accurately", () => {
  assert.strictEqual(validationMod.normalizeSlug("/"), "/");
  assert.strictEqual(validationMod.normalizeSlug("  /About Us/ "), "/about-us");
  assert.strictEqual(validationMod.normalizeSlug("locations/Moradabad Gates"), "/locations/moradabad-gates");
});

test("validatePageMeta blocks reserved system paths and missing titles", () => {
  const emptyTitle = validationMod.validatePageMeta({ title: " ", slug: "/custom" });
  assert.strictEqual(emptyTitle.valid, false);

  const reservedAdmin = validationMod.validatePageMeta({ title: "Admin Override", slug: "/admin" });
  assert.strictEqual(reservedAdmin.valid, false);

  const reservedApi = validationMod.validatePageMeta({ title: "API Override", slug: "/api/test" });
  assert.strictEqual(reservedApi.valid, false);

  const valid = validationMod.validatePageMeta({
    title: "Brass Gates",
    slug: "brass-gates",
    page_type: "landing",
    meta_keywords: "brass gates, moradabad",
  });
  assert.strictEqual(valid.valid, true);
  assert.strictEqual(valid.data.slug, "/brass-gates");
  assert.deepStrictEqual(valid.data.meta_keywords, ["brass gates", "moradabad"]);
});

test("sanitizeRichText strips XSS script tags, event handlers, HTML, and dangerous protocols", () => {
  const raw =
    '## Heading\n<script>alert(1)</script><img src=x onerror="alert(2)">Hello <a href="javascript:alert(3)">click</a>javascript:evil()vbscript:bad';
  const clean = validationMod.sanitizeRichText(raw);
  assert.ok(!clean.includes("<script"), "Script tags must be removed");
  assert.ok(!clean.includes("<img"), "Raw HTML tags must be removed");
  assert.ok(!clean.toLowerCase().includes("javascript:"), "javascript: protocol must be stripped");
  assert.ok(!clean.toLowerCase().includes("vbscript:"), "vbscript: protocol must be stripped");
  assert.ok(clean.includes("## Heading") && clean.includes("Hello"), "Safe text preserved");
});

test("sanitizeUrl rejects dangerous schemes and protocol-relative open redirects", () => {
  assert.strictEqual(validationMod.sanitizeUrl("javascript:alert(1)", ""), "");
  assert.strictEqual(validationMod.sanitizeUrl("//evil.example.com", ""), "");
  assert.strictEqual(validationMod.sanitizeUrl("data:text/html,<script>", ""), "");
  assert.strictEqual(validationMod.sanitizeUrl("/products?category=gates", ""), "/products?category=gates");
  assert.strictEqual(validationMod.sanitizeUrl("https://www.afshacreative.in/about", ""), "https://www.afshacreative.in/about");
  assert.strictEqual(validationMod.sanitizeUrl("tel:+919634776691", ""), "tel:+919634776691");
  assert.strictEqual(validationMod.sanitizeUrl("asset:steel_gate.ssGate1", ""), "asset:steel_gate.ssGate1");
});

test("All 14 CMS section types produce valid defaults and sanitize dirty input", () => {
  assert.strictEqual(typesMod.CMS_SECTION_TYPES.length, 14, "Must support all 14 section types");
  for (const type of typesMod.CMS_SECTION_TYPES) {
    const def = validationMod.getDefaultSectionContent(type);
    assert.ok(def && typeof def === "object", `Default missing for ${type}`);
    const sanitized = validationMod.sanitizeSectionContent(type, def);
    assert.ok(sanitized && typeof sanitized === "object", `Sanitize failed for ${type}`);
  }

  const sanitizedCta = validationMod.sanitizeSectionContent("cta_banner", {
    heading: "<script>bad</script>Custom Quote",
    primaryButton: { label: "Click", href: "javascript:alert(1)" },
  });
  assert.strictEqual(sanitizedCta.heading, "Custom Quote");
  assert.strictEqual(sanitizedCta.primaryButton, null);
});

test("parseImageDimensions parses PNG header width and height accurately", () => {
  // Minimal PNG 1280x720 IHDR bytes
  const png = new Uint8Array(24);
  png.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 0);
  png.set([0x00, 0x00, 0x05, 0x00], 16); // 1280
  png.set([0x00, 0x00, 0x02, 0xd0], 20); // 720
  const dims = dimMod.parseImageDimensions(png, "image/png");
  assert.deepStrictEqual(dims, { width: 1280, height: 720 });
});

test("SEED_CMS_PAGES covers all 12 core routes with valid sections, SEO metadata, and asset keys", () => {
  const expectedSlugs = [
    "/",
    "/about",
    "/services",
    "/custom-metalwork",
    "/collections",
    "/products",
    "/gallery",
    "/faq",
    "/blog",
    "/contact",
    "/locations/metal-gate-manufacturers-moradabad",
    "/locations/iron-railing-manufacturers-moradabad",
  ];

  const actualSlugs = seedMod.SEED_CMS_PAGES.map((p) => p.slug);
  for (const slug of expectedSlugs) {
    assert.ok(actualSlugs.includes(slug), `Missing seeded CMS page for ${slug}`);
  }

  const assetRefsFound = [];
  const collectAssets = (val) => {
    if (typeof val === "string" && val.startsWith("asset:")) {
      assetRefsFound.push(val);
    } else if (Array.isArray(val)) {
      val.forEach(collectAssets);
    } else if (val && typeof val === "object") {
      Object.values(val).forEach(collectAssets);
    }
  };

  for (const page of seedMod.SEED_CMS_PAGES) {
    assert.ok(page.title.trim().length > 0, `Empty title on ${page.slug}`);
    assert.ok(page.meta_title.trim().length > 0, `Empty meta_title on ${page.slug}`);
    assert.ok(page.meta_description.trim().length > 0, `Empty meta_description on ${page.slug}`);
    assert.ok(page.canonical_url === page.slug, `Canonical mismatch on ${page.slug}`);
    assert.ok(page.sections.length > 0, `No sections defined for ${page.slug}`);

    const keys = new Set();
    for (const section of page.sections) {
      assert.ok(validationMod.isValidSectionType(section.section_type), `Invalid type on ${page.slug}`);
      assert.ok(!keys.has(section.section_key), `Duplicate section_key ${section.section_key} on ${page.slug}`);
      keys.add(section.section_key);
      collectAssets(section.content);
    }
  }

  collectAssets(seedMod.DEFAULT_SITE_SETTINGS);

  for (const assetKey of assetRefsFound) {
    const relPath = mediaMod.ASSET_FILE_MAP[assetKey];
    assert.ok(relPath, `Asset key ${assetKey} missing from ASSET_FILE_MAP`);
    const absPath = path.join(process.cwd(), "assets", relPath);
    assert.ok(fs.existsSync(absPath), `Referenced asset file does not exist: ${absPath}`);
  }
});

test("sanitizeSiteSettingsBundle strips scripts and keeps valid URLs", () => {
  const dirty = structuredClone(seedMod.DEFAULT_SITE_SETTINGS);
  dirty.site_identity.siteName = "<script>alert(1)</script>Afsha Creative Solution";
  dirty.navigation.desktopLinks[0].href = "javascript:alert(1)";
  const cleaned = validationMod.sanitizeSiteSettingsBundle(dirty, seedMod.DEFAULT_SITE_SETTINGS);
  assert.strictEqual(cleaned.site_identity.siteName, "Afsha Creative Solution");
  assert.strictEqual(cleaned.navigation.desktopLinks[0].href, "/");
});

const navMod = loadTsModule("lib/navigation.ts");
const colMod = loadTsModule("lib/collections.ts");

test("Collections-first navigation normalizes legacy /categories links cleanly", () => {
  assert.strictEqual(navMod.normalizePublicHref("/categories"), "/collections");
  assert.strictEqual(navMod.normalizePublicHref("/categories/gates"), "/collections/gates");
  assert.strictEqual(navMod.normalizePublicHref("/products/modern-gate"), "/products/modern-gate");

  const { primaryLinks, mobileLinks, quoteCta } = navMod.getPrimaryNavigation({
    desktopLinks: [
      { label: "Home", href: "/" },
      { label: "Categories", href: "/categories" },
      { label: "Collection", href: "/products" },
      { label: "Gallery", href: "/gallery" },
      { label: "Services", href: "/services" },
      { label: "About", href: "/about" },
    ],
    contactLink: { label: "Contact", href: "/contact" },
    menuButtonLabel: "Menu",
    mobileLinks: [],
  });

  assert.deepStrictEqual(
    primaryLinks.map((l) => l.href),
    ["/", "/collections", "/gallery", "/about", "/contact"]
  );
  assert.strictEqual(
    primaryLinks.find((l) => l.href === "/collections")?.label,
    "Collections"
  );
  assert.ok(!mobileLinks.some((l) => l.href.startsWith("/categories")));
  assert.strictEqual(quoteCta.label, "Get a Quote");
});

test("Legacy /categories/[slug] resolves valid mappings cleanly without catching unknown slugs", () => {
  const cats = [
    { id: "1", name: "Gates", slug: "gates", description: null, sort_order: 1, is_active: true },
    { id: "2", name: "Stair railings", slug: "stair-railings", description: null, sort_order: 2, is_active: true },
    { id: "3", name: "Balcony railings", slug: "balcony-railings", description: null, sort_order: 3, is_active: true },
  ];
  assert.strictEqual(colMod.resolveCategoryToCollectionSlug("gates", cats), "gates");
  assert.strictEqual(colMod.resolveCategoryToCollectionSlug("main-gates", cats), "gates");
  assert.strictEqual(colMod.resolveCategoryToCollectionSlug("staircase-railings", cats), "stair-railings");
  assert.strictEqual(colMod.resolveCategoryToCollectionSlug("unknown-garbage-slug", cats), null);
});

console.log(`\nPassed ${passed} CMS system checks successfully.\n`);
