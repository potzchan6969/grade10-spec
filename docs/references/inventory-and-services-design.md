# Inventory and Services Design

The design behind the owner's inventory brief of 2026-10-08: one record of
every physical object the house touches, the places it sits, how it moves,
and the services that act on it - the vault, grading, the auction and store
consignment - with the admin console that runs them. An agent wrote it under
the owner's delegation: what the owner left to best practice is decided
flatly here, and what is the owner's to decide is marked ❓. The pages that
carry it are [Inventory](../prds/products/grade10-admin/inventory/index.md)
and the planned pages under it,
[Consignment](../prds/products/grade10-site/consignment/index.md) and the
[Documents Service](../prds/products/grade10-site/doc-sign/service.md). No
OpenSpec change carries it yet. Read this as a proposal to the team, not as
requirements.

## The Brief

- **Inventory** - batteries included, so every downstream service builds on
  it: the vault, store consignment, auction consignment and grading
- **Intake** - a collector's submission, brought to a shop or sent by post,
  and a partner deal an admin runs
- **Physical storage** - the shop, the vault, a warehouse and a third
  party's place
- **Services** - the owner's "applications": the vault, grading, the
  auction and store consignment, each with its own intake: grading wants
  photographs, the auction a price, the vault and consignment signed paper
- **Transit** - an item on its way to the vault, to a grader, to the shop
- **Legal documents** - collection, vault, grading, finance, and a document
  service any service can use, so QA tests documents in one place
- **Store consignment** - consigned items with commission bound to the
  consignment, messages as the item goes on sale and sells, and the seller
  named on the store only where an admin sets it
- **Flows** - any item to any service, and one service to the next, such as
  an auction win or a graded card going straight into the vault

## What Runs Today

| Part | What runs |
| --- | --- |
| Stock | Three records that never meet: the catalogue counts house stock and the auction's holds, the item register holds owned objects that only the vault marks, and Shopify counts the shop's retail stock |
| A slab | A catalogue Cert record, a register item and a grading card can each describe it, matched, where at all, only by grader and cert text |
| Grading cards | On the submission alone: no item, no place; a grade never reaches the register |
| Intake | One per service: the vault's request and counter, grading's list and counter, the catalogue's intake and workbook import for house stock |
| Places | The diary's shops are the only places; the vault adds a free-text locker; grading counts one safe across every shop; inventory and the auction know no place |
| Transit | Grading's batch shipments, the auction's dispatch and delivery, and the vault's locker moves; nothing moves an item between shops |
| Services on an item | The vault marks register items; the auction holds catalogue units; grading marks nothing; no consignor exists anywhere |
| Paper | doc-sign is a library each host builds into its own database: the vault and grading |
| Between services | Grading hands a slab to the vault at the counter, linked by a typed case reference nothing checks |
| A sale | A won lot leaves its stock hold open until an operator records the sale by hand, and no owner moves |

## What Is Missing

Ranked by what each one blocks.

1. **One identity per object** - a slab carries up to three records, so no
   service can ask what happened to it before; consignment and every
   hand-off need one
2. **Places** - nothing records where an item is, so a shop cannot find a
   card, cap a safe per shop or count a shelf
3. **Every service on the item** - only the vault marks, so nothing stops a
   card at the grader from being listed, or one card from being sold twice
4. **Consignment** - no consignor, commission or payout exists for the store
   or the auction
5. **Hand-offs** - one, grading into the vault, on a reference nobody checks;
   an auction win or an unsold item has no next step
6. **A sale that settles** - the owner never moves and the hold never closes
   when an item sells
7. **One way to move** - three transit records and none for a mail-in, a
   ship-home or a run between shops
8. **Paper for new services** - each new service would build doc-sign into
   another database and another signing address
9. **An admin hub** - no page answers what an item is, whose it is, where it
   is and what is happening to it; no receiving desk, transit board or count

## The Model

Eight nouns, each with one job.

| Noun | What it is |
| --- | --- |
| Item | One physical object, raw or graded, with one owner and one label; every object the house touches is one, whoever owns it |
| Product | What an item is an instance of, in the catalogue; a collector's item may name its product without counting as stock |
| Location | A site the house runs, a storage unit inside one, or an outside place such as a grader |
| Custody | The house holding the item, from hand-in to release; where it is follows from its last movement |
| Movement | The item going from one location to another; a shipment carries items between two places |
| Mark | A service acting on the item: vault, grading, consignment, auction or store |
| Agreement | What the owner signed for a service, kept by the documents service |
| Intake and release | The ways an item comes into custody and the ways it leaves |

