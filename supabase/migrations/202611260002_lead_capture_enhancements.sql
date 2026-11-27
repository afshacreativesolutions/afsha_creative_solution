-- Migration: 202611260002_lead_capture_enhancements.sql
-- Description: Additive lead-capture enhancements (city, product_slug, page_url, UTM attribution, private reference photo bucket, expanded lead sources)
-- Safe & Idempotent: Never deletes or overwrites existing customers, leads, products, categories, blog_posts, or CMS rows.

-- 1. ADDITIVE COLUMNS ON PUBLIC.LEADS
alter table public.leads
  add column if not exists city text,
  add column if not exists product_slug text,
  add column if not exists page_url text,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists attachment_path text,
  add column if not exists attachment_name text;

create index if not exists idx_leads_city on public.leads (city);
create index if not exists idx_leads_product_slug on public.leads (product_slug);
create index if not exists idx_leads_status_category_created
  on public.leads (status, category_slug, created_at desc);
create index if not exists idx_leads_created_reference
  on public.leads (customer_id, created_at desc);

-- Expand source check constraint gently while keeping all legacy values valid
alter table public.leads drop constraint if exists leads_source_check;
alter table public.leads add constraint leads_source_check check (
  source in (
    'quote_form',
    'contact_page',
    'homepage',
    'product_page',
    'category_page',
    'gallery_page',
    'mobile_cta',
    'whatsapp_click',
    'phone_call',
    'direct_visit',
    'referral',
    'other'
  )
);

-- 2. PRIVATE STORAGE BUCKET FOR CUSTOMER REFERENCE PHOTO UPLOADS
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'lead-attachments',
  'lead-attachments',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Admins only can read/delete customer reference photos; uploads flow through validated API service role
drop policy if exists "Admins read lead attachments" on storage.objects;
create policy "Admins read lead attachments" on storage.objects
for select to authenticated using (
  bucket_id = 'lead-attachments' and public.is_catalog_admin()
);

drop policy if exists "Admins delete lead attachments" on storage.objects;
create policy "Admins delete lead attachments" on storage.objects
for delete to authenticated using (
  bucket_id = 'lead-attachments' and public.is_catalog_admin()
);
