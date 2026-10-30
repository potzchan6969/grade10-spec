**Author:** @ecchochan - 2026-10-13

## Why

Shopkeepers cannot point the card scanner at a product on the shelf and see
what the store sells it as. The scanner knows only items somebody imported by
hand, so its titles, prices and availability drift from the store's catalogue
the day after an import, and a slab on the shelf names its card but not the
copy the store lists.

**Metric:** share of published store products the scanner holds with the
store's current title, price and availability. Unmeasured; the first delivery
sets the baseline, and it should sit at 100% within 11 minutes of any catalogue
change.

## What Changes

- **A shopkeeper scans any shelf product and sees the store's answer** —
  title, price with automatic discounts, Available or Sold out, and a link to
  its store page, for every product the store publishes but gift cards
- **The scanner follows the store's catalogue** — within 6 minutes of a change
  the shop reports, within 11 of one only the store's re-read finds; a product
  the store drops, and a sold consigned slab, leave it
- **An open scanner stays current** — it refreshes its catalogue every few
  minutes and when the shopkeeper returns to it
- **A slab names its own copy** — the scanner reading a slab's label names the
  one product that sells it, with grade and cert read from the inventory item
  the product names; a stock keeper writes a house-stock slab's label code on
  its product, and a slab with no known unit is recognised by its photos and
  alerted to Operations
- **The store's product beats the shared card catalogue** — where both match
  the same art, the scanner names the store product
- **Products the scanner cannot yet recognise are held now** — sealed boxes,
  merch and comics carry their details today and are recognised once the box
  detector ships
- **New photos are recognisable at the next photo run, every two hours, on staging and production** —
  a run with nothing new costs nothing
- **Production's scanner works before the store opens there** — the store-page
  link appears only where the store is carried
- **Shopkeepers open the scanner from one fixed link** — bookmarked or printed
  as a QR code, scan-only, retired by rotating its key

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- `grade10-site/store/shelf-scanning`: the scanner holding every published
  store product, a slab as its exact unit, photos learned every two hours, and what a
  shopkeeper sees when they scan a shelf

### Modified Capabilities

None.

## Impact

- **Store service** — `packages/grade10-store/backend` gains a pass that keeps
  the scanner's items in step with its catalogue mirror, and a `SCANNER`
  binding in `apps/backend/grade10/store/wrangler.jsonc` on staging and
  production
- **Scanner** — `apps/backend/grade10/tcg-ar`: an upsert that changes nothing
  writes nothing; a contract the store can import; store items ranked above
  the shared card catalogue; an open scanner's periodic refresh; the photo run
  on production in `.github/workflows/tcg-ar-ops.yml`
- **Inventory** — a store entrypoint returning the grader, grade and cert of
  the items store products name; the store holds no binding that returns them
  today
- **Shop** — a house-stock product gains a place for its slab's label code
- **Operations** — an alert on slabs held without a unit; `/scan/*` bypasses
  Cloudflare Access
- **Docs** — `docs/architecture/commerce.md` and
  `docs/architecture/multi-product.md` name the store's new binding;
  `apps/backend/grade10/tcg-ar/docs/PLATFORM.md` moves the sync from the
  inventory service to the store

## References

- [Shelf Scanning · What the Scanner Holds](../../../docs/prds/products/grade10-site/store/shelf-scanning.md#what-the-scanner-holds)
- [Shelf Scanning · Slabs](../../../docs/prds/products/grade10-site/store/shelf-scanning.md#slabs)
- [Shelf Scanning · Recognition](../../../docs/prds/products/grade10-site/store/shelf-scanning.md#recognition)
- [Shelf Scanning · Photos](../../../docs/prds/products/grade10-site/store/shelf-scanning.md#photos)
- [Shelf Scanning · On the Shelf](../../../docs/prds/products/grade10-site/store/shelf-scanning.md#on-the-shelf)
- [Product Listing · Product Data](../../../docs/prds/products/grade10-site/store/product-listing.md#product-data)
- [Product Status · Availability](../../../docs/prds/products/grade10-site/commerce/product-status.md#availability)
- [Carried Surfaces](../../../docs/prds/products/grade10-site/site/carried-surfaces.md)

## Follow-on changes

- Sealed boxes, merch and comics recognised on the shelf once the scanner's box
  detector ships
- Shopkeepers add photos from the scanner to make a product recognisable
