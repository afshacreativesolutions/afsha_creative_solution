import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { requireAdmin } from "@/lib/admin-auth";
import { checkCmsTablesStatus, getAdminCmsMedia } from "@/lib/cms/queries";
import ContentSubnav from "../content-subnav";
import MediaLibraryClient from "./media-library-client";

export const dynamic = "force-dynamic";

export default async function AdminMediaLibraryPage() {
  await requireAdmin();
  const [tableStatus, mediaItems] = await Promise.all([
    checkCmsTablesStatus(),
    getAdminCmsMedia(),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <AdminPageHeader
        eyebrow="Website Content Manager"
        title="Media Library"
        description="Upload, preview, organize, replace, and safely manage images used across your website."
      />

      <ContentSubnav />
      <MediaLibraryClient initialMedia={mediaItems} tableReady={tableStatus.ready} />
    </main>
  );
}
