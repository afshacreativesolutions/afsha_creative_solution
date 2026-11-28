import { ImageResponse } from "next/og";
import { getPublicProduct } from "@/lib/catalog";
import { resolveOgPhotoDataUri } from "@/lib/og-image-loader";

export const runtime = "nodejs";
export const revalidate = 300;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = {
  params: Promise<{ slug: string; imageId: string }>;
};

export default async function DesignOpenGraphImage({ params }: Props) {
  const { slug, imageId } = await params;
  const product = await getPublicProduct(slug);

  if (!product) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#080808",
            color: "#D6A36F",
            fontSize: "24px",
          }}
        >
          Afsha Creative Solutions — Design Reference
        </div>
      ),
      { ...size }
    );
  }

  const image = product.images.find((i) => i.id === imageId) ?? product.images[0];
  const index = product.images.findIndex((i) => i.id === imageId);
  const prefix = product.slug.split("-").map((part) => part[0]).join("").slice(0, 5).toUpperCase();
  const designCode = `${prefix}-${String(Math.max(0, index) + 1).padStart(2, "0")}`;
  const fallbackUrls = product.images.map((i) => i.url);
  const photoDataUri = await resolveOgPhotoDataUri(
    [image?.url, ...fallbackUrls],
    product.category?.slug
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
        {/* Left Side: Design Identification */}
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

          {/* Design Code & Product Name */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span
                style={{
                  backgroundColor: "rgba(214, 163, 111, 0.2)",
                  color: "#D6A36F",
                  border: "1px solid rgba(214, 163, 111, 0.5)",
                  padding: "5px 12px",
                  borderRadius: "4px",
                  fontSize: "14px",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                }}
              >
                DESIGN {designCode}
              </span>
              <span style={{ fontSize: "12px", color: "#A7A7A7", letterSpacing: "0.16em", textTransform: "uppercase" }}>
                {product.category?.name || "Bespoke Metalwork"}
              </span>
            </div>
            <h1
              style={{
                fontSize: "38px",
                fontWeight: 300,
                lineHeight: 1.18,
                color: "#F5F5F5",
                margin: "4px 0 0",
              }}
            >
              {product.name}
            </h1>
            <p style={{ fontSize: "14px", color: "#A7A7A7", margin: 0, lineHeight: 1.5 }}>
              Handcrafted in Moradabad · Custom Dimensions & Materials
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
              Enquire on WhatsApp
            </span>
          </div>
        </div>

        {/* Right Side: Exact Design Image */}
        <div
          style={{
            width: "500px",
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
              alt={`${product.name} ${designCode}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div style={{ color: "#D6A36F", fontSize: "16px" }}>AFSHA DESIGN</div>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
