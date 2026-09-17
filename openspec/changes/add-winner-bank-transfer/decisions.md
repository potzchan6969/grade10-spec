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
`decisions.md` existed; those edges stay in the proposal's What Changes. This
table records the letter interview on 2026-09-17.

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Which change owns the letter updates? | Extend `add-winner-bank-transfer` (#501) | A separate notifications-only change that would fight #501 on `notifications-order` |
| Q2 | What is the unpaid-invoice letter cadence? | One **payment-reminder** kind: first when the invoice is sent, then 5 days and 3 days before the payment deadline; retire invoice-sent as its own letter | Keep invoice-sent plus day 3 / 6 / 7 after send; or also send a 7-days-before-due reminder (duplicates the first letter) |
| Q3 | What does payment-received show for bank transfer? | Label **Payment method**, value **Bank Transfer** only, subtext `Received {date}`, body says the order is being processed; receipt PDF attached | Bank + masked account + account name in the letter; or no PDF attach |
| Q4 | Where does Receipt ID appear? | Quiet `Receipt ID: …` line on the letter body **and** on the attached PDF (file name and content) | PDF only, or a prominent detail row |
