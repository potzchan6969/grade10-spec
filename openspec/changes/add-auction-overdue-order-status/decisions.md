## Goals

- After each deadline, the derived order status names that self-service has
  closed — Setup Overdue and Payment Overdue — on every surface that reads it
- My Auctions names that column Status, matching bid standing and order status

## Non-Goals

- Changing the setup or payment deadline lengths or clocks
- Setup-overdue or payment-overdue letter copy (owned by
  `add-winner-setup-overdue-mail`)
- Form lock / operator reopen mechanics (owned by
  `close-overdue-address-confirmation`)
- Payment Verifying or Partially Paid behaviour
- A new letter kind for overdue status itself

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What does the order read after the setup deadline? | **Setup Overdue** — its own derived status | Keeping **Awaiting Setup** with only an alert / subtitle |
| Q2 | What does the order read after the payment deadline? | **Payment Overdue** — its own derived status when the invoice is `expired` | Keeping **Pending Payment** for an expired invoice (`auction-status-SC-06`) |
| Q3 | Who sees the same overdue names? | Winner Order, My Auctions Status, and the operator post-sale queue | Different labels per surface |
| Q4 | Column name on My Auctions? | **Status** (replaces Your Standing) | Keeping Your Standing |
| Q5 | Packaging? | This change for overdue statuses + Status rename; Partially Paid stays on `add-winner-partial-payment` | One mega-change for all standing work |
| Q6 | `payment-received-partial` email draft? | Out of OpenSpec — partial-payment non-goal stands | Reversing that non-goal |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
