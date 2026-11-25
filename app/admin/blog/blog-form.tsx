"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ImagePlus, UploadCloud } from "lucide-react";
import { saveBlogPost } from "../actions";
import { SubmitButton } from "../submit-button";
import { slugify } from "@/lib/slug";
import type { BlogPostRecord } from "@/lib/catalog-types";

function inputClass() {
  return "mt-2 w-full border border-white/12 bg-[#080808] px-3 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-textGold/60";
}
function fieldClass() {
  return "block text-[10px] uppercase tracking-[0.15em] text-white/55";
}

export default function BlogForm({ post, saved }: { post?: BlogPostRecord; saved?: boolean }) {
  const [featuredImage, setFeaturedImage] = useState(post?.featured_image ?? "");
  const [featuredImageUrl, setFeaturedImageUrl] = useState(post?.featured_image?.startsWith("http") ? post.featured_image : "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [isSlugManual, setIsSlugManual] = useState(Boolean(post?.slug));

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setTitle(val);
    if (!isSlugManual) {
      setSlug(slugify(val));
    }
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setIsSlugManual(true);
    setSlug(slugify(e.target.value));
  }

  async function uploadFile(file: File) {
    setUploading(true);
    setUploadError("");
    const body = new FormData();
    body.set("file", file);
    body.set("bucket", "blog-images");
    try {
      const response = await fetch("/api/admin/upload", { method: "POST", body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Image upload failed.");
      setFeaturedImage(result.storage_path);
      setFeaturedImageUrl(result.url);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={saveBlogPost} className="space-y-8">
      <input type="hidden" name="id" value={post?.id ?? ""} />
      <input type="hidden" name="featured_image" value={featuredImage} />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/admin/blog" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-white/50 hover:text-white"><ArrowLeft size={14} /> Articles</Link>
        <div className="flex items-center gap-3">
          {saved && <span role="status" className="text-xs text-emerald-300">Changes saved</span>}
          <SubmitButton
            type="submit"
            disabled={uploading}
            loadingText="Saving article..."
            className="border border-textGold/60 bg-textGold px-5 py-3 text-[10px] uppercase tracking-[0.16em] text-black transition-colors hover:bg-transparent hover:text-textGold disabled:cursor-not-allowed disabled:opacity-40"
          >
            Save article
          </SubmitButton>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <section className="grid gap-5 border border-white/10 bg-[#080808] p-5 sm:grid-cols-2 sm:p-7">
            <h2 className="col-span-full text-lg font-light">Article details</h2>
            <label className={fieldClass()}>Title *
              <input
                name="title"
                required
                value={title}
                onChange={handleTitleChange}
                className={inputClass()}
                placeholder="How to Choose the Perfect Modern Main Gate"
              />
            </label>
            <label className={fieldClass()}>
              <div className="flex items-center justify-between">
                <span>URL slug *</span>
                {isSlugManual && (
                  <button
                    type="button"
                    onClick={() => {
                      setSlug(slugify(title));
                      setIsSlugManual(false);
                    }}
                    className="text-[9px] font-normal lowercase tracking-normal text-textGold hover:underline"
                  >
                    Auto-sync from title
                  </button>
                )}
              </div>
              <input
                name="slug"
                required
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                value={slug}
                onChange={handleSlugChange}
                className={inputClass()}
                placeholder="how-to-choose-the-perfect-modern-main-gate"
              />
            </label>
            <label className={`${fieldClass()} sm:col-span-2`}>Excerpt
              <textarea name="excerpt" rows={2} defaultValue={post?.excerpt ?? ""} className={inputClass()} />
            </label>
            <label className={`${fieldClass()} sm:col-span-2`}>Content *
              <textarea name="content" required rows={12} defaultValue={post?.content} className={inputClass()} placeholder="Write the article content. Separate paragraphs with a blank line." />
            </label>
          </section>

          <section className="grid gap-5 border border-white/10 bg-[#080808] p-5 sm:grid-cols-2 sm:p-7">
            <h2 className="col-span-full text-lg font-light">Search metadata</h2>
            <label className={fieldClass()}>SEO title
              <input name="seo_title" defaultValue={post?.seo_title ?? ""} maxLength={70} className={inputClass()} />
            </label>
            <label className={fieldClass()}>SEO description
              <textarea name="seo_description" rows={2} defaultValue={post?.seo_description ?? ""} maxLength={170} className={inputClass()} />
            </label>
            <label className={fieldClass()}>Focus keyword
              <input name="focus_keyword" defaultValue={post?.focus_keyword ?? ""} className={inputClass()} />
            </label>
            <label className={fieldClass()}>Canonical URL
              <input name="canonical_url" defaultValue={post?.canonical_url ?? ""} className={inputClass()} placeholder="/blog/article-slug" />
            </label>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="border border-white/10 bg-[#080808] p-5 sm:p-6">
            <h2 className="mb-5 text-lg font-light">Publishing</h2>
            <label className={fieldClass()}>Status
              <select name="status" defaultValue={post?.status ?? "draft"} className={inputClass()}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
            <label className={`${fieldClass()} mt-4 block`}>Published date
              <input name="published_at" type="datetime-local" defaultValue={post?.published_at ? new Date(post.published_at).toISOString().slice(0, 16) : ""} className={inputClass()} />
            </label>
          </section>

          <section className="border border-white/10 bg-[#080808] p-5 sm:p-6">
            <h2 className="mb-4 text-lg font-light">Featured image</h2>
            <label className="flex cursor-pointer items-center justify-center gap-3 border border-dashed border-white/20 px-4 py-5 text-[10px] uppercase tracking-[0.13em] text-white/55 transition-colors hover:border-textGold/60 hover:text-textGold">
              {uploading ? <UploadCloud size={16} className="animate-pulse" /> : <ImagePlus size={16} />}
              {uploading ? "Uploading..." : "Choose image"}
              <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={uploading} className="sr-only" onChange={(event) => { const file = event.currentTarget.files?.[0]; if (file) void uploadFile(file); event.currentTarget.value = ""; }} />
            </label>
            {uploadError && <p role="alert" className="mt-3 text-xs text-red-300">{uploadError}</p>}
            {featuredImageUrl && (
              <div className="mt-4 relative aspect-video overflow-hidden bg-[#111]">
                <Image src={featuredImageUrl} alt="" fill unoptimized sizes="320px" className="object-cover" />
              </div>
            )}
            <label className={`${fieldClass()} mt-4 block`}>Featured image path or URL
              <input value={featuredImage} onChange={(event) => setFeaturedImage(event.target.value)} className={inputClass()} />
            </label>
            <label className={`${fieldClass()} mt-4 block`}>Featured image alt text
              <input name="image_alt" defaultValue={post?.image_alt ?? ""} className={inputClass()} />
            </label>
          </section>
        </aside>
      </div>
      <div className="flex justify-end border-t border-white/10 pt-5">
        <SubmitButton
          type="submit"
          disabled={uploading}
          loadingText="Saving article..."
          className="border border-textGold/60 bg-textGold px-6 py-3 text-[10px] uppercase tracking-[0.16em] text-black transition-colors hover:bg-transparent hover:text-textGold disabled:cursor-not-allowed disabled:opacity-40"
        >
          Save article
        </SubmitButton>
      </div>
    </form>
  );
}