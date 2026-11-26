import { NextRequest, NextResponse } from "next/server";
import { requireAdminAction } from "@/lib/admin-auth";
import { sanitizeText } from "@/lib/cms/validation";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { supabase } = await requireAdminAction();
    const { id } = await context.params;
    const body = (await request.json()) as Record<string, unknown>;

    const updates: Record<string, string> = {};
    if ("alt_text" in body) {
      updates.alt_text = sanitizeText(body.alt_text, 220);
    }
    if ("file_name" in body) {
      const fileName = sanitizeText(body.file_name, 160);
      if (fileName) updates.file_name = fileName;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("cms_media")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || "Media item not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ media: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Update failed.";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { supabase } = await requireAdminAction();
    const { id } = await context.params;

    const { data: media, error: findError } = await supabase
      .from("cms_media")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (findError || !media) {
      return NextResponse.json({ error: "Media file not found." }, { status: 404 });
    }

    // Verify file is not referenced by published/draft CMS content or blog posts
    const { data: refs, error: refError } = await supabase.rpc("is_cms_media_referenced", {
      p_storage_path: media.storage_path,
    });

    if (refError) {
      return NextResponse.json({ error: refError.message }, { status: 500 });
    }

    const references = Array.isArray(refs) ? refs : [];
    if (references.length > 0) {
      return NextResponse.json(
        {
          error: "This image cannot be deleted because it is still referenced on one or more pages or drafts.",
          references,
        },
        { status: 409 }
      );
    }

    const { error: storageError } = await supabase.storage
      .from(media.storage_bucket || "cms-media")
      .remove([media.storage_path]);

    if (storageError) {
      return NextResponse.json({ error: storageError.message }, { status: 500 });
    }

    const { error: deleteError } = await supabase
      .from("cms_media")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ deleted: true, id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Deletion failed.";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
