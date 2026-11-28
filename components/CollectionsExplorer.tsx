"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle, Search, X } from "lucide-react";
import CmsImage from "@/components/cms/CmsImage";
import OpenQuoteButton from "@/components/lead/OpenQuoteButton";
import TrackedActionLink from "@/components/lead/TrackedActionLink";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { CollectionSummary } from "@/lib/collections";

export type CollectionsCatalogProductItem = {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  materials: string[];
  finish: string;
  shortDescription: string;
  imageUrl: string;
  number: string;
};

function filterToken(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function CollectionsExplorer({
  collections,
  products,
  initialCollection = "all",
  initialMaterial = "all",
  whatsappNumber,
}: {
  collections: CollectionSummary[];
  products: CollectionsCatalogProductItem[];
  initialCollection?: string;
  initialMaterial?: string;
  whatsappNumber?: string;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCollection, setActiveCollection] = useState(initialCollection);
  const [activeMaterial, setActiveMaterial] = useState(initialMaterial);

  const materials = useMemo(
    () => [...new Set(products.flatMap((p) => p.materials))].filter(Boolean).sort(),
    [products]
  );

  const collectionPills = useMemo(() => {
    const base = [{ slug: "all", name: "All Designs" }];
    const withProducts = collections.filter((c) =>
      products.some((p) => p.categorySlug === c.slug)
    );
    return [...base, ...withProducts.map((c) => ({ slug: c.slug, name: c.name }))];
  }, [collections, products]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCollection =
        activeCollection === "all" ||
        (activeCollection === "railings"
          ? product.categorySlug.includes("railing")
          : product.categorySlug === activeCollection);

      const matchesMaterial =
        activeMaterial === "all" ||
        product.materials.some((m) => filterToken(m) === activeMaterial);

      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.shortDescription.toLowerCase().includes(q) ||
        product.materials.some((m) => m.toLowerCase().includes(q));

      return matchesCollection && matchesMaterial && matchesSearch;
    });
  }, [activeCollection, activeMaterial, products, searchQuery]);

  const generalWhatsAppHref = buildWhatsAppUrl({
    intent: "general",
    whatsappNumber,
  });

  const handleSelectCollectionFilter = (slug: string) => {
    setActiveCollection(slug);
    const el = document.getElementById("designs-catalog");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="space-y-14 sm:space-y-20">
      {/* 1. Primary Collections Grid */}
      <section aria-labelledby="browse-collections-heading" className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-textGold">
              Curated Collections
            </p>
            <h2
              id="browse-collections-heading"
              className="mt-2 font-heading text-2xl font-light text-white sm:text-4xl"
            >
              Browse by Metalwork Type
            </h2>
          </div>
          <p className="max-w-md text-xs leading-relaxed text-white/60 sm:text-sm">
            Select a collection to view dedicated designs, specifications, and custom sizing options.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection, idx) => {
            const hasProducts = collection.productCount > 0;
            return (
              <article
                key={collection.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] transition duration-300 hover:border-textGold/40"
              >
                <Link
                  href={collection.href}
                  className="relative aspect-[4/3] w-full overflow-hidden bg-[#111]"
                >
                  <CmsImage
                    image={collection.imageUrl}
                    altFallback={collection.imageAlt}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                  <div className="absolute left-3.5 right-3.5 top-3.5 flex items-center justify-between gap-2">
                    <span className="rounded-full bg-black/70 px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-white/75 backdrop-blur-sm">
                      {String(idx + 1).padStart(2, "0")} · Collection
                    </span>
                    <span className="rounded-full border border-textGold/35 bg-black/75 px-2.5 py-1 text-[9px] uppercase tracking-[0.14em] text-textGold backdrop-blur-sm">
                      {hasProducts
                        ? `${collection.productCount} ${collection.productCount === 1 ? "Design" : "Designs"}`
                        : "Made to Order"}
                    </span>
                  </div>
                </Link>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <Link href={collection.href}>
                    <h3 className="text-xl font-light text-white transition-colors group-hover:text-textGold">
                      {collection.name}
                    </h3>
                  </Link>
                  <p className="mt-2 line-clamp-2 text-xs leading-6 text-white/60 sm:text-sm">
                    {collection.description}
                  </p>

                  <ul className="mt-4 space-y-1.5 border-t border-white/10 pt-3">
                    {collection.highlights.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs text-white/55">
                        <span className="h-1 w-1 shrink-0 rounded-full bg-textGold/80" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex items-center gap-2 pt-2">
                    <Link
                      href={collection.href}
                      className="inline-flex min-h-11 flex-1 items-center justify-between rounded-lg border border-white/15 bg-white/[0.03] px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.16em] text-white transition hover:border-textGold hover:bg-textGold hover:text-black"
                    >
                      <span>Explore Collection</span>
                      <ArrowRight size={14} />
                    </Link>
                    {hasProducts && (
                      <button
                        type="button"
                        onClick={() => handleSelectCollectionFilter(collection.slug)}
                        className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/10 px-3 text-[10px] uppercase tracking-[0.12em] text-white/65 transition hover:border-textGold/40 hover:text-textGold"
                      >
                        Filter ({collection.productCount})
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 2. Search & Filter All Products */}
      <section
        id="designs-catalog"
        aria-labelledby="designs-catalog-heading"
        className="mx-auto max-w-7xl scroll-mt-24 border-t border-white/10 px-4 pt-12 sm:px-6 sm:pt-16"
      >
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-textGold">
              Design Catalogue
            </p>
            <h2
              id="designs-catalog-heading"
              className="mt-2 font-heading text-2xl font-light text-white sm:text-4xl"
            >
              All Fabrication Designs
            </h2>
          </div>

          <div className="relative w-full md:max-w-xs">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gates, railings, materials..."
              aria-label="Search designs"
              className="min-h-11 w-full rounded-full border border-white/15 bg-[#0a0a0a] pl-10 pr-10 text-sm text-white placeholder:text-white/40 focus:border-textGold focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-white/60 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Collection Filter Pills */}
        <div className="mb-4 flex flex-wrap gap-2">
          {collectionPills.map((option) => {
            const active = activeCollection === option.slug;
            return (
              <button
                key={option.slug}
                type="button"
                onClick={() => setActiveCollection(option.slug)}
                aria-pressed={active}
                className={`inline-flex min-h-11 items-center rounded-full border px-4 py-2 text-[10px] font-medium uppercase tracking-[0.16em] transition ${
                  active
                    ? "border-textGold bg-textGold font-semibold text-black"
                    : "border-white/15 bg-[#080808] text-white/75 hover:border-textGold/50 hover:text-white"
                }`}
              >
                {option.name}
              </button>
            );
          })}
        </div>

        {/* Material Filter Pills */}
        {materials.length > 0 && (
          <div className="mb-8 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[10px] uppercase tracking-[0.2em] text-white/45">
              Material:
            </span>
            {["all", ...materials].map((material) => {
              const token = material === "all" ? "all" : filterToken(material);
              const active = activeMaterial === token;
              return (
                <button
                  key={token}
                  type="button"
                  onClick={() => setActiveMaterial(token)}
                  aria-pressed={active}
                  className={`inline-flex min-h-11 items-center rounded-full border px-3.5 py-2 text-[10px] uppercase tracking-[0.14em] transition ${
                    active
                      ? "border-textGold/70 bg-textGold/15 text-textGold"
                      : "border-white/10 text-white/55 hover:border-white/25 hover:text-white"
                  }`}
                >
                  {material === "all" ? "All Materials" : material}
                </button>
              );
            })}
          </div>
        )}

        {/* Filtered Product Cards */}
        {filteredProducts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#080808] transition hover:border-textGold/40"
              >
                <Link
                  href={`/products/${product.slug}`}
                  className="relative aspect-[4/3] w-full overflow-hidden bg-[#111]"
                >
                  <CmsImage
                    image={product.imageUrl}
                    altFallback={product.name}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-textGold">
                    {product.category}
                  </span>
                </Link>

                <div className="flex flex-1 flex-col p-5">
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="text-lg font-light text-white transition-colors group-hover:text-textGold">
                      {product.name}
                    </h3>
                  </Link>
                  {product.materials.length > 0 && (
                    <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/45">
                      {product.materials.join(" · ")}
                    </p>
                  )}
                  <p className="mt-2.5 line-clamp-2 text-xs leading-5 text-white/65">
                    {product.shortDescription}
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
                        placement: "collections_card",
                        productName: product.name,
                        productSlug: product.slug,
                        categoryName: product.category,
                        categorySlug: product.categorySlug,
                      }}
                      className="inline-flex min-h-11 items-center justify-center rounded-lg border border-textGold/35 bg-textGold/10 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.15em] text-textGold transition hover:bg-textGold hover:text-black"
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-8 text-center">
            <h3 className="text-lg font-light text-white">
              No matching designs for that filter
            </h3>
            <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-white/55">
              Need a bespoke size or custom sketch fabricated in Moradabad? Reset your filters or message our workshop directly.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCollection("all");
                  setActiveMaterial("all");
                }}
                className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-5 py-2.5 text-[10px] uppercase tracking-[0.16em] text-white transition hover:border-textGold hover:text-textGold"
              >
                Reset Filters
              </button>
              <TrackedActionLink
                href={generalWhatsAppHref}
                target="_blank"
                rel="noopener noreferrer"
                eventName="whatsapp_click"
                trackingProps={{ placement: "collections_empty_state", channel: "whatsapp" }}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-textGold px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-black transition hover:bg-white"
              >
                <MessageCircle size={14} />
                Discuss Custom Work
              </TrackedActionLink>
            </div>
          </div>
        )}
      </section>

      {/* 3. Single Focused Custom Project Conversion Block */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="flex flex-col justify-between gap-6 rounded-2xl border border-textGold/20 bg-[#0d0d0d] p-6 sm:p-10 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-[10px] uppercase tracking-[0.25em] text-textGold">
              Made to Measure · Moradabad Workshop
            </p>
            <h2 className="mt-2 font-heading text-2xl font-light text-white sm:text-3xl">
              Have a custom sketch or site dimension?
            </h2>
            <p className="mt-2 text-xs leading-6 text-white/65 sm:text-sm">
              Share your gate or railing opening measurements with our team to receive design guidance, material options, and an accurate fabrication quote.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <OpenQuoteButton
              label="Get a Quote"
              prefill={{ placement: "collections_bottom_cta" }}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-textGold px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-white"
            />
            <TrackedActionLink
              href={generalWhatsAppHref}
              target="_blank"
              rel="noopener noreferrer"
              eventName="whatsapp_click"
              trackingProps={{ placement: "collections_bottom_cta", channel: "whatsapp" }}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-[10px] uppercase tracking-[0.18em] text-white transition hover:border-textGold hover:text-textGold"
            >
              <WhatsAppIcon className="h-3.5 w-3.5" />
              WhatsApp Enquiry
            </TrackedActionLink>
          </div>
        </div>
      </section>
    </div>
  );
}
