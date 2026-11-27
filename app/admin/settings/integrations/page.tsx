import { CheckCircle2, ShieldAlert } from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { requireAdmin } from "@/lib/admin-auth";
import { checkCmsTablesStatus } from "@/lib/cms/queries";
import { getAdminIntegrationsStatus } from "@/lib/crm";

export const metadata = { title: "Integrations & Diagnostic | Afsha Creative Solution" };

export default async function AdminIntegrationsPage() {
  await requireAdmin();
  const [integrations, cmsStatus] = await Promise.all([
    getAdminIntegrationsStatus(),
    checkCmsTablesStatus(),
  ]);

  return (
    <main className="mx-auto max-w-5xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <AdminPageHeader
        eyebrow="Architecture & API Diagnostics"
        title="System Health & Integrations"
        description="Live diagnostic of Supabase connections, email notifications, WhatsApp webhook integration, and migrations."
      />

      <div className="grid gap-3.5 sm:gap-4">
        {Object.entries(integrations).map(([key, item]) => {
          const isOk = item.configured;
          return (
            <div
              key={key}
              className="flex flex-col gap-3 rounded-xl border border-white/10 bg-[#0d0d0d] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  {isOk ? (
                    <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
                  ) : (
                    <ShieldAlert size={18} className="shrink-0 text-amber-400" />
                  )}
                  <h2 className="text-sm font-medium text-white">{item.name}</h2>
                </div>
                <p className="mt-1.5 break-all font-mono text-xs text-white/55">
                  {item.details}
                </p>
              </div>

              <div className="shrink-0">
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                    isOk
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                      : "border-amber-500/40 bg-amber-500/10 text-amber-400"
                  }`}
                >
                  {isOk ? "Active" : "Needs Config"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <AdminCard
        eyebrow="SQL Reference"
        title="Database Migration Checklist"
        className="mt-6"
      >
        <div className="space-y-4 text-xs leading-relaxed text-white/75">
          <div>
            <p className="font-medium text-white">1. CRM &amp; Customer Intelligence Migration</p>
            <code className="mt-1 block break-all rounded bg-black/50 p-2 font-mono text-textGold">
              supabase/migrations/202611250001_customer_intelligence_and_crm.sql
            </code>
          </div>

          <div>
            <p className="font-medium text-white">
              2. Visual CMS &amp; Media Library Migration{" "}
              <span className={cmsStatus.ready ? "text-emerald-400" : "text-amber-400"}>
                ({cmsStatus.ready ? `Active · ${cmsStatus.pagesCount} pages` : "Not applied yet"})
              </span>
            </p>
            <code className="mt-1 block break-all rounded bg-black/50 p-2 font-mono text-textGold">
              supabase/migrations/202611260001_cms_and_media.sql
            </code>
          </div>

          <div>
            <p className="font-medium text-white">
              3. Lead Capture Columns &amp; Private Attachment Bucket Migration
            </p>
            <code className="mt-1 block break-all rounded bg-black/50 p-2 font-mono text-textGold">
              supabase/migrations/202611260002_lead_capture_enhancements.sql
            </code>
          </div>

          <p className="text-white/55">
            Execute pending migration scripts chronologically in your Supabase SQL Editor to keep
            tables, Storage buckets, and Row Level Security policies synchronized.
          </p>
        </div>
      </AdminCard>
    </main>
  );
}
