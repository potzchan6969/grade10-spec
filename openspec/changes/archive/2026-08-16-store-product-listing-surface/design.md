# Design: the store product-listing surface

Capability spec: [`shared/ui/store-product-listing`](specs/shared/ui/store-product-listing/spec.md)
(new). Package contract delta:
[`shared/ui/component-package`](specs/shared/ui/component-package/spec.md).

Design source: [Grade10-DS-2026](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026).
Composed primitives:
[`ProductCard` 4200:155](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4200-155),
[`StoreHeader` 4171:9937](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-9937),
[`Footer` 4171:9653](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-9653).
The interim record of the assembled surface is
`packages/design-system/src/pages/product-list-page.stories.tsx`, retired by
this change.

## Package shape

```text
packages/ui/src/
  components/
    store-product-listing/
      product-listing.tsx
      product-filter-panel.tsx
      product-listing-toolbar.tsx
      product-grid.tsx
      types.ts
      *.stories.tsx
  index.ts            # re-exports exactly the names the capability spec lists
```

The directory name matches the capability ID, per the convention
`reinstate-shared-ui-package` set. That change's design illustrated the
directory as `store-plp`; `store-product-listing` supersedes it, because the
convention is worth more than the abbreviation.

## The boundary: what is shared and what is not

Three layers, and the question that assigns a component to one:

| Layer | Home | Test |
| --- | --- | --- |
| Primitive | `packages/design-system` | Its variants are defined by a Figma component set, and it ships no store's content |
| Compound component | `packages/ui` | A capability spec names it, and more than one store imports it by name |
| Assembly | the application | It is put together once, for one store's route |

`ProductCard` passes the primitive test despite its domain name: two Figma
variant axes, and every prop already display-ready — `price` is a formatted
string, not a number and a currency. `StoreHeader` and `Footer` pass the shell
half of the test and fail the content half, which is what the
`component-package` delta fixes rather than moving them.

The listing surface is the compound layer. A store's header and footer
*content* is assembly and stays in the application — this change deliberately
adds no shared store-chrome composite, because a shared component that decides
one store's navigation is the problem restated.

## Decisions and alternatives

### Four exports, not one

Chosen: a controlled root plus three independently renderable parts.

- *Rejected — one `ProductListing` export.* A search-results surface and a
  brand page both want the grid and the filter panel without the listing root.
  Exporting only the root guarantees the second surface either duplicates them
  or refactors this one under time pressure.
- *Rejected — exporting every rung, including a header composite and a tile
  wrapper.* A breadcrumbs-plus-heading block is three primitives in a column
  with no independent semantic contract; the contracts guide's rule against
  exporting a wrapper to shorten one file applies. The root takes a `header`
  slot instead.

### Discriminated async state per region, not per surface

Chosen: filters and results each carry their own `AsyncState`, following the
pattern in [`ui-component-contracts.md`](../../../docs/governance/ui-component-contracts.md).

```ts
export type AsyncAction = { label: ReactNode; onAction: () => void };

export type AsyncState<T> =
  | { status: "loading" }
  | { status: "empty"; message: ReactNode; action?: AsyncAction }
  | { status: "error"; message: ReactNode; action?: AsyncAction }
  | { status: "ready"; data: T };
```

Retry is an `action` carrying its own label rather than a bare `onRetry`
callback. A bare callback leaves the package to name the button, and the only
name it could use is a built-in English one — which the copy requirement
forbids. The two failure conditions render identically, so they share a shape.

- *Rejected — one `isLoading` boolean plus nullable data.* It makes
  "filters ready, results failed" unrepresentable, and that is the common case:
  facets come from one call, results from another.
- *Rejected — collapsing empty into ready-with-zero-products.* The consumer has
  to distinguish an empty catalog from a filter selection matching nothing, and
  inferring it from `data.length === 0` plus the selection puts product
  judgment inside the package.

`empty` carries its own message and optional action so the no-match case can
offer clear-filters without a second prop path.

### Filter selection as a group-keyed set

```ts
export type FilterOption = {
  id: string;
  label: ReactNode;
  count?: ReactNode;
  disabled?: boolean;
};
export type FilterGroup = {
  id: string;
  label: ReactNode;
  options: readonly FilterOption[];
};
export type FilterSelection = Readonly<Record<string, readonly string[]>>;
```

