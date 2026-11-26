export const CMS_SECTION_TYPES = [
  "hero_banner",
  "image_text",
  "card_grid",
  "services_grid",
  "product_category_grid",
  "gallery",
  "testimonials",
  "stats_counters",
  "features",
  "cta_banner",
  "faq",
  "rich_text",
  "contact_info",
  "logo_strip",
] as const;

export type CmsSectionType = (typeof CMS_SECTION_TYPES)[number];

export type CmsPageType =
  | "home"
  | "standard"
  | "landing"
  | "catalog"
  | "location"
  | "blog_index"
  | "contact"
  | "custom";

export type CmsPublishStatus = "draft" | "published";

export type CmsImageRef = {
  url: string;
  storagePath?: string;
  mediaId?: string;
  alt: string;
  width?: number;
  height?: number;
};

export type CmsButtonConfig = {
  label: string;
  href: string;
  external?: boolean;
  style?: "primary" | "secondary" | "outline" | "text";
};

export type HeroBannerContent = {
  variant: "fullscreen_video" | "page_hero" | "split_about" | "products_hero" | "contact_header";
  eyebrow?: string;
  heading: string;
  highlightText?: string;
  subtitle?: string;
  description?: string;
  alignment?: "left" | "center";
  backgroundImage?: CmsImageRef | null;
  foregroundImage?: CmsImageRef | null;
  foregroundCaptionEyebrow?: string;
  foregroundCaptionTitle?: string;
  locationBadge?: string;
  scrollAnchorLabel?: string;
  scrollAnchorHref?: string;
  videoDesktopWebm?: string;
  videoDesktopMp4?: string;
  videoMobileMp4?: string;
  videoPoster?: string;
  primaryButton?: CmsButtonConfig | null;
  secondaryButton?: CmsButtonConfig | null;
  badges?: Array<{ number?: string; label: string }>;
  breadcrumbs?: Array<{ name: string; href: string }>;
  showBreadcrumbs?: boolean;
  backLink?: CmsButtonConfig | null;
};

export type ImageTextContent = {
  variant: "video_showcase" | "location_intro" | "location_intro_cards" | "owner_spotlight" | "standard_split";
  sectionId?: string;
  eyebrow?: string;
  heading: string;
  paragraphs: string[];
  image?: CmsImageRef | null;
  imagePosition?: "left" | "right";
  imageBadgeEyebrow?: string;
  imageBadgeTitle?: string;
  videoPrimaryUrl?: string;
  videoPrimaryPoster?: string;
  videoSecondaryUrl?: string;
  videoSecondaryPoster?: string;
  stats?: Array<{ value: string; label: string }>;
  addressText?: string;
  addressHref?: string;
  cta?: CmsButtonConfig | null;
};

export type CardGridItem = {
  id?: string;
  number?: string;
  eyebrow?: string;
  title: string;
  description: string;
  image?: CmsImageRef | null;
  features?: string[];
  link?: string;
  buttonText?: string;
};

export type CardGridContent = {
  variant:
    | "numbered_collection"
    | "numbered_cards"
    | "capability_cards"
    | "location_collection"
    | "assurance_strip"
    | "standard";
  sectionId?: string;
  background?: "default" | "darker";
  eyebrow?: string;
  heading: string;
  description?: string;
  headerLink?: CmsButtonConfig | null;
  columns?: 2 | 3 | 4;
  cards: CardGridItem[];
};

export type ServiceGridItem = {
  id: string;
  eyebrow?: string;
  title: string;
  description: string;
  image?: CmsImageRef | null;
  highlights?: string[];
  primaryButton?: CmsButtonConfig | null;
  secondaryButton?: CmsButtonConfig | null;
};

export type ServicesGridContent = {
  variant?: "alternating_rows" | "compact_cards";
  sectionId?: string;
  eyebrow?: string;
  heading: string;
  description?: string;
  services: ServiceGridItem[];
};

export type CuratedCategoryCard = {
  id: string;
  name: string;
  slug: string;
  href: string;
  image?: CmsImageRef | null;
  material?: string;
  description: string;
  highlights?: string[];
  isFeatured?: boolean;
  countCategorySlug?: string;
};

export type ProductCategoryGridContent = {
  variant:
    | "featured_carousel"
    | "collection_tabs"
    | "featured_categories"
    | "all_categories_grid"
    | "full_catalog"
    | "category_portfolio";
  sectionId?: string;
  background?: "default" | "darker";
  eyebrow?: string;
  heading: string;
  description?: string;
  headerLink?: CmsButtonConfig | null;
  cta?: CmsButtonConfig | null;
  maxItems?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  categories?: CuratedCategoryCard[];
};

export type CmsGalleryItem = {
  id: string;
  title: string;
  category: string;
  categorySlug: string;
  material: string;
  description: string;
  image: CmsImageRef;
};

