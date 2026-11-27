// scripts/test-lead-capture.mjs
// Verification suite for Afsha Creative Solutions Lead Validation, Attachment Security, Privacy Analytics & Migration 202611260002

import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ts = require("typescript");

const moduleCache = new Map();

function loadTs(relPath) {
  const full = relPath.endsWith(".ts")
    ? path.resolve(process.cwd(), relPath)
    : path.resolve(process.cwd(), `${relPath}.ts`);
  if (moduleCache.has(full)) {
    return moduleCache.get(full).exports;
  }
  const src = fs.readFileSync(full, "utf8");
  const { outputText } = ts.transpileModule(src, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
    fileName: full,
  });
  const mod = { exports: {} };
  moduleCache.set(full, mod);
  const localRequire = (spec) => {
    if (spec.startsWith(".")) {
      const target = path.resolve(path.dirname(full), spec);
      const withExt = fs.existsSync(target) && fs.statSync(target).isFile() ? target : `${target}.ts`;
      return loadTs(path.relative(process.cwd(), withExt));
    }
    return require(spec);
  };
  const fn = new Function("exports", "require", "module", outputText);
  fn(mod.exports, localRequire, mod);
  return mod.exports;
}

const { validateLeadFields, normalizePhoneDigits, MAX_LEAD_PHOTO_BYTES } =
  loadTs("lib/lead-validation.ts");
const { verifyImageMagicBytes, ALLOWED_IMAGE_TYPES, sanitizeUploadBaseName } =
  loadTs("lib/image-security.ts");
const { ALLOWED_EVENT_NAMES, sanitizeAnalyticsProperties } = loadTs("lib/tracker.ts");

console.log("=================================================");
console.log("  Running Afsha Lead Capture & Security Test Suite");
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

test("Migration 202611260002 uses additive-only alterations and configures private lead-attachments bucket", () => {
  const sqlPath = path.resolve(
    process.cwd(),
    "supabase/migrations/202611260002_lead_capture_enhancements.sql"
  );
  assert.ok(fs.existsSync(sqlPath), "Migration 202611260002 must exist");
  const sql = fs.readFileSync(sqlPath, "utf8");

  assert.ok(!/drop\s+table/i.test(sql), "Migration must never drop existing tables");
  assert.ok(!/truncate\s+/i.test(sql), "Migration must never truncate tables");
  assert.ok(sql.includes("add column if not exists city text"));
  assert.ok(sql.includes("add column if not exists product_slug text"));
  assert.ok(sql.includes("add column if not exists page_url text"));
  assert.ok(sql.includes("add column if not exists utm_source text"));
  assert.ok(sql.includes("add column if not exists utm_medium text"));
  assert.ok(sql.includes("add column if not exists utm_campaign text"));
  assert.ok(sql.includes("add column if not exists attachment_path text"));
  assert.ok(sql.includes("add column if not exists attachment_name text"));
  assert.ok(sql.includes("idx_leads_city"));
  assert.ok(sql.includes("idx_leads_status_category_created"));
  assert.ok(sql.includes("idx_leads_product_slug"));
  assert.ok(sql.includes("'lead-attachments'"));
  assert.ok(sql.includes("public = excluded.public"));
  assert.ok(sql.includes("5242880"));
  assert.ok(sql.includes("public.is_catalog_admin()"));
});

test("validateLeadFields requires name, valid 10+ digit phone, product/service, and city, while keeping details optional", () => {
  const missingAll = validateLeadFields({}, true);
  assert.strictEqual(missingAll.valid, false);
  assert.ok(missingAll.errors.name);
  assert.ok(missingAll.errors.phone);
  assert.ok(missingAll.errors.category);
  assert.ok(missingAll.errors.city);
  assert.strictEqual(missingAll.errors.message, undefined);

  const validMinimal = validateLeadFields(
    {
      name: "Rajesh Kumar",
      phone: "+91 98765 43210",
      category: "sliding-gates",
      city: "Moradabad",
      productSlug: "cnc-sliding-gate",
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "moradabad-gates",
      message: "",
    },
    true
  );
  assert.strictEqual(validMinimal.valid, true);
  assert.strictEqual(validMinimal.data.normalizedPhoneDigits, "919876543210");
  assert.strictEqual(validMinimal.data.city, "Moradabad");
  assert.strictEqual(validMinimal.data.productSlug, "cnc-sliding-gate");
  assert.strictEqual(validMinimal.data.utmSource, "google");
  assert.strictEqual(validMinimal.data.utmMedium, "cpc");
  assert.strictEqual(validMinimal.data.utmCampaign, "moradabad-gates");

  const shortPhone = validateLeadFields(
    { name: "Amit", phone: "12345", category: "gates", city: "Rampur" },
    true
  );
  assert.strictEqual(shortPhone.valid, false);
  assert.ok(shortPhone.errors.phone);

  const badEmail = validateLeadFields(
    {
      name: "Amit Verma",
      phone: "9876543210",
      category: "gates",
      city: "Rampur",
      email: "not-an-email",
    },
    true
  );
  assert.strictEqual(badEmail.valid, false);
  assert.ok(badEmail.errors.email);
});

