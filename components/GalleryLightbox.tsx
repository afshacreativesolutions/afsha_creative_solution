"use client";

import { useState, useEffect, useCallback } from "react";
import Image, { type StaticImageData } from "next/image";
import { ChevronLeft, ChevronRight, FileText, X, ZoomIn } from "lucide-react";
import { useOptionalEnquiry } from "@/components/lead/EnquiryContext";
import TrackedActionLink from "@/components/lead/TrackedActionLink";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { trackEvent } from "@/lib/tracker";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export type GalleryItem = {
  id: string;
  title: string;
  category: string;
  categorySlug: string;
  productSlug?: string;
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
  whatsappNumber,
}: {
  items: GalleryItem[];
  categories?: Array<{ slug: string; name: string }>;
  whatsappNumber?: string;
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
  const currentWaUrl = currentItem
    ? buildWhatsAppUrl({
        intent: "gallery",
        whatsappNumber,
        projectName: currentItem.title,
        projectUrl: currentItem.productSlug ? `/products/${currentItem.productSlug}` : "/gallery",
      })
    : "";

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
              className={`min-h-11 shrink-0 rounded-full border px-4 py-2.5 text-[10px] uppercase tracking-[0.16em] transition-colors ${
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item, idx) => {
            const cardWaUrl = buildWhatsAppUrl({
              intent: "gallery",
              whatsappNumber,
              projectName: item.title,
              projectUrl: item.productSlug ? `/products/${item.productSlug}` : "/gallery",
            });

            return (
              <article
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0b0b0b] transition-colors hover:border-textGold/40"
              >
                <button
                  type="button"
                  onClick={() => openLightbox(idx)}
                  aria-label={`Preview ${item.title}`}
                  className="relative aspect-[4/3] w-full cursor-pointer overflow-hidden bg-[#101010] text-left"
                >
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-90" />
                  <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/65 text-white/80 backdrop-blur-sm transition-all duration-300 group-hover:text-textGold">
                    <ZoomIn size={15} />
                  </span>
                </button>

                <div className="flex flex-1 flex-col p-4">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-textGold">
                    {item.category}
                  </p>
                  <h3 className="mt-1 line-clamp-1 text-sm font-light text-white sm:text-base">
                    {item.title}
                  </h3>
                  <p className="mt-0.5 line-clamp-1 text-xs text-white/50">{item.material}</p>

                  <div className="mt-auto flex flex-col gap-2 pt-4 sm:flex-row sm:items-center">
                    <TrackedActionLink
                      href={cardWaUrl}
                      eventName="gallery_enquiry_click"
                      trackingProps={{
                        placement: "gallery_card",
                        channel: "whatsapp",
                        categorySlug: item.categorySlug || "custom-metalwork",
                        productSlug: item.productSlug || null,
                        sourcePage: "/gallery",
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                      ariaLabel={`Enquire on WhatsApp about ${item.title}`}
                      className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-full border border-textGold/60 bg-textGold/10 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-textGold transition hover:bg-textGold hover:text-black"
                    >
                      <WhatsAppIcon size={13} />
                      <span>Enquire on WhatsApp</span>
                    </TrackedActionLink>
                    {enquiry && (
                      <button
                        type="button"
                        onClick={() => {
                          void trackEvent("gallery_enquiry_click", {
                            placement: "gallery_card",
                            channel: "quote_modal",
                            categorySlug: item.categorySlug || "custom-metalwork",
                            productSlug: item.productSlug || null,
                            sourcePage: "/gallery",
                          });
                          enquiry.openEnquiryModal({
                            title: `Quote: ${item.title}`,
                            subtitle: `${item.category} · ${item.material}`,
                            productName: item.title,
                            productSlug: item.productSlug,
                            categorySlug: item.categorySlug || "custom-metalwork",
                            placement: "gallery_page",
                            pageUrl: "/gallery",
                          });
                        }}
                        aria-label={`Request quote for ${item.title}`}
                        className="inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-white/15 px-3.5 text-[10px] uppercase tracking-[0.12em] text-white/80 transition hover:border-textGold/50 hover:text-white"
                      >
                        <FileText size={13} />
                        <span>Quote</span>
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
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
            className="absolute left-2 top-1/2 z-40 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/70 p-2.5 text-white transition hover:border-textGold hover:text-textGold sm:left-6 sm:p-3.5"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            type="button"
            onClick={showNext}
            aria-label="Next project"
            className="absolute right-2 top-1/2 z-40 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/70 p-2.5 text-white transition hover:border-textGold hover:text-textGold sm:right-6 sm:p-3.5"
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
                      void trackEvent("gallery_enquiry_click", {
                        placement: "gallery_lightbox",
                        channel: "quote_modal",
                        categorySlug: target.categorySlug || "custom-metalwork",
                        productSlug: target.productSlug || null,
                        sourcePage: "/gallery",
                      });
                      closeLightbox();
                      enquiry.openEnquiryModal({
                        title: `Quote: ${target.title}`,
                        subtitle: `${target.category} · ${target.material}`,
                        productName: target.title,
                        productSlug: target.productSlug,
                        categorySlug: target.categorySlug || "custom-metalwork",
                        placement: "gallery_page",
                        pageUrl: "/gallery",
                      });
                    }}
                    className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-textGold bg-textGold px-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-white"
                  >
                    <FileText size={16} /> Get Free Quote for Similar Design
                  </button>
                )}
                <TrackedActionLink
                  href={currentWaUrl}
                  eventName="gallery_enquiry_click"
                  trackingProps={{
                    placement: "gallery_lightbox",
                    channel: "whatsapp",
                    categorySlug: currentItem.categorySlug || "custom-metalwork",
                    productSlug: currentItem.productSlug || null,
                    sourcePage: "/gallery",
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-textGold/60 bg-textGold/10 px-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-textGold transition hover:bg-textGold hover:text-black"
                >
                  <WhatsAppIcon size={16} /> Enquire on WhatsApp
                </TrackedActionLink>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
