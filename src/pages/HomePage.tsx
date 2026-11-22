import React, { useState } from 'react';
import { Subscription } from '@/types';
import { formatCurrency, groupSubscriptionsByCurrency } from '@/lib/currency';
import { getDaysUntil } from '@/lib/recurrence';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MascotSvg } from '@/components/mascot/MascotSvg';
import { Plus, Calendar, Clock, Sparkles } from 'lucide-react';

interface HomePageProps {
  subscriptions: Subscription[];
  onAddSubscription: () => void;
  onSelectSubscription: (sub: Subscription) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  subscriptions,
  onAddSubscription,
  onSelectSubscription,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'soon' | 'trials'>('all');

  const currencyGroups = groupSubscriptionsByCurrency(subscriptions);
  const activeSubs = subscriptions.filter(
    (s) => s.status === 'active' || s.status === 'free_trial' || s.status === 'cancellation_pending'
  );

  // Filter upcoming renewals based on filterMode
  const sortedRenewals = [...activeSubs].sort(
    (a, b) => new Date(a.next_renewal_at).getTime() - new Date(b.next_renewal_at).getTime()
  );

  const displayedRenewals = sortedRenewals.filter((sub) => {
    if (filterMode === 'trials') {
      return sub.status === 'free_trial' || Boolean(sub.trial_end_at);
    }
    if (filterMode === 'soon') {
      const days = getDaysUntil(sub.next_renewal_at);
      return days >= 0 && days <= 7;
    }
    return true;
  });

