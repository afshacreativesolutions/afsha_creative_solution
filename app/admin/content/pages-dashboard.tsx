"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  ExternalLink,
  Eye,
  FileEdit,
  Globe,
  Loader2,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import {
  createCmsPageAction,
  deleteCmsPageAction,
  publishCmsPageAction,
  seedDefaultCmsAction,
  unpublishCmsPageAction,
} from "./actions";
import type { CmsPageRecord } from "@/lib/cms/types";

const PAGE_TYPE_LABELS: Record<string, string> = {
  home: "Home Page",
  standard: "Standard Page",
  landing: "Landing / Offer",
  catalog: "Catalog Index",
  location: "Location SEO Page",
  blog_index: "Blog Index",
  contact: "Contact Page",
  custom: "Custom Page",
};

export default function PagesDashboard({
  initialPages,
  tableStatus,
}: {
  initialPages: CmsPageRecord[];
  tableStatus: { ready: boolean; pagesCount: number; error?: string };
}) {
  const router = useRouter();
  const [pages, setPages] = useState<CmsPageRecord[]>(initialPages);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft" | "pending">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );
  const [isPending, startTransition] = useTransition();

  // New Page Modal state
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [newType, setNewType] = useState("custom");
  const [newDescription, setNewDescription] = useState("");

  // Delete confirmation modal
  const [deleteTarget, setDeleteTarget] = useState<CmsPageRecord | null>(null);

  const filteredPages = useMemo(() => {
    const q = search.trim().toLowerCase();
    return pages.filter((p) => {
      if (statusFilter === "published" && p.status !== "published") return false;
      if (statusFilter === "draft" && p.status !== "draft") return false;
      if (statusFilter === "pending" && !p.has_unpublished_changes) return false;
      if (typeFilter !== "all" && p.page_type !== typeFilter) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.meta_title || "").toLowerCase().includes(q)
      );
    });
  }, [pages, search, statusFilter, typeFilter]);

  const counts = useMemo(
    () => ({
      total: pages.length,
      published: pages.filter((p) => p.status === "published").length,
      pending: pages.filter((p) => p.has_unpublished_changes || p.status === "draft").length,
    }),
    [pages]
  );

  const handleSeed = (overwrite: boolean) => {
    setFeedback(null);
    startTransition(async () => {
      const res = await seedDefaultCmsAction(overwrite);
      if (!res.ok) {
        setFeedback({ type: "error", text: res.error });
        return;
      }
      const r = res.result;
      setFeedback({
        type: "success",
        text: `CMS content synced: ${r.createdPages} pages created, ${r.updatedPages} updated, ${r.skippedPages} existing preserved, ${r.mediaUploaded} images uploaded.`,
      });
      router.refresh();
    });
  };

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    startTransition(async () => {
      const res = await createCmsPageAction({
        title: newTitle,
        slug: newSlug,
        page_type: newType,
        meta_description: newDescription,
      });
      if (!res.ok) {
        setFeedback({ type: "error", text: res.error });
        return;
      }
      setShowNewModal(false);
      router.push(`/admin/content/${res.id}`);
    });
  };

  const handleTogglePublish = (page: CmsPageRecord) => {
    setFeedback(null);
    startTransition(async () => {
      if (page.status === "published" && !page.has_unpublished_changes) {
        const res = await unpublishCmsPageAction(page.id);
        if (!res.ok) {
          setFeedback({ type: "error", text: res.error });
          return;
        }
        setPages((prev) =>
          prev.map((p) =>
            p.id === page.id ? { ...p, status: "draft", has_unpublished_changes: true } : p
          )
        );
        setFeedback({ type: "success", text: `Moved "${page.title}" to Draft.` });
      } else {
        const res = await publishCmsPageAction({ pageId: page.id });
        if (!res.ok) {
          setFeedback({ type: "error", text: res.error });
          return;
        }
        setPages((prev) =>
          prev.map((p) =>
            p.id === page.id
              ? {
                  ...p,
                  status: "published",
                  has_unpublished_changes: false,
                  published_at: res.publishedAt,
                }
              : p
          )
        );
        setFeedback({ type: "success", text: `Published "${page.title}" live.` });
      }
    });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setFeedback(null);
    startTransition(async () => {
      const res = await deleteCmsPageAction(deleteTarget.id);
      if (!res.ok) {
        setFeedback({ type: "error", text: res.error });
        setDeleteTarget(null);
        return;
      }
      setPages((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setFeedback({ type: "success", text: `Deleted page "${deleteTarget.title}".` });
      setDeleteTarget(null);
    });
  };

  return (
    <div className="space-y-6">
      {!tableStatus.ready && (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-950/30 p-5 text-sm text-amber-100">
          <div className="flex items-start gap-3">
            <Database size={18} className="mt-0.5 shrink-0 text-amber-400" />
            <div>
              <p className="font-medium text-amber-200">
                CMS Database Migration Needed Before Editing
              </p>
              <p className="mt-1 text-xs leading-6 text-amber-100/80">
                Public pages are safely displaying your migrated default content, but{" "}
                <code>cms_pages</code> has not been applied to your Supabase project yet. Run{" "}
                <code className="rounded bg-black/50 px-1.5 py-0.5">
                  supabase/migrations/202611260001_cms_and_media.sql
                </code>{" "}
                in your Supabase SQL Editor, then refresh and click &ldquo;Import Default Website
                Content&rdquo;.
              </p>
              {tableStatus.error && (
                <p className="mt-2 text-[11px] text-amber-300/75">Detail: {tableStatus.error}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {feedback && (
        <div
          className={`flex items-center justify-between rounded-xl border px-4 py-3 text-xs ${
            feedback.type === "success"
              ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-200"
              : "border-red-500/40 bg-red-950/30 text-red-200"
          }`}
        >
          <span>{feedback.text}</span>
          <button type="button" onClick={() => setFeedback(null)} aria-label="Dismiss message">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Top Metrics & Primary Actions */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-white/10 bg-[#090909] px-4 py-3">
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/45">Total Pages</p>
            <p className="mt-1 text-2xl font-light text-white">{counts.total}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#090909] px-4 py-3">
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/45">Published Live</p>
            <p className="mt-1 text-2xl font-light text-emerald-400">{counts.published}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#090909] px-4 py-3">
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/45">
              Draft / Pending
            </p>
            <p className="mt-1 text-2xl font-light text-amber-300">{counts.pending}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {tableStatus.ready && (
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleSeed(false)}
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-[#0b0b0b] px-4 py-2.5 text-xs uppercase tracking-[0.12em] text-white/80 transition hover:border-textGold/60 hover:text-textGold disabled:opacity-45"
            >
              {isPending ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {pages.length === 0 ? "Import Default Website Content" : "Sync Missing Pages"}
            </button>
          )}
          <button
            type="button"
            disabled={!tableStatus.ready}
            onClick={() => {
              setNewTitle("");
              setNewSlug("");
              setSlugTouched(false);
              setNewType("custom");
              setNewDescription("");
              setShowNewModal(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-textGold px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-white disabled:opacity-45"
          >
            <Plus size={15} /> Create Page
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-[#080808] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search page title or URL slug..."
            className="w-full rounded-lg border border-white/15 bg-[#111] py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/35 focus:border-textGold focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(["all", "published", "draft", "pending"] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg border px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] transition ${
                statusFilter === status
                  ? "border-textGold/60 bg-textGold/15 text-textGold"
                  : "border-white/10 text-white/55 hover:text-white"
              }`}
            >
              {status === "pending" ? "Unpublished Changes" : status}
            </button>
          ))}

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            aria-label="Filter by page type"
            className="rounded-lg border border-white/15 bg-[#111] px-3 py-1.5 text-xs text-white focus:border-textGold focus:outline-none"
          >
            <option value="all">All Page Types</option>
            {Object.entries(PAGE_TYPE_LABELS).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pages Table */}
      {filteredPages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 py-16 text-center">
          <p className="text-sm text-white/65">
            {pages.length === 0
              ? "No CMS pages imported yet."
              : "No pages match your search or filters."}
          </p>
          {tableStatus.ready && pages.length === 0 && (
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleSeed(false)}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-textGold px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-black hover:bg-white"
            >
              <Sparkles size={14} /> Import All Website Pages Now
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#080808]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-[#0b0b0b] text-[10px] uppercase tracking-[0.16em] text-white/45">
                  <th className="px-5 py-3.5">Page</th>
                  <th className="px-4 py-3.5">URL / Slug</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Updated</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredPages.map((page) => (
                  <tr key={page.id} className="transition hover:bg-white/[0.02]">
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/content/${page.id}`}
                        className="font-medium text-white hover:text-textGold"
                      >
                        {page.title}
                      </Link>
                      <div className="mt-0.5 text-[11px] text-white/45">
                        {PAGE_TYPE_LABELS[page.page_type] || page.page_type}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <code className="rounded bg-white/5 px-2 py-0.5 text-xs text-textGold/90">
                          {page.slug}
                        </code>
                        {page.status === "published" && (
                          <Link
                            href={page.slug}
                            target="_blank"
                            className="text-white/40 hover:text-white"
                            title="Open live page"
                          >
                            <ExternalLink size={13} />
                          </Link>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {page.status === "published" ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-950/40 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-emerald-300">
                            <CheckCircle2 size={11} /> Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/5 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-white/65">
                            Draft
                          </span>
                        )}
                        {page.has_unpublished_changes && page.status === "published" && (
                          <span className="rounded-full border border-amber-500/40 bg-amber-950/40 px-2 py-0.5 text-[10px] text-amber-300">
                            Draft edits pending
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-white/55">
                      {page.updated_at
                        ? new Date(page.updated_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/content/${page.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-textGold/50 bg-textGold/10 px-3 py-1.5 text-xs font-medium text-textGold transition hover:bg-textGold hover:text-black"
                        >
                          <FileEdit size={13} /> Edit
                        </Link>
                        <Link
                          href={`/api/cms/preview?pageId=${page.id}`}
                          target="_blank"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/75 transition hover:border-white/35 hover:text-white"
                          title="Preview current draft in new tab"
                        >
                          <Eye size={13} /> Preview
                        </Link>
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => handleTogglePublish(page)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/75 transition hover:border-emerald-400/60 hover:text-emerald-300 disabled:opacity-45"
                        >
                          <Globe size={13} />
                          {page.status === "published" && !page.has_unpublished_changes
                            ? "Unpublish"
                            : "Publish"}
                        </button>
                        {page.slug !== "/" && (
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(page)}
                            className="rounded-lg border border-red-500/30 p-1.5 text-red-300/75 transition hover:border-red-500 hover:bg-red-950/40 hover:text-red-200"
                            title="Delete page"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Page Modal */}
      {showNewModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <form
            onSubmit={handleCreatePage}
            className="w-full max-w-lg rounded-2xl border border-white/15 bg-[#0a0a0a] p-6 text-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-textGold">New CMS Page</p>
                <h2 className="mt-0.5 text-lg font-light">Create Website Page</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="text-white/50 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.12em] text-white/60">
                  Page Name
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => {
                    const v = e.target.value;
                    setNewTitle(v);
                    if (!slugTouched) {
                      const slugPart = v
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-|-$/g, "");
                      setNewSlug(
                        newType === "location" && slugPart
                          ? `/locations/${slugPart}`
                          : slugPart
                            ? `/${slugPart}`
                            : ""
                      );
                    }
                  }}
                  placeholder="e.g., Brass Gates Collection or Gates in Rampur"
                  className="w-full rounded-lg border border-white/15 bg-[#111] px-3 py-2 text-sm text-white focus:border-textGold focus:outline-none"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-[0.12em] text-white/60">
                    Page Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-[#111] px-3 py-2 text-sm text-white focus:border-textGold focus:outline-none"
                  >
                    <option value="custom">Custom Page</option>
                    <option value="landing">Landing / Campaign</option>
                    <option value="location">Location SEO Page</option>
                    <option value="standard">Standard Info Page</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs uppercase tracking-[0.12em] text-white/60">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={newSlug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      setNewSlug(e.target.value);
                    }}
                    placeholder="/custom-page"
                    className="w-full rounded-lg border border-white/15 bg-[#111] px-3 py-2 text-sm text-white focus:border-textGold focus:outline-none"
                  />
                </div>
              </div>

              <p className="text-[11px] text-white/45">
                Supported custom routes: top-level paths like <code>/my-page</code> or location
                pages under <code>/locations/city-name</code>.
              </p>

              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.12em] text-white/60">
                  Short SEO Description
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Optional summary shown in Google search previews..."
                  className="w-full rounded-lg border border-white/15 bg-[#111] px-3 py-2 text-sm text-white focus:border-textGold focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="rounded-lg border border-white/15 px-4 py-2 text-xs text-white/75"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-lg bg-textGold px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-black hover:bg-white disabled:opacity-50"
              >
                {isPending ? "Creating..." : "Create & Open Editor"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Page Confirmation Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0a0a0a] p-6 text-white">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-400" />
              <div>
                <h3 className="text-base font-medium">Delete &ldquo;{deleteTarget.title}&rdquo;?</h3>
                <p className="mt-1 text-xs leading-5 text-white/60">
                  This permanently removes <code>{deleteTarget.slug}</code>, all of its sections,
                  and its revision history.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-white/15 px-4 py-2 text-xs text-white/75"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-500 disabled:opacity-50"
              >
                {isPending ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
