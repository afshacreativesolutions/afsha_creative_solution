import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, MapPin } from "lucide-react";
import CMSPageRenderer from "@/components/cms/CMSPageRenderer";
import LeadEnquiryForm from "@/components/lead/LeadEnquiryForm";
import OpenQuoteButton from "@/components/lead/OpenQuoteButton";
import TrackedActionLink from "@/components/lead/TrackedActionLink";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { getPublicCategories, getPublicProducts } from "@/lib/catalog";
import { getCmsPageForRender, getPublishedCmsSiteSettings } from "@/lib/cms/queries";
import { buildCmsPageMetadata } from "@/lib/cms/seo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const revalidate = 300;

const WHY_CHOOSE_PILLARS = [
  {
    number: "01",
    eyebrow: "EXACT FIT",
    title: "On-Site Measurement",
    description:
      "We verify exact opening dimensions and driveway slope before cutting metal.",
  },
  {
    number: "02",
    eyebrow: "DURABLE METALS",
    title: "Heavy-Gauge Alloys",
    description:
      "304 stainless steel, forged wrought iron, and heavy mild steel built for everyday security.",
  },
  {
    number: "03",
    eyebrow: "RUST PROTECTION",
    title: "Multi-Stage Finishing",
    description:
      "Weld grinding, zinc primers, and weatherproof PU / satin finishes ready for Indian monsoons.",
  },
  {
    number: "04",
    eyebrow: "DIRECT WORKSHOP",
    title: "Factory Pricing & Fitting",
    description:
      "Order directly from our Moradabad workshop with coordinated transport and site fitting.",
  },
];

const SERVICE_AREAS = [
  "Moradabad City & Civil Lines",
  "Ram Ganga Vihar & Pakbara",
  "Rampur & Milak",
  "Sambhal & Chandausi",
  "Amroha & Gajraula",
  "Bijnor & Dhampur",
  "Kashipur & Rudrapur",
  "Bareilly & Nearby Regions",
];

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPageForRender("/");
  return buildCmsPageMetadata(page, "/");
}

export default async function Home() {
  const [page, products, categories, settings] = await Promise.all([
    getCmsPageForRender("/"),
    getPublicProducts(),
    getPublicCategories(),
    getPublishedCmsSiteSettings(),
  ]);

  if (!page) notFound();

  const hasWhyChoose = page.sections.some(
    (s) => s.section_key.includes("why-choose") || /why\s+choose/i.test(s.title)
  );
  const hasServiceAreas = page.sections.some(
    (s) =>
      s.section_key.includes("service-areas") ||
      (s.section_type === "contact_info" &&
        (s.content as { variant?: string })?.variant === "workshop_coverage")
  );
  const hasQuoteForm = page.sections.some(
    (s) =>
      s.section_type === "contact_info" &&
      (s.content as { variant?: string })?.variant === "quote_form"
  );

  const waHref = buildWhatsAppUrl({
    intent: "general",
    whatsappNumber: settings.site_identity.whatsappNumber,
  });

  return (
    <>
      <link
        rel="preload"
        as="image"
        href="/videos/hero-poster.webp"
        type="image/webp"
        fetchPriority="high"
      />
      <CMSPageRenderer page={page} context={{ products, categories }} />

      {!hasWhyChoose && (
        <section className="border-t border-white/10 bg-[#050505] px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-7xl">
            <p className="text-[10px] uppercase tracking-[0.24em] text-textGold">
              Why Choose Us
            </p>
            <h2 className="mt-2 text-2xl font-light tracking-tight text-white sm:text-4xl">
              Built Strong. Finished Clean. Fitted on Time.
            </h2>
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
              {WHY_CHOOSE_PILLARS.map((card) => (
                <article
                  key={card.number}
                  className="rounded-xl border border-white/10 bg-[#090909] p-5 transition hover:border-textGold/35"
                >
                  <span className="text-[10px] tracking-[0.2em] text-textGold">
                    {card.number} / {card.eyebrow}
                  </span>
                  <h3 className="mt-4 text-lg font-light text-white">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/55">{card.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {!hasServiceAreas && (
        <section
          id="service-areas"
          className="border-t border-white/10 bg-background px-4 py-12 sm:px-6 sm:py-16"
        >
          <div className="mx-auto max-w-7xl rounded-2xl border border-white/10 bg-[#080808] p-6 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-textGold">
                  Service Areas · Direct Workshop Supply
                </p>
                <h2 className="mt-2 text-2xl font-light text-white sm:text-3xl">
                  Serving Moradabad &amp; Nearby Districts
                </h2>
                <p className="mt-3 text-sm leading-6 text-white/60">
                  Every custom gate, sliding system, steel door, and railing is fabricated at our
                  Moradabad workshop with transport and on-site installation across nearby cities.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <OpenQuoteButton
                    label="Book Site Visit"
                    prefill={{ title: "Book Site Measurement & Quote", placement: "service_areas" }}
                  />
                  <TrackedActionLink
                    href={waHref}
                    eventName="whatsapp_click"
                    trackingProps={{
                      placement: "homepage_service_areas",
                      channel: "whatsapp",
                      sourcePage: "/",
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[46px] items-center gap-2 rounded-full border border-textGold/50 bg-textGold/10 px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-textGold transition hover:bg-textGold hover:text-black"
                  >
                    <WhatsAppIcon size={15} /> Enquire on WhatsApp
                  </TrackedActionLink>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2.5 rounded-xl border border-white/10 bg-[#101010] p-5 text-xs text-white/75 sm:grid-cols-2">
                {SERVICE_AREAS.map((area) => (
                  <div key={area} className="flex items-center gap-2 py-0.5">
                    <Check size={14} className="shrink-0 text-textGold" />
                    <span>{area}</span>
                  </div>
                ))}
                <div className="col-span-full mt-2 flex items-center gap-2 border-t border-white/10 pt-3 text-[11px] text-white/50">
                  <MapPin size={13} className="shrink-0 text-textGold" />
                  <span>Workshop: Harthala, Lodhipur, Moradabad, UP 244001</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {!hasQuoteForm && (
        <section
          id="quote-section"
          aria-label="Free metalwork quote enquiry"
          className="border-t border-white/10 bg-[#050505] px-4 py-12 sm:px-6 sm:py-20 scroll-mt-20"
        >
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 max-w-2xl">
              <p className="text-[10px] uppercase tracking-[0.24em] text-textGold">
                Get Started Today
              </p>
              <h2 className="mt-2 text-2xl font-light text-white sm:text-4xl">
                Get a Free Custom Metalwork Quote
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/60">
                Planning a main gate, sliding gate, steel door, or railing? Share your details
                below for direct workshop guidance and pricing.
              </p>
            </div>
            <LeadEnquiryForm
              categories={categories.map(({ slug, name }) => ({ slug, name }))}
              placement="homepage"
              whatsappNumber={settings.site_identity.whatsappNumber}
            />
          </div>
        </section>
      )}
    </>
  );
}
