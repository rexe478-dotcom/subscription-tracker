import { describe, it, expect } from 'vitest';
import { searchCatalogue, verifiedProviders } from '@/lib/catalogue';
import { subscriptionSchema } from '@/lib/validation';

describe('Catalogue & Subscription Business Logic', () => {
  describe('Provider Catalogue Search', () => {
    it('returns all providers when query is empty', () => {
      const all = searchCatalogue('');
      expect(all.length).toBe(verifiedProviders.length);
    });

    it('matches provider by exact and partial name (case-insensitive)', () => {
      const results = searchCatalogue('spot');
      expect(results.some((p) => p.name === 'Spotify')).toBe(true);
    });

    it('matches provider by alias (e.g. copilot -> GitHub)', () => {
      const results = searchCatalogue('copilot');
      expect(results.some((p) => p.name === 'GitHub')).toBe(true);
    });

    it('matches provider by alias (e.g. prime -> Amazon Prime)', () => {
      const results = searchCatalogue('prime');
      expect(results.some((p) => p.name === 'Amazon Prime')).toBe(true);
    });

    it('matches provider by category (e.g. Entertainment)', () => {
      const results = searchCatalogue('Entertainment');
      expect(results.some((p) => p.name === 'Netflix')).toBe(true);
      expect(results.some((p) => p.name === 'Spotify')).toBe(true);
    });
  });

  describe('Subscription Zod Schema Validation', () => {
    it('accepts valid subscription input', () => {
      const valid = {
        custom_provider_name: 'Custom VPN',
        amount: 4.99,
        currency: 'USD',
        billing_interval: 'monthly' as const,
        next_renewal_at: new Date().toISOString(),
        status: 'active' as const,
        cancellation_url: 'https://vpn.example.com/cancel',
      };

      const result = subscriptionSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects negative amounts', () => {
      const invalid = {
        custom_provider_name: 'Service',
        amount: -5.0,
        currency: 'USD',
        billing_interval: 'monthly' as const,
        next_renewal_at: new Date().toISOString(),
        status: 'active' as const,
      };

      const result = subscriptionSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('negative');
      }
    });

    it('rejects invalid currency codes (e.g. 2 letters or lowercase)', () => {
      const invalid = {
        custom_provider_name: 'Service',
        amount: 10,
        currency: 'us',
        billing_interval: 'monthly' as const,
        next_renewal_at: new Date().toISOString(),
        status: 'active' as const,
      };

      const result = subscriptionSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects insecure http:// or invalid cancellation destinations', () => {
      const invalid = {
        custom_provider_name: 'Service',
        amount: 10,
        currency: 'USD',
        billing_interval: 'monthly' as const,
        next_renewal_at: new Date().toISOString(),
        status: 'active' as const,
        cancellation_url: 'http://insecure-site.com/cancel', // Not https
      };

      const result = subscriptionSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('secure HTTPS URL');
      }
    });

    it('rejects trial end date earlier than trial start date', () => {
      const invalid = {
        custom_provider_name: 'Trial App',
        amount: 0,
        currency: 'USD',
        billing_interval: 'monthly' as const,
        next_renewal_at: new Date().toISOString(),
        status: 'free_trial' as const,
        trial_start_at: '2026-06-15T00:00:00Z',
        trial_end_at: '2026-06-01T00:00:00Z', // Before start
      };

      const result = subscriptionSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('earlier than trial start');
      }
    });
  });
});
