import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, MapPin, MessageCircle, Phone, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import QuoteForm from "@/components/QuoteForm";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { images } from "@/utils/images";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Custom Metal Gate Manufacturers in Moradabad | Afsha Creative Solutions",
  description:
    "Leading custom metal gate manufacturers in Moradabad. We design, fabricate, and install modern stainless steel gates, handcrafted iron gates, and sliding gates made to measure.",
  alternates: { canonical: "/locations/metal-gate-manufacturers-moradabad" },
  openGraph: {
    type: "website",
    title: "Custom Metal Gate Manufacturers in Moradabad | Afsha Creative Solutions",
    description:
      "Precision custom metal gates, iron gates, and stainless steel sliding gates manufactured in Moradabad, Uttar Pradesh.",
    url: "/locations/metal-gate-manufacturers-moradabad",
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Metal Gate Manufacturers in Moradabad | Afsha Creative Solutions",
    description:
      "Precision custom metal gates, iron gates, and stainless steel sliding gates manufactured in Moradabad, Uttar Pradesh.",
  },
};

export default function MetalGateManufacturersMoradabadPage() {
  const gateTypes = [
    {
      title: "Stainless Steel Main Gates",
      subtitle: "Grade 304 / 316 Modern Designs",
      description:
        "Sleek, low-maintenance entrance gates engineered from genuine AISI-304 stainless steel. Ideal for modern urban bungalows and commercial buildings requiring rust immunity and clean horizontal louvers.",
      image: images.steel_gate.ssGate13,
      features: ["Satin hairline or mirror finish", "Laser-cut privacy panels", "Seamless TIG argon welded"],
    },
    {
      title: "Handcrafted Wrought Iron Gates",
      subtitle: "Classical Forged Heritage Styling",
      description:
        "Artisan wrought iron gates hand-hammered by Moradabad metalworkers. Features heavy-gauge solid pickets, decorative scrolls, spearheads, and multi-stage zinc epoxy anti-corrosive primer.",
      image: images.iron_gates.ironGate3,
      features: ["Traditional European & haveli motifs", "Solid bar stock construction", "Baked PU / powder finish"],
    },
    {
      title: "Sliding & Automated Vehicular Gates",
      subtitle: "Space-Saving Driveway Solutions",
      description:
        "Cantilevered or ground-track sliding gates engineered for driveways with limited turning radius or incline. Pre-fitted with heavy gear racks, guide rollers, and safety stop blocks for smooth motorization.",
      image: images.steel_gate.ssGate1,
      features: ["High-speed smooth bottom track", "Italian/Indian DC motor ready", "Integrated wicket pass door option"],
    },
    {
      title: "Estate Boundary & Double Swing Gates",
      subtitle: "Grand Villa & Farmhouse Entrances",
      description:
        "Wide-span bi-parting double swing gates with heavy-duty ball-bearing pivot hinges, internal drop bolts, and reinforced structural frames that prevent leaf sag over decades of service.",
      image: images.steel_gate.ssGate4,
      features: ["Reinforced perimeter tubing", "Drop bolts & deadlock housing", "Engineered for high wind load"],
    },
  ];

  const localFaqs = [
    {
      question: "Where is your metal gate manufacturing workshop located in Moradabad?",
      answer: "Our workshop and fabrication yard are located near KK Farm House on Bishanpur Road, Harthala, Lodhipur, Moradabad, Uttar Pradesh 244001. Clients are encouraged to visit to view raw material gauges, inspect welding joints, and consult directly with our metalworkers.",
    },
    {
      question: "Do you provide on-site measurement in Moradabad and neighboring areas?",
      answer: "Yes. Our team conducts on-site measurement surveys across Moradabad city and surrounding localities (including Civil Lines, Ram Ganga Vihar, Delhi Road, Sambhal Road, Kanth Road) as well as nearby districts such as Rampur, Sambhal, and Amroha.",
    },
    {
      question: "Can you automate my existing or new metal gate?",
      answer: "Yes. All our new sliding and swing gates are engineered motorization-ready with pre-welded actuator mounting plates, cable conduits, and reinforced gear rack bases. We can also recommend and coordinate gate automation hardware.",
    },
    {
      question: "How do you ensure metal gates don't rust during Moradabad monsoons?",
      answer: "For stainless steel, we use certified AISI 304 alloy which naturally resists oxidization. For mild steel and wrought iron, we perform complete surface degreasing, apply two coats of high-build zinc-rich epoxy anti-rust primer, and finish with oven-cured automotive polyurethane or powder coating.",
    },
  ];

  return (
    <main className="bg-background text-white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Afsha Creative Solutions - Custom Metal Gate Manufacturers",
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
          geo: {
            "@type": "GeoCoordinates",
            latitude: "28.8386",
            longitude: "78.7733",
          },
          url: absoluteUrl("/locations/metal-gate-manufacturers-moradabad"),
          areaServed: [
            "Moradabad",
            "Rampur",
            "Sambhal",
            "Amroha",
            "Bareilly",
            "Uttar Pradesh",
            "Delhi NCR",
          ],
          priceRange: "₹₹",
        }}
      />

      <PageHero
        eyebrow="Local Manufacturing · Moradabad, Uttar Pradesh"
        title={
          <>
            Custom Metal Gates in <span className="text-textGold font-heading">Moradabad</span>
          </>
        }
        description="Afsha Creative Solutions is Moradabad's trusted manufacturer of custom metal gates. From contemporary stainless steel sliding gates to handcrafted wrought iron driveway entrances, we fabricate made-to-measure security gates built to endure."
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Locations", href: "/locations/metal-gate-manufacturers-moradabad" },
          { name: "Metal Gate Manufacturers Moradabad", href: "/locations/metal-gate-manufacturers-moradabad" },
        ]}
        primaryCta={{ label: "Request Gate Quote", href: "#quote-section" }}
        secondaryCta={{ label: "View Gate Designs", href: "#gate-collection" }}
        badges={[
          "Moradabad Workshop Harthala",
          "Grade 304 Stainless Steel",
          "Hand-Forged Wrought Iron",
          "On-Site Sizing & Fitting",
        ]}
      />

      {/* Local Introduction & Authority */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.24em] text-textGold">
              Craftsmanship from the City of Metalwork
            </p>
            <h2 className="text-2xl font-light text-white sm:text-4xl">
              Engineered for Security, Proportioned for Architecture
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/60 sm:text-base">
              Moradabad is world-renowned for metalcraft, and at Afsha Creative Solutions, we combine traditional metalworking skills with modern architectural precision. A driveway gate must do more than close an opening—it defines the architectural elevation of your home, safeguards your family, and withstands decades of daily vehicular movement.
            </p>
            <p className="mt-3 text-sm leading-7 text-white/60 sm:text-base">
              Whether you are constructing a new villa in Ram Ganga Vihar, renovating an ancestral haveli, or building a commercial complex along Delhi Road, our team provides complete site survey, 2D drafting, fabrication, and precision on-site installation.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-6 border-t border-white/10 pt-6">
              <div>
                <span className="block text-2xl font-light text-textGold">304</span>
                <span className="text-xs text-white/50">Grade Stainless Steel</span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <span className="block text-2xl font-light text-textGold">100%</span>
                <span className="text-xs text-white/50">Made to Measure</span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <span className="block text-2xl font-light text-textGold">Local</span>
                <span className="text-xs text-white/50">Moradabad Workshop</span>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-[#111]">
            <Image
              src={images.steel_gate.ssGate13}
              alt="Custom stainless steel gate manufactured in Moradabad"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 rounded-lg bg-black/70 p-4 backdrop-blur-md border border-white/10">
              <p className="text-[9px] uppercase tracking-[0.2em] text-textGold">Featured Moradabad Installation</p>
              <p className="text-xs text-white/80 mt-1">Motorized SS-304 Double Swing Entrance Gate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gate Collection Section */}
      <section id="gate-collection" className="border-t border-white/10 bg-[#050505] px-4 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Moradabad Gate Collection"
            title="Custom Metal Gates Manufactured to Order"
            description="Explore our primary gate fabrication categories. Every design is customized to your pillar-to-pillar opening width, height, and preferred metal alloy."
            link={{ label: "View All Products", href: "/products?category=gates" }}
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {gateTypes.map((gate) => (
              <div
                key={gate.title}
                className="group flex flex-col justify-between rounded-xl border border-white/10 bg-[#080808] p-5 transition duration-300 hover:border-textGold/40 hover:bg-[#0c0c0c]"
              >
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#111]">
                    <Image
                      src={gate.image}
                      alt={gate.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <p className="mt-4 text-[9px] uppercase tracking-[0.2em] text-textGold">
                    {gate.subtitle}
                  </p>
                  <h3 className="mt-1 text-lg font-light text-white group-hover:text-textGold transition-colors">
                    {gate.title}
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-white/55">
                    {gate.description}
                  </p>

                  <ul className="mt-4 space-y-1.5 border-t border-white/5 pt-3">
                    {gate.features.map((f) => (
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
                    <span>Request Quote</span>
                    <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workshop Location & Visit Information */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
        <div className="rounded-2xl border border-white/10 bg-[#080808] p-6 sm:p-10 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-textGold">
                Visit Our Workshop
              </p>
              <h2 className="mt-2 text-2xl font-light text-white sm:text-3xl">
                Afsha Creative Solutions in Moradabad
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/60">
                Conveniently located near KK Farm House on Bishanpur Road, Harthala, Lodhipur. We welcome architects, interior contractors, and property owners to discuss gate dimensions, inspect heavy-gauge tubing, and view gates currently in fabrication.
              </p>

              <div className="mt-6 space-y-3 border-t border-white/10 pt-5 text-sm text-white/70">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-textGold" />
                  <span>Near KK Farm House, Bishanpur Road, Harthala, Lodhipur, Moradabad, Uttar Pradesh 244001</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="shrink-0 text-textGold" />
                  <a href="tel:+919634776691" className="hover:text-textGold transition">
                    +91 96347 76691
                  </a>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="https://maps.google.com/?cid=7804843562812692638&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAMYASAF&hl=en&gl=IN&source=embed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-[10px] uppercase tracking-[0.16em] text-white hover:border-textGold hover:text-textGold transition"
                >
                  <MapPin size={14} /> Open in Google Maps
                </a>
                <a
                  href="https://wa.me/919634776691?text=Hello%20Afsha%20Creative%20Solution%2C%20I%20would%20like%20to%20visit%20your%20workshop%20in%20Moradabad%20for%20a%20metal%20gate."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-textGold bg-textGold px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-black hover:bg-white transition"
                >
                  <MessageCircle size={14} /> WhatsApp Workshop
                </a>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#121212] p-6 sm:p-8">
              <h3 className="text-lg font-light text-white">Coverage in & around Moradabad</h3>
              <p className="mt-2 text-xs leading-5 text-white/50">
                We provide site measurement, transport, and complete installation across:
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-white/70">
                <div className="flex items-center gap-2"><Check size={13} className="text-textGold" /> Civil Lines, Moradabad</div>
                <div className="flex items-center gap-2"><Check size={13} className="text-textGold" /> Ram Ganga Vihar, Moradabad</div>
                <div className="flex items-center gap-2"><Check size={13} className="text-textGold" /> Delhi Road, Moradabad</div>
                <div className="flex items-center gap-2"><Check size={13} className="text-textGold" /> Kanth Road, Moradabad</div>
                <div className="flex items-center gap-2"><Check size={13} className="text-textGold" /> Rampur District</div>
                <div className="flex items-center gap-2"><Check size={13} className="text-textGold" /> Sambhal District</div>
                <div className="flex items-center gap-2"><Check size={13} className="text-textGold" /> Amroha District</div>
                <div className="flex items-center gap-2"><Check size={13} className="text-textGold" /> Noida & Delhi NCR</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Local FAQs */}
      <section className="border-t border-white/10 bg-[#050505] px-4 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            align="center"
            eyebrow="Moradabad FAQs"
            title="Questions About Metal Gates in Moradabad"
          />

          <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
            {localFaqs.map((faq) => (
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
          defaultCategory="gates"
          title="Get a Metal Gate Estimate in Moradabad"
          subtitle="Share your opening width, height, and preferred style. Our local Moradabad team will prepare an itemized quote with material specifications."
        />
      </section>

      <CTASection
        eyebrow="Local Metal Gate Specialists"
        title="Ready to commission your custom gate in Moradabad?"
        description="Connect directly with our workshop team to schedule an on-site dimensional survey or discuss gate automation."
        primaryLabel="Inquire On WhatsApp"
        secondaryLabel="Explore Gate Catalog"
        secondaryHref="/products?category=gates"
      />
    </main>
  );
}
