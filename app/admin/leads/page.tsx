import Link from "next/link";
import { ArrowRight, Inbox, MessageCircle, Phone, Search } from "lucide-react";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminFilterBar from "@/components/admin/AdminFilterBar";
import AdminMobileList from "@/components/admin/AdminMobileList";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminTable from "@/components/admin/AdminTable";
import { ADMIN_BTN_PRIMARY, ADMIN_INPUT_CLASS, ADMIN_SELECT_CLASS } from "@/components/admin/admin-styles";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminLeadPipelineCounts, getAdminLeads } from "@/lib/crm";
import { SubmitButton } from "../submit-button";

export const metadata = { title: "Leads Pipeline | Afsha Creative Solution" };

type Props = {
  searchParams: Promise<{
    status?: string;
    search?: string;
    service?: string;
    dateRange?: string;
  }>;
};

const SERVICE_FILTERS = [
  { value: "all", label: "All Services" },
  { value: "gates", label: "Main Gates" },
  { value: "sliding-gates", label: "Sliding Gates" },
  { value: "folding-gates", label: "Folding Gates" },
  { value: "stair-railings", label: "Staircase Railings" },
  { value: "balcony-railings", label: "Balcony Railings" },
  { value: "spiral-railings", label: "Spiral Railings" },
  { value: "steel-doors", label: "Steel Doors" },
  { value: "decorative-grills", label: "Decorative Grills" },
  { value: "custom-metalwork", label: "Custom Metalwork" },
  { value: "other", label: "Other" },
];

const DATE_FILTERS = [
  { value: "all", label: "All Dates" },
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
];

const STATUS_COLORS: Record<string, string> = {
  new: "bg-emerald-500/10 text-emerald-300 border-emerald-500/35",
  contacted: "bg-sky-500/10 text-sky-300 border-sky-500/35",
  qualified: "bg-purple-500/10 text-purple-300 border-purple-500/35",
  quote_sent: "bg-amber-500/10 text-amber-300 border-amber-500/35",
  negotiation: "bg-yellow-500/10 text-yellow-300 border-yellow-500/35",
  won: "bg-green-500/20 text-green-300 border-green-500/40",
  lost: "bg-red-500/10 text-red-300 border-red-500/35",
  spam: "bg-gray-500/10 text-gray-400 border-gray-500/30",
};

const STATUS_TABS = [
  { label: "All Leads", value: "all" },
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Quoted", value: "quote_sent" },
  { label: "Won", value: "won" },
  { label: "Lost", value: "lost" },
];

