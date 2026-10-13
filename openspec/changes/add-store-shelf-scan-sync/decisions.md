## Goals

- A shopkeeper points the scanner at any product on the shop's shelf and sees
  the store's title, price, availability and a link to its page.
- The scanner holds every published store product as the store's own copy of
  the catalogue moves, and drops one the store no longer publishes.
- A slab on the shelf names the exact store product it is, not only its card.
- A product's new photos become recognisable within the hour on staging and
  production.

## Non-Goals

- **Recognising sealed boxes, merch and comics** — held now, recognised once
  the scanner's box detector ships.
- **Shopkeepers adding photos from the scanner** — the link scans only.
- **Selling from the scanner** — the link opens the store page; the scanner
  takes no order and holds no stock.
- **Products the store does not publish** — every shelf product is published.
- **Gift cards** — not on the shelf.
- **Stock counts** — a scan shows Available or Sold out.
- **The ZZZ store** — its catalogue is not synced here.
- **Staff sign-in on the scanner** — shopkeepers open it from one fixed link.
- **Editing items in the scanner** — the store's catalogue is the only source;
  an item changed in the scanner is put back with the next copy.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Which store products does the scanner hold? | Every published product but gift cards; a sold-out one stays and reads Sold out - decided by the owner | Only collectibles, which leaves merch on the shelf unscannable; only in-stock products, which makes a sold-out shelf item look unknown |
| Q2 | Are products the scanner cannot yet recognise synced now? | Yes: sealed boxes, merch and comics are held now and recognised once the box detector ships - decided by the owner | Excluding them until then, which needs a second change to add them back |
| Q3 | Does a slab resolve to its card or to its exact unit? | Its exact unit: the store reads the grader, grade and cert of the inventory item the product names - decided by the owner | Card-level match only, which names the card but not which copy the store lists |
| Q4 | How fresh is the scanner? | It follows the store's catalogue mirror: within 5 minutes of a change the shop reports, within 10 of one only the store's re-read finds; photos hourly on staging and production; an hour with nothing new costs nothing - decided by the owner | A schedule of its own beside the mirror's; production photo runs only by hand, which leaves new photos unrecognised there |
| Q7 | What does a slab with no known unit do? | Recognised by its product photos, without grade or cert; a slab whose grader the scanner does not read is the same; where two products carry one cert neither carries it; Operations is alerted to each, with no screen - decided by the owner | Left off the scanner, which hides a product the store sells; "held by its card", which the store cannot do because it knows no catalogue card |
| Q7a | How does a house-stock slab name its unit? | The shop product names its inventory item's label code, and the store reads grader, grade and cert from inventory, as for a consigned slab; every house shelf slab is a registered inventory item - decided by the owner, revising the earlier answer | Grader and cert typed on the shop product, the earlier answer, superseded: a second copy of facts inventory holds, no grade, and certs public on the storefront; holding house stock by its photos alone, which leaves Q3 true only for consigned slabs |
| Q8 | What does the scanner show on a product it cannot recognise? | Its usual "Not recognised yet — hold steady" - decided by the owner | A hint per kind, which the box detector makes obsolete |
| Q9 | How do shopkeepers open the scanner? | One fixed link, the hosted scanner with the project's public scan key, bookmarked or printed as a QR code; scan-only, it adds no photos and shows only what the store shows publicly; rotating the key retires it - decided by the owner | A staff-console action minting sessions of at most 24 hours, which needs building, is reopened daily, and protects nothing that is not already public |
| Q10 | Is ZZZ in scope? | No, grade10's store only - decided by the owner | ZZZ's store in the same change, with its own scanner project |
| Q11 | Are there till-only products on the shelf? | No: every shelf product is published to the store's channel - decided by the owner | Syncing products the store does not publish, which reaches past the store's catalogue |
| Q12 | Does production's scanner wait for the store to open there? | No: it holds title, price and availability now; the store-page link appears only where the store is carried - decided by the owner | Waiting for the store's launch, which leaves the shop floor without the scanner until then |
| Q13 | What does a scan show for stock? | Available or Sold out, the shop's for-sale answer as Product Status reads it; no count - decided by the owner | The shop's count, which the public link would expose and which is wrong where the shop sells past zero |
| Q14 | How does an open scanner stay current? | It refreshes its catalogue every few minutes and when the shopkeeper returns to it - decided by the owner | A live read from the store on every scan, which needs a new public route |
| Q15 | Can shopkeepers add photos from the scanner? | Not in this change - decided by the owner | Enrolling photos now, which could make boxes and merch recognisable sooner but takes the item's photo slots and needs a writing link |
| Q16 | Which price and availability shows for a product with several variants? | What the product page shows: its one item per card, and the site price with automatic discounts - decided by the round | The list price of the first variant, which differs from what the customer pays online |
| Q17 | Which store product wins when the scanner's shared card catalogue matches the same art? | The store product - decided by the round | The shared catalogue's card and market price, which is not what the shop sells |
| Q18 | Where does the capability sit? | `grade10-site/store/shelf-scanning`: shopkeepers use the scanner at grade10's site, against the grade10 store's catalogue - decided by the round | A platform page for the scanner, which carries no spec and no checked outcome; `shared/`, which no second product is held to |

