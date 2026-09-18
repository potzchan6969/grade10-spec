## Goals

- Auction-won and setup-reminder mail match order setup: delivery address,
  payment method, and billing address as bullets, with a clear setup deadline
- A winner who misses the setup deadline gets a setup-overdue letter that
  closes self-service setup and points to Contact Us for manual review
- A winner who misses the payment deadline gets a payment-overdue letter
  (replacing invoice-expired) that names what is owed and the same claim path
- Setup reminder fires once at 24h while setup is incomplete; no second reminder

## Non-Goals

- Billing address as a Winner Order form field — follow-on; mail may name it
  ahead of the page
- Changing close-overdue form lock, operator reopen, or phone-recorded address
- Automatic cancel or re-list when a deadline passes — operator review only
- Redefining bidder suspension (payment expiry already suspends)
- Payment-reminder series, final notice, or payment-received — owned by
  `add-winner-bank-transfer`
- A letter when an operator reopens the setup form

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Change boundary vs bank-transfer and close-overdue? | New change for setup + overdue mail; overdue letters are new; won and setup-reminder are updates to existing letters | Folding into `add-winner-bank-transfer`, or only shipping overdue without aligning won/reminder |
| Q2 | Is billing address in scope on Winner Order now? | The companion `add-winner-billing-address` change owns the Winner Order field and lands before this mail change is archived; these letters consume the confirmed billing value | Blocking mail until the page collects billing address |
| Q3 | What does a missed setup deadline do in product? | Self-service setup closed; Contact Us; manual review; may cancel and re-list after review; **no automatic cancel** | Auto-cancel on the setup deadline, or mail that promises cancellation without review |
| Q4 | Payment overdue vs invoice-expired? | Same letter: payment-overdue replaces invoice-expired at expiry | A second letter after invoice-expired |
| Q5 | Setup reminder cadence? | **24h** after lot close while setup incomplete; **no 72h** second reminder (recommended) | Leaving cadence ❓, dual 24h/72h, or a single reminder at another time |
| Q6 | Does this change also update auction-won and setup-reminder? | Yes — MODIFIED existing letters so the series matches (recommended) | Overdue-only change that leaves won/reminder address-only |
| Q7 | Billing in mail before the page? | Keep all three fields on won and reminder; the companion billing change supplies the page before archive, and overdue stays generic (recommended) | Dropping billing from mail until Winner Order catches up |
| Q8 | Penalties copy on setup-overdue? | Name penalties or extra charges on **both** overdue letters; durable meaning stays ❓ | Penalties only on payment-overdue |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-site/auction/notifications-order | Does setup-overdue still send if the winner confirmed setup a minute after the deadline? | Q3 |
| grade10-site/auction/notifications-order | Are penalties named on setup-overdue while durable rules stay open? | Q8 |
