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
(Closing Refund / Overpaid), linked from the Refunded page. Details stack in
this order, each a label above its value: Amount, Transfer to, Reference
(bank only), Reason, Note (only when the operator recorded one). Transfer to
is `PaymentMethodCard`: a card brand
logo and only the last four digits, or a bank icon with the masked destination
on the primary line and the free-text bank name as secondary text under it.
The paid payment method on
`My Auctions/Winner Order/Delivery/Processing Bank Transfer` uses that same
card. A bank refund also shows Reference with the operator's bank provider
reference. Note is omitted when the operator left none. Proof, Stripe
reference and the audit number remain operator only.

### My Auctions

No Figma frame. Storybook: `Pages/My Auctions Page/Post-auction` in
`apps/preview/src/pages/my-auctions.stories.tsx`. The Refunded row is already
there. An overpayment does not add a row.

## Components

- **Preview assembly, not a published export:** `WinnerOrderPage` and
  `WinnerOrderRefundDialog` in `apps/preview/src/pages/`
- **Existing primitives:** `Badge` `sm`, `Alert` `inline`, `IconButton`,
  `Dialog` and its header/body/footer pieces
- **Existing block:** `PaymentMethodCard` in `packages/ui` — leading mark,
  label, and optional description under the label. Card brands use
  `OrderDetailsPaymentLogo` plus the last four digits. A bank uses Phosphor's
  `Bank` icon, the masked destination as the label, and the free-text bank
  name as description. Store Order Details, bid enrollment, Winner Order
  payment method and Refund Details Transfer to all use it
- **Existing block:** `AuctionRecord` / `AuctionRecordRow` already render a
  Refunded Won row. No new export for that row
- **i18n:** `Refund` is already answered in
  `packages/i18n/messages/grade10/en/orderDetail.json`. Dialog labels
  (Amount, Transfer to, Reference, Reason, Note, Close) stay preview props
  until the dialog leaves preview; **Reference** then needs a key answered in
  every language of its layer

## States

### Winner Order

| State | Shows | Anchor |
| --- | --- | --- |
| Status beside the title | `Badge` `sm` beside the page title, in the My Auctions color for that status | `winner-order-SC-157` |
| Refunded | Outline Refunded badge. No stepper, Pay or address form. Order Summary is the invoice only. Inline alert below Order Total with positive refund amount, ArrowCounterClockwise icon, and View. Dialog stacks Amount, Transfer to, Reason, and Note when recorded (Reference only for bank) | `winner-order-SC-157` |
| Transfer to, card | `PaymentMethodCard` with the brand logo and only the last four digits. No full number. No Reference | `winner-order-SC-172` |
| Transfer to, bank | `PaymentMethodCard` with a bank icon, masked destination on the primary line, and free-text bank name as secondary text. Reference shows the bank provider reference after Transfer to | `winner-order-SC-173` |
| Overpaid | Status badge and stepper stay. Order Summary unchanged. Inline alert below Order Total with only the difference and View. Same dialog | `winner-order-SC-155` |
| Paid by bank transfer | Payment method uses `PaymentMethodCard` with the bank icon, masked last four, and bank name as description | **Out of suite:** Preview `My Auctions/Winner Order/Delivery/Processing Bank Transfer` |

### My Auctions

| State | Shows | Anchor |
| --- | --- | --- |
| Refunded | Status Refunded. View order. No amount | `winner-order-SC-157` |
| Overpaid | Status unchanged. No amount | **Out of suite:** Preview `Pages/My Auctions Page/Post-auction` while the order keeps its status |
