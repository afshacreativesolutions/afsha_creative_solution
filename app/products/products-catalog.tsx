"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Plus } from "lucide-react";
import TrackedActionLink from "@/components/lead/TrackedActionLink";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type CatalogProduct = {
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
type CatalogCategory = { id: string; name: string; slug: string };

function filterToken(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function ProductsCatalog({
  products,
  categories,
  initialCategory,
  initialMaterial,
  isConfigured,
  whatsappNumber,
  embeddedInCms = false,
  sectionEyebrow = "The collection",
  sectionHeading = "Designed for the way you live.",
  sectionDescription = "Every piece begins with a conversation, then takes shape around your architecture.",
  emptyTitle,
  emptyDescription,
}: {
  products: CatalogProduct[];
  categories: CatalogCategory[];
  initialCategory: string;
  initialMaterial: string;
  isConfigured: boolean;
  whatsappNumber?: string;
  embeddedInCms?: boolean;
  sectionEyebrow?: string;
  sectionHeading?: string;
  sectionDescription?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeMaterial, setActiveMaterial] = useState(initialMaterial);
  const materials = useMemo(
    () => [...new Set(products.flatMap((product) => product.materials))].sort(),
    [products]
  );
  const categoryOptions = [
    { slug: "all", name: "All work" },
    ...(categories.some((category) => category.slug === "railings")
      ? []
      : [{ slug: "railings", name: "Railings" }]),
    ...categories.map(({ slug, name }) => ({ slug, name })),
  ];
  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesCategory =
          activeCategory === "all" ||
          (activeCategory === "railings"
            ? !product.categorySlug.toLowerCase().includes("gate") &&
              !product.category.toLowerCase().includes("gate")
            : product.categorySlug === activeCategory);
        const matchesMaterial =
          activeMaterial === "all" ||
          product.materials.some((material) => filterToken(material) === activeMaterial);
        return matchesCategory && matchesMaterial;
      }),
    [activeCategory, activeMaterial, products]
  );

  const generalWhatsappHref = buildWhatsAppUrl({
    intent: "general",
    whatsappNumber,
  });

  const collectionSection = (
    <section
      id="collection"
      className="mx-auto max-w-7xl scroll-mt-20 px-4 pb-12 pt-8 sm:px-6 sm:pb-20 sm:pt-12 lg:pt-14"
    >
      <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 sm:mb-8 sm:gap-6 sm:pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-textGold">
            {sectionEyebrow}
          </p>
          <h2 className="text-2xl font-light tracking-tight sm:text-4xl">
            {sectionHeading}
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-6 text-white/50">{sectionDescription}</p>
      </div>

      {categories.length > 0 && (
        <div
          className="scrollbar-none mb-8 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Filter products by category"
        >
          {categoryOptions.map((category) => (
            <button
              type="button"
              key={category.slug}
              aria-pressed={activeCategory === category.slug}
              onClick={() => setActiveCategory(category.slug)}
              className={`min-h-11 shrink-0 rounded-full border px-4 py-2.5 text-[10px] uppercase tracking-[0.13em] transition-colors ${
                activeCategory === category.slug
                  ? "border-textGold bg-textGold text-black"
                  : "border-white/12 text-white/55 hover:border-white/35 hover:text-white"
              }`}
            >
              {category.name}
            </button>
          ))}
          <span className="ml-auto hidden items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-white/35 sm:flex">
            <Check size={12} /> Bespoke by nature
          </span>
        </div>
      )}

      {materials.length > 0 && (
        <div
          className="mb-8 flex flex-wrap items-center gap-2"
          aria-label="Filter products by material"
        >
          <span className="mr-1 text-[9px] uppercase tracking-[0.16em] text-white/35">
            Material
          </span>
          {[
            { token: "all", name: "All materials" },
            ...materials.map((name) => ({ token: filterToken(name), name })),
          ].map((material) => (
            <button
              type="button"
              key={material.token}
              aria-pressed={activeMaterial === material.token}
              onClick={() => setActiveMaterial(material.token)}
              className={`min-h-10 shrink-0 rounded-full border px-3.5 py-2 text-[9px] uppercase tracking-[0.12em] transition-colors ${
                activeMaterial === material.token
                  ? "border-textGold/70 text-textGold"
                  : "border-white/10 text-white/45 hover:border-white/30 hover:text-white"
              }`}
            >
              {material.name}
            </button>
          ))}
        </div>
      )}

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-3">
          {filteredProducts.map((product) => {
            const productPath = `/products/${product.slug}`;
            const productWaHref = buildWhatsAppUrl({
              intent: "product",
              whatsappNumber,
              productName: product.name,
              productUrl: productPath,
            });

            return (
              <article key={product.id} className="group flex flex-col">
                <Link href={productPath} className="block">
                  <div className="relative aspect-[0.91] overflow-hidden rounded-md bg-[#111]">
                    {product.imageUrl && (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10 opacity-70 transition-opacity group-hover:opacity-100" />
                    <span className="absolute left-4 top-4 text-[10px] tracking-[0.18em] text-white/75">
                      {product.number}
                    </span>
                    <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/45 bg-black/20 text-white transition-all group-hover:border-textGold group-hover:bg-textGold group-hover:text-black">
                      <ArrowUpRight size={17} strokeWidth={1.4} />
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4 pt-4">
                    <div>
                      <p className="mb-2 text-[9px] uppercase tracking-[0.2em] text-textGold">
                        {product.category} <span className="px-1 text-white/25">/</span>{" "}
                        {product.finish}
                      </p>
                      <h3 className="text-lg font-light text-white transition-colors group-hover:text-textGold">
                        {product.name}
                      </h3>
                      {product.shortDescription && (
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/45">
                          {product.shortDescription}
                        </p>
                      )}
                    </div>
                    <Plus
                      size={16}
                      className="mt-1 shrink-0 text-white/40 transition-transform duration-300 group-hover:rotate-45 group-hover:text-textGold"
                    />
                  </div>
                </Link>

                <div className="mt-auto flex items-center gap-2 border-b border-white/10 pb-4 pt-4">
                  <TrackedActionLink
                    href={productWaHref}
                    eventName="product_enquiry_click"
                    trackingProps={{
                      placement: "product_card",
                      channel: "whatsapp",
                      productSlug: product.slug,
                      categorySlug: product.categorySlug || "custom-metalwork",
                      sourcePage: "/products",
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    ariaLabel={`Enquire on WhatsApp about ${product.name}`}
                    className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-textGold/55 bg-textGold/10 px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-textGold transition hover:bg-textGold hover:text-black"
                  >
                    <WhatsAppIcon size={14} />
                    <span>Enquire on WhatsApp</span>
                  </TrackedActionLink>
                  <Link
                    href={productPath}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 px-4 text-[10px] uppercase tracking-[0.14em] text-white/75 transition hover:border-textGold/50 hover:text-white"
                  >
                    Details
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="border border-white/10 bg-[#080808] px-6 py-14 text-center">
          <p className="text-lg font-light">
            {isConfigured
              ? emptyTitle || "The collection is being prepared."
              : "Connect the catalog to Supabase to publish products."}
          </p>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/45">
            {isConfigured
              ? emptyDescription || "Published products will appear here. Please check back soon."
              : "Set the Supabase environment variables, apply the catalog migration, then add products from the admin panel."}
          </p>
        </div>
      )}
    </section>
  );

  if (embeddedInCms) {
    return collectionSection;
  }

  return (
    <main className="bg-background text-white">
      <section className="relative overflow-hidden border-b border-white/10 px-4 pb-8 pt-6 sm:px-6 sm:pb-12 sm:pt-16 lg:pb-14 lg:pt-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-48 h-[34rem] w-[34rem] rounded-full border border-textGold/10 sm:right-[-6rem] sm:top-[-19rem]"
        >
          <div className="absolute inset-10 rounded-full border border-white/5" />
          <div className="absolute inset-24 rounded-full border border-white/5" />
        </div>
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-5 flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-textGold sm:mb-6 sm:gap-3 sm:text-[10px] sm:tracking-[0.28em]">
            <span className="h-px w-8 bg-textGold" /> Made to measure · Moradabad, India
          </div>
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <h1 className="max-w-4xl text-[clamp(2.65rem,8vw,6rem)] font-light leading-[0.98] tracking-[-0.045em] sm:text-[clamp(3rem,7vw,6rem)]">
              Metalwork, <span className="font-heading text-textGold">made yours.</span>
            </h1>
            <div className="max-w-md lg:justify-self-end">
              <p className="text-sm leading-7 text-white/60 sm:text-base">
                A considered collection of gates and architectural railings, shaped around your
                space and finished by hand.
              </p>
              <a
                href="#collection"
                className="mt-7 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-white transition-colors hover:text-textGold"
              >
                Explore the collection <ArrowDown size={15} strokeWidth={1.5} />
              </a>
            </div>
          </div>
          <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-white/10 pt-4 text-[9px] uppercase tracking-[0.12em] text-white/45 sm:mt-9 sm:grid-cols-4 sm:gap-5 sm:pt-4 sm:text-[10px] sm:tracking-[0.18em]">
            <div>
              <span className="mb-2 block text-xl font-light tracking-normal text-white">01</span>
              Made to measure
            </div>
            <div>
              <span className="mb-2 block text-xl font-light tracking-normal text-white">02</span>
              Thoughtful detailing
            </div>
            <div>
              <span className="mb-2 block text-xl font-light tracking-normal text-white">03</span>
              Built for everyday
            </div>
            <div>
              <span className="mb-2 block text-xl font-light tracking-normal text-white">04</span>
              Made in Moradabad
            </div>
          </div>
        </div>
      </section>

      {collectionSection}

      <section className="border-y border-white/10 bg-[#080808] px-4 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-textGold">
              Your space, your specification
            </p>
            <h2 className="max-w-2xl text-2xl font-light leading-tight tracking-tight sm:text-4xl">
              Have a design in mind? Let&apos;s make it real.
            </h2>
          </div>
          <TrackedActionLink
            href={generalWhatsappHref}
            eventName="whatsapp_click"
            trackingProps={{
              placement: "products_catalog_bottom_cta",
              channel: "whatsapp",
              sourcePage: "/products",
            }}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-h-12 w-full items-center justify-between gap-4 rounded-full border border-textGold/60 bg-textGold/10 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-textGold transition-colors hover:bg-textGold hover:text-black sm:w-fit sm:justify-center sm:px-6 sm:py-4 sm:tracking-[0.18em]"
          >
            <span className="inline-flex items-center gap-2">
              <WhatsAppIcon size={15} />
              <span>Enquire on WhatsApp</span>
            </span>
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </TrackedActionLink>
        </div>
      </section>
    </main>
  );
}
