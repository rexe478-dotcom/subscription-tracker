import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { OfflineBanner } from '@/components/ui/OfflineBanner';

describe('PWA & Offline Subsystem', () => {
  it('does not display offline banner when online', () => {
    // navigator.onLine is true by default in JSDOM setup
    render(<OfflineBanner />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('displays accessible offline banner when network connection drops', () => {
    render(<OfflineBanner />);

    // Simulate going offline
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    const banner = screen.getByRole('status');
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveTextContent(/offline mode/i);

    // Simulate restoring online connection
    act(() => {
      window.dispatchEvent(new Event('online'));
    });

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
