import Link from "next/link";
import { ArrowRight } from "lucide-react";
import TrackedActionLink from "@/components/lead/TrackedActionLink";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import type { AllowedEventName } from "@/lib/tracker";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export type CTASectionProps = {
  eyebrow?: string;
  title?: string | React.ReactNode;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  trackingEvent?: AllowedEventName;
  trackingProps?: Record<string, string | number | boolean | null | undefined>;
  className?: string;
};

const defaultWhatsapp = buildWhatsAppUrl({ intent: "general" });

export default function CTASection({
  eyebrow = "Your space, your specification",
  title = "Have a design in mind? Let's make it real.",
  description = "Share your architectural drawings, sketches, or dimensions. We craft custom gates and railings to order in Moradabad.",
  primaryLabel = "Enquire on WhatsApp",
  primaryHref = defaultWhatsapp,
  secondaryLabel = "Request A Custom Quote",
  secondaryHref = "/custom-metalwork",
  trackingEvent = "whatsapp_click",
  trackingProps,
  className = "",
}: CTASectionProps) {
  const isWhatsapp = primaryHref.includes("wa.me");
  const buttonClasses =
    "group inline-flex min-h-12 items-center justify-between gap-4 rounded-full border border-textGold bg-textGold/10 px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-textGold transition-colors hover:bg-textGold hover:text-black";

  return (
    <section className={`border-y border-white/10 bg-[#080808] px-4 py-12 sm:px-6 sm:py-20 ${className}`}>
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-textGold">
            {eyebrow}
          </p>
          <h2 className="text-2xl font-light leading-tight tracking-tight text-white sm:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="mt-4 text-sm leading-7 text-white/55 sm:text-base">
              {description}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {isWhatsapp ? (
            <TrackedActionLink
              href={primaryHref}
              eventName={trackingEvent}
              trackingProps={
                trackingProps || {
                  placement: "cta_section",
                  channel: "whatsapp",
                }
              }
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses}
            >
              <span className="flex items-center gap-2">
                <WhatsAppIcon size={15} />
                {primaryLabel}
              </span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </TrackedActionLink>
          ) : (
            <Link href={primaryHref} className={buttonClasses}>
              <span className="flex items-center gap-2">{primaryLabel}</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          )}

          {secondaryLabel && secondaryHref && (
            <Link
              href={secondaryHref}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-6 py-3.5 text-[10px] uppercase tracking-[0.18em] text-white/70 transition-colors hover:border-textGold/40 hover:text-white"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
