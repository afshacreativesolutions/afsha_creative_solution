"use client";

import { MessageSquarePlus } from "lucide-react";
import { trackEvent } from "@/lib/tracker";
import { useEnquiry, type EnquiryPrefill } from "./EnquiryContext";

export default function OpenQuoteButton({
  label = "Get a Free Quote",
  prefill,
  className = "",
  variant = "primary",
}: {
  label?: string;
  prefill?: EnquiryPrefill;
  className?: string;
  variant?: "primary" | "outline";
}) {
  const { openEnquiryModal } = useEnquiry();

  const variantClasses =
    variant === "outline"
      ? "border border-textGold/60 bg-textGold/10 text-textGold hover:bg-textGold hover:text-black"
      : "border border-textGold bg-textGold text-black hover:bg-white";

  const handleClick = () => {
    const isProduct = Boolean(prefill?.productSlug || prefill?.productId);
    void trackEvent(isProduct ? "product_enquiry_click" : "quote_cta_click", {
      placement: prefill?.placement || "open_quote_button",
      categorySlug: prefill?.categorySlug || null,
      productSlug: prefill?.productSlug || null,
    });
    openEnquiryModal(prefill);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex min-h-[46px] cursor-pointer items-center justify-center gap-2 rounded-full px-6 text-[10px] font-semibold uppercase tracking-[0.16em] transition ${variantClasses} ${className}`}
    >
      <MessageSquarePlus size={15} />
      <span>{label}</span>
    </button>
  );
}
