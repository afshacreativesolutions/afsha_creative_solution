import type { Metadata } from "next";
import AdminBreadcrumbs from "@/components/admin/AdminBreadcrumbs";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminCategories } from "@/lib/catalog";
import ProductForm from "../product-form";

export const metadata: Metadata = { title: "Add Product | Afsha Creative Solution" };

export default async function NewProductPage() {
  await requireAdmin();
  const categories = await getAdminCategories();

  return (
    <main className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <AdminBreadcrumbs
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Products", href: "/admin/products" },
          { label: "Add Product" },
        ]}
      />
      <AdminPageHeader
        eyebrow="Catalog Management"
        title="Add Product"
        description="Create a catalog design with specifications, imagery, and search metadata."
      />
      <ProductForm categories={categories} initialImages={[]} />
    </main>
  );
}
