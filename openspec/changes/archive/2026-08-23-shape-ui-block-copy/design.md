# Design: The words a block renders, shaped and typed as words

Capability deltas:
[`component-package`](specs/shared-ui/component-package/spec.md),
[`store-product-listing`](specs/shared-ui/store-product-listing/spec.md),
[`site-chrome`](specs/shared-ui/site-chrome/spec.md).
Motivation: [proposal.md](proposal.md) — Why.

## Context

A block's props type is one flat list today. `ListingBidPanelProps` is
twenty-one entries covering four unrelated things — what the panel is called,
what it currently says, what the consumer renders inside it, and its state —
and `ProductCardProps`, `NavProps` and `SignInCardProps` have the same shape.

Types were assigned by need rather than by kind: `ReactNode` unless the
implementation had to read the text, at which point `string`. That produced
`ProductCard`'s pair of `cartLabel: string` and `ariaLabel: string`, and
`soldOutLabel?: ReactNode` beside them.

The applications compensate. `@grade10/auction-frontend` declares
`ListingViewCopy` — around eighty fields — mirroring the labels of the blocks
`ListingView` renders, and `@grade10/store-frontend` and
`@grade10/auth-frontend` each declare their own. Since
`add-site-localization`, each of those is assembled from the message catalogs
in the application, key by key.

The audit the proposal cites was run across both repositories: every prop
given JSX, in product code, preview assemblies and stories alike. The set is
`actions`, `standing`, `watchAction`, `leading`, `trailing`, `render`,
`providerSlot` — slots, all of them. No label anywhere takes markup.

## Decisions

### A word is a string; a slot is a node; the distinction is the name

A prop is a word when the component says it: a label, a heading, a
placeholder, a hint, a title. It is typed `string`, because a component that
holds a string can name a control with it, truncate it, transform its case or
compare it — and one that holds a node can do none of those, which is what
forces a second prop carrying the same text.

A prop is a slot when the consumer composes markup the component only places:
`actions`, `standing`, `history`, `badges`. It stays `ReactNode`, and reads as
a slot in the type because the copy type is where words live and it is not in
it.

*Alternatives:* keeping `ReactNode` everywhere for flexibility — rejected: the
flexibility is unused after three years of stories, and it costs the
accessible-name case every block actually has. A `string | ReactNode` union —
rejected: every read site then needs a narrowing that resolves to "assume
string", which is the current situation with extra steps.

### One `copy` object per block, composed upward

Each block exports `<Block>Copy` and takes `copy`. A block that renders other
blocks composes theirs — `ProductBrowseCopy` holds `filterPanel`,
`listHeader`, `list` — so an application maps its catalogs to the outermost
type and the compiler carries it down.

Values stay their own props. `price`, `remaining`, `resultCount` and
`deadline` change with what is being shown rather than with the language, and
folding them into copy would make a per-render object out of something a
translator should be able to read as a list of words.

*Alternatives:* flat props grouped only by comment — rejected: it leaves every
consumer flattening the same list, which is the eighty-field type in the
auction slice. Nested groups for slots and state as well — rejected: slots and
handlers read naturally as JSX props, and grouping them buys nothing a reader
does not already get from the name.

### The applications' copy types compose rather than restate

`ListingViewCopy` becomes the blocks' copy types plus what the slice itself
says, and the same for the store and auth slices. The mapping from catalog
namespaces to those types stays where it is — in the application, written
once — but it stops being a hand-kept parallel list of every block's labels.

*Alternatives:* leaving the slices' flat types alone and adapting at the call
site — rejected: the duplication is the reason a label can drift between what
a block declares and what a slice passes.

### The unspecified blocks take the shape without gaining a contract

`auction-listing`, `auth-sign-in`, `auth-two-factor` and `store-profile` live
in `packages/ui` with no capability spec naming their exports. They follow the
same rule here, because leaving four block families in the old shape would
make the rule untrue of the package. Naming their exports is a contract
decision of its own, and this change flags it rather than making it.

## Risks / Trade-offs

- **A wide, mechanical diff.** Every block, every story, every preview
  assembly, then every call site in the application. The compiler drives it,
  and the change lands per block family so a review is readable — but there is
  no small version of it.
- **Two repositories, in order.** The blocks and their stories land here; the
  applications adapt behind a submodule bump. Between the two, the application
  is pinned to the previous SHA and unaffected.
- **The `string` narrowing is one-way in practice.** A block that genuinely
  needs markup in a word later has to add a slot rather than widen the word,
  which is the outcome this change wants — but it is a constraint, and worth
  naming before it surprises someone.

## Migration Plan

Per block family, each landing on its own: the copy type, the props split, the
stories and preview assemblies, then the next. The application follows in one
bump, where each slice's copy type is rebuilt from the blocks' and the
catalog mapping is re-pointed at it. Nothing renders differently at any point.

## Open Questions

None.
