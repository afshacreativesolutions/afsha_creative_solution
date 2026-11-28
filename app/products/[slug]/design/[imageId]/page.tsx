import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cache } from "react";
import { notFound } from "next/navigation";
import { getPublicProduct } from "@/lib/catalog";
import { getPublishedCmsSiteSettings } from "@/lib/cms/queries";
import {
  absoluteUrl,
  canonicalUrl,
  SITE_NAME,
} from "@/lib/site-config";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import JsonLd from "@/components/JsonLd";
import ProductShareButton from "@/components/ProductShareButton";
import TrackedActionLink from "@/components/lead/TrackedActionLink";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { ArrowLeft } from "lucide-react";

type DesignPageProps = { params: Promise<{ slug: string; imageId: string }> };

const getDesign = cache(async (slug: string, imageId: string) => {
  const product = await getPublicProduct(slug);
  if (!product) return null;
  const image = product.images.find((item) => item.id === imageId);
  const imageUrl = image?.url;
  if (!image || !imageUrl) return null;
  const index = product.images.findIndex((item) => item.id === imageId);
  const prefix = product.slug.split("-").map((part) => part[0]).join("").slice(0, 5).toUpperCase();
  const designCode = `${prefix}-${String(index + 1).padStart(2, "0")}`;
  return { product, image, imageUrl, designCode };
});

export async function generateMetadata({ params }: DesignPageProps): Promise<Metadata> {
  const { slug, imageId } = await params;
  const design = await getDesign(slug, imageId);

  if (!design) {
    return {
      title: "Design Not Found | Afsha Creative Solution",
      robots: { index: false, follow: false },
    };
  }

  const title = `${design.product.name} – Design ${design.designCode} | Afsha Creative Solutions`;
  const description = `Explore the ${design.product.name} design (${design.designCode}) by Afsha Creative Solution in Moradabad. View specifications, material finishes, and request a custom quotation.`;
  const canonical = canonicalUrl(`/products/${slug}/design/${imageId}`);
  const ogImageUrl = absoluteUrl(`/products/${slug}/design/${imageId}/opengraph-image`);

  return {
    title,
    description,
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
          alt: `${design.product.name} — Design ${design.designCode}`,
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

export default async function DesignReferencePage({ params }: DesignPageProps) {
  const { slug, imageId } = await params;
  const [design, siteSettings] = await Promise.all([
    getDesign(slug, imageId),
    getPublishedCmsSiteSettings(),
  ]);
  if (!design) notFound();

  const currentPath = `/products/${slug}/design/${imageId}`;
  const canonical = canonicalUrl(currentPath);
  const whatsappHref = buildWhatsAppUrl({
    intent: "product",
    whatsappNumber: siteSettings.site_identity.whatsappNumber,
    productName: design.product.name,
    designCode: design.designCode,
    productUrl: canonical,
  });

  const productCanonical = canonicalUrl(`/products/${slug}`);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${design.product.name} – Design ${design.designCode}`,
    description: `Custom ${design.product.name} design ${design.designCode} fabricated by Afsha Creative Solution in Moradabad.`,
    image: [absoluteUrl(`/products/${slug}/design/${imageId}/opengraph-image`)],
    url: canonical,
    category: design.product.category?.name,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    sku: design.designCode,
  };

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl("/") },
      { "@type": "ListItem", position: 2, name: "Products", item: canonicalUrl("/products") },
      { "@type": "ListItem", position: 3, name: design.product.name, item: productCanonical },
      { "@type": "ListItem", position: 4, name: `Design ${design.designCode}`, item: canonical },
    ],
  };

  return (
    <main className="mx-auto min-h-[75vh] w-full max-w-5xl px-4 py-8 text-white sm:px-6 sm:py-16">
      <JsonLd data={[productSchema, breadcrumbsSchema]} />

      <div className="mb-6 flex items-center justify-between">
        <Link
          href={`/products/${slug}`}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/50 transition hover:text-textGold"
        >
          <ArrowLeft size={14} /> Back to {design.product.name}
        </Link>
        <span className="rounded border border-textGold/30 bg-textGold/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-textGold">
          Design {design.designCode}
        </span>
      </div>

      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 bg-[#111] shadow-2xl">
        <Image
          src={design.imageUrl}
          alt={`${design.product.name} ${design.designCode}`}
          fill
          unoptimized
          priority
          className="object-contain"
        />
      </div>

      <div className="mt-8 flex flex-col gap-6 rounded-xl border border-white/10 bg-[#0d0d0d] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-textGold">
            {design.product.category?.name || "Bespoke Metalwork"} · Moradabad Workshop
          </span>
          <h1 className="mt-1 text-2xl font-light text-white sm:text-3xl">
            {design.product.name}
          </h1>
          <p className="mt-2 text-xs text-white/55">
            Design Reference Code: <strong className="font-mono text-white">{design.designCode}</strong> · Made to measure
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <TrackedActionLink
            href={whatsappHref}
            eventName="product_enquiry_click"
            trackingProps={{
              placement: "product_design_page",
              channel: "whatsapp",
              productSlug: slug,
              categorySlug: design.product.category?.slug || "custom-metalwork",
              sourcePage: currentPath,
            }}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center gap-2 rounded-full border border-textGold bg-textGold px-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-black transition hover:bg-white"
          >
            <WhatsAppIcon size={15} /> Ask About This Product
          </TrackedActionLink>
          <ProductShareButton
            title={`${design.product.name} – Design ${design.designCode}`}
            text={`Check out this custom ${design.product.name} design by Afsha Creative Solution.`}
            sharePath={currentPath}
          />
        </div>
      </div>
    </main>
  );
}
