# Portable UI component interaction and motion testing

This is the durable scope for browser interaction tests in `packages/ui-components/`. Read it with [the component contract guide](ui-component-contracts.md). It applies to public exports and their stories in `apps/ui/src/stories/`.

## Coverage categories

| Category | Required browser evidence | Current examples |
| --- | --- | --- |
| Controlled selection and navigation | Operate each selectable control; assert callback-driven selected state and representative rendered content. Exercise native Enter or Space activation. | SegmentedControl, Featured asset/duration/event/source/mobile tabs, payment token tabs |
| Dialog lifecycle and focus | Assert initial focus, Tab/Shift+Tab containment, close button, backdrop, Escape, focus restoration, and non-dismissible behavior. | PaymentDialog and processing dialogs |
| Controlled form and async actions | Assert value changes, submit paths, validation/error rendering, applied/removal states, and loading/disabled guards. | PaymentPromoCodeField and payment CTAs |
| Callback-forwarding actions | Assert each public action callback fires once; assert disabled/loading actions do not fire. | Button, Surface button, market header/card actions, Browse All, outcome actions |
| Async recovery | Render loading, empty, and error states; assert retry callbacks and recovery when supplied. | FeaturedMarketStatus and market lists |
| Motion | Assert CSS animation presence and bounded progress in Chromium; provide a paused story mode for deterministic visual capture. | Skeleton pulse, processing spinner, fading asset badge |
| Presentational-only exports | Render meaningful visual/data states. No play test is needed unless the export gains a consumer action or local interactive behavior. | Badge, Stack, Text, price/details/timeline summaries |

## Rules

Every public callback, keyboard-operable native control, disabled/loading guard, consumer-observable state transition, and intentional animation must map to one category and a named story scenario. Use controlled React fixtures to mirror consumer-owned state; use spies only when a callback has no visible state transition.

Query through accessible role and name wherever possible. Native controls must be verified as keyboard operable. Do not add application integration tests here: API calls, stores, routing, analytics, persistence, wallets, hosted checkout, and notifications belong to consuming applications.

The required browser gate is `pnpm run test:stories`. Storybook accessibility remains report-only while `a11y.test` is `"todo"`; promote it only in a separate clean-baseline change.

## Motion policy

CSS animations are checked with `Element.getAnimations()` or computed animation properties and a short bounded progress assertion. Visual baselines must set the Storybook `pauseMotion` parameter so CSS animations and transitions are frozen. The package currently has skeleton pulse, processing-spinner rotation, and asset-badge fade motion.

Canvas motion, including the ECharts line chart, is verified through prop-driven mount and update behavior rather than frame-by-frame assertions. A future visual-regression system may use a dedicated chart story with animation disabled or frozen. Reduced-motion behavior, performance budgets/traces, visual snapshots at fixed timestamps, and pure chart-option unit tests are optional future layers, not required gates.
