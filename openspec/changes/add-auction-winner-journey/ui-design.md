# UI: Auction winner journey

## Screens

### Winner order

No Figma frame exists for the buyer-facing auction order. The Grade10 site
assembles the invoice, address confirmation, payment, receipt, tracker, and
delivery proof from existing primitives. The route keeps one auction order in
view and exposes the current derived status with its deadline.

### Auction order queue

No Figma frame exists for the admin auction order queue. The admin app
assembles a worklist from existing primitives. Each row carries the derived
order status, the needs-action treatment, and a route to the order detail.

### Auction order detail

No Figma frame exists for the admin auction order detail. The admin app
assembles winner contact, invoice controls, fulfilment controls, status
explanation, and both immutable histories from existing primitives.

## Components

- **Layout** — `VStack`, `HStack`, and `Stack` group invoice facts, address
  controls, action groups, histories, and queue rows
- **Copy** — `Text` carries status explanations, deadlines, refusal messages,
  reasons, contact facts, and event details
- **Status** — `Badge` renders the closed order-status set; attention styling
  remains a separate row treatment
- **Sections** — `Card` groups payment, fulfilment, contact, and history
- **Actions** — `Button` opens orders, confirms addresses, pays, reissues,
  settles, cancels, dispatches, records delivery, and reinstates a bidder
- **Filtering** — `Select` filters the admin queue to one derived outcome
- **Address input** — `TextInput` carries the formatted delivery address;
  multiline reasons and event details use semantic textareas where needed
- **Loading** — `Skeleton` keeps the existing admin and site loading treatment
- **Confirmation** — `Dialog` confirms payment, settlement, cancellation,
  dispatch, delivery, reissue, and reinstatement

No new `@grade10/ui` export, design-system variant, token, or translation
catalog entry is proposed. Money is formatted from integer minor units and an
ISO 4217 currency code.

## States

### Winner order

- **Pending payment** — invoice amount, estimate markers, address confirmation,
  fixed deadline, and payment action
- **Address amendment** — previous total, revised total, delta, and explicit
  confirmation before the invoice is reissued
- **Payment failure** — declined attempt, retry action, and invoice still
  payable until the fixed deadline
- **Paid, shipped, and delivered** — receipt, tracker, and delivery proof as
  each record becomes available
- **Expired and suspended** — amount still owed, reason for suspension, and
  payment path without a bid action
- **Loading and transport error** — existing `Skeleton` and error `Text`
  treatments; the selected order remains stable on retry

### Auction order queue and detail

- **Derived outcomes** — Draft, Scheduled, Live, Ending soon, Unsold, Called
  off, Pending Payment, Expired, Processing, Shipped, Delivered, Cancelled,
  and Refunded
- **Needs action** — Expired and Processing rows carry the additional worklist
  treatment
- **Grant-disabled actions** — payment and shipment controls stay visible and
  disabled when the caller lacks the corresponding grant
- **History** — invoice and fulfilment events remain chronological, immutable,
  and address-snapshot based
- **Loading and transport error** — existing admin `Skeleton` and error `Text`
  treatments; a detail retry does not select a different order
