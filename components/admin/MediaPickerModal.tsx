"use client";

import { useEffect, useState } from "react";
import { Check, Image as ImageIcon, Loader2, Search, Sparkles, Upload, X } from "lucide-react";
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0a0a0a] text-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-textGold">Media Library</p>
            <h2 className="mt-0.5 text-base font-medium">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 p-2 text-white/60 hover:border-white/25 hover:text-white"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 bg-[#070707] px-5 py-3">
          {[
            { id: "library" as const, label: "Uploaded Media", icon: ImageIcon },
            { id: "upload" as const, label: "Upload New Image", icon: Upload },
            { id: "builtin" as const, label: "Curated Project Photos", icon: Sparkles },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setTab(id);
                setError(null);
              }}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition ${
                tab === id
                  ? "border-textGold/60 bg-textGold/15 text-textGold"
                  : "border-white/10 text-white/60 hover:text-white"
              }`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {error && (
            <div className="mb-4 rounded-lg border border-red-500/40 bg-red-950/40 px-4 py-2.5 text-xs text-red-200">
              {error}
            </div>
          )}

          {tab === "library" && (
            <div>
              <div className="relative mb-4">
                <Search
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search images by filename or alt text..."
                  className="w-full rounded-lg border border-white/15 bg-[#111] py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/35 focus:border-textGold focus:outline-none"
                />
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-16 text-xs text-white/50">
                  <Loader2 size={18} className="mr-2 animate-spin text-textGold" /> Loading images...
                </div>
              ) : items.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/15 py-14 text-center">
                  <p className="text-sm text-white/65">No images found in Media Library.</p>
                  <p className="mt-1 text-xs text-white/40">
                    Upload a new image or choose a curated project photo.
                  </p>
                  <button
                    type="button"
                    onClick={() => setTab("upload")}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg border border-textGold/50 bg-textGold/15 px-4 py-2 text-xs text-textGold hover:bg-textGold hover:text-black"
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
                      className="group overflow-hidden rounded-xl border border-white/10 bg-[#111] text-left transition hover:border-textGold/60"
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
            <form onSubmit={handleUpload} className="mx-auto max-w-lg space-y-4 py-4">
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-white/60">
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
                  className="block w-full rounded-lg border border-white/15 bg-[#111] p-2.5 text-xs text-white/80 file:mr-3 file:rounded-md file:border-0 file:bg-textGold/20 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-textGold"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-white/60">
                  Alt Text (for Accessibility & SEO)
                </label>
                <input
                  type="text"
                  value={uploadAlt}
                  onChange={(e) => setCustomAlt(e.target.value)}
                  placeholder="e.g., Custom stainless steel main entrance gate in Moradabad"
                  className="w-full rounded-lg border border-white/15 bg-[#111] px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-textGold focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-white/15 px-4 py-2 text-xs text-white/70 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !uploadFile}
                  className="inline-flex items-center gap-2 rounded-lg bg-textGold px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-white disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={14} /> Upload & Select
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
                    className="group overflow-hidden rounded-xl border border-white/10 bg-[#111] p-3 text-left transition hover:border-textGold/60"
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
