import { BUSINESS_WHATSAPP_NUMBER, canonicalUrl } from "./site-config";

export type WhatsAppEnquiryIntent = "general" | "product" | "category" | "gallery";

export type WhatsAppEnquiryContext = {
  /** Verified business WhatsApp number from CMS site settings (falls back to BUSINESS_WHATSAPP_NUMBER). */
  whatsappNumber?: string | null;
  /** Product context */
  productName?: string | null;
  productUrl?: string | null;
  designCode?: string | null;
  /** Category context */
  categoryName?: string | null;
  categoryUrl?: string | null;
  /** Gallery / project context */
  projectName?: string | null;
  projectUrl?: string | null;
  /** Optional non-PII project location (only included when explicitly supplied by user) */
  customerLocation?: string | null;
  /** Optional safe enquiry details (e.g., reference ID or dimensions) */
  enquiryDetails?: string | null;
  /** Optional custom greeting override for general enquiries */
  customMessage?: string | null;
};

export type BuildWhatsAppUrlInput =
  | {
      message: string;
      whatsappNumber?: string | null;
    }
  | ({
      intent?: WhatsAppEnquiryIntent;
      message?: string;
    } & WhatsAppEnquiryContext);

function cleanField(value?: string | null): string {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  const lower = trimmed.toLowerCase();
  if (lower === "undefined" || lower === "null") return "";
  return trimmed;
}

function resolveShareUrl(rawUrl?: string | null): string {
  const cleaned = cleanField(rawUrl);
  if (!cleaned) return "";
  return canonicalUrl(cleaned);
}

function appendOptionalDetails(
  sections: string[],
  context?: Pick<WhatsAppEnquiryContext, "customerLocation" | "enquiryDetails">
) {
  const location = cleanField(context?.customerLocation);
  const details = cleanField(context?.enquiryDetails);
  if (location) {
    sections.push(`Project location: ${location}`);
  }
  if (details) {
    sections.push(`Enquiry details: ${details}`);
  }
}

/**
 * Normalizes a business WhatsApp phone number to digits-only format with country code.
 */
export function normalizeWhatsAppNumber(rawNumber?: string | null): string {
  const digits = cleanField(rawNumber).replace(/\D/g, "");
  if (!digits) return BUSINESS_WHATSAPP_NUMBER;
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

/**
 * Builds a professional general metal fabrication enquiry message.
 */
export function buildGeneralWhatsAppMessage(
  context: Pick<
    WhatsAppEnquiryContext,
    "customerLocation" | "enquiryDetails" | "customMessage"
  > = {}
): string {
  const custom = cleanField(context.customMessage);
  if (custom) {
    const sections = [custom];
    appendOptionalDetails(sections, context);
    return sections.join("\n\n");
  }

  const sections = [
    "Hello Afsha Creative Solutions!",
    "I'd like to know more about your metal fabrication services.",
    "Could you please share your available services and estimated pricing?",
  ];

  appendOptionalDetails(sections, context);
  sections.push("Thank you!");
  return sections.join("\n\n");
}

/**
 * Builds a product-specific WhatsApp enquiry message with canonical product URL for rich OG previews.
 */
export function buildProductWhatsAppMessage(
  context: Pick<
    WhatsAppEnquiryContext,
    "productName" | "productUrl" | "designCode" | "customerLocation" | "enquiryDetails"
  >
): string {
  const productName = cleanField(context.productName) || "custom metalwork product";
  const productUrl = resolveShareUrl(context.productUrl);
  const designCode = cleanField(context.designCode);

  const sections = [
    "Hello Afsha Creative Solutions!",
    `I'm interested in your ${productName}.`,
    [
      "Could you please share:",
      "",
      "1. Available designs and customization options.",
      "2. Estimated pricing.",
      "3. Manufacturing and installation time.",
    ].join("\n"),
  ];

  if (designCode) {
    sections.push(`Design ID: ${designCode}`);
  }

  if (productUrl) {
    sections.push(`Product details:\n${productUrl}`);
  }

  appendOptionalDetails(sections, context);
  sections.push("Please contact me with more details.");
  sections.push("Thank you!");
  return sections.join("\n\n");
}

/**
 * Builds a category-specific WhatsApp enquiry message with canonical category URL.
 */
export function buildCategoryWhatsAppMessage(
  context: Pick<
    WhatsAppEnquiryContext,
    "categoryName" | "categoryUrl" | "customerLocation" | "enquiryDetails"
  >
): string {
  const categoryName = cleanField(context.categoryName) || "metalwork";
  const categoryUrl = resolveShareUrl(context.categoryUrl);

  const sections = [
    "Hello Afsha Creative Solutions!",
    `I'm interested in your ${categoryName} collection.`,
    "Please share available designs, customization options and pricing.",
  ];

  if (categoryUrl) {
    sections.push(`Category: ${categoryUrl}`);
  }

  appendOptionalDetails(sections, context);
  sections.push("Thank you!");
  return sections.join("\n\n");
}

/**
 * Builds a gallery/project-specific WhatsApp enquiry message with canonical project URL.
 */
export function buildGalleryWhatsAppMessage(
  context: Pick<
    WhatsAppEnquiryContext,
    "projectName" | "projectUrl" | "customerLocation" | "enquiryDetails"
  >
): string {
  const projectName = cleanField(context.projectName) || "custom metalwork";
  const projectUrl = resolveShareUrl(context.projectUrl);

  const sections = [
    "Hello Afsha Creative Solutions!",
    `I saw your ${projectName} project and would like something similar.`,
    "Could you please discuss the design, customization and estimated cost?",
  ];

  if (projectUrl) {
    sections.push(`Project: ${projectUrl}`);
  }

  appendOptionalDetails(sections, context);
  sections.push("Thank you!");
  return sections.join("\n\n");
}

/**
 * Generates a properly URL-encoded WhatsApp click-to-chat URL using verified business settings.
 */
export function buildWhatsAppUrl(input: BuildWhatsAppUrlInput = {}): string {
  const targetNumber = normalizeWhatsAppNumber(input.whatsappNumber);

  let text = cleanField(input.message);
  if (!text) {
    const ctx = input as {
      intent?: WhatsAppEnquiryIntent;
    } & WhatsAppEnquiryContext;

    if (ctx.intent === "product" || (!ctx.intent && cleanField(ctx.productName))) {
      text = buildProductWhatsAppMessage(ctx);
    } else if (ctx.intent === "gallery" || (!ctx.intent && cleanField(ctx.projectName))) {
      text = buildGalleryWhatsAppMessage(ctx);
    } else if (ctx.intent === "category" || (!ctx.intent && cleanField(ctx.categoryName))) {
      text = buildCategoryWhatsAppMessage(ctx);
    } else {
      text = buildGeneralWhatsAppMessage(ctx);
    }
  }

  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(text)}`;
}
