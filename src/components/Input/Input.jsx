import { forwardRef } from 'react';
import styles from './Input.module.css';

/**
 * Reusable text/email input with accessible label and inline error display.
 *
 * @param {Object}  props
 * @param {string}  props.id          - Unique id linking label to input.
 * @param {string}  props.label       - Visible label text.
 * @param {string}  [props.error]     - Validation error message (shown inline).
 * @param {string}  [props.type='text'] - HTML input type.
 * @param {string}  [props.hint]      - Optional helper text below the input.
 */
export const Input = forwardRef(function Input(
  { id, label, error, type = 'text', hint, ...rest },
  ref
) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const describedBy = [
    hint ? hintId : null,
    error ? errorId : null,
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>

      {hint && (
        <span id={hintId} className={styles.hint}>
          {hint}
        </span>
      )}

      <input
        ref={ref}
        id={id}
        type={type}
        className={[styles.input, error ? styles.inputError : '']
          .filter(Boolean)
          .join(' ')}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...rest}
      />

      {error && (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
});
