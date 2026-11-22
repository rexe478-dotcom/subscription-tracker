import React from 'react';
import { Subscription } from '@/types';
import { formatCurrency, groupSubscriptionsByCurrency } from '@/lib/currency';
import { PieChart, Info, Layers, CheckCircle2 } from 'lucide-react';

interface AnalyticsPageProps {
  subscriptions: Subscription[];
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ subscriptions }) => {
  const currencyGroups = groupSubscriptionsByCurrency(subscriptions);

  // Group by category for a currency
  const getCategoryBreakdown = (subs: Subscription[]) => {
    const map = new Map<string, number>();
    subs.forEach((s) => {
      const cat = s.category || 'General';
      map.set(cat, (map.get(cat) || 0) + s.amount);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  };

  // Group by billing interval for a currency
  const getIntervalBreakdown = (subs: Subscription[]) => {
    const map = new Map<string, { count: number; totalAmount: number }>();
    subs.forEach((s) => {
      const interval = s.billing_interval;
      const existing = map.get(interval) || { count: 0, totalAmount: 0 };
      existing.count += 1;
      existing.totalAmount += s.amount;
      map.set(interval, existing);
    });
    return Array.from(map.entries()).sort((a, b) => b[1].totalAmount - a[1].totalAmount);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-text-primary">
          Spending & Analytics
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Normalized recurring expenditures grouped strictly by currency.
        </p>
      </div>

      {/* Recurrence Explanation Banner */}
      <div className="bg-surface border border-border rounded-lg p-4 flex items-start gap-3 text-xs text-text-secondary">
        <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-text-primary">Recurrence Normalization Methodology</span>
          <p>
            To give an accurate comparative view, expenditures are normalized to their calendar equivalents:
            weekly ($\times 52 / 12$), bi-weekly ($\times 26 / 12$), quarterly ($/ 3$), and yearly ($/ 12$).
            Unlike currencies are never aggregated or converted in v1 to preserve precision.
          </p>
        </div>
      </div>

      {currencyGroups.length === 0 ? (
        <div className="border border-border rounded-lg bg-surface p-12 text-center text-text-secondary">
          <PieChart className="w-10 h-10 mx-auto mb-3 opacity-40 text-text-muted" />
          <p className="text-sm">No active subscriptions available to analyze.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {currencyGroups.map((group) => {
            const categories = getCategoryBreakdown(group.subscriptions);
            const intervals = getIntervalBreakdown(group.subscriptions);
            const totalMonthly = group.totalMonthlyEstimate;

            return (
              <div
                key={group.currency}
                className="border border-border rounded-lg bg-surface p-6 flex flex-col gap-6 shadow-sm"
              >
                {/* Header for Currency Group */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4 gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                      <span>{group.currency} Portfolio</span>
                      <span className="text-xs font-normal text-text-muted bg-surface-elevated px-2 py-0.5 rounded border border-border">
                        {group.activeCount} active {group.activeCount === 1 ? 'service' : 'services'}
                      </span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-6 tabular-nums">
                    <div>
                      <div className="text-[11px] text-text-muted uppercase tracking-wider">Normalized Monthly</div>
                      <div className="text-xl font-bold text-text-primary">
                        {formatCurrency(group.totalMonthlyEstimate, group.currency)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-text-muted uppercase tracking-wider">Annual Projection</div>
                      <div className="text-xl font-bold text-accent">
                        {formatCurrency(group.totalAnnualProjection, group.currency)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Two Column Grid: Categories & Intervals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category Breakdown */}
                  <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                      Spend by Category
                    </h4>
                    <div className="flex flex-col gap-3">
                      {categories.map(([category, amount]) => {
                        const percentage = Math.round((amount / (totalMonthly || 1)) * 100);
                        return (
                          <div key={category} className="flex flex-col gap-1">
                            <div className="flex justify-between text-xs tabular-nums">
                              <span className="font-medium text-text-primary">{category}</span>
                              <span className="text-text-muted">
                                {formatCurrency(amount, group.currency)}
                              </span>
                            </div>
                            <div className="h-1.5 w-full bg-surface-elevated rounded-full overflow-hidden border border-border/40">
                              <div
                                className="h-full bg-accent rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Interval Breakdown */}
                  <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-accent" />
                      <span>Billing Interval Distribution</span>
                    </h4>
                    <div className="divide-y divide-border/60 bg-surface-elevated/40 rounded-md border border-border p-3">
                      {intervals.map(([interval, data]) => (
                        <div
                          key={interval}
                          className="py-2 first:pt-0 last:pb-0 flex items-center justify-between text-xs tabular-nums"
                        >
                          <div className="flex items-center gap-2">
                            <span className="capitalize font-medium text-text-primary">{interval}</span>
                            <span className="text-[11px] text-text-muted">({data.count})</span>
                          </div>
                          <span className="font-semibold text-text-secondary">
                            {formatCurrency(data.totalAmount, group.currency)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Subscriptions Table List */}
                <div className="pt-2 border-t border-border/60">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                    Included Subscriptions
                  </h4>
                  <div className="divide-y divide-border/60">
                    {group.subscriptions.map((sub) => (
                      <div
                        key={sub.id}
                        className="py-2.5 flex items-center justify-between text-xs tabular-nums"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                          <span className="text-text-primary font-medium">
                            {sub.display_name || sub.custom_provider_name}
                          </span>
                          {sub.category && (
                            <span className="text-[10px] bg-surface-elevated px-1.5 py-0.5 rounded text-text-muted border border-border hidden sm:inline-block">
                              {sub.category}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-text-muted capitalize">{sub.billing_interval}</span>
                          <span className="font-bold text-text-primary">
                            {formatCurrency(sub.amount, sub.currency)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Historical Spend Transparency Box */}
      <div className="border border-border rounded-lg bg-surface p-5 text-xs text-text-muted flex flex-col gap-1">
        <span className="font-semibold text-text-secondary">Historical Spend Tracking</span>
        <p>
          Historical monthly spending graphs require verified transaction settlement data.
          In accordance with product integrity guidelines, fabricated history curves are not displayed.
        </p>
      </div>
    </div>
  );
};
