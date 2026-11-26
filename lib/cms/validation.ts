import {
  CMS_SECTION_TYPES,
  type CmsButtonConfig,
  type CmsImageRef,
  type CmsPageType,
  type CmsSectionContentMap,
  type CmsSectionType,
} from "./types";

const RESERVED_SLUGS = new Set([
  "/admin",
  "/api",
  "/login",
  "/robots.txt",
  "/sitemap.xml",
  "/opengraph-image",
  "/favicon.ico",
]);

const RESERVED_PREFIXES = ["/admin/", "/api/", "/_next/"];

export function sanitizeText(value: unknown, maxLength = 500): string {
  if (typeof value !== "string") return "";
  // Strip control chars plus any embedded scripts/styles/HTML tags & dangerous URI schemes
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<\/?[a-zA-Z][^>]*>/g, "")
    .replace(/javascript\s*:/gi, "")
    .replace(/vbscript\s*:/gi, "")
    .trim()
    .slice(0, maxLength);
}

/**
 * Sanitizes rich text / markdown-like content so scripts, event handlers, and raw HTML tags cannot execute.
 */
export function sanitizeRichText(value: unknown, maxLength = 20000): string {
  const raw = sanitizeText(value, maxLength);
  if (!raw) return "";
  // Strip all HTML tags and javascript:/data: protocols from user-authored rich text
  return raw
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/javascript\s*:/gi, "")
    .replace(/vbscript\s*:/gi, "")
    .replace(/data\s*:text\/html/gi, "");
}

export function sanitizeUrl(value: unknown, fallback = ""): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim().slice(0, 2000);
  if (!trimmed) return fallback;
  if (trimmed.startsWith("/") || trimmed.startsWith("#") || trimmed.startsWith("asset:")) {
    if (trimmed.startsWith("//")) return fallback;
    return trimmed;
  }
  try {
    const parsed = new URL(trimmed);
    if (
      parsed.protocol === "https:" ||
      parsed.protocol === "http:" ||
      parsed.protocol === "mailto:" ||
      parsed.protocol === "tel:"
    ) {
      return trimmed;
    }
  } catch {
    return fallback;
  }
  return fallback;
}

export function normalizeSlug(raw: string): string {
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed || trimmed === "/") return "/";
  const cleaned = trimmed
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .map((seg) =>
      seg
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
    )
    .filter(Boolean)
    .join("/");
  return cleaned ? `/${cleaned}` : "/";
}

export function validatePageMeta(input: {
  title?: unknown;
  slug?: unknown;
  page_type?: unknown;
  meta_title?: unknown;
  meta_description?: unknown;
  meta_keywords?: unknown;
  canonical_url?: unknown;
  og_image?: unknown;
  og_image_alt?: unknown;
  structured_data?: unknown;
}) {
  const errors: string[] = [];
  const title = sanitizeText(input.title, 160);
  if (!title) errors.push("Page title is required.");

  const rawSlug = typeof input.slug === "string" ? input.slug : "";
  const slug = normalizeSlug(rawSlug);
  if (slug !== "/" && !/^\/[a-z0-9]+(?:[/-][a-z0-9]+)*$/.test(slug)) {
    errors.push("URL slug must use lowercase letters, numbers, hyphens, and slashes.");
  }
  if (RESERVED_SLUGS.has(slug) || RESERVED_PREFIXES.some((prefix) => slug.startsWith(prefix))) {
    errors.push(`The slug "${slug}" is reserved by the application.`);
  }

  const allowedTypes: CmsPageType[] = [
    "home",
    "standard",
    "landing",
    "catalog",
    "location",
    "blog_index",
    "contact",
    "custom",
  ];
  const page_type = allowedTypes.includes(input.page_type as CmsPageType)
    ? (input.page_type as CmsPageType)
    : "custom";

  const meta_title = sanitizeText(input.meta_title, 120) || null;
  const meta_description = sanitizeText(input.meta_description, 320) || null;
  const canonical_url = sanitizeUrl(input.canonical_url, "") || null;
  const og_image = sanitizeUrl(input.og_image, "") || null;
  const og_image_alt = sanitizeText(input.og_image_alt, 200) || null;

  const meta_keywords = Array.isArray(input.meta_keywords)
    ? input.meta_keywords.map((k) => sanitizeText(k, 80)).filter(Boolean).slice(0, 30)
    : typeof input.meta_keywords === "string"
      ? input.meta_keywords
          .split(",")
          .map((k) => sanitizeText(k, 80))
          .filter(Boolean)
          .slice(0, 30)
      : [];

  let structured_data: Record<string, unknown> | Array<Record<string, unknown>> | null = null;
  if (input.structured_data && typeof input.structured_data === "object") {
    structured_data = input.structured_data as Record<string, unknown> | Array<Record<string, unknown>>;
  }

  return {
    valid: errors.length === 0,
    errors,
    data: {
      title,
      slug,
      page_type,
      meta_title,
      meta_description,
      meta_keywords,
      canonical_url,
      og_image,
      og_image_alt,
      structured_data,
    },
  };
}

