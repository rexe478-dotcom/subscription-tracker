import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CalendarPage } from '@/pages/CalendarPage';
import { HomePage } from '@/pages/HomePage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { Subscription } from '@/types';

const mockSubs: Subscription[] = [
  {
    id: 's1',
    user_id: 'u1',
    provider_id: null,
    custom_provider_name: 'GitHub Copilot',
    display_name: 'GitHub Copilot',
    category: 'Software',
    amount: 10,
    currency: 'USD',
    billing_interval: 'monthly',
    interval_count: 1,
    start_date: '2026-01-01',
    next_renewal_at: new Date(Date.now() + 86400000 * 2).toISOString(),
    trial_start_at: null,
    trial_end_at: null,
    end_date: null,
    status: 'active',
    cancellation_url: null,
    notes: null,
    reminder_enabled: true,
    reminder_lead_hours: 24,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 's2',
    user_id: 'u1',
    provider_id: null,
    custom_provider_name: 'Spotify',
    display_name: 'Spotify Premium',
    category: 'Entertainment',
    amount: 14.99,
    currency: 'EUR',
    billing_interval: 'monthly',
    interval_count: 1,
    start_date: '2026-01-01',
    next_renewal_at: new Date(Date.now() + 86400000 * 15).toISOString(),
    trial_start_at: null,
    trial_end_at: null,
    end_date: null,
    status: 'active',
    cancellation_url: null,
    notes: null,
    reminder_enabled: true,
    reminder_lead_hours: 24,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 's3',
    user_id: 'u1',
    provider_id: null,
    custom_provider_name: 'Notion AI',
    display_name: 'Notion Trial',
    category: 'Productivity',
    amount: 10,
    currency: 'USD',
    billing_interval: 'monthly',
    interval_count: 1,
    start_date: '2026-01-01',
    next_renewal_at: new Date(Date.now() + 86400000 * 4).toISOString(),
    trial_start_at: new Date().toISOString(),
    trial_end_at: new Date(Date.now() + 86400000 * 4).toISOString(),
    end_date: null,
    status: 'free_trial',
    cancellation_url: null,
    notes: null,
    reminder_enabled: true,
    reminder_lead_hours: 24,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

describe('Dashboard, Calendar & Analytics Views', () => {
  describe('HomePage', () => {
    it('renders currency grouped monthly estimates without combining currencies', () => {
      render(
        <HomePage
          subscriptions={mockSubs}
          onAddSubscription={vi.fn()}
          onSelectSubscription={vi.fn()}
        />
      );

      // Verify USD and EUR are displayed in separate cards
      expect(screen.getByText(/Monthly Estimate \(USD\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Monthly Estimate \(EUR\)/i)).toBeInTheDocument();
    });

    it('filters upcoming renewals when filter chips are clicked', () => {
      render(
        <HomePage
          subscriptions={mockSubs}
          onAddSubscription={vi.fn()}
          onSelectSubscription={vi.fn()}
        />
      );

      const trialsFilter = screen.getByRole('button', { name: /trials only/i });
      fireEvent.click(trialsFilter);

      // In trials-only mode, Notion Trial is visible
      const notionElements = screen.getAllByText('Notion Trial');
      expect(notionElements.length).toBeGreaterThan(0);
    });
  });

  describe('CalendarPage', () => {
    it('renders month schedule grid and toggles to agenda list', () => {
      render(
        <CalendarPage
          subscriptions={mockSubs}
          onSelectSubscription={vi.fn()}
        />
      );

      // Grid is rendered by default
      expect(screen.getByText('Sun')).toBeInTheDocument();
      expect(screen.getByText('Mon')).toBeInTheDocument();

      // Toggle to list view
      const listButton = screen.getByLabelText(/agenda list view/i);
      fireEvent.click(listButton);

      // In list view, day abbreviation or renewal items appear
      expect(screen.getByText('GitHub Copilot')).toBeInTheDocument();
    });
  });

  describe('AnalyticsPage', () => {
    it('displays separate portfolio sections for each currency', () => {
      render(<AnalyticsPage subscriptions={mockSubs} />);

      expect(screen.getByText('USD Portfolio')).toBeInTheDocument();
      expect(screen.getByText('EUR Portfolio')).toBeInTheDocument();
      expect(screen.getAllByText('Spend by Category').length).toBe(2);
      expect(screen.getAllByText('Billing Interval Distribution').length).toBe(2);
    });
  });
});
