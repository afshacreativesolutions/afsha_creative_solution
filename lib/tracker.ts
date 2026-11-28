import { readStoredConsent, getOrCreateVisitorId, getOrCreateSessionId } from "./consent-store";

export type AllowedEventName =
  | "page_view"
  | "session_start"
  | "quote_form_submit"
  | "quote_cta_click"
  | "enquiry_form_start"
  | "enquiry_form_submit"
  | "enquiry_form_success"
  | "enquiry_form_error"
  | "product_enquiry_click"
  | "product_email_quote_click"
  | "product_whatsapp_click"
  | "product_enquiry_form_start"
  | "product_enquiry_form_success"
  | "product_enquiry_form_error"
  | "category_enquiry_click"
  | "gallery_enquiry_click"
  | "contact_form_submit"
  | "whatsapp_click"
  | "phone_click"
  | "product_view"
  | "category_view"
  | "gallery_filter"
  | "custom_metalwork_inquiry";

export const ALLOWED_EVENT_NAMES = new Set<AllowedEventName>([
  "page_view",
  "session_start",
  "quote_form_submit",
  "quote_cta_click",
  "enquiry_form_start",
  "enquiry_form_submit",
  "enquiry_form_success",
  "enquiry_form_error",
  "product_enquiry_click",
  "product_email_quote_click",
  "product_whatsapp_click",
  "product_enquiry_form_start",
  "product_enquiry_form_success",
  "product_enquiry_form_error",
  "category_enquiry_click",
  "gallery_enquiry_click",
  "contact_form_submit",
  "whatsapp_click",
  "phone_click",
  "product_view",
  "category_view",
  "gallery_filter",
  "custom_metalwork_inquiry",
]);

const SENSITIVE_PROPERTY_KEYS = new Set([
  "name",
  "customer_name",
  "phone",
  "phone_number",
  "mobile",
  "whatsappnumber",
  "email",
  "message",
  "project_details",
  "enquirydetails",
  "city",
  "location",
  "customerlocation",
  "address",
  "attachment",
]);

export function sanitizeAnalyticsProperties(
  properties: Record<string, unknown> = {}
): Record<string, unknown> {
  const safe: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(properties)) {
    if (SENSITIVE_PROPERTY_KEYS.has(key.toLowerCase())) continue;
    if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") {
      safe[key] = typeof val === "string" ? val.slice(0, 120) : val;
    }
  }
  return safe;
}

export type EventPayload = {
  eventName: AllowedEventName;
  pageUrl: string;
  pageTitle?: string;
  properties?: Record<string, unknown>;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
  referrer?: string | null;
  landingPage?: string | null;
};

export function getAttributionFromUrl(): {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
} {
  if (typeof window === "undefined") {
    return { utmSource: null, utmMedium: null, utmCampaign: null, utmTerm: null, utmContent: null };
  }
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source"),
    utmMedium: params.get("utm_medium"),
    utmCampaign: params.get("utm_campaign"),
    utmTerm: params.get("utm_term"),
    utmContent: params.get("utm_content"),
  };
}

export async function trackEvent(
  eventName: AllowedEventName,
  properties: Record<string, unknown> = {}
) {
  if (typeof window === "undefined") return;

  const consent = readStoredConsent();
  // Do not track if user denied analytics
  if (consent && !consent.categories.analytics) {
    return;
  }

  const visitorId = getOrCreateVisitorId();
  const sessionId = getOrCreateSessionId();
  const attribution = getAttributionFromUrl();
  const safeProperties = sanitizeAnalyticsProperties(properties);

  const payload = {
    visitorId,
    sessionId,
    eventName,
    pageUrl: window.location.href,
    pageTitle: document.title,
    referrer: document.referrer || null,
    properties: safeProperties,
    ...attribution,
  };

  // 1. Google Analytics (gtag) & Google Tag Manager (dataLayer) bridge
  const w = window as unknown as {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  };

  if (typeof w.gtag === "function" && (!consent || consent.categories.analytics)) {
    w.gtag("event", eventName, {
      ...safeProperties,
      page_location: window.location.href,
      page_title: document.title,
    });
  } else if (w.dataLayer && Array.isArray(w.dataLayer) && (!consent || consent.categories.analytics)) {
    w.dataLayer.push({
      event: eventName,
      ...safeProperties,
      page_location: window.location.href,
      page_title: document.title,
    });
  }

  // 2. Meta Pixel event bridge (if advertising consent granted)
  if (typeof w.fbq === "function" && consent?.categories.advertising) {
    if (
      eventName === "quote_form_submit" ||
      eventName === "enquiry_form_success" ||
      eventName === "product_enquiry_form_success" ||
      eventName === "contact_form_submit"
    ) {
      w.fbq("track", "Lead", safeProperties);
    } else if (eventName === "product_view") {
      w.fbq("track", "ViewContent", safeProperties);
    } else if (eventName === "page_view") {
      w.fbq("track", "PageView");
    } else if (
      eventName === "whatsapp_click" ||
      eventName === "product_whatsapp_click" ||
      eventName === "phone_click" ||
      ((eventName === "product_enquiry_click" ||
        eventName === "category_enquiry_click" ||
        eventName === "gallery_enquiry_click") &&
        safeProperties.channel === "whatsapp")
    ) {
      w.fbq("track", "Contact", safeProperties);
    } else {
      w.fbq("trackCustom", eventName, safeProperties);
    }
  }

  // 3. First-party analytics ingestion API
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/events", blob);
    } else {
      await fetch("/api/analytics/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      });
    }
  } catch (err) {
    // Non-blocking fail-safe
    console.debug("Analytics track failed:", err);
  }
}
