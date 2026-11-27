# Lead Generation, Mobile UX & Security Deployment Guide

This guide documents the additive database migration, lead intake protections, admin lead inbox workflow, and post-deployment verification steps for **Afsha Creative Solutions**.

---

## 1. Apply the Additive Lead Migration in Supabase SQL Editor

Before deploying or using photo reference uploads in production, apply the additive SQL migration:

- **File**: [supabase/migrations/202611260002_lead_capture_enhancements.sql](../supabase/migrations/202611260002_lead_capture_enhancements.sql)

### What This Migration Does (Safely & Idempotently)
1. Adds optional columns to `public.leads` (`if not exists`):
   - `city`
   - `product_slug`
   - `page_url`
   - `utm_source`, `utm_medium`, `utm_campaign`
   - `attachment_path`, `attachment_name`
2. Expands `leads_source_check` to include `'contact_page'` alongside `'quote_form'`, `'whatsapp'`, `'phone'`, `'admin_manual'`, `'other'`.
3. Adds performance indexes for city, service category, and product slug queries (`idx_leads_city`, `idx_leads_category_created`, `idx_leads_product_slug`).
4. Creates the **private** Supabase Storage bucket `'lead-attachments'` (`public = false`, 5 MB limit, `image/jpeg`, `image/png`, `image/webp`, `image/avif`) and restricts `storage.objects` reads/deletes in that bucket to `public.is_catalog_admin()`.

### Manual Execution Steps
1. Open your production Supabase Dashboard -> **SQL Editor**.
2. Paste the contents of [202611260002_lead_capture_enhancements.sql](../supabase/migrations/202611260002_lead_capture_enhancements.sql).
3. Click **Run**.
4. Confirm zero errors and verify:
   - `public.leads` includes `city`, `product_slug`, `page_url`, `attachment_path`, `attachment_name`.
   - Storage -> **Buckets** shows `lead-attachments` marked **Private**.

*(Safety guarantee: Does not drop, truncate, or modify existing rows in `products`, `categories`, `blog_posts`, `customers`, `leads`, `cms_*`, or `admin_users`.)*

---

## 2. Environment Variables Required in Production (Vercel)

Ensure the existing environment variables remain set (no new authentication secrets or duplicate Supabase projects needed):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only, used inside `/api/contact` and admin Server Components)
- `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`
- `NEXT_PUBLIC_SITE_URL` (`https://www.afshacreative.in`)

Optional WhatsApp alert webhook env vars (already supported in `/api/contact`):
- `WHATSAPP_NOTIFY_WEBHOOK_URL`
- `WHATSAPP_NOTIFY_WEBHOOK_SECRET`

---

## 3. Architecture Overview

- **Sticky Mobile Bar**: `components/lead/MobileStickyBar.tsx` displays fixed bottom CTAs (**Get Quote**, **Call Now**, **WhatsApp**) exclusively below `md` (`<768px`), hidden on `/admin`, when `EnquiryModal` is open, when mobile nav menu or cookie consent banner is visible, when an embedded `<LeadEnquiryForm />` intersects the viewport, or when a form control has focus. Desktop keeps the single floating WhatsApp button (`hidden md:block`).
- **Reusable Quote Form**: `components/lead/LeadEnquiryForm.tsx` serves Homepage (`#quote-section`), Product detail (`#product-enquiry`), Category detail (`#category-enquiry`), Gallery page (`#gallery-enquiry`), Contact page (`/contact`), and `EnquiryModal`.
- **Lead Intake Endpoint**: `app/api/contact/route.ts` handles both `multipart/form-data` (optional up-to-5 MB reference photo) and `application/json`. Validates fields (`lib/lead-validation.ts`), verifies real image file headers (`lib/image-security.ts`), honors honeypot `website` silently, enforces sliding-window per-IP rate limiting (5/10 min + HTTP `429`), deduplicates 30s double submits via `clientSubmissionId`, uploads attachments privately via service role, creates/links `customers` + `leads` + `audit_logs`, and dispatches team notifications cleanly.
- **Privacy-Safe Analytics**: `lib/tracker.ts` records `quote_cta_click`, `enquiry_form_start`, `enquiry_form_submit`, `enquiry_form_success`, `enquiry_form_error`, `whatsapp_click`, `phone_click`, and `product_enquiry_click`, scrubbing `name`, `phone`, `mobile`, `email`, `message`, `city`, `address`, and `attachment` before sending to GA/GTM/Pixel/first-party API.
- **Admin Lead Inbox**: `/admin/leads` and `/admin/leads/[id]` provide pipeline counts (`Total`, `New`, `Contacted`, `Quoted`, `Converted`), mobile card + desktop table views, filtering by status/service/date/search, signed temporary URLs (`createSignedUrl(..., 600)`) for uploaded photos, attribution display, and one-tap **Call** / **WhatsApp** actions.

---

## 4. Verification Checklist After Production Deploy

1. Run local unit & security suite: `npm run test:leads && npm run test:cms && npm run test:seo && npm run test:intelligence`.
2. Confirm `/admin/leads` requires authentication (redirects unauthenticated requests to `/admin/login`).
3. Confirm `anon` key cannot `SELECT` from `public.leads` or read files from `lead-attachments`.
4. Submit a test lead with a reference photo on mobile (`360px` viewport), verify email notification arrives, and verify the signed photo thumbnail + one-tap Call/WhatsApp links appear inside `/admin/leads/[id]`.
5. Delete the test lead row cleanly from Admin UI or Supabase Studio once verified.
