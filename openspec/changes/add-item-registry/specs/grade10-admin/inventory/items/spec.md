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
- Moving an item
  - Transfer: to an account by its exact email or to the custodian, with a
    reason and an optional proof, traced on the item and the audit log
  - Refused while marked: naming the place that marks it
  - Same owner: Transfer waits while the new owner is the present one
  - An erased owner: moved the same way, with a new title
  - Forfeit to the lender: the vault's closing word or a hand close on a
    forfeited case moves it, never a staff move
  - Proof: opened only by those who may move an item, each opening audited
- Retiring an item
  - Four reasons: duplicate, lost, destroyed, left the platform; refused
    while marked
  - After retiring: read only, its cert free for a new item, restored with a
    reason while no live item holds its cert
- Finding an item
  - Three lists: marked by default, every live item, retired
  - One search: the owner's exact email, an item id, a grader and cert, else
    title or description, over every item whatever the tab; never a name
- Erasure
  - Refused while marked: the erasure checklist names each marked item
  - The person goes: the owner, the title, the description and their side of
    each move
  - The object stays: category, grader, grade and cert
  - Proof kept: while the other party remains, flagged for review at the
    brand's agreements window and never deleted by the clock; not counted as
    remaining on the checklist
- Who may act
  - Four grants: inventory read, write and transfer, and the identity read for
    names; the treasurer holds none
  - Audit: every act on the log by its ids, never an email, a search term or
    a reason's text

## ADDED Requirements

### Requirement: An item is one object, and says what it is in fixed facts

The register SHALL keep one record per physical object the house knows,
graded or not, apart from the catalogue's stock: registering, editing, moving
or retiring an item SHALL add, change or count no product and no unit of
stock. An item SHALL carry exactly these facts:

| Fact | Rule |
| --- | --- |
| Category | one of: trading card, comic, coin, banknote, stamp, bullion, watch, jewellery, memorabilia, other |
| Title | required, at most 200 characters |
| Description | optional, at most 2,000 characters; every other fact about the object |
| Grader | none, or one of: PSA, BGS, CGC, SGC, TAG, PCGS, NGC, PMG |
| Grade | as printed on the slab; required with a grader, and absent without one |
| Cert | as printed on the slab, trimmed and put in capitals wherever it is typed; required with a grader, and absent without one |
| Owner | one account, the custodian, the lender, or no one once the owner is erased |

- **A grader not listed** - a slab from any other grader SHALL be registered
  with no grader, and its grader, grade and cert written in the description.
- **Nothing else** - an item SHALL carry no value, photograph, location, loan
  term, amount or catalogue attribute.
- **Grade10 only** - the register SHALL serve the Grade10 console alone.

#### Scenario: grade10-admin-inventory-items-SC-01 - A slab registers with its grader, grade and cert
**Serves:** grade10-admin-inventory-items-US-02 - staff add a graded slab as it is printed

- **WHEN** staff register a trading card with grader PSA, grade `10` and cert ` 12345678x `
- **THEN** the item reads PSA, `10` and cert `12345678X`

#### Scenario: grade10-admin-inventory-items-SC-02 - An item with no grader carries no grade and no cert
**Serves:** grade10-admin-inventory-items-US-02 - staff add a watch nobody graded

- **GIVEN** the register dialog with a grader chosen and a grade and cert typed
- **WHEN** staff clear the grader
- **THEN** the grade and cert are cleared and hidden
- **AND** a register sent with a grade or a cert and no grader is refused by name

#### Scenario: grade10-admin-inventory-items-SC-03 - A grader not listed is written in the description
**Serves:** grade10-admin-inventory-items-US-02 - staff add a slab from a grader the list does not hold

- **WHEN** staff read the register dialog's description field
- **THEN** it says a grader not listed, its grade and its cert go in the description
- **AND** the grader field offers only the eight listed graders, and the category field only the ten categories

#### Scenario: grade10-admin-inventory-items-SC-04 - A title or a description past its cap is refused
**Serves:** grade10-admin-inventory-items-US-02 - staff learn the limit before the item is saved

- **WHEN** staff register an item with a title of 201 characters, and again with a description of 2,001
- **THEN** each is refused by name with its limit, and no item is registered
- **AND** a title of 200 characters and a description of 2,000 are taken

#### Scenario: grade10-admin-inventory-items-SC-05 - An item is never stock
**Serves:** What an item says - every register act leaves the catalogue's counts as they were

- **WHEN** an item is registered, edited, moved and retired
- **THEN** no product is created and no unit of stock is added, reserved or counted
- **AND** the item carries no value, photograph, location or catalogue attribute

#### Scenario: grade10-admin-inventory-items-SC-06 - The ZZZ console has no register
**Serves:** What an item says - the register is the Grade10 console's

- **WHEN** an operator opens the ZZZ console
- **THEN** it offers no Items and no item page

### Requirement: One slab is one live item

A grader and cert SHALL name at most one item that is not retired. Registering
or editing an item onto a grader and cert a live item already holds SHALL be
refused by name, naming and linking that item, so staff open it instead of
adding a second. A retired item's grader and cert SHALL be free for a new
item.

