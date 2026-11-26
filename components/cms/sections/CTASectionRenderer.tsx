import Link from "next/link";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import CTASection from "@/components/CTASection";
import type { CTABannerContent } from "@/lib/cms/types";

export default function CTASectionRenderer({ content }: { content: CTABannerContent }) {
  const { variant = "standard" } = content;

  if (variant === "gold_glow_card") {
    return (
      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-20">
        <div className="relative overflow-hidden rounded-xl border border-textGold/20 bg-[radial-gradient(ellipse_at_80%_0%,rgba(205,162,116,0.12),transparent_45%),linear-gradient(120deg,#11100e,#080808_70%)] px-4 py-6 sm:px-9 sm:py-11 lg:flex lg:items-center lg:justify-between lg:gap-10">
          <div className="max-w-2xl">
            {content.eyebrow && (
              <p className="text-[9px] uppercase tracking-[0.22em] text-textGold">
                {content.eyebrow}
              </p>
            )}
            <h2 className="mt-3 text-2xl font-light leading-tight sm:text-4xl">
              {content.heading}
            </h2>
            {content.description && (
              <p className="mt-3 text-sm leading-6 text-white/55">{content.description}</p>
            )}
          </div>
          {content.primaryButton && (
            <Link
              href={content.primaryButton.href}
              className="mt-6 inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-full border border-textGold/50 px-6 text-[9px] font-semibold uppercase tracking-[0.18em] text-textGold transition-colors hover:bg-textGold hover:text-black lg:mt-0"
            >
              {content.primaryButton.label} <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </section>
    );
  }

  if (variant === "workshop_notice") {
    return (
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-col gap-6 rounded-2xl border border-textGold/20 bg-textGold/[0.03] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div>
            {content.eyebrow && (
              <p className="text-[9px] uppercase tracking-[0.24em] text-textGold">
                {content.eyebrow}
              </p>
            )}
            <h3 className="mt-1 text-xl font-light text-white sm:text-2xl">
              {content.heading}
            </h3>
            {content.description && (
              <p className="mt-2 max-w-2xl text-xs leading-6 text-white/60 sm:text-sm">
                {content.description}
              </p>
            )}
          </div>
          {content.primaryButton && (
            <Link
              href={content.primaryButton.href}
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full border border-textGold bg-textGold px-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-white"
            >
              {content.primaryButton.label} <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </section>
    );
  }

  if (variant === "split_dark_card") {
    return (
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="rounded-2xl border border-white/10 bg-[#090909] p-6 sm:p-10 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              {content.eyebrow && (
                <p className="mb-2 text-[10px] uppercase tracking-[0.24em] text-textGold">
                  {content.eyebrow}
                </p>
              )}
              <h2 className="text-2xl font-light text-white sm:text-3xl">
                {content.heading}
              </h2>
              {content.description && (
                <p className="mt-3 text-sm leading-6 text-white/60">{content.description}</p>
              )}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              {content.primaryButton && (
                <Link
                  href={content.primaryButton.href}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-textGold bg-textGold px-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-white"
                >
                  {content.primaryButton.label} <ArrowRight size={14} />
                </Link>
              )}
              {content.secondaryButton && (
                <Link
                  href={content.secondaryButton.href}
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-6 text-[10px] uppercase tracking-[0.18em] text-white transition hover:border-textGold hover:text-textGold"
                >
                  {content.secondaryButton.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === "centered_help_card") {
    return (
      <section className="mx-auto max-w-5xl px-4 pb-12 sm:px-6 sm:pb-20">
        <div className="rounded-2xl border border-white/10 bg-[#080808] p-8 text-center sm:p-12">
          {content.eyebrow && (
            <p className="text-[10px] uppercase tracking-[0.24em] text-textGold">
              {content.eyebrow}
            </p>
          )}
          <h2 className="mt-2 text-2xl font-light text-white sm:text-3xl">
            {content.heading}
          </h2>
          {content.description && (
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/55">
              {content.description}
            </p>
          )}

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {content.primaryButton && (
              <a
                href={content.primaryButton.href}
                target={content.primaryButton.external ? "_blank" : undefined}
                rel={content.primaryButton.external ? "noopener noreferrer" : undefined}
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-textGold bg-textGold px-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-white"
              >
                <MessageCircle size={16} /> {content.primaryButton.label}
              </a>
            )}
            {content.secondaryButton && (
              <a
                href={content.secondaryButton.href}
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 px-6 text-[10px] uppercase tracking-[0.18em] text-white transition hover:border-textGold hover:text-textGold"
              >
                <Phone size={15} /> {content.secondaryButton.label}
              </a>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <CTASection
      eyebrow={content.eyebrow}
      title={content.heading}
      description={content.description}
      primaryLabel={content.primaryButton?.label}
      primaryHref={content.primaryButton?.href}
      secondaryLabel={content.secondaryButton?.label}
      secondaryHref={content.secondaryButton?.href}
    />
  );
}
