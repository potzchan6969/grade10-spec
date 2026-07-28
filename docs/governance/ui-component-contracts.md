# Portable UI component contracts

This guide records the reusable implementation decisions established while building `FeaturedMarkets`. It applies to the portable components in `packages/ui-components/`, not to consuming applications. Read it with [the component rules in `AGENTS.md`](../../AGENTS.md) and [the package README](../../packages/ui-components/README.md).

## Purpose and boundary

A portable component renders a consumer-owned presentation. In this repository, “stateless” means it does not own or connect to **external product state**; it does not mean hooks or internal UI state are prohibited. A component may own ephemeral presentation and DOM behavior, but it does not decide what external data is current, perform product actions, or connect itself to an application.

| Belongs in the component | Belongs in the consuming application |
| --- | --- |
| Markup, styling, semantic controls, focus treatment, and responsive composition | Data fetching, subscriptions, caches, stores, authentication, feature flags, and browser storage |
| Typed visual states, prop-driven formatting, callbacks, and local DOM-renderer lifecycle | Routing, analytics, notifications, clipboard, countdown derivation, and retry implementation |
| App-neutral primitives and feature composites | Mapping domain/API data into the component's normalized contract |

`FeaturedMarkets` is the reference implementation: its app-facing panel was decomposed into controlled primitives and composites, while its store, live feed, route, analytics, market-countdown derivation, and app-specific icons were deliberately excluded.

## Decisions established by Featured Markets

| Decision | Rationale | Rule for future components |
| --- | --- | --- |
| Controlled product state | Every consumer-observable state can be rendered in a consumer, a test, or Storybook without hidden setup. | Receive selected values and product state through props; expose changes as `on<Event>` callbacks. Internal, transient presentation state may remain local. |
| Discriminated async state | `undefined`, booleans, and nullable data produce impossible combinations and make empty/error treatment easy to miss. | Use an explicit union for `loading`, `empty`, `error`, and `ready` whenever a component boundary has asynchronous content. |
| Independent state boundaries | A loaded navigation list can coexist with an unavailable chart or summary. | Model independently resolving regions independently; do not collapse unrelated readiness into one global boolean. |
| Normalized presentation data | The package must not know API schemas, number formats, clock logic, or market semantics. | Consumers provide display-ready labels, formatted values, semantic tones, status text, and callbacks. |
| Local DOM lifecycle | Canvas/chart libraries need a DOM instance and resize cleanup, but that does not justify application state. | Keep renderer lifecycle local and prop-driven; never use it to fetch, subscribe to, or persist product data. |
| Primitive-first composition | Shared visual and accessibility behavior should not be copied into each feature card. | Export small primitives where they have independent reuse value; compose feature-specific pieces from them. |
| Public API discipline | This package is consumed from a Git submodule and generated `dist/` output. | Export prop types from `src/index.ts`; treat required prop and semantic changes as consumer-facing compatibility work. |

## Design the contract before markup

Start with a concise inventory of what the consumer owns:

1. **Content** — labels, images, formatted values, localized copy, and accessibility descriptions.
2. **Consumer-observable state** — loading, empty, error, resolved, selected, disabled, and responsive input that the caller must control or reproduce.
3. **Behavior** — named callbacks for every user action.
4. **Identity** — stable IDs for options and a discriminated selection when more than one selection shape exists.
5. **Presentation variants** — a union when the data needed by each visual shape differs materially.

Do not expose a component prop shaped like an API response. Do not ask a reusable component to infer a loading state from missing content. If a caller needs domain conversion, create an app-owned adapter before the component boundary.

### Model asynchronous content explicitly

`FeaturedAsyncState<T>` is the default pattern for a visual boundary:

```ts
export type FeaturedAsyncState<T> =
  | { status: "loading" }
  | { status: "empty"; message?: string }
  | { status: "error"; message: string; onRetry?: () => void }
  | { status: "ready"; data: T };
```

Use the smallest appropriate boundary. For example, Featured Markets independently models duration data, event data, desktop presentation, mobile presentation, and chart data. An error in a chart must not erase a ready market summary.

### Make mutually exclusive selections impossible to misrepresent

When a user can select different entity families, use a discriminated union instead of optional IDs:

```ts
export type FeaturedMarketSelection<
  AssetId extends string,
  DurationId extends string,
  EventId extends string,
> =
  | { kind: "duration"; assetId: AssetId; durationId: DurationId }
  | { kind: "event"; eventId: EventId };
```

This prevents invalid values such as a duration and an event being selected at once. Prefer caller-supplied string-literal generics for IDs so a consumer receives compile-time checking against its own fixture or adapter data.

### Separate display variants that require different data

A chart presentation needs line-series data; a summary-only presentation does not. Model that distinction directly:

```ts
type MarketPresentation<SourceId extends string> =
  | {
      kind: "chart";
      summary: MarketSummary<SourceId>;
      chart: FeaturedAsyncState<ChartData>;
    }
  | { kind: "summary"; summary: MarketSummary<SourceId> };
```

Do not encode this with optional `chart?` fields and then infer behavior at render time. A discriminant documents supported shapes and makes handling a newly added variant a TypeScript error.

