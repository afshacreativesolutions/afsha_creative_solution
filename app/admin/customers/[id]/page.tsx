import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Mail, MessageCircle, Phone, UserCheck } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminCustomerById } from "@/lib/crm";
import AdminNav from "../../admin-nav";

export const metadata = { title: "Customer 360 | Afsha Creative Solution" };

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminCustomerDetailPage({ params }: Props) {
  const { id } = await params;
  const [, data] = await Promise.all([
    requireAdmin(),
    getAdminCustomerById(id),
  ]);

  if (!data || !data.customer) notFound();

  const { customer, leads, subscriptions } = data;
  const whatsappHref = `https://wa.me/${customer.phone.replace(/\D/g, "")}`;

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <AdminNav />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
        <div className="mb-6">
          <Link
            href="/admin/customers"
            className="inline-flex items-center gap-2 text-xs text-white/50 hover:text-textGold"
          >
            <ArrowLeft size={14} /> Back to Customer Directory
          </Link>
        </div>

        {/* Customer Header */}
        <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-[#0d0d0d] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <UserCheck size={18} className="text-textGold" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-textGold">
                Customer 360
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-light text-white sm:text-3xl">{customer.name}</h1>
            <p className="mt-1 text-xs text-white/50">
              Customer since {new Date(customer.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-400 hover:bg-emerald-500 hover:text-black transition"
            >
              <MessageCircle size={15} /> WhatsApp
            </a>
            {customer.email && (
              <a
                href={`mailto:${customer.email}`}
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-white hover:bg-white/10 transition"
              >
                <Mail size={15} /> Email
              </a>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-5">
            <span className="text-[10px] uppercase tracking-[0.16em] text-white/40">Total Inquiries</span>
            <p className="mt-2 text-2xl font-light text-white">{customer.total_quotes_requested}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-5">
            <span className="text-[10px] uppercase tracking-[0.16em] text-white/40">Lifecycle Stage</span>
            <p className="mt-2 text-2xl font-light capitalize text-textGold">{customer.lifecycle_stage.replace("_", " ")}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-5">
            <span className="text-[10px] uppercase tracking-[0.16em] text-white/40">Completed Orders</span>
            <p className="mt-2 text-2xl font-light text-white">{customer.total_orders_completed}</p>
          </div>
        </div>

        {/* Subscriptions */}
        <div className="mt-8 rounded-xl border border-white/10 bg-[#0d0d0d] p-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-textGold">
            Marketing Subscriptions & Consent
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {subscriptions.length === 0 ? (
              <p className="text-xs text-white/40">No active marketing subscriptions recorded.</p>
            ) : (
              subscriptions.map((sub: { id: string; channel: string; destination: string; status: string; opt_in_timestamp: string }) => (
                <div key={sub.id} className="rounded-lg border border-white/5 bg-black/40 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-[0.12em] text-white">{sub.channel}</span>
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] text-emerald-400">
                      {sub.status}
                    </span>
                  </div>
                  <p className="mt-2 font-mono text-xs text-textGold">{sub.destination}</p>
                  <p className="mt-1 text-[10px] text-white/40">
                    Opted in on {new Date(sub.opt_in_timestamp).toLocaleDateString("en-IN")}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Inquiry History */}
        <div className="mt-8 rounded-xl border border-white/10 bg-[#0d0d0d] p-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-textGold">
            Project Inquiries ({leads.length})
          </h2>
          <div className="mt-4 divide-y divide-white/5">
            {leads.length === 0 ? (
              <p className="text-xs text-white/40 py-4">No inquiries registered.</p>
            ) : (
              leads.map((l) => (
                <div key={l.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-textGold">{l.reference_number}</span>
                      <span className="text-white/30">·</span>
                      <span className="font-medium text-white">{l.title}</span>
                      <span className="rounded bg-white/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] text-white/70">
                        {l.status}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-1 text-xs text-white/50">{l.message}</p>
                  </div>
                  <Link
                    href={`/admin/leads/${l.id}`}
                    className="shrink-0 text-xs text-textGold hover:underline"
                  >
                    View Lead →
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
