import { NextRequest, NextResponse } from "next/server";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { normalizeSlug } from "@/lib/cms/validation";

export async function GET(request: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Administrator authentication required for preview." }, { status: 401 });
  }

  const pageId = request.nextUrl.searchParams.get("pageId");
  const slugParam = request.nextUrl.searchParams.get("slug");

  let targetSlug = "/";
  if (pageId) {
    const { data: page } = await admin.supabase
      .from("cms_pages")
      .select("slug")
      .eq("id", pageId)
      .maybeSingle();

    if (!page) {
      return NextResponse.json({ error: "CMS page not found." }, { status: 404 });
    }
    targetSlug = page.slug;
  } else if (slugParam) {
    const normalized = normalizeSlug(slugParam);
    const { data: page } = await admin.supabase
      .from("cms_pages")
      .select("slug")
      .eq("slug", normalized)
      .maybeSingle();

    targetSlug = page?.slug || normalized;
  }

  // Only allow safe local path redirects (prevent open redirect)
  if (!targetSlug.startsWith("/") || targetSlug.startsWith("//")) {
    targetSlug = "/";
  }

  const draft = await draftMode();
  draft.enable();

  redirect(targetSlug);
}
