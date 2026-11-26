import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CMSPageRenderer from "@/components/cms/CMSPageRenderer";
import { STATIC_BLOG_POSTS } from "@/lib/blog-data";
import { getPublicBlogPosts, getPublicCategories, getPublicProducts } from "@/lib/catalog";
import { getCmsPageForRender } from "@/lib/cms/queries";
import { buildCmsPageMetadata } from "@/lib/cms/seo";
import { getSupabaseConfig } from "@/lib/supabase/env";

export const revalidate = 300;

type DynamicCmsPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: DynamicCmsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getCmsPageForRender(`/${slug}`);
  return buildCmsPageMetadata(page, `/${slug}`);
}

export default async function DynamicCmsPage({ params }: DynamicCmsPageProps) {
  const { slug } = await params;
  const page = await getCmsPageForRender(`/${slug}`);
  if (!page) notFound();

  const needsCatalog = page.sections.some(
    (s) =>
      s.section_type === "product_category_grid" ||
      s.section_type === "gallery" ||
      s.section_type === "contact_info"
  );
  const needsBlog = page.sections.some(
    (s) => s.section_type === "rich_text" && (s.content as { variant?: string })?.variant === "blog_index"
  );

  const [products, categories, blogPosts] = await Promise.all([
    needsCatalog ? getPublicProducts() : Promise.resolve([]),
    needsCatalog ? getPublicCategories() : Promise.resolve([]),
    needsBlog ? getPublicBlogPosts() : Promise.resolve([]),
  ]);

  const mergedBlogPosts = needsBlog
    ? [
        ...STATIC_BLOG_POSTS,
        ...blogPosts
          .filter((p) => !STATIC_BLOG_POSTS.some((sp) => sp.slug === p.slug))
          .map((p) => ({
            ...p,
            category: "Architectural Metalwork",
            readTime: "5 min read",
            author: "Afsha Creative Solutions",
          })),
      ]
    : undefined;

  return (
    <CMSPageRenderer
      page={page}
      context={{
        products,
        categories,
        isSupabaseConfigured: Boolean(getSupabaseConfig()),
        blogPosts: mergedBlogPosts,
      }}
    />
  );
}
