import { createClient } from '@supabase/supabase-js';

const defaultUrl = 'https://rjqpelaqczkutwtstsho.supabase.co';
const defaultAnonKey = 'sb_publishable_LTaql5iUvPQrXW0n0n6gJA_9jKCee__';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || defaultUrl;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  defaultAnonKey;

export const isSupabaseConfigured =
  import.meta.env.MODE !== 'test' &&
  Boolean(
    (import.meta.env.VITE_SUPABASE_URL || defaultUrl) &&
      (import.meta.env.VITE_SUPABASE_ANON_KEY ||
        import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
        defaultAnonKey)
  );

/**
 * Public Supabase client instance.
 * Protected by Row Level Security (RLS) on Postgres.
 * PRIVILEGED KEYS (service-role, VAPID private, email API keys) ARE NEVER USED HERE.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
