import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CMSPageRenderer from "@/components/cms/CMSPageRenderer";
import { getCmsPageForRender } from "@/lib/cms/queries";
import { buildCmsPageMetadata } from "@/lib/cms/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPageForRender("/faq");
  return buildCmsPageMetadata(page, "/faq");
}

export default async function FaqPage() {
  const page = await getCmsPageForRender("/faq");
  if (!page) notFound();
  return <CMSPageRenderer page={page} />;
}
