import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, CheckCircle2, Clock, Mail, MessageCircle, Phone, Shield, User } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminLeadById } from "@/lib/crm";
import AdminNav from "../../admin-nav";
import LeadStatusUpdater from "./lead-status-updater";

export const metadata = { title: "Lead Workspace | Afsha Creative Solution" };

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminLeadDetailPage({ params }: Props) {
  const { id } = await params;
  const [, lead] = await Promise.all([
    requireAdmin(),
    getAdminLeadById(id),
  ]);

  if (!lead) notFound();

  const customer = lead.customer;
  const whatsappHref = customer?.phone
    ? `https://wa.me/${customer.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
        `Hello ${customer.name}, this is Afsha Creative Solution regarding your inquiry ${lead.reference_number} for ${lead.title}.`
      )}`
    : null;

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <AdminNav />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
        <div className="mb-6">
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-2 text-xs text-white/50 hover:text-textGold"
          >
            <ArrowLeft size={14} /> Back to Leads
          </Link>
        </div>

        {/* Lead Title & Reference */}
        <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-[#0d0d0d] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-textGold">{lead.reference_number}</span>
              <span className="text-xs text-white/30">·</span>
              <span className="text-xs text-white/50">
                Received {new Date(lead.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-light text-white sm:text-3xl">{lead.title}</h1>
          </div>

          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-400 hover:bg-emerald-500 hover:text-black transition"
            >
              <MessageCircle size={15} /> Open WhatsApp Chat
            </a>
          )}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Main Column: Specifications & Message */}
          <div className="space-y-6 lg:col-span-2">
            {/* Customer Details */}
            <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-6">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-textGold">
                Customer Profile
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-white/40">Full Name</span>
                  <p className="mt-1 font-medium text-white">{customer?.name || "Not provided"}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-white/40">Phone Number</span>
                  <p className="mt-1 font-medium text-white">
                    <a href={`tel:${customer?.phone}`} className="hover:text-textGold underline">
                      {customer?.phone}
                    </a>
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-white/40">Email Address</span>
                  <p className="mt-1 font-medium text-white">
                    {customer?.email ? (
                      <a href={`mailto:${customer.email}`} className="hover:text-textGold underline">
                        {customer.email}
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-white/40">Location</span>
                  <p className="mt-1 font-medium text-white">
                    {customer?.city || "Moradabad"}, {customer?.state || "Uttar Pradesh"}
                  </p>
                </div>
              </div>
            </div>

            {/* Project Specifications */}
            <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-6">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-textGold">
                Fabrication Specifications
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-white/40">Product Category</span>
                  <p className="mt-1 text-white">{lead.category_slug || "Not specified"}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-white/40">Approx Dimensions</span>
                  <p className="mt-1 text-white">{lead.dimensions || "To be measured"}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-white/40">Material Preference</span>
                  <p className="mt-1 text-white">{lead.material_preference || "Standard SS-304"}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-white/40">Source Channel</span>
                  <p className="mt-1 text-white capitalize">{lead.source.replace("_", " ")}</p>
                </div>
              </div>

              <div className="mt-6 border-t border-white/10 pt-4">
                <span className="text-[10px] uppercase tracking-[0.14em] text-white/40">
                  Project Description & Vision
                </span>
                <div className="mt-2 rounded-lg border border-white/5 bg-black/40 p-4 text-xs leading-relaxed text-white/80 whitespace-pre-wrap">
                  {lead.message}
                </div>
              </div>
            </div>

            {/* Attribution Info */}
            {lead.attribution && Object.keys(lead.attribution).length > 0 && (
              <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-6 text-xs">
                <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                  Attribution & Technical Trace
                </h2>
                <div className="mt-3 grid gap-2 sm:grid-cols-2 text-white/60">
                  {Object.entries(lead.attribution).map(([k, v]) => (
                    <div key={k} className="truncate">
                      <span className="text-white/40">{k}:</span> {String(v)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Status & Follow-up Actions */}
          <div className="space-y-6">
            <LeadStatusUpdater
              leadId={lead.id}
              initialStatus={lead.status}
              initialNotes={lead.internal_notes || ""}
              initialFollowUpDate={lead.follow_up_date || ""}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
