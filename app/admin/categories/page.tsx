import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminCategories } from "@/lib/catalog";
import AdminNav from "../admin-nav";
import CategoryManager from "./category-manager";

export const metadata: Metadata = { title: "Categories Admin | Afsha Creative Solution" };
type PageProps = { searchParams: Promise<{ saved?: string }> };

export default async function AdminCategoriesPage({ searchParams }: PageProps) {
  const [, categories, query] = await Promise.all([
    requireAdmin(),
    getAdminCategories(),
    searchParams,
  ]);
  return <main className="min-h-[75vh] bg-background text-white"><AdminNav /><div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14"><div className="mb-8"><p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-textGold">Catalog management</p><h1 className="text-4xl font-light">Categories</h1><p className="mt-3 text-sm text-white/45">Create, rename, sort, and deactivate product categories.</p></div><CategoryManager categories={categories} saved={query.saved === "1"} /></div></main>;
}
