"use client";

import { useState } from "react";
import { Image as ImageIcon, Search, X } from "lucide-react";
import MediaPickerModal from "@/components/admin/MediaPickerModal";
import type { CmsPageType } from "@/lib/cms/types";

export type EditablePageMeta = {
  title: string;
  slug: string;
  page_type: CmsPageType;
  meta_title: string;
  meta_description: string;
  meta_keywords: string[];
  canonical_url: string;
  og_image: string;
  og_image_alt: string;
  structured_data: Record<string, unknown> | Array<Record<string, unknown>> | null;
};

const INPUT_CLASS =
  "w-full rounded-lg border border-white/15 bg-[#111] px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-textGold focus:outline-none";

export default function PageSeoPanel({
  isOpen,
  onClose,
  meta,
  onChange,
  isHome,
}: {
  isOpen: boolean;
  onClose: () => void;
  meta: EditablePageMeta;
  onChange: (next: EditablePageMeta) => void;
  isHome: boolean;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);

  if (!isOpen) return null;

  const previewTitle = meta.meta_title || `${meta.title} | Afsha Creative Solutions`;
  const previewDesc =
    meta.meta_description ||
    "Explore custom metal gates, railings, and architectural metalwork by Afsha Creative Solutions in Moradabad.";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Page Settings and SEO"
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0a0a0a] text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-textGold">
              Page & SEO Settings
            </p>
            <h2 className="mt-0.5 text-lg font-light">{meta.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 p-2 text-white/60 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto p-6">
          {/* Google Search Snippet Preview */}
          <div className="rounded-xl border border-white/10 bg-[#111] p-4">
            <div className="mb-2 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-white/45">
              <Search size={12} className="text-textGold" /> Google Search Preview
            </div>
            <p className="text-xs text-emerald-400">
              https://www.afshacreative.in{meta.slug}
            </p>
            <p className="mt-0.5 text-base font-medium text-sky-300">{previewTitle}</p>
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/65">{previewDesc}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs uppercase tracking-[0.12em] text-white/60">
                Page Name (Admin)
              </label>
              <input
                type="text"
                value={meta.title}
                onChange={(e) => onChange({ ...meta, title: e.target.value })}
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs uppercase tracking-[0.12em] text-white/60">
                Page Type
              </label>
              <select
                value={meta.page_type}
                onChange={(e) =>
                  onChange({ ...meta, page_type: e.target.value as CmsPageType })
                }
                disabled={isHome}
                className={INPUT_CLASS}
              >
                <option value="home">Home</option>
                <option value="standard">Standard</option>
                <option value="landing">Landing / Offer</option>
                <option value="catalog">Catalog Index</option>
                <option value="location">Location SEO Page</option>
                <option value="blog_index">Blog Index</option>
                <option value="contact">Contact</option>
                <option value="custom">Custom Page</option>
              </select>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs uppercase tracking-[0.12em] text-white/60">
                URL Slug {isHome && "(Locked for Home)"}
              </label>
              <input
                type="text"
                disabled={isHome}
                value={meta.slug}
                onChange={(e) => onChange({ ...meta, slug: e.target.value })}
                className={`${INPUT_CLASS} disabled:opacity-50`}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs uppercase tracking-[0.12em] text-white/60">
                Canonical URL Override
              </label>
              <input
                type="text"
                value={meta.canonical_url}
                onChange={(e) => onChange({ ...meta, canonical_url: e.target.value })}
                placeholder={meta.slug}
                className={INPUT_CLASS}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 flex justify-between text-xs uppercase tracking-[0.12em] text-white/60">
              <span>SEO Meta Title</span>
              <span className="text-white/40">{meta.meta_title.length}/70</span>
            </label>
            <input
              type="text"
              value={meta.meta_title}
              onChange={(e) => onChange({ ...meta, meta_title: e.target.value })}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className="mb-1 flex justify-between text-xs uppercase tracking-[0.12em] text-white/60">
              <span>SEO Meta Description</span>
              <span className="text-white/40">{meta.meta_description.length}/165</span>
            </label>
            <textarea
              rows={3}
              value={meta.meta_description}
              onChange={(e) => onChange({ ...meta, meta_description: e.target.value })}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-[0.12em] text-white/60">
              SEO Keywords (comma-separated)
            </label>
            <input
              type="text"
              value={meta.meta_keywords.join(", ")}
              onChange={(e) =>
                onChange({
                  ...meta,
                  meta_keywords: e.target.value
                    .split(",")
                    .map((k) => k.trim())
                    .filter(Boolean),
                })
              }
              className={INPUT_CLASS}
            />
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.12em] text-white/65">
                Social Share Image (Open Graph)
              </span>
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="inline-flex items-center gap-1.5 rounded border border-textGold/50 bg-textGold/10 px-2.5 py-1 text-xs text-textGold"
              >
                <ImageIcon size={12} /> Choose Image
              </button>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2">
              <input
                type="text"
                value={meta.og_image}
                onChange={(e) => onChange({ ...meta, og_image: e.target.value })}
                placeholder="/opengraph-image or Media URL"
                className={INPUT_CLASS}
              />
              <input
                type="text"
                value={meta.og_image_alt}
                onChange={(e) => onChange({ ...meta, og_image_alt: e.target.value })}
                placeholder="Social share alt text"
                className={INPUT_CLASS}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-white/10 px-6 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-textGold px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-black hover:bg-white"
          >
            Done
          </button>
        </div>

        <MediaPickerModal
          isOpen={pickerOpen}
          onClose={() => setPickerOpen(false)}
          onSelect={(img) =>
            onChange({
              ...meta,
              og_image: img.url || img.storagePath || meta.og_image,
              og_image_alt: img.alt || meta.og_image_alt,
            })
          }
          currentAlt={meta.og_image_alt}
          title="Select Social Share Image"
        />
      </div>
    </div>
  );
}
