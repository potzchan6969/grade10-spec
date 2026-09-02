# Design: align product listing tiles

Capability delta:
[`shared/ui/store-product-listing`](specs/shared/ui/store-product-listing/spec.md).
Motivation: [proposal.md](proposal.md) — Why.

Figma sources are linked in [ui.md](ui.md).

## Context

The listing block already ships `ProductCard`, `ProductList`, and
`ProductBrowse`. Those files still implement the first listing-surface tile:
category, description, Add, wishlist, stepper, and hardcoded `Add` /
`Sold Out` / `Add to wishlist`. Figma's published card (`4200:155`) no longer
has those axes; cart, sale, and sold-out live on a new nested set,
`Product / Product Card Image` (`4274:10074`).

`StatusIndicator` (`4174:37`) is published and unused in code. The in-cart
count is its `type=count, variant=brand` rung. `packages/ui/src/blocks/shared/`
is the wrong home — that folder holds listing helpers (`AsyncState`), not
Figma primitives.

## Goals / Non-Goals

Design-level only; the proposal owns product scope.

- **Goal:** one tile source that matches the published card and card-image sets,
  reusable without `ProductBrowse`.
- **Goal:** `StatusIndicator` as a design-system primitive other surfaces can
  use.
- **Non-goal:** restyling `FilterPanel`, `ProductListHeader`, or the browse
  layout. `ProductBrowse` only drops the callbacks the new tile no longer has.
- **Non-goal:** a `StatusIndicator` capability spec. The Figma set is the
  primitive contract; the listing spec describes the tile that consumes it.

## Decisions

### `StatusIndicator` lives in `packages/design-system/src/components/display/`

Same folder as `Badge`. Basename `status-indicator`, export `StatusIndicator`,
four files, checker-resolved from the published set name. Axes match Figma:
`type` (`dot` | `count`) and `variant` (`default` | `error` | `brand`). The
`label` TEXT property is the count contents on the `count` rung and is omitted
on `dot`. The published cart instance is `count` / `brand`.

*Alternatives:* compose a one-off count overlay inside `ProductCardImage` —
rejected, the set is published and the count is not listing-specific. Put it
in `packages/ui/src/blocks/shared/` — rejected, that path is for compound
helpers, and the checker only looks under `src/components/**/<name>.tsx`.

Makes pass: `An in-cart count is displayed as supplied`.

### The cart control is `IconButton` plus `StatusIndicator`, not a new component

Figma nests `Icon Button` and names the count `Cart Count` (an instance of
`StatusIndicator`). Code composes those two. No `CartCount` or `CartButton`
export.

The published Icon Button set now has `variant: secondary | outline | ghost`
and `size: md | sm`. Code still has `outline` / `ghost` and `sm` / `xs`. The
cart instance is the filled 40px control — `secondary` + `md`. This change
adds those two Figma-defined rungs. It does not remove `xs`; Nav still uses it.
Reconciling a dropped Figma `xs` is a separate primitive change.

*Alternatives:* invent a filled overlay in the listing block — rejected, that
is a local rung. Stretch `sm` to 40px with `className` — rejected, it forks
the primitive from every other consumer.

Makes pass: `A cart action is reported, not performed`, `Keyboard reveals the
cart control`.

### Nested controls stay valid by keeping the cart outside the tile-activation target

The cart control sits on the photo. A single `<button>` wrapping the photo
cannot also contain that control. Same pattern as today's wishlist: the
image well and the copy share the tile-activation target; the cart
`IconButton` is a sibling, absolutely positioned on the well. Sold-out tiles
have no activation target and no cart control.

Hover and `:focus-within` on the image group reveal the cart control when the
product is available and not in the cart. In-cart always shows it. Sold-out
never does. Figma does not draw `soldOut` combined with `inCart` or `hover`.

*Alternatives:* make the whole card a link and put cart in a sibling row —
rejected, Figma draws the control on the photo. Always-visible cart —
rejected, Figma hides it at rest when not in cart; focus-within covers
keyboard without contradicting the drawing.

Makes pass: `Keyboard reveals the cart control`, `A sold-out product`.

### Presence gates, not extra booleans, for sale and original price

`saleLabel` shown when supplied and not sold out. `originalPrice` shown when
supplied. `soldOut` is a boolean because it changes treatment, not just a
label. `inCart` is a boolean because it changes which cart chrome is drawn;
the count is a separate supplied value. Figma's `sale` and `hasDiscount`
booleans are those presence gates, not independent axes a consumer must set
twice.

Copy is never defaulted. `cartLabel` is required whenever the image is
rendered, so the control always has an accessible name even if a particular
state hides it.

*Alternatives:* keep `hasDiscount` and `discountLabel` (`−15%`) — rejected,
the published card no longer draws a percentage badge. Default `SALE` /
`SOLD OUT` — rejected, they are Grade10 example copy in Figma, not package
copy.

Makes pass: `A sale label is displayed as supplied`, `Prices are displayed as
supplied`, `No original price`.

### `ProductSummary` drops what the tile no longer displays

```ts
type ProductSummary = {
  id: string;
  name: ReactNode;
  badges?: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  price: ReactNode;
  originalPrice?: ReactNode;
  saleLabel?: ReactNode;
  soldOut?: boolean;
  soldOutLabel?: ReactNode;
  inCart?: boolean;
  cartCount?: ReactNode;
  cartLabel: string;
  ariaLabel?: string;
};
```

`badges` is the `cardProps` slot — the consumer assembles `Badge` instances.
`ProductList` maps this onto `ProductCard` / `ProductCardImage`.
`ProductBrowse` loses `onProductWishlistClick` and `onProductQuantityChange`.

*Alternatives:* keep the old fields as ignored extras — rejected, a store
would keep supplying them and think they render. A versioned `ProductCardV2`
— rejected, nothing consumes the current export.

Makes pass: `The listing surface exports`, `Badges are displayed as supplied`.

## Risks / Trade-offs

- **[Risk] Hover-only cart is easy to ship without keyboard access.** → The
  spec requires focus-within; the image story's play interaction activates
  the control from the keyboard.
- **[Risk] `IconButton` `xs` stays while Figma lists `md` / `sm`.** → Recorded
  as a known checker warning to keep, with the reason in this change, rather
  than renaming a rung Nav still uses.
- **[Risk] The listing page in Figma will keep moving.** → This change only
  binds the published card and card-image sets. Header, filters, and browse
  layout wait for their own sets to settle.
- **[Risk] Code Connect publish is attended.** → Templates land in this
  change; publishing is listed as a delivery step, not a code task.

## Migration Plan

No production consumer yet. Preview fixtures and stories update in the same
change so `pnpm run typecheck` stays green. A later store listing page adopts
the new props on its submodule bump; there is nothing to dual-run.

Rollback is reverting the change. The previous tile is not preserved behind a
flag.

## Open Questions

None. Icon Button `xs` vs Figma `md`/`sm` is deferred, not open: keep `xs`
until a primitive change is opened for it.
