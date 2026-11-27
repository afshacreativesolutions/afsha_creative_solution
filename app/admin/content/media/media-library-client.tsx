"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Copy,
  Expand,
  ImagePlus,
  Loader2,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import AdminConfirmDialog from "@/components/admin/AdminConfirmDialog";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import {
  ADMIN_BTN_PRIMARY,
  ADMIN_BTN_SECONDARY,
  ADMIN_INPUT_CLASS,
} from "@/components/admin/admin-styles";
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

  const [previewItem, setPreviewItem] = useState<CmsMediaRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CmsMediaRecord | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [blockedRefs, setBlockedRefs] = useState<ReferenceInfo[] | null>(null);

  useEffect(() => {
    if (!previewItem) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewItem(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [previewItem]);

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
      if (previewItem?.id === uploaded.id) setPreviewItem(uploaded);
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
      if (previewItem?.id === id) setPreviewItem(data.media!);
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
      if (previewItem?.id === deleteTarget.id) setPreviewItem(null);
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
          The CMS database tables (`cms_media`) are not created yet. Apply{" "}
          <code className="text-amber-100">supabase/migrations/202611260001_cms_and_media.sql</code>{" "}
          before uploading media.
        </div>
      )}

      {statusMessage && (
        <div
          role="status"
          className={`flex items-center justify-between gap-2 rounded-xl border px-4 py-3 text-xs ${
            statusMessage.type === "success"
              ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-200"
              : "border-red-500/40 bg-red-950/30 text-red-200"
          }`}
        >
          <span>{statusMessage.text}</span>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            aria-label="Dismiss notification"
            className="inline-flex min-h-9 min-w-9 items-center justify-center rounded hover:bg-white/10"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Upload Box */}
      <section className="rounded-xl border border-white/10 bg-[#0d0d0d] p-4 sm:p-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-textGold">
              Upload Website Media
            </p>
            <h2 className="mt-1 text-base font-light sm:text-lg">
              Add WebP, JPEG, PNG, or AVIF images (Max 8 MB)
            </h2>
          </div>
          <div className="text-xs text-white/50">
            {mediaList.length} files · {formatFileSize(totalBytes)} total
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            type="text"
            value={newAlt}
            onChange={(e) => setNewAlt(e.target.value)}
            placeholder="Optional alt description before upload..."
            aria-label="New upload alt text"
            className={ADMIN_INPUT_CLASS}
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
              className={`${ADMIN_BTN_PRIMARY} w-full sm:w-auto`}
            >
              {uploading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload size={15} />
                  <span>Choose &amp; Upload Image</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative min-w-0 flex-1 sm:max-w-md">
          <Search
            size={15}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by file name or alt text..."
            aria-label="Search media files"
            className={`${ADMIN_INPUT_CLASS} pl-10`}
          />
        </div>

        <div className="scrollbar-none -mx-1 flex flex-nowrap gap-1.5 overflow-x-auto px-1 sm:flex-wrap sm:overflow-visible">
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
              className={`inline-flex min-h-11 shrink-0 items-center rounded-lg border px-3.5 text-[11px] uppercase tracking-[0.12em] transition ${
                mimeFilter === opt.value
                  ? "border-textGold/60 bg-textGold/15 font-medium text-textGold"
                  : "border-white/10 text-white/60 hover:text-white"
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

      {/* Responsive Media Grid (2 columns mobile, 3 tablet, 4 desktop) */}
      {filtered.length === 0 ? (
        <AdminEmptyState
          icon={<ImagePlus size={28} />}
          title="No media files match your filter"
          description="Upload a new photo above or clear your search/format filter."
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0d0d0d]"
            >
              <button
                type="button"
                onClick={() => setPreviewItem(item)}
                aria-label={`Preview ${item.file_name}`}
                className="group relative aspect-[4/3] w-full overflow-hidden bg-black text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-textGold"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.public_url}
                  alt={item.alt_text || item.file_name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <span className="absolute left-2 top-2 rounded bg-black/80 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.14em] text-textGold">
                  {item.mime_type.replace("image/", "")}
                </span>
                <span className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/75 text-white/80 opacity-0 transition group-hover:opacity-100">
                  <Expand size={13} />
                </span>
              </button>

              <div className="flex flex-1 flex-col gap-2.5 p-3 sm:p-4">
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-white sm:text-sm">
                    {item.file_name}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-white/45">
                    {item.width && item.height ? `${item.width} × ${item.height} · ` : ""}
                    {formatFileSize(item.file_size)}
                  </p>
                </div>

                <div className="flex flex-col gap-1.5 sm:flex-row">
                  <input
                    type="text"
                    value={altInputs[item.id] ?? ""}
                    onChange={(e) =>
                      setAltInputs((prev) => ({ ...prev, [item.id]: e.target.value }))
                    }
                    placeholder="Alt text..."
                    aria-label={`Alt text for ${item.file_name}`}
                    className="min-h-10 min-w-0 flex-1 rounded-lg border border-white/15 bg-[#121212] px-2.5 text-sm text-white focus:border-textGold focus:outline-none sm:text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveAlt(item.id)}
                    disabled={savingAltId === item.id}
                    className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-[#131313] px-3 text-[11px] uppercase tracking-[0.1em] text-white/85 hover:border-textGold hover:text-textGold"
                  >
                    {savingAltId === item.id ? (
                      "..."
                    ) : savedAltId === item.id ? (
                      <Check size={14} className="text-emerald-400" />
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>

                <div className="mt-auto grid grid-cols-3 gap-1.5 border-t border-white/10 pt-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(item.public_url);
                      setCopiedId(item.id);
                      setTimeout(() => setCopiedId(null), 1500);
                    }}
                    title="Copy public URL"
                    aria-label={`Copy URL for ${item.file_name}`}
                    className="inline-flex min-h-11 items-center justify-center gap-1 rounded-lg border border-white/10 px-1.5 text-[10px] uppercase text-white/75 hover:border-white/30 hover:text-white"
                  >
                    <Copy size={12} />
                    <span className="truncate">{copiedId === item.id ? "Copied" : "Copy"}</span>
                  </button>

                  <button
                    type="button"
                    disabled={replacingId === item.id}
                    onClick={() => {
                      if (replaceInputRef.current) {
                        replaceInputRef.current.dataset.targetId = item.id;
                        replaceInputRef.current.click();
                      }
                    }}
                    title="Replace image file"
                    aria-label={`Replace ${item.file_name}`}
                    className="inline-flex min-h-11 items-center justify-center gap-1 rounded-lg border border-white/15 px-1.5 text-[10px] uppercase text-white/80 hover:border-textGold hover:text-textGold"
                  >
                    <RefreshCw size={12} />
                    <span className="truncate">Replace</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBlockedRefs(null);
                      setDeleteTarget(item);
                    }}
                    title="Delete image"
                    aria-label={`Delete ${item.file_name}`}
                    className="inline-flex min-h-11 items-center justify-center rounded-lg border border-red-500/30 text-red-300/85 hover:border-red-500 hover:bg-red-950/40 hover:text-red-200"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Responsive Image Preview Dialog */}
      {previewItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Image preview: ${previewItem.file_name}`}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/85 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewItem(null);
          }}
        >
          <div className="flex max-h-[92svh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-white/15 bg-[#0a0a0a] text-white shadow-2xl sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3.5 sm:px-6">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.18em] text-textGold">
                  Media Asset Details
                </p>
                <h2 className="mt-0.5 truncate text-sm font-medium sm:text-base">
                  {previewItem.file_name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                aria-label="Close image preview"
                className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg border border-white/15 text-white/70 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6">
              <div className="overflow-hidden rounded-xl border border-white/10 bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewItem.public_url}
                  alt={previewItem.alt_text || previewItem.file_name}
                  className="max-h-[45vh] w-full object-contain"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 rounded-xl border border-white/10 bg-[#111] p-3.5 text-xs sm:grid-cols-3">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-white/45">
                    Format
                  </span>
                  <p className="mt-0.5 uppercase text-textGold">{previewItem.mime_type}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-white/45">
                    Dimensions
                  </span>
                  <p className="mt-0.5 text-white">
                    {previewItem.width && previewItem.height
                      ? `${previewItem.width} × ${previewItem.height} px`
                      : "Unknown"}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-white/45">
                    File Size
                  </span>
                  <p className="mt-0.5 text-white">{formatFileSize(previewItem.file_size)}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(previewItem.public_url);
                    setCopiedId(previewItem.id);
                    setTimeout(() => setCopiedId(null), 1500);
                  }}
                  className={`${ADMIN_BTN_SECONDARY} w-full sm:w-auto`}
                >
                  <Copy size={14} />
                  <span>{copiedId === previewItem.id ? "Copied URL!" : "Copy Image URL"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (replaceInputRef.current) {
                      replaceInputRef.current.dataset.targetId = previewItem.id;
                      replaceInputRef.current.click();
                    }
                  }}
                  className={`${ADMIN_BTN_SECONDARY} w-full sm:w-auto`}
                >
                  <RefreshCw size={14} />
                  <span>Replace File</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Safe Delete Confirmation Dialog */}
      <AdminConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={() => {
          setDeleteTarget(null);
          setBlockedRefs(null);
        }}
        onConfirm={blockedRefs ? undefined : handleConfirmDelete}
        title="Delete Media File?"
        description={
          deleteTarget
            ? `Attempting to delete "${deleteTarget.file_name}". Files referenced across published pages, drafts, site settings, or blog posts are automatically protected.`
            : undefined
        }
        confirmLabel={deleting ? "Checking..." : "Delete Image"}
        cancelLabel="Close"
        tone="danger"
        busy={deleting}
      >
        {blockedRefs && blockedRefs.length > 0 && (
          <div className="rounded-xl border border-red-500/40 bg-red-950/35 p-3.5 text-xs text-red-200">
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
      </AdminConfirmDialog>
    </div>
  );
}
