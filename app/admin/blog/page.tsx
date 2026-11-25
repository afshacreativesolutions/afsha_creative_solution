import Link from "next/link";
import { AlertCircle, Plus } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import { checkBlogTableStatus, getAdminBlogPosts } from "@/lib/catalog";
import AdminNav from "../admin-nav";
import { SubmitButton } from "../submit-button";
import { STATIC_BLOG_POSTS } from "@/lib/blog-data";

export const metadata = { title: "Blog Admin | Afsha Creative Solution" };

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
    <main className="min-h-[75vh] bg-background text-white">
      <AdminNav />
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        {/* Missing database table guidance banner */}
        {!tableStatus.exists && (
          <div className="mb-8 rounded-xl border border-amber-500/40 bg-amber-500/10 p-6 text-white">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 shrink-0 text-amber-400" size={20} />
              <div className="space-y-3">
                <h2 className="text-base font-semibold text-amber-300">
                  Database Setup Required: `blog_posts` table not found in Supabase
                </h2>
                <p className="text-sm leading-6 text-white/80">
                  The Supabase database has not had the blog schema migration applied yet. To create the <code className="rounded bg-black/40 px-1.5 py-0.5 text-amber-200">blog_posts</code> table and enable admin article authoring:
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-xs leading-5 text-white/75">
                  <li>Open your <strong>Supabase Project Dashboard → SQL Editor</strong>.</li>
                  <li>Copy and execute the migration file: <code className="rounded bg-black/50 px-2 py-0.5 font-mono text-textGold">supabase/migrations/202611240003_seo_blog_and_product_fields.sql</code>.</li>
                  <li>Click <strong>Run</strong> in Supabase to create the table, indexes, and storage bucket.</li>
                </ol>
                <p className="text-xs text-white/60">
                  Note: Your public website at <Link href="/blog" target="_blank" className="text-textGold underline">/blog</Link> is currently serving all 6 curated educational guides safely via static fallback.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-textGold">Content management</p>
            <h1 className="text-4xl font-light">Blog articles</h1>
            <p className="mt-3 text-sm text-white/45">
              {posts.length > 0 ? `${posts.length} database articles` : `${STATIC_BLOG_POSTS.length} default guides serving on /blog`}
            </p>
          </div>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 border border-textGold/60 px-5 py-3 text-[10px] uppercase tracking-[0.16em] text-textGold transition-colors hover:bg-textGold hover:text-black"
          >
            <Plus size={14} /> Add article
          </Link>
        </div>

        {query.saved === "1" && <p role="status" className="mb-5 text-sm text-emerald-300">Article saved successfully.</p>}
        {query.deleted === "1" && <p role="status" className="mb-5 text-sm text-emerald-300">Article deleted.</p>}
        {query.error && <p role="status" className="mb-5 text-sm text-red-300">{query.error}</p>}

        <div className="space-y-3">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="flex flex-wrap items-center justify-between gap-4 border border-white/10 bg-[#080808] p-5">
                <div>
                  <h2 className="text-lg font-light">{post.title}</h2>
                  <p className="mt-1 text-xs text-white/40">/{post.slug} · <span className="uppercase text-textGold">{post.status}</span></p>
                </div>
                <div className="flex items-center gap-4">
                  <Link href={`/admin/blog/${post.id}/edit`} className="text-xs text-textGold hover:underline">Edit</Link>
                  <form action={async (formData) => { "use server"; const { deleteBlogPost } = await import("../actions"); await deleteBlogPost(formData); }}>
                    <input type="hidden" name="id" value={post.id} />
                    <SubmitButton loadingText="Deleting..." className="text-xs text-white/45 hover:text-red-300 disabled:opacity-40">Delete</SubmitButton>
                  </form>
                </div>
              </div>
            ))
          ) : (
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.16em] text-white/40">
                Default Static Guides (Active on public /blog):
              </p>
              {STATIC_BLOG_POSTS.map((guide) => (
                <div key={guide.id} className="flex flex-wrap items-center justify-between gap-4 border border-white/10 bg-[#080808] p-5 opacity-80">
                  <div>
                    <h3 className="text-base font-light text-white">{guide.title}</h3>
                    <p className="mt-1 text-xs text-white/40">/blog/{guide.slug} · <span className="text-emerald-400">Published (Static)</span></p>
                  </div>
                  <Link href={`/blog/${guide.slug}`} target="_blank" className="text-xs text-textGold hover:underline">
                    View on Site →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
