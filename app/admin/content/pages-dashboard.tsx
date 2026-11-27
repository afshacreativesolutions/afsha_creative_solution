"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
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
import AdminConfirmDialog from "@/components/admin/AdminConfirmDialog";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminMobileList from "@/components/admin/AdminMobileList";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminTable from "@/components/admin/AdminTable";
import {
  ADMIN_BTN_PRIMARY,
  ADMIN_BTN_SECONDARY,
  ADMIN_INPUT_CLASS,
  ADMIN_LABEL_CLASS,
  ADMIN_SELECT_CLASS,
  ADMIN_TEXTAREA_CLASS,
} from "@/components/admin/admin-styles";
import type { CmsPageRecord } from "@/lib/cms/types";
import {
  createCmsPageAction,
  deleteCmsPageAction,
  publishCmsPageAction,
  seedDefaultCmsAction,
  unpublishCmsPageAction,
} from "./actions";

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

  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [newType, setNewType] = useState("custom");
  const [newDescription, setNewDescription] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<CmsPageRecord | null>(null);

  useEffect(() => {
    if (!showNewModal) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isPending) setShowNewModal(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [showNewModal, isPending]);

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
        text: `CMS content synced: ${r.createdPages} pages created, ${r.updatedPages} updated, ${r.skippedPages} preserved, ${r.mediaUploaded} images uploaded.`,
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
        <div className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-4 text-sm text-amber-100 sm:p-5">
          <div className="flex items-start gap-3">
            <Database size={18} className="mt-0.5 shrink-0 text-amber-400" />
            <div>
              <p className="font-medium text-amber-200">CMS Database Migration Needed Before Editing</p>
              <p className="mt-1 text-xs leading-6 text-amber-100/80">
                Apply{" "}
                <code className="rounded bg-black/50 px-1.5 py-0.5">
                  supabase/migrations/202611260001_cms_and_media.sql
                </code>{" "}
                in your Supabase SQL Editor, then refresh and sync pages.
              </p>
            </div>
          </div>
        </div>
      )}

      {feedback && (
        <div
          role="status"
          className={`flex items-center justify-between gap-2 rounded-xl border px-4 py-3 text-xs ${
            feedback.type === "success"
              ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-200"
              : "border-red-500/40 bg-red-950/30 text-red-200"
          }`}
        >
          <span>{feedback.text}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            aria-label="Dismiss message"
            className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg hover:bg-white/10"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Top Metrics & Primary Actions */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-3 lg:min-w-[460px]">
          <AdminStatCard label="Total Pages" value={counts.total} />
          <AdminStatCard
            label="Published Live"
            value={counts.published}
            valueClassName="text-emerald-400"
          />
          <AdminStatCard
            label="Draft / Pending"
            value={counts.pending}
            valueClassName="text-amber-300"
          />
        </div>

        <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
          {tableStatus.ready && (
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleSeed(false)}
              className={`${ADMIN_BTN_SECONDARY} w-full sm:w-auto`}
            >
              {isPending ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
              <span>
                {pages.length === 0 ? "Import Default Content" : "Sync Missing Pages"}
              </span>
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
            className={`${ADMIN_BTN_PRIMARY} w-full sm:w-auto`}
          >
            <Plus size={15} />
            <span>Create Page</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3 rounded-xl border border-white/10 bg-[#080808] p-3.5 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search page title or URL slug..."
              aria-label="Search pages"
              className={`${ADMIN_INPUT_CLASS} pl-10`}
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            aria-label="Filter by page type"
            className={`${ADMIN_SELECT_CLASS} sm:w-52`}
          >
            <option value="all">All Page Types</option>
            {Object.entries(PAGE_TYPE_LABELS).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="scrollbar-none -mx-1 flex flex-nowrap gap-2 overflow-x-auto px-1 sm:flex-wrap sm:overflow-visible">
          {(["all", "published", "draft", "pending"] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`inline-flex min-h-11 shrink-0 items-center rounded-lg border px-3.5 text-xs uppercase tracking-[0.12em] transition ${
                statusFilter === status
                  ? "border-textGold/60 bg-textGold/15 font-medium text-textGold"
                  : "border-white/10 text-white/60 hover:text-white"
              }`}
            >
              {status === "pending" ? "Unpublished Changes" : status}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Cards (< md) */}
      <AdminMobileList
        isEmpty={filteredPages.length === 0}
        emptyState={
          <AdminEmptyState
            title={pages.length === 0 ? "No CMS pages imported yet" : "No pages match filters"}
            action={
              tableStatus.ready && pages.length === 0 ? (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleSeed(false)}
                  className={ADMIN_BTN_PRIMARY}
                >
                  <Sparkles size={14} /> Import All Website Pages Now
                </button>
              ) : undefined
            }
          />
        }
      >
        {filteredPages.map((page) => (
          <article
            key={page.id}
            className="space-y-3 rounded-xl border border-white/10 bg-[#0d0d0d] p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link
                  href={`/admin/content/${page.id}`}
                  prefetch={false}
                  className="text-base font-medium text-white hover:text-textGold"
                >
                  {page.title}
                </Link>
                <p className="mt-0.5 text-[11px] text-white/50">
                  {PAGE_TYPE_LABELS[page.page_type] || page.page_type}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <code className="truncate rounded bg-white/5 px-2 py-0.5 text-xs text-textGold/90">
                    {page.slug}
                  </code>
                  {page.status === "published" && (
                    <Link
                      href={page.slug}
                      target="_blank"
                      aria-label={`Open live ${page.title}`}
                      className="inline-flex min-h-8 min-w-8 items-center justify-center text-white/50 hover:text-white"
                    >
                      <ExternalLink size={14} />
                    </Link>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-1">
                {page.status === "published" ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-950/40 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-emerald-300">
                    <CheckCircle2 size={11} /> Live
                  </span>
                ) : (
                  <span className="rounded-full border border-white/20 bg-white/5 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-white/65">
                    Draft
                  </span>
                )}
                {page.has_unpublished_changes && page.status === "published" && (
                  <span className="rounded-full border border-amber-500/40 bg-amber-950/40 px-2 py-0.5 text-[10px] text-amber-300">
                    Draft pending
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href={`/admin/content/${page.id}`}
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-textGold/50 bg-textGold/15 px-3 text-xs font-medium text-textGold transition hover:bg-textGold hover:text-black"
              >
                <FileEdit size={14} /> Edit Page
              </Link>
              <Link
                href={`/api/cms/preview?pageId=${page.id}`}
                target="_blank"
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-[#131313] px-3 text-xs text-white/85"
              >
                <Eye size={14} /> Preview
              </Link>
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleTogglePublish(page)}
                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-[#131313] px-3 text-xs text-white/85 disabled:opacity-45"
              >
                <Globe size={14} />
                {page.status === "published" && !page.has_unpublished_changes
                  ? "Unpublish"
                  : "Publish Live"}
              </button>
              {page.slug !== "/" ? (
                <button
                  type="button"
                  onClick={() => setDeleteTarget(page)}
                  className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-red-500/35 bg-red-950/25 px-3 text-xs text-red-200"
                >
                  <Trash2 size={14} /> Delete
                </button>
              ) : (
                <div className="flex items-center justify-center text-[11px] text-white/40">
                  Core Home Page
                </div>
              )}
            </div>
          </article>
        ))}
      </AdminMobileList>

      {/* Desktop Table (>= md) */}
      <AdminTable>
        <thead>
          <tr className="border-b border-white/10 bg-[#0b0b0b] text-[10px] uppercase tracking-[0.16em] text-white/45">
            <th className="px-5 py-3.5">Page</th>
            <th className="px-4 py-3.5">URL / Slug</th>
            <th className="px-4 py-3.5">Status</th>
            <th className="px-4 py-3.5">Updated</th>
            <th className="px-5 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10 text-sm">
          {filteredPages.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-5 py-14 text-center text-sm text-white/55">
                {pages.length === 0
                  ? "No CMS pages imported yet."
                  : "No pages match your search or filters."}
              </td>
            </tr>
          ) : (
            filteredPages.map((page) => (
              <tr key={page.id} className="transition hover:bg-white/[0.02]">
                <td className="px-5 py-4">
                  <Link
                    href={`/admin/content/${page.id}`}
                    prefetch={false}
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
                        className="inline-flex min-h-8 min-w-8 items-center justify-center text-white/45 hover:text-white"
                        title="Open live page"
                      >
                        <ExternalLink size={14} />
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
                <td className="whitespace-nowrap px-4 py-4 text-xs text-white/55">
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
                      prefetch={false}
                      className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-textGold/50 bg-textGold/10 px-3 text-xs font-medium text-textGold transition hover:bg-textGold hover:text-black"
                    >
                      <FileEdit size={13} /> Edit
                    </Link>
                    <Link
                      href={`/api/cms/preview?pageId=${page.id}`}
                      target="_blank"
                      prefetch={false}
                      className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-white/15 px-3 text-xs text-white/75 transition hover:border-white/35 hover:text-white"
                      title="Preview draft"
                    >
                      <Eye size={13} /> Preview
                    </Link>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleTogglePublish(page)}
                      className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-white/15 px-3 text-xs text-white/75 transition hover:border-emerald-400/60 hover:text-emerald-300 disabled:opacity-45"
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
                        aria-label={`Delete ${page.title}`}
                        className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-red-500/30 text-red-300/80 transition hover:border-red-500 hover:bg-red-950/40 hover:text-red-200"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </AdminTable>

      {/* Responsive Bottom-Sheet / Modal for Create Page */}
      {showNewModal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Create Website Page"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isPending) setShowNewModal(false);
          }}
        >
          <form
            onSubmit={handleCreatePage}
            className="max-h-[92svh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-white/15 bg-[#0a0a0a] p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-white shadow-2xl sm:rounded-2xl sm:p-6"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-textGold">New CMS Page</p>
                <h2 className="mt-0.5 text-lg font-light">Create Website Page</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                aria-label="Close create page modal"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-white/10 text-white/60 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className={ADMIN_LABEL_CLASS}>Page Name *</label>
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
                  placeholder="e.g., Brass Gates Collection"
                  className={ADMIN_INPUT_CLASS}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={ADMIN_LABEL_CLASS}>Page Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className={ADMIN_SELECT_CLASS}
                  >
                    <option value="custom">Custom Page</option>
                    <option value="landing">Landing / Campaign</option>
                    <option value="location">Location SEO Page</option>
                    <option value="standard">Standard Info Page</option>
                  </select>
                </div>

                <div>
                  <label className={ADMIN_LABEL_CLASS}>URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={newSlug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      setNewSlug(e.target.value);
                    }}
                    placeholder="/custom-page"
                    className={ADMIN_INPUT_CLASS}
                  />
                </div>
              </div>

              <p className="text-[11px] text-white/50">
                Supported custom routes: top-level paths like <code>/my-page</code> or location
                pages under <code>/locations/city-name</code>.
              </p>

              <div>
                <label className={ADMIN_LABEL_CLASS}>Short SEO Description</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Optional summary shown in search previews..."
                  className={ADMIN_TEXTAREA_CLASS}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className={`${ADMIN_BTN_SECONDARY} w-full sm:w-auto`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className={`${ADMIN_BTN_PRIMARY} w-full sm:w-auto`}
              >
                {isPending ? "Creating..." : "Create & Open Editor"}
              </button>
            </div>
          </form>
        </div>
      )}

      <AdminConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={deleteTarget ? `Delete "${deleteTarget.title}"?` : "Delete Page?"}
        description={
          deleteTarget
            ? `This permanently removes ${deleteTarget.slug}, all of its sections, and its revision history.`
            : undefined
        }
        confirmLabel="Confirm Delete"
        tone="danger"
        busy={isPending}
      />
    </div>
  );
}
