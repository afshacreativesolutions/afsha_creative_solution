import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import QuoteForm from "@/components/QuoteForm";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { images } from "@/utils/images";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Custom Metalwork & Bespoke Fabrication | Afsha Creative Solutions",
  description:
    "Request custom made-to-measure metal gates, architectural railings, and decorative metalwork designed around your vision. Handcrafted at our workshop in Moradabad, India.",
  alternates: { canonical: "/custom-metalwork" },
  openGraph: {
    type: "website",
    title: "Custom Metalwork & Bespoke Fabrication | Afsha Creative Solutions",
    description:
      "Designed around your vision. Made-to-measure metal gates, railings, grills, and architectural metalwork in Moradabad.",
    url: "/custom-metalwork",
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Metalwork & Bespoke Fabrication | Afsha Creative Solutions",
    description:
      "Designed around your vision. Made-to-measure metal gates, railings, grills, and architectural metalwork in Moradabad.",
  },
};

export default function CustomMetalworkPage() {
  const whatWeCreate = [
    {
      title: "Custom Main Gates",
      subtitle: "Sliding, Swing & Bi-Fold",
      description:
        "Heavy-duty vehicular entrance gates built with 304 grade stainless steel or forged wrought iron. Engineered to withstand heavy daily use, wind load, and automation motorization.",
      image: images.steel_gate.ssGate13,
      features: ["Custom width & height matching your pillars", "Motorization ready", "Concealed heavy pivot hinges"],
    },
    {
      title: "Architectural Railings",
      subtitle: "Staircases, Landings & Ramps",
      description:
        "Interior and exterior balustrades contoured to your staircase geometry. Straight runs, intermediate landings, ramp angles, and volute starter newels fabricated with millimeter accuracy.",
      image: images.steel_stair_railing.ssStairRailling8,
      features: ["Core-drilled concrete fastenings", "Continuous smooth handrails", "High-load structural rigidity"],
    },
    {
      title: "Balcony Railings",
      subtitle: "Terrace & Veranda Balustrades",
      description:
        "Code-compliant perimeter protection for residential and commercial balconies. Weather-resistant multi-coat primers and baked coatings to eliminate rust during severe monsoons.",
      image: images.iron_balcony_railing.ironbrail3,
      features: ["Child-safe 4-inch max bar spacing", "Water-shedding base plates", "Modern & classical styling"],
    },
    {
      title: "Decorative Metal Grills",
      subtitle: "Window Grills & Jaali Partitions",
      description:
        "Distinctive window security grills and interior architectural screens that deliver security, natural airflow, and ambient lighting without compromising modern aesthetics.",
      image: images.iron_stair_railing.ironStairRailling4,
      features: ["Laser-cut CNC or forged solid bar", "Concealed mounting tabs", "Oven-cured powder coating"],
    },
    {
      title: "Bespoke Metal Designs",
      subtitle: "Spiral Stairs & Statement Metalwork",
      description:
        "Curved spiral stair balustrades, structural brackets, decorative entry canopies, and specialized architectural elements brought from sketch to life.",
      image: images.steel_spiral_railing.ssSpiralRailling3,
      features: ["Precision roll-bending & curving", "Seamless ground welds", "Brass & PVD champagne gold accents"],
    },
  ];

  const customizationProcess = [
    {
      step: "01",
      title: "Share Your Requirements",
      description:
        "Send us your rough site dimensions, elevation drawings, reference photos from our gallery or Pinterest, and any functional preferences (sliding vs swing, motorized, privacy level).",
      icon: Sparkles,
    },
    {
      step: "02",
      title: "Discuss Design and Measurements",
      description:
        "Our team reviews the structural viability, suggests optimal metal alloys (SS 304, wrought iron, or mild steel), verifies pillar-to-pillar clearances, and finalizes the detailed design drawing.",
      icon: Wrench,
    },
    {
      step: "03",
      title: "Review the Proposal",
      description:
        "Receive a clear, transparent, itemized quotation detailing material gauge, weight estimation, surface finish, hardware inclusions, and agreed manufacturing lead time.",
      icon: CheckCircle2,
    },
    {
      step: "04",
      title: "Fabrication and Project Completion",
      description:
        "Master metalworkers in our Moradabad facility execute precision cold cutting, TIG/MIG welding, weld dressing, anti-rust priming, and coordinate careful transport and on-site fitting.",
      icon: ShieldCheck,
    },
  ];

  return (
    <main className="bg-background text-white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Custom Metalwork and Architectural Fabrication",
          provider: {
            "@type": "LocalBusiness",
            name: "Afsha Creative Solutions",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Harthala, Lodhipur",
              addressLocality: "Moradabad",
              addressRegion: "Uttar Pradesh",
              postalCode: "244001",
              addressCountry: "IN",
            },
          },
          description:
            "Custom architectural metal fabrication in Moradabad: made-to-measure metal gates, iron balustrades, staircase railings, and decorative metalwork.",
          url: absoluteUrl("/custom-metalwork"),
        }}
      />

      {/* Hero Section */}
      <PageHero
        eyebrow="Bespoke Architectural Metalwork"
        title={
          <>
            Designed Around <span className="text-textGold font-heading">Your Vision.</span>
          </>
        }
        description="Every project begins with your space and your architectural goals. From single private villa gates to complete estate railing systems, we fabricate made-to-measure metalwork that endures for generations."
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Custom Metalwork", href: "/custom-metalwork" },
        ]}
        primaryCta={{ label: "Request a Custom Quote", href: "#quote-form" }}
        secondaryCta={{ label: "Explore Process", href: "#process" }}
        badges={[
          "Zero Off-the-Shelf Templates",
          "Exact Millimeter Tolerances",
          "Moradabad Artisan Workshop",
          "Comprehensive Warranty Support",
        ]}
      />

      {/* What We Create Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow="Capabilities & Scope"
          title="What We Create"
          description="We fabricate architectural metalwork tailored to your specific requirements, structural loads, and exterior elevations."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whatWeCreate.map((item, index) => (
            <div
              key={item.title}
              className="group flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#080808] transition duration-300 hover:border-textGold/40 hover:bg-[#0c0c0c]"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-[#111]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 text-[10px] tracking-[0.2em] text-white/50">
                    {String(index + 1).padStart(2, "0")} / SCOPE
                  </span>
                </div>

                <div className="p-6">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-textGold">
                    {item.subtitle}
                  </p>
                  <h3 className="mt-1 text-xl font-light text-white group-hover:text-textGold transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/60">
                    {item.description}
                  </p>

                  <ul className="mt-5 space-y-2 border-t border-white/5 pt-4">
                    {item.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2 text-xs text-white/50">
                        <span className="h-1.5 w-1.5 rounded-full bg-textGold" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-6 pt-0">
                <a
                  href="#quote-form"
                  className="inline-flex min-h-10 w-full items-center justify-between rounded-md border border-white/10 bg-white/[0.02] px-4 text-[10px] font-medium uppercase tracking-[0.16em] text-white/70 transition hover:border-textGold hover:bg-textGold hover:text-black"
                >
                  <span>Inquire for {item.title}</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4-Step Customization Process */}
      <section id="process" className="border-y border-white/10 bg-[#050505] px-4 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            align="center"
            eyebrow="Precision Workflow"
            title="Our Four-Step Customization Process"
            description="From initial sketch to secure installation, our proven workflow ensures your metalwork arrives exactly as intended."
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
            {customizationProcess.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="relative flex flex-col justify-between rounded-xl border border-white/10 bg-[#090909] p-6 transition duration-300 hover:border-textGold/40 sm:p-7"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold tracking-[0.24em] text-textGold">
                        STEP {step.step}
                      </span>
                      <Icon size={18} className="text-textGold/60" />
                    </div>

                    <h3 className="mt-6 text-lg font-light text-white sm:text-xl">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-white/55">
                      {step.description}
                    </p>
                  </div>

                  <div className="mt-6 h-0.5 w-8 bg-textGold/30" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quote Form Section */}
      <section id="quote-form" className="mx-auto max-w-5xl scroll-mt-20 px-4 py-12 sm:px-6 sm:py-20">
        <QuoteForm
          defaultCategory="gates"
          title="Share Your Vision — Request a Custom Quote"
          subtitle="Provide your project dimensions, design references, and material preferences. We’ll analyze the structural specs and reply promptly with a comprehensive proposal."
        />
      </section>

      {/* Workshop & Quality Assurance Strip */}
      <section className="border-t border-white/10 bg-[#080808] px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-6">
              <span className="text-[10px] uppercase tracking-[0.2em] text-textGold">Material Rigor</span>
              <h3 className="mt-3 text-base font-light text-white sm:text-lg">Certified Alloy Grades</h3>
              <p className="mt-2 text-sm leading-6 text-white/50">
                We strictly use genuine AISI 304 and 316 stainless steel and heavy-gauge solid wrought iron. No thin-gauge hollow tubes that dent or deform over time.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-6">
              <span className="text-[10px] uppercase tracking-[0.2em] text-textGold">Craftsmanship</span>
              <h3 className="mt-3 text-base font-light text-white sm:text-lg">Ground Seamless Welds</h3>
              <p className="mt-2 text-sm leading-6 text-white/50">
                Argon TIG and MIG structural welds are ground flush and hand-sanded with progressive abrasive grits so joint lines become imperceptible to the touch.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-6">
              <span className="text-[10px] uppercase tracking-[0.2em] text-textGold">Anti-Corrosion</span>
              <h3 className="mt-3 text-base font-light text-white sm:text-lg">Multi-Stage Finishing</h3>
              <p className="mt-2 text-sm leading-6 text-white/50">
                Multi-layer zinc phosphate primers, automotive PU topcoats, and electro-statically applied oven-baked powder coats ensure decades of weather resilience.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Direct Workshop Discussion"
        title="Prefer discussing your measurements directly?"
        description="Our master fabricators are available on WhatsApp and phone to review your photos, drawings, and site requirements."
        primaryLabel="Message On WhatsApp"
        secondaryLabel="Call Our Workshop"
        secondaryHref="tel:+919634776691"
      />
    </main>
  );
}
