"use client";

import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { signOut } from "@/app/admin/actions";
import { SubmitButton } from "@/app/admin/submit-button";
import AdminNavigation from "./AdminNavigation";

export default function AdminSidebar({
  pathname,
  collapsed,
}: {
  pathname: string;
  collapsed: boolean;
}) {
  return (
    <aside
      aria-label="Admin sidebar"
      className={`hidden shrink-0 flex-col border-r border-white/10 bg-[#060606] transition-[width] duration-200 motion-reduce:transition-none lg:flex ${
        collapsed ? "w-[76px]" : "w-64"
      }`}
    >
      <div className="flex h-16 items-center border-b border-white/10 px-4">
        <Link
          href="/admin"
          prefetch={false}
          aria-label="Afsha Executive Suite Overview"
          className={`flex min-h-11 w-full items-center gap-3 rounded-lg transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-textGold ${
            collapsed ? "justify-center" : "px-1"
          }`}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-textGold/50 bg-textGold/15 text-xs font-semibold tracking-widest text-textGold">
            AC
          </span>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold uppercase tracking-[0.2em] text-textGold">
                Afsha Suite
              </p>
              <p className="truncate text-[10px] uppercase tracking-[0.14em] text-white/45">
                Admin Console
              </p>
            </div>
          )}
        </Link>
      </div>

      <div className="flex-1 admin-sidebar-scroll px-2.5 py-4">
        <AdminNavigation pathname={pathname} collapsed={collapsed} idPrefix="desktop" />
      </div>

      <div className="space-y-2 border-t border-white/10 p-3">
        <Link
          href="/"
          target="_blank"
          prefetch={false}
          rel="noopener noreferrer"
          title="View public site"
          className={`flex min-h-11 items-center gap-2.5 rounded-lg border border-white/10 px-3 text-xs text-white/70 transition hover:border-textGold/50 hover:text-textGold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-textGold ${
            collapsed ? "justify-center px-2" : ""
          }`}
        >
          <ExternalLink size={15} className="shrink-0" />
          {!collapsed && <span>View Public Site</span>}
        </Link>

        <form action={signOut}>
          <SubmitButton
            loadingText="Signing out..."
            title="Sign out"
            className={`flex min-h-11 w-full items-center gap-2.5 rounded-lg border border-white/10 bg-[#0d0d0d] px-3 text-xs text-white/75 transition hover:border-red-500/40 hover:text-red-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-textGold disabled:opacity-45 ${
              collapsed ? "justify-center px-2" : ""
            }`}
          >
            <LogOut size={15} className="shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </SubmitButton>
        </form>
      </div>
    </aside>
  );
}
