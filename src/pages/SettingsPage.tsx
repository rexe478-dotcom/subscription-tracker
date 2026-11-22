import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/Select';
import { Bell, Mail, Download, Trash2, Shield, Sparkles, Check, AlertCircle } from 'lucide-react';
import { MascotSvg } from '@/components/mascot/MascotSvg';
import { Subscription } from '@/types';
import { isPushSupported, getNotificationPermission, subscribeToPush, unsubscribeFromPush } from '@/lib/push';
import { useAuth } from '@/context/AuthContext';

interface SettingsPageProps {
  subscriptions: Subscription[];
  onRestartOnboarding?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ subscriptions, onRestartOnboarding }) => {
  const { user } = useAuth();
  const [defaultCurrency, setDefaultCurrency] = useState('USD');
  const [leadHours, setLeadHours] = useState('24');
  const [pushStatus, setPushStatus] = useState<'granted' | 'denied' | 'default'>('default');
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [pushLoading, setPushLoading] = useState(false);
  const [pushMessage, setPushMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isPushSupported()) {
      setPushStatus(getNotificationPermission());
    }
  }, []);

  const handleTogglePush = async () => {
    if (!user) return;
    setPushLoading(true);
    setPushMessage(null);

    try {
      if (pushStatus === 'granted') {
        await unsubscribeFromPush(user.id);
        setPushStatus('default');
        setPushMessage('Push notifications disabled on this device.');
      } else {
        const result = await subscribeToPush(user.id);
        if (result.success) {
          setPushStatus('granted');
          setPushMessage('Push notifications successfully enabled!');
        } else {
          setPushMessage(result.error || 'Failed to enable push notifications.');
        }
      }
    } finally {
      setPushLoading(false);
    }
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(subscriptions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `subscription_tracker_export_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const pushSupported = isPushSupported();

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-text-primary">
          Settings & Preferences
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Customize currency defaults, reminder timings, and manage your private data.
        </p>
      </div>

      {/* Mascot & Brand Section */}
      <div className="border border-border rounded-lg bg-surface p-6 flex flex-col sm:flex-row items-center gap-6">
        <MascotSvg pose="welcome" size={100} />
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <h3 className="text-base font-semibold text-text-primary flex items-center justify-center sm:justify-start gap-2">
            <span>Meet Kori, The Swift Familiar</span>
            <span className="text-[11px] bg-accent/15 text-accent px-2 py-0.5 rounded font-medium border border-accent/30">
              Official Mascot
            </span>
          </h3>
          <p className="text-xs text-text-secondary max-w-md">
            Quiet, observant, and organized. Kori monitors your renewal cycles and alerts you before free trials expire or recurring payments process.
          </p>
          {onRestartOnboarding && (
            <div className="pt-2 flex justify-center sm:justify-start">
              <Button
                variant="secondary"
                size="sm"
                onClick={onRestartOnboarding}
                className="text-xs py-1.5 h-auto"
              >
                Launch Kori Onboarding Tour
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Preferences Section */}
      <div className="border border-border rounded-lg bg-surface p-6 flex flex-col gap-5">
        <h3 className="text-base font-semibold text-text-primary border-b border-border pb-3">
          App Preferences
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-secondary">Default Currency</label>
            <Select value={defaultCurrency} onValueChange={setDefaultCurrency}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($) - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR (€) - Euro</SelectItem>
                <SelectItem value="GBP">GBP (£) - British Pound</SelectItem>
                <SelectItem value="CAD">CAD ($) - Canadian Dollar</SelectItem>
                <SelectItem value="AUD">AUD ($) - Australian Dollar</SelectItem>
                <SelectItem value="JPY">JPY (¥) - Japanese Yen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-secondary">Default Reminder Timing</label>
            <Select value={leadHours} onValueChange={setLeadHours}>
              <SelectTrigger>
                <SelectValue placeholder="Select timing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24">24 hours before renewal (Default)</SelectItem>
                <SelectItem value="48">48 hours before renewal</SelectItem>
                <SelectItem value="72">3 days before renewal</SelectItem>
                <SelectItem value="168">7 days before renewal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Notification Channels */}
      <div className="border border-border rounded-lg bg-surface p-6 flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-3 gap-1">
          <h3 className="text-base font-semibold text-text-primary">
            Reminder Channels
          </h3>
          <span className="text-xs font-normal text-text-muted">Independent push & email scheduling</span>
        </div>

        {pushMessage && (
          <div className="p-3 bg-surface-elevated border border-border rounded-md text-xs text-text-primary flex items-center gap-2">
            <Check className="w-4 h-4 text-accent" />
            <span>{pushMessage}</span>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {/* Email channel */}
          <div className="flex items-center justify-between p-3.5 rounded-md bg-surface-elevated border border-border">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-accent shrink-0" />
              <div>
                <div className="text-sm font-semibold text-text-primary">Email Notifications</div>
                <div className="text-xs text-text-muted">Direct to your registered email address</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setEmailEnabled(!emailEnabled)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md min-h-[36px] transition-colors border ${
                emailEnabled ? 'bg-accent text-bg font-bold border-accent' : 'bg-surface text-text-muted border-border'
              }`}
            >
              {emailEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Web Push channel */}
          <div className="flex flex-col p-3.5 rounded-md bg-surface-elevated border border-border gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-accent shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-text-primary">Browser & Device Push</div>
                  <div className="text-xs text-text-muted">
                    {pushSupported
                      ? `Status: ${pushStatus === 'granted' ? 'Active' : pushStatus === 'denied' ? 'Permission Denied' : 'Inactive'}`
                      : 'Push notifications are not supported by this browser.'}
                  </div>
                </div>
              </div>

              {pushSupported ? (
                <Button
                  variant={pushStatus === 'granted' ? 'secondary' : 'primary'}
                  size="sm"
                  isLoading={pushLoading}
                  onClick={handleTogglePush}
                >
                  {pushStatus === 'granted' ? 'Disable Push' : 'Enable Push'}
                </Button>
              ) : (
                <span className="text-xs text-text-muted">Unsupported</span>
              )}
            </div>

            {/* iOS Platform Note */}
            <div className="pt-2 border-t border-border/40 text-[11px] text-text-muted flex items-start gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-text-muted" />
              <span>
                On iOS, Web Push notifications require adding this application to your Home Screen from Safari (Share → Add to Home Screen).
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Gmail Integration Teaser (Disabled per hard constraint) */}
      <div className="border border-border/70 rounded-lg bg-surface/60 p-6 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded bg-surface-elevated border border-border text-text-muted mt-0.5">
            <Sparkles className="w-5 h-5 text-text-muted" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-text-primary">Automatic Email Detection</h4>
              <span className="text-[10px] bg-surface-elevated text-text-muted px-2 py-0.5 rounded border border-border">
                Coming Soon
              </span>
            </div>
            <p className="text-xs text-text-muted mt-1 max-w-md">
              Future releases will support automated subscription extraction directly from receipts. This feature requires zero permissions in v1.
            </p>
          </div>
        </div>
        <Button variant="tertiary" size="sm" disabled className="hidden sm:inline-flex opacity-50">
          Disabled
        </Button>
      </div>

      {/* Privacy, Export & Deletion */}
      <div className="border border-border rounded-lg bg-surface p-6 flex flex-col gap-4">
        <h3 className="text-base font-semibold text-text-primary border-b border-border pb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-accent" />
          <span>Your Data & Privacy</span>
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
          <div>
            <div className="text-sm font-semibold text-text-primary">Export Personal Data</div>
            <div className="text-xs text-text-muted">Download all tracked subscriptions in raw JSON format.</div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportData}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export JSON
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-border">
          <div>
            <div className="text-sm font-semibold text-status-danger">Delete Account & Records</div>
            <div className="text-xs text-text-muted">Irreversibly delete your account, push endpoints, and all records.</div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            leftIcon={<Trash2 className="w-4 h-4" />}
            onClick={() => alert('Account deletion requires user confirmation and Supabase authentication context.')}
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
};
