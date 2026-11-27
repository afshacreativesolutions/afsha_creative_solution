"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ImagePlus, UploadCloud } from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import AdminFormActions from "@/components/admin/AdminFormActions";
import {
  ADMIN_BTN_PRIMARY,
  ADMIN_BTN_SECONDARY,
  ADMIN_INPUT_CLASS,
  ADMIN_LABEL_CLASS,
  ADMIN_SELECT_CLASS,
  ADMIN_TEXTAREA_CLASS,
} from "@/components/admin/admin-styles";
import type { BlogPostRecord } from "@/lib/catalog-types";
import { slugify } from "@/lib/slug";
import { saveBlogPost } from "../actions";
import { SubmitButton } from "../submit-button";

export default function BlogForm({ post, saved }: { post?: BlogPostRecord; saved?: boolean }) {
  const [featuredImage, setFeaturedImage] = useState(post?.featured_image ?? "");
  const [featuredImageUrl, setFeaturedImageUrl] = useState(
    post?.featured_image?.startsWith("http") ? post.featured_image : ""
  );
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
    <form action={saveBlogPost} className="space-y-6">
      <input type="hidden" name="id" value={post?.id ?? ""} />
      <input type="hidden" name="featured_image" value={featuredImage} />

      <AdminFormActions
        status={
          saved ? (
            <span role="status" className="font-medium text-emerald-300">
              Changes saved cleanly.
            </span>
          ) : uploading ? (
            <span className="text-textGold">Uploading cover photo...</span>
          ) : (
            <span>Required fields are marked (*).</span>
          )
        }
      >
        <Link href="/admin/blog" prefetch={false} className={`${ADMIN_BTN_SECONDARY} w-full sm:w-auto`}>
          <ArrowLeft size={14} />
          <span>Back to Articles</span>
        </Link>
        <SubmitButton
          type="submit"
          disabled={uploading}
          loadingText="Saving article..."
          className={`${ADMIN_BTN_PRIMARY} w-full sm:w-auto`}
        >
          Save Article
        </SubmitButton>
      </AdminFormActions>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <AdminCard title="Article Details">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={ADMIN_LABEL_CLASS}>Title *</label>
                <input
                  name="title"
                  required
                  value={title}
                  onChange={handleTitleChange}
                  className={ADMIN_INPUT_CLASS}
                  placeholder="How to Choose the Perfect Modern Main Gate"
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <label className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/60">
                    URL Slug *
                  </label>
                  {isSlugManual && (
                    <button
                      type="button"
                      onClick={() => {
                        setSlug(slugify(title));
                        setIsSlugManual(false);
                      }}
                      className="text-[11px] text-textGold hover:underline"
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
                  className={ADMIN_INPUT_CLASS}
                  placeholder="how-to-choose-the-perfect-modern-main-gate"
                />
              </div>

              <div className="sm:col-span-2">
                <label className={ADMIN_LABEL_CLASS}>Excerpt</label>
                <textarea
                  name="excerpt"
                  rows={2}
                  defaultValue={post?.excerpt ?? ""}
                  className={ADMIN_TEXTAREA_CLASS}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={ADMIN_LABEL_CLASS}>Content *</label>
                <textarea
                  name="content"
                  required
                  rows={12}
                  defaultValue={post?.content}
                  className={ADMIN_TEXTAREA_CLASS}
                  placeholder="Write the article content. Separate paragraphs with a blank line."
                />
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Search Engine Optimization">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={ADMIN_LABEL_CLASS}>SEO Title</label>
                <input
                  name="seo_title"
                  defaultValue={post?.seo_title ?? ""}
                  maxLength={70}
                  className={ADMIN_INPUT_CLASS}
                />
              </div>

              <div>
                <label className={ADMIN_LABEL_CLASS}>Focus Keyword</label>
                <input
                  name="focus_keyword"
                  defaultValue={post?.focus_keyword ?? ""}
                  className={ADMIN_INPUT_CLASS}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={ADMIN_LABEL_CLASS}>SEO Description</label>
                <textarea
                  name="seo_description"
                  rows={2}
                  defaultValue={post?.seo_description ?? ""}
                  maxLength={170}
                  className={ADMIN_TEXTAREA_CLASS}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={ADMIN_LABEL_CLASS}>Canonical URL</label>
                <input
                  name="canonical_url"
                  defaultValue={post?.canonical_url ?? ""}
                  className={ADMIN_INPUT_CLASS}
                  placeholder="/blog/article-slug"
                />
              </div>
            </div>
          </AdminCard>
        </div>

        <aside className="space-y-6">
          <AdminCard title="Publishing">
            <div className="space-y-4">
              <div>
                <label className={ADMIN_LABEL_CLASS}>Status</label>
                <select
                  name="status"
                  defaultValue={post?.status ?? "draft"}
                  className={ADMIN_SELECT_CLASS}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div>
                <label className={ADMIN_LABEL_CLASS}>Published Date</label>
                <input
                  name="published_at"
                  type="datetime-local"
                  defaultValue={
                    post?.published_at
                      ? new Date(post.published_at).toISOString().slice(0, 16)
                      : ""
                  }
                  className={ADMIN_INPUT_CLASS}
                />
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Featured Image">
            <label className="flex min-h-14 cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-dashed border-white/25 bg-[#121212] px-4 py-4 text-xs font-medium uppercase tracking-[0.14em] text-white/75 transition hover:border-textGold hover:text-textGold">
              {uploading ? <UploadCloud size={17} className="animate-pulse" /> : <ImagePlus size={17} />}
              <span>{uploading ? "Uploading..." : "Choose Cover Image"}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                disabled={uploading}
                className="sr-only"
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0];
                  if (file) void uploadFile(file);
                  event.currentTarget.value = "";
                }}
              />
            </label>

            {uploadError && (
              <p role="alert" className="mt-3 rounded-lg bg-red-950/40 p-2.5 text-xs text-red-200">
                {uploadError}
              </p>
            )}

            {featuredImageUrl && (
              <div className="relative mt-4 aspect-video overflow-hidden rounded-lg border border-white/10 bg-[#111]">
                <Image
                  src={featuredImageUrl}
                  alt=""
                  fill
                  unoptimized
                  sizes="340px"
                  className="object-cover"
                />
              </div>
            )}

            <div className="mt-4 space-y-4">
              <div>
                <label className={ADMIN_LABEL_CLASS}>Image Path or URL</label>
                <input
                  value={featuredImage}
                  onChange={(event) => setFeaturedImage(event.target.value)}
                  className={ADMIN_INPUT_CLASS}
                />
              </div>

              <div>
                <label className={ADMIN_LABEL_CLASS}>Featured Image Alt Text</label>
                <input
                  name="image_alt"
                  defaultValue={post?.image_alt ?? ""}
                  className={ADMIN_INPUT_CLASS}
                />
              </div>
            </div>
          </AdminCard>
        </aside>
      </div>

      <AdminFormActions>
        <SubmitButton
          type="submit"
          disabled={uploading}
          loadingText="Saving article..."
          className={`${ADMIN_BTN_PRIMARY} w-full sm:w-auto`}
        >
          Save Article
        </SubmitButton>
      </AdminFormActions>
    </form>
  );
}
