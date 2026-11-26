-- Migration: 202611260001_cms_and_media.sql
-- Description: Complete database-driven CMS, Visual Page Manager, Media Library, Revisions, and Site Settings

create extension if not exists pgcrypto;

-- 1. CMS PAGES (Published metadata & status)
create table if not exists public.cms_pages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique check (
    slug = '/' or slug ~ '^/[a-z0-9]+(?:[/-][a-z0-9]+)*$'
  ),
  page_type text not null default 'custom' check (
    page_type in ('home', 'standard', 'landing', 'catalog', 'location', 'blog_index', 'contact', 'custom')
  ),
  meta_title text,
  meta_description text,
  meta_keywords text[] not null default '{}',
  canonical_url text,
  og_image text,
  og_image_alt text,
  structured_data jsonb,
  status text not null default 'draft' check (status in ('draft', 'published')),
  has_unpublished_changes boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cms_pages_status_slug_idx
  on public.cms_pages (status, slug);
create index if not exists cms_pages_page_type_idx
  on public.cms_pages (page_type);
create index if not exists cms_pages_updated_at_idx
  on public.cms_pages (updated_at desc);

-- 2. CMS PAGE DRAFTS (Admin-only draft metadata buffer so live published pages stay unaffected until Publish)
create table if not exists public.cms_page_drafts (
  page_id uuid primary key references public.cms_pages(id) on delete cascade,
  title text not null,
  slug text not null check (
    slug = '/' or slug ~ '^/[a-z0-9]+(?:[/-][a-z0-9]+)*$'
  ),
  page_type text not null default 'custom' check (
    page_type in ('home', 'standard', 'landing', 'catalog', 'location', 'blog_index', 'contact', 'custom')
  ),
  meta_title text,
  meta_description text,
  meta_keywords text[] not null default '{}',
  canonical_url text,
  og_image text,
  og_image_alt text,
  structured_data jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

-- 3. CMS SECTIONS (Draft & Published section records per page)
create table if not exists public.cms_sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.cms_pages(id) on delete cascade,
  publication_state text not null default 'draft' check (publication_state in ('draft', 'published')),
  section_key text not null,
  section_type text not null check (
    section_type in (
      'hero_banner',
      'image_text',
      'card_grid',
      'services_grid',
      'product_category_grid',
      'gallery',
      'testimonials',
      'stats_counters',
      'features',
      'cta_banner',
      'faq',
      'rich_text',
      'contact_info',
      'logo_strip'
    )
  ),
  title text not null default '',
  content jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cms_sections_page_state_key_uniq unique (page_id, publication_state, section_key)
);

create index if not exists cms_sections_page_state_order_idx
  on public.cms_sections (page_id, publication_state, sort_order);
create index if not exists cms_sections_type_idx
  on public.cms_sections (section_type);

