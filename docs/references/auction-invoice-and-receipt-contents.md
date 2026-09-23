# Auction Invoice and Receipt Contents

What the winner reads on the two PDFs an auction order produces, as of
2026-09-22, grouped into the lines that make up the order value and the
information around them. Drawn from
`openspec/specs/grade10-site/auction/winner-order/spec.md` and
[Post-Bidding](../prds/products/grade10-site/auction/post-bidding.md), with the
receipt breakdown as the `carry-receipt-payment-breakdown` change writes it.
Read this as a shareable summary; the spec is the contract.

Marks follow the manual: unmarked is what runs, 🚧 is what an active change
delivers, ❓ is what nobody has confirmed.

## Amounts

Every amount is an integer count of minor units paired with the lot's ISO 4217
currency code. No component is marked as an estimate, and no amount reaches the
winner before an operator sends the invoice.

## Invoice PDF

One invoice per lot, sent by an operator, never combined with another lot. The
sent invoice does not re-price.

### Order value

| Line | Rule |
| --- | --- |
| **Winning Bid** | The accepted bid that won the lot, excluding everything else |
| **Buyer's Premium** | 20% of the winning bid, or the currency minimum. Grade10 computes it; no operator enters, waives or changes it |
| **Shipping & Handling** | Quoted by an operator for the confirmed delivery address. Zero reads **Free** |
| **Insurance** | Optional, above zero when added. The line is left out when the operator added none |
| **Tax** | Optional, reserved for the separate tax change. No rate or regime is defined yet |
| **Subtotal** | The lines above. The on-page summary may drop it; the PDF keeps it |
| **Payment Processing Fee** | Priced by method and fixed at send. Card is grossed up from the subtotal at the provider's live fees, so Grade10 keeps the subtotal whole. Bank transfer is the amount the operator entered. Zero reads **Free** |
| **Order Total** | Subtotal plus the fee — what the winner pays |

### Other information

| Item | Rule |
| --- | --- |
| **Invoice ID** | On the PDF and on Winner Order. Finds the order, including after a reissue |
| **Bank reference** | On every invoice; shown to the winner only on a bank transfer invoice |
| **Lot** | The single lot invoiced, named unambiguously — a winner may hold several |
| **Payment method** | Card or bank transfer |
| **Sent at** | When the operator sent it, stored in UTC |
| **Payment deadline** | 7 calendar days from Sent at, stopped while proof is checked. An absolute date and time in the winner's zone, with no countdown |
| **Bill To** | 🚧 From the order's confirmed snapshot — name, company name, phone, address |
| **Ship To** | 🚧 From the same snapshot, same fields. Both read the same unless the winner unticked Same as delivery address |
| **Replaced by** | On an invoice a reissue replaced only: the invoice that replaced it |
| **Bank rails** | On a bank transfer invoice: SWIFT, FPS and Hong Kong local bank details. ❓ The accounts themselves — Finance confirms |

Not on the invoice: the **internal audit number**. It is operator-only and
reaches the winner on no PDF and in no letter.

## Receipt PDF

Issued when payment is confirmed, by any route. A receipt keeps the addresses
of the invoice it pays and is never reissued.

### Order value

The same itemisation as the invoice it pays — winning bid, buyer's premium,
Shipping & Handling, insurance when added, any tax amount, the subtotal, the
payment processing fee and the order total — then the payment breakdown:

| Line | Rule |
| --- | --- |
| **Original Invoice Total** | The paid invoice's order total. It cannot move: no invoice is reissued once a payment is recorded against it |
| **Previous Payments** | 0 today. 🚧 The payments already made against the invoice |
| **Current Payment Received** | The amount this payment settled |
| **Remaining Balance Due** | 0 today. 🚧 The real outstanding balance, floored at 0 the moment the invoice is Paid — a balance an operator closed inside the 10% tolerance reads 0, and so does an overpayment. Neither shows a shortfall nor a credit |

🚧 Every receipt carries these four lines whether the invoice took one payment
or several. A single full payment reads 0 previous and 0 remaining.

### Other information

| Item | Rule |
| --- | --- |
| **Receipt ID** | Unique across all receipts, one per payment |
| **Invoice ID** | The invoice this receipt pays |
| **Payment method** | Card with its brand and last four digits; Bank transfer; or the description the operator gave, with the external reference where one was recorded |
| **Manually settled mark** | On an operator-recorded settlement only, visually distinguishable from a card-settled receipt. A confirmed bank transfer is **not** marked |
| **Superseded invoice** | A pointer to any invoice the settlement supersedes |
| **Bill To and Ship To** | 🚧 The addresses of the invoice it pays. A later edit or archive of the saved address changes neither document |

Not on the receipt: any **proof file**, the winner's or an operator's, and the
**internal audit number**.

## Where the PDFs appear

- **Invoice** — a text link beside the Order summary heading, from send until
  Cancelled
- **Receipt** — a text link under the payment-method card, once payment is
  confirmed. 🚧 Every receipt for an invoice lists on that one row, oldest
  first
- The two are never paired on one row, and both are hidden on a cancelled
  order
- The payment-received letter attaches the receipt — the only letter that
  attaches a PDF

## Retention

Every invoice PDF, replaced invoices included, and every receipt PDF is kept
for at least 7 years, or for the life of the account if longer. Deleting the
account does not shorten the 7 years.

## Open questions

- ❓ **Which receipt ID is real.** Grade10 issues
  `REC-[YYYYMM]-[LISTING_ID]-[SEQ]-P[INDEX]`, for example
  `REC-202609-LK7P2Q-01-P1`. Post-Bidding reads `RC-LK42301P1`. The two do not
  agree, no change carries it, and taking the page's form is breaking —
  Product.
- ❓ **Formal tax receipt.** Whether a receipt must carry Grade10's company
  details and tax ID — Finance.
- ❓ **Bank account details.** The fields for each of the three ways to pay —
  Finance.

Invoice identifiers have the same disagreement: the store issues
`INV-202609-LK7P2Q-01` where the page reads `IN-LK42301`. Where a page and the
spec disagree, the spec is correct. The owner's source for both is
[Grade10 Invoicing Identifiers](grade10-invoicing-identifiers.md).
