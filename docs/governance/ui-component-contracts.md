# Product UI component contracts

This guide records the reusable implementation decisions established while building this repository's first portable product components. It defines the contract a product UI component must satisfy; the component itself is implemented once in `packages/ui` (`@grade10/ui`) and imported by every application that renders it. Read it with [the component rules in `AGENTS.md`](../../AGENTS.md).

This repository once shipped those components as the prebuilt `packages/ui-components`, removed while a single application consumed it; the `reinstate-shared-ui-package` change brought the shared home back as the source-consumed `packages/ui` once a second application arrived. The rules below describe the obligation on that package's components. The design-system primitives in `packages/design-system` remain governed separately — read [`design-code-sync.md`](design-code-sync.md) before adding or changing one.

## Purpose and boundary

A portable component renders a consumer-owned presentation. In this repository, “stateless” means it does not own or connect to **external product state**; it does not mean hooks or internal UI state are prohibited. A component may own ephemeral presentation and DOM behavior, but it does not decide what external data is current, perform product actions, or connect itself to an application.

| Belongs in the component | Belongs in the consuming application |
| --- | --- |
| Markup, styling, semantic controls, focus treatment, and responsive composition | Data fetching, subscriptions, caches, stores, authentication, feature flags, and browser storage |
| Typed visual states, prop-driven formatting, callbacks, and local DOM-renderer lifecycle | Routing, analytics, notifications, clipboard, countdown derivation, and retry implementation |
| App-neutral feature composites | Mapping domain/API data into the component's normalized contract |

The reference pattern: an app-facing panel is decomposed into controlled primitives and composites, while its store, live feed, route, analytics, derived values, and app-specific icons are deliberately excluded and remain with the application.

## Established decisions

| Decision | Rationale | Rule for future components |
| --- | --- | --- |
| Controlled product state | Every consumer-observable state can be rendered in a consumer, a test, or Storybook without hidden setup. | Receive selected values and product state through props; expose changes as `on<Event>` callbacks. Internal, transient presentation state may remain local. |
| Discriminated async state | `undefined`, booleans, and nullable data produce impossible combinations and make empty/error treatment easy to miss. | Use an explicit union for `loading`, `empty`, `error`, and `ready` whenever a component boundary has asynchronous content. |
| Independent state boundaries | A loaded navigation list can coexist with an unavailable chart or summary. | Model independently resolving regions independently; do not collapse unrelated readiness into one global boolean. |
| Normalized presentation data | The package must not know API schemas, number formats, clock logic, or market semantics. | Consumers provide display-ready labels, formatted values, semantic tones, status text, and callbacks. |
| Local DOM lifecycle | Canvas/chart libraries need a DOM instance and resize cleanup, but that does not justify application state. | Keep renderer lifecycle local and prop-driven; never use it to fetch, subscribe to, or persist product data. |
| Primitive-first composition | Shared visual and accessibility behavior should not be copied into each feature card. | Build the component's button, badge, card, and tab rungs once and reuse them, against the design-system token values rather than ad-hoc literals. The former component package originally exported its own primitive layer; the `move-primitives-to-design-system` change removed it, because a second Button styled against a private palette drifted from the design one silently. |
| Public API discipline | Other features import the component by name and depend on its prop shape. | Export the component and its prop types from one entry module; treat required prop and semantic changes as consumer-facing compatibility work. |

## Which layer a component belongs to

Three layers, and the question that assigns a component to one. Ask them in
order; the first that fits is the answer.

| Layer | Home | Stories | Test |
| --- | --- | --- | --- |
| Primitive | `packages/design-system` | Colocated | Its variants are defined by a Figma component set, and it ships no store's content |
| Compound component | `packages/ui` | Colocated | A capability spec names it, and more than one store imports it by name |
| Assembly | the consuming application | `apps/preview` | It is put together once, for one store's route |

An assembly has no home in either package, but it still has to be reviewable as
a shopper meets it. `apps/preview` is that preview: the one workspace that imports
both packages, supplying page content and owning the state loop the way a store
does. A page story there is an example, never a contract — anything testable
about the surface belongs in its capability spec.

The test is not "is it compound?" — a composite can be a primitive. A Figma
set named `Product / …` is a listing-surface block in `packages/ui`, even when
every prop is already display-ready: the folder in the file is the assignment,
not the presence of variant axes. `Nav` and `Footer` stay in the design system
because they are store chrome, not a product item.

