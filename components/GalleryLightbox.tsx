"use client";

import { useState, useEffect, useCallback } from "react";
import Image, { type StaticImageData } from "next/image";
import { ChevronLeft, ChevronRight, FileText, MessageCircle, X, ZoomIn } from "lucide-react";
import { useOptionalEnquiry } from "@/components/lead/EnquiryContext";
import { trackEvent } from "@/lib/tracker";

export type GalleryItem = {
  id: string;
  title: string;
  category: string;
  categorySlug: string;
  material: string;
  description: string;
  image: string | StaticImageData;
  alt: string;
};

const DEFAULT_CATEGORIES = [
  { slug: "all", name: "All Works" },
  { slug: "gates", name: "Main Gates" },
  { slug: "stair-railings", name: "Staircase Railings" },
  { slug: "balcony-railings", name: "Balcony Railings" },
  { slug: "spiral-railings", name: "Spiral Railings" },
  { slug: "decorative-metalwork", name: "Decorative Metalwork" },
];

export default function GalleryLightbox({
  items,
  categories = DEFAULT_CATEGORIES,
}: {
  items: GalleryItem[];
  categories?: Array<{ slug: string; name: string }>;
}) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const enquiry = useOptionalEnquiry();
  const setSuppressedByOverlay = enquiry?.setSuppressedByOverlay;

  const filterList = categories.length ? categories : DEFAULT_CATEGORIES;

  const filteredItems =
    activeCategory === "all"
      ? items
      : items.filter((item) => item.categorySlug === activeCategory);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const showNext = useCallback(() => {
    if (lightboxIndex === null || filteredItems.length === 0) return;
    setLightboxIndex((prev) => (prev! + 1) % filteredItems.length);
  }, [lightboxIndex, filteredItems.length]);

  const showPrev = useCallback(() => {
    if (lightboxIndex === null || filteredItems.length === 0) return;
    setLightboxIndex((prev) => (prev! === 0 ? filteredItems.length - 1 : prev! - 1));
  }, [lightboxIndex, filteredItems.length]);

  useEffect(() => {
    if (lightboxIndex === null) {
      document.body.style.overflow = "";
      setSuppressedByOverlay?.(false);
      return;
    }
    document.body.style.overflow = "hidden";
    setSuppressedByOverlay?.(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      setSuppressedByOverlay?.(false);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxIndex, closeLightbox, showNext, showPrev, setSuppressedByOverlay]);

  const currentItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  return (
    <div>
      {/* Category Filter Pills */}
      <div className="scrollbar-none mb-8 flex gap-2 overflow-x-auto pb-2 sm:mb-12 sm:flex-wrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {filterList.map((cat) => {
          const isActive = activeCategory === cat.slug;
          return (
            <button
              key={cat.slug}
              type="button"
              onClick={() => {
                setActiveCategory(cat.slug);
                setLightboxIndex(null);
              }}
              className={`shrink-0 rounded-full border px-4 py-2.5 text-[10px] uppercase tracking-[0.16em] transition-colors ${
                isActive
                  ? "border-textGold bg-textGold font-semibold text-black"
                  : "border-white/12 text-white/60 hover:border-white/30 hover:text-white"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Gallery Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => openLightbox(idx)}
              className="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-[#101010]"
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-90" />

              <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white/70 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 sm:right-4 sm:top-4">
                <ZoomIn size={15} />
              </span>

              <div className="absolute inset-x-0 bottom-0 p-3 transition-transform duration-300 sm:p-5">
                <p className="text-[8px] uppercase tracking-[0.2em] text-textGold sm:text-[9px]">
                  {item.category}
                </p>
                <h3 className="mt-1 line-clamp-1 text-xs font-light text-white sm:text-sm">
                  {item.title}
                </h3>
                <p className="mt-0.5 line-clamp-1 text-[10px] text-white/50 sm:text-xs">
                  {item.material}
                </p>
                {enquiry && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      void trackEvent("quote_cta_click", {
                        placement: "gallery_card",
                        categorySlug: item.categorySlug || "custom-metalwork",
                      });
                      enquiry.openEnquiryModal({
                        title: `Quote: ${item.title}`,
                        subtitle: `${item.category} · ${item.material}`,
                        productName: item.title,
                        categorySlug: item.categorySlug || "custom-metalwork",
                        placement: "gallery_page",
                      });
                    }}
                    aria-label={`Request quote for ${item.title}`}
                    className="mt-2.5 inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-1.5 rounded-full border border-textGold/60 bg-black/85 px-3 text-[10px] font-medium uppercase tracking-[0.14em] text-textGold transition hover:bg-textGold hover:text-black sm:w-auto sm:px-4"
                  >
                    <FileText size={13} />
                    <span>Enquire</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-white/10 py-20 text-center text-sm text-white/45">
          No projects found in this category.
        </div>
      )}

      {/* Lightbox Modal */}
      {currentItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md sm:p-8"
        >
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Close project preview"
            className="absolute right-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white transition hover:border-textGold hover:text-textGold sm:right-8 sm:top-8"
          >
            <X size={20} />
          </button>

          <button
            type="button"
            onClick={showPrev}
            aria-label="Previous project"
            className="absolute left-2 top-1/2 z-40 -translate-y-1/2 rounded-full border border-white/15 bg-black/70 p-2.5 text-white transition hover:border-textGold hover:text-textGold sm:left-6 sm:p-3.5"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            type="button"
            onClick={showNext}
            aria-label="Next project"
            className="absolute right-2 top-1/2 z-40 -translate-y-1/2 rounded-full border border-white/15 bg-black/70 p-2.5 text-white transition hover:border-textGold hover:text-textGold sm:right-6 sm:p-3.5"
          >
            <ChevronRight size={22} />
          </button>

          <div className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0a0a0a] lg:flex-row">
            <div className="relative aspect-[4/3] w-full bg-black lg:aspect-auto lg:h-[75vh] lg:w-3/5">
              <Image
                src={currentItem.image}
                alt={currentItem.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-contain"
              />
            </div>

            <div className="flex flex-1 flex-col justify-between overflow-y-auto p-6 sm:p-8 lg:p-10">
              <div>
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-white/40">
                  <span className="text-textGold">{currentItem.category}</span>
                  <span>
                    {(lightboxIndex ?? 0) + 1} / {filteredItems.length}
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-light text-white sm:text-2xl">
                  {currentItem.title}
                </h2>

                <div className="mt-2 text-xs uppercase tracking-[0.14em] text-white/50">
                  Material: <span className="text-white/80">{currentItem.material}</span>
                </div>

                <p className="mt-5 text-sm leading-6 text-white/65">
                  {currentItem.description}
                </p>

                <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02] p-4 text-xs leading-5 text-white/55">
                  Handcrafted and custom fabricated to your exact opening dimensions at our workshop in Moradabad, UP.
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6">
                {enquiry && (
                  <button
                    type="button"
                    onClick={() => {
                      const target = currentItem;
                      void trackEvent("quote_cta_click", {
                        placement: "gallery_lightbox",
                        categorySlug: target.categorySlug || "custom-metalwork",
                      });
                      closeLightbox();
                      enquiry.openEnquiryModal({
                        title: `Quote: ${target.title}`,
                        subtitle: `${target.category} · ${target.material}`,
                        productName: target.title,
                        categorySlug: target.categorySlug || "custom-metalwork",
                        placement: "gallery_page",
                      });
                    }}
                    className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-textGold bg-textGold px-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-white"
                  >
                    <FileText size={16} /> Get Free Quote for Similar Design
                  </button>
                )}
                <a
                  href={`https://wa.me/919634776691?text=${encodeURIComponent(
                    `Hello Afsha Creative Solution, I saw this design in your gallery and would like a quote:\n\nProject: ${currentItem.title}\nCategory: ${currentItem.category}\nMaterial: ${currentItem.material}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    void trackEvent("whatsapp_click", {
                      placement: "gallery_lightbox",
                      categorySlug: currentItem.categorySlug || "custom-metalwork",
                    });
                  }}
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-white/20 px-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition hover:border-textGold hover:text-textGold"
                >
                  <MessageCircle size={16} /> Discuss on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
