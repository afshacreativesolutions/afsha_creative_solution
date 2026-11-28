"use client";

import Image from "next/image";
import React from "react";
import logo from "../assets/Logo/logo-mark.png";
import { icons } from "@/utils/images";
import AnimatedButton from "./AnimatedButton";
import Link from "next/link";
import { useOptionalConsent } from "./consent/ConsentProvider";
import TrackedActionLink from "./lead/TrackedActionLink";
import { normalizeFooterDiscoverLinks } from "@/lib/navigation";
import type { CmsFooterSetting, CmsSiteIdentitySetting } from "@/lib/cms/types";

const PLATFORM_ICON_SRC = {
  facebook: icons.facebook.src,
  instagram: icons.instagrem.src,
  whatsapp: icons.whatsapp.src,
  youtube: icons.youtube.src,
};

const Footer = ({
  footer,
  identity,
}: {
  footer?: CmsFooterSetting;
  identity?: CmsSiteIdentitySetting;
}) => {
  const consentCtx = useOptionalConsent();
  const openSettings = consentCtx?.openSettings;

  const brandTitle = identity?.brandTitle || "AFSHA";
  const brandSubtitle = identity?.brandSubtitle || "CREATIVE SOLUTION";
  const email = identity?.email || "afshacreativesolutions@gmail.com";
  const phoneDisplay = identity?.phoneDisplay?.replace(/^\+91\s*/, "") || "9634776691";
  const phoneHref = identity?.phoneHref || "tel:+919634776691";
  const fullAddress = identity
    ? `${identity.streetAddress}, ${identity.city}, ${identity.state} ${identity.postalCode}`
    : "Near KK Farm House Bishanpur Road, Harthala, Lodhipur, Moradabad, Uttar Pradesh 244001";
  const mapsUrl =
    identity?.mapsUrl ||
    "https://maps.google.com/?cid=7804843562812692638&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAMYASAF&hl=en&gl=IN&source=embed";

  const description =
    footer?.description ||
    "Afsha Creative Solution provides custom metal fabrication in Moradabad, specializing in stair railings, balcony railings, steel & iron gates, and bespoke metalwork for homes and commercial projects.";
  const socialLinks = footer?.socialLinks?.length
    ? footer.socialLinks
    : [
        {
          platform: "facebook" as const,
          label: "Facebook",
          href: "https://www.facebook.com/tinku.saifi.71?mibextid=ZbWKwL",
        },
        {
          platform: "instagram" as const,
          label: "Instagram",
          href: "https://www.instagram.com/humdard_sahil_07?stkn=Z2k1anJlaDQ4MjF0",
        },
        {
          platform: "whatsapp" as const,
          label: "WhatsApp",
          href: "https://wa.me/919634776691?text=Hello%20Afsha%20Creative%20Solution%2C%20I%20found%20your%20website%20and%20would%20like%20to%20discuss%20a%20metal%20fabrication%20project.",
        },
        {
          platform: "youtube" as const,
          label: "YouTube",
          href: "https://wa.me/919634776691?text=Hello%20Afsha%20Creative%20Solution%2C%20I%20found%20your%20website%20and%20would%20like%20to%20discuss%20a%20metal%20fabrication%20project.",
        },
      ];
  const discoverLinks = normalizeFooterDiscoverLinks(footer?.discoverLinks);
  const localLinks = footer?.localLinks?.length
    ? footer.localLinks
    : [
        { label: "Metal Gates in Moradabad", href: "/locations/metal-gate-manufacturers-moradabad" },
        {
          label: "Iron Railings in Moradabad",
          href: "/locations/iron-railing-manufacturers-moradabad",
        },
      ];
  const bottomLinks = footer?.bottomLinks?.length
    ? footer.bottomLinks
    : [
        { label: "FAQ", href: "/faq" },
        { label: "Guides", href: "/blog" },
        { label: "Contact", href: "/contact" },
      ];

  return (
    <footer className="bg-cardGray/20 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-4">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 sm:gap-5 sm:px-6">
        <div className="grid grid-cols-1 gap-6 border-b border-white/10 py-6 sm:grid-cols-2 sm:gap-10 sm:py-8 lg:grid-cols-5">
          <div className="flex flex-col gap-5 sm:col-span-2 lg:col-span-2">
            <Link href="/">
              <div className="flex cursor-pointer items-end">
                <div className="relative h-13 w-13 overflow-hidden rounded-md text-sm">
                  <Image src={logo} height={80} className="object-left" alt="logo" />
                </div>
                <div className="px-1 tracking-[0.3em] text-textGold">
                  <p className="text-lg font-extrabold">{brandTitle}</p>
                  <p className="text-xs">{brandSubtitle}</p>
                </div>
              </div>
            </Link>

            <div className="text-sm font-extralight leading-6 tracking-[0.04em] text-textGray sm:tracking-[0.06em]">
              {description}
            </div>

            <div className="flex gap-3">
              {socialLinks.map((social, idx) => {
                const maskSrc = PLATFORM_ICON_SRC[social.platform] || icons.whatsapp.src;
                const iconEl = (
                  <div className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/10 transition duration-300 ease-in-out hover:border-textGold/30">
                    <span
                      aria-hidden="true"
                      className="block h-5 w-5 bg-current text-white transition-colors duration-300 group-hover:text-textGold"
                      style={{
                        maskImage: `url(${maskSrc})`,
                        WebkitMaskImage: `url(${maskSrc})`,
                        maskRepeat: "no-repeat",
                        WebkitMaskRepeat: "no-repeat",
                        maskSize: "contain",
                        WebkitMaskSize: "contain",
                      }}
                    />
                  </div>
                );

                if (social.platform === "whatsapp" || social.href.includes("wa.me")) {
                  return (
                    <TrackedActionLink
                      key={`${social.platform}-${idx}`}
                      href={social.href}
                      eventName="whatsapp_click"
                      trackingProps={{ placement: "footer_social", channel: "whatsapp" }}
                      target="_blank"
                      rel="noopener noreferrer"
                      ariaLabel={social.label}
                    >
                      {iconEl}
                    </TrackedActionLink>
                  );
                }

                return (
                  <Link
                    key={`${social.platform}-${idx}`}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    {iconEl}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="min-w-0">
            <div className="mb-5 text-xs font-bold tracking-[0.3em] text-textGold">
              {footer?.discoverTitle || "DISCOVER"}
            </div>
            <ul className="flex flex-col gap-2 text-sm font-extralight tracking-[0.06em]">
              {discoverLinks.map((link) => (
                <li
                  key={`${link.href}-${link.label}`}
                  className="transition duration-200 ease-in-out hover:translate-x-1 hover:text-textGold"
                >
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex min-w-0 flex-col gap-3">
            <div className="mb-2 text-xs font-bold tracking-[0.3em] text-textGold">
              {footer?.workshopTitle || "WORKSHOP"}
            </div>
            <Link href={`mailto:${email}`}>
              <div className="flex min-w-0 gap-2 break-all text-sm font-extralight tracking-[0.03em] sm:tracking-[0.06em]">
                <Image src={icons.mail} width={20} height={20} alt="Mail" />
                <div className="transition duration-300 ease-in-out hover:text-textGold">
                  {email}
                </div>
              </div>
            </Link>
            <Link href={phoneHref}>
              <div className="flex gap-2 text-sm font-extralight tracking-[0.03em] sm:tracking-[0.06em]">
                <Image src={icons.phone} width={20} height={20} alt="phone" />
                <div className="transition duration-300 ease-in-out hover:text-textGold">
                  {phoneDisplay}
                </div>
              </div>
            </Link>
            <Link href={mapsUrl} target="_blank" rel="noreferrer">
              <div className="flex items-start gap-2 text-sm font-extralight leading-6 tracking-[0.03em] sm:tracking-[0.06em]">
                <Image src={icons.location} width={20} height={20} alt="location" className="self-start" />
                <span>{fullAddress}</span>
              </div>
            </Link>
          </div>

          <div className="flex min-w-0 flex-col gap-5">
            <div className="text-xs font-bold tracking-[0.3em] text-textGold">
              {footer?.quoteTitle || "GET A QUOTE"}
            </div>
            <div className="text-sm font-extralight tracking-[0.03em] text-textGray">
              {footer?.quoteDescription ||
                "Receive architectural lookbooks, product spec sheets, and new collections."}
            </div>
            <Link
              className="block w-full max-w-[280px] sm:w-fit"
              href={footer?.quoteButtonHref || "/contact"}
              aria-label="Contact us for a quote"
            >
              <AnimatedButton
                iconColor="#CDA274"
                textColor="#CDA274"
                dotColor="#000000"
                text={footer?.quoteButtonLabel || "Get a Quote"}
              />
            </Link>
          </div>
        </div>

        {/* Local Search and Regional Links */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 text-[10px] uppercase tracking-[0.16em] text-white/40">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="text-textGold">{footer?.localLabel || "Local Fabrication:"}</span>
            {localLinks.map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className="transition hover:text-textGold"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            {bottomLinks.map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className="transition hover:text-textGold"
              >
                {link.label}
              </Link>
            ))}
            {openSettings && (
              <button
                type="button"
                onClick={openSettings}
                className="text-[10px] uppercase tracking-[0.16em] transition hover:text-textGold"
              >
                Cookie Settings
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3 py-3 text-xs font-extralight tracking-[0.04em] text-textGray sm:flex-row sm:justify-between sm:text-sm sm:tracking-[0.06em]">
          <div>{footer?.copyrightText || "© 2026 Afsha Creative Solution. All Rights Reserved."}</div>
          <div className="sm:text-right">
            {footer?.creditPrefix || "Designed & Engineered with Precision by"}{" "}
            <Link
              href={footer?.creditHref || "https://www.linkedin.com/in/linkedrealfalcon/"}
              className="font-bold text-textGold"
            >
              {footer?.creditName || "FalconDev"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
