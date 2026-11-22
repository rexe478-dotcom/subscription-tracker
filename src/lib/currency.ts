import { BillingInterval, Subscription, CurrencyTotal } from '@/types';

/**
 * Valid ISO 4217 Currency Code check
 */
export function isValidCurrencyCode(code: string): boolean {
  return /^[A-Z]{3}$/.test(code.toUpperCase());
}

/**
 * Format currency amount with tabular figures and appropriate locale symbol
 */
export function formatCurrency(
  amount: number,
  currencyCode: string,
  locale: string = 'en-US'
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    // Fallback if currency code is unrecognized
    return `${currencyCode.toUpperCase()} ${amount.toFixed(2)}`;
  }
}

/**
 * Calculates normalized monthly equivalent spend according to project rules:
 * - Weekly: amount * 52 / 12
 * - Biweekly: amount * 26 / 12
 * - Monthly: amount / intervalCount
 * - Quarterly: amount / (3 * intervalCount)
 * - Semiannual: amount / (6 * intervalCount)
 * - Yearly: amount / (12 * intervalCount)
 * - Custom: normalized based on intervalCount in days or months
 */
export function calculateMonthlyEquivalent(
  amount: number,
  interval: BillingInterval,
  intervalCount: number = 1
): number {
  if (amount <= 0 || intervalCount <= 0) return 0;

  switch (interval) {
    case 'weekly':
      return (amount * 52) / 12 / intervalCount;
    case 'biweekly':
      return (amount * 26) / 12 / intervalCount;
    case 'monthly':
      return amount / intervalCount;
    case 'quarterly':
      return amount / (3 * intervalCount);
    case 'semiannual':
      return amount / (6 * intervalCount);
    case 'yearly':
      return amount / (12 * intervalCount);
    case 'custom':
      // Default custom assumption treats intervalCount as months unless specified
      return amount / intervalCount;
    default:
      return amount;
  }
}

/**
 * Calculates normalized annual projection according to recurrence rules:
 * - Weekly: amount * 52 / intervalCount
 * - Biweekly: amount * 26 / intervalCount
 * - Monthly: amount * 12 / intervalCount
 * - Quarterly: amount * 4 / intervalCount
 * - Semiannual: amount * 2 / intervalCount
 * - Yearly: amount / intervalCount
 */
export function calculateAnnualProjection(
  amount: number,
  interval: BillingInterval,
  intervalCount: number = 1
): number {
  if (amount <= 0 || intervalCount <= 0) return 0;

  switch (interval) {
    case 'weekly':
      return (amount * 52) / intervalCount;
    case 'biweekly':
      return (amount * 26) / intervalCount;
    case 'monthly':
      return (amount * 12) / intervalCount;
    case 'quarterly':
      return (amount * 4) / intervalCount;
    case 'semiannual':
      return (amount * 2) / intervalCount;
    case 'yearly':
      return amount / intervalCount;
    case 'custom':
      return (amount * 12) / intervalCount;
    default:
      return amount * 12;
  }
}

/**
 * Group active/trial subscriptions by currency.
 * Crucial rule: Never add unlike currencies together.
 */
export function groupSubscriptionsByCurrency(
  subscriptions: Subscription[]
): CurrencyTotal[] {
  // Only include active and free_trial subscriptions in active recurring spend
  const activeSubs = subscriptions.filter(
    (s) => s.status === 'active' || s.status === 'free_trial' || s.status === 'cancellation_pending'
  );

  const groups = new Map<string, CurrencyTotal>();

  for (const sub of activeSubs) {
    const curr = sub.currency.toUpperCase();
    let group = groups.get(curr);

    if (!group) {
      group = {
        currency: curr,
        activeCount: 0,
        totalMonthlyEstimate: 0,
        totalAnnualProjection: 0,
        subscriptions: [],
      };
      groups.set(curr, group);
    }

    group.activeCount += 1;
    group.totalMonthlyEstimate += calculateMonthlyEquivalent(
      sub.amount,
      sub.billing_interval,
      sub.interval_count || 1
    );
    group.totalAnnualProjection += calculateAnnualProjection(
      sub.amount,
      sub.billing_interval,
      sub.interval_count || 1
    );
    group.subscriptions.push(sub);
  }

  return Array.from(groups.values()).sort((a, b) =>
    a.currency.localeCompare(b.currency)
  );
}