#### Scenario: grade10-admin-inventory-items-SC-07 - A known slab is found, not registered twice
**Serves:** grade10-admin-inventory-items-US-02 - staff type a slab the register already holds

- **GIVEN** a live item with grader PSA and cert `12345678`
- **WHEN** staff register a new item with grader PSA and cert `12345678`
- **THEN** it is refused, and the dialog says this grader and cert are already on that item's title, linking it
- **AND** no second item exists

#### Scenario: grade10-admin-inventory-items-SC-08 - An edit onto a known slab is refused
**Serves:** grade10-admin-inventory-items-US-02 - staff correct a cert to one another item holds

- **GIVEN** two live items, one with PSA `111` and one with PSA `222`
- **WHEN** staff edit the second item's cert to `111`
- **THEN** it is refused, naming and linking the first item, and the second keeps `222`

#### Scenario: grade10-admin-inventory-items-SC-09 - A retired slab's cert names a new item
**Serves:** grade10-admin-inventory-items-US-05 - staff register the slab again after retiring a wrong record

- **GIVEN** a retired item with PSA `12345678`
- **WHEN** staff register a new item with PSA `12345678`
- **THEN** the new item is registered and the retired one keeps its facts and history

### Requirement: Staff register an item and correct its facts

A holder of `inventory:write` SHALL register an item and edit its facts:

1. Open Register an item from the Items header.
2. Give the category, title, description, grader and, with a grader, the grade
   and cert, and the owner: an account named by its exact email, or the
   custodian. An email no account holds keeps Register from being sent.
3. Register; the new item opens on its own page.
4. Edit later from the item's page: the same facts, with the owner read-only,
   since the owner changes only by a transfer.

- **Last edited** - one item's page SHALL show who changed its facts last and
  when; the Items list SHALL show no last-edited column.
- **While marked** - Edit SHALL be offered whether or not a place marks the
  item; only Transfer and Retire wait on the mark.
- **Without the grant** - an operator without `inventory:write` SHALL be
  offered no Register, Edit, Retire, Restore or Close mark, and the worker
  SHALL refuse each by name.
- **Sending** - a dialog sending an act SHALL lock its fields until the answer
  arrives, and SHALL show a refusal in its own footer, keeping what was typed.

#### Scenario: grade10-admin-inventory-items-SC-10 - An item is registered under an account by its exact email
**Serves:** grade10-admin-inventory-items-US-02 - staff add an item a collector owns

- **GIVEN** an account with the email `ana@example.com` and the name Ana Wong
- **WHEN** staff open Register an item
- **THEN** it asks for the category, title, description, grader and owner, and Register is disabled until a category, a title and an owner are given
- **WHEN** staff type `ana@example.com` as the owner
- **THEN** the field shows Ana Wong beneath it
- **WHEN** staff give a category and a title and register
- **THEN** the item opens on its own page under Ana Wong

#### Scenario: grade10-admin-inventory-items-SC-11 - An email no account holds is not an owner
**Serves:** grade10-admin-inventory-items-US-02 - staff mistype the owner's address

- **WHEN** staff type an owner email no account holds
- **THEN** the field says no account has that email and Register stays disabled
- **AND** a register sent with that email is refused by name

#### Scenario: grade10-admin-inventory-items-SC-12 - An edit shows who made it and when, on the item alone
**Serves:** grade10-admin-inventory-items-US-02 - staff correct a title another member of staff typed

- **GIVEN** an item registered yesterday by one member of staff
- **WHEN** another member of staff edits its title
- **THEN** the item's page shows the new title, who edited it and when
- **AND** the Items list shows no last-edited column

#### Scenario: grade10-admin-inventory-items-SC-13 - Editing never changes the owner
**Serves:** grade10-admin-inventory-items-US-02 - staff correct the facts of an item somebody owns

- **WHEN** staff open Edit on an item
- **THEN** the owner reads as a line of text and offers no field
- **AND** an edit naming another owner is refused by name

#### Scenario: grade10-admin-inventory-items-SC-14 - An operator who may only read changes nothing
**Serves:** grade10-admin-inventory-items-US-02 - a reader of the register is not offered its acts

- **GIVEN** an operator holding `inventory:read` and not `inventory:write`
- **WHEN** they open Items and one item
- **THEN** no Register, Edit, Retire, Restore or Close mark is offered
- **AND** each, sent anyway, is refused by name

#### Scenario: grade10-admin-inventory-items-SC-15 - A dialog locks while it sends and keeps what was typed on a refusal
**Serves:** grade10-admin-inventory-items-US-02 - staff are told why an act did not land without losing their typing

- **GIVEN** staff sending a register the worker will refuse
- **WHEN** the act is in flight
- **THEN** the dialog's fields are locked
- **WHEN** the refusal arrives
- **THEN** it shows in the dialog's footer and every field keeps what was typed

### Requirement: An item has one owner, read by name

An item SHALL have one owner: an account, the custodian, the lender, or no
one once the owner is erased.

- **By name** - for an operator holding `kyc:read`, an account owner SHALL be
  read by the account's name from the account itself at each read, never
  copied into the register, and each read naming owners SHALL be on the audit
  log with who read which owners.
