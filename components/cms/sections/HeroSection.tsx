import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import Hero from "@/components/hero";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import CmsImage from "../CmsImage";
import type { HeroBannerContent } from "@/lib/cms/types";

export default function HeroSection({ content }: { content: HeroBannerContent }) {
  const { variant = "page_hero" } = content;

  if (variant === "fullscreen_video") {
    return (
      <>
        {content.description && <h1 className="sr-only">{content.description}</h1>}
        <Hero
          eyebrow={content.eyebrow}
          heading={content.heading}
          subtitle={content.subtitle}
          primaryButton={{ label: "Get a Free Quote", href: "#quote-modal" }}
          secondaryButton={{ label: "Explore Collections", href: "/collections" }}
          scrollLabel={content.scrollAnchorLabel}
          videoDesktopWebm={content.videoDesktopWebm}
          videoDesktopMp4={content.videoDesktopMp4}
          videoMobileMp4={content.videoMobileMp4}
          videoPoster={content.videoPoster}
        />
      </>
    );
  }

  if (variant === "split_about") {
    return (
      <>
        {content.showBreadcrumbs !== false && content.breadcrumbs?.length ? (
          <Breadcrumbs items={content.breadcrumbs} />
        ) : null}
        <section className="mx-auto max-w-7xl px-4 pb-10 pt-5 sm:px-6 sm:pb-20 sm:pt-10">
          {content.eyebrow && (
            <div className="mb-6 flex items-center gap-3 text-[9px] uppercase tracking-[0.24em] text-textGold sm:mb-10">
              <span className="w-8 border-t border-textGold/70" /> {content.eyebrow}
            </div>
          )}
          <div className="grid gap-7 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-14">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-light leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
                {content.heading}{" "}
                {content.highlightText && (
                  <span className="text-textGold">{content.highlightText}</span>
                )}
              </h1>
              {content.description && (
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/60 sm:mt-7 sm:text-base sm:leading-8">
                  {content.description}
                </p>
              )}
              {(content.primaryButton || content.secondaryButton) && (
                <div className="mt-6 flex flex-col gap-2 sm:mt-9 sm:flex-row sm:items-center sm:gap-3">
                  {content.primaryButton && (
                    <Link
                      href={content.primaryButton.href}
                      className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-textGold/50 bg-textGold/10 px-6 text-[9px] font-semibold uppercase tracking-[0.18em] text-textGold transition-colors hover:bg-textGold hover:text-black"
                    >
                      {content.primaryButton.label} <ArrowUpRight size={15} />
                    </Link>
                  )}
                  {content.secondaryButton && (
                    <Link
                      href={content.secondaryButton.href}
                      className="inline-flex min-h-12 items-center justify-center gap-2 px-4 text-[9px] font-medium uppercase tracking-[0.18em] text-white/65 transition-colors hover:text-textGold"
                    >
                      {content.secondaryButton.label} <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              )}
            </div>

            <div className="relative mx-auto w-full max-w-xl pb-8 pr-6 sm:pb-10 sm:pr-10">
              <div className="absolute right-0 top-6 h-[78%] w-[80%] rounded-xl border border-textGold/25 sm:top-8" />
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-[#111]">
                <CmsImage
                  image={content.backgroundImage}
                  altFallback={content.heading}
                  priority
                  sizes="(max-width: 1024px) 90vw, 44vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />
                {(content.foregroundCaptionEyebrow || content.foregroundCaptionTitle) && (
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                    {content.foregroundCaptionEyebrow && (
                      <p className="text-[9px] uppercase tracking-[0.2em] text-textGold">
                        {content.foregroundCaptionEyebrow}
                      </p>
                    )}
                    {content.foregroundCaptionTitle && (
                      <p className="mt-2 text-lg font-light sm:text-xl">
                        {content.foregroundCaptionTitle}
                      </p>
                    )}
                  </div>
                )}
              </div>
              {content.foregroundImage && (
                <div className="absolute -bottom-1 right-0 w-[39%] overflow-hidden rounded-lg border-4 border-background shadow-xl sm:-bottom-2 sm:right-1 sm:w-[34%]">
                  <div className="relative aspect-[4/5]">
                    <CmsImage
                      image={content.foregroundImage}
                      altFallback={content.foregroundCaptionTitle || content.heading}
                      sizes="(max-width: 640px) 38vw, 180px"
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
              {content.locationBadge && (
                <div className="absolute bottom-1 left-0 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/80 px-3 py-2 text-[8px] uppercase tracking-[0.16em] text-white/70 backdrop-blur-sm sm:bottom-2 sm:px-4 sm:text-[9px]">
                  <MapPin size={12} className="text-textGold" /> {content.locationBadge}
                </div>
              )}
            </div>
          </div>
          {content.scrollAnchorLabel && (
            <a
              href={content.scrollAnchorHref || "#our-approach"}
              className="mt-10 hidden w-fit items-center gap-3 text-[9px] uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-textGold sm:mt-14 sm:flex"
            >
              {content.scrollAnchorLabel} <ArrowDown size={13} />
            </a>
          )}
        </section>
      </>
    );
  }

  if (variant === "products_hero") {
    return (
      <section className="relative overflow-hidden border-b border-white/10 px-4 pb-8 pt-6 sm:px-6 sm:pb-12 sm:pt-16 lg:pb-14 lg:pt-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-48 h-[34rem] w-[34rem] rounded-full border border-textGold/10 sm:right-[-6rem] sm:top-[-19rem]"
        >
          <div className="absolute inset-10 rounded-full border border-white/5" />
          <div className="absolute inset-24 rounded-full border border-white/5" />
        </div>
        <div className="relative mx-auto max-w-7xl">
          {content.eyebrow && (
            <div className="mb-5 flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-textGold sm:mb-6 sm:gap-3 sm:text-[10px] sm:tracking-[0.28em]">
              <span className="h-px w-8 bg-textGold" /> {content.eyebrow}
            </div>
          )}
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <h1 className="max-w-4xl text-[clamp(2.65rem,8vw,6rem)] font-light leading-[0.98] tracking-[-0.045em] sm:text-[clamp(3rem,7vw,6rem)]">
              {content.heading}{" "}
              {content.highlightText && (
                <span className="font-heading text-textGold">{content.highlightText}</span>
              )}
            </h1>
            <div className="max-w-md lg:justify-self-end">
              {content.description && (
                <p className="text-sm leading-7 text-white/60 sm:text-base">
                  {content.description}
                </p>
              )}
              {content.scrollAnchorLabel && (
                <a
                  href={content.scrollAnchorHref || "#collection"}
                  className="mt-7 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-white transition-colors hover:text-textGold"
                >
                  {content.scrollAnchorLabel} <ArrowDown size={15} strokeWidth={1.5} />
                </a>
              )}
            </div>
          </div>
          {content.badges && content.badges.length > 0 && (
            <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-white/10 pt-4 text-[9px] uppercase tracking-[0.12em] text-white/45 sm:mt-9 sm:grid-cols-4 sm:gap-5 sm:pt-4 sm:text-[10px] sm:tracking-[0.18em]">
              {content.badges.map((badge, idx) => (
                <div key={`${badge.label}-${idx}`}>
                  <span className="mb-2 block text-xl font-light tracking-normal text-white">
                    {badge.number || String(idx + 1).padStart(2, "0")}
                  </span>
                  {badge.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <PageHero
      eyebrow={content.eyebrow}
      title={
        <>
          {content.heading}{" "}
          {content.highlightText && (
            <span className="font-heading text-textGold">{content.highlightText}</span>
          )}
        </>
      }
      description={content.description || ""}
      breadcrumbs={content.showBreadcrumbs !== false ? content.breadcrumbs : undefined}
      primaryCta={
        content.primaryButton
          ? { label: content.primaryButton.label, href: content.primaryButton.href }
          : undefined
      }
      secondaryCta={
        content.secondaryButton
          ? { label: content.secondaryButton.label, href: content.secondaryButton.href }
          : undefined
      }
      badges={content.badges?.map((b) => b.label)}
    />
  );
}