export default async function AdminLeadsPage({ searchParams }: Props) {
  await requireAdmin();

  const params = await searchParams;
  const status = params.status || "all";
  const search = params.search || "";
  const service = params.service || "all";
  const dateRange = params.dateRange || "all";

  const [leads, pipelineCounts] = await Promise.all([
    getAdminLeads({ status, search, service, dateRange }),
    getAdminLeadPipelineCounts(),
  ]);

  const activeFilterCount = (service !== "all" ? 1 : 0) + (dateRange !== "all" ? 1 : 0);

  const makeFilterHref = (nextStatus: string) => {
    const qs = new URLSearchParams();
    qs.set("status", nextStatus);
    if (search) qs.set("search", search);
    if (service !== "all") qs.set("service", service);
    if (dateRange !== "all") qs.set("dateRange", dateRange);
    return `/admin/leads?${qs.toString()}`;
  };

  return (
    <main className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <AdminPageHeader
        eyebrow="Lead Management"
        title="Lead Inbox"
        description="Search enquiries, filter by fabrication category or timeframe, and contact leads in one tap."
      />

      {/* Pipeline Summary Counters */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <AdminStatCard label="Total Leads" value={pipelineCounts.total} />
        <AdminStatCard
          label="New"
          value={pipelineCounts.new}
          valueClassName="text-emerald-400"
        />
        <AdminStatCard
          label="Contacted"
          value={pipelineCounts.contacted}
          valueClassName="text-sky-400"
        />
        <AdminStatCard
          label="Quoted"
          value={pipelineCounts.quoted}
          valueClassName="text-amber-300"
        />
        <AdminStatCard
          label="Converted (Won)"
          value={pipelineCounts.won}
          valueClassName="text-textGold"
          className="col-span-2 sm:col-span-1"
        />
      </div>

      {/* Expandable Search & Filter Toolbar */}
      <AdminFilterBar
        activeFiltersCount={activeFilterCount}
        tabsSlot={STATUS_TABS.map((tab) => {
          const active = status === tab.value;
          return (
            <Link
              key={tab.value}
              href={makeFilterHref(tab.value)}
              prefetch={false}
              className={`inline-flex min-h-11 shrink-0 items-center rounded-full px-4 text-xs font-medium transition ${
                active
                  ? "bg-textGold font-semibold text-black"
                  : "border border-white/15 bg-[#0e0e0e] text-white/70 hover:border-white/35 hover:text-white"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
        searchSlot={
          <>
            <input type="hidden" name="status" value={status} />
            <div className="relative">
              <Search
                size={15}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
              />
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search name, phone, city, ref..."
                aria-label="Search leads"
                className={`${ADMIN_INPUT_CLASS} pl-10`}
              />
            </div>
          </>
        }
        filtersSlot={
          <>
            <select
              name="service"
              defaultValue={service}
              aria-label="Filter by fabrication service"
              className={`${ADMIN_SELECT_CLASS} sm:w-44`}
            >
              {SERVICE_FILTERS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <select
              name="dateRange"
              defaultValue={dateRange}
              aria-label="Filter by date range"
              className={`${ADMIN_SELECT_CLASS} sm:w-40`}
            >
              {DATE_FILTERS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </>
        }
        actionSlot={
          <SubmitButton loadingText="Filtering..." className={`${ADMIN_BTN_PRIMARY} w-full lg:w-auto`}>
            Apply
          </SubmitButton>
        }
      />

      {/* Mobile Cards (< md) */}
      <AdminMobileList
        isEmpty={leads.length === 0}
        emptyState={
          <AdminEmptyState
            icon={<Inbox size={28} />}
            title="No leads match your filters"
            description="Try clearing the search query or switching status filter tabs."
          />
        }
      >
        {leads.map((lead) => {
          const badgeClass = STATUS_COLORS[lead.status] || "bg-white/10 text-white border-white/20";
          const cityDisplay =
            lead.city ||
            (typeof lead.attribution?.city === "string" ? lead.attribution.city : "") ||
            lead.customer?.city ||
            "";
          const phone = lead.customer?.phone || "";
          const waPhone = phone.replace(/\D/g, "");
          const formattedDate = new Date(lead.created_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <article
              key={lead.id}
              className="space-y-3 rounded-xl border border-white/10 bg-[#0d0d0d] p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px]">
                    <span className="font-mono text-textGold">{lead.reference_number}</span>
                    <span className="text-white/45">{formattedDate}</span>
                  </div>
                  <h2 className="mt-1 text-base font-medium text-white">
                    {lead.customer?.name || "Anonymous"}
                  </h2>
                  <p className="text-xs text-white/65">
                    {phone || "No phone"}
                    {cityDisplay ? ` · ${cityDisplay}` : ""}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded border px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] ${badgeClass}`}
                >
                  {lead.status.replace("_", " ")}
                </span>
              </div>

              <div className="rounded-lg border border-white/10 bg-black/45 p-3 text-xs">
                <p className="font-medium text-white">{lead.title}</p>
                {lead.dimensions && (
                  <p className="mt-0.5 text-[11px] text-white/55">Dimensions: {lead.dimensions}</p>
                )}
                {lead.message && (
                  <p className="mt-1 line-clamp-2 text-[11px] text-white/55">{lead.message}</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 pt-0.5">
                {phone ? (
                  <a
                    href={`tel:${phone}`}
                    className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-[#141414] px-2 text-xs text-white transition hover:border-textGold"
                  >
                    <Phone size={14} className="shrink-0 text-textGold" />
                    <span>Call</span>
                  </a>
                ) : (
                  <span />
                )}
                {waPhone ? (
                  <a
                    href={`https://wa.me/${waPhone}?text=${encodeURIComponent(
                      `Hello ${lead.customer?.name || ""}, regarding your enquiry ${lead.reference_number} for ${lead.title}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-emerald-500/35 bg-emerald-950/35 px-2 text-xs text-emerald-300 transition hover:bg-emerald-500 hover:text-black"
                  >
                    <MessageCircle size={14} className="shrink-0" />
                    <span className="truncate">WhatsApp</span>
                  </a>
                ) : (
                  <span />
                )}
                <Link
                  href={`/admin/leads/${lead.id}`}
                  prefetch={false}
                  className="inline-flex min-h-11 items-center justify-center gap-1 rounded-lg bg-textGold px-2 text-xs font-semibold text-black transition hover:bg-white"
                >
                  <span>Open</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </article>
          );
        })}
      </AdminMobileList>

      {/* Desktop Table (>= md) */}
      <AdminTable>
        <thead className="border-b border-white/10 bg-black/45 text-[10px] uppercase tracking-[0.18em] text-white/45">
          <tr>
            <th className="px-5 py-3.5">Ref / Time</th>
            <th className="px-5 py-3.5">Customer &amp; City</th>
            <th className="px-5 py-3.5">Service &amp; Scope</th>
            <th className="px-5 py-3.5">Status</th>
            <th className="px-5 py-3.5">Follow-up</th>
            <th className="px-5 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-white/80">
          {leads.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-14 text-center text-sm text-white/45">
                No leads found matching your criteria.
              </td>
            </tr>
          ) : (
            leads.map((lead) => {
              const badgeClass =
                STATUS_COLORS[lead.status] || "bg-white/10 text-white border-white/20";
              const cityDisplay =
                lead.city ||
                (typeof lead.attribution?.city === "string" ? lead.attribution.city : "") ||
                lead.customer?.city ||
                "";
              const phone = lead.customer?.phone || "";
              const waPhone = phone.replace(/\D/g, "");
              const formattedDate = new Date(lead.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <tr key={lead.id} className="transition hover:bg-white/[0.02]">
                  <td className="whitespace-nowrap px-5 py-4">
                    <span className="font-mono text-textGold">{lead.reference_number}</span>
                    <span className="block text-[11px] text-white/45">{formattedDate}</span>
                  </td>
                  <td className="px-5 py-4">
                    <strong className="block text-sm font-medium text-white">
                      {lead.customer?.name || "Anonymous"}
                    </strong>
                    <span className="text-xs text-white/65">{phone}</span>
                    {cityDisplay && (
                      <span className="block text-[11px] text-textGold/85">{cityDisplay}</span>
                    )}
                  </td>
                  <td className="max-w-xs px-5 py-4">
                    <span className="font-medium text-white">{lead.title}</span>
                    {lead.dimensions && (
                      <span className="block text-[11px] text-white/55">
                        Size: {lead.dimensions}
                      </span>
                    )}
                    <p className="line-clamp-1 text-[11px] text-white/45">{lead.message}</p>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <span
                      className={`inline-block rounded border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.14em] ${badgeClass}`}
                    >
                      {lead.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-white/55">
                    {lead.follow_up_date ? (
                      <span className="text-textGold">{lead.follow_up_date}</span>
                    ) : (
                      <span className="text-white/25">—</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {phone && (
                        <a
                          href={`tel:${phone}`}
                          aria-label={`Call ${phone}`}
                          title={`Call ${phone}`}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-textGold transition hover:border-textGold"
                        >
                          <Phone size={15} />
                        </a>
                      )}
                      {waPhone && (
                        <a
                          href={`https://wa.me/${waPhone}?text=${encodeURIComponent(
                            `Hello ${lead.customer?.name || ""}, regarding your enquiry ${lead.reference_number}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`WhatsApp ${lead.customer?.name || "customer"}`}
                          title="WhatsApp customer"
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/35 text-emerald-400 transition hover:bg-emerald-500 hover:text-black"
                        >
                          <MessageCircle size={15} />
                        </a>
                      )}
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        prefetch={false}
                        className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-white/20 px-3.5 text-[11px] font-medium uppercase tracking-[0.12em] text-white transition hover:border-textGold hover:bg-textGold hover:text-black"
                      >
                        <span>Open</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </AdminTable>
    </main>
  );
}