export type GallerySectionContent = {
  sectionId?: string;
  eyebrow?: string;
  heading?: string;
  description?: string;
  includeLiveProducts?: boolean;
  filterCategories?: Array<{ slug: string; name: string }>;
  items: CmsGalleryItem[];
};

export type TestimonialHighlightCard = {
  title: string;
  ratingCountLabel: string;
  verifiedLabel: string;
  timeAgo: string;
  quote: string;
  author: string;
  authorRole: string;
  avatarLetter: string;
  buttonLabel: string;
  buttonHref: string;
};

export type TestimonialItem = {
  id: string;
  author: string;
  role: string;
  quote: string;
  avatarLetter: string;
  avatarBgClass?: string;
  image?: CmsImageRef | null;
  imagePosition?: "top" | "bottom";
};

export type TestimonialsContent = {
  sectionId?: string;
  heading: string;
  description: string;
  cta?: CmsButtonConfig | null;
  highlightCard?: TestimonialHighlightCard | null;
  items: TestimonialItem[];
  showStats?: boolean;
  stats?: Array<{ value: string; label: string }>;
};

export type StatsCountersContent = {
  sectionId?: string;
  eyebrow?: string;
  heading?: string;
  columns?: 2 | 3 | 4 | 5;
  items: Array<{ value: string; label: string; sublabel?: string }>;
};

export type FeatureItem = {
  number: string;
  title: string;
  description: string;
  icon?: "sparkles" | "wrench" | "check" | "shield" | "hammer" | "layers";
};

export type FeaturesContent = {
  variant: "process_with_callout" | "timeline_rows" | "phase_cards" | "step_cards";
  sectionId?: string;
  background?: "default" | "darker";
  align?: "left" | "center";
  eyebrow?: string;
  heading: string;
  description?: string;
  items: FeatureItem[];
  callout?: {
    eyebrow?: string;
    text: string;
    buttonLabel: string;
    buttonHref: string;
  } | null;
};

export type CTABannerContent = {
  variant?: "standard" | "gold_glow_card" | "workshop_notice" | "split_dark_card" | "centered_help_card";
  eyebrow?: string;
  heading: string;
  description?: string;
  primaryButton?: CmsButtonConfig | null;
  secondaryButton?: CmsButtonConfig | null;
};

export type FAQSectionItem = {
  id?: string;
  category: string;
  question: string;
  answer: string;
};

export type FAQSectionContent = {
  variant: "compact_home" | "categorized_accordion" | "stacked_list";
  sectionId?: string;
  background?: "default" | "darker";
  eyebrow?: string;
  heading?: string;
  description?: string;
  link?: CmsButtonConfig | null;
  includeJsonLd?: boolean;
  categories?: Array<{ slug: string; name: string }>;
  items: FAQSectionItem[];
};

export type RichTextContent = {
  variant?: "prose" | "blog_index";
  sectionId?: string;
  eyebrow?: string;
  heading?: string;
  description?: string;
  body?: string;
  cta?: CmsButtonConfig | null;
};

export type ContactMethodItem = {
  label: string;
  value: string;
  href: string;
  icon: "whatsapp" | "phone" | "mail" | "map";
};

export type ContactInfoContent = {
  variant: "map_embed" | "contact_methods_and_form" | "workshop_coverage" | "quote_form";
  sectionId?: string;
  eyebrow?: string;
  heading?: string;
  description?: string;
  methods?: ContactMethodItem[];
  mapEmbedUrl?: string;
  mapTitle?: string;
  mapBadgeEyebrow?: string;
  mapBadgeTitle?: string;
  address?: string;
  phoneDisplay?: string;
  phoneHref?: string;
  mapLink?: CmsButtonConfig | null;
  whatsappLink?: CmsButtonConfig | null;
  coverageTitle?: string;
  coverageDescription?: string;
  coverageAreas?: string[];
  formEyebrow?: string;
  formTitle?: string;
  formSubtitle?: string;
  defaultCategory?: string;
};

export type LogoStripContent = {
  sectionId?: string;
  eyebrow?: string;
  heading?: string;
  description?: string;
  items: Array<{
    id?: string;
    name: string;
    caption?: string;
    href?: string;
    image?: CmsImageRef | null;
  }>;
};

export type CmsSectionContentMap = {
  hero_banner: HeroBannerContent;
  image_text: ImageTextContent;
  card_grid: CardGridContent;
  services_grid: ServicesGridContent;
  product_category_grid: ProductCategoryGridContent;
  gallery: GallerySectionContent;
  testimonials: TestimonialsContent;
  stats_counters: StatsCountersContent;
  features: FeaturesContent;
  cta_banner: CTABannerContent;
  faq: FAQSectionContent;
  rich_text: RichTextContent;
  contact_info: ContactInfoContent;
  logo_strip: LogoStripContent;
};