- **Name unavailable** - where the name cannot be read, or the operator does
  not hold `kyc:read`, the owner SHALL read as the account's short id and
  "name unavailable", and the page SHALL still open.
- **The company** - the custodian and the lender SHALL read by their
  registered names.
- **Erased** - an item whose owner was erased SHALL read as erased.
- **To the collector** - a click on an account owner's name SHALL open that
  collector's page.

#### Scenario: grade10-admin-inventory-items-SC-16 - The owner is read by name, and the read is recorded
**Serves:** grade10-admin-inventory-items-US-01 - staff answer who owns an object by name

- **GIVEN** an item owned by Ana Wong's account
- **WHEN** staff holding `kyc:read` open the item
- **THEN** the owner reads Ana Wong, and a click on the name opens her collector page
- **AND** the audit log records who read that item's owner

#### Scenario: grade10-admin-inventory-items-SC-17 - A name that cannot be read leaves the row standing
**Serves:** grade10-admin-inventory-items-US-01 - staff still find the item when the account cannot be read

- **GIVEN** a page of items whose owners' names the account service cannot answer
- **WHEN** staff read Items
- **THEN** each owner reads as its short id and "name unavailable", and every row is shown
- **AND** an operator without `kyc:read` reads the same short id for every account owner

#### Scenario: grade10-admin-inventory-items-SC-18 - The company's items read by its registered names
**Serves:** grade10-admin-inventory-items-US-01 - staff tell the custodian's stock from a forfeited item

- **GIVEN** one item owned by the custodian and one by the lender
- **WHEN** staff read Items
- **THEN** each owner reads as that entity's registered name

#### Scenario: grade10-admin-inventory-items-SC-69 - An owner whose name cannot be read can still be named
**Serves:** grade10-admin-inventory-items-US-02 - staff register an item while the account's name cannot be read

- **GIVEN** an account with the email `ana@example.com` whose name cannot be read
- **WHEN** staff type `ana@example.com` as the owner
- **THEN** the field shows the account's short id and "name unavailable", and Register is enabled

### Requirement: An item the company buys or is given belongs to the custodian

An item the company buys or is given SHALL be registered under, or moved to,
the custodian. The lender SHALL come to own an item only through a forfeit:
no staff register or transfer SHALL name the lender.

#### Scenario: grade10-admin-inventory-items-SC-19 - Staff can name the custodian and never the lender
**Serves:** grade10-admin-inventory-items-US-02 - staff record a slab the shop bought over the counter

- **WHEN** staff choose a company owner on Register or on Transfer
- **THEN** the custodian is offered and the lender is not
- **AND** a register or transfer naming the lender is refused by name

### Requirement: A place's word is mirrored and never refused

A place keeping an item tells the register what it has already done, and the
register SHALL apply it without refusing it. In this release the vault is the
only place, and it tells the register where each case stands:

| The vault's case | The register |
| --- | --- |
| Valued, not yet in custody | records the item under the case's collector with the facts the vault named, unless the item already exists |
| In custody | also opens the vault's mark for that case, recording the owner the vault named |
| Custody ended | also closes the vault's mark for that case; where the case was forfeited, moves the item to the lender |

- **Once** - a word told again, or one the register is already past, SHALL
  change nothing.
- **Marked or not** - an item SHALL read as marked while any place's mark on
  it is open, read from the marks and never stored.
- **Several marks** - a mark SHALL be opened beside any other open mark on
  the item.
- **A neutral end** - a closed mark SHALL record who closed it and when, and
  SHALL read the same whether the vault released, unwound or forfeited it.
- **A known cert** - a registered word naming a grader and cert a live item
  already holds SHALL register the item without them, and the item's page
  SHALL show staff the slab the vault named and the item that holds it.
- **The register's word** - every surface SHALL call a place's keeping a
  mark.

#### Scenario: grade10-admin-inventory-items-SC-20 - A word told twice lands once
**Serves:** Marks from places - a word the vault repeats after a lost answer

- **GIVEN** the vault's word that it marked an item, already applied
- **WHEN** the same word arrives again
- **THEN** the item still has one open mark and nothing else changed

#### Scenario: grade10-admin-inventory-items-SC-21 - A second mark opens beside the first
**Serves:** Marks from places - the register lets two keepers hold one object

- **GIVEN** an item the vault marks for one case
- **WHEN** the vault marks the same item for another case
- **THEN** both marks read open and neither word is refused

#### Scenario: grade10-admin-inventory-items-SC-22 - A slab the vault names under a taken cert is still registered
**Serves:** Marks from places - two counters register one slab before either word lands

- **GIVEN** a live item with PSA `12345678`
- **WHEN** the vault registers another item naming PSA `12345678`
- **THEN** that item is registered with no grader, grade or cert
- **AND** its page shows the slab the vault named and links the item that holds it

#### Scenario: grade10-admin-inventory-items-SC-23 - A closed mark does not say why the vault let go
**Serves:** Marks from places - a reader of the register learns nothing of a loan

- **GIVEN** one item the vault released and one it unwound
- **WHEN** staff read each item's place row
- **THEN** both read as closed by the vault on their day, with no reason

