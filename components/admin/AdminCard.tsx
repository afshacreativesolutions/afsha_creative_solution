import type { ReactNode } from "react";

export default function AdminCard({
  title,
  eyebrow,
  description,
  headerAction,
  children,
  className = "",
  noPadding = false,
}: {
  title?: string;
  eyebrow?: string;
  description?: string;
  headerAction?: ReactNode;
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}) {
  return (
    <section
      className={`rounded-xl border border-white/10 bg-[#0d0d0d] min-w-0 max-w-full overflow-hidden ${
        noPadding ? "" : "p-4 sm:p-6"
      } ${className}`}
    >
      {(title || eyebrow || headerAction) && (
        <div
          className={`flex flex-wrap items-start justify-between gap-3 min-w-0 max-w-full ${
            noPadding ? "border-b border-white/10 px-4 py-4 sm:px-6" : "mb-4 border-b border-white/10 pb-3.5"
          }`}
        >
          <div className="min-w-0 flex-1">
            {eyebrow && (
              <p className="text-[10px] uppercase tracking-[0.2em] text-textGold">{eyebrow}</p>
            )}
            {title && (
              <h2 className="mt-0.5 text-sm font-medium uppercase tracking-[0.14em] text-white sm:text-base break-words">
                {title}
              </h2>
            )}
            {description && <p className="mt-1 text-xs text-white/50 break-words">{description}</p>}
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
