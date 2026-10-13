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
  sales channel stays off the scanner.
- **The ZZZ store** — its catalogue is not synced here.
- **Staff sign-in on the scanner** — how staff open `/scan` is unchanged.
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
| Q7a | How does a house-stock slab, made on the shop and joined to no inventory item, name its unit? | ❓ Product - recommended: the stock keeper writes the grader and cert on the shop product, and the store reads them | Holding house stock by its card alone, which leaves Q3 true only for consigned slabs; joining house stock to inventory items, which needs inventory to own the shop's products |
| Q7 | What does a slab with no resolvable unit do? | ❓ Product - recommended: synced at card level, without grader, grade or cert, and counted so the gap shows | Left off the scanner until its unit is known |
| Q8 | What does the scanner show on a sealed box it cannot recognise? | ❓ Product - recommended: what it shows for any unrecognised item, "Not recognised yet — hold steady" | A box-specific hint that names the limit |
| Q9 | Who opens the scanner on the shop floor? | ❓ Product - recommended: shop staff, through a link the store hands out | Signed-in staff only, which needs a sign-in on the scanner and is a change of its own |
| Q10 | Is ZZZ in scope? | ❓ Product - recommended: no, grade10's store only | ZZZ's store in the same change, with its own scanner project |
| Q11 | Are POS-only products on the shelf? | ❓ Operations - recommended: every shelf product is published to the store's channel, so none is missed | Syncing products the store does not publish, which reaches past the store's catalogue |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
