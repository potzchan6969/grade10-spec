## Screens

### Winner Order — Submit Payment Proof

Storybook: `My Auctions/Winner Order/Payment/Submit Payment Proof` (Form,
Submit proof, Submit failure) and page story **Submit Proof Flow**.

Title **Submit Payment Proof**. Subtext: after transfer, upload the receipt
here. Proof fields and FileDropzone only. Inline irreversible line: you can't
add or change files after you submit. Footer Cancel · **Submit Payment Proof**.

**Success** — dialog closes; toast **Proof submitted** / **We'll verify your
payment shortly.**; Winner Order shows Payment Verifying (alert; primary and
View Bank Details gone).

**Submit failure** — dialog stays open with the draft; toast **Proof not
submitted** / **Nothing was saved. Try again.**; invoice stays pending.

**Busy** — while submitting or converting HEIC, the whole form locks and
leave is blocked (Cancel, Escape and overlay dismiss do nothing).

**Dirty leave (not busy)** — preview `window.confirm`: leave without
submitting? Your payment proof will not be saved.

## Components

| Export | Package | Role |
| --- | --- | --- |
| `Dialog`, header/body/footer | `@grade10/design-system` | Proof modal |
| `FileDropzoneTarget`, `FileDropzoneFileList` | `@grade10/design-system` | Receipt files |
| `Toast` / `toast` | `@grade10/design-system` | Success, failure, file refuse |
| Preview proof feedback helper | `apps/preview` | Shared success/failure toast copy |
| Preview `WinnerOrderPaymentProofDialog` | `apps/preview` | Assembly — not a published export |

## States

| State | Shows | Anchor |
| --- | --- | --- |
| Form open | Fields + irreversible microcopy | `winner-order-SC-220` |
| Submit success | Toast + Payment Verifying surface | `winner-order-SC-218` |
| Submit failure | Stay open, draft kept, failure toast | `winner-order-SC-119` |
| Submitting / converting | Form locked; leave blocked | `winner-order-SC-219` |
| File refuse | Existing error toasts | **Out of suite:** file-reject copy unchanged (Q13) |
