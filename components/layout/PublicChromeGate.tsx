"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/**
 * Renders public website chrome (navbar, mega menu, footer, sticky enquiry CTA, cookie UI)
 * only outside /admin routes so admin pages stay completely isolated without altering
 * public route paths or metadata.
 */
export default function PublicChromeGate({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";
  if (pathname.startsWith("/admin")) {
    return null;
  }
  return <>{children}</>;
}
