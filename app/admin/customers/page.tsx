import Link from "next/link";
import { ArrowRight, MessageCircle, Phone, Search, Users } from "lucide-react";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminFilterBar from "@/components/admin/AdminFilterBar";
import AdminMobileList from "@/components/admin/AdminMobileList";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable from "@/components/admin/AdminTable";
import { ADMIN_BTN_PRIMARY, ADMIN_INPUT_CLASS } from "@/components/admin/admin-styles";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminCustomers } from "@/lib/crm";
import { SubmitButton } from "../submit-button";

export const metadata = { title: "Customer Directory | Afsha Creative Solution" };

type Props = {
  searchParams: Promise<{ search?: string }>;
};

const STAGE_COLORS: Record<string, string> = {
  lead: "bg-sky-500/10 text-sky-300 border-sky-500/35",
  prospect: "bg-purple-500/10 text-purple-300 border-purple-500/35",
  customer: "bg-emerald-500/10 text-emerald-300 border-emerald-500/35",
  repeat_customer: "bg-textGold/20 text-textGold border-textGold/40",
  lost: "bg-red-500/10 text-red-300 border-red-500/35",
};

export default async function AdminCustomersPage({ searchParams }: Props) {
  await requireAdmin();

  const params = await searchParams;
  const search = params.search || "";
  const customers = await getAdminCustomers(search);

  return (
    <main className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <AdminPageHeader
        eyebrow="Directory CRM"
        title="Customer Master"
        description="Verified phone and email contacts, quotation history, and customer lifecycle stages."
      />

      <AdminFilterBar
        searchSlot={
          <div className="relative">
            <Search
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
            />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search name, phone, email..."
              aria-label="Search customers"
              className={`${ADMIN_INPUT_CLASS} pl-10`}
            />
          </div>
        }
        actionSlot={
          <SubmitButton loadingText="Filtering..." className={`${ADMIN_BTN_PRIMARY} w-full lg:w-auto`}>
            Filter
          </SubmitButton>
        }
      />

      {/* Mobile Cards (< md) */}
      <AdminMobileList
        isEmpty={customers.length === 0}
        emptyState={
          <AdminEmptyState
            icon={<Users size={28} />}
            title="No customer contacts found"
            description="Customer directory entries are created automatically when enquiries arrive."
          />
        }
      >
        {customers.map((c) => {
          const badgeClass =
            STAGE_COLORS[c.lifecycle_stage] || "bg-white/10 text-white border-white/20";
          const waDigits = c.phone.replace(/\D/g, "");
          return (
            <article
              key={c.id}
              className="space-y-3 rounded-xl border border-white/10 bg-[#0d0d0d] p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="text-base font-medium text-white">{c.name}</h2>
                  <p className="mt-0.5 font-mono text-xs text-textGold">{c.phone}</p>
                  {c.email && <p className="mt-0.5 truncate text-xs text-white/55">{c.email}</p>}
                </div>
                <span
                  className={`shrink-0 rounded border px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] ${badgeClass}`}
                >
                  {c.lifecycle_stage.replace("_", " ")}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-white/55">
                <span>{c.total_quotes_requested} quote request(s)</span>
                <span>
                  Since{" "}
                  {new Date(c.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <a
                  href={`tel:${c.phone}`}
                  className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-[#141414] px-2 text-xs text-white transition hover:border-textGold"
                >
                  <Phone size={14} className="text-textGold" />
                  <span>Call</span>
                </a>
                <a
                  href={`https://wa.me/${waDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-emerald-500/35 bg-emerald-950/35 px-2 text-xs text-emerald-300 transition hover:bg-emerald-500 hover:text-black"
                >
                  <MessageCircle size={14} />
                  <span className="truncate">WhatsApp</span>
                </a>
                <Link
                  href={`/admin/customers/${c.id}`}
                  prefetch={false}
                  className="inline-flex min-h-11 items-center justify-center gap-1 rounded-lg bg-textGold px-2 text-xs font-semibold text-black transition hover:bg-white"
                >
                  <span>Profile</span>
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
            <th className="px-5 py-3.5">Name</th>
            <th className="px-5 py-3.5">Phone &amp; WhatsApp</th>
            <th className="px-5 py-3.5">Email</th>
            <th className="px-5 py-3.5">Lifecycle Stage</th>
            <th className="px-5 py-3.5">Quotes</th>
            <th className="px-5 py-3.5">Since</th>
            <th className="px-5 py-3.5 text-right">Profile</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-white/80">
          {customers.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-12 text-center text-sm text-white/45">
                No customer contacts found.
              </td>
            </tr>
          ) : (
            customers.map((c) => {
              const badgeClass =
                STAGE_COLORS[c.lifecycle_stage] || "bg-white/10 text-white border-white/20";
              return (
                <tr key={c.id} className="transition hover:bg-white/[0.02]">
                  <td className="px-5 py-4 text-sm font-medium text-white">{c.name}</td>
                  <td className="px-5 py-4 font-mono text-textGold">{c.phone}</td>
                  <td className="px-5 py-4 text-white/60">{c.email || "—"}</td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <span
                      className={`inline-block rounded border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.14em] ${badgeClass}`}
                    >
                      {c.lifecycle_stage.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-4">{c.total_quotes_requested}</td>
                  <td className="px-5 py-4 text-white/45">
                    {new Date(c.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/customers/${c.id}`}
                      prefetch={false}
                      className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-white/20 px-3.5 text-[11px] font-medium uppercase tracking-[0.12em] text-white transition hover:border-textGold hover:bg-textGold hover:text-black"
                    >
                      <span>View</span>
                      <ArrowRight size={13} />
                    </Link>
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
