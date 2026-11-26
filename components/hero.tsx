"use client";

import { useEffect, useRef, useState } from "react";
import AnimatedButton from "./AnimatedButton";
import Link from "next/link";
import type { CmsButtonConfig } from "@/lib/cms/types";

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
    <section className="relative -mt-16 h-[100svh] min-h-[620px] w-full overflow-hidden">
      <div className="absolute inset-0">
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
        <div className="absolute inset-0 z-5 bg-black/40" />

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 px-3 pt-14 sm:gap-5 sm:px-4 sm:pt-16">
          {eyebrow && (
            <div className="rounded-full bg-black/50 px-3 py-1 text-center text-[9px] font-light tracking-[0.16em] text-textGold sm:text-[11px] sm:tracking-[0.2em]">
              {eyebrow}
            </div>
          )}
          <div className="pl-[0.12em] text-5xl font-light tracking-[0.24em] text-textWhite sm:text-7xl sm:tracking-[0.32em] lg:text-8xl lg:tracking-[0.4em]">
            {heading}
          </div>
          {subtitleLines.length > 0 && (
            <div className="max-w-3xl text-center text-xs leading-6 tracking-[0.13em] text-textWhite sm:text-base sm:leading-7 sm:tracking-[0.2em] lg:text-lg">
              {subtitleLines.map((line, idx) => (
                <span key={idx}>
                  {line}
                  {idx < subtitleLines.length - 1 && <br />}
                </span>
              ))}
            </div>
          )}
          {(primaryButton || secondaryButton) && (
            <div className="mt-2 flex w-full max-w-[560px] flex-col items-center gap-2 sm:mt-5 sm:flex-row sm:justify-center sm:gap-4">
              {primaryButton && (
                <Link
                  className="flex min-h-12 w-full justify-center sm:w-auto"
                  href={primaryButton.href}
                >
                  <AnimatedButton text={primaryButton.label} />
                </Link>
              )}
              {secondaryButton && (
                <Link
                  className="flex min-h-12 w-full justify-center sm:w-auto"
                  href={secondaryButton.href}
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
