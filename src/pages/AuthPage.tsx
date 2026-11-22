import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MascotSvg } from '@/components/mascot/MascotSvg';
import { Lock, Mail, User as UserIcon, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { signIn, signUp, resetPassword, loginAsDemoUser } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setError('Email address is required');
      return;
    }

    if (mode !== 'reset' && (!password || password.length < 6)) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) setError(error.message);
      } else if (mode === 'signup') {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          setError(error.message);
        } else {
          setSuccessMessage('Account created! Please check your email for confirmation instructions.');
        }
      } else if (mode === 'reset') {
        const { error } = await resetPassword(email);
        if (error) {
          setError(error.message);
        } else {
          setSuccessMessage('Password reset link sent to your email.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl">
        {/* Mascot & Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <MascotSvg pose="welcome" size={88} className="mb-1" />
          <h1 className="text-xl font-bold tracking-tight text-text-primary">
            Subscription Tracker
          </h1>
          <p className="text-xs text-text-secondary max-w-xs">
            {mode === 'signin' && 'Sign in to access your private subscriptions and renewal reminders.'}
            {mode === 'signup' && 'Create a private personal account to track recurring digital commitments.'}
            {mode === 'reset' && 'Enter your email to receive a secure password reset link.'}
          </p>
        </div>

        {/* Success Message Banner */}
        {successMessage && (
          <div className="p-3 bg-status-success/15 border border-status-success/30 rounded-md text-xs text-status-success flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Message Banner */}
        {error && (
          <div className="p-3 bg-status-danger/15 border border-status-danger/30 rounded-md text-xs text-status-danger" role="alert">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'signup' && (
            <Input
              label="Full Name"
              type="text"
              placeholder="e.g. Alex Rivera"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              leftAddon={<UserIcon className="w-4 h-4" />}
            />
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftAddon={<Mail className="w-4 h-4" />}
            autoComplete="email"
          />

          {mode !== 'reset' && (
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftAddon={<Lock className="w-4 h-4" />}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            />
          )}

          {mode === 'signin' && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setMode('reset');
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="text-xs text-text-muted hover:text-accent transition-colors"
              >
                Forgot password?
              </button>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
            className="w-full justify-center mt-1"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {mode === 'signin' && 'Sign In'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'reset' && 'Send Reset Link'}
          </Button>
        </form>

        {/* Mode Switcher */}
        <div className="pt-2 border-t border-border flex flex-col gap-3 text-center">
          {mode === 'signin' ? (
            <p className="text-xs text-text-secondary">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="text-accent hover:underline font-semibold"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p className="text-xs text-text-secondary">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="text-accent hover:underline font-semibold"
              >
                Back to sign in
              </button>
            </p>
          )}

          {/* Quick Demo Access Button */}
          <button
            type="button"
            onClick={loginAsDemoUser}
            className="text-xs text-text-muted hover:text-text-primary transition-colors py-1 underline underline-offset-4"
          >
            Preview App with Demo Account (Instant Access)
          </button>
        </div>
      </div>
    </div>
  );
};