test("validateLeadFields strips unsafe HTML/control payloads cleanly", () => {
  const dirty = validateLeadFields(
    {
      name: "  <script>alert(1)</script> Salman   Khan  ",
      phone: "9876543210",
      category: "gates",
      city: "Moradabad <img src=x>",
      message: "Line 1\n<script>bad()</script> Need 12x7 ft gate",
    },
    true
  );
  assert.strictEqual(dirty.valid, true);
  assert.ok(!dirty.data.name.includes("<script>"));
  assert.ok(!dirty.data.city.includes("<img"));
  assert.ok(!dirty.data.message.includes("<script>"));
  assert.ok(dirty.data.message.includes("Need 12x7 ft gate"));
});

test("normalizePhoneDigits and sanitizeUploadBaseName normalize safely", () => {
  assert.strictEqual(normalizePhoneDigits("+91 (963) 477-6691"), "919634776691");
  assert.strictEqual(sanitizeUploadBaseName("../../My Gate Photo!.PNG"), "my-gate-photo");
});

test("verifyImageMagicBytes validates real PNG/JPEG/WebP headers and blocks spoofed files", () => {
  assert.strictEqual(MAX_LEAD_PHOTO_BYTES, 5 * 1024 * 1024);
  assert.ok(ALLOWED_IMAGE_TYPES.has("image/webp"));
  assert.ok(ALLOWED_IMAGE_TYPES.has("image/avif"));
  assert.ok(!ALLOWED_IMAGE_TYPES.has("image/svg+xml"));

  const validPng = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
  const validJpg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const validWebp = new Uint8Array([
    0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50,
  ]);
  const fakeScript = new TextEncoder().encode("<script>alert(1)</script>");

  assert.strictEqual(verifyImageMagicBytes(validPng, "image/png"), true);
  assert.strictEqual(verifyImageMagicBytes(validJpg, "image/jpeg"), true);
  assert.strictEqual(verifyImageMagicBytes(validWebp, "image/webp"), true);
  assert.strictEqual(verifyImageMagicBytes(fakeScript, "image/jpeg"), false);
  assert.strictEqual(verifyImageMagicBytes(validJpg, "image/png"), false);
});

test("Analytics allows conversion funnel events and scrubs all customer PII properties", () => {
  const requiredEvents = [
    "quote_cta_click",
    "enquiry_form_start",
    "enquiry_form_submit",
    "enquiry_form_success",
    "enquiry_form_error",
    "whatsapp_click",
    "phone_click",
    "product_enquiry_click",
  ];
  for (const ev of requiredEvents) {
    assert.ok(ALLOWED_EVENT_NAMES.has(ev), `Expected ${ev} in ALLOWED_EVENT_NAMES`);
  }

  const sanitized = sanitizeAnalyticsProperties({
    placement: "product_page",
    categorySlug: "sliding-gates",
    productSlug: "cnc-sliding-gate",
    hasPhoto: true,
    name: "Rajesh Kumar",
    customer_name: "Rajesh Kumar",
    phone: "9876543210",
    mobile: "+919876543210",
    email: "rajesh@example.com",
    message: "Please quote for 12ft gate",
    project_details: "12x7",
    city: "Moradabad",
    location: "Civil Lines",
    address: "123 Street",
  });

  assert.strictEqual(sanitized.placement, "product_page");
  assert.strictEqual(sanitized.categorySlug, "sliding-gates");
  assert.strictEqual(sanitized.productSlug, "cnc-sliding-gate");
  assert.strictEqual(sanitized.hasPhoto, true);
  assert.strictEqual(sanitized.name, undefined);
  assert.strictEqual(sanitized.customer_name, undefined);
  assert.strictEqual(sanitized.phone, undefined);
  assert.strictEqual(sanitized.mobile, undefined);
  assert.strictEqual(sanitized.email, undefined);
  assert.strictEqual(sanitized.message, undefined);
  assert.strictEqual(sanitized.project_details, undefined);
  assert.strictEqual(sanitized.city, undefined);
  assert.strictEqual(sanitized.location, undefined);
  assert.strictEqual(sanitized.address, undefined);
});

console.log(`\nPassed ${passed} lead capture & security checks successfully.\n`);
