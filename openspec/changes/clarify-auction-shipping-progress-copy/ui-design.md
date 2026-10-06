## Screens

### Winner Order — status badge and Order Progress

Storybook: `My Auctions/Winner Order/Delivery/Preparing Shipment` and
**Shipped**.

Title badge uses design-system `Badge` `size="sm"`, same tones as My Auctions
`AuctionRecordRow`:

| Derived status | Badge variant |
| --- | --- |
| Preparing Shipment | `default` (muted fill) |
| Shipped | `default` (muted fill) |
| Delivered, Cancelled, Refunded | `outline` |

Order Progress: Address → Invoice → Payment → **Shipping** → Completed.
While Preparing Shipment, Shipping is the **current** (progress / ping) step
with subtext **Preparing to ship** — not incomplete/upcoming. While Shipped,
Shipping stays current with the day-only ship date (and tracking when present).

### My Auctions — Won Status

Won-row Status badges use the same variant map; Shipped matches Preparing
Shipment (`default`), not outline.

## Components

| Export | Package | Role |
| --- | --- | --- |
| `Badge` | `@grade10/design-system` | Status label on Winner Order title and My Auctions |
| `Step` / `Stepper` / `StepIndicator` | `@grade10/design-system` | Progress rail; `progress` = current ping |
| `AuctionRecordRow` | `@grade10/ui` | My Auctions status badge via `STATE_VARIANT` |
| Preview `WinnerProgressCard` | `apps/preview` | Assembly — not a published export |

## States

| State | Shows | Anchor |
| --- | --- | --- |
| Preparing Shipment | Badge `default`; Shipping current + Preparing to ship | `winner-order-SC-55` |
| Shipped | Badge `default`; Shipping current + date / tracking | `winner-order-SC-253` |
