import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { STATIC_BLOG_POSTS } from "@/lib/blog-data";
import { getPublicBlogPosts, getPublicCategories, getPublicProducts } from "@/lib/catalog";
import { getAdminCmsPageEditorData } from "@/lib/cms/queries";
import { getSupabaseConfig } from "@/lib/supabase/env";
import VisualPageEditor from "./visual-page-editor";

export const dynamic = "force-dynamic";

type EditorPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminVisualPageEditorPage({ params }: EditorPageProps) {
  await requireAdmin();
  const { id } = await params;

  const [editorData, products, categories, blogPosts] = await Promise.all([
    getAdminCmsPageEditorData(id),
    getPublicProducts().catch(() => []),
    getPublicCategories().catch(() => []),
    getPublicBlogPosts().catch(() => []),
  ]);

  if (!editorData) {
    notFound();
  }

  const mergedBlogPosts = [
    ...STATIC_BLOG_POSTS,
    ...blogPosts
      .filter((p) => !STATIC_BLOG_POSTS.some((sp) => sp.slug === p.slug))
      .map((p) => ({
        ...p,
        category: "Architectural Metalwork",
        readTime: "5 min read",
        author: "Afsha Creative Solutions",
      })),
  ];

  return (
    <VisualPageEditor
      page={editorData.page}
      initialDraftMeta={editorData.draftMeta}
      initialSections={editorData.sections}
      initialRevisions={editorData.revisions}
      previewContext={{
        products,
        categories,
        isSupabaseConfigured: Boolean(getSupabaseConfig()),
        blogPosts: mergedBlogPosts,
      }}
    />
  );
}
