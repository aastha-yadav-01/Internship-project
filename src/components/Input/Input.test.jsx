import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('renders the label text', () => {
    render(<Input id="name" label="Full Name" />);
    expect(screen.getByText('Full Name')).toBeInTheDocument();
  });

  it('associates label with input via htmlFor/id', () => {
    render(<Input id="name" label="Full Name" />);
    const input = screen.getByLabelText('Full Name');
    expect(input).toBeInTheDocument();
  });

  it('renders the input with the given type', () => {
    render(<Input id="email" label="Email" type="email" />);
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
  });

  it('defaults to type="text"', () => {
    render(<Input id="name" label="Full Name" />);
    expect(screen.getByLabelText('Full Name')).toHaveAttribute('type', 'text');
  });

  it('renders a placeholder when provided', () => {
    render(<Input id="name" label="Full Name" placeholder="Jane Smith" />);
    expect(screen.getByPlaceholderText('Jane Smith')).toBeInTheDocument();
  });

  it('does not show an error by default', () => {
    render(<Input id="name" label="Full Name" />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows the error message when error prop is provided', () => {
    render(<Input id="name" label="Full Name" error="Name is required." />);
    expect(screen.getByRole('alert')).toHaveTextContent('Name is required.');
  });

  it('sets aria-invalid to true when there is an error', () => {
    render(<Input id="name" label="Full Name" error="Name is required." />);
    expect(screen.getByLabelText('Full Name')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });

  it('sets aria-invalid to false when there is no error', () => {
    render(<Input id="name" label="Full Name" />);
    expect(screen.getByLabelText('Full Name')).toHaveAttribute(
      'aria-invalid',
      'false'
    );
  });

  it('sets aria-describedby pointing to error id', () => {
    render(<Input id="name" label="Full Name" error="Name is required." />);
    const input = screen.getByLabelText('Full Name');
    expect(input).toHaveAttribute('aria-describedby', 'name-error');
  });
});
