import { sanitizeRichText, sanitizeText } from "./cms/validation";

export type LeadFieldErrors = Partial<
  Record<"name" | "phone" | "category" | "city" | "email" | "message" | "photo", string>
>;

export type LeadEnquiryType = "general_quote" | "product_quote" | "product_email_quote";

export type ParsedLeadPayload = {
  name: string;
  phone: string;
  normalizedPhoneDigits: string;
  email: string;
  category: string;
  city: string;
  dimensions: string;
  material: string;
  message: string;
  enquiryType: LeadEnquiryType;
  productId: string;
  productSlug: string;
  productName: string;
  designCode: string;
  pageUrl: string;
  placement: string;
  source: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  visitorId: string | null;
  sessionId: string | null;
  clientSubmissionId: string;
  marketingEmail: boolean;
  marketingWhatsApp: boolean;
};

export const MAX_LEAD_PHOTO_BYTES = 5 * 1024 * 1024; // 5 MB

export function cleanLeadText(value: unknown, maxLength: number): string {
  return sanitizeText(value, maxLength);
}

export function normalizePhoneDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

function parseEnquiryType(raw: unknown, hasProduct: boolean): LeadEnquiryType {
  const value = sanitizeText(raw, 40);
  if (value === "product_email_quote") return "product_email_quote";
  if (value === "product_quote" || hasProduct) return "product_quote";
  return "general_quote";
}

export function validateLeadFields(input: Record<string, unknown>, requireCity = true): {
  valid: boolean;
  errors: LeadFieldErrors;
  data: ParsedLeadPayload;
} {
  const errors: LeadFieldErrors = {};

  const name = sanitizeText(input.name, 100);
  const phone = sanitizeText(input.phone, 25);
  const normalizedPhoneDigits = normalizePhoneDigits(phone);
  const email = sanitizeText(input.email, 254);
  const productId = sanitizeText(input.productId, 64);
  const productSlug = sanitizeText(input.productSlug, 160);
  const productName = sanitizeText(input.productName, 160);
  const enquiryType = parseEnquiryType(
    input.enquiryType,
    Boolean(productId || productSlug || productName)
  );
  const isEmailQuote = enquiryType === "product_email_quote";

  const category = sanitizeText(input.category, 100) || (isEmailQuote ? "custom-metalwork" : "");
  const hasCityField = Object.prototype.hasOwnProperty.call(input, "city");
  const cityRaw = sanitizeText(input.city, 120);
  const city = cityRaw || (!requireCity && !hasCityField && !isEmailQuote ? "Moradabad" : "");

  const dimensions = sanitizeText(input.dimensions, 200);
  const material = sanitizeText(input.material, 100);
  const message = sanitizeRichText(input.message, 4000);
  const designCode = sanitizeText(input.designCode, 64);
  const pageUrl = sanitizeText(input.pageUrl, 400);
  const placement = sanitizeText(input.placement, 60) || "website";
  const source = sanitizeText(input.source, 50) || "quote_form";
  const utmSource = sanitizeText(input.utmSource || input.utm_source, 120);
  const utmMedium = sanitizeText(input.utmMedium || input.utm_medium, 120);
  const utmCampaign = sanitizeText(input.utmCampaign || input.utm_campaign, 160);
  const visitorId = sanitizeText(input.visitorId, 64) || null;
  const sessionId = sanitizeText(input.sessionId, 64) || null;
  const clientSubmissionId = sanitizeText(input.clientSubmissionId, 80);
  const marketingEmail = input.marketingEmail === true || input.marketingEmail === "true";
  const marketingWhatsApp =
    input.marketingWhatsApp === true || input.marketingWhatsApp === "true";

  if (name.length < 2) {
    errors.name = "Please enter your name (at least 2 characters).";
  }

  if (normalizedPhoneDigits.length < 10 || normalizedPhoneDigits.length > 15) {
    errors.phone = "Please enter a valid 10-digit mobile / WhatsApp number.";
  }

  if (!category) {
    errors.category = "Please select the product or fabrication service.";
  }

  if (!isEmailQuote && (requireCity || hasCityField) && city.length < 2) {
    errors.city = "Please enter your city or site location.";
  }

  if (isEmailQuote && !email) {
    errors.email = "Please enter your email address so we can send your quote.";
  } else if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = isEmailQuote
      ? "Please enter a valid email address."
      : "Please enter a valid email address or leave this field blank.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    data: {
      name,
      phone,
      normalizedPhoneDigits,
      email,
      category,
      city,
      dimensions,
      material,
      message,
      enquiryType,
      productId,
      productSlug,
      productName,
      designCode,
      pageUrl,
      placement,
      source,
      utmSource,
      utmMedium,
      utmCampaign,
      visitorId,
      sessionId,
      clientSubmissionId,
      marketingEmail,
      marketingWhatsApp,
    },
  };
}
