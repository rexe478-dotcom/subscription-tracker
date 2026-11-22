import React from 'react';
import { cn } from '@/lib/utils';
import { SubscriptionStatus } from '@/types';
import { CheckCircle2, Clock, XCircle, PauseCircle, Sparkles } from 'lucide-react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: SubscriptionStatus;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md';
}

const statusConfig: Record<
  SubscriptionStatus,
  { label: string; variant: 'success' | 'warning' | 'danger' | 'neutral'; icon: React.ReactNode }
> = {
  active: {
    label: 'Active',
    variant: 'success',
    icon: <CheckCircle2 className="w-3 h-3 shrink-0" aria-hidden="true" />,
  },
  free_trial: {
    label: 'Free Trial',
    variant: 'warning',
    icon: <Sparkles className="w-3 h-3 shrink-0" aria-hidden="true" />,
  },
  cancellation_pending: {
    label: 'Cancellation Pending',
    variant: 'warning',
    icon: <Clock className="w-3 h-3 shrink-0" aria-hidden="true" />,
  },
  cancelled: {
    label: 'Cancelled',
    variant: 'neutral',
    icon: <XCircle className="w-3 h-3 shrink-0" aria-hidden="true" />,
  },
  expired: {
    label: 'Expired',
    variant: 'danger',
    icon: <XCircle className="w-3 h-3 shrink-0" aria-hidden="true" />,
  },
  paused: {
    label: 'Paused',
    variant: 'neutral',
    icon: <PauseCircle className="w-3 h-3 shrink-0" aria-hidden="true" />,
  },
};

export const Badge: React.FC<BadgeProps> = ({
  className,
  status,
  variant: explicitVariant,
  size = 'md',
  children,
  ...props
}) => {
  const config = status ? statusConfig[status] : null;
  const variant = explicitVariant || config?.variant || 'neutral';
  const label = children || config?.label;
  const icon = config?.icon;

  const variantStyles = {
    success: 'bg-status-success/15 text-status-success border-status-success/30',
    warning: 'bg-status-warning/15 text-status-warning border-status-warning/30',
    danger: 'bg-status-danger/15 text-status-danger border-status-danger/30',
    neutral: 'bg-surface-elevated text-text-secondary border-border',
    default: 'bg-surface text-text-primary border-border',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 min-h-[22px]',
    md: 'text-xs px-2.5 py-1 gap-1.5 min-h-[26px]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border leading-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {icon}
      <span>{label}</span>
    </span>
  );
};
