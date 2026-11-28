import type { CategoryRecord, ProductRecord } from "@/lib/catalog-types";

export type CollectionSummary = {
  id: string;
  name: string;
  slug: string;
  href: string;
  description: string;
  eyebrow: string;
  imageUrl: string;
  imageAlt: string;
  productCount: number;
  highlights: string[];
  featuredProducts: ProductRecord[];
};

/**
 * Verified local architectural photography assets per collection slug so
 * cards remain visually distinct and never fall back to checkerboard CAD art.
 */
const COLLECTION_PHOTO_ASSETS: Record<string, string> = {
  gates: "asset:steel_gate.ssGate1",
  "main-gates": "asset:steel_gate.ssGate13",
  "black-gold-steel-gates": "asset:steel_gate.ssGate4",
  "sliding-folding-gates": "asset:iron_gates.ironGate5",
  "stair-railings": "asset:steel_stair_railing.ssStairRailling8",
  "balcony-railings": "asset:steel_balcony_railing.ssBalconyRailling9",
  "spiral-railings": "asset:steel_spiral_railing.ssSpiralRailling3",
  "decorative-grills": "asset:iron_stair_railing.ironStairRailling4",
  "custom-metalwork": "asset:iron_gates.ironGate3",
};

const COLLECTION_HIGHLIGHTS: Record<string, string[]> = {
  gates: ["304-grade steel & forged wrought iron", "Custom driveway width & latch hardware"],
  "black-gold-steel-gates": ["Matte powder coat with PVD gold accents", "Custom house-name & laser panels"],
  "sliding-folding-gates": ["Heavy-duty bottom tracks & rollers", "Space-saving telescopic & sliding layouts"],
  "stair-railings": ["Ergonomic timber or metal handrails", "Toughened glass or precision bar infill"],
  "balcony-railings": ["Weatherproof PU & rust-protected finishes", "Safe balustrade height & spacing"],
  "spiral-railings": ["Custom-rolled helical handrails", "Seamless welded site fitting"],
};

const LEGACY_CATEGORY_ALIASES: Record<string, string> = {
  "main-gates": "gates",
  "steel-gates": "gates",
  "iron-gates": "gates",
  "staircase-railings": "stair-railings",
  "railings": "stair-railings",
  "metal-railings": "stair-railings",
  "balustrades": "balcony-railings",
  "spiral-staircase-railings": "spiral-railings",
};

function isPhotographicProductUrl(url: string | null | undefined): url is string {
  if (!url) return false;
  const lower = url.toLowerCase();
  // Exclude schematic/transparent placeholder filenames if present in older DB rows
  if (lower.endsWith(".svg")) return false;
  return true;
}

export function resolveCollectionImage(
  category: Pick<CategoryRecord, "id" | "slug" | "name">,
  matchingProducts: ProductRecord[]
): { url: string; alt: string } {
  const slug = category.slug.toLowerCase();

  // Prefer verified real workshop photos for curated collections where a product image is CAD/transparent
  if (slug === "balcony-railings") {
    const outdoorPhoto = matchingProducts.find(
      (p) => !p.slug.includes("minimal-balcony")
    );
    const outdoorImg =
      outdoorPhoto?.images.find((img) => img.is_primary) ?? outdoorPhoto?.images[0];
    if (outdoorImg && isPhotographicProductUrl(outdoorImg.url)) {
      return {
        url: outdoorImg.url,
        alt: outdoorImg.alt_text || `${category.name} handcrafted by Afsha Creative Solution`,
      };
    }
    return {
      url: COLLECTION_PHOTO_ASSETS["balcony-railings"],
      alt: `${category.name} handcrafted in Moradabad`,
    };
  }

  const primaryProduct = matchingProducts[0];
  const candidateImg =
    primaryProduct?.images.find((img) => img.is_primary) ?? primaryProduct?.images[0];

  if (
    candidateImg &&
    isPhotographicProductUrl(candidateImg.url) &&
    !candidateImg.url.toLowerCase().endsWith(".png")
  ) {
    return {
      url: candidateImg.url,
      alt: candidateImg.alt_text || `${category.name} handcrafted by Afsha Creative Solution`,
    };
  }

  return {
    url: COLLECTION_PHOTO_ASSETS[slug] || "asset:steel_gate.ssGate13",
    alt: `${category.name} handcrafted in Moradabad`,
  };
}

export function buildCollectionsSummary(
  categories: CategoryRecord[],
  products: ProductRecord[]
): CollectionSummary[] {
  return categories.map((category) => {
    const matchingProducts = products.filter(
      (product) =>
        product.category?.slug === category.slug || product.category_id === category.id
    );
    const { url, alt } = resolveCollectionImage(category, matchingProducts);

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      href: `/collections/${category.slug}`,
      description:
        category.description?.trim() ||
        `Made-to-measure ${category.name.toLowerCase()} fabricated in 304 stainless steel and wrought iron in Moradabad.`,
      eyebrow: matchingProducts.length > 0 ? "Signature Collection" : "Bespoke Series",
      imageUrl: url,
      imageAlt: alt,
      productCount: matchingProducts.length,
      highlights:
        COLLECTION_HIGHLIGHTS[category.slug] || [
          "Made-to-measure workshop fabrication",
          "Anti-rust finishing & site installation",
        ],
      featuredProducts: matchingProducts,
    };
  });
}

/**
 * Resolves a legacy /categories/[slug] route parameter to an active
 * /collections/[slug] destination. Returns null if no valid mapping exists
 * so unknown URLs don't blindly redirect to the homepage.
 */
export function resolveCategoryToCollectionSlug(
  rawSlug: string,
  categories: CategoryRecord[]
): string | null {
  const slug = rawSlug.trim().toLowerCase();
  if (!slug) return null;

  const exactMatch = categories.find((c) => c.slug.toLowerCase() === slug);
  if (exactMatch) return exactMatch.slug;

  const mappedAlias = LEGACY_CATEGORY_ALIASES[slug];
  if (mappedAlias) {
    const aliasMatch = categories.find((c) => c.slug.toLowerCase() === mappedAlias);
    if (aliasMatch) return aliasMatch.slug;
    return mappedAlias;
  }

  return null;
}
