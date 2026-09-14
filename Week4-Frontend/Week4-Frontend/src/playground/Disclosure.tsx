import { useId, useState, type ReactNode } from "react";

/**
 * Disclosure implemented against the WAI-ARIA APG "Disclosure (Show/Hide)" pattern:
 * https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
 *
 * Requirements this satisfies:
 * - The trigger is a real <button> (natively focusable + Enter/Space activate it,
 *   so no extra keydown handling is needed for that part)
 * - aria-expanded on the trigger reflects open/closed state
 * - aria-controls points the trigger at the content region's id
 * - Content is removed from the tab order / accessibility tree when collapsed
 *   (via the `hidden` attribute, which also hides it visually)
 */

interface DisclosureProps {
  summary: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function Disclosure({ summary, children, defaultOpen = false }: DisclosureProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div className="disclosure">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="disclosure-trigger"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="disclosure-icon" aria-hidden="true">
          {isOpen ? "▾" : "▸"}
        </span>
        {summary}
      </button>
      <div id={contentId} role="region" hidden={!isOpen} className="disclosure-content">
        {children}
      </div>
    </div>
  );
}
