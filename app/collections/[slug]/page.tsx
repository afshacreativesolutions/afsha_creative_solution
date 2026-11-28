import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CmsImage from "@/components/cms/CmsImage";
import FAQSection from "@/components/cms/sections/FAQSection";
import JsonLd from "@/components/JsonLd";
import LeadEnquiryForm from "@/components/lead/LeadEnquiryForm";
import OpenQuoteButton from "@/components/lead/OpenQuoteButton";
import TrackedActionLink from "@/components/lead/TrackedActionLink";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { getPublicCategories, getPublicProducts } from "@/lib/catalog";
import { getPublishedCmsSiteSettings } from "@/lib/cms/queries";
import { resolveCollectionImage } from "@/lib/collections";
import { SITE_NAME, absoluteUrl, canonicalUrl } from "@/lib/seo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getPublicCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    return {
      title: `Collection Not Found | ${SITE_NAME}`,
      robots: { index: false, follow: false },
    };
  }

  const title = `${category.name} — Custom Architectural Collection | ${SITE_NAME}`;
  const description =
    category.description ||
    `Explore made-to-measure ${category.name.toLowerCase()} fabricated in 304 stainless steel and wrought iron in Moradabad by ${SITE_NAME}.`;
  const canonical = canonicalUrl(`/collections/${category.slug}`);
  const ogImageUrl = absoluteUrl(`/collections/${category.slug}/opengraph-image`);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: SITE_NAME,
      title,
      description,
      url: canonical,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${category.name} — ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [categories, products, siteSettings] = await Promise.all([
    getPublicCategories(),
    getPublicProducts(),
    getPublishedCmsSiteSettings(),
  ]);

  const category = categories.find((c) => c.slug === slug);
  if (!category) {
    notFound();
  }

  const collectionProducts = products.filter(
    (product) =>
      product.category?.slug === category.slug || product.category_id === category.id
  );
  const collectionHeroImage = resolveCollectionImage(category, collectionProducts);
  const whatsappNumber = siteSettings.site_identity.whatsappNumber;
  const collectionCanonical = canonicalUrl(`/collections/${category.slug}`);
  const whatsappHref = buildWhatsAppUrl({
    intent: "category",
    categoryName: category.name,
    categoryUrl: `/collections/${category.slug}`,
    whatsappNumber,
  });

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description:
      category.description ||
      `Custom ${category.name.toLowerCase()} handcrafted in Moradabad.`,
    url: collectionCanonical,
    image: absoluteUrl(`/collections/${category.slug}/opengraph-image`),
    numberOfItems: collectionProducts.length,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl("/") },
      { "@type": "ListItem", position: 2, name: "Collections", item: canonicalUrl("/collections") },
      { "@type": "ListItem", position: 3, name: category.name, item: collectionCanonical },
    ],
  };

  const collectionFaqs = [
    {
      category: category.slug,
      question: `Are ${category.name.toLowerCase()} fabricated to custom site dimensions?`,
      answer:
        "Yes. Every gate and railing is measured after site inspection in Moradabad and built precisely to your opening width, height, and layout.",
    },
    {
      category: category.slug,
      question: `Which materials and finishes are available for ${category.name.toLowerCase()}?`,
      answer:
        "We fabricate using 304-grade stainless steel, heavy forged wrought iron, mild steel, and toughened glass panels with matte powder-coated or weather-resistant finishes.",
    },
    {
      category: category.slug,
      question: `How can I request pricing for ${category.name.toLowerCase()}?`,
      answer:
        "Share your approximate size and location via WhatsApp or the quote form below. We provide clear estimates and arrange measurement visits.",
    },
  ];

  return (
    <main className="min-h-screen bg-background pt-16 text-white sm:pt-20">
      <JsonLd data={[collectionSchema, breadcrumbSchema]} />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Collections", href: "/collections" },
          { name: category.name, href: `/collections/${category.slug}` },
        ]}
      />

      {/* Collection Hero */}
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-2 sm:px-6 sm:pb-16 sm:pt-6">
        <Link
          href="/collections"
          className="mb-5 inline-flex min-h-11 items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/55 transition hover:text-textGold"
        >
          <ArrowLeft size={14} /> All Collections
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-5">
            <p className="text-[10px] uppercase tracking-[0.25em] text-textGold">
              Collection · Made in Moradabad
            </p>
            <h1 className="font-heading text-3xl font-light tracking-tight text-white sm:text-5xl">
              {category.name}
            </h1>
            <p className="max-w-2xl text-sm font-light leading-7 text-white/70 sm:text-base">
              {category.description ||
                `Explore bespoke ${category.name.toLowerCase()} crafted with 304 stainless steel and forged iron for durable architecture and refined detailing.`}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <OpenQuoteButton
                label="Get a Quote"
                prefill={{
                  placement: "category_page",
                  categoryName: category.name,
                  categorySlug: category.slug,
                }}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-textGold px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-white"
              />
              <TrackedActionLink
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                eventName="category_enquiry_click"
                trackingProps={{
                  categorySlug: category.slug,
                  placement: "collection_hero",
                  channel: "whatsapp",
                }}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-[10px] uppercase tracking-[0.18em] text-white transition hover:border-textGold hover:text-textGold"
              >
                <WhatsAppIcon className="h-3.5 w-3.5" />
                Enquire on WhatsApp
              </TrackedActionLink>
            </div>
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#111]">
            <CmsImage
              image={collectionHeroImage.url}
              altFallback={collectionHeroImage.alt}
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Designs in this Collection */}
      <section className="mx-auto max-w-7xl border-t border-white/10 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-textGold">
              Catalogue Designs
            </p>
            <h2 className="mt-2 font-heading text-2xl font-light text-white sm:text-3xl">
              {collectionProducts.length > 0
                ? `${collectionProducts.length} Featured ${category.name} Designs`
                : `Bespoke ${category.name} Fabrication`}
            </h2>
          </div>
          <Link
            href="/collections"
            className="inline-flex min-h-11 items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-textGold hover:text-white"
          >
            Browse All Collections <ArrowRight size={13} />
          </Link>
        </div>

        {collectionProducts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {collectionProducts.map((product) => {
              const primaryImage =
                product.images.find((i) => i.is_primary) ?? product.images[0];
              return (
                <article
                  key={product.id}
                  className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#080808] transition hover:border-textGold/40"
                >
                  <Link
                    href={`/products/${product.slug}`}
                    className="relative aspect-[4/3] w-full overflow-hidden bg-[#111]"
                  >
                    <CmsImage
                      image={primaryImage?.url || collectionHeroImage.url}
                      altFallback={product.name}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {product.images.length > 1 && (
                      <span className="absolute right-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[9px] uppercase tracking-[0.14em] text-white/80">
                        {product.images.length} Photos
                      </span>
                    )}
                  </Link>

                  <div className="flex flex-1 flex-col p-5">
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="text-lg font-light text-white transition-colors group-hover:text-textGold">
                        {product.name}
                      </h3>
                    </Link>
                    {product.materials && product.materials.length > 0 && (
                      <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/45">
                        {product.materials.join(" · ")}
                      </p>
                    )}
                    <p className="mt-2.5 line-clamp-2 text-xs leading-5 text-white/65">
                      {product.short_description || product.description}
                    </p>

                    <div className="mt-auto flex items-center gap-2 border-t border-white/10 pt-4">
                      <Link
                        href={`/products/${product.slug}`}
                        className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-[10px] font-medium uppercase tracking-[0.15em] text-white transition hover:border-textGold hover:bg-textGold hover:text-black"
                      >
                        <span>View Design</span>
                        <ArrowRight size={13} />
                      </Link>
                      <OpenQuoteButton
                        label="Quote"
                        prefill={{
                          placement: "collection_detail_card",
                          productName: product.name,
                          productSlug: product.slug,
                          categoryName: category.name,
                          categorySlug: category.slug,
                        }}
                        className="inline-flex min-h-11 items-center justify-center rounded-lg border border-textGold/35 bg-textGold/10 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.15em] text-textGold transition hover:bg-textGold hover:text-black"
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-8">
            <p className="max-w-2xl text-sm font-light leading-7 text-white/75">
              All {category.name.toLowerCase()} are fabricated custom to your architectural plans, driveway clearance, and finish preferences. Share a sketch or photo with our Moradabad workshop to begin.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <OpenQuoteButton
                label="Request Custom Design Quote"
                prefill={{
                  placement: "category_page",
                  categoryName: category.name,
                  categorySlug: category.slug,
                }}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-textGold px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-white"
              />
              <TrackedActionLink
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                eventName="category_enquiry_click"
                trackingProps={{
                  categorySlug: category.slug,
                  placement: "collection_bespoke",
                  channel: "whatsapp",
                }}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-[10px] uppercase tracking-[0.18em] text-white transition hover:border-textGold hover:text-textGold"
              >
                <WhatsAppIcon className="h-3.5 w-3.5" />
                Chat on WhatsApp
              </TrackedActionLink>
            </div>
          </div>
        )}
      </section>

      <FAQSection
        content={{
          variant: "stacked_list",
          heading: `${category.name} FAQs`,
          description: "Common questions about materials, sizing, and installation.",
          items: collectionFaqs,
        }}
      />

      {/* Focused Collection Quote Form */}
      <section className="mx-auto max-w-4xl border-t border-white/10 px-4 py-12 sm:px-6 sm:py-16">
        <LeadEnquiryForm
          heading={`Request a Quote for ${category.name}`}
          subheading="Tell us your project city and approximate dimensions for workshop pricing."
          defaultCategory={category.slug}
          categoryName={category.name}
          placement={`collection:${category.slug}`}
          whatsappNumber={whatsappNumber}
        />
      </section>
    </main>
  );
}
