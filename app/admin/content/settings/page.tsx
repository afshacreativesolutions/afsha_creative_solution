import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { requireAdmin } from "@/lib/admin-auth";
import { checkCmsTablesStatus, getAdminCmsSiteSettings } from "@/lib/cms/queries";
import ContentSubnav from "../content-subnav";
import SiteSettingsEditor from "./site-settings-editor";

export const dynamic = "force-dynamic";

export default async function AdminSiteSettingsPage() {
  await requireAdmin();
  const [tableStatus, siteSettings] = await Promise.all([
    checkCmsTablesStatus(),
    getAdminCmsSiteSettings(),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <AdminPageHeader
        eyebrow="Website Content Manager"
        title="Site Settings & Navigation"
        description="Update brand details, header menus, mega menu showcases, footer links, WhatsApp button, and global SEO defaults."
      />

      <ContentSubnav />
      <SiteSettingsEditor
        initialDraft={siteSettings.draft}
        hasUnpublishedSettings={siteSettings.hasUnpublishedSettings}
        tableReady={tableStatus.ready}
      />
    </main>
  );
}
