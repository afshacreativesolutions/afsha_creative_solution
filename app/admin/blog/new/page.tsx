import AdminBreadcrumbs from "@/components/admin/AdminBreadcrumbs";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { requireAdmin } from "@/lib/admin-auth";
import BlogForm from "../blog-form";

export const metadata = { title: "New Article | Afsha Creative Solution" };

export default async function NewBlogPage() {
  await requireAdmin();

  return (
    <main className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <AdminBreadcrumbs
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Blog Articles", href: "/admin/blog" },
          { label: "New Article" },
        ]}
      />
      <AdminPageHeader
        eyebrow="Editorial & Guides"
        title="Add Blog Article"
        description="Write a guide with structured paragraphs, featured imagery, and SEO metadata."
      />
      <BlogForm />
    </main>
  );
}
