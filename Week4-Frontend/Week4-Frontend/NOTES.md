# NOTES.md

## Setup note

`npx shadcn init` and `npx shadcn add dialog tabs` fetch from `ui.shadcn.com`,
which isn't reachable from the sandboxed environment I built this in (only a
fixed domain allowlist is permitted there). To still get the real generated
source to review, I installed the underlying Radix UI primitives
(`@radix-ui/react-dialog`, `@radix-ui/react-tabs`) directly from npm and
reconstructed the wrapper files exactly as the CLI writes them (this is
literally what `shadcn add` does — it copies open-source wrapper code into
`src/components/ui/`, it doesn't generate anything bespoke per-project). If
you have normal internet access, running the two `npx shadcn` commands from
the brief will overwrite these files with an identical result. Files:
`src/components/ui/dialog.tsx`, `src/components/ui/tabs.tsx`,
`src/lib/utils.ts`, `components.json`.

## Dialog: what I missed

My `Modal.tsx` gets the APG-required basics right — `role="dialog"`,
`aria-modal`, `aria-labelledby`, initial focus placement, Tab/Shift+Tab
wrapping, Escape to close, and focus restoration to the trigger. Comparing it
to shadcn's `dialog.tsx` (a thin wrapper around Radix's `Dialog` primitive)
surfaced gaps I hadn't thought about:

1. **No scroll lock.** Radix's dialog locks body scroll while open (via its
   internal scroll-lock behavior), so the page can't be scrolled behind the
   modal on either mouse wheel or touch. Mine doesn't touch `document.body`
   at all — the background is still scrollable while the modal is open, which
   is both a visual bug and a focus-order confusion risk for screen
   magnifier users.
2. **Background content isn't hidden from assistive tech.** Radix marks
   everything outside the dialog's portal as inert to the accessibility tree
   while it's open, so a screen reader in browse mode can't navigate into
   content behind the modal even though it's still visually present. My
   version only *traps keyboard focus* — it does nothing to stop a screen
   reader's virtual cursor from reading background content, which violates
   the APG requirement that background content be hidden from assistive
   technology while a modal dialog is open.
3. **Naive outside-click detection.** I close the modal on any `mousedown`
   that lands on the overlay. Radix uses a dedicated "dismissable layer" that
   understands nested layers (e.g. a `<select>` or popover portaled outside
   the dialog) so a click inside a nested overlay doesn't incorrectly
   register as "outside" and close the parent dialog. Mine would misfire in
   that scenario.
4. **No portal.** Radix renders dialog content through a React portal
   attached to `document.body`. Mine renders in place in the React tree, so
   it inherits any ancestor's `transform`, `overflow`, or `z-index`
   stacking context — which can silently break my `position: fixed`
   centering in ways that only show up once the modal is nested inside some
   other styled container.
5. **No multi-dialog stacking logic.** My `Escape` handler just closes
   "the" dialog. Radix's layering system tracks which dialog is topmost so
   Escape closes only the most recently opened one if dialogs are ever
   stacked. Not needed for this playground, but it's a real gap for any app
   that opens a confirmation dialog from within another dialog.

## Tabs: what I missed

My `Tabs.tsx` implements the automatic-activation pattern correctly for the
common case: roving `tabindex`, `aria-selected`, arrow-key movement with
wraparound, `Home`/`End`, and correct `aria-controls`/`aria-labelledby`
wiring. Compared to shadcn's `tabs.tsx` (wrapping Radix's `Tabs`):

1. **No `orientation` support.** Radix's tabs accept `orientation="vertical"`,
   which switches the arrow-key bindings from Left/Right to Up/Down per the
   APG pattern. Mine is hardcoded to horizontal Left/Right only — using it
   for a vertical tab layout would ship keyboard behavior that contradicts
   the visual layout.
2. **No disabled-tab handling.** Radix supports `disabled` on individual
   triggers and correctly skips them during arrow-key navigation (and marks
   them `aria-disabled`/removes them from the tab order). My version has no
   concept of a disabled tab; adding one later would require re-touching the
   arrow-key index math I already wrote.
3. **No activation-mode option.** Radix supports `activationMode="manual"`
   (arrow keys only move focus; selection requires Enter/Space), which the
   APG lists as an acceptable alternative pattern for tabs with expensive
   panel content. I only implemented automatic activation, which is fine
   here but isn't a configurable choice the way shadcn's is.

## Disclosure

shadcn/ui doesn't ship a plain "disclosure" component — the closest
equivalents in its catalog are `accordion` (built on Radix Accordion, for
groups of disclosures) and `collapsible` (a single disclosure, functionally
what I built). I didn't install either for direct comparison since they're
outside the two components named in the brief, but the same pattern from the
gaps above likely applies: Radix's `Collapsible` handles animating the
height of the content region during expand/collapse (using a
`--radix-collapsible-content-height` CSS variable it measures at runtime),
which my CSS-only `hidden` toggle doesn't attempt at all.
