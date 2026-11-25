import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Hero from "@/components/hero";
import Feature from "@/components/Feature";
import { Collections } from "@/components/Collections";
import Videos from "@/components/Videos";
import Testimonials from "@/components/Testimonials";
import Map from "@/components/Map";
import { getPublicProducts } from "@/lib/catalog";
import { collectionsData as fallbackCollections, croselData as fallbackProjects } from "@/utils/data";
import type { collectionDataType } from "@/utils/type";
import { DEFAULT_KEYWORDS } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Custom Metal Gates & Railings in Moradabad | Afsha Creative Solutions",
  description: "Explore premium custom metal gates, architectural railings and decorative metalwork by Afsha Creative Solutions in Moradabad, India. Request a custom design and quote.",
  keywords: DEFAULT_KEYWORDS,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "Custom Metal Gates & Railings in Moradabad | Afsha Creative Solutions",
    description: "Explore premium custom metal gates, architectural railings and decorative metalwork by Afsha Creative Solutions in Moradabad, India. Request a custom design and quote.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Metal Gates & Railings in Moradabad | Afsha Creative Solutions",
    description: "Explore premium custom metal gates, architectural railings and decorative metalwork by Afsha Creative Solutions in Moradabad, India. Request a custom design and quote.",
  },
};

export const revalidate = 300;

