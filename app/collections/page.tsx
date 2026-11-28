import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import CollectionsExplorer, {
  type CollectionsCatalogProductItem,
} from "@/components/CollectionsExplorer";
import JsonLd from "@/components/JsonLd";
import OpenQuoteButton from "@/components/lead/OpenQuoteButton";
import { getPublicCategories, getPublicProducts } from "@/lib/catalog";
import { getPublishedCmsSiteSettings } from "@/lib/cms/queries";
import { buildCollectionsSummary } from "@/lib/collections";
import { SITE_NAME, absoluteUrl, canonicalUrl } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = {
  title: `Architectural Metalwork Collections | ${SITE_NAME}`,
  description:
    "Explore made-to-measure steel gates, forged iron gates, staircase railings, balcony railings, and spiral railings handcrafted in Moradabad by Afsha Creative Solution.",
  alternates: {
    canonical: canonicalUrl("/collections"),
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: SITE_NAME,
    title: `Architectural Metalwork Collections | ${SITE_NAME}`,
    description:
      "Browse custom stainless steel gates, wrought iron gates, staircase railings, and balcony railings fabricated to your measurements in Moradabad.",
    url: canonicalUrl("/collections"),
    images: [
      {
        url: absoluteUrl("/opengraph-image"),
        width: 1200,
        height: 630,
        alt: "Afsha Creative Solution Collections",
      },
    ],
  },
};

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string; category?: string; material?: string }>;
}) {
  const params = await searchParams;
  const [categories, products, siteSettings] = await Promise.all([
    getPublicCategories(),
    getPublicProducts(),
    getPublishedCmsSiteSettings(),
  ]);

  const collections = buildCollectionsSummary(categories, products);

  const explorerProducts: CollectionsCatalogProductItem[] = products.map((product) => {
    const primaryImg =
      product.images.find((i) => i.is_primary) ?? product.images[0];
    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      category: product.category?.name ?? "Custom Metalwork",
      categorySlug: product.category?.slug ?? "custom-metalwork",
      materials: product.materials ?? [],
      finish: product.finish_options?.[0] ?? "",
      shortDescription:
        product.short_description ||
        product.description ||
        "Made-to-measure architectural metalwork crafted in Moradabad.",
      imageUrl: primaryImg?.url || "asset:steel_gate.ssGate1",
      number: String(product.sort_order ?? ""),
    };
  });

  const initialCollection =
    params.collection || params.category || "all";
  const initialMaterial = params.material || "all";

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Architectural Metalwork Collections — ${SITE_NAME}`,
    url: canonicalUrl("/collections"),
    description: metadata.description,
    numberOfItems: collections.length,
  };

  return (
    <main className="min-h-screen bg-background pt-16 text-white sm:pt-20">
      <JsonLd data={collectionPageSchema} />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Collections", href: "/collections" },
        ]}
      />

      {/* Focused Collection Hero */}
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-4 sm:px-6 sm:pb-14 sm:pt-8">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[10px] uppercase tracking-[0.25em] text-textGold">
              Made to Measure · Moradabad Workshop
            </p>
            <h1 className="mt-3 font-heading text-3xl font-light tracking-tight text-white sm:text-5xl lg:text-6xl">
              Architectural <span className="text-textGold">Collections</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm font-light leading-7 text-white/65 sm:text-base">
              Explore custom steel and iron gates, stair railings, balcony balustrades, and spiral metalwork — every piece measured, fabricated, and installed around your architecture.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <OpenQuoteButton
              label="Get a Quote"
              prefill={{ placement: "collections_hero" }}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-textGold px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-white"
            />
          </div>
        </div>
      </section>

      <CollectionsExplorer
        collections={collections}
        products={explorerProducts}
        initialCollection={initialCollection}
        initialMaterial={initialMaterial}
        whatsappNumber={siteSettings.site_identity.whatsappNumber}
      />
    </main>
  );
}
