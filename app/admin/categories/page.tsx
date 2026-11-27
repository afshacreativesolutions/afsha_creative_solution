import type { Metadata } from "next";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminCategories } from "@/lib/catalog";
import CategoryManager from "./category-manager";

export const metadata: Metadata = { title: "Categories Admin | Afsha Creative Solution" };
type PageProps = { searchParams: Promise<{ saved?: string }> };

export default async function AdminCategoriesPage({ searchParams }: PageProps) {
  await requireAdmin();
  const [categories, query] = await Promise.all([getAdminCategories(), searchParams]);

  return (
    <main className="mx-auto max-w-5xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <AdminPageHeader
        eyebrow="Catalog Management"
        title="Categories"
        description="Create, rename, sort, and activate/deactivate product categories."
      />
      <CategoryManager categories={categories} saved={query.saved === "1"} />
    </main>
  );
}
