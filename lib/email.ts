import { createSupabaseServiceClient } from "./supabase/service";

export type SendEmailOptions = {
  to: string | string[];
  replyTo?: string;
  subject: string;
  html: string;
  text?: string;
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
        html,
        text,
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
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your Metalwork Enquiry — Afsha Creative Solution</title>
</head>
<body style="background-color: #080808; color: #F5F5F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #121212; border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; overflow: hidden;">
    <div style="background-color: #080808; padding: 28px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
      <h1 style="color: #D6A36F; font-size: 18px; letter-spacing: 0.25em; text-transform: uppercase; margin: 0;">AFSHA CREATIVE SOLUTION</h1>
      <p style="color: #A7A7A7; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; margin: 6px 0 0;">Architectural Metalwork & Fabrication · Moradabad</p>
    </div>
    <div style="padding: 32px 28px;">
      <h2 style="font-size: 20px; font-weight: 300; margin-top: 0; color: #FFFFFF;">Enquiry Received, ${escapeHtml(customerName)}</h2>
      <p style="color: #A7A7A7; font-size: 14px; line-height: 1.6;">Thank you for contacting Afsha Creative Solution. We have received your project details for <strong>${escapeHtml(categoryName)}</strong> under reference number:</p>
      
      <div style="background-color: #080808; border-left: 3px solid #D6A36F; padding: 14px 18px; margin: 24px 0; border-radius: 4px;">
        <span style="font-size: 10px; color: #A7A7A7; letter-spacing: 0.15em; text-transform: uppercase; display: block;">Reference Code</span>
        <strong style="font-size: 16px; color: #D6A36F; letter-spacing: 0.08em;">${escapeHtml(referenceNumber)}</strong>
      </div>

      <p style="color: #A7A7A7; font-size: 14px; line-height: 1.6;">Our workshop master craftsmen will review your requirements, dimensions, and specifications to prepare a bespoke estimate or arrange an on-site inspection.</p>

      <div style="margin: 32px 0 20px; text-align: center;">
        <a href="${whatsappUrl}" style="background-color: #D6A36F; color: #080808; text-decoration: none; padding: 13px 28px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.18em; border-radius: 9999px; display: inline-block;">Connect on WhatsApp</a>
      </div>
    </div>
    <div style="background-color: #080808; padding: 20px 28px; border-top: 1px solid rgba(255,255,255,0.08); text-align: center; font-size: 11px; color: #666666;">
      <p style="margin: 0;">Near KK Farm House Bishanpur Road, Harthala, Lodhipur, Moradabad, UP 244001</p>
      <p style="margin: 6px 0 0;"><a href="${siteUrl}" style="color: #D6A36F; text-decoration: none;">Visit Website</a></p>
    </div>
  </div>
</body>
</html>
  `;
}

export function buildAdminNotificationHtml({
  customerName,
  phone,
  email,
  city,
  referenceNumber,
  categoryName,
  message,
  dimensions,
  material,
  source,
  hasAttachment,
  submittedAt,
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
  source: string;
  hasAttachment?: boolean;
  submittedAt: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Lead [${escapeHtml(referenceNumber)}] — ${escapeHtml(customerName)}</title>
</head>
<body style="background-color: #080808; color: #F5F5F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 30px 15px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #121212; border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; padding: 28px;">
    <span style="background-color: #D6A36F; color: #000; font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.12em;">New Lead Alert</span>
    <h2 style="font-size: 20px; color: #FFF; margin: 16px 0 4px;">${escapeHtml(customerName)}</h2>
    <p style="color: #D6A36F; font-size: 14px; margin: 0 0 20px;">Ref: ${escapeHtml(referenceNumber)} · Category: ${escapeHtml(categoryName)}</p>

    <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #CCC; margin-bottom: 20px;">
      <tr><td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.06); width: 140px; color: #888;">Phone:</td><td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #FFF;"><strong>${escapeHtml(phone)}</strong></td></tr>
      <tr><td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #888;">City / Location:</td><td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">${escapeHtml(city || "Not specified")}</td></tr>
      <tr><td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #888;">Email:</td><td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">${escapeHtml(email || "Not provided")}</td></tr>
      <tr><td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #888;">Dimensions:</td><td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">${escapeHtml(dimensions || "Not specified")}</td></tr>
      <tr><td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #888;">Material:</td><td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">${escapeHtml(material || "Not specified")}</td></tr>
      <tr><td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #888;">Source:</td><td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">${escapeHtml(source)}</td></tr>
      ${hasAttachment ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #888;">Reference Photo:</td><td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #D6A36F;">Attached in Admin Leads Workspace</td></tr>` : ""}
      <tr><td style="padding: 8px 0; color: #888;">Time:</td><td style="padding: 8px 0;">${escapeHtml(submittedAt)}</td></tr>
    </table>

    <div style="background-color: #080808; border: 1px solid rgba(255,255,255,0.08); padding: 16px; border-radius: 6px; margin-top: 15px;">
      <span style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 8px;">Project Requirements:</span>
      <p style="font-size: 13px; line-height: 1.6; color: #EEE; margin: 0; white-space: pre-wrap;">${escapeHtml(message)}</p>
    </div>
  </div>
</body>
</html>
  `;
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
