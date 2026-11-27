"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { FileText, MessageCircle, Phone, X } from "lucide-react";
import { useOptionalConsent } from "@/components/consent/ConsentProvider";
import { useOptionalMenu } from "@/context/menuContext";
import type { CmsSiteIdentitySetting } from "@/lib/cms/types";
import { trackEvent } from "@/lib/tracker";
import { useEnquiry } from "./EnquiryContext";

function deriveContextFromPath(pathname: string): {
  categorySlug?: string;
  label: string;
} {
  if (pathname.startsWith("/categories/")) {
    const slug = pathname.replace("/categories/", "").split("/")[0];
    const cleanName = slug.replace(/-/g, " ");
    return { categorySlug: slug, label: cleanName };
  }
  if (pathname.startsWith("/products/")) {
    const slug = pathname.replace("/products/", "").split("/")[0];
    const cleanName = slug.replace(/-/g, " ");
    return {
      categorySlug: slug.includes("gate")
        ? "gates"
        : slug.includes("balcony")
          ? "balcony-railings"
          : slug.includes("spiral")
            ? "spiral-railings"
            : slug.includes("railing") || slug.includes("stair")
              ? "stair-railings"
              : "custom-metalwork",
      label: cleanName,
    };
  }
  if (pathname.includes("iron-railing")) {
    return { categorySlug: "stair-railings", label: "iron railings" };
  }
  if (pathname.includes("metal-gate")) {
    return { categorySlug: "gates", label: "metal gates" };
  }
  if (pathname.startsWith("/gallery")) {
    return { categorySlug: "custom-metalwork", label: "a custom project from your gallery" };
  }
  return { label: "custom gates, railings, or metal fabrication" };
}