  // Filter active free trials for top alert banner
  const freeTrials = activeSubs.filter(
    (s) => s.status === 'free_trial' || Boolean(s.trial_end_at)
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-text-primary">
            Overview & Renewals
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Track commitments, currency monthly estimates, and imminent renewal dates.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={onAddSubscription}
          leftIcon={<Plus className="w-4 h-4" />}
          className="self-start sm:self-auto"
        >
          Add Subscription
        </Button>
      </div>

      {subscriptions.length === 0 ? (
        /* Empty State with Mascot */
        <div className="border border-border rounded-lg bg-surface p-8 md:p-12 text-center flex flex-col items-center justify-center">
          <MascotSvg pose="empty" size={140} className="mb-4" />
          <h3 className="text-base font-semibold text-text-primary">
            No subscriptions tracked yet
          </h3>
          <p className="text-sm text-text-secondary max-w-sm mt-1 mb-6">
            Track tools, streaming services, or trials to receive proactive alerts before you get billed.
          </p>
          <Button
            variant="primary"
            onClick={onAddSubscription}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Track First Subscription
          </Button>
        </div>
      ) : (
        <>
          {/* Top Metric Cards - Currency Grouped (Hard Constraint: Never sum unlike currencies) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currencyGroups.map((group) => (
              <div
                key={group.currency}
                className="bg-surface border border-border rounded-lg p-5 flex flex-col justify-between transition-colors hover:border-border/80"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-medium text-text-secondary">
                    <span>Monthly Estimate ({group.currency})</span>
                    <span className="tabular-nums bg-surface-elevated px-2 py-0.5 rounded text-text-primary border border-border">
                      {group.activeCount} {group.activeCount === 1 ? 'service' : 'services'}
                    </span>
                  </div>
                  <div className="mt-3 text-2xl font-bold text-text-primary tabular-nums tracking-tight">
                    {formatCurrency(group.totalMonthlyEstimate, group.currency)}
                    <span className="text-xs text-text-muted font-normal ml-1">/ month</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-border/60 text-xs text-text-muted flex justify-between tabular-nums">
                  <span>Annual projection:</span>
                  <span className="font-medium text-text-secondary">
                    {formatCurrency(group.totalAnnualProjection, group.currency)} / yr
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Active Free Trials Banner */}
          {freeTrials.length > 0 && (
            <div className="border border-status-warning/40 bg-status-warning/10 rounded-lg p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-status-warning font-semibold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Active Free Trials ({freeTrials.length})</span>
                </div>
                <span className="text-xs text-text-muted">Review before automatic billing</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {freeTrials.map((trial) => {
                  const daysLeft = trial.trial_end_at ? getDaysUntil(trial.trial_end_at) : null;
                  const isExpiringSoon = daysLeft !== null && daysLeft <= 3;
                  return (
                    <div
                      key={trial.id}
                      onClick={() => onSelectSubscription(trial)}
                      className="bg-surface/90 border border-border rounded-md p-3.5 cursor-pointer hover:border-status-warning/80 transition-colors flex flex-col justify-between"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-semibold text-sm text-text-primary">
                            {trial.display_name || trial.custom_provider_name}
                          </span>
                          <div className="text-xs text-text-muted capitalize mt-0.5">
                            {trial.billing_interval} conversion
                          </div>
                        </div>
                        <Badge status={trial.status} size="sm" />
                      </div>
                      <div className="mt-3 pt-2 border-t border-border/40 text-xs flex justify-between tabular-nums items-center">
                        <span className="text-text-secondary">
                          Converts to: {formatCurrency(trial.amount, trial.currency)}
                        </span>
                        {daysLeft !== null && (
                          <span className={`px-2 py-0.5 rounded font-semibold ${isExpiringSoon ? 'bg-status-danger/20 text-status-danger' : 'bg-status-warning/20 text-status-warning'}`}>
                            {daysLeft <= 0 ? 'Expires today' : `${daysLeft} days left`}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Upcoming Renewals Timeline */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-text-primary flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent" />
                <span>Renewal Timeline</span>
              </h3>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setFilterMode('all')}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors border ${
                    filterMode === 'all'
                      ? 'bg-surface-elevated text-accent border-accent/60'
                      : 'bg-surface text-text-muted border-border hover:text-text-primary'
                  }`}
                >
                  All ({sortedRenewals.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode('soon')}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors border ${
                    filterMode === 'soon'
                      ? 'bg-surface-elevated text-accent border-accent/60'
                      : 'bg-surface text-text-muted border-border hover:text-text-primary'
                  }`}
                >
                  Next 7 Days
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode('trials')}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors border ${
                    filterMode === 'trials'
                      ? 'bg-surface-elevated text-accent border-accent/60'
                      : 'bg-surface text-text-muted border-border hover:text-text-primary'
                  }`}
                >
                  Trials Only
                </button>
              </div>
            </div>

            {displayedRenewals.length === 0 ? (
              <div className="border border-border rounded-lg bg-surface p-8 text-center text-text-secondary text-sm">
                No renewals match the selected filter.
              </div>
            ) : (
              <div className="border border-border rounded-lg bg-surface divide-y divide-border">
                {displayedRenewals.map((sub) => {
                  const daysUntil = getDaysUntil(sub.next_renewal_at);
                  const isImminent = daysUntil <= 2;
                  const renewalDateStr = new Date(sub.next_renewal_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <div
                      key={sub.id}
                      onClick={() => onSelectSubscription(sub)}
                      className="p-4 flex items-center justify-between hover:bg-surface-elevated/40 transition-colors cursor-pointer min-h-[56px]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-surface-elevated border border-border flex items-center justify-center font-bold text-xs text-accent shrink-0">
                          {(sub.display_name || sub.custom_provider_name || 'S').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-text-primary">
                              {sub.display_name || sub.custom_provider_name}
                            </span>
                            {sub.category && (
                              <span className="text-[10px] bg-surface-elevated px-1.5 py-0.5 rounded text-text-muted border border-border hidden sm:inline-block">
                                {sub.category}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-text-muted flex items-center gap-2 mt-0.5">
                            <span className="capitalize">{sub.billing_interval}</span>
                            <span>•</span>
                            <span>{renewalDateStr}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-right">
                        <div className="tabular-nums">
                          <div className="font-bold text-sm text-text-primary">
                            {formatCurrency(sub.amount, sub.currency)}
                          </div>
                          <div
                            className={`text-xs flex items-center justify-end gap-1 ${
                              isImminent ? 'text-status-danger font-semibold' : 'text-text-muted'
                            }`}
                          >
                            {isImminent && <Clock className="w-3 h-3" />}
                            <span>{daysUntil <= 0 ? 'Due today' : `In ${daysUntil}d`}</span>
                          </div>
                        </div>
                        <Badge status={sub.status} size="sm" className="hidden sm:inline-flex" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
