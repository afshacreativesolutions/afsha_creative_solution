"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  CheckCircle2,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  History,
  Loader2,
  Monitor,
  Plus,
  Save,
  Settings2,
  Smartphone,
  Trash2,
  X,
} from "lucide-react";
import CMSPageRenderer from "@/components/cms/CMSPageRenderer";
import type { CMSSectionContext } from "@/components/cms/CMSSectionRenderer";
import { getDefaultSectionContent } from "@/lib/cms/validation";
import type {
  CmsPageRecord,
  CmsRevisionRecord,
  CmsSectionRecord,
  CmsSectionType,
  ResolvedCmsPage,
} from "@/lib/cms/types";
import {
  publishCmsPageAction,
  restoreCmsRevisionAction,
  saveCmsPageDraftAction,
} from "../actions";
import AddSectionModal from "./add-section-modal";
import PageSeoPanel, { type EditablePageMeta } from "./page-seo-panel";
import RevisionsDrawer from "./revisions-drawer";
import SectionForm from "./section-form";

const SECTION_LABELS: Record<CmsSectionType, string> = {
  hero_banner: "Hero Banner",
  image_text: "Image with Text",
  card_grid: "Card Grid",
  services_grid: "Services Grid",
  product_category_grid: "Products / Categories",
  gallery: "Gallery",
  testimonials: "Testimonials",
  stats_counters: "Stats & Counters",
  features: "Features / Steps",
  cta_banner: "CTA Banner",
  faq: "FAQ",
  rich_text: "Rich Text / Blog",
  contact_info: "Contact & Map",
  logo_strip: "Logo Strip",
};

