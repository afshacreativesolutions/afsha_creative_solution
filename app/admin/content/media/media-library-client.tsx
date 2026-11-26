"use client";

import { useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Check,
  Copy,
  ImagePlus,
  Loader2,
  RefreshCw,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { formatFileSize } from "@/lib/cms/media";
import type { CmsMediaRecord } from "@/lib/cms/types";

type ReferenceInfo = {
  type: string;
  title?: string;
  slug?: string;
  section?: string;
};

export default function MediaLibraryClient({
  initialMedia,
  tableReady,
}: {
  initialMedia: CmsMediaRecord[];
  tableReady: boolean;
}) {
  const [mediaList, setMediaList] = useState<CmsMediaRecord[]>(initialMedia);
  const [search, setSearch] = useState("");
  const [mimeFilter, setMimeFilter] = useState<string>("all");
  const [altInputs, setAltInputs] = useState<Record<string, string>>(() =>
    Object.fromEntries(initialMedia.map((m) => [m.id, m.alt_text || ""]))
  );
  const [savingAltId, setSavingAltId] = useState<string | null>(null);
  const [savedAltId, setSavedAltId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);
  const [newAlt, setNewAlt] = useState("");
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [replacingId, setReplacingId] = useState<string | null>(null);
  const replaceInputRef = useRef<HTMLInputElement | null>(null);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<CmsMediaRecord | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [blockedRefs, setBlockedRefs] = useState<ReferenceInfo[] | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return mediaList.filter((item) => {
      if (mimeFilter !== "all" && item.mime_type !== mimeFilter) return false;
      if (!q) return true;
      return (
        item.file_name.toLowerCase().includes(q) ||
        (item.alt_text || "").toLowerCase().includes(q)
      );
    });
  }, [mediaList, search, mimeFilter]);

  const totalBytes = useMemo(
    () => mediaList.reduce((acc, item) => acc + (item.file_size || 0), 0),
    [mediaList]
  );

  const handleUploadFile = async (file: File, replaceId?: string) => {
    setStatusMessage(null);
    if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)) {
      setStatusMessage({
        type: "error",
        text: "Only WebP, JPEG, PNG, and AVIF images are supported.",
      });
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setStatusMessage({ type: "error", text: "Maximum image upload size is 8 MB." });
      return;
    }

    if (replaceId) {
      setReplacingId(replaceId);
    } else {
      setUploading(true);
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (replaceId) {
        formData.append("replace_id", replaceId);
      } else {
        const defaultAlt =
          newAlt.trim() ||
          file.name
            .replace(/\.[^/.]+$/, "")
            .replace(/[-_]+/g, " ")
            .trim();
        formData.append("alt_text", defaultAlt);
      }

      const res = await fetch("/api/admin/media", { method: "POST", body: formData });
      const data = (await res.json()) as { media?: CmsMediaRecord; error?: string };

      if (!res.ok || !data.media) {
        setStatusMessage({ type: "error", text: data.error || "Image upload failed." });
        return;
      }

      const uploaded = data.media;
      setMediaList((prev) =>
        replaceId ? prev.map((m) => (m.id === replaceId ? uploaded : m)) : [uploaded, ...prev]
      );
      setAltInputs((prev) => ({ ...prev, [uploaded.id]: uploaded.alt_text || "" }));
      if (!replaceId) setNewAlt("");
      setStatusMessage({
        type: "success",
        text: replaceId
          ? `Replaced image file for "${uploaded.file_name}".`
          : `Uploaded "${uploaded.file_name}" to Media Library.`,
      });
    } catch {
      setStatusMessage({ type: "error", text: "Network error during upload." });
    } finally {
      setUploading(false);
      setReplacingId(null);
    }
  };

  const handleSaveAlt = async (id: string) => {
    setSavingAltId(id);
    setStatusMessage(null);
    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alt_text: altInputs[id] ?? "" }),
      });
      const data = (await res.json()) as { media?: CmsMediaRecord; error?: string };
      if (!res.ok || !data.media) {
        setStatusMessage({ type: "error", text: data.error || "Could not update alt text." });
        return;
      }
      setMediaList((prev) => prev.map((m) => (m.id === id ? data.media! : m)));
      setSavedAltId(id);
      setTimeout(() => setSavedAltId(null), 1800);
    } catch {
      setStatusMessage({ type: "error", text: "Failed to save alt text." });
    } finally {
      setSavingAltId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setBlockedRefs(null);
    setStatusMessage(null);
    try {
      const res = await fetch(`/api/admin/media/${deleteTarget.id}`, { method: "DELETE" });
      const data = (await res.json()) as {
        deleted?: boolean;
        error?: string;
        references?: ReferenceInfo[];
      };
      if (res.status === 409 && data.references) {
        setBlockedRefs(data.references);
        return;
      }
      if (!res.ok) {
        setStatusMessage({ type: "error", text: data.error || "Delete failed." });
        setDeleteTarget(null);
        return;
      }

      setMediaList((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      setStatusMessage({ type: "success", text: `Deleted "${deleteTarget.file_name}".` });
      setDeleteTarget(null);
    } catch {
      setStatusMessage({ type: "error", text: "Network error while deleting file." });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {!tableReady && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-4 text-xs text-amber-200">
          The CMS database tables (`cms_media`) are not created in Supabase yet. Apply{" "}
          <code className="text-amber-100">supabase/migrations/202611260001_cms_and_media.sql</code>{" "}
          first before uploading media.
        </div>
      )}

      {statusMessage && (
        <div
          className={`rounded-xl border px-4 py-3 text-xs ${
            statusMessage.type === "success"
              ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-200"
              : "border-red-500/40 bg-red-950/30 text-red-200"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Upload Box */}
      <section className="rounded-2xl border border-white/10 bg-[#090909] p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-textGold">
              Upload Website Media
            </p>
            <h2 className="mt-1 text-lg font-light">
              Add WebP, JPEG, PNG, or AVIF images (Max 8 MB)
            </h2>
          </div>
          <div className="text-xs text-white/45">
            {mediaList.length} files · {formatFileSize(totalBytes)} total
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            type="text"
            value={newAlt}
            onChange={(e) => setNewAlt(e.target.value)}
            placeholder="Optional alt text description before uploading..."
            className="rounded-lg border border-white/15 bg-[#111] px-3.5 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-textGold focus:outline-none"
          />
          <div>
            <input
              ref={uploadInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUploadFile(file);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              disabled={!tableReady || uploading}
              onClick={() => uploadInputRef.current?.click()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-textGold px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-white disabled:opacity-45 sm:w-auto"
            >
              {uploading ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <Upload size={15} /> Choose & Upload Image
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search
            size={15}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by file name or alt text..."
            className="w-full rounded-lg border border-white/15 bg-[#0b0b0b] py-2 pl-10 pr-3 text-sm text-white placeholder:text-white/35 focus:border-textGold focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[
            { value: "all", label: "All Formats" },
            { value: "image/webp", label: "WebP" },
            { value: "image/jpeg", label: "JPEG" },
            { value: "image/png", label: "PNG" },
            { value: "image/avif", label: "AVIF" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setMimeFilter(opt.value)}
              className={`rounded-lg border px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] transition ${
                mimeFilter === opt.value
                  ? "border-textGold/60 bg-textGold/15 text-textGold"
                  : "border-white/10 text-white/55 hover:text-white"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hidden input for Replace action */}
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          const targetId = replaceInputRef.current?.dataset.targetId;
          if (file && targetId) handleUploadFile(file, targetId);
          e.target.value = "";
        }}
      />

      {/* Media Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 py-16 text-center">
          <ImagePlus size={28} className="mx-auto text-white/25" />
          <p className="mt-3 text-sm text-white/60">No media files match your filter.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#090909]"
            >
              <div className="relative aspect-[4/3] bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.public_url}
                  alt={item.alt_text || item.file_name}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-2.5 top-2.5 rounded bg-black/75 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.14em] text-textGold">
                  {item.mime_type.replace("image/", "")}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                  <p className="truncate text-sm font-medium text-white">{item.file_name}</p>
                  <p className="mt-0.5 text-[11px] text-white/45">
                    {item.width && item.height ? `${item.width} × ${item.height} px · ` : ""}
                    {formatFileSize(item.file_size)}
                  </p>
                </div>

                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={altInputs[item.id] ?? ""}
                    onChange={(e) =>
                      setAltInputs((prev) => ({ ...prev, [item.id]: e.target.value }))
                    }
                    placeholder="Alt text..."
                    aria-label={`Alt text for ${item.file_name}`}
                    className="min-w-0 flex-1 rounded border border-white/15 bg-[#121212] px-2.5 py-1.5 text-xs text-white focus:border-textGold focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveAlt(item.id)}
                    disabled={savingAltId === item.id}
                    className="rounded border border-white/15 px-2.5 py-1.5 text-[10px] uppercase tracking-[0.12em] text-white/80 hover:border-textGold hover:text-textGold"
                  >
                    {savingAltId === item.id ? (
                      "..."
                    ) : savedAltId === item.id ? (
                      <Check size={12} className="text-emerald-400" />
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>

                <div className="mt-auto flex items-center justify-between gap-2 border-t border-white/10 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(item.public_url);
                      setCopiedId(item.id);
                      setTimeout(() => setCopiedId(null), 1500);
                    }}
                    className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.12em] text-white/60 hover:text-white"
                  >
                    <Copy size={12} /> {copiedId === item.id ? "Copied" : "Copy URL"}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={replacingId === item.id}
                      onClick={() => {
                        if (replaceInputRef.current) {
                          replaceInputRef.current.dataset.targetId = item.id;
                          replaceInputRef.current.click();
                        }
                      }}
                      title="Replace file"
                      className="inline-flex items-center gap-1 rounded border border-white/15 px-2 py-1 text-[10px] uppercase tracking-[0.1em] text-white/70 hover:border-textGold hover:text-textGold"
                    >
                      <RefreshCw size={11} /> Replace
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setBlockedRefs(null);
                        setDeleteTarget(item);
                      }}
                      title="Delete file"
                      className="rounded border border-red-500/30 p-1.5 text-red-300/80 hover:border-red-500 hover:bg-red-950/40 hover:text-red-200"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Safe Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0a0a0a] p-6 text-white">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-400" />
              <div>
                <h3 className="text-base font-medium">Delete Media File?</h3>
                <p className="mt-1 text-xs leading-5 text-white/60">
                  Attempting to delete <strong>{deleteTarget.file_name}</strong>. Files referenced in
                  any published page, draft, site setting, or blog post are protected.
                </p>
              </div>
            </div>

            {blockedRefs && blockedRefs.length > 0 && (
              <div className="mt-4 rounded-xl border border-red-500/40 bg-red-950/30 p-3.5 text-xs text-red-200">
                <p className="font-semibold">Cannot delete — image is currently in use on:</p>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-red-100/90">
                  {blockedRefs.map((ref, idx) => (
                    <li key={idx}>
                      {ref.title || ref.slug || "Content item"} ({ref.type}
                      {ref.section ? ` · ${ref.section}` : ""})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setDeleteTarget(null);
                  setBlockedRefs(null);
                }}
                className="rounded-lg border border-white/15 px-4 py-2 text-xs text-white/75 hover:text-white"
              >
                Close
              </button>
              {!blockedRefs && (
                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleConfirmDelete}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-500 disabled:opacity-50"
                >
                  {deleting ? "Checking..." : "Delete Image"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
