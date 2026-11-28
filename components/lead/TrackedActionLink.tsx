"use client";

import type { ReactNode } from "react";
import { trackEvent, type AllowedEventName } from "@/lib/tracker";

type TrackedActionLinkProps = {
  href: string;
  eventName: AllowedEventName;
  trackingProps?: Record<string, string | number | boolean | null | undefined>;
  target?: string;
  rel?: string;
  className?: string;
  ariaLabel?: string;
  stopPropagation?: boolean;
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
  stopPropagation = false,
  children,
}: TrackedActionLinkProps) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
      className={className}
      onClick={(e) => {
        if (stopPropagation) {
          e.stopPropagation();
        }
        void trackEvent(eventName, trackingProps || {});
      }}
    >
      {children}
    </a>
  );
}
