import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CMSPageRenderer from "@/components/cms/CMSPageRenderer";
import { getPublicCategories, getPublicProducts } from "@/lib/catalog";
import { getCmsPageForRender, getPublishedCmsSiteSettings } from "@/lib/cms/queries";
import { buildCmsPageMetadata } from "@/lib/cms/seo";
import { getSupabaseConfig } from "@/lib/supabase/env";

type ProductsPageProps = {
  searchParams: Promise<{ category?: string; material?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPageForRender("/products");
  return buildCmsPageMetadata(page, "/products");
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const filters = await searchParams;
  const [page, products, categories, siteSettings] = await Promise.all([
    getCmsPageForRender("/products"),
    getPublicProducts(),
    getPublicCategories(),
    getPublishedCmsSiteSettings(),
  ]);

  if (!page) notFound();

  return (
    <CMSPageRenderer
      page={page}
      context={{
        products,
        categories,
        initialCategory: filters.category ?? "all",
        initialMaterial: filters.material ?? "all",
        isSupabaseConfigured: Boolean(getSupabaseConfig()),
        whatsappNumber: siteSettings.site_identity.whatsappNumber,
      }}
    />
  );
}
