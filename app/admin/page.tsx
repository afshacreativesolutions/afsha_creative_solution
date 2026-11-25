import Link from "next/link";
import { ArrowRight, BarChart3, Clock, MessageSquare, Shield, Sparkles, UserCheck, Users } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminOverviewStats } from "@/lib/crm";
import AdminNav from "./admin-nav";

export const metadata = { title: "Admin Overview | Afsha Creative Solution" };

export default async function AdminOverviewPage() {
  const [, stats] = await Promise.all([
    requireAdmin(),
    getAdminOverviewStats(),
  ]);

  const statusColors: Record<string, string> = {
    new: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    contacted: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    qualified: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    quote_sent: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    negotiation: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    won: "bg-green-500/20 text-green-300 border-green-500/40",
    lost: "bg-red-500/10 text-red-400 border-red-500/30",
  };

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <AdminNav />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-textGold">
              Intelligence & CRM
            </p>
            <h1 className="text-3xl font-light sm:text-4xl">Executive Dashboard</h1>
            <p className="mt-1 text-xs text-white/50">
              Live customer leads, conversion pipeline, and privacy-first visitor metrics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/leads"
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-textGold bg-textGold/10 px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-textGold transition hover:bg-textGold hover:text-black"
            >
              View Pipeline
            </Link>
          </div>
        </div>

        {stats.error && (
          <div className="mb-8 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200">
            <p className="font-semibold">{stats.error}</p>
            <p className="mt-1 text-white/60">
              Run migration <code>supabase/migrations/202611250001_customer_intelligence_and_crm.sql</code> in your Supabase SQL Editor to activate tables.
            </p>
          </div>
        )}

        {/* Top KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-5">
            <div className="flex items-center justify-between text-white/50">
              <span className="text-[10px] uppercase tracking-[0.18em]">Total Inquiries</span>
              <Users size={16} className="text-textGold" />
            </div>
            <div className="mt-3 text-3xl font-light text-white">{stats.totalLeads}</div>
            <p className="mt-1 text-xs text-emerald-400">
              +{stats.newLeadsThisWeek} new this past week
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-5">
            <div className="flex items-center justify-between text-white/50">
              <span className="text-[10px] uppercase tracking-[0.18em]">Directory Customers</span>
              <UserCheck size={16} className="text-textGold" />
            </div>
            <div className="mt-3 text-3xl font-light text-white">{stats.totalCustomers}</div>
            <p className="mt-1 text-xs text-white/40">Verified phone contacts</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-5">
            <div className="flex items-center justify-between text-white/50">
              <span className="text-[10px] uppercase tracking-[0.18em]">Tracked Visitors</span>
              <BarChart3 size={16} className="text-textGold" />
            </div>
            <div className="mt-3 text-3xl font-light text-white">{stats.totalVisitors}</div>
            <p className="mt-1 text-xs text-white/40">First-party session identities</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-5">
            <div className="flex items-center justify-between text-white/50">
              <span className="text-[10px] uppercase tracking-[0.18em]">Pipeline Won</span>
              <Sparkles size={16} className="text-emerald-400" />
            </div>
            <div className="mt-3 text-3xl font-light text-white">{stats.leadsByStatus?.won || 0}</div>
            <p className="mt-1 text-xs text-textGold">Fabrication contracts secured</p>
          </div>
        </div>

        {/* Lead Status Breakdown */}
        <div className="mt-8 rounded-xl border border-white/10 bg-[#0d0d0d] p-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-textGold">
            Enquiry Pipeline Status
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {Object.entries({
              New: stats.leadsByStatus?.new || 0,
              Contacted: stats.leadsByStatus?.contacted || 0,
              Qualified: stats.leadsByStatus?.qualified || 0,
              "Quote Sent": stats.leadsByStatus?.quote_sent || 0,
              Negotiating: stats.leadsByStatus?.negotiation || 0,
              Won: stats.leadsByStatus?.won || 0,
              Lost: stats.leadsByStatus?.lost || 0,
            }).map(([label, count]) => (
              <div key={label} className="rounded-lg border border-white/5 bg-black/40 p-3 text-center">
                <p className="text-[9px] uppercase tracking-[0.14em] text-white/40">{label}</p>
                <p className="mt-1 text-lg font-light text-white">{count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Inquiries Table */}
        <div className="mt-8 rounded-xl border border-white/10 bg-[#0d0d0d] p-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
                Recent Project Inquiries
              </h2>
              <p className="text-xs text-white/45">Direct customer requests awaiting action</p>
            </div>
            <Link href="/admin/leads" className="text-xs text-textGold hover:underline">
              View all →
            </Link>
          </div>

          <div className="mt-4 divide-y divide-white/5 overflow-x-auto">
            {stats.recentLeads.length === 0 ? (
              <div className="py-10 text-center text-xs text-white/40">
                No inquiries recorded yet. When a visitor submits a quote or contact form, it will appear here.
              </div>
            ) : (
              stats.recentLeads.map((lead) => {
                const badgeClass = statusColors[lead.status] || "bg-white/10 text-white";
                return (
                  <div
                    key={lead.id}
                    className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{lead.customer?.name || "Anonymous"}</span>
                        <span className="text-xs text-white/40">·</span>
                        <span className="text-xs text-textGold">{lead.customer?.phone}</span>
                        <span className={`rounded border px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] ${badgeClass}`}>
                          {lead.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-white/60">
                        {lead.title} · Ref: <span className="text-white/80">{lead.reference_number}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] text-white/40">
                        {new Date(lead.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="inline-flex min-h-8 items-center gap-1 rounded border border-white/15 px-3 text-[10px] uppercase tracking-[0.14em] text-white hover:border-textGold hover:text-textGold"
                      >
                        Details <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Nav Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Link
            href="/admin/analytics"
            className="group rounded-xl border border-white/10 bg-[#0d0d0d] p-5 transition hover:border-textGold/40"
          >
            <div className="flex items-center justify-between text-textGold">
              <span className="text-[10px] uppercase tracking-[0.18em]">Analytics</span>
              <BarChart3 size={18} />
            </div>
            <h3 className="mt-2 text-base font-light text-white group-hover:text-textGold">
              Traffic & Conversions
            </h3>
            <p className="mt-1 text-xs text-white/45">
              Inspect UTM campaign attribution, top visited designs, and devices.
            </p>
          </Link>

          <Link
            href="/admin/consent"
            className="group rounded-xl border border-white/10 bg-[#0d0d0d] p-5 transition hover:border-textGold/40"
          >
            <div className="flex items-center justify-between text-textGold">
              <span className="text-[10px] uppercase tracking-[0.18em]">Compliance</span>
              <Shield size={18} />
            </div>
            <h3 className="mt-2 text-base font-light text-white group-hover:text-textGold">
              Cookie Consent Audit
            </h3>
            <p className="mt-1 text-xs text-white/45">
              View granular DPDP/GDPR consent records, timestamps, and IP hashes.
            </p>
          </Link>

          <Link
            href="/admin/settings/integrations"
            className="group rounded-xl border border-white/10 bg-[#0d0d0d] p-5 transition hover:border-textGold/40"
          >
            <div className="flex items-center justify-between text-textGold">
              <span className="text-[10px] uppercase tracking-[0.18em]">Integrations</span>
              <Sparkles size={18} />
            </div>
            <h3 className="mt-2 text-base font-light text-white group-hover:text-textGold">
              System Health Diagnostic
            </h3>
            <p className="mt-1 text-xs text-white/45">
              Verify live statuses of Supabase, Resend, WhatsApp API, and GA4.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
