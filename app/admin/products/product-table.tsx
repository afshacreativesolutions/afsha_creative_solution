"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { FileEdit, ImageIcon, Package, Search, Trash2 } from "lucide-react";
import AdminConfirmDialog from "@/components/admin/AdminConfirmDialog";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminMobileList from "@/components/admin/AdminMobileList";
import AdminTable from "@/components/admin/AdminTable";
import { ADMIN_INPUT_CLASS, ADMIN_SELECT_CLASS } from "@/components/admin/admin-styles";
import type { ProductRecord } from "@/lib/catalog-types";
import { deleteProduct } from "../actions";

export default function AdminProductTable({ products }: { products: ProductRecord[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<ProductRecord | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(
    () =>
      products.filter((product) => {
        const matchesQuery = `${product.name} ${product.slug} ${product.category?.name ?? ""}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesStatus =
          status === "all" || (status === "published" ? product.is_published : !product.is_published);
        return matchesQuery && matchesStatus;
      }),
    [products, query, status]
  );

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const fd = new FormData();
    fd.set("id", deleteTarget.id);
    startTransition(async () => {
      await deleteProduct(fd);
      setDeleteTarget(null);
    });
  };

  return (
    <>
      <div className="mb-5 flex flex-col gap-2.5 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search
            size={15}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products or categories"
            aria-label="Search products"
            className={`${ADMIN_INPUT_CLASS} pl-10`}
          />
        </div>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          aria-label="Filter by publishing status"
          className={`${ADMIN_SELECT_CLASS} sm:w-48`}
        >
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Mobile Cards (< md) */}
      <AdminMobileList
        isEmpty={filtered.length === 0}
        emptyState={
          <AdminEmptyState
            icon={<Package size={28} />}
            title="No products match this search"
            description="Try clearing the search query or changing the status filter."
          />
        }
      >
        {filtered.map((product) => {
          const image = product.images.find((item) => item.is_primary) ?? product.images[0];
          return (
            <article
              key={product.id}
              className="space-y-3 rounded-xl border border-white/10 bg-[#0d0d0d] p-4"
            >
              <div className="flex items-start gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-[#141414]">
                  {image?.url ? (
                    <Image
                      src={image.url}
                      alt={product.name}
                      fill
                      unoptimized
                      sizes="56px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-white/25">
                      <ImageIcon size={18} />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="truncate text-sm font-medium text-white">{product.name}</h2>
                    <span
                      className={`shrink-0 rounded border px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] ${
                        product.is_published
                          ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-300"
                          : "border-white/15 bg-white/5 text-white/55"
                      }`}
                    >
                      {product.is_published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate font-mono text-[11px] text-white/45">
                    /{product.slug}
                  </p>
                  <p className="mt-1 text-xs text-textGold/90">
                    {product.category?.name || "Uncategorized"} · {product.images.length} images
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  prefetch={false}
                  className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-textGold/50 bg-textGold/10 px-3 text-xs font-medium text-textGold transition hover:bg-textGold hover:text-black"
                >
                  <FileEdit size={14} />
                  <span>Edit</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(product)}
                  className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-red-500/35 bg-red-950/25 px-3 text-xs text-red-200 transition hover:bg-red-600 hover:text-white"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </article>
          );
        })}
      </AdminMobileList>

      {/* Desktop Table (>= md) */}
      <AdminTable>
        <thead className="border-b border-white/10 bg-black/45 text-[10px] uppercase tracking-[0.18em] text-white/45">
          <tr>
            <th className="px-4 py-3.5 font-normal">Product</th>
            <th className="px-4 py-3.5 font-normal">Category</th>
            <th className="px-4 py-3.5 font-normal">Images</th>
            <th className="px-4 py-3.5 font-normal">Status</th>
            <th className="px-4 py-3.5 text-right font-normal">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-white/85">
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-12 text-center text-sm text-white/45">
                No products match this search.
              </td>
            </tr>
          ) : (
            filtered.map((product) => {
              const image = product.images.find((item) => item.is_primary) ?? product.images[0];
              return (
                <tr key={product.id} className="transition hover:bg-white/[0.02]">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#141414]">
                        {image?.url ? (
                          <Image
                            src={image.url}
                            alt=""
                            fill
                            unoptimized
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-white/25">
                            <ImageIcon size={16} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white">{product.name}</p>
                        <p className="mt-0.5 text-xs text-white/45">/{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-white/65">
                    {product.category?.name || "—"}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-white/65">{product.images.length}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-block rounded border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.14em] ${
                        product.is_published
                          ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-300"
                          : "border-white/15 bg-white/5 text-white/55"
                      }`}
                    >
                      {product.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        prefetch={false}
                        className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-textGold/45 bg-textGold/10 px-3.5 text-xs text-textGold transition hover:bg-textGold hover:text-black"
                      >
                        <FileEdit size={13} />
                        <span>Edit</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(product)}
                        className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-red-500/35 px-3 text-xs text-red-300/85 transition hover:border-red-500 hover:bg-red-950/40 hover:text-red-200"
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </AdminTable>

      <AdminConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title={deleteTarget ? `Delete "${deleteTarget.name}"?` : "Delete Product?"}
        description="This permanently removes the product and all attached product images from your catalog."
        confirmLabel="Confirm Delete"
        tone="danger"
        busy={isPending}
      />
    </>
  );
}
