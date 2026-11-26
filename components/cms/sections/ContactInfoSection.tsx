import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import Map from "@/components/Map";
import EnquiryForm from "@/app/contact/enquiry-form";
import QuoteForm from "@/components/QuoteForm";
import type { CategoryRecord } from "@/lib/catalog-types";
import type { ContactInfoContent } from "@/lib/cms/types";

const CONTACT_ICONS = {
  whatsapp: MessageCircle,
  phone: Phone,
  mail: Mail,
  map: MapPin,
};

export default function ContactInfoSection({
  content,
  categories = [],
}: {
  content: ContactInfoContent;
  categories?: CategoryRecord[];
}) {
  const { variant = "quote_form" } = content;

  if (variant === "map_embed") {
    return (
      <Map
        mapEmbedUrl={content.mapEmbedUrl}
        mapTitle={content.mapTitle}
        badgeEyebrow={content.mapBadgeEyebrow}
        badgeTitle={content.mapBadgeTitle}
      />
    );
  }

  if (variant === "contact_methods_and_form") {
    return (
      <div className="px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/50 transition-colors hover:text-textGold"
          >
            <ArrowLeft size={14} /> Home
          </Link>

          <section className="mt-5 border-y border-white/10 py-8 sm:mt-7 sm:py-12">
            <div className="max-w-3xl">
              {content.eyebrow && (
                <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-textGold">
                  {content.eyebrow}
                </p>
              )}
              {content.heading && (
                <h1 className="text-4xl font-light leading-tight tracking-tight sm:text-6xl">
                  {content.heading}
                </h1>
              )}
              {content.description && (
                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55 sm:mt-5 sm:text-base">
                  {content.description}
                </p>
              )}
            </div>

            {content.methods && content.methods.length > 0 && (
              <div className="mt-7 grid gap-3 sm:mt-9 sm:grid-cols-2 lg:grid-cols-3">
                {content.methods.map((method) => {
                  const Icon = CONTACT_ICONS[method.icon] || Phone;
                  return (
                    <a
                      key={method.label}
                      href={method.href}
                      className="group flex min-h-24 min-w-0 items-center gap-4 rounded-lg border border-white/10 bg-[#080808] p-4 transition-colors hover:border-textGold/50 sm:min-h-28 sm:p-5"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-textGold/30 text-textGold">
                        <Icon size={18} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[9px] uppercase tracking-[0.18em] text-white/40">
                          {method.label}
                        </span>
                        <span className="mt-2 block break-words text-sm leading-5 text-white/85">
                          {method.value}
                        </span>
                      </span>
                      <ArrowUpRight
                        size={15}
                        className="shrink-0 text-white/30 transition-colors group-hover:text-textGold"
                      />
                    </a>
                  );
                })}
              </div>
            )}
          </section>

          <section className="py-8 sm:py-12" aria-labelledby="enquiry-heading">
            <div className="mb-6 max-w-2xl sm:mb-8">
              {content.formEyebrow && (
                <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-textGold">
                  {content.formEyebrow}
                </p>
              )}
              {content.formTitle && (
                <h2 id="enquiry-heading" className="text-3xl font-light leading-tight sm:text-4xl">
                  {content.formTitle}
                </h2>
              )}
              {content.formSubtitle && (
                <p className="mt-3 text-sm leading-7 text-white/55">{content.formSubtitle}</p>
              )}
            </div>
            <EnquiryForm
              categories={categories.map(({ slug, name }) => ({ slug, name }))}
            />
          </section>
        </div>
      </div>
    );
  }

  if (variant === "workshop_coverage") {
    return (
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
        <div className="rounded-2xl border border-white/10 bg-[#080808] p-6 sm:p-10 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              {content.eyebrow && (
                <p className="text-[10px] uppercase tracking-[0.24em] text-textGold">
                  {content.eyebrow}
                </p>
              )}
              {content.heading && (
                <h2 className="mt-2 text-2xl font-light text-white sm:text-3xl">
                  {content.heading}
                </h2>
              )}
              {content.description && (
                <p className="mt-4 text-sm leading-7 text-white/60">{content.description}</p>
              )}

              <div className="mt-6 space-y-3 border-t border-white/10 pt-5 text-sm text-white/70">
                {content.address && (
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="mt-0.5 shrink-0 text-textGold" />
                    <span>{content.address}</span>
                  </div>
                )}
                {content.phoneDisplay && (
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="shrink-0 text-textGold" />
                    <a
                      href={content.phoneHref || "tel:+919634776691"}
                      className="transition hover:text-textGold"
                    >
                      {content.phoneDisplay}
                    </a>
                  </div>
                )}
              </div>

              {(content.mapLink || content.whatsappLink) && (
                <div className="mt-8 flex flex-wrap gap-4">
                  {content.mapLink && (
                    <a
                      href={content.mapLink.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-[10px] uppercase tracking-[0.16em] text-white transition hover:border-textGold hover:text-textGold"
                    >
                      <MapPin size={14} /> {content.mapLink.label}
                    </a>
                  )}
                  {content.whatsappLink && (
                    <a
                      href={content.whatsappLink.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-textGold bg-textGold px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-black transition hover:bg-white"
                    >
                      <MessageCircle size={14} /> {content.whatsappLink.label}
                    </a>
                  )}
                </div>
              )}
            </div>

            {content.coverageAreas && content.coverageAreas.length > 0 && (
              <div className="rounded-xl border border-white/10 bg-[#121212] p-6 sm:p-8">
                {content.coverageTitle && (
                  <h3 className="text-lg font-light text-white">{content.coverageTitle}</h3>
                )}
                {content.coverageDescription && (
                  <p className="mt-2 text-xs leading-5 text-white/50">
                    {content.coverageDescription}
                  </p>
                )}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-white/70">
                  {content.coverageAreas.map((area) => (
                    <div key={area} className="flex items-center gap-2">
                      <Check size={13} className="text-textGold" /> {area}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // quote_form
  return (
    <section
      id={content.sectionId || "quote-section"}
      className="mx-auto max-w-5xl scroll-mt-20 px-4 py-12 sm:px-6 sm:py-20"
    >
      <QuoteForm
        defaultCategory={content.defaultCategory || "gates"}
        title={content.formTitle || content.heading || "Request a Made-to-Measure Quote"}
        subtitle={
          content.formSubtitle ||
          content.description ||
          "Share your project dimensions, material preferences, and design vision."
        }
      />
    </section>
  );
}
