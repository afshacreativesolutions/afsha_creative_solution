import fs from "node:fs";
import path from "node:path";
import { createSupabaseServiceClient } from "./supabase/service";

const templateCache = new Map<string, string>();

function loadEmailTemplate(name: string) {
  const cached = templateCache.get(name);
  if (cached) return cached;
  const filePath = path.join(process.cwd(), "email-templates", `${name}.html`);
  const html = fs.readFileSync(filePath, "utf8");
  templateCache.set(name, html);
  return html;
}

export function renderEmailTemplate(
  name: string,
  variables: Record<string, string | number | boolean | null | undefined>
) {
  let html = loadEmailTemplate(name);
  for (const [key, value] of Object.entries(variables)) {
    const rendered =
      value === null || value === undefined
        ? ""
        : key.endsWith("_HTML")
          ? String(value)
          : escapeHtml(String(value));
    html = html.split(`{{{${key}}}}`).join(rendered);
  }
  return html;
}

export type EmailAttachment = {
  filename: string;
  content?: string;
  path?: string;
  content_id?: string;
  content_type?: string;
};

export type SendEmailOptions = {
  to: string | string[];
  replyTo?: string;
  subject: string;
  html?: string;
  text?: string;
  attachments?: EmailAttachment[];
  template?: {
    id: string;
    variables?: Record<string, string | number | boolean | null | undefined>;
  };
  leadId?: string;
  customerId?: string;
  messageType?: "transactional" | "marketing" | "notification";
};

export async function sendEmail({
  to,
  replyTo,
  subject,
  html,
  text,
  attachments,
  template,
  leadId,
  customerId,
  messageType = "transactional",
}: SendEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL || "Afsha Creative Solution <hello@afshacreative.in>";

  if (!apiKey) {
    console.warn("sendEmail: RESEND_API_KEY is not configured in environment.");
    return { success: false, error: "Email provider not configured." };
  }

  const recipients = Array.isArray(to) ? to : [to];

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: recipients,
        reply_to: replyTo,
        subject,
        ...(attachments && attachments.length > 0 ? { attachments } : {}),
        ...(template
          ? {
              template: {
                id: template.id,
                variables: template.variables ?? {},
              },
            }
          : { html, text }),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data?.message || "Failed to send email through Resend";
      await logEmailMessage({
        leadId,
        customerId,
        recipient: recipients.join(", "),
        messageType,
        status: "failed",
        errorMessage: errorMsg,
      });
      return { success: false, error: errorMsg };
    }

    const messageId = data?.id;
    await logEmailMessage({
      leadId,
      customerId,
      recipient: recipients.join(", "),
      messageType,
      status: "sent",
      providerMessageId: messageId,
    });

    return { success: true, messageId };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown email error";
    console.error("sendEmail exception:", err);
    await logEmailMessage({
      leadId,
      customerId,
      recipient: recipients.join(", "),
      messageType,
      status: "failed",
      errorMessage: errorMsg,
    });
    return { success: false, error: errorMsg };
  }
}

async function logEmailMessage(params: {
  leadId?: string;
  customerId?: string;
  recipient: string;
  messageType: "transactional" | "marketing" | "notification";
  status: "sent" | "failed";
  providerMessageId?: string;
  errorMessage?: string;
}) {
  try {
    const supabase = createSupabaseServiceClient();
    if (!supabase) return;

    await supabase.from("message_logs").insert({
      lead_id: params.leadId || null,
      customer_id: params.customerId || null,
      channel: "email",
      provider: "resend",
      recipient: params.recipient,
      direction: "outbound",
      message_type: params.messageType,
      status: params.status,
      provider_message_id: params.providerMessageId || null,
      error_message: params.errorMessage || null,
    });
  } catch (err) {
    console.warn("Failed to insert message_log for email:", err);
  }
}

export function buildCustomerConfirmationHtml({
  customerName,
  referenceNumber,
  categoryName,
  siteUrl = "https://www.afshacreative.in",
  whatsappUrl,
}: {
  customerName: string;
  referenceNumber: string;
  categoryName: string;
  siteUrl?: string;
  whatsappUrl: string;
}) {
  return renderEmailTemplate("enquiry-received", {
    CUSTOMER_NAME: customerName,
    CATEGORY: categoryName,
    ENQUIRY_REFERENCE: referenceNumber,
    WHATSAPP_URL: whatsappUrl,
    SITE_URL: siteUrl,
  });
}

