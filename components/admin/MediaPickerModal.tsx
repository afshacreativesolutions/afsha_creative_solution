"use client";

import { useEffect, useState } from "react";
import { Check, Image as ImageIcon, Loader2, Search, Sparkles, Upload, X } from "lucide-react";
import { ADMIN_BTN_PRIMARY, ADMIN_BTN_SECONDARY, ADMIN_INPUT_CLASS, ADMIN_LABEL_CLASS } from "./admin-styles";
import { ASSET_FILE_MAP, formatFileSize } from "@/lib/cms/media";
import type { CmsImageRef, CmsMediaRecord } from "@/lib/cms/types";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export default function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  currentAlt = "",
  title = "Select or Upload Image",
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (image: CmsImageRef) => void;
  currentAlt?: string;
  title?: string;
}) {
  const [tab, setTab] = useState<"library" | "upload" | "builtin">("library");
  const [items, setItems] = useState<CmsMediaRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [customAlt, setCustomAlt] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const uploadAlt = customAlt !== null ? customAlt : currentAlt;

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/media?q=${encodeURIComponent(search)}`);
        const data = (await res.json()) as { items?: CmsMediaRecord[]; error?: string };
        if (!active) return;
        if (!res.ok) {
          setError(data.error || "Could not load Media Library.");
          setItems([]);
        } else {
          setItems(data.items ?? []);
        }
      } catch {
        if (active) setError("Network error while loading images.");
      } finally {
        if (active) setLoading(false);
      }
    };
    const timer = setTimeout(load, 180);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [isOpen, search]);

  if (!isOpen) return null;

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setError("Please select an image file first.");
      return;
    }
    if (!ALLOWED_MIME.has(uploadFile.type)) {
      setError("Unsupported file type. Please choose JPEG, PNG, WebP, or AVIF.");
      return;
    }
    if (uploadFile.size > MAX_BYTES) {
      setError("Image size must be 8 MB or smaller.");
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("alt_text", uploadAlt.trim());
      const res = await fetch("/api/admin/media", { method: "POST", body: formData });
      const data = (await res.json()) as {
        media?: CmsMediaRecord;
        error?: string;
      };
      if (!res.ok || !data.media) {
        setError(data.error || "Upload failed.");
        return;
      }

      onSelect({
        url: data.media.public_url,
        storagePath: data.media.storage_path,
        mediaId: data.media.id,
        alt: data.media.alt_text || uploadAlt.trim(),
        width: data.media.width ?? undefined,
        height: data.media.height ?? undefined,
      });
      setUploadFile(null);
      setCustomAlt(null);
      onClose();
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => {
        if (e.target === e.currentTarget && !uploading) onClose();
      }}
    >
      <div className="flex h-[92svh] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl border border-white/15 bg-[#0a0a0a] text-white shadow-2xl sm:h-auto sm:max-h-[88vh] sm:rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3.5 sm:px-5 sm:py-4">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.2em] text-textGold">Media Library</p>
            <h2 className="mt-0.5 truncate text-sm font-medium sm:text-base">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 text-white/60 hover:border-white/25 hover:text-white"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="scrollbar-none flex items-center gap-2 overflow-x-auto border-b border-white/10 bg-[#070707] px-4 py-3 sm:flex-wrap sm:px-5">
          {[
            { id: "library" as const, label: "Uploaded Media", icon: ImageIcon },
            { id: "upload" as const, label: "Upload Image", icon: Upload },
            { id: "builtin" as const, label: "Curated Photos", icon: Sparkles },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setTab(id);
                setError(null);
              }}
              className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border px-3.5 text-xs transition ${
                tab === id
                  ? "border-textGold/60 bg-textGold/15 font-medium text-textGold"
                  : "border-white/10 text-white/65 hover:text-white"
              }`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-5">
          {error && (
            <div role="alert" className="mb-4 rounded-lg border border-red-500/40 bg-red-950/40 px-4 py-2.5 text-xs text-red-200">
              {error}
            </div>
          )}

          {tab === "library" && (
            <div>
              <div className="relative mb-4">
                <Search
                  size={15}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search images by filename or alt text..."
                  className={`${ADMIN_INPUT_CLASS} pl-10`}
                />
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-16 text-xs text-white/50">
                  <Loader2 size={18} className="mr-2 animate-spin text-textGold" /> Loading images...
                </div>
              ) : items.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/15 px-4 py-14 text-center">
                  <p className="text-sm text-white/65">No images found in Media Library.</p>
                  <p className="mt-1 text-xs text-white/45">
                    Upload a new image or choose a curated project photo.
                  </p>
                  <button
                    type="button"
                    onClick={() => setTab("upload")}
                    className={`${ADMIN_BTN_PRIMARY} mt-4`}
                  >
                    <Upload size={14} /> Upload Image
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onSelect({
                          url: item.public_url,
                          storagePath: item.storage_path,
                          mediaId: item.id,
                          alt: item.alt_text || item.file_name,
                          width: item.width ?? undefined,
                          height: item.height ?? undefined,
                        });
                        onClose();
                      }}
                      className="group overflow-hidden rounded-xl border border-white/10 bg-[#111] text-left transition hover:border-textGold/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-textGold"
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.public_url}
                          alt={item.alt_text || item.file_name}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                        <span className="absolute right-2 top-2 rounded-full bg-black/75 p-1 text-textGold opacity-0 transition group-hover:opacity-100">
                          <Check size={12} />
                        </span>
                      </div>
                      <div className="p-2.5">
                        <p className="truncate text-xs font-medium text-white/90">{item.file_name}</p>
                        <p className="mt-0.5 truncate text-[10px] text-white/45">
                          {item.width && item.height ? `${item.width}×${item.height} · ` : ""}
                          {formatFileSize(item.file_size)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "upload" && (
            <form onSubmit={handleUpload} className="mx-auto max-w-lg space-y-4 py-2">
              <div>
                <label className={ADMIN_LABEL_CLASS}>
                  Image File (JPEG, PNG, WebP, AVIF · Max 8 MB)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setUploadFile(file);
                    if (file && !uploadAlt) {
                      setCustomAlt(
                        file.name
                          .replace(/\.[^/.]+$/, "")
                          .replace(/[-_]+/g, " ")
                          .trim()
                      );
                    }
                  }}
                  className="block min-h-12 w-full rounded-lg border border-white/15 bg-[#111] p-2.5 text-sm text-white/80 file:mr-3 file:min-h-9 file:rounded-md file:border-0 file:bg-textGold/20 file:px-3 file:text-xs file:font-medium file:text-textGold"
                />
              </div>

              <div>
                <label className={ADMIN_LABEL_CLASS}>Alt Text (Accessibility &amp; SEO)</label>
                <input
                  type="text"
                  value={uploadAlt}
                  onChange={(e) => setCustomAlt(e.target.value)}
                  placeholder="e.g., Custom stainless steel main entrance gate in Moradabad"
                  className={ADMIN_INPUT_CLASS}
                />
              </div>

              <div className="flex flex-col-reverse gap-2.5 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className={`${ADMIN_BTN_SECONDARY} w-full sm:w-auto`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !uploadFile}
                  className={`${ADMIN_BTN_PRIMARY} w-full sm:w-auto`}
                >
                  {uploading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={14} /> Upload &amp; Select
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {tab === "builtin" && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {Object.entries(ASSET_FILE_MAP).map(([assetKey, relPath]) => {
                const label = relPath.split("/").pop() || assetKey;
                return (
                  <button
                    key={assetKey}
                    type="button"
                    onClick={() => {
                      onSelect({
                        url: assetKey,
                        storagePath: assetKey,
                        alt: currentAlt || label.replace(/\.[^/.]+$/, ""),
                      });
                      onClose();
                    }}
                    className="group min-h-24 overflow-hidden rounded-xl border border-white/10 bg-[#111] p-3 text-left transition hover:border-textGold/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-textGold"
                  >
                    <p className="text-[10px] uppercase tracking-[0.14em] text-textGold">
                      Project Asset
                    </p>
                    <p className="mt-1 truncate text-xs font-medium text-white">{label}</p>
                    <p className="mt-1 truncate text-[10px] text-white/45">{relPath}</p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
