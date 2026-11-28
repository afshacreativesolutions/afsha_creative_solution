import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { getPublicCategories, getPublicProduct, getPublicProducts } from "@/lib/catalog";
import { getPublishedCmsSiteSettings } from "@/lib/cms/queries";
import type { ProductRecord } from "@/lib/catalog-types";
import { absoluteUrl, canonicalUrl, SITE_NAME } from "@/lib/site-config";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQSection from "@/components/cms/sections/FAQSection";
import JsonLd from "@/components/JsonLd";
import LeadEnquiryForm from "@/components/lead/LeadEnquiryForm";
import OpenQuoteButton from "@/components/lead/OpenQuoteButton";
import ProductEmailQuoteButton from "@/components/lead/ProductEmailQuoteButton";
import TrackedActionLink from "@/components/lead/TrackedActionLink";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import DesignQuoteButton from "./design-quote-button";
import ProductGalleryViewer from "./product-gallery-viewer";

type ProductPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublicProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found | Afsha Creative Solutions",
      robots: { index: false, follow: false },
    };
  }

  const title = product.seo_title || `${product.name} | Afsha Creative Solutions`;
  const ogTitle = product.seo_title || product.name;
  const rawDescription =
    product.seo_description ||
    product.short_description ||
    product.description ||
    `Explore made-to-measure ${product.name} crafted by Afsha Creative Solutions in Moradabad. View designs and request a custom quotation.`;
  const description = rawDescription.slice(0, 300);

  const canonical = canonicalUrl(`/products/${product.slug}`);
  const ogImageUrl = absoluteUrl(`/products/${product.slug}/opengraph-image`);

  return {
    title,
    description,
    keywords: product.focus_keyword ? [product.focus_keyword] : undefined,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: SITE_NAME,
      title: ogTitle,
      description,
      url: canonical,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: product.image_alt || `${product.name} — ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [ogImageUrl],
    },
  };
}

function DetailList({ title, values }: { title: string; values: string[] }) {
  if (!values.length) return null;
  return (
    <section className="border-t border-white/10 py-6">
      <h2 className="mb-4 text-[10px] uppercase tracking-[0.22em] text-textGold">{title}</h2>
      <ul className="flex flex-wrap gap-2">
        {values.map((value) => (
          <li key={value} className="border border-white/10 px-3 py-2 text-xs text-white/65">
            {value}
          </li>
        ))}
      </ul>
    </section>
  );
}

function relatedImage(product: ProductRecord) {
  const image = product.images.find((item) => item.is_primary) ?? product.images[0];
  return image?.url ?? "";
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [product, siteSettings, allProducts, categories] = await Promise.all([
    getPublicProduct(slug),
    getPublishedCmsSiteSettings(),
    getPublicProducts(),
    getPublicCategories(),
  ]);
  if (!product) notFound();

  const tpl = siteSettings.template_defaults.productDetail;
  const relatedProducts = allProducts
    .filter((item) => item.category_id === product.category_id && item.id !== product.id)
    .slice(0, 4);

  const productCanonical = canonicalUrl(`/products/${product.slug}`);
  const categorySlug = product.category?.slug || "custom-metalwork";
  const categoryName = product.category?.name || "Metalwork";
  const primaryImage = product.images.find((item) => item.is_primary) ?? product.images[0];
  const productDescription = product.short_description || product.description || "";
  const whatsappNumber = siteSettings.site_identity.whatsappNumber;

  const mainQuoteUrl = buildWhatsAppUrl({
    intent: "product",
    whatsappNumber,
    productName: product.name,
    productUrl: productCanonical,
  });

  const gallery = product.images;
  const designPrefix = product.slug
    .split("-")
    .map((part) => part[0])
    .join("")
    .slice(0, 5)
    .toUpperCase();
  const specs = Object.entries(product.specifications ?? {});

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.seo_description || product.description || product.short_description,
    image: [absoluteUrl(`/products/${product.slug}/opengraph-image`)],
    url: productCanonical,
    category: product.category?.name,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
  };

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl("/") },
      { "@type": "ListItem", position: 2, name: "Products", item: canonicalUrl("/products") },
      { "@type": "ListItem", position: 3, name: product.name, item: productCanonical },
    ],
  };

  return (
    <main className="overflow-x-hidden bg-background text-white">
      <JsonLd data={[productSchema, breadcrumbsSchema]} />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Products", href: "/products" },
          { name: product.name, href: `/products/${product.slug}` },
        ]}
      />

      {/* Balanced Hero: Mobile shows Image Gallery first, then Title, Description & 3 Enquiry Actions */}
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-2 sm:px-6 sm:pb-14 sm:pt-7">
        <Link
          href="/products"
          className="mb-4 inline-flex min-h-11 items-center gap-3 text-[10px] uppercase tracking-[0.16em] text-white/50 transition-colors hover:text-textGold sm:mb-6 sm:tracking-[0.2em]"
        >
          <ArrowLeft size={14} /> {tpl.backLabel}
        </Link>

        <div className="grid min-w-0 gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-start lg:gap-10">
          {/* 1. Product Image Gallery (First on mobile, Left on desktop) */}
          <ProductGalleryViewer
            productId={product.id}
            productSlug={product.slug}
            productName={product.name}
            categorySlug={categorySlug}
            categoryName={categoryName}
            productDescription={productDescription}
            productUrl={productCanonical}
            whatsappNumber={whatsappNumber}
            images={gallery}
            designPrefix={designPrefix}
          />

          {/* 2. Product Info & Enquiry Actions (Second on mobile, Right on desktop) */}
          <div className="flex min-w-0 flex-col justify-between">
            <div>
              <p className="mb-3 flex flex-wrap items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-textGold sm:mb-4 sm:gap-3 sm:text-[10px] sm:tracking-[0.25em]">
                <span className="h-px w-8 bg-textGold" /> {categoryName} ·{" "}
                {product.finish_options.join(", ") || "Made to measure"}
              </p>
              <h1 className="break-words text-3xl font-light leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                {product.name}
              </h1>
              {productDescription && (
                <p className="mt-4 max-w-2xl text-sm leading-6 text-white/65 sm:mt-5 sm:text-base sm:leading-7">
                  {productDescription}
                </p>
              )}

              {(product.materials.length > 0 || product.customization_options.length > 0) && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {product.materials.slice(0, 4).map((mat) => (
                    <span
                      key={mat}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-white/75"
                    >
                      {mat}
                    </span>
                  ))}
                  {product.customization_options.slice(0, 2).map((opt) => (
                    <span
                      key={opt}
                      className="rounded-full border border-textGold/25 bg-textGold/[0.06] px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-textGold/90"
                    >
                      {opt}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Product Enquiry Actions Card */}
            <div className="mt-6 rounded-xl border border-white/10 bg-[#080808] p-4 sm:mt-8 sm:p-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">
                Made to measure · Crafted in Moradabad
              </p>

              <div className="mt-3.5 grid grid-cols-1 gap-2.5 min-[380px]:grid-cols-2">
                <ProductEmailQuoteButton
                  productId={product.id}
                  productSlug={product.slug}
                  productName={product.name}
                  categorySlug={categorySlug}
                  categoryName={categoryName}
                  productDescription={productDescription}
                  productImageUrl={primaryImage?.url || ""}
                  productUrl={productCanonical}
                  placement="product_hero_info"
                  label="Email for Quote"
                  variant="outline"
                  className="w-full"
                />

                <TrackedActionLink
                  href={mainQuoteUrl}
                  eventName="product_whatsapp_click"
                  trackingProps={{
                    placement: "product_hero_info",
                    channel: "whatsapp",
                    productSlug: product.slug,
                    categorySlug,
                    sourcePage: `/products/${product.slug}`,
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full border border-textGold/65 bg-textGold/10 px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-textGold transition hover:bg-textGold hover:text-black"
                >
                  <WhatsAppIcon size={15} />
                  <span>WhatsApp Enquiry</span>
                </TrackedActionLink>
              </div>

              <div className="mt-2.5">
                <OpenQuoteButton
                  label="Request a Custom Quote"
                  variant="primary"
                  className="w-full"
                  prefill={{
                    title: `Quote: ${product.name}`,
                    productId: product.id,
                    productSlug: product.slug,
                    productName: product.name,
                    productDescription,
                    productImageUrl: primaryImage?.url || "",
                    productUrl: productCanonical,
                    categorySlug,
                    categoryName,
                    placement: "product_page",
                    pageUrl: `/products/${product.slug}`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Design Variations Grid (deep links + individual Design ID quote buttons) */}
      {gallery.length > 1 && (
        <section className="mx-auto max-w-7xl border-t border-white/10 px-4 py-10 sm:px-6 sm:py-14">
          <div className="mb-5 flex items-end justify-between gap-4 border-b border-white/10 pb-3 sm:mb-7 sm:pb-5">
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.24em] text-textGold">
                {tpl.designsEyebrow}
              </p>
              <h2 className="text-2xl font-light sm:text-3xl">{tpl.designsHeading}</h2>
            </div>
            <span className="text-[10px] uppercase tracking-[0.16em] text-white/40">
              {gallery.length} designs
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {gallery.map((image, index) => {
              const designCode = `${designPrefix}-${String(index + 1).padStart(2, "0")}`;
              const designPath = `/products/${product.slug}/design/${image.id}`;

              return (
                <figure
                  key={image.id}
                  className="group relative aspect-[0.88] overflow-hidden rounded-lg bg-[#111] sm:rounded-xl"
                >
                  {image.url && (
                    <Link href={designPath} className="block h-full w-full">
                      <Image
                        src={image.url}
                        alt={image.alt_text || `${product.name} design ${index + 1}`}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    </Link>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                  <figcaption className="pointer-events-none absolute bottom-3 left-3 max-w-[70%] truncate text-[9px] uppercase tracking-[0.18em] text-white/85 sm:bottom-4 sm:left-4">
                    Design ID {designCode}{" "}
                    <span className="text-white/45">/ {String(gallery.length).padStart(2, "0")}</span>
                  </figcaption>
                  {image.url && (
                    <DesignQuoteButton
                      sharePath={designPath}
                      productId={product.id}
                      productSlug={product.slug}
                      categorySlug={categorySlug}
                      productName={product.name}
                      designCode={designCode}
                      whatsappNumber={whatsappNumber}
                      className="absolute right-2 top-2 inline-flex min-h-11 cursor-pointer items-center gap-1 rounded-full border border-white/30 bg-black/80 px-3 text-[9px] uppercase tracking-[0.08em] text-white transition-colors hover:border-textGold hover:text-textGold sm:right-3 sm:top-3 sm:gap-1.5 sm:tracking-[0.12em]"
                    />
                  )}
                </figure>
              );
            })}
          </div>
        </section>
      )}

      {(product.description ||
        product.materials.length > 0 ||
        product.applications.length > 0 ||
        product.customization_options.length > 0 ||
        product.finish_options.length > 0 ||
        specs.length > 0 ||
        product.care_instructions ||
        product.warranty) && (
        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 sm:pb-20">
          {product.description && (
            <div className="max-w-4xl border-t border-white/10 py-6 sm:py-8">
              <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-textGold">
                {tpl.aboutEyebrow}
              </p>
              <h2 className="mb-3 text-2xl font-light sm:text-3xl">{tpl.aboutHeading}</h2>
              <p className="text-sm leading-7 text-white/60">{product.description}</p>
            </div>
          )}
          {(product.materials.length > 0 ||
            product.applications.length > 0 ||
            product.customization_options.length > 0 ||
            product.finish_options.length > 0 ||
            specs.length > 0 ||
            product.care_instructions ||
            product.warranty) && (
            <div className="grid min-w-0 gap-5 border-t border-white/10 lg:grid-cols-[1fr_0.82fr] lg:gap-10">
              <div>
                <DetailList title="Material" values={product.materials} />
                <DetailList title="Applications" values={product.applications} />
                <DetailList title="Customization" values={product.customization_options} />
              </div>
              <div>
                <DetailList title="Available finishes" values={product.finish_options} />
                {specs.length > 0 && (
                  <section className="border-t border-white/10 py-6">
                    <h2 className="mb-4 text-[10px] uppercase tracking-[0.22em] text-textGold">
                      Specifications
                    </h2>
                    <dl className="space-y-3">
                      {specs.map(([label, value]) => (
                        <div
                          key={label}
                          className="flex justify-between gap-5 border-b border-white/5 pb-3 text-sm"
                        >
                          <dt className="text-white/45">{label}</dt>
                          <dd className="text-right text-white/75">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </section>
                )}
                {product.care_instructions && (
                  <section className="border-t border-white/10 py-6">
                    <h2 className="mb-3 text-[10px] uppercase tracking-[0.22em] text-textGold">Care</h2>
                    <p className="text-sm leading-6 text-white/60">{product.care_instructions}</p>
                  </section>
                )}
                {product.warranty && (
                  <section className="border-t border-white/10 py-6">
                    <h2 className="mb-3 text-[10px] uppercase tracking-[0.22em] text-textGold">
                      Warranty
                    </h2>
                    <p className="text-sm leading-6 text-white/60">{product.warranty}</p>
                  </section>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      <section
        id="product-enquiry"
        aria-label="Product quote enquiry"
        className="mx-auto max-w-5xl scroll-mt-20 border-t border-white/10 px-4 py-10 sm:px-6 sm:py-16"
      >
        <LeadEnquiryForm
          categories={categories.map(({ slug: catSlug, name }) => ({ slug: catSlug, name }))}
          defaultCategory={categorySlug}
          categoryName={categoryName}
          productId={product.id}
          productSlug={product.slug}
          productName={product.name}
          productDescription={productDescription}
          productImageUrl={primaryImage?.url || ""}
          productUrl={productCanonical}
          placement="product_page"
          whatsappNumber={whatsappNumber}
          heading={`Get a Quote for ${product.name}`}
          subheading="Share your site dimensions and city to receive an estimated fabrication price and design guidance."
        />
      </section>

      <div className="border-t border-white/10">
        <FAQSection
          content={{
            sectionId: "product-faq",
            variant: "compact_home",
            eyebrow: "Product Questions",
            heading: `Common Questions About ${product.name}`,
            description:
              "Everything you need to know about custom sizing, finish choices, and installation.",
            link: { label: "View All FAQs", href: "/faqs" },
            items: [
              {
                category: "pricing",
                question: `How is the cost estimated for ${product.name}?`,
                answer:
                  "Final pricing depends on opening dimensions, steel or iron section thickness, hardware selection, and finish coating. Share approximate measurements above or on WhatsApp for a tailored quote.",
              },
              {
                category: "customization",
                question: "Can this design be tailored to my site measurements?",
                answer:
                  "Yes. All products are custom fabricated to the exact width, height, and mounting condition measured at your site.",
              },
              {
                category: "process",
                question: "Do you handle site measurement and installation?",
                answer:
                  "Yes. Once we review your approximate dimensions and project photos, our team schedules site measurement and installation across Moradabad, Rampur, Sambhal, Amroha, Bareilly, and nearby NCR towns.",
              },
              {
                category: "materials",
                question: "Which protective finishes are available?",
                answer:
                  "We provide anti-corrosion primer bases with polyurethane (PU) automotive paints, matte or satin black textures, and brushed or mirror polishing on stainless steel grades.",
              },
            ],
          }}
        />
      </div>

      {relatedProducts.length > 0 && (
        <section className="border-t border-white/10 bg-[#080808] px-4 py-12 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="mb-2 text-[10px] uppercase tracking-[0.24em] text-textGold">
                  {tpl.relatedEyebrow}
                </p>
                <h2 className="text-2xl font-light sm:text-3xl">{tpl.relatedHeading}</h2>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-white/50 transition-colors hover:text-textGold"
              >
                {tpl.backLabel} <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.slug}`}
                  className="group flex items-center gap-4 border border-white/10 p-3 transition-colors hover:border-textGold/50 sm:gap-6 sm:p-4"
                >
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden bg-[#111] sm:h-32 sm:w-32">
                    {relatedImage(relatedProduct) && (
                      <Image
                        src={relatedImage(relatedProduct)}
                        alt={relatedProduct.name}
                        fill
                        sizes="128px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="mb-2 text-[9px] uppercase tracking-[0.18em] text-textGold">
                      {relatedProduct.finish_options[0] ??
                        relatedProduct.materials[0] ??
                        relatedProduct.category?.name}
                    </p>
                    <h3 className="text-lg font-light sm:text-xl">{relatedProduct.name}</h3>
                    <p className="mt-2 text-[9px] uppercase tracking-[0.16em] text-white/40">
                      View {relatedProduct.images.length} designs
                    </p>
                  </div>
                  <ArrowUpRight
                    size={17}
                    className="mr-1 text-white/45 transition-colors group-hover:text-textGold"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
