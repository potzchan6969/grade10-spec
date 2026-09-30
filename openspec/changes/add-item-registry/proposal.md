**Author:** @brianchacha6969 - 2026-09-30

## Why

Nobody at Grade10 can answer who owns one physical thing. The vault knows the
collector on each case, grading knows the submission, and stock counts units
of a product: a slab handed back from grading and brought to the vault is
typed in again with no grade, the custody agreement cannot name it by its
cert, and when an item changes hands at the counter nothing records who moved
it, why, or on what proof. The vault's own record says it plainly - a
valuation holds "an amount and a note; no grading company, certificate
number, grade".

**Metric** - items in the vault with no record in the register, held at
zero after the backfill; ownership moves recorded with who, why and when,
none today because none are recorded.

## What Changes

- **An item register** - one record per physical thing, graded or not, owned
  by an account or by one of the company's two entities, the custodian or the
  lender, carrying its category from a closed list of ten, title,
  description, grader, grade, cert and the catalogue's reusable attributes
- **Staff find who has what** - Items and one item's page on the console,
  searched by title, by grader and cert, by item id or by owner, opening on
  the items a place holds, the owner shown by name
- **Held or not is read from the places** - a place that holds an item says
  so on it; in this release the vault is the only place. The register mirrors
  what the vault has already done and never refuses it; a disagreement on
  the owner is shown to staff, and staff close a hold the vault no longer has
- **The vault registers what it takes in** - an item is registered when staff
  start its valuation and is held from vaulting until release, unwind or
  forfeit; every case that already reached custody is registered once
- **Grader, grade and cert reach the vault** - on the case's valuation and
  printed on the custody agreement; a walk-in bringing a slab the register
  knows finds it by grader and cert rather than typing it again. This
  delivers the follow-on `add-card-grading` names carry-grade-into-vault-case
- **Staff move an item to a new owner** - any account, the custodian, or away
  from an erased owner, with a reason and an optional proof document, traced
  on the item and the audit log; refused while a place holds the item, naming
  the place
- **Forfeit moves the item to the lender** - when the vault closes its hold,
  never by a staff move
- **Retire** - a duplicate, a lost or destroyed item, or one that left the
  platform
- **A collector's items** - their own section on the collector page
- **Erasure reaches the register** - inventory answers the erasure checklist,
  refusing while a place holds an item the person owns
- **A grant to move items** - `inventory:transfer`, held by staff and admin;
  the treasurer holds none of the register's grants
- **Grading's catalogue rule, restated** - a collector's slab still never
  enters the catalogue; the vault values it from the register, superseding
  `add-card-grading`'s Q82 by name

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- `grade10-admin/inventory/items`: the register on the console - what an item
  says, who owns it, finding it, registering and editing it, moving it,
  retiring it, closing a hold left open, a collector's items, and erasure
- `grade10-admin/inventory/item-marks`: how a place tells the register what
  it holds - a hold opened and closed by the place, mirrored and never
  refused, a disagreement recorded, the owner moved by a place's closing
  word; walked by nobody on their own

### Modified Capabilities

- `grade10-admin/vault/operator-queue`: the Case tab reads and edits the
  item's grader, grade, cert and facts once it is registered; a walk-in finds
  a slab the register already knows by grader and cert
- `grade10-site/vault/valuation-and-offer`: a valuation is read beside the
  item's grader, grade and cert
- `grade10-site/vault/documents-and-signing`: the custody agreement prints
  the grader, grade and cert as they stood when the packet was prepared
- `grade10-site/vault/case-lifecycle`: starting the valuation registers the
  item; vaulting, release, unwind and forfeit open and close its hold;
  preparing documents is refused while the register names another owner;
  a forfeit moves the item to the lender
- `grade10-site/vault/case-intake`: the request wizard offers the register's
  ten categories
- `shared/auth/roles`: the vocabulary gains `inventory:transfer`, and staff
  and admin hold it

