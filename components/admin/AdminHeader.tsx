"use client";

import Link from "next/link";
import { ExternalLink, LogOut, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { signOut } from "@/app/admin/actions";
import { SubmitButton } from "@/app/admin/submit-button";
import { resolveActiveAdminSection } from "@/lib/admin-navigation";

export default function AdminHeader({
  pathname,
  mobileOpen,
  onOpenMobileDrawer,
  sidebarCollapsed,
  onToggleSidebar,
  menuButtonRef,
}: {
  pathname: string;
  mobileOpen: boolean;
  onOpenMobileDrawer: () => void;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  menuButtonRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const active = resolveActiveAdminSection(pathname);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#070707]/95 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div className="flex h-14 items-center justify-between gap-2 px-3 sm:h-16 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            ref={menuButtonRef}
            type="button"
            onClick={onOpenMobileDrawer}
            aria-label="Open admin navigation drawer"
            aria-expanded={mobileOpen}
            aria-controls="admin-mobile-drawer"
            className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-[#0f0f0f] text-white transition hover:border-textGold hover:text-textGold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-textGold lg:hidden"
          >
            <Menu size={20} />
          </button>

          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label={sidebarCollapsed ? "Expand navigation sidebar" : "Collapse navigation sidebar"}
            aria-pressed={sidebarCollapsed}
            className="hidden min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#0d0d0d] text-white/75 transition hover:border-textGold/60 hover:text-textGold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-textGold lg:inline-flex"
          >
            {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>

          <div className="min-w-0">
            <p className="hidden text-[10px] uppercase tracking-[0.2em] text-textGold sm:block">
              {active.groupLabel}
            </p>
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-medium text-white sm:text-base">
                {active.title}
              </span>
              <span className="rounded border border-textGold/30 bg-textGold/10 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.14em] text-textGold sm:hidden">
                Admin
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/"
            target="_blank"
            prefetch={false}
            rel="noopener noreferrer"
            aria-label="View public website"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-white/15 px-3 text-xs text-white/80 transition hover:border-textGold/60 hover:text-textGold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-textGold"
          >
            <ExternalLink size={15} />
            <span className="hidden sm:inline">View Site</span>
          </Link>

          <form action={signOut} className="hidden sm:block">
            <SubmitButton
              loadingText="Signing out..."
              className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-white/15 bg-[#101010] px-3 text-xs text-white/75 transition hover:border-red-400/50 hover:text-red-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-textGold disabled:opacity-45"
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </SubmitButton>
          </form>
        </div>
      </div>
    </header>
  );
}
