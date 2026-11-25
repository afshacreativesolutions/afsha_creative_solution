import { readStoredConsent, getOrCreateVisitorId, getOrCreateSessionId } from "./consent-store";

export type AllowedEventName =
  | "page_view"
  | "session_start"
  | "quote_form_submit"
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
  "contact_form_submit",
  "whatsapp_click",
  "phone_click",
  "product_view",
  "category_view",
  "gallery_filter",
  "custom_metalwork_inquiry",
]);

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

  const payload = {
    visitorId,
    sessionId,
    eventName,
    pageUrl: window.location.href,
    pageTitle: document.title,
    referrer: document.referrer || null,
    properties,
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
      ...properties,
      page_location: window.location.href,
      page_title: document.title,
    });
  }

  if (w.dataLayer && Array.isArray(w.dataLayer)) {
    w.dataLayer.push({
      event: eventName,
      ...properties,
      page_location: window.location.href,
      page_title: document.title,
    });
  }

  // 2. Meta Pixel event bridge (if advertising consent granted)
  if (typeof w.fbq === "function" && consent?.categories.advertising) {
    if (eventName === "quote_form_submit" || eventName === "contact_form_submit") {
      w.fbq("track", "Lead", properties);
    } else if (eventName === "product_view") {
      w.fbq("track", "ViewContent", properties);
    } else if (eventName === "page_view") {
      w.fbq("track", "PageView");
    } else if (eventName === "whatsapp_click" || eventName === "phone_click") {
      w.fbq("track", "Contact", properties);
    } else {
      w.fbq("trackCustom", eventName, properties);
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
