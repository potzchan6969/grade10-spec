---
title: Bidding
spec: grade10-site/auction/auction
order: 4
---

Every Grade10 listing is absolute. There is no reserve and no buy-now price;
the highest valid bid when the listing closes wins it. What makes a bid valid
is the card behind it — Grade10 accepts a bid only with an authorization
recorded for it, so an accepted bid is money that can actually move, not a
browser's claim. A bid of **HKD 120,000** or more also needs a verified bidder:
the storefront holds it before the auction hears of it, and sends the bidder to
[verify from their account](/p/grade10-site/store/account-identity).

A bid is accepted once and advances the highest bid atomically. A delayed
lower bid can never displace a higher one, however the network reorders them —
the contract is written against races, because the last minutes of an auction
are nothing but races.

The close is a deadline that moves. Each listing carries an extension window
and an extension duration (default 30 minutes each). A valid bid inside the
extension window pushes the close out by the extension duration from that bid,
again and again, until one full extension duration passes with no valid bid —
subject to an optional cap the listing sets. Sniping buys nothing; the auction
ends when bidding actually stops.