- **Quantity stays quantity** - interchangeable house stock, such as sealed
  boxes, stays a count on its product; an item is one object nobody could
  swap for another
- **A Cert record is an item** - each catalogue Cert record links to one item
  the house owns; the catalogue keeps counting stock, and the register keeps
  the object, its owner and its place
- **A grading card is an item** - from hand-in, raw; receiving writes the
  grader, grade and cert onto the same item
- **Owners** - an account, a partner, the custodian or the lender; a partner
  is an organisation an admin registers, so a deal's items belong to the
  company rather than to the person who signed

## Who Owns What

| Service | Owns | What changes |
| --- | --- | --- |
| Inventory | items, owners, product links, labels, locations, movements and shipments, marks, counts, partner deals | locations, shipments, marks from every service, deals |
| Vault | cases, valuation, the loan and its money | marks and moves the item through inventory; lockers become units |
| Grading | submissions, batches, the grader's manifest, fees | cards become items at hand-in; a batch ships as an inventory shipment |
| Auction | listings, bids, orders, the buyer's money | a lot sells an item or stock; a paid order moves the owner and settles the hold |
| Consignment | consignments, terms, commission, consignor payouts, the consignor's messages | new |
| Documents | templates, packets, sealing, verification | doc-sign becomes a service of its own |
| Store | Shopify: retail stock, orders, fulfilment | publishes a consigned item and reports its sale |
| Appointment | hours, desks and bookings of the sites that take visits | reads its sites from inventory, under the ids its shops carry today |
| KYC | verified identities | consignment binds it, as the vault does |

| Edge | Shape |
| --- | --- |
| A service asks inventory to mark, move or hand off | Ask |
| A service tells inventory what it did under its mark | Tell-push, the vault's register dues |
| Consignment asks the auction for a lot and the store to publish, price or withdraw | Ask |
| Consignment learns of a sale, a payment, a delivery or a refund | Tell-pull: its sweep claims the auction's and the store's sale facts, so neither binds consignment |
| A host prepares and mints a packet | Ask the documents service |
| A host learns a packet is sealed | Tell-push from the documents service; an act resting on signed paper asks again |

## Marks

A mark is a service's claim on an item while it acts on it: a vault case, a
grading submission, a consignment, an auction lot, a store listing.

- **Marks that share an item** - a consignment with its sale, an auction lot
  or a store listing; and a storage-lane vault case under a consignment to
  auction, so the item sells from the vault
- **Everything else stands alone** - a service waits for the other mark to
  close, or takes the item by a hand-off
- **Someone else's item sells under a consignment** - an auction or store
  mark on an item the house does not own needs the owner's live consignment
- **One sale at a time** - an auction lot or a store listing, never both
- **Ask first** - a service asks inventory before it marks, and a refusal
  names the rule and the mark in the way
- **What it does under its mark is mirrored** - inventory records what a
  service did and never refuses it, as the register does for the vault today
- ❓ Owner, Legal - **A live loan and a sale** - an item securing a live
  loan takes no sale until the loan is repaid; whether a sale may repay it
  first is open

## Hand-offs

- **One act** - closes one mark and opens the next on the same item; the item
  stays in custody, with no release, no new intake and no new label
- **Paper first** - the next service's agreement is executed before the
  first mark closes, so the item is never held without paper
- **The owner decides** - or staff, for an item the house owns

| From | To | When |
| --- | --- | --- |
| Grading, ready | Vault | At hand-back; runs today on a typed reference |
| Grading, ready | Consignment to the store or the auction | At hand-back |
| Auction, won and paid | The winner's vault case | The winner picks keep in the vault at setup |
| Auction, unsold or cancelled | Consignment to the store, or the vault | The consignor picks |
| Store, ended unsold | Consignment to the auction, or the vault | The consignor picks |
| Vault, storage lane | The store, or grading | The owner asks; the vault case ends |
| Vault, forfeited | House stock | ❓ Legal: who sells a forfeited item |

- **Not a hand-off** - relisting, extending a store term, and a vault case
  staying under an auction keep the same service; collecting or shipping
  back is a release
- **Keep in the vault** - the winner passes the hosted identity check and
  signs the custody agreement on their own phone; the auction's mark holds
  the item until then, and the vault case opens on the item where it sits
- **Collect at a shop** - a winner may collect in person instead of a
  delivery, a release at the shop