## Impact

- **Inventory worker** - `packages/inventory/backend` and
  `packages/inventory/contracts`: the register, its entrypoint for the vault,
  the console's reads and acts, the proof documents, the erasure router
- **Inventory console** - `packages/inventory/admin-frontend`: Items, one
  item, the move and retire dialogs
- **Vault worker** - `packages/vault/backend`: registration at the start of
  valuation, the hold at custody, the backfill, the facts on the custody
  agreement, the forfeit's owner move
- **Vault console and collector SPA** - `packages/vault/admin-frontend`: the
  item's facts on the Case tab, the known-slab lookup at the walk-in, the
  items section of the collector page; `packages/vault/frontend`: ten
  categories in the wizard
- **Auth** - `packages/grade10-auth/contracts`: the new grant, the role table
  and the generated roles
- **This store** - `packages/i18n` gains the four new category words and the
  register's console words; no `@grade10/ui` export changes, since the
  register's pages compose the console blocks
- **Beside this change** - `vault-walk-ins-and-owners` opens the walk-in, the
  owner names and the collector page this change adds to, so the vault deltas
  wait for it; `fix-roles-spec-divergence` writes the vocabulary table the
  new grant joins; `add-card-grading`'s own spec line on where a valuation
  reads the grade is corrected by the change that next moves grading

## Follow-on changes

- Selling a vaulted item at auction, the item held by the vault and the
  auction at once, and the vault moving an owner under its hold
- Items of any category through grading
- A notice to both owners when an item moves
- Merging two records of one item

## Open questions

- **Legal** - which entity a shop purchase or a gift names; recommended: the
  custodian, and the lender only through a forfeit. A ❓ on
  [Items · Owners](../../../docs/prds/products/grade10-admin/inventory/items.md#owners)
  and `decisions.md` Q14
- **The author's handle** - `@brianchacha6969` has no row in `team.yaml`

## References

- [Items · Owners](../../../docs/prds/products/grade10-admin/inventory/items.md#owners)
- [Items · Facts](../../../docs/prds/products/grade10-admin/inventory/items.md#facts)
- [Items · Holds](../../../docs/prds/products/grade10-admin/inventory/items.md#holds)
- [Items · Moving an Item](../../../docs/prds/products/grade10-admin/inventory/items.md#moving-an-item)
- [Items · Retiring an Item](../../../docs/prds/products/grade10-admin/inventory/items.md#retiring-an-item)
- [Items · Finding an Item](../../../docs/prds/products/grade10-admin/inventory/items.md#finding-an-item)
- [Items · Erasure](../../../docs/prds/products/grade10-admin/inventory/items.md#erasure)
- [Items · Permissions](../../../docs/prds/products/grade10-admin/inventory/items.md#permissions)
- [The Submission · The Record After Collection](../../../docs/prds/products/grade10-site/grading/submission.md#the-record-after-collection)
- [Operator Console · Queue](../../../docs/prds/products/grade10-site/vault/operator-console.md#queue)
- [Operator Console · One case](../../../docs/prds/products/grade10-site/vault/operator-console.md#one-case)
- [Operator Console · Physical vault](../../../docs/prds/products/grade10-site/vault/operator-console.md#physical-vault)
- [Documents and Signing · Document terms](../../../docs/prds/products/grade10-site/vault/documents-and-signing.md#document-terms)
- [Collector Pages · Request wizard](../../../docs/prds/products/grade10-site/vault/collector-pages.md#request-wizard)
- [Case Lifecycle · Item Record](../../../docs/prds/products/grade10-site/vault/case-lifecycle.md#item-record)
- [Collector Page · The Page](../../../docs/prds/products/grade10-admin/console/collector-page.md#the-page)
- [Roles and Permissions](../../../docs/prds/products/shared/auth/roles.md)
- [Account Data · Erasure](../../../docs/prds/platform/account-data.md#erasure)
