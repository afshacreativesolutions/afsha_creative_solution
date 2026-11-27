"use client";

import type { ReactNode } from "react";
import { trackEvent } from "@/lib/tracker";

type TrackedActionLinkProps = {
  href: string;
  eventName: "whatsapp_click" | "phone_click";
  trackingProps?: Record<string, string | number | boolean>;
  target?: string;
  rel?: string;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
};

/**
 * Reusable client anchor that records privacy-safe CTA analytics clicks cleanly
 * without turning parent Server Components into client bundles.
 */
export default function TrackedActionLink({
  href,
  eventName,
  trackingProps,
  target,
  rel,
  className,
  ariaLabel,
  children,
}: TrackedActionLinkProps) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
      className={className}
      onClick={() => {
        void trackEvent(eventName, trackingProps || {});
      }}
    >
      {children}
    </a>
  );
}
