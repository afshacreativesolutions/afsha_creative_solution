import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Mail, MessageCircle, Phone, UserCheck } from "lucide-react";
import AdminBreadcrumbs from "@/components/admin/AdminBreadcrumbs";
import AdminCard from "@/components/admin/AdminCard";
import AdminStatCard from "@/components/admin/AdminStatCard";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminCustomerById } from "@/lib/crm";

export const metadata = { title: "Customer 360 | Afsha Creative Solution" };

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminCustomerDetailPage({ params }: Props) {
  await requireAdmin();

  const { id } = await params;
  const data = await getAdminCustomerById(id);

  if (!data || !data.customer) notFound();

  const { customer, leads, subscriptions } = data;
  const whatsappHref = `https://wa.me/${customer.phone.replace(/\D/g, "")}`;

  return (
    <main className="mx-auto max-w-5xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <AdminBreadcrumbs
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Customers", href: "/admin/customers" },
          { label: customer.name },
        ]}
      />

      <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-[#0d0d0d] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <UserCheck size={17} className="text-textGold" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-textGold">
              Customer 360
            </span>
          </div>
          <h1 className="mt-2 truncate text-2xl font-light text-white sm:text-3xl">
            {customer.name}
          </h1>
          <p className="mt-1 text-xs text-white/55">
            Customer since{" "}
            {new Date(customer.created_at).toLocaleDateString("en-IN", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2.5 min-[360px]:grid-cols-2 sm:flex sm:shrink-0 sm:flex-wrap">
          <a
            href={`tel:${customer.phone}`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-textGold bg-textGold/15 px-5 text-xs font-semibold uppercase tracking-[0.14em] text-textGold transition hover:bg-textGold hover:text-black"
          >
            <Phone size={15} /> Call
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-5 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300 transition hover:bg-emerald-500 hover:text-black"
          >
            <MessageCircle size={15} /> WhatsApp
          </a>
          {customer.email && (
            <a
              href={`mailto:${customer.email}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-white/10 min-[360px]:col-span-2 sm:col-span-1"
            >
              <Mail size={15} /> Email
            </a>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 min-[360px]:grid-cols-3 sm:gap-4">
        <AdminStatCard label="Total Inquiries" value={customer.total_quotes_requested} />
        <AdminStatCard
          label="Lifecycle Stage"
          value={customer.lifecycle_stage.replace("_", " ")}
          valueClassName="capitalize text-textGold"
        />
        <AdminStatCard label="Completed Orders" value={customer.total_orders_completed} />
      </div>

      <AdminCard title="Marketing Subscriptions & Consent" className="mt-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {subscriptions.length === 0 ? (
            <p className="text-xs text-white/45">No active marketing subscriptions recorded.</p>
          ) : (
            subscriptions.map(
              (sub: {
                id: string;
                channel: string;
                destination: string;
                status: string;
                opt_in_timestamp: string;
              }) => (
                <div key={sub.id} className="rounded-lg border border-white/10 bg-black/45 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium uppercase tracking-[0.12em] text-white">
                      {sub.channel}
                    </span>
                    <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-emerald-300">
                      {sub.status}
                    </span>
                  </div>
                  <p className="mt-2 break-all font-mono text-xs text-textGold">
                    {sub.destination}
                  </p>
                  <p className="mt-1 text-[11px] text-white/45">
                    Opted in {new Date(sub.opt_in_timestamp).toLocaleDateString("en-IN")}
                  </p>
                </div>
              )
            )
          )}
        </div>
      </AdminCard>

      <AdminCard title={`Project Inquiries (${leads.length})`} className="mt-6">
        {leads.length === 0 ? (
          <p className="py-4 text-xs text-white/45">No inquiries registered.</p>
        ) : (
          <div className="space-y-3">
            {leads.map((l) => (
              <div
                key={l.id}
                className="flex flex-col gap-3 rounded-lg border border-white/10 bg-black/45 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-textGold">{l.reference_number}</span>
                    <span className="text-sm font-medium text-white">{l.title}</span>
                    <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-white/75">
                      {l.status.replace("_", " ")}
                    </span>
                  </div>
                  {l.message && (
                    <p className="mt-1 line-clamp-2 text-xs text-white/55">{l.message}</p>
                  )}
                </div>
                <Link
                  href={`/admin/leads/${l.id}`}
                  prefetch={false}
                  className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1 rounded-lg border border-textGold/50 bg-textGold/10 px-4 text-xs font-medium text-textGold transition hover:bg-textGold hover:text-black"
                >
                  <span>View Lead</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </main>
  );
}
