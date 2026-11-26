import { ArrowUpRight, MapPin } from "lucide-react";
import Link from "next/link";
import Videos from "@/components/Videos";
import CmsImage from "../CmsImage";
import type { ImageTextContent } from "@/lib/cms/types";

export default function ImageTextSection({ content }: { content: ImageTextContent }) {
  const { variant = "standard_split" } = content;

  if (variant === "video_showcase") {
    return (
      <Videos
        eyebrow={content.eyebrow}
        heading={content.heading}
        description={content.paragraphs?.[0] || ""}
        ctaLabel={content.cta?.label}
        ctaHref={content.cta?.href}
        videoPrimaryUrl={content.videoPrimaryUrl}
        videoPrimaryPoster={content.videoPrimaryPoster}
        videoSecondaryUrl={content.videoSecondaryUrl}
        videoSecondaryPoster={content.videoSecondaryPoster}
      />
    );
  }

  if (variant === "owner_spotlight") {
    return (
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[0.82fr_1fr] lg:items-center lg:gap-14">
          <div className="group relative flex aspect-[4/3] min-h-[230px] items-end overflow-hidden rounded-xl border border-white/10 bg-[#080808] sm:min-h-[300px]">
            <CmsImage
              image={content.image}
              altFallback={content.imageBadgeTitle || content.heading}
              priority
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover object-[center_1%] transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/20"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_10%,rgba(205,162,116,0.20),transparent_55%)]"
            />
            {(content.imageBadgeEyebrow || content.imageBadgeTitle) && (
              <div className="relative z-20 p-5 sm:p-7">
                {content.imageBadgeEyebrow && (
                  <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#D4A66A]">
                    {content.imageBadgeEyebrow}
                  </p>
                )}
                {content.imageBadgeTitle && (
                  <p className="mt-1 text-xs font-semibold text-white/70">
                    {content.imageBadgeTitle}
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            {content.eyebrow && (
              <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-textGold">
                {content.eyebrow}
              </p>
            )}
            <h2 className="text-3xl font-light leading-tight sm:text-4xl">{content.heading}</h2>
            {content.paragraphs?.map((para, idx) => (
              <p key={idx} className="mt-4 text-sm leading-7 text-white/55">
                {para}
              </p>
            ))}
            {content.addressText && (
              <a
                href={content.addressHref || "#"}
                target={content.addressHref?.startsWith("http") ? "_blank" : undefined}
                rel={content.addressHref?.startsWith("http") ? "noreferrer" : undefined}
                className="mt-5 inline-flex min-h-11 items-center gap-3 text-sm text-white/75 transition-colors hover:text-textGold"
              >
                <MapPin size={16} className="shrink-0 text-textGold" />
                <span>{content.addressText}</span>
                <ArrowUpRight size={14} className="shrink-0" />
              </a>
            )}
          </div>
        </div>
      </section>
    );
  }

  const imageLeft = content.imagePosition === "left";

  return (
    <section
      id={content.sectionId}
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20"
    >
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className={imageLeft ? "lg:order-2" : ""}>
          {content.eyebrow && (
            <p className="mb-2 text-[10px] uppercase tracking-[0.24em] text-textGold">
              {content.eyebrow}
            </p>
          )}
          <h2 className="text-2xl font-light text-white sm:text-4xl">{content.heading}</h2>
          {content.paragraphs?.map((para, idx) => (
            <p
              key={idx}
              className={`${idx === 0 ? "mt-4" : "mt-3"} text-sm leading-7 text-white/60 sm:text-base`}
            >
              {para}
            </p>
          ))}

          {content.stats && content.stats.length > 0 && (
            variant === "location_intro_cards" ? (
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                {content.stats.map((stat, idx) => (
                  <div
                    key={`${stat.label}-${idx}`}
                    className="rounded-lg border border-white/10 bg-[#0d0d0d] p-4"
                  >
                    <span className="text-sm font-semibold text-textGold">{stat.value}</span>
                    <p className="mt-1 text-xs text-white/50">{stat.label}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 flex flex-wrap items-center gap-6 border-t border-white/10 pt-6">
                {content.stats.map((stat, idx) => (
                  <div key={`${stat.label}-${idx}`} className="flex items-center gap-6">
                    {idx > 0 && <div className="h-8 w-px bg-white/10" />}
                    <div>
                      <span className="block text-2xl font-light text-textGold">
                        {stat.value}
                      </span>
                      <span className="text-xs text-white/50">{stat.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {content.cta && (
            <Link
              href={content.cta.href}
              className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full border border-textGold bg-textGold/10 px-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-textGold transition hover:bg-textGold hover:text-black"
            >
              {content.cta.label} <ArrowUpRight size={14} />
            </Link>
          )}
        </div>

        <div
          className={`relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-[#111] ${
            imageLeft ? "lg:order-1" : ""
          }`}
        >
          <CmsImage
            image={content.image}
            altFallback={content.heading}
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          {(content.imageBadgeEyebrow || content.imageBadgeTitle) && (
            <div className="absolute bottom-5 left-5 right-5 rounded-lg border border-white/10 bg-black/70 p-4 backdrop-blur-md">
              {content.imageBadgeEyebrow && (
                <p className="text-[9px] uppercase tracking-[0.2em] text-textGold">
                  {content.imageBadgeEyebrow}
                </p>
              )}
              {content.imageBadgeTitle && (
                <p className="mt-1 text-xs text-white/80">{content.imageBadgeTitle}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
