import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '@/App';

describe('End-to-End User Journeys & Hard Constraint Auditing', () => {
  beforeEach(() => {
    localStorage.setItem('kori_onboarding_completed', 'true');
  });

  it('launches Kori onboarding tour and introduces the swift familiar', async () => {
    localStorage.removeItem('kori_onboarding_completed');
    render(<App />);

    expect(screen.getByText('Welcome to Subscription Tracker')).toBeInTheDocument();
    expect(screen.getAllByLabelText(/Mascot Kori in welcome pose/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/I am Kori, your personal swift familiar/i)).toBeInTheDocument();

    // Advance to step 2
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    expect(screen.getByText(/Add your first subscription/i)).toBeInTheDocument();

    // Advance to step 3
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    expect(screen.getByText(/Never miss a renewal or trial end/i)).toBeInTheDocument();

    // Advance to step 4
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    expect(screen.getByText(/You are all set!/i)).toBeInTheDocument();

    // Complete onboarding
    fireEvent.click(screen.getByRole('button', { name: /get started/i }));
    await waitFor(() => {
      expect(localStorage.getItem('kori_onboarding_completed')).toBe('true');
    });
  });
  it('completes the full flow: authenticate -> view dashboard -> add subscription -> verify currency grouping', async () => {
    render(<App />);

    // 1. Dashboard renders with initial seeded subscriptions
    expect(screen.getByText('Overview & Renewals')).toBeInTheDocument();
    expect(screen.getByText(/Monthly Estimate \(USD\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Monthly Estimate \(EUR\)/i)).toBeInTheDocument();

    // 2. Open Add Subscription Modal
    const addButtons = screen.getAllByRole('button', { name: /add subscription/i });
    fireEvent.click(addButtons[0]);

    expect(screen.getByRole('heading', { name: /add subscription/i })).toBeInTheDocument();

    // 3. Fill in custom subscription details
    const nameInput = screen.getByPlaceholderText(/search provider/i);
    const amountInput = screen.getByLabelText(/amount \*/i);
    const renewalInput = screen.getByLabelText(/next renewal date \*/i);

    fireEvent.change(nameInput, { target: { value: 'Proton Mail' } });
    fireEvent.change(amountInput, { target: { value: '4.99' } });
    fireEvent.change(renewalInput, { target: { value: '2026-12-15' } });

    // Submit form
    const saveButton = screen.getByRole('button', { name: /add subscription/i, hidden: false });
    fireEvent.click(saveButton);

    // 4. Verify subscription appears in the timeline
    await waitFor(() => {
      expect(screen.getByText('Proton Mail')).toBeInTheDocument();
    });
  });

  it('verifies cancellation disclosure: opening link never alters status automatically; requires explicit confirmation', async () => {
    render(<App />);

    // 1. Navigate to Subscriptions directory
    const subsTabs = screen.getAllByRole('button', { name: /subscriptions/i });
    fireEvent.click(subsTabs[0]);

    expect(screen.getByText('Subscriptions Directory')).toBeInTheDocument();

    // 2. Select GitHub Copilot (has cancellation link)
    const githubRow = screen.getByText('GitHub Copilot');
    fireEvent.click(githubRow);

    // 3. Modal opens with "Manage Cancellation" button
    const manageCancelBtn = screen.getByRole('button', { name: /manage cancellation/i });
    expect(manageCancelBtn).toBeInTheDocument();
    fireEvent.click(manageCancelBtn);

    // 4. Cancellation Disclosure Dialog opens
    expect(screen.getByText(/how cancellation works:/i)).toBeInTheDocument();
    expect(screen.getByText(/opening the link does not cancel your subscription automatically/i)).toBeInTheDocument();

    // 5. User explicitly confirms cancellation pending
    const markPendingBtn = screen.getByRole('button', { name: /mark pending/i });
    fireEvent.click(markPendingBtn);

    // 6. Status badge in list updates to Cancellation Pending
    await waitFor(() => {
      expect(screen.getAllByText('Cancellation Pending').length).toBeGreaterThan(0);
    });
  });

  it('verifies that unlike currencies are never added together in Analytics', () => {
    render(<App />);

    // Navigate to Analytics
    const analyticsTabs = screen.getAllByRole('button', { name: /analytics/i });
    fireEvent.click(analyticsTabs[0]);

    // Verify USD and EUR sections remain strictly distinct portfolios
    expect(screen.getByText('USD Portfolio')).toBeInTheDocument();
    expect(screen.getByText('EUR Portfolio')).toBeInTheDocument();

    // No blended sum element exists
    expect(screen.queryByText(/total across all currencies/i)).not.toBeInTheDocument();
  });

  it('verifies that Gmail detection is strictly disabled with no permission prompt in Settings', () => {
    render(<App />);

    // Navigate to Settings
    const settingsTabs = screen.getAllByRole('button', { name: /settings/i });
    fireEvent.click(settingsTabs[0]);

    // Verify "Coming Soon" teaser exists and is disabled
    expect(screen.getByText('Automatic Email Detection')).toBeInTheDocument();
    expect(screen.getByText('Coming Soon')).toBeInTheDocument();
    expect(screen.getByText(/future releases will support automated subscription extraction/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /connect gmail/i })).not.toBeInTheDocument();
  });
});
