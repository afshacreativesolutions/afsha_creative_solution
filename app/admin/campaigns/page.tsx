import Link from "next/link";
import { Mail, MessageCircle, Plus, Send } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminCampaigns } from "@/lib/crm";
import AdminNav from "../admin-nav";

export const metadata = { title: "Marketing Campaigns | Afsha Creative Solution" };

export default async function AdminCampaignsPage() {
  const [, campaigns] = await Promise.all([
    requireAdmin(),
    getAdminCampaigns(),
  ]);

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <AdminNav />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-textGold">
              Marketing Automation
            </p>
            <h1 className="text-3xl font-light sm:text-4xl">Campaigns & Broadcasts</h1>
            <p className="mt-1 text-xs text-white/50">
              Manage opt-in broadcasts, architectural lookbook newsletters, and WhatsApp project updates
            </p>
          </div>
        </div>

        {/* Campaign List */}
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0d0d0d]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-black/40 text-[9px] uppercase tracking-[0.2em] text-white/45">
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
                    <td colSpan={6} className="py-12 text-center text-white/40">
                      No campaigns scheduled or sent yet.
                    </td>
                  </tr>
                ) : (
                  campaigns.map((c) => (
                    <tr key={c.id} className="transition hover:bg-white/[0.02]">
                      <td className="px-5 py-4 font-medium text-white">{c.name}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 uppercase text-textGold">
                          {c.channel === "whatsapp" ? <MessageCircle size={14} /> : <Mail size={14} />}
                          {c.channel}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded bg-white/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] text-white/70">
                          {c.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">{c.total_recipients}</td>
                      <td className="px-5 py-4">{c.delivered_count}</td>
                      <td className="px-5 py-4 text-white/40">
                        {new Date(c.created_at).toLocaleDateString("en-IN")}
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
