import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CMSPageRenderer from "@/components/cms/CMSPageRenderer";
import { getCmsPageForRender } from "@/lib/cms/queries";
import { buildCmsPageMetadata } from "@/lib/cms/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPageForRender("/locations/metal-gate-manufacturers-moradabad");
  return buildCmsPageMetadata(page, "/locations/metal-gate-manufacturers-moradabad");
}

export default async function MetalGateManufacturersMoradabadPage() {
  const page = await getCmsPageForRender("/locations/metal-gate-manufacturers-moradabad");
  if (!page) notFound();
  return <CMSPageRenderer page={page} />;
}
