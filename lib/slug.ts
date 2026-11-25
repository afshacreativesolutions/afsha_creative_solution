/**
 * Utility to convert display strings (Product Names, Category Names, Blog Titles)
 * into clean, URL-safe slugs matching Next.js App Router and database constraints:
 * /^[a-z0-9]+(?:-[a-z0-9]+)*$/
 */
export function slugify(text: string): string {
  if (!text) return "";

  return text
    .toString()
    .toLowerCase()
    .trim()
    // Normalize unicode accents (e.g. é -> e)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    // Replace non-alphanumeric characters with hyphens
    .replace(/[^a-z0-9]+/g, "-")
    // Collapse consecutive hyphens
    .replace(/-+/g, "-")
    // Remove leading and trailing hyphens
    .replace(/^-+|-+$/g, "");
}