export default async function Home() {
  const products = await getPublicProducts();
  const publicProjects = products.map((product) => {
    const image = product.images.find((item) => item.is_primary) ?? product.images[0];
    return {
      title: product.name,
      description: product.short_description || product.description,
      tagline: product.category?.name ?? "Custom metalwork",
      image: image?.url ?? "",
      href: `/products/${product.slug}`,
      isFeatured: product.is_featured,
      categorySlug: product.category?.slug,
      categoryName: product.category?.name,
    };
  }).filter((product) => product.image);
  const featured = publicProjects.filter((product) => product.isFeatured);
  const isGate = (product: (typeof publicProjects)[number]) =>
    product.categorySlug?.toLowerCase().includes("gate") || product.categoryName?.toLowerCase().includes("gate") || false;
  const projectRows = publicProjects.length
    ? (featured.length ? featured : publicProjects).map(({ isFeatured: _isFeatured, categorySlug: _categorySlug, categoryName: _categoryName, ...project }) => project)
    : fallbackProjects;
  const collectionRows: collectionDataType = publicProjects.length
    ? {
        Gates: publicProjects.filter(isGate).map(({ categorySlug: _categorySlug, categoryName: _categoryName, isFeatured: _isFeatured, ...product }) => product),
        Raillings: publicProjects.filter((product) => !isGate(product)).map(({ categorySlug: _categorySlug, categoryName: _categoryName, isFeatured: _isFeatured, ...product }) => product),
      }
    : fallbackCollections;

  return (
    <div className="bg-background">
      <link rel="preload" as="image" href="/videos/hero-poster.webp" type="image/webp" fetchPriority="high" />
      <h1 className="sr-only">Premium Custom Metal Gates & Architectural Metalwork</h1>
      <Hero/>
      <section className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-16">
        <div className="mb-6 flex flex-col gap-3 sm:mb-10 sm:gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-textGold">Made to measure · Moradabad, India</p>
            <h2 className="text-2xl font-light tracking-tight sm:text-4xl">Explore Our Metalwork Collection</h2>
          </div>
          <Link href="/products" className="inline-flex min-h-11 items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-white/65 transition-colors hover:text-textGold">
            Explore all products <ArrowRight size={14} />
          </Link>
        </div>
        <p className="mb-8 max-w-3xl text-sm leading-7 text-white/60 sm:mb-10 sm:text-base">
          Afsha Creative Solution creates custom metal gates, iron gates, steel gates, architectural railings, balcony railings, and decorative metal grills in Moradabad. Every design is made to measure for Indian homes and commercial spaces.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
          {[
            { number: "01", title: "Custom Main Gate Designs", description: "Iron and steel gates shaped around your entrance, security needs, and architectural style.", href: "/products?category=gates", label: "Explore gates" },
            { number: "02", title: "Premium Metal Railings", description: "Made-to-measure railings for staircases, balconies, and terraces in durable finishes.", href: "/products?category=stair-railings", label: "Explore railings" },
            { number: "03", title: "Decorative Metal Grills", description: "Distinctive metalwork for windows, partitions, and feature screens, finished to suit your space.", href: "/products", label: "View designs" },
          ].map((item) => (
            <Link key={item.number} href={item.href} className="group flex min-h-[230px] flex-col rounded-xl border border-white/10 bg-[#080808] p-5 transition duration-300 hover:-translate-y-1 hover:border-textGold/35 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] tracking-[0.2em] text-white/35">{item.number} / COLLECTION</span>
                <ArrowUpRight size={16} className="text-white/35 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-textGold" />
              </div>
              <h3 className="mt-7 text-lg font-light text-textGold sm:text-xl">{item.title}</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-white/55">{item.description}</p>
              <span className="mt-auto inline-flex items-center gap-2 pt-5 text-[9px] font-medium uppercase tracking-[0.18em] text-white/65 transition-colors group-hover:text-textGold">{item.label}<ArrowRight size={13} /></span>
            </Link>
          ))}
        </div>
      </section>
      <Feature projects={projectRows}/>
      <div className="border-b border-gray-950 w-full"></div>
      <Collections collectionsData={collectionRows}/>
      <div className="border-b border-gray-950 w-full"></div>
      <section className="border-y border-white/10 bg-[#050505]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-16">
            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-textGold">From first sketch to final fit</p>
              <h2 className="text-2xl font-light tracking-tight sm:text-4xl">Made-to-Measure Metal Fabrication</h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-white/60 sm:text-base">Every project starts with your space and how you want to use it. We guide the details from measurements and material choices through fabrication and installation.</p>
          </div>

          <ol className="mt-9 grid gap-3 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-4">
            {[
              { number: "01", title: "Understand your space", description: "We discuss the location, design, size, and needs of your project." },
              { number: "02", title: "Plan the details", description: "Choose materials, finishes, and custom details with our team." },
              { number: "03", title: "Craft with care", description: "Your metalwork is fabricated to the agreed design and measurements." },
              { number: "04", title: "Complete your project", description: "We coordinate finishing and installation around your project needs." },
            ].map((step) => (
              <li key={step.number} className="rounded-xl border border-white/10 bg-[#090909] p-5 sm:p-6">
                <span className="text-[10px] tracking-[0.2em] text-textGold">STEP {step.number}</span>
                <h3 className="mt-5 text-base font-light text-white sm:text-lg">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/50">{step.description}</p>
              </li>
            ))}
          </ol>

          <div className="mt-6 flex flex-col gap-3 rounded-xl border border-textGold/20 bg-textGold/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-textGold">Our craftsmanship</p>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/65">Traditional metalworking skills meet modern architectural design—creating gates and railings made for everyday use.</p>
            </div>
            <Link href="/contact" className="inline-flex min-h-11 shrink-0 items-center gap-2 text-[9px] font-medium uppercase tracking-[0.18em] text-textGold transition-colors hover:text-white">Discuss your project <ArrowUpRight size={14} /></Link>
          </div>
        </div>
      </section>
      <Videos/>
      <div className="border-b border-gray-950 w-full"></div>
      <Testimonials/>
      <div className="border-b border-gray-950 w-full"></div>
      <Map/>
      <div className="border-b border-gray-950 w-full"></div>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-textGold">Helpful details</p>
            <h2 className="text-2xl font-light tracking-tight sm:text-4xl">Frequently Asked Questions</h2>
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/55">A few quick answers about custom metalwork, materials, and getting started.</p>
            <Link href="/faq" className="mt-5 inline-flex min-h-11 items-center gap-2 text-[9px] font-medium uppercase tracking-[0.18em] text-textGold transition-colors hover:text-white">See all questions <ArrowRight size={14} /></Link>
          </div>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {[
              { question: "Do you make custom metal gates in Moradabad?", answer: "Yes. We design and fabricate gates to your required size, style, material, and finish." },
              { question: "Can I request a quote before finalizing a design?", answer: "Yes. Share your requirements through the contact page or WhatsApp and our team will guide the next steps." },
              { question: "Do you manufacture iron and steel railings?", answer: "Yes. We make iron and steel railings for staircases, balconies, and other spaces on a made-to-measure basis." },
              { question: "Are products available in standard sizes?", answer: "Most work is made to measure. We can discuss standard or project-specific dimensions during consultation." },
            ].map((faq) => (
              <details key={faq.question} className="group py-4 sm:py-5">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-sm font-light text-white marker:content-none sm:text-base [&::-webkit-details-marker]:hidden">
                  <span>{faq.question}</span>
                  <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 text-lg font-light text-textGold transition-transform duration-200 group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-2xl pt-2 pr-10 text-sm leading-6 text-white/55">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
    
  );
}
