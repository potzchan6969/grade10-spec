**Author:** @ecchochan - 2026-10-13

## Why

Shop staff cannot point the card scanner at a product on the shelf and see
what the store sells it as. The scanner knows only items somebody imported by
hand, so its titles, prices and stock drift from the store's catalogue the day
after an import, and a slab on the shelf names its card but not the copy the
store lists.

**Metric:** share of published store products the scanner holds with the
store's current title, price and stock. Unmeasured; the first delivery sets
the baseline, and it should sit at 100% within 5 minutes of any catalogue
change.

## What Changes

- **Every published product reaches the scanner** — the store keeps the
  scanner's items in step with its catalogue within 5 minutes, sold-out
  products included and shown as sold out, so staff never meet a stale price
- **A product that leaves the store leaves the scanner** — unpublishing or
  deleting it removes its item at the next pass
- **Sealed boxes are synced now** — the scanner holds them so they need no
  second pass later, though it cannot recognise a box from its product photos
  until its box detector ships
- **A slab resolves to its own unit** — a slab's product carries the grader,
  grade and cert of the one slab it sells, so the scanner reading that label
  names the exact product, not only the card. A consigned slab takes them from
  its inventory item; a stock keeper writes them on a house-stock product. A
  slab with neither is held by its card and counted
- **Staff open the scanner from a link the store hands out**
- **Photos are learned hourly on staging and production** — a product's new
  photos become recognisable within the hour on both, and a run with nothing
  new does nothing
- **What staff see** — a recognised product shows its title, price, stock and
  a link to its store page

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- `grade10-site/store/shelf-scanning`: the scanner holding every published
  store product, a slab as its exact unit, photos learned hourly, and what
  staff see when they scan a shelf

### Modified Capabilities

None.

## Impact

- **Store service** — `packages/grade10-store/backend` gains a pass that keeps
  the scanner's items in step, and a `SCANNER` binding in
  `apps/backend/grade10/store/wrangler.jsonc` on staging and production
- **Scanner** — `apps/backend/grade10/tcg-ar`: an upsert that changes nothing
  changes nothing; a contract the store can import; the hourly photo run on
  production in `.github/workflows/tcg-ar-ops.yml`
- **Inventory** — the store reads a consigned slab's grader, grade and cert
  from the inventory item it sells; the store holds no binding that returns
  them today
- **Shop** — a house-stock product gains a place for its slab's grader and
  cert, which stock keepers fill
- **Docs** — `docs/architecture/commerce.md` and
  `docs/architecture/multi-product.md` name the store's new binding;
  `apps/backend/grade10/tcg-ar/docs/PLATFORM.md` moves the sync from the
  inventory service to the store

## References

- [Shelf Scanning · What the Scanner Holds](../../../docs/prds/products/grade10-site/store/shelf-scanning.md#what-the-scanner-holds)
- [Shelf Scanning · Slabs](../../../docs/prds/products/grade10-site/store/shelf-scanning.md#slabs)
- [Shelf Scanning · Sealed Boxes](../../../docs/prds/products/grade10-site/store/shelf-scanning.md#sealed-boxes)
- [Shelf Scanning · Photos](../../../docs/prds/products/grade10-site/store/shelf-scanning.md#photos)
- [Shelf Scanning · On the Shelf](../../../docs/prds/products/grade10-site/store/shelf-scanning.md#on-the-shelf)
- [Product Listing · Product Data](../../../docs/prds/products/grade10-site/store/product-listing.md#product-data)

## Follow-on changes

- Sealed boxes recognised on the shelf once the scanner's box detector ships
- Staff open the scanner signed in, rather than through a link
