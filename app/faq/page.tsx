import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import PageHero from "@/components/PageHero";
import FAQAccordion, { type FAQItem } from "@/components/FAQAccordion";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Afsha Creative Solutions",
  description:
    "Common questions about custom metal gates, iron balustrades, stainless steel railings, made-to-measure fabrication, pricing, and workshop visits in Moradabad.",
  alternates: { canonical: "/faq" },
  openGraph: {
    type: "website",
    title: "Frequently Asked Questions | Afsha Creative Solutions",
    description:
      "Answers to common questions about custom metal gates, railings, fabrication processes, quotes, and delivery from Afsha Creative Solutions in Moradabad.",
    url: "/faq",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions | Afsha Creative Solutions",
    description:
      "Answers to common questions about custom metal gates, railings, fabrication processes, quotes, and delivery from Afsha Creative Solutions in Moradabad.",
  },
};

export default function FAQPage() {
  const faqs: FAQItem[] = [
    // PRODUCTS
    {
      category: "products",
      question: "What types of metal gates do you manufacture?",
      answer:
        "We manufacture a wide range of custom vehicular entrance gates, including modern stainless steel (Grade 304 and 316) gates, handcrafted solid wrought iron gates, and mild steel architectural gates. Our designs support sliding tracks, cantilever sliding systems, and single or double bi-parting swing mechanisms. Every gate can be pre-configured for automated gate motor openers.",
    },
    {
      category: "products",
      question: "Do you manufacture custom iron gates and how do you protect them from rust?",
      answer:
        "Yes, handcrafted wrought iron and mild steel gates are a signature specialty of our Moradabad workshop. To ensure long-lasting rust protection against severe monsoons, all iron fabrications undergo abrasive surface preparation, a heavy-build zinc phosphate epoxy anti-corrosive primer, and two coats of automotive-grade polyurethane (PU) or thermo-set powder coating.",
    },
    {
      category: "products",
      question: "What railing designs and materials are available?",
      answer:
        "We create made-to-measure railings for interior staircases, exterior balconies, terraces, and spiral stairs. Material options include satin and mirror-polished Grade 304 stainless steel, forged wrought iron with classical scrollwork, minimalist flat-bar configurations, and metal systems engineered to integrate 12mm toughened safety glass or wooden handrails.",
    },
    {
      category: "products",
      question: "What is the difference between Grade 304 and Grade 202 stainless steel?",
      answer:
        "Grade 304 contains a minimum of 18% chromium and 8% nickel, making it truly corrosion-resistant in outdoor, monsoon, and high-humidity environments. Grade 202 contains lower nickel content and is prone to surface tea-staining and oxidization when exposed to outdoor rain. We recommend Grade 304 for all outdoor gates, balcony balustrades, and external railings.",
    },

    // CUSTOMIZATION
    {
      category: "customization",
      question: "Can I request custom dimensions and site-specific sizing?",
      answer:
        "Absolutely. Over 80% of our production is made-to-measure. We do not restrict clients to standard modular sizes. We fabricate your gate, railing, or grill around the exact millimeter dimensions of your masonry pillars, driveway slope, staircase rise/run, or terrace perimeter.",
    },
    {
      category: "customization",
      question: "Can I share my own architectural CAD drawings or Pinterest design references?",
      answer:
        "Yes. We frequently collaborate with architects, interior designers, builders, and homeowners who bring custom sketches, CAD elevations, or reference photos from Pinterest and Instagram. Our engineering team reviews the concept, validates structural rigidity and safety spacing, and creates a tailored fabrication plan.",
    },
    {
      category: "customization",
      question: "What finishes and color coatings can I choose from?",
      answer:
        "We offer an array of architectural finishes: matte black, textured charcoal, antique bronze, satin hairline stainless steel, mirror polish, and high-durability oven-baked powder coats. We also fabricate custom decorative accents in brass and champagne gold PVD finishes.",
    },

    // ORDERING & QUOTES
    {
      category: "ordering",
      question: "How do I get an accurate quotation for my project?",
      answer:
        "To get a prompt estimate, share your approximate opening dimensions (width x height), preferred material (stainless steel vs wrought iron), photos or sketches of your design preference, and the installation location. You can submit this through our Custom Metalwork Quote Form or directly via WhatsApp.",
    },
    {
      category: "ordering",
      question: "Can I request a quotation before finalizing a design?",
      answer:
        "Yes. We are happy to provide ballpark budgetary estimates based on your preliminary dimensions and preferred style. Once you are comfortable with the budget range, we refine the exact drawings, material gauge specifications, and schedule.",
    },
    {
      category: "ordering",
      question: "What is the typical manufacturing lead time for custom metalwork?",
      answer:
        "Production timelines depend on design complexity and project scale. Standard custom gates and balcony railings typically require 2 to 3 weeks from final design approval. Larger multi-story architectural railing packages or elaborate ornamental haveli-style iron gates typically take 3 to 5 weeks.",
    },

    // WORKSHOP & LOCATION
    {
      category: "business",
      question: "Where is Afsha Creative Solutions located?",
      answer:
        "Our manufacturing workshop and design office are located in Moradabad, Uttar Pradesh, India: Near KK Farm House, Bishanpur Road, Harthala, Lodhipur, Moradabad 244001. Clients are welcome to visit our facility to inspect materials, discuss blueprints, and view fabrication in progress.",
    },
    {
      category: "business",
      question: "Do you serve customers outside Moradabad?",
      answer:
        "Yes. While our primary workshop is based in Moradabad, we regularly fabricate and deliver architectural metalwork across Western Uttar Pradesh (including Bareilly, Rampur, Sambhal, Amroha, Meerut) as well as Noida, Greater Noida, and the wider Delhi NCR region.",
    },
    {
      category: "business",
      question: "Do you provide on-site measurement and installation?",
      answer:
        "Yes, we provide on-site measurement surveys and skilled installation services in Moradabad and nearby regional districts. For projects located farther away, we can coordinate with your local contractor or supply pre-assembled panels with comprehensive installation instructions.",
    },
  ];

  return (
    <main className="bg-background text-white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }}
      />

      <PageHero
        eyebrow="Help & Knowledge Base"
        title={
          <>
            Frequently Asked <span className="text-textGold font-heading">Questions</span>
          </>
        }
        description="Clear answers about our custom metal gates, wrought iron manufacturing, material alloys, quotations, lead times, and workshop operations in Moradabad."
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "FAQ", href: "/faq" },
        ]}
        badges={[
          "Authentic Business Guidance",
          "Material Grade Information",
          "Customization Details",
          "Direct WhatsApp Support",
        ]}
      />

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
        <FAQAccordion faqs={faqs} />

        {/* Still have questions help card */}
        <div className="mt-16 rounded-2xl border border-white/10 bg-[#080808] p-8 text-center sm:p-12">
          <p className="text-[10px] uppercase tracking-[0.24em] text-textGold">
            Still have questions?
          </p>
          <h2 className="mt-2 text-2xl font-light text-white sm:text-3xl">
            Speak directly with our fabrication team
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/55">
            Whether you need material recommendations, structural load advice, or want to verify site dimensions, our team is happy to assist.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="https://wa.me/919634776691?text=Hello%20Afsha%20Creative%20Solution%2C%20I%20have%20a%20question%20about%20your%20custom%20metalwork."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-textGold bg-textGold px-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-white"
            >
              <MessageCircle size={16} /> Chat on WhatsApp
            </a>
            <a
              href="tel:+919634776691"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 px-6 text-[10px] uppercase tracking-[0.18em] text-white transition hover:border-textGold hover:text-textGold"
            >
              <Phone size={15} /> Call +91 96347 76691
            </a>
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Custom Metal Fabrication"
        title="Ready to begin your metalwork project?"
        description="Share your project requirements or book an on-site consultation with our Moradabad fabrication experts."
      />
    </main>
  );
}
