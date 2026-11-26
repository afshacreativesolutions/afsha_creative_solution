import AdminNav from "../../admin-nav";
import ContentSubnav from "../content-subnav";
import SiteSettingsEditor from "./site-settings-editor";
import { requireAdmin } from "@/lib/admin-auth";
import { checkCmsTablesStatus, getAdminCmsSiteSettings } from "@/lib/cms/queries";

export const dynamic = "force-dynamic";

export default async function AdminSiteSettingsPage() {
  await requireAdmin();
  const [tableStatus, siteSettings] = await Promise.all([
    checkCmsTablesStatus(),
    getAdminCmsSiteSettings(),
  ]);

  return (
    <div className="min-h-screen bg-background text-white">
      <AdminNav />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-[0.22em] text-textGold">
            Website Content Manager
          </p>
          <h1 className="mt-1 text-3xl font-light">Site Settings & Navigation</h1>
          <p className="mt-1 text-sm text-white/55">
            Update brand details, header menus, mega menu showcases, footer links, WhatsApp button,
            and global SEO defaults.
          </p>
        </div>

        <ContentSubnav />
        <SiteSettingsEditor
          initialDraft={siteSettings.draft}
          hasUnpublishedSettings={siteSettings.hasUnpublishedSettings}
          tableReady={tableStatus.ready}
        />
      </main>
    </div>
  );
}
