import { sanitizeRichText, sanitizeText } from "./cms/validation";

export type LeadFieldErrors = Partial<
  Record<"name" | "phone" | "category" | "city" | "email" | "message" | "photo", string>
>;

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
  const category = sanitizeText(input.category, 100);
  const hasCityField = Object.prototype.hasOwnProperty.call(input, "city");
  const cityRaw = sanitizeText(input.city, 120);
  const city = cityRaw || (!requireCity && !hasCityField ? "Moradabad" : "");

  const dimensions = sanitizeText(input.dimensions, 200);
  const material = sanitizeText(input.material, 100);
  const message = sanitizeRichText(input.message, 4000);
  const productId = sanitizeText(input.productId, 64);
  const productSlug = sanitizeText(input.productSlug, 160);
  const productName = sanitizeText(input.productName, 160);
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

  if ((requireCity || hasCityField) && city.length < 2) {
    errors.city = "Please enter your city or site location.";
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email address or leave this field blank.";
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
