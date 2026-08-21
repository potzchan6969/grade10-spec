# The words a block renders, shaped and typed as words

**Author:** @seankcw - 2026-08-21

## Why

`packages/ui` takes 231 props across its blocks. Ninety-one are `ReactNode`,
and of the 45 named `*Label`, 36 are `ReactNode` and 9 are `string` — the nine
being exactly the ones the implementation happened to bind to `aria-label` or
`alt`. The type is chosen by what the component needed internally, not by what
the prop is.

Nothing passes markup to any of them. Across both repositories — the two
storefronts, both admin panels, the preview assemblies and every story — the
props ever given JSX are the slots: `actions`, `standing`, `watchAction`,
`leading`, `trailing`, `render`. Not one label, in three years of stories that
exist precisely to exercise the edges.

So the 36 cost something for nothing. A `ReactNode` cannot be an accessible
name, cannot be uppercased, truncated or measured, and cannot be compared —
which is why `ProductCard` carries both `cartLabel: string` and a separate
`ariaLabel: string`, and why `soldOutLabel` cannot be the accessible name it
visually is.

The second cost is arrangement. `ListingBidPanel` takes 21 flat props that
mix four unrelated things: what the panel is called (`priceLabel`,
`endsLabel`), what it says right now (`price`, `remaining`, `deadline`), what
the consumer renders inside it (`standing`, `history`, `actions`), and its
state (`watching`). A consumer reading the type cannot see which of those it
owns, and an application assembling copy has to flatten every block's labels
by hand — `ListingViewCopy` is about eighty fields restating labels the blocks
already declare.

**Metric:** copy props typed against what they are, from 9 of 45 to all of
them. **Acceptance signal:** an application builds one nested copy object
from its catalogs, and a block's own type says what words it needs.

## What Changes

- **A label is a string.** Every prop that names a thing — a label, a heading,
  a placeholder, a title, a hint — is typed `string`. `ReactNode` stays where a
  consumer composes markup: the slots, and nothing else.
- **A block declares its words as one type.** Each block exports a `<Block>Copy`
  type and takes it as a single `copy` prop. Values that change per render
  (`price`, `remaining`, `resultCount`) stay their own props, because they are
  data rather than words.
- **Copy types compose.** A surface's copy type is built from the copy types of
  the blocks it renders, so an application maps its catalogs once and the
  compiler carries it down. The hand-flattened copy types in the application's
  feature slices shrink to that.
- **The deprecated pair goes.** `showHistoryLabel` and `hideHistoryLabel` on
  `ListingBidPanel` are already marked as such and have no behavior behind
  them.

## Non-Goals

- **New copy, new components, or new states.** Nothing a collector reads
  changes, and no block gains a capability.
- **Naming the unspecified blocks.** The auction-listing, auth-sign-in,
  auth-two-factor and store-profile blocks are in `packages/ui` without a
  capability spec naming their exports. They take the same shape here, but
  giving them export contracts of their own is its own change — flagged, not
  fixed.
- **Moving copy into the package.** A block still imports no catalog. What
  changes is the shape of what it is handed, not who owns it.
- **The design-system primitives.** `packages/design-system` keeps its props;
  this is about the compound blocks a capability spec names.

## Capabilities

### Modified Capabilities

- `shared-ui/component-package`: how a block's human-readable content is
  shaped and typed — the rule every block follows, beside the app-neutrality
  it already states.
- `shared-ui/store-product-listing`: the listing exports gain their copy types
  and take them as one prop.
- `shared-ui/site-chrome`: the same for `Nav` and `Footer`.

## Impact

- **`packages/ui`** — every block's props type splits into copy, values, slots
  and state; the copy half becomes an exported type. Stories and preview
  assemblies pass a copy object rather than a label list.
- **The application repository** — the feature slices' copy types
  (`ListingViewCopy`, `ProfileViewCopy`, `SignInFlowCopy`) compose the blocks'
  instead of restating them, and the catalog-to-copy mapping written for
  `add-site-localization` moves with them. No page changes what it renders.
- **Translation** — a block's copy type is the list of words that block needs,
  which is what a catalog namespace already groups. The two can finally be
  checked against each other; this change does not do that, but it is what
  makes it possible.
