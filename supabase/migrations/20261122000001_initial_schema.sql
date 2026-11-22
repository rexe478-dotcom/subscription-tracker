-- ==============================================================================
-- Migration: 20261122000001_initial_schema.sql
-- Description: Core tables, constraints, foreign keys and indexes for Subscription Tracker
-- ==============================================================================

-- 1. PROFILES TABLE (User account settings and preferences)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NULL,
    default_currency CHAR(3) NOT NULL DEFAULT 'USD',
    timezone TEXT NOT NULL DEFAULT 'UTC',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT check_default_currency_format CHECK (default_currency ~ '^[A-Z]{3}$')
);

-- 2. PROVIDERS TABLE (Curated shared catalogue, not user-owned)
CREATE TABLE IF NOT EXISTS public.providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    aliases TEXT[] DEFAULT '{}',
    category TEXT NULL,
    website_url TEXT NULL,
    logo_asset_url TEXT NULL,
    cancellation_url TEXT NULL,
    metadata_source TEXT NULL,
    last_verified_at TIMESTAMPTZ NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. SUBSCRIPTIONS TABLE (User recurring commitments)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider_id UUID NULL REFERENCES public.providers(id) ON DELETE SET NULL,
    custom_provider_name TEXT NULL,
    display_name TEXT NULL,
    category TEXT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    currency CHAR(3) NOT NULL,
    billing_interval TEXT NOT NULL,
    interval_count INTEGER NOT NULL DEFAULT 1,
    start_date DATE NULL,
    next_renewal_at TIMESTAMPTZ NOT NULL,
    trial_start_at TIMESTAMPTZ NULL,
    trial_end_at TIMESTAMPTZ NULL,
    end_date DATE NULL,
    status TEXT NOT NULL,
    cancellation_url TEXT NULL,
    notes TEXT NULL,
    reminder_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    reminder_lead_hours INTEGER NOT NULL DEFAULT 24,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT check_subscription_amount CHECK (amount >= 0),
    CONSTRAINT check_subscription_currency CHECK (currency ~ '^[A-Z]{3}$'),
    CONSTRAINT check_billing_interval CHECK (billing_interval IN ('weekly', 'biweekly', 'monthly', 'quarterly', 'semiannual', 'yearly', 'custom')),
    CONSTRAINT check_interval_count CHECK (interval_count >= 1),
    CONSTRAINT check_subscription_status CHECK (status IN ('active', 'free_trial', 'cancellation_pending', 'cancelled', 'expired', 'paused')),
    CONSTRAINT check_provider_identity CHECK (provider_id IS NOT NULL OR custom_provider_name IS NOT NULL),
    CONSTRAINT check_trial_dates CHECK (trial_end_at IS NULL OR trial_start_at IS NULL OR trial_end_at >= trial_start_at),
    CONSTRAINT check_cancellation_url_protocol CHECK (cancellation_url IS NULL OR cancellation_url ~* '^https?://'),
    CONSTRAINT check_reminder_lead_hours CHECK (reminder_lead_hours >= 1)
);

-- 4. PUSH SUBSCRIPTIONS TABLE (Device Web Push tokens)
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    p256dh TEXT NOT NULL,
    auth_secret TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_success_at TIMESTAMPTZ NULL,
    disabled_at TIMESTAMPTZ NULL,
    CONSTRAINT unique_user_push_endpoint UNIQUE (user_id, endpoint)
);

-- 5. NOTIFICATION JOBS TABLE (Server-side scheduled reminders)
CREATE TABLE IF NOT EXISTS public.notification_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_id UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    channel TEXT NOT NULL,
    scheduled_for TIMESTAMPTZ NOT NULL,
    idempotency_key TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    attempt_count INTEGER NOT NULL DEFAULT 0,
    last_error_code TEXT NULL,
    sent_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT check_job_event_type CHECK (event_type IN ('renewal', 'trial_end')),
    CONSTRAINT check_job_channel CHECK (channel IN ('push', 'email')),
    CONSTRAINT check_job_status CHECK (status IN ('pending', 'processing', 'sent', 'failed', 'cancelled')),
    CONSTRAINT check_job_attempts CHECK (attempt_count >= 0)
);

-- 6. SUBSCRIPTION EVENTS TABLE (Audit trail of status changes)
CREATE TABLE IF NOT EXISTS public.subscription_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_id UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    metadata JSONB NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON public.subscriptions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_renewal ON public.subscriptions(user_id, next_renewal_at);
CREATE INDEX IF NOT EXISTS idx_notification_jobs_dispatch ON public.notification_jobs(status, scheduled_for) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_notification_jobs_user ON public.notification_jobs(user_id, scheduled_for);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user ON public.push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_providers_slug ON public.providers(slug);
