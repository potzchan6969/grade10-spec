# grade10-site/auction/winner-order Specification

## Feature set

- Settlement currency
  - Convert once: an HKD order's Subtotal is the sum of its USD lines at 7.85, rounded up to the next cent; no line is converted or rounded on its own
  - Cent rounding: every amount keeps two decimals; a fraction of a cent rounds up where an amount is converted or grossed up; the Order Total is the Subtotal plus the fee
  - Bank transfer fee under HKD: typed in USD, converted at 7.85 and rounded up to the next cent, below the Subtotal and outside the converted sum
  - Rate named once: the Order Summary's conversion note is the one place that names the rate; no invoice, receipt or letter does
  - Same lines on every document: an HKD invoice and receipt list the USD lines, then the HKD Subtotal, fee and total
- Order summary
  - USD lines under HKD: each line reads its USD amount, Shipping & Handling, Insurance and Tax included
  - Subtotal and note: one HKD Subtotal below the lines names the USD sum and the rate
  - Fee and total in HKD: the Payment Processing Fee and the Order Total sit below the Subtotal
  - Unchanged cases: a USD order keeps one Order Total, and before an invoice is sent no HKD amount and no note shows
- Invoice
  - Fee base under HKD: a card fee is computed in HKD on the Subtotal
