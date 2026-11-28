"use client";

import Link from "next/link";
import { ShieldCheck, Sliders } from "lucide-react";
import { useConsent } from "./ConsentProvider";

export default function CookieBanner() {
  const { isBannerVisible, acceptAll, rejectNonEssential, openSettings } = useConsent();

  if (!isBannerVisible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent banner"
      className="fixed inset-x-0 bottom-0 z-50 p-2 sm:p-5"
    >
      <div className="mx-auto max-w-5xl rounded-xl border border-textGold/30 bg-[#0d0d0d]/95 p-3.5 shadow-2xl backdrop-blur-md sm:rounded-2xl sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-5">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={15} className="shrink-0 text-textGold" />
              <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-textGold sm:text-xs">
                Cookie Preferences
              </h2>
            </div>
            <p className="max-w-3xl text-[11px] leading-relaxed text-white/75 sm:text-xs">
              We use essential cookies and optional analytics to improve browsing.{" "}
              <Link href="/faq" className="text-textGold underline underline-offset-2 hover:text-white">
                Privacy FAQ
              </Link>
              .
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={acceptAll}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-textGold px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-white sm:px-5"
            >
              Accept All
            </button>
            <button
              type="button"
              onClick={rejectNonEssential}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 bg-white/5 px-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition hover:border-white/40 hover:bg-white/10 sm:px-4"
            >
              Essential Only
            </button>
            <button
              type="button"
              onClick={openSettings}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-textGold/35 px-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-textGold transition hover:border-textGold hover:bg-textGold/10 sm:px-4"
            >
              <Sliders size={12} />
              Manage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