### Keep the root controlled

The package does not store the selected market or mobile tab:

```tsx
<FeaturedMarkets
  selection={selection}
  onSelectionChange={setSelection}
  mobileTab={mobileTab}
  onMobileTabChange={setMobileTab}
/>
```

The consuming application owns this product-selection loop. A portable component may still use `useState` for internal presentation state—such as an expanded section, a transient tooltip, or a focus interaction—when that state does not need consumer control or persistence.

## Composition and primitive guidelines

Build in layers, with a clear public reason for every exported piece:

1. **Foundation primitives** own recurring semantic behavior and small visual contracts: `Stack`, `Surface`, `Text`, `Badge`, `Skeleton`, `SegmentedControl`, and the compatible `Button` variants.
2. **Feature primitives** represent reusable parts of one domain: asset tabs, duration/event lists, source tabs, header, stats, outcomes, insight, and status.
3. **Composites** assemble a user-facing region: desktop panel, chart card, summary card, desktop view, mobile view, and responsive root.

An abstraction is justified when it has an independent semantic contract, visual state, or likely reuse. Do not export a wrapper solely to shorten one file. Conversely, do not duplicate interactive tab, button, loading, error, or focus logic across feature composites.

Every reusable primitive should, where relevant:

- accept `className` for consumer layout integration;
- choose a semantic native element or support an explicit semantic element choice;
- expose stable `data-*` state attributes such as selected, disabled, or tone for styling and diagnosis;
- use native `disabled`, `aria-selected`, tablist, heading, and button semantics rather than div-based imitations; and
- make consumer-observable state, or state requiring a controlled variant, available through props; transient presentation state may remain local.

## DOM-backed visual behavior

Internal React state, effects, refs, timers, and browser APIs are permitted for presentation and DOM behavior. A renderer such as ECharts needs a DOM-bound instance; its lifecycle belongs to the component, while every market value remains consumer-provided.

Before adding DOM-backed behavior, document:

1. the behavior and its user-facing purpose;
2. the complete prop-driven input contract;
3. the mount, update, resize, and disposal lifecycle; and
4. why it does not acquire, persist, subscribe to, or derive consumer-owned product state.

The `FeaturedMarketLineChart` reference does only this:

```ts
useEffect(() => {
  if (!elementRef.current || state.status !== "ready") return;

  const chart = echarts.init(elementRef.current);
  const observer = new ResizeObserver(() => chart.resize());
  observer.observe(elementRef.current);

  return () => {
    observer.disconnect();
    chart.dispose();
  };
}, [state.status]);
```

It does not fetch data, subscribe to feeds, persist user data, or derive product state. The package checker permits internal runtime APIs and scans for known external data, persistence, routing, store, analytics, and feature-flag integrations. That scan is a guardrail; code review must still reject unlisted clients and application imports.

## Testing and review guidance

Use the smallest test layer that proves the contract. The current Featured Markets examples live in `apps/ui/src/stories/FeaturedMarkets.stories.tsx` and the package README has executable samples and commands.

| Risk | Appropriate verification |
| --- | --- |
| Invalid public state shape or a known forbidden external integration | Type checking and `pnpm run check:components`, plus code review for unlisted clients and application imports |
| A state or responsive presentation fails to mount | Storybook render story for default, loading, empty, error, disabled, and narrow layouts that exist |
| A controlled interaction does not emit/render the correct state | Storybook `play` interaction in Chromium using accessible roles |
| Native semantics, labels, focus, or contrast regress | Storybook accessibility checks; make them blocking after the relevant baseline is clean |
| Spacing, color, responsive shape, or chart rendering regresses | Visual baseline with deterministic fixture data and frozen/disabled chart animation |
| Store/API/router/analytics wiring fails | Consumer-application integration or end-to-end test, never this portable package |

For a new or changed public component, reviewers should be able to answer yes to each question:

- Can a consumer render every meaningful, consumer-observable state using props alone?
- Are error, empty, disabled, and loading states explicit rather than inferred?
- Does every user action have a clearly named callback and no hidden application side effect?
- Are IDs and mutually exclusive display shapes represented by appropriate discriminated types?
- Is DOM-backed behavior documented, scoped to presentation, and cleaned up without acquiring or persisting product state?
- Do stories exercise the visible states, narrow viewport, and a representative interaction?
- Were `check:components`, `build:components`, browser Storybook tests, Storybook build, and lint run as applicable?
- Are public exports, consumer documentation, generated `dist/`, PRD, and OpenSpec records aligned?

## Applying the guide

Use this guide for a new portable component or a material public-contract change. Update the linked PRD and OpenSpec change when the behavior, consumer contract, or validation obligations change. Keep feature-specific decisions in the PRD/OpenSpec; update this guide only for durable rules that should apply beyond one feature.

Related records:

- [Featured Markets PRD](../prds/predictions/featured-markets-component.md)
- [Featured Markets implementation change](../../openspec/changes/add-featured-markets-component/)
- [PRD and OpenSpec lifecycle](prd-and-openspec.md)
