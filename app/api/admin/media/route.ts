import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { requireAdminAction } from "@/lib/admin-auth";
import { parseImageDimensions } from "@/lib/cms/image-dimensions";
import { deriveCmsMediaPublicUrl } from "@/lib/cms/media";
import { sanitizeText } from "@/lib/cms/validation";

const ALLOWED_TYPES = new Map<string, string>([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8 MB

function verifyImageMagicBytes(bytes: Uint8Array, mimeType: string): boolean {
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
    // ISO Base Media File Format: bytes 4..7 == 'ftyp'
    return String.fromCharCode(bytes[4], bytes[5], bytes[6], bytes[7]) === "ftyp";
  }
  return false;
}

function sanitizeFileName(name: string): string {
  const base = name.replace(/\.[^/.]+$/, "").toLowerCase();
  const clean = base.replace(/[^a-z0-9-_]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
  return clean || "media";
}

export async function GET(request: NextRequest) {
  try {
    const { supabase } = await requireAdminAction();
    const search = request.nextUrl.searchParams.get("q")?.trim() || "";

    let query = supabase
      .from("cms_media")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (search) {
      query = query.or(`file_name.ilike.%${search}%,alt_text.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ items: data ?? [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { supabase, user } = await requireAdminAction();
    const formData = await request.formData();
    const file = formData.get("file");
    const altText = sanitizeText(formData.get("alt_text"), 220);
    const replaceId = sanitizeText(formData.get("replace_id"), 64);

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Please choose an image file to upload." }, { status: 400 });
    }

    const extension = ALLOWED_TYPES.get(file.type);
    if (!extension) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, and AVIF images are supported." },
        { status: 400 }
      );
    }

    if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Images must be between 1 byte and 8 MB." },
        { status: 413 }
      );
    }

    const buffer = new Uint8Array(await file.arrayBuffer());
    if (!verifyImageMagicBytes(buffer, file.type)) {
      return NextResponse.json(
        { error: "The uploaded file contents do not match the declared image format." },
        { status: 400 }
      );
    }

    const { width, height } = parseImageDimensions(buffer, file.type);
    const safeName = sanitizeFileName(file.name);
    const storagePath = `library/${safeName}-${randomUUID().slice(0, 8)}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("cms-media")
      .upload(storagePath, buffer, {
        contentType: file.type,
        cacheControl: "31536000",
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 400 });
    }

    const publicUrl = deriveCmsMediaPublicUrl(storagePath);

    if (replaceId) {
      const { data: existing } = await supabase
        .from("cms_media")
        .select("*")
        .eq("id", replaceId)
        .maybeSingle();

      if (existing) {
        const { data: updated, error: updateError } = await supabase
          .from("cms_media")
          .update({
            file_name: sanitizeText(file.name, 160) || `${safeName}.${extension}`,
            storage_path: storagePath,
            public_url: publicUrl,
            alt_text: altText || existing.alt_text || "",
            mime_type: file.type,
            file_size: file.size,
            width,
            height,
          })
          .eq("id", replaceId)
          .select("*")
          .single();

        if (updateError || !updated) {
          await supabase.storage.from("cms-media").remove([storagePath]);
          return NextResponse.json(
            { error: updateError?.message || "Could not update media record." },
            { status: 500 }
          );
        }

        if (existing.storage_path && existing.storage_path !== storagePath) {
          await supabase.storage.from("cms-media").remove([existing.storage_path]);
        }

        return NextResponse.json({
          media: updated,
          url: updated.public_url,
          storage_path: updated.storage_path,
        });
      }
    }

    const { data: inserted, error: insertError } = await supabase
      .from("cms_media")
      .insert({
        file_name: sanitizeText(file.name, 160) || `${safeName}.${extension}`,
        storage_bucket: "cms-media",
        storage_path: storagePath,
        public_url: publicUrl,
        alt_text: altText,
        mime_type: file.type,
        file_size: file.size,
        width,
        height,
        uploaded_by: user.id,
      })
      .select("*")
      .single();

    if (insertError || !inserted) {
      await supabase.storage.from("cms-media").remove([storagePath]);
      return NextResponse.json(
        { error: insertError?.message || "Could not save media metadata." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      media: inserted,
      url: inserted.public_url,
      storage_path: inserted.storage_path,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Media upload failed.";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
