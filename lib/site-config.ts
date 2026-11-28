/**
 * Centralized Production Site Configuration
 * Afsha Creative Solution — Moradabad, Uttar Pradesh, India
 *
 * CRITICAL RULE:
 * Public customer-facing links, WhatsApp share messages, Open Graph URLs,
 * canonical tags, and structured data MUST ALWAYS use the official production domain:
 * https://www.afshacreative.in
 *
 * Never generate public links using Vercel deployment URLs (*.vercel.app).
 */

export const PRODUCTION_SITE_URL = "https://www.afshacreative.in";

export const SITE_NAME = "Afsha Creative Solution";
export const SITE_LEGAL_NAME = "Afsha Creative Solutions";
export const SITE_TAGLINE = "Architectural Metalwork & Bespoke Fabrication";
export const SITE_DESCRIPTION =
  "Explore premium custom metal gates, architectural railings, and decorative metalwork by Afsha Creative Solution in Moradabad, India. Request a custom design and quote.";

export const BUSINESS_WHATSAPP_NUMBER = "919634776691";
export const BUSINESS_PHONE_DISPLAY = "+91 9634776691";
export const BUSINESS_EMAIL = "afshacreativesolutions@gmail.com";
export const BUSINESS_ADDRESS = {
  streetAddress: "Near KK Farm House Bishanpur Road, Harthala, Lodhipur",
  addressLocality: "Moradabad",
  addressRegion: "Uttar Pradesh",
  postalCode: "244001",
  addressCountry: "IN",
};

/**
 * Returns the official base site URL for public canonicals and Open Graph metadata.
 * Strips any trailing slash to ensure uniform URL concatenation.
 */
export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && !envUrl.includes("vercel.app")) {
    return envUrl.replace(/\/+$/, "");
  }
  return PRODUCTION_SITE_URL;
}

/**
 * Builds an absolute production URL for any site path.
 * Guarantees that public links point to https://www.afshacreative.in.
 */
export function absoluteUrl(path: string = "/"): string {
  const base = getSiteUrl();

  if (/^https?:\/\//i.test(path)) {
    try {
      const parsed = new URL(path);
      if (parsed.hostname.includes("vercel.app") || parsed.hostname === "afshacreative.in") {
        return `${base}${parsed.pathname}${parsed.search}`;
      }
      return path;
    } catch {
      // Fallback to normal concatenation
    }
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const normalized = cleanPath.replace(/\/+/g, "/");
  return `${base}${normalized === "/" ? "" : normalized}`;
}

/**
 * Generates canonical URL for Next.js metadata alternates.
 * Query parameters are stripped unless strictly needed.
 */
export function canonicalUrl(path: string = "/"): string {
  const abs = absoluteUrl(path);
  try {
    const parsed = new URL(abs);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return abs;
  }
}

/**
 * Builds a standardized WhatsApp Get a Quote URL.
 * Kept self-contained for zero-import compatibility with Node test scripts;
 * UI components should use lib/whatsapp.ts directly.
 */
export function buildWhatsAppQuoteUrl(params: {
  productName: string;
  designCode?: string;
  sharePath?: string;
  customMessage?: string;
  whatsappNumber?: string | null;
}): string {
  const { productName, designCode, sharePath, customMessage, whatsappNumber } = params;

  const digits = (whatsappNumber || "").replace(/\D/g, "");
  const target = digits.length === 10 ? `91${digits}` : digits || BUSINESS_WHATSAPP_NUMBER;

  let text =
    customMessage?.trim() ||
    [
      "Hello Afsha Creative Solutions!",
      `I'm interested in your ${productName}.`,
      "Could you please share:\n\n1. Available designs and customization options.\n2. Estimated pricing.\n3. Manufacturing and installation time.",
    ].join("\n\n");

  if (!customMessage && designCode) {
    text += `\n\nDesign ID: ${designCode}`;
  }

  if (!customMessage && sharePath) {
    text += `\n\nProduct details:\n${canonicalUrl(sharePath)}`;
  }

  if (!customMessage) {
    text += "\n\nPlease contact me with more details.\n\nThank you!";
  }

  return `https://wa.me/${target}?text=${encodeURIComponent(text.trim())}`;
}