#### Scenario: grade10-admin-inventory-items-SC-24 - A registered item not yet vaulted is not marked
**Serves:** Marks from places - the vault marks from vaulting, not from registration

- **GIVEN** a case whose valuation has started and whose item is not vaulted
- **WHEN** staff read its item
- **THEN** it reads as not marked, and Transfer and Retire are offered

### Requirement: One item's page says which place marks it and whether the owners agree

- **The place row** - a mark SHALL read as the vault, the case's reference
  and the case's status in the collector's word, linking the case. Where the
  vault cannot be read the status SHALL read as unavailable and the row SHALL
  stand.
- **Owners that disagree** - where the owner a place named on its open mark
  is not the item's owner, the page SHALL warn, showing both owners. Once the
  mark closes the item's own owner SHALL stand, with no warning.
- **A marked item** - Transfer and Retire SHALL NOT be offered, and a line
  SHALL name the vault and the case instead.
- **Not marked** - Transfer and Retire SHALL be offered, to the grants that
  hold them.

#### Scenario: grade10-admin-inventory-items-SC-25 - A marked item names its case
**Serves:** grade10-admin-inventory-items-US-01 - staff read which case keeps the object

- **GIVEN** an item the vault marks for case `K7P2QX`, now `active`
- **WHEN** staff open the item
- **THEN** its place row reads the vault, `K7P2QX` and the case's status in the collector's word, linking the case

#### Scenario: grade10-admin-inventory-items-SC-26 - The place row stands when the vault cannot be read
**Serves:** grade10-admin-inventory-items-US-01 - staff still read the item while the vault is down

- **GIVEN** an item the vault marks, and the vault not answering
- **WHEN** staff open the item
- **THEN** the place row names the vault and the case reference, and its status reads unavailable

#### Scenario: grade10-admin-inventory-items-SC-27 - Owners that disagree are both shown
**Serves:** grade10-admin-inventory-items-US-01 - staff see the register and the vault telling two stories

- **GIVEN** an item owned by one account, marked by the vault for a case whose collector is another
- **WHEN** staff open the item
- **THEN** a warning shows the vault's owner and the register's owner

#### Scenario: grade10-admin-inventory-items-SC-70 - The register's owner stands once the vault lets go
**Serves:** grade10-admin-inventory-items-US-01 - staff read who owns the item after the case that disagreed has ended

- **GIVEN** an item owned by one account, marked by the vault for a case whose collector is another
- **WHEN** the vault releases the item and staff open it
- **THEN** it reads not marked, owned by the register's owner, with no warning and no new move

### Requirement: Staff close a mark the vault no longer has

A holder of `inventory:write` SHALL close a place's open mark with a reason,
offered and accepted only while the vault reads that case's item as no longer
held: released, unwound, forfeited or erased.

- **Refused** - while the vault still holds the item, and while the vault
  cannot be asked, the close SHALL be refused by name.
- **Read back** - the place row SHALL name who closed it, when and why; the
  item SHALL read as not marked unless another place still marks it.
- **Final** - a later word from the vault SHALL NOT reopen a mark closed by
  hand.
- **A forfeited case** - a hand close on a case the vault reads as forfeited
  SHALL move the item to the lender, as the next requirement reads.

#### Scenario: grade10-admin-inventory-items-SC-28 - A mark the vault let go of is closed by hand
**Serves:** grade10-admin-inventory-items-US-06 - staff free an item whose release never reached the register

- **GIVEN** an item whose vault case is released and whose mark is still open
- **WHEN** staff choose Close mark
- **THEN** Close mark stays disabled until a reason is typed
- **WHEN** they give the reason and close it
- **THEN** the place row names who closed it, when and why, and the item reads as not marked

#### Scenario: grade10-admin-inventory-items-SC-29 - A mark the vault still holds stays open
**Serves:** grade10-admin-inventory-items-US-06 - staff cannot free an item still in a locker

- **GIVEN** an item whose vault case is `vaulted`
- **WHEN** staff read its place row, and send a close anyway
- **THEN** Close mark is not offered, and the close is refused by name
- **AND** a close sent while the vault cannot be asked is refused by name too

#### Scenario: grade10-admin-inventory-items-SC-30 - The vault's late word does not reopen a hand close
**Serves:** grade10-admin-inventory-items-US-06 - staff close a mark once and it stays closed

- **GIVEN** a mark staff closed by hand
- **WHEN** the vault's word that it marked the item arrives
- **THEN** the mark stays closed by hand

### Requirement: Staff move an item no place marks to its new owner

A holder of `inventory:transfer` SHALL move an item no place marks:

1. Open Transfer on the item's page.
2. Name the new owner: an account by its exact email, or the custodian; never
   the lender.
3. Give a reason, and up to **5** proof files, each a PDF, PNG or JPG of at
   most **10 MB**; a picked file shows its name with a way to remove it.
   Transfer stays disabled until an owner and a reason are given.
4. Transfer; the item's page shows the new owner and the move at the top of
   its moves.

- **The move** - each move SHALL show its from and to owners, who made it,
  when, why, and its proof, or that none was given; an item that never
  changed owner SHALL say so. Every move SHALL be on the audit log.
