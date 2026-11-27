"use client";

import { useState, useTransition } from "react";
import { FileEdit, FolderTree, Plus, Power } from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import AdminConfirmDialog from "@/components/admin/AdminConfirmDialog";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import {
  ADMIN_BTN_OUTLINE_GOLD,
  ADMIN_BTN_PRIMARY,
  ADMIN_BTN_SECONDARY,
  ADMIN_INPUT_CLASS,
  ADMIN_LABEL_CLASS,
} from "@/components/admin/admin-styles";
import type { CategoryRecord } from "@/lib/catalog-types";
import { slugify } from "@/lib/slug";
import { saveCategory, setCategoryActive } from "../actions";
import { SubmitButton } from "../submit-button";

export default function CategoryManager({
  categories,
  saved,
}: {
  categories: CategoryRecord[];
  saved: boolean;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [addName, setAddName] = useState("");
  const [addSlug, setAddSlug] = useState("");
  const [addSlugManual, setAddSlugManual] = useState(false);

  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editSlugManual, setEditSlugManual] = useState(false);

  const [deactivateTarget, setDeactivateTarget] = useState<CategoryRecord | null>(null);
  const [isPending, startTransition] = useTransition();

  function startEditing(category: CategoryRecord) {
    setEditing(category.id);
    setEditName(category.name);
    setEditSlug(category.slug);
    setEditSlugManual(true);
  }

  function handleDeactivateConfirm() {
    if (!deactivateTarget) return;
    const fd = new FormData();
    fd.set("id", deactivateTarget.id);
    fd.set("active", String(!deactivateTarget.is_active));
    startTransition(async () => {
      await setCategoryActive(fd);
      setDeactivateTarget(null);
    });
  }

  return (
    <div className="space-y-6">
      {saved && (
        <p
          role="status"
          className="rounded-xl border border-emerald-500/35 bg-emerald-950/30 px-4 py-3 text-xs text-emerald-200 sm:text-sm"
        >
          Category changes saved successfully.
        </p>
      )}

      <AdminCard title="Add Category" eyebrow="New Collection">
        <form action={saveCategory} className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={ADMIN_LABEL_CLASS}>Name *</label>
            <input
              name="name"
              required
              value={addName}
              onChange={(e) => {
                const val = e.target.value;
                setAddName(val);
                if (!addSlugManual) setAddSlug(slugify(val));
              }}
              className={ADMIN_INPUT_CLASS}
              placeholder="Gates"
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <label className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/60">
                Slug *
              </label>
              {addSlugManual && (
                <button
                  type="button"
                  onClick={() => {
                    setAddSlug(slugify(addName));
                    setAddSlugManual(false);
                  }}
                  className="text-[11px] text-textGold hover:underline"
                >
                  Auto-sync from name
                </button>
              )}
            </div>
            <input
              name="slug"
              required
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              value={addSlug}
              onChange={(e) => {
                setAddSlugManual(true);
                setAddSlug(slugify(e.target.value));
              }}
              className={ADMIN_INPUT_CLASS}
              placeholder="gates"
            />
          </div>

          <div>
            <label className={ADMIN_LABEL_CLASS}>Description</label>
            <input name="description" className={ADMIN_INPUT_CLASS} placeholder="Optional summary" />
          </div>

          <div>
            <label className={ADMIN_LABEL_CLASS}>Sort Order</label>
            <input
              name="sort_order"
              type="number"
              inputMode="numeric"
              defaultValue={categories.length + 1}
              className={ADMIN_INPUT_CLASS}
            />
          </div>

          <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-[#121212] px-3.5 text-sm text-white/80">
            <input name="is_active" type="checkbox" defaultChecked className="h-4 w-4 accent-[#CDA274]" />
            <span>Active on storefront</span>
          </label>

          <div className="flex items-end justify-end">
            <SubmitButton
              loadingText="Adding..."
              className={`${ADMIN_BTN_PRIMARY} w-full sm:w-auto`}
            >
              <Plus size={15} />
              <span>Add Category</span>
            </SubmitButton>
          </div>
        </form>
      </AdminCard>

      {categories.length === 0 ? (
        <AdminEmptyState
          icon={<FolderTree size={28} />}
          title="No categories configured"
          description="Use the form above to add your first fabrication category."
        />
      ) : (
        <div className="space-y-3">
          {categories.map((category) => (
            <section
              key={category.id}
              className="rounded-xl border border-white/10 bg-[#0d0d0d] p-4 sm:p-5"
            >
              {editing === category.id ? (
                <form action={saveCategory} className="grid gap-4 sm:grid-cols-2">
                  <input type="hidden" name="id" value={category.id} />

                  <div>
                    <label className={ADMIN_LABEL_CLASS}>Name *</label>
                    <input
                      name="name"
                      required
                      value={editName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditName(val);
                        if (!editSlugManual) setEditSlug(slugify(val));
                      }}
                      className={ADMIN_INPUT_CLASS}
                    />
                  </div>

                  <div>
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <label className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/60">
                        Slug *
                      </label>
                      {editSlugManual && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditSlug(slugify(editName));
                            setEditSlugManual(false);
                          }}
                          className="text-[11px] text-textGold hover:underline"
                        >
                          Auto-sync from name
                        </button>
                      )}
                    </div>
                    <input
                      name="slug"
                      required
                      pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                      value={editSlug}
                      onChange={(e) => {
                        setEditSlugManual(true);
                        setEditSlug(slugify(e.target.value));
                      }}
                      className={ADMIN_INPUT_CLASS}
                    />
                  </div>

                  <div>
                    <label className={ADMIN_LABEL_CLASS}>Description</label>
                    <input
                      name="description"
                      defaultValue={category.description ?? ""}
                      className={ADMIN_INPUT_CLASS}
                    />
                  </div>

                  <div>
                    <label className={ADMIN_LABEL_CLASS}>Sort Order</label>
                    <input
                      name="sort_order"
                      type="number"
                      inputMode="numeric"
                      defaultValue={category.sort_order}
                      className={ADMIN_INPUT_CLASS}
                    />
                  </div>

                  <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-[#121212] px-3.5 text-sm text-white/80">
                    <input
                      name="is_active"
                      type="checkbox"
                      defaultChecked={category.is_active}
                      className="h-4 w-4 accent-[#CDA274]"
                    />
                    <span>Active</span>
                  </label>

                  <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setEditing(null)}
                      className={`${ADMIN_BTN_SECONDARY} w-full sm:w-auto`}
                    >
                      Cancel
                    </button>
                    <SubmitButton
                      loadingText="Saving..."
                      className={`${ADMIN_BTN_PRIMARY} w-full sm:w-auto`}
                    >
                      Save Changes
                    </SubmitButton>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-medium text-white sm:text-lg">
                        {category.name}
                      </h3>
                      <span
                        className={`rounded border px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] ${
                          category.is_active
                            ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-300"
                            : "border-white/15 bg-white/5 text-white/55"
                        }`}
                      >
                        {category.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-white/50">
                      /{category.slug} · sort order {category.sort_order}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0 sm:items-center">
                    <button
                      type="button"
                      onClick={() => startEditing(category)}
                      className={`${ADMIN_BTN_OUTLINE_GOLD} px-3.5`}
                    >
                      <FileEdit size={14} />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => {
                        if (category.is_active) {
                          setDeactivateTarget(category);
                        } else {
                          const fd = new FormData();
                          fd.set("id", category.id);
                          fd.set("active", "true");
                          startTransition(async () => {
                            await setCategoryActive(fd);
                          });
                        }
                      }}
                      className={`${ADMIN_BTN_SECONDARY} px-3.5`}
                    >
                      <Power size={14} />
                      <span>{category.is_active ? "Deactivate" : "Activate"}</span>
                    </button>
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>
      )}

      <AdminConfirmDialog
        isOpen={deactivateTarget !== null}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={handleDeactivateConfirm}
        title={deactivateTarget ? `Deactivate "${deactivateTarget.name}"?` : "Deactivate Category?"}
        description="Deactivated categories are hidden from public category menus while preserving product associations."
        confirmLabel="Deactivate"
        tone="danger"
        busy={isPending}
      />
    </div>
  );
}