function normalizeImageRef(raw: unknown): CmsImageRef | null {
  if (!raw) return null;
  if (typeof raw === "string") {
    const url = sanitizeUrl(raw, "");
    return url ? { url, alt: "" } : null;
  }
  if (typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  const url = sanitizeUrl(obj.url, "");
  const storagePath = sanitizeText(obj.storagePath, 400) || undefined;
  if (!url && !storagePath) return null;
  return {
    url: url || "",
    storagePath,
    mediaId: sanitizeText(obj.mediaId, 64) || undefined,
    alt: sanitizeText(obj.alt, 220),
    width: typeof obj.width === "number" && obj.width > 0 ? obj.width : undefined,
    height: typeof obj.height === "number" && obj.height > 0 ? obj.height : undefined,
  };
}

function normalizeButton(raw: unknown): CmsButtonConfig | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  const label = sanitizeText(obj.label, 80);
  const href = sanitizeUrl(obj.href, "");
  if (!label || !href) return null;
  const style =
    obj.style === "primary" || obj.style === "secondary" || obj.style === "outline" || obj.style === "text"
      ? obj.style
      : undefined;
  return {
    label,
    href,
    external: Boolean(obj.external),
    style,
  };
}

function normalizeStringArray(raw: unknown, maxItems = 30, maxLen = 200): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => sanitizeText(item, maxLen)).filter(Boolean).slice(0, maxItems);
}

export function getDefaultSectionContent<T extends CmsSectionType>(
  sectionType: T
): CmsSectionContentMap[T] {
  const defaults: CmsSectionContentMap = {
    hero_banner: {
      variant: "page_hero",
      eyebrow: "Made to Measure · Moradabad, India",
      heading: "Architectural Metalwork",
      highlightText: "Crafted for Your Space",
      description:
        "Custom metal gates, architectural railings, and bespoke fabrication engineered to your exact measurements.",
      alignment: "left",
      primaryButton: { label: "Request Custom Quote", href: "/custom-metalwork" },
      secondaryButton: { label: "Explore Collection", href: "/products" },
      badges: [
        { number: "01", label: "Made to Measure" },
        { number: "02", label: "Moradabad Workshop" },
      ],
      showBreadcrumbs: true,
    },
    image_text: {
      variant: "standard_split",
      eyebrow: "Craftsmanship",
      heading: "Precision Workshop Fabrication",
      paragraphs: [
        "Every project begins with accurate site measurements and thoughtful structural planning.",
      ],
      image: null,
      imagePosition: "right",
      cta: { label: "Discuss Your Project", href: "/contact" },
    },
    card_grid: {
      variant: "standard",
      background: "default",
      eyebrow: "Highlights",
      heading: "Featured Metalwork Capabilities",
      description: "Explore how our fabrication team delivers custom architectural metalwork.",
      columns: 3,
      cards: [
        {
          number: "01",
          title: "Custom Main Gates",
          description: "Stainless steel and forged iron gates built around your entrance.",
          link: "/products?category=gates",
          buttonText: "Explore gates",
        },
      ],
    },
    services_grid: {
      variant: "alternating_rows",
      eyebrow: "What We Deliver",
      heading: "Fabrication Services",
      description: "Comprehensive metalwork engineering, fabrication, and installation.",
      services: [
        {
          id: "service-1",
          eyebrow: "Custom Fabrication",
          title: "Custom Metal Gate Fabrication",
          description: "End-to-end design and fabrication of entrance gates.",
          highlights: ["Made-to-measure sizing", "Weatherproof finish"],
          primaryButton: { label: "Explore Gates", href: "/products?category=gates" },
        },
      ],
    },
    product_category_grid: {
      variant: "featured_carousel",
      background: "default",
      eyebrow: "Our Collection",
      heading: "Featured Projects",
      description: "Live catalog items synced directly from your Products & Categories database.",
      cta: { label: "Explore Products", href: "/products" },
      maxItems: 10,
      categories: [],
    },
    gallery: {
      eyebrow: "Portfolio",
      heading: "Completed Metalwork Gallery",
      description: "Browse installations and workshop designs.",
      includeLiveProducts: true,
      filterCategories: [
        { slug: "all", name: "All Works" },
        { slug: "gates", name: "Main Gates" },
        { slug: "stair-railings", name: "Staircase Railings" },
        { slug: "balcony-railings", name: "Balcony Railings" },
        { slug: "spiral-railings", name: "Spiral Railings" },
      ],
      items: [],
    },
    testimonials: {
      heading: "CRAFTED FOR SPACES. TRUSTED BY CUSTOMERS.",
      description: "See what homeowners and architects say about working with Afsha Creative Solution.",
      cta: { label: "GET A QUOTE", href: "/contact" },
      highlightCard: null,
      items: [],
      showStats: true,
      stats: [
        { value: "80+", label: "Total Reviews" },
        { value: "400+", label: "Custom Gates" },
      ],
    },
    stats_counters: {
      eyebrow: "Track Record",
      heading: "",
      columns: 4,
      items: [
        { value: "400+", label: "Custom Gates" },
        { value: "100+", label: "Custom Railings" },
        { value: "10+", label: "Years Experience" },
        { value: "99.4%", label: "On-Time Handover" },
      ],
    },
    features: {
      variant: "step_cards",
      background: "darker",
      align: "center",
      eyebrow: "Our Process",
      heading: "From Sketch to Installation",
      description: "A transparent workflow tailored to your space.",
      items: [
        {
          number: "01",
          title: "Understand Your Space",
          description: "We discuss your location, dimensions, and architectural goals.",
          icon: "sparkles",
        },
      ],
      callout: null,
    },
    cta_banner: {
      variant: "standard",
      eyebrow: "Your space, your specification",
      heading: "Ready to start your custom metalwork project?",
      description: "Share your measurements or drawings with our team in Moradabad.",
      primaryButton: { label: "Contact Us", href: "/contact" },
      secondaryButton: { label: "Request Quote", href: "/custom-metalwork" },
    },
    faq: {
      variant: "stacked_list",
      background: "default",
      eyebrow: "Questions & Answers",
      heading: "Frequently Asked Questions",
      description: "Helpful answers about materials, sizing, and fabrication.",
      includeJsonLd: true,
      items: [
        {
          category: "products",
          question: "Do you build custom-sized metal gates and railings?",
          answer: "Yes, every piece is made to measure to your site dimensions.",
        },
      ],
    },
    rich_text: {
      variant: "prose",
      eyebrow: "Details",
      heading: "About This Topic",
      description: "",
      body: "Add structured paragraphs, headings (## or ###), and bullet lists (- item) here.",
      cta: null,
    },
    contact_info: {
      variant: "quote_form",
      sectionId: "quote-section",
      eyebrow: "Bespoke Estimation",
      heading: "Request a Made-to-Measure Quote",
      description: "Share your project dimensions and requirements with our Moradabad workshop.",
      formTitle: "Request a Made-to-Measure Quote",
      formSubtitle: "Share your project dimensions, material preferences, and design vision.",
      defaultCategory: "gates",
    },
    logo_strip: {
      eyebrow: "Standards & Guarantees",
      heading: "Built with Certified Materials",
      description: "",
      items: [
        { name: "AISI 304 Stainless Steel", caption: "Rust-resistant architectural grade" },
        { name: "Solid Wrought Iron", caption: "Hand-forged heritage bar stock" },
        { name: "Zinc Epoxy Primed", caption: "Multi-stage monsoon protection" },
      ],
    },
  };

  return defaults[sectionType];
}

