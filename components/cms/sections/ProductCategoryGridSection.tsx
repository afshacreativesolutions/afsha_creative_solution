import Link from "next/link";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import Feature from "@/components/Feature";
import { Collections } from "@/components/Collections";
import SectionHeading from "@/components/SectionHeading";
import ProductsCatalog from "@/app/products/products-catalog";
import CmsImage from "../CmsImage";
import { collectionsData as fallbackCollections, croselData as fallbackProjects } from "@/utils/data";
import type { CategoryRecord, ProductRecord } from "@/lib/catalog-types";
import type { CmsImageRef, ProductCategoryGridContent } from "@/lib/cms/types";
import type { collectionDataType } from "@/utils/type";

const CATEGORY_DEFAULT_IMAGE_ASSETS: Record<string, string> = {
  gates: "asset:steel_gate.ssGate13",
  "main-gates": "asset:steel_gate.ssGate13",
  "stair-railings": "asset:steel_stair_railing.ssStairRailling13",
  "staircase-railings": "asset:steel_stair_railing.ssStairRailling13",
  railings: "asset:steel_stair_railing.ssStairRailling8",
  "metal-railings": "asset:steel_stair_railing.ssStairRailling8",
  "balcony-railings": "asset:iron_balcony_railing.ironbrail3",
  "spiral-railings": "asset:steel_spiral_railing.ssSpiralRailling3",
  "decorative-grills": "asset:iron_stair_railing.ironStairRailling4",
  "custom-metalwork": "asset:steel_gate.ssGate4",
};

function resolveCategoryCardImage(
  cat: {
    image?: CmsImageRef | string | null;
    slug?: string;
    id?: string;
    countCategorySlug?: string;
    name?: string;
  },
  products?: ProductRecord[]
): CmsImageRef | string {
  if (cat.image) return cat.image;

  const slugKey = (cat.slug || cat.countCategorySlug || cat.id || "").toLowerCase();

  // 1. Try to find a matching product image from catalog products
  if (products && products.length > 0) {
    const matchingProduct = products.find(
      (p) => p.category?.slug === slugKey || p.category?.id === cat.id
    );
    if (matchingProduct) {
      const prodImg =
        matchingProduct.images?.find((img) => img.is_primary) ?? matchingProduct.images?.[0];
      if (prodImg?.url) {
        return { url: prodImg.url, alt: matchingProduct.name };
      }
    }
  }

  // 2. Exact match in default category assets
  if (CATEGORY_DEFAULT_IMAGE_ASSETS[slugKey]) {
    return CATEGORY_DEFAULT_IMAGE_ASSETS[slugKey];
  }

  // 3. Fuzzy match
  for (const [key, asset] of Object.entries(CATEGORY_DEFAULT_IMAGE_ASSETS)) {
    if (slugKey.includes(key) || key.includes(slugKey)) {
      return asset;
    }
  }

  return "asset:steel_gate.ssGate13";
}

export type CatalogRuntimeContext = {
  products?: ProductRecord[];
  categories?: CategoryRecord[];
  initialCategory?: string;
  initialMaterial?: string;
  isSupabaseConfigured?: boolean;
};

