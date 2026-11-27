import { CheckCircle2, Mail, MessageCircle, XCircle } from "lucide-react";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminMobileList from "@/components/admin/AdminMobileList";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable from "@/components/admin/AdminTable";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminMessageLogs } from "@/lib/crm";

export const metadata = { title: "Communications Audit Logs | Afsha Creative Solution" };

export default async function AdminMessagesPage() {
  await requireAdmin();
  const logs = await getAdminMessageLogs(100);

  return (
    <main className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <AdminPageHeader
        eyebrow="Communications Audit Trail"
        title="Message Delivery Logs"
        description="Delivery status of Resend email alerts and WhatsApp Cloud API notifications."
      />

      <AdminMobileList
        isEmpty={logs.length === 0}
        emptyState={
          <AdminEmptyState
            icon={<Mail size={28} />}
            title="No communications logged yet"
            description="Automated enquiry confirmation emails and WhatsApp webhook dispatches appear here."
          />
        }
      >
        {logs.map((log) => {
          const isSuccess =
            log.status === "sent" ||
            log.status === "delivered" ||
            log.status === "read" ||
            log.status === "opened";
          const isFailed = log.status === "failed" || log.status === "bounced";

          return (
            <article
              key={log.id}
              className="space-y-2.5 rounded-xl border border-white/10 bg-[#0d0d0d] p-4 text-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 font-medium uppercase text-white">
                  {log.channel === "whatsapp" ? (
                    <MessageCircle size={14} className="text-emerald-400" />
                  ) : (
                    <Mail size={14} className="text-textGold" />
                  )}
                  {log.channel} ({log.provider})
                </span>
                <span
                  className={`inline-flex shrink-0 items-center gap-1 rounded border px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] ${
                    isSuccess
                      ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-300"
                      : isFailed
                        ? "border-red-500/35 bg-red-500/10 text-red-300"
                        : "border-amber-500/35 bg-amber-500/10 text-amber-300"
                  }`}
                >
                  {isSuccess && <CheckCircle2 size={11} />}
                  {isFailed && <XCircle size={11} />}
                  {log.status}
                </span>
              </div>

              <p className="break-all font-mono text-white/90">{log.recipient}</p>
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-white/50">
                <span className="capitalize">
                  {log.direction} · {log.message_type}
                </span>
                <span>
                  {new Date(log.created_at).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>

              {log.error_message && (
                <p className="rounded bg-red-950/35 p-2 text-[11px] text-red-200">
                  {log.error_message}
                </p>
              )}
            </article>
          );
        })}
      </AdminMobileList>

      <AdminTable>
        <thead className="border-b border-white/10 bg-black/45 text-[10px] uppercase tracking-[0.18em] text-white/45">
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
              <td colSpan={6} className="py-12 text-center text-sm text-white/45">
                No communications logged yet.
              </td>
            </tr>
          ) : (
            logs.map((log) => {
              const isSuccess =
                log.status === "sent" ||
                log.status === "delivered" ||
                log.status === "read" ||
                log.status === "opened";
              const isFailed = log.status === "failed" || log.status === "bounced";

              return (
                <tr key={log.id} className="transition hover:bg-white/[0.02]">
                  <td className="whitespace-nowrap px-5 py-4 text-white/60">
                    {new Date(log.created_at).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <span className="flex items-center gap-1.5 font-medium uppercase text-white">
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
                  <td className="whitespace-nowrap px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.14em] ${
                        isSuccess
                          ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-300"
                          : isFailed
                            ? "border-red-500/35 bg-red-500/10 text-red-300"
                            : "border-amber-500/35 bg-amber-500/10 text-amber-300"
                      }`}
                    >
                      {isSuccess && <CheckCircle2 size={12} />}
                      {isFailed && <XCircle size={12} />}
                      {log.status}
                    </span>
                    {log.error_message && (
                      <span className="mt-1 block max-w-xs truncate text-[11px] text-red-300">
                        {log.error_message}
                      </span>
                    )}
                  </td>
                  <td className="max-w-[150px] truncate px-5 py-4 font-mono text-[11px] text-white/35">
                    {log.provider_message_id || "—"}
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