export default function VisualPageEditor({
  page,
  initialDraftMeta,
  initialSections,
  initialRevisions,
  previewContext,
}: {
  page: CmsPageRecord;
  initialDraftMeta: CmsPageRecord;
  initialSections: CmsSectionRecord[];
  initialRevisions: CmsRevisionRecord[];
  previewContext: CMSSectionContext;
}) {
  const router = useRouter();
  const [pageStatus, setPageStatus] = useState(page.status);
  const [hasUnpublished, setHasUnpublished] = useState(page.has_unpublished_changes);

  const [meta, setMeta] = useState<EditablePageMeta>({
    title: initialDraftMeta.title,
    slug: initialDraftMeta.slug,
    page_type: initialDraftMeta.page_type,
    meta_title: initialDraftMeta.meta_title || "",
    meta_description: initialDraftMeta.meta_description || "",
    meta_keywords: initialDraftMeta.meta_keywords || [],
    canonical_url: initialDraftMeta.canonical_url || "",
    og_image: initialDraftMeta.og_image || "",
    og_image_alt: initialDraftMeta.og_image_alt || "",
    structured_data: initialDraftMeta.structured_data ?? null,
  });

  const [sections, setSections] = useState<CmsSectionRecord[]>(initialSections);
  const [selectedId, setSelectedId] = useState<string>(initialSections[0]?.id || "");
  const [isDirty, setIsDirty] = useState(false);

  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [showPreviewPane, setShowPreviewPane] = useState(true);
  const [mobileView, setMobileView] = useState<"sections" | "edit" | "preview">("edit");

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);
  const [revisionsOpen, setRevisionsOpen] = useState(false);
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState<number | null>(null);

  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const selectedIndex = useMemo(
    () => sections.findIndex((s) => s.id === selectedId),
    [sections, selectedId]
  );
  const selectedSection = selectedIndex >= 0 ? sections[selectedIndex] : sections[0] || null;

  const livePreviewPage: ResolvedCmsPage = useMemo(
    () => ({
      ...page,
      ...meta,
      meta_title: meta.meta_title || null,
      meta_description: meta.meta_description || null,
      canonical_url: meta.canonical_url || null,
      og_image: meta.og_image || null,
      og_image_alt: meta.og_image_alt || null,
      status: pageStatus,
      has_unpublished_changes: hasUnpublished || isDirty,
      sections: sections.map((sec, idx) => ({ ...sec, sort_order: idx })),
      source: "cms-db",
    }),
    [page, meta, pageStatus, hasUnpublished, isDirty, sections]
  );

  const buildPayload = (recordRevision = false) => ({
    pageId: page.id,
    meta: {
      ...meta,
      meta_title: meta.meta_title || null,
      meta_description: meta.meta_description || null,
      canonical_url: meta.canonical_url || null,
      og_image: meta.og_image || null,
      og_image_alt: meta.og_image_alt || null,
    },
    sections: sections.map((sec, idx) => ({
      section_key: sec.section_key,
      section_type: sec.section_type,
      title: sec.title,
      sort_order: idx,
      is_visible: sec.is_visible,
      content: sec.content,
    })),
    recordRevision,
  });

  const handleSaveDraft = () => {
    setFeedback(null);
    startTransition(async () => {
      const res = await saveCmsPageDraftAction(buildPayload(true));
      if (!res.ok) {
        setFeedback({ type: "error", text: res.error });
        return;
      }
      setIsDirty(false);
      setHasUnpublished(true);
      setFeedback({ type: "success", text: "Draft saved safely (live page unchanged)." });
      router.refresh();
    });
  };

  const handlePublish = () => {
    setFeedback(null);
    startTransition(async () => {
      const res = await publishCmsPageAction({
        pageId: page.id,
        draftPayload: buildPayload(false),
      });
      if (!res.ok) {
        setFeedback({ type: "error", text: res.error });
        return;
      }
      setIsDirty(false);
      setHasUnpublished(false);
      setPageStatus("published");
      setFeedback({
        type: "success",
        text: `Published "${meta.title}" live at ${res.slug}! Cache refreshed immediately.`,
      });
      router.refresh();
    });
  };

  const handlePreviewTab = () => {
    setFeedback(null);
    startTransition(async () => {
      if (isDirty) {
        const res = await saveCmsPageDraftAction(buildPayload(false));
        if (!res.ok) {
          setFeedback({ type: "error", text: res.error });
          return;
        }
        setIsDirty(false);
        setHasUnpublished(true);
      }
      window.open(`/api/cms/preview?pageId=${encodeURIComponent(page.id)}`, "_blank", "noopener");
    });
  };

  const handleRestoreRevision = (revisionId: string) => {
    setFeedback(null);
    startTransition(async () => {
      const res = await restoreCmsRevisionAction({ pageId: page.id, revisionId });
      if (!res.ok) {
        setFeedback({ type: "error", text: res.error });
        return;
      }
      setRevisionsOpen(false);
      setIsDirty(false);
      setFeedback({ type: "success", text: "Revision restored into your draft." });
      router.refresh();
      window.location.reload();
    });
  };

  const handleAddSection = (type: CmsSectionType, label: string) => {
    const newId = `new-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const uniqueKey = `${type.replace(/_/g, "-")}-${sections.length + 1}-${Date.now()
      .toString(36)
      .slice(-3)}`;
    const newSection: CmsSectionRecord = {
      id: newId,
      section_key: uniqueKey,
      section_type: type,
      title: label,
      sort_order: sections.length,
      is_visible: true,
      content: getDefaultSectionContent(type),
    };
    setSections((prev) => [...prev, newSection]);
    setSelectedId(newId);
    setMobileView("edit");
    setIsDirty(true);
  };

  const handleDuplicateSection = (index: number) => {
    const source = sections[index];
    if (!source) return;
    const newId = `dup-${Date.now()}`;
    const copy: CmsSectionRecord = {
      ...structuredClone(source),
      id: newId,
      section_key: `${source.section_key}-copy-${Date.now().toString(36).slice(-3)}`,
      title: `${source.title} (Copy)`,
    };
    const next = [...sections];
    next.splice(index + 1, 0, copy);
    setSections(next);
    setSelectedId(newId);
    setIsDirty(true);
  };

  const handleMoveSection = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    setSections(next);
    setIsDirty(true);
  };

  const handleDeleteSection = (index: number) => {
    const removed = sections[index];
    const next = sections.filter((_, i) => i !== index);
    setSections(next);
    if (removed && removed.id === selectedId) {
      setSelectedId(next[0]?.id || "");
    }
    setDeleteConfirmIndex(null);
    setIsDirty(true);
  };

  const updateSelectedSection = (patch: Partial<CmsSectionRecord>) => {
    if (!selectedSection) return;
    setSections((prev) =>
      prev.map((sec) => (sec.id === selectedSection.id ? { ...sec, ...patch } : sec))
    );
    setIsDirty(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Top Studio Header Bar */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#080808]/95 px-4 py-3 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-[1700px] flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/admin/content"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/75 transition hover:border-white/30 hover:text-white"
            >
              <ArrowLeft size={14} /> Pages
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-sm font-medium sm:text-base">{meta.title}</h1>
                <code className="hidden rounded bg-white/5 px-2 py-0.5 text-[11px] text-textGold sm:inline">
                  {meta.slug}
                </code>
                {pageStatus === "published" ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-950/40 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-emerald-300">
                    <CheckCircle2 size={10} /> Live
                  </span>
                ) : (
                  <span className="rounded-full border border-white/20 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-white/65">
                    Draft
                  </span>
                )}
                {(isDirty || hasUnpublished) && (
                  <span className="rounded-full border border-amber-500/40 bg-amber-950/40 px-2 py-0.5 text-[10px] text-amber-300">
                    {isDirty ? "Unsaved changes" : "Unpublished draft"}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSeoOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/80 hover:border-textGold/50 hover:text-textGold"
            >
              <Settings2 size={14} /> Page & SEO
            </button>

            <button
              type="button"
              onClick={() => setRevisionsOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/80 hover:border-white/35 hover:text-white"
            >
              <History size={14} /> History ({initialRevisions.length})
            </button>

            <button
              type="button"
              disabled={isPending}
              onClick={handleSaveDraft}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-[#141414] px-3.5 py-1.5 text-xs font-medium text-white transition hover:border-textGold hover:text-textGold disabled:opacity-45"
            >
              {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Save Draft
            </button>

            <button
              type="button"
              disabled={isPending}
              onClick={handlePreviewTab}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3.5 py-1.5 text-xs text-white/80 hover:border-white/35 hover:text-white disabled:opacity-45"
            >
              <ExternalLink size={14} /> Preview Site
            </button>

            <button
              type="button"
              disabled={isPending}
              onClick={handlePublish}
              className="inline-flex items-center gap-1.5 rounded-lg bg-textGold px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-black transition hover:bg-white disabled:opacity-45"
            >
              {isPending ? <Loader2 size={14} className="animate-spin" /> : <Globe size={14} />}
              Publish
            </button>
          </div>
        </div>

        {/* Feedback Toast */}
        {feedback && (
          <div
            className={`mx-auto mt-2.5 flex max-w-[1700px] items-center justify-between rounded-lg border px-4 py-2 text-xs ${
              feedback.type === "success"
                ? "border-emerald-500/40 bg-emerald-950/50 text-emerald-200"
                : "border-red-500/40 bg-red-950/50 text-red-200"
            }`}
          >
            <span>{feedback.text}</span>
            <button type="button" onClick={() => setFeedback(null)}>
              <X size={14} />
            </button>
          </div>
        )}

        {/* Mobile Tab Switcher */}
        <div className="mt-3 flex gap-1.5 lg:hidden">
          {[
            { id: "sections" as const, label: `Sections (${sections.length})` },
            { id: "edit" as const, label: "Edit Content" },
            { id: "preview" as const, label: "Live Preview" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMobileView(tab.id)}
              className={`flex-1 rounded-lg border py-1.5 text-xs font-medium ${
                mobileView === tab.id
                  ? "border-textGold bg-textGold/15 text-textGold"
                  : "border-white/10 text-white/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main 3-Pane Visual Page Manager Workspace */}
      <div className="mx-auto grid max-w-[1700px] lg:h-[calc(100vh-68px)] lg:grid-cols-[290px_minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* LEFT SIDEBAR: Sections Order & Controls */}
        <aside
          className={`${
            mobileView === "sections" ? "block" : "hidden"
          } flex flex-col border-r border-white/10 bg-[#080808] lg:flex lg:overflow-hidden`}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-textGold">
              Page Sections ({sections.length})
            </span>
            <button
              type="button"
              onClick={() => setAddModalOpen(true)}
              className="inline-flex items-center gap-1 rounded-md bg-textGold px-2.5 py-1 text-[11px] font-semibold text-black hover:bg-white"
            >
              <Plus size={13} /> Add
            </button>
          </div>

          <div className="flex-1 space-y-1.5 overflow-y-auto p-3">
            {sections.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/15 p-6 text-center">
                <p className="text-xs text-white/55">This page has no sections yet.</p>
                <button
                  type="button"
                  onClick={() => setAddModalOpen(true)}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-textGold/50 bg-textGold/10 px-3 py-1.5 text-xs text-textGold"
                >
                  <Plus size={13} /> Add First Section
                </button>
              </div>
            ) : (
              sections.map((sec, idx) => {
                const isSelected = selectedSection?.id === sec.id;
                return (
                  <div
                    key={sec.id}
                    className={`rounded-xl border p-2.5 transition ${
                      isSelected
                        ? "border-textGold/70 bg-textGold/10"
                        : "border-white/10 bg-[#0d0d0d] hover:border-white/25"
                    } ${!sec.is_visible ? "opacity-55" : ""}`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId(sec.id);
                        setMobileView("edit");
                      }}
                      className="w-full text-left"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] uppercase tracking-[0.14em] text-textGold">
                          {SECTION_LABELS[sec.section_type] || sec.section_type}
                        </span>
                        {!sec.is_visible && (
                          <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] text-white/60">
                            Hidden
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-xs font-medium text-white">
                        {sec.title || `Section ${idx + 1}`}
                      </p>
                    </button>

                    <div className="mt-2 flex items-center justify-between border-t border-white/5 pt-2">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveSection(idx, -1)}
                          title="Move up"
                          className="rounded border border-white/10 p-1 text-white/55 hover:text-white disabled:opacity-25"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === sections.length - 1}
                          onClick={() => handleMoveSection(idx, 1)}
                          title="Move down"
                          className="rounded border border-white/10 p-1 text-white/55 hover:text-white disabled:opacity-25"
                        >
                          <ArrowDown size={12} />
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            const next = [...sections];
                            next[idx] = { ...sec, is_visible: !sec.is_visible };
                            setSections(next);
                            setIsDirty(true);
                          }}
                          title={sec.is_visible ? "Hide section" : "Show section"}
                          className="rounded border border-white/10 p-1 text-white/65 hover:text-textGold"
                        >
                          {sec.is_visible ? <Eye size={12} /> : <EyeOff size={12} />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicateSection(idx)}
                          title="Duplicate section"
                          className="rounded border border-white/10 p-1 text-white/65 hover:text-white"
                        >
                          <Copy size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmIndex(idx)}
                          title="Delete section"
                          className="rounded border border-red-500/25 p-1 text-red-300/75 hover:border-red-500 hover:bg-red-950/40"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* CENTER AREA: Selected Section Editor */}
        <section
          className={`${
            mobileView === "edit" ? "block" : "hidden"
          } overflow-y-auto border-r border-white/10 bg-[#070707] p-5 lg:block`}
        >
          {selectedSection ? (
            <div className="mx-auto max-w-2xl space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-textGold">
                    Editing {SECTION_LABELS[selectedSection.section_type]}
                  </span>
                  <input
                    type="text"
                    value={selectedSection.title}
                    onChange={(e) => updateSelectedSection({ title: e.target.value })}
                    placeholder="Section label (shown in sidebar)"
                    className="mt-1 block w-full bg-transparent text-xl font-light text-white focus:outline-none"
                  />
                </div>

                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/15 bg-[#111] px-3 py-1.5 text-xs text-white/80">
                  <input
                    type="checkbox"
                    checked={selectedSection.is_visible}
                    onChange={(e) => updateSelectedSection({ is_visible: e.target.checked })}
                    className="accent-[#c9a84c]"
                  />
                  Visible on page
                </label>
              </div>

              <SectionForm
                sectionType={selectedSection.section_type}
                content={selectedSection.content}
                onChange={(nextContent) => updateSelectedSection({ content: nextContent as never })}
              />
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center py-20 text-center">
              <p className="text-sm text-white/55">
                Select a section from the left sidebar or add a new section to begin editing.
              </p>
              <button
                type="button"
                onClick={() => setAddModalOpen(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-textGold px-4 py-2 text-xs font-semibold text-black"
              >
                <Plus size={14} /> Add Section
              </button>
            </div>
          )}
        </section>

        {/* RIGHT PANE: Real-Time Visual Preview of Unsaved Changes */}
        <section
          className={`${
            mobileView === "preview" ? "flex" : showPreviewPane ? "hidden lg:flex" : "hidden"
          } flex-col overflow-hidden bg-[#121212]`}
        >
          <div className="flex items-center justify-between border-b border-white/10 bg-[#0b0b0b] px-4 py-2.5">
            <div className="flex items-center gap-2 text-xs text-white/65">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Live Unsaved Preview</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPreviewMode("desktop")}
                className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[11px] ${
                  previewMode === "desktop"
                    ? "border-textGold/60 bg-textGold/15 text-textGold"
                    : "border-white/10 text-white/55 hover:text-white"
                }`}
              >
                <Monitor size={13} /> Desktop
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode("mobile")}
                className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[11px] ${
                  previewMode === "mobile"
                    ? "border-textGold/60 bg-textGold/15 text-textGold"
                    : "border-white/10 text-white/55 hover:text-white"
                }`}
              >
                <Smartphone size={13} /> Mobile
              </button>
              <button
                type="button"
                onClick={() => setShowPreviewPane(false)}
                className="hidden rounded-md border border-white/10 p-1 text-white/45 hover:text-white lg:inline-flex"
                title="Collapse preview panel"
              >
                <X size={13} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-[#030303] p-3">
            <div
              className={`min-h-full overflow-x-hidden rounded-xl border border-white/15 bg-background shadow-2xl transition-all duration-300 ${
                previewMode === "mobile" ? "mx-auto w-[390px] max-w-full" : "w-full"
              }`}
            >
              <CMSPageRenderer
                page={livePreviewPage}
                context={previewContext}
                showDraftBanner={false}
              />
            </div>
          </div>
        </section>
      </div>

      {!showPreviewPane && (
        <button
          type="button"
          onClick={() => setShowPreviewPane(true)}
          className="fixed bottom-5 right-5 z-40 hidden items-center gap-2 rounded-full border border-textGold bg-black px-4 py-2.5 text-xs font-medium text-textGold shadow-xl hover:bg-textGold hover:text-black lg:inline-flex"
        >
          <Monitor size={14} /> Show Live Preview
        </button>
      )}

      {/* Modals & Drawers */}
      <AddSectionModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddSection}
      />

      <PageSeoPanel
        isOpen={seoOpen}
        onClose={() => setSeoOpen(false)}
        meta={meta}
        isHome={page.slug === "/"}
        onChange={(nextMeta) => {
          setMeta(nextMeta);
          setIsDirty(true);
        }}
      />

      <RevisionsDrawer
        isOpen={revisionsOpen}
        onClose={() => setRevisionsOpen(false)}
        revisions={initialRevisions}
        onRestore={handleRestoreRevision}
        busy={isPending}
      />

      {/* Delete Section Confirmation Modal */}
      {deleteConfirmIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0a0a0a] p-6 text-white">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-400" />
              <div>
                <h3 className="text-base font-medium">Remove Section?</h3>
                <p className="mt-1 text-xs leading-5 text-white/60">
                  Remove &ldquo;{sections[deleteConfirmIndex]?.title || "this section"}&rdquo; from
                  your draft? Live pages remain unaffected until you publish.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmIndex(null)}
                className="rounded-lg border border-white/15 px-4 py-2 text-xs text-white/75"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteSection(deleteConfirmIndex)}
                className="rounded-lg bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-500"
              >
                Remove Section
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
