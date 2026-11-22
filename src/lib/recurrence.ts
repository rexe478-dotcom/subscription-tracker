import { BillingInterval } from '@/types';

/**
 * Returns number of days in a given year and month (0-indexed month)
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

/**
 * Check if a year is a leap year
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Safely adds months to a UTC date, respecting month-end boundaries and anchor day.
 * If targetDay is 31 and next month has 30 days, clamps to 30.
 */
export function addMonthsClamped(
  date: Date,
  monthsToAdd: number,
  anchorDay?: number
): Date {
  const currentYear = date.getUTCFullYear();
  const currentMonth = date.getUTCMonth();
  const targetDay = anchorDay ?? date.getUTCDate();

  const totalMonths = currentMonth + monthsToAdd;
  const targetYear = currentYear + Math.floor(totalMonths / 12);
  const targetMonth = ((totalMonths % 12) + 12) % 12;

  const maxDays = getDaysInMonth(targetYear, targetMonth);
  const clampedDay = Math.min(targetDay, maxDays);

  return new Date(
    Date.UTC(
      targetYear,
      targetMonth,
      clampedDay,
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getUTCMilliseconds()
    )
  );
}

/**
 * Adds an interval step to a date
 */
export function addInterval(
  date: Date,
  interval: BillingInterval,
  intervalCount: number = 1,
  anchorDay?: number
): Date {
  const result = new Date(date.getTime());
  const count = Math.max(1, intervalCount);

  switch (interval) {
    case 'weekly':
      result.setUTCDate(result.getUTCDate() + 7 * count);
      return result;
    case 'biweekly':
      result.setUTCDate(result.getUTCDate() + 14 * count);
      return result;
    case 'monthly':
      return addMonthsClamped(result, count, anchorDay);
    case 'quarterly':
      return addMonthsClamped(result, 3 * count, anchorDay);
    case 'semiannual':
      return addMonthsClamped(result, 6 * count, anchorDay);
    case 'yearly':
      return addMonthsClamped(result, 12 * count, anchorDay);
    case 'custom':
      // Treat custom interval count as months
      return addMonthsClamped(result, count, anchorDay);
    default:
      return addMonthsClamped(result, 1, anchorDay);
  }
}

/**
 * Calculates the next upcoming renewal date that occurs on or after `referenceDate`.
 * If baseDate is already in the future, returns baseDate.
 */
export function calculateNextRenewal(
  baseDate: Date,
  interval: BillingInterval,
  intervalCount: number = 1,
  referenceDate: Date = new Date(),
  anchorDay?: number
): Date {
  const anchor = anchorDay ?? baseDate.getUTCDate();
  let current = new Date(baseDate.getTime());

  // If already in the future compared to reference date, return it
  if (current.getTime() >= referenceDate.getTime()) {
    return current;
  }

  // Fast forward until on or after referenceDate
  while (current.getTime() < referenceDate.getTime()) {
    current = addInterval(current, interval, intervalCount, anchor);
  }

  return current;
}

/**
 * Compute days remaining from today until target date
 */
export function getDaysUntil(targetDateIso: string, fromDate: Date = new Date()): number {
  const target = new Date(targetDateIso);
  const diffTime = target.getTime() - fromDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
