"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import type { CmsSiteIdentitySetting } from "@/lib/cms/types";
import { useEnquiry } from "./EnquiryContext";
import LeadEnquiryForm, { type LeadCategoryOption } from "./LeadEnquiryForm";

export default function EnquiryModal({
  categories = [],
  identity,
}: {
  categories?: LeadCategoryOption[];
  identity?: CmsSiteIdentitySetting;
}) {
  const { isModalOpen, prefill, closeEnquiryModal } = useEnquiry();

  useEffect(() => {
    if (!isModalOpen) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeEnquiryModal();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isModalOpen, closeEnquiryModal]);

  if (!isModalOpen) return null;

  const isEmailQuote = prefill.enquiryMode === "email_quote";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={prefill.title || (isEmailQuote ? "Email for Product Quote" : "Get a Free Quote")}
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/85 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeEnquiryModal();
      }}
    >
      <div className="relative flex max-h-[92svh] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl border border-white/15 bg-[#090909] text-white shadow-2xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3.5 sm:px-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-textGold">
              {isEmailQuote ? "Email Quote Request" : "Free Consultation & Quote"}
            </p>
            <h2 className="mt-0.5 text-base font-light text-white sm:text-lg">
              {prefill.title ||
                (isEmailQuote ? "Email for Product Quote" : "Request Custom Metalwork Quote")}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeEnquiryModal}
            aria-label="Close quote form"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/15 text-white/75 transition hover:border-textGold hover:text-textGold"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto p-3.5 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-5">
          <LeadEnquiryForm
            key={`${prefill.enquiryMode || "quote"}-${prefill.categorySlug || ""}-${prefill.productId || ""}-${prefill.productSlug || ""}-${prefill.designCode || ""}-${prefill.placement || ""}`}
            categories={categories}
            enquiryMode={prefill.enquiryMode || "quote"}
            defaultCategory={prefill.categorySlug}
            categoryName={prefill.categoryName}
            productId={prefill.productId}
            productSlug={prefill.productSlug}
            productName={prefill.productName}
            productDescription={prefill.productDescription}
            productImageUrl={prefill.productImageUrl}
            productUrl={prefill.productUrl}
            designCode={prefill.designCode}
            placement={prefill.placement || "quote_modal"}
            whatsappNumber={identity?.whatsappNumber}
            subheading={prefill.subtitle}
            compact
            className="border-0 bg-transparent p-1 sm:p-2"
          />
        </div>
      </div>
    </div>
  );
}
