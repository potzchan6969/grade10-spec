---
title: Store Listings
order: 10
---

How an item goes on sale in the store: one Shopify product a Grade10 admin
creates, describes, prices and takes down, whether a collector consigned the
item or the house owns it.

## The Listing

- 🚧 **One Product an Item** — every item the store sells is one product with
  one unit, a consigned item or house stock alike; any category, graded or not
  - **Created by Grade10** — the store creates it when the item is listed;
    nobody makes a listed item's product in the Shopify admin, and an item never
    takes over a product it didn't create
  - **Consigned** — listed at approval, under the consignment's mark -
    [Consigning](/p/grade10-site/consignment/consigning#listing-approval)
  - **House Stock** — listed from the item page's Sell as house stock, under the
    store's mark - [Services and Hand-offs](/p/grade10-admin/inventory/services#applying-an-item)
  - **Ended** — taken off sale, the product is archived and kept: an item
    keeps one product for life, so a relisted item comes back on the same
    product and link
- 🚧 **Managed Here** — the listing is run from the admin panel: a consigned
  item's from its consignment, house stock's from its store listing; never
  from the Shopify admin - [Admin Homes](#admin-homes)
- 🚧 **Phase 1: the Tills** — listed items sell at the shop's tills and events
  until online opens; each is also published to grade10.com, which sells
  nothing while the store is closed, so the shelf scanner names it -
  [Shelf Scanning](/p/grade10-site/store/shelf-scanning#slabs)

## What the Product Shows

Every field below comes from the item and is sent again whenever it changes.

| Field | From |
| --- | --- |
| 🚧 Title | the item's title as inventory holds it now |
| 🚧 Description | the item's description, then its grader, grade and cert |
| 🚧 Photographs | the item's photographs, in their order, sent again when they change |
| 🚧 Price | the listing's price |
| 🚧 Barcode | the item's label code, so the till rings it by scanning the label |
| 🚧 Worlds | the IP of the product the item is an instance of |
| 🚧 Type | the item's category, graded or sealed |
| 🚧 Language | the product's language |
| 🚧 Owner | consigned or house stock, which a discount's collection reads |
| Seller Name | the consignor's display name, only when turned on - [Consigning](/p/grade10-site/consignment/consigning#seller-name) |
| Channels, Location, On Sale | what staff chose, and whether it is on sale |

- ❓ **Where the Seller Name Shows** — on the product page, the card or both.
  Product confirms
- 🚧 **Filters** — worlds, types and language are what the store's filters
  choose from, so a listed item is found like any other product -
  [Product Listing](/p/grade10-site/store/product-listing#filters)
  - **Missing Filters** — an item with no product linked, a tag with no filter
    chosen, or a choice the shop lacks leaves that filter empty and flags the
    listing, naming which; it still sells
- ❓ **Before Online Opens** — no listing is flagged Missing Filters. Product
  confirms
- 🚧 **A Shop Edit Is Undone** — a change in the Shopify admin to any field
  above but its channels is written back; a channel set there stays until
  staff choose again
- **Left to the Shop** — collections, promotion groups, search wording and the
  page's template stay the Shopify admin's

::image{src="assets/diagrams/store-listing.svg" alt="An item is listed at consignment approval or as house stock, and keeps one Shopify product for life; staff set the price on the listing's home, and later a rule quote from inventory may set it; every change is sent to the shop, and the store reads the product back, writing back any shop edit to a field it holds"}

## Admin Homes

| Listing | Its home, where every act runs |
| --- | --- |
| Consigned | the consignment record: price, a price below the floor on the consignor's yes, placement and flags - [Consignment Console](/p/grade10-site/consignment/operator-console#one-consignment) |
| 🚧 House stock | Store → Listings → the listing: price, floor, placement, flags, the price history, ending it |
| 🚧 Every listing | Store → Listings: one list by owner, state and flag, each row opening its home |

- **The Item Page** — adds nothing: its Services part links the store's mark
  to the listing's home, and Values shows the list price -
  [Inventory Console](/p/grade10-admin/inventory/console#the-item-page)

## The Price

- 🚧 **Set on Its Home** — staff change the price on the consignment, or on
  the house listing; it reaches the shop in moments
- 🚧 **The Floor** — the lowest the price goes
  - **Consigned** — the lowest acceptable price the collector set; lower
    only once the consignor agrees -
    [Consigning](/p/grade10-site/consignment/consigning#at-the-store)
  - **House Stock** — its cost, while an admin setting is on; a cost that
    changes after listing flags the listing, and the price stays
    - **Below Cost, One Listing** — an admin allows one listing below its
      cost, with the reason kept in its price history
- 🚧 **Price History** — every change, with who made it, staff or the rule,
  when, the price before and after, and why
- **An Open Order** — a price change doesn't reach an order already placed;
  the order's price stands
- **The Consignor Is Told** — a staff change to a consigned item's price
  emails the collector - [Consigning](/p/grade10-site/consignment/consigning#notifications)

## Pricing by Rule

Later: a listing can follow a rule instead of a staff price.

- **Manual or Rule** — each listing is one or the other; a new listing starts
  manual
  - **A Staff Price** — switches the listing back to manual
  - **Switching to the Rule** — refused while the price is below the floor,
    or the listing has no floor
- **Market Price** — what the rule starts from, chosen per listing:
  - **SNKRDUNK** — the latest counted sale of the item's SNKRDUNK pair, from
    the sales inventory already keeps; a sale staff excluded doesn't count
  - **PriceCharting** — the price at the item's exact grade, from the
    product's PriceCharting match: ungraded, PSA 1 to 10, or PriceCharting's
    whole grades 7 to 9 for any grader -
    [Products and Stock](/p/grade10-admin/inventory/catalog#current-reference)
  - **Fixed Price** — the price staff entered in a market price's place
  - **In the Store's Dollars** — converted from yen at the day's rate
- **The Rule** — one rule for every listing, from the market price:

```text
price = market price × (1 + markup)
price = rounded once to the rule's step
price = never below the floor
changed only when it moves at least the rule's minimum move
```

- **Hourly** — the rule's price is applied each hour, as a price change like
  a staff one, in the history with what it was worked from
- **Held** — the price stays, with the reason shown, when there is no market
  price; the sale is flagged, an outlier or older than SNKRDUNK's week; fewer
  than 4 sales back it; the item's grade has no PriceCharting price ("no grade
  price"); or the listing has no floor
- **The Consignor's Digest** — a weekly email naming each price the rule
  moved, from and to; none for a week with no move -
  [Consigning](/p/grade10-site/consignment/consigning#notifications)
- **Preview** — the price the rule would set shows beside the price, before
  anyone switches a listing to the rule
- ❓ **The rule's values** — the markup, the step and the minimum move.
  Product confirms

:::detail{title="Product decisions" for="pm"}
The store's catalogue is Shopify's, made by hand. An item is different: one
unit, already described, photographed and priced in Grade10, and for a
consigned item the price answers to an agreement. So Grade10 creates and runs
its product, and the shop is where it sells.

- **Grade10 creates every item's product** — no product made in the Shopify
  admin is ever taken over, so nothing listed was described by hand - owner,
  2026-11-03
- **No hand-made house-slab product** — none exists, so every Grade10 product
  is joined through its store listing, and stock keepers no longer write label
  codes in the shop - owner, 2026-11-03
- **Any item, one unit** — every item is one unit, consigned or house stock, in
  any category - owner, 2026-11-03
- **Phase 1 publishes to grade10.com** — a listed item is published to the
  website's channel too, so the shelf scanner names it; nothing sells online
  while the store is closed, rather than the scanner going blind to listings
  until online opens - owner, 2026-11-03
- **One home per listing kind** — a consigned listing on its consignment
  record, house stock on its store listing; the item page only links, so a
  price is never changed in two places - owner, 2026-11-03
- **House stock's floor is its cost** — an admin setting that can be switched
  off - owner, 2026-11-03; one listing may go below its cost on an admin's
  exception with a reason, so selling one slab cheaply doesn't lift the floor
  for every listing - owner, 2026-11-03
- **The rule prices from the latest sale** — SNKRDUNK's latest counted sale
  from the sales inventory already keeps, with staff exclusions, rather than a
  new SNKRDUNK worker method; or PriceCharting at an exact grade, any other
  grade held; or a fixed price staff entered - owner, 2026-11-03
- **Consignors hear of the rule weekly** — one digest when a price moved,
  rather than an email a change, which a volatile week would turn into a
  burst - owner, 2026-11-03
- **Missing filters never stop a sale** — the listing is flagged, naming its
  fix: staff link the product or pick the tag's filter; a choice the shop
  lacks is engineering's. A consignor's sale isn't held on a gap in the
  taxonomy
- **Not in scope** — products with stock counted in units, which stay the
  Shopify admin's; a collector setting the list price
:::

:::detail{title="How it works" for="engineer"}
- **One product for life** — the store keeps one product row an item, and a
  listing a consignment or house sale beside it; one write path creates the
  product once, then writes each section that moved, safe to repeat
- **Custom data** — each filter's choice is a handle on inventory's tag,
  picked from the shop's committed rows; the store finds each shop's own row
  by handle when it writes
- **Shop edits** — after each write the store reads the product back; a
  webhook or a six-hourly sweep finds a managed section that differs, and it
  is written back
- **Market prices** — inventory answers the rule's quote from the SNKRDUNK
  sales it stores, and each price owner applies it under its own lock
:::
