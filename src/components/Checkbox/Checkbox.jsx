import { forwardRef } from 'react';
import styles from './Checkbox.module.css';

/**
 * Reusable checkbox with accessible label.
 *
 * @param {Object}  props
 * @param {string}  props.id       - Unique id linking label to checkbox.
 * @param {string}  props.label    - Visible label text.
 * @param {string}  [props.description] - Optional longer description below the label.
 * @param {string}  [props.error]  - Validation error message.
 */
export const Checkbox = forwardRef(function Checkbox(
  { id, label, description, error, ...rest },
  ref
) {
  const errorId = `${id}-error`;
  const descId = `${id}-desc`;

  const describedBy = [
    description ? descId : null,
    error ? errorId : null,
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div className={styles.field}>
      <div className={styles.row}>
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className={styles.checkbox}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          {...rest}
        />

        <div className={styles.labelGroup}>
          <label htmlFor={id} className={styles.label}>
            {label}
          </label>
          {description && (
            <span id={descId} className={styles.description}>
              {description}
            </span>
          )}
        </div>
      </div>

      {error && (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
});