## Handed to Tech Design

Choices the round checked against the code, for `tech-design.md` to carry:

- **Which service syncs** — the store, through a binding to the scanner, as a
  pass of its own isolated from the store's other scheduled passes, following
  the mirror's copy
- **No-op writes** — the scanner treats an upsert that changes nothing as no
  write: no queued photo, no rebuild
- **Slab facts** — read from inventory in one batch every pass, so a
  correction in inventory reaches the scanner without a push
- **Failed photos** — retried after 24 hours rather than left failed
- **Model mismatch** — the photo processor stops when its model differs from
  the scanner's, rather than reprocessing every hour
- **Scanner project** — seeded by migration on each environment
- **Access** — `/scan/*` bypasses Cloudflare Access, so shopkeepers outside
  Access can open the link

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-site/store/shelf-scanning | Blind pass: what happens to the items somebody imported into the scanner by hand before this change - does the first copy remove them, keep them beside the store's, or replace them where they match a store product? | |
| grade10-site/store/shelf-scanning | Blind pass: when is "the next copy" for an item changed on the scanner while the shop's catalogue sits idle - does the store's 5-minute re-read put it back even when nothing in the catalogue moved, or does it wait for the next real change? | |
| grade10-site/store/shelf-scanning | Blind pass: how many minutes is "every few minutes" for an open scanner, and is there one end-to-end bound a shopkeeper can hold - from a shop save to an open, untouched scanner showing it? | |
| grade10-site/store/shelf-scanning | Blind pass: what does the scanner hold when one party fails during a pass - the scanner unreachable, inventory unreachable, or a photo that cannot be fetched - does it keep the last version, drop a slab's grade and cert, or alert Operations? | |
| grade10-site/store/shelf-scanning | Blind pass: how soon does a grade or cert corrected in inventory reach the scanner when nothing about the product changes in the shop - at the 5-minute re-read, within 10 minutes, or only with the product's next change? | |
| grade10-site/store/shelf-scanning | Blind pass: where does Operations read the alert for a slab held without a unit, and does it repeat on every pass and clear once the slab is fixed? | |
| grade10-site/store/shelf-scanning | Blind pass: which product does the scanner name when two store products that are not slabs share the same art - two raw listings of one card, say in different languages or conditions? | |
| grade10-site/store/shelf-scanning | Blind pass: what does the scanner name for a raw copy of a card the store sells only as a slab, whose photos show the same art - the slab's product without grade or cert, or nothing? | |
| grade10-site/store/shelf-scanning | Blind pass: how does the store know a house-stock product is a slab when it names no item - which fact marks it graded, so that it is held without grade or cert and alerted rather than held as a raw card? | |
| grade10-site/store/shelf-scanning | Blind pass: is a slab's cert something the store shows publicly? The scan shows grade and cert on a link that "shows only what the store shows publicly", while Q7a rejected typing certs on the product because it would make them public on the storefront. | |
| grade10-site/store/shelf-scanning | Blind pass: what does a retired link show once the key is rotated - an error naming the link as retired, a not-found page, or the scanner refusing every scan - and how do shopkeepers learn the new link? | |
| grade10-site/store/shelf-scanning | Blind pass: an automatic discount that starts or ends changes no product - how soon does the scanner's price follow it, and does the scan show the higher price struck through as the product page does? | |
| grade10-site/store/shelf-scanning | Blind pass: in which language does a scan show the title - the store's default, or the locale the shopkeeper's phone or link asks for, as the store's /tc and /sc pages do? | |
| grade10-site/store/shelf-scanning | Blind pass: what does the scanner learn from a product with more photos than an item holds - which photos, in what order, and is the rest dropped silently? | |
| grade10-site/store/shelf-scanning | Blind pass: when the store opens on production, does the store-page link appear on production's scan without any other change, or does it need its own release step? | |
