import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { AppShell, NavigationTab } from '@/components/layout/AppShell';
import { AuthPage } from '@/pages/AuthPage';
import { HomePage } from '@/pages/HomePage';
import { SubscriptionsPage } from '@/pages/SubscriptionsPage';
import { CalendarPage } from '@/pages/CalendarPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { SubscriptionModal } from '@/components/subscriptions/SubscriptionModal';
import { CancellationDisclosureModal } from '@/components/subscriptions/CancellationDisclosureModal';
import { Subscription, SubscriptionStatus } from '@/types';
import { Loader2, LogOut } from 'lucide-react';

// Initial verified sample subscriptions
const initialSubscriptions: Subscription[] = [
  {
    id: 'sub-1',
    user_id: 'user-default',
    provider_id: '00000000-0000-0000-0000-000000000001',
    custom_provider_name: 'GitHub',
    display_name: 'GitHub Copilot',
    category: 'Software',
    amount: 10.0,
    currency: 'USD',
    billing_interval: 'monthly',
    interval_count: 1,
    start_date: '2026-01-15',
    next_renewal_at: new Date(Date.now() + 86400000 * 2).toISOString(),
    trial_start_at: null,
    trial_end_at: null,
    end_date: null,
    status: 'active',
    cancellation_url: 'https://github.com/settings/billing',
    notes: 'Primary coding assistant',
    reminder_enabled: true,
    reminder_lead_hours: 24,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sub-2',
    user_id: 'user-default',
    provider_id: '00000000-0000-0000-0000-000000000002',
    custom_provider_name: 'Spotify',
    display_name: 'Spotify Premium Duo',
    category: 'Entertainment',
    amount: 14.99,
    currency: 'EUR',
    billing_interval: 'monthly',
    interval_count: 1,
    start_date: '2025-11-20',
    next_renewal_at: new Date(Date.now() + 86400000 * 12).toISOString(),
    trial_start_at: null,
    trial_end_at: null,
    end_date: null,
    status: 'active',
    cancellation_url: 'https://www.spotify.com/account/subscription/',
    notes: 'Music & podcasts',
    reminder_enabled: true,
    reminder_lead_hours: 24,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sub-3',
    user_id: 'user-default',
    provider_id: '00000000-0000-0000-0000-000000000004',
    custom_provider_name: 'Figma',
    display_name: 'Figma Annual',
    category: 'Software',
    amount: 144.0,
    currency: 'USD',
    billing_interval: 'yearly',
    interval_count: 1,
    start_date: '2026-03-01',
    next_renewal_at: new Date(Date.now() + 86400000 * 45).toISOString(),
    trial_start_at: null,
    trial_end_at: null,
    end_date: null,
    status: 'active',
    cancellation_url: 'https://help.figma.com/hc/en-us/articles/360039829734',
    notes: 'UI/UX design workspace',
    reminder_enabled: true,
    reminder_lead_hours: 72,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sub-4',
    user_id: 'user-default',
    provider_id: '00000000-0000-0000-0000-000000000005',
    custom_provider_name: 'Notion',
    display_name: 'Notion AI Trial',
    category: 'Productivity',
    amount: 10.0,
    currency: 'USD',
    billing_interval: 'monthly',
    interval_count: 1,
    start_date: new Date().toISOString().slice(0, 10),
    next_renewal_at: new Date(Date.now() + 86400000 * 4).toISOString(),
    trial_start_at: new Date().toISOString(),
    trial_end_at: new Date(Date.now() + 86400000 * 4).toISOString(),
    end_date: null,
    status: 'free_trial',
    cancellation_url: 'https://www.notion.so/help/upgrade-or-downgrade-your-plan',
    notes: 'Evaluate workspace synthesis tools',
    reminder_enabled: true,
    reminder_lead_hours: 24,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const MainApp: React.FC = () => {
  const { user, loading, signOut } = useAuth();
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  const [cancellationSub, setCancellationSub] = useState<Subscription | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const handleOpenAdd = () => {
    setEditingSub(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (sub: Subscription) => {
    setEditingSub(sub);
    setModalOpen(true);
  };

  const handleSaveSubscription = (partial: Partial<Subscription>) => {
    if (editingSub) {
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === editingSub.id ? ({ ...s, ...partial, updated_at: new Date().toISOString() } as Subscription) : s))
      );
    } else {
      const newSub: Subscription = {
        id: `sub-${Date.now()}`,
        user_id: user.id,
        provider_id: partial.provider_id || null,
        custom_provider_name: partial.custom_provider_name || 'Custom Subscription',
        display_name: partial.display_name || partial.custom_provider_name || 'Subscription',
        category: partial.category || 'General',
        amount: partial.amount || 0,
        currency: partial.currency || 'USD',
        billing_interval: partial.billing_interval || 'monthly',
        interval_count: 1,
        start_date: new Date().toISOString().slice(0, 10),
        next_renewal_at: partial.next_renewal_at || new Date().toISOString(),
        trial_start_at: partial.trial_start_at || null,
        trial_end_at: partial.trial_end_at || null,
        end_date: null,
        status: partial.status || 'active',
        cancellation_url: partial.cancellation_url || null,
        notes: partial.notes || null,
        reminder_enabled: partial.reminder_enabled ?? true,
        reminder_lead_hours: partial.reminder_lead_hours || 24,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setSubscriptions((prev) => [newSub, ...prev]);
    }
  };

  const handleDeleteSubscription = (id: string) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleConfirmStatusChange = (id: string, newStatus: SubscriptionStatus) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus, updated_at: new Date().toISOString() } : s))
    );
  };

  return (
    <AppShell
      currentTab={currentTab}
      onTabChange={setCurrentTab}
      onAddSubscription={handleOpenAdd}
    >
      {/* User profile & Sign Out bar on top right */}
      <div className="flex items-center justify-end gap-3 mb-6 pb-2 border-b border-border/40 text-xs">
        <span className="text-text-muted">Signed in as</span>
        <span className="font-semibold text-text-primary">
          {user.user_metadata?.full_name || user.email}
        </span>
        <button
          onClick={signOut}
          className="ml-2 inline-flex items-center gap-1 text-text-muted hover:text-status-danger transition-colors p-1"
          aria-label="Sign out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign out</span>
        </button>
      </div>

      {currentTab === 'home' && (
        <HomePage
          subscriptions={subscriptions}
          onAddSubscription={handleOpenAdd}
          onSelectSubscription={handleOpenEdit}
        />
      )}

      {currentTab === 'subscriptions' && (
        <SubscriptionsPage
          subscriptions={subscriptions}
          onAddSubscription={handleOpenAdd}
          onSelectSubscription={handleOpenEdit}
        />
      )}

      {currentTab === 'calendar' && (
        <CalendarPage
          subscriptions={subscriptions}
          onSelectSubscription={handleOpenEdit}
        />
      )}

      {currentTab === 'analytics' && (
        <AnalyticsPage subscriptions={subscriptions} />
      )}

      {currentTab === 'settings' && (
        <SettingsPage subscriptions={subscriptions} />
      )}

      <SubscriptionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveSubscription}
        onDelete={handleDeleteSubscription}
        onOpenCancellationFlow={(sub) => setCancellationSub(sub)}
        subscription={editingSub}
      />

      <CancellationDisclosureModal
        isOpen={Boolean(cancellationSub)}
        onClose={() => setCancellationSub(null)}
        subscription={cancellationSub}
        onConfirmStatusChange={handleConfirmStatusChange}
      />
    </AppShell>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
};

export default App;
