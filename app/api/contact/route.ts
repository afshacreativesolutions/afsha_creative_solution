import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { getPublicCategories } from "@/lib/catalog";
import {
  ALLOWED_IMAGE_TYPES,
  sanitizeUploadBaseName,
  verifyImageMagicBytes,
} from "@/lib/image-security";
import {
  cleanLeadText,
  MAX_LEAD_PHOTO_BYTES,
  validateLeadFields,
} from "@/lib/lead-validation";
import { getPublicSiteOrigin } from "@/lib/site-url";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import {
  buildAdminNotificationHtml,
  buildCustomerConfirmationHtml,
  sendEmail,
} from "@/lib/email";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

const SAFE_LEGACY_SOURCES = new Set([
  "quote_form",
  "contact_page",
  "whatsapp_click",
  "phone_call",
  "direct_visit",
  "referral",
  "other",
]);

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ENQUIRIES_PER_WINDOW = 5;

const ipRateWindow = new Map<string, number[]>();

const recentSubmissions = new Map<
  string,
  { response: { success: true; reference: string; whatsappUrl: string }; expiresAt: number }
>();

function hashIp(ip: string): string {
  const salt = process.env.COOKIE_SECRET || "afsha-salt-2026";
  return crypto.createHash("sha256").update(`${ip}-${salt}`).digest("hex").slice(0, 32);
}

function isMemoryRateLimited(ipHash: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const recent = (ipRateWindow.get(ipHash) || []).filter((ts) => ts > windowStart);
  if (recent.length >= MAX_ENQUIRIES_PER_WINDOW) {
    ipRateWindow.set(ipHash, recent);
    return true;
  }
  recent.push(now);
  ipRateWindow.set(ipHash, recent);
  return false;
}

function isMissingColumnError(error: { code?: string; message?: string } | null | undefined): boolean {
  if (!error) return false;
  return error.code === "PGRST204" || error.code === "42703";
}

