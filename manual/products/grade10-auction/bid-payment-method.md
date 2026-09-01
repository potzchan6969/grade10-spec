---
title: Payment Method
spec: grade10-auction/bid-payment-method
order: 5
---

The first bid on a listing asks one extra question: which card. The collector
picks a saved card or adds one in Stripe's hosted payment field — the card
number never touches Grade10 — and that choice is bound to them and the
listing, so raising the bid later never reopens the dialog.

Behind the chosen card sits exactly one manual-capture authorization for the
submitted maximum. Raising the maximum updates that same authorization rather
than stacking a second hold, so a bidder's bank statement carries one pending
amount per listing, never a ladder of them.

This is the step that makes the bidding contract honest: an accepted bid has
proven funds behind it, and a payment-method failure surfaces before the bid
stands, not after the collector believes they lead.
