---
title: Notifications
spec: grade10-auction/notifications
order: 8
---

A lot closes on a deadline the extension rule keeps moving, so a collector
cannot plan to be there at the end. Today the platform tells them nothing —
not when bidding opens on a lot they watched, not when the close is near, not
when someone takes the lead. Being outbid is learned by coming back, and most
do not come back. That is a bid the lot never receives, from a collector who
had already committed money to it.

The mail follows the strongest signals the auction produces: a watched lot
opens for bidding, a watched or bid-on lot is closing soon, a leading bidder
is outbid, a winner has won. Watching is what arms the before-and-during mail,
which is why this capability depends on the watchlist.

The conventions were already written for these messages. `money-amounts` says
how an amount renders in an outbid or lot-won email, and `dates-and-times`
requires a close shown in mail to name its zone and match the page — contracts
that existed before anything sent them.
