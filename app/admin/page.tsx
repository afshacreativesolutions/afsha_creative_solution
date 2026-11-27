import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Cpu,
  Images,
  Inbox,
  LayoutTemplate,
  MessageCircle,
  PackagePlus,
  Phone,
  Shield,
  Sparkles,
  UserCheck,
  Users,
} from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import { ADMIN_BTN_OUTLINE_GOLD } from "@/components/admin/admin-styles";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminOverviewStats } from "@/lib/crm";

export const metadata = { title: "Admin Overview | Afsha Creative Solution" };

const STATUS_BADGE_MAP: Record<string, string> = {
  new: "bg-emerald-500/10 text-emerald-300 border-emerald-500/35",
  contacted: "bg-sky-500/10 text-sky-300 border-sky-500/35",
  qualified: "bg-purple-500/10 text-purple-300 border-purple-500/35",
  quote_sent: "bg-amber-500/10 text-amber-300 border-amber-500/35",
  negotiation: "bg-yellow-500/10 text-yellow-300 border-yellow-500/35",
  won: "bg-emerald-600/20 text-emerald-300 border-emerald-500/45",
  lost: "bg-red-500/10 text-red-300 border-red-500/35",
};

export default async function AdminOverviewPage() {
  await requireAdmin();
  const stats = await getAdminOverviewStats();

  const stageEntries = [
    { label: "New", count: stats.leadsByStatus?.new || 0, bar: "bg-emerald-400" },
    { label: "Contacted", count: stats.leadsByStatus?.contacted || 0, bar: "bg-sky-400" },
    { label: "Qualified", count: stats.leadsByStatus?.qualified || 0, bar: "bg-purple-400" },
    { label: "Quote Sent", count: stats.leadsByStatus?.quote_sent || 0, bar: "bg-amber-400" },
    { label: "Negotiating", count: stats.leadsByStatus?.negotiation || 0, bar: "bg-yellow-400" },
    { label: "Won", count: stats.leadsByStatus?.won || 0, bar: "bg-textGold" },
    { label: "Lost", count: stats.leadsByStatus?.lost || 0, bar: "bg-red-400" },
  ];
  const stageMax = Math.max(1, ...stageEntries.map((item) => item.count));

  return (
    <main className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10 min-w-0 max-w-full overflow-x-clip">
      <AdminPageHeader
        eyebrow="Intelligence & CRM"
        title="Executive Dashboard"
        description="Live customer enquiries, conversion pipeline, and workshop operations overview."
        actions={
          <Link href="/admin/leads" prefetch={false} className={ADMIN_BTN_OUTLINE_GOLD}>
            <Inbox size={15} />
            <span>Open Lead Inbox</span>
          </Link>
        }
      />

      {stats.error && (
        <div className="mb-6 rounded-xl border border-amber-500/35 bg-amber-500/10 p-4 text-xs text-amber-200">
          <p className="font-semibold">{stats.error}</p>
          <p className="mt-1 text-white/70">
            Verify migration{" "}
            <code>supabase/migrations/202611250001_customer_intelligence_and_crm.sql</code> in
            your Supabase SQL Editor.
          </p>
        </div>
      )}

      {/* Responsive KPI Grid (2 columns mobile, 4 columns desktop) */}
      <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        <AdminStatCard
          label="Total Inquiries"
          value={stats.totalLeads}
          subtext={`+${stats.newLeadsThisWeek} new this week`}
          icon={<Users size={16} />}
        />
        <AdminStatCard
          label="Customers"
          value={stats.totalCustomers}
          subtext="Verified directory"
          icon={<UserCheck size={16} />}
        />
        <AdminStatCard
          label="Tracked Visitors"
          value={stats.totalVisitors}
          subtext="First-party sessions"
          icon={<BarChart3 size={16} />}
        />
        <AdminStatCard
          label="Pipeline Won"
          value={stats.leadsByStatus?.won || 0}
          subtext="Converted projects"
          valueClassName="text-textGold"
          icon={<Sparkles size={16} />}
        />
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
        {[
          { href: "/admin/leads", label: "Lead Inbox", icon: Inbox },
          { href: "/admin/products/new", label: "Add Product", icon: PackagePlus },
          { href: "/admin/content", label: "Edit Pages", icon: LayoutTemplate },
          { href: "/admin/content/media", label: "Media Library", icon: Images },
        ].map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            prefetch={false}
            className="flex min-h-12 items-center gap-2.5 rounded-xl border border-white/10 bg-[#0d0d0d] px-3.5 py-2.5 text-xs font-medium text-white/85 transition hover:border-textGold/55 hover:text-textGold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-textGold"
          >
            <Icon size={16} className="shrink-0 text-textGold" />
            <span className="truncate">{label}</span>
          </Link>
        ))}
      </div>

      {/* Responsive Pipeline Breakdown + Chart */}
      <div className="mt-6 grid gap-6 lg:grid-cols-12 min-w-0 max-w-full">
        <AdminCard
          title="Enquiry Pipeline Status"
          description="Live distribution across lead stages with touch-friendly navigation"
          className="lg:col-span-5 min-w-0 max-w-full"
        >
          {/* Horizontal scrollable stage metric cards with styled horizontal scrollbar */}
          <div className="admin-horizontal-scroll -mx-1 mb-4 flex gap-2 pb-2.5 pt-0.5 px-1 sm:mx-0 sm:px-0">
            {stageEntries.map((stage) => (
              <div
                key={`pill-${stage.label}`}
                className="flex min-w-[95px] shrink-0 flex-col justify-between rounded-lg border border-white/10 bg-black/45 p-2.5 transition hover:border-textGold/40"
              >
                <div className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full shrink-0 ${stage.bar}`} />
                  <span className="truncate text-[10px] font-medium uppercase tracking-wider text-white/60">
                    {stage.label}
                  </span>
                </div>
                <span className="mt-1.5 font-mono text-base font-semibold text-white">
                  {stage.count}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-3 min-w-0 w-full" role="list" aria-label="Pipeline stages">
            {stageEntries.map((stage) => {
              const widthPct = Math.round((stage.count / stageMax) * 100);
              return (
                <div key={stage.label} role="listitem" className="space-y-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 text-xs min-w-0">
                    <span className="truncate text-white/75">{stage.label}</span>
                    <span className="shrink-0 font-mono text-white">{stage.count}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full ${stage.bar}`}
                      style={{ width: `${Math.max(widthPct, stage.count > 0 ? 6 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </AdminCard>

        {/* Recent Project Inquiries */}
        <AdminCard
          title="Recent Project Inquiries"
          description="Direct customer requests awaiting follow-up"
          className="lg:col-span-7 min-w-0 max-w-full"
          headerAction={
            <Link
              href="/admin/leads"
              prefetch={false}
              className="inline-flex min-h-10 items-center gap-1 text-xs text-textGold hover:underline"
            >
              View all <ArrowRight size={13} />
            </Link>
          }
        >
          {stats.recentLeads.length === 0 ? (
            <AdminEmptyState
              icon={<Inbox size={26} />}
              title="No inquiries recorded yet"
              description="Submitted quotes and contact forms will appear here immediately."
            />
          ) : (
            <div className="admin-horizontal-scroll -mx-1 px-1 pb-2 sm:mx-0 sm:px-0">
              <div className="min-w-0 space-y-3">
                {stats.recentLeads.map((lead) => {
                  const badgeClass =
                    STATUS_BADGE_MAP[lead.status] || "bg-white/10 text-white border-white/15";
                  const phone = lead.customer?.phone || "";
                  const waDigits = phone.replace(/\D/g, "");
                  return (
                    <article
                      key={lead.id}
                      className="rounded-xl border border-white/10 bg-black/45 p-3 sm:p-4 min-w-0 max-w-full overflow-hidden"
                    >
                      <div className="flex flex-col gap-2 min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between min-w-0">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                            <h3 className="truncate max-w-[170px] min-[360px]:max-w-[220px] text-sm font-medium text-white">
                              {lead.customer?.name || "Anonymous"}
                            </h3>
                            <span
                              className={`shrink-0 rounded border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.14em] ${badgeClass}`}
                            >
                              {lead.status.replace("_", " ")}
                            </span>
                          </div>
                          <p className="mt-1 truncate text-xs text-white/60">
                            {lead.title} ·{" "}
                            <span className="font-mono text-textGold">{lead.reference_number}</span>
                          </p>
                        </div>

                        <span className="shrink-0 self-start text-[11px] text-white/45 min-[420px]:self-auto">
                          {new Date(lead.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 min-[420px]:grid-cols-3 sm:flex sm:items-center">
                        {phone && (
                          <a
                            href={`tel:${phone}`}
                            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-[#121212] px-2.5 text-xs text-white transition hover:border-textGold sm:px-3 sm:flex-initial"
                          >
                            <Phone size={14} className="shrink-0 text-textGold" />
                            <span className="truncate">Call</span>
                          </a>
                        )}
                        {waDigits && (
                          <a
                            href={`https://wa.me/${waDigits}?text=${encodeURIComponent(
                              `Hello ${lead.customer?.name || ""}, regarding your enquiry ${lead.reference_number}.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-emerald-500/35 bg-emerald-950/35 px-2.5 text-xs text-emerald-300 transition hover:bg-emerald-500 hover:text-black sm:px-3 sm:flex-initial"
                          >
                            <MessageCircle size={14} className="shrink-0" />
                            <span className="truncate">WhatsApp</span>
                          </a>
                        )}
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          prefetch={false}
                          className="col-span-2 inline-flex min-h-11 items-center justify-center gap-1 rounded-lg bg-textGold px-3 text-xs font-semibold text-black transition hover:bg-white min-[420px]:col-span-1 sm:ml-auto sm:flex-initial"
                        >
                          <span>Details</span>
                          <ArrowRight size={13} className="shrink-0" />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </AdminCard>
      </div>

      {/* System Shortcuts */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3 sm:gap-4">
        <Link
          href="/admin/analytics"
          prefetch={false}
          className="group rounded-xl border border-white/10 bg-[#0d0d0d] p-4 transition hover:border-textGold/40 sm:p-5"
        >
          <div className="flex items-center justify-between text-textGold">
            <span className="text-[10px] uppercase tracking-[0.18em]">Analytics</span>
            <BarChart3 size={18} />
          </div>
          <h3 className="mt-2 text-base font-light text-white group-hover:text-textGold">
            Traffic &amp; Conversions
          </h3>
          <p className="mt-1 text-xs leading-5 text-white/50">
            Inspect campaign attribution, visited designs, and device mix.
          </p>
        </Link>

        <Link
          href="/admin/consent"
          prefetch={false}
          className="group rounded-xl border border-white/10 bg-[#0d0d0d] p-4 transition hover:border-textGold/40 sm:p-5"
        >
          <div className="flex items-center justify-between text-textGold">
            <span className="text-[10px] uppercase tracking-[0.18em]">Compliance</span>
            <Shield size={18} />
          </div>
          <h3 className="mt-2 text-base font-light text-white group-hover:text-textGold">
            Cookie Consent Audit
          </h3>
          <p className="mt-1 text-xs leading-5 text-white/50">
            Review visitor privacy selections, timestamps, and consent logs.
          </p>
        </Link>

        <Link
          href="/admin/settings/integrations"
          prefetch={false}
          className="group rounded-xl border border-white/10 bg-[#0d0d0d] p-4 transition hover:border-textGold/40 sm:p-5"
        >
          <div className="flex items-center justify-between text-textGold">
            <span className="text-[10px] uppercase tracking-[0.18em]">Diagnostics</span>
            <Cpu size={18} />
          </div>
          <h3 className="mt-2 text-base font-light text-white group-hover:text-textGold">
            Integrations &amp; Health
          </h3>
          <p className="mt-1 text-xs leading-5 text-white/50">
            Check Supabase, Resend, WhatsApp webhooks, and migration status.
          </p>
        </Link>
      </div>
    </main>
  );
}
