"use client";

import { useState, useTransition } from "react";
import { Globe, Image as ImageIcon, Loader2, Plus, Save, Trash2, X } from "lucide-react";
import MediaPickerModal from "@/components/admin/MediaPickerModal";
import { resolveCmsImageSrc } from "@/lib/cms/media";
import type { CmsImageRef, CmsSiteSettingsBundle } from "@/lib/cms/types";
import { publishSiteSettingsAction, saveSiteSettingsDraftAction } from "../actions";

const INPUT_CLASS =
  "w-full rounded-lg border border-white/15 bg-[#111] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-textGold focus:outline-none";
const LABEL_CLASS = "mb-1.5 block text-[11px] font-medium uppercase tracking-[0.12em] text-white/60";

export default function SiteSettingsEditor({
  initialDraft,
  hasUnpublishedSettings,
  tableReady,
}: {
  initialDraft: CmsSiteSettingsBundle;
  hasUnpublishedSettings: boolean;
  tableReady: boolean;
}) {
  const [settings, setSettings] = useState<CmsSiteSettingsBundle>(initialDraft);
  const [tab, setTab] = useState<"identity" | "navigation" | "mega" | "footer" | "templates">(
    "identity"
  );
  const [isDirty, setIsDirty] = useState(false);
  const [pendingNotice, setPendingNotice] = useState(hasUnpublishedSettings);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );
  const [isPending, startTransition] = useTransition();

  const [megaPickerTarget, setMegaPickerTarget] = useState<{
    catIdx: number;
    cardIdx: number;
    alt: string;
  } | null>(null);

  const updateSection = <K extends keyof CmsSiteSettingsBundle>(
    key: K,
    patch: Partial<CmsSiteSettingsBundle[K]>
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...patch },
    }));
    setIsDirty(true);
  };

  const handleSaveDraft = () => {
    setFeedback(null);
    startTransition(async () => {
      const res = await saveSiteSettingsDraftAction(settings);
      if (!res.ok) {
        setFeedback({ type: "error", text: res.error });
        return;
      }
      setIsDirty(false);
      setPendingNotice(true);
      setFeedback({ type: "success", text: "Site settings draft saved." });
    });
  };

  const handlePublish = () => {
    setFeedback(null);
    startTransition(async () => {
      const res = await publishSiteSettingsAction(settings);
      if (!res.ok) {
        setFeedback({ type: "error", text: res.error });
        return;
      }
      setIsDirty(false);
      setPendingNotice(false);
      setFeedback({
        type: "success",
        text: "Published global site settings live across header, footer, mega menu, and templates!",
      });
    });
  };

  const navLinkEditor = (
    title: string,
    links: Array<{ label: string; href: string }>,
    onChange: (next: Array<{ label: string; href: string }>) => void
  ) => (
    <div className="space-y-2.5 rounded-xl border border-white/10 bg-[#0c0c0c] p-4">
      <div className="flex items-center justify-between">
        <span className={LABEL_CLASS}>{title}</span>
        <button
          type="button"
          onClick={() => onChange([...links, { label: "New Link", href: "/" }])}
          className="inline-flex items-center gap-1 rounded border border-textGold/40 bg-textGold/10 px-2.5 py-1 text-[11px] text-textGold"
        >
          <Plus size={12} /> Add Link
        </button>
      </div>
      {links.map((link, idx) => (
        <div key={idx} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <input
            type="text"
            value={link.label}
            onChange={(e) => {
              const next = [...links];
              next[idx] = { ...link, label: e.target.value };
              onChange(next);
            }}
            placeholder="Label"
            className={INPUT_CLASS}
          />
          <input
            type="text"
            value={link.href}
            onChange={(e) => {
              const next = [...links];
              next[idx] = { ...link, href: e.target.value };
              onChange(next);
            }}
            placeholder="/path"
            className={INPUT_CLASS}
          />
          <button
            type="button"
            onClick={() => onChange(links.filter((_, i) => i !== idx))}
            className="rounded border border-red-500/30 p-2 text-red-300"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {!tableReady && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-4 text-xs text-amber-200">
          CMS tables are not created in Supabase yet. Apply{" "}
          <code>supabase/migrations/202611260001_cms_and_media.sql</code> before saving settings.
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
          <button type="button" onClick={() => setFeedback(null)}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#090909] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "identity" as const, label: "Identity & Contact" },
            { id: "navigation" as const, label: "Header & Menus" },
            { id: "mega" as const, label: "Mega Menu Showcase" },
            { id: "footer" as const, label: "Footer" },
            { id: "templates" as const, label: "SEO & Templates" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`rounded-lg border px-3 py-1.5 text-xs transition ${
                tab === item.id
                  ? "border-textGold/60 bg-textGold/15 text-textGold"
                  : "border-white/10 text-white/60 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {(isDirty || pendingNotice) && (
            <span className="rounded-full border border-amber-500/40 bg-amber-950/40 px-2.5 py-1 text-[10px] text-amber-300">
              {isDirty ? "Unsaved edits" : "Draft ahead of live"}
            </span>
          )}
          <button
            type="button"
            disabled={!tableReady || isPending}
            onClick={handleSaveDraft}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 px-3.5 py-2 text-xs text-white hover:border-textGold hover:text-textGold disabled:opacity-45"
          >
            {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save Draft
          </button>
          <button
            type="button"
            disabled={!tableReady || isPending}
            onClick={handlePublish}
            className="inline-flex items-center gap-1.5 rounded-lg bg-textGold px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-black hover:bg-white disabled:opacity-45"
          >
            <Globe size={14} /> Publish Global Settings
          </button>
        </div>
      </div>

      {/* IDENTITY */}
      {tab === "identity" && (
        <div className="space-y-4 rounded-2xl border border-white/10 bg-[#090909] p-6">
          <h2 className="text-lg font-light">Brand Identity, Workshop Address & WhatsApp</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className={LABEL_CLASS}>Short Site Name</label>
              <input
                type="text"
                value={settings.site_identity.siteName}
                onChange={(e) => updateSection("site_identity", { siteName: e.target.value })}
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Legal / Display Name</label>
              <input
                type="text"
                value={settings.site_identity.siteLegalName}
                onChange={(e) => updateSection("site_identity", { siteLegalName: e.target.value })}
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Navbar Brand Title</label>
              <input
                type="text"
                value={settings.site_identity.brandTitle}
                onChange={(e) => updateSection("site_identity", { brandTitle: e.target.value })}
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Navbar Brand Subtitle</label>
              <input
                type="text"
                value={settings.site_identity.brandSubtitle}
                onChange={(e) => updateSection("site_identity", { brandSubtitle: e.target.value })}
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Phone Display</label>
              <input
                type="text"
                value={settings.site_identity.phoneDisplay}
                onChange={(e) => updateSection("site_identity", { phoneDisplay: e.target.value })}
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Email Address</label>
              <input
                type="email"
                value={settings.site_identity.email}
                onChange={(e) => updateSection("site_identity", { email: e.target.value })}
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>WhatsApp Number (digits w/ country code)</label>
              <input
                type="text"
                value={settings.site_identity.whatsappNumber}
                onChange={(e) =>
                  updateSection("site_identity", { whatsappNumber: e.target.value })
                }
                className={INPUT_CLASS}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={LABEL_CLASS}>Floating WhatsApp Pre-filled Greeting</label>
              <input
                type="text"
                value={settings.site_identity.whatsappDefaultMessage}
                onChange={(e) =>
                  updateSection("site_identity", { whatsappDefaultMessage: e.target.value })
                }
                className={INPUT_CLASS}
              />
            </div>
          </div>

          <label className="inline-flex items-center gap-2 text-xs text-white/80">
            <input
              type="checkbox"
              checked={settings.site_identity.showFloatingWhatsapp}
              onChange={(e) =>
                updateSection("site_identity", { showFloatingWhatsapp: e.target.checked })
              }
              className="accent-[#c9a84c]"
            />
            Show floating WhatsApp quick-chat button on public website
          </label>

          <div className="grid gap-4 border-t border-white/10 pt-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2">
              <label className={LABEL_CLASS}>Street Address</label>
              <input
                type="text"
                value={settings.site_identity.streetAddress}
                onChange={(e) => updateSection("site_identity", { streetAddress: e.target.value })}
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>City</label>
              <input
                type="text"
                value={settings.site_identity.city}
                onChange={(e) => updateSection("site_identity", { city: e.target.value })}
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Postal Code</label>
              <input
                type="text"
                value={settings.site_identity.postalCode}
                onChange={(e) => updateSection("site_identity", { postalCode: e.target.value })}
                className={INPUT_CLASS}
              />
            </div>
          </div>
        </div>
      )}

      {/* NAVIGATION */}
      {tab === "navigation" && (
        <div className="space-y-4 rounded-2xl border border-white/10 bg-[#090909] p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={LABEL_CLASS}>Mega Menu Button Label</label>
              <input
                type="text"
                value={settings.navigation.menuButtonLabel}
                onChange={(e) => updateSection("navigation", { menuButtonLabel: e.target.value })}
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Header Contact Link Label</label>
              <input
                type="text"
                value={settings.navigation.contactLink.label}
                onChange={(e) =>
                  updateSection("navigation", {
                    contactLink: { ...settings.navigation.contactLink, label: e.target.value },
                  })
                }
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Header Contact Link URL</label>
              <input
                type="text"
                value={settings.navigation.contactLink.href}
                onChange={(e) =>
                  updateSection("navigation", {
                    contactLink: { ...settings.navigation.contactLink, href: e.target.value },
                  })
                }
                className={INPUT_CLASS}
              />
            </div>
          </div>

          {navLinkEditor(
            "Desktop Navbar Links",
            settings.navigation.desktopLinks,
            (desktopLinks) => updateSection("navigation", { desktopLinks })
          )}
          {navLinkEditor("Mobile Drawer Links", settings.navigation.mobileLinks, (mobileLinks) =>
            updateSection("navigation", { mobileLinks })
          )}
        </div>
      )}

      {/* MEGA MENU */}
      {tab === "mega" && (
        <div className="space-y-4 rounded-2xl border border-white/10 bg-[#090909] p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={LABEL_CLASS}>Menu Eyebrow</label>
              <input
                type="text"
                value={settings.mega_menu.eyebrow}
                onChange={(e) => updateSection("mega_menu", { eyebrow: e.target.value })}
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Bottom Quote Button Text</label>
              <input
                type="text"
                value={settings.mega_menu.quoteCtaLabel}
                onChange={(e) => updateSection("mega_menu", { quoteCtaLabel: e.target.value })}
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Bottom Quote Button Link</label>
              <input
                type="text"
                value={settings.mega_menu.quoteCtaHref}
                onChange={(e) => updateSection("mega_menu", { quoteCtaHref: e.target.value })}
                className={INPUT_CLASS}
              />
            </div>
          </div>

          <div className="space-y-4">
            {settings.mega_menu.categories.map((cat, catIdx) => (
              <div key={cat.key} className="space-y-3 rounded-xl border border-white/10 bg-[#0d0d0d] p-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className={LABEL_CLASS}>Tab Title</label>
                    <input
                      type="text"
                      value={cat.title}
                      onChange={(e) => {
                        const next = [...settings.mega_menu.categories];
                        next[catIdx] = { ...cat, title: e.target.value };
                        updateSection("mega_menu", { categories: next });
                      }}
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Headline</label>
                    <input
                      type="text"
                      value={cat.headline}
                      onChange={(e) => {
                        const next = [...settings.mega_menu.categories];
                        next[catIdx] = { ...cat, headline: e.target.value };
                        updateSection("mega_menu", { categories: next });
                      }}
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>View All Link</label>
                    <input
                      type="text"
                      value={cat.viewAllHref}
                      onChange={(e) => {
                        const next = [...settings.mega_menu.categories];
                        next[catIdx] = { ...cat, viewAllHref: e.target.value };
                        updateSection("mega_menu", { categories: next });
                      }}
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>
                <div>
                  <label className={LABEL_CLASS}>Description</label>
                  <textarea
                    rows={2}
                    value={cat.description}
                    onChange={(e) => {
                      const next = [...settings.mega_menu.categories];
                      next[catIdx] = { ...cat, description: e.target.value };
                      updateSection("mega_menu", { categories: next });
                    }}
                    className={INPUT_CLASS}
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {cat.cards.map((card, cardIdx) => {
                    const resolved = resolveCmsImageSrc(card.image as CmsImageRef);
                    const src =
                      typeof resolved === "string"
                        ? resolved
                        : resolved && typeof resolved === "object" && "src" in resolved
                          ? resolved.src
                          : null;
                    return (
                      <div
                        key={cardIdx}
                        className="flex flex-col gap-2 rounded-lg border border-white/10 bg-[#141414] p-3"
                      >
                        <div className="relative h-24 overflow-hidden rounded bg-black">
                          {src && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={src} alt={card.title} className="h-full w-full object-cover" />
                          )}
                        </div>
                        <input
                          type="text"
                          value={card.title}
                          onChange={(e) => {
                            const next = [...settings.mega_menu.categories];
                            const nextCards = [...cat.cards];
                            nextCards[cardIdx] = { ...card, title: e.target.value };
                            next[catIdx] = { ...cat, cards: nextCards };
                            updateSection("mega_menu", { categories: next });
                          }}
                          className={INPUT_CLASS}
                        />
                        <input
                          type="text"
                          value={card.href}
                          onChange={(e) => {
                            const next = [...settings.mega_menu.categories];
                            const nextCards = [...cat.cards];
                            nextCards[cardIdx] = { ...card, href: e.target.value };
                            next[catIdx] = { ...cat, cards: nextCards };
                            updateSection("mega_menu", { categories: next });
                          }}
                          className={INPUT_CLASS}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setMegaPickerTarget({ catIdx, cardIdx, alt: card.title })
                          }
                          className="inline-flex items-center justify-center gap-1 rounded border border-textGold/40 bg-textGold/10 py-1 text-[11px] text-textGold"
                        >
                          <ImageIcon size={12} /> Change Photo
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER */}
      {tab === "footer" && (
        <div className="space-y-4 rounded-2xl border border-white/10 bg-[#090909] p-6">
          <div>
            <label className={LABEL_CLASS}>Footer Brand Summary</label>
            <textarea
              rows={2}
              value={settings.footer.description}
              onChange={(e) => updateSection("footer", { description: e.target.value })}
              className={INPUT_CLASS}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={LABEL_CLASS}>Quote Section Title</label>
              <input
                type="text"
                value={settings.footer.quoteTitle}
                onChange={(e) => updateSection("footer", { quoteTitle: e.target.value })}
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Quote Button Label</label>
              <input
                type="text"
                value={settings.footer.quoteButtonLabel}
                onChange={(e) => updateSection("footer", { quoteButtonLabel: e.target.value })}
                className={INPUT_CLASS}
              />
            </div>
          </div>

          {navLinkEditor("Discover Links Column", settings.footer.discoverLinks, (discoverLinks) =>
            updateSection("footer", { discoverLinks })
          )}
          {navLinkEditor(
            "Local Fabrication Strip Links",
            settings.footer.localLinks,
            (localLinks) => updateSection("footer", { localLinks })
          )}

          <div>
            <label className={LABEL_CLASS}>Copyright Text</label>
            <input
              type="text"
              value={settings.footer.copyrightText}
              onChange={(e) => updateSection("footer", { copyrightText: e.target.value })}
              className={INPUT_CLASS}
            />
          </div>
        </div>
      )}

      {/* SEO & DYNAMIC TEMPLATES */}
      {tab === "templates" && (
        <div className="space-y-6 rounded-2xl border border-white/10 bg-[#090909] p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-light">Site-Wide Default SEO</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={LABEL_CLASS}>Default Title</label>
                <input
                  type="text"
                  value={settings.seo_defaults.defaultTitle}
                  onChange={(e) =>
                    updateSection("seo_defaults", { defaultTitle: e.target.value })
                  }
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>Title Template</label>
                <input
                  type="text"
                  value={settings.seo_defaults.titleTemplate}
                  onChange={(e) =>
                    updateSection("seo_defaults", { titleTemplate: e.target.value })
                  }
                  className={INPUT_CLASS}
                />
              </div>
            </div>
            <div>
              <label className={LABEL_CLASS}>Default Meta Description</label>
              <textarea
                rows={2}
                value={settings.seo_defaults.defaultDescription}
                onChange={(e) =>
                  updateSection("seo_defaults", { defaultDescription: e.target.value })
                }
                className={INPUT_CLASS}
              />
            </div>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-5">
            <h2 className="text-lg font-light">Dynamic Product, Category & Blog Template Labels</h2>
            <p className="text-xs text-white/50">
              These headings and callout labels control all auto-generated Product, Category, and
              Blog article pages connected to your database catalog.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={LABEL_CLASS}>Category Hero Eyebrow</label>
                <input
                  type="text"
                  value={settings.template_defaults.categoryDetail.heroEyebrow}
                  onChange={(e) =>
                    updateSection("template_defaults", {
                      categoryDetail: {
                        ...settings.template_defaults.categoryDetail,
                        heroEyebrow: e.target.value,
                      },
                    })
                  }
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>Product Designs Heading</label>
                <input
                  type="text"
                  value={settings.template_defaults.productDetail.designsHeading}
                  onChange={(e) =>
                    updateSection("template_defaults", {
                      productDetail: {
                        ...settings.template_defaults.productDetail,
                        designsHeading: e.target.value,
                      },
                    })
                  }
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>Blog Article CTA Eyebrow</label>
                <input
                  type="text"
                  value={settings.template_defaults.blogDetail.ctaEyebrow}
                  onChange={(e) =>
                    updateSection("template_defaults", {
                      blogDetail: {
                        ...settings.template_defaults.blogDetail,
                        ctaEyebrow: e.target.value,
                      },
                    })
                  }
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>Blog Article CTA Heading</label>
                <input
                  type="text"
                  value={settings.template_defaults.blogDetail.ctaHeading}
                  onChange={(e) =>
                    updateSection("template_defaults", {
                      blogDetail: {
                        ...settings.template_defaults.blogDetail,
                        ctaHeading: e.target.value,
                      },
                    })
                  }
                  className={INPUT_CLASS}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <MediaPickerModal
        isOpen={megaPickerTarget !== null}
        onClose={() => setMegaPickerTarget(null)}
        currentAlt={megaPickerTarget?.alt || ""}
        title="Select Mega Menu Card Image"
        onSelect={(img) => {
          if (!megaPickerTarget) return;
          const next = [...settings.mega_menu.categories];
          const cat = next[megaPickerTarget.catIdx];
          if (!cat) return;
          const nextCards = [...cat.cards];
          nextCards[megaPickerTarget.cardIdx] = {
            ...nextCards[megaPickerTarget.cardIdx],
            image: img,
          };
          next[megaPickerTarget.catIdx] = { ...cat, cards: nextCards };
          updateSection("mega_menu", { categories: next });
        }}
      />
    </div>
  );
}
