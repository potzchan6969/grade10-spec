## Goals

- Staff find any item the house knows, graded or not, by title, by grader and cert, by item id or by the owner's exact email, and read who owns it by name
- Staff register an item and edit its facts, and every item the vault has taken into custody, but an erased collector's, is already there
- Staff read whether a place holds an item, and close a hold the place no longer has
- The vault's valuation and the custody agreement name a slab by its grader, grade and cert, and a walk-in with a slab the register knows finds it rather than typing it again
- Staff move an item no place holds to any owner, with a reason and a proof where there is one, and anyone can later read who moved it, when and why
- A forfeited vault item belongs to the lender without anybody moving it by hand
- Staff retire a duplicate, a lost or destroyed item, or one that left the platform
- Staff read a collector's items on the collector page
- The ask to be forgotten reaches the register and is refused while a place holds an item the person owns

## Non-Goals

- An item held by the auction, or selling a vaulted item - `sell-a-vaulted-item`
- Grading registering items, or grading items of any category - `grade-any-item`
- Moving the owner of an item a place holds, including the vault moving an owner
- The walk-in intake, owner names on the vault's lists, and the collector page itself - `vault-walk-ins-and-owners`
- A notice to either owner when an item moves
- Search by name
- A value, a photograph or a location on an item
- Merging two records of one item
- Linking an item to catalogue stock
- Retiring the stock console's act that vaults a reserved unit
- A locker registry or a house location
- Any brand but Grade10

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Where does the record of who owns what live? | "The one that's maintainable and efficient": the inventory service, in tables of its own | A new service and database, which adds a deploy and a binding for no gain; the catalogue, whose rows count units of a product and cannot hold one collector's object |
| Q2 | What can an item be? | Anything, graded or not: a category from a closed list, a title, a description, and grader, grade and cert where it is graded | Cards only, which leaves a watch or a coin in the vault with no record |
| Q3 | What does a vault item carry? | Grader, grade, cert and any other facts: the catalogue's reusable attributes where one fits, the rest in the description | A free list of keys and values, which nobody can search, translate or erase with confidence |
| Q4 | Which categories and graders? | Ten categories - trading card, comic, coin, banknote, stamp, bullion, watch, jewellery, memorabilia, other; eight graders - PSA, BGS, CGC, SGC, TAG, PCGS, NGC, PMG; a slab from any other grader is registered with no grader and its grader named in the description - decided by the round | An open grader field, where `PSA` and `psa` would register one slab twice |
| Q5 | Who can own an item? | An account, or one of the company's two entities: the custodian or the lender - decided by the round | One "house" owner, which cannot say which company a forfeited item belongs to |
| Q6 | Does the register decide whether an item may be held? | No: a place commits its own fact first and the register mirrors it, never refusing it; an owner that disagrees is recorded and shown to staff; held or not is read from the places' holds, never stored | The register reserving before the place acts, which makes every vault act wait on inventory and needs a sweep to lapse holds nobody finished |
| Q7 | Can one item be held by the vault and the auction at the same time? | Yes; the register allows it, and the auction's hold arrives with `sell-a-vaulted-item` - nothing is built for it here | One place at a time, which stops a collector selling a slab the vault keeps |
| Q8 | Which places hold items in this release? | The vault alone | Grading as a place, which holds nothing once the slab leaves the shop; the auction, which needs its own interview |
| Q9 | When does the vault register an item, and when does it hold it? | Registered when staff start the valuation, when the shop has the item in hand; held from vaulting until release, unwind or forfeit | Registering at send-in, which records items that never arrive; registering at vaulting, which leaves the valuation without the item's facts |
| Q10 | What is done with cases already in the vault? | Every case that reached custody is registered under its collector, held while the item is in the vault; an erased case is skipped; a forfeited case moves to the lender; one object on two cases is retired as a duplicate | Registering every case, including requests that never reached the shop |
| Q11 | Who may move an item, to whom, and on what proof? | Staff and admins, to any owner; a proof document is asked for and optional; who did it is traceable in the audit log | A second approver; a required proof, which blocks a move the owner agreed in person |
| Q12 | May an item a place holds change owner in this release? | No: a move is refused while any place holds the item, naming the place; the vault moves an owner with `sell-a-vaulted-item` | Moving the owner under a vault hold now, which changes the party to a custody agreement already signed |
| Q13 | How does a forfeited item change owner? | The vault's closing word names the lender and the register moves it in the same act - decided by the round | A staff move after the forfeit, which leaves the item under the collector until somebody remembers |
| Q14 | Which entity does a shop purchase or a gift name? | Deferred to Legal, in the proposal's open questions - recommended: the custodian; the lender only through a forfeit | The lender for every company-owned item, which mixes stock with collateral |
| Q15 | Is either owner told when an item moves? | No email in this release; the item's moves and the audit log hold it | A letter to both owners, which adds a mail path to inventory |
| Q16 | May the map of who owns which item sit in the shared database, outside the vault's own? | Yes, kept small: no value, photograph, location, loan term or amount, and a hold ends with a neutral reason; a forfeit's move to the lender is the one signal it cannot hide; revisit if the register ever stores a value, a photograph or a location, or Legal names a duty | A walled database behind a second binding, which no service carries today |
| Q17 | What happens to a transfer's proof when one party is erased? | Kept while the other party is still a customer, then deleted | Deleting it on either party's erasure, which leaves the remaining owner without the record of how they got the item |
| Q18 | Can staff search owners by name? | No; exact email, a click on a name, the collector page, cert, title or item id | Name search, which lets staff walk the customer list and needs a directory grant staff do not hold |
| Q19 | What is done with a hold the vault no longer has? | Staff close it with a reason; a later word from the vault does not reopen it | A sweep that lapses holds on a clock, which can end a hold the vault still has |
| Q20 | When is an item retired? | As a duplicate, lost, destroyed or left the platform; refused while a place holds it; the history stays and its grader and cert may name a new item | Deleting the record, which loses the history of who owned it |
| Q21 | What does a walk-in with a known slab do? | Staff type the grader and cert, and the case takes the item the register holds, its facts filled in - decided by the round | Typing the slab again, which registers it twice |
| Q22 | Which facts does the custody agreement print? | Grader, grade and cert beside the item, as the register held them when the packet was prepared, and again at every re-prepare - decided by the round | Reading them at signing, which lets an edit change a paper already handed over |
| Q23 | Does the request wizard offer the register's categories? | Yes, all ten - decided by the round | The vault's six, which refuses a comic or a stamp the register already holds |
| Q24 | What may a proof be? | One PDF, PNG, JPG, HEIC or HEIF file, at most 5 MB, the auction's proof rule - decided by the round | Any file, which opens the register to formats nobody can read back |
| Q25 | Who holds which grant? | `inventory:read` and `inventory:write` as today, and a new `inventory:transfer`, all held by staff and admin; the treasurer holds none | Three new `items:*` grants beside `inventory:*`, which splits one resource |
| Q26 | Does grading's Q82 still hold - that a collector's slab never enters the catalogue and a vault valuation reads the grade from the submission? | "Do what makes sense": the slab still never enters the catalogue; a vault valuation reads grader, grade and cert from the register, which supersedes `add-card-grading` Q82's second half and delivers the follow-on its Q22 left, carry-grade-into-vault-case | The submission as the one place a valuation reads, which ties the vault to grading and leaves a slab graded elsewhere with nothing to read |
| Q27 | Which brands? | Grade10 only; revisited when the auction, which serves both brands, becomes a place | A brand on every item before any second brand has a vault |
| Q28 | May a staff move name the lender, or only an account or the custodian? | ❓ owner - recommended: no, only a forfeit moves an item to the lender, keeping stock apart from collateral; Q11 and goal 7 then read "to any account or the custodian, never the lender - only a forfeit" | Any owner, the lender included, as Q11 reads now |
| Q29 | Do staff close a hold the vault no longer has? | ❓ owner - recommended: yes, as Q19 reads; a stuck hold blocks the owner's erasure, and an erasure cannot wait on a deploy | No hand close, which changes Q19 and leaves a stuck hold to a fix in code |
| Q30 | Does the vault hold the item from registration, rather than from vaulting? | ❓ owner - recommended: no, as Q9 reads; a hold from registration needs a close on decline, cancel, expiry and no-show, each another hold that can get stuck, to save one cheap guard on preparing documents | A hold opened at registration, which changes Q9 and drops the guard on preparing documents |
| Q31 | Does an item carry the catalogue's attributes in this release? | ❓ owner - recommended: no; a catalogue schema is chosen by its IP, item and category, which the ten categories are not, so "where one fits" has no rule and the facts go in the description; changes Q3 | The catalogue's attributes where one fits, as Q3 reads now |
| Q32 | How is one object on two old cases found, when old valuations carry no cert? | ❓ owner - recommended: keep Q10's scope and replace its duplicate clause with "a second record of one object is retired by staff when found"; changes Q10 | A backfill of only the items in custody today |
| Q33 | Does moving an item need its own grant, or does it ride `inventory:write`? | ❓ owner - recommended: its own, as Q25 reads; the proof is a personal document, and splitting one grant later costs a grant change | Folding `inventory:transfer` into `inventory:write`, which changes Q25 |
| Q34 | When one party to a move is erased and the other is the custodian or the lender, is the proof kept? | ❓ owner - recommended: kept while the other party is the custodian, the lender or a live account, for Q17's own reason: the remaining owner keeps its record; extends Q17 | Q17 as it reads, kept only while the other party is a customer, which the custodian and the lender never are |
| Q35 | Once the item is registered, whose category, title and description do the Case tab and the custody agreement show? | ❓ pm - recommended: the register's facts on the Case tab and the paper, with the collector's request kept as they sent it; extends Q22 | The case's own category, title and description beside the register's grader, grade and cert |
| Q36 | Which word names a place keeping an item, now that "hold" already means a stock reservation in inventory? | ❓ pm - recommended: "mark", the capability's name and unused elsewhere in inventory, across the page, the decisions and the journeys; rewords Q6, Q12 and Q19 | "Hold", which reads as a stock reservation |
| Q37 | Is `item-marks` its own capability, or part of `items`? | ❓ pm - recommended: part of `items`, since no page names it, and its journeys file deleted; the auction's change then modifies `items` | `item-marks` as a second capability that no page names |
| Q38 | Does erasure keep an erased owner's item category, grader, grade and cert? The owner's and Legal's to settle; Q17 covers only the proof | Deferred to Legal, in the proposal's open questions - recommended: keep them, since they describe the object, not the person; the owner link, the title, the description and the person's side of each move go, and the kept cert is what lets "one slab, one item" refuse a second record when the slab comes back | Clearing the cert, which lets that slab be registered twice |
| Q39 | Does the collector page list the collector's retired items? | ❓ owner - recommended: no, live items only; US-07's reason is everything they have with us, and a lost, destroyed or departed item is not with us, while the item's page keeps its history | Retired items shown in a group of their own |
| Q40 | Is a retire final, and can a retired item's facts be edited? | ❓ owner - recommended: final and read-only; Q20 frees the grader and cert for a new item, so undoing a retire can collide with that item, and a mistaken retire is fixed by registering the item again | Reopening a retire while its cert is still free |
| Q41 | Where does Items sit in the console's nav? | Deferred to the designer, in the proposal's open questions - recommended: a detail page of Inventory, as every `/inventory/*` page is today, so no new nav entry is needed | A section of its own, which saves a click on the change's busiest page |
| Q42 | Does the Items list show when an item was last edited? | Deferred to the designer, in the proposal's open questions - recommended: no, only one item's page shows it; no journey reads it on the list, and the column narrows the table | Last edited on both the list and one item's page |
| Q43 | A walk-in is now a draft the customer may edit before sending (`vault-walk-ins-and-owners` Q19). When staff link a slab the register knows, may the customer's edits change its grader, grade, cert or category? | ❓ pm - recommended: no; a linked slab's grader, grade, cert and category read from the register, and the customer's edits touch only the photos and the description | The customer's draft edits overwrite the case's copy, leaving the case and the register with two stories of one slab |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
