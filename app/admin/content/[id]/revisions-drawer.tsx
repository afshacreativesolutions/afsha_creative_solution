"use client";

import { useEffect } from "react";
import { History, RotateCcw, X } from "lucide-react";
import type { CmsRevisionRecord } from "@/lib/cms/types";

export default function RevisionsDrawer({
  isOpen,
  onClose,
  revisions,
  onRestore,
  busy,
}: {
  isOpen: boolean;
  onClose: () => void;
  revisions: CmsRevisionRecord[];
  onRestore: (revisionId: string) => void;
  busy: boolean;
}) {
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, busy, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Page Revision History"
      onClick={(e) => {
        if (e.target === e.currentTarget && !busy) onClose();
      }}
    >
      <div className="flex h-full w-full max-w-md flex-col border-l border-white/15 bg-[#090909] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3.5 sm:px-5 sm:py-4">
          <div className="flex items-center gap-2">
            <History size={16} className="text-textGold" />
            <h2 className="text-base font-medium">Revision History</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close revision history"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-white/10 text-white/60 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
          {revisions.length === 0 ? (
            <p className="py-12 text-center text-xs text-white/45">
              No saved revisions yet. Revisions are recorded automatically every time you publish or
              save a snapshot.
            </p>
          ) : (
            revisions.map((rev) => (
              <div
                key={rev.id}
                className="rounded-xl border border-white/10 bg-[#111] p-4 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] ${
                      rev.revision_type === "publish"
                        ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-300"
                        : rev.revision_type === "restore"
                          ? "border-sky-500/40 bg-sky-950/40 text-sky-300"
                          : "border-white/20 bg-white/5 text-white/70"
                    }`}
                  >
                    {rev.revision_type}
                  </span>
                  <span className="text-[11px] text-white/45">
                    {new Date(rev.created_at).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {rev.note && <p className="mt-2 text-white/75">{rev.note}</p>}
                <p className="mt-1 text-[11px] text-white/45">
                  {rev.revision_data?.sections?.length ?? 0} sections · {rev.revision_data?.title}
                </p>

                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onRestore(rev.id)}
                  className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-lg border border-textGold/40 bg-textGold/10 px-3 text-xs font-medium text-textGold transition hover:bg-textGold hover:text-black disabled:opacity-45 sm:w-auto"
                >
                  <RotateCcw size={13} /> Restore to Draft
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
