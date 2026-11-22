import React, { useState, useEffect } from 'react';
import { Subscription, BillingInterval, SubscriptionStatus, Provider } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/Select';
import { ProviderCombobox } from '@/components/subscriptions/ProviderCombobox';
import { subscriptionSchema } from '@/lib/validation';
import { ExternalLink, ShieldAlert, Sparkles } from 'lucide-react';
import { verifiedProviders } from '@/lib/catalogue';
import { MascotSvg } from '@/components/mascot/MascotSvg';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sub: Partial<Subscription>) => void;
  onDelete?: (id: string) => void;
  onOpenCancellationFlow?: (sub: Subscription) => void;
  subscription?: Subscription | null;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  onOpenCancellationFlow,
  subscription,
}) => {
  const isEditing = Boolean(subscription);

  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [customName, setCustomName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [interval, setInterval] = useState<BillingInterval>('monthly');
  const [status, setStatus] = useState<SubscriptionStatus>('active');
  const [category, setCategory] = useState('Software');
  const [startDate, setStartDate] = useState('');
  const [renewalDate, setRenewalDate] = useState('');
  const [isTrial, setIsTrial] = useState(false);
  const [trialStart, setTrialStart] = useState('');
  const [trialEnd, setTrialEnd] = useState('');
  const [cancellationUrl, setCancellationUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [reminderLeadHours, setReminderLeadHours] = useState('24');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (subscription) {
      const matched = subscription.provider_id
        ? verifiedProviders.find((p) => p.id === subscription.provider_id) || null
        : null;
      setSelectedProvider(matched);
      setCustomName(subscription.custom_provider_name || '');
      setDisplayName(subscription.display_name || '');
      setAmount(subscription.amount.toString());
      setCurrency(subscription.currency);
      setInterval(subscription.billing_interval);
      setStatus(subscription.status);
      setCategory(subscription.category || 'Software');
      setStartDate(subscription.start_date || '');
      setRenewalDate(subscription.next_renewal_at ? subscription.next_renewal_at.slice(0, 10) : '');
      setIsTrial(Boolean(subscription.trial_end_at || subscription.status === 'free_trial'));
      setTrialStart(subscription.trial_start_at ? subscription.trial_start_at.slice(0, 10) : '');
      setTrialEnd(subscription.trial_end_at ? subscription.trial_end_at.slice(0, 10) : '');
      setCancellationUrl(subscription.cancellation_url || '');
      setNotes(subscription.notes || '');
      setReminderLeadHours(subscription.reminder_lead_hours.toString());
    } else {
      setSelectedProvider(null);
      setCustomName('');
      setDisplayName('');
      setAmount('');
      setCurrency('USD');
      setInterval('monthly');
      setStatus('active');
      setCategory('Software');
      setStartDate(new Date().toISOString().slice(0, 10));
      setRenewalDate(new Date(Date.now() + 86400000 * 30).toISOString().slice(0, 10));
      setIsTrial(false);
      setTrialStart('');
      setTrialEnd('');
      setCancellationUrl('');
      setNotes('');
      setReminderLeadHours('24');
    }
    setErrors({});
  }, [subscription, isOpen]);

  const handleSelectCatalogueProvider = (provider: Provider) => {
    setSelectedProvider(provider);
    setCustomName(provider.name);
    if (!displayName) setDisplayName(provider.name);
    if (provider.category) setCategory(provider.category);
    if (provider.cancellation_url) setCancellationUrl(provider.cancellation_url);
  };

  const handleSelectCustom = (name: string) => {
    setSelectedProvider(null);
    setCustomName(name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsedAmount = parseFloat(amount);
    const renewalIso = renewalDate ? new Date(renewalDate).toISOString() : '';
    const trialStartIso = isTrial && trialStart ? new Date(trialStart).toISOString() : null;
    const trialEndIso = isTrial && trialEnd ? new Date(trialEnd).toISOString() : null;

    const payload = {
      id: subscription?.id,
      user_id: subscription?.user_id,
      provider_id: selectedProvider?.id || null,
      custom_provider_name: customName.trim() || selectedProvider?.name || null,
      display_name: displayName.trim() || customName.trim() || selectedProvider?.name || null,
      category: category.trim() || null,
      amount: isNaN(parsedAmount) ? -1 : parsedAmount,
      currency: currency.toUpperCase(),
      billing_interval: interval,
      interval_count: 1,
      start_date: startDate || null,
      next_renewal_at: renewalIso,
      trial_start_at: trialStartIso,
      trial_end_at: trialEndIso,
      status: isTrial ? ('free_trial' as SubscriptionStatus) : status,
      cancellation_url: cancellationUrl.trim() || null,
      notes: notes.trim() || null,
      reminder_enabled: true,
      reminder_lead_hours: parseInt(reminderLeadHours, 10) || 24,
    };

    const result = subscriptionSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0]?.toString() || 'form';
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    onSave(result.data as Partial<Subscription>);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex-1">
            <DialogTitle>{isEditing ? 'Edit Subscription' : 'Add Subscription'}</DialogTitle>
            <DialogDescription>
              Search our verified catalogue or enter custom provider details.
            </DialogDescription>
          </div>
          <MascotSvg
            pose={isTrial ? 'alert' : isEditing ? 'welcome' : 'adding'}
            size={48}
            className="shrink-0 ml-2"
          />
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Provider Combobox */}
          <ProviderCombobox
            selectedProvider={selectedProvider}
            customName={customName}
            onSelectCatalogueProvider={handleSelectCatalogueProvider}
            onSelectCustom={handleSelectCustom}
            error={errors.custom_provider_name}
          />

          <Input
            label="Display Name / Alias (Optional)"
            placeholder="e.g. Work Team License"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />

          {/* Amount and Currency */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Amount *"
              type="number"
              step="0.01"
              placeholder="9.99"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              error={errors.amount}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-secondary">Currency *</label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="CAD">CAD ($)</SelectItem>
                  <SelectItem value="AUD">AUD ($)</SelectItem>
                  <SelectItem value="JPY">JPY (¥)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Billing Interval & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-secondary">Billing Interval *</label>
              <Select value={interval} onValueChange={(val) => setInterval(val as BillingInterval)}>
                <SelectTrigger>
                  <SelectValue placeholder="Interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Every 2 Weeks</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="semiannual">Every 6 Months</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-secondary">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Software">Software & Cloud</SelectItem>
                  <SelectItem value="Utilities">Utilities & Telecom</SelectItem>
                  <SelectItem value="Health">Health & Fitness</SelectItem>
                  <SelectItem value="Productivity">Productivity</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Next Renewal Date & Lead Hours */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Next Renewal Date *"
              type="date"
              value={renewalDate}
              onChange={(e) => setRenewalDate(e.target.value)}
              error={errors.next_renewal_at}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-secondary">Reminder Lead Time</label>
              <Select value={reminderLeadHours} onValueChange={setReminderLeadHours}>
                <SelectTrigger>
                  <SelectValue placeholder="Reminder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24">24 hours before</SelectItem>
                  <SelectItem value="48">48 hours before</SelectItem>
                  <SelectItem value="72">3 days before</SelectItem>
                  <SelectItem value="168">7 days before</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Free Trial Toggle */}
          <div className="p-3 rounded-md bg-surface border border-border flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isTrial}
                onChange={(e) => setIsTrial(e.target.checked)}
                className="w-4 h-4 rounded text-accent accent-accent"
              />
              <span className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-status-warning" />
                <span>Currently on Free Trial</span>
              </span>
            </label>
            {isTrial && (
              <div className="grid grid-cols-2 gap-3 mt-1">
                <Input
                  label="Trial Start Date"
                  type="date"
                  value={trialStart}
                  onChange={(e) => setTrialStart(e.target.value)}
                />
                <Input
                  label="Trial End Date *"
                  type="date"
                  value={trialEnd}
                  onChange={(e) => setTrialEnd(e.target.value)}
                  error={errors.trial_end_at}
                />
              </div>
            )}
          </div>

          {/* Cancellation URL & Disclosure Handler */}
          <div className="flex flex-col gap-1.5">
            <Input
              label="Official Cancellation Destination (Optional)"
              placeholder="https://provider.com/account/cancel"
              value={cancellationUrl}
              onChange={(e) => setCancellationUrl(e.target.value)}
              error={errors.cancellation_url}
              helperText="Verified HTTPS management or cancellation page."
            />

            {cancellationUrl && isEditing && subscription && onOpenCancellationFlow && (
              <div className="p-2.5 rounded bg-surface border border-border flex items-center justify-between mt-1 text-xs">
                <div className="flex items-center gap-2 text-text-muted">
                  <ShieldAlert className="w-4 h-4 text-status-warning shrink-0" />
                  <span>Cancellation flow available</span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    onClose();
                    onOpenCancellationFlow(subscription);
                  }}
                  leftIcon={<ExternalLink className="w-3 h-3 text-accent" />}
                >
                  Manage Cancellation
                </Button>
              </div>
            )}
          </div>

          {/* Notes */}
          <Input
            label="Notes (Optional)"
            placeholder="e.g. Billed annually to corporate card"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          {/* Status selector (when editing) */}
          {isEditing && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-secondary">Subscription Status</label>
              <Select value={status} onValueChange={(val) => setStatus(val as SubscriptionStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="cancellation_pending">Cancellation Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter className="mt-4">
            {isEditing && onDelete && subscription?.id && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (confirm('Delete this subscription record permanently?')) {
                    onDelete(subscription.id);
                    onClose();
                  }
                }}
                className="mr-auto"
              >
                Delete
              </Button>
            )}
            <Button variant="tertiary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {isEditing ? 'Save Changes' : 'Add Subscription'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
