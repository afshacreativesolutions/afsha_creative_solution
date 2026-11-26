import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import CmsImage from "../CmsImage";
import type { CardGridContent } from "@/lib/cms/types";

export default function CardGridSection({ content }: { content: CardGridContent }) {
  const { variant = "standard", columns = 3, cards = [] } = content;

  const gridCols =
    columns === 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : columns === 2
        ? "sm:grid-cols-2"
        : "sm:grid-cols-2 lg:grid-cols-3";

  if (variant === "numbered_collection") {
    return (
      <section id={content.sectionId} className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-16">
        <div className="mb-6 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div>
            {content.eyebrow && (
              <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-textGold">
                {content.eyebrow}
              </p>
            )}
            <h2 className="text-2xl font-light tracking-tight sm:text-4xl">{content.heading}</h2>
          </div>
          {content.headerLink && (
            <Link
              href={content.headerLink.href}
              className="inline-flex min-h-11 items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-white/65 transition-colors hover:text-textGold"
            >
              {content.headerLink.label} <ArrowRight size={14} />
            </Link>
          )}
        </div>
        {content.description && (
          <p className="mb-8 max-w-3xl text-sm leading-7 text-white/60 sm:mb-10 sm:text-base">
            {content.description}
          </p>
        )}
        <div className={`grid gap-3 sm:gap-4 ${gridCols}`}>
          {cards.map((item, idx) => (
            <Link
              key={item.id || `${item.title}-${idx}`}
              href={item.link || "/products"}
              className="group flex min-h-[230px] flex-col rounded-xl border border-white/10 bg-[#080808] p-5 transition duration-300 hover:-translate-y-1 hover:border-textGold/35 sm:p-6"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] tracking-[0.2em] text-white/35">
                  {item.number || String(idx + 1).padStart(2, "0")} / COLLECTION
                </span>
                <ArrowUpRight
                  size={16}
                  className="text-white/35 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-textGold"
                />
              </div>
              <h3 className="mt-7 text-lg font-light text-textGold sm:text-xl">{item.title}</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-white/55">{item.description}</p>
              <span className="mt-auto inline-flex items-center gap-2 pt-5 text-[9px] font-medium uppercase tracking-[0.18em] text-white/65 transition-colors group-hover:text-textGold">
                {item.buttonText || "Explore"}
                <ArrowRight size={13} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  if (variant === "numbered_cards") {
    return (
      <section id={content.sectionId} className="border-y border-white/10 bg-[#050505]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-20">
          <div className="grid gap-5 md:grid-cols-[0.85fr_1.15fr] md:items-end md:gap-12">
            <div>
              {content.eyebrow && (
                <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-textGold">
                  {content.eyebrow}
                </p>
              )}
              <h2 className="text-3xl font-light tracking-tight sm:text-5xl">{content.heading}</h2>
            </div>
            {content.description && (
              <p className="max-w-2xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
                {content.description}
              </p>
            )}
          </div>

          <div className="mt-8 grid gap-3 sm:mt-11 sm:gap-4 md:grid-cols-3">
            {cards.map((card, idx) => (
              <article
                key={card.id || `${card.title}-${idx}`}
                className="rounded-xl border border-white/10 bg-[#090909] p-4 transition-colors hover:border-textGold/30 sm:min-h-52 sm:p-6"
              >
                <span className="text-[10px] tracking-[0.2em] text-textGold">
                  {card.eyebrow || `${card.number || String(idx + 1).padStart(2, "0")} / OUR APPROACH`}
                </span>
                <h3 className="mt-5 text-lg font-light sm:mt-6 sm:text-xl">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/50">{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "assurance_strip") {
    const isDarker = content.background === "darker";
    return (
      <section
        id={content.sectionId}
        className={`${isDarker ? "border-t border-white/10 bg-[#080808]" : ""} px-4 py-12 sm:px-6 sm:py-16`}
      >
        <div className="mx-auto max-w-7xl">
          {(content.eyebrow || content.heading) && (
            <SectionHeading
              eyebrow={content.eyebrow}
              title={content.heading}
              description={content.description}
            />
          )}
          <div className={`grid gap-6 lg:gap-8 ${gridCols}`}>
            {cards.map((card, idx) => (
              <div
                key={card.id || `${card.title}-${idx}`}
                className={`rounded-xl border border-white/10 p-6 ${
                  isDarker ? "bg-[#0d0d0d]" : "bg-[#090909]"
                }`}
              >
                {card.eyebrow && (
                  <span className="text-[10px] uppercase tracking-[0.2em] text-textGold">
                    {card.eyebrow}
                  </span>
                )}
                <h3 className="mt-3 text-base font-light text-white sm:text-lg">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/55">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "location_collection") {
    return (
      <section
        id={content.sectionId}
        className="border-t border-white/10 bg-[#050505] px-4 py-12 sm:px-6 sm:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={content.eyebrow}
            title={content.heading}
            description={content.description}
            link={content.headerLink ? { label: content.headerLink.label, href: content.headerLink.href } : undefined}
          />
          <div className={`grid gap-6 ${gridCols}`}>
            {cards.map((card, idx) => (
              <div
                key={card.id || `${card.title}-${idx}`}
                className="group flex flex-col justify-between rounded-xl border border-white/10 bg-[#080808] p-5 transition duration-300 hover:border-textGold/40 hover:bg-[#0c0c0c]"
              >
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#111]">
                    <CmsImage
                      image={card.image}
                      altFallback={card.title}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  {card.eyebrow && (
                    <p className="mt-4 text-[9px] uppercase tracking-[0.2em] text-textGold">
                      {card.eyebrow}
                    </p>
                  )}
                  <h3 className="mt-1 text-lg font-light text-white transition-colors group-hover:text-textGold">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-white/55">{card.description}</p>
                  {card.features && card.features.length > 0 && (
                    <ul className="mt-4 space-y-1.5 border-t border-white/5 pt-3">
                      {card.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-[11px] text-white/50">
                          <Check size={12} className="text-textGold" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {card.link && (
                  <div className="mt-6 border-t border-white/10 pt-3">
                    <Link
                      href={card.link}
                      className="inline-flex min-h-10 w-full items-center justify-between text-[10px] font-medium uppercase tracking-[0.16em] text-textGold transition hover:text-white"
                    >
                      <span>{card.buttonText || "Request Quote"}</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Default & capability_cards
  return (
    <section
      id={content.sectionId}
      className={`${
        content.background === "darker" ? "border-y border-white/10 bg-[#050505]" : ""
      } mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20`}
    >
      <SectionHeading
        eyebrow={content.eyebrow}
        title={content.heading}
        description={content.description}
        link={content.headerLink ? { label: content.headerLink.label, href: content.headerLink.href } : undefined}
      />

      <div className={`grid gap-6 ${gridCols}`}>
        {cards.map((item, index) => (
          <div
            key={item.id || `${item.title}-${index}`}
            className="group flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#080808] transition duration-300 hover:border-textGold/40 hover:bg-[#0c0c0c]"
          >
            <div>
              {item.image && (
                <div className="relative aspect-[16/10] overflow-hidden bg-[#111]">
                  <CmsImage
                    image={item.image}
                    altFallback={item.title}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 text-[10px] tracking-[0.2em] text-white/50">
                    {item.number || `${String(index + 1).padStart(2, "0")} / SCOPE`}
                  </span>
                </div>
              )}

              <div className="p-6">
                {item.eyebrow && (
                  <p className="text-[9px] uppercase tracking-[0.2em] text-textGold">
                    {item.eyebrow}
                  </p>
                )}
                <h3 className="mt-1 text-xl font-light text-white transition-colors group-hover:text-textGold">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-white/60">{item.description}</p>

                {item.features && item.features.length > 0 && (
                  <ul className="mt-5 space-y-2 border-t border-white/5 pt-4">
                    {item.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2 text-xs text-white/50">
                        <span className="h-1.5 w-1.5 rounded-full bg-textGold" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {item.link && (
              <div className="p-6 pt-0">
                <Link
                  href={item.link}
                  className="inline-flex min-h-10 w-full items-center justify-between rounded-md border border-white/10 bg-white/[0.02] px-4 text-[10px] font-medium uppercase tracking-[0.16em] text-white/70 transition hover:border-textGold hover:bg-textGold hover:text-black"
                >
                  <span>{item.buttonText || `Explore ${item.title}`}</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
