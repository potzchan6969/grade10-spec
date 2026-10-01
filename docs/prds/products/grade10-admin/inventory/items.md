---
title: Items
spec: grade10-admin/inventory/items
order: 2
---

An item is one physical thing the house knows about, graded or not, with one
owner: a collector's slab in the vault, a watch kept for storage, a coin the
company owns. Stock counts units of a product; an item is one object.

## Values

| Rule | Value |
| --- | --- |
| Owner | one account, or one of the company's two entities: the custodian or the lender, or no one once the owner is erased |
| Category | trading card, comic, coin, banknote, stamp, bullion, watch, jewellery, memorabilia, other |
| Grader | PSA, BGS, CGC, SGC, TAG, PCGS, NGC, PMG, or none |
| Grade | as printed on the slab; only with a grader |
| Cert | as printed on the slab, trimmed and in capitals; one item per grader and cert |
| Title | at most **200** characters |
| Description | at most **2,000** characters |
| Proof of a move | optional; up to **5** PDF, PNG or JPG files, each at most **10 MB** |
| Retired because | duplicate · lost · destroyed · left the platform |

## Owners

- 🚧 **One owner** - an item belongs to one account, or to the custodian or
  the lender under their registered names, or to no one once the owner is
  erased -
  [Documents and Signing](/p/grade10-site/vault/documents-and-signing#document-terms)
- 🚧 **Owner by name** - staff and admins, behind `kyc:read`, read the
  owner's name here; each read is on the audit chain; where the name cannot
  be read the page shows the short id and "name unavailable" and still opens
- 🚧 **A collector's items** -
  [Collector Page](/p/grade10-admin/console/collector-page#sections)
- 🚧 **Owner of a bought or gifted item** - the custodian; the lender only
  through a forfeit

## Facts

- 🚧 **What an item says** - category, title, description, grader, grade
  and cert; any other fact goes in the description
- 🚧 **Graded or not** - an item with no grader carries no grade and no
  cert; a slab from a grader not listed has no grader, and its grader, grade
  and cert go in the description
- 🚧 **One slab, one item** - a grader and cert name one item until it is
  retired; typing a known grader and cert finds that item rather than adding
  a second
- 🚧 **Register and edit** - staff add an item and edit its facts on the
  console; the item shows who changed it last and when

## Marks

A place keeping an item puts its mark on the item: in this release the vault
is the only place. Marked or not is read from the places; staff only close a
mark the vault no longer has.

- 🚧 **The vault registers** - an item gets its record when staff start the
  vault valuation, and carries the vault's mark from the day it is vaulted
  until it is released, unwound or forfeited -
  [Case Lifecycle](/p/grade10-site/vault/case-lifecycle#exits)
- 🚧 **The place decides** - the register never refuses what the vault has
  already done; where the vault and the register disagree on the owner, the
  item's page shows staff both owners
- 🚧 **Items already in the vault** - every case that reached custody, and
  every open case past the start of its valuation, appears as an item under
  its collector, marked while the item is in the vault; an erased collector's
  case is left out, a forfeited case's item
  belongs to the lender, and staff retire a second record of one object when
  they find it
- 🚧 **A mark left open** - staff close a mark the vault no longer has, with
  a reason; a later word from the vault does not reopen it; offered only
  while the vault reads the item as no longer held

## Moving an Item

- 🚧 **Transfer** - a staff member or an admin moves an item no place marks
  to any account, named by its exact email, or to the custodian, with a
  reason and, where there is one, a proof document; an item whose owner was
  erased moves the same way; the item shows each move, who made it and when,
  and the audit log records it
- 🚧 **Refused while marked** - a transfer is refused while a place marks
  the item, naming the place
- 🚧 **Forfeit** - a forfeited vault item belongs to the lender from the
  moment the vault closes its mark; nobody transfers it by hand, and a
  transfer never names the lender
- 🚧 **Proof** - opened only by those who may transfer, and each opening is
  on the audit log

## Retiring an Item

- 🚧 **Retire** - staff retire an item as a duplicate, lost, destroyed or
  left the platform; refused while a place marks it
- 🚧 **After retiring** - the item reads only, keeps its history and leaves
  the default list, and its grader and cert may name a new item; staff
  restore a retired item with a reason, refused while its cert names a live
  item

## Finding an Item

- 🚧 **Default list** - marked items; staff switch to every item or to
  retired ones
- 🚧 **Search** - by title or description, by grader and cert, by item id,
  or by the owner's exact email; never by an owner's name - a click on a name opens the
  collector page

## Erasure

- 🚧 **Refused while marked** - the ask to be forgotten is refused while a
  place marks an item the person owns -
  [Account Data](/platform/account-data#erasure)
- 🚧 **Items they own** - the owner is removed, the title reads as erased,
  and the description goes
- 🚧 **The object's facts** - category, grader, grade and cert stay once the
  owner is erased; they describe the object
- 🚧 **Moves they were part of** - their side and the reason go; a proof
  stays while the other party is the custodian, the lender or a live
  account, and is flagged for review **2,555** days after the move

## Permissions

| Grant | Roles | Opens |
| --- | --- | --- |
| `inventory:read` | staff, admin | Items, one item, a collector's items |
| `kyc:read` | staff, admin | the owner's name on Items, one item and a collector's items |
| `inventory:write` | staff, admin | add an item, edit its facts, retire or restore it, close a mark left open |
| `inventory:transfer` | staff, admin | move an item, open a proof |

- 🚧 **The new grant** - `inventory:transfer`, held by staff and admin
- **The treasurer** - holds none of the four above

:::detail{title="Code map" for="engineer"}
- **Worker** - `packages/inventory/backend`
- **Vocabulary** - categories and graders in `packages/inventory/contracts`
- **Console** - `packages/inventory/admin-frontend`
- **Architecture** -
  [vault.md](https://github.com/9gag/grade10/blob/main/docs/architecture/vault.md),
  [cross-service.md](https://github.com/9gag/grade10/blob/main/docs/architecture/cross-service.md)
:::

:::detail{title="Product decisions" for="pm"}
Nothing records who owns a physical thing across the house. The vault knows
the collector on each case, grading knows the submission, and stock counts
units of a product; none can say who owns one slab, where it has been, or
move it to a new owner with a trace.

**Users.** Staff and admins on the console. Collectors do not see the
register; their vault case and their grading submission stay their pages.

**Not in scope.** Values, photographs or locations on an item; the
catalogue's attributes on an item; an item the auction or grading marks;
moving a vaulted item to a new owner; telling either owner of a move; search
by name; merging two items; linking an item to catalogue stock.

**Measurement.** Items in custody with no record, held at zero; moves
recorded with who and why; marks closed by hand, expected near zero.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Where the record lives | Decided | The inventory service, in tables of its own; one object with one owner is not a stock count, so not the catalogue | Product |
| Who owns what, outside the vault | Decided | The map of which account owns which item sits in the shared database, outside the vault's own. It holds no values, photographs, locations, loan terms or amounts, and a mark ends with a neutral reason; a forfeited item's move to the lender is the one signal that cannot be hidden. Revisit if the register ever stores a value, a photograph or a location, or Legal names a duty | Product |
| The place decides | Decided | A place commits its own fact first and the register mirrors it, never refusing it; a disagreement is recorded, not refused | Product |
| Two places at once | Decided | One item may carry the vault's mark and the auction's at the same time; the auction arrives with its own change | Product |
| A vaulted item changing owner | Decided | Refused in this release; the vault moves an owner when a vaulted item is sold, with that change | Product |
| Transfer notice | Decided | No email to either owner; the item's moves and the audit log hold it | Product |
| Proof after erasure | Decided | Kept while the other party is the custodian, the lender or a live account, so the remaining owner keeps the record of how it got the item | Product |
| Search by name | Decided | None; exact email, cert, title or description, item id or a click on a name | Product |
| Grading's slab and the catalogue | Decided | A collector's slab never enters the catalogue; the vault values it from this register - [The Submission](/p/grade10-site/grading/submission#the-record-after-collection) | Product |
| Owner of a bought or gifted item | Decided | The custodian; the lender only through a forfeit; Legal confirms | Legal |
:::
