import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CMSPageRenderer from "@/components/cms/CMSPageRenderer";
import { getPublicCategories, getPublicProducts } from "@/lib/catalog";
import { getCmsPageForRender } from "@/lib/cms/queries";
import { buildCmsPageMetadata } from "@/lib/cms/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPageForRender("/");
  return buildCmsPageMetadata(page, "/");
}

export default async function Home() {
  const [page, products, categories] = await Promise.all([
    getCmsPageForRender("/"),
    getPublicProducts(),
    getPublicCategories(),
  ]);

  if (!page) notFound();

  return (
    <>
      <link
        rel="preload"
        as="image"
        href="/videos/hero-poster.webp"
        type="image/webp"
        fetchPriority="high"
      />
      <CMSPageRenderer page={page} context={{ products, categories }} />
    </>
  );
}
