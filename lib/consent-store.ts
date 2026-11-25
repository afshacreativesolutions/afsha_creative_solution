import {
  ConsentCategories,
  ConsentState,
  CONSENT_COOKIE_NAME,
  CURRENT_CONSENT_VERSION,
  DEFAULT_DENIED_CATEGORIES,
  VISITOR_COOKIE_NAME,
  SESSION_COOKIE_NAME,
} from "./consent-types";

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function setCookie(name: string, value: string, days: number = 365) {
  if (typeof document === "undefined") return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  const isSecure = window.location.protocol === "https:";
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax${
    isSecure ? ";Secure" : ""
  }`;
}

export function generateUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getOrCreateVisitorId(): string {
  let vid = getCookie(VISITOR_COOKIE_NAME);
  if (!vid) {
    vid = generateUUID();
    setCookie(VISITOR_COOKIE_NAME, vid, 365);
  }
  return vid;
}

export function getOrCreateSessionId(): string {
  let sid = getCookie(SESSION_COOKIE_NAME);
  if (!sid) {
    sid = generateUUID();
    // 30-minute session expiry (approx 0.021 days)
    setCookie(SESSION_COOKIE_NAME, sid, 0.021);
  }
  return sid;
}

export function readStoredConsent(): ConsentState | null {
  const cookieVal = getCookie(CONSENT_COOKIE_NAME);
  if (!cookieVal) return null;

  try {
    const parsed = JSON.parse(cookieVal) as ConsentState;
    if (parsed && parsed.categories && parsed.version === CURRENT_CONSENT_VERSION) {
      return parsed;
    }
  } catch {
    // Malformed cookie
  }
  return null;
}

export function saveConsentChoice(
  categories: ConsentCategories,
  action: ConsentState["action"]
): ConsentState {
  const visitorId = getOrCreateVisitorId();
  const state: ConsentState = {
    consentId: generateUUID(),
    visitorId,
    categories: {
      essential: true,
      analytics: Boolean(categories.analytics),
      advertising: Boolean(categories.advertising),
      personalization: Boolean(categories.personalization),
    },
    action,
    timestamp: new Date().toISOString(),
    version: CURRENT_CONSENT_VERSION,
  };

  setCookie(CONSENT_COOKIE_NAME, JSON.stringify(state), 365);
  return state;
}

export function applyGoogleConsent(categories: ConsentCategories) {
  if (typeof window === "undefined") return;

  const w = window as unknown as {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  };

  if (typeof w.gtag === "function") {
    w.gtag("consent", "update", {
      analytics_storage: categories.analytics ? "granted" : "denied",
      ad_storage: categories.advertising ? "granted" : "denied",
      ad_user_data: categories.advertising ? "granted" : "denied",
      ad_personalization: categories.advertising ? "granted" : "denied",
      personalization_storage: categories.personalization ? "granted" : "denied",
    });
  }

  if (typeof w.fbq === "function") {
    w.fbq("consent", categories.advertising ? "grant" : "revoke");
    if (categories.advertising) {
      w.fbq("track", "PageView");
    }
  }
}
