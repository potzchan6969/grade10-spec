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
its own, and money typed in minor units. A winner waiting on the invoice reads
one line, and QA cannot walk the flow by hand without bidding and waiting for a
real close.

**Metric:** the share of won lots whose invoice is sent within 48 hours of the
winner confirming setup, in production. It is 0 today, since no send succeeds.

## What Changes

- **The fee comes from a schedule Finance keeps.** Payment Settings holds, per
  currency, a card rule and a bank transfer rule: a percentage and a fixed
  amount, or no rule. The quote pre-fills the fee from it and the operator sets
  the final amount, zero or more. The sent invoice never re-prices, and no send
  needs the payment provider
- **Tax on the quote**, as `add-winner-order-tax-line` writes it
- **The winner reads the rule at the choice.** `3.4% + HK$2.35 processing
  fee`, `Free`, or `Set on your invoice`; bank transfer only where Grade10
  holds bank details for the currency. Setup ends on a review, and the choices
  lock when the winner confirms
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
- **Dispatch and delivery on the order**, with the carrier and tracking number,
  then the carrier's proof
- **Money that lands is always recorded.** A card payment the invoice did not
  expect is recorded and flags the payment until an operator clears it
- **Grants follow the code.** Payment processing is `auction:payment`, and
  Payment Settings moves to it, so finance keeps it. A control the operator
  lacks names the access it needs
- **A Next step panel on the winner's order** in every status, which says
  while the invoice is prepared that the 7 days start when it arrives
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

- `grade10-site/auction/winner-order`: the fee rule at the method choice, bank
  transfer only where Grade10 holds bank details, the review that locks setup,
  and the Next step panel.
- `grade10-admin/auction/post-sale`: the Orders worklist and order page, the
  fee from the schedule, what was seen is sent, proofs, dispatch and delivery
  on the order, money that lands, the grant table, how long an order waited in
  place of the 72-hour mark, and the listing queue's requirements removed.
- `grade10-admin/auction/payment-settings`: the fee schedule, and payment
  processing in place of settlement as the grant.
- `grade10-site/auction/order-status`: an expired or verifying invoice never
  starts a card payment, and one that completes anyway is recorded.

## Impact

| Consumer | Change |
| --- | --- |
| `apps/frontend/grade10` | Winner Order leads with the Next step panel above the Order Summary; the method choice shows each fee rule; setup ends on a review that locks it |
| `apps/admin/grade10` | Orders replaces the Queue and Winner orders tabs, with a page per order at its own address and a dialog per action; Payment Settings gains the fee schedule; the Test tab gains test winners |
| Auction service | Fee schedule; the fee stored as the operator set it; send and reissue priced again against the total read; order status read from the order's facts; money that lands recorded and flagged; proof files served to operators; order-level dispatch and delivery; the worklist query; the listing-level post-sale actions removed; test winners |
| Store service | Passes the winner procedures through under their new names; the old names answer for one release |
| `@grade10/i18n` | New keys in the shared `auctionOrders` catalog for the Next step panel, the fee rules and the review, in every locale |
| `apps/emails` | The Proof not accepted letter's template |
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
  left as it is, and the Pay controls sit under Order Total where it places
  them
- **Beside `add-my-auction-orders`.** Pay with Card starts a fresh session each
  time, as that change writes it
- **Beside the other post-sale changes.** Partial payments, cancellation
  reasons and reopening the address form add their own requirements, and the
  order page carries their actions. The worklist places Partially Paid under
  Waiting on winner and keeps the cancellation category filter. Card money
  that lands on a partly paid invoice counts toward its balance under
  `add-winner-partial-payment`'s rule, and a payment started before the
  deadline counts, as `close-overdue-address-confirmation` writes it
- **Feature sets are hand-merged at archive.** In post-sale, the Queue group's
  extended-bidding leaf goes, and the Quote and send group's bank transfer fee
  leaf gives way to the fee from the schedule

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
