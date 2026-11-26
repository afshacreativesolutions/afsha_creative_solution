import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FAQAccordion from "@/components/FAQAccordion";
import SectionHeading from "@/components/SectionHeading";
import type { FAQSectionContent } from "@/lib/cms/types";

export default function FAQSection({ content }: { content: FAQSectionContent }) {
  const { variant = "stacked_list", items = [] } = content;

  if (variant === "compact_home") {
    return (
      <section
        id={content.sectionId}
        className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-20"
      >
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            {content.eyebrow && (
              <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-textGold">
                {content.eyebrow}
              </p>
            )}
            {content.heading && (
              <h2 className="text-2xl font-light tracking-tight sm:text-4xl">
                {content.heading}
              </h2>
            )}
            {content.description && (
              <p className="mt-4 max-w-sm text-sm leading-7 text-white/55">
                {content.description}
              </p>
            )}
            {content.link && (
              <Link
                href={content.link.href}
                className="mt-5 inline-flex min-h-11 items-center gap-2 text-[9px] font-medium uppercase tracking-[0.18em] text-textGold transition-colors hover:text-white"
              >
                {content.link.label} <ArrowRight size={14} />
              </Link>
            )}
          </div>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {items.map((faq, idx) => (
              <details key={`${faq.question}-${idx}`} className="group py-4 sm:py-5">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-sm font-light text-white marker:content-none sm:text-base [&::-webkit-details-marker]:hidden">
                  <span>{faq.question}</span>
                  <span
                    aria-hidden="true"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 text-lg font-light text-textGold transition-transform duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-2xl pr-10 pt-2 text-sm leading-6 text-white/55">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "categorized_accordion") {
    return (
      <section
        id={content.sectionId}
        className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20"
      >
        <FAQAccordion
          faqs={items.map((item) => ({
            category: item.category || "products",
            question: item.question,
            answer: item.answer,
          }))}
          categories={content.categories}
        />
      </section>
    );
  }

  // stacked_list
  return (
    <section
      id={content.sectionId}
      className={`${
        content.background === "darker" ? "border-t border-white/10 bg-[#050505]" : ""
      } px-4 py-12 sm:px-6 sm:py-20`}
    >
      <div className="mx-auto max-w-4xl">
        {(content.eyebrow || content.heading) && (
          <SectionHeading
            align="center"
            eyebrow={content.eyebrow}
            title={content.heading || "Frequently Asked Questions"}
            description={content.description}
          />
        )}

        <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
          {items.map((faq, idx) => (
            <div key={`${faq.question}-${idx}`} className="py-6">
              <h3 className="text-base font-light text-white sm:text-lg">{faq.question}</h3>
              <p className="mt-3 text-sm leading-7 text-white/60">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
