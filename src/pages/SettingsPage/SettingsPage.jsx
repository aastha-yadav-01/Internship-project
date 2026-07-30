import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Input } from '../../components/Input/Input';
import { Select } from '../../components/Select/Select';
import { Checkbox } from '../../components/Checkbox/Checkbox';
import { Button } from '../../components/Button/Button';

import styles from './SettingsPage.module.css';

/** @import { SettingsFormData } from '../../types/settings' */

const THEME_OPTIONS = [
  { value: 'light',  label: '☀️  Light'  },
  { value: 'dark',   label: '🌙  Dark'   },
  { value: 'system', label: '💻  System' },
];

/**
 * Zod validation schema — trims before checking.
 */
const settingsSchema = z.object({
  fullName:      z.string().trim().min(1, 'Name is required.'),
  email:         z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.'),
  theme:         z.enum(['light', 'dark', 'system']),
  notifications: z.boolean(),
});

/** Returns initials from a name string (up to 2 chars). */
function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

/**
 * Premium Settings page with dark glassmorphism UI.
 */
export function SettingsPage() {
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver: zodResolver(settingsSchema),
    mode: 'onTouched',
    defaultValues: {
      fullName:      '',
      email:         '',
      theme:         'system',
      notifications: true,
    },
  });

  const watchedName = watch('fullName');

  /** @param {SettingsFormData} data */
  const onSubmit = (data) => {
    console.log('Settings saved:', data);
    setSavedSuccessfully(true);
  };

  const initials = getInitials(watchedName || '?');

  return (
    <main className={styles.page}>
      {/* Decorative blobs */}
      <div className={styles.blob1} aria-hidden="true" />
      <div className={styles.blob2} aria-hidden="true" />

      <div className={styles.container}>
        {/* Top badge */}
        <div className={styles.badge} aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Account Settings
        </div>

        {/* Card */}
        <section className={styles.card} aria-labelledby="settings-heading">

          {/* Header with avatar */}
          <header className={styles.header}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatar} aria-label={`Avatar for ${watchedName || 'user'}`}>
                {initials}
              </div>
              <div className={styles.avatarRing} aria-hidden="true" />
            </div>
            <div className={styles.headerText}>
              <h1 id="settings-heading" className={styles.title}>
                {watchedName ? watchedName : 'Your Settings'}
              </h1>
              <p className={styles.subtitle}>Manage your profile and preferences</p>
            </div>
          </header>

          {/* Form */}
          <form
            id="settings-form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            aria-label="Settings form"
            className={styles.form}
          >
            {/* Profile section */}
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>
                <span className={styles.legendDot} aria-hidden="true" />
                Profile
              </legend>

              <div className={styles.fields}>
                <Input
                  id="fullName"
                  label="Full Name"
                  type="text"
                  placeholder="Jane Smith"
                  autoComplete="name"
                  error={errors.fullName?.message}
                  {...register('fullName')}
                />
                <Input
                  id="email"
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  error={errors.email?.message}
                  {...register('email')}
                />
              </div>
            </fieldset>

            {/* Preferences section */}
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>
                <span className={styles.legendDot} aria-hidden="true" />
                Preferences
              </legend>

              <div className={styles.fields}>
                <Select
                  id="theme"
                  label="Theme"
                  options={THEME_OPTIONS}
                  error={errors.theme?.message}
                  {...register('theme')}
                />
                <Checkbox
                  id="notifications"
                  label="Enable Notifications"
                  description="Receive email updates about your account activity."
                  error={errors.notifications?.message}
                  {...register('notifications')}
                />
              </div>
            </fieldset>

            {/* Actions */}
            <div className={styles.actions}>
              <Button type="submit" disabled={!isValid || !isDirty}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Save Settings
              </Button>

              {savedSuccessfully && (
                <p
                  id="save-success"
                  className={styles.successMessage}
                  role="status"
                  aria-live="polite"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Settings saved successfully.
                </p>
              )}
            </div>
          </form>
        </section>

        {/* Footer note */}
        <p className={styles.footerNote}>
          Your data is encrypted and stored securely.
        </p>
      </div>
    </main>
  );
}
