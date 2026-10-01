---
title: Vault Blocks
spec: shared/ui/vault-case
order: 14
---

The vault collector's own blocks: the accept confirmation and the empty home.
The vault's cards, lists, rails and loading cards are
[Page Blocks](/p/shared/ui/page-blocks); a booked visit is
[Booking Blocks](/p/shared/ui/appointment-booking) unchanged.

## The Blocks

- **`VaultAcceptOfferDialog`** - the total, what a late day costs and
  what will be signed, before Accept; a refusal stays beside the terms
- **`VaultCasesEmpty`** - the vault home with no case yet: the intro,
  Start a request, How it works and the draft cap

Every state is reachable from a story with props alone; the pages the blocks
land on are [Collector Pages](/p/grade10-site/vault/collector-pages).

::story{id="vault-case-vaultacceptofferdialog--refused" title="An answer refused"}

::story{id="vault-case-vaultcasesempty--default" title="The empty vault home"}

:::detail{title="Product decisions" for="pm"}
The vault's pages compose store blocks, so Design Override holds them the way
it holds every other site page. The design record is the change's
`ui-design.md`.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Shared, not site-owned | Decided | The blocks live in `packages/ui` with a story per state, and the vault's components word and map them; drawing them inside `packages/vault/frontend` was rejected, because Design Override refuses a site page that draws a card, a list, a table, a stepper or a dialog of its own | Design |
| No existing block moves | Decided | `BookingSteps` and `GradingStatusRail` each fix their stages in their names and types, and both stay as they are; the vault's rail is `StageRail` | Design |
| No visible change | Decided | The case page, the list, the wizard, the booked visit and Your data read as they do today; the one change is Before you come's dividers, which now fall between two lines on both lanes | Design |
| Story ids | Decided | `vault-case-<component>--<state>`, the package's `Vault Case/<Component>` title | Design |
:::
