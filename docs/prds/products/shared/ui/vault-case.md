---
title: Vault Blocks
spec: shared/ui/vault-case
order: 14
---

The vault collector's pages, drawn from store blocks: the fact card, the
note list, the stage rail, the accept confirmation, the empty home and the
loading cards. The vault's site supplies the words, the figures and the
callbacks; a booked visit is [Booking Blocks](/p/shared/ui/appointment-booking)
unchanged.

## The Blocks

- 🚧 **`VaultFactCard`** - one titled card of facts: a lead, label and
  value rows, a body and actions, each drawn only when given; the one card
  shape the case page, the case list and Your data use
- 🚧 **`VaultFactCardSkeleton`** - the cards a read will fill, as one
  loading line a screen reader hears once
- 🚧 **`VaultNoteList`** - short lines one under the other, a divider
  between two lines and none after the last; Before you come, the photo tips,
  the reminders, the repayments and How the loan works
- 🚧 **`VaultStageRail`** - the stages of a case or of the request wizard,
  the current one marked; an ended case stays where it ended
- 🚧 **`VaultAcceptOfferDialog`** - the total, what a late day costs and
  what will be signed, before Accept; a refusal stays beside the terms
- 🚧 **`VaultCasesEmpty`** - the vault home with no case yet: the intro,
  Start a request, How it works and the draft cap

Every state is reachable from a story with props alone; the pages the blocks
land on are [Collector Pages](/p/grade10-site/vault/collector-pages).

::story{id="vault-case-vaultfactcard--every-part" title="A fact card with every part"}

::story{id="vault-case-vaultnotelist--with-link-item" title="Before you come, not verified"}

::story{id="vault-case-vaultstagerail--financed-mid" title="The financed lane at Signed"}

::story{id="vault-case-vaultacceptofferdialog--refused" title="An answer refused"}

::story{id="vault-case-vaultcasesempty--default" title="The empty vault home"}

::story{id="vault-case-vaultfactcardskeleton--two" title="Loading the cases"}

:::detail{title="Product decisions" for="pm"}
The vault's pages compose store blocks, so Design Override holds them the way
it holds every other site page. The design record is the change's
`ui-design.md`.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Shared, not site-owned | Decided | The blocks live in `packages/ui` with a story per state, and the vault's components word and map them; drawing them inside `packages/vault/frontend` was rejected, because Design Override refuses a site page that draws a card, a list, a table, a stepper or a dialog of its own | Design |
| No existing block moves | Decided | The rail is the vault's own: `BookingSteps` and `GradingStatusRail` each fix their stages in their names and types, and both stay as they are | Design |
| No visible change | Decided | The case page, the list, the wizard, the booked visit and Your data read as they do today; the one change is Before you come's dividers, which now fall between two lines on both lanes | Design |
| Story ids | Decided | `vault-case-<component>--<state>`, the package's `Vault Case/<Component>` title | Design |
:::
