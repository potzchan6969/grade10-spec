---
title: Post-Sale Queue
spec: grade10-auction/post-sale
audience: operator
order: 13
---

The queue works every listing from live through delivered in one place. Each
row wears exactly one operator-facing outcome, the queue filters to one
outcome at a time, and a row waiting on an operator — not on the clock —
carries an extra highlight. A listing opens into its facts, its winner, its
payment and shipment state, and a trail where status changes and comments
share one history.

| Outcome | When |
| --- | --- |
| Draft · Scheduled · Live · Ending soon | The sale is still the auction's |
| Unsold · Canceled | Ended with no winner; there is no aftermath |
| Awaiting payment | Card capture is still trying |
| Payment failed | Card capture gave up — an operator decides what next |
| Awaiting wire | A payment operator parked it to collect by wire |
| Paid via Stripe · Paid via Manual | The money is in, by capture or by record |
| Shipped · Delivered | The card has left Grade10; the winner has it |

## Payment

A listing with a winner reaches paid in exactly one of two ways, and the
first successful record wins: a verified card capture becomes **Paid via
Stripe**; a payment operator recording collection — a completed wire included
— becomes **Paid via Manual**. The two never share a visual mark, because how
the money arrived matters. Parking a listing at Awaiting wire, or recording
manual collection, marks the card authorization for release and stops
automatic capture — a winner who chose a wire is never also charged.
Operators may email the winner to collect payment or arrange the wire, and
every move lands on the listing's trail.

## Shipping

Shipment is its own grant, deliberately apart from payment: the person who
may capture money is not necessarily the person who ships cards. It runs in
one order — a delivery address recorded when obtained offline, started when
the card leaves Grade10, completed when the winner has it — and recording it
never rewrites who won or how they paid. The winner reads the same facts from
their own side on [My Auctions](/p/grade10-auction/account-auction-record).
