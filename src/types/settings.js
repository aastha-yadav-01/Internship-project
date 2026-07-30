/**
 * @typedef {'light' | 'dark' | 'system'} Theme
 * Theme options available in the settings form.
 */

/**
 * @typedef {Object} SettingsFormData
 * @property {string} fullName       - The user's full name (required, trimmed).
 * @property {string} email          - The user's email address (required, valid format).
 * @property {Theme}  theme          - The user's preferred color theme.
 * @property {boolean} notifications - Whether email notifications are enabled.
 */

export {};
