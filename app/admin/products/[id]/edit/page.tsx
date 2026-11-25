import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminCategories, getAdminProduct } from "@/lib/catalog";
import AdminNav from "../../../admin-nav";
import ProductForm from "../../product-form";

export const metadata: Metadata = { title: "Edit Product | Afsha Creative Solution" };
type PageProps = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> };

export default async function EditProductPage({ params, searchParams }: PageProps) {
  const [{ id }, { saved }] = await Promise.all([params, searchParams]);
  const [, product, categories] = await Promise.all([
    requireAdmin(),
    getAdminProduct(id),
    getAdminCategories(),
  ]);
  if (!product) notFound();
  const initialImages = product.images.map((image) => ({
    storage_path: image.storage_path,
    alt_text: image.alt_text,
    url: image.url ?? "",
  }));

  return <main className="min-h-[75vh] bg-background text-white"><AdminNav /><div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12"><div className="mb-8"><p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-textGold">Catalog management</p><h1 className="text-3xl font-light">Edit product</h1></div><ProductForm categories={categories} product={product} initialImages={initialImages} saved={saved === "1"} /></div></main>;
}
