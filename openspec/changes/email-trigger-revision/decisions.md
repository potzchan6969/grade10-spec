## Goals

- Watchers no longer get a one-hour closing reminder
- A reissued invoice is announced by the same letter as a sent one
- The delivered and order-cancelled letters have settled content

## Non-Goals

- Adding any other closing reminder in place of the one-hour one
- Folding invoice-sent into the first payment reminder — `add-winner-setup-overdue-mail` carries it
- Reconciling the final notice's time or the letter at expiry across `add-winner-bank-transfer` and `add-winner-setup-overdue-mail`
- Deciding whether a paid order can be cancelled, or refund wording

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Retire the one-hour watcher reminder, reversing "additive: it stays"? | Retire it; the 24-hour letter and extended bidding are the last warnings (recommended) | Replace it with another timing, or keep it |
| Q2 | Is the application sending the one-hour reminder today? | Yes — the application must stop it | Treat it as never shipped and edit only the words |
| Q3 | Record the new order-letter templates in this change? | Yes | Keep this change to the one-hour reminder alone |
| Q4 | Can an operator cancel a paid order? | Deferred — see the proposal's open questions | — |
| Q5 | Does the cancelled letter name the operator's reason? | No; Contact Us is the path (recommended) | An external reason the winner reads, as proof-not-accepted does |
| Q6 | Delivered letter's actions? | View order first, Contact Us second (recommended) | View order alone |
| Q7 | Separate invoice-sent letter, or the payment reminder at send? | Both fire when an operator sends the invoice, so only the payment reminder is sent | A separate invoice-sent letter, as `add-winner-bank-transfer`'s delta keeps |
| Q8 | Is invoice reissued its own letter? | No; the payment reminder at send is sent for the new invoice | A reissued letter saying it replaces the previous invoice |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
