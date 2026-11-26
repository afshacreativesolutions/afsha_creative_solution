import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import CMSPageRenderer from "@/components/cms/CMSPageRenderer";
import { getPublicCategories, getPublicProducts } from "@/lib/catalog";
import { getCmsPageForRender, getPublishedCmsSiteSettings } from "@/lib/cms/queries";
import { buildCmsPageMetadata } from "@/lib/cms/seo";
import { images } from "@/utils/images";
import { absoluteUrl } from "@/lib/seo";

type CategoryPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const cmsOverride = await getCmsPageForRender(`/categories/${slug}`);
  if (cmsOverride) {
    return buildCmsPageMetadata(cmsOverride, `/categories/${slug}`);
  }
  const categories = await getPublicCategories();
  const category = categories.find((item) => item.slug === slug);
  if (!category) return { title: "Category Not Found | Afsha Creative Solutions" };
  const title = `${category.name} | Afsha Creative Solutions`;
  const description =
    category.description ||
    `Explore bespoke ${category.name.toLowerCase()} handcrafted in Moradabad by Afsha Creative Solutions. Made-to-measure sizing and premium finishes.`;
  const canonical = `/categories/${category.slug}`;
  const ogImageUrl = `https://www.afshacreative.in/categories/${category.slug}/opengraph-image`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: "Afsha Creative Solution",
      title,
      description,
      url: canonical,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${category.name} — Afsha Creative Solution`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [cmsOverride, categories, products, siteSettings] = await Promise.all([
    getCmsPageForRender(`/categories/${slug}`),
    getPublicCategories(),
    getPublicProducts(),
    getPublishedCmsSiteSettings(),
  ]);

  if (cmsOverride) {
    return <CMSPageRenderer page={cmsOverride} context={{ products, categories }} />;
  }

  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();

  const tpl = siteSettings.template_defaults.categoryDetail;
  const whatsappUrl = `https://wa.me/${siteSettings.site_identity.whatsappNumber}?text=${encodeURIComponent(
    `Hello ${siteSettings.site_identity.siteLegalName}, I would like a custom quote for ${category.name}.`
  )}`;

  const categoryProducts = products.filter(
    (product) =>
      product.category?.slug === slug ||
      (slug === "gates" && product.name.toLowerCase().includes("gate")) ||
      (slug === "stair-railings" && product.name.toLowerCase().includes("stair")) ||
      (slug === "balcony-railings" && product.name.toLowerCase().includes("balcony"))
  );

  // Fallback visual portfolio for this category when DB products are being drafted
  const fallbackCategoryImages =
    slug === "gates"
      ? [
          { title: "Modern Stainless Steel Gate", img: images.steel_gate.ssGate13, mat: "304 Stainless Steel" },
          { title: "Handcrafted Iron Entrance Gate", img: images.iron_gates.ironGate3, mat: "Wrought Iron" },
          { title: "Contemporary Sliding Gate", img: images.steel_gate.ssGate1, mat: "Stainless Steel" },
          { title: "Classical Archway Double Gate", img: images.iron_gates.ironGate1, mat: "Forged Iron" },
        ]
      : slug === "balcony-railings"
      ? [
          { title: "Ornate Wrought Iron Balustrade", img: images.iron_balcony_railing.ironbrail3, mat: "Solid Wrought Iron" },
          { title: "Minimal Horizon Balcony Railing", img: images.steel_balcony_railing.ssBalconyRailling4, mat: "304 Stainless Steel" },
          { title: "French Juliet Balcony Rail", img: images.iron_balcony_railing.ironbrail1, mat: "Forged Iron" },
          { title: "Glass-Ready Balcony Post System", img: images.steel_balcony_railing.ssBalconyRailling7, mat: "Stainless Steel" },
        ]
      : slug === "spiral-railings"
      ? [
          { title: "Sculptural Helical Spiral Rail", img: images.steel_spiral_railing.ssSpiralRailling3, mat: "Roll-Bent Stainless Steel" },
          { title: "Exterior Spiral Safety Rail", img: images.steel_spiral_railing.ssSpiralRailling1, mat: "High-Tensile Steel" },
        ]
      : [
          { title: "Duplex Floating Stair Railing", img: images.steel_stair_railing.ssStairRailling8, mat: "Stainless Steel" },
          { title: "Royal Artisan Stair Balustrade", img: images.iron_stair_railing.ironStairRailling4, mat: "Forged Iron" },
          { title: "Commercial Multi-Floor Handrail", img: images.steel_stair_railing.ssStairRailling13, mat: "Stainless Steel Tubing" },
          { title: "Heritage Scroll Stair Railing", img: images.iron_stair_railing.ironStairRailling2, mat: "Mild Steel & Teak Mount" },
        ];

  return (
    <main className="bg-background text-white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: category.name,
          description: category.description || undefined,
          url: absoluteUrl(`/categories/${category.slug}`),
        }}
      />

      <PageHero
        eyebrow={tpl.heroEyebrow}
        title={
          <>
            {category.name} <span className="text-textGold font-heading">Collection</span>
          </>
        }
        description={
          category.description ||
          `Bespoke ${category.name.toLowerCase()} engineered to order. We customize every detail from dimensions and metal alloys to surface textures and hardware.`
        }
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Categories", href: "/categories" },
          { name: category.name, href: `/categories/${category.slug}` },
        ]}
        primaryCta={{ label: tpl.primaryCtaLabel, href: tpl.primaryCtaHref }}
        badges={tpl.badges}
      />

      {/* Products & Designs Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow={tpl.portfolioEyebrow}
          title={`${category.name} Portfolio`}
          description={tpl.portfolioDescription}
        />

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categoryProducts.map((product) => {
              const image = product.images.find((item) => item.is_primary) ?? product.images[0];
              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#080808] transition duration-300 hover:border-textGold/40"
                >
                  <div className="relative aspect-[0.91] overflow-hidden bg-[#111]">
                    {image?.url && (
                      <Image
                        src={image.url}
                        alt={image.alt_text || product.name}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  </div>
                  <div className="p-5">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-textGold">
                      {product.materials.join(", ") || "Made to measure"}
                    </span>
                    <h3 className="mt-1 text-lg font-light text-white group-hover:text-textGold transition-colors">
                      {product.name}
                    </h3>
                    {product.short_description && (
                      <p className="mt-2 text-xs leading-5 text-white/50">
                        {product.short_description}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-[10px] uppercase tracking-[0.18em] text-textGold">
                      <span>View Specifications</span>
                      <ArrowRight size={13} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {fallbackCategoryImages.map((item) => (
              <div
                key={item.title}
                className="group flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#080808] p-5 transition duration-300 hover:border-textGold/40"
              >
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#111]">
                    <Image
                      src={item.img}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <span className="mt-4 block text-[9px] uppercase tracking-[0.2em] text-textGold">
                    {item.mat}
                  </span>
                  <h3 className="mt-1 text-base font-light text-white group-hover:text-textGold transition-colors">
                    {item.title}
                  </h3>
                </div>

                <div className="mt-6 pt-3 border-t border-white/10">
                  <Link
                    href={`/custom-metalwork?category=${slug}`}
                    className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-textGold hover:text-white transition"
                  >
                    <span>Request Similar Design</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <CTASection
        eyebrow={`Custom ${category.name}`}
        title={`${tpl.ctaTitlePrefix} ${category.name.toLowerCase()}?`}
        description={tpl.ctaDescription}
        primaryLabel="Message On WhatsApp"
        primaryHref={whatsappUrl}
        secondaryLabel="Submit Specifications"
        secondaryHref={tpl.primaryCtaHref}
      />
    </main>
  );
}
