import styles from './Button.module.css';

/**
 * Reusable button component matching project styling.
 *
 * @param {Object}  props
 * @param {'button'|'submit'|'reset'} [props.type='button'] - HTML button type.
 * @param {boolean} [props.disabled=false]  - Disables the button when true.
 * @param {'primary'|'secondary'} [props.variant='primary'] - Visual style.
 * @param {React.ReactNode} props.children  - Button label content.
 */
export function Button({
  type = 'button',
  disabled = false,
  variant = 'primary',
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={[
        styles.button,
        styles[variant],
        disabled ? styles.disabled : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
