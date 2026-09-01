---
title: Bidding
summary: Card-backed bids on absolute listings, and a close that moves while bidding is alive.
spec: grade10-auction/auction
order: 4
---

Every Grade10 listing is absolute. There is no reserve and no buy-now price;
the highest valid bid when the listing closes wins it. What makes a bid valid
is the card behind it — Grade10 accepts a bid only with an authorization
recorded for it, so an accepted bid is money that can actually move, not a
browser's claim.

A bid is accepted once and advances the highest bid atomically. A delayed
lower bid can never displace a higher one, however the network reorders them —
the contract is written against races, because the last minutes of an auction
are nothing but races.

The close is a deadline that moves. A valid bid inside the last 30 minutes
pushes the close 30 minutes out from that bid, again and again, until one full
30-minute interval passes with no valid bid — subject to an optional cap the
listing sets. Sniping buys nothing; the auction ends when bidding actually
stops.
