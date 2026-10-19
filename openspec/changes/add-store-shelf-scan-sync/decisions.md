## Goals

- A shopkeeper points the scanner at any product on the shop's shelf and sees
  the store's title, price, availability and a link to its page.
- The scanner holds every published store product as the store's own copy of
  the catalogue moves, and drops one the store no longer publishes.
- A slab on the shelf names the exact store product it is, not only its card.
- A product's new photos become recognisable at the next hourly run on
  staging and production.

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
| Q4 | How fresh is the scanner? | It follows the store's catalogue mirror: within 5 minutes of a change the shop reports, within 10 of one only the store's re-read finds; photos hourly on staging and production; an hour with nothing new costs nothing - decided by the owner, revised by Q35 | A schedule of its own beside the mirror's; production photo runs only by hand, which leaves new photos unrecognised there |
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
| Q19 | Are a slab's cert and a house label code public? | Yes: both are printed on the slab, so the scan and the store's catalogue may carry them - decided by the owner | Keeping certs off the scan, which leaves a slab named by its card alone |
| Q20 | What does a scan name when two or more store products share one art? | Each of them, closest first; the shopkeeper picks one. Slabs are among them unless a label was read (Q36) - decided by the owner | The closest match only, which can name the wrong listing of one card |
| Q21 | What does a scan name for a raw copy of a card the store sells only as a slab? | The slab's product, without grade or cert; where another store product matches as closely, the pick (Q36) - decided by the owner | Nothing until a label is read, which hides a product the store sells |
| Q22 | What does a link show once its key is rotated? | The scanner's usual refusal for a link that no longer works; the shop manager hands out the new QR code - decided by the owner | A screen of its own for a retired link |
| Q23 | How does a scan show an automatic discount? | The price the shopper pays, with a Sale badge; a discount that starts or ends reaches the scanner with the store's next pass - decided by the owner | The higher price struck through, as the product page shows it |
| Q24 | In which language does a scan show the title? | The store's default language - decided by the owner | The title per locale, as the store's /tc and /sc pages show it |
| Q25 | When does an item changed on the scanner go back to the store's version? | At the store's next pass, every 5 minutes, whether or not the catalogue moved: each pass sends every product - decided by the round | Waiting for the product's next change in the shop |
| Q26 | How often does an open scanner read its catalogue? | Every 2 minutes while in view, and at once when the shopkeeper returns to it; a reported change reaches an open scanner within 8 minutes of the shop's save, and one only the store's re-read finds within 13 - decided by the round | A live read on every scan, which needs a public route (Q14) |
| Q27 | What does the scanner hold when a party fails during a pass? | Its last version: an unreachable scanner or inventory, or a discount read the shop does not answer, fails the pass loudly before anything is written; a photo that cannot be fetched is tried again 24 hours later - decided by the round | Writing what could be read, which drops a slab's grade and cert for one pass and restores it the next |
| Q28 | Where does Operations read a slab held without a unit? | A Datadog monitor on the count each pass reports, by reason; it stays raised while any is held and clears once none is; the log names each product - decided by the round | A screen, which Q7 ruled out |
| Q29 | How soon does a grade or cert corrected in inventory reach the scanner? | At the store's next pass: inventory is read on every pass - decided by the round | Only with the product's next change in the shop |
| Q30 | What happens to a cert in a form the scanner cannot read? | The same as a grader it does not read: recognised by its photos, without grade or cert, and alerted - decided by the round | Refusing the item, which leaves the product off the scanner |
| Q31 | Which photos does the scanner learn from a product with more than 8? | The first 8, in the shop's order - decided by the round | Choosing photos by kind, which the store cannot tell apart |
| Q32 | How does the store know a house-stock product is a slab? | Its collectible type is a graded one - decided by the round | A separate field a stock keeper must set |
| Q33 | Does the store-page link on production need its own release step? | No: the link reads the site's lane table, so the store's launch line adds it - decided by the round | A setting of the scanner's own, a second line to change at launch |
| Q34 | What happens to items imported into the scanner by hand? | None exist: grade10's scanner project is new, and the store's collection holds only what the store sends - decided by the round | Merging hand imports with the store's items |
| Q35 | From when is the scanner's freshness measured, and how long is it? | From the shop's save: a change the shop reports is on the scanner within 6 minutes, one only the store's re-read finds within 11; Q4's 5 and 10 leave out the seconds a report takes and the pass's own minute; the owner was told 6 and 11 before authorising acceptance - decided by the round | 5 and 10 minutes from the save, which a 5-minute schedule cannot promise; a pass triggered by each report, one more moving part |
| Q36 | Does the pick include slabs? | Yes: every close store product of one art, slab or not, unless the scanner read a slab's label - decided by the owner | The closest only, where a raw card could show a slab's price with no warning |
| Q37 | Which cert forms does the scanner read? | 4 to 24 letters, digits or hyphens, for every grader it reads: PSA, BGS, CGC, SGC and TAG. Any other is recognised by its photos only and alerted (Q30) - decided by the round | A form per grader, which the scanner does not hold |
| Q38 | What makes a store product graded? | For a consigned product, inventory decides: it is a slab only when inventory holds its item with a grader, whatever its collectible type. A house-stock product is a slab when its collectible type is a graded one (Q32). Any other consigned product is a raw card, recognised by its photos and never alerted. Corrects the draft, which counted every consigned product, and keeps Q3 and Q7a: the unit is the inventory item - decided by the round | Every consigned product, which alerts Operations for each consigned raw card for as long as it is listed |

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
| grade10-site/store/shelf-scanning | Blind pass: what happens to the items somebody imported into the scanner by hand before this change - does the first copy remove them, keep them beside the store's, or replace them where they match a store product? | Q34 |
| grade10-site/store/shelf-scanning | Blind pass: when is "the next copy" for an item changed on the scanner while the shop's catalogue sits idle - does the store's 5-minute re-read put it back even when nothing in the catalogue moved, or does it wait for the next real change? | Q25 |
| grade10-site/store/shelf-scanning | Blind pass: how many minutes is "every few minutes" for an open scanner, and is there one end-to-end bound a shopkeeper can hold - from a shop save to an open, untouched scanner showing it? | Q26 |
| grade10-site/store/shelf-scanning | Blind pass: what does the scanner hold when one party fails during a pass - the scanner unreachable, inventory unreachable, or a photo that cannot be fetched - does it keep the last version, drop a slab's grade and cert, or alert Operations? | Q27 |
| grade10-site/store/shelf-scanning | Blind pass: how soon does a grade or cert corrected in inventory reach the scanner when nothing about the product changes in the shop - at the 5-minute re-read, within 10 minutes, or only with the product's next change? | Q29 |
| grade10-site/store/shelf-scanning | Blind pass: where does Operations read the alert for a slab held without a unit, and does it repeat on every pass and clear once the slab is fixed? | Q28 |
| grade10-site/store/shelf-scanning | Blind pass: which product does the scanner name when two store products that are not slabs share the same art - two raw listings of one card, say in different languages or conditions? | Q20 |
| grade10-site/store/shelf-scanning | Blind pass: what does the scanner name for a raw copy of a card the store sells only as a slab, whose photos show the same art - the slab's product without grade or cert, or nothing? | Q21 |
| grade10-site/store/shelf-scanning | Blind pass: how does the store know a house-stock product is a slab when it names no item - which fact marks it graded, so that it is held without grade or cert and alerted rather than held as a raw card? | Q32 |
| grade10-site/store/shelf-scanning | Blind pass: is a slab's cert something the store shows publicly? The scan shows grade and cert on a link that "shows only what the store shows publicly", while Q7a rejected typing certs on the product because it would make them public on the storefront. | Q19 |
| grade10-site/store/shelf-scanning | Blind pass: what does a retired link show once the key is rotated - an error naming the link as retired, a not-found page, or the scanner refusing every scan - and how do shopkeepers learn the new link? | Q22 |
| grade10-site/store/shelf-scanning | Blind pass: an automatic discount that starts or ends changes no product - how soon does the scanner's price follow it, and does the scan show the higher price struck through as the product page does? | Q23 |
| grade10-site/store/shelf-scanning | Blind pass: in which language does a scan show the title - the store's default, or the locale the shopkeeper's phone or link asks for, as the store's /tc and /sc pages do? | Q24 |
| grade10-site/store/shelf-scanning | Blind pass: what does the scanner learn from a product with more photos than an item holds - which photos, in what order, and is the rest dropped silently? | Q31 |
| grade10-site/store/shelf-scanning | Blind pass: when the store opens on production, does the store-page link appear on production's scan without any other change, or does it need its own release step? | Q33 |
| grade10-site/store/shelf-scanning | Supplementary blind pass: what does a scan name when its photos match two store products of one art and at least one is a slab - two slabs of one card with no label read (a PCGS pair, say), a raw listing beside a slab listing of one card, or a raw copy of a card the store sells as two slabs? Both to pick, as Q20 does for non-slabs, or the closest only? | Q36 |
| grade10-site/store/shelf-scanning | Supplementary blind pass: Q35 measures the 10 minutes for a change only the store's re-read finds from the store's copy taking it - but the re-read is when the copy takes it, so is that bound the same 5 minutes as a reported change, or are the 10 minutes measured from the shop's save? | Q35 |
| grade10-site/store/shelf-scanning | Supplementary blind pass: which cert forms does the scanner read for each grader it reads, so a tester can set a cert in a form it cannot (Q30)? | Q37 |
