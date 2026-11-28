// scripts/test-whatsapp-and-og.mjs
// Verification suite for Afsha Creative Solutions WhatsApp Message Builders, URL Encoding,
// Open Graph Asset Resolution, and Analytics Safety

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

const {
  buildGeneralWhatsAppMessage,
  buildProductWhatsAppMessage,
  buildCategoryWhatsAppMessage,
  buildGalleryWhatsAppMessage,
  buildWhatsAppUrl,
  normalizeWhatsAppNumber,
} = loadTsModule("lib/whatsapp.ts");

const { BUSINESS_WHATSAPP_NUMBER } = loadTsModule("lib/site-config.ts");
const { ALLOWED_EVENT_NAMES, sanitizeAnalyticsProperties } = loadTsModule("lib/tracker.ts");
const {
  resolveOgPhotoDataUri,
  getCategoryFallbackAssetPath,
  loadImageBufferForAssetOrRemote,
} = loadTsModule("lib/og-image-loader.ts");
const { validateLeadFields } = loadTsModule("lib/lead-validation.ts");
const { buildAdminNotificationHtml } = loadTsModule("lib/email.ts");

console.log("=================================================");
console.log("  Running Afsha WhatsApp & Rich OG Test Suite");
console.log("=================================================\n");

let passed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(err);
    process.exit(1);
  }
}

await test("buildGeneralWhatsAppMessage() generates clean general enquiry without undefined/null", () => {
  const msg = buildGeneralWhatsAppMessage();
  assert.ok(msg.includes("Hello Afsha Creative Solutions!"));
  assert.ok(msg.includes("metal fabrication services"));
  assert.ok(!msg.includes("undefined"));
  assert.ok(!msg.includes("null"));
});

await test("buildProductWhatsAppMessage() includes product name, canonical URL, and omits missing location", () => {
  const msg = buildProductWhatsAppMessage({
    productName: "Royal Wrought Iron Gate & Pillar Set",
    productUrl: "/products/royal-wrought-iron-gate",
    customerLocation: null,
  });
  assert.ok(msg.includes("Royal Wrought Iron Gate & Pillar Set"));
  assert.ok(msg.includes("https://www.afshacreative.in/products/royal-wrought-iron-gate"));
  assert.ok(!msg.includes("Project location:"));
  assert.ok(!msg.includes("undefined"));
  assert.ok(!msg.includes("null"));

  const withLoc = buildProductWhatsAppMessage({
    productName: "CNC Laser Gate",
    productUrl: "https://afshacreative.in/products/cnc-laser-gate?utm_source=ig",
    customerLocation: "Moradabad, UP",
  });
  assert.ok(withLoc.includes("https://www.afshacreative.in/products/cnc-laser-gate"));
  assert.ok(withLoc.includes("Project location: Moradabad, UP"));
  assert.ok(!withLoc.includes("utm_source"));
});

await test("buildCategoryWhatsAppMessage() includes category name and canonical category URL", () => {
  const msg = buildCategoryWhatsAppMessage({
    categoryName: "Balcony Railings",
    categoryUrl: "/categories/balcony-railings",
  });
  assert.ok(msg.includes("Balcony Railings collection"));
  assert.ok(msg.includes("https://www.afshacreative.in/categories/balcony-railings"));
  assert.ok(!msg.includes("undefined"));
  assert.ok(!msg.includes("null"));
});

await test("buildGalleryWhatsAppMessage() includes project name and canonical URL", () => {
  const msg = buildGalleryWhatsAppMessage({
    projectName: "Duplex Floating Stair Railing",
    projectUrl: "/gallery",
  });
  assert.ok(msg.includes("Duplex Floating Stair Railing project"));
  assert.ok(msg.includes("https://www.afshacreative.in/gallery"));
  assert.ok(!msg.includes("undefined"));
  assert.ok(!msg.includes("null"));
});

await test("buildWhatsAppUrl() encodes special characters (&, ?, #, newlines) and uses settings number", () => {
  const url = buildWhatsAppUrl({
    intent: "product",
    whatsappNumber: "+91 98765-43210",
    productName: "Gate #1 & Grill Set?",
    productUrl: "/products/gate-1-grill-set",
  });
  assert.ok(url.startsWith("https://wa.me/919876543210?text="));
  const encodedQuery = url.split("?text=")[1];
  assert.ok(!encodedQuery.includes("&"), "Raw & must be percent-encoded");
  assert.ok(!encodedQuery.includes("#"), "Raw # must be percent-encoded");
  assert.ok(!encodedQuery.includes(" "), "Raw space must be percent-encoded");

  const decoded = decodeURIComponent(encodedQuery);
  assert.ok(decoded.includes("Gate #1 & Grill Set?"));
  assert.ok(decoded.includes("https://www.afshacreative.in/products/gate-1-grill-set"));

  assert.strictEqual(normalizeWhatsAppNumber(undefined), BUSINESS_WHATSAPP_NUMBER);
  assert.strictEqual(normalizeWhatsAppNumber("9634776691"), "919634776691");
});

