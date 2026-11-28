import { createSupabaseServiceClient } from "./supabase/service";

export type SendWhatsAppMessageParams = {
  toPhone: string; // e.g. "919634776691"
  templateName?: string;
  templateLanguage?: string;
  templateComponents?: unknown[];
  textMessage?: string;
  leadId?: string;
  customerId?: string;
  messageType?: "transactional" | "marketing" | "notification";
};

/**
 * Sends a message via Meta WhatsApp Business Cloud API (Graph API v21.0).
 * Handles phone normalization (strips +, spaces, dashes), logs status in public.message_logs.
 */
export async function sendWhatsAppMessage({
  toPhone,
  templateName,
  templateLanguage = "en",
  templateComponents,
  textMessage,
  leadId,
  customerId,
  messageType = "transactional",
}: SendWhatsAppMessageParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  // Clean phone number: remove non-digits
  const cleanPhone = toPhone.replace(/\D/g, "");
  // Prepend India country code 91 if 10 digits
  const normalizedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  if (!phoneNumberId || !accessToken) {
    console.warn("sendWhatsAppMessage: WHATSAPP_PHONE_NUMBER_ID or WHATSAPP_ACCESS_TOKEN is missing.");
    return { success: false, error: "WhatsApp Cloud API credentials not configured." };
  }

  const endpoint = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;

  const payload: Record<string, unknown> = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: normalizedPhone,
  };

  if (templateName) {
    payload.type = "template";
    payload.template = {
      name: templateName,
      language: { code: templateLanguage },
      components: templateComponents || [],
    };
  } else if (textMessage) {
    payload.type = "text";
    payload.text = { preview_url: false, body: textMessage };
  } else {
    return { success: false, error: "Either templateName or textMessage must be supplied." };
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      const errorMsg = data?.error?.message || "Failed to deliver WhatsApp message";
      await logWhatsAppMessage({
        leadId,
        customerId,
        recipient: normalizedPhone,
        templateName,
        messageType,
        status: "failed",
        errorMessage: errorMsg,
      });
      return { success: false, error: errorMsg };
    }

    const messageId = data?.messages?.[0]?.id;
    await logWhatsAppMessage({
      leadId,
      customerId,
      recipient: normalizedPhone,
      templateName,
      messageType,
      status: "sent",
      providerMessageId: messageId,
    });

    return { success: true, messageId };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "WhatsApp delivery exception";
    console.error("sendWhatsAppMessage exception:", err);
    await logWhatsAppMessage({
      leadId,
      customerId,
      recipient: normalizedPhone,
      templateName,
      messageType,
      status: "failed",
      errorMessage: errorMsg,
    });
    return { success: false, error: errorMsg };
  }
}

async function logWhatsAppMessage(params: {
  leadId?: string;
  customerId?: string;
  recipient: string;
  templateName?: string;
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
      channel: "whatsapp",
      provider: "meta_whatsapp",
      recipient: params.recipient,
      direction: "outbound",
      message_type: params.messageType,
      template_name: params.templateName || null,
      status: params.status,
      provider_message_id: params.providerMessageId || null,
      error_message: params.errorMessage || null,
    });
  } catch (err) {
    console.warn("Failed to insert message_log for WhatsApp:", err);
  }
}
