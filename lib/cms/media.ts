import type { StaticImageData } from "next/image";
import { images, portraits } from "@/utils/images";
import type { CmsImageRef } from "./types";

const ASSET_REGISTRY: Record<string, StaticImageData> = {
  "asset:steel_gate.ssGate1": images.steel_gate.ssGate1,
  "asset:steel_gate.ssGate4": images.steel_gate.ssGate4,
  "asset:steel_gate.ssGate12": images.steel_gate.ssGate12,
  "asset:steel_gate.ssGate13": images.steel_gate.ssGate13,
  "asset:iron_gates.ironGate1": images.iron_gates.ironGate1,
  "asset:iron_gates.ironGate3": images.iron_gates.ironGate3,
  "asset:iron_gates.ironGate5": images.iron_gates.ironGate5,
  "asset:steel_stair_railing.ssStairRailling1": images.steel_stair_railing.ssStairRailling1,
  "asset:steel_stair_railing.ssStairRailling2": images.steel_stair_railing.ssStairRailling2,
  "asset:steel_stair_railing.ssStairRailling8": images.steel_stair_railing.ssStairRailling8,
  "asset:steel_stair_railing.ssStairRailling13": images.steel_stair_railing.ssStairRailling13,
  "asset:iron_stair_railing.ironStairRailling1": images.iron_stair_railing.ironStairRailling1,
  "asset:iron_stair_railing.ironStairRailling2": images.iron_stair_railing.ironStairRailling2,
  "asset:iron_stair_railing.ironStairRailling4": images.iron_stair_railing.ironStairRailling4,
  "asset:steel_balcony_railing.ssBalconyRailling1": images.steel_balcony_railing.ssBalconyRailling1,
  "asset:steel_balcony_railing.ssBalconyRailling4": images.steel_balcony_railing.ssBalconyRailling4,
  "asset:steel_balcony_railing.ssBalconyRailling7": images.steel_balcony_railing.ssBalconyRailling7,
  "asset:steel_balcony_railing.ssBalconyRailling8": images.steel_balcony_railing.ssBalconyRailling8,
  "asset:steel_balcony_railing.ssBalconyRailling9": images.steel_balcony_railing.ssBalconyRailling9,
  "asset:iron_balcony_railing.ironbrail1": images.iron_balcony_railing.ironbrail1,
  "asset:iron_balcony_railing.ironbrail3": images.iron_balcony_railing.ironbrail3,
  "asset:steel_spiral_railing.ssSpiralRailling1": images.steel_spiral_railing.ssSpiralRailling1,
  "asset:steel_spiral_railing.ssSpiralRailling3": images.steel_spiral_railing.ssSpiralRailling3,
  "asset:portraits.Portrait1": portraits.Portait1,
  "asset:portraits.Portrait2": portraits.Portait2,
  "asset:logo.MarkLogo": images.logo.MarkLogo,
  "asset:logo.FullLogo": images.logo.FullLogo,
};

export const ASSET_FILE_MAP: Record<string, string> = {
  "asset:steel_gate.ssGate1": "steel gate/SS-MG_01.jpg",
  "asset:steel_gate.ssGate4": "steel gate/SS-MG_04.jpg",
  "asset:steel_gate.ssGate12": "steel gate/SS-MG_12.jpg",
  "asset:steel_gate.ssGate13": "steel gate/SS-MG_13.jpg",
  "asset:iron_gates.ironGate1": "iron gate/WI-MG_02.jpg",
  "asset:iron_gates.ironGate3": "iron gate/WI-MG_18.jpg",
  "asset:iron_gates.ironGate5": "iron gate/WI-MG_29.jpg",
  "asset:steel_stair_railing.ssStairRailling1": "steel stair railing/SS-MG_34.jpg",
  "asset:steel_stair_railing.ssStairRailling2": "steel stair railing/SS-SCR_01.jpg",
  "asset:steel_stair_railing.ssStairRailling8": "steel stair railing/SS-SCR_17.jpg",
  "asset:steel_stair_railing.ssStairRailling13": "steel stair railing/download.jpg",
  "asset:iron_stair_railing.ironStairRailling1": "iron stair railing/WI-BR_37.jpg",
  "asset:iron_stair_railing.ironStairRailling2": "iron stair railing/WI-SR_01.jpg",
  "asset:iron_stair_railing.ironStairRailling4": "iron stair railing/WI-SR_17.jpg",
  "asset:steel_balcony_railing.ssBalconyRailling1": "steel balcony railing/SS-BR_01.jpg",
  "asset:steel_balcony_railing.ssBalconyRailling4": "steel balcony railing/SS-BR_04.jpg",
  "asset:steel_balcony_railing.ssBalconyRailling7": "steel balcony railing/SS-BR_07.jpg",
  "asset:steel_balcony_railing.ssBalconyRailling8": "steel balcony railing/SS-BR_08.jpg",
  "asset:steel_balcony_railing.ssBalconyRailling9": "steel balcony railing/SS-BR_09.jpg",
  "asset:iron_balcony_railing.ironbrail1": "iron balcony railing/WI-BR_13.jpg",
  "asset:iron_balcony_railing.ironbrail3": "iron balcony railing/WI-BR_28.jpg",
  "asset:steel_spiral_railing.ssSpiralRailling1": "steel spiral railing/SS-SR_01.jpg",
  "asset:steel_spiral_railing.ssSpiralRailling3": "steel spiral railing/SS-SR_06.jpg",
  "asset:portraits.Portrait1": "portraits/Portrait1.png",
  "asset:portraits.Portrait2": "portraits/Portrait2.png",
  "asset:logo.MarkLogo": "Logo/logo-mark.png",
  "asset:logo.FullLogo": "Logo/Full Logo.png",
};

export function deriveCmsMediaPublicUrl(storagePath: string): string {
  const baseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "");
  const cleanPath = storagePath.replace(/^\/+/, "");
  if (!baseUrl) return cleanPath;
  const encodedPath = cleanPath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${baseUrl}/storage/v1/object/public/cms-media/${encodedPath}`;
}

export function resolveCmsImageSrc(
  ref?: CmsImageRef | string | null
): string | StaticImageData | null {
  if (!ref) return null;
  if (typeof ref === "string") {
    if (ref.startsWith("asset:") && ASSET_REGISTRY[ref]) {
      return ASSET_REGISTRY[ref];
    }
    if (ref.startsWith("http://") || ref.startsWith("https://") || ref.startsWith("/")) {
      return ref;
    }
    return deriveCmsMediaPublicUrl(ref);
  }

  if (ref.storagePath && ref.url?.startsWith("http")) {
    return ref.url;
  }
  if (ref.storagePath && !ref.storagePath.startsWith("asset:")) {
    return deriveCmsMediaPublicUrl(ref.storagePath);
  }
  if (ref.url) {
    if (ref.url.startsWith("asset:") && ASSET_REGISTRY[ref.url]) {
      return ASSET_REGISTRY[ref.url];
    }
    return ref.url;
  }
  return null;
}

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
