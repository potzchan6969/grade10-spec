---
title: Consignment Counter
audience: operator
order: 5
---

The admin console's New consignment: staff take a consignor's items in one
visit, in five steps - the consignor, the items, the terms, signing, and on
sale.

- 🚧 **Consignor** — an account found by name, email or phone, or a walk-in
  given a light account before the next step
  - **ID** — the ID type and number, in any Hong Kong or Taiwan format, kept
    masked - [Vault Intake](/p/grade10-site/vault/intake#intake-form)
  - **18 or Over** — a tick staff must give
  - **No Identity Check** — the online check waits for the first cash-out -
    [Earnings Wallet](/p/grade10-site/account/earnings-wallet#identity-check)
  - **Taken At** — required: the inventory location where the intake
    happens, the shop or a card event, and where every item starts in
    inventory - [Locations](/p/grade10-admin/inventory/locations#places)
  - **Heading To** — optional: the location the items move to next
- 🚧 **Items** — a list staff add to and remove from; staff move on once it
  holds an item, with no receive press per item
  - **Vault Case** — the items go into one vault case for the consignor, and
    each earns the vault's daily incentive as a vaulted card -
    [Vault Intake](/p/grade10-site/vault/intake#intake-form)
  - **Received Into Inventory** — each item is registered at Taken At, under
    the consignor, with its label printed
  - **Product** — found in the catalogue by name, set, number or Cert ID -
    [Products and Stock](/p/grade10-admin/inventory/catalog#product-schemas)
    - **A Product Nobody Has** — counter staff create it by the inventory
      classification and its schema; it is created only once the schema's
      required values are given, and never twice
  - **SNKRDUNK Card** — required; its 30-day median is the item's market
    price - [Incentive](/p/grade10-site/vault/incentive#daily-amount)
  - **Fixed Price** — entered by an admin only when the card has no SNKRDUNK
    listing to link; used wherever the SNKRDUNK median would be
  - **Earns Incentive** — a tick per item, on by default
  - **Photos** — front and back required for every item before the items
    are received, and more as staff choose; kept on the item
  - **Items Table** — each item's market price, photos and estimated
    incentive, to show the consignor
    - **Estimated Incentive** — about how much a day, and over a year, at
      today's market price and liquidity
- 🚧 **Terms** — per item, the channel, the lowest acceptable price, the
  commission and the minimum commission; Grade10 sets the list price later -
  [Consigning](/p/grade10-site/consignment/consigning#terms)
  - **No Incentive** — the vault's daily incentive replaces it
  - **No Payout Account** — the consignor names one at cash-out -
    [Earnings Wallet](/p/grade10-site/account/earnings-wallet#cash-out)
- 🚧 **Signing** — the Vault Terms for the case and the Consignment
  Agreement, together, on the counter tablet or by an emailed link
