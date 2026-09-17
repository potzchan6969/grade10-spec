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

## Raised

These are the eight questions the suites' reconciliation tables record as
raised and answered. Each lands on a `Decisions` row above; two of them land on
the same one. The suites carry the same answers against the grilling round's own
numbering.

The five suites still hold `## Raised` sections of their own, listing 32
questions between them. The 24 not tabled here are answered by the grilling
round but were never written back as landings, and eight have no recorded
answer at all — the invoice log entry for a winner upload, two operators acting
on one proof check, a replaced invoice PDF's home, the three sets of bank
details on the transfer PDF, what Winner Order shows for a stopped deadline,
whether file type is read from content or extension, the stopped deadline's
precision, and whether this change carries `post-sale-US-05` as a context
journey. They owe the change's author a landing each, and `pnpm run
tcs:validate` refuses the five suites until every one of them has it.

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
