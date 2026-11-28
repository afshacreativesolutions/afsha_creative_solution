import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CMSPageRenderer from "@/components/cms/CMSPageRenderer";
import { getPublicProducts } from "@/lib/catalog";
import { getCmsPageForRender, getPublishedCmsSiteSettings } from "@/lib/cms/queries";
import { buildCmsPageMetadata } from "@/lib/cms/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPageForRender("/gallery");
  return buildCmsPageMetadata(page, "/gallery");
}

export default async function GalleryPage() {
  const [page, products, siteSettings] = await Promise.all([
    getCmsPageForRender("/gallery"),
    getPublicProducts(),
    getPublishedCmsSiteSettings(),
  ]);
  if (!page) notFound();
  return (
    <CMSPageRenderer
      page={page}
      context={{
        products,
        whatsappNumber: siteSettings.site_identity.whatsappNumber,
      }}
    />
  );
}
