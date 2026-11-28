"use client";

import { Mail } from "lucide-react";
import { trackEvent } from "@/lib/tracker";
import { useEnquiry } from "./EnquiryContext";

type ProductEmailQuoteButtonProps = {
  productId?: string;
  productSlug: string;
  productName: string;
  categorySlug?: string;
  categoryName?: string;
  productDescription?: string;
  productImageUrl?: string;
  productUrl: string;
  designCode?: string;
  placement: string;
  label?: string;
  variant?: "primary" | "outline";
  className?: string;
  onBeforeOpen?: () => void;
};

export default function ProductEmailQuoteButton({
  productId,
  productSlug,
  productName,
  categorySlug = "custom-metalwork",
  categoryName = "Custom Metalwork",
  productDescription = "",
  productImageUrl = "",
  productUrl,
  designCode,
  placement,
  label = "Email for Quote",
  variant = "outline",
  className = "",
  onBeforeOpen,
}: ProductEmailQuoteButtonProps) {
  const { openEnquiryModal } = useEnquiry();

  const variantClasses =
    variant === "primary"
      ? "border border-textGold bg-textGold text-black hover:bg-white"
      : "border border-white/25 bg-white/[0.04] text-white hover:border-textGold hover:text-textGold";

  const handleClick = () => {
    void trackEvent("product_email_quote_click", {
      placement,
      channel: "email_quote",
      productSlug,
      categorySlug,
      sourcePage: `/products/${productSlug}`,
    });
    onBeforeOpen?.();
    openEnquiryModal({
      enquiryMode: "email_quote",
      title: `Email Quote: ${productName}`,
      subtitle: "Enter your email and contact details to receive pricing and customization options.",
      productId,
      productSlug,
      productName,
      categorySlug,
      categoryName,
      productDescription,
      productImageUrl,
      productUrl,
      designCode,
      placement,
      pageUrl: `/products/${productSlug}`,
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex min-h-[46px] cursor-pointer items-center justify-center gap-2 rounded-full px-5 text-[10px] font-semibold uppercase tracking-[0.16em] transition ${variantClasses} ${className}`}
    >
      <Mail size={15} className="shrink-0" />
      <span>{label}</span>
    </button>
  );
}
