**Author:** @seankcw - 2026-09-23

## Why

`grade10-site/auction/winner-order` has required a viewable, downloadable
Invoice PDF and Receipt PDF since `winner-order-SC-57` and `winner-order-SC-67`
landed, and `docs/references/auction-invoice-and-receipt-contents.md` already
carries every line either document shows. No shared implementation renders
either one: `grade10` opens a hardcoded placeholder PDF today
(`PLACEHOLDER_RECEIPT_PDF`), and this repository's own preview carries only an
illustrative sketch composed straight from `@grade10/design-system`
primitives, explicitly flagged as "not a `packages/ui` block" pending its own
change. Every other reused surface on Winner Order — the order detail, the
address form — already lives once in `@grade10/ui`; the two documents are the
one place left where "one shared implementation, every consumer imports it" is
a claim this repository does not yet back with a component.

**Metric:** the number of consumer implementations of the Invoice and Receipt
PDFs outside `@grade10/ui` — one today, `grade10`'s `PLACEHOLDER_RECEIPT_PDF`.
This change adds the one shared implementation both documents should render
from; the count outside `@grade10/ui` reaches zero once `grade10` wires it in,
which is that repository's own task (see Impact).

## What Changes

- **New capability `shared/ui/invoice-and-receipt-pdf`** exports `InvoicePdf`
  and `ReceiptPdf`, one spec for both documents:
  - `InvoicePdf` renders an invoice's full content — meta rows (invoice ID,
    payment method, sent/deadline dates, bank reference, the bank rails a
    bank-transfer invoice carries), the issuer block, Bill To and Ship To,
    the lot, the order-value lines, and Replaced by.
  - `ReceiptPdf` renders the same meta rows and party blocks — receipt ID,
    the invoice ID it pays, payment method, Bill To and Ship To — plus the
    order-value lines, the four payment-breakdown lines
    `carry-receipt-payment-breakdown` already decided (Original Invoice
    Total, Previous Payments, Current Payment Received, Remaining Balance
    Due), the manually-settled mark, and Superseded invoice.
  - Every value is received as a prop, matching what `winner-order/spec.md`
    and the reference doc already require.
- **Both carry a reserved, optional `ReactNode` slot** for a tax line and for
  a receipt's company/tax-ID block — neither is a confirmed requirement today
  (the tax regime and the formal-receipt question are both open), so both
  slots are marked ❓ rather than shaped around a guess; only the prop's
  presence is committed, not its content.
- **apps/preview's illustrative sketch is retired.**
  `winner-order.invoice-pdf.stories.tsx`, `winner-order.receipt-pdf.stories.tsx`
  and `winner-order-pdf.story-shared.tsx` stop composing their own local
  layout and instead compose the real `@grade10/ui` exports with sample
  props, the same way every other preview page does.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- `shared/ui/invoice-and-receipt-pdf`: the Invoice PDF's and the Receipt
  PDF's content, as one `@grade10/ui` export contract exporting `InvoicePdf`
  and `ReceiptPdf`.

### Modified Capabilities

None. `grade10-site/auction/winner-order`'s requirements for the two PDFs are
unchanged; this change gives them a shared implementation, not new behavior.

## Impact

| Consumer | Change |
| --- | --- |
| `apps/preview` (this repository) | Retires the sketch; composes `InvoicePdf`/`ReceiptPdf` with sample data instead. |
| `@grade10/ui` | Adds the `invoice-and-receipt-pdf` block, exporting `InvoicePdf` and `ReceiptPdf`. |
| `@grade10/design-system` | No change — composed only, no new primitive. |
| `@grade10/i18n` | No change — every label reaches the components as a `copy` prop, per the existing component-contract rule. |
| `apps/frontend/grade10` | Replaces its placeholder invoice/receipt PDF rendering with the real components once it picks the change up; that wiring is `grade10`'s own task, named here but not built in this repository. |
| `apps/admin/grade10` | None. |

## References

- [Post-Bidding · The Invoice](../../../docs/prds/products/grade10-site/auction/post-bidding.md#the-invoice)
- [Post-Bidding · Paying](../../../docs/prds/products/grade10-site/auction/post-bidding.md#paying)
- [Auction Invoice and Receipt Contents](../../../docs/references/auction-invoice-and-receipt-contents.md)

## Open questions

- **Tax line shape.** Deliberately unresolved here — the reserved `ReactNode`
  prop carries no shape of its own until a separate change defines the
  regime. Product owns it.
- **Formal tax receipt.** Whether a receipt needs Grade10's company details
  and a tax ID at all is still open. Finance owns it.
- **Bank account details.** `InvoicePdf`'s bank-rails props carry whatever
  value the app has; the SWIFT/FPS/HK local account values themselves are
  still ❓. Finance owns it.
