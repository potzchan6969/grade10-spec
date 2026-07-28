# Design

The source of truth is a governance matrix that classifies public exports by interaction risk: controlled selection, dialog lifecycle, controlled form/action, callback forwarding, async recovery, motion, or presentational-only rendering. Each interactive callback and native keyboard-operable control has a named browser scenario; presentational exports retain render/state stories only.

Storybook play tests use controlled React fixtures to prove the same callback-to-prop render loop that consumers use. Spy assertions are reserved for callback-only actions. Tests query accessible roles and names, and assert disabled controls do not invoke callbacks.

CSS motion is checked in Chromium using `Element.getAnimations()` and bounded elapsed time. A Storybook global decorator pauses CSS animation and transition timing when the `pauseMotion` parameter is set, giving visual-review tools deterministic frames. ECharts remains covered by deterministic mount/update behavior rather than frame-by-frame canvas animation checks.

The existing Storybook Vitest Chromium project remains the blocking interaction/motion suite. The a11y addon remains `todo`; a change to blocking a11y requires a clean baseline.
