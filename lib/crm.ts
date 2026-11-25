import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import {
  CustomerRecord,
  LeadRecord,
  ConsentRecord,
  MarketingCampaignRecord,
  MessageLogRecord,
  VisitorRecord,
  LeadStatus,
} from "./crm-types";

/**
 * Returns summary statistics for the Admin Overview dashboard.
 */
export async function getAdminOverviewStats() {
  const supabase = (await createSupabaseServerClient()) || createSupabaseServiceClient();
  if (!supabase) {
    return {
      totalLeads: 0,
      newLeadsThisWeek: 0,
      totalCustomers: 0,
      totalVisitors: 0,
      recentLeads: [],
      leadsByStatus: {} as Record<string, number>,
      error: "Supabase client unavailable",
    };
  }

  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [
      leadsRes,
      customersRes,
      visitorsRes,
      recentLeadsRes,
    ] = await Promise.all([
      supabase.from("leads").select("id, status, created_at"),
      supabase.from("customers").select("id", { count: "exact", head: true }),
      supabase.from("visitors").select("visitor_id", { count: "exact", head: true }),
      supabase
        .from("leads")
        .select(`
          id,
          reference_number,
          title,
          category_slug,
          status,
          priority,
          source,
          created_at,
          customer_id,
          customer:customers (
            name,
            phone,
            email,
            city
          )
        `)
        .order("created_at", { ascending: false })
        .limit(6),
    ]);

    const leads = leadsRes.data || [];
    const totalLeads = leads.length;
    const newLeadsThisWeek = leads.filter(
      (l: { created_at: string }) => new Date(l.created_at) >= oneWeekAgo
    ).length;

    const leadsByStatus: Record<string, number> = {
      new: 0,
      contacted: 0,
      qualified: 0,
      quote_sent: 0,
      negotiation: 0,
      won: 0,
      lost: 0,
    };

    leads.forEach((l: { status: string }) => {
      if (l.status in leadsByStatus) {
        leadsByStatus[l.status]++;
      }
    });

    return {
      totalLeads,
      newLeadsThisWeek,
      totalCustomers: customersRes.count || 0,
      totalVisitors: visitorsRes.count || 0,
      recentLeads: (recentLeadsRes.data || []) as unknown as LeadRecord[],
      leadsByStatus,
      error: null,
    };
  } catch (err) {
    console.warn("getAdminOverviewStats exception:", err);
    return {
      totalLeads: 0,
      newLeadsThisWeek: 0,
      totalCustomers: 0,
      totalVisitors: 0,
      recentLeads: [],
      leadsByStatus: {},
      error: "Could not fetch CRM stats. Please ensure database migrations are applied.",
    };
  }
}

/**
 * Returns list of leads with optional filtering.
 */
export async function getAdminLeads(options?: {
  status?: string;
  search?: string;
}) {
  const supabase = (await createSupabaseServerClient()) || createSupabaseServiceClient();
  if (!supabase) return [];

  try {
    let query = supabase
      .from("leads")
      .select(`
        id,
        reference_number,
        title,
        category_slug,
        status,
        priority,
        source,
        estimated_value,
        dimensions,
        material_preference,
        message,
        internal_notes,
        follow_up_date,
        created_at,
        customer_id,
        customer:customers (
          id,
          name,
          phone,
          email,
          city,
          state
        )
      `)
      .order("created_at", { ascending: false });

    if (options?.status && options.status !== "all") {
      query = query.eq("status", options.status);
    }

    const { data, error } = await query;
    if (error) {
      console.warn("getAdminLeads error:", error.message);
      return [];
    }

    let results = (data || []) as unknown as LeadRecord[];

    if (options?.search) {
      const q = options.search.toLowerCase();
      results = results.filter((lead) => {
        const name = lead.customer?.name?.toLowerCase() || "";
        const phone = lead.customer?.phone || "";
        const ref = lead.reference_number.toLowerCase();
        return name.includes(q) || phone.includes(q) || ref.includes(q);
      });
    }

    return results;
  } catch (err) {
    console.warn("getAdminLeads exception:", err);
    return [];
  }
}

/**
 * Returns single lead detail by ID.
 */