The second half of the primitive test is the one that gets missed. A shared
component may not supply a default, fallback, or built-in value for any prop
carrying a store's brand, navigation, catalog, locale, copy, or corporate
attribution — those props are required, so omitting one fails type checking
rather than silently rendering another store's identity. A default for a
variant, size, layout, accessibility behavior, or a standard control's
accessible name is fine; none of those displays a store's content. This rule
was recorded after `StoreHeader` and `Footer` shipped with one store's
navigation, link columns, and corporate attribution as defaults, which a second
store would have inherited with nothing failing.

Where such a component has a Figma Code Connect template, the template must
emit every required prop, or the snippet a designer copies out of Dev Mode will
not compile.

## Where a block lives and what it is named

`packages/ui/src/blocks/` is one flat level of capability directories. The
namespace is the **capability, never the page**: a page is an assembly, so the
sections of a page being converted or specified belong to the capabilities
they express, and the page itself never gets a directory. For each new block,
the assigning question is *which capability spec names, or will name, this
export?* If the capability's directory exists, the block joins it; if the spec
exists but no directory does, create one; if no spec exists, the spec comes
first — never mint a directory ahead of its capability.

The conventions, each visible in the existing directories:

- **Directory: a globally unique `<product-context>-<capability>` kebab
  slug.** `auth-sign-in` carries `shared-auth/sign-in`; `auction-listing`
  carries `grade10-auction/listing-page`. Because `blocks/` is flat, the slug
  includes enough product context to read standalone — `sign-in` alone is
  ambiguous the day a second product grows one. No nesting, and no
  subdirectories inside a capability directory.
- **The component name carries the namespace.** `src/index.ts` is a single
  flat export surface, so PascalCase names take a capability prefix:
  `ListingBidPanel`, `SignInCard`, `TwoFactorVerifyForm`. The test: the name
  reads unambiguously in a consumer's import statement with the path out of
  sight. Never a generic name (`Card`, `Panel`, `Header`) — it collides
  across capabilities and shadows the primitive it composes.
- **One component per file, satellites share the basename.** `<name>.tsx`,
  `<name>.stories.tsx`, `<name>.figma.ts`, `<name>.css` plus `.css.d.ts`, and
  one per-directory `types.ts` and `fixtures.ts`. The basename match is
  load-bearing for the same reason as in the design system: the template and
  stories are found by it. A page-scale composition the spec names
  (`product-browse.tsx`) lives flat in its capability directory like any
  other block.
- **A block converted from Figma also carries one per-directory
  `audit.json`** — the element↔node value audit that `pnpm run design-sync:audit`
  re-checks nightly. Its `classes` column is a snapshot of the component's
  own class strings, so changing a class in a block means updating its audit
  entry in the same edit; a token-free freshness test in the package's test
  suite fails when the two diverge, naming the stale class.
- **Exports go through the spec-named barrel group.** One commented group per
  capability in `src/index.ts` (`// shared-ui/auction-listing`), exporting
  exactly what the capability spec names — the component and its
  `Props`/`Copy` types. No per-directory `index.ts`; that is a second,
  uncontracted export surface. The `./blocks/*` subpath exists for direct
  file access, but anything a consumer imports by name goes through the root
  barrel, and adding to it is an OpenSpec change naming the export.
- **`shared/` is earned, not planned.** A helper lands in its capability
  directory and is promoted when its *second* consumer appears. Today's
  `shared/` is exactly that — cross-capability plumbing, not "things that
  look reusable."

The failure this section exists to prevent: a per-page directory
(`blocks/store-home-page/`) is the path of least resistance while converting
a page design, and it inverts the ownership — the next page reuses nothing,
every block grows a twin, and the twins drift.

## Design the contract before markup

Start with a concise inventory of what the consumer owns:

1. **Content** — labels, images, formatted values, localized copy, and accessibility descriptions.
2. **Consumer-observable state** — loading, empty, error, resolved, selected, disabled, and responsive input that the caller must control or reproduce.
3. **Behavior** — named callbacks for every user action.
4. **Identity** — stable IDs for options and a discriminated selection when more than one selection shape exists.
5. **Presentation variants** — a union when the data needed by each visual shape differs materially.

Do not expose a component prop shaped like an API response. Do not ask a reusable component to infer a loading state from missing content. If a caller needs domain conversion, create an app-owned adapter before the component boundary.

### A word is a string, a slot is a node

Content splits in two, and the type says which half a prop is in.

- **A word** is something the component says: a label, a heading, a placeholder, a hint, an accessible name. It is a `string`. A component holding a string can name a control with it, truncate it, transform its case, or compare it — and one holding a node can do none of those, which is what forces a second prop carrying the same text.
- **A slot** is markup the consumer composes and the component only places: actions, banners, badge rows, a card's body. It is a `ReactNode`, and it is a prop of its own.
- **A value** is what the component is showing right now — a formatted price, a count, a remaining time. It stays its own prop, because it changes with the data rather than with the language.

