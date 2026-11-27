export const ALLOWED_IMAGE_TYPES = new Map<string, string>([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);

/**
 * Verifies file contents match the declared image MIME type using binary file headers.
 */
export function verifyImageMagicBytes(bytes: Uint8Array, mimeType: string): boolean {
  if (bytes.length < 12) return false;
  if (mimeType === "image/jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (mimeType === "image/png") {
    return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  }
  if (mimeType === "image/webp") {
    return (
      String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]) === "RIFF" &&
      String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]) === "WEBP"
    );
  }
  if (mimeType === "image/avif") {
    return String.fromCharCode(bytes[4], bytes[5], bytes[6], bytes[7]) === "ftyp";
  }
  return false;
}

export function sanitizeUploadBaseName(name: string): string {
  const base = name.replace(/\.[^/.]+$/, "").toLowerCase();
  const clean = base.replace(/[^a-z0-9-_]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
  return clean || "image";
}