export async function getAdminLeadById(id: string): Promise<LeadRecord | null> {
  const supabase = (await createSupabaseServerClient()) || createSupabaseServiceClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("leads")
      .select(`
        *,
        customer:customers (*)
      `)
      .eq("id", id)
      .maybeSingle();

    if (error || !data) return null;
    return data as unknown as LeadRecord;
  } catch (err) {
    console.warn("getAdminLeadById exception:", err);
    return null;
  }
}

/**
 * Returns customers list.
 */
export async function getAdminCustomers(search?: string): Promise<CustomerRecord[]> {
  const supabase = (await createSupabaseServerClient()) || createSupabaseServiceClient();
  if (!supabase) return [];

  try {
    let query = supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (search) {
      query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) {
      console.warn("getAdminCustomers error:", error.message);
      return [];
    }
    return (data || []) as CustomerRecord[];
  } catch (err) {
    console.warn("getAdminCustomers exception:", err);
    return [];
  }
}

/**
 * Returns single customer with their leads and subscriptions.
 */
export async function getAdminCustomerById(id: string) {
  const supabase = (await createSupabaseServerClient()) || createSupabaseServiceClient();
  if (!supabase) return null;

  try {
    const [custRes, leadsRes, subsRes] = await Promise.all([
      supabase.from("customers").select("*").eq("id", id).maybeSingle(),
      supabase.from("leads").select("*").eq("customer_id", id).order("created_at", { ascending: false }),
      supabase.from("marketing_subscriptions").select("*").eq("customer_id", id),
    ]);

    if (!custRes.data) return null;

    return {
      customer: custRes.data as CustomerRecord,
      leads: (leadsRes.data || []) as LeadRecord[],
      subscriptions: subsRes.data || [],
    };
  } catch (err) {
    console.warn("getAdminCustomerById exception:", err);
    return null;
  }
}

/**
 * Returns analytics intelligence data.
 */
export async function getAdminAnalyticsData() {
  const supabase = (await createSupabaseServerClient()) || createSupabaseServiceClient();
  if (!supabase) {
    return {
      visitorsCount: 0,
      sessionsCount: 0,
      eventsCount: 0,
      topPages: [],
      deviceBreakdown: {},
      sourcesBreakdown: {},
      recentEvents: [],
    };
  }

  try {
    const [
      visitorsRes,
      sessionsRes,
      eventsRes,
      recentEventsRes,
    ] = await Promise.all([
      supabase.from("visitors").select("visitor_id, device_category, initial_utm_source, initial_referrer").limit(1000),
      supabase.from("visitor_sessions").select("session_id, landing_page, is_bounce").limit(1000),
      supabase.from("visitor_events").select("event_name, page_url").limit(1000),
      supabase.from("visitor_events").select("*").order("created_at", { ascending: false }).limit(25),
    ]);

    const visitors = visitorsRes.data || [];
    const sessions = sessionsRes.data || [];
    const events = eventsRes.data || [];

    // Device breakdown
    const deviceBreakdown: Record<string, number> = { mobile: 0, desktop: 0, tablet: 0 };
    visitors.forEach((v: { device_category?: string | null }) => {
      const dev = v.device_category || "desktop";
      deviceBreakdown[dev] = (deviceBreakdown[dev] || 0) + 1;
    });

    // Top traffic sources
    const sourcesBreakdown: Record<string, number> = {};
    visitors.forEach((v: { initial_utm_source?: string | null; initial_referrer?: string | null }) => {
      const src = v.initial_utm_source || (v.initial_referrer ? "Referral" : "Direct");
      sourcesBreakdown[src] = (sourcesBreakdown[src] || 0) + 1;
    });

    // Top pages visited
    const pageCounts: Record<string, number> = {};
    events.forEach((e: { page_url?: string | null }) => {
      if (e.page_url) {
        try {
          const path = new URL(e.page_url).pathname;
          pageCounts[path] = (pageCounts[path] || 0) + 1;
        } catch {
          pageCounts[e.page_url] = (pageCounts[e.page_url] || 0) + 1;
        }
      }
    });

    const topPages = Object.entries(pageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([path, count]) => ({ path, count }));

    return {
      visitorsCount: visitors.length,
      sessionsCount: sessions.length,
      eventsCount: events.length,
      topPages,
      deviceBreakdown,
      sourcesBreakdown,
      recentEvents: recentEventsRes.data || [],
    };
  } catch (err) {
    console.warn("getAdminAnalyticsData exception:", err);
    return {
      visitorsCount: 0,
      sessionsCount: 0,
      eventsCount: 0,
      topPages: [],
      deviceBreakdown: {},
      sourcesBreakdown: {},
      recentEvents: [],
    };
  }
}

