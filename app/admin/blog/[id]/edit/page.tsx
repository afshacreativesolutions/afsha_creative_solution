import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminBlogPost } from "@/lib/catalog";
import AdminNav from "../../../admin-nav";
import BlogForm from "../../blog-form";

type EditPageProps = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> };

export const metadata = { title: "Edit Article | Afsha Creative Solution" };

export default async function EditBlogPage({ params, searchParams }: EditPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const [, post] = await Promise.all([
    requireAdmin(),
    getAdminBlogPost(id),
  ]);
  if (!post) notFound();
  return (
    <main className="min-h-[75vh] bg-background text-white">
      <AdminNav />
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <BlogForm post={post} saved={query.saved === "1"} />
      </div>
    </main>
  );
}