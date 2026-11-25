import type { Metadata } from "next";
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
  BUSINESS_PHONE_DISPLAY,
  BUSINESS_EMAIL,
  BUSINESS_ADDRESS,
  absoluteUrl,
} from "@/lib/seo";

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

export const metadata: Metadata = {
  metadataBase: new URL(PRODUCTION_SITE_URL),
  title: {
    default: "Custom Metal Gates & Railings in Moradabad | Afsha Creative Solution",
    template: "%s | Afsha Creative Solution",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: DEFAULT_KEYWORDS,
  authors: [{ name: SITE_NAME, url: PRODUCTION_SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: PRODUCTION_SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: PRODUCTION_SITE_URL,
    siteName: SITE_NAME,
    title: "Custom Metal Gates & Railings in Moradabad | Afsha Creative Solution",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: absoluteUrl("/opengraph-image"),
        width: 1200,
        height: 630,
        alt: "Afsha Creative Solution — Architectural Metalwork",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Metal Gates & Railings in Moradabad | Afsha Creative Solution",
    description: SITE_DESCRIPTION,
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

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: PRODUCTION_SITE_URL,
  email: BUSINESS_EMAIL,
  telephone: "+91-9634776691",
  address: {
    "@type": "PostalAddress",
    streetAddress: BUSINESS_ADDRESS.streetAddress,
    addressLocality: BUSINESS_ADDRESS.addressLocality,
    addressRegion: BUSINESS_ADDRESS.addressRegion,
    postalCode: BUSINESS_ADDRESS.postalCode,
    addressCountry: BUSINESS_ADDRESS.addressCountry,
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: SITE_NAME,
  url: PRODUCTION_SITE_URL,
  email: BUSINESS_EMAIL,
  telephone: "+91-9634776691",
  address: {
    "@type": "PostalAddress",
    streetAddress: BUSINESS_ADDRESS.streetAddress,
    addressLocality: BUSINESS_ADDRESS.addressLocality,
    addressRegion: BUSINESS_ADDRESS.addressRegion,
    postalCode: BUSINESS_ADDRESS.postalCode,
    addressCountry: BUSINESS_ADDRESS.addressCountry,
  },
  areaServed: "Moradabad, Uttar Pradesh, India",
  priceRange: "₹₹₹",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: PRODUCTION_SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${PRODUCTION_SITE_URL}/products?search={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
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
      <body className="min-h-full flex flex-col font-sans">
        <JsonLd data={[organizationSchema, localBusinessSchema, websiteSchema]} />
        <Analytics />
        <ConsentProvider>
          <NavigationTracker />
          <MenuProvider>
            <Navbar />
            <Menu />
            <Whatsapp />
            {children}
            <Footer />
            <CookieBanner />
            <CookieSettingsModal />
          </MenuProvider>
        </ConsentProvider>
      </body>
    </html>
  );
}
