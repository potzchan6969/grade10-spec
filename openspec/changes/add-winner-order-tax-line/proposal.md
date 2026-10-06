**Author:** @jeffffej0909 - 2026-09-24

## Why

A winner who owes tax cannot be billed for it. The Order Summary prices a won
lot in five lines — Winning Bid, Buyer's Premium, Shipping & Handling,
Insurance, Payment Processing Fee — and none of them is tax. The invoice
fields table reserved a Tax line and left it empty, "reserved for the separate
tax change"; nobody opened that change, so the reservation has sat unfilled
while the rest of the invoice shipped.

The gap is not theoretical. `InvoicePdf` and `ReceiptPdf` already render an optional `taxLine`,
but no consumer has a tax amount to pass. The
receipt requirement already itemises "any tax amount", and three feature test
cases already name a tax amount they cannot exercise. Every layer was built ready for a line that has
no source.

Today an operator with a taxable lot has one option: fold the tax into
Shipping & Handling, where it is invisible to the winner, wrong on the
receipt, and wrong in the buyer's-premium base if anyone later reads that
number back.

**Metric:** invoices sent carrying a Tax amount, and reissues whose only
change is Tax. The first says operators are using the field; the second says
they are getting it wrong on the first send, and is the number Product should
watch.

## What Changes

- **Tax becomes an amount the operator enters**, on the quote, beside
  Insurance and under the same rules: optional, above zero when added, absent
  when none, and changeable on a reissue with a reason
- **The Order Summary gains a Tax line**, between Insurance and Payment
  Processing Fee. It reads TBD before send, like the other quoted rows, then
  shows the amount or disappears
- **Tax sits inside the Subtotal**, so a card invoice's processing fee is
  grossed up on it and Grade10 keeps the Subtotal whole
- **The line carries an info tip** reading `Set by Grade10 for where your order
  ships. Some orders have none.`, whenever the line shows. The first sentence
  names who sets the amount, so a winner whose address is already confirmed
  does not read the address as the thing holding it up; the second answers
  what a winner in Awaiting Setup actually wonders, since the row reads TBD
  whether or not they will owe anything. The tip rides the line rather than
  appearing in one status and vanishing in the next
- **The invoice and the receipt state it** as the optional `taxLine` the PDF
  blocks already accept, before the boxed Subtotal summary
- **Grade10 prices nothing.** No rate, no regime, no jurisdiction rule, no tax
  provider. The operator decides the amount and owns it

**Depends on `add-shipping-insurance-order-summary-tooltip`.** That change
owns the Order Summary tip mechanism and the rule that a quoted row reads TBD
before send. This change lands after it and refers to both.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### Modified Capabilities

- `grade10-site/auction/winner-order`: the Tax line becomes a stated
  requirement instead of a reserved row — its place in the summary, its TBD
  before send, its absence when none, its presence in the Subtotal, and its
  place on the invoice and the receipt
- `grade10-admin/auction/post-sale`: the quote takes an optional Tax amount,
  refuses it at zero, and carries it through a reissue

## Impact

- **Order Summary** on Winner Order — one row, its info tip, and the Subtotal
  that contains it
- **The operator quote and reissue forms** — one optional amount field each
- **`shared/ui/invoice-and-receipt-pdf`** — no contract change; this change
  supplies Tax as the optional `taxLine` its durable contract already defines
- **The audit log** — Tax joins the quoted amounts a reissue records before
  and after, written by `complete-auction-post-sale`'s `Invoice log history`
  (Q8), not by this change
- **The set of quoted amounts is enumerated in six places** in
  `openspec/specs/grade10-admin/auction/post-sale/spec.md` — the reissue
  action summary, the audit `Changed parts` cell, the quote steps, the send
  refusals, the reissue requirement, and what counts as a change. Adding Tax
  moves all six in step, or names the set once and has the others refer to it.
  The `Changed parts` cell is `complete-auction-post-sale`'s, per Q8, so this
  change moves the other five.
  The fee rows that carry an info tip are a seventh such set, in the other
  capability. This change adds Tax to each post-sale set in place and gives
  the Tax tip its own requirement beside Insurance's. Naming each set once
  waits for the third line of this shape, per [Q9](decisions.md#decisions)

**No new journey.** Tax is an amount inside `winner-order-US-01` and
`post-sale-US-05`, not a new walk. The winner-order journeys delta is context
only, deliberately.

## References

- [Post-Bidding · The Invoice](../../../docs/prds/products/grade10-site/auction/post-bidding.md#the-invoice)
- [Auction Management · Payment](../../../docs/prds/products/grade10-admin/auction/management.md#payment)

## Follow-on changes

- The receipt wording in `Records the winner keeps`. After
  `define-public-auction-identifiers` archives, a small change replaces "any
  tax amount supplied by the separate tax capability" with "Tax when added" and
  revises `winner-order-SC-18` to match. This change does not modify that
  requirement, which that change adds
- A computed tax rate, if Grade10 ever prices tax itself rather than taking
  an operator's number
- The formal tax receipt — whether a receipt must carry Grade10's company
  details and tax ID, which Finance still owns and which this change does not
  touch
