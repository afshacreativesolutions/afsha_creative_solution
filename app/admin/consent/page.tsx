import { Check, Shield, X } from "lucide-react";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminMobileList from "@/components/admin/AdminMobileList";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable from "@/components/admin/AdminTable";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminConsentRecords } from "@/lib/crm";

export const metadata = { title: "Privacy & Consent Audit | Afsha Creative Solution" };

export default async function AdminConsentPage() {
  await requireAdmin();
  const records = await getAdminConsentRecords(100);

  const badgeForAction = (action: string) =>
    action === "accept_all"
      ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-300"
      : action === "reject_optional"
        ? "border-red-500/35 bg-red-500/10 text-red-300"
        : "border-textGold/35 bg-textGold/10 text-textGold";

  return (
    <main className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <AdminPageHeader
        eyebrow="DPDP Act & GDPR Privacy Compliance"
        title="Consent Audit Log"
        description="Immutable log of visitor cookie consent selections, category permissions, and IP hashes."
      />

      <AdminMobileList
        isEmpty={records.length === 0}
        emptyState={
          <AdminEmptyState
            icon={<Shield size={28} />}
            title="No consent records logged yet"
            description="Visitor consent banner responses are recorded automatically."
          />
        }
      >
        {records.map((r) => (
          <article
            key={r.id}
            className="space-y-3 rounded-xl border border-white/10 bg-[#0d0d0d] p-4 text-xs"
          >
            <div className="flex items-start justify-between gap-2">
              <span
                className={`rounded border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${badgeForAction(
                  r.action
                )}`}
              >
                {r.action.replace("_", " ")}
              </span>
              <span className="text-[11px] text-white/50">
                {new Date(r.created_at).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-lg border border-white/10 bg-black/45 p-2.5 text-center">
              {[
                { label: "Analytics", allowed: r.analytics },
                { label: "Ads", allowed: r.advertising },
                { label: "Personal.", allowed: r.personalization },
              ].map((cat) => (
                <div key={cat.label}>
                  <p className="text-[10px] uppercase tracking-[0.1em] text-white/45">
                    {cat.label}
                  </p>
                  <p
                    className={`mt-1 inline-flex items-center gap-1 text-[11px] font-medium ${
                      cat.allowed ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {cat.allowed ? <Check size={12} /> : <X size={12} />}
                    {cat.allowed ? "Yes" : "No"}
                  </p>
                </div>
              ))}
            </div>

            <p className="truncate font-mono text-[10px] text-white/45">
              Visitor: {r.visitor_id}
            </p>
          </article>
        ))}
      </AdminMobileList>

      <AdminTable>
        <thead className="border-b border-white/10 bg-black/45 text-[10px] uppercase tracking-[0.18em] text-white/45">
          <tr>
            <th className="px-5 py-3.5">Logged At</th>
            <th className="px-5 py-3.5">Action Choice</th>
            <th className="px-5 py-3.5">Analytics</th>
            <th className="px-5 py-3.5">Advertising</th>
            <th className="px-5 py-3.5">Personalization</th>
            <th className="px-5 py-3.5">Visitor ID</th>
            <th className="px-5 py-3.5">IP Hash</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-white/80">
          {records.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-12 text-center text-sm text-white/45">
                No consent records logged yet.
              </td>
            </tr>
          ) : (
            records.map((r) => (
              <tr key={r.id} className="transition hover:bg-white/[0.02]">
                <td className="whitespace-nowrap px-5 py-4 text-white/60">
                  {new Date(r.created_at).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </td>
                <td className="whitespace-nowrap px-5 py-4">
                  <span
                    className={`rounded border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${badgeForAction(
                      r.action
                    )}`}
                  >
                    {r.action.replace("_", " ")}
                  </span>
                </td>
                <td className="px-5 py-4">
                  {r.analytics ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400">
                      <Check size={14} /> Granted
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-400">
                      <X size={14} /> Denied
                    </span>
                  )}
                </td>
                <td className="px-5 py-4">
                  {r.advertising ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400">
                      <Check size={14} /> Granted
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-400">
                      <X size={14} /> Denied
                    </span>
                  )}
                </td>
                <td className="px-5 py-4">
                  {r.personalization ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400">
                      <Check size={14} /> Granted
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-400">
                      <X size={14} /> Denied
                    </span>
                  )}
                </td>
                <td className="max-w-[130px] truncate px-5 py-4 font-mono text-[11px] text-white/45">
                  {r.visitor_id}
                </td>
                <td className="max-w-[130px] truncate px-5 py-4 font-mono text-[11px] text-white/35">
                  {r.ip_hash || "—"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </AdminTable>
    </main>
  );
}
