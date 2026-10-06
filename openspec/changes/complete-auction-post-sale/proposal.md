**Author:** @ecchochan - 2026-09-28

## Why

A won lot cannot be paid for in production. Every invoice send is refused with
`PAYMENT_FEES_UNREADABLE`: the rule prices the card fee from the payment
provider's live fees, and Stripe has no way to return them, because the real
fee depends on the card and is known only after the charge. Only the test fake
answers, so the tests pass while no winner is ever invoiced. Everything after
Preparing Invoice is out of reach.

Around that block, the operator has two tabs that disagree: a listing queue
built for a card-capture flow that no longer runs, where Cancel and Reissue
both request a wire, and an order list with no search, no counts, no address of
its own, and money typed in minor units. QA cannot walk the flow by hand
without bidding and waiting for a real close.

**Metric:** the share of won lots whose invoice is sent within 48 hours of the
winner confirming setup, in production. It is 0 today, since no send succeeds.

## What Changes

- **The invoice's payment method decides where its fee comes from.** A card
  invoice's fee is Grade10's own: the card rule Finance keeps in Payment
  Settings, per currency - a percentage and a fixed amount - grossed up so
  Grade10 keeps the Subtotal whole. With no card rule for the currency, the
  invoice cannot be sent or reissued. A bank transfer invoice's fee is the
  operator's own, typed as an integer of zero or more; empty means zero. The
  sent invoice never re-prices, and no send needs the payment provider
- **Tax on the quote**, as `add-winner-order-tax-line` writes it
- **The winner's page keeps its layout.** Only the admin console is
  redesigned. Behind the page, bank transfer is offered only where Grade10
  holds bank details for the currency, and setup stays locked once confirmed
- **Order setup takes the settled answers.** Card is offered only in a
  currency with a card fee rule, and reads not yet available elsewhere; where
  neither method is offered, the winner reads that payment is not yet
  available, with Contact Us, and the setup deadline keeps running. Each method
  shows its fee wording. Billing Add Address uses the delivery Country/Region
  list, names read in the account's language, and an unsaved one-time address
  stays on the order until setup ends
- **Copy Message confirms in place.** The button reads Copied for a moment, and
  no toast appears
- **WhatsApp for transfer contact.** The order page shows the winner's phone
  from the delivery address, where an operator reaches them about a transfer
  or a proof
- **What was seen is sent.** A send or reissue carries the total the operator
  read, and is refused when Grade10 now prices it differently; the dialog shows
  the new total
- **One Orders workspace.** A worklist with Needs action, Waiting on winner,
  In transit, Closed and All, each counted and searchable by the winner's email
  too; a page per order at its own address, leading with the status, the rule
  behind it and one primary action; each action in a dialog; one timeline with
  comments. The listing queue and its requirements are removed
- **Proofs the operator can open.** The winner's files open on the order page;
  a returned proof carries a reason the winner reads, and the deadline resumes
- **Reopen setup and record setup on the order.** An operator gives a winner
  in Setup Overdue a fresh 48 hours with a reason, or records the winner's
  setup given by phone, never after the invoice is sent
- **Dispatch and delivery on the order**, with the carrier and tracking number,
  then the carrier's proof
- **Money that lands is always recorded.** A card payment the invoice did not
  expect is recorded and flags the payment until an operator clears it
- **Grants follow the code.** Payment processing is `auction:payment`, and
  Payment Settings moves to it, so finance keeps it. A control the operator
  lacks names the access it needs
- **Test winners outside production.** One action makes a test account on the
  operator's own address that won a closed sandbox lot through the real close,
  and emails it the ordinary sign-in link. The Test tab lists them

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- `grade10-admin/auction/test-winners`: making a test winner in one step
  outside production, its sign-in through the ordinary link, and the list of
  test winners.

### Modified Capabilities

- `grade10-site/auction/winner-order`: bank transfer only where Grade10 holds
  bank details, card only where Finance set a card fee rule, what the winner
  reads where neither is offered, the fee wording at the method choice, Copy
  Message confirming through its own state, the billing Country/Region list,
  names in the account's language, the one-time address kept on the order, and
  no card payment started on an expired or checked invoice.
- `grade10-admin/auction/post-sale`: the Orders worklist and order page, the
  fee by payment method, what was seen is sent, proofs, dispatch and delivery
  on the order, money that lands, the operator's reopen and record-setup
  actions, the winner's phone for WhatsApp contact, the
  grant table, how long an order waited in
  place of the 72-hour mark, and the listing queue's requirements removed.
