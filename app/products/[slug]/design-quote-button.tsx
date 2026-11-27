"use client";

import { MessageCircle } from "lucide-react";
import { useOptionalEnquiry } from "@/components/lead/EnquiryContext";
import { buildWhatsAppQuoteUrl } from "@/lib/site-config";
import { trackEvent } from "@/lib/tracker";

type DesignQuoteButtonProps = {
  sharePath: string;
  productId?: string;
  productSlug?: string;
  categorySlug?: string;
  productName: string;
  designCode?: string;
  className?: string;
};

export default function DesignQuoteButton({
  sharePath,
  productId,
  productSlug,
  categorySlug,
  productName,
  designCode,
  className,
}: DesignQuoteButtonProps) {
  const enquiry = useOptionalEnquiry();
  const whatsappUrl = buildWhatsAppQuoteUrl({
    productName,
    designCode,
    sharePath,
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
            categorySlug: categorySlug || "custom-metalwork",
            productSlug: productSlug || null,
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
        <MessageCircle size={12} /> Get quote
      </button>
    );
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        void trackEvent("whatsapp_click", {
          placement: "product_design_card",
          categorySlug: categorySlug || "custom-metalwork",
          productSlug: productSlug || null,
        });
      }}
      aria-label={`Get a quote for ${productName} ${designCode || ""}`}
      className={className}
    >
      <MessageCircle size={12} /> Get quote
    </a>
  );
}
