import React from 'react';
import {
  LayoutDashboard,
  CreditCard,
  Calendar,
  BarChart3,
  Settings,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { MascotSvg } from '@/components/mascot/MascotSvg';
import { OfflineBanner } from '@/components/ui/OfflineBanner';

export type NavigationTab =
  | 'home'
  | 'subscriptions'
  | 'calendar'
  | 'analytics'
  | 'settings';

interface AppShellProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  onAddSubscription?: () => void;
  children: React.ReactNode;
}

const navItems: { id: NavigationTab; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'home', label: 'Home', icon: LayoutDashboard },
  { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const AppShell: React.FC<AppShellProps> = ({
  currentTab,
  onTabChange,
  onAddSubscription,
  children,
}) => {
  return (
    <div className="min-h-screen bg-bg text-text-primary flex flex-col md:flex-row">
      {/* Desktop Sidebar (visible on md+) */}
      <aside className="hidden md:flex md:w-64 flex-col border-r border-border bg-surface shrink-0 p-4 justify-between">
        <div className="flex flex-col gap-6">
          {/* Brand & Mascot */}
          <div className="flex items-center gap-3 px-2">
            <MascotSvg pose="icon" size={32} />
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-text-primary leading-tight">
                Subscription Tracker
              </h1>
              <p className="text-[11px] text-text-muted">Personal & Private</p>
            </div>
          </div>

          {/* Quick Add CTA */}
          <Button
            variant="primary"
            size="md"
            className="w-full justify-center"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={onAddSubscription}
          >
            Add Subscription
          </Button>

          {/* Nav Links */}
          <nav className="flex flex-col gap-1" aria-label="Desktop Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-left min-h-[44px]',
                    isActive
                      ? 'bg-surface-elevated text-accent font-semibold border border-border/80'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated/40'
                  )}
                >
                  <Icon className={cn('w-4 h-4', isActive ? 'text-accent' : 'text-text-muted')} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-border px-2 text-[11px] text-text-muted flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-status-success inline-block"></span>
            <span>Data stored locally & RLS secured</span>
          </div>
          <span>v0.1.0 • PWA Ready</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen pb-20 md:pb-0 overflow-x-hidden">
        {/* Offline notification banner */}
        <OfflineBanner />

        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-surface sticky top-0 z-40">
          <div className="flex items-center gap-2.5">
            <MascotSvg pose="icon" size={28} />
            <h1 className="text-sm font-semibold tracking-tight text-text-primary">
              Subscription Tracker
            </h1>
          </div>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={onAddSubscription}
            aria-label="Add Subscription"
          >
            Add
          </Button>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation (fixed at bottom for mobile) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-surface/95 backdrop-blur-md z-40 px-2 py-1 flex items-center justify-around"
        aria-label="Mobile Navigation"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex flex-col items-center justify-center min-w-[56px] min-h-[48px] rounded-md transition-colors gap-1 text-[11px]',
                isActive ? 'text-accent font-semibold' : 'text-text-muted hover:text-text-secondary'
              )}
            >
              <Icon className={cn('w-5 h-5', isActive ? 'text-accent' : 'text-text-muted')} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