- `grade10-admin/auction/payment-settings`: the card fee rule, card at order
  setup only where a rule is saved, and payment processing in place of
  settlement as the grant.
- `grade10-site/auction/order-status`: an expired or verifying invoice never
  starts a card payment, and one that completes anyway is recorded.
- `grade10-admin/auction` domain suite (`domain-tcs.md`): the durable
  `grade10-admin-auction-e2e-US3-TC1-1`, a lot collected through to delivered,
  is rewritten as `-TC1-2` for the Orders worklist and order page - worklist,
  Send invoice, Record payment, Dispatch, Confirm delivery - and returns to
  draft. `-US3-TC2-1`, a wire request that releases the card hold, is
  deprecated as `-TC2-2`, since the wire request no longer exists. Both keep
  their trace markers with the revision raised.

## Impact

| Consumer | Change |
| --- | --- |
| `apps/frontend/grade10` | Reads `Awaiting Setup`; My auction orders names all twelve statuses from the catalog; the winner's page keeps its layout, and its setup takes the method availability, fee wording, billing list, account-language names, the kept one-time address and Copy Message's own confirmation |
| `apps/admin/grade10` | Orders replaces the Queue and Winner orders tabs, with a page per order at its own address and a dialog per action; Payment Settings gains the card fee rule; the Test tab gains test winners |
| Auction service | The card fee rule; a card fee Grade10 computes and a bank transfer fee the operator sets; send and reissue priced again against the total read; order status read from the order's facts; money that lands recorded and flagged; proof files served to operators; order-level dispatch and delivery; the worklist query; the listing-level post-sale actions removed; test winners; the methods offered per currency and the winner's one-time address kept on the order |
| Store service | Passes the winner procedures through unchanged, with the session's user, and forwards the new one-time address procedure |
| `apps/emails` | The Proof not accepted letter's template |
| `apps/preview` | The Contact Us preview's Copy Message reads Copied with no toast |
| `@grade10/ui`, `@grade10/design-system` | No export or token change |

## Ordering and Dependencies

- **After `add-winner-order-tax-line`**, declared in `.openspec.yaml`. That
  change folds Invoice fields, the quote and the reissue with Tax; this change
  builds its write side and never edits it. This change's fee, one Reissue and
  what was seen is sent are new requirements; its blocks on those three
  requirements are written after that change archives
- **After `define-public-auction-identifiers`**, declared. Its invoice IDs are
  what the worklist search matches, a replaced one included
- **Beside `add-winner-how-to-pay-rails`.** Its bank transfer requirement is
  left as it is
- **Beside `add-my-auction-orders`.** Pay with Card starts a fresh session each
  time, as that change writes it
- **Before `close-overdue-address-confirmation`**, which declares this change.
  Reopening and recording setup are this change's requirement; that change
  keeps the persisted address deadline they reset.
- **Beside the other post-sale changes.** Partial payments and cancellation
  reasons add their own requirements, and the
  order page carries their actions. The worklist places Partially Paid under
  Waiting on winner and keeps the cancellation category filter. Card money
  counts toward a balance only where "Money that lands is always recorded"
  says it does; money that counts toward nothing never makes an order
  Partially Paid
- **Feature sets are hand-merged at archive.** In post-sale, the Queue group's
  extended-bidding leaf goes, and the Quote and send group's bank transfer fee
  leaf gives way to the fee by payment method

## References

- [Post-Bidding · Winner Order](../../../docs/prds/products/grade10-site/auction/post-bidding.md#winner-order)
- [Post-Bidding · Order Setup](../../../docs/prds/products/grade10-site/auction/post-bidding.md#order-setup)
- [Post-Bidding · The Invoice](../../../docs/prds/products/grade10-site/auction/post-bidding.md#the-invoice)
- [Auction Management · Orders](../../../docs/prds/products/grade10-admin/auction/management.md#orders)
- [Auction Management · Payment](../../../docs/prds/products/grade10-admin/auction/management.md#payment)
- [Auction Management · Fulfilment](../../../docs/prds/products/grade10-admin/auction/management.md#fulfilment)
- [Auction Management · Payment Settings](../../../docs/prds/products/grade10-admin/auction/management.md#payment-settings)
- [Auction Management · Grants](../../../docs/prds/products/grade10-admin/auction/management.md#grants)
- [Auction Management · Test Winners](../../../docs/prds/products/grade10-admin/auction/management.md#test-winners)
- [Roles and Permissions · Permissions](../../../docs/prds/products/shared/auth/roles.md#permissions)
