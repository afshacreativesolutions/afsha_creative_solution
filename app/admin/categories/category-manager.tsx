"use client";

import { useState } from "react";
import { saveCategory, setCategoryActive } from "../actions";
import { SubmitButton } from "../submit-button";
import { slugify } from "@/lib/slug";
import type { CategoryRecord } from "@/lib/catalog-types";

export default function CategoryManager({
  categories,
  saved,
}: {
  categories: CategoryRecord[];
  saved: boolean;
}) {
  const [editing, setEditing] = useState<string | null>(null);

  // Add Category State
  const [addName, setAddName] = useState("");
  const [addSlug, setAddSlug] = useState("");
  const [addSlugManual, setAddSlugManual] = useState(false);

  // Edit Category State
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editSlugManual, setEditSlugManual] = useState(false);

  function startEditing(category: CategoryRecord) {
    setEditing(category.id);
    setEditName(category.name);
    setEditSlug(category.slug);
    setEditSlugManual(true);
  }

  const field =
    "mt-2 w-full border border-white/12 bg-[#080808] px-3 py-2.5 text-sm text-white outline-none focus:border-textGold/60";

  return (
    <>
      {saved && (
        <p role="status" className="mb-5 text-sm text-emerald-300">
          Category saved.
        </p>
      )}

      {/* Add Category Section */}
      <section className="mb-8 border border-white/10 bg-[#080808] p-5 sm:p-7">
        <h2 className="mb-5 text-xl font-light">Add category</h2>
        <form action={saveCategory} className="grid gap-4 sm:grid-cols-2">
          <label className="text-[10px] uppercase tracking-[0.14em] text-white/50">
            Name *
            <input
              name="name"
              required
              value={addName}
              onChange={(e) => {
                const val = e.target.value;
                setAddName(val);
                if (!addSlugManual) setAddSlug(slugify(val));
              }}
              className={field}
              placeholder="Gates"
            />
          </label>

          <label className="text-[10px] uppercase tracking-[0.14em] text-white/50">
            <div className="flex items-center justify-between">
              <span>Slug *</span>
              {addSlugManual && (
                <button
                  type="button"
                  onClick={() => {
                    setAddSlug(slugify(addName));
                    setAddSlugManual(false);
                  }}
                  className="text-[9px] font-normal lowercase tracking-normal text-textGold hover:underline"
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
              className={field}
              placeholder="gates"
            />
          </label>

          <label className="text-[10px] uppercase tracking-[0.14em] text-white/50">
            Description
            <input name="description" className={field} />
          </label>

          <label className="text-[10px] uppercase tracking-[0.14em] text-white/50">
            Sort order
            <input
              name="sort_order"
              type="number"
              defaultValue={categories.length + 1}
              className={field}
            />
          </label>

          <label className="flex items-center gap-3 text-sm text-white/65">
            <input
              name="is_active"
              type="checkbox"
              defaultChecked
              className="accent-[#CDA274]"
            />{" "}
            Active
          </label>

          <div className="flex items-end justify-end">
            <SubmitButton
              loadingText="Adding..."
              className="border border-textGold/60 px-5 py-3 text-[10px] uppercase tracking-[0.15em] text-textGold hover:bg-textGold hover:text-black transition-colors disabled:opacity-40"
            >
              Add category
            </SubmitButton>
          </div>
        </form>
      </section>

      {/* Category List */}
      <div className="space-y-4">
        {categories.map((category) => (
          <section
            key={category.id}
            className="border border-white/10 bg-[#080808] p-5 sm:p-6"
          >
            {editing === category.id ? (
              <form action={saveCategory} className="grid gap-4 sm:grid-cols-2">
                <input type="hidden" name="id" value={category.id} />

                <label className="text-[10px] uppercase tracking-[0.14em] text-white/50">
                  Name *
                  <input
                    name="name"
                    required
                    value={editName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditName(val);
                      if (!editSlugManual) setEditSlug(slugify(val));
                    }}
                    className={field}
                  />
                </label>

                <label className="text-[10px] uppercase tracking-[0.14em] text-white/50">
                  <div className="flex items-center justify-between">
                    <span>Slug *</span>
                    {editSlugManual && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditSlug(slugify(editName));
                          setEditSlugManual(false);
                        }}
                        className="text-[9px] font-normal lowercase tracking-normal text-textGold hover:underline"
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
                    className={field}
                  />
                </label>

                <label className="text-[10px] uppercase tracking-[0.14em] text-white/50">
                  Description
                  <input
                    name="description"
                    defaultValue={category.description ?? ""}
                    className={field}
                  />
                </label>

                <label className="text-[10px] uppercase tracking-[0.14em] text-white/50">
                  Sort order
                  <input
                    name="sort_order"
                    type="number"
                    defaultValue={category.sort_order}
                    className={field}
                  />
                </label>

                <label className="flex items-center gap-3 text-sm text-white/65">
                  <input
                    name="is_active"
                    type="checkbox"
                    defaultChecked={category.is_active}
                    className="accent-[#CDA274]"
                  />{" "}
                  Active
                </label>

                <div className="flex items-end justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    className="text-xs text-white/45 hover:text-white"
                  >
                    Cancel
                  </button>
                  <SubmitButton
                    loadingText="Saving..."
                    className="border border-textGold/60 px-5 py-3 text-[10px] uppercase tracking-[0.15em] text-textGold hover:bg-textGold hover:text-black transition-colors disabled:opacity-40"
                  >
                    Save
                  </SubmitButton>
                </div>
              </form>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-light">{category.name}</h3>
                  <p className="mt-1 text-xs text-white/40">
                    /{category.slug} · order {category.sort_order} ·{" "}
                    {category.is_active ? "Active" : "Inactive"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => startEditing(category)}
                    className="text-xs text-textGold hover:underline"
                  >
                    Edit
                  </button>
                  <form action={setCategoryActive}>
                    <input type="hidden" name="id" value={category.id} />
                    <input
                      type="hidden"
                      name="active"
                      value={String(!category.is_active)}
                    />
                    <SubmitButton
                      loadingText="..."
                      className="text-xs text-white/45 hover:text-white disabled:opacity-40"
                    >
                      {category.is_active ? "Deactivate" : "Activate"}
                    </SubmitButton>
                  </form>
                </div>
              </div>
            )}
          </section>
        ))}
      </div>
    </>
  );
}
