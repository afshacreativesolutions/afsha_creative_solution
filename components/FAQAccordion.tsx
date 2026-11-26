"use client";

import { useState, useId } from "react";
import { ChevronDown, Search } from "lucide-react";

export type FAQItem = {
  question: string;
  answer: string;
  category: string;
};

const DEFAULT_FAQ_CATEGORIES = [
  { slug: "all", name: "All Questions" },
  { slug: "products", name: "Products" },
  { slug: "customization", name: "Customization" },
  { slug: "ordering", name: "Ordering & Quotes" },
  { slug: "business", name: "Workshop & Location" },
];

export default function FAQAccordion({
  faqs,
  categories = DEFAULT_FAQ_CATEGORIES,
}: {
  faqs: FAQItem[];
  categories?: Array<{ slug: string; name: string }>;
}) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  const categoryList = categories.length ? categories : DEFAULT_FAQ_CATEGORIES;

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      {/* Search and Category Filter */}
      <div className="mb-8 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-center sm:justify-between">
        <div className="scrollbar-none flex gap-2 overflow-x-auto pb-2 sm:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categoryList.map((cat) => {
            const isActive = activeCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.slug);
                  setOpenIndex(null);
                }}
                className={`shrink-0 rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.16em] transition-colors ${
                  isActive
                    ? "border-textGold bg-textGold font-semibold text-black"
                    : "border-white/12 text-white/55 hover:border-white/30 hover:text-white"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        <div className="relative w-full max-w-xs">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setOpenIndex(null);
            }}
            placeholder="Search questions..."
            className="w-full rounded-full border border-white/15 bg-[#121212] py-2 pl-9 pr-4 text-xs text-white placeholder:text-white/35 focus:border-textGold/70 focus:outline-none"
          />
        </div>
      </div>

      {/* Accordion list */}
      {filteredFaqs.length > 0 ? (
        <div className="divide-y divide-white/10 border-y border-white/10">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const buttonId = `${baseId}-btn-${index}`;
            const panelId = `${baseId}-panel-${index}`;

            return (
              <div key={`${faq.question}-${index}`} className="py-2">
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleAccordion(index)}
                  className="flex w-full items-start justify-between gap-4 py-4 text-left transition-colors hover:text-textGold"
                >
                  <span className="text-base font-light tracking-tight text-white sm:text-lg">
                    {faq.question}
                  </span>
                  <span
                    className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/20 transition-transform duration-300 ${
                      isOpen ? "rotate-180 border-textGold text-textGold" : "text-white/40"
                    }`}
                  >
                    <ChevronDown size={15} />
                  </span>
                </button>

                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="pb-5 pt-1 text-sm leading-7 text-white/65 sm:text-base sm:leading-8"
                  >
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="border border-white/10 py-16 text-center text-sm text-white/45">
          No questions match your search. Contact us directly on WhatsApp for any inquiries!
        </div>
      )}
    </div>
  );
}
