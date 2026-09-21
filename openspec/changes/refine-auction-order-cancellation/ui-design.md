# UI design

The admin post-sale surfaces have no Figma frame or published `@grade10/ui`
block. The application page and the design-system primitives are the layout
source until a frame lands. Winner Order uses the existing Storybook assembly
`My Auctions/Winner Order/Closed` → Cancelled in
`apps/preview/src/pages/winner-order.closed.stories.tsx`.

Behaviour stays in the capability specs. This file maps surfaces, exports and
states.

## Screens

### Post-sale — Cancel unpaid order

No Figma frame or Storybook story. The operator opens this dialog from the
unpaid-order action on the post-sale order detail.

### Post-sale — Cancelled order

No Figma frame or Storybook story. The order detail and queue carry the
category filter, lot link and Paid after cancel resolution.

### Winner Order — Cancelled

Storybook: `My Auctions/Winner Order/Closed` → **Cancelled**. The existing
preview assembly is the layout source; it must become the reason-free
cancelled notice in `winner-order-SC-143`.

## Components

### Post-sale

- **Existing primitives:** `Dialog`, `DialogHeader`, `DialogTitle`,
  `DialogDescription`, `DialogBody`, `DialogFooter`, `Button`, `Select`,
  `Textarea`, `Alert`, `Badge`, `Link`, `Table`, `TableHeader`, `TableRow`,
  `TableHead` and `TableCell`
- **Application assembly:** a post-sale cancellation dialog and queue/detail
  fields are admin application work; no reusable `@grade10/ui` export exists
  for this workflow
- **i18n:** cancellation categories, required-field errors, consequence
  preview, Paid after cancel flag, Finance return direction, clear action and
  winner Contact Us copy are new catalog work in the appropriate admin or
  shared layer, answered in every locale that layer serves

### Winner Order

- **Existing primitives:** `Alert`, `Badge`, `Button`, `Card`, `Link` and
  `Text` in the existing preview assembly
- **Existing shared block:** `AuctionOrderDetail` keeps the supplied lot and
  winning-bid facts; it does not receive the operator category or note
- **i18n:** Cancelled on {date} and Contact Us copy are catalog work; the
  cancellation reason has no winner-facing key

## States

### Post-sale — Cancel unpaid order

| State | Shows | Anchor |
| --- | --- | --- |
| Dialog open | Category select, required note and Cancel action | `grade10-admin-auction-post-sale-SC-150` |
| Reason incomplete | Required error on the missing category or note; confirmation is unavailable | `grade10-admin-auction-post-sale-SC-150` |
| Consequence preview | Return to stock, no runner-up, winner email, unchanged suspension and no undo before confirmation | `grade10-admin-auction-post-sale-SC-150` |
| Cancelled | Terminal Cancelled result, category filter value and a link to the returned lot for manual relisting | `grade10-admin-auction-post-sale-SC-151` |

### Post-sale — Paid after cancel

| State | Shows | Anchor |
| --- | --- | --- |
| Payment received after cancel | Paid after cancel flag, Finance return direction and clear action; order remains Cancelled | `grade10-admin-auction-post-sale-SC-152` |
| Flag cleared | No Paid after cancel flag; cancelled status and returned-lot outcome stay unchanged | `grade10-admin-auction-post-sale-SC-152` |

### Winner Order — Cancelled

| State | Shows | Anchor |
| --- | --- | --- |
| Cancelled notice | Cancelled on {date}, retained lot and winning bid, and Contact Us only; no category, note, stepper or payment action | `winner-order-SC-143` |
