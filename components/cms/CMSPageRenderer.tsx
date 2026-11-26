import JsonLd from "@/components/JsonLd";
import DraftPreviewBanner from "./DraftPreviewBanner";
import CMSSectionRenderer, { type CMSSectionContext } from "./CMSSectionRenderer";
import type { FAQSectionContent, ResolvedCmsPage } from "@/lib/cms/types";

export default function CMSPageRenderer({
  page,
  context,
  showDraftBanner = true,
}: {
  page: ResolvedCmsPage;
  context?: CMSSectionContext;
  showDraftBanner?: boolean;
}) {
  const visibleSections = [...(page.sections ?? [])]
    .filter((s) => s.is_visible)
    .sort((a, b) => a.sort_order - b.sort_order);

  // Collect JSON-LD schemas (page-level structured_data + any FAQ sections opted into FAQPage JSON-LD)
  const schemas: Record<string, unknown>[] = [];
  if (page.structured_data) {
    if (Array.isArray(page.structured_data)) {
      schemas.push(...page.structured_data);
    } else {
      schemas.push(page.structured_data);
    }
  }

  for (const section of visibleSections) {
    if (section.section_type === "faq") {
      const faqContent = section.content as FAQSectionContent;
      if (faqContent.includeJsonLd && faqContent.items?.length) {
        schemas.push({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqContent.items.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        });
      }
    }
  }

  return (
    <main className="bg-background text-white">
      {schemas.length > 0 && <JsonLd data={schemas} />}
      {showDraftBanner && page.isDraftPreview && (
        <DraftPreviewBanner pageTitle={page.title} slug={page.slug} pageId={page.id} />
      )}
      {visibleSections.length > 0 ? (
        visibleSections.map((section) => (
          <CMSSectionRenderer key={section.id} section={section} context={context} />
        ))
      ) : (
        <section className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
          <p className="text-[10px] uppercase tracking-[0.24em] text-textGold">
            {page.title}
          </p>
          <h1 className="mt-4 text-3xl font-light sm:text-4xl">{page.title}</h1>
          <p className="mt-4 text-sm text-white/50">
            Content for this page is currently being prepared.
          </p>
        </section>
      )}
    </main>
  );
}