function isSafeEmailImageSrc(src?: string): src is string {
  if (!src) return false;
  if (src.startsWith("cid:")) return /^cid:[a-zA-Z0-9._-]+$/.test(src);
  return src.startsWith("https://");
}

function isSafeHttpsUrl(url?: string): url is string {
  return Boolean(url && url.startsWith("https://"));
}

export type AdminNotificationProductContext = {
  name: string;
  category?: string;
  description?: string;
  pageUrl?: string;
  imageSrc?: string;
};

export function buildAdminNotificationHtml({
  customerName,
  phone,
  email,
  city,
  referenceNumber,
  categoryName,
  message,
  dimensions,
  hasAttachment,
  referenceImageUrl,
  submittedAt,
  enquiryHeading,
  product,
}: {
  customerName: string;
  phone: string;
  email?: string;
  city?: string;
  referenceNumber: string;
  categoryName: string;
  message: string;
  dimensions?: string;
  material?: string;
  source?: string;
  hasAttachment?: boolean;
  referenceImageUrl?: string;
  submittedAt: string;
  enquiryHeading?: string;
  product?: AdminNotificationProductContext;
}) {
  const safeProductImage = isSafeEmailImageSrc(product?.imageSrc) ? product.imageSrc : "";
  const safeProductUrl = isSafeHttpsUrl(product?.pageUrl) ? product.pageUrl : "";

  const productSectionHtml = product
    ? `<table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin:0;padding:0;border:1px solid #30291f;background:#171512;">
        <tbody>
          <tr>
            <td style="padding:18px;">
              <div style="font-size:9px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#c99f6c;margin-bottom:10px;">
                Requested Product
              </div>
              ${
                safeProductImage
                  ? `<div style="margin-bottom:14px;">
                      <img src="${escapeHtml(safeProductImage)}" alt="${escapeHtml(product.name)}" style="display:block;width:100%;max-height:280px;object-fit:cover;border:1px solid #30291f;border-radius:6px;" />
                    </div>`
                  : ""
              }
              <div style="font-size:18px;font-weight:400;line-height:1.35;color:#f5f1e9;">
                ${escapeHtml(product.name)}
              </div>
              ${
                product.category
                  ? `<div style="margin-top:4px;font-size:11px;letter-spacing:1.4px;text-transform:uppercase;color:#e1bd8d;">
                      ${escapeHtml(product.category)}
                    </div>`
                  : ""
              }
              ${
                product.description
                  ? `<p style="margin:10px 0 0;font-size:13px;line-height:1.6;color:#c8c1b8;">
                      ${escapeHtml(product.description)}
                    </p>`
                  : ""
              }
              ${
                safeProductUrl
                  ? `<div style="margin-top:14px;">
                      <a href="${escapeHtml(safeProductUrl)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:10px 18px;border:1px solid #c99f6c;border-radius:999px;font-size:10px;font-weight:bold;letter-spacing:1.6px;text-transform:uppercase;color:#e1bd8d;text-decoration:none;">
                        View Product Page →
                      </a>
                    </div>`
                  : ""
              }
            </td>
          </tr>
        </tbody>
      </table>`
    : "";

  return renderEmailTemplate("new-enquiry-notification", {
    CUSTOMER_NAME: customerName,
    CUSTOMER_PHONE: phone,
    CUSTOMER_EMAIL: email || "Not provided",
    ENQUIRY_HEADING: enquiryHeading || "New project enquiry",
    CATEGORY: categoryName,
    PRODUCT: product?.name || categoryName,
    CITY: city || "Not provided",
    DIMENSIONS: dimensions || "Not provided",
    REFERENCE_IMAGE: hasAttachment ? "Customer photo attached (view in admin leads)" : "None",
    REFERENCE_IMAGE_HTML: isSafeHttpsUrl(referenceImageUrl)
      ? `<div style="margin-top:16px;"><div style="margin-bottom:8px;font-size:10px;letter-spacing:1.4px;text-transform:uppercase;color:#c99f6c;">Customer Reference Photo</div><img src="${escapeHtml(referenceImageUrl)}" alt="Customer reference photo" style="max-width:100%;border:1px solid #30291f;border-radius:6px;" /></div>`
      : "",
    PRODUCT_SECTION_HTML: productSectionHtml,
    ENQUIRY_REFERENCE: referenceNumber,
    MESSAGE: message,
    SUBMITTED_AT: submittedAt,
    SITE_URL: "https://www.afshacreative.in",
  });
}

function escapeHtml(value: string) {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return value.replace(/[&<>"']/g, (c) => entities[c]);
}
