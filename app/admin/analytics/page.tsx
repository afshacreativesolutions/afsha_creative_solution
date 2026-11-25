import Link from "next/link";
import { BarChart3, Compass, Eye, Globe, Laptop, Smartphone, TrendingUp } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminAnalyticsData } from "@/lib/crm";
import AdminNav from "../admin-nav";

export const metadata = { title: "Traffic & Attribution Analytics | Afsha Creative Solution" };

export default async function AdminAnalyticsPage() {
  const [, data] = await Promise.all([
    requireAdmin(),
    getAdminAnalyticsData(),
  ]);

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <AdminNav />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.24em] text-textGold">
            Attribution & Web Analytics
          </p>
          <h1 className="text-3xl font-light sm:text-4xl">Traffic Intelligence</h1>
          <p className="mt-1 text-xs text-white/50">
            First-party sessions, UTM campaigns, device breakdown, and top architectural interest
          </p>
        </div>

        {/* Top KPI row */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-5">
            <span className="text-[10px] uppercase tracking-[0.16em] text-white/40">Unique Visitors</span>
            <p className="mt-2 text-3xl font-light text-white">{data.visitorsCount}</p>
            <p className="mt-1 text-xs text-white/40">Identified first-party visitors</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-5">
            <span className="text-[10px] uppercase tracking-[0.16em] text-white/40">Browsing Sessions</span>
            <p className="mt-2 text-3xl font-light text-white">{data.sessionsCount}</p>
            <p className="mt-1 text-xs text-white/40">Total session visits</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-5">
            <span className="text-[10px] uppercase tracking-[0.16em] text-white/40">Tracked Interactions</span>
            <p className="mt-2 text-3xl font-light text-white">{data.eventsCount}</p>
            <p className="mt-1 text-xs text-white/40">Page views, clicks & quote submissions</p>
          </div>
        </div>

        {/* Two Column Breakdown */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Top Pages */}
          <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-textGold">
              Top Visited Designs & Pages
            </h2>
            <div className="mt-4 divide-y divide-white/5">
              {data.topPages.length === 0 ? (
                <p className="py-6 text-center text-xs text-white/40">No page view events recorded yet.</p>
              ) : (
                data.topPages.map((page) => (
                  <div key={page.path} className="flex items-center justify-between py-3 text-xs">
                    <span className="font-mono text-white/80 truncate max-w-xs">{page.path}</span>
                    <span className="font-semibold text-textGold">{page.count} views</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Traffic Sources & Devices */}
          <div className="space-y-6">
            {/* Traffic Sources */}
            <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-6">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-textGold">
                Traffic Sources & UTMs
              </h2>
              <div className="mt-4 divide-y divide-white/5">
                {Object.keys(data.sourcesBreakdown).length === 0 ? (
                  <p className="py-6 text-center text-xs text-white/40">No sources tracked yet.</p>
                ) : (
                  Object.entries(data.sourcesBreakdown).map(([source, count]) => (
                    <div key={source} className="flex items-center justify-between py-3 text-xs">
                      <span className="text-white/80">{source}</span>
                      <span className="font-semibold text-textGold">{count} visitors</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Device Breakdown */}
            <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-6">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-textGold">
                Device Categories
              </h2>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-white/5 bg-black/40 p-4 text-center">
                  <Smartphone size={20} className="mx-auto text-textGold" />
                  <p className="mt-2 text-lg font-light text-white">{data.deviceBreakdown.mobile || 0}</p>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-white/40">Mobile</p>
                </div>
                <div className="rounded-lg border border-white/5 bg-black/40 p-4 text-center">
                  <Laptop size={20} className="mx-auto text-textGold" />
                  <p className="mt-2 text-lg font-light text-white">{data.deviceBreakdown.desktop || 0}</p>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-white/40">Desktop</p>
                </div>
                <div className="rounded-lg border border-white/5 bg-black/40 p-4 text-center">
                  <Compass size={20} className="mx-auto text-textGold" />
                  <p className="mt-2 text-lg font-light text-white">{data.deviceBreakdown.tablet || 0}</p>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-white/40">Tablet</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Stream of Recent Events */}
        <div className="mt-8 rounded-xl border border-white/10 bg-[#0d0d0d] p-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-textGold">
            Live Stream of Recent Events
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-black/40 text-[9px] uppercase tracking-[0.2em] text-white/45">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Event Name</th>
                  <th className="px-4 py-3">Page URL</th>
                  <th className="px-4 py-3">Visitor ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/70">
                {data.recentEvents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-white/40">
                      No events recorded yet.
                    </td>
                  </tr>
                ) : (
                  data.recentEvents.map((e: { id: string; created_at: string; event_name: string; page_url: string; visitor_id: string }) => (
                    <tr key={e.id}>
                      <td className="px-4 py-3 text-white/40 whitespace-nowrap">
                        {new Date(e.created_at).toLocaleTimeString("en-IN")}
                      </td>
                      <td className="px-4 py-3 font-semibold text-textGold">{e.event_name}</td>
                      <td className="px-4 py-3 truncate max-w-sm">{e.page_url}</td>
                      <td className="px-4 py-3 font-mono text-[10px] text-white/40 truncate max-w-[120px]">
                        {e.visitor_id}
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
