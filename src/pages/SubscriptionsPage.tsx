import React, { useState } from 'react';
import { Subscription } from '@/types';
import { formatCurrency } from '@/lib/currency';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Plus, ExternalLink } from 'lucide-react';

interface SubscriptionsPageProps {
  subscriptions: Subscription[];
  onAddSubscription: () => void;
  onSelectSubscription: (sub: Subscription) => void;
}

export const SubscriptionsPage: React.FC<SubscriptionsPageProps> = ({
  subscriptions,
  onAddSubscription,
  onSelectSubscription,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const name = (sub.display_name || sub.custom_provider_name || '').toLowerCase();
    const category = (sub.category || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = name.includes(query) || category.includes(query);

    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && sub.status === statusFilter;
  });

  const statuses: { id: string; label: string }[] = [
    { id: 'all', label: 'All Services' },
    { id: 'active', label: 'Active' },
    { id: 'free_trial', label: 'Free Trials' },
    { id: 'cancellation_pending', label: 'Cancelling' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-text-primary">
            Subscriptions Directory
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Manage your recurring services, billing schedules, and cancellation links.
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

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search by provider or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftAddon={<Search className="w-4 h-4" />}
            aria-label="Search subscriptions"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {statuses.map((status) => (
            <button
              key={status.id}
              onClick={() => setStatusFilter(status.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap min-h-[44px] transition-colors border ${
                statusFilter === status.id
                  ? 'bg-surface-elevated text-accent border-accent/60'
                  : 'bg-surface text-text-secondary border-border hover:text-text-primary'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Subscription List */}
      {filteredSubscriptions.length === 0 ? (
        <div className="border border-border rounded-lg bg-surface p-12 text-center text-text-secondary">
          <p className="text-sm">No subscriptions match your search filter.</p>
        </div>
      ) : (
        <div className="border border-border rounded-lg bg-surface divide-y divide-border overflow-hidden">
          {filteredSubscriptions.map((sub) => {
            const renewalFormatted = new Date(sub.next_renewal_at).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={sub.id}
                onClick={() => onSelectSubscription(sub)}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-elevated/40 transition-colors cursor-pointer"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-surface-elevated border border-border flex items-center justify-center font-bold text-xs text-accent shrink-0">
                    {(sub.display_name || sub.custom_provider_name || 'S').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-text-primary">
                        {sub.display_name || sub.custom_provider_name}
                      </span>
                      {sub.category && (
                        <span className="text-[11px] bg-surface-elevated px-2 py-0.5 rounded text-text-muted border border-border">
                          {sub.category}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-text-muted mt-1 flex items-center gap-2">
                      <span className="capitalize">{sub.billing_interval}</span>
                      <span>•</span>
                      <span>Renews {renewalFormatted}</span>
                      {sub.cancellation_url && (
                        <>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1 text-text-secondary">
                            <ExternalLink className="w-3 h-3" />
                            <span>Destination on file</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-border/40 sm:border-0 pt-2 sm:pt-0">
                  <Badge status={sub.status} size="sm" />
                  <div className="text-right tabular-nums">
                    <span className="font-bold text-base text-text-primary">
                      {formatCurrency(sub.amount, sub.currency)}
                    </span>
                    <span className="text-xs text-text-muted ml-1">/{sub.billing_interval.slice(0, 2)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
