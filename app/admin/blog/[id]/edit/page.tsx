import { notFound } from "next/navigation";
import AdminBreadcrumbs from "@/components/admin/AdminBreadcrumbs";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminBlogPost } from "@/lib/catalog";
import BlogForm from "../../blog-form";

type EditPageProps = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> };

export const metadata = { title: "Edit Article | Afsha Creative Solution" };

export default async function EditBlogPage({ params, searchParams }: EditPageProps) {
  await requireAdmin();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const post = await getAdminBlogPost(id);

  if (!post) notFound();

  return (
    <main className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <AdminBreadcrumbs
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Blog Articles", href: "/admin/blog" },
          { label: post.title },
        ]}
      />
      <AdminPageHeader
        eyebrow="Editorial & Guides"
        title={`Edit: ${post.title}`}
        description="Refine article copy, publishing schedule, featured image, and SEO metadata."
      />
      <BlogForm post={post} saved={query.saved === "1"} />
    </main>
  );
}
