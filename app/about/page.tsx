import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CMSPageRenderer from "@/components/cms/CMSPageRenderer";
import Testimonials from "@/components/Testimonials";
import { getCmsPageForRender } from "@/lib/cms/queries";
import { buildCmsPageMetadata } from "@/lib/cms/seo";
import type { TestimonialsContent } from "@/lib/cms/types";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPageForRender("/about");
  return buildCmsPageMetadata(page, "/about");
}

export default async function AboutPage() {
  const [page, homePage] = await Promise.all([
    getCmsPageForRender("/about"),
    getCmsPageForRender("/"),
  ]);
  if (!page) notFound();

  const hasTestimonialsSection = page.sections.some(
    (s) => s.section_type === "testimonials" || s.section_key.includes("testimonial")
  );

  // If CMS /about doesn't yet define a dedicated testimonials section, insert it cleanly before the bottom CTA
  if (hasTestimonialsSection) {
    return <CMSPageRenderer page={page} />;
  }

  const ctaIndex = page.sections.findIndex(
    (s) => s.section_type === "cta_banner" || s.section_key === "about-cta"
  );

  const beforeTestimonialsSections =
    ctaIndex >= 0 ? page.sections.slice(0, ctaIndex) : page.sections;
  const afterTestimonialsSections =
    ctaIndex >= 0 ? page.sections.slice(ctaIndex) : [];

  // Reuse curated CMS testimonials content if available on /, keeping fallback safe defaults otherwise
  const cmsTestimonialContent = homePage?.sections.find(
    (s) => s.section_type === "testimonials"
  )?.content as Partial<TestimonialsContent> | undefined;

  return (
    <>
      <CMSPageRenderer page={{ ...page, sections: beforeTestimonialsSections }} />
      <Testimonials
        sectionId="about-testimonials"
        heading={cmsTestimonialContent?.heading || "CRAFTED FOR SPACES. TRUSTED BY CUSTOMERS."}
        description={
          cmsTestimonialContent?.description ||
          "From the first measurement to the finished installation, our work is built around the customer's requirements. See what homeowners and builders say about Afsha Creative Solution."
        }
        cta={{ label: "GET A QUOTE", href: "/contact#quote-form" }}
        highlightCard={cmsTestimonialContent?.highlightCard ?? null}
        items={cmsTestimonialContent?.items}
        showStats={cmsTestimonialContent?.showStats ?? true}
        stats={cmsTestimonialContent?.stats}
      />
      {afterTestimonialsSections.length > 0 && (
        <CMSPageRenderer page={{ ...page, sections: afterTestimonialsSections }} />
      )}
    </>
  );
}
