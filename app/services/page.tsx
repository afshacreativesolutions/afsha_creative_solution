import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CMSPageRenderer from "@/components/cms/CMSPageRenderer";
import { getCmsPageForRender } from "@/lib/cms/queries";
import { buildCmsPageMetadata } from "@/lib/cms/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPageForRender("/services");
  return buildCmsPageMetadata(page, "/services");
}

export default async function ServicesPage() {
  const page = await getCmsPageForRender("/services");
  if (!page) notFound();
  return <CMSPageRenderer page={page} />;
}
