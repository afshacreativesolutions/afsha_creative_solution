"use client";

import { useState } from "react";
import Link from "next/link";
import { MoveRight, X } from "lucide-react";
import Card from "./Card";
import { MenuData } from "@/utils/data";
import { useMenu } from "@/context/menuContext";
import { resolveCmsImageSrc } from "@/lib/cms/media";
import type { CmsMegaMenuSetting } from "@/lib/cms/types";

const fallbackMenuCategories: CmsMegaMenuSetting["categories"] = [
  {
    key: "steelRailling",
    title: "Steel Railings",
    headline: MenuData.steelRailling.headline,
    description: MenuData.steelRailling.description,
    buttonText: MenuData.steelRailling.buttonText,
    viewAllHref: "/products?category=railings&material=stainless-steel",
    cards: MenuData.steelRailling.cards.map((c) => ({
      title: c.title,
      href: `/products?category=${
        c.title.toLowerCase().includes("spiral")
          ? "spiral-railings"
          : c.title.toLowerCase().includes("balcony")
            ? "balcony-railings"
            : "stair-railings"
      }&material=stainless-steel`,
      image: { url: c.image.src, alt: c.title },
    })),
  },
  {
    key: "steelGates",
    title: "Steel Gates",
    headline: MenuData.steelGates.headline,
    description: MenuData.steelGates.description,
    buttonText: MenuData.steelGates.buttonText,
    viewAllHref: "/products?category=gates&material=stainless-steel",
    cards: MenuData.steelGates.cards.map((c) => ({
      title: c.title,
      href: "/products?category=gates&material=stainless-steel",
      image: { url: c.image.src, alt: c.title },
    })),
  },
  {
    key: "ironRailling",
    title: "Iron Railings",
    headline: MenuData.ironRailling.headline,
    description: MenuData.ironRailling.description,
    buttonText: MenuData.ironRailling.buttonText,
    viewAllHref: "/products?category=railings&material=iron",
    cards: MenuData.ironRailling.cards.map((c) => ({
      title: c.title,
      href: `/products?category=${
        c.title.toLowerCase().includes("balcony") ? "balcony-railings" : "stair-railings"
      }&material=iron`,
      image: { url: c.image.src, alt: c.title },
    })),
  },
  {
    key: "ironGates",
    title: "Iron Gates",
    headline: MenuData.ironGates.headline,
    description: MenuData.ironGates.description,
    buttonText: MenuData.ironGates.buttonText,
    viewAllHref: "/products?category=gates&material=iron",
    cards: MenuData.ironGates.cards.map((c) => ({
      title: c.title,
      href: "/products?category=gates&material=iron",
      image: { url: c.image.src, alt: c.title },
    })),
  },
];

const Menu = ({ megaMenu }: { megaMenu?: CmsMegaMenuSetting }) => {
  const { menu, closeMenu } = useMenu();
  const [activeItem, setActiveItem] = useState(0);

  const categories = megaMenu?.categories?.length
    ? megaMenu.categories
    : fallbackMenuCategories;
  const safeIndex = activeItem < categories.length ? activeItem : 0;
  const activeData = categories[safeIndex];
  const eyebrow = megaMenu?.eyebrow || "MENU CATEGORY";
  const quoteCtaLabel = megaMenu?.quoteCtaLabel || "GET A CUSTOM QUOTE";
  const quoteCtaHref = megaMenu?.quoteCtaHref || "/contact";

  if (!activeData) return null;

  return (
    <div
      id="site-menu"
      aria-hidden={!menu}
      className={`fixed inset-0 z-40 h-dvh overflow-y-auto overscroll-contain bg-[rgba(18,18,18,0.98)] pt-16 transition-all duration-300 ease-in-out ${
        menu
          ? "pointer-events-auto visible translate-x-0 opacity-100"
          : "pointer-events-none invisible translate-x-full opacity-0"
      }`}
    >
      <div className="relative mx-auto min-h-full w-full max-w-7xl px-4 pb-8 pt-5 sm:px-8 sm:pt-8 lg:grid lg:grid-cols-3 lg:gap-4 lg:pt-10">
        {/* Mobile close bar */}
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4 lg:hidden">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-textGold">
            Browse Categories
          </div>
          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close categories menu"
            className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-textGold/60 hover:text-textGold"
          >
            <X size={18} />
          </button>
        </div>

        <aside className="lg:px-6">
          <div className="hidden text-[9px] font-bold tracking-[0.2em] text-textGold lg:block">
            {eyebrow}
            <div className="mt-2 w-8 border-t border-textGold/60" />
          </div>
          <div className="-mx-4 mt-2 flex gap-2 px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0 lg:mt-8 lg:flex-col lg:gap-4">
            {categories.map((item, index) => {
              const isActive = safeIndex === index;
              return (
                <button
                  key={item.key || item.title}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveItem(index)}
                  className={`group flex min-h-11 shrink-0 touch-manipulation select-none items-center justify-between gap-3 rounded-full border px-4 text-xs tracking-[0.04em] transition-colors sm:text-sm lg:min-h-0 lg:rounded-none lg:border-0 lg:px-0 lg:py-1 lg:text-lg ${
                    isActive
                      ? "border-textGold/40 bg-textGold/10 text-white lg:bg-transparent"
                      : "border-white/10 text-textGray hover:text-white"
                  }`}
                >
                  <span>
                    {String(index + 1).padStart(2, "0")}. {item.title}
                  </span>
                  <MoveRight
                    className={`hidden w-5 stroke-1 transition-all duration-300 lg:block ${
                      isActive ? "translate-x-1 text-textGold" : ""
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </aside>

        <section className="mt-6 min-w-0 lg:col-span-2 lg:mt-0 lg:px-8">
          <div className="mb-5 flex flex-col gap-3 border-b border-gray-800 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-3xl font-extrabold uppercase leading-tight sm:text-4xl">
              {activeData.headline}
            </h2>
            <p className="max-w-md text-sm leading-6 text-textGray sm:text-right">
              {activeData.description}
            </p>
          </div>

          <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-5 sm:mx-0 sm:gap-4 sm:px-0 lg:gap-6 lg:py-5">
            {activeData.cards.map((data, idx) => {
              const imgSrc = resolveCmsImageSrc(data.image) ?? "";
              return (
                <Card
                  key={`${data.title}-${idx}`}
                  href={data.href}
                  onClick={closeMenu}
                  image={imgSrc}
                  title={data.title}
                  description={data.title}
                  height="h-[240px] sm:h-64 lg:h-63"
                  width="w-[68vw] max-w-[240px] sm:w-56"
                  rounded="rounded-lg"
                />
              );
            })}
          </div>

          <div className="flex flex-col gap-4 border-t border-gray-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href={activeData.viewAllHref}
              onClick={closeMenu}
              className="inline-flex min-h-11 w-fit items-center justify-center gap-3 rounded-full border border-textGold/50 bg-textGold/15 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.08em] text-textGold transition-colors hover:bg-textGold hover:text-black sm:text-xs"
            >
              {activeData.buttonText}
              <MoveRight className="w-4 stroke-1 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href={quoteCtaHref}
              onClick={closeMenu}
              className="inline-flex min-h-11 items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-textGold hover:text-white"
            >
              {quoteCtaLabel}
              <MoveRight className="w-4 stroke-2" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Menu;
