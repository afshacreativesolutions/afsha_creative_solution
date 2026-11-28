import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import LeadEnquiryForm from "@/components/lead/LeadEnquiryForm";
import OpenQuoteButton from "@/components/lead/OpenQuoteButton";
import TrackedActionLink from "@/components/lead/TrackedActionLink";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import CMSPageRenderer from "@/components/cms/CMSPageRenderer";
import FAQSection from "@/components/cms/sections/FAQSection";
import { getPublicCategories, getPublicProducts } from "@/lib/catalog";
import { getCmsPageForRender, getPublishedCmsSiteSettings } from "@/lib/cms/queries";
import { buildCmsPageMetadata } from "@/lib/cms/seo";
import { images } from "@/utils/images";
import { absoluteUrl, canonicalUrl, SITE_NAME } from "@/lib/seo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type CategoryPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const cmsOverride = await getCmsPageForRender(`/categories/${slug}`);
  if (cmsOverride) {
    return buildCmsPageMetadata(cmsOverride, `/categories/${slug}`);
  }
  const categories = await getPublicCategories();
  const category = categories.find((item) => item.slug === slug);
  if (!category) return { title: "Category Not Found | Afsha Creative Solutions" };
  const title = `${category.name} | Afsha Creative Solutions`;
  const description =
    category.description ||
    `Explore bespoke ${category.name.toLowerCase()} handcrafted in Moradabad by Afsha Creative Solutions. Made-to-measure sizing and premium finishes.`;
  const canonical = canonicalUrl(`/categories/${category.slug}`);
  const ogImageUrl = absoluteUrl(`/categories/${category.slug}/opengraph-image`);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: SITE_NAME,
      title: category.name,
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
      title: category.name,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [cmsOverride, categories, products, siteSettings] = await Promise.all([
    getCmsPageForRender(`/categories/${slug}`),
    getPublicCategories(),
    getPublicProducts(),
    getPublishedCmsSiteSettings(),
  ]);

  if (cmsOverride) {
    return (
      <CMSPageRenderer
        page={cmsOverride}
        context={{
          products,
          categories,
          whatsappNumber: siteSettings.site_identity.whatsappNumber,
        }}
      />
    );
  }

  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();

  const tpl = siteSettings.template_defaults.categoryDetail;
  const categoryPath = `/categories/${category.slug}`;
  const whatsappNumber = siteSettings.site_identity.whatsappNumber;
  const whatsappUrl = buildWhatsAppUrl({
    intent: "category",
    whatsappNumber,
    categoryName: category.name,
    categoryUrl: categoryPath,
  });

  const categoryProducts = products.filter(
    (product) =>
      product.category?.slug === slug ||
      (slug === "gates" && product.name.toLowerCase().includes("gate")) ||
      (slug === "stair-railings" && product.name.toLowerCase().includes("stair")) ||
      (slug === "balcony-railings" && product.name.toLowerCase().includes("balcony"))
  );

  // Fallback visual portfolio for this category when DB products are being drafted
  const fallbackCategoryImages =
    slug === "gates"
      ? [
          { title: "Modern Stainless Steel Gate", img: images.steel_gate.ssGate13, mat: "304 Stainless Steel" },
          { title: "Handcrafted Iron Entrance Gate", img: images.iron_gates.ironGate3, mat: "Wrought Iron" },
          { title: "Contemporary Sliding Gate", img: images.steel_gate.ssGate1, mat: "Stainless Steel" },
          { title: "Classical Archway Double Gate", img: images.iron_gates.ironGate1, mat: "Forged Iron" },
        ]
      : slug === "balcony-railings"
      ? [
          { title: "Ornate Wrought Iron Balustrade", img: images.iron_balcony_railing.ironbrail3, mat: "Solid Wrought Iron" },
          { title: "Minimal Horizon Balcony Railing", img: images.steel_balcony_railing.ssBalconyRailling4, mat: "304 Stainless Steel" },
          { title: "French Juliet Balcony Rail", img: images.iron_balcony_railing.ironbrail1, mat: "Forged Iron" },
          { title: "Glass-Ready Balcony Post System", img: images.steel_balcony_railing.ssBalconyRailling7, mat: "Stainless Steel" },
        ]
      : slug === "spiral-railings"
      ? [
          { title: "Sculptural Helical Spiral Rail", img: images.steel_spiral_railing.ssSpiralRailling3, mat: "Roll-Bent Stainless Steel" },
          { title: "Exterior Spiral Safety Rail", img: images.steel_spiral_railing.ssSpiralRailling1, mat: "High-Tensile Steel" },
        ]
      : [
          { title: "Duplex Floating Stair Railing", img: images.steel_stair_railing.ssStairRailling8, mat: "Stainless Steel" },
          { title: "Royal Artisan Stair Balustrade", img: images.iron_stair_railing.ironStairRailling4, mat: "Forged Iron" },
          { title: "Commercial Multi-Floor Handrail", img: images.steel_stair_railing.ssStairRailling13, mat: "Stainless Steel Tubing" },
          { title: "Heritage Scroll Stair Railing", img: images.iron_stair_railing.ironStairRailling2, mat: "Mild Steel & Teak Mount" },
        ];

  return (
    <main className="bg-background text-white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: category.name,
          description: category.description || undefined,
          url: canonicalUrl(categoryPath),
        }}
      />

      <PageHero
        eyebrow={tpl.heroEyebrow}
        title={
          <>
            {category.name} <span className="text-textGold font-heading">Collection</span>
          </>
        }
        description={
          category.description ||
          `Bespoke ${category.name.toLowerCase()} engineered to order. We customize every detail from dimensions and metal alloys to surface textures and hardware.`
        }
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Categories", href: "/categories" },
          { name: category.name, href: categoryPath },
        ]}
        primaryCta={{ label: tpl.primaryCtaLabel, href: tpl.primaryCtaHref }}
        badges={tpl.badges}
      />

      {/* Products & Designs Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow={tpl.portfolioEyebrow}
            title={`${category.name} Portfolio`}
            description={tpl.portfolioDescription}
          />
          <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:items-center">
            <TrackedActionLink
              href={whatsappUrl}
              eventName="category_enquiry_click"
              trackingProps={{
                placement: "category_page_header",
                channel: "whatsapp",
                categorySlug: category.slug,
                sourcePage: categoryPath,
              }}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full border border-textGold/60 bg-textGold/10 px-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-textGold transition hover:bg-textGold hover:text-black sm:w-auto"
            >
              <WhatsAppIcon size={15} />
              <span>Enquire on WhatsApp</span>
            </TrackedActionLink>
            <OpenQuoteButton
              label={`Quote for ${category.name}`}
              prefill={{
                title: `Quote: ${category.name}`,
                categorySlug: category.slug,
                placement: "category_page",
                pageUrl: categoryPath,
              }}
              className="w-full shrink-0 sm:w-auto"
            />
          </div>
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categoryProducts.map((product, idx) => {
              const image = product.images.find((item) => item.is_primary) ?? product.images[0];
              const fallbackItem = fallbackCategoryImages[idx % fallbackCategoryImages.length];
              const displayImage = image?.url || fallbackItem?.img;
              const productPath = `/products/${product.slug}`;
              const productWaHref = buildWhatsAppUrl({
                intent: "product",
                whatsappNumber,
                productName: product.name,
                productUrl: productPath,
              });

              return (
                <article
                  key={product.id}
                  className="group flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#080808] transition duration-300 hover:border-textGold/40"
                >
                  <Link href={productPath} className="block flex-1">
                    <div className="relative aspect-[0.91] overflow-hidden bg-[#111]">
                      {displayImage && (
                        <Image
                          src={displayImage}
                          alt={image?.alt_text || product.name}
                          fill
                          unoptimized={typeof displayImage === "string" && displayImage.startsWith("http")}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    </div>
                    <div className="p-5 pb-3">
                      <span className="text-[9px] uppercase tracking-[0.2em] text-textGold">
                        {product.materials.join(", ") || "Made to measure"}
                      </span>
                      <h3 className="mt-1 text-lg font-light text-white transition-colors group-hover:text-textGold">
                        {product.name}
                      </h3>
                      {product.short_description && (
                        <p className="mt-2 text-xs leading-5 text-white/50">
                          {product.short_description}
                        </p>
                      )}
                    </div>
                  </Link>

                  <div className="flex flex-col gap-2 border-t border-white/10 p-4 pt-3 sm:flex-row sm:items-center">
                    <TrackedActionLink
                      href={productWaHref}
                      eventName="product_enquiry_click"
                      trackingProps={{
                        placement: "category_product_card",
                        channel: "whatsapp",
                        productSlug: product.slug,
                        categorySlug: category.slug,
                        sourcePage: categoryPath,
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                      ariaLabel={`Ask about ${product.name} on WhatsApp`}
                      className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-textGold/60 bg-textGold/10 px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-textGold transition hover:bg-textGold hover:text-black"
                    >
                      <WhatsAppIcon size={14} />
                      <span>Ask About This Product</span>
                    </TrackedActionLink>
                    <Link
                      href={productPath}
                      className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-white/15 px-4 text-[10px] uppercase tracking-[0.14em] text-white/75 transition hover:border-textGold/50 hover:text-white"
                    >
                      <span>Specs</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {fallbackCategoryImages.map((item) => {
              const fallbackWaHref = buildWhatsAppUrl({
                intent: "product",
                whatsappNumber,
                productName: item.title,
                productUrl: categoryPath,
              });

              return (
                <div
                  key={item.title}
                  className="group flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#080808] p-5 transition duration-300 hover:border-textGold/40"
                >
                  <div>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#111]">
                      <Image
                        src={item.img}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <span className="mt-4 block text-[9px] uppercase tracking-[0.2em] text-textGold">
                      {item.mat}
                    </span>
                    <h3 className="mt-1 text-base font-light text-white transition-colors group-hover:text-textGold">
                      {item.title}
                    </h3>
                  </div>

                  <div className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-3">
                    <TrackedActionLink
                      href={fallbackWaHref}
                      eventName="category_enquiry_click"
                      trackingProps={{
                        placement: "category_fallback_card",
                        channel: "whatsapp",
                        categorySlug: category.slug,
                        sourcePage: categoryPath,
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-textGold/60 bg-textGold/10 px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-textGold transition hover:bg-textGold hover:text-black"
                    >
                      <WhatsAppIcon size={14} />
                      <span>Enquire on WhatsApp</span>
                    </TrackedActionLink>
                    <OpenQuoteButton
                      label="Request Similar Design"
                      variant="outline"
                      className="w-full"
                      prefill={{
                        title: `Quote: ${item.title}`,
                        subtitle: `${category.name} · ${item.mat}`,
                        productName: item.title,
                        categorySlug: category.slug,
                        placement: "category_card",
                        pageUrl: categoryPath,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section
        id="category-enquiry"
        aria-label={`Get a quote for ${category.name}`}
        className="mx-auto max-w-5xl scroll-mt-20 border-t border-white/10 px-4 py-10 sm:px-6 sm:py-16"
      >
        <LeadEnquiryForm
          categories={categories.map(({ slug: catSlug, name }) => ({ slug: catSlug, name }))}
          defaultCategory={category.slug}
          placement="category_page"
          whatsappNumber={whatsappNumber}
          heading={`Get a Custom Quote for ${category.name}`}
          subheading="Tell us your required size, city, and design preference for a fast estimate."
        />
      </section>

      <div className="border-t border-white/10">
        <FAQSection
          content={{
            sectionId: "category-faq",
            variant: "compact_home",
            eyebrow: "Fabrication FAQs",
            heading: `Questions About ${category.name}`,
            description:
              "Details on custom dimensions, site survey, and workshop finish quality.",
            link: { label: "All FAQs", href: "/faqs" },
            items: [
              {
                category: "pricing",
                question: `How is the cost estimated for ${category.name}?`,
                answer:
                  "Submit your name, WhatsApp number, city, and approximate opening width and height in the form above, or message us directly on WhatsApp.",
              },
              {
                category: "customization",
                question: `Are your ${category.name.toLowerCase()} fabricated in custom sizes?`,
                answer:
                  "Yes. Every piece is measured and built for your site layout rather than sold in rigid stock sizes.",
              },
              {
                category: "process",
                question: "Can I upload a reference image or site photo?",
                answer:
                  "Yes. You can attach a JPG, PNG, or WebP site photo or sketch directly in the quote form above.",
              },
              {
                category: "delivery",
                question: "Where do you provide installation services?",
                answer:
                  "Our fabrication workshop is in Moradabad, UP, serving homeowners, contractors, and architects across Moradabad, Rampur, Sambhal, Amroha, Bareilly, and nearby NCR.",
              },
            ],
          }}
        />
      </div>

      <CTASection
        eyebrow={`Custom ${category.name}`}
        title={`${tpl.ctaTitlePrefix} ${category.name.toLowerCase()}?`}
        description={tpl.ctaDescription}
        primaryLabel="Enquire on WhatsApp"
        primaryHref={whatsappUrl}
        secondaryLabel="Submit Specifications"
        secondaryHref={tpl.primaryCtaHref}
        trackingEvent="category_enquiry_click"
        trackingProps={{
          placement: "category_bottom_cta",
          channel: "whatsapp",
          categorySlug: category.slug,
          sourcePage: categoryPath,
        }}
      />
    </main>
  );
}
