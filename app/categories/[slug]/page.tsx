import type { Metadata } from "next";
import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getPublicCategories } from "@/lib/catalog";
import { resolveCategoryToCollectionSlug } from "@/lib/collections";
import { SITE_NAME } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = {
  title: `Browse Metalwork Collections | ${SITE_NAME}`,
  robots: { index: false, follow: true },
};

export default async function LegacyCategoryRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categories = await getPublicCategories();
  const mappedSlug = resolveCategoryToCollectionSlug(slug, categories);

  if (mappedSlug) {
    permanentRedirect(`/collections/${mappedSlug}`);
  }

  // Fallback for unknown legacy slugs rather than breaking with 404 or redirecting to homepage
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 py-24 text-center text-white">
      <p className="text-[10px] uppercase tracking-[0.25em] text-textGold">
        Moved to Collections
      </p>
      <h1 className="mt-3 font-heading text-3xl font-light sm:text-4xl">
        Explore All Metalwork Collections
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-7 text-white/65">
        Our gate, railing, and custom architectural metalwork categories are now organized together inside our Collections experience.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/collections"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-textGold px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-white"
        >
          Browse Collections <ArrowRight size={14} />
        </Link>
        <Link
          href="/products"
          className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-5 py-3 text-[10px] uppercase tracking-[0.18em] text-white transition hover:border-textGold hover:text-textGold"
        >
          View All Products
        </Link>
      </div>
    </main>
  );
}
