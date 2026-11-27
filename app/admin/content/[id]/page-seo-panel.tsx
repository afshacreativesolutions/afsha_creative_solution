"use client";

import { useEffect, useState } from "react";
import { Image as ImageIcon, Search, X } from "lucide-react";
import {
  ADMIN_BTN_PRIMARY,
  ADMIN_INPUT_CLASS,
  ADMIN_LABEL_CLASS,
  ADMIN_SELECT_CLASS,
  ADMIN_TEXTAREA_CLASS,
} from "@/components/admin/admin-styles";
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

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !pickerOpen) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, pickerOpen, onClose]);

  if (!isOpen) return null;

  const previewTitle = meta.meta_title || `${meta.title} | Afsha Creative Solutions`;
  const previewDesc =
    meta.meta_description ||
    "Explore custom metal gates, railings, and architectural metalwork by Afsha Creative Solutions in Moradabad.";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Page Settings and SEO"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex h-[92svh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-white/15 bg-[#0a0a0a] text-white shadow-2xl sm:h-auto sm:max-h-[90vh] sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3.5 sm:px-6 sm:py-4">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.2em] text-textGold">
              Page &amp; SEO Settings
            </p>
            <h2 className="mt-0.5 truncate text-base font-light sm:text-lg">{meta.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close page SEO panel"
            className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 text-white/60 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {/* Google Search Snippet Preview */}
          <div className="rounded-xl border border-white/10 bg-[#111] p-4">
            <div className="mb-2 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-white/45">
              <Search size={12} className="text-textGold" /> Google Search Preview
            </div>
            <p className="break-all text-xs text-emerald-400">
              https://www.afshacreative.in{meta.slug}
            </p>
            <p className="mt-0.5 text-base font-medium text-sky-300">{previewTitle}</p>
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/65">{previewDesc}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={ADMIN_LABEL_CLASS}>Page Name (Admin)</label>
              <input
                type="text"
                value={meta.title}
                onChange={(e) => onChange({ ...meta, title: e.target.value })}
                className={ADMIN_INPUT_CLASS}
              />
            </div>

            <div>
              <label className={ADMIN_LABEL_CLASS}>Page Type</label>
              <select
                value={meta.page_type}
                onChange={(e) =>
                  onChange({ ...meta, page_type: e.target.value as CmsPageType })
                }
                disabled={isHome}
                className={ADMIN_SELECT_CLASS}
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
              <label className={ADMIN_LABEL_CLASS}>
                URL Slug {isHome && "(Locked for Home)"}
              </label>
              <input
                type="text"
                disabled={isHome}
                value={meta.slug}
                onChange={(e) => onChange({ ...meta, slug: e.target.value })}
                className={`${ADMIN_INPUT_CLASS} disabled:opacity-50`}
              />
            </div>

            <div>
              <label className={ADMIN_LABEL_CLASS}>Canonical URL Override</label>
              <input
                type="text"
                value={meta.canonical_url}
                onChange={(e) => onChange({ ...meta, canonical_url: e.target.value })}
                placeholder={meta.slug}
                className={ADMIN_INPUT_CLASS}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 flex justify-between text-[11px] font-medium uppercase tracking-[0.14em] text-white/60">
              <span>SEO Meta Title</span>
              <span className="text-white/40">{meta.meta_title.length}/70</span>
            </label>
            <input
              type="text"
              value={meta.meta_title}
              onChange={(e) => onChange({ ...meta, meta_title: e.target.value })}
              className={ADMIN_INPUT_CLASS}
            />
          </div>

          <div>
            <label className="mb-1.5 flex justify-between text-[11px] font-medium uppercase tracking-[0.14em] text-white/60">
              <span>SEO Meta Description</span>
              <span className="text-white/40">{meta.meta_description.length}/165</span>
            </label>
            <textarea
              rows={3}
              value={meta.meta_description}
              onChange={(e) => onChange({ ...meta, meta_description: e.target.value })}
              className={ADMIN_TEXTAREA_CLASS}
            />
          </div>

          <div>
            <label className={ADMIN_LABEL_CLASS}>SEO Keywords (comma-separated)</label>
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
              className={ADMIN_INPUT_CLASS}
            />
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs uppercase tracking-[0.12em] text-white/70">
                Social Share Image (Open Graph)
              </span>
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-textGold/50 bg-textGold/10 px-3 text-xs text-textGold"
              >
                <ImageIcon size={13} /> Choose Image
              </button>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2">
              <input
                type="text"
                value={meta.og_image}
                onChange={(e) => onChange({ ...meta, og_image: e.target.value })}
                placeholder="/opengraph-image or Media URL"
                className={ADMIN_INPUT_CLASS}
              />
              <input
                type="text"
                value={meta.og_image_alt}
                onChange={(e) => onChange({ ...meta, og_image_alt: e.target.value })}
                placeholder="Social share alt text"
                className={ADMIN_INPUT_CLASS}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-white/10 px-4 py-3.5 pb-[max(0.875rem,env(safe-area-inset-bottom))] sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className={`${ADMIN_BTN_PRIMARY} w-full sm:w-auto`}
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