/**
 * Returns cookie consent records.
 */
export async function getAdminConsentRecords(limit: number = 50): Promise<ConsentRecord[]> {
  const supabase = (await createSupabaseServerClient()) || createSupabaseServiceClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("consent_records")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) return [];
    return (data || []) as ConsentRecord[];
  } catch {
    return [];
  }
}

/**
 * Returns message delivery logs.
 */
export async function getAdminMessageLogs(limit: number = 50): Promise<MessageLogRecord[]> {
  const supabase = (await createSupabaseServerClient()) || createSupabaseServiceClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("message_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) return [];
    return (data || []) as MessageLogRecord[];
  } catch {
    return [];
  }
}

/**
 * Returns marketing campaigns.
 */
export async function getAdminCampaigns(): Promise<MarketingCampaignRecord[]> {
  const supabase = (await createSupabaseServerClient()) || createSupabaseServiceClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("marketing_campaigns")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return [];
    return (data || []) as MarketingCampaignRecord[];
  } catch {
    return [];
  }
}

/**
 * Evaluates configuration and connection status of all external services.
 */
export async function getAdminIntegrationsStatus() {
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const serviceRoleConfigured = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const resendConfigured = Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL);
  const whatsAppConfigured = Boolean(
    process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_ACCESS_TOKEN
  );
  const ga4Configured = Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1790160535434214";
  const metaPixelConfigured = Boolean(pixelId);
  const gtmConfigured = Boolean(process.env.NEXT_PUBLIC_GTM_ID);
  const googleAdsConfigured = Boolean(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID);

  return {
    supabase: {
      name: "Supabase PostgreSQL & Auth",
      configured: supabaseConfigured && serviceRoleConfigured,
      details: supabaseConfigured
        ? serviceRoleConfigured
          ? "Connected (Anon & Service Role Keys Active)"
          : "Anon key active, Service Role Key missing"
        : "Missing credentials",
    },
    resend: {
      name: "Resend Transactional Email",
      configured: resendConfigured,
      details: resendConfigured
        ? `Configured (Sender: ${process.env.CONTACT_FROM_EMAIL})`
        : "RESEND_API_KEY or CONTACT_FROM_EMAIL not set",
    },
    whatsapp: {
      name: "Meta WhatsApp Cloud API (v21.0)",
      configured: whatsAppConfigured,
      details: whatsAppConfigured
        ? `Configured (Phone ID: ${process.env.WHATSAPP_PHONE_NUMBER_ID})`
        : "WHATSAPP_PHONE_NUMBER_ID or WHATSAPP_ACCESS_TOKEN not set",
    },
    googleAnalytics: {
      name: "Google Analytics 4 & Consent Mode v2",
      configured: ga4Configured,
      details: ga4Configured
        ? `Active (${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}) with Consent Mode v2`
        : "NEXT_PUBLIC_GA_MEASUREMENT_ID not set",
    },
    metaPixel: {
      name: "Meta Pixel & Conversion API",
      configured: metaPixelConfigured,
      details: metaPixelConfigured
        ? `Active (${pixelId})`
        : "NEXT_PUBLIC_META_PIXEL_ID not set",
    },
    gtm: {
      name: "Google Tag Manager",
      configured: gtmConfigured,
      details: gtmConfigured ? `Active (${process.env.NEXT_PUBLIC_GTM_ID})` : "Optional",
    },
    googleAds: {
      name: "Google Ads Tag",
      configured: googleAdsConfigured,
      details: googleAdsConfigured ? `Active (${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID})` : "Optional",
    },
  };
}
