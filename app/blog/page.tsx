import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CMSPageRenderer from "@/components/cms/CMSPageRenderer";
import { STATIC_BLOG_POSTS, type StaticBlogPost } from "@/lib/blog-data";
import { getPublicBlogPosts } from "@/lib/catalog";
import { getCmsPageForRender } from "@/lib/cms/queries";
import { buildCmsPageMetadata } from "@/lib/cms/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPageForRender("/blog");
  return buildCmsPageMetadata(page, "/blog");
}

export default async function BlogPage() {
  const [page, postsFromDb] = await Promise.all([
    getCmsPageForRender("/blog"),
    getPublicBlogPosts(),
  ]);
  if (!page) notFound();

  const mergedPosts: StaticBlogPost[] = STATIC_BLOG_POSTS.map((staticPost) => {
    const dbMatch = postsFromDb.find((p) => p.slug === staticPost.slug);
    if (!dbMatch) return staticPost;
    return {
      ...staticPost,
      title: dbMatch.title || staticPost.title,
      excerpt: dbMatch.excerpt || staticPost.excerpt,
      content: dbMatch.content || staticPost.content,
      featured_image: dbMatch.featured_image || staticPost.featured_image,
      published_at: dbMatch.published_at || staticPost.published_at,
    };
  });

  for (const dbPost of postsFromDb) {
    if (!mergedPosts.some((p) => p.slug === dbPost.slug)) {
      mergedPosts.push({
        ...dbPost,
        category: "Architectural Metalwork",
        readTime: "5 min read",
        author: "Afsha Creative Solutions",
      });
    }
  }

  return <CMSPageRenderer page={page} context={{ blogPosts: mergedPosts }} />;
}
