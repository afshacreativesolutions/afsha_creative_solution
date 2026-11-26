import AdminNav from "../admin-nav";
import ContentSubnav from "./content-subnav";
import PagesDashboard from "./pages-dashboard";
import { requireAdmin } from "@/lib/admin-auth";
import { checkCmsTablesStatus, getAdminCmsPages } from "@/lib/cms/queries";

export const dynamic = "force-dynamic";

export default async function AdminWebsiteContentPage() {
  await requireAdmin();
  const [tableStatus, pages] = await Promise.all([
    checkCmsTablesStatus(),
    getAdminCmsPages(),
  ]);

  return (
    <div className="min-h-screen bg-background text-white">
      <AdminNav />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-[0.22em] text-textGold">
            Visual Page Manager
          </p>
          <h1 className="mt-1 text-3xl font-light">Website Content</h1>
          <p className="mt-1 text-sm text-white/55">
            Manage public pages, section layouts, SEO metadata, images, and global navigation
            without code edits.
          </p>
        </div>

        <ContentSubnav />
        <PagesDashboard initialPages={pages} tableStatus={tableStatus} />
      </main>
    </div>
  );
}
