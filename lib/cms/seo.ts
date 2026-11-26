import type { Metadata } from "next";
import {
  absoluteUrl,
  canonicalUrl,
  DEFAULT_KEYWORDS,
  SITE_NAME,
} from "@/lib/seo";
import { deriveCmsMediaPublicUrl } from "./media";
import type { ResolvedCmsPage } from "./types";

function resolveOgImageUrl(ogImage: string | null | undefined): string {
  if (!ogImage) return absoluteUrl("/opengraph-image");
  if (ogImage.startsWith("http://") || ogImage.startsWith("https://")) {
    return ogImage;
  }
  if (ogImage.startsWith("/")) {
    return absoluteUrl(ogImage);
  }
  return deriveCmsMediaPublicUrl(ogImage);
}

export function buildCmsPageMetadata(
  page: ResolvedCmsPage | null,
  fallbackPath: string
): Metadata {
  if (!page) {
    return {
      title: `Page Not Found | ${SITE_NAME}`,
      robots: { index: false, follow: false },
    };
  }

  const title = page.meta_title || `${page.title} | ${SITE_NAME}`;
  const description = page.meta_description || undefined;
  const canonical = canonicalUrl(page.canonical_url || page.slug || fallbackPath);
  const ogImageUrl = resolveOgImageUrl(page.og_image);

  return {
    title,
    description,
    keywords: page.meta_keywords?.length ? page.meta_keywords : DEFAULT_KEYWORDS,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: SITE_NAME,
      title,
      description,
      url: canonical,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: page.og_image_alt || title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
    ...(page.isDraftPreview
      ? {
          robots: {
            index: false,
            follow: false,
          },
        }
      : {}),
  };
}
