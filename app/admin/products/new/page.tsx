import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminCategories } from "@/lib/catalog";
import AdminNav from "../../admin-nav";
import ProductForm from "../product-form";

export const metadata: Metadata = { title: "Add Product | Afsha Creative Solution" };

export default async function NewProductPage() {
  const [, categories] = await Promise.all([
    requireAdmin(),
    getAdminCategories(),
  ]);
  return <main className="min-h-[75vh] bg-background text-white"><AdminNav /><div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12"><div className="mb-8"><p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-textGold">Catalog management</p><h1 className="text-3xl font-light">Add a product</h1></div><ProductForm categories={categories} initialImages={[]} /></div></main>;
}
