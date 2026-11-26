import type { StaticBlogPost } from "@/lib/blog-data";
import type { CmsSectionRecord } from "@/lib/cms/types";
import HeroSection from "./sections/HeroSection";
import ImageTextSection from "./sections/ImageTextSection";
import CardGridSection from "./sections/CardGridSection";
import ServicesGridSection from "./sections/ServicesGridSection";
import ProductCategoryGridSection, {
  type CatalogRuntimeContext,
} from "./sections/ProductCategoryGridSection";
import GallerySection from "./sections/GallerySection";
import TestimonialSection from "./sections/TestimonialSection";
import StatsCountersSection from "./sections/StatsCountersSection";
import FeaturesSection from "./sections/FeaturesSection";
import CTASectionRenderer from "./sections/CTASectionRenderer";
import FAQSection from "./sections/FAQSection";
import RichTextSection from "./sections/RichTextSection";
import ContactInfoSection from "./sections/ContactInfoSection";
import LogoStripSection from "./sections/LogoStripSection";

export type CMSSectionContext = CatalogRuntimeContext & {
  blogPosts?: StaticBlogPost[];
};

export default function CMSSectionRenderer({
  section,
  context,
  ignoreVisibility = false,
}: {
  section: CmsSectionRecord;
  context?: CMSSectionContext;
  ignoreVisibility?: boolean;
}) {
  if (!ignoreVisibility && !section.is_visible) {
    return null;
  }

  switch (section.section_type) {
    case "hero_banner":
      return <HeroSection content={section.content as never} />;
    case "image_text":
      return <ImageTextSection content={section.content as never} />;
    case "card_grid":
      return <CardGridSection content={section.content as never} />;
    case "services_grid":
      return <ServicesGridSection content={section.content as never} />;
    case "product_category_grid":
      return (
        <ProductCategoryGridSection
          content={section.content as never}
          catalogContext={context}
        />
      );
    case "gallery":
      return (
        <GallerySection
          content={section.content as never}
          products={context?.products}
        />
      );
    case "testimonials":
      return <TestimonialSection content={section.content as never} />;
    case "stats_counters":
      return <StatsCountersSection content={section.content as never} />;
    case "features":
      return <FeaturesSection content={section.content as never} />;
    case "cta_banner":
      return <CTASectionRenderer content={section.content as never} />;
    case "faq":
      return <FAQSection content={section.content as never} />;
    case "rich_text":
      return (
        <RichTextSection
          content={section.content as never}
          blogPosts={context?.blogPosts}
        />
      );
    case "contact_info":
      return (
        <ContactInfoSection
          content={section.content as never}
          categories={context?.categories}
        />
      );
    case "logo_strip":
      return <LogoStripSection content={section.content as never} />;
    default:
      return null;
  }
}
