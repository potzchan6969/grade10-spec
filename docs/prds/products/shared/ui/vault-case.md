---
title: Vault Blocks
spec: shared/ui/vault-case
order: 14
---

The vault collector's own blocks.

## The Blocks

- 🚧 **None** — the store carries no block of the vault collector's own; a
  site page composes [Page Blocks](/p/shared/ui/page-blocks) and
  [Booking Blocks](/p/shared/ui/appointment-booking)
- ❓ **The collector's blocks** — which blocks the collector's screens need;
  @tangconst names them as she designs the screens —
  [Collector Pages](/p/grade10-site/vault/collector-pages)

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Shared, not site-owned | Decided | A vault block lives in `packages/ui` with a story per state; drawing one inside a site package was rejected, because Design Override refuses a site page that draws a card, a list, a table, a stepper or a dialog of its own | Design |
| No vault block | Decided | The store carries no vault block while @tangconst designs the collector's screens; a block drawn for a screen nobody carries is a second design to keep in step | Owner |
| Story ids | Decided | `vault-case-<component>--<state>`, the package's `Vault Case/<Component>` title | Design |
:::
