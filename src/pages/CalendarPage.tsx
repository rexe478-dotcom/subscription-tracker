import React, { useState } from 'react';
import { Subscription } from '@/types';
import { formatCurrency } from '@/lib/currency';
import { getDaysInMonth, getDaysUntil } from '@/lib/recurrence';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles, Grid, List } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface CalendarPageProps {
  subscriptions: Subscription[];
  onSelectSubscription: (sub: Subscription) => void;
}

export const CalendarPage: React.FC<CalendarPageProps> = ({
  subscriptions,
  onSelectSubscription,
}) => {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(() => new Date().getUTCDate());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const year = currentDate.getUTCFullYear();
  const month = currentDate.getUTCMonth(); // 0-indexed

  const daysInCurrentMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = new Date(Date.UTC(year, month, 1)).getUTCDay(); // 0 = Sunday

  const prevMonth = () => {
    setCurrentDate(new Date(Date.UTC(year, month - 1, 1)));
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(Date.UTC(year, month + 1, 1)));
    setSelectedDay(null);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDay(today.getUTCDate());
  };

  // Map events for the current month
  const eventsByDay = new Map<number, { renewals: Subscription[]; trials: Subscription[] }>();
  const monthlyAllEvents: { day: number; dateStr: string; sub: Subscription; type: 'renewal' | 'trial' }[] = [];

  subscriptions.forEach((sub) => {
    const renewalDate = new Date(sub.next_renewal_at);
    if (renewalDate.getUTCFullYear() === year && renewalDate.getUTCMonth() === month) {
      const day = renewalDate.getUTCDate();
      const existing = eventsByDay.get(day) || { renewals: [], trials: [] };
      existing.renewals.push(sub);
      eventsByDay.set(day, existing);

      monthlyAllEvents.push({
        day,
        dateStr: renewalDate.toISOString().slice(0, 10),
        sub,
        type: 'renewal',
      });
    }

    if (sub.trial_end_at) {
      const trialDate = new Date(sub.trial_end_at);
      if (trialDate.getUTCFullYear() === year && trialDate.getUTCMonth() === month) {
        const day = trialDate.getUTCDate();
        const existing = eventsByDay.get(day) || { renewals: [], trials: [] };
        existing.trials.push(sub);
        eventsByDay.set(day, existing);

        monthlyAllEvents.push({
          day,
          dateStr: trialDate.toISOString().slice(0, 10),
          sub,
          type: 'trial',
        });
      }
    }
  });

  // Sort chronological list
  monthlyAllEvents.sort((a, b) => a.day - b.day);

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const weekDayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const selectedEvents = selectedDay ? eventsByDay.get(selectedDay) : null;

  return (
    <div className="flex flex-col gap-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-text-primary">
            Renewal Schedule
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Review upcoming renewal dates and free-trial expirations across the month.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* View mode toggle */}
          <div className="flex items-center bg-surface border border-border rounded-lg p-1">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="Month Grid View"
              className={cn(
                'p-1.5 rounded transition-colors',
                viewMode === 'grid' ? 'bg-surface-elevated text-accent' : 'text-text-muted hover:text-text-primary'
              )}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              aria-label="Agenda List View"
              className={cn(
                'p-1.5 rounded transition-colors',
                viewMode === 'list' ? 'bg-surface-elevated text-accent' : 'text-text-muted hover:text-text-primary'
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center bg-surface border border-border rounded-lg p-1">
            <button
              onClick={prevMonth}
              aria-label="Previous month"
              className="p-1.5 rounded hover:bg-surface-elevated text-text-secondary hover:text-text-primary min-touch-target flex items-center justify-center"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold text-text-primary px-3 min-w-[130px] text-center select-none">
              {monthName}
            </span>
            <button
              onClick={nextMonth}
              aria-label="Next month"
              className="p-1.5 rounded hover:bg-surface-elevated text-text-secondary hover:text-text-primary min-touch-target flex items-center justify-center"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <Button variant="secondary" size="sm" onClick={goToToday} className="hidden sm:inline-flex">
            Today
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        /* Month Grid */
        <div className="border border-border rounded-lg bg-surface overflow-hidden shadow-sm">
          {/* Day of Week Header */}
          <div className="grid grid-cols-7 border-b border-border bg-surface-elevated/40 text-center py-2.5 text-xs font-semibold text-text-secondary">
            {weekDayLabels.map((lbl) => (
              <div key={lbl}>{lbl}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 divide-x divide-y divide-border/60">
            {/* Blank cells before start of month */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[72px] sm:min-h-[96px] bg-bg/25 p-1.5" />
            ))}

            {/* Actual Month Days */}
            {Array.from({ length: daysInCurrentMonth }).map((_, i) => {
              const dayNum = i + 1;
              const events = eventsByDay.get(dayNum);
              const hasRenewals = events && events.renewals.length > 0;
              const hasTrials = events && events.trials.length > 0;
              const isSelected = selectedDay === dayNum;

              return (
                <button
                  key={`day-${dayNum}`}
                  type="button"
                  onClick={() => setSelectedDay(dayNum)}
                  className={cn(
                    'min-h-[72px] sm:min-h-[96px] p-2 text-left transition-colors flex flex-col justify-between',
                    isSelected
                      ? 'bg-surface-elevated ring-1 ring-accent'
                      : 'hover:bg-surface-elevated/40'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        'text-xs font-medium tabular-nums px-1.5 py-0.5 rounded',
                        isSelected ? 'bg-accent text-bg font-bold' : 'text-text-secondary'
                      )}
                    >
                      {dayNum}
                    </span>
                  </div>

                  {/* Badges on Date */}
                  <div className="flex flex-col gap-1 mt-1">
                    {hasTrials && (
                      <span className="text-[10px] bg-status-warning/20 text-status-warning border border-status-warning/30 px-1 py-0.5 rounded truncate flex items-center gap-1 font-medium">
                        <Sparkles className="w-2.5 h-2.5 shrink-0" />
                        <span className="truncate">{events.trials.length} trial</span>
                      </span>
                    )}
                    {hasRenewals && (
                      <span className="text-[10px] bg-accent/15 text-accent border border-accent/30 px-1 py-0.5 rounded truncate font-medium">
                        {events.renewals.length} renew
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Chronological Agenda List View */
        <div className="border border-border rounded-lg bg-surface divide-y divide-border overflow-hidden">
          {monthlyAllEvents.length === 0 ? (
            <div className="p-8 text-center text-text-secondary text-sm">
              No renewals or trial expirations scheduled in {monthName}.
            </div>
          ) : (
            monthlyAllEvents.map((item, idx) => {
              const isTrial = item.type === 'trial';
              const daysLeft = getDaysUntil(item.sub.next_renewal_at);

              return (
                <div
                  key={`${item.sub.id}-${idx}`}
                  onClick={() => onSelectSubscription(item.sub)}
                  className="p-4 flex items-center justify-between hover:bg-surface-elevated/40 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-md border flex flex-col items-center justify-center shrink-0 font-bold',
                        isTrial
                          ? 'bg-status-warning/15 border-status-warning/30 text-status-warning'
                          : 'bg-surface-elevated border-border text-accent'
                      )}
                    >
                      <span className="text-[10px] font-normal uppercase leading-none">
                        {monthName.slice(0, 3)}
                      </span>
                      <span className="text-sm font-bold tabular-nums leading-none mt-0.5">
                        {item.day}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-text-primary">
                          {item.sub.display_name || item.sub.custom_provider_name}
                        </span>
                        {isTrial && (
                          <span className="text-[10px] bg-status-warning/20 text-status-warning px-1.5 py-0.5 rounded border border-status-warning/30 flex items-center gap-1 font-medium">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>Trial Ending</span>
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-text-muted mt-0.5 capitalize">
                        {item.sub.billing_interval} • {item.sub.category || 'General'}
                      </div>
                    </div>
                  </div>

                  <div className="text-right tabular-nums">
                    <div className="text-sm font-bold text-text-primary">
                      {formatCurrency(item.sub.amount, item.sub.currency)}
                    </div>
                    <div className="text-xs text-text-muted">
                      {daysLeft <= 0 ? 'Due today' : `In ${daysLeft}d`}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Selected Day Agenda Drawer (when in Grid view) */}
      {viewMode === 'grid' && selectedDay && (
        <div className="border border-border rounded-lg bg-surface p-4 flex flex-col gap-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-2.5">
            <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-accent" />
              <span>Events for {monthName.split(' ')[0]} {selectedDay}</span>
            </h4>
            <span className="text-xs text-text-muted">
              {((selectedEvents?.renewals.length || 0) + (selectedEvents?.trials.length || 0))} scheduled
            </span>
          </div>

          {!selectedEvents || (selectedEvents.renewals.length === 0 && selectedEvents.trials.length === 0) ? (
            <p className="text-xs text-text-muted py-3">No renewals or free-trial expirations on this day.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {selectedEvents.trials.map((sub) => (
                <div
                  key={`trial-${sub.id}`}
                  onClick={() => onSelectSubscription(sub)}
                  className="p-3 rounded bg-status-warning/10 border border-status-warning/30 flex items-center justify-between cursor-pointer hover:bg-status-warning/15 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-status-warning shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-text-primary">
                        {sub.display_name || sub.custom_provider_name}
                      </div>
                      <div className="text-xs text-status-warning font-medium">Free trial expires on this date</div>
                    </div>
                  </div>
                  <Badge status="free_trial" size="sm" />
                </div>
              ))}

              {selectedEvents.renewals.map((sub) => (
                <div
                  key={`renewal-${sub.id}`}
                  onClick={() => onSelectSubscription(sub)}
                  className="p-3 rounded bg-surface-elevated border border-border flex items-center justify-between cursor-pointer hover:border-accent/60 transition-colors"
                >
                  <div>
                    <div className="text-sm font-semibold text-text-primary">
                      {sub.display_name || sub.custom_provider_name}
                    </div>
                    <div className="text-xs text-text-muted capitalize">{sub.billing_interval} renewal</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-text-primary tabular-nums">
                      {formatCurrency(sub.amount, sub.currency)}
                    </div>
                    <Badge status={sub.status} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
