"use client";

import LeadEnquiryForm from "@/components/lead/LeadEnquiryForm";

export type QuoteFormProps = {
  defaultCategory?: string;
  title?: string;
  subtitle?: string;
  placement?: string;
  className?: string;
};

export default function QuoteForm({
  defaultCategory = "gates",
  title = "Request a Made-to-Measure Quote",
  subtitle = "Share your project dimensions, material preferences, and design vision. Our workshop team in Moradabad will review and provide a detailed estimate.",
  placement = "quote_form",
  className = "",
}: QuoteFormProps) {
  return (
    <LeadEnquiryForm
      defaultCategory={defaultCategory}
      heading={title}
      subheading={subtitle}
      placement={placement}
      className={className}
    />
  );
}
