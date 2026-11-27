"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

/**
 * Responsive filter toolbar keeping one single DOM tree for filter inputs:
 * - Primary search + apply remain one tap away on mobile and desktop
 * - Extra selects collapse/expand on narrow mobile viewports (< sm) without duplicating fields
 */
export default function AdminFilterBar({
  searchSlot,
  filtersSlot,
  tabsSlot,
  activeFiltersCount = 0,
  actionSlot,
  onSubmit,
}: {
  searchSlot?: ReactNode;
  filtersSlot?: ReactNode;
  tabsSlot?: ReactNode;
  activeFiltersCount?: number;
  actionSlot?: ReactNode;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
}) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(activeFiltersCount > 0);

  return (
    <div className="mb-6 space-y-3.5 border-b border-white/10 pb-5">
      {tabsSlot && (
        <div className="scrollbar-none -mx-1 flex flex-nowrap gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
          {tabsSlot}
        </div>
      )}

      {(searchSlot || filtersSlot || actionSlot) && (
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
            {searchSlot && <div className="min-w-0 flex-1">{searchSlot}</div>}

            {filtersSlot && (
              <div
                className={
                  mobileFiltersOpen
                    ? "order-3 grid gap-2.5 rounded-xl border border-white/10 bg-[#0b0b0b] p-3 sm:order-none sm:flex sm:items-center sm:gap-2.5 sm:border-0 sm:bg-transparent sm:p-0"
                    : "hidden sm:flex sm:items-center sm:gap-2.5"
                }
              >
                {filtersSlot}
              </div>
            )}

            {(filtersSlot || actionSlot) && (
              <div className="flex items-center gap-2 lg:shrink-0">
                {filtersSlot && (
                  <button
                    type="button"
                    onClick={() => setMobileFiltersOpen((v) => !v)}
                    aria-expanded={mobileFiltersOpen}
                    className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-white/15 bg-[#111] px-3.5 text-xs text-white/85 transition hover:border-textGold/60 sm:hidden"
                  >
                    <SlidersHorizontal size={14} className="text-textGold" />
                    <span>{mobileFiltersOpen ? "Hide Filters" : "Filters"}</span>
                    {activeFiltersCount > 0 && (
                      <span className="rounded-full bg-textGold px-1.5 py-0.5 text-[10px] font-semibold text-black">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>
                )}
                {actionSlot && <div className="flex-1 lg:flex-initial">{actionSlot}</div>}
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
