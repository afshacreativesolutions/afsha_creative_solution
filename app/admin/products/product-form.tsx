"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowDown, ArrowLeft, ArrowUp, ImagePlus, Trash2, UploadCloud } from "lucide-react";
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
import type { CategoryRecord, ProductRecord, UploadedProductImage } from "@/lib/catalog-types";
import { slugify } from "@/lib/slug";
import { saveProduct } from "../actions";
import { SubmitButton } from "../submit-button";

type ImageDraft = UploadedProductImage & { url: string };

export default function ProductForm({
  categories,
  product,
  initialImages,
  saved,
}: {
  categories: CategoryRecord[];
  product?: ProductRecord;
  initialImages: ImageDraft[];
  saved?: boolean;
}) {
  const [images, setImages] = useState<ImageDraft[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [isSlugManual, setIsSlugManual] = useState(Boolean(product?.slug));

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setName(val);
    if (!isSlugManual) {
      setSlug(slugify(val));
    }
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setIsSlugManual(true);
    setSlug(slugify(e.target.value));
  }

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setUploadError("");
    const selected = Array.from(files);
    for (const file of selected) {
      const body = new FormData();
      body.set("file", file);
      try {
        const response = await fetch("/api/admin/upload", { method: "POST", body });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Image upload failed.");
        setImages((current) => [...current, result as ImageDraft]);
      } catch (error) {
        setUploadError(error instanceof Error ? error.message : "Image upload failed.");
        break;
      }
    }
    setUploading(false);
  }

  function moveImage(index: number, offset: number) {
    const nextIndex = index + offset;
    if (nextIndex < 0 || nextIndex >= images.length) return;
    setImages((current) => {
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  }

  const arrayText = (items: string[]) => items.join("\n");
  const specText = (specs: Record<string, string>) =>
    Object.entries(specs ?? {})
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");

  const hasValidCategories = categories.some(
    (category) => category.is_active || category.id === product?.category_id
  );

  return (
    <form action={saveProduct} className="space-y-6">
      <input type="hidden" name="id" value={product?.id ?? ""} />
      <input
        type="hidden"
        name="images"
        value={JSON.stringify(images.map(({ storage_path, alt_text }) => ({ storage_path, alt_text })))}
      />

      <AdminFormActions
        status={
          saved ? (
            <span role="status" className="font-medium text-emerald-300">
              Changes saved cleanly.
            </span>
          ) : uploading ? (
            <span className="text-textGold">Uploading selected images...</span>
          ) : (
            <span>Complete required fields (*) and save changes.</span>
          )
        }
      >
        <Link href="/admin/products" prefetch={false} className={`${ADMIN_BTN_SECONDARY} w-full sm:w-auto`}>
          <ArrowLeft size={14} />
          <span>Back to Products</span>
        </Link>
        <SubmitButton
          type="submit"
          disabled={uploading || !hasValidCategories}
          loadingText="Saving product..."
          className={`${ADMIN_BTN_PRIMARY} w-full sm:w-auto`}
        >
          Save Product
        </SubmitButton>
      </AdminFormActions>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <AdminCard title="Product Details">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={ADMIN_LABEL_CLASS}>Product Name *</label>
                <input
                  name="name"
                  required
                  value={name}
                  onChange={handleNameChange}
                  placeholder="Modern stainless steel gate"
                  className={ADMIN_INPUT_CLASS}
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
                        setSlug(slugify(name));
                        setIsSlugManual(false);
                      }}
                      className="min-h-8 text-[11px] text-textGold hover:underline"
                    >
                      Auto-sync from name
                    </button>
                  )}
                </div>
                <input
                  name="slug"
                  required
                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                  value={slug}
                  onChange={handleSlugChange}
                  placeholder="modern-stainless-steel-gate"
                  className={ADMIN_INPUT_CLASS}
                />
              </div>

              <div>
                <label className={ADMIN_LABEL_CLASS}>Category *</label>
                <select
                  name="category_id"
                  required
                  defaultValue={product?.category_id ?? ""}
                  className={ADMIN_SELECT_CLASS}
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories
                    .filter((category) => category.is_active || category.id === product?.category_id)
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
                {categories.length === 0 && (
                  <p className="mt-2 text-xs text-amber-200">
                    Create a category before adding products.
                  </p>
                )}
              </div>

              <div>
                <label className={ADMIN_LABEL_CLASS}>Sort Order</label>
                <input
                  name="sort_order"
                  type="number"
                  inputMode="numeric"
                  defaultValue={product?.sort_order ?? 0}
                  className={ADMIN_INPUT_CLASS}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={ADMIN_LABEL_CLASS}>Short Description *</label>
                <textarea
                  name="short_description"
                  required
                  rows={2}
                  defaultValue={product?.short_description}
                  maxLength={240}
                  className={ADMIN_TEXTAREA_CLASS}
                  placeholder="A concise summary for product listings."
                />
              </div>

              <div className="sm:col-span-2">
                <label className={ADMIN_LABEL_CLASS}>Full Description</label>
                <textarea
                  name="description"
                  rows={5}
                  defaultValue={product?.description}
                  className={ADMIN_TEXTAREA_CLASS}
                  placeholder="Describe fabrication quality, metalwork design, and applications."
                />
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Product Specifications & Features">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={ADMIN_LABEL_CLASS}>
                  Materials <span className="normal-case text-white/40">(one per line)</span>
                </label>
                <textarea
                  name="materials"
                  rows={4}
                  defaultValue={arrayText(product?.materials ?? [])}
                  className={ADMIN_TEXTAREA_CLASS}
                  placeholder="Steel&#10;Iron"
                />
              </div>

              <div>
                <label className={ADMIN_LABEL_CLASS}>
                  Applications <span className="normal-case text-white/40">(one per line)</span>
                </label>
                <textarea
                  name="applications"
                  rows={4}
                  defaultValue={arrayText(product?.applications ?? [])}
                  className={ADMIN_TEXTAREA_CLASS}
                  placeholder="Residential entrance&#10;Interior stair"
                />
              </div>

              <div>
                <label className={ADMIN_LABEL_CLASS}>
                  Customization <span className="normal-case text-white/40">(one per line)</span>
                </label>
                <textarea
                  name="customization_options"
                  rows={4}
                  defaultValue={arrayText(product?.customization_options ?? [])}
                  className={ADMIN_TEXTAREA_CLASS}
                  placeholder="Made-to-measure sizing&#10;Pattern selection"
                />
              </div>

              <div>
                <label className={ADMIN_LABEL_CLASS}>
                  Finish Options <span className="normal-case text-white/40">(one per line)</span>
                </label>
                <textarea
                  name="finish_options"
                  rows={4}
                  defaultValue={arrayText(product?.finish_options ?? [])}
                  className={ADMIN_TEXTAREA_CLASS}
                  placeholder="Brushed&#10;Polished"
                />
              </div>

              <div className="sm:col-span-2">
                <label className={ADMIN_LABEL_CLASS}>
                  Specifications{" "}
                  <span className="normal-case text-white/40">(one &ldquo;Label: value&rdquo; per line)</span>
                </label>
                <textarea
                  name="specifications"
                  rows={4}
                  defaultValue={specText(product?.specifications ?? {})}
                  className={ADMIN_TEXTAREA_CLASS}
                  placeholder="Available height: Confirm per project&#10;Mounting: Project specific"
                />
              </div>

              <div className="sm:col-span-2">
                <label className={ADMIN_LABEL_CLASS}>Care Instructions</label>
                <textarea
                  name="care_instructions"
                  rows={3}
                  defaultValue={product?.care_instructions ?? ""}
                  className={ADMIN_TEXTAREA_CLASS}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={ADMIN_LABEL_CLASS}>Warranty</label>
                <textarea
                  name="warranty"
                  rows={2}
                  defaultValue={product?.warranty ?? ""}
                  className={ADMIN_TEXTAREA_CLASS}
                  placeholder="Leave blank unless warranty terms are confirmed."
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
                  defaultValue={product?.seo_title ?? ""}
                  maxLength={70}
                  className={ADMIN_INPUT_CLASS}
                />
              </div>

              <div>
                <label className={ADMIN_LABEL_CLASS}>Focus Keyword</label>
                <input
                  name="focus_keyword"
                  defaultValue={product?.focus_keyword ?? ""}
                  className={ADMIN_INPUT_CLASS}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={ADMIN_LABEL_CLASS}>SEO Description</label>
                <textarea
                  name="seo_description"
                  rows={2}
                  defaultValue={product?.seo_description ?? ""}
                  maxLength={170}
                  className={ADMIN_TEXTAREA_CLASS}
                />
              </div>

              <div>
                <label className={ADMIN_LABEL_CLASS}>Canonical URL</label>
                <input
                  name="canonical_url"
                  defaultValue={product?.canonical_url ?? ""}
                  className={ADMIN_INPUT_CLASS}
                  placeholder="/products/product-slug"
                />
              </div>

              <div>
                <label className={ADMIN_LABEL_CLASS}>Featured Image Alt Text</label>
                <input
                  name="image_alt"
                  defaultValue={product?.image_alt ?? ""}
                  className={ADMIN_INPUT_CLASS}
                />
              </div>
            </div>
          </AdminCard>
        </div>

        <aside className="space-y-6">
          <AdminCard title="Publishing">
            <div className="space-y-3">
              <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-[#121212] px-3.5 text-sm text-white/85">
                <input
                  name="is_published"
                  type="checkbox"
                  defaultChecked={product?.is_published ?? false}
                  className="h-4 w-4 accent-[#CDA274]"
                />
                <span>Published publicly</span>
              </label>

              <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-[#121212] px-3.5 text-sm text-white/85">
                <input
                  name="is_featured"
                  type="checkbox"
                  defaultChecked={product?.is_featured ?? false}
                  className="h-4 w-4 accent-[#CDA274]"
                />
                <span>Featured product</span>
              </label>
            </div>
            <p className="mt-4 text-xs leading-5 text-white/45">
              Unpublished draft products stay visible inside the Admin panel only.
            </p>
          </AdminCard>

          <AdminCard
            title="Product Images"
            headerAction={
              <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-white/75">
                {images.length}
              </span>
            }
          >
            <label className="flex min-h-14 cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-dashed border-white/25 bg-[#121212] px-4 py-4 text-xs font-medium uppercase tracking-[0.14em] text-white/75 transition hover:border-textGold hover:text-textGold">
              {uploading ? <UploadCloud size={17} className="animate-pulse" /> : <ImagePlus size={17} />}
              <span>{uploading ? "Uploading images..." : "Choose or Capture Photos"}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                multiple
                disabled={uploading}
                className="sr-only"
                onChange={(event) => {
                  void uploadFiles(event.currentTarget.files);
                  event.currentTarget.value = "";
                }}
              />
            </label>

            <p className="mt-2.5 text-[11px] leading-5 text-white/45">
              JPG, PNG, WebP or AVIF · max 8 MB each. First item becomes primary photo.
            </p>
            {uploadError && (
              <p role="alert" className="mt-3 rounded-lg bg-red-950/40 p-2.5 text-xs text-red-200">
                {uploadError}
              </p>
            )}

            <div className="mt-4 space-y-3">
              {images.map((image, index) => (
                <div
                  key={image.storage_path}
                  className="space-y-2.5 rounded-xl border border-white/10 bg-[#121212] p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-black">
                      <Image
                        src={image.url}
                        alt=""
                        fill
                        unoptimized
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-textGold">
                        {index === 0 ? "Primary Image" : `Design #${index + 1}`}
                      </p>
                      <input
                        value={image.alt_text}
                        onChange={(event) =>
                          setImages((current) =>
                            current.map((item) =>
                              item.storage_path === image.storage_path
                                ? { ...item, alt_text: event.target.value }
                                : item
                            )
                          )
                        }
                        aria-label={`Alt text for image ${index + 1}`}
                        placeholder="Image alt description"
                        className="mt-1 min-h-10 w-full rounded border border-white/15 bg-black/50 px-2.5 text-xs text-white outline-none placeholder:text-white/30 focus:border-textGold"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-1.5 border-t border-white/10 pt-2">
                    <button
                      type="button"
                      aria-label={`Move image ${index + 1} up`}
                      disabled={index === 0}
                      onClick={() => moveImage(index, -1)}
                      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-white/10 bg-black/40 text-white/70 hover:border-textGold hover:text-textGold disabled:opacity-25"
                    >
                      <ArrowUp size={15} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Move image ${index + 1} down`}
                      disabled={index === images.length - 1}
                      onClick={() => moveImage(index, 1)}
                      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-white/10 bg-black/40 text-white/70 hover:border-textGold hover:text-textGold disabled:opacity-25"
                    >
                      <ArrowDown size={15} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Remove image ${index + 1}`}
                      onClick={() =>
                        setImages((current) =>
                          current.filter((item) => item.storage_path !== image.storage_path)
                        )
                      }
                      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-red-500/30 bg-red-950/25 text-red-300 hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>
        </aside>
      </div>

      <AdminFormActions
        status={
          saved ? (
            <span className="text-emerald-300">Product changes saved.</span>
          ) : undefined
        }
      >
        <SubmitButton
          type="submit"
          disabled={!hasValidCategories || uploading}
          loadingText="Saving product..."
          className={`${ADMIN_BTN_PRIMARY} w-full sm:w-auto`}
        >
          Save Product
        </SubmitButton>
      </AdminFormActions>
    </form>
  );
}
