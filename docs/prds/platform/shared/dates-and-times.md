---
title: Dates and Times
spec: shared/dates-and-times
order: 2
---

Every date the platform holds is an instant — a single point in time with no
zone of its own. What a person reads depends on the surface.

## Collector Surfaces

- 🚧 **Viewer local** — a clock on a collector page uses the viewer's own
  zone, supplied as the page's `timeZone`
- 🚧 **Viewer's zone name** — a deadline that names a zone uses that viewer's
  short name: HKT in Hong Kong, EDT in New York, never a pinned HKT for every
  reader
- **Relative remaining** — Ends in and Opens in carry no zone
- **Activity** — recent rows are a short relative label; older rows are a
  local moment with no zone suffix

## Documents

- 🚧 **GMT+8** — invoices, receipts, terms, and emails state Asia/Hong_Kong
  and name GMT+8, the same for every recipient

## Other Surfaces

Operator tables and admin surfaces state Coordinated Universal Time. A
calendar day the business judges — a contract, a due date, a "today" queue,
an age, a document's expiry, a report's month — stays on the brand's zone.
Ordering and punctuation are the platform's, not the browser's. A date that
is not a valid instant stops the render.

A calendar day an operator types into a filter becomes the instants that day
opens and closes on the surface's own clock.

::changes{spec="shared/dates-and-times"}

:::detail{title="Product decisions" for="pm"}
A collector in Seoul and one in Hong Kong were reading different suffixes for
the same instant — UTC on a tile, HKT on My Auctions — and mail already said
GMT+8 while the PDF said HKT.

**Not in scope.** Operator UTC tables. Brand-day judgements (shop midnight).
Relative countdowns.

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Collector clock | Decided | Viewer's local zone | Product |
| Named zone on collector UI | Decided | Viewer's short name (HKT, EDT) | Product |
| PDFs, T&C, emails | Decided | Asia/Hong_Kong labelled GMT+8 | Product |
:::