Every word a component renders arrives in a single `copy` prop, whose type the component exports under its own name (`ProductCardCopy`, `NavCopy`). A component that renders others composes theirs, so a surface declares its words once and the compiler carries them down. A word every item renders the same way belongs to the list rather than to each item: supplying it per item invites two tiles to disagree about what the cart button is called.

The consuming application composes the same way. A slice's copy type is the
copy types of the blocks it renders, plus the words the slice itself says —
never those blocks' labels restated one flat key at a time and adapted at the
JSX call site. Both shapes typecheck, which is why this has to be a rule: the
flat one just moves the assembly into the markup, where the next block added
to the surface has nowhere to declare its words. The auction's
`ListingViewCopy` carries the gallery's copy type and the details', and reads
as the page reads.

Where the word depends on product state, the vocabulary stays with the
consumer and an adapter folds one copy object out of it. A lot's bid panel
labels the same slot "Starting bid", "Current bid", "Winning bid", or
"Result", according to where the lot is in its life — which the panel must not
know. So the four words live on the slice's copy type and the function that
already derives the screen state hands the panel one `ListingBidPanelCopy`,
worded. This is not an exception to composition; the copy object is still
assembled once, above the component, by whoever knows enough to choose.

### Model asynchronous content explicitly

A discriminated `AsyncState<T>` is the default pattern for a visual boundary:

```ts
export type AsyncState<T> =
  | { status: "loading" }
  | { status: "empty"; message?: string }
  | { status: "error"; message: string; onRetry?: () => void }
  | { status: "ready"; data: T };
```

Use the smallest appropriate boundary. For example, a market panel can independently model duration data, event data, desktop presentation, mobile presentation, and chart data. An error in a chart must not erase a ready market summary.

### Make mutually exclusive selections impossible to misrepresent

When a user can select different entity families, use a discriminated union instead of optional IDs:

```ts
export type MarketSelection<
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
      chart: AsyncState<ChartData>;
    }
  | { kind: "summary"; summary: MarketSummary<SourceId> };
```

Do not encode this with optional `chart?` fields and then infer behavior at render time. A discriminant documents supported shapes and makes handling a newly added variant a TypeScript error.

### Keep the root controlled

A portable component does not store the selected market or mobile tab:

```tsx
<MarketsPanel
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

A line-chart component under this contract does only this:

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

It does not fetch data, subscribe to feeds, persist user data, or derive product state. Internal runtime APIs are permitted; external data, persistence, routing, store, analytics, and feature-flag integrations are not. Code review must reject those clients and any import that reaches into a surrounding feature.

## Testing and review guidance

Use the smallest test layer that proves the contract. This repository owns the component's stories and checks; the consuming application owns feature-level integration verification.

| Risk | Appropriate verification |
| --- | --- |
| Invalid public state shape or a known forbidden external integration | Type checking, plus code review for external clients and feature imports |
| A state or responsive presentation fails to mount | Storybook render story for default, loading, empty, error, disabled, and narrow layouts that exist |
| A controlled interaction does not emit/render the correct state | Storybook `play` interaction in Chromium using accessible roles |
| Native semantics, labels, focus, or contrast regress | Storybook accessibility checks; make them blocking after the relevant baseline is clean |
| Spacing, color, responsive shape, or chart rendering regresses | Visual baseline with deterministic fixture data and frozen/disabled chart animation |
| Store/API/router/analytics wiring fails | Feature-level integration or end-to-end test, never the component itself |

For a new or changed public component, reviewers should be able to answer yes to each question:

- Can a consumer render every meaningful, consumer-observable state using props alone?
- Are error, empty, disabled, and loading states explicit rather than inferred?
- Does every user action have a clearly named callback and no hidden application side effect?
- Are IDs and mutually exclusive display shapes represented by appropriate discriminated types?
- Is DOM-backed behavior documented, scoped to presentation, and cleaned up without acquiring or persisting product state?
- Do the examples exercise the visible states, narrow viewport, and a representative interaction?
- Were this repository's typecheck, lint, and story checks run, and each affected application's build where the contract changed?
- Do the public exports match the export contract in the capability spec, and does the consumer documentation agree?

## Applying the guide

Use this guide for a new product UI component or a material public-contract change. When behavior, the consumer contract, or validation obligations change, carry the change as a delta against `openspec/specs/<product>/<capability>/spec.md`; update the PRD only if the product decision behind it changed. Keep feature-specific requirements in the capability spec; update this guide only for durable rules that should apply beyond one feature. Use the [interaction and motion testing scope](ui-component-testing.md) to choose the required browser coverage.

Related records:

- [PRD and OpenSpec lifecycle](prd-and-openspec.md)
