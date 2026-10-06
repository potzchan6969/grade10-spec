**Author:** @tangconst - 2026-09-09

## Why

The shared cart drawer fills empty rows with dashed `CartItemSlot`
placeholders so the panel keeps a five-row shape. Collectors read those
slots as actions; empty carts look unfinished rather than empty. The
design-system already has `EmptyState` for no-data surfaces. Slot-driven
Browse More also forces every store host to invent a catalogue handoff the
empty state should not own.

**Metric:** ❓ product manager - recommended: none; R1 in `decisions.md`.

**Acceptance signal:** an empty cart shows `EmptyState` with a cart icon, the
consumer title (and optional description), no action button and no item
slots; a cart with items lists only those items.

## What Changes

- Remove `CartItemSlot` (and `CartItemSlotProps`) from the shared store-cart
  export contract.
- Name the promo exports the package already ships - `CartPromoSheet`,
  `PromoTicket` and their types - so the export contract matches the package.
- Stop filling a five-row baseline with placeholder slots.
- When the cart holds no visible items and is not loading, show design-system
  `EmptyState` with consumer `emptyTitle` / optional `emptyDescription` and no
  actions.
- Keep header badge and footer hidden on empty (unchanged).
- Say what a cart with no lines shows while it loads: a blank body, the header
  count's skeleton and no footer.
- Say that a consumer holds `loading` until it has read the cart, and no
  longer for a failed price check over a cart read empty; fix the Grade10
  host, whose failed review ends loading over a basket it never read.
- Say that a cart of only sold-out lines is not empty: it lists them with the
  footer and no count badge.
- Say that the count beside the drawer title is one per line, whatever its
  quantity, and leaves out unavailable lines as well as sold-out ones, as the
  block already counts.
- Rewrite the capability's Purpose and its `Cart contents` feature-set group
  without the five-slot baseline.
- Treat colocated Storybook stories as the layout source of truth for this
  surface; leave existing Figma cart frames as historical reference only.
- Update the shared cart manual page to match.

## Non-Goals

In `decisions.md`.

## Capabilities

### Modified Capabilities

- `shared/ui/store-cart` - Purpose, feature set, export set, empty-cart
  presentation, loading with no lines, the unread cart and the cart read
  empty, what the count badge counts and the badge at 0, and item-list
  baseline (no placeholder slots).

## Impact

- **`@grade10/ui`** - the store-cart block and its stories
  (`packages/ui/src/blocks/store-cart/`). The block already renders the empty
  state (`cart-drawer.tsx:444-531`, `:1474-1523`).
- **Exports** - `CartItemSlot` and `CartItemSlotProps` leave the contract.
  `CartDrawerCopy` gains required `emptyTitle` and optional `emptyDescription`.
  `CartDrawerBodyProps` gains the same two fields, so a consumer composing the
  body directly supplies `emptyTitle`. `CartPromoSheet`, `CartPromoSheetProps`,
  `PromoTicket`, `PromoTicketProps`, `HeldPromoCode`, `PointsState` and
  `PromoNotice` shipped with commits `7b5bca40c` and `e31aec6d1` under no
  change; the contract now names them.
- **`apps/frontend/grade10`** - `src/chrome/CartDrawerHost.tsx:672-673` already
  supplies `emptyTitle` and `emptyDescription`. Its `loading` at `:616-617`
  ends on a failed review over an unread basket; this change holds it until
  the basket is read (Q9). `src/chrome/CartDrawer.test.tsx` re-cites the
  retired scenarios at `:920`, `:938` and `:955`.
- **`@grade10/i18n`** - the Grade10 catalogs already answer
  `cartDrawer.emptyTitle` and `cartDrawer.emptyDescription` in en, zh-Hant and
  zh-Hans (`packages/i18n/messages/grade10/*/store.json:43-44`).
- **Consumers** - any consumer that imported `CartItemSlot` or passed
  `onBrowseMore` / `emptySlotCount` drops them.
- **Manual** -
  [`Cart Drawer · Empty Cart`](../../../docs/prds/products/shared/ui/store-cart.md#empty-cart)
  marks the empty state, the unread cart, and carts of only delisted or only
  sold-out lines

## Open Questions

- ❓ product manager - the change's metric, R1 in `decisions.md`.
- ❓ designer - the Figma cart frames that still draw `Cart Item Slot`, R2 in
  `decisions.md`.

## References

- [Cart Drawer](../../../docs/prds/products/shared/ui/store-cart.md#empty-cart)
