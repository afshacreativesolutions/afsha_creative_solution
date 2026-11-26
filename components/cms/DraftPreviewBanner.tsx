import Link from "next/link";
import { Eye, ArrowLeft } from "lucide-react";

export default function DraftPreviewBanner({
  pageTitle,
  slug,
  pageId,
}: {
  pageTitle: string;
  slug: string;
  pageId?: string;
}) {
  return (
    <aside
      role="status"
      aria-label="Draft preview notice"
      className="sticky top-16 z-40 border-b border-amber-500/40 bg-amber-950/90 px-4 py-2.5 text-amber-100 backdrop-blur-md sm:px-6"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-300">
            <Eye size={12} /> Draft Preview Mode
          </span>
          <span className="text-amber-100/90">
            Previewing unpublished draft for <strong>{pageTitle}</strong> ({slug})
          </span>
        </div>

        <div className="flex items-center gap-3">
          {pageId && !pageId.startsWith("seed-") && (
            <Link
              href={`/admin/content/${pageId}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/40 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-amber-200 transition hover:bg-amber-300 hover:text-black"
            >
              <ArrowLeft size={12} /> Back to Editor
            </Link>
          )}
          <form action="/api/cms/preview/exit" method="POST">
            <input type="hidden" name="returnTo" value={slug} />
            <button
              type="submit"
              className="rounded-full bg-amber-300 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-white"
            >
              Exit Preview
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
