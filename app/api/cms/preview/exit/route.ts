import { NextRequest } from "next/server";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function POST(request: NextRequest) {
  const formData = await request.formData().catch(() => null);
  const returnTo = formData?.get("returnTo");
  const safePath =
    typeof returnTo === "string" && returnTo.startsWith("/") && !returnTo.startsWith("//")
      ? returnTo
      : "/";

  const draft = await draftMode();
  draft.disable();

  redirect(safePath);
}
