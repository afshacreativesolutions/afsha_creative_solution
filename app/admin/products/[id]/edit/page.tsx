import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminBreadcrumbs from "@/components/admin/AdminBreadcrumbs";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminCategories, getAdminProduct } from "@/lib/catalog";
import ProductForm from "../../product-form";

export const metadata: Metadata = { title: "Edit Product | Afsha Creative Solution" };
type PageProps = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> };

export default async function EditProductPage({ params, searchParams }: PageProps) {
  await requireAdmin();
  const [{ id }, { saved }] = await Promise.all([params, searchParams]);
  const [product, categories] = await Promise.all([
    getAdminProduct(id),
    getAdminCategories(),
  ]);

  if (!product) notFound();

  const initialImages = product.images.map((image) => ({
    storage_path: image.storage_path,
    alt_text: image.alt_text,
    url: image.url ?? "",
  }));

  return (
    <main className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <AdminBreadcrumbs
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Products", href: "/admin/products" },
          { label: product.name },
        ]}
      />
      <AdminPageHeader
        eyebrow="Catalog Management"
        title={`Edit: ${product.name}`}
        description="Update product copy, specs, image ordering, and live publication status."
      />
      <ProductForm
        categories={categories}
        product={product}
        initialImages={initialImages}
        saved={saved === "1"}
      />
    </main>
  );
}
