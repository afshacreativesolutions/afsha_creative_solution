"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowDown, ArrowLeft, ArrowUp, ImagePlus, Trash2, UploadCloud } from "lucide-react";
import { saveProduct } from "../actions";
import { SubmitButton } from "../submit-button";
import type { CategoryRecord, ProductRecord, UploadedProductImage } from "@/lib/catalog-types";

type ImageDraft = UploadedProductImage & { url: string };

function inputClass() {
  return "mt-2 w-full border border-white/12 bg-[#080808] px-3 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-textGold/60";
}

function fieldClass() {
  return "block text-[10px] uppercase tracking-[0.15em] text-white/55";
}

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
  const specText = (specs: Record<string, string>) => Object.entries(specs ?? {}).map(([key, value]) => `${key}: ${value}`).join("\n");

  return <form action={saveProduct} className="space-y-8">
    <input type="hidden" name="id" value={product?.id ?? ""} />
    <input type="hidden" name="images" value={JSON.stringify(images.map(({ storage_path, alt_text }) => ({ storage_path, alt_text })))} />
    <div className="flex flex-wrap items-center justify-between gap-4">
      <Link href="/admin/products" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-white/50 hover:text-white"><ArrowLeft size={14} /> Products</Link>
      <div className="flex items-center gap-3">
        {saved && <span role="status" className="text-xs text-emerald-300">Changes saved</span>}
        <SubmitButton
          type="submit"
          disabled={uploading || categories.length === 0}
          loadingText="Saving product..."
          className="border border-textGold/60 bg-textGold px-5 py-3 text-[10px] uppercase tracking-[0.16em] text-black transition-colors hover:bg-transparent hover:text-textGold disabled:cursor-not-allowed disabled:opacity-40"
        >
          Save product
        </SubmitButton>
      </div>
    </div>

    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-6">
        <section className="grid gap-5 border border-white/10 bg-[#080808] p-5 sm:grid-cols-2 sm:p-7">
          <h2 className="col-span-full text-lg font-light">Product details</h2>
          <label className={fieldClass()}>Product name *
            <input name="name" required defaultValue={product?.name} placeholder="Modern stainless steel gate" className={inputClass()} />
          </label>
          <label className={fieldClass()}>URL slug *
            <input name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" defaultValue={product?.slug} placeholder="modern-stainless-steel-gate" className={inputClass()} />
          </label>
          <label className={fieldClass()}>Category *
            <select name="category_id" required defaultValue={product?.category_id ?? ""} className={inputClass()}>
              <option value="" disabled>Select a category</option>
              {categories.filter((category) => category.is_active || category.id === product?.category_id).map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
            {categories.length === 0 && <span className="mt-2 block normal-case tracking-normal text-amber-200">Create a category before adding products.</span>}
          </label>
          <label className={fieldClass()}>Sort order
            <input name="sort_order" type="number" defaultValue={product?.sort_order ?? 0} className={inputClass()} />
          </label>
          <label className={`${fieldClass()} sm:col-span-2`}>Short description *
            <textarea name="short_description" required rows={2} defaultValue={product?.short_description} maxLength={240} className={inputClass()} placeholder="A short product summary for the collection card." />
          </label>
          <label className={`${fieldClass()} sm:col-span-2`}>Full description
            <textarea name="description" rows={5} defaultValue={product?.description} className={inputClass()} placeholder="Describe the design, its character, and how it is made." />
          </label>
        </section>

        <section className="grid gap-5 border border-white/10 bg-[#080808] p-5 sm:grid-cols-2 sm:p-7">
          <h2 className="col-span-full text-lg font-light">Product information</h2>
          <label className={fieldClass()}>Materials <span className="normal-case tracking-normal text-white/35">(one per line)</span>
            <textarea name="materials" rows={4} defaultValue={arrayText(product?.materials ?? [])} className={inputClass()} placeholder="Steel&#10;Iron" />
          </label>
          <label className={fieldClass()}>Applications <span className="normal-case tracking-normal text-white/35">(one per line)</span>
            <textarea name="applications" rows={4} defaultValue={arrayText(product?.applications ?? [])} className={inputClass()} placeholder="Residential entrance&#10;Interior stair" />
          </label>
          <label className={fieldClass()}>Customization <span className="normal-case tracking-normal text-white/35">(one per line)</span>
            <textarea name="customization_options" rows={4} defaultValue={arrayText(product?.customization_options ?? [])} className={inputClass()} placeholder="Made-to-measure sizing&#10;Pattern selection" />
          </label>
          <label className={fieldClass()}>Finish options <span className="normal-case tracking-normal text-white/35">(one per line)</span>
            <textarea name="finish_options" rows={4} defaultValue={arrayText(product?.finish_options ?? [])} className={inputClass()} placeholder="Brushed&#10;Polished" />
          </label>
          <label className={`${fieldClass()} sm:col-span-2`}>Specifications <span className="normal-case tracking-normal text-white/35">(one “Label: value” per line)</span>
            <textarea name="specifications" rows={4} defaultValue={specText(product?.specifications ?? {})} className={inputClass()} placeholder="Available height: Confirm per project&#10;Mounting: Project specific" />
          </label>
          <label className={`${fieldClass()} sm:col-span-2`}>Care instructions
            <textarea name="care_instructions" rows={3} defaultValue={product?.care_instructions ?? ""} className={inputClass()} />
          </label>
          <label className={`${fieldClass()} sm:col-span-2`}>Warranty
            <textarea name="warranty" rows={2} defaultValue={product?.warranty ?? ""} className={inputClass()} placeholder="Leave blank unless warranty terms are confirmed." />
          </label>
        </section>

        <section className="grid gap-5 border border-white/10 bg-[#080808] p-5 sm:grid-cols-2 sm:p-7">
          <h2 className="col-span-full text-lg font-light">Search metadata</h2>
          <label className={fieldClass()}>SEO title
            <input name="seo_title" defaultValue={product?.seo_title ?? ""} maxLength={70} className={inputClass()} />
          </label>
          <label className={fieldClass()}>SEO description
            <textarea name="seo_description" rows={2} defaultValue={product?.seo_description ?? ""} maxLength={170} className={inputClass()} />
          </label>
          <label className={fieldClass()}>Focus keyword
            <input name="focus_keyword" defaultValue={product?.focus_keyword ?? ""} className={inputClass()} />
          </label>
          <label className={fieldClass()}>Canonical URL
            <input name="canonical_url" defaultValue={product?.canonical_url ?? ""} className={inputClass()} placeholder="/products/product-slug" />
          </label>
          <label className={`${fieldClass()} sm:col-span-2`}>Featured image alt text
            <input name="image_alt" defaultValue={product?.image_alt ?? ""} className={inputClass()} />
          </label>
        </section>
      </div>

      <aside className="space-y-5">
        <section className="border border-white/10 bg-[#080808] p-5 sm:p-6">
          <h2 className="mb-5 text-lg font-light">Publishing</h2>
          <label className="flex items-center gap-3 text-sm text-white/70"><input name="is_published" type="checkbox" defaultChecked={product?.is_published ?? false} className="accent-[#CDA274]" /> Published</label>
          <label className="mt-4 flex items-center gap-3 text-sm text-white/70"><input name="is_featured" type="checkbox" defaultChecked={product?.is_featured ?? false} className="accent-[#CDA274]" /> Featured product</label>
          <p className="mt-5 text-xs leading-5 text-white/35">Draft products are visible in this admin area only.</p>
        </section>

        <section className="border border-white/10 bg-[#080808] p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-2"><h2 className="text-lg font-light">Product images</h2><span className="text-xs text-white/35">{images.length}</span></div>
          <label className="flex cursor-pointer items-center justify-center gap-3 border border-dashed border-white/20 px-4 py-5 text-[10px] uppercase tracking-[0.13em] text-white/55 transition-colors hover:border-textGold/60 hover:text-textGold">
            {uploading ? <UploadCloud size={16} className="animate-pulse" /> : <ImagePlus size={16} />}
            {uploading ? "Uploading images…" : "Choose images"}
            <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple disabled={uploading} className="sr-only" onChange={(event) => { void uploadFiles(event.currentTarget.files); event.currentTarget.value = ""; }} />
          </label>
          <p className="mt-3 text-[10px] leading-4 text-white/35">JPG, PNG, WebP or AVIF · maximum 8 MB each. First image is the primary image.</p>
          {uploadError && <p role="alert" className="mt-3 text-xs text-red-300">{uploadError}</p>}
          <div className="mt-5 space-y-3">
            {images.map((image, index) => <div key={image.storage_path} className="flex items-center gap-3 border border-white/8 p-2">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden bg-[#111]"><Image src={image.url} alt="" fill unoptimized sizes="56px" className="object-cover" /></div>
              <div className="min-w-0 flex-1"><p className="mb-1 text-[9px] uppercase tracking-[0.13em] text-white/35">{index === 0 ? "Primary image" : `Image ${index + 1}`}</p><input value={image.alt_text} onChange={(event) => setImages((current) => current.map((item) => item.storage_path === image.storage_path ? { ...item, alt_text: event.target.value } : item))} aria-label={`Alt text for image ${index + 1}`} placeholder="Describe image for accessibility" className="w-full bg-transparent text-xs text-white/70 outline-none placeholder:text-white/25" /></div>
              <div className="flex shrink-0 flex-col">
                <button type="button" aria-label={`Move image ${index + 1} up`} disabled={index === 0} onClick={() => moveImage(index, -1)} className="p-1 text-white/35 hover:text-textGold disabled:opacity-20"><ArrowUp size={13} /></button>
                <button type="button" aria-label={`Move image ${index + 1} down`} disabled={index === images.length - 1} onClick={() => moveImage(index, 1)} className="p-1 text-white/35 hover:text-textGold disabled:opacity-20"><ArrowDown size={13} /></button>
              </div>
              <button type="button" aria-label={`Remove image ${index + 1}`} onClick={() => setImages((current) => current.filter((item) => item.storage_path !== image.storage_path))} className="p-2 text-white/35 hover:text-red-300"><Trash2 size={14} /></button>
            </div>)}
          </div>
        </section>
      </aside>
    </div>
    <div className="flex justify-end border-t border-white/10 pt-5">
      <SubmitButton
        type="submit"
        disabled={!categories.some((category) => category.is_active || category.id === product?.category_id) || uploading}
        loadingText="Saving product..."
        className="border border-textGold/60 bg-textGold px-6 py-3 text-[10px] uppercase tracking-[0.16em] text-black transition-colors hover:bg-transparent hover:text-textGold disabled:cursor-not-allowed disabled:opacity-40"
      >
        Save product
      </SubmitButton>
    </div>
  </form>;
}
