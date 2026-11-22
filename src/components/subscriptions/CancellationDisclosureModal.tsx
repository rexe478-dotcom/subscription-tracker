import React, { useState } from 'react';
import { Subscription, SubscriptionStatus } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { ExternalLink, ShieldAlert, CheckCircle, Clock } from 'lucide-react';

interface CancellationDisclosureModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription | null;
  onConfirmStatusChange: (subscriptionId: string, newStatus: SubscriptionStatus) => void;
}

export const CancellationDisclosureModal: React.FC<CancellationDisclosureModalProps> = ({
  isOpen,
  onClose,
  subscription,
  onConfirmStatusChange,
}) => {
  const [hasOpenedLink, setHasOpenedLink] = useState(false);

  if (!subscription || !subscription.cancellation_url) return null;

  const handleOpenDestination = () => {
    window.open(subscription.cancellation_url!, '_blank', 'noopener,noreferrer');
    setHasOpenedLink(true);
  };

  const handleSetStatus = (status: SubscriptionStatus) => {
    onConfirmStatusChange(subscription.id, status);
    onClose();
    setHasOpenedLink(false);
  };

  const providerName = subscription.display_name || subscription.custom_provider_name || 'Service';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-status-warning" />
            <span>Cancel {providerName}</span>
          </DialogTitle>
          <DialogDescription>
            Official cancellation must be completed directly with the provider.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          {/* Important disclosure banner */}
          <div className="p-3.5 rounded-lg bg-surface border border-border flex flex-col gap-2 text-xs text-text-secondary">
            <span className="font-semibold text-text-primary">How cancellation works:</span>
            <p>
              1. Clicking below opens {providerName}'s official management portal in a new tab.
            </p>
            <p>
              2. Complete the cancellation steps required by the provider.
            </p>
            <p>
              3. Return here and update your record status. <em>Opening the link does not cancel your subscription automatically.</em>
            </p>
          </div>

          {/* Action button to open link */}
          <Button
            variant="primary"
            size="md"
            onClick={handleOpenDestination}
            className="w-full justify-center"
            rightIcon={<ExternalLink className="w-4 h-4" />}
          >
            Open {providerName} Cancellation Page
          </Button>

          {hasOpenedLink && (
            <p className="text-[11px] text-accent text-center font-medium animate-in fade-in">
              External page opened in new tab. Update status below when complete.
            </p>
          )}

          {/* Explicit User Confirmation Controls */}
          <div className="mt-2 pt-4 border-t border-border flex flex-col gap-2.5">
            <span className="text-xs font-semibold text-text-primary">
              Update Subscription Status:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleSetStatus('cancellation_pending')}
                leftIcon={<Clock className="w-3.5 h-3.5 text-status-warning" />}
                className="justify-start text-xs"
              >
                Mark Pending
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleSetStatus('cancelled')}
                leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                className="justify-start text-xs"
              >
                Confirm Cancelled
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button variant="tertiary" size="sm" onClick={onClose}>
            Close (Keep Status Unchanged)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