export async function POST(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
  const ipHash = hashIp(ip);

  let rawFields: Record<string, unknown> = {};
  let uploadedPhoto: File | null = null;

  const contentType = request.headers.get("content-type") || "";
  try {
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      for (const [key, val] of formData.entries()) {
        if (val instanceof File) {
          if (key === "photo" && val.size > 0) {
            uploadedPhoto = val;
          }
        } else {
          rawFields[key] = val;
        }
      }
    } else {
      rawFields = (await request.json()) as Record<string, unknown>;
    }
  } catch {
    return NextResponse.json(
      { error: "We could not read your enquiry details. Please check your inputs and try again." },
      { status: 400 }
    );
  }

  // Honeypot spam protection
  if (cleanLeadText(rawFields.website, 200)) {
    return NextResponse.json({ success: true, reference: "AF-RECEIVED" });
  }

  const validation = validateLeadFields(rawFields, false);
  if (!validation.valid) {
    const firstError = Object.values(validation.errors)[0] || "Please check required fields.";
    return NextResponse.json(
      { error: firstError, fieldErrors: validation.errors },
      { status: 400 }
    );
  }

  const data = validation.data;

  // Idempotent duplicate-submission guard (safe against rapid double-taps or network retries)
  if (data.clientSubmissionId) {
    const nowMs = Date.now();
    for (const [key, entry] of recentSubmissions.entries()) {
      if (entry.expiresAt <= nowMs) recentSubmissions.delete(key);
    }
    const existingEntry = recentSubmissions.get(data.clientSubmissionId);
    if (existingEntry && existingEntry.expiresAt > nowMs) {
      return NextResponse.json(existingEntry.response);
    }
  }

  // Fast memory rate limit check before any expensive storage/DB operations
  if (isMemoryRateLimited(ipHash)) {
    return NextResponse.json(
      { error: "Too many enquiries sent recently. Please wait a few minutes or call/WhatsApp us directly." },
      { status: 429, headers: { "Retry-After": "600" } }
    );
  }

  // Validate optional reference photo bytes before database writes
  let validatedPhotoBytes: Uint8Array | null = null;
  let validatedPhotoExt = "";
  let validatedPhotoName = "";
  let validatedPhotoMime = "";

  if (uploadedPhoto) {
    const ext = ALLOWED_IMAGE_TYPES.get(uploadedPhoto.type);
    if (!ext) {
      return NextResponse.json(
        {
          error: "Reference photo must be JPEG, PNG, WebP, or AVIF format.",
          fieldErrors: { photo: "Unsupported image format. Please use JPG, PNG, WebP, or AVIF." },
        },
        { status: 400 }
      );
    }
    if (uploadedPhoto.size > MAX_LEAD_PHOTO_BYTES) {
      return NextResponse.json(
        {
          error: "Reference photo must be 5 MB or smaller.",
          fieldErrors: { photo: "Please choose an image smaller than 5 MB." },
        },
        { status: 413 }
      );
    }

    const bytes = new Uint8Array(await uploadedPhoto.arrayBuffer());
    if (!verifyImageMagicBytes(bytes, uploadedPhoto.type)) {
      return NextResponse.json(
        {
          error: "The uploaded file did not match a valid image file.",
          fieldErrors: { photo: "Invalid image file header. Please select a valid photo." },
        },
        { status: 400 }
      );
    }

    validatedPhotoBytes = bytes;
    validatedPhotoExt = ext;
    validatedPhotoMime = uploadedPhoto.type;
    validatedPhotoName = cleanLeadText(uploadedPhoto.name, 140) || `reference.${ext}`;
  }

  const supabase = createSupabaseServiceClient();

  // Persistent rate check via audit_logs for serverless multi-instance accuracy
  if (supabase) {
    try {
      const cutoffIso = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
      const { count } = await supabase
        .from("audit_logs")
        .select("id", { count: "exact", head: true })
        .eq("action", "lead_created")
        .eq("ip_hash", ipHash)
        .gte("created_at", cutoffIso);

      if ((count ?? 0) >= MAX_ENQUIRIES_PER_WINDOW) {
        return NextResponse.json(
          { error: "Too many enquiries submitted from this connection. Please wait 10 minutes or call/WhatsApp us." },
          { status: 429, headers: { "Retry-After": "600" } }
        );
      }
    } catch {
      // Non-fatal check
    }
  }

  const categories = await getPublicCategories().catch(() => []);
  const categoryName =
    data.category === "other"
      ? "Other Architectural Metalwork"
      : categories.find((item) => item.slug === data.category)?.name ?? data.category;

  const enquiryReference = `AF-${Date.now().toString(36).toUpperCase()}-${crypto
    .randomUUID()
    .slice(0, 4)
    .toUpperCase()}`;

  const siteUrl = (await getPublicSiteOrigin()) || "https://www.afshacreative.in";
  const whatsappUrl = new URL("https://wa.me/919634776691");
  whatsappUrl.searchParams.set(
    "text",
    `Hello Afsha Creative Solution, I just submitted enquiry ${enquiryReference} for ${
      data.productName || categoryName
    } from ${data.city || "India"} and would like to discuss my project.`
  );

  const submittedAt = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date());

  let customerId: string | undefined;
  let leadId: string | undefined;
  let attachmentPath: string | null = null;

  if (supabase) {
    if (validatedPhotoBytes) {
      const cleanName = sanitizeUploadBaseName(validatedPhotoName);
      const storageKey = `${enquiryReference.toLowerCase()}/${cleanName}-${crypto
        .randomUUID()
        .slice(0, 6)}.${validatedPhotoExt}`;

      const { error: uploadErr } = await supabase.storage
        .from("lead-attachments")
        .upload(storageKey, validatedPhotoBytes, {
          contentType: validatedPhotoMime,
          upsert: false,
        });

      if (uploadErr) {
        console.warn("Lead attachment upload skipped:", uploadErr.message);
      } else {
        attachmentPath = storageKey;
      }
    }

    try {
      const { data: existingCustomer } = await supabase
        .from("customers")
        .select("id, total_quotes_requested, email, city")
        .eq("phone", data.phone)
        .maybeSingle();

      if (existingCustomer) {
        customerId = existingCustomer.id;
        await supabase
          .from("customers")
          .update({
            name: data.name,
            email: data.email || existingCustomer.email,
            city: data.city || existingCustomer.city,
            total_quotes_requested: (existingCustomer.total_quotes_requested || 1) + 1,
            last_touch_source: data.source,
          })
          .eq("id", customerId as string);
      } else {
        const { data: newCustomer, error: custErr } = await supabase
          .from("customers")
          .insert({
            name: data.name,
            phone: data.phone,
            email: data.email || null,
            city: data.city || "Moradabad",
            lifecycle_stage: "lead",
            total_quotes_requested: 1,
            first_touch_source: data.source,
            last_touch_source: data.source,
          })
          .select("id")
          .single();

        if (!custErr && newCustomer) {
          customerId = newCustomer.id;
        }
      }

      if (data.visitorId && customerId) {
        await supabase
          .from("visitors")
          .update({ customer_id: customerId })
          .eq("visitor_id", data.visitorId);
      }

      if (customerId) {
        const safeDbSource = SAFE_LEGACY_SOURCES.has(data.source) ? data.source : "quote_form";
        const displayTitle = data.productName
          ? `Quote Request: ${data.productName}${data.designCode ? ` (${data.designCode})` : ""}`
          : `Quote Request: ${categoryName}`;
        const leadMessage =
          data.message ||
          `Enquiry submitted via ${data.placement} for ${data.productName || categoryName} (${
            data.city || "Moradabad"
          }).`;

        const attribution = {
          ip_hash: ipHash,
          submitted_at: submittedAt,
          city: data.city,
          placement: data.placement,
          page_url: data.pageUrl || undefined,
          product_slug: data.productSlug || undefined,
          product_name: data.productName || undefined,
          design_code: data.designCode || undefined,
          utm_source: data.utmSource || undefined,
          utm_medium: data.utmMedium || undefined,
          utm_campaign: data.utmCampaign || undefined,
          attachment_path: attachmentPath || undefined,
          attachment_name: attachmentPath ? validatedPhotoName : undefined,
        };

        const baseLeadPayload = {
          reference_number: enquiryReference,
          customer_id: customerId,
          visitor_id: data.visitorId,
          session_id: data.sessionId,
          title: displayTitle,
          category_slug: data.category,
          product_id: data.productId || null,
          status: "new",
          priority: "medium",
          source: safeDbSource,
          dimensions: data.dimensions || null,
          material_preference: data.material || null,
          message: leadMessage,
          attribution,
        };

        let leadInsertRes = await supabase
          .from("leads")
          .insert({
            ...baseLeadPayload,
            city: data.city || null,
            product_slug: data.productSlug || null,
            page_url: data.pageUrl || null,
            utm_source: data.utmSource || null,
            utm_medium: data.utmMedium || null,
            utm_campaign: data.utmCampaign || null,
            attachment_path: attachmentPath,
            attachment_name: attachmentPath ? validatedPhotoName : null,
          })
          .select("id")
          .single();

        if (leadInsertRes.error && isMissingColumnError(leadInsertRes.error)) {
          leadInsertRes = await supabase
            .from("leads")
            .insert(baseLeadPayload)
            .select("id")
            .single();
        }

        if (leadInsertRes.error) {
          console.error("Failed inserting lead:", leadInsertRes.error.message);
        } else if (leadInsertRes.data) {
          leadId = leadInsertRes.data.id;
        }

        if (data.marketingEmail && data.email) {
          await supabase.from("marketing_subscriptions").upsert(
            {
              customer_id: customerId,
              channel: "email",
              destination: data.email,
              status: "subscribed",
              opt_in_source: safeDbSource,
              opt_in_ip_hash: ipHash,
            },
            { onConflict: "channel,destination" }
          );
        }

        if (data.marketingWhatsApp && data.phone) {
          await supabase.from("marketing_subscriptions").upsert(
            {
              customer_id: customerId,
              channel: "whatsapp",
              destination: data.phone,
              status: "subscribed",
              opt_in_source: safeDbSource,
              opt_in_ip_hash: ipHash,
            },
            { onConflict: "channel,destination" }
          );
        }

        await supabase.from("audit_logs").insert({
          action: "lead_created",
          entity_type: "leads",
          entity_id: leadId || enquiryReference,
          new_values: {
            reference_number: enquiryReference,
            customer_name: data.name,
            city: data.city,
            category: categoryName,
            placement: data.placement,
          },
          ip_hash: ipHash,
        });
      }
    } catch (dbErr) {
      console.error("Database CRM ingestion error:", dbErr);
    }
  }

  const adminEmailTo = process.env.CONTACT_TO_EMAIL || "afshacreativesolutions@gmail.com";
  const effectiveMessage =
    data.message || `Customer requested a quote from ${data.placement} in ${data.city}.`;

  const adminHtml = buildAdminNotificationHtml({
    customerName: data.name,
    phone: data.phone,
    email: data.email || undefined,
    city: data.city || undefined,
    referenceNumber: enquiryReference,
    categoryName: data.productName ? `${data.productName} (${categoryName})` : categoryName,
    message: effectiveMessage,
    dimensions: data.dimensions || undefined,
    material: data.material || undefined,
    source: `${data.source}${data.pageUrl ? ` (${data.pageUrl})` : ""}`,
    hasAttachment: Boolean(attachmentPath),
    submittedAt,
  });

  const adminEmailPromise = sendEmail({
    to: adminEmailTo,
    replyTo: data.email || undefined,
    subject: `[New Lead ${enquiryReference}] ${data.name} (${data.city || "India"}) — ${data.productName || categoryName}`,
    html: adminHtml,
    leadId,
    customerId,
    messageType: "notification",
  });

  let customerEmailPromise: Promise<unknown> = Promise.resolve();
  if (data.email) {
    const customerHtml = buildCustomerConfirmationHtml({
      customerName: data.name,
      referenceNumber: enquiryReference,
      categoryName: data.productName || categoryName,
      siteUrl,
      whatsappUrl: whatsappUrl.toString(),
    });

    customerEmailPromise = sendEmail({
      to: data.email,
      subject: `Your Metalwork Enquiry [${enquiryReference}] — Afsha Creative Solution`,
      html: customerHtml,
      leadId,
      customerId,
      messageType: "transactional",
    });
  }

  const whatsAppInternalAlert = process.env.INTERNAL_NOTIFICATION_PHONE
    ? sendWhatsAppMessage({
        toPhone: process.env.INTERNAL_NOTIFICATION_PHONE,
        textMessage: `New Metalwork Lead\nRef: ${enquiryReference}\nName: ${data.name}\nPhone: ${data.phone}\nCity: ${data.city || "Moradabad"}\nCategory: ${data.productName || categoryName}\nMessage: ${effectiveMessage.slice(0, 200)}`,
        leadId,
        customerId,
        messageType: "notification",
      })
    : Promise.resolve();

  await Promise.allSettled([adminEmailPromise, customerEmailPromise, whatsAppInternalAlert]);

  const responsePayload = {
    success: true as const,
    reference: enquiryReference,
    whatsappUrl: whatsappUrl.toString(),
  };

  if (data.clientSubmissionId) {
    recentSubmissions.set(data.clientSubmissionId, {
      response: responsePayload,
      expiresAt: Date.now() + 30_000,
    });
  }

  return NextResponse.json(responsePayload);
}
