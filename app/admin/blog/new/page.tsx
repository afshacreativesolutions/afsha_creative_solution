import { requireAdmin } from "@/lib/admin-auth";
import { getAdminCategories } from "@/lib/catalog";
import AdminNav from "../../admin-nav";
import BlogForm from "../blog-form";

export const metadata = { title: "New Article | Afsha Creative Solution" };

export default async function NewBlogPage() {
  await requireAdmin();
  return (
    <main className="min-h-[75vh] bg-background text-white">
      <AdminNav />
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <BlogForm />
      </div>
    </main>
  );
}