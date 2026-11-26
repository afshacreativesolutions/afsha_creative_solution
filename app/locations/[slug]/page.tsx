import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CMSPageRenderer from "@/components/cms/CMSPageRenderer";
import { getCmsPageForRender } from "@/lib/cms/queries";
import { buildCmsPageMetadata } from "@/lib/cms/seo";

export const revalidate = 300;

type LocationPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getCmsPageForRender(`/locations/${slug}`);
  return buildCmsPageMetadata(page, `/locations/${slug}`);
}

export default async function DynamicLocationPage({ params }: LocationPageProps) {
  const { slug } = await params;
  const page = await getCmsPageForRender(`/locations/${slug}`);
  if (!page) notFound();
  return <CMSPageRenderer page={page} />;
}
