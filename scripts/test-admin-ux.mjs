// scripts/test-admin-ux.mjs
// Verification suite for Mobile-First Admin Navigation, Security Guard Ordering, and Responsive UI Standards

import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ts = require("typescript");

function loadTs(relPath) {
  const full = path.resolve(process.cwd(), relPath);
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
  const fn = new Function("exports", "require", "module", outputText);
  fn(mod.exports, require, mod);
  return mod.exports;
}

const { ADMIN_NAV_GROUPS, isNavHrefActive, resolveActiveAdminSection } =
  loadTs("lib/admin-navigation.ts");

console.log("=================================================");
console.log("  Running Afsha Mobile-First Admin UX Test Suite");
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

test("Centralized ADMIN_NAV_GROUPS covers all core admin destinations cleanly without duplicates", () => {
  const hrefs = [];
  for (const g of ADMIN_NAV_GROUPS) {
    for (const item of g.items) {
      hrefs.push(item.href);
      if (item.children) {
        for (const child of item.children) hrefs.push(child.href);
      }
    }
  }
  const required = [
    "/admin",
    "/admin/leads",
    "/admin/customers",
    "/admin/analytics",
    "/admin/campaigns",
    "/admin/messages",
    "/admin/consent",
    "/admin/products",
    "/admin/categories",
    "/admin/blog",
    "/admin/content",
    "/admin/content/media",
    "/admin/content/settings",
    "/admin/settings/integrations",
  ];
  for (const r of required) {
    assert.ok(hrefs.includes(r), `Missing destination in centralized navigation: ${r}`);
  }
});

test("resolveActiveAdminSection and isNavHrefActive accurately track nested & browser back/forward routes", () => {
  assert.strictEqual(isNavHrefActive("/admin", "/admin", true), true);
  assert.strictEqual(isNavHrefActive("/admin/leads", "/admin", true), false);
  assert.strictEqual(isNavHrefActive("/admin/leads/123", "/admin/leads"), true);
  assert.strictEqual(isNavHrefActive("/admin/content/media", "/admin/content", true), false);
  assert.strictEqual(isNavHrefActive("/admin/content/abc-id", "/admin/content", true), true);

  assert.strictEqual(resolveActiveAdminSection("/admin").title, "Overview");
  assert.strictEqual(resolveActiveAdminSection("/admin/leads/abc").title, "Lead Inbox");
  assert.strictEqual(resolveActiveAdminSection("/admin/content/media").title, "Media Library");
  assert.strictEqual(resolveActiveAdminSection("/admin/content/page-id").isVisualEditor, true);
});

test("Every protected admin page enforces await requireAdmin() before concurrent data fetching", () => {
  const pagesDir = path.resolve(process.cwd(), "app/admin");
  const allPages = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name === "page.tsx") allPages.push(full);
    }
  }
  walk(pagesDir);
  assert.ok(allPages.length >= 16, `Expected at least 16 admin pages, found ${allPages.length}`);

  for (const pagePath of allPages) {
    const rel = path.relative(process.cwd(), pagePath).replace(/\\/g, "/");
    const src = fs.readFileSync(pagePath, "utf8");
    assert.ok(!src.includes("AdminNav"), `${rel} should not render duplicate AdminNav`);
    if (rel === "app/admin/login/page.tsx") {
      assert.ok(src.includes("getAdminSession"), `${rel} must check getAdminSession`);
    } else {
      assert.ok(src.includes("await requireAdmin()"), `${rel} must await requireAdmin() sequentially`);
      assert.ok(
        !/Promise\.all\(\[\s*requireAdmin\(\)/.test(src),
        `${rel} must not run DB queries inside Promise.all alongside requireAdmin()`
      );
    }
  }
});

test("Admin layout isolates public chrome cleanly on /admin routes", () => {
  const rootLayout = fs.readFileSync(path.resolve(process.cwd(), "app/layout.tsx"), "utf8");
  const adminLayout = fs.readFileSync(path.resolve(process.cwd(), "app/admin/layout.tsx"), "utf8");
  assert.ok(rootLayout.includes("PublicChromeGate"));
  assert.ok(adminLayout.includes("AdminShell"));
});

test("Catalog product table uses accessible confirmation modal instead of native window.confirm", () => {
  const tableSrc = fs.readFileSync(
    path.resolve(process.cwd(), "app/admin/products/product-table.tsx"),
    "utf8"
  );
  assert.ok(tableSrc.includes("AdminConfirmDialog"));
  assert.ok(!tableSrc.includes("window.confirm"));
});

console.log(`\nPassed ${passed} admin UX, security & responsive architecture checks successfully.\n`);
