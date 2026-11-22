import { z } from 'zod';

export const billingIntervalEnum = z.enum([
  'weekly',
  'biweekly',
  'monthly',
  'quarterly',
  'semiannual',
  'yearly',
  'custom',
]);

export const subscriptionStatusEnum = z.enum([
  'active',
  'free_trial',
  'cancellation_pending',
  'cancelled',
  'expired',
  'paused',
]);

export const subscriptionSchema = z
  .object({
    id: z.string().optional(),
    user_id: z.string().optional(),
    provider_id: z.string().nullable().optional(),
    custom_provider_name: z.string().nullable().optional(),
    display_name: z.string().nullable().optional(),
    category: z.string().nullable().optional(),
    amount: z.number().nonnegative('Amount cannot be negative'),
    currency: z
      .string()
      .length(3, 'Currency must be a 3-letter ISO code')
      .regex(/^[A-Z]{3}$/, 'Currency must be 3 uppercase letters'),
    billing_interval: billingIntervalEnum,
    interval_count: z.number().int().positive().default(1),
    start_date: z.string().nullable().optional(),
    next_renewal_at: z.string().datetime({ message: 'Next renewal must be a valid ISO timestamp' }),
    trial_start_at: z.string().datetime().nullable().optional(),
    trial_end_at: z.string().datetime().nullable().optional(),
    end_date: z.string().nullable().optional(),
    status: subscriptionStatusEnum,
    cancellation_url: z
      .string()
      .regex(/^https:\/\/.+/i, { message: 'Cancellation destination must be a secure HTTPS URL' })
      .nullable()
      .or(z.literal(''))
      .optional(),
    notes: z.string().nullable().optional(),
    reminder_enabled: z.boolean().default(true),
    reminder_lead_hours: z.number().int().positive().default(24),
  })
  .refine(
    (data) => Boolean(data.provider_id) || Boolean(data.custom_provider_name?.trim()),
    {
      message: 'Either a catalogue provider or a custom provider name must be provided',
      path: ['custom_provider_name'],
    }
  )
  .refine(
    (data) => {
      if (data.trial_start_at && data.trial_end_at) {
        return new Date(data.trial_end_at).getTime() >= new Date(data.trial_start_at).getTime();
      }
      return true;
    },
    {
      message: 'Trial end date cannot be earlier than trial start date',
      path: ['trial_end_at'],
    }
  );

export type SubscriptionInput = z.infer<typeof subscriptionSchema>;
