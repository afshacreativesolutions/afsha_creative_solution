"use client";

import LeadEnquiryForm, { type LeadCategoryOption } from "@/components/lead/LeadEnquiryForm";

export default function EnquiryForm({ categories }: { categories: LeadCategoryOption[] }) {
  return <LeadEnquiryForm categories={categories} placement="contact_page" />;
}
