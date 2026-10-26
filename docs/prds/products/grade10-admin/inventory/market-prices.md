---
title: Market Prices
order: 8
---

| Setting | Default |
| --- | --- |
| Window | the last **30** days of sales, topped up from **90** |
| Snapshot | one per reference per week, as of Sunday, from what was observed before Monday 06:00 |
| An old observation | full for **7** days without a successful read, nothing at **42** |
| Currency | the source's own; valued in HKD at the admin's rate in force on the day it is used |
| Exchange rate | HKD per JPY, set exactly by an admin, from the next day |

## A Market Reference

What an item is on the market: a product's page on a marketplace and the
exact grade or condition the item matches.

- 🚧 **Attached at intake** - staff attach a SNKRDUNK page and the grade or
  condition, such as PSA 10 or a raw card in A condition, and a second
  person checks both; items of one product and grade share one reference
- 🚧 **The exact grade** - PSA 10 is never read with PSA 9, nor A with B; a
  grade SNKRDUNK does not list maps only to an equal or lower one it does,
  or the item takes a set price
- 🚧 **Fetched daily** - each reference in use is read once a day, politely
  paced, and every read is recorded, failed or not
- 🚧 **Typed by staff** - when fetching fails, staff read the page and type
  each sale it shows, its day, price and grade; a read that finds nothing
  new is recorded too, and counts as a successful read
- **The catalogue's current reference** - PriceCharting's confirmed
  identity and current USD prices stay the catalogue's, a cache with no
  history - [Products and Stock](/p/grade10-admin/inventory/catalog#current-reference)

## The Week's Snapshot

- 🚧 **One per week, never changed** - each reference in use takes one
  snapshot as of each Sunday: its value, the sales it used, how many days
  sold, how widely they spread, its liquidity factor and where the figures
  came from; once written it stands, so every credit worked from it can be
  worked again
- 🚧 **A cutoff, not a race** - a snapshot reads only what was observed
  before Monday 06:00, so one taken late is the one that would have been
  taken on time, and a late observation improves the next week
- 🚧 **A sale counts once** - every sale observed is kept with its day,
  price and grade, and each source and each read is recorded, so overlapping
  reads add only what is new
- 🚧 **A failed read is not a quiet market** - while reads fail, the
  snapshot is taken as of the last good read and its factor fades with the
  read's age; while reads succeed and nothing sells, the sales age and the
  factor falls on its own
- 🚧 **A print out of line** - a sale above twice or below half the current
  value waits for a second person to confirm it, and is never dropped
  unseen
- 🚧 **A card gone quiet** - one that sold on four days a month or more and
  then shows no sale for **14** days of good reads is flagged, since a moved
  page is likelier than a market that stopped
- 🚧 **One function** - the value and the factor are worked out by one
  function, the same for every reader -
  [Yield](/p/grade10-site/vault/yield#the-value)

## Exchange Rate

- 🚧 **The admin's rate** - HKD per JPY, typed exactly; a rate set today
  applies from tomorrow, and every credit names the rate it used
- 🚧 **A big move** - a rate more than **5%** from the one standing takes a
  second admin
- 🚧 **A stale rate** - one older than **30** days badges for review
- **Who** - `inventory:settings`; every change on the audit chain

:::detail{title="Product decisions" for="pm"}
The vault's yield pays a day's credit from a week's price, so the price a
credit was worked from has to be kept and found again; the catalogue's
current reference is a cache that keeps no history, and the two stay
separate. The working behind the value and the factor is
[Vault Yield Liquidity](/references/vault-yield-liquidity).

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Inventory owns market prices | Decided | Inventory already owns product identity and provider access, so market references, observations and snapshots are its; the vault and consignment ask it - 2026-10-26 | Engineering |
| A snapshot per week, kept | Decided | Unlike the catalogue's current reference, a snapshot is history the yield is paid from; it is written once per reference per week and never replaced - 2026-10-26 | Engineering |
| Eventually right | Decided | A week reads what was observed before its cutoff, so it is the same whenever it is worked, and late observations reach the next week - on the owner's direction, 2026-10-26 | Owner |
| Every read is kept | Decided | Which source read what, when, and what it saw, so a failed read is told apart from a quiet market - 2026-10-26 | Engineering |
| Fetching SNKRDUNK | Decided | SNKRDUNK consents to the house reading its sales; a daily fetch with staff typing as the fallback - 2026-10-26 | Owner |
| The exchange rate | Decided | An admin's exact rate, applied from the next day, as consignment's auction rate is; the platform fetches no rate - 2026-10-26 | Finance |
:::
