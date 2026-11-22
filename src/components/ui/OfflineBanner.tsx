import React from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { WifiOff } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const isOnline = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-status-warning/15 border-b border-status-warning/30 px-4 py-2 text-xs text-status-warning flex items-center justify-center gap-2 text-center"
    >
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>
        <strong>Offline mode:</strong> Viewing locally cached subscriptions. Any changes will synchronize when your connection is restored.
      </span>
    </div>
  );
};