- **No message** - a move SHALL send nothing to either owner.
- **An erased owner** - an item whose owner was erased SHALL move the same
  way, with a title given in the move, since the erasure cleared it.
- **Refused** - a move SHALL be refused by name on a retired item and to the
  owner the item already has.
- **Same owner** - Transfer SHALL stay disabled while the new owner named is
  the present one, and a same-owner refusal answering a resent transfer SHALL
  read as moved.

#### Scenario: grade10-admin-inventory-items-SC-33 - An item moves to an account with its proof
**Serves:** grade10-admin-inventory-items-US-03 - staff record a sale between two collectors at the counter

- **GIVEN** an item no place marks, owned by Ana Wong
- **WHEN** staff move it to `ben@example.com` with the reason "Sold to Ben at the counter" and one PDF
- **THEN** the item reads Ben Lee as its owner
- **AND** its newest move reads from Ana Wong to Ben Lee, who moved it, when, the reason and the PDF to open
- **AND** the audit log records the move

#### Scenario: grade10-admin-inventory-items-SC-34 - A move with no proof says so
**Serves:** grade10-admin-inventory-items-US-03 - staff record a gift the owner agreed in person

- **WHEN** staff move an item to the custodian with a reason and no proof
- **THEN** the move's proof cell says none was given

#### Scenario: grade10-admin-inventory-items-SC-35 - Transfer waits for an owner and a reason
**Serves:** grade10-admin-inventory-items-US-03 - staff cannot send half a move

- **WHEN** staff open Transfer
- **THEN** it shows the new owner, a reason and an optional proof, and Transfer is disabled
- **AND** it stays disabled until an owner and a reason are both given

#### Scenario: grade10-admin-inventory-items-SC-36 - A proof outside the rule is refused
**Serves:** grade10-admin-inventory-items-US-03 - staff attach the papers they were handed

- **WHEN** staff pick a sixth file, a file of 11 MB, or a GIF
- **THEN** each is refused under the picker, saying up to 5 PDF, PNG or JPG files of at most 10 MB each
- **WHEN** staff pick a 2 MB PNG
- **THEN** its name shows under the picker with a way to remove it

#### Scenario: grade10-admin-inventory-items-SC-37 - A move tells nobody
**Serves:** grade10-admin-inventory-items-US-03 - staff move an item without writing to either owner

- **WHEN** an item moves from one account to another
- **THEN** no email or other message is sent to either owner

#### Scenario: grade10-admin-inventory-items-SC-38 - An item that never moved says so
**Serves:** grade10-admin-inventory-items-US-03 - staff read the moves of an item still with its first owner

- **GIVEN** an item that has never changed owner
- **WHEN** staff open it
- **THEN** its moves say it has not changed owner

#### Scenario: grade10-admin-inventory-items-SC-39 - A move to the present owner is refused
**Serves:** grade10-admin-inventory-items-US-03 - staff send the same move twice

- **GIVEN** an item just moved to Ben Lee
- **WHEN** the same move to Ben Lee is sent again
- **THEN** it is refused by name and the item has one move to Ben Lee

#### Scenario: grade10-admin-inventory-items-SC-73 - A move from an erased owner names a new title
**Serves:** grade10-admin-inventory-items-US-03 - staff move an item whose owner was erased and whose title went with them

- **GIVEN** an item no place marks whose owner was erased
- **WHEN** staff open Transfer
- **THEN** it asks for a title, and Transfer stays disabled until a title, an owner and a reason are given
- **AND** a transfer sent without a title is refused by name, and one with a title moves the item under that title

#### Scenario: grade10-admin-inventory-items-SC-75 - Transfer waits while the new owner is the present one
**Serves:** grade10-admin-inventory-items-US-03 - staff cannot move an item to the owner it already has, and a retry reads as done

- **GIVEN** an item owned by Ben Lee
- **WHEN** staff name `ben@example.com` as the new owner
- **THEN** Transfer stays disabled
- **GIVEN** a transfer to Ana Wong that landed while its answer was lost
- **WHEN** staff send it again and it is refused as the present owner
- **THEN** the dialog reads as moved, and the item shows Ana Wong and one move to her

### Requirement: A move is refused while a place marks the item

While any place marks an item, a transfer SHALL be refused by name, naming the
place and its case, and the item's page SHALL offer no Transfer.

#### Scenario: grade10-admin-inventory-items-SC-40 - A marked item offers no Transfer
**Serves:** grade10-admin-inventory-items-US-04 - staff learn which case keeps an item before they promise to move it

- **GIVEN** an item the vault marks for case `K7P2QX`
- **WHEN** staff open it
- **THEN** Transfer and Retire are not offered, and a line names the vault and `K7P2QX`
- **AND** Edit is still offered

#### Scenario: grade10-admin-inventory-items-SC-41 - A mark landing under an open dialog refuses the move
**Serves:** grade10-admin-inventory-items-US-04 - staff move an item the vault marked after the page was opened

- **GIVEN** staff with Transfer open on an item no place marked when the page opened
- **WHEN** the vault marks the item, and staff then send the transfer
- **THEN** it is refused, naming the vault and the case, and the owner is unchanged

