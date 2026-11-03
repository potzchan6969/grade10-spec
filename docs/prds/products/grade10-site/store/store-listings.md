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
  - **Ended** — taken off sale, the product is archived and kept, so a relisted
    item comes back on the same product and link
- 🚧 **Managed Here** — the listing is run from the admin panel, never from the
  Shopify admin - [Inventory Console](/p/grade10-admin/inventory/console#the-item-page)

## What the Product Shows

Every field below comes from the item and is sent again whenever it changes.

| Field | From |
| --- | --- |
| 🚧 Title | the item's title |
| 🚧 Description | the item's description, then its grader, grade and cert |
| 🚧 Photographs | the item's photographs, in their order, sent again when they change |
| 🚧 Price | the listing's price |
| 🚧 IP | the IP of the product the item is an instance of |
| 🚧 Type | the item's category, graded or sealed |
| 🚧 Language | the product's language |
| 🚧 Label Code | the item's label code, which the shelf scanner reads - [Shelf Scanning](/p/grade10-site/store/shelf-scanning) |
| 🚧 Grader, Grade and Cert | the item's own, each in a field of its own |
| Seller Name | the consignor's display name, only when turned on - [Consigning](/p/grade10-site/consignment/consigning#seller-name) |
| 🚧 Pricing | whether a rule sets its price |
| Channels, Location, On Sale | what staff chose, and whether it is on sale |

- 🚧 **Filters** — IP, type and language are what the store's filters choose
  from, so a listed item is found like any other product -
  [Product Listing](/p/grade10-site/store/product-listing)
  - **Missing Filters** — an IP, type or language the store has no filter
    choice for leaves that filter empty and flags the listing; it still sells
- 🚧 **A Shop Edit Is Undone** — a change in the Shopify admin to any field
  above is written back to what Grade10 holds
- **Left to the Shop** — collections, promotion groups, search wording and the
  page's template stay the Shopify admin's

::image{src="assets/diagrams/store-listing.svg" alt="An item is listed at consignment approval or as house stock; the store creates its product with the item's details, filters and price, and sends any change again; a price is set by staff or, later, by a rule from the latest sale, never below the floor; a shop edit to a managed field is written back"}

## The Price

- 🚧 **Set in the Admin Panel** — staff change the price on the item page or in
  the store's listings list; it reaches the shop in moments
- 🚧 **Never Below the Floor**
  - **Consigned** — the lowest acceptable price the collector set -
    [Consigning](/p/grade10-site/consignment/consigning#terms)
  - **House Stock** — its cost; an admin setting that can be switched off
- 🚧 **Price History** — every change, with who made it, staff or the rule,
  when, the price before and after, and why
- **The Consignor Is Told** — a consigned item's price change emails the
  collector - [Consigning](/p/grade10-site/consignment/consigning#notifications)

## Pricing by Rule

Later: a listing can follow a rule instead of a staff price.

- 🚧 **Manual or Rule** — each listing is one or the other; a new listing starts
  manual
  - **A Staff Price** — switches the listing back to manual
- 🚧 **Market Price** — what the rule starts from, chosen per listing:
  - **SNKRDUNK** — the latest sale of the item's SNKRDUNK pair
  - **PriceCharting** — the price at the item's grade, from the product's
    PriceCharting match - [Products and Stock](/p/grade10-admin/inventory/catalog#current-reference)
  - **Fixed Price** — the price staff entered in a market price's place
  - **In the Store's Dollars** — converted at the day's rate
- 🚧 **The Rule** — from the market price:

```text
price = market price × (1 + markup)
price = rounded to the rule's step
price = never below the floor
price = moved at most the rule's limit from today's price in one day
```

- 🚧 **Daily** — the rule runs once the day's market prices are in, and each
  change is a price change like a staff one: in the history, and emailed to a
  consignor
- 🚧 **Held** — the price stays, with the reason shown, when there is no market
  price, the day's price is flagged, or it is older than the rule allows
- 🚧 **Preview** — the price the rule would set shows beside the price, before
  anyone switches a listing to the rule
- 🚧 **Rules** — an admin sets them by IP and type, with one default
- ❓ **The rule's values** — the markup, the step, the daily limit and how old a
  price may be. Product confirms

:::detail{title="Product decisions" for="pm"}
The store's catalogue is Shopify's, made by hand. An item is different: one
unit, already described, photographed and priced in Grade10, and for a
consigned item the price answers to an agreement. So Grade10 creates and runs
its product, and the shop is where it sells.

- **Grade10 creates every item's product** — no product made in the Shopify
  admin is ever taken over, so nothing listed was described by hand - owner,
  2026-11-03
- **Any item, one unit** — every item is one unit, consigned or house stock, in
  any category - owner, 2026-11-03
- **House stock's floor is its cost** — an admin setting that can be switched
  off - owner, 2026-11-03
- **The rule prices from the latest sale** — SNKRDUNK's latest sale, or
  PriceCharting instead, or a fixed price staff entered - owner, 2026-11-03
- **Missing filters never stop a sale** — the listing is flagged for an admin
  to add the filter choice
- **Not in scope** — products with stock counted in units, which stay the
  Shopify admin's; a collector setting the list price
:::

:::detail{title="How it works" for="engineer"}
- **One send path** — consignment already sends each listed card as a
  versioned due row that the store applies to the shop by handle, safe to
  repeat; house stock joins the same path with the store as its owner
- **Custom data** — the filter fields and their choices are the shop's custom
  data committed with the store, so a listing fills only definitions the code
  knows, and a check fails when an IP, type or language has no choice
- **Shop edits** — the shop's product webhooks are compared with what the
  store last wrote, today for status and price, and a difference is written
  back
- **Market prices** — inventory's daily import; SNKRDUNK's latest sale waits on
  a new SNKRDUNK worker method
:::
