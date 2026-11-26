import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CMSPageRenderer from "@/components/cms/CMSPageRenderer";
import { getPublicCategories } from "@/lib/catalog";
import { getCmsPageForRender } from "@/lib/cms/queries";
import { buildCmsPageMetadata } from "@/lib/cms/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPageForRender("/contact");
  return buildCmsPageMetadata(page, "/contact");
}

export default async function ContactPage() {
  const [page, categories] = await Promise.all([
    getCmsPageForRender("/contact"),
    getPublicCategories(),
  ]);
  if (!page) notFound();
  return <CMSPageRenderer page={page} context={{ categories }} />;
}
