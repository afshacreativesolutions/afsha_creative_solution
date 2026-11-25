import Link from "next/link";
import { signOut } from "./actions";
import { SubmitButton } from "./submit-button";

export default function AdminNav() {
  return (
    <div className="flex flex-col gap-3 border-b border-white/10 bg-[#060606] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-8 sm:py-4">
      <Link
        href="/admin"
        className="text-[10px] font-semibold uppercase tracking-[0.2em] text-textGold sm:text-xs"
      >
        Afsha · Executive Suite
      </Link>
      <nav
        aria-label="Admin navigation"
        className="scrollbar-none -mx-4 flex max-w-[calc(100%+2rem)] items-center gap-4 overflow-x-auto px-4 text-[9px] uppercase tracking-[0.12em] text-white/55 sm:mx-0 sm:max-w-full sm:gap-5 sm:px-0 sm:text-[10px] sm:tracking-[0.14em]"
      >
        <Link href="/admin" className="min-h-10 shrink-0 py-3 hover:text-white">
          Overview
        </Link>
        <Link href="/admin/leads" className="min-h-10 shrink-0 py-3 hover:text-white">
          Leads
        </Link>
        <Link href="/admin/customers" className="min-h-10 shrink-0 py-3 hover:text-white">
          Customers
        </Link>
        <Link href="/admin/analytics" className="min-h-10 shrink-0 py-3 hover:text-white">
          Analytics
        </Link>
        <Link href="/admin/campaigns" className="min-h-10 shrink-0 py-3 hover:text-white">
          Campaigns
        </Link>
        <Link href="/admin/messages" className="min-h-10 shrink-0 py-3 hover:text-white">
          Messages
        </Link>
        <Link href="/admin/consent" className="min-h-10 shrink-0 py-3 hover:text-white">
          Consent
        </Link>
        <span className="h-4 w-px bg-white/10 shrink-0" aria-hidden="true" />
        <Link href="/admin/products" className="min-h-10 shrink-0 py-3 hover:text-white">
          Products
        </Link>
        <Link href="/admin/categories" className="min-h-10 shrink-0 py-3 hover:text-white">
          Categories
        </Link>
        <Link href="/admin/blog" className="min-h-10 shrink-0 py-3 hover:text-white">
          Blog
        </Link>
        <Link href="/admin/settings/integrations" className="min-h-10 shrink-0 py-3 hover:text-textGold">
          Integrations
        </Link>
        <span className="h-4 w-px bg-white/10 shrink-0" aria-hidden="true" />
        <Link href="/" target="_blank" className="min-h-10 shrink-0 py-3 hover:text-white">
          View site
        </Link>
        <form action={signOut} className="shrink-0">
          <SubmitButton
            loadingText="Signing out..."
            className="min-h-10 py-3 hover:text-textGold transition-colors disabled:opacity-40"
          >
            Sign out
          </SubmitButton>
        </form>
      </nav>
    </div>
  );
}
