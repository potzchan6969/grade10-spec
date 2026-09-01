---
title: Store order history
summary: The shared blocks an Order History page assembles — status badge, line item, order card, and the page that splits Active from Past.
spec: shared-ui/store-order-history
order: 7
---

An Order History page is four blocks from one component source: a status badge
carrying the six Status-set variants, a line item showing image, product×qty
and line total, an order card with its header metadata and a horizontally
scrolling line slot, and the page compound that lists Active and Past orders.
Every store application renders them from that one source, supplying copy,
imagery, formatted values and callbacks — the blocks fetch nothing and format
nothing themselves.

The page hides a section with nothing in it rather than rendering an empty
heading, and when both lists are empty it shows the empty state that sends a
collector to the store. Track Order appears on a card only when the
application enables it, and each part is importable alone, so a console that
needs just the badge or just a card takes that and no more.

## What a collector does

::journeys{id="shared-ui/store-order-history"}

## The contract

::spec{id="shared-ui/store-order-history"}
