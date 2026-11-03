---
title: Inventory and Sales Channels
order: 9
---

Where the store's stock sits, and the channels that sell it.

## Inventory Location

- **One Selling Location** — the shop in Causeway Bay; every channel sells from its stock, the store's own and consigned cards alike
  - **Online Orders** — filled from the shop
  - **Events** — the till at an event sells from the shop's stock
- **KEC Warehouse** — Kerry Logistics' warehouse, where some of the store's stock is kept; the shop replenishes from it, and nothing sells from it directly
  - **Filling Online Orders** — a Kerry location set to fill online orders is flagged to be turned off
- **Kerry Logistics** — also the shipping partner: it comes to the shop, takes the stock that ships and ships it
- **The Vault's Custody** — where a vaulted card is held, the shop or the KEC warehouse, is the vault's own record, never a Shopify location - [Vault Intake](/p/grade10-site/vault/intake#custody)
  - 🚧 **Inventory's Places** — the vault names inventory's sites and units, Taken At and Kept At, so the item page and the vault name one place - [Locations](/p/grade10-admin/inventory/locations#places)

## Sales Channels

| Channel | Sells |
| --- | --- |
| Point of Sale | at the shop's till, in Causeway Bay and at events |
| grade10.com | in the online store |
| SuperPacks | in a partner's storefront |

- **Same Stock** — every channel sells the shop's stock; the first sale wins and the product comes off the others - [Consigning](/p/grade10-site/consignment/consigning#at-the-store)
- 🚧 **Consigned Cards** — sold on Point of Sale only, at the shop and events
- 🚧 **An Item's Product** — every item on sale is one product with one unit, created and priced from the admin panel - [Store Listings](/p/grade10-site/store/store-listings)
- **Marketplace** — online, later, with no date; one more channel on the same stock

:::detail{title="Product decisions" for="pm"}
- **One selling location** — every channel reads the same count, so a card can't sell twice from two places; stock kept at the KEC warehouse reaches a buyer only once the shop has replenished from it
:::