Labels and counts are `ReactNode` rather than `string` so a consumer can pass
formatted markup, matching how the design-system primitives already type their
content. `count` is optional because `CheckboxListInput` treats an absent count
as Figma's `showCount: false` — a capability a required field would remove.

Chosen: selection keyed by group ID, values as option IDs, reported as
`onFilterChange(groupId, optionId, selected)`.

- *Rejected — a flat array of selected option IDs.* Option IDs would have to be
  globally unique across groups, which pushes a namespacing rule onto every
  consumer's adapter.
- *Rejected — a discriminated union per group kind (checkbox, range, radio).*
  Only multi-select checkbox groups are drawn today. The price range in the
  design is a static string, so it is a `summary?: string` on the panel until a
  range control is actually specified. Adding a union now would be structure
  built for a control nobody has designed.

`count` is a string, not a number: it is display-ready, and a consumer that
wants `1.2k` should not have to fight a formatter in the package.

### Prices and counts are strings

`price`, `originalPrice`, `discountLabel`, and the toolbar's result count are
consumer-formatted strings. This follows the normalized-presentation-data
decision in the contracts guide.

- *Rejected — minor units plus an ISO 4217 code, formatted in the package.*
  That is the correct shape for a money *value* in a spec, and the repo requires
  it there. But formatting it needs locale, currency display rules, and the
  store's rounding policy — three things the package is forbidden to know. The
  application formats; the package displays.

### Sort as a supplied option list

```ts
export type SortOption = { id: string; label: string };
```

- *Rejected — a fixed enum of the five options in the design.* The design's
  five are Grade10's merchandising choice today. A second store with a
  different catalog will want a different set, and a fixed enum makes that a
  package change.

### Required props over defaults on the chrome

Chosen: remove the Grade10 defaults from `StoreHeader` and `Footer` and make
those props required.

- *Rejected — keeping the defaults and documenting them.* The failure this
  fixes is silent. A comment does not fail a build.
- *Rejected — making the props optional with no default, rendering nothing when
  omitted.* A header that silently renders without navigation is a different
  silent failure. Required is the only version the compiler enforces.
- *Rejected — moving the current defaults into a `grade10Defaults` export.* It
  keeps one store's IA in the shared package under a nicer name, and the second
  store would find it and be tempted.

The design-system stories and the relocated surface story supply the Grade10
content explicitly, which is also what makes the story readable as an example.

### Layout is the component's, breakpoints are the token scale's

The four/two/one column progression and the 260px sidebar come from the design
source. They are the component's, not the consumer's, because a store that
wants a different grid wants a different design, not a prop.

- *Rejected — a `columns` prop.* It invites two stores to diverge visually with
  no design behind either choice.
- *Rejected — a container-query layout now.* The surface is a page-level region
  whose width tracks the viewport; container queries would add a mechanism with
  no case yet. Revisit if the grid is ever embedded in a narrow slot.

## Design-sync stance

`StoreHeader` and `Footer` change their TypeScript prop requirements only. No
markup, class, token, or `cva` axis changes, so their Figma component sets and
Code Connect templates stay valid and `pnpm run check:design-system` compares
the same things it compares today. Compound components remain outside
`design-code-sync.md`, which governs primitives.

## Story relocation

The surface story moves to `packages/ui/src/components/store-product-listing/`
and is rewritten against the new exports, supplying Grade10 content explicitly.
`packages/design-system/src/pages/` is removed: it was never described by
`AGENTS.md`, the governance docs, or `check-components.mjs`, and the design
system's own convention is stories colocated with the primitive they exercise.

## Validation approach

Repository: `pnpm run typecheck`, `pnpm run lint`,
`pnpm run check:design-system`, `pnpm run test:stories`, and
`openspec validate --specs` plus `openspec validate store-product-listing-surface`.

Story coverage carries the contract: a story per consumer-observable state the
spec names, a narrow-viewport story, and play interactions for filter, sort,
and page changes asserting the callback fired and the display did not move on
its own. Accessibility checks run on every story. Catalog correctness — which
products match a filter and in what order — is verified in the applications,
never here.
