import { CheckCircle2, Clock, Mail, MessageCircle, XCircle } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminMessageLogs } from "@/lib/crm";
import AdminNav from "../admin-nav";

export const metadata = { title: "Communications Audit Logs | Afsha Creative Solution" };

export default async function AdminMessagesPage() {
  const [, logs] = await Promise.all([
    requireAdmin(),
    getAdminMessageLogs(100),
  ]);

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <AdminNav />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.24em] text-textGold">
            Communications Audit Trail
          </p>
          <h1 className="text-3xl font-light sm:text-4xl">Message Delivery Logs</h1>
          <p className="mt-1 text-xs text-white/50">
            Real-time delivery status of Resend emails and WhatsApp Cloud API messages
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0d0d0d]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-black/40 text-[9px] uppercase tracking-[0.2em] text-white/45">
                <tr>
                  <th className="px-5 py-3.5">Time</th>
                  <th className="px-5 py-3.5">Channel / Provider</th>
                  <th className="px-5 py-3.5">Recipient</th>
                  <th className="px-5 py-3.5">Type / Direction</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Provider Message ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-white/40">
                      No communications logged yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => {
                    const isSuccess = log.status === "sent" || log.status === "delivered" || log.status === "read" || log.status === "opened";
                    const isFailed = log.status === "failed" || log.status === "bounced";

                    return (
                      <tr key={log.id} className="transition hover:bg-white/[0.02]">
                        <td className="px-5 py-4 whitespace-nowrap text-white/60">
                          {new Date(log.created_at).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="flex items-center gap-1.5 uppercase font-medium text-white">
                            {log.channel === "whatsapp" ? (
                              <MessageCircle size={14} className="text-emerald-400" />
                            ) : (
                              <Mail size={14} className="text-textGold" />
                            )}
                            {log.channel} ({log.provider})
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono text-white/90">{log.recipient}</td>
                        <td className="px-5 py-4 capitalize text-white/60">
                          {log.direction} · {log.message_type}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 rounded border px-2.5 py-0.5 text-[9px] uppercase tracking-[0.14em] ${
                              isSuccess
                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                                : isFailed
                                ? "border-red-500/30 bg-red-500/10 text-red-400"
                                : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                            }`}
                          >
                            {isSuccess && <CheckCircle2 size={12} />}
                            {isFailed && <XCircle size={12} />}
                            {log.status}
                          </span>
                          {log.error_message && (
                            <span className="block mt-1 text-[10px] text-red-300 max-w-xs truncate">
                              {log.error_message}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 font-mono text-[10px] text-white/30 truncate max-w-[140px]">
                          {log.provider_message_id || "—"}
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
