import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type AdminBreadcrumbItem = {
  label: string;
  href?: string;
};

export default function AdminBreadcrumbs({ items }: { items: AdminBreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-white/55">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} className="inline-flex min-w-0 items-center gap-1.5">
              {idx > 0 && <ChevronRight size={13} className="shrink-0 text-white/30" />}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  prefetch={false}
                  className="inline-flex min-h-10 items-center rounded px-1 text-white/65 transition hover:text-textGold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-textGold"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={`inline-flex min-h-10 items-center truncate px-1 ${
                    isLast ? "font-medium text-textGold" : "text-white/60"
                  }`}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
