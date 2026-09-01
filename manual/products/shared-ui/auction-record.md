---
title: Auction Record Blocks
spec: shared-ui/auction-record
order: 9
---

The account's auction record needs a surface, and this package is where its
blocks live once: the list of lots a collector touched, one lot's standing,
and the post-sale facts a winner or a released loser reads. Every consuming
application composes the same blocks rather than keeping its own copy.

As everywhere in this package, the blocks carry no product state of their own.
What lot, what standing, what was paid and what was released arrive as props
the application resolved; callbacks go back out through `on<Event>` names. The
capability spec is the export contract — which blocks exist, what each
receives, and what each may never fetch for itself.
