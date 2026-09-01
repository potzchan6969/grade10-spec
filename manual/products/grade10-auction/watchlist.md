---
title: Watching a lot
summary: Registering interest without holding money on a card, and the signal auction mail fires on.
spec: grade10-auction/watchlist
order: 7
---

Bidding is the only way to register interest in a lot today, and a bid holds
money on a card. A collector who is still deciding either commits early or
navigates away and finds the lot again by memory — against a close that moves.
Watching fills that gap: one action that says "tell me about this lot" and
costs nothing.

The control already has a home. `ListingBidPanel` ships a `watchAction` slot
and a `watching` flag that nothing fills; this capability fills them rather
than removing them, because unlike the removed store wishlist there is a
surface that needs the signal — the before-and-during-auction mail on the
auction email page has no trigger without it.

What the product measures is whether watching leads anywhere: the share of
signed-in collectors who watch at least one lot, and the share of watched lots
their watcher later bids on.
