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
zero after the backfill; ownership moves recorded with who, why and when
(none are recorded today).

## What Changes

- **An item register** - one record per physical thing, graded or not, owned
  by an account or by one of the company's two entities, the custodian or the
  lender, carrying its category from a closed list of ten, title,
  description, grader, grade and cert
- **Staff find who has what** - Items and one item's page on the console,
  searched by title or description, by grader and cert, by item id or by
  the owner's exact email, opening on the items a place marks, the owner
  shown by name
- **Marked or not is read from the places** - a place keeping an item puts
  its mark on it; in this release the vault is the only place. The register
  mirrors what the vault has already done and never refuses it; a
  disagreement on the owner is shown to staff, and staff close a mark the
  vault no longer has
- **The vault registers what it takes in** - an item is registered when staff
  start its valuation and is marked from vaulting until release, unwind or
  forfeit; every case that already reached custody is registered once, and
  staff retire a second record of one object when they find it
- **Grader, grade and cert reach the vault** - on the case's valuation; the
  Case tab and the custody agreement show the register's facts, and the
  collector's request stays as they sent it; a walk-in bringing a slab the
  register knows finds it by grader and cert rather than typing it again, and
  the customer's edits to that draft touch only its photos and description.
  This delivers carry-grade-into-vault-case, the follow-on `add-card-grading`
  names
- **Staff move an item to a new owner** - any account or the custodian,
  never the lender, with a reason and an optional proof document, traced on
  the item and the audit log; an item whose owner was erased moves the same
  way; refused while a place marks the item, naming the place
- **Forfeit moves the item to the lender** - when the vault closes its mark,
  never by a staff move
- **Retire** - a duplicate, a lost or destroyed item, or one that left the
  platform; the item reads only after it, and staff restore it with a
  reason while no live item holds its cert
- **A collector's items** - their own section on the collector page, every
  item they own but a retired one
- **Erasure reaches the register** - inventory answers the erasure checklist,
  refusing while a place marks an item the person owns
- **A grant to move items** - `inventory:transfer`, held by staff and admin;
  the treasurer holds none of the register's grants
- **Grading's Q82, changed** - a collector's slab still never enters the
  catalogue; a vault valuation reads grader, grade and cert from the register,
  superseding the second half of `add-card-grading`'s Q82

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- `grade10-admin/inventory/items`: the register on the console - what an item
  says, who owns it, finding it, registering and editing it, moving it,
  retiring it, a collector's items, and erasure; and how a place tells the
  register what it keeps - a mark opened and closed by the place, mirrored
  and never refused, a disagreement recorded, the owner moved by a place's
  closing word, and staff closing a mark left open

### Modified Capabilities

- `grade10-admin/vault/operator-queue`: the Case tab reads and edits the
  register's category, title, description, grader, grade and cert once the
  item is registered; a walk-in finds a slab the register already knows by
  grader and cert
- `grade10-site/vault/valuation-and-offer`: a valuation is read beside the
  item's grader, grade and cert
- `grade10-site/vault/documents-and-signing`: the custody agreement prints
  the register's category, title and description, with the grader, grade and
  cert, as they stood when the packet was prepared
- `grade10-site/vault/case-lifecycle`: starting the valuation registers the
  item; vaulting, release, unwind and forfeit open and close its mark;
  preparing documents is refused while the register names another owner;
  a forfeit moves the item to the lender
- `grade10-site/vault/case-intake`: the request wizard offers the register's
  ten categories; on a draft staff opened with a known slab, the collector
  changes only the photos and the description
- `shared/auth/roles`: the vocabulary gains `inventory:transfer`, and staff
  and admin hold it

## Impact

- **Inventory worker** - `packages/inventory/backend` and
  `packages/inventory/contracts`: the register, its entrypoint for the vault,
  the console's reads and acts, the proof documents, the erasure router
- **Inventory console** - `packages/inventory/admin-frontend`: Items, one
  item, the move and retire dialogs
- **Vault worker** - `packages/vault/backend`: registration at the start of
  valuation, the mark at custody, the backfill, the facts on the custody
  agreement, the forfeit's owner move
- **Vault console and collector SPA** - `packages/vault/admin-frontend`: the
  item's facts on the Case tab, the known-slab lookup at the walk-in, the
  items section of the collector page; `packages/vault/frontend`: ten
  categories in the wizard
- **Auth** - `packages/grade10-auth/contracts`: the new grant, the role table
  and the generated roles
- **This store** - `packages/i18n` gains the four new category words
  (comic, banknote, stamp, memorabilia); the register's console words are the
  console's own English; no `@grade10/ui` export changes, since the
  register's pages compose the console blocks
- **Beside this change** - `vault-walk-ins-and-owners` opens the walk-in, the
  owner names and the collector page this change adds to, so the vault deltas
  wait for it; `fix-roles-spec-divergence` writes the vocabulary table the
  new grant joins; `add-card-grading`'s own spec line on where a valuation
  reads the grade is corrected by the change that next moves grading;
  `complete-vault-collector-flow`, implemented, archives before this change,
  since both fold case-intake's "A request states one item"

No domain impact: `shared/auth/domain-tcs.md` traces `shared-auth-roles-US-02`,
and neither of its cases walks an inventory grant; the new grant is walked
in the roles suite.

No domain impact: `grade10-site/vault` has no domain suite, and the path this
change lays across four of its capabilities - registered at the valuation,
named on the agreement, marked at vaulting, moved to the lender at a forfeit -
is walked whole from the register's side in the items suite.

## Open questions

- **Legal** - a shop purchase or a gift names the custodian, and the lender
  only through a forfeit (`decisions.md` Q14); erasure keeps an erased
  owner's item category, grader, grade and cert (`decisions.md` Q38); both
  taken as recommended at landing, and Legal confirms the rows
- **Product** - whether the fill also registers open cases past Start
  valuation, whether a hand close on a forfeited case moves the item to the
  lender, whether the All tab lists retired items, what happens when the
  vault marks an item retired after its valuation, and whether the loan
  agreement and the release receipt print the register's facts
  (`decisions.md` Q52, Q53, Q55 to Q57), each with a recommendation
- **Design** - Items is a detail page of Inventory, reached from its header,
  and only one item's page shows when it was last edited (`decisions.md` Q41
  and Q42); the boards, the search hint and when the walk-in lookup runs are
  `ui-design.md`'s flags

## References

- [Inventory · Items](../../../docs/prds/products/grade10-admin/inventory/index.md#items)
- [Items · Owners](../../../docs/prds/products/grade10-admin/inventory/items.md#owners)
- [Items · Facts](../../../docs/prds/products/grade10-admin/inventory/items.md#facts)
- [Items · Marks](../../../docs/prds/products/grade10-admin/inventory/items.md#marks)
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
- [Collector Page · Sections](../../../docs/prds/products/grade10-admin/console/collector-page.md#sections)
- [Roles and Permissions](../../../docs/prds/products/shared/auth/roles.md)
- [Account Data · Erasure](../../../docs/prds/platform/account-data.md#erasure)
