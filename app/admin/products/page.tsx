import Link from "next/link";
import { Plus } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminProducts } from "@/lib/catalog";
import { getSupabaseConfig } from "@/lib/supabase/env";
import AdminNav from "../admin-nav";
import AdminProductTable from "./product-table";

export const metadata = { title: "Products Admin | Afsha Creative Solution" };

export default async function AdminProductsPage() {
  const [, products] = await Promise.all([
    requireAdmin(),
    getAdminProducts(),
  ]);
  const configured = Boolean(getSupabaseConfig());

  return <main className="min-h-[75vh] bg-background text-white">
    <AdminNav />
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div><p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-textGold">Catalog management</p><h1 className="text-4xl font-light">Products</h1><p className="mt-3 text-sm text-white/45">{products.length} products · edit content, images, and publishing status</p></div>
        <Link href="/admin/products/new" className="inline-flex items-center gap-2 border border-textGold/60 px-5 py-3 text-[10px] uppercase tracking-[0.16em] text-textGold transition-colors hover:bg-textGold hover:text-black"><Plus size={14} /> Add product</Link>
      </div>
      {!configured && <p className="mb-6 border border-amber-900/60 bg-amber-950/20 p-4 text-sm text-amber-100">Supabase is not configured. Add the environment variables and apply the migration before managing products.</p>}
      <AdminProductTable products={products} />
    </div>
  </main>;
}
