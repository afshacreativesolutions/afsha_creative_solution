"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, ImageIcon, Settings } from "lucide-react";

const TABS = [
  { href: "/admin/content", label: "Pages", icon: FileText, exact: true },
  { href: "/admin/content/media", label: "Media Library", icon: ImageIcon, exact: false },
  { href: "/admin/content/settings", label: "Site Settings & Navigation", icon: Settings, exact: false },
];

export default function ContentSubnav() {
  const pathname = usePathname();

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
      {TABS.map(({ href, label, icon: Icon, exact }) => {
        const active = exact
          ? pathname === href ||
            (pathname.startsWith("/admin/content/") &&
              !pathname.startsWith("/admin/content/media") &&
              !pathname.startsWith("/admin/content/settings"))
          : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors ${
              active
                ? "border-textGold/60 bg-textGold/15 text-textGold"
                : "border-white/10 bg-[#0b0b0b] text-white/60 hover:border-white/25 hover:text-white"
            }`}
          >
            <Icon size={14} />
            <span>{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
