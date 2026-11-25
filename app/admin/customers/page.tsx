import Link from "next/link";
import { ArrowRight, Search, UserCheck } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminCustomers } from "@/lib/crm";
import AdminNav from "../admin-nav";
import { SubmitButton } from "../submit-button";

export const metadata = { title: "Customer Directory | Afsha Creative Solution" };

type Props = {
  searchParams: Promise<{ search?: string }>;
};

export default async function AdminCustomersPage({ searchParams }: Props) {
  const params = await searchParams;
  const search = params.search || "";
  const [, customers] = await Promise.all([
    requireAdmin(),
    getAdminCustomers(search),
  ]);

  const stageColors: Record<string, string> = {
    lead: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    prospect: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    customer: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    repeat_customer: "bg-textGold/20 text-textGold border-textGold/40",
    lost: "bg-red-500/10 text-red-400 border-red-500/30",
  };

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <AdminNav />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-textGold">
              Directory CRM
            </p>
            <h1 className="text-3xl font-light sm:text-4xl">Customer Master</h1>
            <p className="mt-1 text-xs text-white/50">
              Verified phone and email contacts, quotation history, and lifetime value
            </p>
          </div>
          <form className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search name, phone, email..."
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

        {/* Customer Table */}
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0d0d0d]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-black/40 text-[9px] uppercase tracking-[0.2em] text-white/45">
                <tr>
                  <th className="px-5 py-3.5">Name</th>
                  <th className="px-5 py-3.5">Phone & WhatsApp</th>
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
                    <td colSpan={7} className="py-12 text-center text-white/40">
                      No customer contacts found.
                    </td>
                  </tr>
                ) : (
                  customers.map((c) => {
                    const badgeClass = stageColors[c.lifecycle_stage] || "bg-white/10 text-white";
                    return (
                      <tr key={c.id} className="transition hover:bg-white/[0.02]">
                        <td className="px-5 py-4 font-medium text-white">{c.name}</td>
                        <td className="px-5 py-4 font-mono text-textGold">{c.phone}</td>
                        <td className="px-5 py-4 text-white/60">{c.email || "—"}</td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className={`inline-block rounded border px-2.5 py-0.5 text-[9px] uppercase tracking-[0.14em] ${badgeClass}`}>
                            {c.lifecycle_stage.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-5 py-4">{c.total_quotes_requested}</td>
                        <td className="px-5 py-4 text-white/40">
                          {new Date(c.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Link
                            href={`/admin/customers/${c.id}`}
                            className="inline-flex min-h-8 items-center gap-1 rounded border border-white/15 px-3 text-[10px] uppercase tracking-[0.14em] text-white hover:border-textGold hover:text-textGold"
                          >
                            View <ArrowRight size={12} />
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
