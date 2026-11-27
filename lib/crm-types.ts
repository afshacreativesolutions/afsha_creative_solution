export type LifecycleStage = 'lead' | 'prospect' | 'customer' | 'repeat_customer' | 'lost';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'quote_sent' | 'negotiation' | 'won' | 'lost' | 'spam';

export type LeadPriority = 'low' | 'medium' | 'high' | 'urgent';

export type LeadSource = 'quote_form' | 'contact_page' | 'whatsapp_click' | 'phone_call' | 'direct_visit' | 'referral' | 'other';

export type CustomerRecord = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  company_name: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  lifecycle_stage: LifecycleStage;
  total_quotes_requested: number;
  total_orders_completed: number;
  total_revenue: number;
  currency: string;
  tags: string[];
  notes: string | null;
  metadata: Record<string, unknown>;
  first_touch_source: string | null;
  last_touch_source: string | null;
  created_at: string;
  updated_at: string;
};

export type LeadRecord = {
  id: string;
  reference_number: string;
  customer_id: string;
  visitor_id: string | null;
  session_id: string | null;
  title: string;
  category_slug: string | null;
  product_id: string | null;
  status: LeadStatus;
  priority: LeadPriority;
  source: LeadSource;
  estimated_value: number | null;
  dimensions: string | null;
  material_preference: string | null;
  message: string;
  internal_notes: string | null;
  assigned_to: string | null;
  lost_reason: string | null;
  follow_up_date: string | null;
  city?: string | null;
  product_slug?: string | null;
  page_url?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  attachment_path?: string | null;
  attachment_name?: string | null;
  attachmentSignedUrl?: string | null;
  attribution: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  customer?: CustomerRecord;
};

export type VisitorRecord = {
  visitor_id: string;
  fingerprint: string | null;
  first_seen_at: string;
  last_seen_at: string;
  initial_referrer: string | null;
  initial_utm_source: string | null;
  initial_utm_medium: string | null;
  initial_utm_campaign: string | null;
  initial_utm_term: string | null;
  initial_utm_content: string | null;
  device_category: string | null;
  browser: string | null;
  os: string | null;
  country: string | null;
  city: string | null;
  ip_hash: string | null;
  customer_id: string | null;
  created_at: string;
  updated_at: string;
};

export type VisitorSessionRecord = {
  session_id: string;
  visitor_id: string;
  started_at: string;
  last_activity_at: string;
  ended_at: string | null;
  landing_page: string | null;
  exit_page: string | null;
  page_views_count: number;
  events_count: number;
  duration_seconds: number;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  is_bounce: boolean;
  created_at: string;
};

export type VisitorEventRecord = {
  id: string;
  visitor_id: string;
  session_id: string | null;
  event_name: string;
  page_url: string;
  page_title: string | null;
  properties: Record<string, unknown>;
  created_at: string;
};

export type ConsentRecord = {
  id: string;
  visitor_id: string;
  consent_id: string;
  essential: boolean;
  analytics: boolean;
  advertising: boolean;
  personalization: boolean;
  ip_hash: string | null;
  user_agent: string | null;
  action: 'accept_all' | 'reject_optional' | 'custom_save' | 'revoke';
  created_at: string;
};

export type MarketingSubscriptionRecord = {
  id: string;
  customer_id: string | null;
  channel: 'email' | 'whatsapp' | 'sms';
  destination: string;
  status: 'subscribed' | 'unsubscribed' | 'bounced' | 'complained';
  opt_in_source: string;
  opt_in_ip_hash: string | null;
  opt_in_timestamp: string;
  opt_out_timestamp: string | null;
  opt_out_reason: string | null;
  created_at: string;
  updated_at: string;
};

export type MarketingCampaignRecord = {
  id: string;
  name: string;
  channel: 'email' | 'whatsapp';
  status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'cancelled';
  subject_or_template_name: string;
  content: string;
  target_audience: Record<string, unknown>;
  total_recipients: number;
  sent_count: number;
  delivered_count: number;
  opened_count: number;
  clicked_count: number;
  failed_count: number;
  scheduled_at: string | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
};

export type MessageLogRecord = {
  id: string;
  campaign_id: string | null;
  lead_id: string | null;
  customer_id: string | null;
  channel: 'email' | 'whatsapp';
  provider: 'resend' | 'meta_whatsapp';
  provider_message_id: string | null;
  recipient: string;
  direction: 'outbound' | 'inbound';
  message_type: 'transactional' | 'marketing' | 'notification';
  template_name: string | null;
  status: 'queued' | 'sent' | 'delivered' | 'opened' | 'read' | 'clicked' | 'failed' | 'bounced';
  error_message: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type AuditLogRecord = {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_hash: string | null;
  created_at: string;
};
