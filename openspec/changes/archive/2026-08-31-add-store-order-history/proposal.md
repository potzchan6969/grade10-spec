**Author:** @constancetang - 2026-08-27

## Why

A signed-in collector who has placed store orders has nowhere in the shared UI
to review them. Figma defines a Your Orders page — Active and Past sections,
order cards with status and line items, Track Order, and an empty state — but
`@grade10/ui` exports nothing for that surface, so every store would reinvent
it. Product list/detail contracts live under `add-grade10-shopify-store`; that
change explicitly excludes shared UI, so the page still has no component
contract.

**Metric:** share of signed-in collectors who open Order History within 7 days
of a paid order (instrumented once the storefront mounts the surface).

## What Changes

- **New shared-ui capability `store-order-history`.** Export order status,
  line item, card header, order card, and the page compound that lists Active
  and Past orders or shows the empty state.
- **Preview page assembly** in `apps/preview` for filled and empty frames so
  the composition is reviewable the way a store assembles it.
- **Code Connect templates** for the published Product / Order Figma sets
  (publish remains a human step).

No breaking changes — new exports only.

## Non-Goals

- **Storefront routing or data fetching.** Applications own routes, order APIs,
  and i18n; blocks only render props and report callbacks.
- **Order Detail page.** View Details navigates via consumer callback only.
- **Changing `grade10-store/shopify-commerce`.** List/detail product contracts
  remain in that change; this change is UI only.
- **Inventing Status variants** from stale Header description text (`paid`,
  `delivered`). The Status set axis is authoritative:
  `completed` · `shipped` · `pending` · `canceled` · `refunded`.
- **Classifying Active vs Past inside the block.** The consumer splits the two
  lists; the compound only hides empty sections and shows empty when both are
  empty.

## Capabilities

### New Capabilities

- `shared/ui/store-order-history`: the order-history components `@grade10/ui`
  exports and what each is responsible for.

### Modified Capabilities

None.

## Impact

- **`packages/ui`** — new `store-order-history` block directory and barrel
  group.
- **`apps/preview`** — Order History filled and empty page stories.
- **Design system** — no new primitive, variant, or token. Reuses `Badge`,
  `Button`, `EmptyState`, `Breadcrumbs`, layout stacks, and Phosphor icons.
- **Consuming store apps** — after a submodule bump, assemble `OrderHistory`
  under site chrome and wire order data + callbacks.
- **Figma** — Grade10-DS-2026 Product / Order sets and Order History frames.
