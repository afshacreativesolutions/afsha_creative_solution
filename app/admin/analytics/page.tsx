import { BarChart3, Compass, Laptop, Smartphone } from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminMobileList from "@/components/admin/AdminMobileList";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminTable from "@/components/admin/AdminTable";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminAnalyticsData } from "@/lib/crm";

export const metadata = { title: "Traffic & Attribution Analytics | Afsha Creative Solution" };

export default async function AdminAnalyticsPage() {
  await requireAdmin();
  const data = await getAdminAnalyticsData();

  const maxPageViews = Math.max(1, ...data.topPages.map((p) => p.count));
  const sourceEntries = Object.entries(data.sourcesBreakdown);
  const maxSourceVisitors = Math.max(1, ...sourceEntries.map(([, c]) => c));

  return (
    <main className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <AdminPageHeader
        eyebrow="Attribution & Web Analytics"
        title="Traffic Intelligence"
        description="First-party sessions, UTM sources, device breakdown, and top architectural page views."
      />

      {/* Top KPI row */}
      <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-3 sm:gap-4">
        <AdminStatCard
          label="Unique Visitors"
          value={data.visitorsCount}
          subtext="First-party visitors"
        />
        <AdminStatCard
          label="Sessions"
          value={data.sessionsCount}
          subtext="Total tracked visits"
        />
        <AdminStatCard
          label="Interactions"
          value={data.eventsCount}
          subtext="Views, clicks & quotes"
          valueClassName="text-textGold"
        />
      </div>

      {/* Responsive Bar Charts & Device Mix */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <AdminCard title="Top Visited Designs & Pages">
          {data.topPages.length === 0 ? (
            <AdminEmptyState
              icon={<BarChart3 size={24} />}
              title="No page view events recorded yet"
              className="py-8"
            />
          ) : (
            <div className="space-y-3">
              {data.topPages.map((page) => {
                const pct = Math.round((page.count / maxPageViews) * 100);
                return (
                  <div key={page.path} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="min-w-0 truncate font-mono text-white/85">{page.path}</span>
                      <span className="shrink-0 font-semibold text-textGold">
                        {page.count} views
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-textGold"
                        style={{ width: `${Math.max(pct, 6)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </AdminCard>

        <div className="space-y-6">
          <AdminCard title="Traffic Sources & UTMs">
            {sourceEntries.length === 0 ? (
              <p className="py-6 text-center text-xs text-white/45">No sources tracked yet.</p>
            ) : (
              <div className="space-y-3">
                {sourceEntries.map(([source, count]) => {
                  const pct = Math.round((count / maxSourceVisitors) * 100);
                  return (
                    <div key={source} className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="truncate text-white/85">{source}</span>
                        <span className="shrink-0 font-semibold text-textGold">
                          {count} visitors
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-emerald-400"
                          style={{ width: `${Math.max(pct, 6)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </AdminCard>

          <AdminCard title="Device Categories">
            <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-black/45 p-4 text-center">
                <Smartphone size={20} className="mx-auto text-textGold" />
                <p className="mt-2 text-xl font-light text-white">
                  {data.deviceBreakdown.mobile || 0}
                </p>
                <p className="text-[10px] uppercase tracking-[0.14em] text-white/50">Mobile</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/45 p-4 text-center">
                <Laptop size={20} className="mx-auto text-textGold" />
                <p className="mt-2 text-xl font-light text-white">
                  {data.deviceBreakdown.desktop || 0}
                </p>
                <p className="text-[10px] uppercase tracking-[0.14em] text-white/50">Desktop</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/45 p-4 text-center">
                <Compass size={20} className="mx-auto text-textGold" />
                <p className="mt-2 text-xl font-light text-white">
                  {data.deviceBreakdown.tablet || 0}
                </p>
                <p className="text-[10px] uppercase tracking-[0.14em] text-white/50">Tablet</p>
              </div>
            </div>
          </AdminCard>
        </div>
      </div>

      {/* Live Stream of Recent Events */}
      <div className="mt-6">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-textGold">
          Live Stream of Recent Events
        </h2>

        <AdminMobileList
          isEmpty={data.recentEvents.length === 0}
          emptyState={
            <AdminEmptyState title="No events recorded yet" className="py-10" />
          }
        >
          {data.recentEvents.map(
            (e: {
              id: string;
              created_at: string;
              event_name: string;
              page_url: string;
              visitor_id: string;
            }) => (
              <div
                key={e.id}
                className="rounded-xl border border-white/10 bg-[#0d0d0d] p-3.5 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-textGold">{e.event_name}</span>
                  <span className="shrink-0 text-[11px] text-white/45">
                    {new Date(e.created_at).toLocaleTimeString("en-IN")}
                  </span>
                </div>
                <p className="mt-1.5 break-all font-mono text-[11px] text-white/80">
                  {e.page_url}
                </p>
                <p className="mt-1 truncate font-mono text-[10px] text-white/40">
                  Visitor: {e.visitor_id}
                </p>
              </div>
            )
          )}
        </AdminMobileList>

        <AdminTable>
          <thead className="border-b border-white/10 bg-black/45 text-[10px] uppercase tracking-[0.18em] text-white/45">
            <tr>
              <th className="px-4 py-3.5">Timestamp</th>
              <th className="px-4 py-3.5">Event Name</th>
              <th className="px-4 py-3.5">Page URL</th>
              <th className="px-4 py-3.5">Visitor ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-white/75">
            {data.recentEvents.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-white/45">
                  No events recorded yet.
                </td>
              </tr>
            ) : (
              data.recentEvents.map(
                (e: {
                  id: string;
                  created_at: string;
                  event_name: string;
                  page_url: string;
                  visitor_id: string;
                }) => (
                  <tr key={e.id}>
                    <td className="whitespace-nowrap px-4 py-3 text-white/45">
                      {new Date(e.created_at).toLocaleTimeString("en-IN")}
                    </td>
                    <td className="px-4 py-3 font-semibold text-textGold">{e.event_name}</td>
                    <td className="max-w-sm truncate px-4 py-3">{e.page_url}</td>
                    <td className="max-w-[140px] truncate px-4 py-3 font-mono text-[11px] text-white/45">
                      {e.visitor_id}
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </AdminTable>
      </div>
    </main>
  );
}
