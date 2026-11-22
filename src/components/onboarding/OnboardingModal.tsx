import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { MascotSvg, MascotPose } from '@/components/mascot/MascotSvg';
import { ProviderCombobox } from '@/components/subscriptions/ProviderCombobox';
import { Provider, Subscription } from '@/types';
import { ArrowRight, CheckCircle2, Bell, Calendar, Sparkles, ShieldCheck } from 'lucide-react';
import { requestNotificationPermission } from '@/lib/push';

interface OnboardingModalProps {
  open: boolean;
  onClose: () => void;
  onAddFirstSubscription?: (sub: Partial<Subscription>) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  open,
  onClose,
  onAddFirstSubscription,
}) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 4;

  // Selected quick subscription for Step 2
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [customName, setCustomName] = useState<string>('');
  const [amount, setAmount] = useState<string>('12.99');
  const [currency, setCurrency] = useState<string>('USD');
  const [pushStatus, setPushStatus] = useState<'idle' | 'granted' | 'denied'>('idle');

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('kori_onboarding_completed', 'true');
    if (selectedProvider && onAddFirstSubscription) {
      const parsedAmount = parseFloat(amount) || 9.99;
      onAddFirstSubscription({
        provider_id: selectedProvider.id,
        custom_provider_name: selectedProvider.name,
        display_name: selectedProvider.name,
        amount: parsedAmount,
        currency: currency,
        billing_interval: 'monthly',
        interval_count: 1,
        category: selectedProvider.category || 'Software',
        start_date: new Date().toISOString().slice(0, 10),
        next_renewal_at: new Date(Date.now() + 86400000 * 30).toISOString(),
        cancellation_url: selectedProvider.cancellation_url || null,
        status: 'active',
        reminder_enabled: true,
      });
    }
    onClose();
  };

  const handleRequestPush = async () => {
    const granted = await requestNotificationPermission();
    setPushStatus(granted ? 'granted' : 'denied');
  };

  const getMascotPoseForStep = (currentStep: number): MascotPose => {
    switch (currentStep) {
      case 1:
        return 'welcome';
      case 2:
        return 'empty';
      case 3:
        return 'reminder';
      case 4:
        return 'celebrate';
      default:
        return 'welcome';
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleComplete()}>
      <DialogContent className="max-w-lg p-0 overflow-hidden bg-surface border border-border shadow-2xl rounded-2xl">
        {/* Step Progress Bar */}
        <div className="w-full bg-surface-raised h-1">
          <div
            className="bg-accent h-1 transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {/* Header & Mascot */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative group">
              <MascotSvg
                pose={getMascotPoseForStep(step)}
                size={110}
                className="transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute bottom-0 right-0 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-surface-raised border border-border rounded-full text-accent">
                Kori • The Swift Familiar
              </span>
            </div>

            {/* Step 1: Welcome */}
            {step === 1 && (
              <div className="space-y-2 mt-2">
                <h2 className="text-2xl font-bold tracking-tight text-text-primary">
                  Welcome to Subscription Tracker
                </h2>
                <p className="text-sm text-text-secondary max-w-sm mx-auto leading-relaxed">
                  I am Kori, your personal swift familiar. I help you track recurring commitments,
                  forecast renewals across currencies, and prevent sneaky trial charges.
                </p>
                <div className="grid grid-cols-1 gap-2.5 pt-4 text-left max-w-sm mx-auto text-xs text-text-secondary">
                  <div className="flex items-start space-x-2.5 bg-surface-raised/60 p-2.5 rounded-lg border border-border">
                    <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span><strong>No Gmail reading or bank scraping:</strong> Your data is strictly private and manually controlled.</span>
                  </div>
                  <div className="flex items-start space-x-2.5 bg-surface-raised/60 p-2.5 rounded-lg border border-border">
                    <Calendar className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span><strong>Isolated currencies:</strong> Unlike currencies are never silently converted or distorted.</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Add First Subscription */}
            {step === 2 && (
              <div className="space-y-2 mt-2 w-full">
                <h2 className="text-xl font-bold text-text-primary">Add your first subscription</h2>
                <p className="text-xs text-text-secondary max-w-sm mx-auto">
                  Pick a popular service or type custom. You can always edit or add more later.
                </p>

                <div className="pt-3 text-left space-y-3">
                  <div>
                    <label className="text-xs font-medium text-text-secondary block mb-1">
                      Search Provider Catalogue
                    </label>
                    <ProviderCombobox
                      selectedProvider={selectedProvider}
                      customName={customName}
                      onSelectCatalogueProvider={(p: Provider) => {
                        setSelectedProvider(p);
                        setCustomName(p.name);
                      }}
                      onSelectCustom={(name: string) => {
                        setSelectedProvider(null);
                        setCustomName(name);
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-text-secondary block mb-1">Amount</label>
                      <input
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-surface-raised border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-text-secondary block mb-1">Currency</label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full bg-surface-raised border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="CAD">CAD ($)</option>
                        <option value="AUD">AUD ($)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Renewal & Proactive Reminders */}
            {step === 3 && (
              <div className="space-y-3 mt-2 text-center">
                <h2 className="text-xl font-bold text-text-primary">Never miss a renewal or trial end</h2>
                <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed">
                  Kori prepares reminders 7 days, 3 days, and 24 hours before your billing date.
                  You can enable device push notifications now or manage them later in Settings.
                </p>

                <div className="bg-surface-raised p-4 rounded-xl border border-border text-left space-y-3 max-w-sm mx-auto">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <Bell className="w-5 h-5 text-accent" />
                      <div>
                        <div className="text-xs font-semibold text-text-primary">Device Push Alerts</div>
                        <div className="text-[11px] text-text-secondary">Direct browser & PWA notifications</div>
                      </div>
                    </div>
                    {pushStatus === 'granted' ? (
                      <span className="flex items-center text-xs text-accent font-medium space-x-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Enabled</span>
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleRequestPush}
                        className="text-xs py-1 px-2.5 h-auto"
                      >
                        {pushStatus === 'denied' ? 'Denied' : 'Enable Push'}
                      </Button>
                    )}
                  </div>
                  <div className="text-[11px] text-text-secondary border-t border-border/50 pt-2">
                    💡 <em>Note: Notifications are strictly opt-in and will never spam you.</em>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Ready to explore */}
            {step === 4 && (
              <div className="space-y-2 mt-2 text-center">
                <h2 className="text-xl font-bold text-text-primary">You are all set!</h2>
                <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed">
                  Your workspace is ready. You can view calendar timelines, track category distributions,
                  and export your clean data at any time.
                </p>
                <div className="bg-accent/10 border border-accent/20 rounded-xl p-3 text-left max-w-sm mx-auto flex items-start space-x-2.5">
                  <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span className="text-xs text-text-primary">
                    Whenever you need assistance or want to review cancellation procedures, Kori is here to guide you.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            {step > 1 ? (
              <Button variant="tertiary" size="sm" onClick={handleBack} className="text-xs">
                Back
              </Button>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                className="text-xs text-text-secondary hover:text-text-primary transition-colors"
              >
                Skip for now
              </button>
            )}

            <div className="flex items-center space-x-2">
              <div className="text-[11px] text-text-secondary font-mono mr-2">
                {step} of {totalSteps}
              </div>
              <Button size="sm" onClick={handleNext} className="space-x-1 text-xs">
                <span>{step === totalSteps ? 'Get Started' : 'Continue'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
