import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { getPublicProduct, getPublicProducts } from "@/lib/catalog";
import { getPublishedCmsSiteSettings } from "@/lib/cms/queries";
import type { ProductRecord } from "@/lib/catalog-types";
import { absoluteUrl, canonicalUrl, SITE_NAME, buildWhatsAppQuoteUrl } from "@/lib/site-config";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import DesignQuoteButton from "./design-quote-button";

type ProductPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublicProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found | Afsha Creative Solution",
      robots: { index: false, follow: false },
    };
  }

  const title = product.seo_title || `${product.name} | Afsha Creative Solution`;
  const description =
    product.seo_description ||
    product.short_description ||
    `Explore made-to-measure ${product.name} crafted by Afsha Creative Solution in Moradabad. View designs and request a custom quotation.`;

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
      title,
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
      title,
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
  const [product, siteSettings, allProducts] = await Promise.all([
    getPublicProduct(slug),
    getPublishedCmsSiteSettings(),
    getPublicProducts(),
  ]);
  if (!product) notFound();

  const tpl = siteSettings.template_defaults.productDetail;
  const relatedProducts = allProducts
    .filter((item) => item.category_id === product.category_id && item.id !== product.id)
    .slice(0, 4);

  const productCanonical = canonicalUrl(`/products/${product.slug}`);
  const mainQuoteUrl = buildWhatsAppQuoteUrl({
    productName: product.name,
    sharePath: `/products/${product.slug}`,
  });

  const gallery = product.images;
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
    <main className="bg-background text-white">
      <JsonLd data={[productSchema, breadcrumbsSchema]} />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Products", href: "/products" },
          { name: product.name, href: `/products/${product.slug}` },
        ]}
      />
      <section className="mx-auto max-w-7xl px-4 pb-7 pt-2 sm:px-6 sm:pb-10 sm:pt-7">
        <Link
          href="/products"
          className="mb-4 inline-flex min-h-11 items-center gap-3 text-[10px] uppercase tracking-[0.16em] text-white/50 transition-colors hover:text-textGold sm:mb-6 sm:tracking-[0.2em]"
        >
          <ArrowLeft size={14} /> {tpl.backLabel}
        </Link>

        <div className="grid min-w-0 gap-4 sm:gap-7 lg:grid-cols-[1fr_0.82fr] lg:items-end">
          <div className="min-w-0">
            <p className="mb-3 flex flex-wrap items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-textGold sm:mb-4 sm:gap-3 sm:text-[10px] sm:tracking-[0.25em]">
              <span className="h-px w-8 bg-textGold" /> {product.category?.name ?? "Metalwork"} ·{" "}
              {product.finish_options.join(", ") || "Made to measure"}
            </p>
            <h1 className="max-w-3xl break-words text-4xl font-light leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              {product.name}
            </h1>
            {product.short_description && (
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60 sm:mt-5 sm:text-base sm:leading-7">
                {product.short_description}
              </p>
            )}
          </div>
          <div className="min-w-0 lg:justify-self-end lg:max-w-md">
            <p className="text-xs uppercase tracking-[0.14em] text-white/40">
              Made to measure · Crafted in Moradabad
            </p>
            <a
              href={mainQuoteUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex min-h-11 items-center gap-4 border-b border-textGold/60 pb-2 text-[10px] uppercase tracking-[0.13em] text-textGold transition-colors hover:border-textGold hover:text-white sm:mt-4 sm:tracking-[0.18em]"
            >
              Request a custom quote <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-14">
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
        {gallery.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {gallery.map((image, index) => {
              const prefix = product.slug.split("-").map((part) => part[0]).join("").slice(0, 5).toUpperCase();
              const designCode = `${prefix}-${String(index + 1).padStart(2, "0")}`;
              const designPath = `/products/${product.slug}/design/${image.id}`;

              return (
                <figure
                  key={image.id}
                  className={`group relative overflow-hidden rounded-lg bg-[#111] sm:rounded-xl ${
                    index === 0
                      ? "col-span-2 row-span-2 aspect-square sm:col-span-2 sm:aspect-auto"
                      : "aspect-[0.88]"
                  }`}
                >
                  {image.url && (
                    <Image
                      src={image.url}
                      alt={image.alt_text || `${product.name} design ${index + 1}`}
                      fill
                      priority={index === 0}
                      sizes={
                        index === 0
                          ? "(max-width: 640px) 100vw, 66vw"
                          : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      }
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <figcaption className="absolute bottom-3 left-3 max-w-[70%] truncate text-[9px] uppercase tracking-[0.18em] text-white/80 sm:bottom-4 sm:left-4">
                    Design ID {designCode}{" "}
                    <span className="text-white/40">/ {String(gallery.length).padStart(2, "0")}</span>
                  </figcaption>
                  {image.url && (
                    <DesignQuoteButton
                      sharePath={designPath}
                      productName={product.name}
                      designCode={designCode}
                      className="absolute right-2 top-2 inline-flex min-h-9 items-center gap-1 border border-white/30 bg-black/70 px-2 text-[8px] uppercase tracking-[0.08em] text-white transition-colors hover:border-textGold hover:text-textGold sm:right-4 sm:top-4 sm:min-h-10 sm:gap-1.5 sm:px-3 sm:text-[9px] sm:tracking-[0.12em]"
                    />
                  )}
                </figure>
              );
            })}
          </div>
        ) : (
          <p className="border border-white/10 py-16 text-center text-sm text-white/45">
            Product images are being added to this gallery.
          </p>
        )}
      </section>

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
