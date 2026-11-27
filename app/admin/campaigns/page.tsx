import { Mail, Megaphone, MessageCircle } from "lucide-react";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminMobileList from "@/components/admin/AdminMobileList";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable from "@/components/admin/AdminTable";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminCampaigns } from "@/lib/crm";

export const metadata = { title: "Marketing Campaigns | Afsha Creative Solution" };

export default async function AdminCampaignsPage() {
  await requireAdmin();
  const campaigns = await getAdminCampaigns();

  return (
    <main className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <AdminPageHeader
        eyebrow="Marketing Automation"
        title="Campaigns & Broadcasts"
        description="Review opt-in email newsletters and WhatsApp project broadcast records."
      />

      <AdminMobileList
        isEmpty={campaigns.length === 0}
        emptyState={
          <AdminEmptyState
            icon={<Megaphone size={28} />}
            title="No campaigns scheduled or sent yet"
            description="Broadcast campaigns and subscriber dispatches will appear here once configured."
          />
        }
      >
        {campaigns.map((c) => (
          <article
            key={c.id}
            className="space-y-3 rounded-xl border border-white/10 bg-[#0d0d0d] p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className="text-base font-medium text-white">{c.name}</h2>
                <span className="mt-1 inline-flex items-center gap-1.5 text-xs uppercase text-textGold">
                  {c.channel === "whatsapp" ? <MessageCircle size={13} /> : <Mail size={13} />}
                  {c.channel}
                </span>
              </div>
              <span className="shrink-0 rounded bg-white/10 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.14em] text-white/75">
                {c.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-lg border border-white/10 bg-black/45 p-3 text-center text-xs">
              <div>
                <p className="text-[10px] uppercase tracking-[0.12em] text-white/45">Audience</p>
                <p className="mt-0.5 font-medium text-white">{c.total_recipients}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.12em] text-white/45">Delivered</p>
                <p className="mt-0.5 font-medium text-emerald-400">{c.delivered_count}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.12em] text-white/45">Created</p>
                <p className="mt-0.5 text-white/75">
                  {new Date(c.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </div>
            </div>
          </article>
        ))}
      </AdminMobileList>

      <AdminTable>
        <thead className="border-b border-white/10 bg-black/45 text-[10px] uppercase tracking-[0.18em] text-white/45">
          <tr>
            <th className="px-5 py-3.5">Campaign Name</th>
            <th className="px-5 py-3.5">Channel</th>
            <th className="px-5 py-3.5">Status</th>
            <th className="px-5 py-3.5">Audience Size</th>
            <th className="px-5 py-3.5">Delivered</th>
            <th className="px-5 py-3.5">Created Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-white/80">
          {campaigns.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-12 text-center text-sm text-white/45">
                No campaigns scheduled or sent yet.
              </td>
            </tr>
          ) : (
            campaigns.map((c) => (
              <tr key={c.id} className="transition hover:bg-white/[0.02]">
                <td className="px-5 py-4 text-sm font-medium text-white">{c.name}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1.5 uppercase text-textGold">
                    {c.channel === "whatsapp" ? (
                      <MessageCircle size={14} />
                    ) : (
                      <Mail size={14} />
                    )}
                    {c.channel}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="rounded bg-white/10 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.14em] text-white/75">
                    {c.status}
                  </span>
                </td>
                <td className="px-5 py-4">{c.total_recipients}</td>
                <td className="px-5 py-4">{c.delivered_count}</td>
                <td className="px-5 py-4 text-white/45">
                  {new Date(c.created_at).toLocaleDateString("en-IN")}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </AdminTable>
    </main>
  );
}
