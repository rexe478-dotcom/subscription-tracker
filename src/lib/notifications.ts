import { Subscription, NotificationJob, NotificationEventType, NotificationChannel } from '@/types';

/**
 * Generates the deterministic unique idempotency key for a reminder job.
 * Format: {subscription_id}:{event_type}:{channel}:{target_timestamp_iso}
 */
export function generateIdempotencyKey(
  subscriptionId: string,
  eventType: NotificationEventType,
  channel: NotificationChannel,
  targetTimestampIso: string
): string {
  // Normalize timestamp to minute granularity to avoid millisecond drift
  const date = new Date(targetTimestampIso);
  const normalizedTime = new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes()
    )
  ).toISOString();

  return `${subscriptionId}:${eventType}:${channel}:${normalizedTime}`;
}

/**
 * Calculates when a reminder should be dispatched based on the target date and lead hours.
 */
export function calculateReminderScheduledTime(
  targetDateIso: string,
  leadHours: number = 24
): Date {
  const targetTime = new Date(targetDateIso).getTime();
  const leadMillis = Math.max(1, leadHours) * 60 * 60 * 1000;
  return new Date(targetTime - leadMillis);
}

/**
 * Generates prospective notification jobs for an active or trial subscription.
 * Excludes cancelled, expired, or paused subscriptions, or subscriptions where reminders are disabled.
 */
export function generateSubscriptionJobs(
  subscription: Subscription,
  channels: NotificationChannel[] = ['email', 'push'],
  now: Date = new Date()
): Partial<NotificationJob>[] {
  // Hard constraint: Never generate or send reminders for cancelled, expired, paused, or disabled subscriptions
  if (
    !subscription.reminder_enabled ||
    subscription.status === 'cancelled' ||
    subscription.status === 'expired' ||
    subscription.status === 'paused'
  ) {
    return [];
  }

  const jobs: Partial<NotificationJob>[] = [];
  const leadHours = subscription.reminder_lead_hours || 24;

  // 1. Renewal Event Reminder
  if (subscription.next_renewal_at) {
    const scheduledTime = calculateReminderScheduledTime(subscription.next_renewal_at, leadHours);
    // Only schedule if scheduled time is in the future relative to the reference date
    if (scheduledTime.getTime() > now.getTime()) {
      for (const channel of channels) {
        jobs.push({
          user_id: subscription.user_id,
          subscription_id: subscription.id,
          event_type: 'renewal',
          channel,
          scheduled_for: scheduledTime.toISOString(),
          idempotency_key: generateIdempotencyKey(
            subscription.id,
            'renewal',
            channel,
            scheduledTime.toISOString()
          ),
          status: 'pending',
          attempt_count: 0,
        });
      }
    }
  }

  // 2. Free Trial End Event Reminder (if applicable)
  if (subscription.trial_end_at) {
    const trialScheduledTime = calculateReminderScheduledTime(subscription.trial_end_at, leadHours);
    if (trialScheduledTime.getTime() > now.getTime()) {
      for (const channel of channels) {
        jobs.push({
          user_id: subscription.user_id,
          subscription_id: subscription.id,
          event_type: 'trial_end',
          channel,
          scheduled_for: trialScheduledTime.toISOString(),
          idempotency_key: generateIdempotencyKey(
            subscription.id,
            'trial_end',
            channel,
            trialScheduledTime.toISOString()
          ),
          status: 'pending',
          attempt_count: 0,
        });
      }
    }
  }

  return jobs;
}
