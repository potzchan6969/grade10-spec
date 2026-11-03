---
title: Consignment Dashboard
order: 3
---

One internal view for consignment staff to turn vaulted cards into
consignments, and consignments into sales, faster. The measure is conversion:
the share of vaulted cards that get consigned, and the time it takes.

## Conversion List

- 🚧 **Cards** — vaulted cards that are earning and not consigned, one row a card
  - **Row** — owner, market price, liquidity, days in the vault, incentive paid so far, last contact
  - **Ranking** — by how likely the card is to sell: liquidity and market price first, then days in the vault
  - **Filters** — price tier, liquidity, days in the vault, owner type, contact status
  - **Flagged** — a card that has earned for 90 days, an admin setting, without being consigned

## Owner Outreach

- 🚧 **Email** — from the row, with the card's market price and a link to the consign form
- 🚧 **Contact Log** — a call or message logged by hand with its outcome: interested, not now, declined
- 🚧 **Last Contact** — shown on every card, so nobody is contacted twice in a short time
  - **Contact Limit** — 30 days by default, an admin setting; inside it, staff are warned before an email, and a call is still logged
- 🚧 **Declined** — leaves the list until staff bring it back

## Approval Queues

- 🚧 **Consignment Approval** — consignments waiting for approval, oldest first, with how long each has waited - [Consigning](/p/grade10-site/consignment/consigning#listing-approval)
  - **Row** — the collector's lowest acceptable price against the market price, and any low price the collector confirmed
  - **Act in the Row** — approve, reject with a reason, set the list or starting price
  - **Bulk Approve** — rows with nothing flagged
- 🚧 **Incentive Approval** — cards waiting to be approved to earn, oldest first, with the price match and liquidity beside each; a card approved at intake doesn't appear - [Incentive](/p/grade10-site/vault/incentive#earning)
- 🚧 **Approval Target** — 2 business days by default, an admin setting; a consignment past it turns amber and moves to the top

## On-Sale Monitor

- 🚧 **Cards on Sale** — by channel and days on sale
- 🚧 **Slow Cards** — a card with no sale after 45 days, an admin setting, is flagged, so staff can lower its list price, below the lowest acceptable price only once the consignor agrees, or offer the consignor a new consignment in the other channel
- 🚧 **Unsold Lots** — auction lots that ended unsold, to hand off or relist

## Conversion Funnel

- 🚧 **Steps** — vaulted, approved to earn, consigned, approved for sale, sold, for any date range
- 🚧 **Time Between Steps** — the median, and where cards wait longest
- 🚧 **Cuts** — by price tier, owner type and channel
- 🚧 **Cost** — incentive paid per consigned card, against commission earned

## Who Sees It

- 🚧 **Consignment Staff** — all of it
- 🚧 **Not Shown** — ID and bank details stay with finance

:::detail{title="Product decisions" for="pm"}
The model only pays off when vaulted cards become consignments, and the online
form leaves staff with two queues to clear and a list of cards nobody has asked
about.

- **One view for the conversion work** — list, outreach, approvals, the on-sale monitor and the funnel together, rather than separate tools staff move between
- **Ranked by how likely to sell** — liquidity and market price lead, so staff ask about the cards most likely to sell first
- **No ID or bank details** — they stay with finance
- **Not in scope** — contacting owners in bulk automatically; the collector's own dashboard
:::
