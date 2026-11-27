import Link from "next/link";
import { Plus } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { ADMIN_BTN_PRIMARY } from "@/components/admin/admin-styles";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminProducts } from "@/lib/catalog";
import { getSupabaseConfig } from "@/lib/supabase/env";
import AdminProductTable from "./product-table";

export const metadata = { title: "Products Admin | Afsha Creative Solution" };

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = await getAdminProducts();
  const configured = Boolean(getSupabaseConfig());

  return (
    <main className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <AdminPageHeader
        eyebrow="Catalog Management"
        title="Products"
        description={`${products.length} catalog products · manage designs, galleries, SEO, and publishing status.`}
        actions={
          <Link href="/admin/products/new" prefetch={false} className={`${ADMIN_BTN_PRIMARY} w-full sm:w-auto`}>
            <Plus size={15} />
            <span>Add Product</span>
          </Link>
        }
      />

      {!configured && (
        <p className="mb-6 rounded-xl border border-amber-500/35 bg-amber-950/30 p-4 text-xs text-amber-100 sm:text-sm">
          Supabase is not configured. Add environment variables and apply migrations before
          managing products.
        </p>
      )}

      <AdminProductTable products={products} />
    </main>
  );
}