await test("Analytics tracks all required WhatsApp and product enquiry events and scrubs PII", () => {
  for (const ev of [
    "whatsapp_click",
    "product_enquiry_click",
    "product_email_quote_click",
    "product_whatsapp_click",
    "product_enquiry_form_start",
    "product_enquiry_form_success",
    "product_enquiry_form_error",
    "gallery_enquiry_click",
    "category_enquiry_click",
  ]) {
    assert.ok(ALLOWED_EVENT_NAMES.has(ev), `Missing ${ev} in ALLOWED_EVENT_NAMES`);
  }

  const safe = sanitizeAnalyticsProperties({
    placement: "product_card",
    channel: "whatsapp",
    productSlug: "modern-gate",
    categorySlug: "gates",
    sourcePage: "/products",
    name: "Secret Customer",
    phone: "+919999999999",
    whatsappNumber: "919634776691",
    customerLocation: "Moradabad",
    enquiryDetails: "Private note",
  });

  assert.strictEqual(safe.productSlug, "modern-gate");
  assert.strictEqual(safe.sourcePage, "/products");
  assert.strictEqual(safe.name, undefined);
  assert.strictEqual(safe.phone, undefined);
  assert.strictEqual(safe.whatsappNumber, undefined);
  assert.strictEqual(safe.customerLocation, undefined);
  assert.strictEqual(safe.enquiryDetails, undefined);
});

await test("resolveOgPhotoDataUri() and loadImageBufferForAssetOrRemote() return valid fallback image when remote is absent", async () => {
  const fallbackPath = getCategoryFallbackAssetPath("gates");
  assert.ok(fs.existsSync(path.join(process.cwd(), "assets", fallbackPath)));

  const dataUri = await resolveOgPhotoDataUri([], "gates");
  assert.ok(typeof dataUri === "string" && dataUri.startsWith("data:image/jpeg;base64,"));

  const bufRes = await loadImageBufferForAssetOrRemote([], "gates");
  assert.ok(bufRes && Buffer.isBuffer(bufRes.buffer) && bufRes.buffer.byteLength > 1000);
  assert.strictEqual(bufRes.mime, "image/jpeg");
});

await test("validateLeadFields() enforces email required and city optional for product_email_quote", () => {
  const missingEmail = validateLeadFields({
    enquiryType: "product_email_quote",
    name: "Tariq Ali",
    phone: "+91 9876543210",
    productSlug: "modern-stainless-steel-gate",
    productName: "Modern stainless steel gate",
  });
  assert.strictEqual(missingEmail.valid, false);
  assert.ok(missingEmail.errors.email);
  assert.strictEqual(missingEmail.errors.city, undefined);

  const validEmailQuote = validateLeadFields({
    enquiryType: "product_email_quote",
    name: "Tariq Ali",
    phone: "+91 9876543210",
    email: "tariq@example.com",
    productSlug: "modern-stainless-steel-gate",
    productName: "Modern stainless steel gate",
    dimensions: "12 ft x 7 ft",
  });
  assert.strictEqual(validEmailQuote.valid, true);
  assert.strictEqual(validEmailQuote.data.enquiryType, "product_email_quote");
  assert.strictEqual(validEmailQuote.data.email, "tariq@example.com");
  assert.strictEqual(validEmailQuote.data.city, "");
});

await test("buildAdminNotificationHtml() renders CID product image, rejects unsafe image schemes, and escapes XSS", () => {
  const html = buildAdminNotificationHtml({
    customerName: "<script>alert(1)</script>Tariq Ali",
    phone: "+91 9876543210",
    email: "tariq@example.com",
    city: "Moradabad",
    referenceNumber: "AF-TEST-01",
    categoryName: "Gates",
    message: "Need custom sizing",
    dimensions: "12x7 ft",
    submittedAt: "28 Nov 2026, 12:30 PM",
    enquiryHeading: "New Product Quote Request (Email)",
    product: {
      name: "Modern Stainless Steel Gate",
      category: "Gates",
      description: "Made to order stainless steel gate.",
      pageUrl: "https://www.afshacreative.in/products/modern-stainless-steel-gate",
      imageSrc: "cid:product-image",
    },
  });

  assert.ok(html.includes('src="cid:product-image"'));
  assert.ok(html.includes("Modern Stainless Steel Gate"));
  assert.ok(html.includes("https://www.afshacreative.in/products/modern-stainless-steel-gate"));
  assert.ok(html.includes("AF-TEST-01"));
  assert.ok(!html.includes("<script>"));

  const unsafeInject = buildAdminNotificationHtml({
    customerName: "User",
    phone: "9876543210",
    referenceNumber: "AF-TEST-02",
    categoryName: "Gates",
    message: "Hello",
    submittedAt: "Now",
    product: {
      name: "Test Gate",
      pageUrl: "javascript:alert(1)",
      imageSrc: "http://evil.example.com/pixel.png",
    },
  });
  assert.ok(!unsafeInject.includes("evil.example.com"));
  assert.ok(!unsafeInject.includes("javascript:"));
});

console.log(`\n=================================================`);
console.log(`  All ${passed} WhatsApp & OG tests passed!`);
console.log(`=================================================\n`);
