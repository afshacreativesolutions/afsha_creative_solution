"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { deleteProduct } from "../actions";
import { SubmitButton } from "../submit-button";
import type { ProductRecord } from "@/lib/catalog-types";

export default function AdminProductTable({ products }: { products: ProductRecord[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const filtered = useMemo(() => products.filter((product) => {
    const matchesQuery = `${product.name} ${product.slug} ${product.category?.name ?? ""}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "all" || (status === "published" ? product.is_published : !product.is_published);
    return matchesQuery && matchesStatus;
  }), [products, query, status]);

  return <>
    <div className="mb-4 flex flex-col gap-3 sm:flex-row">
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products or categories" aria-label="Search products" className="min-w-0 flex-1 border border-white/10 bg-[#080808] px-4 py-3 text-sm outline-none focus:border-textGold/60" />
      <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by publishing status" className="border border-white/10 bg-[#080808] px-4 py-3 text-sm text-white/70 outline-none focus:border-textGold/60"><option value="all">All statuses</option><option value="published">Published</option><option value="draft">Draft</option></select>
    </div>
    <div className="overflow-x-auto border border-white/10">
      <table className="w-full min-w-[700px] border-collapse text-left">
        <thead className="bg-[#0b0b0b] text-[9px] uppercase tracking-[0.17em] text-white/40"><tr><th className="px-4 py-4 font-normal">Product</th><th className="px-4 py-4 font-normal">Category</th><th className="px-4 py-4 font-normal">Images</th><th className="px-4 py-4 font-normal">Status</th><th className="px-4 py-4 text-right font-normal">Actions</th></tr></thead>
        <tbody>{filtered.map((product) => {
          const image = product.images.find((item) => item.is_primary) ?? product.images[0];
          return <tr key={product.id} className="border-t border-white/8">
            <td className="px-4 py-3"><div className="flex items-center gap-3">{image?.url && <div className="relative h-12 w-12 overflow-hidden bg-[#111]"> <Image src={image.url} alt="" fill unoptimized sizes="48px" className="object-cover" /></div>}<div><p className="text-sm">{product.name}</p><p className="mt-1 text-xs text-white/35">/{product.slug}</p></div></div></td>
            <td className="px-4 py-3 text-sm text-white/55">{product.category?.name}</td>
            <td className="px-4 py-3 text-sm text-white/55">{product.images.length}</td>
            <td className="px-4 py-3"><span className={`border px-2 py-1 text-[9px] uppercase tracking-[0.14em] ${product.is_published ? "border-emerald-900 text-emerald-300" : "border-white/15 text-white/45"}`}>{product.is_published ? "Published" : "Draft"}</span></td>
            <td className="px-4 py-3"><div className="flex justify-end gap-4 text-xs"><Link href={`/admin/products/${product.id}/edit`} className="text-textGold hover:text-white">Edit</Link><form action={deleteProduct} onSubmit={(event) => { if (!window.confirm(`Permanently remove “${product.name}” and its images?`)) event.preventDefault(); }}><input type="hidden" name="id" value={product.id} /><SubmitButton loadingText="Deleting..." className="text-red-300/80 hover:text-red-200 disabled:opacity-40">Delete</SubmitButton></form></div></td>
          </tr>;
        })}</tbody>
      </table>
      {filtered.length === 0 && <p className="px-4 py-12 text-center text-sm text-white/40">No products match this search.</p>}
    </div>
  </>;
}
