import type {
  CmsFooterSetting,
  CmsNavigationSetting,
} from "@/lib/cms/types";

export type NavLinkItem = { label: string; href: string };

export const PRIMARY_NAV_LINKS: NavLinkItem[] = [
  { label: "Home", href: "/" },
  { label: "Collections", href: "/collections" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/**
 * Maps legacy /categories URLs to the consolidated /collections experience
 * while leaving product, gallery, blog, and admin URLs untouched.
 */
export function normalizePublicHref(href: string | null | undefined): string {
  const raw = (href || "").trim();
  if (!raw) return "/";

  if (raw === "/categories" || raw === "/categories/") {
    return "/collections";
  }
  if (raw.startsWith("/categories/")) {
    return raw.replace(/^\/categories\//, "/collections/");
  }
  if (raw.startsWith("/categories?")) {
    return raw.replace(/^\/categories\?/, "/collections?");
  }
  return raw;
}

/**
 * Enforces a clear Collections-first customer navigation:
 * Home, Collections, Gallery, About, Contact — preventing duplicate
 * destinations or legacy /categories items synced from CMS settings.
 */
export function getPrimaryNavigation(navigation?: CmsNavigationSetting): {
  primaryLinks: NavLinkItem[];
  mobileLinks: NavLinkItem[];
  quoteCta: NavLinkItem;
} {
  const contactHref = normalizePublicHref(navigation?.contactLink?.href || "/contact");

  const resolvedMap = new Map<string, NavLinkItem>();
  for (const link of PRIMARY_NAV_LINKS) {
    resolvedMap.set(link.href, link);
  }

  // Respect custom labels only if CMS explicitly targets one of the canonical destinations
  const allCmsLinks = [
    ...(navigation?.desktopLinks ?? []),
    ...(navigation?.mobileLinks ?? []),
    ...(navigation?.contactLink ? [navigation.contactLink] : []),
  ];

  for (const item of allCmsLinks) {
    const normalizedHref = normalizePublicHref(item.href);
    if (resolvedMap.has(normalizedHref) && item.label?.trim()) {
      // Rename legacy "Categories" or "Collection" labels to "Collections" for /collections
      const cleanLabel =
        normalizedHref === "/collections" ? "Collections" : item.label.trim();
      resolvedMap.set(normalizedHref, {
        label: cleanLabel,
        href: normalizedHref,
      });
    }
  }

  const primaryLinks = PRIMARY_NAV_LINKS.map(
    (item) => resolvedMap.get(item.href) ?? item
  );

  // Mobile drawer displays concise core destinations + optional contact href without duplication
  const mobileLinks = primaryLinks.some((l) => l.href === contactHref)
    ? primaryLinks
    : [...primaryLinks, { label: "Contact", href: contactHref }];

  return {
    primaryLinks,
    mobileLinks,
    quoteCta: { label: "Get a Quote", href: "/contact#quote-form" },
  };
}

/**
 * Normalizes footer links so legacy /categories items from CMS point cleanly to /collections
 * and no duplicate destinations are rendered in the Discover column.
 */
export function normalizeFooterDiscoverLinks(
  links?: NavLinkItem[]
): NavLinkItem[] {
  const source =
    links && links.length > 0
      ? links
      : [
          { label: "Collections", href: "/collections" },
          { label: "All Products", href: "/products" },
          { label: "Gallery", href: "/gallery" },
          { label: "Custom Metalwork", href: "/custom-metalwork" },
          { label: "Services", href: "/services" },
          { label: "FAQ", href: "/faq" },
          { label: "Blog & Guides", href: "/blog" },
        ];

  const seen = new Set<string>();
  const normalized: NavLinkItem[] = [];

  for (const link of source) {
    const href = normalizePublicHref(link.href);
    if (seen.has(href)) continue;
    seen.add(href);
    normalized.push({
      href,
      label:
        href === "/collections" && /^categories$/i.test(link.label.trim())
          ? "Collections"
          : link.label,
    });
  }

  return normalized;
}

export function normalizeFooterSettings(footer?: CmsFooterSetting): CmsFooterSetting | undefined {
  if (!footer) return footer;
  return {
    ...footer,
    discoverLinks: normalizeFooterDiscoverLinks(footer.discoverLinks),
  };
}
