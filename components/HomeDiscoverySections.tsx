import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import CmsImage from "@/components/cms/CmsImage";
import OpenQuoteButton from "@/components/lead/OpenQuoteButton";
import type { CollectionSummary } from "@/lib/collections";
import type { ProductRecord } from "@/lib/catalog-types";

export default function HomeDiscoverySections({
  collections,
  products,
}: {
  collections: CollectionSummary[];
  products: ProductRecord[];
}) {
  const featuredCollections = collections.slice(0, 6);
  const featuredProducts = products.slice(0, 6);

  return (
    <>
      {/* 1. Explore Collections (Consolidated Discovery) */}
      <section
        id="explore-collections"
        aria-labelledby="home-collections-heading"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16"
      >
        <div className="mb-8 flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-textGold">
              Architectural Collections
            </p>
            <h2
              id="home-collections-heading"
              className="mt-2 font-heading text-2xl font-light text-white sm:text-4xl"
            >
              Explore Our Metalwork Collections
            </h2>
          </div>
          <Link
            href="/collections"
            className="inline-flex min-h-11 items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-textGold transition hover:text-white"
          >
            View All Collections <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
          {featuredCollections.map((collection) => (
            <Link
              key={collection.id}
              href={collection.href}
              className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#090909] transition duration-300 hover:border-textGold/40"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#111]">
                <CmsImage
                  image={collection.imageUrl}
                  altFallback={collection.imageAlt}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                <span className="absolute right-3 top-3 rounded-full border border-textGold/35 bg-black/75 px-2.5 py-1 text-[9px] uppercase tracking-[0.14em] text-textGold backdrop-blur-sm">
                  {collection.productCount > 0
                    ? `${collection.productCount} ${collection.productCount === 1 ? "Design" : "Designs"}`
                    : "Custom Built"}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-light text-white transition-colors group-hover:text-textGold">
                  {collection.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/60">
                  {collection.description}
                </p>
                <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-3.5 text-[10px] uppercase tracking-[0.16em] text-textGold">
                  <span>Explore Collection</span>
                  <ArrowUpRight
                    size={14}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 2. Featured Products */}
      {featuredProducts.length > 0 && (
        <section
          aria-labelledby="home-featured-products-heading"
          className="border-t border-white/10 bg-[#050505] px-4 py-12 sm:px-6 sm:py-16"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-textGold">
                  Signature Designs
                </p>
                <h2
                  id="home-featured-products-heading"
                  className="mt-2 font-heading text-2xl font-light text-white sm:text-4xl"
                >
                  Featured Gates &amp; Railings
                </h2>
              </div>
              <Link
                href="/collections#designs-catalog"
                className="inline-flex min-h-11 items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-textGold transition hover:text-white"
              >
                Search All Designs <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product) => {
                const img =
                  product.images.find((item) => item.is_primary) ?? product.images[0];
                const categoryName = product.category?.name ?? "Custom Metalwork";
                return (
                  <article
                    key={product.id}
                    className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] transition hover:border-textGold/40"
                  >
                    <Link
                      href={`/products/${product.slug}`}
                      className="relative aspect-[4/3] w-full overflow-hidden bg-[#111]"
                    >
                      <CmsImage
                        image={img?.url || "asset:steel_gate.ssGate1"}
                        altFallback={product.name}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                      <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-textGold">
                        {categoryName}
                      </span>
                    </Link>

                    <div className="flex flex-1 flex-col p-5">
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="text-lg font-light text-white transition-colors group-hover:text-textGold">
                          {product.name}
                        </h3>
                      </Link>
                      {product.materials && product.materials.length > 0 && (
                        <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-white/45">
                          {product.materials.join(" · ")}
                        </p>
                      )}
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/60">
                        {product.short_description || product.description}
                      </p>

                      <div className="mt-auto flex items-center gap-2 border-t border-white/10 pt-4">
                        <Link
                          href={`/products/${product.slug}`}
                          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-[10px] font-medium uppercase tracking-[0.15em] text-white transition hover:border-textGold hover:bg-textGold hover:text-black"
                        >
                          <span>View Details</span>
                          <ArrowRight size={13} />
                        </Link>
                        <OpenQuoteButton
                          label="Quote"
                          prefill={{
                            placement: "home_featured_product",
                            productName: product.name,
                            productSlug: product.slug,
                            categoryName,
                            categorySlug: product.category?.slug,
                          }}
                          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-textGold/35 bg-textGold/10 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.15em] text-textGold transition hover:bg-textGold hover:text-black"
                        />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