- **A sale** - when an item leaves to its buyer or is kept for them, the
  selling service moves the owner and closes its mark; nobody records the
  sale by hand

## Intake

| Channel | Starts with | Custody starts |
| --- | --- | --- |
| At a shop | A booked or walk-in visit and the service's own counter steps | When the item is handed in under an executed agreement |
| By post | The service's request online, its agreement signed online, a shipping instruction | When the parcel is received |
| Partner deal | An admin's deal: the partner, the purpose, the terms, the expected items | When each item is received against the deal |
| House purchase | Stock bought, through the catalogue's intake | On receipt; the custodian owns it |

Receiving runs the same five steps whatever the channel:

1. **Identify** - scan the label or the grader's barcode, type grader and
   cert, or register a new item under its owner
2. **Check** - against what was expected, with a condition note
3. **Photograph** - front and back, as received
4. **Label** - print the item's label; a slab's own barcode stays a second
   way to find it
5. **Put away** - scan a storage unit; refused past the unit's cap

- **Nothing arrives without paper** - a mail-in's shipping instruction is
  issued only once its agreement is signed; a counter hand-in waits for the
  signature
- **The service's own steps** - grading's declared value and level, the
  vault's valuation, consignment's price run on the item as received, never
  on a second copy
- ❓ Legal - **Risk on the way in** - the owner's until the parcel is
  received, as proposed
- **A parcel nobody expected** - waits in Receiving until staff match it

## Release

| Way out | Custody ends when |
| --- | --- |
| Collected at a shop | The owner, or a person they named, signs the receipt |
| Shipped | The carrier's proof of delivery, or Shopify's fulfilment for a store sale |
| Sold and kept | The owner moves to the buyer; the item stays where it is |
| Written off | Lost or destroyed and paid out under its agreement; the item retires |

## Locations

| Kind | Holds |
| --- | --- |
| Site | Shop, vault or warehouse, with an address and a time zone; a shop also takes visits |
| Storage unit | Room, safe, locker, cabinet, display case, shelf or tray, nested inside a site |
| Outside place | Grader, partner, storage provider or other, with an address and no units |

- **One owner** - inventory keeps every place; the diary keeps the hours,
  desks and bookings of the sites that take visits
- **Where an item is** - one storage unit, an outside place, or a shipment in
  transit; released, it is with its owner
- **Cover value** - what the house would pay if the item were lost, as its
  agreement names it: a grading card's declared value, a vault case's
  valuation
- ❓ Commercial - **Cover value of a consigned item and of house stock** -
  the floor price and the cost are proposed
- **Caps** - a unit or a site may cap the cover value it holds; a put-away or
  a move past it is refused, naming the cap
- ❓ Commercial, Legal - **Each shop's safe** - grading's safe cap becomes a
  cap on each shop's safe rather than one across every shop, as proposed
- ❓ Product, Legal - **What the register holds** - a place, the
  photographs staff take as received and one cover value for caps; the
  valuation, loan terms and amounts stay in the vault, and the item page
  reads them from it. The register's own decision asks for this revisit
  before it stores a value, a photograph or a location
- **Labels** - a short code per item from the alphabet the case reference
  uses, printed with its QR code and title; reprinted any time, never changed
- **Counts** - staff scan a unit; the count names what is missing and what is
  unexpected, and each is resolved as moved, found elsewhere or missing
- ❓ Operations - **How often a unit is counted** - each safe weekly and each
  locker monthly are proposed

## Transit

| State | Means |
| --- | --- |
| Preparing | Items scanned into the parcel; the packing list prints |
| Sent | Handed to the carrier or the staff member carrying it, on a day never in the future |
| Arrived | Scanned in at a site, or delivered at an outside place or an address |
| Cancelled | Before it was sent |

- **A shipment** - from a place to a place or an address, a carrier or a
  staff run, tracking, the insured value, the expected arrival, and the
  service it serves
- **Late is read, not stored** - a shipment past its expected arrival reads
  late on the board
- **Cover per parcel** - the insured value stays within the carrier's cover;
  more ships split, as grading's batches do
- **Each item on arrival** - received, missing or damaged with photographs
- **Lost** - a missing item declared lost; the owner's service pays out under
  its agreement, and the item retires as lost
- ❓ Operations - **When a missing item is lost** - how many days missing
- **Who asks** - grading for a batch and its box back, the auction for a
  winner's order, consignment for a return, a transfer between sites, and
  a mail-in expected in

## Consignment

