import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { requireAdmin } from "@/lib/admin-auth";
import { checkCmsTablesStatus, getAdminCmsPages } from "@/lib/cms/queries";
import ContentSubnav from "./content-subnav";
import PagesDashboard from "./pages-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminWebsiteContentPage() {
  await requireAdmin();
  const [tableStatus, pages] = await Promise.all([
    checkCmsTablesStatus(),
    getAdminCmsPages(),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <AdminPageHeader
        eyebrow="Visual Page Manager"
        title="Website Content"
        description="Manage public pages, section layouts, SEO metadata, images, and global navigation without code edits."
      />

      <ContentSubnav />
      <PagesDashboard initialPages={pages} tableStatus={tableStatus} />
    </main>
  );
}
