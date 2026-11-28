"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useOptionalEnquiry } from "@/components/lead/EnquiryContext";
import ProductEmailQuoteButton from "@/components/lead/ProductEmailQuoteButton";
import TrackedActionLink from "@/components/lead/TrackedActionLink";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export type ProductGalleryImage = {
  id: string;
  url?: string;
  alt_text: string;
  is_primary: boolean;
};

type ProductGalleryViewerProps = {
  productId: string;
  productSlug: string;
  productName: string;
  categorySlug: string;
  categoryName: string;
  productDescription: string;
  productUrl: string;
  whatsappNumber?: string;
  images: ProductGalleryImage[];
  designPrefix: string;
};

export default function ProductGalleryViewer({
  productId,
  productSlug,
  productName,
  categorySlug,
  categoryName,
  productDescription,
  productUrl,
  whatsappNumber,
  images,
  designPrefix,
}: ProductGalleryViewerProps) {
  const initialIndex = Math.max(
    0,
    images.findIndex((img) => img.is_primary)
  );
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const enquiry = useOptionalEnquiry();
  const setSuppressedByOverlay = enquiry?.setSuppressedByOverlay;

  const safeImages = images.filter((img): img is ProductGalleryImage & { url: string } => Boolean(img.url));
  const imageCount = safeImages.length;
  const activeIndex = imageCount > 0 ? Math.min(selectedIndex, imageCount - 1) : 0;
  const activeImage = safeImages[activeIndex] ?? null;
  const activeDesignCode = `${designPrefix}-${String(activeIndex + 1).padStart(2, "0")}`;

  const showPrev = useCallback(() => {
    if (imageCount <= 1) return;
    setZoomed(false);
    setSelectedIndex((prev) => (prev === 0 ? imageCount - 1 : prev - 1));
  }, [imageCount]);

  const showNext = useCallback(() => {
    if (imageCount <= 1) return;
    setZoomed(false);
    setSelectedIndex((prev) => (prev + 1) % imageCount);
  }, [imageCount]);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setZoomed(false);
  }, []);

  useEffect(() => {
    if (!lightboxOpen) {
      document.body.style.overflow = "";
      setSuppressedByOverlay?.(false);
      return;
    }
    document.body.style.overflow = "hidden";
    setSuppressedByOverlay?.(true);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      setSuppressedByOverlay?.(false);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxOpen, closeLightbox, showPrev, showNext, setSuppressedByOverlay]);

  const activeWhatsappHref = buildWhatsAppUrl({
    intent: "product",
    whatsappNumber,
    productName,
    productUrl,
    designCode: safeImages.length > 1 ? activeDesignCode : undefined,
  });

  return (
    <div className="min-w-0">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0b0b0b]">
        {/* Main Image Stage */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#111] sm:aspect-[1/0.92]">
          {activeImage ? (
            <>
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label={`Zoom ${productName} image ${activeIndex + 1}`}
                className="group relative block h-full w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-textGold"
              >
                <Image
                  src={activeImage.url}
                  alt={activeImage.alt_text || `${productName} — ${activeDesignCode}`}
                  fill
                  priority
                  unoptimized={activeImage.url.includes("supabase.co")}
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20" />
              </button>

              {/* Top-left Design ID & Counter */}
              <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 rounded-full border border-white/15 bg-black/75 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                <span className="text-textGold">{activeDesignCode}</span>
                {safeImages.length > 1 && (
                  <span className="text-white/55">
                    {String(activeIndex + 1).padStart(2, "0")} /{" "}
                    {String(safeImages.length).padStart(2, "0")}
                  </span>
                )}
              </div>

              {/* Top-right Zoom Trigger */}
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label="Open full-screen image viewer"
                className="absolute right-3 top-3 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/75 text-white backdrop-blur-sm transition hover:border-textGold hover:text-textGold"
              >
                <ZoomIn size={18} />
              </button>

              {/* Carousel Prev/Next Controls */}
              {safeImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showPrev}
                    aria-label="Previous product image"
                    className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/70 text-white backdrop-blur-sm transition hover:border-textGold hover:text-textGold"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={showNext}
                    aria-label="Next product image"
                    className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/70 text-white backdrop-blur-sm transition hover:border-textGold hover:text-textGold"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center px-6 text-center">
              <p className="text-[10px] uppercase tracking-[0.24em] text-textGold">
                Afsha Creative Solutions
              </p>
              <p className="mt-2 text-sm text-white/55">
                Custom {productName} — enquire below for workshop designs &amp; photos.
              </p>
            </div>
          )}
        </div>

        {/* Unobtrusive Contextual Image Action Row (44px+ touch targets, high contrast) */}
        <div className="grid grid-cols-1 gap-2.5 border-t border-white/10 bg-[#080808] p-3 min-[380px]:grid-cols-2 sm:p-4">
          <ProductEmailQuoteButton
            productId={productId}
            productSlug={productSlug}
            productName={productName}
            categorySlug={categorySlug}
            categoryName={categoryName}
            productDescription={productDescription}
            productImageUrl={activeImage?.url || ""}
            productUrl={productUrl}
            designCode={safeImages.length > 0 ? activeDesignCode : undefined}
            placement="product_gallery_image"
            label="Email for Quote"
            variant="outline"
            className="w-full"
          />
          <TrackedActionLink
            href={activeWhatsappHref}
            eventName="product_whatsapp_click"
            trackingProps={{
              placement: "product_gallery_image",
              channel: "whatsapp",
              productSlug,
              categorySlug,
              sourcePage: `/products/${productSlug}`,
            }}
            target="_blank"
            rel="noopener noreferrer"
            ariaLabel={`Enquire on WhatsApp about ${productName}`}
            className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full border border-textGold/65 bg-textGold/10 px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-textGold transition hover:bg-textGold hover:text-black"
          >
            <WhatsAppIcon size={15} />
            <span>WhatsApp Enquiry</span>
          </TrackedActionLink>
        </div>

        {/* Thumbnails Strip */}
        {safeImages.length > 1 && (
          <div
            className="scrollbar-none flex gap-2.5 overflow-x-auto border-t border-white/10 bg-[#070707] p-3 sm:p-3.5"
            aria-label="Product design thumbnails"
          >
            {safeImages.map((img, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  aria-label={`View design ${idx + 1}`}
                  aria-pressed={isSelected}
                  className={`relative h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-lg border transition sm:h-[72px] sm:w-[72px] ${
                    isSelected
                      ? "border-textGold ring-1 ring-textGold/60"
                      : "border-white/15 opacity-70 hover:border-white/40 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt_text || `${productName} thumbnail ${idx + 1}`}
                    fill
                    unoptimized={img.url.includes("supabase.co")}
                    sizes="72px"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Viewer Modal */}
      {lightboxOpen && activeImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${productName} image viewer`}
          className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 p-3 backdrop-blur-md sm:p-6"
        >
          {/* Top Controls */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/75">
              <span className="text-textGold">{activeDesignCode}</span>
              <span>·</span>
              <span>
                {activeIndex + 1} / {safeImages.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomed((z) => !z)}
                aria-label={zoomed ? "Zoom out" : "Zoom in"}
                className="inline-flex h-11 min-w-11 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3.5 text-[10px] uppercase tracking-[0.14em] text-white transition hover:border-textGold hover:text-textGold"
              >
                {zoomed ? <ZoomOut size={16} /> : <ZoomIn size={16} />}
                <span className="hidden sm:inline">{zoomed ? "Reset" : "Zoom"}</span>
              </button>
              <button
                type="button"
                onClick={closeLightbox}
                aria-label="Close image viewer"
                className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/60 text-white transition hover:border-textGold hover:text-textGold"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Lightbox Image Area */}
          <div className="relative my-3 flex flex-1 items-center justify-center overflow-hidden">
            {safeImages.length > 1 && (
              <button
                type="button"
                onClick={showPrev}
                aria-label="Previous image"
                className="absolute left-1 z-20 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/75 text-white transition hover:border-textGold hover:text-textGold sm:left-4"
              >
                <ChevronLeft size={22} />
              </button>
            )}

            <div
              onClick={() => setZoomed((z) => !z)}
              className={`relative h-full w-full max-w-5xl transition-transform duration-300 ${
                zoomed ? "scale-150 cursor-zoom-out" : "scale-100 cursor-zoom-in"
              }`}
            >
              <Image
                src={activeImage.url}
                alt={activeImage.alt_text || `${productName} ${activeDesignCode}`}
                fill
                priority
                sizes="100vw"
                className="object-contain"
              />
            </div>

            {safeImages.length > 1 && (
              <button
                type="button"
                onClick={showNext}
                aria-label="Next image"
                className="absolute right-1 z-20 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/75 text-white transition hover:border-textGold hover:text-textGold sm:right-4"
              >
                <ChevronRight size={22} />
              </button>
            )}
          </div>

          {/* Bottom Lightbox Enquiry Bar */}
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-2.5 border-t border-white/15 pt-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href={`/products/${productSlug}/design/${activeImage.id}`}
              onClick={closeLightbox}
              className="inline-flex min-h-11 items-center justify-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-white/75 transition hover:text-textGold"
            >
              <span>Design {activeDesignCode} Page</span>
              <ExternalLink size={13} />
            </Link>
            <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-2 sm:flex sm:items-center">
              <ProductEmailQuoteButton
                productId={productId}
                productSlug={productSlug}
                productName={productName}
                categorySlug={categorySlug}
                categoryName={categoryName}
                productDescription={productDescription}
                productImageUrl={activeImage.url}
                productUrl={productUrl}
                designCode={activeDesignCode}
                placement="product_lightbox"
                label="Email for Quote"
                variant="outline"
                onBeforeOpen={closeLightbox}
              />
              <TrackedActionLink
                href={activeWhatsappHref}
                eventName="product_whatsapp_click"
                trackingProps={{
                  placement: "product_lightbox",
                  channel: "whatsapp",
                  productSlug,
                  categorySlug,
                  sourcePage: `/products/${productSlug}`,
                }}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full border border-textGold bg-textGold px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-black transition hover:bg-white"
              >
                <WhatsAppIcon size={15} />
                <span>WhatsApp Enquiry</span>
              </TrackedActionLink>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
