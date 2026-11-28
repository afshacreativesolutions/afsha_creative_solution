import { readFile } from "node:fs/promises";
import path from "node:path";

const SUPPORTED_IMAGE_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const EXT_TO_MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

const CATEGORY_FALLBACK_ASSETS: Record<string, string> = {
  gates: "steel gate/SS-MG_13.jpg",
  "main-gates": "steel gate/SS-MG_13.jpg",
  "stair-railings": "steel stair railing/SS-SCR_17.jpg",
  "staircase-railings": "steel stair railing/SS-SCR_17.jpg",
  "balcony-railings": "iron balcony railing/WI-BR_28.jpg",
  "spiral-railings": "steel spiral railing/SS-SR_06.jpg",
  "decorative-grills": "iron stair railing/WI-SR_17.jpg",
  "custom-metalwork": "steel gate/SS-MG_04.jpg",
};

export function getCategoryFallbackAssetPath(categorySlug?: string | null): string {
  const key = (categorySlug || "").toLowerCase().trim();
  if (key && CATEGORY_FALLBACK_ASSETS[key]) {
    return CATEGORY_FALLBACK_ASSETS[key];
  }
  for (const [slug, assetPath] of Object.entries(CATEGORY_FALLBACK_ASSETS)) {
    if (key && (key.includes(slug) || slug.includes(key))) {
      return assetPath;
    }
  }
  return "steel gate/SS-MG_13.jpg";
}

async function fetchRemoteImageAsDataUri(url: string, timeoutMs = 4500): Promise<string | null> {
  if (!/^https?:\/\//i.test(url)) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const rawType = (res.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
    const mime = rawType === "image/jpg" ? "image/jpeg" : rawType;
    if (!SUPPORTED_IMAGE_MIME.has(mime)) {
      return null;
    }
    const buf = await res.arrayBuffer();
    if (!buf.byteLength || buf.byteLength > 8 * 1024 * 1024) {
      return null;
    }
    return `data:${mime};base64,${Buffer.from(buf).toString("base64")}`;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function loadLocalAssetAsDataUri(relPathFromAssets: string): Promise<string | null> {
  try {
    const absPath = path.join(process.cwd(), "assets", relPathFromAssets);
    const ext = path.extname(absPath).toLowerCase();
    const mime = EXT_TO_MIME[ext];
    if (!mime) return null;
    const data = await readFile(absPath);
    return `data:${mime};base64,${data.toString("base64")}`;
  } catch {
    return null;
  }
}

export async function loadImageBufferForAssetOrRemote(
  candidateUrls: Array<string | null | undefined>,
  fallbackCategorySlug?: string | null
): Promise<{ buffer: Buffer; mime: string; filename: string } | null> {
  const mimeToExt: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };

  for (const url of candidateUrls) {
    if (!url || typeof url !== "string") continue;
    if (/^https?:\/\//i.test(url)) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 4500);
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (res.ok) {
          const rawType = (res.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
          const mime = rawType === "image/jpg" ? "image/jpeg" : rawType;
          const ext = mimeToExt[mime];
          if (ext) {
            const arr = await res.arrayBuffer();
            if (arr.byteLength > 0 && arr.byteLength <= 4 * 1024 * 1024) {
              return {
                buffer: Buffer.from(arr),
                mime,
                filename: `product-image.${ext}`,
              };
            }
          }
        }
      } catch {
        // try next candidate
      } finally {
        clearTimeout(timer);
      }
    }
  }

  try {
    const fallbackRel = getCategoryFallbackAssetPath(fallbackCategorySlug);
    const absPath = path.join(process.cwd(), "assets", fallbackRel);
    const ext = path.extname(absPath).toLowerCase();
    const mime = EXT_TO_MIME[ext];
    if (!mime) return null;
    const buffer = await readFile(absPath);
    return {
      buffer,
      mime,
      filename: `product-fallback${ext}`,
    };
  } catch {
    return null;
  }
}

/**
 * Resolves a Satori-safe base64 data URI from candidate remote/local product image URLs,
 * falling back to a verified local showcase photograph so OG endpoints never fail.
 */
export async function resolveOgPhotoDataUri(
  candidateUrls: Array<string | null | undefined>,
  fallbackCategorySlug?: string | null
): Promise<string | null> {
  for (const url of candidateUrls) {
    if (!url || typeof url !== "string") continue;
    if (url.startsWith("data:image/")) return url;
    if (/^https?:\/\//i.test(url)) {
      const remoteDataUri = await fetchRemoteImageAsDataUri(url);
      if (remoteDataUri) return remoteDataUri;
    } else if (url.startsWith("/")) {
      const localFromPublic = await loadLocalAssetAsDataUri(url.replace(/^\/+/, ""));
      if (localFromPublic) return localFromPublic;
    }
  }

  return loadLocalAssetAsDataUri(getCategoryFallbackAssetPath(fallbackCategorySlug));
}
