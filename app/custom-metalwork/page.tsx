import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CMSPageRenderer from "@/components/cms/CMSPageRenderer";
import { getCmsPageForRender } from "@/lib/cms/queries";
import { buildCmsPageMetadata } from "@/lib/cms/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPageForRender("/custom-metalwork");
  return buildCmsPageMetadata(page, "/custom-metalwork");
}

export default async function CustomMetalworkPage() {
  const page = await getCmsPageForRender("/custom-metalwork");
  if (!page) notFound();
  return <CMSPageRenderer page={page} />;
}
