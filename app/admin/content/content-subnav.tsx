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
  const pathname = usePathname() || "/admin/content";

  return (
    <nav
      aria-label="Website content sections"
      className="scrollbar-none -mx-1 mb-6 flex flex-nowrap items-center gap-2 overflow-x-auto border-b border-white/10 px-1 pb-4 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
    >
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
            prefetch={false}
            aria-current={active ? "page" : undefined}
            className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border px-4 text-xs font-medium uppercase tracking-[0.12em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-textGold ${
              active
                ? "border-textGold/60 bg-textGold/15 text-textGold"
                : "border-white/10 bg-[#0b0b0b] text-white/65 hover:border-white/25 hover:text-white"
            }`}
          >
            <Icon size={15} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