| Rule | Value |
| --- | --- |
| Store commission | ❓ Commercial: a share of the sale price, by price band |
| Auction commission | ❓ Commercial: a share of the hammer price; the buyer's premium stays the house's |
| Minimum commission | ❓ Commercial: per item |
| Term on sale | ❓ Commercial: **90** days proposed |
| Payout | ❓ Commercial: after the return window, **14** days after a store sale or **7** days after an auction lot is delivered or kept in the vault, as proposed |
| Ending soon | **7** days before the term ends |

- **One consignment** - one owner, one or more items, one channel per item,
  the terms pinned at signing: commission, term, fees
- **Price** - a list price and a floor, agreed at signing; staff change the
  price within the floor without asking, and below it only with the
  consignor's written yes
- **Store channel** - one Shopify product per item, a quantity of one, sold
  in the shop and online; staff may limit it to the shop; the item sits on a
  display unit while on sale
- **Auction channel** - a lot made from the item, the consignor's reserve
  where they set one
- **Payout** - the sale price less commission and fees, recorded by a
  treasurer after the bank transfer; a correction takes a second holder of
  the payout grant, as the vault's does
- **A refund before payout** - reverses the sale; a returned item goes back
  on sale for the rest of its term
- **Seller display** - off by default; an admin turns it on for one
  consignment, only where the consignor agreed on the agreement to be named;
  the store and the lot show the display name they gave, never their legal
  name
- **Ended unsold** - the consignor picks: extend, reprice, the auction, the
  vault, or collect or ship back
- ❓ Legal - **Nobody collects** - reminders, then a written notice and what
  follows it, as grading's ladder runs, is proposed
- ❓ Legal - **Identity** - a verified identity before signing, the check
  the vault binds, is recommended
- **Partners** - consign in bulk under a deal
- ❓ Commercial - **A partner's statement** - one monthly statement in place
  of a payout for each item is proposed

| The consignor hears | When |
| --- | --- |
| Received | The items are checked in, with the receipt |
| Agreement signed | The sealed agreement, with its terms |
| On sale | The item is listed, in the shop or at auction |
| Price changed | Staff changed the price within the floor |
| Sold | The sale price, and when the payout is due |
| Paid | The payout, with its statement |
| Ending soon | Seven days before the term ends, with the choices |
| Ended unsold | The term ended, with the choices |
| Returned | The item was collected or delivered back |

## Documents

- **A service of its own** - doc-sign becomes the documents service, with
  its own worker, database and bucket, as the KYC service did; each host
  stops building the tables into its own database
- **One signing address** - `grade10.com/sign#<token>`; the vault's and
  grading's addresses redirect
- **A host** - prepares a packet for its subject - a case, a submission, a
  consignment, a deal - hands over the link or QR code, and is told when it
  is sealed; an act resting on signed paper asks the service whether the
  packet is executed
- **Any document** - an admin prepares any approved template for a person,
  an item or a deal, such as a partner's master agreement
- **Templates by area** - versioned, each approved by Legal; production
  refuses to seal a version nobody approved
- **QA** - every template renders with sample data in staging, signs in a
  sandbox and carries a contract test; a new version shows its difference
- **Migration** - consignment starts on the service; the vault and grading
  move after, their packets copied and their signing addresses redirected
- ❓ Engineering - **When the vault and grading move** - after consignment
  ships on the service is proposed

| Area | Templates |
| --- | --- |
| Collection | Collection statement |
| Vault | Custody agreement, release receipt |
| Finance | Loan agreement, key terms record |
| Grading | Submission agreement, intake receipt, hand-back receipt, withdrawal receipt |
| Consignment | Consignment agreement, consignment receipt, return receipt, payout statement |
| Partner | Master agreement, deal schedule |
| Transit | Packing list, delivery note; never signed |

## Admin Console

| Section | Pages |
| --- | --- |
| Inventory | Items, Products and Stock, Locations, Transit, Receiving, Deals |
| Consignment | Queue, Payouts, Settings |
| Vault, Grading, Auction, Appointments | As today, every row opening its item |
| Documents | Packets, Templates |
| Collectors | One page per person across every service |

- **The item page** - the hub: what it is, its label, whose it is, where it
  is, every mark as a chip and every value with its source; Apply to a
  service, each one offered or withheld with the reason in words; Move;
  Print label; tabs for Overview, Where, Services, Documents, Owners and
  Activity
- **Scan anywhere** - a scan in the console's header opens the item; inside
  a task - packing, receiving, counting - the scan adds it to the task
