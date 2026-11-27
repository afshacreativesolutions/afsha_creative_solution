"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";
import { ADMIN_BTN_DANGER, ADMIN_BTN_PRIMARY, ADMIN_BTN_SECONDARY } from "./admin-styles";

export default function AdminConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
  busy = false,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "gold";
  busy?: boolean;
  children?: ReactNode;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => cancelRef.current?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, busy, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-confirm-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !busy) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-t-2xl border border-white/15 bg-[#0a0a0a] p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-white shadow-2xl sm:rounded-2xl sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle
              size={20}
              className={`mt-0.5 shrink-0 ${
                tone === "danger" ? "text-amber-400" : "text-textGold"
              }`}
            />
            <div>
              <h2 id="admin-confirm-title" className="text-base font-medium text-white">
                {title}
              </h2>
              {description && (
                <p className="mt-1.5 text-xs leading-5 text-white/65">{description}</p>
              )}
            </div>
          </div>

          <button
            type="button"
            disabled={busy}
            onClick={onClose}
            aria-label="Close dialog"
            className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 text-white/60 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {children && <div className="mt-4">{children}</div>}

        <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <button
            ref={cancelRef}
            type="button"
            disabled={busy}
            onClick={onClose}
            className={`${ADMIN_BTN_SECONDARY} w-full sm:w-auto`}
          >
            {cancelLabel}
          </button>
          {onConfirm && (
            <button
              type="button"
              disabled={busy}
              onClick={onConfirm}
              className={`${
                tone === "danger" ? ADMIN_BTN_DANGER : ADMIN_BTN_PRIMARY
              } w-full sm:w-auto`}
            >
              {busy ? "Please wait..." : confirmLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
