import { Shield, Check, X, Lock } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminConsentRecords } from "@/lib/crm";
import AdminNav from "../admin-nav";

export const metadata = { title: "Privacy & Consent Audit | Afsha Creative Solution" };

export default async function AdminConsentPage() {
  const [, records] = await Promise.all([
    requireAdmin(),
    getAdminConsentRecords(100),
  ]);

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <AdminNav />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-textGold" />
            <p className="text-[10px] uppercase tracking-[0.24em] text-textGold">
              DPDP Act & GDPR Privacy Compliance
            </p>
          </div>
          <h1 className="mt-1 text-3xl font-light sm:text-4xl">Consent Audit Log</h1>
          <p className="mt-1 text-xs text-white/50">
            Immutable log of visitor consent selections, category permissions, action types, and IP hash records
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0d0d0d]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-black/40 text-[9px] uppercase tracking-[0.2em] text-white/45">
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
                    <td colSpan={7} className="py-12 text-center text-white/40">
                      No consent records logged yet.
                    </td>
                  </tr>
                ) : (
                  records.map((r) => (
                    <tr key={r.id} className="transition hover:bg-white/[0.02]">
                      <td className="px-5 py-4 whitespace-nowrap text-white/60">
                        {new Date(r.created_at).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`rounded border px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] ${
                            r.action === "accept_all"
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                              : r.action === "reject_optional"
                              ? "border-red-500/30 bg-red-500/10 text-red-400"
                              : "border-textGold/30 bg-textGold/10 text-textGold"
                          }`}
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
                      <td className="px-5 py-4 font-mono text-[10px] text-white/40 truncate max-w-[120px]">
                        {r.visitor_id}
                      </td>
                      <td className="px-5 py-4 font-mono text-[10px] text-white/30 truncate max-w-[120px]">
                        {r.ip_hash || "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
