---
title: The post-sale queue
summary: Working a won listing from live through delivered, with payment and shipping split by grant.
spec: grade10-auction/post-sale
audience: operator
order: 12
---

Bidding produces a winner and a card authorization; today the aftermath is
split across catalogue, settlement-retry and fulfilment panels, the winner's
contact is hidden from the people who must reach them, and Stripe capture is
the only way a listing becomes paid. Won cards sit unpaid or unshipped.

The queue works one listing from live through delivered. Each row wears an
operator-facing outcome — Live, Ending soon, Awaiting payment, Awaiting wire,
Paid via Stripe, Paid via Manual, Shipped, Delivered, and the terminal labels
around them — so the state of the aftermath is readable at a glance, and a
wire or manual payment is as recordable as a capture.

Payment and shipping are separate grants. The person who may capture money is
not necessarily the person who ships cards, and the queue keeps those moves
apart. The number that moves when this works is the completed-auction payment
rate — closed listings whose winner reaches paid, over closed listings with a
winner.
