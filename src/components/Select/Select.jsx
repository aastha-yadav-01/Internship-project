import { forwardRef } from 'react';
import styles from './Select.module.css';

/**
 * Reusable select/dropdown with accessible label and inline error display.
 *
 * @param {Object}   props
 * @param {string}   props.id       - Unique id linking label to select.
 * @param {string}   props.label    - Visible label text.
 * @param {Array<{value: string, label: string}>} props.options - Dropdown options.
 * @param {string}   [props.error]  - Validation error message.
 */
export const Select = forwardRef(function Select(
  { id, label, options = [], error, ...rest },
  ref
) {
  const errorId = `${id}-error`;

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>

      <div className={styles.selectWrapper}>
        <select
          ref={ref}
          id={id}
          className={[styles.select, error ? styles.selectError : '']
            .filter(Boolean)
            .join(' ')}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          {...rest}
        >
          {options.map(({ value, label: optLabel }) => (
            <option key={value} value={value}>
              {optLabel}
            </option>
          ))}
        </select>

        {/* Custom arrow icon */}
        <span className={styles.arrow} aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      {error && (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
});