### Requirement: A forfeit moves the item to the lender

When the vault's word ending its mark names the lender, the register SHALL move
the item to the lender in the same act, recorded as a move made by the vault on
that case. Close mark on a case the vault reads as forfeited SHALL do the same
in its own act, recorded as the vault's move on that case, and a later word
from the vault SHALL move nothing once that case has a move. No other act
SHALL move an item to the lender.

#### Scenario: grade10-admin-inventory-items-SC-42 - The forfeit's word moves the item to the lender
**Serves:** Moving an item - the lender comes to own a forfeited item without anybody moving it

- **GIVEN** an item marked by the vault and owned by the case's collector
- **WHEN** the vault ends its mark naming the lender
- **THEN** the mark is closed and the item is owned by the lender
- **AND** its newest move reads from the collector to the lender, made by the vault on that case

#### Scenario: grade10-admin-inventory-items-SC-43 - A hand close on a forfeited case moves the item to the lender once
**Serves:** Moving an item - staff free a stuck mark on a case the vault forfeited

- **GIVEN** an item owned by the collector whose vault case is forfeited and whose mark is still open
- **WHEN** staff close the mark by hand
- **THEN** the place row names who closed it, and the item is owned by the lender, its newest move made by the vault on that case
- **WHEN** the vault's word ending the mark arrives, naming the lender
- **THEN** the mark stays closed by hand and no second move is added

### Requirement: A proof opens only for those who may move an item

A move's proof SHALL be opened only by a holder of `inventory:transfer`, and
each opening SHALL be on the audit log with who opened which proof. Without
the grant, an item's page SHALL offer no Transfer and no proof to open.

#### Scenario: grade10-admin-inventory-items-SC-44 - A proof is opened under the grant and recorded
**Serves:** grade10-admin-inventory-items-US-03 - staff read the papers behind a move

- **GIVEN** a move with a proof
- **WHEN** staff holding `inventory:transfer` open it
- **THEN** the file is shown and the audit log records who opened it

#### Scenario: grade10-admin-inventory-items-SC-45 - Without the grant there is no Transfer and no proof
**Serves:** grade10-admin-inventory-items-US-03 - a reader of the register sees the move and not the papers

- **GIVEN** an operator holding `inventory:read` and not `inventory:transfer`
- **WHEN** they open an item with a proof on a move
- **THEN** no Transfer is offered and the proof cannot be opened
- **AND** a transfer or a proof asked for anyway is refused by name

### Requirement: Staff retire an item and restore it

A holder of `inventory:write` SHALL retire an item no place marks as one of:
duplicate, lost, destroyed, left the platform. Retire SHALL be destructive and
disabled until a reason is chosen, and SHALL be refused by name while a place
marks the item, naming the place.

- **After retiring** - a retired item SHALL read only, showing its reason and
  when; it SHALL keep its history, leave the default list and list under
  Retired with its reason; no Edit, Transfer or Retire SHALL be offered.
- **Restore** - a holder of `inventory:write` SHALL restore a retired item
  with a reason, which the item keeps; a restore SHALL be refused by name
  while a live item holds its grader and cert, naming that item.

#### Scenario: grade10-admin-inventory-items-SC-46 - A duplicate record is retired
**Serves:** grade10-admin-inventory-items-US-05 - staff find one slab registered twice

- **GIVEN** two items for one object, neither marked
- **WHEN** staff choose Retire on the second
- **THEN** it offers duplicate, lost, destroyed and left the platform, and Retire stays disabled until one is chosen
- **WHEN** they retire it as a duplicate
- **THEN** it reads as retired, as a duplicate, with the day, and offers no Edit, Transfer or Retire
- **AND** it leaves the default list and is listed under Retired with its reason

#### Scenario: grade10-admin-inventory-items-SC-47 - A marked item cannot be retired
**Serves:** grade10-admin-inventory-items-US-05 - staff retire an item the vault still keeps

- **GIVEN** staff with Retire open on an item, and the vault marking it after the page opened
- **WHEN** they retire it
- **THEN** it is refused, naming the vault and the case, and the item stays live

#### Scenario: grade10-admin-inventory-items-SC-48 - A retired item is restored with a reason
**Serves:** grade10-admin-inventory-items-US-05 - staff undo a retire made on the wrong record

- **GIVEN** an item retired as lost
- **WHEN** staff restore it with a reason
- **THEN** it reads as live with its facts and history, keeping the reason
- **AND** the audit log records the restore, naming the item and not the reason's text

#### Scenario: grade10-admin-inventory-items-SC-49 - A restore onto a live slab is refused
**Serves:** grade10-admin-inventory-items-US-05 - staff restore a record whose slab was registered again

- **GIVEN** a retired item with PSA `12345678`, and a live item registered since with PSA `12345678`
- **WHEN** staff restore the retired item
- **THEN** it is refused, naming and linking the live item

### Requirement: Staff find an item in three lists and one search

Items SHALL be a page of Inventory, reached from Inventory's header, with a way
back to it from one item's page.

- **Three lists** - Items SHALL open on the items a place marks, and offer
  every live item, marked or not, and the retired items, each paged on a
  cursor.