-- 4. CMS MEDIA LIBRARY
create table if not exists public.cms_media (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  storage_bucket text not null default 'cms-media',
  storage_path text not null unique,
  public_url text not null,
  alt_text text not null default '',
  mime_type text not null check (
    mime_type in ('image/jpeg', 'image/png', 'image/webp', 'image/avif')
  ),
  file_size integer not null check (file_size > 0 and file_size <= 8388608),
  width integer,
  height integer,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cms_media_created_at_idx
  on public.cms_media (created_at desc);
create index if not exists cms_media_file_name_idx
  on public.cms_media (file_name);

-- 5. CMS REVISIONS (Audit & rollback snapshots)
create table if not exists public.cms_revisions (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.cms_pages(id) on delete cascade,
  revision_type text not null default 'publish' check (
    revision_type in ('draft', 'publish', 'restore', 'seed')
  ),
  revision_data jsonb not null,
  note text,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

create index if not exists cms_revisions_page_created_idx
  on public.cms_revisions (page_id, created_at desc);

-- 6. CMS SITE SETTINGS (Global header, mega menu, footer, contact, SEO defaults)
create table if not exists public.cms_site_settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text not null unique,
  setting_value jsonb not null default '{}'::jsonb,
  is_published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.cms_site_setting_drafts (
  setting_key text primary key references public.cms_site_settings(setting_key) on delete cascade,
  draft_value jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

-- 7. UPDATED_AT TRIGGERS
drop trigger if exists cms_pages_set_updated_at on public.cms_pages;
create trigger cms_pages_set_updated_at before update on public.cms_pages
for each row execute function public.set_updated_at();

drop trigger if exists cms_page_drafts_set_updated_at on public.cms_page_drafts;
create trigger cms_page_drafts_set_updated_at before update on public.cms_page_drafts
for each row execute function public.set_updated_at();

drop trigger if exists cms_sections_set_updated_at on public.cms_sections;
create trigger cms_sections_set_updated_at before update on public.cms_sections
for each row execute function public.set_updated_at();

drop trigger if exists cms_media_set_updated_at on public.cms_media;
create trigger cms_media_set_updated_at before update on public.cms_media
for each row execute function public.set_updated_at();

drop trigger if exists cms_site_settings_set_updated_at on public.cms_site_settings;
create trigger cms_site_settings_set_updated_at before update on public.cms_site_settings
for each row execute function public.set_updated_at();

drop trigger if exists cms_site_setting_drafts_set_updated_at on public.cms_site_setting_drafts;
create trigger cms_site_setting_drafts_set_updated_at before update on public.cms_site_setting_drafts
for each row execute function public.set_updated_at();

-- 8. ROW LEVEL SECURITY (RLS)
alter table public.cms_pages enable row level security;
alter table public.cms_page_drafts enable row level security;
alter table public.cms_sections enable row level security;
alter table public.cms_media enable row level security;
alter table public.cms_revisions enable row level security;
alter table public.cms_site_settings enable row level security;
alter table public.cms_site_setting_drafts enable row level security;

-- cms_pages policies
drop policy if exists "Public can read published cms pages" on public.cms_pages;
create policy "Public can read published cms pages" on public.cms_pages
for select to anon, authenticated using (
  status = 'published' or public.is_catalog_admin()
);

drop policy if exists "Admins manage cms pages" on public.cms_pages;
create policy "Admins manage cms pages" on public.cms_pages
for all to authenticated
using (public.is_catalog_admin())
with check (public.is_catalog_admin());

-- cms_page_drafts policies (admins only)
drop policy if exists "Admins manage cms page drafts" on public.cms_page_drafts;
create policy "Admins manage cms page drafts" on public.cms_page_drafts
for all to authenticated
using (public.is_catalog_admin())
with check (public.is_catalog_admin());

-- cms_sections policies
drop policy if exists "Public can read visible published cms sections" on public.cms_sections;
create policy "Public can read visible published cms sections" on public.cms_sections
for select to anon, authenticated using (
  public.is_catalog_admin() or (
    publication_state = 'published'
    and is_visible = true
    and exists (
      select 1 from public.cms_pages p
      where p.id = page_id and p.status = 'published'
    )
  )
);

drop policy if exists "Admins manage cms sections" on public.cms_sections;
create policy "Admins manage cms sections" on public.cms_sections
for all to authenticated
using (public.is_catalog_admin())
with check (public.is_catalog_admin());

-- cms_media policies (admins only on table; public read is via Storage bucket URLs)
drop policy if exists "Admins manage cms media" on public.cms_media;
create policy "Admins manage cms media" on public.cms_media
for all to authenticated
using (public.is_catalog_admin())
with check (public.is_catalog_admin());

-- cms_revisions policies (admins only)
drop policy if exists "Admins manage cms revisions" on public.cms_revisions;
create policy "Admins manage cms revisions" on public.cms_revisions
for all to authenticated
using (public.is_catalog_admin())
with check (public.is_catalog_admin());

-- cms_site_settings policies
drop policy if exists "Public can read published cms site settings" on public.cms_site_settings;
create policy "Public can read published cms site settings" on public.cms_site_settings
for select to anon, authenticated using (
  is_published = true or public.is_catalog_admin()
);

drop policy if exists "Admins manage cms site settings" on public.cms_site_settings;
create policy "Admins manage cms site settings" on public.cms_site_settings
for all to authenticated
using (public.is_catalog_admin())
with check (public.is_catalog_admin());

-- cms_site_setting_drafts policies (admins only)
drop policy if exists "Admins manage cms site setting drafts" on public.cms_site_setting_drafts;
create policy "Admins manage cms site setting drafts" on public.cms_site_setting_drafts
for all to authenticated
using (public.is_catalog_admin())
with check (public.is_catalog_admin());

-- 9. TABLE GRANTS
grant select on public.cms_pages, public.cms_sections, public.cms_site_settings to anon;
grant select, insert, update, delete on public.cms_pages, public.cms_page_drafts, public.cms_sections, public.cms_media, public.cms_revisions, public.cms_site_settings, public.cms_site_setting_drafts to authenticated;
grant all on public.cms_pages, public.cms_page_drafts, public.cms_sections, public.cms_media, public.cms_revisions, public.cms_site_settings, public.cms_site_setting_drafts to service_role;
grant select on public.admin_users to service_role;

-- 10. STORAGE BUCKET FOR CMS MEDIA
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cms-media', 'cms-media', true, 8388608, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read cms media objects" on storage.objects;
create policy "Public can read cms media objects" on storage.objects
for select to anon, authenticated using (bucket_id = 'cms-media');

drop policy if exists "Admins upload cms media objects" on storage.objects;
create policy "Admins upload cms media objects" on storage.objects
for insert to authenticated with check (
  bucket_id = 'cms-media' and public.is_catalog_admin()
);

drop policy if exists "Admins update cms media objects" on storage.objects;
create policy "Admins update cms media objects" on storage.objects
for update to authenticated using (
  bucket_id = 'cms-media' and public.is_catalog_admin()
) with check (
  bucket_id = 'cms-media' and public.is_catalog_admin()
);

drop policy if exists "Admins delete cms media objects" on storage.objects;
create policy "Admins delete cms media objects" on storage.objects
for delete to authenticated using (
  bucket_id = 'cms-media' and public.is_catalog_admin()
);

-- 11. ATOMIC WORKFLOW RPCS
create or replace function public.save_cms_page_draft(
  p_page_id uuid,
  p_meta jsonb,
  p_sections jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_page public.cms_pages%rowtype;
begin
  if not public.is_catalog_admin() then
    raise exception 'Administrator access required';
  end if;

  v_user_id := auth.uid();

  select * into v_page from public.cms_pages where id = p_page_id;
  if not found then
    raise exception 'CMS page not found';
  end if;

  insert into public.cms_page_drafts (
    page_id,
    title,
    slug,
    page_type,
    meta_title,
    meta_description,
    meta_keywords,
    canonical_url,
    og_image,
    og_image_alt,
    structured_data,
    updated_by
  )
  values (
    p_page_id,
    coalesce(nullif(trim(p_meta->>'title'), ''), v_page.title),
    coalesce(nullif(trim(p_meta->>'slug'), ''), v_page.slug),
    coalesce(nullif(trim(p_meta->>'page_type'), ''), v_page.page_type),
    nullif(trim(coalesce(p_meta->>'meta_title', '')), ''),
    nullif(trim(coalesce(p_meta->>'meta_description', '')), ''),
    coalesce(
      (select array_agg(elem::text) from jsonb_array_elements_text(coalesce(p_meta->'meta_keywords', '[]'::jsonb)) as elem),
      '{}'::text[]
    ),
    nullif(trim(coalesce(p_meta->>'canonical_url', '')), ''),
    nullif(trim(coalesce(p_meta->>'og_image', '')), ''),
    nullif(trim(coalesce(p_meta->>'og_image_alt', '')), ''),
    case when p_meta ? 'structured_data' and jsonb_typeof(p_meta->'structured_data') in ('object', 'array') then p_meta->'structured_data' else null end,
    v_user_id
  )
  on conflict (page_id) do update set
    title = excluded.title,
    slug = excluded.slug,
    page_type = excluded.page_type,
    meta_title = excluded.meta_title,
    meta_description = excluded.meta_description,
    meta_keywords = excluded.meta_keywords,
    canonical_url = excluded.canonical_url,
    og_image = excluded.og_image,
    og_image_alt = excluded.og_image_alt,
    structured_data = excluded.structured_data,
    updated_by = v_user_id,
    updated_at = now();

  delete from public.cms_sections
  where page_id = p_page_id and publication_state = 'draft';

  insert into public.cms_sections (
    page_id,
    publication_state,
    section_key,
    section_type,
    title,
    content,
    sort_order,
    is_visible
  )
  select
    p_page_id,
    'draft',
    item.section_key,
    item.section_type,
    coalesce(item.title, ''),
    coalesce(item.content, '{}'::jsonb),
    coalesce(item.sort_order, 0),
    coalesce(item.is_visible, true)
  from jsonb_to_recordset(coalesce(p_sections, '[]'::jsonb)) as item(
    section_key text,
    section_type text,
    title text,
    content jsonb,
    sort_order integer,
    is_visible boolean
  );

  update public.cms_pages
  set has_unpublished_changes = true,
      updated_at = now()
  where id = p_page_id;
end;
$$;

revoke all on function public.save_cms_page_draft(uuid, jsonb, jsonb) from public;
grant execute on function public.save_cms_page_draft(uuid, jsonb, jsonb) to authenticated;

create or replace function public.publish_cms_page(
  p_page_id uuid,
  p_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_page public.cms_pages%rowtype;
  v_draft public.cms_page_drafts%rowtype;
  v_sections jsonb;
  v_snapshot jsonb;
begin
  if not public.is_catalog_admin() then
    raise exception 'Administrator access required';
  end if;

  v_user_id := auth.uid();

  select * into v_page from public.cms_pages where id = p_page_id;
  if not found then
    raise exception 'CMS page not found';
  end if;

  select * into v_draft from public.cms_page_drafts where page_id = p_page_id;

  if found then
    update public.cms_pages
    set title = v_draft.title,
        slug = v_draft.slug,
        page_type = v_draft.page_type,
        meta_title = v_draft.meta_title,
        meta_description = v_draft.meta_description,
        meta_keywords = v_draft.meta_keywords,
        canonical_url = v_draft.canonical_url,
        og_image = v_draft.og_image,
        og_image_alt = v_draft.og_image_alt,
        structured_data = v_draft.structured_data,
        status = 'published',
        has_unpublished_changes = false,
        published_at = now(),
        updated_at = now()
    where id = p_page_id
    returning * into v_page;
  else
    update public.cms_pages
    set status = 'published',
        has_unpublished_changes = false,
        published_at = now(),
        updated_at = now()
    where id = p_page_id
    returning * into v_page;
  end if;

  delete from public.cms_sections
  where page_id = p_page_id and publication_state = 'published';

  insert into public.cms_sections (
    page_id,
    publication_state,
    section_key,
    section_type,
    title,
    content,
    sort_order,
    is_visible
  )
  select
    page_id,
    'published',
    section_key,
    section_type,
    title,
    content,
    sort_order,
    is_visible
  from public.cms_sections
  where page_id = p_page_id and publication_state = 'draft'
  order by sort_order asc;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'section_key', s.section_key,
        'section_type', s.section_type,
        'title', s.title,
        'content', s.content,
        'sort_order', s.sort_order,
        'is_visible', s.is_visible
      )
      order by s.sort_order asc
    ),
    '[]'::jsonb
  )
  into v_sections
  from public.cms_sections s
  where s.page_id = p_page_id and s.publication_state = 'published';

  v_snapshot := jsonb_build_object(
    'id', v_page.id,
    'title', v_page.title,
    'slug', v_page.slug,
    'page_type', v_page.page_type,
    'meta_title', v_page.meta_title,
    'meta_description', v_page.meta_description,
    'meta_keywords', v_page.meta_keywords,
    'canonical_url', v_page.canonical_url,
    'og_image', v_page.og_image,
    'og_image_alt', v_page.og_image_alt,
    'structured_data', v_page.structured_data,
    'sections', v_sections
  );

  insert into public.cms_revisions (page_id, revision_type, revision_data, note, created_by)
  values (p_page_id, 'publish', v_snapshot, p_note, v_user_id);

  return v_snapshot;
end;
$$;

revoke all on function public.publish_cms_page(uuid, text) from public;
grant execute on function public.publish_cms_page(uuid, text) to authenticated;

create or replace function public.unpublish_cms_page(p_page_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_catalog_admin() then
    raise exception 'Administrator access required';
  end if;

  update public.cms_pages
  set status = 'draft',
      has_unpublished_changes = true,
      updated_at = now()
  where id = p_page_id;

  delete from public.cms_sections
  where page_id = p_page_id and publication_state = 'published';
end;
$$;

revoke all on function public.unpublish_cms_page(uuid) from public;
grant execute on function public.unpublish_cms_page(uuid) to authenticated;

create or replace function public.is_cms_media_referenced(p_storage_path text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_refs jsonb := '[]'::jsonb;
  v_rec record;
begin
  if not public.is_catalog_admin() then
    raise exception 'Administrator access required';
  end if;

  -- Check CMS pages (published & draft OG images)
  for v_rec in
    select p.title, p.slug, 'page_og_image' as ref_type
    from public.cms_pages p
    where strpos(coalesce(p.og_image, ''), p_storage_path) > 0
    union
    select d.title, d.slug, 'draft_page_og_image' as ref_type
    from public.cms_page_drafts d
    where strpos(coalesce(d.og_image, ''), p_storage_path) > 0
  loop
    v_refs := v_refs || jsonb_build_array(jsonb_build_object(
      'type', v_rec.ref_type,
      'title', v_rec.title,
      'slug', v_rec.slug
    ));
  end loop;

  -- Check CMS sections (draft and published)
  for v_rec in
    select distinct p.title, p.slug, s.publication_state, s.section_key
    from public.cms_sections s
    join public.cms_pages p on p.id = s.page_id
    where strpos(s.content::text, p_storage_path) > 0
  loop
    v_refs := v_refs || jsonb_build_array(jsonb_build_object(
      'type', 'section_' || v_rec.publication_state,
      'title', v_rec.title,
      'slug', v_rec.slug,
      'section', v_rec.section_key
    ));
  end loop;

  -- Check CMS site settings (published and draft)
  for v_rec in
    select setting_key, 'site_setting' as ref_type
    from public.cms_site_settings
    where strpos(setting_value::text, p_storage_path) > 0
    union
    select setting_key, 'site_setting_draft' as ref_type
    from public.cms_site_setting_drafts
    where strpos(draft_value::text, p_storage_path) > 0
  loop
    v_refs := v_refs || jsonb_build_array(jsonb_build_object(
      'type', v_rec.ref_type,
      'title', v_rec.setting_key
    ));
  end loop;

  -- Check blog posts
  for v_rec in
    select title, slug from public.blog_posts
    where strpos(coalesce(featured_image, ''), p_storage_path) > 0
  loop
    v_refs := v_refs || jsonb_build_array(jsonb_build_object(
      'type', 'blog_post',
      'title', v_rec.title,
      'slug', v_rec.slug
    ));
  end loop;

  return v_refs;
end;
$$;

revoke all on function public.is_cms_media_referenced(text) from public;
grant execute on function public.is_cms_media_referenced(text) to authenticated;
