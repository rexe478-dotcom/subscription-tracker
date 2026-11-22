import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { AuthPage } from '@/pages/AuthPage';

const TestAuthConsumer = () => {
  const { user, signOut, isDemoUser } = useAuth();
  return (
    <div>
      <div data-testid="user-email">{user?.email}</div>
      <div data-testid="is-demo">{isDemoUser ? 'demo' : 'live'}</div>
      <button onClick={signOut}>Log Out</button>
    </div>
  );
};

describe('Authentication & Session Management', () => {
  it('renders sign-in form with email and password inputs', () => {
    render(
      <AuthProvider>
        <AuthPage />
      </AuthProvider>
    );

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('switches between Sign In and Sign Up modes cleanly', () => {
    render(
      <AuthProvider>
        <AuthPage />
      </AuthProvider>
    );

    const signUpButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(signUpButton);

    // In sign up mode, Full Name field appears
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('validates minimum password length', async () => {
    render(
      <AuthProvider>
        <AuthPage />
      </AuthProvider>
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/at least 6 characters/i);
    });
  });

  it('restores authenticated demo session and supports sign out', async () => {
    render(
      <AuthProvider>
        <TestAuthConsumer />
      </AuthProvider>
    );

    // Initially loads demo user in test environment
    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('alex@example.com');
      expect(screen.getByTestId('is-demo')).toHaveTextContent('demo');
    });

    // Test sign out
    const logOutBtn = screen.getByText('Log Out');
    fireEvent.click(logOutBtn);

    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('');
    });
  });
});
