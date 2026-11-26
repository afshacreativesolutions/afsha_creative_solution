import Image, { type ImageProps } from "next/image";
import { resolveCmsImageSrc } from "@/lib/cms/media";
import type { CmsImageRef } from "@/lib/cms/types";

type CmsImageProps = {
  image?: CmsImageRef | string | null;
  altFallback?: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  loading?: "eager" | "lazy";
  unoptimized?: boolean;
};

export default function CmsImage({
  image,
  altFallback = "",
  className = "object-cover",
  fill = true,
  width,
  height,
  sizes,
  priority,
  loading,
  unoptimized,
}: CmsImageProps) {
  const src = resolveCmsImageSrc(image);
  if (!src) {
    return (
      <div
        aria-hidden="true"
        className="flex h-full w-full items-center justify-center bg-[#111] text-[10px] uppercase tracking-[0.2em] text-white/25"
      >
        Image
      </div>
    );
  }

  const alt =
    (typeof image === "object" && image?.alt ? image.alt : "") || altFallback;
  const isExternalNonSupabase =
    typeof src === "string" &&
    src.startsWith("http") &&
    !src.includes("supabase.co");

  const commonProps: Omit<ImageProps, "src" | "alt"> = {
    className,
    sizes,
    priority,
    loading,
    unoptimized: unoptimized ?? isExternalNonSupabase,
  };

  if (fill) {
    return <Image src={src} alt={alt} fill {...commonProps} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? (typeof image === "object" && image?.width ? image.width : 800)}
      height={height ?? (typeof image === "object" && image?.height ? image.height : 600)}
      {...commonProps}
    />
  );
}