export default function MobileStickyBar({
  identity,
}: {
  identity?: CmsSiteIdentitySetting;
}) {
  const pathname = usePathname() || "/";
  const { isModalOpen, embeddedFormInView, suppressedByOverlay, openEnquiryModal } =
    useEnquiry();
  const [expanded, setExpanded] = useState(false);
  const [formInputFocused, setFormInputFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const consentCtx = useOptionalConsent();
  const isCookieBannerOpen = Boolean(consentCtx?.isBannerVisible);

  const menuCtx = useOptionalMenu();
  const isMenuOpen = Boolean(menuCtx?.menu);

  // Close speed dial when route changes
  useEffect(() => {
    setExpanded(false);
  }, [pathname]);

  // Handle ESC key and outside click to close
  useEffect(() => {
    if (!expanded) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setExpanded(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [expanded]);

  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT")
      ) {
        setFormInputFocused(true);
      }
    };
    const handleFocusOut = () => {
      setTimeout(() => {
        const active = document.activeElement;
        const stillInField =
          active &&
          (active.tagName === "INPUT" ||
            active.tagName === "TEXTAREA" ||
            active.tagName === "SELECT");
        if (!stillInField) {
          setFormInputFocused(false);
        }
      }, 120);
    };
    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);
    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const hidden =
    isModalOpen ||
    embeddedFormInView ||
    suppressedByOverlay ||
    formInputFocused ||
    isCookieBannerOpen ||
    isMenuOpen;

  const phoneHref = identity?.phoneHref || "tel:+919634776691";
  const waNumber = (identity?.whatsappNumber || "919634776691").replace(/\D/g, "");
  const routeCtx = deriveContextFromPath(pathname);
  const waText = `Hello ${
    identity?.siteLegalName || "Afsha Creative Solution"
  }, I am browsing your website (${pathname}) and would like a free quote for ${routeCtx.label}.`;
  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;

  return (
    <>
      {/* Dimmed backdrop when actions are expanded (rendered at root level outside transform containers) */}
      {expanded && (
        <div
          role="presentation"
          aria-hidden="true"
          onClick={() => setExpanded(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-200 md:hidden"
        />
      )}

      {/* Floating Action Menu: Fixed strictly to bottom-5 right-5, expanding vertically upward */}
      <div
        ref={containerRef}
        aria-hidden={hidden}
        style={{ bottom: "1.25rem", right: "1.25rem" }}
        className={`fixed bottom-5 right-5 z-50 flex flex-col items-end md:hidden ${
          hidden ? "pointer-events-none opacity-0 translate-y-10" : "opacity-100 translate-y-0"
        } transition-all duration-300`}
      >
        {/* Expanded Action Buttons (Fanning Out Vertically Upward with labels) */}
        <div
          role="menu"
          aria-orientation="vertical"
          aria-label="Quick contact and quote options"
          className={`mb-3 flex flex-col items-end gap-3 transition-all duration-200 origin-bottom-right ${
            expanded
              ? "max-h-[300px] scale-100 opacity-100 pointer-events-auto translate-y-0"
              : "max-h-0 scale-95 opacity-0 pointer-events-none translate-y-4 overflow-hidden"
          }`}
        >
          {/* Action 1: Get Quote */}
          <div className="flex items-center gap-2.5">
            <span
              id="fab-quote-label"
              className="rounded-full border border-textGold/40 bg-black/90 px-3 py-1.5 text-xs font-semibold tracking-wide text-textGold shadow-xl whitespace-nowrap"
            >
              Get Free Quote
            </span>
            <button
              type="button"
              role="menuitem"
              aria-labelledby="fab-quote-label"
              tabIndex={expanded ? 0 : -1}
              onClick={() => {
                setExpanded(false);
                void trackEvent("quote_cta_click", {
                  placement: "mobile_fab",
                  categorySlug: routeCtx.categorySlug || "general",
                });
                openEnquiryModal({
                  title: "Get a Free Metalwork Quote",
                  categorySlug: routeCtx.categorySlug,
                  placement: "mobile_fab",
                  pageUrl: pathname,
                });
              }}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-textGold bg-textGold text-black shadow-xl transition-transform hover:scale-105 active:scale-95"
            >
              <FileText size={20} className="shrink-0" />
            </button>
          </div>

          {/* Action 2: WhatsApp */}
          <div className="flex items-center gap-2.5">
            <span
              id="fab-whatsapp-label"
              className="rounded-full border border-emerald-500/40 bg-black/90 px-3 py-1.5 text-xs font-medium tracking-wide text-emerald-300 shadow-xl whitespace-nowrap"
            >
              Chat on WhatsApp
            </span>
            <a
              href={waHref}
              role="menuitem"
              aria-labelledby="fab-whatsapp-label"
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={expanded ? 0 : -1}
              onClick={() => {
                setExpanded(false);
                void trackEvent("whatsapp_click", {
                  placement: "mobile_fab",
                  categorySlug: routeCtx.categorySlug || "general",
                });
              }}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400 bg-emerald-500 text-white shadow-xl transition-transform hover:scale-105 active:scale-95"
            >
              <MessageCircle size={22} className="shrink-0" />
            </a>
          </div>

          {/* Action 3: Call Now */}
          <div className="flex items-center gap-2.5">
            <span
              id="fab-call-label"
              className="rounded-full border border-white/20 bg-black/90 px-3 py-1.5 text-xs font-medium tracking-wide text-white shadow-xl whitespace-nowrap"
            >
              Call Us Directly
            </span>
            <a
              href={phoneHref}
              role="menuitem"
              aria-labelledby="fab-call-label"
              tabIndex={expanded ? 0 : -1}
              onClick={() => {
                setExpanded(false);
                void trackEvent("phone_click", {
                  placement: "mobile_fab",
                  categorySlug: routeCtx.categorySlug || "general",
                });
              }}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-[#151515] text-textGold shadow-xl transition-transform hover:border-textGold hover:scale-105 active:scale-95"
            >
              <Phone size={19} className="shrink-0 text-textGold" />
            </a>
          </div>
        </div>

        {/* Main Floating Circular Trigger Button: Always pinned firmly at bottom-5 right-5 */}
        <button
          type="button"
          aria-expanded={expanded}
          aria-haspopup="menu"
          aria-label={expanded ? "Close quick actions menu" : "Open contact and quote options"}
          onClick={() => setExpanded((prev) => !prev)}
          className={`relative z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.85)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-textGold active:scale-95 ${
            expanded
              ? "border border-white/30 bg-[#1a1a1a] text-white rotate-90"
              : "border-2 border-textGold bg-gradient-to-tr from-[#0a0a0a] via-[#1a1814] to-[#262016] text-textGold"
          }`}
        >
          {expanded ? (
            <X size={24} className="shrink-0" />
          ) : (
            <>
              <MessageCircle size={24} className="shrink-0" />
              {/* Status indicator dot */}
              <span
                className="absolute top-1 right-1 flex h-3 w-3"
                aria-hidden="true"
              >
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-black bg-emerald-500" />
              </span>
            </>
          )}
        </button>
      </div>
    </>
  );
}