export type CmsSectionRecord<T extends CmsSectionType = CmsSectionType> = {
  id: string;
  page_id?: string;
  publication_state?: "draft" | "published";
  section_key: string;
  section_type: T;
  title: string;
  content: CmsSectionContentMap[T];
  sort_order: number;
  is_visible: boolean;
  created_at?: string;
  updated_at?: string;
};

export type CmsPageRecord = {
  id: string;
  title: string;
  slug: string;
  page_type: CmsPageType;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string[];
  canonical_url: string | null;
  og_image: string | null;
  og_image_alt: string | null;
  structured_data: Record<string, unknown> | Array<Record<string, unknown>> | null;
  status: CmsPublishStatus;
  has_unpublished_changes: boolean;
  published_at: string | null;
  created_at?: string;
  updated_at?: string;
};

export type ResolvedCmsPage = CmsPageRecord & {
  sections: CmsSectionRecord[];
  isDraftPreview?: boolean;
  source?: "cms-db" | "pre-migration-fallback";
};

export type CmsMediaRecord = {
  id: string;
  file_name: string;
  storage_bucket: string;
  storage_path: string;
  public_url: string;
  alt_text: string;
  mime_type: "image/jpeg" | "image/png" | "image/webp" | "image/avif";
  file_size: number;
  width: number | null;
  height: number | null;
  created_at: string;
  updated_at?: string;
};

export type CmsRevisionRecord = {
  id: string;
  page_id: string;
  revision_type: "draft" | "publish" | "restore" | "seed";
  revision_data: {
    title?: string;
    slug?: string;
    page_type?: CmsPageType;
    meta_title?: string | null;
    meta_description?: string | null;
    meta_keywords?: string[];
    canonical_url?: string | null;
    og_image?: string | null;
    og_image_alt?: string | null;
    structured_data?: Record<string, unknown> | Array<Record<string, unknown>> | null;
    sections?: CmsSectionRecord[];
  };
  note: string | null;
  created_at: string;
  created_by: string | null;
};

export type CmsSiteIdentitySetting = {
  siteName: string;
  siteLegalName: string;
  tagline: string;
  brandTitle: string;
  brandSubtitle: string;
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  showFloatingWhatsapp: boolean;
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  mapsUrl: string;
};

export type CmsNavigationSetting = {
  desktopLinks: Array<{ label: string; href: string }>;
  contactLink: { label: string; href: string };
  menuButtonLabel: string;
  mobileLinks: Array<{ label: string; href: string }>;
};

export type CmsMegaMenuSetting = {
  eyebrow: string;
  quoteCtaLabel: string;
  quoteCtaHref: string;
  categories: Array<{
    key: string;
    title: string;
    headline: string;
    description: string;
    buttonText: string;
    viewAllHref: string;
    cards: Array<{
      title: string;
      href: string;
      image: CmsImageRef;
    }>;
  }>;
};

export type CmsFooterSetting = {
  description: string;
  socialLinks: Array<{ platform: "facebook" | "instagram" | "whatsapp" | "youtube"; label: string; href: string }>;
  discoverTitle: string;
  discoverLinks: Array<{ label: string; href: string }>;
  workshopTitle: string;
  quoteTitle: string;
  quoteDescription: string;
  quoteButtonLabel: string;
  quoteButtonHref: string;
  localLabel: string;
  localLinks: Array<{ label: string; href: string }>;
  bottomLinks: Array<{ label: string; href: string }>;
  copyrightText: string;
  creditPrefix: string;
  creditName: string;
  creditHref: string;
};

export type CmsSeoDefaultsSetting = {
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  keywords: string[];
  ogImageAlt: string;
  areaServed: string;
  priceRange: string;
};

export type CmsTemplateDefaultsSetting = {
  categoryDetail: {
    heroEyebrow: string;
    badges: string[];
    primaryCtaLabel: string;
    primaryCtaHref: string;
    portfolioEyebrow: string;
    portfolioDescription: string;
    ctaTitlePrefix: string;
    ctaDescription: string;
  };
  productDetail: {
    backLabel: string;
    designsEyebrow: string;
    designsHeading: string;
    aboutEyebrow: string;
    aboutHeading: string;
    relatedEyebrow: string;
    relatedHeading: string;
  };
  blogDetail: {
    backLabel: string;
    ctaEyebrow: string;
    ctaHeading: string;
    ctaDescription: string;
    relatedEyebrow: string;
    relatedHeading: string;
  };
};

export type CmsSiteSettingsBundle = {
  site_identity: CmsSiteIdentitySetting;
  navigation: CmsNavigationSetting;
  mega_menu: CmsMegaMenuSetting;
  footer: CmsFooterSetting;
  seo_defaults: CmsSeoDefaultsSetting;
  template_defaults: CmsTemplateDefaultsSetting;
};