export function sanitizeSectionContent<T extends CmsSectionType>(
  sectionType: T,
  rawInput: unknown
): CmsSectionContentMap[T] {
  const fallback = getDefaultSectionContent(sectionType);
  const raw = (rawInput && typeof rawInput === "object" ? rawInput : {}) as Record<string, unknown>;

  switch (sectionType) {
    case "hero_banner": {
      const f = fallback as CmsSectionContentMap["hero_banner"];
      const variant = ["fullscreen_video", "page_hero", "split_about", "products_hero", "contact_header"].includes(
        String(raw.variant)
      )
        ? (raw.variant as CmsSectionContentMap["hero_banner"]["variant"])
        : f.variant;
      return {
        variant,
        eyebrow: sanitizeText(raw.eyebrow, 160),
        heading: sanitizeText(raw.heading, 200) || f.heading,
        highlightText: sanitizeText(raw.highlightText, 120) || undefined,
        subtitle: sanitizeText(raw.subtitle, 400) || undefined,
        description: sanitizeText(raw.description, 1000) || undefined,
        alignment: raw.alignment === "center" ? "center" : "left",
        backgroundImage: normalizeImageRef(raw.backgroundImage),
        foregroundImage: normalizeImageRef(raw.foregroundImage),
        foregroundCaptionEyebrow: sanitizeText(raw.foregroundCaptionEyebrow, 120) || undefined,
        foregroundCaptionTitle: sanitizeText(raw.foregroundCaptionTitle, 160) || undefined,
        locationBadge: sanitizeText(raw.locationBadge, 120) || undefined,
        scrollAnchorLabel: sanitizeText(raw.scrollAnchorLabel, 120) || undefined,
        scrollAnchorHref: sanitizeUrl(raw.scrollAnchorHref, "") || undefined,
        videoDesktopWebm: sanitizeUrl(raw.videoDesktopWebm, "") || undefined,
        videoDesktopMp4: sanitizeUrl(raw.videoDesktopMp4, "") || undefined,
        videoMobileMp4: sanitizeUrl(raw.videoMobileMp4, "") || undefined,
        videoPoster: sanitizeUrl(raw.videoPoster, "") || undefined,
        primaryButton: normalizeButton(raw.primaryButton),
        secondaryButton: normalizeButton(raw.secondaryButton),
        badges: Array.isArray(raw.badges)
          ? raw.badges
              .map((b) => {
                if (typeof b === "string") return { label: sanitizeText(b, 80) };
                if (b && typeof b === "object") {
                  const obj = b as Record<string, unknown>;
                  const label = sanitizeText(obj.label, 80);
                  if (!label) return null;
                  return { number: sanitizeText(obj.number, 20) || undefined, label };
                }
                return null;
              })
              .filter((x): x is { number?: string; label: string } => Boolean(x && x.label))
              .slice(0, 8)
          : undefined,
        breadcrumbs: Array.isArray(raw.breadcrumbs)
          ? raw.breadcrumbs
              .map((b) => {
                if (!b || typeof b !== "object") return null;
                const obj = b as Record<string, unknown>;
                const name = sanitizeText(obj.name, 80);
                const href = sanitizeUrl(obj.href, "");
                return name && href ? { name, href } : null;
              })
              .filter((x): x is { name: string; href: string } => Boolean(x))
              .slice(0, 8)
          : undefined,
        showBreadcrumbs: raw.showBreadcrumbs !== false,
        backLink: normalizeButton(raw.backLink),
      } as CmsSectionContentMap[T];
    }

    case "image_text": {
      const f = fallback as CmsSectionContentMap["image_text"];
      const variant = [
        "video_showcase",
        "location_intro",
        "location_intro_cards",
        "owner_spotlight",
        "standard_split",
      ].includes(String(raw.variant))
        ? (raw.variant as CmsSectionContentMap["image_text"]["variant"])
        : f.variant;
      const paragraphs = Array.isArray(raw.paragraphs)
        ? raw.paragraphs.map((p) => sanitizeRichText(p, 2000)).filter(Boolean).slice(0, 12)
        : typeof raw.description === "string"
          ? [sanitizeRichText(raw.description, 2000)].filter(Boolean)
          : f.paragraphs;
      return {
        variant,
        sectionId: sanitizeText(raw.sectionId, 80) || undefined,
        eyebrow: sanitizeText(raw.eyebrow, 160),
        heading: sanitizeText(raw.heading, 200) || f.heading,
        paragraphs,
        image: normalizeImageRef(raw.image),
        imagePosition: raw.imagePosition === "left" ? "left" : "right",
        imageBadgeEyebrow: sanitizeText(raw.imageBadgeEyebrow, 120) || undefined,
        imageBadgeTitle: sanitizeText(raw.imageBadgeTitle, 180) || undefined,
        videoPrimaryUrl: sanitizeUrl(raw.videoPrimaryUrl, "") || undefined,
        videoPrimaryPoster: sanitizeUrl(raw.videoPrimaryPoster, "") || undefined,
        videoSecondaryUrl: sanitizeUrl(raw.videoSecondaryUrl, "") || undefined,
        videoSecondaryPoster: sanitizeUrl(raw.videoSecondaryPoster, "") || undefined,
        stats: Array.isArray(raw.stats)
          ? raw.stats
              .map((s) => {
                if (!s || typeof s !== "object") return null;
                const obj = s as Record<string, unknown>;
                const value = sanitizeText(obj.value, 60);
                const label = sanitizeText(obj.label, 120);
                return value && label ? { value, label } : null;
              })
              .filter((x): x is { value: string; label: string } => Boolean(x))
              .slice(0, 6)
          : undefined,
        addressText: sanitizeText(raw.addressText, 240) || undefined,
        addressHref: sanitizeUrl(raw.addressHref, "") || undefined,
        cta: normalizeButton(raw.cta),
      } as CmsSectionContentMap[T];
    }

    case "card_grid": {
      const f = fallback as CmsSectionContentMap["card_grid"];
      const variant = [
        "numbered_collection",
        "numbered_cards",
        "capability_cards",
        "location_collection",
        "assurance_strip",
        "standard",
      ].includes(String(raw.variant))
        ? (raw.variant as CmsSectionContentMap["card_grid"]["variant"])
        : f.variant;
      const columns = raw.columns === 2 || raw.columns === 4 ? raw.columns : 3;
      const cards = Array.isArray(raw.cards)
        ? raw.cards
            .map((c, idx) => {
              if (!c || typeof c !== "object") return null;
              const obj = c as Record<string, unknown>;
              const title = sanitizeText(obj.title, 140);
              if (!title) return null;
              return {
                id: sanitizeText(obj.id, 80) || `card-${idx + 1}`,
                number: sanitizeText(obj.number, 20) || undefined,
                eyebrow: sanitizeText(obj.eyebrow, 120) || undefined,
                title,
                description: sanitizeRichText(obj.description, 800),
                image: normalizeImageRef(obj.image),
                features: normalizeStringArray(obj.features, 12, 160),
                link: sanitizeUrl(obj.link, "") || undefined,
                buttonText: sanitizeText(obj.buttonText, 80) || undefined,
              };
            })
            .filter((x): x is NonNullable<typeof x> => Boolean(x))
            .slice(0, 24)
        : f.cards;
      return {
        variant,
        sectionId: sanitizeText(raw.sectionId, 80) || undefined,
        background: raw.background === "darker" ? "darker" : "default",
        eyebrow: sanitizeText(raw.eyebrow, 160),
        heading: sanitizeText(raw.heading, 200) || f.heading,
        description: sanitizeRichText(raw.description, 1000) || undefined,
        headerLink: normalizeButton(raw.headerLink),
        columns,
        cards,
      } as CmsSectionContentMap[T];
    }

    case "services_grid": {
      const f = fallback as CmsSectionContentMap["services_grid"];
      const services = Array.isArray(raw.services)
        ? raw.services
            .map((s, idx) => {
              if (!s || typeof s !== "object") return null;
              const obj = s as Record<string, unknown>;
              const title = sanitizeText(obj.title, 160);
              if (!title) return null;
              return {
                id: sanitizeText(obj.id, 80) || `service-${idx + 1}`,
                eyebrow: sanitizeText(obj.eyebrow, 120),
                title,
                description: sanitizeRichText(obj.description, 1200),
                image: normalizeImageRef(obj.image),
                highlights: normalizeStringArray(obj.highlights, 12, 160),
                primaryButton: normalizeButton(obj.primaryButton),
                secondaryButton: normalizeButton(obj.secondaryButton),
              };
            })
            .filter((x): x is NonNullable<typeof x> => Boolean(x))
            .slice(0, 24)
        : f.services;
      return {
        variant: raw.variant === "compact_cards" ? "compact_cards" : "alternating_rows",
        sectionId: sanitizeText(raw.sectionId, 80) || undefined,
        eyebrow: sanitizeText(raw.eyebrow, 160),
        heading: sanitizeText(raw.heading, 200) || f.heading,
        description: sanitizeRichText(raw.description, 1000) || undefined,
        services,
      } as CmsSectionContentMap[T];
    }

    case "product_category_grid": {
      const f = fallback as CmsSectionContentMap["product_category_grid"];
      const variant = [
        "featured_carousel",
        "collection_tabs",
        "featured_categories",
        "all_categories_grid",
        "full_catalog",
        "category_portfolio",
      ].includes(String(raw.variant))
        ? (raw.variant as CmsSectionContentMap["product_category_grid"]["variant"])
        : f.variant;
      const categories = Array.isArray(raw.categories)
        ? raw.categories
            .map((c, idx) => {
              if (!c || typeof c !== "object") return null;
              const obj = c as Record<string, unknown>;
              const name = sanitizeText(obj.name, 140);
              if (!name) return null;
              return {
                id: sanitizeText(obj.id, 80) || `cat-${idx + 1}`,
                name,
                slug: sanitizeText(obj.slug, 100) || `category-${idx + 1}`,
                href: sanitizeUrl(obj.href, "/products"),
                image: normalizeImageRef(obj.image),
                material: sanitizeText(obj.material, 140),
                description: sanitizeRichText(obj.description, 600),
                highlights: normalizeStringArray(obj.highlights, 10, 140),
                isFeatured: Boolean(obj.isFeatured),
                countCategorySlug: sanitizeText(obj.countCategorySlug, 100) || undefined,
              };
            })
            .filter((x): x is NonNullable<typeof x> => Boolean(x))
            .slice(0, 24)
        : undefined;
      return {
        variant,
        sectionId: sanitizeText(raw.sectionId, 80) || undefined,
        background: raw.background === "darker" ? "darker" : "default",
        eyebrow: sanitizeText(raw.eyebrow, 160),
        heading: sanitizeText(raw.heading, 200),
        description: sanitizeRichText(raw.description, 1000) || undefined,
        headerLink: normalizeButton(raw.headerLink),
        cta: normalizeButton(raw.cta),
        maxItems: typeof raw.maxItems === "number" && raw.maxItems > 0 ? Math.min(raw.maxItems, 50) : undefined,
        emptyTitle: sanitizeText(raw.emptyTitle, 200) || undefined,
        emptyDescription: sanitizeRichText(raw.emptyDescription, 500) || undefined,
        categories,
      } as CmsSectionContentMap[T];
    }

    case "gallery": {
      const f = fallback as CmsSectionContentMap["gallery"];
      const items = Array.isArray(raw.items)
        ? raw.items
            .map((item, idx) => {
              if (!item || typeof item !== "object") return null;
              const obj = item as Record<string, unknown>;
              const title = sanitizeText(obj.title, 160);
              const image = normalizeImageRef(obj.image);
              if (!title || !image) return null;
              return {
                id: sanitizeText(obj.id, 80) || `gallery-${idx + 1}`,
                title,
                category: sanitizeText(obj.category, 80) || "Metalwork",
                categorySlug: sanitizeText(obj.categorySlug, 80) || "gates",
                material: sanitizeText(obj.material, 140) || "Made to Measure",
                description: sanitizeRichText(obj.description, 600),
                image,
              };
            })
            .filter((x): x is NonNullable<typeof x> => Boolean(x))
            .slice(0, 60)
        : f.items;
      const filterCategories = Array.isArray(raw.filterCategories)
        ? raw.filterCategories
            .map((c) => {
              if (!c || typeof c !== "object") return null;
              const obj = c as Record<string, unknown>;
              const slug = sanitizeText(obj.slug, 60);
              const name = sanitizeText(obj.name, 80);
              return slug && name ? { slug, name } : null;
            })
            .filter((x): x is { slug: string; name: string } => Boolean(x))
            .slice(0, 12)
        : f.filterCategories;
      return {
        sectionId: sanitizeText(raw.sectionId, 80) || undefined,
        eyebrow: sanitizeText(raw.eyebrow, 160),
        heading: sanitizeText(raw.heading, 200),
        description: sanitizeRichText(raw.description, 800),
        includeLiveProducts: raw.includeLiveProducts !== false,
        filterCategories,
        items,
      } as CmsSectionContentMap[T];
    }

    case "testimonials": {
      const f = fallback as CmsSectionContentMap["testimonials"];
      const rawHighlight =
        raw.highlightCard && typeof raw.highlightCard === "object"
          ? (raw.highlightCard as Record<string, unknown>)
          : null;
      const highlightCard = rawHighlight
        ? {
            title: sanitizeText(rawHighlight.title, 80) || "GOOGLE REVIEWS",
            ratingCountLabel: sanitizeText(rawHighlight.ratingCountLabel, 40) || "80+ Reviews",
            verifiedLabel: sanitizeText(rawHighlight.verifiedLabel, 40) || "Verified",
            timeAgo: sanitizeText(rawHighlight.timeAgo, 60),
            quote: sanitizeRichText(rawHighlight.quote, 800),
            author: sanitizeText(rawHighlight.author, 100),
            authorRole: sanitizeText(rawHighlight.authorRole, 80) || "Verified Client",
            avatarLetter: sanitizeText(rawHighlight.avatarLetter, 2) || "R",
            buttonLabel: sanitizeText(rawHighlight.buttonLabel, 80),
            buttonHref: sanitizeUrl(rawHighlight.buttonHref, "#"),
          }
        : null;
      const items = Array.isArray(raw.items)
        ? raw.items
            .map((t, idx) => {
              if (!t || typeof t !== "object") return null;
              const obj = t as Record<string, unknown>;
              const author = sanitizeText(obj.author, 100);
              const quote = sanitizeRichText(obj.quote, 800);
              if (!author || !quote) return null;
              return {
                id: sanitizeText(obj.id, 80) || `test-${idx + 1}`,
                author,
                role: sanitizeText(obj.role, 80) || "Verified Client",
                quote,
                avatarLetter: sanitizeText(obj.avatarLetter, 2) || author.charAt(0).toUpperCase(),
                avatarBgClass: sanitizeText(obj.avatarBgClass, 40) || "bg-amber-700",
                image: normalizeImageRef(obj.image),
                imagePosition: obj.imagePosition === "top" ? ("top" as const) : ("bottom" as const),
              };
            })
            .filter((x): x is NonNullable<typeof x> => Boolean(x))
            .slice(0, 12)
        : f.items;
      const stats = Array.isArray(raw.stats)
        ? raw.stats
            .map((s) => {
              if (!s || typeof s !== "object") return null;
              const obj = s as Record<string, unknown>;
              const value = sanitizeText(obj.value, 40);
              const label = sanitizeText(obj.label, 80);
              return value && label ? { value, label } : null;
            })
            .filter((x): x is { value: string; label: string } => Boolean(x))
            .slice(0, 8)
        : f.stats;
      return {
        sectionId: sanitizeText(raw.sectionId, 80) || undefined,
        heading: sanitizeText(raw.heading, 200) || f.heading,
        description: sanitizeRichText(raw.description, 800) || f.description,
        cta: normalizeButton(raw.cta),
        highlightCard,
        items,
        showStats: raw.showStats !== false,
        stats,
      } as CmsSectionContentMap[T];
    }

    case "stats_counters": {
      const f = fallback as CmsSectionContentMap["stats_counters"];
      const cols = [2, 3, 4, 5].includes(Number(raw.columns)) ? (Number(raw.columns) as 2 | 3 | 4 | 5) : 4;
      const items = Array.isArray(raw.items)
        ? raw.items
            .map((s) => {
              if (!s || typeof s !== "object") return null;
              const obj = s as Record<string, unknown>;
              const value = sanitizeText(obj.value, 40);
              const label = sanitizeText(obj.label, 80);
              if (!value || !label) return null;
              return { value, label, sublabel: sanitizeText(obj.sublabel, 120) || undefined };
            })
            .filter((x): x is NonNullable<typeof x> => Boolean(x))
            .slice(0, 10)
        : f.items;
      return {
        sectionId: sanitizeText(raw.sectionId, 80) || undefined,
        eyebrow: sanitizeText(raw.eyebrow, 160) || undefined,
        heading: sanitizeText(raw.heading, 200) || undefined,
        columns: cols,
        items,
      } as CmsSectionContentMap[T];
    }

    case "features": {
      const f = fallback as CmsSectionContentMap["features"];
      const variant = ["process_with_callout", "timeline_rows", "phase_cards", "step_cards"].includes(
        String(raw.variant)
      )
        ? (raw.variant as CmsSectionContentMap["features"]["variant"])
        : f.variant;
      const items = Array.isArray(raw.items)
        ? raw.items
            .map((item, idx) => {
              if (!item || typeof item !== "object") return null;
              const obj = item as Record<string, unknown>;
              const title = sanitizeText(obj.title, 160);
              if (!title) return null;
              const icon = ["sparkles", "wrench", "check", "shield", "hammer", "layers"].includes(String(obj.icon))
                ? (obj.icon as CmsSectionContentMap["features"]["items"][number]["icon"])
                : undefined;
              return {
                number: sanitizeText(obj.number, 20) || String(idx + 1).padStart(2, "0"),
                title,
                description: sanitizeRichText(obj.description, 800),
                icon,
              };
            })
            .filter((x): x is NonNullable<typeof x> => Boolean(x))
            .slice(0, 20)
        : f.items;
      const rawCallout =
        raw.callout && typeof raw.callout === "object" ? (raw.callout as Record<string, unknown>) : null;
      const callout =
        rawCallout && sanitizeText(rawCallout.text, 500)
          ? {
              eyebrow: sanitizeText(rawCallout.eyebrow, 120) || undefined,
              text: sanitizeRichText(rawCallout.text, 500),
              buttonLabel: sanitizeText(rawCallout.buttonLabel, 80) || "Contact Us",
              buttonHref: sanitizeUrl(rawCallout.buttonHref, "/contact"),
            }
          : null;
      return {
        variant,
        sectionId: sanitizeText(raw.sectionId, 80) || undefined,
        background: raw.background === "darker" ? "darker" : "default",
        align: raw.align === "center" ? "center" : "left",
        eyebrow: sanitizeText(raw.eyebrow, 160),
        heading: sanitizeText(raw.heading, 200) || f.heading,
        description: sanitizeRichText(raw.description, 1000) || undefined,
        items,
        callout,
      } as CmsSectionContentMap[T];
    }

    case "cta_banner": {
      const f = fallback as CmsSectionContentMap["cta_banner"];
      const variant = [
        "standard",
        "gold_glow_card",
        "workshop_notice",
        "split_dark_card",
        "centered_help_card",
      ].includes(String(raw.variant))
        ? (raw.variant as CmsSectionContentMap["cta_banner"]["variant"])
        : "standard";
      return {
        variant,
        eyebrow: sanitizeText(raw.eyebrow, 160),
        heading: sanitizeText(raw.heading, 220) || f.heading,
        description: sanitizeRichText(raw.description, 800) || undefined,
        primaryButton: normalizeButton(raw.primaryButton),
        secondaryButton: normalizeButton(raw.secondaryButton),
      } as CmsSectionContentMap[T];
    }

    case "faq": {
      const f = fallback as CmsSectionContentMap["faq"];
      const variant = ["compact_home", "categorized_accordion", "stacked_list"].includes(String(raw.variant))
        ? (raw.variant as CmsSectionContentMap["faq"]["variant"])
        : f.variant;
      const items = Array.isArray(raw.items)
        ? raw.items
            .map((item, idx) => {
              if (!item || typeof item !== "object") return null;
              const obj = item as Record<string, unknown>;
              const question = sanitizeText(obj.question, 300);
              const answer = sanitizeRichText(obj.answer, 2000);
              if (!question || !answer) return null;
              return {
                id: sanitizeText(obj.id, 80) || `faq-${idx + 1}`,
                category: sanitizeText(obj.category, 60) || "products",
                question,
                answer,
              };
            })
            .filter((x): x is NonNullable<typeof x> => Boolean(x))
            .slice(0, 50)
        : f.items;
      const categories = Array.isArray(raw.categories)
        ? raw.categories
            .map((c) => {
              if (!c || typeof c !== "object") return null;
              const obj = c as Record<string, unknown>;
              const slug = sanitizeText(obj.slug, 60);
              const name = sanitizeText(obj.name, 80);
              return slug && name ? { slug, name } : null;
            })
            .filter((x): x is { slug: string; name: string } => Boolean(x))
            .slice(0, 12)
        : undefined;
      return {
        variant,
        sectionId: sanitizeText(raw.sectionId, 80) || undefined,
        background: raw.background === "darker" ? "darker" : "default",
        eyebrow: sanitizeText(raw.eyebrow, 160),
        heading: sanitizeText(raw.heading, 200),
        description: sanitizeRichText(raw.description, 800) || undefined,
        link: normalizeButton(raw.link),
        includeJsonLd: raw.includeJsonLd !== false,
        categories,
        items,
      } as CmsSectionContentMap[T];
    }

    case "rich_text": {
      return {
        variant: raw.variant === "blog_index" ? "blog_index" : "prose",
        sectionId: sanitizeText(raw.sectionId, 80) || undefined,
        eyebrow: sanitizeText(raw.eyebrow, 160),
        heading: sanitizeText(raw.heading, 200),
        description: sanitizeRichText(raw.description, 800) || undefined,
        body: sanitizeRichText(raw.body, 20000),
        cta: normalizeButton(raw.cta),
      } as CmsSectionContentMap[T];
    }

    case "contact_info": {
      const f = fallback as CmsSectionContentMap["contact_info"];
      const variant = ["map_embed", "contact_methods_and_form", "workshop_coverage", "quote_form"].includes(
        String(raw.variant)
      )
        ? (raw.variant as CmsSectionContentMap["contact_info"]["variant"])
        : f.variant;
      const methods = Array.isArray(raw.methods)
        ? raw.methods
            .map((m) => {
              if (!m || typeof m !== "object") return null;
              const obj = m as Record<string, unknown>;
              const label = sanitizeText(obj.label, 80);
              const value = sanitizeText(obj.value, 200);
              const href = sanitizeUrl(obj.href, "");
              const icon = ["whatsapp", "phone", "mail", "map"].includes(String(obj.icon))
                ? (obj.icon as "whatsapp" | "phone" | "mail" | "map")
                : "phone";
              return label && value && href ? { label, value, href, icon } : null;
            })
            .filter((x): x is NonNullable<typeof x> => Boolean(x))
            .slice(0, 8)
        : undefined;
      return {
        variant,
        sectionId: sanitizeText(raw.sectionId, 80) || undefined,
        eyebrow: sanitizeText(raw.eyebrow, 160),
        heading: sanitizeText(raw.heading, 200),
        description: sanitizeRichText(raw.description, 800),
        methods,
        mapEmbedUrl: sanitizeUrl(raw.mapEmbedUrl, "") || undefined,
        mapTitle: sanitizeText(raw.mapTitle, 140) || undefined,
        mapBadgeEyebrow: sanitizeText(raw.mapBadgeEyebrow, 80) || undefined,
        mapBadgeTitle: sanitizeText(raw.mapBadgeTitle, 140) || undefined,
        address: sanitizeText(raw.address, 260) || undefined,
        phoneDisplay: sanitizeText(raw.phoneDisplay, 60) || undefined,
        phoneHref: sanitizeUrl(raw.phoneHref, "") || undefined,
        mapLink: normalizeButton(raw.mapLink),
        whatsappLink: normalizeButton(raw.whatsappLink),
        coverageTitle: sanitizeText(raw.coverageTitle, 160) || undefined,
        coverageDescription: sanitizeRichText(raw.coverageDescription, 400) || undefined,
        coverageAreas: normalizeStringArray(raw.coverageAreas, 24, 100),
        formEyebrow: sanitizeText(raw.formEyebrow, 120) || undefined,
        formTitle: sanitizeText(raw.formTitle, 160) || undefined,
        formSubtitle: sanitizeRichText(raw.formSubtitle, 500) || undefined,
        defaultCategory: sanitizeText(raw.defaultCategory, 80) || "gates",
      } as CmsSectionContentMap[T];
    }

    case "logo_strip": {
      const f = fallback as CmsSectionContentMap["logo_strip"];
      const items = Array.isArray(raw.items)
        ? raw.items
            .map((item, idx) => {
              if (!item || typeof item !== "object") return null;
              const obj = item as Record<string, unknown>;
              const name = sanitizeText(obj.name, 120);
              if (!name) return null;
              return {
                id: sanitizeText(obj.id, 80) || `logo-${idx + 1}`,
                name,
                caption: sanitizeText(obj.caption, 160) || undefined,
                href: sanitizeUrl(obj.href, "") || undefined,
                image: normalizeImageRef(obj.image),
              };
            })
            .filter((x): x is NonNullable<typeof x> => Boolean(x))
            .slice(0, 20)
        : f.items;
      return {
        sectionId: sanitizeText(raw.sectionId, 80) || undefined,
        eyebrow: sanitizeText(raw.eyebrow, 160),
        heading: sanitizeText(raw.heading, 200),
        description: sanitizeRichText(raw.description, 600) || undefined,
        items,
      } as CmsSectionContentMap[T];
    }

    default:
      return fallback;
  }
}

