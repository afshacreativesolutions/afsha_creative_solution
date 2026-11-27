"use client";

import { useState, useTransition } from "react";
import { Globe, Image as ImageIcon, Loader2, Plus, Save, Trash2, X } from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import AdminConfirmDialog from "@/components/admin/AdminConfirmDialog";
import AdminFormActions from "@/components/admin/AdminFormActions";
import {
  ADMIN_BTN_PRIMARY,
  ADMIN_BTN_SECONDARY,
  ADMIN_INPUT_CLASS,
  ADMIN_LABEL_CLASS,
  ADMIN_TEXTAREA_CLASS,
} from "@/components/admin/admin-styles";
import MediaPickerModal from "@/components/admin/MediaPickerModal";
import { resolveCmsImageSrc } from "@/lib/cms/media";
import type { CmsImageRef, CmsSiteSettingsBundle } from "@/lib/cms/types";
import { publishSiteSettingsAction, saveSiteSettingsDraftAction } from "../actions";

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
  const [publishConfirmOpen, setPublishConfirmOpen] = useState(false);
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
      setPublishConfirmOpen(false);
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
    <div className="space-y-3 rounded-xl border border-white/10 bg-[#0c0c0c] p-3.5 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/70">
          {title}
        </span>
        <button
          type="button"
          onClick={() => onChange([...links, { label: "New Link", href: "/" }])}
          className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-textGold/40 bg-textGold/10 px-3 text-xs text-textGold hover:bg-textGold hover:text-black"
        >
          <Plus size={13} /> Add Link
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
            aria-label={`${title} label ${idx + 1}`}
            className={ADMIN_INPUT_CLASS}
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
            aria-label={`${title} URL ${idx + 1}`}
            className={ADMIN_INPUT_CLASS}
          />
          <button
            type="button"
            onClick={() => onChange(links.filter((_, i) => i !== idx))}
            aria-label={`Remove ${link.label || "link"}`}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-red-500/30 text-red-300 hover:bg-red-950/40"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {!tableReady && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-4 text-xs text-amber-200">
          CMS tables are not created yet. Apply{" "}
          <code>supabase/migrations/202611260001_cms_and_media.sql</code> before saving settings.
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
            aria-label="Dismiss notification"
            className="inline-flex min-h-9 min-w-9 items-center justify-center rounded hover:bg-white/10"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Tabs + Save / Publish Toolbar */}
      <div className="space-y-3 rounded-xl border border-white/10 bg-[#0d0d0d] p-3.5 sm:p-4">
        <div className="scrollbar-none -mx-1 flex flex-nowrap gap-2 overflow-x-auto px-1 sm:flex-wrap sm:overflow-visible">
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
              className={`inline-flex min-h-11 shrink-0 items-center rounded-lg border px-3.5 text-xs transition ${
                tab === item.id
                  ? "border-textGold/60 bg-textGold/15 font-medium text-textGold"
                  : "border-white/10 text-white/65 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <AdminFormActions
          className="border-0 bg-black/40 p-3"
          status={
            isDirty || pendingNotice ? (
              <span className="inline-flex rounded-full border border-amber-500/40 bg-amber-950/40 px-2.5 py-1 text-[11px] text-amber-300">
                {isDirty ? "Unsaved edits" : "Draft ahead of live"}
              </span>
            ) : (
              <span className="text-white/50">All settings match live site.</span>
            )
          }
        >
          <button
            type="button"
            disabled={!tableReady || isPending}
            onClick={handleSaveDraft}
            className={`${ADMIN_BTN_SECONDARY} w-full sm:w-auto`}
          >
            {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            <span>Save Draft</span>
          </button>
          <button
            type="button"
            disabled={!tableReady || isPending}
            onClick={() => setPublishConfirmOpen(true)}
            className={`${ADMIN_BTN_PRIMARY} w-full sm:w-auto`}
          >
            <Globe size={14} />
            <span>Publish Global Settings</span>
          </button>
        </AdminFormActions>
      </div>

      {/* IDENTITY */}
      {tab === "identity" && (
        <AdminCard title="Brand Identity, Workshop Address & WhatsApp">
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className={ADMIN_LABEL_CLASS}>Short Site Name</label>
                <input
                  type="text"
                  value={settings.site_identity.siteName}
                  onChange={(e) => updateSection("site_identity", { siteName: e.target.value })}
                  className={ADMIN_INPUT_CLASS}
                />
              </div>
              <div>
                <label className={ADMIN_LABEL_CLASS}>Legal / Display Name</label>
                <input
                  type="text"
                  value={settings.site_identity.siteLegalName}
                  onChange={(e) => updateSection("site_identity", { siteLegalName: e.target.value })}
                  className={ADMIN_INPUT_CLASS}
                />
              </div>
              <div>
                <label className={ADMIN_LABEL_CLASS}>Navbar Brand Title</label>
                <input
                  type="text"
                  value={settings.site_identity.brandTitle}
                  onChange={(e) => updateSection("site_identity", { brandTitle: e.target.value })}
                  className={ADMIN_INPUT_CLASS}
                />
              </div>
              <div>
                <label className={ADMIN_LABEL_CLASS}>Navbar Brand Subtitle</label>
                <input
                  type="text"
                  value={settings.site_identity.brandSubtitle}
                  onChange={(e) => updateSection("site_identity", { brandSubtitle: e.target.value })}
                  className={ADMIN_INPUT_CLASS}
                />
              </div>
              <div>
                <label className={ADMIN_LABEL_CLASS}>Phone Display</label>
                <input
                  type="tel"
                  value={settings.site_identity.phoneDisplay}
                  onChange={(e) => updateSection("site_identity", { phoneDisplay: e.target.value })}
                  className={ADMIN_INPUT_CLASS}
                />
              </div>
              <div>
                <label className={ADMIN_LABEL_CLASS}>Email Address</label>
                <input
                  type="email"
                  value={settings.site_identity.email}
                  onChange={(e) => updateSection("site_identity", { email: e.target.value })}
                  className={ADMIN_INPUT_CLASS}
                />
              </div>
              <div>
                <label className={ADMIN_LABEL_CLASS}>WhatsApp Number (digits w/ country code)</label>
                <input
                  type="tel"
                  value={settings.site_identity.whatsappNumber}
                  onChange={(e) =>
                    updateSection("site_identity", { whatsappNumber: e.target.value })
                  }
                  className={ADMIN_INPUT_CLASS}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={ADMIN_LABEL_CLASS}>WhatsApp Pre-filled Greeting</label>
                <input
                  type="text"
                  value={settings.site_identity.whatsappDefaultMessage}
                  onChange={(e) =>
                    updateSection("site_identity", { whatsappDefaultMessage: e.target.value })
                  }
                  className={ADMIN_INPUT_CLASS}
                />
              </div>
            </div>

            <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-[#121212] px-3.5 text-sm text-white/85">
              <input
                type="checkbox"
                checked={settings.site_identity.showFloatingWhatsapp}
                onChange={(e) =>
                  updateSection("site_identity", { showFloatingWhatsapp: e.target.checked })
                }
                className="h-4 w-4 accent-[#c9a84c]"
              />
              <span>Show floating WhatsApp quick-chat button on public desktop website</span>
            </label>

            <div className="grid gap-4 border-t border-white/10 pt-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="sm:col-span-2">
                <label className={ADMIN_LABEL_CLASS}>Street Address</label>
                <input
                  type="text"
                  value={settings.site_identity.streetAddress}
                  onChange={(e) => updateSection("site_identity", { streetAddress: e.target.value })}
                  className={ADMIN_INPUT_CLASS}
                />
              </div>
              <div>
                <label className={ADMIN_LABEL_CLASS}>City</label>
                <input
                  type="text"
                  value={settings.site_identity.city}
                  onChange={(e) => updateSection("site_identity", { city: e.target.value })}
                  className={ADMIN_INPUT_CLASS}
                />
              </div>
              <div>
                <label className={ADMIN_LABEL_CLASS}>Postal Code</label>
                <input
                  type="text"
                  value={settings.site_identity.postalCode}
                  onChange={(e) => updateSection("site_identity", { postalCode: e.target.value })}
                  className={ADMIN_INPUT_CLASS}
                />
              </div>
            </div>
          </div>
        </AdminCard>
      )}

      {/* NAVIGATION */}
      {tab === "navigation" && (
        <AdminCard title="Header & Navigation Menus">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className={ADMIN_LABEL_CLASS}>Mega Menu Button Label</label>
                <input
                  type="text"
                  value={settings.navigation.menuButtonLabel}
                  onChange={(e) => updateSection("navigation", { menuButtonLabel: e.target.value })}
                  className={ADMIN_INPUT_CLASS}
                />
              </div>
              <div>
                <label className={ADMIN_LABEL_CLASS}>Header Contact Label</label>
                <input
                  type="text"
                  value={settings.navigation.contactLink.label}
                  onChange={(e) =>
                    updateSection("navigation", {
                      contactLink: { ...settings.navigation.contactLink, label: e.target.value },
                    })
                  }
                  className={ADMIN_INPUT_CLASS}
                />
              </div>
              <div>
                <label className={ADMIN_LABEL_CLASS}>Header Contact URL</label>
                <input
                  type="text"
                  value={settings.navigation.contactLink.href}
                  onChange={(e) =>
                    updateSection("navigation", {
                      contactLink: { ...settings.navigation.contactLink, href: e.target.value },
                    })
                  }
                  className={ADMIN_INPUT_CLASS}
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
        </AdminCard>
      )}

      {/* MEGA MENU */}
      {tab === "mega" && (
        <AdminCard title="Mega Menu Showcase">
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className={ADMIN_LABEL_CLASS}>Menu Eyebrow</label>
                <input
                  type="text"
                  value={settings.mega_menu.eyebrow}
                  onChange={(e) => updateSection("mega_menu", { eyebrow: e.target.value })}
                  className={ADMIN_INPUT_CLASS}
                />
              </div>
              <div>
                <label className={ADMIN_LABEL_CLASS}>Bottom Quote Button Text</label>
                <input
                  type="text"
                  value={settings.mega_menu.quoteCtaLabel}
                  onChange={(e) => updateSection("mega_menu", { quoteCtaLabel: e.target.value })}
                  className={ADMIN_INPUT_CLASS}
                />
              </div>
              <div>
                <label className={ADMIN_LABEL_CLASS}>Bottom Quote Button Link</label>
                <input
                  type="text"
                  value={settings.mega_menu.quoteCtaHref}
                  onChange={(e) => updateSection("mega_menu", { quoteCtaHref: e.target.value })}
                  className={ADMIN_INPUT_CLASS}
                />
              </div>
            </div>

            <div className="space-y-4">
              {settings.mega_menu.categories.map((cat, catIdx) => (
                <div
                  key={cat.key}
                  className="space-y-3 rounded-xl border border-white/10 bg-[#0d0d0d] p-4"
                >
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <label className={ADMIN_LABEL_CLASS}>Tab Title</label>
                      <input
                        type="text"
                        value={cat.title}
                        onChange={(e) => {
                          const next = [...settings.mega_menu.categories];
                          next[catIdx] = { ...cat, title: e.target.value };
                          updateSection("mega_menu", { categories: next });
                        }}
                        className={ADMIN_INPUT_CLASS}
                      />
                    </div>
                    <div>
                      <label className={ADMIN_LABEL_CLASS}>Headline</label>
                      <input
                        type="text"
                        value={cat.headline}
                        onChange={(e) => {
                          const next = [...settings.mega_menu.categories];
                          next[catIdx] = { ...cat, headline: e.target.value };
                          updateSection("mega_menu", { categories: next });
                        }}
                        className={ADMIN_INPUT_CLASS}
                      />
                    </div>
                    <div>
                      <label className={ADMIN_LABEL_CLASS}>View All Link</label>
                      <input
                        type="text"
                        value={cat.viewAllHref}
                        onChange={(e) => {
                          const next = [...settings.mega_menu.categories];
                          next[catIdx] = { ...cat, viewAllHref: e.target.value };
                          updateSection("mega_menu", { categories: next });
                        }}
                        className={ADMIN_INPUT_CLASS}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={ADMIN_LABEL_CLASS}>Description</label>
                    <textarea
                      rows={2}
                      value={cat.description}
                      onChange={(e) => {
                        const next = [...settings.mega_menu.categories];
                        next[catIdx] = { ...cat, description: e.target.value };
                        updateSection("mega_menu", { categories: next });
                      }}
                      className={ADMIN_TEXTAREA_CLASS}
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
                          <div className="relative h-28 overflow-hidden rounded bg-black">
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
                            className={ADMIN_INPUT_CLASS}
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
                            className={ADMIN_INPUT_CLASS}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setMegaPickerTarget({ catIdx, cardIdx, alt: card.title })
                            }
                            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-textGold/40 bg-textGold/10 text-xs text-textGold hover:bg-textGold hover:text-black"
                          >
                            <ImageIcon size={13} /> Change Photo
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AdminCard>
      )}

      {/* FOOTER */}
      {tab === "footer" && (
        <AdminCard title="Website Footer">
          <div className="space-y-4">
            <div>
              <label className={ADMIN_LABEL_CLASS}>Footer Brand Summary</label>
              <textarea
                rows={2}
                value={settings.footer.description}
                onChange={(e) => updateSection("footer", { description: e.target.value })}
                className={ADMIN_TEXTAREA_CLASS}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={ADMIN_LABEL_CLASS}>Quote Section Title</label>
                <input
                  type="text"
                  value={settings.footer.quoteTitle}
                  onChange={(e) => updateSection("footer", { quoteTitle: e.target.value })}
                  className={ADMIN_INPUT_CLASS}
                />
              </div>
              <div>
                <label className={ADMIN_LABEL_CLASS}>Quote Button Label</label>
                <input
                  type="text"
                  value={settings.footer.quoteButtonLabel}
                  onChange={(e) => updateSection("footer", { quoteButtonLabel: e.target.value })}
                  className={ADMIN_INPUT_CLASS}
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
              <label className={ADMIN_LABEL_CLASS}>Copyright Text</label>
              <input
                type="text"
                value={settings.footer.copyrightText}
                onChange={(e) => updateSection("footer", { copyrightText: e.target.value })}
                className={ADMIN_INPUT_CLASS}
              />
            </div>
          </div>
        </AdminCard>
      )}

      {/* SEO & TEMPLATES */}
      {tab === "templates" && (
        <AdminCard title="Site-Wide Default SEO & Dynamic Templates">
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={ADMIN_LABEL_CLASS}>Default Title</label>
                <input
                  type="text"
                  value={settings.seo_defaults.defaultTitle}
                  onChange={(e) =>
                    updateSection("seo_defaults", { defaultTitle: e.target.value })
                  }
                  className={ADMIN_INPUT_CLASS}
                />
              </div>
              <div>
                <label className={ADMIN_LABEL_CLASS}>Title Template</label>
                <input
                  type="text"
                  value={settings.seo_defaults.titleTemplate}
                  onChange={(e) =>
                    updateSection("seo_defaults", { titleTemplate: e.target.value })
                  }
                  className={ADMIN_INPUT_CLASS}
                />
              </div>
            </div>

            <div>
              <label className={ADMIN_LABEL_CLASS}>Default Meta Description</label>
              <textarea
                rows={2}
                value={settings.seo_defaults.defaultDescription}
                onChange={(e) =>
                  updateSection("seo_defaults", { defaultDescription: e.target.value })
                }
                className={ADMIN_TEXTAREA_CLASS}
              />
            </div>

            <div className="space-y-4 border-t border-white/10 pt-5">
              <h3 className="text-base font-light text-white">
                Dynamic Product, Category &amp; Blog Labels
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={ADMIN_LABEL_CLASS}>Category Hero Eyebrow</label>
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
                    className={ADMIN_INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className={ADMIN_LABEL_CLASS}>Product Designs Heading</label>
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
                    className={ADMIN_INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className={ADMIN_LABEL_CLASS}>Blog Article CTA Eyebrow</label>
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
                    className={ADMIN_INPUT_CLASS}
                  />
                </div>
                <div>
                  <label className={ADMIN_LABEL_CLASS}>Blog Article CTA Heading</label>
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
                    className={ADMIN_INPUT_CLASS}
                  />
                </div>
              </div>
            </div>
          </div>
        </AdminCard>
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

      <AdminConfirmDialog
        isOpen={publishConfirmOpen}
        onClose={() => setPublishConfirmOpen(false)}
        onConfirm={handlePublish}
        title="Publish Global Site Settings?"
        description="This immediately updates navigation links, brand phone/WhatsApp contacts, footer details, and global SEO settings on the live website."
        confirmLabel="Publish Live"
        tone="gold"
        busy={isPending}
      />
    </div>
  );
}
