import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, MapPin, MessageCircle, Phone, Ruler, ShieldAlert, Sparkles } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import QuoteForm from "@/components/QuoteForm";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { images } from "@/utils/images";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Iron Railing Manufacturers in Moradabad | Afsha Creative Solutions",
  description:
    "Leading iron railing manufacturers in Moradabad. We fabricate made-to-measure wrought iron balcony railings, staircase balustrades, and modern architectural railings.",
  alternates: { canonical: "/locations/iron-railing-manufacturers-moradabad" },
  openGraph: {
    type: "website",
    title: "Iron Railing Manufacturers in Moradabad | Afsha Creative Solutions",
    description:
      "Custom wrought iron railings, balcony balustrades, and staircase handrails manufactured in Moradabad, Uttar Pradesh.",
    url: "/locations/iron-railing-manufacturers-moradabad",
  },
  twitter: {
    card: "summary_large_image",
    title: "Iron Railing Manufacturers in Moradabad | Afsha Creative Solutions",
    description:
      "Custom wrought iron railings, balcony balustrades, and staircase handrails manufactured in Moradabad, Uttar Pradesh.",
  },
};

export default function IronRailingManufacturersMoradabadPage() {
  const railingCollections = [
    {
      title: "Wrought Iron Balcony Railings",
      subtitle: "Exterior Terraces & Verandas",
      description:
        "Code-compliant balcony balustrades designed to withstand severe weather while enriching your building elevation. Features child-safe vertical bar spacing and zinc-rich rust-inhibiting primers.",
      image: images.iron_balcony_railing.ironbrail3,
      features: ["4-inch maximum bar spacing", "Solid forged iron pickets", "Oven-cured powder coat finish"],
    },
    {
      title: "Custom Staircase Railings",
      subtitle: "Interior Duplex & Commercial Stairways",
      description:
        "Bespoke balustrades contoured to your exact staircase rise, run, and rake angle. Crafted with heavy-gauge newel posts and continuous smooth handrails that flow seamlessly across floor transitions.",
      image: images.iron_stair_railing.ironStairRailling4,
      features: ["Core-drilled concrete mounting", "Ergonomic continuous handrail", "Volute starter newels"],
    },
    {
      title: "Curved Spiral Staircase Balustrades",
      subtitle: "Precision Helical Craftsmanship",
      description:
        "Sculptural curved railings demanding artisan roll-bending and millimeter accuracy. Seamless ground welds deliver fluid helical curvature for both indoor architectural features and outdoor access stairs.",
      image: images.steel_spiral_railing.ssSpiralRailling3,
      features: ["Precision artisan roll-bending", "Seamless welded joints", "High-load structural support"],
    },
    {
      title: "Modern Minimalist Metal Railings",
      subtitle: "Clean Geometric & Horizontal Bars",
      description:
        "Understated, contemporary balustrades built with solid flat bars and square tubing. Complements modern minimalist interiors, glass balconies, and commercial architectural façades.",
      image: images.steel_stair_railing.ssStairRailling8,
      features: ["Contemporary flat-bar styling", "Concealed fastener floor plates", "Zero visual clutter"],
    },
  ];

  const railingFaqs = [
    {
      question: "What safety regulations do you follow for balcony railings in Moradabad?",
      answer: "All our residential and commercial balcony railings are fabricated to a minimum finished height of 39 to 42 inches (1,000mm to 1,066mm) from the finished floor level. Vertical bar clearances never exceed 4 inches (100mm) center-to-center to ensure small children cannot slip through.",
    },
    {
      question: "How do you protect exterior iron railings from rusting in rainy seasons?",
      answer: "Exterior iron railings in Moradabad receive multi-stage anti-corrosion protection: complete mechanical descaling, application of a high-build zinc-rich epoxy anti-rust primer, and a two-coat automotive polyurethane (PU) finish or electrostatic oven-baked powder coating.",
    },
    {
      question: "Can you fit custom wooden or brass handrails on top of iron balustrades?",
      answer: "Yes. Many of our staircase clients prefer pairing solid forged iron pickets with a warm polished teak wood or brass-trimmed handrail. We fabricate custom top mounting channels that allow secure, concealed fastening of wooden or metal top rails.",
    },
    {
      question: "Do you take measurements on-site for curved or uneven stairs?",
      answer: "Yes. Staircases rarely follow perfectly theoretical angles. Our Moradabad technicians visit your site to template the exact rise, tread depth, and landing radius before cutting metal in our workshop.",
    },
  ];

  return (
    <main className="bg-background text-white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Afsha Creative Solutions - Iron Railing Manufacturers",
          image: absoluteUrl("/videos/hero-poster.webp"),
          telephone: "+91-9634776691",
          email: "afshacreativesolutions@gmail.com",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Near KK Farm House, Bishanpur Road, Harthala, Lodhipur",
            addressLocality: "Moradabad",
            addressRegion: "Uttar Pradesh",
            postalCode: "244001",
            addressCountry: "IN",
          },
          url: absoluteUrl("/locations/iron-railing-manufacturers-moradabad"),
          areaServed: ["Moradabad", "Bareilly", "Rampur", "Sambhal", "Amroha", "Uttar Pradesh", "Delhi NCR"],
          priceRange: "₹₹",
        }}
      />

      <PageHero
        eyebrow="Architectural Railing Specialists · Moradabad, India"
        title={
          <>
            Custom Iron Railings in <span className="text-textGold font-heading">Moradabad</span>
          </>
        }
        description="Afsha Creative Solutions manufactures bespoke wrought iron and architectural metal railings in Moradabad. Handcrafted balcony balustrades, modern staircase railings, and curved spiral balustrades engineered for safety and aesthetic dignity."
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Locations", href: "/locations/iron-railing-manufacturers-moradabad" },
          { name: "Iron Railing Manufacturers Moradabad", href: "/locations/iron-railing-manufacturers-moradabad" },
        ]}
        primaryCta={{ label: "Request Railing Quote", href: "#quote-section" }}
        secondaryCta={{ label: "Explore Railing Designs", href: "#railing-gallery" }}
        badges={[
          "Child-Safe 4-inch Spacing",
          "Solid Wrought Iron Bar",
          "Core-Drilled Concrete Anchors",
          "Multi-Coat Anti-Rust PU",
        ]}
      />

      {/* Local Railing Expertise Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.24em] text-textGold">
              Safety & Architectural Grace
            </p>
            <h2 className="text-2xl font-light text-white sm:text-4xl">
              Handcrafted Balcony & Staircase Railings in Moradabad
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/60 sm:text-base">
              A railing is one of the most tactile architectural features of any residence. You touch it daily, rely on it for safety, and its lines define the perspective of your foyer and exterior elevation. At our Harthala Lodhipur workshop in Moradabad, we engineer iron railings that achieve the ideal synthesis of structural rigidity and ornamental grace.
            </p>
            <p className="mt-3 text-sm leading-7 text-white/60 sm:text-base">
              Unlike lightweight mass-produced hollow railings that vibrate or loosen under load, our balustrades use heavy-gauge solid square bars, forged steel pickets, and core-drilled chemical anchoring.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
              <div className="rounded-lg border border-white/10 bg-[#0d0d0d] p-4">
                <span className="text-sm font-semibold text-textGold">39 to 42 Inches</span>
                <p className="mt-1 text-xs text-white/50">Standard safe balcony height</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-[#0d0d0d] p-4">
                <span className="text-sm font-semibold text-textGold">100% Solid Welds</span>
                <p className="mt-1 text-xs text-white/50">Full seam welded & dressed</p>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-[#111]">
            <Image
              src={images.iron_balcony_railing.ironbrail3}
              alt="Custom iron balcony railing manufactured in Moradabad"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 rounded-lg bg-black/70 p-4 backdrop-blur-md border border-white/10">
              <p className="text-[9px] uppercase tracking-[0.2em] text-textGold">Terrace Balcony Installation</p>
              <p className="text-xs text-white/80 mt-1">Hand-Forged Wrought Iron Terrace Balustrade</p>
            </div>
          </div>
        </div>
      </section>

      {/* Railing Gallery Grid */}
      <section id="railing-gallery" className="border-t border-white/10 bg-[#050505] px-4 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Railing Portfolio"
            title="Iron Railing Collections by Application"
            description="Explore our primary railing fabrications manufactured in Moradabad for residential, commercial, and hospitality projects."
            link={{ label: "View Collection", href: "/products?category=stair-railings" }}
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {railingCollections.map((col) => (
              <div
                key={col.title}
                className="group flex flex-col justify-between rounded-xl border border-white/10 bg-[#080808] p-5 transition duration-300 hover:border-textGold/40 hover:bg-[#0c0c0c]"
              >
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#111]">
                    <Image
                      src={col.image}
                      alt={col.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <p className="mt-4 text-[9px] uppercase tracking-[0.2em] text-textGold">
                    {col.subtitle}
                  </p>
                  <h3 className="mt-1 text-lg font-light text-white group-hover:text-textGold transition-colors">
                    {col.title}
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-white/55">
                    {col.description}
                  </p>

                  <ul className="mt-4 space-y-1.5 border-t border-white/5 pt-3">
                    {col.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-[11px] text-white/50">
                        <Check size={12} className="text-textGold" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-3 border-t border-white/10">
                  <a
                    href="#quote-section"
                    className="inline-flex min-h-10 w-full items-center justify-between text-[10px] font-medium uppercase tracking-[0.16em] text-textGold hover:text-white transition"
                  >
                    <span>Request Estimate</span>
                    <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Railing Customization Details Strip */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow="Customization Specifications"
          title="Engineered Around Your Staircase & Balcony"
          description="Every element of your railing system can be personalized to match your interior architectural palette."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-[#090909] p-6">
            <span className="text-[10px] uppercase tracking-[0.2em] text-textGold">Handrail Profile</span>
            <h3 className="mt-2 text-lg font-light text-white">Continuous Contours</h3>
            <p className="mt-2 text-sm leading-6 text-white/55">
              Available in ergonomic round tube, modern flat bar, cast brass cap trim, or grooved channel ready to receive solid teak wood handrails.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#090909] p-6">
            <span className="text-[10px] uppercase tracking-[0.2em] text-textGold">Anchoring System</span>
            <h3 className="mt-2 text-lg font-light text-white">Heavy-Duty Core Drilling</h3>
            <p className="mt-2 text-sm leading-6 text-white/55">
              Newels and posts are core-drilled directly into RCC slabs with high-strength chemical anchors, topped with silicone-sealed decorative escutcheon plates.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#090909] p-6">
            <span className="text-[10px] uppercase tracking-[0.2em] text-textGold">Finish Coatings</span>
            <h3 className="mt-2 text-lg font-light text-white">Electrostatic Powder Bake</h3>
            <p className="mt-2 text-sm leading-6 text-white/55">
              Choose from matte raven black, antique bronze patina, hammer-tone charcoal, satin champagne gold, or high-gloss automotive polyurethane paint.
            </p>
          </div>
        </div>
      </section>

      {/* Railing FAQs */}
      <section className="border-t border-white/10 bg-[#050505] px-4 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            align="center"
            eyebrow="Railing FAQs"
            title="Questions About Railings in Moradabad"
          />

          <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
            {railingFaqs.map((faq) => (
              <div key={faq.question} className="py-6">
                <h3 className="text-base font-light text-white sm:text-lg">
                  {faq.question}
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/60">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Form Section */}
      <section id="quote-section" className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
        <QuoteForm
          defaultCategory="balcony-railings"
          title="Get an Iron Railing Estimate in Moradabad"
          subtitle="Share your approximate running feet, staircase rise/run, or balcony dimensions. Our Moradabad workshop team will provide an itemized proposal."
        />
      </section>

      <CTASection
        eyebrow="Architectural Iron Railings"
        title="Ready to elevate your staircases and balconies?"
        description="Connect with our fabrication team to discuss your drawings, schedule a site survey, or visit our Moradabad facility."
        primaryLabel="Message On WhatsApp"
        secondaryLabel="Explore Railings Collection"
        secondaryHref="/products?category=stair-railings"
      />
    </main>
  );
}
