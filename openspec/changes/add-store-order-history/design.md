## Context

See proposal.md — Why. No durable `shared-ui/store-order-history` capability
exists; Product / Order Figma sets are published and used on the Order History
frames. Site chrome (`Nav`, `Footer`) and `EmptyState` / `Badge` / `Button` /
`Breadcrumbs` already ship from `@grade10/design-system`. Page assembly belongs
in `apps/preview` (and later consuming apps), not in `packages/ui`.

## Goals / Non-Goals

**Goals:**

- Land capability-prefixed compound exports under
  `packages/ui/src/blocks/store-order-history/` with stories, Code Connect
  templates, and `audit.json`.
- Compose filled and empty Order History pages in `apps/preview`.

**Non-Goals:**

- Application routes, Store API clients, or message catalogs inside blocks.
- New design-system primitives or Badge variants.

## Decisions

### Decision: Distinct code names for the two Figma "Order Item" sets

Figma names both the summary card (`4872:8325`) and the line item (`4901:3026`)
`Product / Order / Order Item`. Code uses `OrderHistoryCard` and
`OrderHistoryLineItem` so the public barrel stays unambiguous.

**Rejected:** Matching Figma names literally — collides on the flat
`@grade10/ui` export surface.

### Decision: Product / Image embeds in the line item

`Product / Image` (`4872:8386`) has no second consumer. The thumbnail markup
lives inside `OrderHistoryLineItem` until a second surface earns a shared
export (`shared/` is earned, not planned).

**Rejected:** A standalone `OrderHistoryProductImage` export now — expands the
contract without a second caller.

### Decision: Consumer splits Active vs Past

`OrderHistory` takes `activeOrders` and `pastOrders` arrays. Suggested fixture
mapping (not enforced): active = `pending` | `shipped`; past = `completed` |
`canceled` | `refunded`. Sorting latest→oldest is the application's job.

**Rejected:** Deriving sections from status inside the block — would bake
business rules into presentation and fight the page annotation that the
consumer owns the lists.

### Decision: Track Order opens via callback

Header exposes `trackOrder: boolean` and `onTrackOrder`. The application opens
the carrier URL in a new tab (annotation). The block does not call
`window.open`.

**Rejected:** Passing `href` into the block and navigating internally —
routing/window policy stays consumer-owned, consistent with other blocks.

## Risks / Trade-offs

- **[Risk] Stale Header description lists different statuses** → Mitigation:
  implement only the Status set axis; document drift in ui.md; do not add
  `paid` / `delivered`.
- **[Risk] Horizontal scroll-fade utility may be vertical-biased in CSS** →
  Mitigation: match cart's `scroll-fade` class on the overflow container; if
  masks are wrong on horizontal overflow, adjust with a documented className
  override in the same PR after visual check.
