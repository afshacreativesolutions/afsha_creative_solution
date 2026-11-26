import type { Metadata } from "next";
// import { Analytics as VercelAnalytics } from "@vercel/analytics/next"
import { Geist, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";
import Footer from "@/components/Footer";
import Whatsapp from "@/components/Whatsapp";
import Menu from "@/components/Menu";
import { MenuProvider } from "@/context/menuContext";
import JsonLd from "@/components/JsonLd";
import Analytics from "@/components/Analytics";
import { ConsentProvider } from "@/components/consent/ConsentProvider";
import CookieBanner from "@/components/consent/CookieBanner";
import CookieSettingsModal from "@/components/consent/CookieSettingsModal";
import NavigationTracker from "@/components/tracking/NavigationTracker";
import {
  DEFAULT_KEYWORDS,
  PRODUCTION_SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  BUSINESS_EMAIL,
  BUSINESS_ADDRESS,
  absoluteUrl,
} from "@/lib/seo";
import { getPublishedCmsSiteSettings } from "@/lib/cms/queries";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublishedCmsSiteSettings().catch(() => null);
  const seo = settings?.seo_defaults;
  const siteName = settings?.site_identity.siteName || SITE_NAME;
  const defaultTitle =
    seo?.defaultTitle || "Custom Metal Gates & Railings in Moradabad | Afsha Creative Solution";
  const titleTemplate = seo?.titleTemplate || "%s | Afsha Creative Solution";
  const description = seo?.defaultDescription || SITE_DESCRIPTION;
  const keywords = seo?.keywords?.length ? seo.keywords : DEFAULT_KEYWORDS;
  const ogAlt = seo?.ogImageAlt || "Afsha Creative Solution — Architectural Metalwork";

  return {
    metadataBase: new URL(PRODUCTION_SITE_URL),
    title: {
      default: defaultTitle,
      template: titleTemplate,
    },
    description,
    applicationName: siteName,
    keywords,
    authors: [{ name: siteName, url: PRODUCTION_SITE_URL }],
    creator: siteName,
    publisher: siteName,
    alternates: {
      canonical: PRODUCTION_SITE_URL,
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: PRODUCTION_SITE_URL,
      siteName,
      title: defaultTitle,
      description,
      images: [
        {
          url: absoluteUrl("/opengraph-image"),
          width: 1200,
          height: 630,
          alt: ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description,
      images: [absoluteUrl("/opengraph-image")],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getPublishedCmsSiteSettings().catch(() => null);
  const id = settings?.site_identity;
  const seo = settings?.seo_defaults;

  const siteName = id?.siteName || SITE_NAME;
  const email = id?.email || BUSINESS_EMAIL;
  const telephone = id?.phoneDisplay || "+91-9634776691";
  const address = {
    "@type": "PostalAddress",
    streetAddress: id?.streetAddress || BUSINESS_ADDRESS.streetAddress,
    addressLocality: id?.city || BUSINESS_ADDRESS.addressLocality,
    addressRegion: id?.state || BUSINESS_ADDRESS.addressRegion,
    postalCode: id?.postalCode || BUSINESS_ADDRESS.postalCode,
    addressCountry: id?.country || BUSINESS_ADDRESS.addressCountry,
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: PRODUCTION_SITE_URL,
    email,
    telephone,
    address,
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteName,
    url: PRODUCTION_SITE_URL,
    email,
    telephone,
    address,
    areaServed: seo?.areaServed || "Moradabad, Uttar Pradesh, India",
    priceRange: seo?.priceRange || "₹₹₹",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: PRODUCTION_SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${PRODUCTION_SITE_URL}/products?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", geist.variable, outfit.variable)}
    >
      <head>
        <link
          rel="preload"
          as="image"
          href="/videos/hero-poster.webp"
          type="image/webp"
          fetchPriority="high"
        />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <JsonLd data={[organizationSchema, localBusinessSchema, websiteSchema]} />

        <Analytics />
        <ConsentProvider>
          <NavigationTracker />
          <MenuProvider>
            <Navbar navigation={settings?.navigation} identity={settings?.site_identity} />
            <Menu megaMenu={settings?.mega_menu} />
            <Whatsapp identity={settings?.site_identity} />
            {children}
            <Footer footer={settings?.footer} identity={settings?.site_identity} />
            <CookieBanner />
            <CookieSettingsModal />
          </MenuProvider>
        </ConsentProvider>
      </body>
    </html>
  );
}
