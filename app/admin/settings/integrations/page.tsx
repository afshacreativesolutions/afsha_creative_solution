import { CheckCircle2, ShieldAlert, Sparkles } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminIntegrationsStatus } from "@/lib/crm";
import AdminNav from "../../admin-nav";

export const metadata = { title: "Integrations & Diagnostic | Afsha Creative Solution" };

export default async function AdminIntegrationsPage() {
  const [, integrations] = await Promise.all([
    requireAdmin(),
    getAdminIntegrationsStatus(),
  ]);

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <AdminNav />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-textGold" />
            <p className="text-[10px] uppercase tracking-[0.24em] text-textGold">
              Architecture & API Diagnostics
            </p>
          </div>
          <h1 className="mt-1 text-3xl font-light sm:text-4xl">System Health & Integrations</h1>
          <p className="mt-1 text-xs text-white/50">
            Live diagnostic of database connections, transactional messaging APIs, analytics tags, and webhooks
          </p>
        </div>

        <div className="grid gap-4">
          {Object.entries(integrations).map(([key, item]) => {
            const isOk = item.configured;
            return (
              <div
                key={key}
                className="flex flex-col gap-4 rounded-xl border border-white/10 bg-[#0d0d0d] p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex items-center gap-2.5">
                    {isOk ? (
                      <CheckCircle2 size={18} className="text-emerald-400" />
                    ) : (
                      <ShieldAlert size={18} className="text-amber-400" />
                    )}
                    <h2 className="text-sm font-medium text-white">{item.name}</h2>
                  </div>
                  <p className="mt-1.5 text-xs text-white/55 font-mono">{item.details}</p>
                </div>

                <div className="shrink-0">
                  <span
                    className={`rounded-full border px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] ${
                      isOk
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                        : "border-amber-500/40 bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {isOk ? "Active" : "Needs Config"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Database Migration Instructions Box */}
        <div className="mt-8 rounded-xl border border-textGold/30 bg-[#121212] p-6">
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-textGold">
            Database Migration Reference
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-white/70">
            The database migration script is stored at:
            <br />
            <code className="text-textGold font-mono">
              supabase/migrations/202611250001_customer_intelligence_and_crm.sql
            </code>
          </p>
          <p className="mt-2 text-xs leading-relaxed text-white/60">
            Paste and execute this file in your Supabase SQL Editor to initialize all 10 tables, triggers, and Row Level Security policies.
          </p>
        </div>
      </div>
    </main>
  );
}
