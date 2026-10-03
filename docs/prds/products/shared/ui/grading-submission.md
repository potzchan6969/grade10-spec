---
title: Grading Blocks
spec: shared/ui/grading-submission
order: 13
---

The grading collector's own blocks.

❓ Which blocks the collector's grading screens need; @tangconst names them
as she designs the screens — [Grading](/p/grade10-site/grading)

## The Blocks

- 🚧 **None** — the store carries no block of the grading collector's own;
  grading's drop-off booking and signing views compose
  [Booking Blocks](/p/shared/ui/appointment-booking) and
  [Page Blocks](/p/shared/ui/page-blocks)

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Shared, not product-owned | Decided | A grading block lives in `packages/ui` with a story per state; drawing one inside `packages/grading/frontend` was rejected, because no story would run outside the application and a second brand would copy the set | Design |
| No grading block | Decided | The store carries no grading block while @tangconst designs the collector's screens; a block drawn for a screen nobody carries is a second design to keep in step | Owner |
| The drop-off is the diary's | Decided | The shop, the day, the time, the confirmation and the visit card are the appointment-booking exports unchanged; grading's own drop-off views add the batch line | Design |
:::
