# grade10-admin/inventory/items Specification

## Purpose

The item register on the console: one record per physical thing the house
knows, graded or not, who owns it, which place keeps it, and every move of
its owner.

Stock counts units of a product; an item is one object. A place keeping an
item marks it and the register mirrors what the place has done; in this
release the vault is the only place (`grade10-site/vault/case-lifecycle`).

## Feature set

- What an item says
  - Ten categories: a closed list, so every item reads in every language
  - Graded or not: grader, grade and cert only on a slab from a listed
    grader, and anything else in the description
  - One slab, one item: a grader and cert name one live item, and typing a
    known pair finds it rather than adding a second
  - Register and edit: staff add an item under its owner and correct its
    facts, and the item shows who changed it last and when
- Who owns an item
  - One owner: an account, the custodian or the lender, or no one once the
    owner is erased
  - Owner by name: read from the account at each read behind the identity
    grant, the short id where the name cannot be read
  - Bought or gifted: the custodian; the lender only through a forfeit
- Marks from places
  - The place decides: a place's fact is mirrored and never refused
  - The vault's mark: registered when the valuation starts, marked from
    vaulting until release, unwind or forfeit
  - Owners that disagree: recorded on the item and shown to staff
  - A mark left open: staff close it with a reason while the vault no longer
    holds the item, and a later word does not reopen it
  - Items already in the vault: every case that reached custody registered
    once
- Moving an item
  - Transfer: to an account by its exact email or to the custodian, with a
    reason and an optional proof, traced on the item and the audit log
  - Refused while marked: naming the place that marks it
  - Forfeit to the lender: the vault's closing word moves it, never a staff
    move
  - Proof: opened only by those who may move an item, each opening audited
- Retiring an item
  - Four reasons: duplicate, lost, destroyed, left the platform; refused
    while marked
  - After retiring: read only, its cert free for a new item, restored with a
    reason while no live item holds its cert
- Finding an item
  - Three lists: marked by default, every item, retired
  - One search: the owner's exact email, an item id, a grader and cert, else
    title or description; never a name
  - A collector's items: their section on the collector page, every live item
    they own
- Erasure
  - Refused while marked: the erasure checklist names each marked item
  - The person goes: the owner, the title, the description and their side of
    each move
  - The object stays: category, grader, grade and cert
  - Proof kept: while the other party remains, for at most 2,555 days from the
    move
- Who may act
  - Four grants: inventory read, write and transfer, and the identity read for
    names; the treasurer holds none
