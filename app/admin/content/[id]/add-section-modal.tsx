"use client";

import { useEffect } from "react";
import {
  Award,
  BarChart3,
  Briefcase,
  FileText,
  Grid,
  HelpCircle,
  Image as ImageIcon,
  LayoutTemplate,
  ListChecks,
  MapPin,
  Megaphone,
  MessageSquareQuote,
  Package,
  X,
} from "lucide-react";
import type { CmsSectionType } from "@/lib/cms/types";

const SECTION_CATALOG: Array<{
  type: CmsSectionType;
  label: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}> = [
  {
    type: "hero_banner",
    label: "Hero Banner",
    description: "Page header with headline, gold accent, CTAs, and optional background media.",
    icon: LayoutTemplate,
  },
  {
    type: "image_text",
    label: "Image with Text",
    description: "Split layout pairing workshop photography or videos with storytelling copy.",
    icon: ImageIcon,
  },
  {
    type: "card_grid",
    label: "Card Grid",
    description: "Responsive multi-column cards with numbers, links, highlights, and images.",
    icon: Grid,
  },
  {
    type: "services_grid",
    label: "Services Grid",
    description: "Showcase custom fabrication services with bullet highlights and quote CTAs.",
    icon: Briefcase,
  },
  {
    type: "product_category_grid",
    label: "Products / Categories Grid",
    description: "Live database-connected product showcase, collections tabs, or catalog filters.",
    icon: Package,
  },
  {
    type: "gallery",
    label: "Gallery Lightbox",
    description: "Filterable photography portfolio merging curated installs and catalog products.",
    icon: ImageIcon,
  },
  {
    type: "testimonials",
    label: "Testimonials",
    description: "Verified homeowner & architect reviews with rating spotlight and project metrics.",
    icon: MessageSquareQuote,
  },
  {
    type: "stats_counters",
    label: "Statistics & Counters",
    description: "Bold metric strip for years of experience, projects delivered, and standards.",
    icon: BarChart3,
  },
  {
    type: "features",
    label: "Features / Process Steps",
    description: "Numbered workflow timeline, consultation steps, or key differentiators.",
    icon: ListChecks,
  },
  {
    type: "cta_banner",
    label: "CTA Banner",
    description: "Conversion block with WhatsApp and Custom Quote buttons.",
    icon: Megaphone,
  },
  {
    type: "faq",
    label: "FAQ Accordion",
    description: "Expandable answers with automatic Google FAQ rich-snippet schema.",
    icon: HelpCircle,
  },
  {
    type: "rich_text",
    label: "Rich Text / Blog Index",
    description: "Formatted long-form editorial block or live blog posts showcase.",
    icon: FileText,
  },
  {
    type: "contact_info",
    label: "Contact & Map",
    description: "Google Map embed, workshop address, contact cards, or live enquiry form.",
    icon: MapPin,
  },
  {
    type: "logo_strip",
    label: "Logo / Certification Strip",
    description: "Horizontal strip of partner badges, materials grades, or quality marks.",
    icon: Award,
  },
];

export default function AddSectionModal({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (type: CmsSectionType, label: string) => void;
}) {
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Add Page Section"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex h-[92svh] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl border border-white/15 bg-[#0a0a0a] text-white shadow-2xl sm:h-auto sm:max-h-[88vh] sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3.5 sm:px-6 sm:py-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-textGold">
              Section Library
            </p>
            <h2 className="mt-0.5 text-base font-light sm:text-lg">Choose a Section to Add</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close section library"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-white/10 text-white/60 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-3 overflow-y-auto p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
          {SECTION_CATALOG.map(({ type, label, description, icon: Icon }) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                onAdd(type, label);
                onClose();
              }}
              className="group flex min-h-24 flex-col items-start rounded-xl border border-white/10 bg-[#111] p-4 text-left transition hover:border-textGold/60 hover:bg-textGold/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-textGold"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-textGold/30 bg-textGold/10 text-textGold">
                <Icon size={17} />
              </span>
              <h3 className="mt-3 text-sm font-medium text-white group-hover:text-textGold">
                {label}
              </h3>
              <p className="mt-1 text-xs leading-5 text-white/55">{description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
