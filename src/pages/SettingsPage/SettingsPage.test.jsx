import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { SettingsPage } from './SettingsPage';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns the Save Settings button */
const getSaveButton = () =>
  screen.getByRole('button', { name: /save settings/i });

/** Fills in a valid full name */
const fillName = async (user, value = 'Jane Smith') => {
  await user.type(screen.getByLabelText(/full name/i), value);
};

/** Fills in a valid email */
const fillEmail = async (user, value = 'jane@example.com') => {
  await user.type(screen.getByLabelText(/email address/i), value);
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('SettingsPage — rendering', () => {
  it('renders the page heading', () => {
    render(<SettingsPage />);
    expect(
      screen.getByRole('heading', { name: /settings/i })
    ).toBeInTheDocument();
  });

  it('renders the Full Name field with an accessible label', () => {
    render(<SettingsPage />);
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
  });

  it('renders the Email Address field with an accessible label', () => {
    render(<SettingsPage />);
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
  });

  it('renders the Theme selector with an accessible label', () => {
    render(<SettingsPage />);
    expect(screen.getByLabelText(/theme/i)).toBeInTheDocument();
  });

  it('renders the Enable Notifications checkbox with an accessible label', () => {
    render(<SettingsPage />);
    expect(screen.getByLabelText(/enable notifications/i)).toBeInTheDocument();
  });

  it('renders the Save Settings button', () => {
    render(<SettingsPage />);
    expect(getSaveButton()).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('SettingsPage — Save button disabled state', () => {
  it('is disabled when the form is in its initial (pristine) state', () => {
    render(<SettingsPage />);
    expect(getSaveButton()).toBeDisabled();
  });

  it('remains disabled when only name is filled', async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);
    await fillName(user);
    expect(getSaveButton()).toBeDisabled();
  });

  it('remains disabled when only email is filled', async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);
    await fillEmail(user);
    expect(getSaveButton()).toBeDisabled();
  });

  it('remains disabled when email is invalid', async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);
    await fillName(user);
    await fillEmail(user, 'not-an-email');
    expect(getSaveButton()).toBeDisabled();
  });

  it('becomes enabled when both name and email are valid', async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);
    await fillName(user);
    await fillEmail(user);
    await waitFor(() => expect(getSaveButton()).not.toBeDisabled());
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('SettingsPage — Full Name validation', () => {
  it('shows "Name is required." after touching and leaving name empty', async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);
    const input = screen.getByLabelText(/full name/i);
    await user.click(input);
    await user.tab(); // blur
    await waitFor(() =>
      expect(screen.getByText('Name is required.')).toBeInTheDocument()
    );
  });

  it('shows "Name is required." for whitespace-only input', async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);
    await user.type(screen.getByLabelText(/full name/i), '   ');
    await user.tab();
    await waitFor(() =>
      expect(screen.getByText('Name is required.')).toBeInTheDocument()
    );
  });

  it('clears the name error when a valid name is entered', async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);
    const input = screen.getByLabelText(/full name/i);
    await user.click(input);
    await user.tab();
    await waitFor(() =>
      expect(screen.getByText('Name is required.')).toBeInTheDocument()
    );
    await user.type(input, 'Jane Smith');
    await waitFor(() =>
      expect(screen.queryByText('Name is required.')).not.toBeInTheDocument()
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('SettingsPage — Email validation', () => {
  it('shows "Enter a valid email address." for an invalid email', async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);
    await user.type(screen.getByLabelText(/email address/i), 'not-an-email');
    await user.tab();
    await waitFor(() =>
      expect(
        screen.getByText('Enter a valid email address.')
      ).toBeInTheDocument()
    );
  });

  it('shows "Email is required." after leaving email empty', async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);
    const input = screen.getByLabelText(/email address/i);
    await user.click(input);
    await user.tab();
    await waitFor(() =>
      expect(screen.getByText('Email is required.')).toBeInTheDocument()
    );
  });

  it('clears the email error when a valid email is entered', async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);
    const input = screen.getByLabelText(/email address/i);
    await user.type(input, 'bad');
    await user.tab();
    await waitFor(() =>
      expect(
        screen.getByText('Enter a valid email address.')
      ).toBeInTheDocument()
    );
    await user.clear(input);
    await user.type(input, 'good@example.com');
    await waitFor(() =>
      expect(
        screen.queryByText('Enter a valid email address.')
      ).not.toBeInTheDocument()
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('SettingsPage — Successful submission', () => {
  it('shows "Settings saved successfully." after a valid submit', async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);
    await fillName(user);
    await fillEmail(user);
    await waitFor(() => expect(getSaveButton()).not.toBeDisabled());
    await user.click(getSaveButton());
    await waitFor(() =>
      expect(
        screen.getByText(/settings saved successfully/i)
      ).toBeInTheDocument()
    );
  });

  it('success message has role="status" for screen readers', async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);
    await fillName(user);
    await fillEmail(user);
    await waitFor(() => expect(getSaveButton()).not.toBeDisabled());
    await user.click(getSaveButton());
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(
        /settings saved successfully/i
      )
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('SettingsPage — Accessibility', () => {
  it('form has an accessible name via aria-label', () => {
    render(<SettingsPage />);
    expect(screen.getByRole('form', { name: /settings form/i })).toBeInTheDocument();
  });

  it('Full Name input sets aria-invalid when error exists', async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);
    const input = screen.getByLabelText(/full name/i);
    await user.click(input);
    await user.tab();
    await waitFor(() =>
      expect(input).toHaveAttribute('aria-invalid', 'true')
    );
  });

  it('Full Name input sets aria-invalid to false when valid', async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);
    await user.type(screen.getByLabelText(/full name/i), 'Jane');
    await waitFor(() =>
      expect(screen.getByLabelText(/full name/i)).toHaveAttribute(
        'aria-invalid',
        'false'
      )
    );
  });
});
