import type { MetadataRoute } from "next";
import { getPublicBlogPosts, getPublicCategories, getPublicProducts } from "@/lib/catalog";
import { getPublishedCmsRoutesForSitemap } from "@/lib/cms/queries";
import { absoluteUrl } from "@/lib/site-config";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cmsRoutes, products, categories, posts] = await Promise.all([
    getPublishedCmsRoutesForSitemap().catch(() => []),
    getPublicProducts().catch(() => []),
    getPublicCategories().catch(() => []),
    getPublicBlogPosts().catch(() => []),
  ]);

  const seenUrls = new Set<string>();
  const routes: MetadataRoute.Sitemap = [];

  // Core Collections hub
  const collectionsHubUrl = absoluteUrl("/collections");
  seenUrls.add(collectionsHubUrl);
  routes.push({
    url: collectionsHubUrl,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.92,
  });

  for (const cmsRoute of cmsRoutes) {
    // Exclude retired /categories routes in favor of /collections
    if (
      cmsRoute.slug === "/categories" ||
      cmsRoute.slug.startsWith("/categories/")
    ) {
      continue;
    }

    const url = absoluteUrl(cmsRoute.slug);
    if (seenUrls.has(url)) continue;
    seenUrls.add(url);
    routes.push({
      url,
      lastModified: cmsRoute.updated_at ? new Date(cmsRoute.updated_at) : new Date(),
      changeFrequency: cmsRoute.slug === "/" ? "weekly" : "monthly",
      priority: cmsRoute.slug === "/" ? 1.0 : cmsRoute.page_type === "location" ? 0.8 : 0.7,
    });
  }

  for (const category of categories) {
    const url = absoluteUrl(`/collections/${category.slug}`);
    if (seenUrls.has(url)) continue;
    seenUrls.add(url);
    routes.push({
      url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    });
  }

  for (const product of products) {
    const url = absoluteUrl(`/products/${product.slug}`);
    const productLastMod = product.updated_at ? new Date(product.updated_at) : new Date();
    if (!seenUrls.has(url)) {
      seenUrls.add(url);
      routes.push({
        url,
        lastModified: productLastMod,
        changeFrequency: "monthly",
        priority: 0.9,
      });
    }

    const primaryImage = product.images.find((img) => img.is_primary) ?? product.images[0];
    if (primaryImage) {
      const designUrl = absoluteUrl(`/products/${product.slug}/design/${primaryImage.id}`);
      if (!seenUrls.has(designUrl)) {
        seenUrls.add(designUrl);
        routes.push({
          url: designUrl,
          lastModified: productLastMod,
          changeFrequency: "monthly",
          priority: 0.8,
        });
      }
    }
  }

  for (const post of posts) {
    const url = absoluteUrl(`/blog/${post.slug}`);
    if (seenUrls.has(url)) continue;
    seenUrls.add(url);
    routes.push({
      url,
      lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return routes;
}
