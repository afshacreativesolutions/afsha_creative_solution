import {
  BUSINESS_EMAIL,
  BUSINESS_PHONE_DISPLAY,
  BUSINESS_WHATSAPP_NUMBER,
  SITE_DESCRIPTION,
  SITE_LEGAL_NAME,
  SITE_NAME,
  SITE_TAGLINE,
} from "@/lib/site-config";
import type {
  CmsImageRef,
  CmsPageType,
  CmsSectionContentMap,
  CmsSectionType,
  CmsSiteSettingsBundle,
} from "./types";

function img(assetKey: string, alt: string): CmsImageRef {
  return { url: assetKey, storagePath: assetKey, alt };
}

export type SeedSectionDef<T extends CmsSectionType = CmsSectionType> = {
  section_key: string;
  section_type: T;
  title: string;
  sort_order: number;
  is_visible: boolean;
  content: CmsSectionContentMap[T];
};

export type SeedPageDef = {
  title: string;
  slug: string;
  page_type: CmsPageType;
  meta_title: string;
  meta_description: string;
  meta_keywords: string[];
  canonical_url: string;
  og_image: string | null;
  og_image_alt: string | null;
  structured_data: Record<string, unknown> | Array<Record<string, unknown>> | null;
  sections: SeedSectionDef[];
};

