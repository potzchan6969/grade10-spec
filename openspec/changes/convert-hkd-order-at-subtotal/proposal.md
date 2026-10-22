**Author:** @seankcw - 2026-10-22

Product context: [Post-Bidding · Settling in HKD](../../../docs/prds/products/grade10-site/auction/post-bidding.md#settling-in-hkd), set by the merged design change [grade10-spec#1288](https://github.com/9gag/grade10-spec/pull/1288).

> An HKD winner reads the lot's lines in USD, one HKD Subtotal converted once
> at the fixed rate, the card fee in HKD and an Order Total that adds them - on the
> Order Summary, the invoice, the receipt and the receipt letter alike. This
> replaces the per-line conversion and the all-HKD summary, and it prices the
> order the same way.

## Why

An HKD winner today reads every line already in HKD, each rounded up to a whole
HK$ on its own. What the lot cost in USD is gone, and the rounding moves the
total off the rate: lines of US$150, US$30, US$49, US$20 and US$2 read HK$1,972
where US$251 at 7.85 is HK$1,970.35. Product has decided that the winner reads
the USD lines and one converted HKD Subtotal instead, and the design store
already draws it. The pricing rule, the invoice, the receipt and the letters
still follow the per-line rule, so the page would show a Subtotal the documents
do not print.

**Metric:** HKD orders whose Subtotal equals their USD lines' sum at 7.85, to
the cent. After this change every order; today any whose lines round up
differently.

## What Changes

- **The Order Summary reads USD lines, then HKD** - under HKD the winning bid,
  premium, Shipping & Handling, Insurance and Tax keep their USD amounts. A
  Subtotal converts their sum to HKD and carries the conversion note. The
  Payment Processing Fee and the Order Total sit below it in HKD.
- **The HKD Subtotal converts once** - the USD lines add up, convert at 7.85
  and round up to the next cent. The card fee is computed in HKD on that
  Subtotal, and the Order Total is Subtotal plus fee, to the cent. This
  replaces converting and rounding each line.
- **A bank transfer fee converts below the Subtotal** - the operator still
  types it in USD; it converts at the same rate to the next cent, sits with the
  fee, and adds nothing to the note's USD figure.
- **The documents follow the same layout** - the invoice page, the invoice and
  receipt PDFs and the receipt letter list the USD lines, then the HKD
  Subtotal, Payment Processing Fee and Order Total; the PDFs carry the conversion
  note under the Subtotal, and the invoice page and the letters name no rate.
  **BREAKING** - `grade10-site/auction/winner-order` "An HKD invoice, receipt
  and letter carry HKD only" says every amount reads HKD and no USD winning bid
  prints; that no longer holds for the invoice, the receipt and a letter that
  lists lines.
- **The operator reads the same breakdown** - the quote preview, the reissue
  dialog, the order page's invoice lines and the reissue history show the USD
  lines, then the HKD Subtotal, fee and total; the figure an operator previews
  is the one the winner will be asked to pay.
- **Sent invoices stay as sent** - none is re-priced; an invoice sent with whole-HK$ lines keeps them and reads in the new layout from its stored amounts.
- **Unchanged** - a USD order, the rows before an invoice is sent, the lot
  card's USD winning bid, and the won-lot letter's US$ bid.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/winner-order` - an HKD order converts the sum of its
  USD lines once and rounds up to the cent; the Order Total is Subtotal plus fee; the Order Summary, invoice and receipt show the USD lines with the
  HKD Subtotal, fee and total; the HKD-only rule for invoice and receipt is
  replaced.
- `grade10-site/auction/notifications-order` - a letter that lists lines lists
  them as the invoice does; every letter's total reads HKD.
- `grade10-admin/auction/post-sale` - the quote preview, the reissue dialog,
  the order page's invoice lines and the reissue history show the USD lines,
  then the HKD Subtotal, fee and total.
- `grade10-admin/auction/internal-bid` - the house order's invoice total is one
  conversion of its USD lines, so the total of one scenario moves from 103100
  to 103000.
- `shared/ui/invoice-and-receipt-pdf` - the Subtotal summary row may carry a note,
  drawn muted under it, which the invoice and receipt PDFs use for the conversion
  note.
- `shared/ui/auction-order` - `AuctionWinnerOrder` takes `summary.subtotal` and
  `summary.feeLines`, merged in the design store with #1288.

## Impact

- **Retracts and supersedes** - `order-summary-hkd-conversion-note` (every line
  in HKD, one note under the Order Total) is retracted, as
  `collapse-order-summary-usd-recap` was before it; its one surviving rule, the
  note under the Subtotal that names the rate, is carried in this change; the
  note now shows on the Order Summary and on the invoice and receipt PDFs, and
  nowhere else.
  Q8, Q9 and Q17 of `usd-lot-currency-winner-settlement-choice` (HKD lines under
  each USD amount, convert and round each line, the fee as a line above the
  total) are replaced; that change stays in place and is listed in `depends_on`.
  This change's walk takes the place of the one the retracted change still owed.
- **Component exports** - `AuctionWinnerOrder` gains `summary.subtotal` and
  `summary.feeLines`; `convertedTotal` and `convertedFee` stay. `AuctionInvoicePdf`
  and `AuctionReceiptPdf` gain an optional note on the Subtotal row; their HKD
  fixtures and stories change.
- **Consumer apps** - `grade10` prices the invoice, builds the Winner Order
  summary, the invoice page, the order documents, the letters and the
  operator's quote preview from the new breakdown. `apps/preview` and
  `apps/emails` HKD fixtures follow.
- **PRD pages** - [Post-Bidding](../../../docs/prds/products/grade10-site/auction/post-bidding.md#settling-in-hkd),
  [Auction Management](../../../docs/prds/products/grade10-admin/auction/management.md#payment)
  and [Auction](../../../docs/prds/products/grade10-site/auction/index.md)
  carry the 🚧 lines. The Money Amounts invoice item example reads `US$101.00`.

## References

- [Post-Bidding · Settling in HKD](../../../docs/prds/products/grade10-site/auction/post-bidding.md#settling-in-hkd)
- [Post-Bidding · The Invoice](../../../docs/prds/products/grade10-site/auction/post-bidding.md#the-invoice)
- [Post-Bidding · Letters](../../../docs/prds/products/grade10-site/auction/post-bidding.md#letters)
- [Auction Management · Payment](../../../docs/prds/products/grade10-admin/auction/management.md#payment)
