"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu as MenuIcon, X } from "lucide-react";
import { useState } from "react";
import logo from "../assets/Logo/logo-mark.png";
import { useMenu } from "@/context/menuContext";
import type { CmsNavigationSetting, CmsSiteIdentitySetting } from "@/lib/cms/types";

const DEFAULT_DESKTOP_LINKS = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/categories" },
  { label: "Collection", href: "/products" },
  { label: "Gallery", href: "/gallery" },
  { label: "Custom Work", href: "/custom-metalwork" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
];

const DEFAULT_MOBILE_LINKS = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/categories" },
  { label: "Collection", href: "/products" },
  { label: "Gallery", href: "/gallery" },
  { label: "Custom Metalwork", href: "/custom-metalwork" },
  { label: "Services", href: "/services" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog & Guides", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar({
  navigation,
  identity,
}: {
  navigation?: CmsNavigationSetting;
  identity?: CmsSiteIdentitySetting;
}) {
  const { menu, toggleMenu, closeMenu } = useMenu();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const brandTitle = identity?.brandTitle || "AFSHA";
  const brandSubtitle = identity?.brandSubtitle || "CREATIVE SOLUTION";
  const desktopLinks = navigation?.desktopLinks?.length
    ? navigation.desktopLinks
    : DEFAULT_DESKTOP_LINKS;
  const mobileLinks = navigation?.mobileLinks?.length
    ? navigation.mobileLinks
    : DEFAULT_MOBILE_LINKS;
  const contactLink = navigation?.contactLink || { label: "Contact", href: "/contact" };
  const menuButtonLabel = navigation?.menuButtonLabel || "Menu";

  function handleHamburgerClick() {
    if (menu) {
      closeMenu();
      setMobileNavOpen(false);
    } else {
      setMobileNavOpen((open) => !open);
    }
  }

  const isAnyMenuOpen = menu || mobileNavOpen;

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-white/10 bg-black/90 text-textWhite backdrop-blur-md">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6"
      >
        <Link
          href="/"
          aria-label={`${identity?.siteName || "Afsha Creative Solution"} home`}
          className="flex min-w-0 items-center"
          onClick={() => {
            closeMenu();
            setMobileNavOpen(false);
          }}
        >
          <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md sm:h-12 sm:w-12">
            <Image src={logo} fill sizes="48px" className="object-contain" alt="" priority />
          </span>
          <span className="min-w-0 px-1 text-textGold">
            <span className="block text-base font-extrabold leading-tight sm:text-lg">
              {brandTitle}
            </span>
            <span className="block whitespace-nowrap text-[9px] tracking-[0.12em] sm:text-[10px] sm:tracking-[0.16em]">
              {brandSubtitle}
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-5 text-[10px] font-medium uppercase tracking-[0.16em] md:flex lg:gap-7">
          {desktopLinks.map((link) => (
            <li key={`${link.href}-${link.label}`}>
              <Link className="transition-colors hover:text-textGold" href={link.href}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-3 text-[10px] font-medium uppercase tracking-[0.14em] sm:gap-5 sm:tracking-[0.18em]">
          <Link
            href={contactLink.href}
            className="hidden transition-colors hover:text-textGold md:inline"
          >
            {contactLink.label}
          </Link>
          <button
            type="button"
            onClick={toggleMenu}
            aria-expanded={menu}
            aria-controls="site-menu"
            className="hidden min-h-11 min-w-11 cursor-pointer touch-manipulation items-center justify-center rounded-full border border-white/20 px-4 transition-colors hover:border-textGold/60 hover:text-textGold md:inline-flex"
          >
            {menu ? "Close" : menuButtonLabel}
          </button>
          <button
            type="button"
            onClick={handleHamburgerClick}
            aria-label={isAnyMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isAnyMenuOpen}
            aria-controls="mobile-navigation-links"
            className="inline-flex min-h-11 min-w-11 cursor-pointer select-none touch-manipulation items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-textGold/60 hover:text-textGold md:hidden"
          >
            {isAnyMenuOpen ? (
              <X size={20} aria-hidden="true" />
            ) : (
              <MenuIcon size={20} aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {mobileNavOpen && !menu && (
        <div
          id="mobile-navigation-links"
          className="absolute inset-x-0 top-full z-50 border-b border-white/10 bg-[#080808]/[0.98] px-4 pb-4 shadow-2xl backdrop-blur-md md:hidden"
        >
          <nav
            aria-label="Mobile navigation"
            className="mx-auto flex max-w-7xl flex-col divide-y divide-white/10"
          >
            {mobileLinks.map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                onClick={() => setMobileNavOpen(false)}
                className="flex min-h-12 items-center text-xs uppercase tracking-[0.16em] text-white/75 hover:text-textGold"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