- **The row** - title, category, grader and cert, the owner, and the place
  marking it, each row opening its item.
- **One search** - one field SHALL read, in order: the owner's exact email,
  an item id, a listed grader followed by a cert, and otherwise a match on
  title or description. A grader and cert SHALL be read in any case and
  trimmed. A search SHALL read every item whatever tab is open, a retired
  match badged retired. No search SHALL read an owner's name.
- **Empty** - a list holding nothing SHALL say so, naming the list; a search
  matching nothing SHALL say so, naming the search, with a way to clear it.
- **Not found** - an item id nobody holds SHALL read as not found.
- **The grant** - without `inventory:read`, Items and one item SHALL name the
  grant they need.
- **Standing alone** - a page or section that is loading SHALL say so, and one
  that fails SHALL show its own error with a retry while the rest of the page
  stands; at phone width a table SHALL scroll in its frame, the header's acts
  SHALL wrap and a dialog SHALL scroll its fields.

#### Scenario: grade10-admin-inventory-items-SC-50 - Items opens on what the places mark
**Serves:** grade10-admin-inventory-items-US-01 - staff open the register on what the shop is keeping

- **GIVEN** three marked items and two that no place marks
- **WHEN** staff open Items from Inventory's header
- **THEN** it lists the three, each with its title, category, grader, cert, owner and the place marking it
- **AND** a row opens its item, whose page leads back to Items

#### Scenario: grade10-admin-inventory-items-SC-51 - Every item and the retired ones are a tab away
**Serves:** grade10-admin-inventory-items-US-01 - staff look past what is marked

- **GIVEN** three marked items, two that no place marks and one retired as lost
- **WHEN** staff switch to every item, then to retired items
- **THEN** the first lists the five live items marked or not, and not the retired one
- **AND** the second lists only the retired item, with lost as why it was retired

#### Scenario: grade10-admin-inventory-items-SC-52 - The owner's exact email finds their items
**Serves:** grade10-admin-inventory-items-US-01 - staff answer a collector at the counter who names their address

- **GIVEN** Ana Wong owning two items
- **WHEN** staff search `ana@example.com`
- **THEN** both items are listed and no other

#### Scenario: grade10-admin-inventory-items-SC-53 - An item id or a grader and cert finds one item
**Serves:** grade10-admin-inventory-items-US-01 - staff read a slab's label or a link they were sent

- **WHEN** staff search an item's id, then `PSA 12345678`, then ` psa 12345678 `
- **THEN** each lists that one item

#### Scenario: grade10-admin-inventory-items-SC-54 - Words search the title and the description, never a name
**Serves:** grade10-admin-inventory-items-US-01 - staff find an object by what it is, not by who owns it

- **GIVEN** an item titled "Rolex Submariner" owned by Ana Wong, and an item whose description says "1999 base set"
- **WHEN** staff search `submariner`, then `base set`, then `Ana Wong`
- **THEN** the first finds the watch, the second finds the card, and the third finds neither by its owner

#### Scenario: grade10-admin-inventory-items-SC-71 - A search reads every item whatever the tab
**Serves:** grade10-admin-inventory-items-US-01 - staff search from the marked tab for an item no place marks

- **GIVEN** an item no place marks titled "Rolex Submariner", and a retired item titled "Submariner box"
- **WHEN** staff on the marked tab search `submariner`
- **THEN** both are listed, and the retired one is badged retired

#### Scenario: grade10-admin-inventory-items-SC-55 - An empty list and an empty search say which
**Serves:** grade10-admin-inventory-items-US-01 - staff tell no items from a search that missed

- **WHEN** staff open a tab holding nothing, and then search for a term nothing matches
- **THEN** the first names the empty tab, and the second names the search and offers to clear it

#### Scenario: grade10-admin-inventory-items-SC-56 - A long list pages
**Serves:** grade10-admin-inventory-items-US-01 - staff page through every item

- **GIVEN** more items than one page holds
- **WHEN** staff read every item and go to the next page
- **THEN** the next page continues where the first ended, with none repeated

#### Scenario: grade10-admin-inventory-items-SC-57 - An unknown id reads as not found
**Serves:** grade10-admin-inventory-items-US-01 - staff open a link to an item nobody holds

- **WHEN** staff open an item page for an id no item has
- **THEN** it reads as not found

#### Scenario: grade10-admin-inventory-items-SC-58 - Without the read grant the register names it
**Serves:** grade10-admin-inventory-items-US-01 - an operator learns which grant they lack

- **GIVEN** an operator without `inventory:read`
- **WHEN** they open Items or one item
- **THEN** each names `inventory:read`

#### Scenario: grade10-admin-inventory-items-SC-59 - A failed read stands alone and retries
**Serves:** grade10-admin-inventory-items-US-01 - staff keep the page while one part of it fails

- **GIVEN** one item's moves failing to load
- **WHEN** staff open the item
- **THEN** its facts and owner stand, and the moves show their error with a retry
- **AND** while a part loads it says so

### Requirement: An erasure reaches the register

Inventory SHALL answer the account erasure checklist.

