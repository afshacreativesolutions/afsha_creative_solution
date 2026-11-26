import AdminNav from "../../admin-nav";
import ContentSubnav from "../content-subnav";
import MediaLibraryClient from "./media-library-client";
import { requireAdmin } from "@/lib/admin-auth";
import { checkCmsTablesStatus, getAdminCmsMedia } from "@/lib/cms/queries";

export const dynamic = "force-dynamic";

export default async function AdminMediaLibraryPage() {
  await requireAdmin();
  const [tableStatus, mediaItems] = await Promise.all([
    checkCmsTablesStatus(),
    getAdminCmsMedia(),
  ]);

  return (
    <div className="min-h-screen bg-background text-white">
      <AdminNav />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-[0.22em] text-textGold">
            Website Content Manager
          </p>
          <h1 className="mt-1 text-3xl font-light">Media Library</h1>
          <p className="mt-1 text-sm text-white/55">
            Upload, organize, replace, and safely manage images used across your website pages.
          </p>
        </div>

        <ContentSubnav />
        <MediaLibraryClient initialMedia={mediaItems} tableReady={tableStatus.ready} />
      </main>
    </div>
  );
}
