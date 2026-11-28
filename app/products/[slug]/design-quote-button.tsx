"use client";

import WhatsAppIcon from "@/components/WhatsAppIcon";
import { useOptionalEnquiry } from "@/components/lead/EnquiryContext";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/tracker";

type DesignQuoteButtonProps = {
  sharePath: string;
  productId?: string;
  productSlug?: string;
  categorySlug?: string;
  productName: string;
  designCode?: string;
  whatsappNumber?: string;
  className?: string;
};

export default function DesignQuoteButton({
  sharePath,
  productId,
  productSlug,
  categorySlug,
  productName,
  designCode,
  whatsappNumber,
  className,
}: DesignQuoteButtonProps) {
  const enquiry = useOptionalEnquiry();
  const whatsappUrl = buildWhatsAppUrl({
    intent: "product",
    productName,
    designCode,
    productUrl: sharePath,
    whatsappNumber,
  });

  if (enquiry) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void trackEvent("product_enquiry_click", {
            placement: "product_design_card",
            channel: "quote_modal",
            categorySlug: categorySlug || "custom-metalwork",
            productSlug: productSlug || null,
            sourcePage: productSlug ? `/products/${productSlug}` : sharePath,
          });
          enquiry.openEnquiryModal({
            title: `Quote: ${productName}`,
            subtitle: designCode
              ? `Requesting estimate for Design ${designCode}.`
              : "Share dimensions & location for an estimate.",
            productId,
            productSlug,
            productName,
            categorySlug,
            designCode,
            placement: "product_page",
          });
        }}
        aria-label={`Get a quote for ${productName} ${designCode || ""}`}
        className={className}
      >
        <WhatsAppIcon size={12} /> Get quote
      </button>
    );
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        void trackEvent("product_enquiry_click", {
          placement: "product_design_card",
          channel: "whatsapp",
          categorySlug: categorySlug || "custom-metalwork",
          productSlug: productSlug || null,
          sourcePage: productSlug ? `/products/${productSlug}` : sharePath,
        });
      }}
      aria-label={`Enquire on WhatsApp for ${productName} ${designCode || ""}`}
      className={className}
    >
      <WhatsAppIcon size={12} /> Enquire
    </a>
  );
}
