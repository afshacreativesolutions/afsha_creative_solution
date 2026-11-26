import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CMSPageRenderer from "@/components/cms/CMSPageRenderer";
import { getCmsPageForRender } from "@/lib/cms/queries";
import { buildCmsPageMetadata } from "@/lib/cms/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPageForRender("/locations/iron-railing-manufacturers-moradabad");
  return buildCmsPageMetadata(page, "/locations/iron-railing-manufacturers-moradabad");
}

export default async function IronRailingManufacturersMoradabadPage() {
  const page = await getCmsPageForRender("/locations/iron-railing-manufacturers-moradabad");
  if (!page) notFound();
  return <CMSPageRenderer page={page} />;
}
