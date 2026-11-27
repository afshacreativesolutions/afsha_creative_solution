"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AnimatedButton from "./AnimatedButton";
import { useOptionalEnquiry } from "@/components/lead/EnquiryContext";
import type { CmsButtonConfig } from "@/lib/cms/types";
import { trackEvent } from "@/lib/tracker";

export type HeroProps = {
  eyebrow?: string;
  heading?: string;
  subtitle?: string;
  primaryButton?: CmsButtonConfig | null;
  secondaryButton?: CmsButtonConfig | null;
  scrollLabel?: string;
  videoDesktopWebm?: string;
  videoDesktopMp4?: string;
  videoMobileMp4?: string;
  videoPoster?: string;
};

const Hero = ({
  eyebrow = "THE ART OF CUSTOM METALWORK",
  heading = "AFSHA",
  subtitle = "BESPOKE METAL FABRICATION & ARCHITECTURAL RAILINGS\nCRAFTED FOR ELEGANCE. BUILT FOR LIFE.",
  primaryButton = { label: "Explore Collection", href: "#collection" },
  secondaryButton = { label: "Book Consultation", href: "/contact" },
  scrollLabel = "SCROLL TO EXPLORE",
  videoDesktopWebm = "/videos/hero-desktop.webm",
  videoDesktopMp4 = "/videos/hero-desktop.mp4",
  videoMobileMp4 = "/videos/hero-mobile.mp4",
  videoPoster = "/videos/hero-poster.webp",
}: HeroProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const enquiry = useOptionalEnquiry();
  const [videoConfig, setVideoConfig] = useState<{
    shouldLoad: boolean;
    isMobile: boolean;
  }>({ shouldLoad: false, isMobile: false });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const conn = (
      navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }
    ).connection;
    if (conn?.saveData || conn?.effectiveType === "slow-2g" || conn?.effectiveType === "2g") {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setVideoConfig({
        shouldLoad: true,
        isMobile: window.innerWidth < 768,
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (videoConfig.shouldLoad && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {
        // Autoplay policy or low-power mode handling
      });
    }
  }, [videoConfig.shouldLoad]);

  const subtitleLines = subtitle.split("\n").filter(Boolean);

  return (
    <section className="relative -mt-16 h-[100svh] min-h-[600px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={videoPoster}
          alt="Custom metal gates and architectural railings fabricated by Afsha Creative Solutions"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <video
          ref={videoRef}
          poster={videoPoster}
          className="absolute inset-0 z-0 h-full w-full object-cover"
          muted
          playsInline
          preload="none"
        >
          {videoConfig.shouldLoad &&
            (videoConfig.isMobile ? (
              <source src={videoMobileMp4} type="video/mp4" />
            ) : (
              <>
                <source src={videoDesktopWebm} type="video/webm" />
                <source src={videoDesktopMp4} type="video/mp4" />
              </>
            ))}
        </video>
        <div className="absolute inset-0 z-5 bg-gradient-to-b from-black/55 via-black/45 to-black/75" />

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 px-4 pt-16 sm:gap-5">
          {eyebrow && (
            <div className="rounded-full border border-textGold/25 bg-black/60 px-3.5 py-1 text-center text-[9px] font-light tracking-[0.14em] text-textGold backdrop-blur-sm sm:text-[11px] sm:tracking-[0.2em]">
              {eyebrow}
            </div>
          )}
          <div className="max-w-full pl-[0.1em] text-center text-4xl font-light tracking-[0.2em] text-textWhite sm:text-7xl sm:tracking-[0.32em] lg:text-8xl lg:tracking-[0.4em]">
            {heading}
          </div>
          {subtitleLines.length > 0 && (
            <div className="max-w-3xl text-center text-xs leading-6 tracking-[0.08em] text-textWhite/90 sm:text-base sm:leading-7 sm:tracking-[0.18em] lg:text-lg">
              {subtitleLines.map((line, idx) => (
                <span key={idx}>
                  {line}
                  {idx < subtitleLines.length - 1 && <br />}
                </span>
              ))}
            </div>
          )}
          {(primaryButton || secondaryButton) && (
            <div className="mt-2 flex w-full max-w-[560px] flex-col items-center gap-2.5 sm:mt-5 sm:flex-row sm:justify-center sm:gap-4">
              {primaryButton &&
                (primaryButton.href === "#quote-modal" && enquiry ? (
                  <button
                    type="button"
                    onClick={() => {
                      void trackEvent("quote_cta_click", {
                        placement: "homepage_hero",
                        categorySlug: "gates",
                      });
                      enquiry.openEnquiryModal({
                        title: "Get a Free Metalwork Quote",
                        placement: "homepage_hero",
                        categorySlug: "gates",
                      });
                    }}
                    className="flex min-h-12 w-full justify-center sm:w-auto"
                  >
                    <AnimatedButton text={primaryButton.label} />
                  </button>
                ) : (
                  <Link
                    className="flex min-h-12 w-full justify-center sm:w-auto"
                    href={primaryButton.href}
                    target={primaryButton.href.startsWith("http") ? "_blank" : undefined}
                    rel={primaryButton.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    <AnimatedButton text={primaryButton.label} />
                  </Link>
                ))}
              {secondaryButton && (
                <Link
                  className="flex min-h-12 w-full justify-center sm:w-auto"
                  href={secondaryButton.href}
                  target={secondaryButton.href.startsWith("http") ? "_blank" : undefined}
                  rel={secondaryButton.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  onClick={() => {
                    if (secondaryButton.href.includes("wa.me")) {
                      void trackEvent("whatsapp_click", { placement: "homepage_hero" });
                    } else if (secondaryButton.href.startsWith("tel:")) {
                      void trackEvent("phone_click", { placement: "homepage_hero" });
                    } else {
                      void trackEvent("quote_cta_click", { placement: "homepage_hero_secondary" });
                    }
                  }}
                >
                  <AnimatedButton
                    iconColor="#CDA274"
                    textColor="#CDA274"
                    dotColor="#000000"
                    text={secondaryButton.label}
                  />
                </Link>
              )}
            </div>
          )}

          {scrollLabel && (
            <div className="mt-5 flex flex-col items-center justify-center gap-2 sm:mt-16 sm:gap-3">
              <div className="text-[9px] font-extralight tracking-[0.2em] text-textGray">
                {scrollLabel}
              </div>

              <div className="relative flex h-10 w-px justify-center bg-gradient-to-b from-textGray to-transparent">
                <div className="gold-stick h-6 w-px" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
