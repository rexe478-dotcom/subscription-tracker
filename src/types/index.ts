export type BillingInterval =
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'quarterly'
  | 'semiannual'
  | 'yearly'
  | 'custom';

export type SubscriptionStatus =
  | 'active'
  | 'free_trial'
  | 'cancellation_pending'
  | 'cancelled'
  | 'expired'
  | 'paused';

export interface Profile {
  id: string;
  display_name: string | null;
  default_currency: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface Provider {
  id: string;
  name: string;
  slug: string;
  aliases: string[] | null;
  category: string | null;
  website_url: string | null;
  logo_asset_url: string | null;
  cancellation_url: string | null;
  metadata_source: string | null;
  last_verified_at: string | null;
  is_active: boolean;
}

export interface Subscription {
  id: string;
  user_id: string;
  provider_id: string | null;
  custom_provider_name: string | null;
  display_name: string | null;
  category: string | null;
  amount: number;
  currency: string;
  billing_interval: BillingInterval;
  interval_count: number;
  start_date: string | null; // ISO YYYY-MM-DD
  next_renewal_at: string; // ISO timestamptz
  trial_start_at: string | null; // ISO timestamptz
  trial_end_at: string | null; // ISO timestamptz
  end_date: string | null; // ISO YYYY-MM-DD
  status: SubscriptionStatus;
  cancellation_url: string | null;
  notes: string | null;
  reminder_enabled: boolean;
  reminder_lead_hours: number;
  created_at: string;
  updated_at: string;
  // Joined provider relation if loaded
  provider?: Provider | null;
}

export type NotificationEventType = 'renewal' | 'trial_end';
export type NotificationChannel = 'push' | 'email';
export type NotificationJobStatus = 'pending' | 'processing' | 'sent' | 'failed' | 'cancelled';

export interface NotificationJob {
  id: string;
  user_id: string;
  subscription_id: string;
  event_type: NotificationEventType;
  channel: NotificationChannel;
  scheduled_for: string;
  idempotency_key: string;
  status: NotificationJobStatus;
  attempt_count: number;
  last_error_code: string | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CurrencyTotal {
  currency: string;
  activeCount: number;
  totalMonthlyEstimate: number;
  totalAnnualProjection: number;
  subscriptions: Subscription[];
}
