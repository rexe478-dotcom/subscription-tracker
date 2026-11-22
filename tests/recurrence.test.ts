import { describe, it, expect } from 'vitest';
import {
  isLeapYear,
  getDaysInMonth,
  addMonthsClamped,
  addInterval,
  calculateNextRenewal,
} from '@/lib/recurrence';

describe('Recurrence and Calendar Calculations', () => {
  it('correctly identifies leap years', () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2020)).toBe(true);
    expect(isLeapYear(2000)).toBe(true);
    expect(isLeapYear(2023)).toBe(false);
    expect(isLeapYear(2025)).toBe(false);
    expect(isLeapYear(2026)).toBe(false);
    expect(isLeapYear(1900)).toBe(false);
  });

  it('calculates days in month with February leap year awareness', () => {
    expect(getDaysInMonth(2024, 1)).toBe(29); // Feb 2024 (leap year)
    expect(getDaysInMonth(2025, 1)).toBe(28); // Feb 2025 (non-leap year)
    expect(getDaysInMonth(2026, 0)).toBe(31); // Jan 2026
    expect(getDaysInMonth(2026, 3)).toBe(30); // Apr 2026
  });

  describe('addMonthsClamped', () => {
    it('handles month-end boundaries properly (Jan 31 -> Feb 28 in non-leap year)', () => {
      const jan31 = new Date(Date.UTC(2025, 0, 31));
      const nextMonth = addMonthsClamped(jan31, 1);
      expect(nextMonth.getUTCFullYear()).toBe(2025);
      expect(nextMonth.getUTCMonth()).toBe(1); // February
      expect(nextMonth.getUTCDate()).toBe(28); // Clamped to 28
    });

    it('handles month-end boundaries properly (Jan 31 -> Feb 29 in leap year)', () => {
      const jan31 = new Date(Date.UTC(2024, 0, 31));
      const nextMonth = addMonthsClamped(jan31, 1);
      expect(nextMonth.getUTCFullYear()).toBe(2024);
      expect(nextMonth.getUTCMonth()).toBe(1); // February
      expect(nextMonth.getUTCDate()).toBe(29); // Clamped to 29
    });

    it('preserves anchor day when returning to 31-day month', () => {
      const feb28 = new Date(Date.UTC(2025, 1, 28));
      // Anchor day is 31 (original subscription day)
      const march = addMonthsClamped(feb28, 1, 31);
      expect(march.getUTCFullYear()).toBe(2025);
      expect(march.getUTCMonth()).toBe(2); // March
      expect(march.getUTCDate()).toBe(31); // Restored to 31
    });

    it('handles year rollover (Dec -> Jan)', () => {
      const dec15 = new Date(Date.UTC(2025, 11, 15));
      const nextMonth = addMonthsClamped(dec15, 1);
      expect(nextMonth.getUTCFullYear()).toBe(2026);
      expect(nextMonth.getUTCMonth()).toBe(0); // January
      expect(nextMonth.getUTCDate()).toBe(15);
    });
  });

  describe('addInterval', () => {
    it('adds 7 days for weekly interval', () => {
      const base = new Date(Date.UTC(2026, 0, 1));
      const next = addInterval(base, 'weekly', 1);
      expect(next.getUTCDate()).toBe(8);
    });

    it('adds 14 days for biweekly interval', () => {
      const base = new Date(Date.UTC(2026, 0, 1));
      const next = addInterval(base, 'biweekly', 1);
      expect(next.getUTCDate()).toBe(15);
    });

    it('adds 3 months for quarterly interval', () => {
      const base = new Date(Date.UTC(2026, 0, 15));
      const next = addInterval(base, 'quarterly', 1);
      expect(next.getUTCMonth()).toBe(3); // April
      expect(next.getUTCDate()).toBe(15);
    });

    it('adds 12 months for yearly interval', () => {
      const base = new Date(Date.UTC(2026, 5, 20));
      const next = addInterval(base, 'yearly', 1);
      expect(next.getUTCFullYear()).toBe(2027);
      expect(next.getUTCMonth()).toBe(5);
      expect(next.getUTCDate()).toBe(20);
    });
  });

  describe('calculateNextRenewal', () => {
    it('returns base date if already in the future', () => {
      const futureDate = new Date(Date.UTC(2026, 11, 31));
      const reference = new Date(Date.UTC(2026, 5, 1));
      const next = calculateNextRenewal(futureDate, 'monthly', 1, reference);
      expect(next.getTime()).toBe(futureDate.getTime());
    });

    it('advances past renewal dates until strictly on or after reference date', () => {
      const baseDate = new Date(Date.UTC(2026, 0, 15)); // Jan 15, 2026
      const reference = new Date(Date.UTC(2026, 3, 20)); // Apr 20, 2026 (past Jan 15, Feb 15, Mar 15, Apr 15)
      const next = calculateNextRenewal(baseDate, 'monthly', 1, reference);
      // Next monthly renewal should be May 15, 2026
      expect(next.getUTCFullYear()).toBe(2026);
      expect(next.getUTCMonth()).toBe(4); // May
      expect(next.getUTCDate()).toBe(15);
    });
  });
});
