# Afsha Creative Solutions — Database CMS & Visual Page Manager Guide

## 1. Applying the Database Migration Safely

The CMS schema lives in [`supabase/migrations/202611260001_cms_and_media.sql`](../supabase/migrations/202611260001_cms_and_media.sql).

### Tables & Storage Created
- `public.cms_pages`: Published page registry, URL slugs, SEO metadata, structured data JSON-LD, and status (`draft` / `published`).
- `public.cms_page_drafts`: Admin-only metadata staging buffer so draft metadata edits never affect public pages until published.
- `public.cms_sections`: Ordered sections (`draft` and `published` states isolated by `publication_state`) with JSONB content validated in application code.
- `public.cms_media`: Metadata index (file name, Supabase Storage path, dimensions, MIME type, alt text) paired with a public-read, admin-write `cms-media` Storage bucket (WebP, JPEG, PNG, AVIF up to 8 MB).
- `public.cms_revisions`: Snapshots captured on publish, seed, draft checkpoints, and restores.
- `public.cms_site_settings` & `public.cms_site_setting_drafts`: Global brand identity, phone/WhatsApp settings, navigation links, Mega Menu showcases, footer, SEO defaults, and template labels for dynamic catalog/blog routes.

### Safe Rollout Steps (Zero Downtime)
1. Open your **Supabase Dashboard -> SQL Editor**.
2. Paste the full contents of `supabase/migrations/202611260001_cms_and_media.sql` and run it.
   - Public routes automatically fall back to built-in seed content cleanly if CMS tables are not yet applied or contain zero rows.
   - All CMS mutations require authentication in `public.admin_users` (`public.is_catalog_admin()`).
3. Seed existing website copy, SEO metadata, and initial media into Supabase using either:
   - **CLI (idempotent):**
     ```bash
     npm run seed:cms
     ```
     (Use `npm run seed:cms -- --overwrite` only if you want to reset customized CMS pages back to default blueprints.)
   - **Admin UI:** Sign in to `/admin`, click **Website Content**, and click **Import Default Website Content**.

## 2. Managing Content in Admin (`/admin/content`)

- **Pages Dashboard (`/admin/content`)**: Search pages, filter by status (`published`, `draft`, or pending draft edits), create custom routes (e.g. `/custom-promo` or `/locations/city-name`), preview drafts, publish/unpublish, or safely delete non-home pages.
- **Visual Page Editor (`/admin/content/[id]`)**:
  - **Left Sidebar**: Reorder sections up/down, duplicate sections, toggle section visibility (`is_visible`), delete with confirmation, or add from all 14 supported section types.
  - **Center Area**: Structured visual form controls tailored to the selected section type (cards, steps, FAQs, image picker, button URLs, safe formatted rich text).
  - **Right Pane**: Real-time **Desktop** and **Mobile** preview reflecting unsaved edits before saving or publishing.
  - **Top Bar**: **Save Draft**, **Preview Site** (Next.js Draft Mode behind admin session verification), **Page & SEO** (with Google search preview), **Revision History** (1-click restore to draft), and **Publish** (immediately expires cache tags via Next.js 16 `updateTag` / `revalidateTag` without redeploying).
- **Media Library (`/admin/content/media`)**: Upload WebP/JPEG/PNG/AVIF images up to 8 MB (verified via magic bytes & dimension parser), edit alt text inline, replace underlying files while preserving links, and safely block deletion if an image is referenced in any published page, draft, site setting, or blog post.
- **Site Settings (`/admin/content/settings`)**: Manage business contact details, floating WhatsApp toggle & default message, header desktop/mobile menus, mega menu cards/photos, footer columns, global SEO defaults, and template labels for `/categories/[slug]`, `/products/[slug]`, and `/blog/[slug]`.
