import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { MascotSvg } from '@/components/mascot/MascotSvg';

describe('UI Design System Primitives', () => {
  describe('Button', () => {
    it('renders text and handles loading state properly', () => {
      const { rerender } = render(<Button>Save Subscription</Button>);
      const button = screen.getByRole('button', { name: /save subscription/i });
      expect(button).toBeInTheDocument();
      expect(button).not.toBeDisabled();

      rerender(<Button isLoading>Save Subscription</Button>);
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('renders secondary and destructive variants with proper classes', () => {
      const { container } = render(<Button variant="destructive">Delete</Button>);
      expect(container.firstChild).toHaveClass('text-status-danger');
    });
  });

  describe('Badge', () => {
    it('renders text with icon and status styling', () => {
      render(<Badge status="active" />);
      const text = screen.getByText('Active');
      expect(text).toBeInTheDocument();
      expect(text.parentElement).toHaveClass('text-status-success');
    });

    it('renders free_trial status with warning theme', () => {
      render(<Badge status="free_trial" />);
      const text = screen.getByText('Free Trial');
      expect(text).toBeInTheDocument();
      expect(text.parentElement).toHaveClass('text-status-warning');
    });
  });

  describe('Input', () => {
    it('links label, input, and error messages via ARIA', () => {
      render(
        <Input
          label="Provider URL"
          id="provider-url"
          error="Must start with https://"
        />
      );

      const input = screen.getByLabelText('Provider URL');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('aria-invalid', 'true');

      const errorMsg = screen.getByRole('alert');
      expect(errorMsg).toHaveTextContent('Must start with https://');
      expect(input).toHaveAttribute('aria-describedby', 'provider-url-error');
    });
  });

  describe('MascotSvg (The Swift Familiar)', () => {
    it('renders vector master in welcome pose', () => {
      const { container } = render(<MascotSvg pose="welcome" size={120} />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('role', 'img');
      expect(svg).toHaveAttribute('aria-label', 'Mascot Kori in welcome pose');
    });

    it('renders compact icon mark for headers and badges', () => {
      const { container } = render(<MascotSvg pose="icon" size={32} />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
