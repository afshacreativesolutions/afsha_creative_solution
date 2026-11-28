"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import OpenQuoteButton from "@/components/lead/OpenQuoteButton";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { getPrimaryNavigation } from "@/lib/navigation";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { images } from "@/utils/images";
import type { CmsNavigationSetting, CmsSiteIdentitySetting } from "@/lib/cms/types";

function isActiveRoute(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/collections") {
    return (
      pathname === "/collections" ||
      pathname.startsWith("/collections/") ||
      pathname.startsWith("/products")
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar({
  navigation,
  identity,
}: {
  navigation?: CmsNavigationSetting;
  identity?: CmsSiteIdentitySetting;
}) {
  const pathname = usePathname() || "/";
  const [openPath, setOpenPath] = useState<string | null>(null);
  const drawerOpen = openPath === pathname;

  const logoSrc = images.logo.MarkLogo;
  const brandTitle = identity?.brandTitle || "AFSHA";
  const brandSubtitle = identity?.brandSubtitle || "CREATIVE SOLUTION";
  const whatsappHref = buildWhatsAppUrl({
    intent: "general",
    whatsappNumber: identity?.whatsappNumber,
  });

  const { primaryLinks, mobileLinks, quoteCta } = getPrimaryNavigation(navigation);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenPath(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.08] bg-[#080808]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-[72px] sm:px-6">
        {/* Brand Identity */}
        <Link
          href="/"
          className="flex min-h-11 shrink-0 items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-textGold"
        >
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md sm:h-11 sm:w-11">
            {typeof logoSrc === "string" ? (
              <Image
                src={logoSrc}
                fill
                sizes="44px"
                className="object-contain"
                alt={brandTitle}
                priority
              />
            ) : (
              <Image
                src={logoSrc}
                width={44}
                height={44}
                className="h-10 w-10 object-contain sm:h-11 sm:w-11"
                alt={brandTitle}
                priority
              />
            )}
          </div>
          <div className="leading-tight tracking-[0.2em] text-textGold sm:tracking-[0.26em]">
            <p className="text-sm font-extrabold sm:text-base">{brandTitle}</p>
            <p className="text-[8px] font-medium text-textGold/85 sm:text-[9px]">
              {brandSubtitle}
            </p>
          </div>
        </Link>

        {/* Clean Horizontal Desktop Navigation */}
        <nav aria-label="Primary navigation" className="hidden items-center gap-6 md:flex lg:gap-8">
          <ul className="flex items-center gap-6 lg:gap-8">
            {primaryLinks.map((link) => {
              const active = isActiveRoute(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative inline-flex min-h-11 items-center text-[11px] font-medium uppercase tracking-[0.16em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-textGold ${
                      active
                        ? "text-textGold"
                        : "text-white/75 hover:text-white"
                    }`}
                  >
                    {link.label}
                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-1.5 h-[1.5px] rounded-full bg-textGold"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Desktop Primary CTA & Mobile Controls */}
        <div className="flex shrink-0 items-center gap-2.5">
          <div className="hidden md:block">
            <OpenQuoteButton
              label={quoteCta.label}
              prefill={{ placement: "header_primary_cta" }}
              className="min-h-11 items-center justify-center rounded-full bg-textGold px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-black transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            />
          </div>

          <button
            type="button"
            onClick={() => setOpenPath((prev) => (prev === pathname ? null : pathname))}
            aria-label={drawerOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={drawerOpen}
            aria-controls="mobile-navigation-drawer"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white transition hover:border-textGold/60 hover:text-textGold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-textGold md:hidden"
          >
            {drawerOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Streamlined Mobile Navigation Drawer */}
      <div
        id="mobile-navigation-drawer"
        aria-hidden={!drawerOpen}
        className={`border-t border-white/10 bg-[#080808]/[0.98] backdrop-blur-xl transition-all duration-200 md:hidden ${
          drawerOpen
            ? "pointer-events-auto max-h-[calc(100dvh-4rem)] opacity-100"
            : "pointer-events-none max-h-0 overflow-hidden border-t-0 opacity-0"
        }`}
      >
        <nav aria-label="Mobile navigation" className="mx-auto max-w-7xl px-4 pb-6 pt-3">
          <ul className="divide-y divide-white/[0.08]">
            {mobileLinks.map((link) => {
              const active = isActiveRoute(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpenPath(null)}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-12 items-center justify-between py-3 text-sm font-medium uppercase tracking-[0.16em] transition-colors ${
                      active ? "text-textGold" : "text-white/80 hover:text-white"
                    }`}
                  >
                    <span>{link.label}</span>
                    {active && (
                      <span className="h-2 w-2 rounded-full bg-textGold" aria-hidden="true" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <div onClick={() => setOpenPath(null)}>
              <OpenQuoteButton
                label={quoteCta.label}
                prefill={{ placement: "mobile_drawer_cta" }}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-textGold px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-black transition hover:bg-white"
              />
            </div>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpenPath(null)}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3 text-[11px] uppercase tracking-[0.16em] text-white transition hover:border-textGold hover:text-textGold"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp Enquiry
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
