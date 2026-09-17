---
title: Bidding
spec: grade10-site/auction/auction
order: 21
---

Every Grade10 listing is absolute. There is no reserve and no buy-now price;
the highest valid bid when the listing closes wins it. A valid bid meets the
listing's bid rules. Bid-time authorization holds are disabled by default, so
Grade10 accepts a valid bid without waiting for or creating a card hold. When
the optional hold is enabled, Grade10 accepts the bid only with an
authorization recorded for it. A bid of **HKD 120,000** or more also needs a verified bidder:
the storefront holds it before the auction hears of it, and sends the bidder to
[verify from their account](/p/grade10-site/account/kyc).

A bid is accepted once and advances the highest bid atomically. A delayed
lower bid can never displace a higher one, however the network reorders them —
the contract is written against races, because the last minutes of an auction
are nothing but races.

The scheduled close is where extended bidding starts. At that moment a
listing with no bid closes. A listing with at least one bid — a bid at the
close counts — enters extended bidding for its extension duration (default 30
minutes). Every new bid, from anyone, restarts that listing's timer at the full
duration, and the listing closes when its timer runs out with no new bid —
subject to an optional cap the listing sets. Each listing runs its own timer.
Sniping buys nothing; the auction ends when bidding actually stops.
