"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ExternalLink, LogOut, X } from "lucide-react";
import { signOut } from "@/app/admin/actions";
import { SubmitButton } from "@/app/admin/submit-button";
import AdminNavigation from "./AdminNavigation";

export default function AdminMobileDrawer({
  isOpen,
  onClose,
  pathname,
  returnFocusRef,
}: {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
  returnFocusRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const drawerRef = useRef<HTMLElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const opener = returnFocusRef.current;

    const raf = requestAnimationFrame(() => {
      closeBtnRef.current?.focus();
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab" && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      if (opener && opener.isConnected) {
        opener.focus();
      }
    };
  }, [isOpen, onClose, returnFocusRef]);

  return (
    <div
      className={`fixed inset-0 z-50 lg:hidden ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      <div
        role="presentation"
        onClick={onClose}
        className={`fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-200 motion-reduce:transition-none ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        id="admin-mobile-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Admin navigation menu"
        className={`fixed inset-y-0 left-0 flex w-[min(86vw,320px)] flex-col border-r border-white/15 bg-[#070707] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] text-white shadow-2xl transition-transform duration-200 motion-reduce:transition-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-white/10 px-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-textGold/50 bg-textGold/15 text-[11px] font-semibold tracking-wider text-textGold">
              AC
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-textGold">
                Afsha Suite
              </p>
              <p className="text-[10px] text-white/45">Admin Menu</p>
            </div>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close admin navigation drawer"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-white/15 bg-[#111] text-white/80 hover:border-textGold hover:text-textGold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-textGold"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 admin-sidebar-scroll px-3 py-4">
          <AdminNavigation pathname={pathname} onNavigate={onClose} idPrefix="mobile" />
        </div>

        <div className="space-y-2 border-t border-white/10 p-3">
          <Link
            href="/"
            target="_blank"
            prefetch={false}
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-white/15 bg-[#101010] px-4 text-xs text-white/85 transition hover:border-textGold hover:text-textGold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-textGold"
          >
            <ExternalLink size={15} />
            <span>View Public Website</span>
          </Link>

          <form action={signOut}>
            <SubmitButton
              loadingText="Signing out..."
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-red-500/35 bg-red-950/25 px-4 text-xs font-medium text-red-200 transition hover:bg-red-950/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-textGold disabled:opacity-45"
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </SubmitButton>
          </form>
        </div>
      </aside>
    </div>
  );
}
