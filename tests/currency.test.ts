import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  isValidCurrencyCode,
  calculateMonthlyEquivalent,
  calculateAnnualProjection,
  groupSubscriptionsByCurrency,
} from '@/lib/currency';
import { Subscription } from '@/types';

describe('Currency and Financial Calculations', () => {
  it('validates ISO 4217 currency codes', () => {
    expect(isValidCurrencyCode('USD')).toBe(true);
    expect(isValidCurrencyCode('eur')).toBe(true);
    expect(isValidCurrencyCode('GBP')).toBe(true);
    expect(isValidCurrencyCode('JPY')).toBe(true);
    expect(isValidCurrencyCode('US1')).toBe(false);
    expect(isValidCurrencyCode('US')).toBe(false);
    expect(isValidCurrencyCode('USDD')).toBe(false);
  });

  it('formats currency correctly', () => {
    const formattedUsd = formatCurrency(14.99, 'USD', 'en-US');
    expect(formattedUsd).toContain('14.99');
    expect(formattedUsd).toContain('$');

    const formattedEur = formatCurrency(9.99, 'EUR', 'en-US');
    expect(formattedEur).toContain('9.99');
    expect(formattedEur).toContain('€');
  });

  describe('calculateMonthlyEquivalent', () => {
    it('calculates weekly: amount * 52 / 12', () => {
      // $10/week = $520/year = $43.333.../month
      const monthly = calculateMonthlyEquivalent(10, 'weekly', 1);
      expect(monthly).toBeCloseTo((10 * 52) / 12, 4);
    });

    it('calculates biweekly: amount * 26 / 12', () => {
      // $20/biweekly = $520/year = $43.333.../month
      const monthly = calculateMonthlyEquivalent(20, 'biweekly', 1);
      expect(monthly).toBeCloseTo((20 * 26) / 12, 4);
    });

    it('calculates monthly: amount / 1', () => {
      const monthly = calculateMonthlyEquivalent(15, 'monthly', 1);
      expect(monthly).toBe(15);
    });

    it('calculates quarterly: amount / 3', () => {
      const monthly = calculateMonthlyEquivalent(30, 'quarterly', 1);
      expect(monthly).toBe(10);
    });

    it('calculates semiannual: amount / 6', () => {
      const monthly = calculateMonthlyEquivalent(60, 'semiannual', 1);
      expect(monthly).toBe(10);
    });

    it('calculates yearly: amount / 12', () => {
      const monthly = calculateMonthlyEquivalent(120, 'yearly', 1);
      expect(monthly).toBe(10);
    });
  });

  describe('calculateAnnualProjection', () => {
    it('calculates annual projection across all intervals', () => {
      expect(calculateAnnualProjection(10, 'weekly', 1)).toBe(520);
      expect(calculateAnnualProjection(20, 'biweekly', 1)).toBe(520);
      expect(calculateAnnualProjection(15, 'monthly', 1)).toBe(180);
      expect(calculateAnnualProjection(30, 'quarterly', 1)).toBe(120);
      expect(calculateAnnualProjection(60, 'semiannual', 1)).toBe(120);
      expect(calculateAnnualProjection(120, 'yearly', 1)).toBe(120);
    });
  });

  describe('groupSubscriptionsByCurrency', () => {
    const mockSubscriptions: Subscription[] = [
      {
        id: '1',
        user_id: 'user-1',
        provider_id: null,
        custom_provider_name: 'Netflix',
        display_name: 'Netflix Premium',
        category: 'Entertainment',
        amount: 15.99,
        currency: 'USD',
        billing_interval: 'monthly',
        interval_count: 1,
        start_date: '2026-01-01',
        next_renewal_at: '2026-12-01T00:00:00Z',
        trial_start_at: null,
        trial_end_at: null,
        end_date: null,
        status: 'active',
        cancellation_url: null,
        notes: null,
        reminder_enabled: true,
        reminder_lead_hours: 24,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      },
      {
        id: '2',
        user_id: 'user-1',
        provider_id: null,
        custom_provider_name: 'Spotify',
        display_name: 'Spotify Duo',
        category: 'Entertainment',
        amount: 14.99,
        currency: 'EUR',
        billing_interval: 'monthly',
        interval_count: 1,
        start_date: '2026-01-01',
        next_renewal_at: '2026-12-01T00:00:00Z',
        trial_start_at: null,
        trial_end_at: null,
        end_date: null,
        status: 'active',
        cancellation_url: null,
        notes: null,
        reminder_enabled: true,
        reminder_lead_hours: 24,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      },
      {
        id: '3',
        user_id: 'user-1',
        provider_id: null,
        custom_provider_name: 'GitHub Copilot',
        display_name: 'Copilot',
        category: 'Developer Tools',
        amount: 10.0,
        currency: 'USD',
        billing_interval: 'monthly',
        interval_count: 1,
        start_date: '2026-01-01',
        next_renewal_at: '2026-12-01T00:00:00Z',
        trial_start_at: null,
        trial_end_at: null,
        end_date: null,
        status: 'active',
        cancellation_url: null,
        notes: null,
        reminder_enabled: true,
        reminder_lead_hours: 24,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      },
      {
        id: '4',
        user_id: 'user-1',
        provider_id: null,
        custom_provider_name: 'Gym',
        display_name: 'Old Gym',
        category: 'Fitness',
        amount: 50.0,
        currency: 'USD',
        billing_interval: 'monthly',
        interval_count: 1,
        start_date: '2025-01-01',
        next_renewal_at: '2025-06-01T00:00:00Z',
        trial_start_at: null,
        trial_end_at: null,
        end_date: '2025-06-01',
        status: 'cancelled', // Should NOT be included in active spend
        cancellation_url: null,
        notes: null,
        reminder_enabled: false,
        reminder_lead_hours: 24,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-06-01T00:00:00Z',
      },
    ];

    it('groups totals strictly by currency and excludes cancelled subscriptions', () => {
      const groups = groupSubscriptionsByCurrency(mockSubscriptions);

      // Should produce two distinct groups: EUR and USD
      expect(groups).toHaveLength(2);

      const eurGroup = groups.find((g) => g.currency === 'EUR');
      expect(eurGroup).toBeDefined();
      expect(eurGroup?.activeCount).toBe(1);
      expect(eurGroup?.totalMonthlyEstimate).toBeCloseTo(14.99, 2);
      expect(eurGroup?.totalAnnualProjection).toBeCloseTo(179.88, 2);

      const usdGroup = groups.find((g) => g.currency === 'USD');
      expect(usdGroup).toBeDefined();
      expect(usdGroup?.activeCount).toBe(2); // Only Netflix and Copilot, Gym is excluded
      expect(usdGroup?.totalMonthlyEstimate).toBeCloseTo(25.99, 2);
      expect(usdGroup?.totalAnnualProjection).toBeCloseTo(311.88, 2);
    });
  });
});
