# UI design

No Figma frame for Winner Order or My Auctions. Storybook workbench under
`apps/preview` is the layout source. Behaviour stays in the journeys.

## Screens

### Winner Order

No Figma frame. Storybook: `My Auctions/Winner Order/Closed/Refunded` in
`apps/preview/src/pages/winner-order.closed.stories.tsx`, and
`My Auctions/Winner Order/Delivery/Processing — Overpaid` in
`apps/preview/src/pages/winner-order.delivery.stories.tsx`. The title row
follows `OrderDetailsHeader`. Order Summary stays the invoice. An inline
`Alert` below Order Total shows the refund amount with a View control;
`My Auctions/Winner Order/Refund Details` is the standalone dialog story
(Closing Refund / Overpaid), linked from the Refunded page. The Refund
Method row is a working channel label (Card / Bank transfer) until Product
settles what transaction clues the winner needs (❓ Q20).

### My Auctions

No Figma frame. Storybook: `Pages/My Auctions Page/Post-auction` in
`apps/preview/src/pages/my-auctions.stories.tsx`. The Refunded row is already
there. An overpayment does not add a row.

## Components

- **Preview assembly, not a published export:** `WinnerOrderPage` and
  `WinnerOrderRefundDialog` in `apps/preview/src/pages/`
- **Existing primitives:** `Badge` `sm`, `Alert` `inline`, `IconButton`,
  `Dialog` and its header/body/footer pieces
- **Existing block:** `AuctionRecord` / `AuctionRecordRow` already render a
  Refunded Won row. No new export
- **i18n:** `Refund` is already answered in
  `packages/i18n/messages/grade10/en/orderDetail.json`. Dialog labels stay
  preview props. No new word required for the preview

## States

### Winner Order

| State | Shows | Anchor |
| --- | --- | --- |
| Status beside the title | `Badge` `sm` beside the page title, in the My Auctions color for that status | `winner-order-US-01` |
| Refunded | Outline Refunded badge. No stepper, Pay or address form. Order Summary is the invoice only. Inline alert below Order Total with positive refund amount, ArrowCounterClockwise icon, and View. Dialog story: Refund Details | `winner-order-US-10` |
| Overpaid | Status badge and stepper stay. Order Summary unchanged. Inline alert below Order Total with only the difference and View | `winner-order-US-14` |

### My Auctions

| State | Shows | Anchor |
| --- | --- | --- |
| Refunded | Status Refunded. View order. No amount | `grade10-site-auction-account-record-US-03` |
| Overpaid | Status unchanged. No amount | `winner-order-US-14` |
