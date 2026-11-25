import Link from "next/link";
import { ArrowRight, Filter, Search } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminLeads } from "@/lib/crm";
import AdminNav from "../admin-nav";
import { SubmitButton } from "../submit-button";

export const metadata = { title: "Leads Pipeline | Afsha Creative Solution" };

type Props = {
  searchParams: Promise<{ status?: string; search?: string }>;
};

export default async function AdminLeadsPage({ searchParams }: Props) {
  const params = await searchParams;
  const status = params.status || "all";
  const search = params.search || "";

  const [, leads] = await Promise.all([
    requireAdmin(),
    getAdminLeads({ status, search }),
  ]);

  const statusColors: Record<string, string> = {
    new: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    contacted: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    qualified: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    quote_sent: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    negotiation: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    won: "bg-green-500/20 text-green-300 border-green-500/40",
    lost: "bg-red-500/10 text-red-400 border-red-500/30",
    spam: "bg-gray-500/10 text-gray-400 border-gray-500/30",
  };

  const statusTabs = [
    { label: "All Leads", value: "all" },
    { label: "New", value: "new" },
    { label: "Contacted", value: "contacted" },
    { label: "Qualified", value: "qualified" },
    { label: "Quote Sent", value: "quote_sent" },
    { label: "Negotiating", value: "negotiation" },
    { label: "Won", value: "won" },
    { label: "Lost", value: "lost" },
  ];

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <AdminNav />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-textGold">
              Lead Management
            </p>
            <h1 className="text-3xl font-light sm:text-4xl">Customer Inquiries</h1>
            <p className="mt-1 text-xs text-white/50">
              Manage custom quote requests, track status transitions, and follow up directly
            </p>
          </div>
        </div>

        {/* Search & Status Filter Tabs */}
        <div className="flex flex-col gap-4 border-b border-white/10 pb-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Status Tabs */}
          <div className="scrollbar-none -mx-4 flex overflow-x-auto px-4 gap-2 sm:mx-0 sm:px-0">
            {statusTabs.map((tab) => {
              const active = status === tab.value;
              return (
                <Link
                  key={tab.value}
                  href={`/admin/leads?status=${tab.value}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] transition ${
                    active
                      ? "bg-textGold text-black"
                      : "border border-white/10 text-white/60 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>

          {/* Search Form */}
          <form className="flex items-center gap-2">
            <input type="hidden" name="status" value={status} />
            <div className="relative">
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search name, phone, ref..."
                className="min-h-9 w-64 rounded-md border border-white/15 bg-[#121212] px-3 pl-8 text-xs text-white outline-none placeholder:text-white/30 focus:border-textGold/80"
              />
              <Search size={14} className="absolute left-2.5 top-2.5 text-white/40" />
            </div>
            <SubmitButton
              loadingText="Filtering..."
              className="min-h-9 rounded-md border border-white/20 bg-white/5 px-3 text-[10px] uppercase tracking-[0.14em] text-white hover:bg-white/10 disabled:opacity-40"
            >
              Filter
            </SubmitButton>
          </form>
        </div>

        {/* Leads Table */}
        <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-[#0d0d0d]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-black/40 text-[9px] uppercase tracking-[0.2em] text-white/45">
                <tr>
                  <th className="px-5 py-3.5">Ref / Time</th>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Category & Scope</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Follow-up</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-white/40">
                      No leads found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => {
                    const badgeClass = statusColors[lead.status] || "bg-white/10 text-white";
                    const formattedDate = new Date(lead.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <tr key={lead.id} className="transition hover:bg-white/[0.02]">
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="font-mono text-textGold">{lead.reference_number}</span>
                          <span className="block text-[10px] text-white/40">{formattedDate}</span>
                        </td>
                        <td className="px-5 py-4">
                          <strong className="block text-white">{lead.customer?.name || "Anonymous"}</strong>
                          <span className="text-[11px] text-white/60">{lead.customer?.phone}</span>
                          {lead.customer?.email && (
                            <span className="block text-[10px] text-white/40">{lead.customer.email}</span>
                          )}
                        </td>
                        <td className="px-5 py-4 max-w-xs">
                          <span className="font-medium text-white">{lead.title}</span>
                          {lead.dimensions && (
                            <span className="block text-[10px] text-white/50">Size: {lead.dimensions}</span>
                          )}
                          <p className="line-clamp-1 text-[11px] text-white/40">{lead.message}</p>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className={`inline-block rounded border px-2.5 py-0.5 text-[9px] uppercase tracking-[0.14em] ${badgeClass}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-white/50">
                          {lead.follow_up_date ? (
                            <span className="text-textGold">{lead.follow_up_date}</span>
                          ) : (
                            <span className="text-white/20">—</span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <Link
                            href={`/admin/leads/${lead.id}`}
                            className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-white/20 px-3 text-[10px] uppercase tracking-[0.14em] text-white transition hover:border-textGold hover:bg-textGold hover:text-black"
                          >
                            Open <ArrowRight size={12} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
