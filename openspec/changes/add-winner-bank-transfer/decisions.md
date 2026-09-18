## Goals

- A winner can settle an unpaid auction invoice by card or by bank transfer
  with self-service proof, without an operator arranging the payment
- Payment letters tell the winner what to pay, when, and that payment was
  received, without duplicating the invoice-sent letter as a separate kind
- Unpaid-invoice reminders stay payable when the winner reads them — the last
  notice is not timed at the expiry instant
- The payment-received letter leaves the winner with a receipt PDF outside
  Grade10, and a calm body that does not expose bank account details

## Non-Goals

- Partial payment, shortfall tolerance, overpayment, and refunds — a separate
  change; until it lands an invoice settles only at its full amount
- Automatic matching of a bank statement to an invoice
- Cash or another method offered to the winner — operator settlement only
- Bank transfer in USD or JPY
- A proof-received letter when the winner uploads proof
- Changes to suspension rules beyond Payment Verifying stopping the deadline
- Scheduling reminders as “N days before due” when the window is fixed from
  invoice send — day N from send stays the schedule language
- A pay-now letter at the exact expiry transition

## Decisions

Bank-transfer settlement scope was settled in the original proposal before
`decisions.md` existed; those edges stay in the proposal's What Changes. Q1 to
Q5 record the letter interview on 2026-09-17 (including final-notice timing).
Q6 to Q12 record what the blind readings escalated in the grilling round of
2026-09-16, recovered from the suites' reconciliation tables, where the same
answers carry the round's own numbers.

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Which change owns the letter updates? | Extend `add-winner-bank-transfer` (#501) | A separate notifications-only change that would fight #501 on `notifications-order` |
| Q2 | How is unpaid-invoice reminder cadence measured? | From **invoice send**: first letter at send (retires invoice-sent), then **day 3** and **day 6** while `pending`; final notice is separate (Q5) | “5 / 3 days before due”; or keeping invoice-sent as a separate letter kind |
| Q3 | What does payment-received show for bank transfer? | Label **Payment method**, value **Bank Transfer** only, subtext `Received {date}`, body says the order is being processed; receipt PDF attached | Bank + masked account + account name in the letter; or no PDF attach |
| Q4 | Where does Receipt ID appear? | Quiet `Receipt ID: …` line on the letter body **and** on the attached PDF (file name and content) | PDF only, or a prominent detail row |
| Q5 | When is the final notice, given email lag at day-7 expiry? | **24 hours before** the payment deadline, while `pending` and Pay is still offered; invoice-expired covers after | Day 7 immediately before expiry as a pay-now letter; dropping the final notice entirely; or a day-7 letter that only says Contact Us |
| Q6 | What does a Payment Verifying row show on the account record? | The badge and View order, nothing else — no helper line, no upload control (grilling decision 7) | A helper line explaining the check, or an upload control on the row |
| Q7 | Does a payment letter give the deadline as a date and time, or as the time left? | An absolute date and time in the winner's zone, `Pay by …` (grilling decision 5) | A duration, which goes stale as the letter sits in an inbox |
| Q8 | What happens to the reminders while proof is checked? | They resume on the paused clock; one whose time passed during the check is not sent late, and one already sent is not repeated (grilling decision 5) | Sending the missed reminder late, or restarting the sequence from the return |
| Q9 | Which operator actions stay open while an order is Payment Verifying? | Confirm or Return only; Cancel, Reissue and manual settlement are refused (grilling decision 2) | Leaving Cancel and Reissue open, which needs a rule for what a reissue does to the held reminder sequence |
| Q10 | Which invoice states may enter Payment Verifying? | `pending` only | Letting an expired invoice take proof |
| Q11 | Can a Payment Verifying invoice be expired? | No — the deadline stops while proof is checked (grilling decision 1) | An expiry that runs under the check, needing a rule for proof returned after it |
| Q12 | Is the stopped deadline kept as a duration, and to what precision? | As a duration — the time left at the pause. The precision is the tech design's | Writing a fresh absolute deadline at every pause |
| Q13 | How many proof files, which types, and what size limits? | **1 to 3** files (**1** required); PDF, PNG, JPG, or HEIC; **5 MB** each; **15 MB** total; HEIC stored as JPEG for operators | 1 to 5 files of PDF/JPEG/PNG at 10 MB each |
| Q14 | Where do Invoice and Receipt PDF controls sit on Winner Order? | **Invoice** is a text link beside the Order summary heading; **Receipt** is a text link under the payment-method card. They are not paired on one row | Both as outline buttons, or both on the same summary row |
| Q15 | Which bank-detail fields get a copy control on Submit Payment Proof? | Account number / IBAN, total amount due, and the transfer reference each have an icon copy control with success toast | Copy Reference Code only |
| Q16 | Is proof upload a shared design-system primitive? | Yes — `FileDropzone` / `FileDropzoneTarget` / `FileDropzoneFileList` under `packages/design-system` (`@grade10/design-system/components/forms/file-dropzone`) for HEIC convert, limits, and reject reasons | `@grade10/ui` block; page-local dropzone only |
| Q17 | What does Winner Order show while proof is checked? | An inline Alert (`status=default`, Hourglass icon): **We’re verifying your transfer. We’ll email you when payment is confirmed.** No proof-received letter (already a non-goal) | Page body only; warning or success status; Bell icon; or a letter on upload |
| Q18 | Where does that status Alert sit? | Under Order progress below `lg`; under the lot from `lg` up — same placement as Preparing Invoice’s invoice-ready Alert | Always under the lot; always under progress |

## Reconciled questions

The blind suite questions are all settled below. The corresponding feature
suites retain their reconciliation tables as an audit trail, but no question
remains a blocker for this change.

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-site/auction/account-record` | Does a Payment Verifying row carry anything beyond the badge and View order? | Q6 |
| `grade10-site/auction/notifications-order` | Absolute deadline, or a duration? | Q7 |
| `grade10-site/auction/notifications-order` | Are reminder times shifted by the pause, and is a missed one sent late? | Q8 |
| `grade10-site/auction/notifications-order` | Does a reissue while Payment Verifying reset the held sequence? | Q9 |
| `grade10-site/auction/order-status` | May an operator cancel or reissue a Payment Verifying order? | Q9 |
| `grade10-site/auction/order-status` | Which states may enter Payment Verifying, and is an expired invoice one? | Q10 |
| `grade10-site/auction/order-status` | How can a Payment Verifying invoice be expired? | Q11 |
| `grade10-site/auction/order-status` | Is the stopped deadline kept as a duration, and to what precision? | Q12 |

| Q19 | Does a winner proof upload create an invoice-log entry? | Yes. The upload, its accepted file metadata and its outcome are recorded in the invoice log; the proof bytes remain operator-only. | Treating proof as an untracked page event |
| Q20 | What happens when two operators act on one proof check? | The first valid Confirm or Return atomically changes the check state; the second action is refused as stale and changes nothing. | Last write wins or duplicate settlement |
| Q21 | Where does a winner reach a replaced invoice PDF? | Invoice history on Winner Order lists the replaced invoice and links its immutable PDF; the replacement link is shown beside it. | Removing the old PDF or exposing it only through email |
| Q22 | Which bank details appear on the bank-transfer invoice PDF? | The configured account name, bank name and address, account number or IBAN, SWIFT/BIC and applicable local transfer details appear with the amount and bank reference. | Keeping the PDF to a reference code only |
| Q23 | How is proof file type checked? | The upload validates the file signature and MIME content, not only the filename extension; a mismatch rejects the whole set. | Trusting a renamed executable |
| Q24 | What precision is used for the stopped payment deadline? | The paused duration is persisted as an integer millisecond duration; the UI formats it for the winner's timezone. | Recomputing an absolute deadline from rounded display text |
| Q25 | Does this change carry `post-sale-US-05` as a context journey? | No. The existing quote journey remains the owner of that context; this change traces its first-transfer behavior directly to the Quote and send feature group. | Duplicating the journey in every payment change |