- **Refused while marked** - an erasure SHALL be refused while a place marks
  an item the person owns, the checklist naming each such item by its id, the
  vault and the case.
- **The person goes** - the owner SHALL be removed and the item read as
  erased; the title SHALL read as erased and the description SHALL go; on each
  move the person was part of, their side and its reason SHALL go; the owner a
  place named on its marks SHALL go.
- **The object stays** - category, grader, grade and cert SHALL stay.
- **Proof** - a move's proof SHALL stay while the other party is the
  custodian, the lender or an account not erased, and SHALL go otherwise,
  the move reading "proof removed"; a kept proof SHALL be flagged for review
  at the brand's agreements window, **2,555** days for Grade10, and SHALL
  never be deleted by the clock.
- **Remaining** - a kept proof SHALL NOT be counted as remaining on the
  erasure checklist.
- **Twice** - an erasure run again SHALL change nothing.

#### Scenario: grade10-admin-inventory-items-SC-63 - An erasure waits while an item is marked
**Serves:** grade10-admin-inventory-items-US-08 - the admin learns which item stops the erasure

- **GIVEN** a person owning an item the vault marks for case `K7P2QX`
- **WHEN** an admin runs their erasure
- **THEN** inventory refuses, and the checklist names the item's id, the vault and `K7P2QX`

#### Scenario: grade10-admin-inventory-items-SC-64 - The person goes and the object stays
**Serves:** grade10-admin-inventory-items-US-08 - the admin erases a collector whose slab the house keeps on record

- **GIVEN** a person owning an item no place marks, PSA `10`, cert `12345678`, titled with their name
- **WHEN** an admin erases them
- **THEN** the item has no owner and reads as erased, its title reads as erased and its description is gone
- **AND** its category, PSA, `10` and `12345678` stay, and Transfer is still offered

#### Scenario: grade10-admin-inventory-items-SC-65 - A move keeps its proof only while the other side remains
**Serves:** grade10-admin-inventory-items-US-08 - the remaining owner keeps the record of how they got the item

- **GIVEN** a person who moved one item to the custodian with a proof, and another to an erased account with a proof
- **WHEN** an admin erases them
- **THEN** both moves lose the person's side and the reason
- **AND** the first keeps its proof and the second reads "proof removed"

#### Scenario: grade10-admin-inventory-items-SC-74 - A kept proof is not left remaining
**Serves:** grade10-admin-inventory-items-US-08 - the admin reads an erasure as done while the custodian keeps its proof

- **GIVEN** a person who moved an item to the custodian with a proof
- **WHEN** an admin erases them
- **THEN** inventory's checklist line reads nothing remaining, and the proof is kept

#### Scenario: grade10-admin-inventory-items-SC-66 - An old proof is flagged, never deleted by the clock
**Serves:** Erasure - the review of what the register keeps after an erasure

- **GIVEN** a kept proof whose move is 2,556 days old
- **WHEN** the retention review runs
- **THEN** the proof is flagged for review and is still there

#### Scenario: grade10-admin-inventory-items-SC-67 - An erasure run twice changes nothing more
**Serves:** Erasure - an admin retries an erasure that answered late

- **GIVEN** a person inventory has already erased
- **WHEN** the erasure runs again
- **THEN** it answers with nothing left and no row changes

### Requirement: Four grants open the register

| Grant | Held by | Opens |
| --- | --- | --- |
| `inventory:read` | staff, admin | Items, one item, a collector's items |
| `kyc:read` | staff, admin | the owner's name wherever an item is read |
| `inventory:write` | staff, admin | register, edit, retire, restore, close a mark |
| `inventory:transfer` | staff, admin | move an item, open a proof |

The treasurer SHALL hold none of the four. What the console offers and what
the worker requires SHALL be one declaration.

#### Scenario: grade10-admin-inventory-items-SC-68 - Staff hold the register's grants and the treasurer none
**Serves:** shared/auth/roles#shared-auth-roles-US-02 - the operator's grants follow the closed vocabulary

- **WHEN** staff and a treasurer each open an item and try to edit, move and retire it
- **THEN** staff are allowed all three
- **AND** the treasurer is refused the item itself, naming `inventory:read`

### Requirement: Every act on the register is on the audit log by its ids

Every act on the register - register, edit, transfer, retire, restore, close
a mark, open a proof, and finding an owner by email - SHALL be on the audit
log with who, when and the item, recording ids, owner kinds, the account an
email found or that none was found, and a retire's reason as its code. A
typed reason SHALL be named by the row that holds it. An entry SHALL NOT carry
an email, a search term or a reason's text.

#### Scenario: grade10-admin-inventory-items-SC-72 - An act's audit entry names ids, never an email, a term or a reason
**Serves:** Who may act - the audit log answers who did what without copying what the act named

- **GIVEN** staff who search `ana@example.com`, register an item under it, move the item to `ben@example.com` with the reason "Sold to Ben at the counter", and retire another as lost
- **WHEN** an admin reads those entries on the audit log
- **THEN** each names who, when and the item; the move names Ana Wong's and Ben Lee's account ids and its move row; the retire reads `lost`
- **AND** no entry carries either email, the search term or the reason's text
