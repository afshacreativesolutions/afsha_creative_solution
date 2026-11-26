import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import CmsImage from "../CmsImage";
import type { ServicesGridContent } from "@/lib/cms/types";

export default function ServicesGridSection({ content }: { content: ServicesGridContent }) {
  const { services = [] } = content;

  return (
    <section
      id={content.sectionId || "services-list"}
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20"
    >
      <SectionHeading
        eyebrow={content.eyebrow}
        title={content.heading}
        description={content.description}
      />

      <div className="space-y-12 sm:space-y-16">
        {services.map((service, index) => {
          const isReversed = index % 2 === 1 && content.variant !== "compact_cards";
          return (
            <div
              key={service.id || `${service.title}-${index}`}
              className={`grid gap-8 rounded-2xl border border-white/10 bg-[#080808] p-6 sm:p-10 lg:grid-cols-2 lg:items-center lg:gap-14 ${
                isReversed ? "lg:grid-flow-dense" : ""
              }`}
            >
              <div
                className={`relative aspect-[16/11] overflow-hidden rounded-xl bg-[#111] ${
                  isReversed ? "lg:col-start-2" : ""
                }`}
              >
                <CmsImage
                  image={service.image}
                  altFallback={service.title}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[9px] uppercase tracking-[0.2em] text-textGold backdrop-blur-sm">
                  SERVICE {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className={isReversed ? "lg:col-start-1" : ""}>
                {service.eyebrow && (
                  <p className="text-[10px] uppercase tracking-[0.22em] text-textGold">
                    {service.eyebrow}
                  </p>
                )}
                <h3 className="mt-2 text-2xl font-light text-white sm:text-3xl">
                  {service.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/60 sm:text-base">
                  {service.description}
                </p>

                {service.highlights && service.highlights.length > 0 && (
                  <div className="mt-6 border-t border-white/10 pt-5">
                    <p className="mb-3 text-[9px] uppercase tracking-[0.2em] text-white/40">
                      Technical Specifications & Capabilities
                    </p>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {service.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2 text-xs text-white/70">
                          <Check size={14} className="mt-0.5 shrink-0 text-textGold" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {(service.primaryButton || service.secondaryButton) && (
                  <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-white/5 pt-6">
                    {service.primaryButton && (
                      <Link
                        href={service.primaryButton.href}
                        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-textGold bg-textGold/10 px-5 text-[10px] font-medium uppercase tracking-[0.16em] text-textGold transition hover:bg-textGold hover:text-black"
                      >
                        {service.primaryButton.label} <ArrowRight size={14} />
                      </Link>
                    )}
                    {service.secondaryButton && (
                      <Link
                        href={service.secondaryButton.href}
                        className="inline-flex min-h-11 items-center text-[10px] uppercase tracking-[0.18em] text-white/50 transition hover:text-white"
                      >
                        {service.secondaryButton.label}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