export function isValidSectionType(value: unknown): value is CmsSectionType {
  return typeof value === "string" && (CMS_SECTION_TYPES as readonly string[]).includes(value);
}

export function sanitizeSiteSettingsBundle<T extends Record<string, unknown>>(
  raw: unknown,
  fallback: T
): T {
  const input = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const clone = structuredClone(fallback) as Record<string, unknown>;

  const sanitizeObject = (val: unknown, base: unknown): unknown => {
    if (base === null || base === undefined) return val;
    if (typeof base === "string") {
      if (val === undefined || val === null) return base;
      const str = String(val);
      // Detect URL-like fields cautiously? Handled by keys below; generic string sanitized safely
      return sanitizeRichText(str, 4000);
    }
    if (typeof base === "boolean") {
      return typeof val === "boolean" ? val : base;
    }
    if (typeof base === "number") {
      return typeof val === "number" && Number.isFinite(val) ? val : base;
    }
    if (Array.isArray(base)) {
      const arr = Array.isArray(val) ? val : base;
      if (base.length === 0) {
        return arr.map((item) => (typeof item === "string" ? sanitizeText(item, 200) : item)).filter(Boolean);
      }
      const template = base[0];
      return arr
        .map((item) => sanitizeObject(item, template))
        .filter((item) => item !== null && item !== undefined && item !== "");
    }
    if (typeof base === "object") {
      const baseObj = base as Record<string, unknown>;
      // Handle CmsImageRef shapes explicitly
      if ("url" in baseObj && ("storagePath" in baseObj || "alt" in baseObj)) {
        return normalizeImageRef(val) ?? baseObj;
      }
      const inObj = val && typeof val === "object" ? (val as Record<string, unknown>) : {};
      const out: Record<string, unknown> = {};
      for (const key of Object.keys(baseObj)) {
        const lowerKey = key.toLowerCase();
        if (lowerKey.includes("href") || lowerKey.includes("url")) {
          out[key] = sanitizeUrl(inObj[key], String(baseObj[key] ?? "")) || String(baseObj[key] ?? "");
        } else {
          out[key] = sanitizeObject(inObj[key] !== undefined ? inObj[key] : baseObj[key], baseObj[key]);
        }
      }
      return out;
    }
    return base;
  };

  for (const key of Object.keys(clone)) {
    clone[key] = sanitizeObject(input[key], clone[key]);
  }
  return clone as T;
}
