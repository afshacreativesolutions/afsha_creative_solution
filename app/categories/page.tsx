import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CMSPageRenderer from "@/components/cms/CMSPageRenderer";
import { getPublicCategories, getPublicProducts } from "@/lib/catalog";
import { getCmsPageForRender } from "@/lib/cms/queries";
import { buildCmsPageMetadata } from "@/lib/cms/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPageForRender("/categories");
  return buildCmsPageMetadata(page, "/categories");
}

export default async function CategoriesIndexPage() {
  const [page, products, categories] = await Promise.all([
    getCmsPageForRender("/categories"),
    getPublicProducts(),
    getPublicCategories(),
  ]);
  if (!page) notFound();
  return <CMSPageRenderer page={page} context={{ products, categories }} />;
}
