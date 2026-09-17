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
`decisions.md` existed; those edges stay in the proposal's What Changes. This
table records the letter interview on 2026-09-17 (revised the same day for
cadence and final-notice timing).

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Which change owns the letter updates? | Extend `add-winner-bank-transfer` (#501) | A separate notifications-only change that would fight #501 on `notifications-order` |
| Q2 | How is unpaid-invoice reminder cadence measured? | From **invoice send**: first letter at send (retires invoice-sent), then **day 3** and **day 6** while `pending`; final notice is separate (Q5) | “5 / 3 days before due”; or keeping invoice-sent as a separate letter kind |
| Q3 | What does payment-received show for bank transfer? | Label **Payment method**, value **Bank Transfer** only, subtext `Received {date}`, body says the order is being processed; receipt PDF attached | Bank + masked account + account name in the letter; or no PDF attach |
| Q4 | Where does Receipt ID appear? | Quiet `Receipt ID: …` line on the letter body **and** on the attached PDF (file name and content) | PDF only, or a prominent detail row |
| Q5 | When is the final notice, given email lag at day-7 expiry? | **24 hours before** the payment deadline, while `pending` and Pay is still offered; invoice-expired covers after | Day 7 immediately before expiry as a pay-now letter; dropping the final notice entirely; or a day-7 letter that only says Contact Us |
