## Context

The store-cart block already renders this contract. Commit `2c2a019a7`
removed `CartItemSlot`, added `emptyTitle` and `emptyDescription` to
`CartDrawerCopy` and `CartDrawerBodyProps`, and renders the design-system
`EmptyState` (`packages/ui/src/blocks/store-cart/cart-drawer.tsx:444-531`).
The Grade10 host supplies both copy fields
(`apps/frontend/grade10/src/chrome/CartDrawerHost.tsx:672-673`) and pins a
store commit that carries the block.

What is missing is evidence. No story or test cites the scenarios this change
issues, `CartDrawer.FetchingOnOpen` has no play function, and the Grade10
tests at `apps/frontend/grade10/src/chrome/CartDrawer.test.tsx:920`, `:938`
and `:955` cite `shared-ui-store-cart-SC-02` to `shared-ui-store-cart-SC-04`,
which retire with the five-row requirement. The Grade10 host also breaks the
unread-cart clause: a failed review ends its `loading` over a basket it never
read (`CartDrawerHost.tsx:593`, `:616-617`). The work is tests, the re-cited
host tests, that one host fix and the walk.

## Goals / Non-Goals

**Goals:**

- Prove every scenario in the delta at the block boundary, in the block's own
  stories and the package's public-entry test.
- Re-cite the Grade10 host tests to the scenarios that replace the retired
  ones, and drop their assertions on a placeholder control that no longer
  exists.
- Hold the Grade10 host's `loading` until the basket is read, so a failed
  review never shows the empty state for an unread cart.
- Walk the shopper's cart journeys end to end on the Grade10 site.

**Non-Goals:**

- A host wiring change beyond the `loading` fix, a new prop, or a change to
  the block's look.
- A Figma or design-sync change for `Cart Item Slot`; the designer owns R2.
- The Grade10 host's failed-read walk, which `add-store-cart-drawer-ui` owns.

## Decisions

The [store-cart capability](../../specs/shared/ui/store-cart/spec.md) governs
what renders. These decisions govern where each scenario is proven.

### One empty decision per surface, both derived

The drawer decides emptiness from its visible lines, after it drops
`unavailable` lines, and only when not loading
(`cart-drawer.tsx:1474`, `:1523`). The body decides the same from the items
it receives (`cart-drawer.tsx:464`). Both stay derived from props on every
render; neither stores an empty flag.

| Cart | Loading | Body | Header badge | Footer |
| --- | --- | --- | --- | --- |
| Visible lines | Yes | Row skeletons | Skeleton | Summary skeletons, Checkout disabled |
| Visible lines | No | Rows | Active count, per the badge requirement | Shown |
| No visible lines | Yes | Blank | Skeleton | Hidden |
| No visible lines | No | `EmptyState`: cart icon, title, description where supplied | Hidden | Hidden |

**Rejected — show the empty state while loading.** The drawer cannot yet know
the cart is empty, so the shopper would read a wrong answer before the read
returns.

**Rejected — a placeholder row skeleton for a cart with no lines.** Nothing is
known to load, so a row skeleton draws lines that may not exist.

### Prove the block in stories, the contract in the entry test

| Scenario | Proven in |
| --- | --- |
| `shared-ui-store-cart-SC-01`, `shared-ui-store-cart-SC-43` | `packages/ui/src/index.test.ts`: the store-cart export set exactly, and neither slot export |
| `shared-ui-store-cart-SC-22` | The same test, as type assertions that `emptyTitle` is required and `emptyDescription` optional on both types; `pnpm run typecheck` runs them |
| `shared-ui-store-cart-SC-23`, `shared-ui-store-cart-SC-24` | `CartDrawer` stories `Default` (two lines) and `OverflowItems` |
| `shared-ui-store-cart-SC-25`, `shared-ui-store-cart-SC-41` | `CartDrawer` stories `EmptyState` and a new `EmptyStateWithoutDescription` |
| `shared-ui-store-cart-SC-45` | A new `CartDrawer` story whose every line is `soldOut` |
| `shared-ui-store-cart-SC-44` | `CartDrawerBody` story `Empty` |
| `shared-ui-store-cart-SC-08`, `shared-ui-store-cart-SC-40` | `CartDrawer` stories under a controlled `loading`, with lines and with none |
| `shared-ui-store-cart-SC-42` | A new `CartDrawer` story whose every line turns `unavailable` after the open read |

Empty-state parts are read through the design-system slots
(`data-slot="empty-state-icon"`, `empty-state-description`,
`empty-state-actions`), so a test does not depend on the copy's words.

**Rejected — a separate unit-test file per scenario.** The stories already
render each state under the Storybook vitest project; a second harness would
prove the same render twice.

### Re-cite the host tests rather than delete them

The Grade10 tests still prove the host passes the right copy and lines. They
move to `shared-ui-store-cart-SC-25`, `shared-ui-store-cart-SC-23` and
`shared-ui-store-cart-SC-24`, and lose the queries for `Add more items to
cart`, a control the block no longer has. The `shared-ui-store-cart-SC-08`
test at `:622` loses the same query.

### Hold the host loading until the basket is read

The host computes `loading = !reviewUnchecked && (isOpening ||
!basket.hasData || !review.hasData)` (`CartDrawerHost.tsx:616-617`). A failed
review sets `reviewUnchecked` (`:593`), which ends loading even when the basket
was never read; the unread basket falls back to `emptyCart()`
(`packages/grade10-store/frontend/src/features/orders/cart/presentation/hooks/useCart.ts:103`),
and the review query runs on its own
(`useCartReview.ts:72-79` beside it). A first open whose review
fails before the basket answers shows the empty state behind the Retry toast.

The fix is `loading = !basket.hasData || (!reviewUnchecked && (isOpening ||
!review.hasData))`: an unread basket always holds loading, and a failed review
over a read basket still shows its lines unchecked. A host test for that first
open cites `shared-ui-store-cart-SC-40`.

**Rejected — raise it against `add-store-cart-drawer-ui`.** The unread-cart
clause is this change's requirement, so this change proves and fixes it.

## Risks / Trade-offs

- **[Risk] A consumer outside the Grade10 site still imports `CartItemSlot`.**
  → The removal is a type error at the import; `pnpm run typecheck` in each
  consumer fails on it, and the delta's Migration names the props to drop.
- **[Risk] A story reads a timing-dependent state.** → The loading stories
  use a controlled `loading` rather than a timed read; the delisted story
  waits for `aria-busy` to clear before asserting, as
  `UnavailableItemsRemoved` already does.
- **[Risk] An empty `emptyDescription` string draws a blank line.** → The host
  always supplies catalog copy; no scenario states an empty string, so the
  block keeps the design-system's `!= null` check.

## Migration Plan

1. Land the store's stories and entry test (group 1).
2. Land the Grade10 test re-citations, the host `loading` fix and the walk;
   no submodule bump is needed, since the pinned store commit already carries
   the block.
3. Rollback is a revert of the test commits and the one-line host fix; no data
   changes.
