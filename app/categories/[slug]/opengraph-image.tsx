import { ImageResponse } from "next/og";
import { getPublicCategories, getPublicProducts } from "@/lib/catalog";
import { resolveOgPhotoDataUri } from "@/lib/og-image-loader";

export const runtime = "nodejs";
export const revalidate = 300;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryOpenGraphImage({ params }: Props) {
  const { slug } = await params;
  const [categories, products] = await Promise.all([
    getPublicCategories().catch(() => []),
    getPublicProducts().catch(() => []),
  ]);

  const category = categories.find((c) => c.slug === slug);
  const categoryProducts = products.filter(
    (p) => p.category?.slug === slug || p.category_id === category?.id
  );

  const title = category?.name || "Architectural Metalwork Category";
  const description =
    category?.description ||
    "Explore bespoke architectural metal fabrication collections handcrafted in Moradabad.";
  const countText =
    categoryProducts.length > 0
      ? `${categoryProducts.length} Custom Designs`
      : "Bespoke Collection";

  const candidateUrls = categoryProducts
    .map((p) => (p.images.find((i) => i.is_primary) ?? p.images[0])?.url)
    .filter((url): url is string => Boolean(url));

  const photoDataUri = await resolveOgPhotoDataUri(candidateUrls, slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#080808",
          color: "#FFFFFF",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          border: "12px solid #141414",
        }}
      >
        {/* Left Side: Category Info */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "52px 48px",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "6px",
                  border: "2px solid #D6A36F",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#D6A36F",
                  backgroundColor: "rgba(214, 163, 111, 0.1)",
                }}
              >
                A
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "17px", fontWeight: 800, letterSpacing: "0.2em", color: "#D6A36F" }}>
                  AFSHA
                </span>
                <span style={{ fontSize: "9px", letterSpacing: "0.25em", color: "#A7A7A7" }}>
                  CREATIVE SOLUTIONS
                </span>
              </div>
            </div>

            <div
              style={{
                padding: "6px 14px",
                borderRadius: "9999px",
                border: "1px solid rgba(214, 163, 111, 0.45)",
                color: "#D6A36F",
                fontSize: "11px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              {countText}
            </div>
          </div>

          {/* Center Category Content */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <span
              style={{
                fontSize: "12px",
                color: "#D6A36F",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              Collection · Made in Moradabad
            </span>
            <h1
              style={{
                fontSize: "46px",
                fontWeight: 300,
                lineHeight: 1.12,
                color: "#F5F5F5",
                margin: 0,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: "15px",
                lineHeight: 1.5,
                color: "#A7A7A7",
                margin: 0,
              }}
            >
              {description.slice(0, 140)}
            </p>
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid rgba(255, 255, 255, 0.12)",
              paddingTop: "18px",
            }}
          >
            <span style={{ fontSize: "13px", color: "#777777" }}>www.afshacreative.in</span>
            <span
              style={{
                fontSize: "12px",
                color: "#D6A36F",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              Explore Collection
            </span>
          </div>
        </div>

        {/* Right Side: Category Showcase Photo */}
        <div
          style={{
            width: "460px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#111111",
            borderLeft: "1px solid rgba(255, 255, 255, 0.12)",
            overflow: "hidden",
          }}
        >
          {photoDataUri ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoDataUri}
              alt={title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div style={{ color: "#D6A36F", fontSize: "14px", letterSpacing: "0.2em" }}>
              AFSHA METALWORK
            </div>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
