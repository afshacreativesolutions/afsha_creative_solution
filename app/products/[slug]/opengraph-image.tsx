import { ImageResponse } from "next/og";
import { getPublicProduct } from "@/lib/catalog";
import { resolveOgPhotoDataUri } from "@/lib/og-image-loader";

export const runtime = "nodejs";
export const revalidate = 300;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProductOpenGraphImage({ params }: Props) {
  const { slug } = await params;
  const product = await getPublicProduct(slug);

  const title = product?.name || "Architectural Metalwork";
  const categoryName = product?.category?.name || "Custom Fabrication";
  const finishes = product?.finish_options?.slice(0, 3).join(" · ") || "Made to Measure";
  const primaryImage = product?.images?.find((i) => i.is_primary) ?? product?.images?.[0];
  const otherImageUrls = (product?.images ?? [])
    .filter((i) => i.id !== primaryImage?.id)
    .map((i) => i.url);
  const photoDataUri = await resolveOgPhotoDataUri(
    [primaryImage?.url, ...otherImageUrls],
    product?.category?.slug
  );

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
        {/* Left Side: Product Info */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "54px 48px",
          }}
        >
          {/* Header */}
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

          {/* Product Meta & Title */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <span
              style={{
                fontSize: "12px",
                color: "#D6A36F",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              {categoryName} · Moradabad
            </span>
            <h1
              style={{
                fontSize: "44px",
                fontWeight: 300,
                lineHeight: 1.15,
                color: "#F5F5F5",
                margin: 0,
              }}
            >
              {title}
            </h1>
            <p style={{ fontSize: "14px", color: "#A7A7A7", margin: 0, lineHeight: 1.5 }}>
              {finishes}
            </p>
          </div>

          {/* Footer badge */}
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
              Bespoke Estimation
            </span>
          </div>
        </div>

        {/* Right Side: Product Image Display */}
        <div
          style={{
            width: "480px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#111111",
            borderLeft: "1px solid rgba(255, 255, 255, 0.12)",
            position: "relative",
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#D6A36F",
                fontSize: "14px",
                letterSpacing: "0.2em",
              }}
            >
              AFSHA METALWORK
            </div>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
