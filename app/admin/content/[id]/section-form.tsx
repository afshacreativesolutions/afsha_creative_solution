"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import MediaPickerModal from "@/components/admin/MediaPickerModal";
import { resolveCmsImageSrc } from "@/lib/cms/media";
import type {
  CTABannerContent,
  CardGridContent,
  CmsButtonConfig,
  CmsImageRef,
  CmsSectionType,
  ContactInfoContent,
  FAQSectionContent,
  FeaturesContent,
  GallerySectionContent,
  HeroBannerContent,
  ImageTextContent,
  LogoStripContent,
  ProductCategoryGridContent,
  RichTextContent,
  ServicesGridContent,
  StatsCountersContent,
  TestimonialsContent,
} from "@/lib/cms/types";

const INPUT_CLASS =
  "min-h-11 w-full rounded-lg border border-white/15 bg-[#111] px-3.5 py-2.5 text-base text-white placeholder:text-white/30 focus:border-textGold focus:outline-none sm:text-sm";
const LABEL_CLASS = "mb-1.5 block text-[11px] font-medium uppercase tracking-[0.12em] text-white/60";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={LABEL_CLASS}>{label}</label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-white/40">{hint}</p>}
    </div>
  );
}

function ImageField({
  label,
  value,
  onChange,
  defaultAlt = "",
}: {
  label: string;
  value?: CmsImageRef | null;
  onChange: (next: CmsImageRef | null) => void;
  defaultAlt?: string;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const resolved = resolveCmsImageSrc(value);
  const previewSrc =
    typeof resolved === "string"
      ? resolved
      : resolved && typeof resolved === "object" && "src" in resolved
        ? resolved.src
        : null;

  return (
    <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-3.5">
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/65">
          {label}
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-textGold/50 bg-textGold/10 px-3 text-xs text-textGold hover:bg-textGold hover:text-black"
          >
            <ImageIcon size={13} /> {value ? "Change Image" : "Select Image"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="inline-flex min-h-10 items-center rounded-lg border border-red-500/30 px-3 text-xs text-red-300 hover:bg-red-950/40"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {value ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black sm:h-16 sm:w-24">
            {previewSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewSrc} alt={value.alt || label} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-[10px] text-white/35">
                No preview
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-1.5">
            <input
              type="text"
              value={value.alt || ""}
              onChange={(e) => onChange({ ...value, alt: e.target.value })}
              placeholder="Image alt text (for SEO & accessibility)"
              className="min-h-10 w-full rounded-lg border border-white/15 bg-[#141414] px-3 text-sm text-white focus:border-textGold focus:outline-none sm:text-xs"
            />
            <p className="truncate text-[10px] text-white/40">
              {value.storagePath || value.url}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-xs text-white/40">No image selected.</p>
      )}

      <MediaPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(img) => onChange(img)}
        currentAlt={value?.alt || defaultAlt}
        title={label}
      />
    </div>
  );
}

function ButtonEditor({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: CmsButtonConfig | null;
  onChange: (next: CmsButtonConfig | null) => void;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-3.5">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/65">
          {label}
        </span>
        {value ? (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="min-h-10 rounded px-2 text-xs text-red-300/85 hover:text-red-200"
          >
            Clear Button
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onChange({ label: "Learn More", href: "/contact" })}
            className="min-h-10 rounded px-2 text-xs text-textGold hover:underline"
          >
            + Add Button
          </button>
        )}
      </div>
      {value && (
        <div className="grid gap-2.5 sm:grid-cols-2">
          <input
            type="text"
            value={value.label}
            onChange={(e) => onChange({ ...value, label: e.target.value })}
            placeholder="Button text"
            className={INPUT_CLASS}
          />
          <input
            type="text"
            value={value.href}
            onChange={(e) => onChange({ ...value, href: e.target.value })}
            placeholder="/contact or https://..."
            className={INPUT_CLASS}
          />
        </div>
      )}
    </div>
  );
}

function StringListEditor({
  label,
  items,
  onChange,
  multiline = false,
  placeholder = "Add item...",
}: {
  label: string;
  items: string[];
  onChange: (next: string[]) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2 rounded-xl border border-white/10 bg-[#0d0d0d] p-3.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/65">
          {label}
        </span>
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-textGold/40 bg-textGold/10 px-3 text-xs text-textGold hover:bg-textGold hover:text-black"
        >
          <Plus size={13} /> Add
        </button>
      </div>
      {items.length === 0 && <p className="text-xs text-white/40">No entries yet.</p>}
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2">
            {multiline ? (
              <textarea
                rows={3}
                value={item}
                onChange={(e) => {
                  const next = [...items];
                  next[idx] = e.target.value;
                  onChange(next);
                }}
                placeholder={placeholder}
                className={INPUT_CLASS}
              />
            ) : (
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const next = [...items];
                  next[idx] = e.target.value;
                  onChange(next);
                }}
                placeholder={placeholder}
                className={INPUT_CLASS}
              />
            )}
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== idx))}
              className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg border border-red-500/30 text-red-300 hover:bg-red-950/40"
              aria-label="Remove item"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function moveItem<T>(list: T[], index: number, dir: -1 | 1): T[] {
  const nextIdx = index + dir;
  if (nextIdx < 0 || nextIdx >= list.length) return list;
  const copy = [...list];
  const [moved] = copy.splice(index, 1);
  copy.splice(nextIdx, 0, moved);
  return copy;
}

