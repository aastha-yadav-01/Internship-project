# AI Workflow Comparison: `feature/vague` vs. `react-settings`

## Overview

This report compares two development approaches for building a Settings Form feature: **Round 1** on the `feature/vague` branch, generated from a single unconstrained prompt, versus **Round 2** on the `react-settings` branch, created using precise specifications, constraints, an explore-plan-code loop, and automated verification.

---

## 1. Correctness & Validation

- **`feature/vague` Branch:** Produced a monolithic script (`src/settings.js`) attached to a basic HTML file (`index.html`). Validation relied entirely on weak browser-native checks without input trimming or schema validation. Submissions accepted whitespace-only strings, and form state was never synchronized.
- **`react-settings` Branch:** Implemented a modular React application (`src/pages/SettingsPage/SettingsPage.jsx`) using React Hook Form paired with Zod (`settingsSchema`). Inputs are strictly sanitized and trimmed before evaluating rules (`fullName` required, `email` strictly validated for format). The Save button remains disabled until the form state is both valid and dirty.

---

## 2. Accessibility (a11y) & UX

- **`feature/vague` Branch:** Rendered standard HTML labels but lacked explicit ARIA attributes, keyboard focus indicators, `aria-invalid` properties, or dynamic error announcements for assistive technologies.
- **`react-settings` Branch:** Custom form primitives (`Input.jsx`, `Select.jsx`, `Checkbox.jsx`, `Button.jsx`) implement strict WAI-ARIA standards. Inline errors render inside `role="alert"` containers, invalid inputs dynamically flag `aria-invalid`, submission states use `role="status"` with `aria-live="polite"`, and full keyboard navigation is supported.

---

## 3. Edge Cases & Lifecycle Handling

- **`feature/vague` Branch:** Handled zero edge cases—whitespace inputs passed validation, invalid email formats triggered native browser bubbles instead of accessible inline feedback, and untouched states could be submitted.
- **`react-settings` Branch:** Automated test execution revealed a subtle lifecycle bug: `mode: 'onChange'` failed to validate fields when focused and blurred without typing. The issue was identified and resolved by configuring `mode: 'onTouched'`, ensuring correct error display on initial blur.

---

## 4. Review Effort & Verification Loop

- **`feature/vague` Branch:** Required heavy manual code review, refactoring, and manual browser testing. Lacked automated unit tests, risking regressions during future edits.
- **`react-settings` Branch:** Included 40 automated tests across `Button.test.jsx`, `Input.test.jsx`, and `SettingsPage.test.jsx`. The AI executed Vitest locally, caught 4 test failures during development, self-corrected the code, and verified a 100% pass rate without human intervention.

---

## Conclusion & Key Takeaways

Directing AI with clear architectural constraints, plan mode, and automated test execution on `react-settings` produced a production-ready, accessible, and fully verified feature with significantly lower review overhead than the unverified baseline on `feature/vague`.