export default function ProductCategoryGridSection({
  content,
  catalogContext,
}: {
  content: ProductCategoryGridContent;
  catalogContext?: CatalogRuntimeContext;
}) {
  const products = catalogContext?.products ?? [];
  const categories = catalogContext?.categories ?? [];

  const publicProjects = products
    .map((product) => {
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
    })
    .filter((product) => product.image);

  const isGate = (product: (typeof publicProjects)[number]) =>
    product.categorySlug?.toLowerCase().includes("gate") ||
    product.categoryName?.toLowerCase().includes("gate") ||
    false;

  if (content.variant === "featured_carousel") {
    const featured = publicProjects.filter((product) => product.isFeatured);
    const projectRows = publicProjects.length
      ? (featured.length ? featured : publicProjects)
          .slice(0, content.maxItems ?? 12)
          .map(({ title, description, tagline, image, href }) => ({
            title,
            description,
            tagline,
            image,
            href,
          }))
      : fallbackProjects;

    return (
      <Feature
        projects={projectRows}
        heading={content.heading || "Featured Projects"}
        ctaLabel={content.cta?.label ?? "SEE PROJECTS"}
        ctaHref={content.cta?.href ?? "/products"}
        sectionId={content.sectionId || "projects"}
      />
    );
  }

  if (content.variant === "collection_tabs") {
    const pickTabItem = ({
      title,
      description,
      tagline,
      image,
      href,
    }: (typeof publicProjects)[number]) => ({
      title,
      description,
      tagline,
      image,
      href,
    });
    const collectionRows: collectionDataType = publicProjects.length
      ? {
          Gates: publicProjects.filter(isGate).map(pickTabItem),
          Raillings: publicProjects.filter((product) => !isGate(product)).map(pickTabItem),
        }
      : fallbackCollections;

    return (
      <Collections
        collectionsData={collectionRows}
        heading={content.heading || "Our Collections"}
        sectionId={content.sectionId || "collection"}
      />
    );
  }

  if (content.variant === "full_catalog") {
    const catalogProducts = products.map((product) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      category: product.category?.name ?? "Metalwork",
      categorySlug: product.category?.slug ?? "",
      materials: product.materials,
      finish: product.finish_options[0] ?? product.materials[0] ?? "Made to measure",
      shortDescription: product.short_description,
      imageUrl: (product.images.find((image) => image.is_primary) ?? product.images[0])?.url ?? "",
      number: String(product.sort_order + 1).padStart(2, "0"),
    }));

    return (
      <ProductsCatalog
        products={catalogProducts}
        categories={categories.map(({ id, name, slug }) => ({ id, name, slug }))}
        initialCategory={catalogContext?.initialCategory ?? "all"}
        initialMaterial={catalogContext?.initialMaterial ?? "all"}
        isConfigured={catalogContext?.isSupabaseConfigured ?? true}
        embeddedInCms
        sectionEyebrow={content.eyebrow}
        sectionHeading={content.heading}
        sectionDescription={content.description}
        emptyTitle={content.emptyTitle}
        emptyDescription={content.emptyDescription}
      />
    );
  }

  // Category discovery grid (featured_categories / all_categories_grid)
  const countMap = new Map<string, number>();
  for (const product of products) {
    if (product.category?.slug) {
      countMap.set(product.category.slug, (countMap.get(product.category.slug) || 0) + 1);
    }
  }

  const rawCards =
    content.categories && content.categories.length > 0
      ? content.categories
      : categories.map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          href: `/categories/${cat.slug}`,
          image: null,
          material: "Made to Measure Metalwork",
          description: cat.description || `Explore custom ${cat.name.toLowerCase()} fabricated to order.`,
          highlights: ["Made-to-measure sizing", "Custom finishes"],
          isFeatured: true,
          countCategorySlug: cat.slug,
        }));

  const configuredCards = rawCards.map((cat) => ({
    ...cat,
    image: resolveCategoryCardImage(cat, products),
  }));

  if (content.variant === "featured_categories") {
    const featuredCards = configuredCards.filter((c) => c.isFeatured !== false).slice(0, 4);

    return (
      <section id={content.sectionId} className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.heading || "Featured Architectural Collections"}
          description={content.description}
          link={content.headerLink ? { label: content.headerLink.label, href: content.headerLink.href } : undefined}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featuredCards.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group relative flex min-h-[380px] flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] transition duration-300 hover:-translate-y-1 hover:border-textGold/40"
            >
              <div className="relative h-56 w-full overflow-hidden bg-[#111]">
                <CmsImage
                  image={cat.image}
                  altFallback={cat.name}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/20" />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-textGold backdrop-blur-sm">
                  <Sparkles size={11} /> Featured
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                {cat.material && (
                  <span className="text-[9px] uppercase tracking-[0.2em] text-textGold/80">
                    {cat.material}
                  </span>
                )}
                <h3 className="mt-1 text-lg font-light text-white transition-colors group-hover:text-textGold">
                  {cat.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/55">
                  {cat.description}
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-textGold">
                    Explore
                  </span>
                  <ArrowUpRight
                    size={16}
                    className="text-textGold transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  // all_categories_grid
  return (
    <section
      id={content.sectionId || "categories-grid"}
      className={`${
        content.background === "darker" ? "border-t border-white/10 bg-[#050505]" : ""
      } px-4 py-12 sm:px-6 sm:py-20`}
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.heading || "Complete Category Collection"}
          description={content.description}
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {configuredCards.map((category, index) => {
            const count = category.countCategorySlug
              ? countMap.get(category.countCategorySlug)
              : countMap.get(category.slug);
            return (
              <div
                key={category.id}
                className="group flex flex-col justify-between rounded-xl border border-white/10 bg-[#080808] p-6 transition duration-300 hover:border-textGold/35 hover:bg-[#0c0c0c]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] tracking-[0.2em] text-white/35">
                      {String(index + 1).padStart(2, "0")} / CATEGORY
                    </span>
                    {typeof count === "number" && count > 0 && (
                      <span className="rounded-full border border-textGold/30 bg-textGold/10 px-2.5 py-0.5 text-[9px] uppercase tracking-[0.14em] text-textGold">
                        {count} {count === 1 ? "Design" : "Designs"} Available
                      </span>
                    )}
                  </div>

                  <div className="relative mt-5 aspect-[16/10] overflow-hidden rounded-lg bg-[#111]">
                    <CmsImage
                      image={category.image}
                      altFallback={category.name}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>

                  {category.material && (
                    <p className="mt-5 text-[9px] uppercase tracking-[0.2em] text-textGold">
                      {category.material}
                    </p>
                  )}
                  <h3 className="mt-1 text-xl font-light text-white transition-colors group-hover:text-textGold">
                    {category.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white/55">{category.description}</p>

                  {category.highlights && category.highlights.length > 0 && (
                    <ul className="mt-4 space-y-1.5 border-t border-white/5 pt-3">
                      {category.highlights.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-xs text-white/50">
                          <span className="h-1 w-1 rounded-full bg-textGold/70" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mt-6 border-t border-white/10 pt-4">
                  <Link
                    href={category.href}
                    className="inline-flex min-h-11 w-full items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.18em] text-white transition-all group-hover:border-textGold group-hover:bg-textGold group-hover:text-black"
                  >
                    <span>Explore Category</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
