"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "./actions";
import { SubmitButton } from "./submit-button";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/campaigns", label: "Campaigns" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/consent", label: "Consent" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/content", label: "Website Content" },
  { href: "/admin/settings/integrations", label: "Integrations" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3 border-b border-white/10 bg-[#060606] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-8 sm:py-4">
      <Link
        href="/admin"
        prefetch={false}
        onMouseEnter={() => router.prefetch("/admin")}
        className="text-[10px] font-semibold uppercase tracking-[0.2em] text-textGold sm:text-xs transition-colors hover:text-white"
      >
        Afsha · Executive Suite
      </Link>
      <nav
        aria-label="Admin navigation"
        className="scrollbar-none -mx-4 flex max-w-[calc(100%+2rem)] items-center gap-1 overflow-x-auto px-4 text-[9px] uppercase tracking-[0.12em] sm:mx-0 sm:max-w-full sm:gap-2 sm:px-0 sm:text-[10px] sm:tracking-[0.14em]"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <div key={item.href} className="flex items-center">
              {item.href === "/admin/products" && (
                <span className="mx-2 h-4 w-px bg-white/10 shrink-0" aria-hidden="true" />
              )}
              <Link
                href={item.href}
                prefetch={false}
                onMouseEnter={() => router.prefetch(item.href)}
                className={`min-h-10 shrink-0 px-2.5 py-3 transition-colors ${
                  isActive
                    ? "border-b-2 border-textGold font-semibold text-textGold"
                    : "text-white/55 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            </div>
          );
        })}
        <span className="mx-2 h-4 w-px bg-white/10 shrink-0" aria-hidden="true" />
        <Link
          href="/"
          target="_blank"
          prefetch={false}
          className="min-h-10 shrink-0 px-2.5 py-3 text-white/55 hover:text-white transition-colors"
        >
          View site
        </Link>
        <form action={signOut} className="shrink-0 ml-1">
          <SubmitButton
            loadingText="Signing out..."
            className="min-h-10 px-2.5 py-3 text-white/55 hover:text-textGold transition-colors disabled:opacity-40"
          >
            Sign out
          </SubmitButton>
        </form>
      </nav>
    </div>
  );
}
