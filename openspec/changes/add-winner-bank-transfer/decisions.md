## Goals

- A winner can settle an unpaid auction invoice by card or by bank transfer
  with self-service proof, without an operator arranging the payment
- Payment letters tell the winner what to pay, when, and that payment was
  received, without duplicating the invoice-sent letter as a separate kind
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
- Replacing day-3 / day-6 / day-7 after send with a 7-days-before-due reminder
  (that letter would duplicate the first payment reminder at invoice send)

## Decisions

Bank-transfer settlement scope was settled in the original proposal before
`decisions.md` existed; those edges stay in the proposal's What Changes. Q1 to
Q4 record the letter interview on 2026-09-17. Q5 to Q11 record what the blind
readings escalated in the grilling round of 2026-09-16, recovered from the
suites' reconciliation tables, where the same answers carry the round's own
numbers.

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Which change owns the letter updates? | Extend `add-winner-bank-transfer` (#501) | A separate notifications-only change that would fight #501 on `notifications-order` |
| Q2 | What is the unpaid-invoice letter cadence? | One **payment-reminder** kind: first when the invoice is sent, then 5 days and 3 days before the payment deadline; retire invoice-sent as its own letter | Keep invoice-sent plus day 3 / 6 / 7 after send; or also send a 7-days-before-due reminder (duplicates the first letter) |
| Q3 | What does payment-received show for bank transfer? | Label **Payment method**, value **Bank Transfer** only, subtext `Received {date}`, body says the order is being processed; receipt PDF attached | Bank + masked account + account name in the letter; or no PDF attach |
| Q4 | Where does Receipt ID appear? | Quiet `Receipt ID: …` line on the letter body **and** on the attached PDF (file name and content) | PDF only, or a prominent detail row |
| Q5 | What does a Payment Verifying row show on the account record? | The badge and View order, nothing else — no helper line, no upload control (grilling decision 7) | A helper line explaining the check, or an upload control on the row |
| Q6 | Does a payment letter give the deadline as a date and time, or as the time left? | An absolute date and time in the winner's zone, `Pay by …` (grilling decision 5) | A duration, which goes stale as the letter sits in an inbox |
| Q7 | What happens to the reminders while proof is checked? | They resume on the paused clock; one whose time passed during the check is not sent late, and one already sent is not repeated (grilling decision 5) | Sending the missed reminder late, or restarting the sequence from the return |
| Q8 | Which operator actions stay open while an order is Payment Verifying? | Confirm or Return only; Cancel, Reissue and manual settlement are refused (grilling decision 2) | Leaving Cancel and Reissue open, which needs a rule for what a reissue does to the held reminder sequence |
| Q9 | Which invoice states may enter Payment Verifying? | `pending` only | Letting an expired invoice take proof |
| Q10 | Can a Payment Verifying invoice be expired? | No — the deadline stops while proof is checked (grilling decision 1) | An expiry that runs under the check, needing a rule for proof returned after it |
| Q11 | Is the stopped deadline kept as a duration, and to what precision? | As a duration — the time left at the pause. The precision is the tech design's | Writing a fresh absolute deadline at every pause |

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
| `grade10-site/auction/account-record` | Does a Payment Verifying row carry anything beyond the badge and View order? | Q5 |
| `grade10-site/auction/notifications-order` | Absolute deadline, or a duration? | Q6 |
| `grade10-site/auction/notifications-order` | Are reminder times shifted by the pause, and is a missed one sent late? | Q7 |
| `grade10-site/auction/notifications-order` | Does a reissue while Payment Verifying reset the held sequence? | Q8 |
| `grade10-site/auction/order-status` | May an operator cancel or reissue a Payment Verifying order? | Q8 |
| `grade10-site/auction/order-status` | Which states may enter Payment Verifying, and is an expired invoice one? | Q9 |
| `grade10-site/auction/order-status` | How can a Payment Verifying invoice be expired? | Q10 |
| `grade10-site/auction/order-status` | Is the stopped deadline kept as a duration, and to what precision? | Q11 |
