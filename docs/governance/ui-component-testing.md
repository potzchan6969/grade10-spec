# Product UI component interaction and motion testing

This is the durable scope for browser interaction tests of a product UI component. Read it with [the component contract guide](ui-component-contracts.md). Because component source now lives in the consuming application, the obligations below fall on that repository's test suite; this repository applies the same scope to the primitives in `packages/design-system`.

The examples name components from the former `packages/ui-components` package. They are kept as worked cases of each category, not as pointers to code in this repository.

## Coverage categories

| Category | Required browser evidence | Current examples |
| --- | --- | --- |
| Controlled selection and navigation | Operate each selectable control; assert callback-driven selected state and representative rendered content. Exercise native Enter or Space activation. | SegmentedControl, asset/duration/event/source/mobile tabs, payment token tabs |
| Dialog lifecycle and focus | Assert initial focus, Tab/Shift+Tab containment, close button, backdrop, Escape, focus restoration, and non-dismissible behavior. | PaymentDialog and processing dialogs |
| Controlled form and async actions | Assert value changes, submit paths, validation/error rendering, applied/removal states, and loading/disabled guards. | PaymentPromoCodeField and payment CTAs |
| Callback-forwarding actions | Assert each public action callback fires once; assert disabled/loading actions do not fire. | Button, Surface button, market header/card actions, Browse All, outcome actions |
| Async recovery | Render loading, empty, and error states; assert retry callbacks and recovery when supplied. | Status regions and market lists |
| Motion | Assert CSS animation presence and bounded progress in Chromium; provide a paused story mode for deterministic visual capture. | Skeleton pulse, processing spinner, fading asset badge |
| Presentational-only exports | Render meaningful visual/data states. No play test is needed unless the export gains a consumer action or local interactive behavior. | Badge, Stack, Text, price/details/timeline summaries |

## Rules

Every public callback, keyboard-operable native control, disabled/loading guard, consumer-observable state transition, and intentional animation must map to one category and a named story scenario. Use controlled React fixtures to mirror consumer-owned state; use spies only when a callback has no visible state transition.

Query through accessible role and name wherever possible. Native controls must be verified as keyboard operable. Do not add application integration tests here: API calls, stores, routing, analytics, persistence, wallets, hosted checkout, and notifications belong to consuming applications.

In this repository the required browser gate is `pnpm run test:stories`. A consuming application must provide an equivalent gate over its own component stories or tests. Storybook accessibility remains report-only while `a11y.test` is `"todo"`; promote it only in a separate clean-baseline change.

## Motion policy

CSS animations are checked with `Element.getAnimations()` or computed animation properties and a short bounded progress assertion. Visual baselines must set the Storybook `pauseMotion` parameter so CSS animations and transitions are frozen. The motion in scope has been skeleton pulse, processing-spinner rotation, and asset-badge fade.

Canvas motion, including the ECharts line chart, is verified through prop-driven mount and update behavior rather than frame-by-frame assertions. A future visual-regression system may use a dedicated chart story with animation disabled or frozen. Reduced-motion behavior, performance budgets/traces, visual snapshots at fixed timestamps, and pure chart-option unit tests are optional future layers, not required gates.
