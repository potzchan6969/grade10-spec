---
name: replicate-portable-ui
description: Recreate or port a React UI component from another repository into this repository's portable `packages/ui-components` package. Use when a user provides a source component or app feature and asks to replicate its UI, split it into primitives, define controlled typed contracts, add tests, or add Storybook states without copying app stores, APIs, routing, analytics, or feature orchestration.
---

# Replicate portable UI

Reproduce the source experience as an app-neutral component system, not a store-connected copy. Treat the source repository as design and interaction evidence; this repository owns the portable contract.

## Start with the repository contract

1. Read `AGENTS.md`, `docs/governance/ui-component-contracts.md`, the package README, relevant PRDs/OpenSpec changes, and existing public exports.
2. Create or update the PRD and linked OpenSpec change before implementation when the request changes a product-visible feature. Use `prd-authoring` and `openspec-propose` as required by the repository workflow.
3. Inspect the source component and its direct dependencies. Record what is visual/UI behavior versus app orchestration before copying any markup.

Do not import from the source app or copy its stores, data hooks, subscriptions, routing, analytics, feature flags, timers that derive product state, clipboard, or app-only icons.

## Convert the source into a component plan

Inventory the source before coding:

| Inspect | Produce in this repository |
| --- | --- |
| Viewports, loading/empty/error/resolved states, disabled and selected treatments | Story/state matrix and responsive acceptance criteria |
| User actions and side effects | Named callback props; the consumer implements navigation, refresh, analytics, and mutations |
| Store/API data and derived labels | Normalized, display-ready prop types; no API response types |
| Repeated layout/interaction patterns | Foundation primitive or feature primitive with an independent contract |
| Charts, canvases, media, resize behavior | Prop-driven DOM runtime with lifecycle cleanup and no external data access |

State the assumptions when the source cannot be read or an app behavior has no portable equivalent. Do not silently recreate product policy.

## Design state ownership deliberately

“Stateless” here means no external product-state integration. It does **not** ban `useState`, effects, refs, timers, context, or browser APIs.

| State type | Owner | Contract |
| --- | --- | --- |
| Fetched data, live feed, cache, selected market/entity, route, feature flag, analytics, countdown derived from product time | Consumer | Props plus `on<Event>` callbacks |
| Local disclosure, tooltip, focus handling, optimistic visual transition, measured DOM layout, chart instance | Component | Internal state/effects are allowed; never fetch, persist, subscribe to, or orchestrate consumer-owned product state |
| State a consumer needs to reproduce, synchronize, persist, or observe | Consumer | Controlled prop/callback, even if it looks like UI state |

For every public visual boundary, use a strict union rather than nullable data or a cluster of booleans:

```ts
export type AsyncState<T> =
  | { status: "loading" }
  | { status: "empty"; message?: string }
  | { status: "error"; message: string; onRetry?: () => void }
  | { status: "ready"; data: T };
```

Model independent boundaries independently. A ready header may coexist with an unavailable chart; do not erase useful content with one global loading flag.

Use discriminated unions for mutually exclusive selections and presentation shapes:

```ts
type Selection<AssetId extends string, EventId extends string> =
  | { kind: "asset"; assetId: AssetId }
  | { kind: "event"; eventId: EventId };
```

Use generic string-literal IDs when the consumer benefits from compile-time checking. Pass formatted labels, localized copy, semantic tone, image URLs, and accessible descriptions in props; do not embed API/domain formatting inside the package.

## Build the right layers

1. Reuse an existing primitive when it has the needed semantic and visual contract.
2. Add a foundation primitive only for a recurring, independently useful behavior (for example, text, surface, badge, skeleton, segmented control, or button variant).
3. Add feature primitives for meaningful domain parts such as navigation, header, stats, outcomes, status, or source tabs.
4. Compose feature primitives into desktop, mobile, card, panel, and responsive-root views.
5. Export each intentionally reusable public component and prop type from `src/index.ts`.

Use semantic native controls, stable `className` hooks, and `data-*` visual-state attributes. Do not export wrappers that exist only to shorten one file. Preserve backwards-compatible exports unless the user approves a breaking change.

## Handle DOM runtimes locally

For a chart or another DOM-backed renderer, accept all content through props and own only mount/update/resize/dispose behavior. Keep renderer state local and clean it up on unmount. Add a direct dependency only when the renderer is an intentional package capability; keep React a peer dependency.

```ts
useEffect(() => {
  if (!elementRef.current || state.status !== "ready") return;
  const renderer = createRenderer(elementRef.current);
  const observer = new ResizeObserver(() => renderer.resize());
  observer.observe(elementRef.current);
  return () => {
    observer.disconnect();
    renderer.dispose();
  };
}, [state.status]);
```

Never turn this lifecycle into a feed subscription, timer-derived product state, or persistence layer.

## Test and visualize the contract

Add the smallest useful layer for each risk:

| Risk | Required coverage |
| --- | --- |
| Public types and prohibited known integrations | Type build and `pnpm run check:components` |
| Visible state/shape | Storybook stories for default, loading, empty, error, disabled, selected, and narrow layouts that exist |
| Controlled behavior | Browser `play` tests using accessible roles and consumer-like fixture state |
| DOM renderer lifecycle/options | Focused test with a renderer mock where practical, plus a ready-data browser story |
| Semantics and keyboard behavior | Storybook accessibility checks and keyboard interaction coverage |
| Responsive visual fidelity | Visual baseline with deterministic fixtures; freeze or disable chart animation/time when snapshotting |

The package policy check is a guardrail for known forbidden patterns, not proof of app neutrality. Review imports and dependencies for unlisted clients, persistence, stores, routing, analytics, and application coupling.

## Complete the delivery

Before handoff:

1. Confirm all six outcomes: consumer-supplied external state, strict input unions, intentional internal UI state, primitive decomposition, tests, and Storybook state/shape coverage.
2. Update the PRD, OpenSpec design/tasks/spec delta, package README, and consumer guidance when the public contract changed.
3. Run `pnpm run check:components`, `pnpm run build:components`, browser Storybook tests, `pnpm --dir apps/ui run build-storybook`, and `pnpm run lint` as applicable.
4. Commit regenerated `packages/ui-components/dist/` output with public source/export changes.
5. If agent instructions or skills changed, run `pnpm run agent:sync-parity` and `pnpm run agent:check-parity`.

Report the source behaviors retained, app integrations intentionally excluded, exported contracts, story/test coverage, and validation results.