export const DEFAULT_SITE_SETTINGS: CmsSiteSettingsBundle = {
  site_identity: {
    siteName: SITE_NAME,
    siteLegalName: SITE_LEGAL_NAME,
    tagline: SITE_TAGLINE,
    brandTitle: "AFSHA",
    brandSubtitle: "CREATIVE SOLUTION",
    whatsappNumber: BUSINESS_WHATSAPP_NUMBER,
    whatsappDefaultMessage:
      "Hello Afsha Creative Solutions!\n\nI'd like to know more about your metal fabrication services.\n\nCould you please share your available services and estimated pricing?\n\nThank you!",
    showFloatingWhatsapp: true,
    phoneDisplay: BUSINESS_PHONE_DISPLAY,
    phoneHref: "tel:+919634776691",
    email: BUSINESS_EMAIL,
    streetAddress: "Near KK Farm House Bishanpur Road, Harthala, Lodhipur",
    city: "Moradabad",
    state: "Uttar Pradesh",
    postalCode: "244001",
    country: "IN",
    mapsUrl:
      "https://maps.google.com/?cid=7804843562812692638&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAMYASAF&hl=en&gl=IN&source=embed",
  },
  navigation: {
    desktopLinks: [
      { label: "Home", href: "/" },
      { label: "Collections", href: "/collections" },
      { label: "Gallery", href: "/gallery" },
      { label: "About", href: "/about" },
    ],
    contactLink: { label: "Contact", href: "/contact" },
    menuButtonLabel: "Menu",
    mobileLinks: [
      { label: "Home", href: "/" },
      { label: "Collections", href: "/collections" },
      { label: "Gallery", href: "/gallery" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  mega_menu: {
    eyebrow: "MENU CATEGORY",
    quoteCtaLabel: "GET A CUSTOM QUOTE",
    quoteCtaHref: "/contact",
    categories: [
      {
        key: "steelRailling",
        title: "Steel Railings",
        headline: "Steel Railing Collection",
        description:
          "Premium-quality steel railings designed for strength, safety, durability, and modern elegance. Crafted to enhance every space with style and reliability.",
        buttonText: "View All Steel Railings",
        viewAllHref: "/products?category=railings&material=stainless-steel",
        cards: [
          {
            title: "STAIR",
            href: "/products?category=stair-railings&material=stainless-steel",
            image: img("asset:steel_stair_railing.ssStairRailling8", "Stainless steel stair railing"),
          },
          {
            title: "SPIRAL",
            href: "/products?category=spiral-railings&material=stainless-steel",
            image: img("asset:steel_spiral_railing.ssSpiralRailling1", "Stainless steel spiral railing"),
          },
          {
            title: "BALCONY",
            href: "/products?category=balcony-railings&material=stainless-steel",
            image: img("asset:steel_balcony_railing.ssBalconyRailling8", "Stainless steel balcony railing"),
          },
        ],
      },
      {
        key: "steelGates",
        title: "Steel Gates",
        headline: "Steel Gates Collection",
        description:
          "Strong, durable, and stylish steel gates designed for superior security, long-lasting performance, and modern elegance.",
        buttonText: "View All Steel Gates",
        viewAllHref: "/products?category=gates&material=stainless-steel",
        cards: [
          {
            title: "MAIN GATE",
            href: "/products?category=gates&material=stainless-steel",
            image: img("asset:steel_gate.ssGate4", "Stainless steel main gate"),
          },
        ],
      },
      {
        key: "ironRailling",
        title: "Iron Railings",
        headline: "Iron Railing Collection",
        description:
          "Strong, durable, and stylish iron railings crafted to provide safety, security, and elegance for every space.",
        buttonText: "View All Iron Railings",
        viewAllHref: "/products?category=railings&material=iron",
        cards: [
          {
            title: "BALCONY",
            href: "/products?category=balcony-railings&material=iron",
            image: img("asset:iron_balcony_railing.ironbrail1", "Wrought iron balcony railing"),
          },
          {
            title: "STAIR",
            href: "/products?category=stair-railings&material=iron",
            image: img("asset:iron_stair_railing.ironStairRailling4", "Wrought iron stair railing"),
          },
        ],
      },
      {
        key: "ironGates",
        title: "Iron Gates",
        headline: "Iron Gates Collection",
        description:
          "Durable and stylish iron gates designed for maximum security, strength, and elegance. Built to protect your space with lasting quality.",
        buttonText: "View All Iron Gates",
        viewAllHref: "/products?category=gates&material=iron",
        cards: [
          {
            title: "MAIN GATE",
            href: "/products?category=gates&material=iron",
            image: img("asset:iron_gates.ironGate5", "Wrought iron main gate"),
          },
          {
            title: "SECURITY GATE",
            href: "/products?category=gates&material=iron",
            image: img("asset:iron_gates.ironGate3", "Wrought iron security gate"),
          },
        ],
      },
    ],
  },
  footer: {
    description:
      "Afsha Creative Solution provides custom metal fabrication in Moradabad, specializing in stair railings, balcony railings, steel & iron gates, and bespoke metalwork for homes and commercial projects.",
    socialLinks: [
      {
        platform: "facebook",
        label: "Facebook",
        href: "https://www.facebook.com/tinku.saifi.71?mibextid=ZbWKwL",
      },
      {
        platform: "instagram",
        label: "Instagram",
        href: "https://www.instagram.com/humdard_sahil_07?stkn=Z2k1anJlaDQ4MjF0",
      },
      {
        platform: "whatsapp",
        label: "WhatsApp",
        href: "https://wa.me/919634776691?text=Hello%20Afsha%20Creative%20Solution%2C%20I%20found%20your%20website%20and%20would%20like%20to%20discuss%20a%20metal%20fabrication%20project.",
      },
      {
        platform: "youtube",
        label: "YouTube",
        href: "https://wa.me/919634776691?text=Hello%20Afsha%20Creative%20Solution%2C%20I%20found%20your%20website%20and%20would%20like%20to%20discuss%20a%20metal%20fabrication%20project.",
      },
    ],
    discoverTitle: "DISCOVER",
    discoverLinks: [
      { label: "Collections", href: "/collections" },
      { label: "All Products", href: "/products" },
      { label: "Gallery", href: "/gallery" },
      { label: "Custom Metalwork", href: "/custom-metalwork" },
      { label: "Services", href: "/services" },
      { label: "FAQ", href: "/faq" },
      { label: "Blog & Guides", href: "/blog" },
    ],
    workshopTitle: "WORKSHOP",
    quoteTitle: "GET A QUOTE",
    quoteDescription:
      "Receive architectural lookbooks, product spec sheets, and new collections.",
    quoteButtonLabel: "Get a Quote",
    quoteButtonHref: "/contact",
    localLabel: "Local Fabrication:",
    localLinks: [
      { label: "Metal Gates in Moradabad", href: "/locations/metal-gate-manufacturers-moradabad" },
      { label: "Iron Railings in Moradabad", href: "/locations/iron-railing-manufacturers-moradabad" },
    ],
    bottomLinks: [
      { label: "FAQ", href: "/faq" },
      { label: "Guides", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
    copyrightText: "© 2026 Afsha Creative Solution. All Rights Reserved.",
    creditPrefix: "Designed & Engineered with Precision by",
    creditName: "FalconDev",
    creditHref: "https://www.linkedin.com/in/linkedrealfalcon/",
  },
  seo_defaults: {
    defaultTitle: "Custom Metal Gates & Railings in Moradabad | Afsha Creative Solution",
    titleTemplate: "%s | Afsha Creative Solution",
    defaultDescription: SITE_DESCRIPTION,
    keywords: [
      "custom metal gates in Moradabad",
      "iron gates manufacturers in Moradabad",
      "steel gates manufacturers",
      "modern main gate designs",
      "custom metal fabrication",
      "architectural metalwork",
      "iron railing manufacturers",
      "stainless steel railings",
      "balcony railing designs",
      "decorative metal grills",
      "metal gate fabrication",
      "custom metal products",
    ],
    ogImageAlt: "Afsha Creative Solution — Architectural Metalwork",
    areaServed: "Moradabad, Uttar Pradesh, India",
    priceRange: "₹₹₹",
  },
  template_defaults: {
    categoryDetail: {
      heroEyebrow: "Category Collection · Moradabad, India",
      badges: [
        "Made to Measure",
        "Workshop in Moradabad",
        "Zero Standard Size Limits",
        "High-Tensile Finish",
      ],
      primaryCtaLabel: "Request Custom Quote",
      primaryCtaHref: "/custom-metalwork",
      portfolioEyebrow: "Featured Designs",
      portfolioDescription:
        "Each design can be fabricated to your exact opening dimensions, height, and preferred metal alloy.",
      ctaTitlePrefix: "Have an idea for",
      ctaDescription:
        "Share your measurements, photos, or architectural blueprints with our Moradabad fabrication experts.",
    },
    productDetail: {
      backLabel: "All products",
      designsEyebrow: "Design references",
      designsHeading: "Explore the collection",
      aboutEyebrow: "About this design",
      aboutHeading: "Product details",
      relatedEyebrow: "Keep exploring",
      relatedHeading: "Related products",
    },
    blogDetail: {
      backLabel: "Back to all articles",
      ctaEyebrow: "Custom Fabrication In Moradabad",
      ctaHeading: "Want to fabricate a design featured in this guide?",
      ctaDescription:
        "Send us your site dimensions and reference requirements. Our workshop team in Moradabad will review your specifications and provide a free design consultation.",
      relatedEyebrow: "More Knowledge",
      relatedHeading: "Related Guides & Articles",
    },
  },
};

export const SEED_CMS_PAGES: SeedPageDef[] = [
  // 1. HOME PAGE (/)
  {
    title: "Home",
    slug: "/",
    page_type: "home",
    meta_title: "Custom Metal Gates & Railings in Moradabad | Afsha Creative Solutions",
    meta_description:
      "Explore premium custom metal gates, architectural railings and decorative metalwork by Afsha Creative Solutions in Moradabad, India. Request a custom design and quote.",
    meta_keywords: DEFAULT_SITE_SETTINGS.seo_defaults.keywords,
    canonical_url: "/",
    og_image: "/opengraph-image",
    og_image_alt: "Afsha Creative Solutions — Architectural Metalwork",
    structured_data: null,
    sections: [
      {
        section_key: "home-hero",
        section_type: "hero_banner",
        title: "Home Hero Banner",
        sort_order: 0,
        is_visible: true,
        content: {
          variant: "fullscreen_video",
          eyebrow: "CUSTOM METAL GATES, RAILINGS & STEEL DOORS · MORADABAD",
          heading: "AFSHA",
          subtitle:
            "CUSTOM METAL GATES, SLIDING GATES & ARCHITECTURAL RAILINGS\nBUILT FOR SECURITY. CRAFTED FOR LIFE.",
          description:
            "Custom Metal Gates, Sliding Gates, Folding Gates, Railings & Steel Doors in Moradabad",
          videoDesktopWebm: "/videos/hero-desktop.webm",
          videoDesktopMp4: "/videos/hero-desktop.mp4",
          videoMobileMp4: "/videos/hero-mobile.mp4",
          videoPoster: "/videos/hero-poster.webp",
          primaryButton: { label: "Get a Free Quote", href: "#quote-modal" },
          secondaryButton: {
            label: "WhatsApp Us",
            href: "https://wa.me/919634776691?text=Hello%20Afsha%20Creative%20Solution%2C%20I%20would%20like%20a%20free%20quote%20for%20custom%20metal%20fabrication.",
          },
          scrollAnchorLabel: "SCROLL TO EXPLORE",
        },
      },
      {
        section_key: "home-collection-overview",
        section_type: "card_grid",
        title: "Popular Products & Fabrication Services",
        sort_order: 1,
        is_visible: true,
        content: {
          variant: "numbered_collection",
          background: "default",
          eyebrow: "Made to measure · Moradabad, India",
          heading: "Popular Metalwork Products & Services",
          description:
            "Afsha Creative Solution fabricates custom main gates, sliding gates, folding gates, steel security doors, stair & balcony railings, and decorative metal grills across Moradabad and Western UP.",
          headerLink: { label: "Explore all products", href: "/products" },
          columns: 3,
          cards: [
            {
              id: "overview-1",
              number: "01",
              title: "Main, Sliding & Folding Gates",
              description:
                "Heavy-gauge iron and 304 stainless steel entrance gates—swing, sliding, and motorized options engineered for strength and curb appeal.",
              link: "/products?category=gates",
              buttonText: "Explore gates",
            },
            {
              id: "overview-2",
              number: "02",
              title: "Stair, Balcony & Spiral Railings",
              description:
                "Precision-finished stainless steel, wrought iron, and brass-accented railings tailored to exact floor slopes and safety heights.",
              link: "/products?category=stair-railings",
              buttonText: "Explore railings",
            },
            {
              id: "overview-3",
              number: "03",
              title: "Steel Doors, Grills & Custom Work",
              description:
                "Reinforced steel safety doors, CNC laser-cut panels, window security grills, and bespoke architectural metalwork built to order.",
              link: "/custom-metalwork",
              buttonText: "View custom options",
            },
          ],
        },
      },
      {
        section_key: "home-featured-projects",
        section_type: "product_category_grid",
        title: "Featured Completed Projects",
        sort_order: 2,
        is_visible: true,
        content: {
          variant: "featured_carousel",
          sectionId: "projects",
          heading: "Featured Completed Projects",
          cta: { label: "SEE PROJECTS", href: "/products" },
          maxItems: 10,
        },
      },
      {
        section_key: "home-collections-tabs",
        section_type: "product_category_grid",
        title: "Our Collections Tabs",
        sort_order: 3,
        is_visible: true,
        content: {
          variant: "collection_tabs",
          sectionId: "collection",
          heading: "Our Collections",
        },
      },
      {
        section_key: "home-why-choose-us",
        section_type: "card_grid",
        title: "Why Choose Afsha Creative Solution",
        sort_order: 4,
        is_visible: true,
        content: {
          variant: "numbered_cards",
          background: "default",
          eyebrow: "Why homeowners & contractors trust our workshop",
          heading: "Built Strong. Finished Clean. Fitted on Time.",
          description:
            "Every gate, door, and railing is fabricated directly at our Moradabad facility using verified metal gauges and multi-stage rust protection.",
          columns: 4,
          cards: [
            {
              id: "why-1",
              number: "01",
              eyebrow: "EXACT FIT",
              title: "On-Site Measurement",
              description:
                "We take laser and physical opening measurements on-site so every gate leaf and railing post aligns without gaps.",
            },
            {
              id: "why-2",
              number: "02",
              eyebrow: "DURABLE METALS",
              title: "Genuine Heavy-Gauge",
              description:
                "We build with grade-verified 304 stainless steel, solid wrought iron, and heavy mild steel tubing for everyday security.",
            },
            {
              id: "why-3",
              number: "03",
              eyebrow: "WEATHER PROTECTION",
              title: "Rust-Resistant Finishing",
              description:
                "Deep weld grinding, zinc-rich primers, polyurethane coats, and satin hairline steel finishes built for Indian monsoons.",
            },
            {
              id: "why-4",
              number: "04",
              eyebrow: "DIRECT WORKSHOP",
              title: "Transparent Pricing & Fitting",
              description:
                "No middleman markups—work directly with our fabricators from initial quote to site delivery and clean fitting.",
            },
          ],
        },
      },
      {
        section_key: "home-fabrication-process",
        section_type: "features",
        title: "Made-to-Measure Fabrication Process",
        sort_order: 5,
        is_visible: true,
        content: {
          variant: "process_with_callout",
          background: "darker",
          eyebrow: "How our process works",
          heading: "Made-to-Measure Metal Fabrication",
          description:
            "Every project starts with your space and how you want to use it. We guide the details from measurements and material choices through fabrication and installation.",
          items: [
            {
              number: "01",
              title: "Share requirement & photo",
              description: "Send your approximate size, product choice, or site photo for a free estimate.",
            },
            {
              number: "02",
              title: "Site check & material selection",
              description: "We confirm measurements, iron/steel gauge, hinge or sliding track, and finish.",
            },
            {
              number: "03",
              title: "Precision workshop fabrication",
              description: "Crafted, welded, ground smooth, and rust-proofed at our Moradabad workshop.",
            },
            {
              number: "04",
              title: "Delivery & site installation",
              description: "Coordinated transport and sturdy installation with final alignment checks.",
            },
          ],
          callout: {
            eyebrow: "Ready to start?",
            text: "Get honest workshop advice on gate strength, motorized sliding clearance, or staircase safety—with zero obligation.",
            buttonLabel: "Request Free Quote",
            buttonHref: "#quote-section",
          },
        },
      },
      {
        section_key: "home-artisans-videos",
        section_type: "image_text",
        title: "The Artisans of Metalwork (Video Showcase)",
        sort_order: 6,
        is_visible: true,
        content: {
          variant: "video_showcase",
          eyebrow: "where skilled fabrication meets thoughtful design.",
          heading: "THE ARTISANS OF METALWORK",
          paragraphs: [
            "At Afsha Creative Solution, metalwork is built around the details. From elegant stair and balcony railings to custom steel and iron gates, our workshop creates practical, made-to-measure solutions for homes, businesses, and construction projects. Every project is shaped by hands-on fabrication, careful finishing, and real-world experience.",
          ],
          videoPrimaryUrl: "/videos/Process/process-video.mp4",
          videoPrimaryPoster: "/videos/Process/process-poster.webp",
          videoSecondaryUrl: "/videos/Products/products-video.mp4",
          videoSecondaryPoster: "/videos/Products/products-poster.webp",
          cta: { label: "GET A QUOTE", href: "#quote-section" },
        },
      },
      {
        section_key: "home-testimonials",
        section_type: "testimonials",
        title: "Customer Testimonials & Statistics",
        sort_order: 7,
        is_visible: true,
        content: {
          sectionId: "testimonials",
          heading: "CRAFTED FOR SPACES. TRUSTED BY CUSTOMERS.",
          description:
            "From first site measurement to final installation, our work is trusted by homeowners, architects, and builders across Moradabad.",
          cta: { label: "GET A QUOTE", href: "#quote-section" },
          highlightCard: null,
          items: [
            {
              id: "review-mohit",
              author: "Mohit Agarwal",
              role: "Homeowner, Civil Lines, Moradabad",
              quote:
                "“We needed a custom main gate for our house. The team understood the design we wanted and delivered a strong, well-finished gate.”",
              avatarLetter: "M",
              avatarBgClass: "bg-green-700",
              image: img("asset:iron_gates.ironGate5", "Custom wrought iron main gate"),
              imagePosition: "bottom",
            },
            {
              id: "review-rahul",
              author: "Rahul Sharma",
              role: "Homeowner, Ram Ganga Vihar, Moradabad",
              quote:
                "“The stair railing was designed exactly according to our requirement. The finishing looks clean and the overall work was handled professionally.”",
              avatarLetter: "R",
              avatarBgClass: "bg-blue-700",
              image: img(
                "asset:steel_stair_railing.ssStairRailling8",
                "Stainless steel staircase railing"
              ),
              imagePosition: "top",
            },
            {
              id: "review-amit",
              author: "Amit Verma",
              role: "Residential Project, Rampur Road",
              quote:
                "“We wanted a modern balcony railing for our new home. The design and fabrication turned out very well and matched the look of the house.”",
              avatarLetter: "A",
              avatarBgClass: "bg-red-700",
              image: img(
                "asset:steel_balcony_railing.ssBalconyRailling9",
                "Modern stainless steel balcony railing"
              ),
              imagePosition: "bottom",
            },
          ],
          showStats: true,
          stats: [
            { value: "80+", label: "Google Reviews" },
            { value: "100+", label: "Custom Railings" },
            { value: "400+", label: "Custom Gates" },
            { value: "10+", label: "Years Experience" },
            { value: "99.4%", label: "On-Time Handover" },
          ],
        },
      },
      {
        section_key: "home-service-areas",
        section_type: "contact_info",
        title: "Workshop & Service Areas",
        sort_order: 8,
        is_visible: true,
        content: {
          variant: "workshop_coverage",
          sectionId: "service-areas",
          eyebrow: "Service Areas · Direct Workshop Supply",
          heading: "Fabricating in Moradabad for Surrounding Districts",
          description:
            "Visit our fabrication unit near KK Farm House, Harthala, Moradabad or book a site measurement visit for residential, farmhouse, and commercial metalwork.",
          address:
            "Near KK Farm House Bishanpur Road, Harthala, Lodhipur, Moradabad, UP 244001",
          phoneDisplay: "+91 96347 76691",
          phoneHref: "tel:+919634776691",
          mapLink: {
            label: "Open in Google Maps",
            href: "https://maps.google.com/?cid=7804843562812692638&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAMYASAF&hl=en&gl=IN&source=embed",
          },
          whatsappLink: {
            label: "Book Site Visit on WhatsApp",
            href: "https://wa.me/919634776691?text=Hello%20Afsha%20Creative%20Solution%2C%20I%20would%20like%20to%20schedule%20a%20site%20visit%20and%20quote.",
          },
          coverageTitle: "Areas We Actively Serve",
          coverageDescription:
            "Custom gates, railings, and steel fabrication with transport and on-site installation:",
          coverageAreas: [
            "Moradabad City & Civil Lines",
            "Ram Ganga Vihar & Pakbara",
            "Rampur & Milak",
            "Sambhal & Chandausi",
            "Amroha & Gajraula",
            "Bijnor & Dhampur",
            "Kashipur & Rudrapur",
            "Bareilly & Nearby Regions",
          ],
        },
      },
      {
        section_key: "home-workshop-map",
        section_type: "contact_info",
        title: "Workshop Location Map",
        sort_order: 9,
        is_visible: true,
        content: {
          variant: "map_embed",
          mapEmbedUrl:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3493.9729783758107!2d78.72993257518772!3d28.86942177328445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390affe9f5c2d981%3A0x6c505fde58f1d89e!2sAFSHA%20CREATIVE%20SOLUTIONS!5e0!3m2!1sen!2sin!4v1791038860964!5m2!1sen!2sin",
          mapTitle: "AFSHA Creative Solution location",
          mapBadgeEyebrow: "Location",
          mapBadgeTitle: "AFSHA Creative Solution",
        },
      },
      {
        section_key: "home-faq",
        section_type: "faq",
        title: "Home FAQ Section",
        sort_order: 10,
        is_visible: true,
        content: {
          variant: "compact_home",
          eyebrow: "Helpful details",
          heading: "Frequently Asked Questions",
          description: "A few quick answers about custom metalwork, materials, and getting started.",
          link: { label: "See all questions", href: "/faq" },
          includeJsonLd: false,
          items: [
            {
              category: "products",
              question: "Do you make custom metal gates in Moradabad?",
              answer:
                "Yes. We design and fabricate gates to your required size, style, material, and finish.",
            },
            {
              category: "ordering",
              question: "Can I request a quote before finalizing a design?",
              answer:
                "Yes. Use the quick quote form below or message us on WhatsApp with rough dimensions and a reference photo for an initial estimate.",
            },
            {
              category: "products",
              question: "Do you manufacture sliding, folding, and iron/steel railings?",
              answer:
                "Yes. We fabricate sliding gates, collapsible folding gates, steel security doors, and iron/stainless steel railings for staircases and balconies.",
            },
            {
              category: "customization",
              question: "Are products available in standard sizes?",
              answer:
                "Most work is made to measure after site inspection so your gate or railing fits securely without gaps.",
            },
          ],
        },
      },
      {
        section_key: "home-final-quote",
        section_type: "contact_info",
        title: "Final Free Quote Enquiry Section",
        sort_order: 11,
        is_visible: true,
        content: {
          variant: "quote_form",
          sectionId: "quote-section",
          eyebrow: "Direct Workshop Estimate",
          heading: "Get a Free Metalwork Quote",
          description:
            "Tell us what you need—gate, door, railing, or custom fabrication—and our Moradabad workshop team will reply promptly.",
          formEyebrow: "Request a Free Estimate",
          formTitle: "Get Your Custom Gate or Railing Quote",
          formSubtitle:
            "Share your name, mobile number, product requirement, city, and an optional site photo or sketch.",
          defaultCategory: "gates",
        },
      },
    ],
  },

  // 2. ABOUT PAGE (/about)
  {
    title: "About",
    slug: "/about",
    page_type: "standard",
    meta_title: "About Afsha Creative Solution | Made-to-Measure Metalwork in Moradabad",
    meta_description:
      "Meet Afsha Creative Solution, creating made-to-measure iron and steel gates, architectural railings, and custom metalwork in Moradabad, India.",
    meta_keywords: DEFAULT_SITE_SETTINGS.seo_defaults.keywords,
    canonical_url: "/about",
    og_image: "/opengraph-image",
    og_image_alt: "About Afsha Creative Solution — Moradabad",
    structured_data: null,
    sections: [
      {
        section_key: "about-hero",
        section_type: "hero_banner",
        title: "About Hero Showcase",
        sort_order: 0,
        is_visible: true,
        content: {
          variant: "split_about",
          eyebrow: "Made to measure · Moradabad, India",
          heading: "Metalwork shaped",
          highlightText: "for your space.",
          description:
            "Afsha Creative Solution creates custom gates, railings, and architectural metalwork for homes and commercial spaces. Based in Moradabad, we bring your ideas into the details—measured, designed, and made around your project.",
          primaryButton: { label: "Start a project", href: "/contact" },
          secondaryButton: { label: "Explore our work", href: "/products" },
          backgroundImage: img("asset:steel_gate.ssGate1", "Custom steel entrance gate design"),
          foregroundImage: img(
            "asset:steel_stair_railing.ssStairRailling2",
            "Made-to-measure staircase railing"
          ),
          foregroundCaptionEyebrow: "Built around your brief",
          foregroundCaptionTitle: "Thoughtful design. Everyday strength.",
          locationBadge: "Moradabad, India",
          scrollAnchorLabel: "Discover our approach",
          scrollAnchorHref: "#our-approach",
          breadcrumbs: [
            { name: "Home", href: "/" },
            { name: "About", href: "/about" },
          ],
          showBreadcrumbs: true,
        },
      },
      {
        section_key: "about-approach",
        section_type: "card_grid",
        title: "Our Approach & Values",
        sort_order: 1,
        is_visible: true,
        content: {
          variant: "numbered_cards",
          sectionId: "our-approach",
          background: "darker",
          eyebrow: "The way we work",
          heading: "Considered from the first conversation.",
          description:
            "Good metalwork belongs in its setting. We take time to understand the space, how it will be used, and the finish you have in mind—then carry those choices through the making of the piece.",
          columns: 3,
          cards: [
            {
              id: "val-1",
              number: "01",
              eyebrow: "01 / OUR APPROACH",
              title: "Made for your space",
              description:
                "Each project begins with your dimensions, layout, and the way you plan to use it.",
            },
            {
              id: "val-2",
              number: "02",
              eyebrow: "02 / OUR APPROACH",
              title: "Designed together",
              description:
                "We talk through style, material, and finish so the details feel right for your home or project.",
            },
            {
              id: "val-3",
              number: "03",
              eyebrow: "03 / OUR APPROACH",
              title: "Crafted in Moradabad",
              description:
                "Our work brings traditional metalworking care to gates, railings, and architectural metalwork.",
            },
          ],
        },
      },
      {
        section_key: "about-process",
        section_type: "features",
        title: "Idea to Installation Timeline",
        sort_order: 2,
        is_visible: true,
        content: {
          variant: "timeline_rows",
          eyebrow: "From idea to installation",
          heading: "A clear path to your custom piece.",
          description:
            "We keep the conversation personal and the choices clear at every stage.",
          items: [
            {
              number: "01",
              title: "Tell us about your project",
              description: "Share the space, your ideas, and what the metalwork needs to do.",
            },
            {
              number: "02",
              title: "Plan the details",
              description:
                "Discuss measurements, materials, design references, and finish preferences.",
            },
            {
              number: "03",
              title: "Made to measure",
              description: "We shape and fabricate your piece around the agreed project details.",
            },
            {
              number: "04",
              title: "Bring it together",
              description:
                "We coordinate finishing and installation based on your project requirements.",
            },
          ],
        },
      },
      {
        section_key: "about-testimonials",
        section_type: "testimonials",
        title: "Customer Testimonials & Statistics",
        sort_order: 3,
        is_visible: true,
        content: {
          sectionId: "about-testimonials",
          heading: "CRAFTED FOR SPACES. TRUSTED BY CUSTOMERS.",
          description:
            "From the first measurement to the finished installation, our work is built around the customer's requirements. See what customers have to say about their experience with Afsha Creative Solution.",
          cta: { label: "GET A QUOTE", href: "/contact" },
          highlightCard: null,
          showStats: true,
          stats: [
            { value: "80+", label: "Total Reviews" },
            { value: "100+", label: "Custom Railings" },
            { value: "400+", label: "Custom Gates" },
            { value: "10+", label: "Years Experience" },
            { value: "99.4%", label: "On-Time Handover" },
          ],
          items: [
            {
              id: "about-review-mohit",
              author: "Mohit Agarwal",
              role: "Verified Client",
              quote:
                "“We needed a custom main gate for our house. The team understood the design we wanted and delivered a strong, well-finished gate.”",
              avatarLetter: "M",
              avatarBgClass: "bg-green-700",
              image: img("asset:iron_gates.ironGate5", "Custom wrought iron main gate"),
              imagePosition: "bottom",
            },
            {
              id: "about-review-rahul",
              author: "Rahul Sharma",
              role: "Verified Client",
              quote:
                "“The stair railing was designed exactly according to our requirement. The finishing looks clean and the overall work was handled professionally.”",
              avatarLetter: "R",
              avatarBgClass: "bg-blue-700",
              image: img("asset:steel_stair_railing.ssStairRailling8", "Stainless steel stair railing"),
              imagePosition: "top",
            },
            {
              id: "about-review-amit",
              author: "Amit Verma",
              role: "Verified Client",
              quote:
                "“We wanted a modern balcony railing for our new home. The design and fabrication turned out very well and matched the look of the house.”",
              avatarLetter: "A",
              avatarBgClass: "bg-red-700",
              image: img("asset:steel_balcony_railing.ssBalconyRailling9", "Modern balcony railing"),
              imagePosition: "bottom",
            },
          ],
        },
      },
      {
        section_key: "about-cta",
        section_type: "cta_banner",
        title: "About Bottom CTA",
        sort_order: 4,
        is_visible: true,
        content: {
          variant: "gold_glow_card",
          eyebrow: "Made to measure · Moradabad, India",
          heading: "Let's make something for your space.",
          description:
            "Tell us what you are planning. We'll help you work through the design, materials, and next steps.",
          primaryButton: { label: "Talk about your project", href: "/contact" },
        },
      },
    ],
  },

  // 3. SERVICES PAGE (/services)
  {
    title: "Services",
    slug: "/services",
    page_type: "standard",
    meta_title: "Metal Fabrication Services in Moradabad | Afsha Creative Solutions",
    meta_description:
      "Expert architectural metal fabrication services in Moradabad: custom main gates, handcrafted iron gates, stainless steel railings, balcony balustrades, and decorative metal grills.",
    meta_keywords: DEFAULT_SITE_SETTINGS.seo_defaults.keywords,
    canonical_url: "/services",
    og_image: "/opengraph-image",
    og_image_alt: "Architectural Metal Fabrication Services in Moradabad",
    structured_data: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Architectural Metal Fabrication Services",
      provider: {
        "@type": "LocalBusiness",
        name: "Afsha Creative Solutions",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Harthala, Lodhipur",
          addressLocality: "Moradabad",
          addressRegion: "Uttar Pradesh",
          postalCode: "244001",
          addressCountry: "IN",
        },
      },
      serviceType: [
        "Custom Metal Gate Fabrication",
        "Iron Gate Manufacturing",
        "Steel Gate Fabrication",
        "Architectural Metal Railings",
        "Balcony Railing Designs",
        "Decorative Metal Grills",
        "Made-to-Measure Metalwork",
      ],
      url: "https://www.afshacreative.in/services",
    },
    sections: [
      {
        section_key: "services-hero",
        section_type: "hero_banner",
        title: "Services Page Hero",
        sort_order: 0,
        is_visible: true,
        content: {
          variant: "page_hero",
          eyebrow: "Specialized Fabrication Services",
          heading: "Architectural",
          highlightText: "Metal Services",
          description:
            "Afsha Creative Solutions provides complete design, manufacturing, and installation services for custom metal gates, iron balustrades, stainless steel railings, and bespoke architectural metalwork in Moradabad, Uttar Pradesh.",
          breadcrumbs: [
            { name: "Home", href: "/" },
            { name: "Services", href: "/services" },
          ],
          showBreadcrumbs: true,
          primaryButton: { label: "Request Service Quote", href: "/custom-metalwork" },
          secondaryButton: { label: "Explore Services", href: "#services-list" },
          badges: [
            { number: "01", label: "7 Core Fabrication Services" },
            { number: "02", label: "Workshop in Moradabad" },
            { number: "03", label: "Made-to-Measure Execution" },
            { number: "04", label: "Residential & Commercial" },
          ],
        },
      },
      {
        section_key: "services-list",
        section_type: "services_grid",
        title: "7 Fabrication Service Divisions",
        sort_order: 1,
        is_visible: true,
        content: {
          variant: "alternating_rows",
          sectionId: "services-list",
          eyebrow: "What We Deliver",
          heading: "Fabrication Services Built for Indian Architecture",
          description:
            "Explore our seven specialized metalwork service divisions. Every service includes on-site measurement, precision workshop manufacturing, and professional fitting.",
          services: [
            {
              id: "custom-gate-fabrication",
              eyebrow: "Vehicular & Estate Entrances",
              title: "Custom Metal Gate Fabrication",
              description:
                "End-to-end design, fabrication, and structural engineering of boundary entrance gates. We construct single-leaf swing, bi-parting double swing, and cantilever sliding gates tailored for residential compounds and commercial properties.",
              image: img("asset:steel_gate.ssGate13", "Custom Metal Gate Fabrication"),
              highlights: [
                "Heavy-duty ball-bearing pivot hinges",
                "Sliding ground track & cantilever options",
                "Motorization-ready structural framing",
                "Custom locking hardware integration",
              ],
              primaryButton: { label: "Explore Gate Collection", href: "/products?category=gates" },
              secondaryButton: {
                label: "Request Service Quote",
                href: "/custom-metalwork?service=custom-gate-fabrication",
              },
            },
            {
              id: "iron-gate-manufacturing",
              eyebrow: "Hand-Forged Wrought Iron",
              title: "Iron Gate Manufacturing",
              description:
                "Artisan wrought iron manufacturing bringing classical heritage character to modern estates. Skilled blacksmithing produces forged scrolls, tapered pickets, cast finials, and heavy privacy plates with high tensile resistance.",
              image: img("asset:iron_gates.ironGate3", "Iron Gate Manufacturing"),
              highlights: [
                "Traditional hand-hammered scrollwork",
                "Solid mild steel bar stock construction",
                "Multi-stage anti-corrosive zinc primer",
                "Heavy physical barrier protection",
              ],
              primaryButton: {
                label: "View Iron Gates",
                href: "/products?category=gates&material=iron",
              },
              secondaryButton: {
                label: "Request Service Quote",
                href: "/custom-metalwork?service=iron-gate-manufacturing",
              },
            },
            {
              id: "steel-gate-fabrication",
              eyebrow: "Grade 304 / 316 Stainless Steel",
              title: "Steel Gate Fabrication",
              description:
                "Modern architectural stainless steel gates fabricated with aerospace-grade precision. Ideal for contemporary residences requiring sharp geometric lines, weather-proof durability, and minimal lifetime maintenance.",
              image: img("asset:steel_gate.ssGate1", "Steel Gate Fabrication"),
              highlights: [
                "Certified AISI 304 and 316 alloy options",
                "Satin hairline or mirror finish polish",
                "Seamless TIG argon welded corners",
                "Weatherproof against intense humidity",
              ],
              primaryButton: {
                label: "Explore Steel Gates",
                href: "/products?category=gates&material=stainless-steel",
              },
              secondaryButton: {
                label: "Request Service Quote",
                href: "/custom-metalwork?service=steel-gate-fabrication",
              },
            },
            {
              id: "architectural-metal-railings",
              eyebrow: "Staircase & Interior Balustrades",
              title: "Architectural Metal Railings",
              description:
                "Made-to-measure interior and exterior staircase balustrades. Every railing is contoured to the unique rise, run, and rake angle of your stairs, ensuring flawless continuity from ground foyer to upper landings.",
              image: img(
                "asset:steel_stair_railing.ssStairRailling8",
                "Architectural Metal Railings"
              ),
              highlights: [
                "Core-drilled concrete expansion anchors",
                "Smooth continuous ergonomic handrails",
                "Seamless transitional stair landings",
                "Available with wooden cap or brass trim",
              ],
              primaryButton: {
                label: "View Staircase Railings",
                href: "/products?category=stair-railings",
              },
              secondaryButton: {
                label: "Request Service Quote",
                href: "/custom-metalwork?service=architectural-metal-railings",
              },
            },
            {
              id: "balcony-railing-designs",
              eyebrow: "Terrace & Veranda Balustrades",
              title: "Balcony Railing Designs",
              description:
                "High-safety exterior balcony railings designed to elevate your building façade while ensuring strict adherence to building safety codes. Engineered to resist gale wind pressure, heavy rain, and seasonal thermal expansion.",
              image: img("asset:iron_balcony_railing.ironbrail3", "Balcony Railing Designs"),
              highlights: [
                "Child-safe maximum 4-inch picket clearance",
                "Water-shedding base escutcheons",
                "Horizontal, vertical, and panel layouts",
                "High-grade outdoor polyurethane paint",
              ],
              primaryButton: {
                label: "Explore Balcony Railings",
                href: "/products?category=balcony-railings",
              },
              secondaryButton: {
                label: "Request Service Quote",
                href: "/custom-metalwork?service=balcony-railing-designs",
              },
            },
            {
              id: "decorative-metal-grills",
              eyebrow: "Window Security & Interior Jaali",
              title: "Decorative Metal Grills",
              description:
                "Artistic architectural screens and window safety grills that balance natural daylight, breeze circulation, and physical deterrence. Fabricated via precision laser cutting or handcrafted forged iron bars.",
              image: img("asset:iron_stair_railing.ironStairRailling4", "Decorative Metal Grills"),
              highlights: [
                "Parametric, geometric, and floral patterns",
                "Concealed anchor lugs for clean mounting",
                "High-security anti-pry structural framing",
                "Interior room divider partitions",
              ],
              primaryButton: {
                label: "Request Grill Design",
                href: "/custom-metalwork#grills",
              },
              secondaryButton: {
                label: "Request Service Quote",
                href: "/custom-metalwork?service=decorative-metal-grills",
              },
            },
            {
              id: "made-to-measure-metalwork",
              eyebrow: "Bespoke Architectural Fabrication",
              title: "Made-to-Measure Metalwork",
              description:
                "Specialized structural and ornamental metal fabrication for custom architectural projects. From curved spiral staircase balustrades to bespoke cantilever brackets and decorative canopies.",
              image: img(
                "asset:steel_spiral_railing.ssSpiralRailling3",
                "Made-to-Measure Metalwork"
              ),
              highlights: [
                "Precision roll-bending of tubes and flats",
                "Fabrication from architect CAD drawings",
                "On-site dimensional survey in Moradabad",
                "Complete fitting and finishing coordination",
              ],
              primaryButton: { label: "Start Bespoke Project", href: "/custom-metalwork" },
              secondaryButton: {
                label: "Request Service Quote",
                href: "/custom-metalwork?service=made-to-measure-metalwork",
              },
            },
          ],
        },
      },
      {
        section_key: "services-workflow",
        section_type: "features",
        title: "Quality Fabrication Workflow",
        sort_order: 2,
        is_visible: true,
        content: {
          variant: "phase_cards",
          background: "darker",
          align: "center",
          eyebrow: "Behind the Scenes",
          heading: "Our Quality Fabrication Workflow",
          description:
            "How we maintain consistent structural strength, flawless finish, and long-term durability across every project.",
          items: [
            {
              number: "01",
              title: "Site Survey & Measurement",
              description:
                "Accurate physical survey of pillar spacing, floor levels, rake angles, and structural anchor substrates.",
            },
            {
              number: "02",
              title: "Material Sourcing & Grade Testing",
              description:
                "Certified AISI-304 stainless steel and heavy-gauge solid iron bars inspected for thickness and surface purity.",
            },
            {
              number: "03",
              title: "Precision Welding & Cold Cutting",
              description:
                "Mitered joins and high-penetration argon TIG/MIG welding to guarantee lifelong structural integrity.",
            },
            {
              number: "04",
              title: "Surface Preparation & Anti-Rust",
              description:
                "Abrasive weld blending, zinc-rich rust-preventive priming, and multi-coat polyurethane or powder bake.",
            },
            {
              number: "05",
              title: "Fitting & Final Quality Audit",
              description:
                "Core-drilled installation, balance adjustment, hardware lubrication, and protective cleanup.",
            },
          ],
        },
      },
      {
        section_key: "services-workshop-notice",
        section_type: "cta_banner",
        title: "Moradabad Workshop Notice",
        sort_order: 3,
        is_visible: true,
        content: {
          variant: "workshop_notice",
          eyebrow: "Moradabad Workshop",
          heading: "Visit Our Fabrication Facility in Moradabad",
          description:
            "Located near KK Farm House on Bishanpur Road, Harthala, Lodhipur. Drop in to view material samples, discuss drawings with our metalworkers, or inspect works in progress.",
          primaryButton: { label: "Schedule Workshop Visit", href: "/contact" },
        },
      },
      {
        section_key: "services-cta",
        section_type: "cta_banner",
        title: "Services Bottom CTA",
        sort_order: 4,
        is_visible: true,
        content: {
          variant: "standard",
          eyebrow: "Custom Metal Fabrication Services",
          heading: "Ready to commission custom metalwork?",
          description:
            "Share your requirements with our fabrication team to receive expert design recommendations and a prompt, transparent estimate.",
          primaryButton: {
            label: "Discuss On WhatsApp",
            href: "https://wa.me/919634776691?text=Hello%20Afsha%20Creative%20Solution%2C%20I%20would%20like%20to%20discuss%20a%20custom%20metalwork%20project.",
            external: true,
          },
          secondaryButton: { label: "Request A Custom Quote", href: "/custom-metalwork" },
        },
      },
    ],
  },

  // 4. CUSTOM METALWORK PAGE (/custom-metalwork)
  {
    title: "Custom Metalwork",
    slug: "/custom-metalwork",
    page_type: "landing",
    meta_title: "Custom Metalwork & Bespoke Fabrication | Afsha Creative Solutions",
    meta_description:
      "Request custom made-to-measure metal gates, architectural railings, and decorative metalwork designed around your vision. Handcrafted at our workshop in Moradabad, India.",
    meta_keywords: DEFAULT_SITE_SETTINGS.seo_defaults.keywords,
    canonical_url: "/custom-metalwork",
    og_image: "/opengraph-image",
    og_image_alt: "Custom Metalwork & Bespoke Fabrication — Afsha Creative Solutions",
    structured_data: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Custom Metalwork and Architectural Fabrication",
      provider: {
        "@type": "LocalBusiness",
        name: "Afsha Creative Solutions",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Harthala, Lodhipur",
          addressLocality: "Moradabad",
          addressRegion: "Uttar Pradesh",
          postalCode: "244001",
          addressCountry: "IN",
        },
      },
      description:
        "Custom architectural metal fabrication in Moradabad: made-to-measure metal gates, iron balustrades, staircase railings, and decorative metalwork.",
      url: "https://www.afshacreative.in/custom-metalwork",
    },
    sections: [
      {
        section_key: "custom-hero",
        section_type: "hero_banner",
        title: "Custom Metalwork Hero",
        sort_order: 0,
        is_visible: true,
        content: {
          variant: "page_hero",
          eyebrow: "Bespoke Architectural Metalwork",
          heading: "Designed Around",
          highlightText: "Your Vision.",
          description:
            "Every project begins with your space and your architectural goals. From single private villa gates to complete estate railing systems, we fabricate made-to-measure metalwork that endures for generations.",
          breadcrumbs: [
            { name: "Home", href: "/" },
            { name: "Custom Metalwork", href: "/custom-metalwork" },
          ],
          showBreadcrumbs: true,
          primaryButton: { label: "Request a Custom Quote", href: "#quote-form" },
          secondaryButton: { label: "Explore Process", href: "#process" },
          badges: [
            { number: "01", label: "Zero Off-the-Shelf Templates" },
            { number: "02", label: "Exact Millimeter Tolerances" },
            { number: "03", label: "Moradabad Artisan Workshop" },
            { number: "04", label: "Comprehensive Warranty Support" },
          ],
        },
      },
      {
        section_key: "custom-capabilities",
        section_type: "card_grid",
        title: "What We Create",
        sort_order: 1,
        is_visible: true,
        content: {
          variant: "capability_cards",
          background: "default",
          eyebrow: "Capabilities & Scope",
          heading: "What We Create",
          description:
            "We fabricate architectural metalwork tailored to your specific requirements, structural loads, and exterior elevations.",
          columns: 3,
          cards: [
            {
              id: "cap-1",
              number: "01 / SCOPE",
              eyebrow: "Sliding, Swing & Bi-Fold",
              title: "Custom Main Gates",
              description:
                "Heavy-duty vehicular entrance gates built with 304 grade stainless steel or forged wrought iron. Engineered to withstand heavy daily use, wind load, and automation motorization.",
              image: img("asset:steel_gate.ssGate13", "Custom Main Gates"),
              features: [
                "Custom width & height matching your pillars",
                "Motorization ready",
                "Concealed heavy pivot hinges",
              ],
              link: "#quote-form",
              buttonText: "Inquire for Custom Main Gates",
            },
            {
              id: "cap-2",
              number: "02 / SCOPE",
              eyebrow: "Staircases, Landings & Ramps",
              title: "Architectural Railings",
              description:
                "Interior and exterior balustrades contoured to your staircase geometry. Straight runs, intermediate landings, ramp angles, and volute starter newels fabricated with millimeter accuracy.",
              image: img("asset:steel_stair_railing.ssStairRailling8", "Architectural Railings"),
              features: [
                "Core-drilled concrete fastenings",
                "Continuous smooth handrails",
                "High-load structural rigidity",
              ],
              link: "#quote-form",
              buttonText: "Inquire for Architectural Railings",
            },
            {
              id: "cap-3",
              number: "03 / SCOPE",
              eyebrow: "Terrace & Veranda Balustrades",
              title: "Balcony Railings",
              description:
                "Code-compliant perimeter protection for residential and commercial balconies. Weather-resistant multi-coat primers and baked coatings to eliminate rust during severe monsoons.",
              image: img("asset:iron_balcony_railing.ironbrail3", "Balcony Railings"),
              features: [
                "Child-safe 4-inch max bar spacing",
                "Water-shedding base plates",
                "Modern & classical styling",
              ],
              link: "#quote-form",
              buttonText: "Inquire for Balcony Railings",
            },
            {
              id: "cap-4",
              number: "04 / SCOPE",
              eyebrow: "Window Grills & Jaali Partitions",
              title: "Decorative Metal Grills",
              description:
                "Distinctive window security grills and interior architectural screens that deliver security, natural airflow, and ambient lighting without compromising modern aesthetics.",
              image: img("asset:iron_stair_railing.ironStairRailling4", "Decorative Metal Grills"),
              features: [
                "Laser-cut CNC or forged solid bar",
                "Concealed mounting tabs",
                "Oven-cured powder coating",
              ],
              link: "#quote-form",
              buttonText: "Inquire for Decorative Metal Grills",
            },
            {
              id: "cap-5",
              number: "05 / SCOPE",
              eyebrow: "Spiral Stairs & Statement Metalwork",
              title: "Bespoke Metal Designs",
              description:
                "Curved spiral stair balustrades, structural brackets, decorative entry canopies, and specialized architectural elements brought from sketch to life.",
              image: img("asset:steel_spiral_railing.ssSpiralRailling3", "Bespoke Metal Designs"),
              features: [
                "Precision roll-bending & curving",
                "Seamless ground welds",
                "Brass & PVD champagne gold accents",
              ],
              link: "#quote-form",
              buttonText: "Inquire for Bespoke Metal Designs",
            },
          ],
        },
      },
      {
        section_key: "custom-process",
        section_type: "features",
        title: "Four-Step Customization Process",
        sort_order: 2,
        is_visible: true,
        content: {
          variant: "step_cards",
          sectionId: "process",
          background: "darker",
          align: "center",
          eyebrow: "Precision Workflow",
          heading: "Our Four-Step Customization Process",
          description:
            "From initial sketch to secure installation, our proven workflow ensures your metalwork arrives exactly as intended.",
          items: [
            {
              number: "01",
              title: "Share Your Requirements",
              description:
                "Send us your rough site dimensions, elevation drawings, reference photos from our gallery or Pinterest, and any functional preferences (sliding vs swing, motorized, privacy level).",
              icon: "sparkles",
            },
            {
              number: "02",
              title: "Discuss Design and Measurements",
              description:
                "Our team reviews the structural viability, suggests optimal metal alloys (SS 304, wrought iron, or mild steel), verifies pillar-to-pillar clearances, and finalizes the detailed design drawing.",
              icon: "wrench",
            },
            {
              number: "03",
              title: "Review the Proposal",
              description:
                "Receive a clear, transparent, itemized quotation detailing material gauge, weight estimation, surface finish, hardware inclusions, and agreed manufacturing lead time.",
              icon: "check",
            },
            {
              number: "04",
              title: "Fabrication and Project Completion",
              description:
                "Master metalworkers in our Moradabad facility execute precision cold cutting, TIG/MIG welding, weld dressing, anti-rust priming, and coordinate careful transport and on-site fitting.",
              icon: "shield",
            },
          ],
        },
      },
      {
        section_key: "custom-quote-form",
        section_type: "contact_info",
        title: "Custom Metalwork Quote Form",
        sort_order: 3,
        is_visible: true,
        content: {
          variant: "quote_form",
          sectionId: "quote-form",
          formEyebrow: "Bespoke Estimation",
          formTitle: "Share Your Vision — Request a Custom Quote",
          formSubtitle:
            "Provide your project dimensions, design references, and material preferences. We’ll analyze the structural specs and reply promptly with a comprehensive proposal.",
          defaultCategory: "gates",
        },
      },
      {
        section_key: "custom-quality-strip",
        section_type: "card_grid",
        title: "Workshop Quality Assurance Strip",
        sort_order: 4,
        is_visible: true,
        content: {
          variant: "assurance_strip",
          background: "darker",
          eyebrow: "",
          heading: "",
          columns: 3,
          cards: [
            {
              id: "qa-1",
              eyebrow: "Material Rigor",
              title: "Certified Alloy Grades",
              description:
                "We strictly use genuine AISI 304 and 316 stainless steel and heavy-gauge solid wrought iron. No thin-gauge hollow tubes that dent or deform over time.",
            },
            {
              id: "qa-2",
              eyebrow: "Craftsmanship",
              title: "Ground Seamless Welds",
              description:
                "Argon TIG and MIG structural welds are ground flush and hand-sanded with progressive abrasive grits so joint lines become imperceptible to the touch.",
            },
            {
              id: "qa-3",
              eyebrow: "Anti-Corrosion",
              title: "Multi-Stage Finishing",
              description:
                "Multi-layer zinc phosphate primers, automotive PU topcoats, and electro-statically applied oven-baked powder coats ensure decades of weather resilience.",
            },
          ],
        },
      },
      {
        section_key: "custom-cta",
        section_type: "cta_banner",
        title: "Direct Workshop Discussion CTA",
        sort_order: 5,
        is_visible: true,
        content: {
          variant: "standard",
          eyebrow: "Direct Workshop Discussion",
          heading: "Prefer discussing your measurements directly?",
          description:
            "Our master fabricators are available on WhatsApp and phone to review your photos, drawings, and site requirements.",
          primaryButton: {
            label: "Message On WhatsApp",
            href: "https://wa.me/919634776691?text=Hello%20Afsha%20Creative%20Solution%2C%20I%20would%20like%20to%20discuss%20a%20custom%20metalwork%20project.",
            external: true,
          },
          secondaryButton: { label: "Call Our Workshop", href: "tel:+919634776691" },
        },
      },
    ],
  },

  // 5. COLLECTIONS PAGE (/collections)
  {
    title: "Collections",
    slug: "/collections",
    page_type: "catalog",
    meta_title: "Architectural Metalwork Collections | Afsha Creative Solutions",
    meta_description:
      "Explore our complete collection of custom metal gates, iron gates, stainless steel railings, balcony balustrades, staircase railings, and decorative metalwork crafted in Moradabad.",
    meta_keywords: DEFAULT_SITE_SETTINGS.seo_defaults.keywords,
    canonical_url: "/collections",
    og_image: "/opengraph-image",
    og_image_alt: "Architectural Metalwork Collections — Afsha Creative Solutions",
    structured_data: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Architectural Metalwork Collections",
      description:
        "Browse collections of custom metal gates, iron gates, steel railings, balcony balustrades, and bespoke fabrication by Afsha Creative Solutions in Moradabad.",
      url: "https://www.afshacreative.in/collections",
    },
    sections: [
      {
        section_key: "categories-hero",
        section_type: "hero_banner",
        title: "Categories Page Hero",
        sort_order: 0,
        is_visible: true,
        content: {
          variant: "page_hero",
          eyebrow: "Product Discovery · Moradabad, India",
          heading: "Architectural",
          highlightText: "Metalwork Categories",
          description:
            "Discover our collections of custom main gates, handcrafted wrought iron balustrades, stainless steel railings, and bespoke metal fabrication made to measure for Indian homes.",
          breadcrumbs: [
            { name: "Home", href: "/" },
            { name: "Collections", href: "/collections" },
          ],
          showBreadcrumbs: true,
          primaryButton: { label: "View All Products", href: "/products" },
          secondaryButton: { label: "Explore Below", href: "#categories-grid" },
          badges: [
            { number: "01", label: "Made to measure" },
            { number: "02", label: "Artisan metalcraft" },
            { number: "03", label: "Grade 304 & Wrought Iron" },
            { number: "04", label: "Moradabad Workshop" },
          ],
        },
      },
      {
        section_key: "categories-featured",
        section_type: "product_category_grid",
        title: "Featured Architectural Collections",
        sort_order: 1,
        is_visible: true,
        content: {
          variant: "featured_categories",
          eyebrow: "Signature Categories",
          heading: "Featured Architectural Collections",
          description:
            "The core fabrications that define residential and commercial properties across Uttar Pradesh and Delhi NCR.",
          headerLink: { label: "Browse Catalog", href: "/products" },
          categories: [
            {
              id: "main-gates",
              name: "Main Gates",
              slug: "gates",
              href: "/collections/gates",
              image: img("asset:steel_gate.ssGate13", "Main Gates"),
              material: "Stainless Steel & Wrought Iron",
              description:
                "Commanding residential and estate entrance gates engineered for durability, private security, and striking curb appeal.",
              highlights: [
                "Sliding & swing mechanisms",
                "Motorization ready",
                "Made-to-measure sizing",
              ],
              isFeatured: true,
              countCategorySlug: "gates",
            },
            {
              id: "iron-gates",
              name: "Handcrafted Iron Gates",
              slug: "iron-gates",
              href: "/products?category=gates&material=iron",
              image: img("asset:iron_gates.ironGate3", "Handcrafted Iron Gates"),
              material: "Hand-Forged Wrought Iron",
              description:
                "Traditional artisan wrought iron gates featuring ornamental scrollwork, heavy-gauge pickets, and multi-stage rust-inhibiting finishes.",
              highlights: [
                "Classical heritage motifs",
                "Solid bar construction",
                "Zinc epoxy primed",
              ],
              isFeatured: false,
              countCategorySlug: "gates",
            },
            {
              id: "steel-gates",
              name: "Modern Steel Gates",
              slug: "steel-gates",
              href: "/products?category=gates&material=stainless-steel",
              image: img("asset:steel_gate.ssGate1", "Modern Steel Gates"),
              material: "Grade 304 / 316 Stainless Steel",
              description:
                "Sleek minimalist steel gates with horizontal louvers, geometric accents, and weather-resistant satin or hairline finishes.",
              highlights: ["Rust-proof alloy", "Clean contemporary lines", "Low maintenance"],
              isFeatured: true,
              countCategorySlug: "gates",
            },
            {
              id: "metal-railings",
              name: "Architectural Metal Railings",
              slug: "railings",
              href: "/products?category=railings",
              image: img(
                "asset:steel_stair_railing.ssStairRailling8",
                "Architectural Metal Railings"
              ),
              material: "Stainless Steel & Brass Accents",
              description:
                "Precision-fabricated handrails and balustrades designed for commercial buildings, luxury villas, and contemporary homes.",
              highlights: [
                "Core-drilled anchoring",
                "Ergonomic handrail profiles",
                "High tensile stability",
              ],
              isFeatured: false,
              countCategorySlug: "stair-railings",
            },
            {
              id: "balcony-railings",
              name: "Balcony Railings",
              slug: "balcony-railings",
              href: "/collections/balcony-railings",
              image: img("asset:iron_balcony_railing.ironbrail3", "Balcony Railings"),
              material: "Wrought Iron & SS-304",
              description:
                "Safety-compliant outdoor balustrades built to withstand severe monsoons while framing terrace and balcony elevations.",
              highlights: [
                "Child-safe 4-inch bar spacing",
                "Weather-tested coatings",
                "Terrace perimeter defense",
              ],
              isFeatured: true,
              countCategorySlug: "balcony-railings",
            },
            {
              id: "staircase-railings",
              name: "Staircase Railings",
              slug: "stair-railings",
              href: "/collections/stair-railings",
              image: img("asset:steel_stair_railing.ssStairRailling13", "Staircase Railings"),
              material: "Steel, Iron & Wood-Top Profiles",
              description:
                "Custom-contoured interior staircase balustrades following straight runs, landings, and fluid helical curves.",
              highlights: [
                "Continuous smooth handrail",
                "Custom rake angle fitting",
                "Heavy-gauge newel posts",
              ],
              isFeatured: false,
              countCategorySlug: "stair-railings",
            },
            {
              id: "decorative-metal-grills",
              name: "Decorative Metal Grills",
              slug: "decorative-grills",
              href: "/custom-metalwork#grills",
              image: img("asset:iron_stair_railing.ironStairRailling4", "Decorative Metal Grills"),
              material: "Laser-Cut Steel & Forged Iron",
              description:
                "Artistic window security screens, interior room partition dividers, and privacy jaali panels for modern spaces.",
              highlights: [
                "Parametric & botanical patterns",
                "Concealed mounting tabs",
                "Oven-cured powder coat",
              ],
              isFeatured: false,
            },
            {
              id: "custom-metalwork",
              name: "Bespoke Custom Metalwork",
              slug: "custom-metalwork",
              href: "/custom-metalwork",
              image: img("asset:steel_spiral_railing.ssSpiralRailling3", "Bespoke Custom Metalwork"),
              material: "Curved Spiral Stairs & Special Fabrication",
              description:
                "One-of-a-kind metal structures, spiral staircase fabrication, bespoke brackets, and architectural statement pieces.",
              highlights: [
                "Made to CAD specifications",
                "On-site dimension survey",
                "Master artisan execution",
              ],
              isFeatured: true,
            },
          ],
        },
      },
      {
        section_key: "categories-grid",
        section_type: "product_category_grid",
        title: "Complete Category Collection",
        sort_order: 2,
        is_visible: true,
        content: {
          variant: "all_categories_grid",
          sectionId: "categories-grid",
          background: "darker",
          eyebrow: "Full Portfolio",
          heading: "Complete Category Collection",
          description:
            "From robust boundary gates to intricate balustrades, every category is produced to order in our Moradabad facility.",
          categories: [
            {
              id: "grid-main-gates",
              name: "Main Gates",
              slug: "gates",
              href: "/collections/gates",
              image: img("asset:steel_gate.ssGate13", "Main Gates"),
              material: "304 Stainless Steel & Wrought Iron",
              description:
                "Bespoke driveway and pedestrian entrance gates engineered for security, structural rigidity, and curb appeal.",
              highlights: [
                "Heavy-duty ball bearing hinges",
                "Automation & smart lock compatible",
                "Electrostatic rust-inhibitor primer",
              ],
              isFeatured: true,
              countCategorySlug: "gates",
            },
            {
              id: "grid-balcony-railings",
              name: "Balcony Railings",
              slug: "balcony-railings",
              href: "/collections/balcony-railings",
              image: img("asset:iron_balcony_railing.ironbrail3", "Balcony Railings"),
              material: "Wrought Iron & SS-304",
              description:
                "Safety-compliant outdoor balustrades built to withstand severe monsoons while framing terrace and balcony elevations.",
              highlights: [
                "Child-safe 4-inch bar spacing",
                "Weather-tested coatings",
                "Terrace perimeter defense",
              ],
              isFeatured: true,
              countCategorySlug: "balcony-railings",
            },
            {
              id: "grid-staircase-railings",
              name: "Staircase Railings",
              slug: "stair-railings",
              href: "/collections/stair-railings",
              image: img("asset:steel_stair_railing.ssStairRailling13", "Staircase Railings"),
              material: "Steel, Iron & Wood-Top Profiles",
              description:
                "Custom-contoured interior staircase balustrades following straight runs, landings, and fluid helical curves.",
              highlights: [
                "Continuous smooth handrail",
                "Custom rake angle fitting",
                "Heavy-gauge newel posts",
              ],
              isFeatured: true,
              countCategorySlug: "stair-railings",
            },
            {
              id: "grid-spiral-railings",
              name: "Spiral & Curved Railings",
              slug: "spiral-railings",
              href: "/collections/spiral-railings",
              image: img("asset:steel_spiral_railing.ssSpiralRailling3", "Spiral & Curved Railings"),
              material: "Roll-Bent Stainless Steel & Forged Iron",
              description:
                "Precision-curved architectural balustrades for tight spirals, sweeping duplex staircases, and helical layouts.",
              highlights: [
                "Continuous mandrel tube bending",
                "Custom radius engineering",
                "Seamless field-welded joins",
              ],
              isFeatured: true,
              countCategorySlug: "spiral-railings",
            },
            {
              id: "grid-decorative-metal-grills",
              name: "Decorative Metal Grills",
              slug: "decorative-grills",
              href: "/custom-metalwork",
              image: img("asset:iron_stair_railing.ironStairRailling4", "Decorative Metal Grills"),
              material: "Laser-Cut Steel & Forged Iron",
              description:
                "Artistic window security screens, interior room partition dividers, and privacy jaali panels for modern spaces.",
              highlights: [
                "Parametric & botanical patterns",
                "Concealed mounting tabs",
                "Oven-cured powder coat",
              ],
              isFeatured: true,
              countCategorySlug: "decorative-grills",
            },
            {
              id: "grid-custom-metalwork",
              name: "Bespoke Custom Metalwork",
              slug: "custom-metalwork",
              href: "/custom-metalwork",
              image: img("asset:steel_gate.ssGate4", "Bespoke Custom Metalwork"),
              material: "Curved Spiral Stairs & Special Fabrication",
              description:
                "One-of-a-kind metal structures, spiral staircase fabrication, bespoke brackets, and architectural statement pieces.",
              highlights: [
                "Made to CAD specifications",
                "On-site dimension survey",
                "Master artisan execution",
              ],
              isFeatured: true,
              countCategorySlug: "custom-metalwork",
            },
          ],
        },
      },
      {
        section_key: "categories-tailored-banner",
        section_type: "cta_banner",
        title: "Tailored Dimensions Banner",
        sort_order: 3,
        is_visible: true,
        content: {
          variant: "split_dark_card",
          eyebrow: "Tailored Dimensions",
          heading: "Need a size or design not listed here?",
          description:
            "Over 80% of our architectural metalwork is engineered from custom client drawings and site dimensions. Whether you have an architect’s blueprint or a sketch on paper, our craftsmen in Moradabad can fabricate it to the millimeter.",
          primaryButton: { label: "Custom Metalwork Service", href: "/custom-metalwork" },
          secondaryButton: { label: "Book Site Consultation", href: "/contact" },
        },
      },
      {
        section_key: "categories-cta",
        section_type: "cta_banner",
        title: "Categories Bottom CTA",
        sort_order: 4,
        is_visible: true,
        content: {
          variant: "standard",
          eyebrow: "Bespoke Metal Fabrication",
          heading: "Ready to fabricate your next gate or railing?",
          description:
            "Connect with our fabrication team in Moradabad to discuss drawings, finish options, and made-to-measure quotations.",
          primaryButton: {
            label: "Discuss On WhatsApp",
            href: "https://wa.me/919634776691?text=Hello%20Afsha%20Creative%20Solution%2C%20I%20would%20like%20to%20discuss%20a%20custom%20metalwork%20project.",
            external: true,
          },
          secondaryButton: { label: "Request A Custom Quote", href: "/custom-metalwork" },
        },
      },
    ],
  },

  // 6. PRODUCTS PAGE (/products)
  {
    title: "Products",
    slug: "/products",
    page_type: "catalog",
    meta_title: "Metalwork Products | Afsha Creative Solution",
    meta_description:
      "Explore custom steel and iron gates, stair railings, balcony railings, and architectural metalwork handcrafted by Afsha Creative Solution.",
    meta_keywords: DEFAULT_SITE_SETTINGS.seo_defaults.keywords,
    canonical_url: "/products",
    og_image: "/opengraph-image",
    og_image_alt: "Metalwork Products — Afsha Creative Solution",
    structured_data: null,
    sections: [
      {
        section_key: "products-hero",
        section_type: "hero_banner",
        title: "Products Catalog Hero",
        sort_order: 0,
        is_visible: true,
        content: {
          variant: "products_hero",
          eyebrow: "Made to measure · Moradabad, India",
          heading: "Metalwork,",
          highlightText: "made yours.",
          description:
            "A considered collection of gates and architectural railings, shaped around your space and finished by hand.",
          scrollAnchorLabel: "Explore the collection",
          scrollAnchorHref: "#collection",
          badges: [
            { number: "01", label: "Made to measure" },
            { number: "02", label: "Thoughtful detailing" },
            { number: "03", label: "Built for everyday" },
            { number: "04", label: "Made in Moradabad" },
          ],
          showBreadcrumbs: false,
        },
      },
      {
        section_key: "products-catalog-grid",
        section_type: "product_category_grid",
        title: "Products Collection Grid",
        sort_order: 1,
        is_visible: true,
        content: {
          variant: "full_catalog",
          sectionId: "collection",
          eyebrow: "The collection",
          heading: "Designed for the way you live.",
          description:
            "Every piece begins with a conversation, then takes shape around your architecture.",
          emptyTitle: "The collection is being prepared.",
          emptyDescription:
            "Published products will appear here. Please check back soon.",
        },
      },
      {
        section_key: "products-cta",
        section_type: "cta_banner",
        title: "Products Bottom CTA",
        sort_order: 2,
        is_visible: true,
        content: {
          variant: "standard",
          eyebrow: "Your space, your specification",
          heading: "Have a design in mind? Let's make it real.",
          description: "",
          primaryButton: {
            label: "Discuss your project",
            href: "https://wa.me/919634776691?text=Hello%20Afsha%20Creative%20Solution%2C%20I%20would%20like%20a%20quote%20for%20a%20custom%20metalwork%20product.",
            external: true,
          },
        },
      },
    ],
  },

  // 7. GALLERY PAGE (/gallery)
  {
    title: "Gallery",
    slug: "/gallery",
    page_type: "standard",
    meta_title: "Architectural Metalwork Gallery | Afsha Creative Solutions",
    meta_description:
      "Explore our portfolio of completed custom metal gates, wrought iron balcony railings, stainless steel balustrades, and bespoke architectural metalwork crafted in Moradabad.",
    meta_keywords: DEFAULT_SITE_SETTINGS.seo_defaults.keywords,
    canonical_url: "/gallery",
    og_image: "/opengraph-image",
    og_image_alt: "Architectural Metalwork Gallery — Afsha Creative Solutions",
    structured_data: {
      "@context": "https://schema.org",
      "@type": "ImageGallery",
      name: "Afsha Creative Solutions Metalwork Gallery",
      description:
        "Showcase of custom metal gates, wrought iron railings, and architectural fabrications in Moradabad, India.",
      url: "https://www.afshacreative.in/gallery",
    },
    sections: [
      {
        section_key: "gallery-hero",
        section_type: "hero_banner",
        title: "Gallery Page Hero",
        sort_order: 0,
        is_visible: true,
        content: {
          variant: "page_hero",
          eyebrow: "Architectural Portfolio · Moradabad, India",
          heading: "Completed",
          highlightText: "Metalwork Gallery",
          description:
            "A visual showcase of custom main gates, wrought iron balustrades, staircase railings, and bespoke architectural metalwork fabricated in our Moradabad workshop.",
          breadcrumbs: [
            { name: "Home", href: "/" },
            { name: "Gallery", href: "/gallery" },
          ],
          showBreadcrumbs: true,
          badges: [
            { number: "01", label: "Authentic Workshop Photography" },
            { number: "02", label: "Made to Measure Sizing" },
            { number: "03", label: "High-Tensile Welding" },
            { number: "04", label: "Durable Weatherproof Coating" },
          ],
        },
      },
      {
        section_key: "gallery-showcase",
        section_type: "gallery",
        title: "Interactive Gallery Grid",
        sort_order: 1,
        is_visible: true,
        content: {
          eyebrow: "Filter by Fabrication Type",
          heading: "",
          description:
            "Click any photograph to view full high-resolution details, material specifications, and request an exact quote for a similar design.",
          includeLiveProducts: true,
          filterCategories: [
            { slug: "all", name: "All Works" },
            { slug: "gates", name: "Main Gates" },
            { slug: "stair-railings", name: "Staircase Railings" },
            { slug: "balcony-railings", name: "Balcony Railings" },
            { slug: "spiral-railings", name: "Spiral Railings" },
            { slug: "decorative-metalwork", name: "Decorative Metalwork" },
          ],
          items: [
            {
              id: "project-ss-gate-13",
              title: "Vrindavan Estate Double Main Gate",
              category: "Main Gates",
              categorySlug: "gates",
              material: "304 Grade Stainless Steel & Matte Infill",
              description:
                "Custom motorized double-leaf main gate with horizontal privacy louvers and satin hairline texture, installed at a luxury residential property.",
              image: img(
                "asset:steel_gate.ssGate13",
                "Modern stainless steel double main gate design in Moradabad"
              ),
            },
            {
              id: "project-iron-gate-3",
              title: "Jaipur Heritage Hand-Forged Iron Gate",
              category: "Main Gates",
              categorySlug: "gates",
              material: "Heavy-Gauge Wrought Iron & Zinc Primer",
              description:
                "Classical wrought iron entrance gate with hand-hammered scrolls, spear pickets, and anti-corrosive polyurethane coating.",
              image: img(
                "asset:iron_gates.ironGate3",
                "Handcrafted wrought iron driveway gate with ornamental scrolls"
              ),
            },
            {
              id: "project-ss-stair-8",
              title: "Duplex Interior Floating Stair Railing",
              category: "Staircase Railings",
              categorySlug: "stair-railings",
              material: "Seamless Stainless Steel Tubing",
              description:
                "Minimalist architectural stair balustrade featuring concealed base anchoring and continuous smooth handrail contours.",
              image: img(
                "asset:steel_stair_railing.ssStairRailling8",
                "Contemporary stainless steel staircase balustrade"
              ),
            },
            {
              id: "project-iron-balcony-3",
              title: "Ornate Terrace Balcony Balustrade",
              category: "Balcony Railings",
              categorySlug: "balcony-railings",
              material: "Solid Wrought Iron & Powder Coating",
              description:
                "Classical balcony safety railing engineered with 4-inch picket spacing, forged center medallions, and baked powder finish.",
              image: img(
                "asset:iron_balcony_railing.ironbrail3",
                "Wrought iron balcony railing installed on luxury terrace"
              ),
            },
            {
              id: "project-spiral-3",
              title: "Sculptural Spiral Staircase Balustrade",
              category: "Spiral Railings",
              categorySlug: "spiral-railings",
              material: "Precision-Curved Stainless Steel",
              description:
                "Helical spiral staircase railing requiring master artisan roll-bending and invisible ground welds for a seamless curvature.",
              image: img(
                "asset:steel_spiral_railing.ssSpiralRailling3",
                "Curved helical stainless steel spiral stair railing"
              ),
            },
            {
              id: "project-ss-balcony-4",
              title: "Minimalist Horizon Balcony Railing",
              category: "Balcony Railings",
              categorySlug: "balcony-railings",
              material: "Grade 304 Stainless Steel Bars",
              description:
                "Modern horizontal bar balustrade offering unobstructed landscape views while meeting national residential balcony safety codes.",
              image: img(
                "asset:steel_balcony_railing.ssBalconyRailling4",
                "Modern horizontal bar stainless steel balcony railing"
              ),
            },
            {
              id: "project-iron-stair-4",
              title: "Artisan Royal Staircase Railing",
              category: "Staircase Railings",
              categorySlug: "stair-railings",
              material: "Forged Iron with Antique Highlights",
              description:
                "Intricate decorative stair railing with curved transitional ramp-ups and solid core-drilled concrete fastenings.",
              image: img(
                "asset:iron_stair_railing.ironStairRailling4",
                "Artisan wrought iron interior staircase railing"
              ),
            },
            {
              id: "project-ss-gate-1",
              title: "Contemporary Minimalist Residence Gate",
              category: "Main Gates",
              categorySlug: "gates",
              material: "Architectural Stainless Steel",
              description:
                "Geometric sliding main gate fabricated with laser-straight alignment, built-in lock box, and heavy-duty bottom ground track.",
              image: img(
                "asset:steel_gate.ssGate1",
                "Clean minimalist stainless steel sliding gate design"
              ),
            },
            {
              id: "project-spiral-1",
              title: "Exterior Helical Spiral Fire-Exit Rail",
              category: "Spiral Railings",
              categorySlug: "spiral-railings",
              material: "High-Tensile Stainless Steel 304",
              description:
                "Full-height curved safety railing for outdoor spiral access stairs, weather-tested against extreme temperature swings.",
              image: img(
                "asset:steel_spiral_railing.ssSpiralRailling1",
                "Outdoor spiral staircase balustrade fabrication"
              ),
            },
            {
              id: "project-iron-gate-1",
              title: "Classical European Archway Entry Gate",
              category: "Main Gates",
              categorySlug: "gates",
              material: "Wrought Iron with Cast Pickets",
              description:
                "Arched double swing gate with decorative finials and forged lower privacy kickplates, fabricated for a private villa.",
              image: img(
                "asset:iron_gates.ironGate1",
                "Arched wrought iron entrance gate with decorative pickets"
              ),
            },
            {
              id: "project-iron-balcony-1",
              title: "Bespoke French Balcony Juliet Railing",
              category: "Balcony Railings",
              categorySlug: "balcony-railings",
              material: "Forged Iron Flat Bar & Castings",
              description:
                "Compact Juliet balcony balustrade custom-fitted outside full-height bedroom French windows for safety and elevation depth.",
              image: img(
                "asset:iron_balcony_railing.ironbrail1",
                "French Juliet balcony iron railing installation"
              ),
            },
            {
              id: "project-ss-stair-13",
              title: "Commercial Multi-Floor Stair Balustrade",
              category: "Staircase Railings",
              categorySlug: "stair-railings",
              material: "Heavy-Gauge Stainless Steel Tubing",
              description:
                "Continuous 3-floor staircase handrail system engineered for heavy public footfall with satin anti-glare finish.",
              image: img(
                "asset:steel_stair_railing.ssStairRailling13",
                "Commercial stainless steel staircase handrail system"
              ),
            },
            {
              id: "project-steel-gate-4",
              title: "Modern Villa Slatted Security Gate",
              category: "Main Gates",
              categorySlug: "gates",
              material: "Stainless Steel with Dark Bronze Accent",
              description:
                "Wide-format entrance gate combining high-strength perimeter rectangular tubing with slatted central privacy louvers.",
              image: img(
                "asset:steel_gate.ssGate4",
                "Wide modern stainless steel boundary gate design"
              ),
            },
            {
              id: "project-iron-stair-2",
              title: "Heritage Spiral Scroll Stair Balustrade",
              category: "Staircase Railings",
              categorySlug: "stair-railings",
              material: "Traditional Hand-Forged Mild Steel",
              description:
                "Hand-bent decorative scrollwork balustrade with custom volute starter newel and solid wood handrail cap mounting.",
              image: img(
                "asset:iron_stair_railing.ironStairRailling2",
                "Heritage forged iron stair railing with volute starter"
              ),
            },
            {
              id: "project-ss-balcony-7",
              title: "Glass-Ready Stainless Steel Terrace Railing",
              category: "Balcony Railings",
              categorySlug: "balcony-railings",
              material: "Grade 304 Stainless Steel Post System",
              description:
                "Rigid upright posts and slotted bottom channel pre-engineered to secure 12mm toughened safety glass balcony panels.",
              image: img(
                "asset:steel_balcony_railing.ssBalconyRailling7",
                "Stainless steel post system for glass terrace balustrades"
              ),
            },
            {
              id: "project-steel-gate-12",
              title: "Bungalow Sliding Entry Gate with Pedestrian Door",
              category: "Main Gates",
              categorySlug: "gates",
              material: "Stainless Steel & Reinforced Hinges",
              description:
                "Combined sliding vehicular gate featuring an integrated wicket pass door for convenient pedestrian access without opening the full leaf.",
              image: img(
                "asset:steel_gate.ssGate12",
                "Sliding metal gate with integrated pedestrian wicket door"
              ),
            },
          ],
        },
      },
      {
        section_key: "gallery-cta",
        section_type: "cta_banner",
        title: "Gallery Bottom CTA",
        sort_order: 2,
        is_visible: true,
        content: {
          variant: "standard",
          eyebrow: "Request a Similar Design",
          heading: "Found a design that fits your property?",
          description:
            "Every piece can be customized to your exact pillar-to-pillar opening, height preferences, and metal finish. Message our team on WhatsApp for quick guidance.",
          primaryButton: {
            label: "Inquire on WhatsApp",
            href: "https://wa.me/919634776691?text=Hello%20Afsha%20Creative%20Solution%2C%20I%20would%20like%20to%20discuss%20a%20custom%20metalwork%20project.",
            external: true,
          },
          secondaryButton: { label: "Submit Specifications", href: "/custom-metalwork" },
        },
      },
    ],
  },

  // 8. FAQ PAGE (/faq)
  {
    title: "FAQ",
    slug: "/faq",
    page_type: "standard",
    meta_title: "Frequently Asked Questions | Afsha Creative Solutions",
    meta_description:
      "Common questions about custom metal gates, iron balustrades, stainless steel railings, made-to-measure fabrication, pricing, and workshop visits in Moradabad.",
    meta_keywords: DEFAULT_SITE_SETTINGS.seo_defaults.keywords,
    canonical_url: "/faq",
    og_image: "/opengraph-image",
    og_image_alt: "Frequently Asked Questions — Afsha Creative Solutions",
    structured_data: null,
    sections: [
      {
        section_key: "faq-hero",
        section_type: "hero_banner",
        title: "FAQ Page Hero",
        sort_order: 0,
        is_visible: true,
        content: {
          variant: "page_hero",
          eyebrow: "Help & Knowledge Base",
          heading: "Frequently Asked",
          highlightText: "Questions",
          description:
            "Clear answers about our custom metal gates, wrought iron manufacturing, material alloys, quotations, lead times, and workshop operations in Moradabad.",
          breadcrumbs: [
            { name: "Home", href: "/" },
            { name: "FAQ", href: "/faq" },
          ],
          showBreadcrumbs: true,
          badges: [
            { number: "01", label: "Authentic Business Guidance" },
            { number: "02", label: "Material Grade Information" },
            { number: "03", label: "Customization Details" },
            { number: "04", label: "Direct WhatsApp Support" },
          ],
        },
      },
      {
        section_key: "faq-accordion",
        section_type: "faq",
        title: "Full Categorized FAQ Accordion",
        sort_order: 1,
        is_visible: true,
        content: {
          variant: "categorized_accordion",
          includeJsonLd: true,
          categories: [
            { slug: "all", name: "All Questions" },
            { slug: "products", name: "Products" },
            { slug: "customization", name: "Customization" },
            { slug: "ordering", name: "Ordering & Quotes" },
            { slug: "business", name: "Workshop & Location" },
          ],
          items: [
            {
              category: "products",
              question: "What types of metal gates do you manufacture?",
              answer:
                "We manufacture a wide range of custom vehicular entrance gates, including modern stainless steel (Grade 304 and 316) gates, handcrafted solid wrought iron gates, and mild steel architectural gates. Our designs support sliding tracks, cantilever sliding systems, and single or double bi-parting swing mechanisms. Every gate can be pre-configured for automated gate motor openers.",
            },
            {
              category: "products",
              question:
                "Do you manufacture custom iron gates and how do you protect them from rust?",
              answer:
                "Yes, handcrafted wrought iron and mild steel gates are a signature specialty of our Moradabad workshop. To ensure long-lasting rust protection against severe monsoons, all iron fabrications undergo abrasive surface preparation, a heavy-build zinc phosphate epoxy anti-corrosive primer, and two coats of automotive-grade polyurethane (PU) or thermo-set powder coating.",
            },
            {
              category: "products",
              question: "What railing designs and materials are available?",
              answer:
                "We create made-to-measure railings for interior staircases, exterior balconies, terraces, and spiral stairs. Material options include satin and mirror-polished Grade 304 stainless steel, forged wrought iron with classical scrollwork, minimalist flat-bar configurations, and metal systems engineered to integrate 12mm toughened safety glass or wooden handrails.",
            },
            {
              category: "products",
              question: "What is the difference between Grade 304 and Grade 202 stainless steel?",
              answer:
                "Grade 304 contains a minimum of 18% chromium and 8% nickel, making it truly corrosion-resistant in outdoor, monsoon, and high-humidity environments. Grade 202 contains lower nickel content and is prone to surface tea-staining and oxidization when exposed to outdoor rain. We recommend Grade 304 for all outdoor gates, balcony balustrades, and external railings.",
            },
            {
              category: "customization",
              question: "Can I request custom dimensions and site-specific sizing?",
              answer:
                "Absolutely. Over 80% of our production is made-to-measure. We do not restrict clients to standard modular sizes. We fabricate your gate, railing, or grill around the exact millimeter dimensions of your masonry pillars, driveway slope, staircase rise/run, or terrace perimeter.",
            },
            {
              category: "customization",
              question:
                "Can I share my own architectural CAD drawings or Pinterest design references?",
              answer:
                "Yes. We frequently collaborate with architects, interior designers, builders, and homeowners who bring custom sketches, CAD elevations, or reference photos from Pinterest and Instagram. Our engineering team reviews the concept, validates structural rigidity and safety spacing, and creates a tailored fabrication plan.",
            },
            {
              category: "customization",
              question: "What finishes and color coatings can I choose from?",
              answer:
                "We offer an array of architectural finishes: matte black, textured charcoal, antique bronze, satin hairline stainless steel, mirror polish, and high-durability oven-baked powder coats. We also fabricate custom decorative accents in brass and champagne gold PVD finishes.",
            },
            {
              category: "ordering",
              question: "How do I get an accurate quotation for my project?",
              answer:
                "To get a prompt estimate, share your approximate opening dimensions (width x height), preferred material (stainless steel vs wrought iron), photos or sketches of your design preference, and the installation location. You can submit this through our Custom Metalwork Quote Form or directly via WhatsApp.",
            },
            {
              category: "ordering",
              question: "Can I request a quotation before finalizing a design?",
              answer:
                "Yes. We are happy to provide ballpark budgetary estimates based on your preliminary dimensions and preferred style. Once you are comfortable with the budget range, we refine the exact drawings, material gauge specifications, and schedule.",
            },
            {
              category: "ordering",
              question: "What is the typical manufacturing lead time for custom metalwork?",
              answer:
                "Production timelines depend on design complexity and project scale. Standard custom gates and balcony railings typically require 2 to 3 weeks from final design approval. Larger multi-story architectural railing packages or elaborate ornamental haveli-style iron gates typically take 3 to 5 weeks.",
            },
            {
              category: "business",
              question: "Where is Afsha Creative Solutions located?",
              answer:
                "Our manufacturing workshop and design office are located in Moradabad, Uttar Pradesh, India: Near KK Farm House, Bishanpur Road, Harthala, Lodhipur, Moradabad 244001. Clients are welcome to visit our facility to inspect materials, discuss blueprints, and view fabrication in progress.",
            },
            {
              category: "business",
              question: "Do you serve customers outside Moradabad?",
              answer:
                "Yes. While our primary workshop is based in Moradabad, we regularly fabricate and deliver architectural metalwork across Western Uttar Pradesh (including Bareilly, Rampur, Sambhal, Amroha, Meerut) as well as Noida, Greater Noida, and the wider Delhi NCR region.",
            },
            {
              category: "business",
              question: "Do you provide on-site measurement and installation?",
              answer:
                "Yes, we provide on-site measurement surveys and skilled installation services in Moradabad and nearby regional districts. For projects located farther away, we can coordinate with your local contractor or supply pre-assembled panels with comprehensive installation instructions.",
            },
          ],
        },
      },
      {
        section_key: "faq-help-card",
        section_type: "cta_banner",
        title: "Still Have Questions Card",
        sort_order: 2,
        is_visible: true,
        content: {
          variant: "centered_help_card",
          eyebrow: "Still have questions?",
          heading: "Speak directly with our fabrication team",
          description:
            "Whether you need material recommendations, structural load advice, or want to verify site dimensions, our team is happy to assist.",
          primaryButton: {
            label: "Chat on WhatsApp",
            href: "https://wa.me/919634776691?text=Hello%20Afsha%20Creative%20Solution%2C%20I%20have%20a%20question%20about%20your%20custom%20metalwork.",
            external: true,
          },
          secondaryButton: { label: "Call +91 96347 76691", href: "tel:+919634776691" },
        },
      },
      {
        section_key: "faq-cta",
        section_type: "cta_banner",
        title: "FAQ Bottom CTA",
        sort_order: 3,
        is_visible: true,
        content: {
          variant: "standard",
          eyebrow: "Custom Metal Fabrication",
          heading: "Ready to begin your metalwork project?",
          description:
            "Share your project requirements or book an on-site consultation with our Moradabad fabrication experts.",
          primaryButton: {
            label: "Discuss On WhatsApp",
            href: "https://wa.me/919634776691?text=Hello%20Afsha%20Creative%20Solution%2C%20I%20would%20like%20to%20discuss%20a%20custom%20metalwork%20project.",
            external: true,
          },
          secondaryButton: { label: "Request A Custom Quote", href: "/custom-metalwork" },
        },
      },
    ],
  },

  // 9. BLOG INDEX PAGE (/blog)
  {
    title: "Blog & Guides",
    slug: "/blog",
    page_type: "blog_index",
    meta_title: "Architectural Metalwork Blog & Guides | Afsha Creative Solutions",
    meta_description:
      "Expert guides, design comparisons, and buying tips on modern main gates, stainless steel railings, wrought iron balustrades, and custom metal fabrication in India.",
    meta_keywords: DEFAULT_SITE_SETTINGS.seo_defaults.keywords,
    canonical_url: "/blog",
    og_image: "/opengraph-image",
    og_image_alt: "Architectural Metalwork Blog & Guides — Afsha Creative Solutions",
    structured_data: {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Afsha Creative Solutions Architectural Metalwork Blog",
      description:
        "Educational articles and buying guides on custom metal gates, iron balustrades, and stainless steel fabrication in India.",
      url: "https://www.afshacreative.in/blog",
    },
    sections: [
      {
        section_key: "blog-hero",
        section_type: "hero_banner",
        title: "Blog Index Hero",
        sort_order: 0,
        is_visible: true,
        content: {
          variant: "page_hero",
          eyebrow: "Architectural Knowledge · Moradabad, India",
          heading: "Metalwork Insights &",
          highlightText: "Design Guides",
          description:
            "Comprehensive educational articles on selecting modern main gates, comparing wrought iron vs stainless steel, planning balcony railings, and understanding custom metal fabrication.",
          breadcrumbs: [
            { name: "Home", href: "/" },
            { name: "Blog", href: "/blog" },
          ],
          showBreadcrumbs: true,
          badges: [
            { number: "01", label: "Material Comparison Guides" },
            { number: "02", label: "Safety & Building Codes" },
            { number: "03", label: "Gate Automation Advice" },
            { number: "04", label: "Direct Workshop Insights" },
          ],
        },
      },
      {
        section_key: "blog-articles-feed",
        section_type: "rich_text",
        title: "Blog Articles Feed",
        sort_order: 1,
        is_visible: true,
        content: {
          variant: "blog_index",
          eyebrow: "Published Guides",
          heading: "All Articles",
          body: "",
        },
      },
      {
        section_key: "blog-cta",
        section_type: "cta_banner",
        title: "Blog Bottom CTA",
        sort_order: 2,
        is_visible: true,
        content: {
          variant: "standard",
          eyebrow: "Custom Project Consultation",
          heading: "Inspired by a design in our articles?",
          description:
            "Our fabrication team in Moradabad can bring any gate, balustrade, or grill concept into reality with precision-engineered metalwork.",
          primaryButton: {
            label: "Discuss On WhatsApp",
            href: "https://wa.me/919634776691?text=Hello%20Afsha%20Creative%20Solution%2C%20I%20would%20like%20to%20discuss%20a%20custom%20metalwork%20project.",
            external: true,
          },
          secondaryButton: { label: "Request Custom Quote", href: "/custom-metalwork" },
        },
      },
    ],
  },

  // 10. CONTACT PAGE (/contact)
  {
    title: "Contact",
    slug: "/contact",
    page_type: "contact",
    meta_title: "Contact | Afsha Creative Solution",
    meta_description:
      "Talk with Afsha Creative Solution about custom gates, railings, and architectural metalwork in Moradabad.",
    meta_keywords: DEFAULT_SITE_SETTINGS.seo_defaults.keywords,
    canonical_url: "/contact",
    og_image: "/opengraph-image",
    og_image_alt: "Contact Afsha Creative Solution — Moradabad",
    structured_data: null,
    sections: [
      {
        section_key: "contact-hero-and-form",
        section_type: "contact_info",
        title: "Contact Header, Channels & Enquiry Form",
        sort_order: 0,
        is_visible: true,
        content: {
          variant: "contact_methods_and_form",
          eyebrow: "Start a conversation",
          heading: "Let's shape your next project.",
          description:
            "Tell us about your space, preferred material, and the design you have in mind. We'll help you plan the next steps.",
          methods: [
            {
              label: "WhatsApp",
              value: "Chat with our team",
              href: "https://wa.me/919634776691?text=Hello%20Afsha%20Creative%20Solution%2C%20I%20would%20like%20to%20discuss%20a%20custom%20metalwork%20project.",
              icon: "whatsapp",
            },
            {
              label: "Call",
              value: "+91 96347 76691",
              href: "tel:+919634776691",
              icon: "phone",
            },
            {
              label: "Email",
              value: "afshacreativesolutions@gmail.com",
              href: "mailto:afshacreativesolutions@gmail.com",
              icon: "mail",
            },
          ],
          formEyebrow: "Project enquiry",
          formTitle: "Tell us what you have in mind.",
          formSubtitle:
            "Share a few details and our team will get back to you about your project.",
        },
      },
      {
        section_key: "contact-owner-spotlight",
        section_type: "image_text",
        title: "Business Owner Spotlight",
        sort_order: 1,
        is_visible: true,
        content: {
          variant: "owner_spotlight",
          eyebrow: "The person behind the work",
          heading: "Personal attention, from first sketch to final fit.",
          paragraphs: [
            "Speak directly with the business owner about your project requirements, measurements, materials, and finish preferences.",
          ],
          image: img("asset:portraits.Portrait2", "Business owner of Afsha Creative Solutions"),
          imagePosition: "left",
          imageBadgeEyebrow: "Business Owner",
          imageBadgeTitle: "Afsha Creative Solutions",
          addressText: "Harthala, Lodhipur, Moradabad, Uttar Pradesh 244001",
          addressHref: "https://maps.google.com/?cid=7804843562812692638",
        },
      },
    ],
  },

  // 11. LOCATION PAGE: METAL GATE MANUFACTURERS MORADABAD
  {
    title: "Metal Gate Manufacturers Moradabad",
    slug: "/locations/metal-gate-manufacturers-moradabad",
    page_type: "location",
    meta_title: "Custom Metal Gate Manufacturers in Moradabad | Afsha Creative Solutions",
    meta_description:
      "Leading custom metal gate manufacturers in Moradabad. We design, fabricate, and install modern stainless steel gates, handcrafted iron gates, and sliding gates made to measure.",
    meta_keywords: DEFAULT_SITE_SETTINGS.seo_defaults.keywords,
    canonical_url: "/locations/metal-gate-manufacturers-moradabad",
    og_image: "/opengraph-image",
    og_image_alt: "Custom Metal Gate Manufacturers in Moradabad",
    structured_data: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Afsha Creative Solutions - Custom Metal Gate Manufacturers",
      image: "https://www.afshacreative.in/videos/hero-poster.webp",
      telephone: "+91-9634776691",
      email: "afshacreativesolutions@gmail.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Near KK Farm House, Bishanpur Road, Harthala, Lodhipur",
        addressLocality: "Moradabad",
        addressRegion: "Uttar Pradesh",
        postalCode: "244001",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "28.8386",
        longitude: "78.7733",
      },
      url: "https://www.afshacreative.in/locations/metal-gate-manufacturers-moradabad",
      areaServed: [
        "Moradabad",
        "Rampur",
        "Sambhal",
        "Amroha",
        "Bareilly",
        "Uttar Pradesh",
        "Delhi NCR",
      ],
      priceRange: "₹₹",
    },
    sections: [
      {
        section_key: "loc-gates-hero",
        section_type: "hero_banner",
        title: "Metal Gates Location Hero",
        sort_order: 0,
        is_visible: true,
        content: {
          variant: "page_hero",
          eyebrow: "Local Manufacturing · Moradabad, Uttar Pradesh",
          heading: "Custom Metal Gates in",
          highlightText: "Moradabad",
          description:
            "Afsha Creative Solutions is Moradabad's trusted manufacturer of custom metal gates. From contemporary stainless steel sliding gates to handcrafted wrought iron driveway entrances, we fabricate made-to-measure security gates built to endure.",
          breadcrumbs: [
            { name: "Home", href: "/" },
            { name: "Locations", href: "/locations/metal-gate-manufacturers-moradabad" },
            {
              name: "Metal Gate Manufacturers Moradabad",
              href: "/locations/metal-gate-manufacturers-moradabad",
            },
          ],
          showBreadcrumbs: true,
          primaryButton: { label: "Request Gate Quote", href: "#quote-section" },
          secondaryButton: { label: "View Gate Designs", href: "#gate-collection" },
          badges: [
            { number: "01", label: "Moradabad Workshop Harthala" },
            { number: "02", label: "Grade 304 Stainless Steel" },
            { number: "03", label: "Hand-Forged Wrought Iron" },
            { number: "04", label: "On-Site Sizing & Fitting" },
          ],
        },
      },
      {
        section_key: "loc-gates-intro",
        section_type: "image_text",
        title: "Local Introduction & Authority",
        sort_order: 1,
        is_visible: true,
        content: {
          variant: "location_intro",
          eyebrow: "Craftsmanship from the City of Metalwork",
          heading: "Engineered for Security, Proportioned for Architecture",
          paragraphs: [
            "Moradabad is world-renowned for metalcraft, and at Afsha Creative Solutions, we combine traditional metalworking skills with modern architectural precision. A driveway gate must do more than close an opening—it defines the architectural elevation of your home, safeguards your family, and withstands decades of daily vehicular movement.",
            "Whether you are constructing a new villa in Ram Ganga Vihar, renovating an ancestral haveli, or building a commercial complex along Delhi Road, our team provides complete site survey, 2D drafting, fabrication, and precision on-site installation.",
          ],
          stats: [
            { value: "304", label: "Grade Stainless Steel" },
            { value: "100%", label: "Made to Measure" },
            { value: "Local", label: "Moradabad Workshop" },
          ],
          image: img(
            "asset:steel_gate.ssGate13",
            "Custom stainless steel gate manufactured in Moradabad"
          ),
          imagePosition: "right",
          imageBadgeEyebrow: "Featured Moradabad Installation",
          imageBadgeTitle: "Motorized SS-304 Double Swing Entrance Gate",
        },
      },
      {
        section_key: "loc-gates-collection",
        section_type: "card_grid",
        title: "Moradabad Gate Collection",
        sort_order: 2,
        is_visible: true,
        content: {
          variant: "location_collection",
          sectionId: "gate-collection",
          background: "darker",
          eyebrow: "Moradabad Gate Collection",
          heading: "Custom Metal Gates Manufactured to Order",
          description:
            "Explore our primary gate fabrication categories. Every design is customized to your pillar-to-pillar opening width, height, and preferred metal alloy.",
          headerLink: { label: "View All Products", href: "/products?category=gates" },
          columns: 4,
          cards: [
            {
              id: "gate-type-1",
              eyebrow: "Grade 304 / 316 Modern Designs",
              title: "Stainless Steel Main Gates",
              description:
                "Sleek, low-maintenance entrance gates engineered from genuine AISI-304 stainless steel. Ideal for modern urban bungalows and commercial buildings requiring rust immunity and clean horizontal louvers.",
              image: img("asset:steel_gate.ssGate13", "Stainless Steel Main Gates"),
              features: [
                "Satin hairline or mirror finish",
                "Laser-cut privacy panels",
                "Seamless TIG argon welded",
              ],
              link: "#quote-section",
              buttonText: "Request Quote",
            },
            {
              id: "gate-type-2",
              eyebrow: "Classical Forged Heritage Styling",
              title: "Handcrafted Wrought Iron Gates",
              description:
                "Artisan wrought iron gates hand-hammered by Moradabad metalworkers. Features heavy-gauge solid pickets, decorative scrolls, spearheads, and multi-stage zinc epoxy anti-corrosive primer.",
              image: img("asset:iron_gates.ironGate3", "Handcrafted Wrought Iron Gates"),
              features: [
                "Traditional European & haveli motifs",
                "Solid bar stock construction",
                "Baked PU / powder finish",
              ],
              link: "#quote-section",
              buttonText: "Request Quote",
            },
            {
              id: "gate-type-3",
              eyebrow: "Space-Saving Driveway Solutions",
              title: "Sliding & Automated Vehicular Gates",
              description:
                "Cantilevered or ground-track sliding gates engineered for driveways with limited turning radius or incline. Pre-fitted with heavy gear racks, guide rollers, and safety stop blocks for smooth motorization.",
              image: img("asset:steel_gate.ssGate1", "Sliding & Automated Vehicular Gates"),
              features: [
                "High-speed smooth bottom track",
                "Italian/Indian DC motor ready",
                "Integrated wicket pass door option",
              ],
              link: "#quote-section",
              buttonText: "Request Quote",
            },
            {
              id: "gate-type-4",
              eyebrow: "Grand Villa & Farmhouse Entrances",
              title: "Estate Boundary & Double Swing Gates",
              description:
                "Wide-span bi-parting double swing gates with heavy-duty ball-bearing pivot hinges, internal drop bolts, and reinforced structural frames that prevent leaf sag over decades of service.",
              image: img("asset:steel_gate.ssGate4", "Estate Boundary & Double Swing Gates"),
              features: [
                "Reinforced perimeter tubing",
                "Drop bolts & deadlock housing",
                "Engineered for high wind load",
              ],
              link: "#quote-section",
              buttonText: "Request Quote",
            },
          ],
        },
      },
      {
        section_key: "loc-gates-workshop",
        section_type: "contact_info",
        title: "Workshop Visit & Service Coverage",
        sort_order: 3,
        is_visible: true,
        content: {
          variant: "workshop_coverage",
          eyebrow: "Visit Our Workshop",
          heading: "Afsha Creative Solutions in Moradabad",
          description:
            "Conveniently located near KK Farm House on Bishanpur Road, Harthala, Lodhipur. We welcome architects, interior contractors, and property owners to discuss gate dimensions, inspect heavy-gauge tubing, and view gates currently in fabrication.",
          address:
            "Near KK Farm House, Bishanpur Road, Harthala, Lodhipur, Moradabad, Uttar Pradesh 244001",
          phoneDisplay: "+91 96347 76691",
          phoneHref: "tel:+919634776691",
          mapLink: {
            label: "Open in Google Maps",
            href: "https://maps.google.com/?cid=7804843562812692638&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAMYASAF&hl=en&gl=IN&source=embed",
            external: true,
          },
          whatsappLink: {
            label: "WhatsApp Workshop",
            href: "https://wa.me/919634776691?text=Hello%20Afsha%20Creative%20Solution%2C%20I%20would%20like%20to%20visit%20your%20workshop%20in%20Moradabad%20for%20a%20metal%20gate.",
            external: true,
          },
          coverageTitle: "Coverage in & around Moradabad",
          coverageDescription:
            "We provide site measurement, transport, and complete installation across:",
          coverageAreas: [
            "Civil Lines, Moradabad",
            "Ram Ganga Vihar, Moradabad",
            "Delhi Road, Moradabad",
            "Kanth Road, Moradabad",
            "Rampur District",
            "Sambhal District",
            "Amroha District",
            "Noida & Delhi NCR",
          ],
        },
      },
      {
        section_key: "loc-gates-faq",
        section_type: "faq",
        title: "Moradabad Metal Gate FAQs",
        sort_order: 4,
        is_visible: true,
        content: {
          variant: "stacked_list",
          background: "darker",
          eyebrow: "Moradabad FAQs",
          heading: "Questions About Metal Gates in Moradabad",
          includeJsonLd: false,
          items: [
            {
              category: "business",
              question: "Where is your metal gate manufacturing workshop located in Moradabad?",
              answer:
                "Our workshop and fabrication yard are located near KK Farm House on Bishanpur Road, Harthala, Lodhipur, Moradabad, Uttar Pradesh 244001. Clients are encouraged to visit to view raw material gauges, inspect welding joints, and consult directly with our metalworkers.",
            },
            {
              category: "business",
              question: "Do you provide on-site measurement in Moradabad and neighboring areas?",
              answer:
                "Yes. Our team conducts on-site measurement surveys across Moradabad city and surrounding localities (including Civil Lines, Ram Ganga Vihar, Delhi Road, Sambhal Road, Kanth Road) as well as nearby districts such as Rampur, Sambhal, and Amroha.",
            },
            {
              category: "customization",
              question: "Can you automate my existing or new metal gate?",
              answer:
                "Yes. All our new sliding and swing gates are engineered motorization-ready with pre-welded actuator mounting plates, cable conduits, and reinforced gear rack bases. We can also recommend and coordinate gate automation hardware.",
            },
            {
              category: "products",
              question: "How do you ensure metal gates don't rust during Moradabad monsoons?",
              answer:
                "For stainless steel, we use certified AISI 304 alloy which naturally resists oxidization. For mild steel and wrought iron, we perform complete surface degreasing, apply two coats of high-build zinc-rich epoxy anti-rust primer, and finish with oven-cured automotive polyurethane or powder coating.",
            },
          ],
        },
      },
      {
        section_key: "loc-gates-quote-form",
        section_type: "contact_info",
        title: "Moradabad Gate Quote Form",
        sort_order: 5,
        is_visible: true,
        content: {
          variant: "quote_form",
          sectionId: "quote-section",
          formEyebrow: "Bespoke Estimation",
          formTitle: "Get a Metal Gate Estimate in Moradabad",
          formSubtitle:
            "Share your opening width, height, and preferred style. Our local Moradabad team will prepare an itemized quote with material specifications.",
          defaultCategory: "gates",
        },
      },
      {
        section_key: "loc-gates-cta",
        section_type: "cta_banner",
        title: "Moradabad Gate Bottom CTA",
        sort_order: 6,
        is_visible: true,
        content: {
          variant: "standard",
          eyebrow: "Local Metal Gate Specialists",
          heading: "Ready to commission your custom gate in Moradabad?",
          description:
            "Connect directly with our workshop team to schedule an on-site dimensional survey or discuss gate automation.",
          primaryButton: {
            label: "Inquire On WhatsApp",
            href: "https://wa.me/919634776691?text=Hello%20Afsha%20Creative%20Solution%2C%20I%20would%20like%20to%20discuss%20a%20custom%20metalwork%20project.",
            external: true,
          },
          secondaryButton: { label: "Explore Gate Catalog", href: "/products?category=gates" },
        },
      },
    ],
  },

  // 12. LOCATION PAGE: IRON RAILING MANUFACTURERS MORADABAD
  {
    title: "Iron Railing Manufacturers Moradabad",
    slug: "/locations/iron-railing-manufacturers-moradabad",
    page_type: "location",
    meta_title: "Iron Railing Manufacturers in Moradabad | Afsha Creative Solutions",
    meta_description:
      "Leading iron railing manufacturers in Moradabad. We fabricate made-to-measure wrought iron balcony railings, staircase balustrades, and modern architectural railings.",
    meta_keywords: DEFAULT_SITE_SETTINGS.seo_defaults.keywords,
    canonical_url: "/locations/iron-railing-manufacturers-moradabad",
    og_image: "/opengraph-image",
    og_image_alt: "Iron Railing Manufacturers in Moradabad",
    structured_data: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Afsha Creative Solutions - Iron Railing Manufacturers",
      image: "https://www.afshacreative.in/videos/hero-poster.webp",
      telephone: "+91-9634776691",
      email: "afshacreativesolutions@gmail.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Near KK Farm House, Bishanpur Road, Harthala, Lodhipur",
        addressLocality: "Moradabad",
        addressRegion: "Uttar Pradesh",
        postalCode: "244001",
        addressCountry: "IN",
      },
      url: "https://www.afshacreative.in/locations/iron-railing-manufacturers-moradabad",
      areaServed: [
        "Moradabad",
        "Bareilly",
        "Rampur",
        "Sambhal",
        "Amroha",
        "Uttar Pradesh",
        "Delhi NCR",
      ],
      priceRange: "₹₹",
    },
    sections: [
      {
        section_key: "loc-railings-hero",
        section_type: "hero_banner",
        title: "Iron Railings Location Hero",
        sort_order: 0,
        is_visible: true,
        content: {
          variant: "page_hero",
          eyebrow: "Architectural Railing Specialists · Moradabad, India",
          heading: "Custom Iron Railings in",
          highlightText: "Moradabad",
          description:
            "Afsha Creative Solutions manufactures bespoke wrought iron and architectural metal railings in Moradabad. Handcrafted balcony balustrades, modern staircase railings, and curved spiral balustrades engineered for safety and aesthetic dignity.",
          breadcrumbs: [
            { name: "Home", href: "/" },
            { name: "Locations", href: "/locations/iron-railing-manufacturers-moradabad" },
            {
              name: "Iron Railing Manufacturers Moradabad",
              href: "/locations/iron-railing-manufacturers-moradabad",
            },
          ],
          showBreadcrumbs: true,
          primaryButton: { label: "Request Railing Quote", href: "#quote-section" },
          secondaryButton: { label: "Explore Railing Designs", href: "#railing-gallery" },
          badges: [
            { number: "01", label: "Child-Safe 4-inch Spacing" },
            { number: "02", label: "Solid Wrought Iron Bar" },
            { number: "03", label: "Core-Drilled Concrete Anchors" },
            { number: "04", label: "Multi-Coat Anti-Rust PU" },
          ],
        },
      },
      {
        section_key: "loc-railings-intro",
        section_type: "image_text",
        title: "Local Railing Expertise",
        sort_order: 1,
        is_visible: true,
        content: {
          variant: "location_intro_cards",
          eyebrow: "Safety & Architectural Grace",
          heading: "Handcrafted Balcony & Staircase Railings in Moradabad",
          paragraphs: [
            "A railing is one of the most tactile architectural features of any residence. You touch it daily, rely on it for safety, and its lines define the perspective of your foyer and exterior elevation. At our Harthala Lodhipur workshop in Moradabad, we engineer iron railings that achieve the ideal synthesis of structural rigidity and ornamental grace.",
            "Unlike lightweight mass-produced hollow railings that vibrate or loosen under load, our balustrades use heavy-gauge solid square bars, forged steel pickets, and core-drilled chemical anchoring.",
          ],
          stats: [
            { value: "39 to 42 Inches", label: "Standard safe balcony height" },
            { value: "100% Solid Welds", label: "Full seam welded & dressed" },
          ],
          image: img(
            "asset:iron_balcony_railing.ironbrail3",
            "Custom iron balcony railing manufactured in Moradabad"
          ),
          imagePosition: "right",
          imageBadgeEyebrow: "Terrace Balcony Installation",
          imageBadgeTitle: "Hand-Forged Wrought Iron Terrace Balustrade",
        },
      },
      {
        section_key: "loc-railings-collection",
        section_type: "card_grid",
        title: "Iron Railing Collections by Application",
        sort_order: 2,
        is_visible: true,
        content: {
          variant: "location_collection",
          sectionId: "railing-gallery",
          background: "darker",
          eyebrow: "Railing Portfolio",
          heading: "Iron Railing Collections by Application",
          description:
            "Explore our primary railing fabrications manufactured in Moradabad for residential, commercial, and hospitality projects.",
          headerLink: { label: "View Collection", href: "/products?category=stair-railings" },
          columns: 4,
          cards: [
            {
              id: "railing-col-1",
              eyebrow: "Exterior Terraces & Verandas",
              title: "Wrought Iron Balcony Railings",
              description:
                "Code-compliant balcony balustrades designed to withstand severe weather while enriching your building elevation. Features child-safe vertical bar spacing and zinc-rich rust-inhibiting primers.",
              image: img("asset:iron_balcony_railing.ironbrail3", "Wrought Iron Balcony Railings"),
              features: [
                "4-inch maximum bar spacing",
                "Solid forged iron pickets",
                "Oven-cured powder coat finish",
              ],
              link: "#quote-section",
              buttonText: "Request Estimate",
            },
            {
              id: "railing-col-2",
              eyebrow: "Interior Duplex & Commercial Stairways",
              title: "Custom Staircase Railings",
              description:
                "Bespoke balustrades contoured to your exact staircase rise, run, and rake angle. Crafted with heavy-gauge newel posts and continuous smooth handrails that flow seamlessly across floor transitions.",
              image: img(
                "asset:iron_stair_railing.ironStairRailling4",
                "Custom Staircase Railings"
              ),
              features: [
                "Core-drilled concrete mounting",
                "Ergonomic continuous handrail",
                "Volute starter newels",
              ],
              link: "#quote-section",
              buttonText: "Request Estimate",
            },
            {
              id: "railing-col-3",
              eyebrow: "Precision Helical Craftsmanship",
              title: "Curved Spiral Staircase Balustrades",
              description:
                "Sculptural curved railings demanding artisan roll-bending and millimeter accuracy. Seamless ground welds deliver fluid helical curvature for both indoor architectural features and outdoor access stairs.",
              image: img(
                "asset:steel_spiral_railing.ssSpiralRailling3",
                "Curved Spiral Staircase Balustrades"
              ),
              features: [
                "Precision artisan roll-bending",
                "Seamless welded joints",
                "High-load structural support",
              ],
              link: "#quote-section",
              buttonText: "Request Estimate",
            },
            {
              id: "railing-col-4",
              eyebrow: "Clean Geometric & Horizontal Bars",
              title: "Modern Minimalist Metal Railings",
              description:
                "Understated, contemporary balustrades built with solid flat bars and square tubing. Complements modern minimalist interiors, glass balconies, and commercial architectural façades.",
              image: img(
                "asset:steel_stair_railing.ssStairRailling8",
                "Modern Minimalist Metal Railings"
              ),
              features: [
                "Contemporary flat-bar styling",
                "Concealed fastener floor plates",
                "Zero visual clutter",
              ],
              link: "#quote-section",
              buttonText: "Request Estimate",
            },
          ],
        },
      },
      {
        section_key: "loc-railings-specs",
        section_type: "card_grid",
        title: "Railing Customization Specifications",
        sort_order: 3,
        is_visible: true,
        content: {
          variant: "assurance_strip",
          background: "default",
          eyebrow: "Customization Specifications",
          heading: "Engineered Around Your Staircase & Balcony",
          description:
            "Every element of your railing system can be personalized to match your interior architectural palette.",
          columns: 3,
          cards: [
            {
              id: "rail-spec-1",
              eyebrow: "Handrail Profile",
              title: "Continuous Contours",
              description:
                "Available in ergonomic round tube, modern flat bar, cast brass cap trim, or grooved channel ready to receive solid teak wood handrails.",
            },
            {
              id: "rail-spec-2",
              eyebrow: "Anchoring System",
              title: "Heavy-Duty Core Drilling",
              description:
                "Newels and posts are core-drilled directly into RCC slabs with high-strength chemical anchors, topped with silicone-sealed decorative escutcheon plates.",
            },
            {
              id: "rail-spec-3",
              eyebrow: "Finish Coatings",
              title: "Electrostatic Powder Bake",
              description:
                "Choose from matte raven black, antique bronze patina, hammer-tone charcoal, satin champagne gold, or high-gloss automotive polyurethane paint.",
            },
          ],
        },
      },
      {
        section_key: "loc-railings-faq",
        section_type: "faq",
        title: "Railing FAQs in Moradabad",
        sort_order: 4,
        is_visible: true,
        content: {
          variant: "stacked_list",
          background: "darker",
          eyebrow: "Railing FAQs",
          heading: "Questions About Railings in Moradabad",
          includeJsonLd: false,
          items: [
            {
              category: "products",
              question: "What safety regulations do you follow for balcony railings in Moradabad?",
              answer:
                "All our residential and commercial balcony railings are fabricated to a minimum finished height of 39 to 42 inches (1,000mm to 1,066mm) from the finished floor level. Vertical bar clearances never exceed 4 inches (100mm) center-to-center to ensure small children cannot slip through.",
            },
            {
              category: "products",
              question: "How do you protect exterior iron railings from rusting in rainy seasons?",
              answer:
                "Exterior iron railings in Moradabad receive multi-stage anti-corrosion protection: complete mechanical descaling, application of a high-build zinc-rich epoxy anti-rust primer, and a two-coat automotive polyurethane (PU) finish or electrostatic oven-baked powder coating.",
            },
            {
              category: "customization",
              question: "Can you fit custom wooden or brass handrails on top of iron balustrades?",
              answer:
                "Yes. Many of our staircase clients prefer pairing solid forged iron pickets with a warm polished teak wood or brass-trimmed handrail. We fabricate custom top mounting channels that allow secure, concealed fastening of wooden or metal top rails.",
            },
            {
              category: "customization",
              question: "Do you take measurements on-site for curved or uneven stairs?",
              answer:
                "Yes. Staircases rarely follow perfectly theoretical angles. Our Moradabad technicians visit your site to template the exact rise, tread depth, and landing radius before cutting metal in our workshop.",
            },
          ],
        },
      },
      {
        section_key: "loc-railings-quote-form",
        section_type: "contact_info",
        title: "Moradabad Railing Quote Form",
        sort_order: 5,
        is_visible: true,
        content: {
          variant: "quote_form",
          sectionId: "quote-section",
          formEyebrow: "Bespoke Estimation",
          formTitle: "Get an Iron Railing Estimate in Moradabad",
          formSubtitle:
            "Share your approximate running feet, staircase rise/run, or balcony dimensions. Our Moradabad workshop team will provide an itemized proposal.",
          defaultCategory: "balcony-railings",
        },
      },
      {
        section_key: "loc-railings-cta",
        section_type: "cta_banner",
        title: "Moradabad Railings Bottom CTA",
        sort_order: 6,
        is_visible: true,
        content: {
          variant: "standard",
          eyebrow: "Architectural Iron Railings",
          heading: "Ready to elevate your staircases and balconies?",
          description:
            "Connect with our fabrication team to discuss your drawings, schedule a site survey, or visit our Moradabad facility.",
          primaryButton: {
            label: "Message On WhatsApp",
            href: "https://wa.me/919634776691?text=Hello%20Afsha%20Creative%20Solution%2C%20I%20would%20like%20to%20discuss%20a%20custom%20metalwork%20project.",
            external: true,
          },
          secondaryButton: {
            label: "Explore Railings Collection",
            href: "/products?category=stair-railings",
          },
        },
      },
    ],
  },
];

export function findSeedPageBySlug(slug: string): SeedPageDef | null {
  return SEED_CMS_PAGES.find((p) => p.slug === slug) ?? null;
}