function ArrayItemControls({
  index,
  total,
  label,
  onMove,
  onDelete,
}: {
  index: number;
  total: number;
  label: string;
  onMove: (dir: -1 | 1) => void;
  onDelete: () => void;
}) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
      <span className="text-xs font-medium text-textGold">{label}</span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => onMove(-1)}
          aria-label={`Move ${label} up`}
          className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-white/10 text-white/65 hover:text-white disabled:opacity-30"
          title="Move up"
        >
          <ArrowUp size={13} />
        </button>
        <button
          type="button"
          disabled={index === total - 1}
          onClick={() => onMove(1)}
          aria-label={`Move ${label} down`}
          className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-white/10 text-white/65 hover:text-white disabled:opacity-30"
          title="Move down"
        >
          <ArrowDown size={13} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Remove ${label}`}
          className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-red-500/30 text-red-300 hover:bg-red-950/40"
          title="Remove"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

export default function SectionForm({
  sectionType,
  content,
  onChange,
}: {
  sectionType: CmsSectionType;
  content: unknown;
  onChange: (next: unknown) => void;
}) {
  switch (sectionType) {
    case "hero_banner": {
      const c = content as HeroBannerContent;
      const patch = (u: Partial<HeroBannerContent>) => onChange({ ...c, ...u });
      return (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Hero Style">
              <select
                value={c.variant}
                onChange={(e) => patch({ variant: e.target.value as HeroBannerContent["variant"] })}
                className={INPUT_CLASS}
              >
                <option value="page_hero">Standard Page Hero</option>
                <option value="fullscreen_video">Fullscreen Video Hero (Home)</option>
                <option value="split_about">Split Editorial + Dual Photos (About)</option>
                <option value="products_hero">Catalog Banner + Highlights</option>
                <option value="contact_header">Contact Header</option>
              </select>
            </Field>
            <Field label="Alignment">
              <select
                value={c.alignment || "left"}
                onChange={(e) => patch({ alignment: e.target.value as "left" | "center" })}
                className={INPUT_CLASS}
              >
                <option value="left">Left Aligned</option>
                <option value="center">Center Aligned</option>
              </select>
            </Field>
          </div>

          <Field label="Eyebrow / Kicker">
            <input
              type="text"
              value={c.eyebrow || ""}
              onChange={(e) => patch({ eyebrow: e.target.value })}
              className={INPUT_CLASS}
            />
          </Field>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Main Heading">
              <input
                type="text"
                value={c.heading || ""}
                onChange={(e) => patch({ heading: e.target.value })}
                className={INPUT_CLASS}
              />
            </Field>
            <Field label="Gold Highlight Text (Optional)">
              <input
                type="text"
                value={c.highlightText || ""}
                onChange={(e) => patch({ highlightText: e.target.value })}
                className={INPUT_CLASS}
              />
            </Field>
          </div>

          {c.variant === "fullscreen_video" && (
            <Field label="Subtitle (Appears below heading)">
              <textarea
                rows={2}
                value={c.subtitle || ""}
                onChange={(e) => patch({ subtitle: e.target.value })}
                className={INPUT_CLASS}
              />
            </Field>
          )}

          <Field
            label={
              c.variant === "fullscreen_video" ? "Accessible SEO H1 Heading (Screen Reader)" : "Description"
            }
          >
            <textarea
              rows={3}
              value={c.description || ""}
              onChange={(e) => patch({ description: e.target.value })}
              className={INPUT_CLASS}
            />
          </Field>

          {(c.variant === "split_about" || c.variant === "page_hero") && (
            <div className="grid gap-3 sm:grid-cols-2">
              <ImageField
                label="Background / Main Image"
                value={c.backgroundImage}
                onChange={(img) => patch({ backgroundImage: img })}
                defaultAlt={c.heading}
              />
              {c.variant === "split_about" && (
                <ImageField
                  label="Foreground Accent Image"
                  value={c.foregroundImage}
                  onChange={(img) => patch({ foregroundImage: img })}
                  defaultAlt={c.heading}
                />
              )}
            </div>
          )}

          {c.variant === "split_about" && (
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Caption Eyebrow">
                <input
                  type="text"
                  value={c.foregroundCaptionEyebrow || ""}
                  onChange={(e) => patch({ foregroundCaptionEyebrow: e.target.value })}
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="Caption Title">
                <input
                  type="text"
                  value={c.foregroundCaptionTitle || ""}
                  onChange={(e) => patch({ foregroundCaptionTitle: e.target.value })}
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="Location Pill Badge">
                <input
                  type="text"
                  value={c.locationBadge || ""}
                  onChange={(e) => patch({ locationBadge: e.target.value })}
                  className={INPUT_CLASS}
                />
              </Field>
            </div>
          )}

          {c.variant === "fullscreen_video" && (
            <div className="grid gap-3 rounded-xl border border-white/10 bg-[#0d0d0d] p-3.5 sm:grid-cols-2">
              <Field label="Desktop WebM Video Path">
                <input
                  type="text"
                  value={c.videoDesktopWebm || ""}
                  onChange={(e) => patch({ videoDesktopWebm: e.target.value })}
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="Desktop MP4 Video Path">
                <input
                  type="text"
                  value={c.videoDesktopMp4 || ""}
                  onChange={(e) => patch({ videoDesktopMp4: e.target.value })}
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="Mobile MP4 Video Path">
                <input
                  type="text"
                  value={c.videoMobileMp4 || ""}
                  onChange={(e) => patch({ videoMobileMp4: e.target.value })}
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="Poster Fallback Image Path">
                <input
                  type="text"
                  value={c.videoPoster || ""}
                  onChange={(e) => patch({ videoPoster: e.target.value })}
                  className={INPUT_CLASS}
                />
              </Field>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <ButtonEditor
              label="Primary Button"
              value={c.primaryButton}
              onChange={(btn) => patch({ primaryButton: btn })}
            />
            <ButtonEditor
              label="Secondary Button"
              value={c.secondaryButton}
              onChange={(btn) => patch({ secondaryButton: btn })}
            />
          </div>

          <div className="space-y-2 rounded-xl border border-white/10 bg-[#0d0d0d] p-3.5">
            <div className="flex items-center justify-between">
              <span className={LABEL_CLASS}>Trust Badges / Highlights</span>
              <button
                type="button"
                onClick={() => patch({ badges: [...(c.badges || []), { label: "Made to Measure" }] })}
                className="inline-flex items-center gap-1 rounded border border-textGold/40 bg-textGold/10 px-2 py-1 text-[11px] text-textGold"
              >
                <Plus size={12} /> Add Badge
              </button>
            </div>
            {(c.badges || []).map((badge, idx) => (
              <div key={idx} className="grid gap-2 sm:grid-cols-[100px_1fr_auto]">
                <input
                  type="text"
                  value={badge.number || ""}
                  onChange={(e) => {
                    const next = [...(c.badges || [])];
                    next[idx] = { ...badge, number: e.target.value };
                    patch({ badges: next });
                  }}
                  placeholder="01"
                  className={INPUT_CLASS}
                />
                <input
                  type="text"
                  value={badge.label}
                  onChange={(e) => {
                    const next = [...(c.badges || [])];
                    next[idx] = { ...badge, label: e.target.value };
                    patch({ badges: next });
                  }}
                  placeholder="Badge text"
                  className={INPUT_CLASS}
                />
                <button
                  type="button"
                  onClick={() => patch({ badges: (c.badges || []).filter((_, i) => i !== idx) })}
                  className="rounded border border-red-500/30 p-2 text-red-300"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "image_text": {
      const c = content as ImageTextContent;
      const patch = (u: Partial<ImageTextContent>) => onChange({ ...c, ...u });
      return (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Layout Variant">
              <select
                value={c.variant}
                onChange={(e) => patch({ variant: e.target.value as ImageTextContent["variant"] })}
                className={INPUT_CLASS}
              >
                <option value="standard_split">Standard Image + Text Split</option>
                <option value="owner_spotlight">Leadership Portrait Card</option>
                <option value="location_intro">Local Seo Intro + Stat Highlight</option>
                <option value="location_intro_cards">Local Seo Intro + Stat Cards</option>
                <option value="video_showcase">Dual Fabrication Videos</option>
              </select>
            </Field>
            <Field label="Media Position">
              <select
                value={c.imagePosition || "left"}
                onChange={(e) => patch({ imagePosition: e.target.value as "left" | "right" })}
                className={INPUT_CLASS}
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Eyebrow">
              <input
                type="text"
                value={c.eyebrow || ""}
                onChange={(e) => patch({ eyebrow: e.target.value })}
                className={INPUT_CLASS}
              />
            </Field>
            <Field label="Heading">
              <input
                type="text"
                value={c.heading || ""}
                onChange={(e) => patch({ heading: e.target.value })}
                className={INPUT_CLASS}
              />
            </Field>
          </div>

          <StringListEditor
            label="Paragraphs"
            items={c.paragraphs || []}
            onChange={(paragraphs) => patch({ paragraphs })}
            multiline
            placeholder="Write a paragraph..."
          />

          {c.variant !== "video_showcase" ? (
            <>
              <ImageField
                label="Section Image"
                value={c.image}
                onChange={(image) => patch({ image })}
                defaultAlt={c.heading}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Image Overlay Eyebrow">
                  <input
                    type="text"
                    value={c.imageBadgeEyebrow || ""}
                    onChange={(e) => patch({ imageBadgeEyebrow: e.target.value })}
                    className={INPUT_CLASS}
                  />
                </Field>
                <Field label="Image Overlay Title">
                  <input
                    type="text"
                    value={c.imageBadgeTitle || ""}
                    onChange={(e) => patch({ imageBadgeTitle: e.target.value })}
                    className={INPUT_CLASS}
                  />
                </Field>
              </div>
            </>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Primary Video URL">
                <input
                  type="text"
                  value={c.videoPrimaryUrl || ""}
                  onChange={(e) => patch({ videoPrimaryUrl: e.target.value })}
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="Secondary Video URL">
                <input
                  type="text"
                  value={c.videoSecondaryUrl || ""}
                  onChange={(e) => patch({ videoSecondaryUrl: e.target.value })}
                  className={INPUT_CLASS}
                />
              </Field>
            </div>
          )}

          {c.variant === "owner_spotlight" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Workshop Address Text">
                <input
                  type="text"
                  value={c.addressText || ""}
                  onChange={(e) => patch({ addressText: e.target.value })}
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="Google Maps Link">
                <input
                  type="text"
                  value={c.addressHref || ""}
                  onChange={(e) => patch({ addressHref: e.target.value })}
                  className={INPUT_CLASS}
                />
              </Field>
            </div>
          )}

          <ButtonEditor
            label="Optional Call to Action"
            value={c.cta}
            onChange={(cta) => patch({ cta })}
          />
        </div>
      );
    }

    case "card_grid": {
      const c = content as CardGridContent;
      const patch = (u: Partial<CardGridContent>) => onChange({ ...c, ...u });
      return (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Visual Variant">
              <select
                value={c.variant}
                onChange={(e) => patch({ variant: e.target.value as CardGridContent["variant"] })}
                className={INPUT_CLASS}
              >
                <option value="standard">Standard Cards</option>
                <option value="numbered_collection">Numbered Collection (Home)</option>
                <option value="numbered_cards">Numbered Pillars</option>
                <option value="capability_cards">Capability Cards + Images</option>
                <option value="location_collection">Location Feature Cards</option>
                <option value="assurance_strip">Assurance / Guarantees Strip</option>
              </select>
            </Field>
            <Field label="Columns">
              <select
                value={c.columns || 3}
                onChange={(e) => patch({ columns: Number(e.target.value) as 2 | 3 | 4 })}
                className={INPUT_CLASS}
              >
                <option value={2}>2 Columns</option>
                <option value={3}>3 Columns</option>
                <option value={4}>4 Columns</option>
              </select>
            </Field>
            <Field label="Background">
              <select
                value={c.background || "default"}
                onChange={(e) => patch({ background: e.target.value as "default" | "darker" })}
                className={INPUT_CLASS}
              >
                <option value="default">Standard Dark</option>
                <option value="darker">Deeper Contrast (#050505)</option>
              </select>
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Eyebrow">
              <input
                type="text"
                value={c.eyebrow || ""}
                onChange={(e) => patch({ eyebrow: e.target.value })}
                className={INPUT_CLASS}
              />
            </Field>
            <Field label="Section Heading">
              <input
                type="text"
                value={c.heading || ""}
                onChange={(e) => patch({ heading: e.target.value })}
                className={INPUT_CLASS}
              />
            </Field>
          </div>

          <Field label="Section Description">
            <textarea
              rows={2}
              value={c.description || ""}
              onChange={(e) => patch({ description: e.target.value })}
              className={INPUT_CLASS}
            />
          </Field>

          <ButtonEditor
            label="Optional Header Link"
            value={c.headerLink}
            onChange={(headerLink) => patch({ headerLink })}
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={LABEL_CLASS}>Cards ({c.cards.length})</span>
              <button
                type="button"
                onClick={() =>
                  patch({
                    cards: [
                      ...c.cards,
                      {
                        id: `card-${Date.now()}`,
                        number: String(c.cards.length + 1).padStart(2, "0"),
                        title: "New Card",
                        description: "Describe this architectural metalwork option.",
                        link: "/products",
                        buttonText: "Explore",
                      },
                    ],
                  })
                }
                className="inline-flex items-center gap-1 rounded-lg border border-textGold/40 bg-textGold/10 px-3 py-1.5 text-xs text-textGold hover:bg-textGold hover:text-black"
              >
                <Plus size={13} /> Add Card
              </button>
            </div>

            {c.cards.map((card, idx) => (
              <div key={card.id || idx} className="rounded-xl border border-white/10 bg-[#0d0d0d] p-4">
                <ArrayItemControls
                  index={idx}
                  total={c.cards.length}
                  label={`Card ${idx + 1}: ${card.title || "Untitled"}`}
                  onMove={(dir) => patch({ cards: moveItem(c.cards, idx, dir) })}
                  onDelete={() => patch({ cards: c.cards.filter((_, i) => i !== idx) })}
                />
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field label="Number / Code">
                    <input
                      type="text"
                      value={card.number || ""}
                      onChange={(e) => {
                        const next = [...c.cards];
                        next[idx] = { ...card, number: e.target.value };
                        patch({ cards: next });
                      }}
                      className={INPUT_CLASS}
                    />
                  </Field>
                  <Field label="Eyebrow">
                    <input
                      type="text"
                      value={card.eyebrow || ""}
                      onChange={(e) => {
                        const next = [...c.cards];
                        next[idx] = { ...card, eyebrow: e.target.value };
                        patch({ cards: next });
                      }}
                      className={INPUT_CLASS}
                    />
                  </Field>
                  <Field label="Card Title">
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => {
                        const next = [...c.cards];
                        next[idx] = { ...card, title: e.target.value };
                        patch({ cards: next });
                      }}
                      className={INPUT_CLASS}
                    />
                  </Field>
                </div>

                <div className="mt-3 space-y-3">
                  <Field label="Card Description">
                    <textarea
                      rows={2}
                      value={card.description}
                      onChange={(e) => {
                        const next = [...c.cards];
                        next[idx] = { ...card, description: e.target.value };
                        patch({ cards: next });
                      }}
                      className={INPUT_CLASS}
                    />
                  </Field>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Link URL">
                      <input
                        type="text"
                        value={card.link || ""}
                        onChange={(e) => {
                          const next = [...c.cards];
                          next[idx] = { ...card, link: e.target.value };
                          patch({ cards: next });
                        }}
                        className={INPUT_CLASS}
                      />
                    </Field>
                    <Field label="Button Text">
                      <input
                        type="text"
                        value={card.buttonText || ""}
                        onChange={(e) => {
                          const next = [...c.cards];
                          next[idx] = { ...card, buttonText: e.target.value };
                          patch({ cards: next });
                        }}
                        className={INPUT_CLASS}
                      />
                    </Field>
                  </div>
                  <ImageField
                    label="Card Image (Optional)"
                    value={card.image}
                    onChange={(image) => {
                      const next = [...c.cards];
                      next[idx] = { ...card, image };
                      patch({ cards: next });
                    }}
                    defaultAlt={card.title}
                  />
                  <StringListEditor
                    label="Card Highlights (Optional)"
                    items={card.features || []}
                    onChange={(features) => {
                      const next = [...c.cards];
                      next[idx] = { ...card, features };
                      patch({ cards: next });
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "services_grid": {
      const c = content as ServicesGridContent;
      const patch = (u: Partial<ServicesGridContent>) => onChange({ ...c, ...u });
      return (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Eyebrow">
              <input
                type="text"
                value={c.eyebrow || ""}
                onChange={(e) => patch({ eyebrow: e.target.value })}
                className={INPUT_CLASS}
              />
            </Field>
            <Field label="Heading">
              <input
                type="text"
                value={c.heading}
                onChange={(e) => patch({ heading: e.target.value })}
                className={INPUT_CLASS}
              />
            </Field>
          </div>
          <Field label="Description">
            <textarea
              rows={2}
              value={c.description || ""}
              onChange={(e) => patch({ description: e.target.value })}
              className={INPUT_CLASS}
            />
          </Field>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={LABEL_CLASS}>Services ({c.services.length})</span>
              <button
                type="button"
                onClick={() =>
                  patch({
                    services: [
                      ...c.services,
                      {
                        id: `service-${Date.now()}`,
                        eyebrow: "CUSTOM SERVICE",
                        title: "New Metalwork Service",
                        description: "Detailed fabrication capability.",
                        highlights: ["On-site measurement"],
                        primaryButton: { label: "Request Quote", href: "/custom-metalwork" },
                      },
                    ],
                  })
                }
                className="inline-flex items-center gap-1 rounded-lg border border-textGold/40 bg-textGold/10 px-3 py-1.5 text-xs text-textGold"
              >
                <Plus size={13} /> Add Service
              </button>
            </div>
            {c.services.map((srv, idx) => (
              <div key={srv.id || idx} className="space-y-3 rounded-xl border border-white/10 bg-[#0d0d0d] p-4">
                <ArrayItemControls
                  index={idx}
                  total={c.services.length}
                  label={`Service ${idx + 1}: ${srv.title}`}
                  onMove={(dir) => patch({ services: moveItem(c.services, idx, dir) })}
                  onDelete={() => patch({ services: c.services.filter((_, i) => i !== idx) })}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Eyebrow">
                    <input
                      type="text"
                      value={srv.eyebrow || ""}
                      onChange={(e) => {
                        const next = [...c.services];
                        next[idx] = { ...srv, eyebrow: e.target.value };
                        patch({ services: next });
                      }}
                      className={INPUT_CLASS}
                    />
                  </Field>
                  <Field label="Service Title">
                    <input
                      type="text"
                      value={srv.title}
                      onChange={(e) => {
                        const next = [...c.services];
                        next[idx] = { ...srv, title: e.target.value };
                        patch({ services: next });
                      }}
                      className={INPUT_CLASS}
                    />
                  </Field>
                </div>
                <Field label="Description">
                  <textarea
                    rows={2}
                    value={srv.description}
                    onChange={(e) => {
                      const next = [...c.services];
                      next[idx] = { ...srv, description: e.target.value };
                      patch({ services: next });
                    }}
                    className={INPUT_CLASS}
                  />
                </Field>
                <ImageField
                  label="Service Image"
                  value={srv.image}
                  onChange={(image) => {
                    const next = [...c.services];
                    next[idx] = { ...srv, image };
                    patch({ services: next });
                  }}
                  defaultAlt={srv.title}
                />
                <StringListEditor
                  label="Service Highlights"
                  items={srv.highlights || []}
                  onChange={(highlights) => {
                    const next = [...c.services];
                    next[idx] = { ...srv, highlights };
                    patch({ services: next });
                  }}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <ButtonEditor
                    label="Primary Button"
                    value={srv.primaryButton}
                    onChange={(primaryButton) => {
                      const next = [...c.services];
                      next[idx] = { ...srv, primaryButton };
                      patch({ services: next });
                    }}
                  />
                  <ButtonEditor
                    label="Secondary Button"
                    value={srv.secondaryButton}
                    onChange={(secondaryButton) => {
                      const next = [...c.services];
                      next[idx] = { ...srv, secondaryButton };
                      patch({ services: next });
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "product_category_grid": {
      const c = content as ProductCategoryGridContent;
      const patch = (u: Partial<ProductCategoryGridContent>) => onChange({ ...c, ...u });
      const showCategoriesList =
        c.variant === "featured_categories" || c.variant === "all_categories_grid";
      return (
        <div className="space-y-4">
          <div className="rounded-lg border border-sky-500/30 bg-sky-950/20 px-3.5 py-2.5 text-xs text-sky-200">
            Connected directly to your live <strong>Products</strong> and <strong>Categories</strong>{" "}
            catalog tables.
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Display Mode">
              <select
                value={c.variant}
                onChange={(e) =>
                  patch({ variant: e.target.value as ProductCategoryGridContent["variant"] })
                }
                className={INPUT_CLASS}
              >
                <option value="featured_carousel">Featured Projects Carousel</option>
                <option value="collection_tabs">Tabbed Gates / Railings Showcase</option>
                <option value="featured_categories">Featured Categories Spotlight</option>
                <option value="all_categories_grid">All Curated Categories Grid</option>
                <option value="full_catalog">Interactive Full Catalog Filter Grid</option>
              </select>
            </Field>
            <Field label="Max Items">
              <input
                type="number"
                min={1}
                max={48}
                value={c.maxItems || 12}
                onChange={(e) => patch({ maxItems: Number(e.target.value) || 12 })}
                className={INPUT_CLASS}
              />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Eyebrow">
              <input
                type="text"
                value={c.eyebrow || ""}
                onChange={(e) => patch({ eyebrow: e.target.value })}
                className={INPUT_CLASS}
              />
            </Field>
            <Field label="Heading">
              <input
                type="text"
                value={c.heading || ""}
                onChange={(e) => patch({ heading: e.target.value })}
                className={INPUT_CLASS}
              />
            </Field>
          </div>

          <Field label="Description">
            <textarea
              rows={2}
              value={c.description || ""}
              onChange={(e) => patch({ description: e.target.value })}
              className={INPUT_CLASS}
            />
          </Field>

          <div className="grid gap-3 sm:grid-cols-2">
            <ButtonEditor
              label="Header Link"
              value={c.headerLink}
              onChange={(headerLink) => patch({ headerLink })}
            />
            <ButtonEditor
              label="Section CTA Button"
              value={c.cta}
              onChange={(cta) => patch({ cta })}
            />
          </div>

          {showCategoriesList && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={LABEL_CLASS}>
                  Curated Category Cards ({c.categories?.length || 0})
                </span>
                <button
                  type="button"
                  onClick={() =>
                    patch({
                      categories: [
                        ...(c.categories || []),
                        {
                          id: `cat-${Date.now()}`,
                          name: "New Category",
                          slug: "new-category",
                          href: "/products",
                          description: "Describe this category.",
                          isFeatured: true,
                        },
                      ],
                    })
                  }
                  className="inline-flex items-center gap-1 rounded border border-textGold/40 bg-textGold/10 px-2.5 py-1 text-xs text-textGold"
                >
                  <Plus size={12} /> Add Category Card
                </button>
              </div>
              {(c.categories || []).map((cat, idx) => (
                <div
                  key={cat.id || idx}
                  className="space-y-3 rounded-xl border border-white/10 bg-[#0d0d0d] p-4"
                >
                  <ArrayItemControls
                    index={idx}
                    total={(c.categories || []).length}
                    label={cat.name}
                    onMove={(dir) =>
                      patch({ categories: moveItem(c.categories || [], idx, dir) })
                    }
                    onDelete={() =>
                      patch({
                        categories: (c.categories || []).filter((_, i) => i !== idx),
                      })
                    }
                  />
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Field label="Category Name">
                      <input
                        type="text"
                        value={cat.name}
                        onChange={(e) => {
                          const next = [...(c.categories || [])];
                          next[idx] = { ...cat, name: e.target.value };
                          patch({ categories: next });
                        }}
                        className={INPUT_CLASS}
                      />
                    </Field>
                    <Field label="Material Subtitle">
                      <input
                        type="text"
                        value={cat.material || ""}
                        onChange={(e) => {
                          const next = [...(c.categories || [])];
                          next[idx] = { ...cat, material: e.target.value };
                          patch({ categories: next });
                        }}
                        className={INPUT_CLASS}
                      />
                    </Field>
                    <Field label="Target Link">
                      <input
                        type="text"
                        value={cat.href}
                        onChange={(e) => {
                          const next = [...(c.categories || [])];
                          next[idx] = { ...cat, href: e.target.value };
                          patch({ categories: next });
                        }}
                        className={INPUT_CLASS}
                      />
                    </Field>
                  </div>
                  <Field label="Description">
                    <textarea
                      rows={2}
                      value={cat.description}
                      onChange={(e) => {
                        const next = [...(c.categories || [])];
                        next[idx] = { ...cat, description: e.target.value };
                        patch({ categories: next });
                      }}
                      className={INPUT_CLASS}
                    />
                  </Field>
                  <ImageField
                    label="Category Cover Image"
                    value={cat.image}
                    onChange={(image) => {
                      const next = [...(c.categories || [])];
                      next[idx] = { ...cat, image };
                      patch({ categories: next });
                    }}
                    defaultAlt={cat.name}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    case "gallery": {
      const c = content as GallerySectionContent;
      const patch = (u: Partial<GallerySectionContent>) => onChange({ ...c, ...u });
      return (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Eyebrow">
              <input
                type="text"
                value={c.eyebrow || ""}
                onChange={(e) => patch({ eyebrow: e.target.value })}
                className={INPUT_CLASS}
              />
            </Field>
            <Field label="Heading">
              <input
                type="text"
                value={c.heading || ""}
                onChange={(e) => patch({ heading: e.target.value })}
                className={INPUT_CLASS}
              />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-xs text-white/80">
            <input
              type="checkbox"
              checked={c.includeLiveProducts !== false}
              onChange={(e) => patch({ includeLiveProducts: e.target.checked })}
              className="accent-[#c9a84c]"
            />
            Automatically include photos from published Catalog Products
          </label>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={LABEL_CLASS}>Curated Gallery Items ({c.items.length})</span>
              <button
                type="button"
                onClick={() =>
                  patch({
                    items: [
                      ...c.items,
                      {
                        id: `gal-${Date.now()}`,
                        title: "New Project Photo",
                        category: "Main Gates",
                        categorySlug: "gates",
                        material: "304 Stainless Steel",
                        description: "Project summary.",
                        image: { url: "", alt: "Project photo" },
                      },
                    ],
                  })
                }
                className="inline-flex items-center gap-1 rounded border border-textGold/40 bg-textGold/10 px-2.5 py-1 text-xs text-textGold"
              >
                <Plus size={12} /> Add Photo
              </button>
            </div>

            {c.items.map((item, idx) => (
              <div key={item.id || idx} className="space-y-3 rounded-xl border border-white/10 bg-[#0d0d0d] p-4">
                <ArrayItemControls
                  index={idx}
                  total={c.items.length}
                  label={item.title}
                  onMove={(dir) => patch({ items: moveItem(c.items, idx, dir) })}
                  onDelete={() => patch({ items: c.items.filter((_, i) => i !== idx) })}
                />
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field label="Title">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const next = [...c.items];
                        next[idx] = { ...item, title: e.target.value };
                        patch({ items: next });
                      }}
                      className={INPUT_CLASS}
                    />
                  </Field>
                  <Field label="Category Label">
                    <input
                      type="text"
                      value={item.category}
                      onChange={(e) => {
                        const next = [...c.items];
                        next[idx] = { ...item, category: e.target.value };
                        patch({ items: next });
                      }}
                      className={INPUT_CLASS}
                    />
                  </Field>
                  <Field label="Category Filter Slug">
                    <input
                      type="text"
                      value={item.categorySlug}
                      onChange={(e) => {
                        const next = [...c.items];
                        next[idx] = { ...item, categorySlug: e.target.value };
                        patch({ items: next });
                      }}
                      className={INPUT_CLASS}
                    />
                  </Field>
                </div>
                <Field label="Material / Finish">
                  <input
                    type="text"
                    value={item.material}
                    onChange={(e) => {
                      const next = [...c.items];
                      next[idx] = { ...item, material: e.target.value };
                      patch({ items: next });
                    }}
                    className={INPUT_CLASS}
                  />
                </Field>
                <Field label="Description">
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => {
                      const next = [...c.items];
                      next[idx] = { ...item, description: e.target.value };
                      patch({ items: next });
                    }}
                    className={INPUT_CLASS}
                  />
                </Field>
                <ImageField
                  label="Gallery Photo"
                  value={item.image}
                  onChange={(image) => {
                    const next = [...c.items];
                    next[idx] = { ...item, image: image || { url: "", alt: item.title } };
                    patch({ items: next });
                  }}
                  defaultAlt={item.title}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "testimonials": {
      const c = content as TestimonialsContent;
      const patch = (u: Partial<TestimonialsContent>) => onChange({ ...c, ...u });
      return (
        <div className="space-y-4">
          <Field label="Section Heading">
            <input
              type="text"
              value={c.heading}
              onChange={(e) => patch({ heading: e.target.value })}
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="Description">
            <textarea
              rows={2}
              value={c.description}
              onChange={(e) => patch({ description: e.target.value })}
              className={INPUT_CLASS}
            />
          </Field>
          <ButtonEditor
            label="Section CTA Button"
            value={c.cta}
            onChange={(cta) => patch({ cta })}
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={LABEL_CLASS}>Testimonials ({c.items.length})</span>
              <button
                type="button"
                onClick={() =>
                  patch({
                    items: [
                      ...c.items,
                      {
                        id: `test-${Date.now()}`,
                        author: "Client Name",
                        role: "Homeowner, Moradabad",
                        quote: "Excellent custom metalwork and clean installation.",
                        avatarLetter: "C",
                      },
                    ],
                  })
                }
                className="inline-flex items-center gap-1 rounded border border-textGold/40 bg-textGold/10 px-2.5 py-1 text-xs text-textGold"
              >
                <Plus size={12} /> Add Review
              </button>
            </div>
            {c.items.map((item, idx) => (
              <div key={item.id || idx} className="space-y-3 rounded-xl border border-white/10 bg-[#0d0d0d] p-4">
                <ArrayItemControls
                  index={idx}
                  total={c.items.length}
                  label={item.author}
                  onMove={(dir) => patch({ items: moveItem(c.items, idx, dir) })}
                  onDelete={() => patch({ items: c.items.filter((_, i) => i !== idx) })}
                />
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field label="Client Name">
                    <input
                      type="text"
                      value={item.author}
                      onChange={(e) => {
                        const next = [...c.items];
                        next[idx] = { ...item, author: e.target.value };
                        patch({ items: next });
                      }}
                      className={INPUT_CLASS}
                    />
                  </Field>
                  <Field label="Location / Role">
                    <input
                      type="text"
                      value={item.role}
                      onChange={(e) => {
                        const next = [...c.items];
                        next[idx] = { ...item, role: e.target.value };
                        patch({ items: next });
                      }}
                      className={INPUT_CLASS}
                    />
                  </Field>
                  <Field label="Avatar Letter">
                    <input
                      type="text"
                      maxLength={2}
                      value={item.avatarLetter}
                      onChange={(e) => {
                        const next = [...c.items];
                        next[idx] = { ...item, avatarLetter: e.target.value };
                        patch({ items: next });
                      }}
                      className={INPUT_CLASS}
                    />
                  </Field>
                </div>
                <Field label="Quote">
                  <textarea
                    rows={3}
                    value={item.quote}
                    onChange={(e) => {
                      const next = [...c.items];
                      next[idx] = { ...item, quote: e.target.value };
                      patch({ items: next });
                    }}
                    className={INPUT_CLASS}
                  />
                </Field>
                <ImageField
                  label="Project Photo (Optional)"
                  value={item.image}
                  onChange={(image) => {
                    const next = [...c.items];
                    next[idx] = { ...item, image };
                    patch({ items: next });
                  }}
                  defaultAlt={item.author}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "stats_counters": {
      const c = content as StatsCountersContent;
      const patch = (u: Partial<StatsCountersContent>) => onChange({ ...c, ...u });
      return (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Eyebrow">
              <input
                type="text"
                value={c.eyebrow || ""}
                onChange={(e) => patch({ eyebrow: e.target.value })}
                className={INPUT_CLASS}
              />
            </Field>
            <Field label="Heading">
              <input
                type="text"
                value={c.heading || ""}
                onChange={(e) => patch({ heading: e.target.value })}
                className={INPUT_CLASS}
              />
            </Field>
            <Field label="Columns">
              <select
                value={c.columns || 4}
                onChange={(e) => patch({ columns: Number(e.target.value) as 2 | 3 | 4 | 5 })}
                className={INPUT_CLASS}
              >
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </Field>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className={LABEL_CLASS}>Metrics</span>
              <button
                type="button"
                onClick={() => patch({ items: [...c.items, { value: "100%", label: "Custom" }] })}
                className="inline-flex items-center gap-1 rounded border border-textGold/40 bg-textGold/10 px-2.5 py-1 text-xs text-textGold"
              >
                <Plus size={12} /> Add Stat
              </button>
            </div>
            {c.items.map((stat, idx) => (
              <div key={idx} className="grid gap-2 rounded-lg border border-white/10 bg-[#0d0d0d] p-3 sm:grid-cols-[120px_1fr_1fr_auto]">
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => {
                    const next = [...c.items];
                    next[idx] = { ...stat, value: e.target.value };
                    patch({ items: next });
                  }}
                  placeholder="20+"
                  className={INPUT_CLASS}
                />
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => {
                    const next = [...c.items];
                    next[idx] = { ...stat, label: e.target.value };
                    patch({ items: next });
                  }}
                  placeholder="Label"
                  className={INPUT_CLASS}
                />
                <input
                  type="text"
                  value={stat.sublabel || ""}
                  onChange={(e) => {
                    const next = [...c.items];
                    next[idx] = { ...stat, sublabel: e.target.value };
                    patch({ items: next });
                  }}
                  placeholder="Sublabel (optional)"
                  className={INPUT_CLASS}
                />
                <button
                  type="button"
                  onClick={() => patch({ items: c.items.filter((_, i) => i !== idx) })}
                  className="rounded border border-red-500/30 p-2 text-red-300"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "features": {
      const c = content as FeaturesContent;
      const patch = (u: Partial<FeaturesContent>) => onChange({ ...c, ...u });
      return (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Layout Style">
              <select
                value={c.variant}
                onChange={(e) => patch({ variant: e.target.value as FeaturesContent["variant"] })}
                className={INPUT_CLASS}
              >
                <option value="process_with_callout">4-Step Process + Callout Box</option>
                <option value="timeline_rows">Numbered Timeline Rows</option>
                <option value="phase_cards">Phase Step Cards</option>
                <option value="step_cards">Grid Step Cards</option>
              </select>
            </Field>
            <Field label="Background">
              <select
                value={c.background || "default"}
                onChange={(e) => patch({ background: e.target.value as "default" | "darker" })}
                className={INPUT_CLASS}
              >
                <option value="default">Standard</option>
                <option value="darker">Darker (#050505)</option>
              </select>
            </Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Eyebrow">
              <input
                type="text"
                value={c.eyebrow || ""}
                onChange={(e) => patch({ eyebrow: e.target.value })}
                className={INPUT_CLASS}
              />
            </Field>
            <Field label="Heading">
              <input
                type="text"
                value={c.heading}
                onChange={(e) => patch({ heading: e.target.value })}
                className={INPUT_CLASS}
              />
            </Field>
          </div>
          <Field label="Description">
            <textarea
              rows={2}
              value={c.description || ""}
              onChange={(e) => patch({ description: e.target.value })}
              className={INPUT_CLASS}
            />
          </Field>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={LABEL_CLASS}>Steps / Features</span>
              <button
                type="button"
                onClick={() =>
                  patch({
                    items: [
                      ...c.items,
                      {
                        number: String(c.items.length + 1).padStart(2, "0"),
                        title: "New Step",
                        description: "Describe this fabrication stage.",
                      },
                    ],
                  })
                }
                className="inline-flex items-center gap-1 rounded border border-textGold/40 bg-textGold/10 px-2.5 py-1 text-xs text-textGold"
              >
                <Plus size={12} /> Add Step
              </button>
            </div>
            {c.items.map((item, idx) => (
              <div key={idx} className="space-y-2.5 rounded-xl border border-white/10 bg-[#0d0d0d] p-4">
                <ArrayItemControls
                  index={idx}
                  total={c.items.length}
                  label={`Item ${idx + 1}`}
                  onMove={(dir) => patch({ items: moveItem(c.items, idx, dir) })}
                  onDelete={() => patch({ items: c.items.filter((_, i) => i !== idx) })}
                />
                <div className="grid gap-2.5 sm:grid-cols-[100px_1fr]">
                  <input
                    type="text"
                    value={item.number}
                    onChange={(e) => {
                      const next = [...c.items];
                      next[idx] = { ...item, number: e.target.value };
                      patch({ items: next });
                    }}
                    placeholder="01"
                    className={INPUT_CLASS}
                  />
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const next = [...c.items];
                      next[idx] = { ...item, title: e.target.value };
                      patch({ items: next });
                    }}
                    placeholder="Step title"
                    className={INPUT_CLASS}
                  />
                </div>
                <textarea
                  rows={2}
                  value={item.description}
                  onChange={(e) => {
                    const next = [...c.items];
                    next[idx] = { ...item, description: e.target.value };
                    patch({ items: next });
                  }}
                  className={INPUT_CLASS}
                />
              </div>
            ))}
          </div>

          {c.variant === "process_with_callout" && (
            <div className="space-y-2.5 rounded-xl border border-textGold/20 bg-textGold/[0.03] p-4">
              <div className="flex items-center justify-between">
                <span className={LABEL_CLASS}>Bottom Craftsmanship Callout</span>
                {c.callout ? (
                  <button
                    type="button"
                    onClick={() => patch({ callout: null })}
                    className="text-xs text-red-300"
                  >
                    Remove Callout
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      patch({
                        callout: {
                          eyebrow: "Our craftsmanship",
                          text: "Traditional metalcraft meets modern architecture.",
                          buttonLabel: "Discuss project",
                          buttonHref: "/contact",
                        },
                      })
                    }
                    className="text-xs text-textGold"
                  >
                    + Add Callout
                  </button>
                )}
              </div>
              {c.callout && (
                <div className="grid gap-2.5 sm:grid-cols-2">
                  <input
                    type="text"
                    value={c.callout.eyebrow || ""}
                    onChange={(e) => patch({ callout: { ...c.callout!, eyebrow: e.target.value } })}
                    placeholder="Eyebrow"
                    className={INPUT_CLASS}
                  />
                  <input
                    type="text"
                    value={c.callout.buttonLabel}
                    onChange={(e) =>
                      patch({ callout: { ...c.callout!, buttonLabel: e.target.value } })
                    }
                    placeholder="Button label"
                    className={INPUT_CLASS}
                  />
                  <input
                    type="text"
                    value={c.callout.text}
                    onChange={(e) => patch({ callout: { ...c.callout!, text: e.target.value } })}
                    placeholder="Callout text"
                    className={INPUT_CLASS}
                  />
                  <input
                    type="text"
                    value={c.callout.buttonHref}
                    onChange={(e) =>
                      patch({ callout: { ...c.callout!, buttonHref: e.target.value } })
                    }
                    placeholder="/contact"
                    className={INPUT_CLASS}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    case "cta_banner": {
      const c = content as CTABannerContent;
      const patch = (u: Partial<CTABannerContent>) => onChange({ ...c, ...u });
      return (
        <div className="space-y-4">
          <Field label="Banner Style">
            <select
              value={c.variant || "standard"}
              onChange={(e) => patch({ variant: e.target.value as CTABannerContent["variant"] })}
              className={INPUT_CLASS}
            >
              <option value="standard">Standard CTA Strip</option>
              <option value="gold_glow_card">Gold-Tinted Highlight Card</option>
              <option value="workshop_notice">Workshop Notice Banner</option>
              <option value="split_dark_card">Split Dark Card</option>
              <option value="centered_help_card">Centered Support Card</option>
            </select>
          </Field>
          <Field label="Eyebrow">
            <input
              type="text"
              value={c.eyebrow || ""}
              onChange={(e) => patch({ eyebrow: e.target.value })}
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="Heading">
            <input
              type="text"
              value={c.heading || ""}
              onChange={(e) => patch({ heading: e.target.value })}
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="Description">
            <textarea
              rows={2}
              value={c.description || ""}
              onChange={(e) => patch({ description: e.target.value })}
              className={INPUT_CLASS}
            />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <ButtonEditor
              label="Primary Button"
              value={c.primaryButton}
              onChange={(primaryButton) => patch({ primaryButton })}
            />
            <ButtonEditor
              label="Secondary Button"
              value={c.secondaryButton}
              onChange={(secondaryButton) => patch({ secondaryButton })}
            />
          </div>
        </div>
      );
    }

    case "faq": {
      const c = content as FAQSectionContent;
      const patch = (u: Partial<FAQSectionContent>) => onChange({ ...c, ...u });
      return (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Display Style">
              <select
                value={c.variant}
                onChange={(e) => patch({ variant: e.target.value as FAQSectionContent["variant"] })}
                className={INPUT_CLASS}
              >
                <option value="compact_home">Compact Home Split Accordion</option>
                <option value="categorized_accordion">Filterable Categorized FAQ</option>
                <option value="stacked_list">Clean Stacked Cards</option>
              </select>
            </Field>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-xs text-white/80">
                <input
                  type="checkbox"
                  checked={c.includeJsonLd !== false}
                  onChange={(e) => patch({ includeJsonLd: e.target.checked })}
                  className="accent-[#c9a84c]"
                />
                Generate Google FAQ Schema (JSON-LD)
              </label>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Eyebrow">
              <input
                type="text"
                value={c.eyebrow || ""}
                onChange={(e) => patch({ eyebrow: e.target.value })}
                className={INPUT_CLASS}
              />
            </Field>
            <Field label="Heading">
              <input
                type="text"
                value={c.heading || ""}
                onChange={(e) => patch({ heading: e.target.value })}
                className={INPUT_CLASS}
              />
            </Field>
          </div>
          <Field label="Description">
            <textarea
              rows={2}
              value={c.description || ""}
              onChange={(e) => patch({ description: e.target.value })}
              className={INPUT_CLASS}
            />
          </Field>
          <ButtonEditor
            label="Side Action Link (Optional)"
            value={c.link}
            onChange={(link) => patch({ link })}
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={LABEL_CLASS}>Questions ({c.items.length})</span>
              <button
                type="button"
                onClick={() =>
                  patch({
                    items: [
                      ...c.items,
                      {
                        id: `faq-${Date.now()}`,
                        category: "materials-and-quality",
                        question: "New Frequently Asked Question?",
                        answer: "Provide a clear, helpful answer.",
                      },
                    ],
                  })
                }
                className="inline-flex items-center gap-1 rounded border border-textGold/40 bg-textGold/10 px-2.5 py-1 text-xs text-textGold"
              >
                <Plus size={12} /> Add Question
              </button>
            </div>
            {c.items.map((faq, idx) => (
              <div key={faq.id || idx} className="space-y-2.5 rounded-xl border border-white/10 bg-[#0d0d0d] p-4">
                <ArrayItemControls
                  index={idx}
                  total={c.items.length}
                  label={`FAQ ${idx + 1}`}
                  onMove={(dir) => patch({ items: moveItem(c.items, idx, dir) })}
                  onDelete={() => patch({ items: c.items.filter((_, i) => i !== idx) })}
                />
                <div className="grid gap-2.5 sm:grid-cols-[180px_1fr]">
                  <input
                    type="text"
                    value={faq.category}
                    onChange={(e) => {
                      const next = [...c.items];
                      next[idx] = { ...faq, category: e.target.value };
                      patch({ items: next });
                    }}
                    placeholder="Category slug"
                    className={INPUT_CLASS}
                  />
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => {
                      const next = [...c.items];
                      next[idx] = { ...faq, question: e.target.value };
                      patch({ items: next });
                    }}
                    placeholder="Question"
                    className={INPUT_CLASS}
                  />
                </div>
                <textarea
                  rows={2}
                  value={faq.answer}
                  onChange={(e) => {
                    const next = [...c.items];
                    next[idx] = { ...faq, answer: e.target.value };
                    patch({ items: next });
                  }}
                  placeholder="Answer"
                  className={INPUT_CLASS}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "rich_text": {
      const c = content as RichTextContent;
      const patch = (u: Partial<RichTextContent>) => onChange({ ...c, ...u });
      return (
        <div className="space-y-4">
          <Field label="Section Role">
            <select
              value={c.variant || "prose"}
              onChange={(e) => patch({ variant: e.target.value as "prose" | "blog_index" })}
              className={INPUT_CLASS}
            >
              <option value="prose">Rich Text / Editorial Content</option>
              <option value="blog_index">Live Blog Articles Grid</option>
            </select>
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Eyebrow">
              <input
                type="text"
                value={c.eyebrow || ""}
                onChange={(e) => patch({ eyebrow: e.target.value })}
                className={INPUT_CLASS}
              />
            </Field>
            <Field label="Heading">
              <input
                type="text"
                value={c.heading || ""}
                onChange={(e) => patch({ heading: e.target.value })}
                className={INPUT_CLASS}
              />
            </Field>
          </div>
          <Field label="Summary Description">
            <textarea
              rows={2}
              value={c.description || ""}
              onChange={(e) => patch({ description: e.target.value })}
              className={INPUT_CLASS}
            />
          </Field>
          {c.variant !== "blog_index" && (
            <Field
              label="Formatted Body Copy"
              hint="Supports safe headings (## Title, ### Subtitle) and bullet points (- Item). Raw HTML scripts are stripped automatically."
            >
              <textarea
                rows={8}
                value={c.body || ""}
                onChange={(e) => patch({ body: e.target.value })}
                className={INPUT_CLASS}
              />
            </Field>
          )}
          <ButtonEditor
            label="Optional Call to Action"
            value={c.cta}
            onChange={(cta) => patch({ cta })}
          />
        </div>
      );
    }

    case "contact_info": {
      const c = content as ContactInfoContent;
      const patch = (u: Partial<ContactInfoContent>) => onChange({ ...c, ...u });
      return (
        <div className="space-y-4">
          <Field label="Contact Section Type">
            <select
              value={c.variant}
              onChange={(e) =>
                patch({ variant: e.target.value as ContactInfoContent["variant"] })
              }
              className={INPUT_CLASS}
            >
              <option value="map_embed">Interactive Google Map + Address</option>
              <option value="contact_methods_and_form">Contact Cards + Enquiry Form</option>
              <option value="quote_form">Custom Specification Quote Form</option>
              <option value="workshop_coverage">Moradabad Workshop & Service Areas</option>
            </select>
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Eyebrow">
              <input
                type="text"
                value={c.eyebrow || ""}
                onChange={(e) => patch({ eyebrow: e.target.value })}
                className={INPUT_CLASS}
              />
            </Field>
            <Field label="Heading">
              <input
                type="text"
                value={c.heading || ""}
                onChange={(e) => patch({ heading: e.target.value })}
                className={INPUT_CLASS}
              />
            </Field>
          </div>
          <Field label="Description">
            <textarea
              rows={2}
              value={c.description || ""}
              onChange={(e) => patch({ description: e.target.value })}
              className={INPUT_CLASS}
            />
          </Field>

          {c.variant === "map_embed" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Workshop Address">
                <input
                  type="text"
                  value={c.address || ""}
                  onChange={(e) => patch({ address: e.target.value })}
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="Phone Display">
                <input
                  type="text"
                  value={c.phoneDisplay || ""}
                  onChange={(e) => patch({ phoneDisplay: e.target.value })}
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="Google Maps Embed URL">
                <input
                  type="text"
                  value={c.mapEmbedUrl || ""}
                  onChange={(e) => patch({ mapEmbedUrl: e.target.value })}
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="Map Pin Badge Title">
                <input
                  type="text"
                  value={c.mapBadgeTitle || ""}
                  onChange={(e) => patch({ mapBadgeTitle: e.target.value })}
                  className={INPUT_CLASS}
                />
              </Field>
            </div>
          )}

          {c.variant === "workshop_coverage" && (
            <StringListEditor
              label="Service Coverage Cities / Areas"
              items={c.coverageAreas || []}
              onChange={(coverageAreas) => patch({ coverageAreas })}
            />
          )}

          {(c.variant === "contact_methods_and_form" || c.variant === "quote_form") && (
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Form Eyebrow">
                <input
                  type="text"
                  value={c.formEyebrow || ""}
                  onChange={(e) => patch({ formEyebrow: e.target.value })}
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="Form Heading">
                <input
                  type="text"
                  value={c.formTitle || ""}
                  onChange={(e) => patch({ formTitle: e.target.value })}
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="Default Category Slug">
                <input
                  type="text"
                  value={c.defaultCategory || ""}
                  onChange={(e) => patch({ defaultCategory: e.target.value })}
                  className={INPUT_CLASS}
                />
              </Field>
            </div>
          )}
        </div>
      );
    }

    case "logo_strip": {
      const c = content as LogoStripContent;
      const patch = (u: Partial<LogoStripContent>) => onChange({ ...c, ...u });
      return (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Eyebrow">
              <input
                type="text"
                value={c.eyebrow || ""}
                onChange={(e) => patch({ eyebrow: e.target.value })}
                className={INPUT_CLASS}
              />
            </Field>
            <Field label="Heading">
              <input
                type="text"
                value={c.heading || ""}
                onChange={(e) => patch({ heading: e.target.value })}
                className={INPUT_CLASS}
              />
            </Field>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={LABEL_CLASS}>Strip Items ({c.items.length})</span>
              <button
                type="button"
                onClick={() =>
                  patch({
                    items: [...c.items, { id: `logo-${Date.now()}`, name: "Partner / Standard" }],
                  })
                }
                className="inline-flex items-center gap-1 rounded border border-textGold/40 bg-textGold/10 px-2.5 py-1 text-xs text-textGold"
              >
                <Plus size={12} /> Add Item
              </button>
            </div>
            {c.items.map((item, idx) => (
              <div key={item.id || idx} className="space-y-2.5 rounded-xl border border-white/10 bg-[#0d0d0d] p-4">
                <ArrayItemControls
                  index={idx}
                  total={c.items.length}
                  label={item.name}
                  onMove={(dir) => patch({ items: moveItem(c.items, idx, dir) })}
                  onDelete={() => patch({ items: c.items.filter((_, i) => i !== idx) })}
                />
                <div className="grid gap-2.5 sm:grid-cols-3">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => {
                      const next = [...c.items];
                      next[idx] = { ...item, name: e.target.value };
                      patch({ items: next });
                    }}
                    placeholder="Title / Brand"
                    className={INPUT_CLASS}
                  />
                  <input
                    type="text"
                    value={item.caption || ""}
                    onChange={(e) => {
                      const next = [...c.items];
                      next[idx] = { ...item, caption: e.target.value };
                      patch({ items: next });
                    }}
                    placeholder="Caption"
                    className={INPUT_CLASS}
                  />
                  <input
                    type="text"
                    value={item.href || ""}
                    onChange={(e) => {
                      const next = [...c.items];
                      next[idx] = { ...item, href: e.target.value };
                      patch({ items: next });
                    }}
                    placeholder="Optional link"
                    className={INPUT_CLASS}
                  />
                </div>
                <ImageField
                  label="Logo / Badge Image (Optional)"
                  value={item.image}
                  onChange={(image) => {
                    const next = [...c.items];
                    next[idx] = { ...item, image };
                    patch({ items: next });
                  }}
                  defaultAlt={item.name}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }
  }
}
