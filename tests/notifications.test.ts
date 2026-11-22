import { describe, it, expect } from 'vitest';
import {
  generateIdempotencyKey,
  calculateReminderScheduledTime,
  generateSubscriptionJobs,
} from '@/lib/notifications';
import { urlBase64ToUint8Array } from '@/lib/push';
import { Subscription } from '@/types';

describe('Notification & Reminder Engine', () => {
  describe('Idempotency Key Generation', () => {
    it('produces identical deterministic keys for the same inputs', () => {
      const key1 = generateIdempotencyKey('sub-1', 'renewal', 'email', '2026-12-01T10:00:00Z');
      const key2 = generateIdempotencyKey('sub-1', 'renewal', 'email', '2026-12-01T10:00:00Z');
      expect(key1).toBe(key2);
      expect(key1).toContain('sub-1:renewal:email:');
    });

    it('produces distinct keys for different channels or event types', () => {
      const emailKey = generateIdempotencyKey('sub-1', 'renewal', 'email', '2026-12-01T10:00:00Z');
      const pushKey = generateIdempotencyKey('sub-1', 'renewal', 'push', '2026-12-01T10:00:00Z');
      const trialKey = generateIdempotencyKey('sub-1', 'trial_end', 'email', '2026-12-01T10:00:00Z');

      expect(emailKey).not.toBe(pushKey);
      expect(emailKey).not.toBe(trialKey);
    });
  });

  describe('calculateReminderScheduledTime', () => {
    it('accurately computes dispatch time 24 hours prior by default', () => {
      const renewalIso = '2026-06-15T12:00:00Z';
      const scheduled = calculateReminderScheduledTime(renewalIso, 24);
      expect(scheduled.toISOString()).toBe('2026-06-14T12:00:00.000Z');
    });

    it('accurately computes custom lead times (e.g. 48 hours)', () => {
      const renewalIso = '2026-06-15T12:00:00Z';
      const scheduled = calculateReminderScheduledTime(renewalIso, 48);
      expect(scheduled.toISOString()).toBe('2026-06-13T12:00:00.000Z');
    });
  });

  describe('generateSubscriptionJobs', () => {
    const baseSubscription: Subscription = {
      id: 'sub-active',
      user_id: 'user-1',
      provider_id: null,
      custom_provider_name: 'Figma',
      display_name: 'Figma Pro',
      category: 'Software',
      amount: 12,
      currency: 'USD',
      billing_interval: 'monthly',
      interval_count: 1,
      start_date: '2026-01-01',
      next_renewal_at: '2026-06-15T00:00:00Z',
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
    };

    it('generates email and push jobs for active subscriptions', () => {
      const referenceTime = new Date('2026-06-01T00:00:00Z');
      const jobs = generateSubscriptionJobs(baseSubscription, ['email', 'push'], referenceTime);

      expect(jobs).toHaveLength(2);
      expect(jobs.some((j) => j.channel === 'email' && j.event_type === 'renewal')).toBe(true);
      expect(jobs.some((j) => j.channel === 'push' && j.event_type === 'renewal')).toBe(true);
    });

    it('generates additional trial_end jobs when free trial is active', () => {
      const trialSub: Subscription = {
        ...baseSubscription,
        trial_start_at: '2026-06-01T00:00:00Z',
        trial_end_at: '2026-06-10T00:00:00Z',
        status: 'free_trial',
      };

      const referenceTime = new Date('2026-06-01T00:00:00Z');
      const jobs = generateSubscriptionJobs(trialSub, ['email', 'push'], referenceTime);

      // 2 renewal jobs + 2 trial_end jobs = 4 jobs
      expect(jobs).toHaveLength(4);
      expect(jobs.filter((j) => j.event_type === 'trial_end')).toHaveLength(2);
    });

    it('STRICTLY excludes cancelled subscriptions from receiving reminders', () => {
      const cancelledSub: Subscription = {
        ...baseSubscription,
        status: 'cancelled',
      };
      const jobs = generateSubscriptionJobs(cancelledSub);
      expect(jobs).toHaveLength(0);
    });

    it('STRICTLY excludes paused subscriptions from receiving reminders', () => {
      const pausedSub: Subscription = {
        ...baseSubscription,
        status: 'paused',
      };
      const jobs = generateSubscriptionJobs(pausedSub);
      expect(jobs).toHaveLength(0);
    });

    it('STRICTLY excludes subscriptions when reminder_enabled is false', () => {
      const disabledSub: Subscription = {
        ...baseSubscription,
        reminder_enabled: false,
      };
      const jobs = generateSubscriptionJobs(disabledSub);
      expect(jobs).toHaveLength(0);
    });
  });

  describe('urlBase64ToUint8Array', () => {
    it('converts base64url string to Uint8Array', () => {
      const sample = 'BA1234567890';
      const uint8 = urlBase64ToUint8Array(sample);
      expect(uint8).toBeInstanceOf(Uint8Array);
      expect(uint8.length).toBeGreaterThan(0);
    });
  });
});
