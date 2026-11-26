/**
 * Zero-dependency image dimension parser for PNG, JPEG, WebP, and AVIF buffers.
 * Used during media upload and seed migration to store accurate width/height in cms_media.
 */

export function parseImageDimensions(
  buffer: Uint8Array,
  mimeType: string
): { width: number | null; height: number | null } {
  try {
    if (mimeType === "image/png") return parsePng(buffer);
    if (mimeType === "image/jpeg") return parseJpeg(buffer);
    if (mimeType === "image/webp") return parseWebp(buffer);
    if (mimeType === "image/avif") return parseAvif(buffer);
  } catch {
    // Fallback to null if header is unusual
  }
  return { width: null, height: null };
}

function readUInt16BE(buf: Uint8Array, offset: number): number {
  return (buf[offset] << 8) | buf[offset + 1];
}

function readUInt32BE(buf: Uint8Array, offset: number): number {
  return (
    ((buf[offset] << 24) >>> 0) +
    (buf[offset + 1] << 16) +
    (buf[offset + 2] << 8) +
    buf[offset + 3]
  );
}

function readUInt16LE(buf: Uint8Array, offset: number): number {
  return buf[offset] | (buf[offset + 1] << 8);
}

function readUInt24LE(buf: Uint8Array, offset: number): number {
  return buf[offset] | (buf[offset + 1] << 8) | (buf[offset + 2] << 16);
}

function parsePng(buf: Uint8Array) {
  if (buf.length < 24) return { width: null, height: null };
  // PNG signature: 89 50 4E 47 0D 0A 1A 0A, followed by IHDR
  if (buf[0] !== 0x89 || buf[1] !== 0x50 || buf[2] !== 0x4e || buf[3] !== 0x47) {
    return { width: null, height: null };
  }
  const width = readUInt32BE(buf, 16);
  const height = readUInt32BE(buf, 20);
  return width > 0 && height > 0 ? { width, height } : { width: null, height: null };
}

function parseJpeg(buf: Uint8Array) {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) {
    return { width: null, height: null };
  }
  let offset = 2;
  while (offset + 4 < buf.length) {
    if (buf[offset] !== 0xff) {
      offset++;
      continue;
    }
    const marker = buf[offset + 1];
    // Standalone markers without length
    if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) {
      offset += 2;
      continue;
    }
    if (offset + 4 >= buf.length) break;
    const segmentLength = readUInt16BE(buf, offset + 2);
    // SOF0..SOF3, SOF5..SOF7, SOF9..SOF11, SOF13..SOF15
    const isSof =
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf);
    if (isSof && offset + 9 < buf.length) {
      const height = readUInt16BE(buf, offset + 5);
      const width = readUInt16BE(buf, offset + 7);
      return width > 0 && height > 0 ? { width, height } : { width: null, height: null };
    }
    if (segmentLength < 2) break;
    offset += 2 + segmentLength;
  }
  return { width: null, height: null };
}

function parseWebp(buf: Uint8Array) {
  if (buf.length < 30) return { width: null, height: null };
  const riff = String.fromCharCode(buf[0], buf[1], buf[2], buf[3]);
  const webp = String.fromCharCode(buf[8], buf[9], buf[10], buf[11]);
  if (riff !== "RIFF" || webp !== "WEBP") return { width: null, height: null };
  const chunk = String.fromCharCode(buf[12], buf[13], buf[14], buf[15]);
  if (chunk === "VP8X" && buf.length >= 30) {
    const width = readUInt24LE(buf, 24) + 1;
    const height = readUInt24LE(buf, 27) + 1;
    return { width, height };
  }
  if (chunk === "VP8 " && buf.length >= 30) {
    const width = readUInt16LE(buf, 26) & 0x3fff;
    const height = readUInt16LE(buf, 28) & 0x3fff;
    return { width, height };
  }
  if (chunk === "VP8L" && buf.length >= 25) {
    const bits =
      buf[21] | (buf[22] << 8) | (buf[23] << 16) | (buf[24] << 24);
    const width = (bits & 0x3fff) + 1;
    const height = ((bits >> 14) & 0x3fff) + 1;
    return { width, height };
  }
  return { width: null, height: null };
}

function parseAvif(buf: Uint8Array) {
  // Search ISOBMFF 'ispe' box (Image Spatial Extents): 4-byte size + 'ispe' + 4-byte version/flags + 4-byte width + 4-byte height
  const target = [0x69, 0x73, 0x70, 0x65]; // "ispe"
  for (let i = 4; i <= buf.length - 16; i++) {
    if (
      buf[i] === target[0] &&
      buf[i + 1] === target[1] &&
      buf[i + 2] === target[2] &&
      buf[i + 3] === target[3]
    ) {
      const width = readUInt32BE(buf, i + 8);
      const height = readUInt32BE(buf, i + 12);
      if (width > 0 && width < 20000 && height > 0 && height < 20000) {
        return { width, height };
      }
    }
  }
  return { width: null, height: null };
}
