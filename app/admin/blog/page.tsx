import Link from "next/link";
import { AlertCircle, BookOpenText, ExternalLink, FileEdit, Plus } from "lucide-react";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { ADMIN_BTN_OUTLINE_GOLD, ADMIN_BTN_PRIMARY } from "@/components/admin/admin-styles";
import { requireAdmin } from "@/lib/admin-auth";
import { STATIC_BLOG_POSTS } from "@/lib/blog-data";
import { checkBlogTableStatus, getAdminBlogPosts } from "@/lib/catalog";
import BlogDeleteButton from "./blog-delete-button";

export const metadata = { title: "Blog Admin | Afsha Creative Solution" };
export const dynamic = "force-dynamic";

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
}) {
  await requireAdmin();
  const [posts, query, tableStatus] = await Promise.all([
    getAdminBlogPosts(),
    searchParams,
    checkBlogTableStatus(),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      {!tableStatus.exists && (
        <div className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-white sm:p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 shrink-0 text-amber-400" size={20} />
            <div className="space-y-2.5">
              <h2 className="text-sm font-semibold text-amber-300 sm:text-base">
                Database Setup Required: `blog_posts` table not found in Supabase
              </h2>
              <p className="text-xs leading-5 text-white/80 sm:text-sm">
                Apply{" "}
                <code className="rounded bg-black/50 px-1.5 py-0.5 font-mono text-textGold">
                  supabase/migrations/202611240003_seo_blog_and_product_fields.sql
                </code>{" "}
                in your Supabase SQL Editor to manage blog posts in the database.
              </p>
              <p className="text-xs text-white/60">
                Public{" "}
                <Link href="/blog" target="_blank" className="text-textGold underline">
                  /blog
                </Link>{" "}
                continues serving your 6 curated static guides.
              </p>
            </div>
          </div>
        </div>
      )}

      <AdminPageHeader
        eyebrow="Content Management"
        title="Blog Articles"
        description={
          posts.length > 0
            ? `${posts.length} database articles managing public editorial guides.`
            : `${STATIC_BLOG_POSTS.length} default static guides serving on /blog.`
        }
        actions={
          <Link href="/admin/blog/new" prefetch={false} className={`${ADMIN_BTN_PRIMARY} w-full sm:w-auto`}>
            <Plus size={15} />
            <span>Add Article</span>
          </Link>
        }
      />

      {query.saved === "1" && (
        <p role="status" className="mb-5 rounded-xl border border-emerald-500/35 bg-emerald-950/30 px-4 py-3 text-xs text-emerald-200 sm:text-sm">
          Article saved successfully.
        </p>
      )}
      {query.deleted === "1" && (
        <p role="status" className="mb-5 rounded-xl border border-emerald-500/35 bg-emerald-950/30 px-4 py-3 text-xs text-emerald-200 sm:text-sm">
          Article deleted cleanly.
        </p>
      )}
      {query.error && (
        <p role="alert" className="mb-5 rounded-xl border border-red-500/35 bg-red-950/30 px-4 py-3 text-xs text-red-200 sm:text-sm">
          {query.error}
        </p>
      )}

      {posts.length > 0 ? (
        <div className="space-y-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col gap-3 rounded-xl border border-white/10 bg-[#0d0d0d] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-medium text-white sm:text-lg">{post.title}</h2>
                  <span
                    className={`rounded border px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] ${
                      post.status === "published"
                        ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-300"
                        : "border-white/15 bg-white/5 text-white/60"
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
                <p className="mt-1 truncate font-mono text-xs text-white/45">/blog/{post.slug}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0 sm:items-center">
                <Link
                  href={`/admin/blog/${post.id}/edit`}
                  prefetch={false}
                  className={`${ADMIN_BTN_OUTLINE_GOLD} px-3.5`}
                >
                  <FileEdit size={14} />
                  <span>Edit</span>
                </Link>
                <BlogDeleteButton id={post.id} title={post.title} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
            Default Static Guides (Active on /blog)
          </p>
          {STATIC_BLOG_POSTS.length === 0 ? (
            <AdminEmptyState icon={<BookOpenText size={28} />} title="No articles yet" />
          ) : (
            STATIC_BLOG_POSTS.map((guide) => (
              <article
                key={guide.id}
                className="flex flex-col gap-3 rounded-xl border border-white/10 bg-[#0d0d0d] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-light text-white">{guide.title}</h3>
                    <span className="rounded border border-emerald-500/35 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-emerald-300">
                      Published (Static)
                    </span>
                  </div>
                  <p className="mt-1 truncate font-mono text-xs text-white/45">/blog/{guide.slug}</p>
                </div>
                <Link
                  href={`/blog/${guide.slug}`}
                  target="_blank"
                  prefetch={false}
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-textGold/45 bg-textGold/10 px-4 text-xs font-medium text-textGold transition hover:bg-textGold hover:text-black"
                >
                  <span>View on Site</span>
                  <ExternalLink size={13} />
                </Link>
              </article>
            ))
          )}
        </div>
      )}
    </main>
  );
}
