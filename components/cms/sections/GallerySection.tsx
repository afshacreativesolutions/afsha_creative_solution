import GalleryLightbox, { type GalleryItem } from "@/components/GalleryLightbox";
import LeadEnquiryForm from "@/components/lead/LeadEnquiryForm";
import { resolveCmsImageSrc } from "@/lib/cms/media";
import { images } from "@/utils/images";
import type { ProductRecord } from "@/lib/catalog-types";
import type { GallerySectionContent } from "@/lib/cms/types";

export default function GallerySection({
  content,
  products = [],
  whatsappNumber,
}: {
  content: GallerySectionContent;
  products?: ProductRecord[];
  whatsappNumber?: string;
}) {
  const cmsItems: GalleryItem[] = (content.items ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    categorySlug: item.categorySlug,
    material: item.material,
    description: item.description,
    image: resolveCmsImageSrc(item.image) ?? images.steel_gate.ssGate13,
    alt: item.image?.alt || item.title,
  }));

  const supabaseGalleryItems: GalleryItem[] =
    content.includeLiveProducts !== false
      ? products
          .filter((p) => p.images.length > 0)
          .map((product) => {
            const primaryImage =
              product.images.find((img) => img.is_primary) || product.images[0];
            const isGate =
              product.category?.slug.includes("gate") ||
              product.name.toLowerCase().includes("gate");
            const categorySlug = isGate
              ? "gates"
              : product.category?.slug || "stair-railings";

            return {
              id: `supabase-${product.id}`,
              title: product.name,
              category: product.category?.name || "Architectural Metalwork",
              categorySlug,
              productSlug: product.slug,
              material: product.materials.join(", ") || "Made to Measure",
              description: product.short_description || product.description,
              image: primaryImage.url || images.steel_gate.ssGate13,
              alt: primaryImage.alt_text || product.name,
            };
          })
      : [];

  const allGalleryItems = [
    ...cmsItems,
    ...supabaseGalleryItems.filter(
      (dyn) => !cmsItems.some((s) => s.title.toLowerCase() === dyn.title.toLowerCase())
    ),
  ];

  return (
    <section
      id={content.sectionId}
      className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16"
    >
      {(content.eyebrow || content.heading || content.description) && (
        <div className="mb-8 max-w-2xl">
          {content.eyebrow && (
            <p className="text-[10px] uppercase tracking-[0.24em] text-textGold">
              {content.eyebrow}
            </p>
          )}
          {content.heading && (
            <h2 className="mt-2 text-2xl font-light text-white sm:text-3xl">
              {content.heading}
            </h2>
          )}
          {content.description && (
            <p className="mt-2 text-sm leading-6 text-white/60">{content.description}</p>
          )}
        </div>
      )}

      <GalleryLightbox
        items={allGalleryItems}
        categories={content.filterCategories}
        whatsappNumber={whatsappNumber}
      />

      <div id="gallery-enquiry" className="mt-14 scroll-mt-20 border-t border-white/10 pt-12">
        <LeadEnquiryForm
          placement="gallery_page"
          whatsappNumber={whatsappNumber}
          heading="Want a Similar Custom Gate or Railing?"
          subheading="Select your preferred category, share your site city, and optionally attach a photo or sketch."
        />
      </div>
    </section>
  );
}
