## Goals

- Watchers no longer get a one-hour closing reminder
- A reissued invoice is announced by the same letter as a sent one
- The delivered and order-cancelled letters have settled content

## Non-Goals

- Adding any other closing reminder in place of the one-hour one
- Folding invoice-sent into the first payment reminder — `add-winner-setup-overdue-mail` carries it
- Reconciling the final notice's time or the letter at expiry across `add-winner-bank-transfer` and `add-winner-setup-overdue-mail`
- Deciding whether a paid order can be cancelled, or refund wording
- Rewriting the durable Post-close letters table while `add-winner-bank-transfer` also folds it — this change adds the reissue, delivered and cancelled rules beside it

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
| Q9 | Late enrolment after scheduled close − 24h for Bidding closes in 24 hours? | Same as other progress mail — while enrolled, the collector still receives it (enrolment) | Skip, or invent a new late-only shape |
| Q10 | Extended bidding has started on each restart, or first entry only? | Once per listing per collector on first entry | Again on every restart |
| Q11 | Does the one-hour retirement stop bidder-only one-hour mail too? | Yes — Grade10 sends no one-hour closing reminder about a listing, whether the collector watches, bid, or both | Watchers only |
| Q12 | Missing delivery address or delivered time on the delivered letter? | Names the address and time recorded on the order at carrier confirmation | A separate missing-facts shape |
| Q13 | Replayed reissue confirmation — one payment reminder or one per delivery? | One payment reminder per reissue; a repeated confirmation of the same reissue sends nothing twice | One letter per webhook delivery |
| Q14 | Does reissue restart day-3 / day-6 under Reminder cadence in this change? | Already durable — parks superseded reminders and starts the sequence for the new invoice; this change does not restate that root | Add a Reminder cadence leaf here |
| Q15 | Do winner order letters honour listing mute? | No — mute is listing alert mail in `notifications`; order letters stay on the winner's registered email | Honour mute on order letters |
| Q16 | Contact Us URL on delivered and cancelled letters? | The storefront's existing Contact Us destination | A new URL invented here |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-site/auction/notifications | If a collector enrols after scheduled close minus 24 hours, is Bidding closes in 24 hours skipped, sent late, or something else? | Q9 |
| grade10-site/auction/notifications | When extended bidding restarts on further bids, is Extended bidding has started sent only on first entry, or again on each restart? | Q10 |
| grade10-site/auction/notifications | Retirement is worded as the one-hour reminder to watchers — must any bidder-only one-hour path also stop? | Q11 |
| grade10-site/auction/notifications-order | When the delivery address or delivered time is missing, does the delivered letter still send, and what does it show? | Q12 |
| grade10-site/auction/notifications-order | Does a replayed or repeated operator reissue send the payment reminder once, or once per reissue action? | Q13 |
| grade10-site/auction/notifications-order | Does an invoice reissue restart the day-3 / day-6 reminder series, and should that sit under Reminder cadence? | Q14 |
| grade10-site/auction/notifications-order | Do winner order letters honour auction mute / unsubscribe, or is mute only for watcher notifications? | Q15 |
| grade10-site/auction/notifications-order | What URL does Contact Us open from the delivered and cancelled letters? | Q16 |
