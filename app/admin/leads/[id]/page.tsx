import { notFound } from "next/navigation";
import { MessageCircle, Phone } from "lucide-react";
import AdminBreadcrumbs from "@/components/admin/AdminBreadcrumbs";
import AdminCard from "@/components/admin/AdminCard";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminLeadById } from "@/lib/crm";
import LeadStatusUpdater from "./lead-status-updater";

export const metadata = { title: "Lead Workspace | Afsha Creative Solution" };

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminLeadDetailPage({ params }: Props) {
  await requireAdmin();

  const { id } = await params;
  const lead = await getAdminLeadById(id);

  if (!lead) notFound();

  const customer = lead.customer;
  const whatsappHref = customer?.phone
    ? `https://wa.me/${customer.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
        `Hello ${customer.name}, this is Afsha Creative Solution regarding your inquiry ${lead.reference_number} for ${lead.title}.`
      )}`
    : null;

  return (
    <main className="mx-auto max-w-5xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <AdminBreadcrumbs
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Lead Inbox", href: "/admin/leads" },
          { label: lead.reference_number },
        ]}
      />

      {/* Lead Title & Quick Mobile/Desktop Outreach Bar */}
      <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-[#0d0d0d] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className="font-mono text-xs text-textGold">{lead.reference_number}</span>
            <span className="text-xs text-white/30">·</span>
            <span className="text-xs text-white/55">
              Received{" "}
              {new Date(lead.created_at).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          </div>
          <h1 className="mt-2 text-xl font-light text-white sm:text-3xl">{lead.title}</h1>
        </div>

        <div className="grid grid-cols-1 gap-2.5 min-[360px]:grid-cols-2 sm:flex sm:shrink-0 sm:flex-wrap">
          {customer?.phone && (
            <a
              href={`tel:${customer.phone}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-textGold bg-textGold/15 px-5 text-xs font-semibold uppercase tracking-[0.14em] text-textGold transition hover:bg-textGold hover:text-black"
            >
              <Phone size={15} />
              <span>Call Now</span>
            </a>
          )}
          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-5 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300 transition hover:bg-emerald-500 hover:text-black"
            >
              <MessageCircle size={15} />
              <span>WhatsApp</span>
            </a>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <AdminCard title="Customer Profile">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <span className="text-[10px] uppercase tracking-[0.14em] text-white/45">
                  Full Name
                </span>
                <p className="mt-1 text-sm font-medium text-white">
                  {customer?.name || "Not provided"}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.14em] text-white/45">
                  Phone Number
                </span>
                <p className="mt-1 text-sm font-medium text-white">
                  {customer?.phone ? (
                    <a
                      href={`tel:${customer.phone}`}
                      className="inline-flex min-h-10 items-center underline hover:text-textGold"
                    >
                      {customer.phone}
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.14em] text-white/45">
                  Email Address
                </span>
                <p className="mt-1 break-all text-sm font-medium text-white">
                  {customer?.email ? (
                    <a href={`mailto:${customer.email}`} className="underline hover:text-textGold">
                      {customer.email}
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.14em] text-white/45">
                  Location
                </span>
                <p className="mt-1 text-sm font-medium text-white">
                  {lead.city || customer?.city || "Moradabad"}
                  {customer?.state ? `, ${customer.state}` : ""}
                </p>
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Fabrication Specifications">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <span className="text-[10px] uppercase tracking-[0.14em] text-white/45">
                  Product Category
                </span>
                <p className="mt-1 text-sm text-white">{lead.category_slug || "Not specified"}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.14em] text-white/45">
                  Approx Dimensions
                </span>
                <p className="mt-1 text-sm text-white">{lead.dimensions || "To be measured"}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.14em] text-white/45">
                  Material Preference
                </span>
                <p className="mt-1 text-sm text-white">
                  {lead.material_preference || "Standard SS-304"}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.14em] text-white/45">
                  Source Channel
                </span>
                <p className="mt-1 text-sm capitalize text-white">
                  {lead.source.replace("_", " ")}
                </p>
              </div>
            </div>

            <div className="mt-5 border-t border-white/10 pt-4">
              <span className="text-[10px] uppercase tracking-[0.14em] text-white/45">
                Project Description
              </span>
              <div className="mt-2 whitespace-pre-wrap rounded-lg border border-white/10 bg-black/45 p-3.5 text-sm leading-relaxed text-white/85">
                {lead.message || "No extra description provided."}
              </div>
            </div>

            {lead.attachmentSignedUrl && (
              <div className="mt-5 border-t border-white/10 pt-4">
                <span className="text-[10px] uppercase tracking-[0.14em] text-textGold">
                  Customer Reference Photo
                </span>
                <div className="mt-3 overflow-hidden rounded-xl border border-white/15 bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={lead.attachmentSignedUrl}
                    alt={lead.attachment_name || "Customer reference image"}
                    className="max-h-80 w-full object-contain"
                  />
                </div>
                <a
                  href={lead.attachmentSignedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex min-h-11 items-center text-xs text-textGold underline hover:text-white"
                >
                  Open full resolution ({lead.attachment_name || "Attachment"})
                </a>
              </div>
            )}
          </AdminCard>

          <AdminCard title="Source Page & Campaign Attribution">
            <div className="grid gap-3 text-xs text-white/75 sm:grid-cols-2">
              <div>
                <span className="block text-[10px] uppercase tracking-[0.14em] text-white/45">
                  Source Page
                </span>
                <span className="mt-1 block break-all">
                  {lead.page_url ||
                    (typeof lead.attribution?.page_url === "string"
                      ? lead.attribution.page_url
                      : "Direct / Contact Form")}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-[0.14em] text-white/45">
                  Product Slug / Context
                </span>
                <span className="mt-1 block break-words">
                  {lead.product_slug ||
                    (typeof lead.attribution?.product_slug === "string"
                      ? lead.attribution.product_slug
                      : lead.category_slug || "—")}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-[0.14em] text-white/45">
                  UTM Source / Medium
                </span>
                <span className="mt-1 block">
                  {(lead.utm_source || lead.attribution?.utm_source || "Direct") as string}
                  {(lead.utm_medium || lead.attribution?.utm_medium)
                    ? ` / ${lead.utm_medium || lead.attribution?.utm_medium}`
                    : ""}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-[0.14em] text-white/45">
                  UTM Campaign
                </span>
                <span className="mt-1 block">
                  {(lead.utm_campaign || lead.attribution?.utm_campaign || "—") as string}
                </span>
              </div>
            </div>
          </AdminCard>
        </div>

        <div>
          <LeadStatusUpdater
            leadId={lead.id}
            initialStatus={lead.status}
            initialNotes={lead.internal_notes || ""}
            initialFollowUpDate={lead.follow_up_date || ""}
          />
        </div>
      </div>
    </main>
  );
}