- **Receiving** - the day's expected arrivals, from the diary's drop-offs,
  the parcels due, the graders' boxes and partner deliveries; a receive card
  runs the five steps
- **Locations** - the tree of sites and units; a unit shows what is in it,
  its cover value against its cap and its last count
- **Transit** - views by wait: To pack, To send, In transit with late
  badged, To receive, Exceptions
- **Consignment queue** - views by wait: New, To price, To sign, To list, On
  sale with ending soon badged, Sold in its return window, Payout due, Ended
  unsold, Returning, Closed
- **Payouts** - the treasurer's due list, statements and a CSV, on the
  vault's two-person rule
- **Collectors** - the collector page gathers items, vault cases, grading
  submissions, consignments, auction orders, payouts and documents, each a
  section that stands alone

| Grant | Roles | Opens |
| --- | --- | --- |
| `inventory:move` | staff, admin | receive, put away, move, pack, send, receive a shipment, count |
| `inventory:locations` | admin | add or retire a site, a unit or an outside place, and set a cap |
| `inventory:deals` | admin | partner deals and partners |
| `consignment:read` | staff, treasurer, admin | the queue and every consignment |
| `consignment:operate` | staff, admin | intake, terms within the schedule, list, price within the floor, return |
| `consignment:approve` | staff, admin | a commission outside the schedule, a price below the floor on the consignor's yes |
| `consignment:payout` | treasurer, admin | payouts, corrections and the book |
| `consignment:display` | admin | name a consignor on the store and the lot, where they agreed |
| `documents:read` | staff, admin | every packet |
| `documents:templates` | admin | approve a template version |

## Phases

| Phase | Builds | Unlocks |
| --- | --- | --- |
| 1 | One item per object, product links, labels and scan, locations and caps, the item page; vault lockers and grading's safe as units | Where everything is, on one page |
| 2 | Marks from every service, hand-offs as one act, a sale that moves the owner and closes the hold | Any item to any service, safely |
| 3 | The documents service, its template catalogue and one signing address | Paper for every new service |
| 4 | Store consignment: Shopify publishing, commission, payouts, messages, seller display | The owner's first new service |
| 5 | Auction consignment, collect at a shop and keep in the vault for winners | Consigned lots and the winner's choices |
| 6 | Shipments, the receiving desk, mail-in, ship-home, counts | Items by post, and a count that reconciles |
| 7 | Partners and partner deals | Dealers consigning in bulk |

## Open Questions

- ❓ Product, Legal - **What the register holds** - a place, staff
  photographs and one cover value beside the owner map; recommended, with
  valuations and loans kept in the vault
- ❓ Legal - **Consignor identity** - a verified identity before a consignor
  signs; recommended
- ❓ Commercial - **When a consignor is paid** - after the return window, by
  bank transfer; recommended
- ❓ Owner, Legal - **Selling from the vault** - a storage-lane item sells
  from the vault; a financed one only once repaid; recommended
- ❓ Commercial - **The figures** - store and auction commission, the minimum,
  the term, fees, and the cover value of a consigned item and of house stock
- ❓ Legal - **Uncollected consignments** - the notice and what follows it
- ❓ Legal - **Forfeited items for sale** - who sells an item the lender owns
- ❓ Commercial, Legal - **A cap for each shop's safe** - in place of one cap
  across every shop
- ❓ Operations - **How often units are counted** and how many days missing
  makes an item lost
- ❓ Engineering - **When the vault and grading move to the documents service**

## Decisions Taken Under Delegation

| Topic | Decision |
| --- | --- |
| One record per object | Every serialized object the house touches is an item; a Cert record and a grading card each link to one |
| Quantity stock | Interchangeable house stock stays a count on its product |
| Who keeps places | Inventory keeps every place; the diary schedules the sites that take visits |
| Marks | Every service marks the item it acts on; the rules above decide which marks share an item |
| Hand-offs | One act, paper first, the owner decides |
| A sale settles | The selling service moves the owner and closes its mark |
| Labels | Every item gets the house's own label; a grader's barcode is a second way to find a slab |
| Partners | An organisation an admin registers, and an owner of its items |
| Documents service | doc-sign becomes a service of its own, as the owner suggested; consignment starts on it |
| Store channel | One Shopify product per consigned item, in the shop and online, limited to the shop where staff choose |
| Price | A list price and a floor agreed at signing; below the floor only on the consignor's yes |
| Seller display | Off by default; an admin turns it on only where the consignor agreed, showing their display name |
| Messages | Each service sends its own, by email, in the brand's languages |
