## Goals

- Staff point the scanner at any product on the shop's shelf and see the
  store's title, price, stock and a link to its page.
- The scanner holds every published store product within 5 minutes of a
  catalogue change, and drops one the store no longer publishes.
- A slab on the shelf names the exact store product it is, not only its card.
- A product's new photos become recognisable within the hour on staging and
  production.

## Non-Goals

- **Recognising sealed boxes** — synced now, recognised once the scanner's box
  detector ships.
- **Selling from the scanner** — the link opens the store page; the scanner
  takes no order and holds no stock.
- **Products the store does not publish** — a product kept off the store's
  sales channel stays off the scanner; every shelf product is published.
- **The ZZZ store** — its catalogue is not synced here.
- **Staff sign-in on the scanner** — staff open `/scan` through a link the
  store hands out.
- **Editing items in the scanner** — the store's catalogue is the only source;
  an item changed in the scanner is put back at the next pass.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Which store products does the scanner hold? | Every published product; a sold-out one stays and reads "Sold out" - decided by the owner | Only collectibles, which leaves merch on the shelf unscannable; only in-stock products, which makes a sold-out shelf item look unknown |
| Q2 | Are sealed boxes synced before the scanner can recognise them? | Yes, now; the scanner cannot recognise a box from its product photos until its box detector ships - decided by the owner | Excluding sealed boxes until then, which needs a second change to add them back |
| Q3 | Does a slab resolve to its card or to its exact unit? | Its exact unit: the store joins the product to the inventory item it sells and carries that item's grader, grade and cert - decided by the owner | Card-level match only, which names the card but not which copy the store lists |
| Q4 | How fresh is the scanner? | Products in step every 5 minutes; photos learned hourly on staging and production; a photo run with nothing new does nothing - decided by the owner | Production photo runs only when somebody starts one by hand, which leaves new photos unrecognised there |
| Q5 | Which service keeps the scanner in step? | The store, on its own 5-minute schedule, through a binding to the scanner - decided by the round | The inventory service, as the scanner's docs had it, which does not own the published catalogue; the shop's change reports alone, which miss what the shop never reports |
| Q6 | What does "nothing new" compare? | Each item's synced fields and its photo list against what the scanner already holds; an item that matches is not written, so the scanner neither queues photos nor rebuilds its files - decided by the round | Rewriting every item each pass, which marks the scanner changed every 5 minutes and rebuilds its files on every scan |
| Q7a | How does a house-stock slab, made on the shop and joined to no inventory item, name its unit? | The stock keeper writes the grader and cert on the shop product, and the store reads them - decided by the owner (recommended) | Holding house stock by its card alone, which leaves Q3 true only for consigned slabs; joining house stock to inventory items, which needs inventory to own the shop's products |
| Q7 | What does a slab with no resolvable unit do? | Held by its card alone, without grade or cert, and counted so the gap shows - decided by the owner (recommended) | Left off the scanner until its unit is known, which hides a product the store sells |
| Q8 | What does the scanner show on a sealed box it cannot recognise? | What it shows for anything it does not recognise, "Not recognised yet — hold steady" - decided by the owner (recommended) | A box-specific hint, which the box detector makes obsolete |
| Q9 | Who opens the scanner on the shop floor? | Shop staff, through a link the store hands out; the prices it shows are the store's public prices - decided by the owner (recommended) | Signed-in staff only, which needs a sign-in on the scanner and is a change of its own |
| Q10 | Is ZZZ in scope? | No, grade10's store only - decided by the owner (recommended) | ZZZ's store in the same change, with its own scanner project |
| Q11 | Are till-only products on the shelf? | No: every shelf product is published to the store's channel, so the scanner misses none - decided by Operations (recommended) | Syncing products the store does not publish, which reaches past the store's catalogue |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
