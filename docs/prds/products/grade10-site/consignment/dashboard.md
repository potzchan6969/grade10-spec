---
title: Consignment Dashboard
order: 8
---

One internal view for consignment staff to turn vaulted cards into
consignments, and consignments into sales, faster. The measure is conversion:
the share of vaulted cards that get consigned, and the time it takes.

:::callout{kind="note"}
- ❓ **Not built yet** — no change carries it yet. Product confirms each target below
:::

## Conversion List

- **Cards** — vaulted cards that are earning and not consigned, one row a card
  - **Row** — owner, market price, liquidity, days in the vault, incentive paid so far, last contact
  - **Ranking** — by how likely the card is to sell: liquidity and market price first, then days in the vault
  - **Filters** — price tier, liquidity, days in the vault, owner type, contact status
  - **Flagged** — a card that has earned for a long time without being consigned

## Owner Outreach

- **Email** — from the row, with the card's market price and a link to the consign form
- **Contact Log** — a call or message logged by hand with its outcome: interested, not now, declined
- **Last Contact** — shown on every card, so nobody is contacted twice in a short time
- **Declined** — leaves the list until staff bring it back

:::callout{kind="note"}
- ❓ **Contact limit** — how soon the same owner may be contacted again. Product confirms
:::

## Approval Queues

- **Consignment Approval** — consignments waiting for approval, oldest first, with how long each has waited - [Consigning](/p/grade10-site/consignment/consigning#listing-approval)
  - **Row** — the collector's lowest acceptable price against the market price, and any low price the collector confirmed
  - **Act in the Row** — approve, reject with a reason, set the list or starting price and the starting channel
  - **Bulk Approve** — rows with nothing flagged
- **Incentive Approval** — cards waiting to be approved to earn, oldest first, with the price match and liquidity beside each; a card approved at deposit doesn't appear - [Incentive](/p/grade10-site/vault/incentive#incentive-approval)

:::callout{kind="note"}
- ❓ **Target time to approve** — how long a consignment may wait. Product confirms
:::

## On-Sale Monitor

- **Cards on Sale** — by channel and days on sale
- **Slow Cards** — a card with no sale after a set number of days is flagged, so staff can lower its list price, never below the lowest acceptable price, or move a card consigned to both to the other channel
- **Unsold Lots** — auction lots that ended unsold, to move or relist

:::callout{kind="note"}
- ❓ **Days before a card is flagged** — Product confirms
:::

## Conversion Funnel

- **Steps** — deposited, approved to earn, consigned, approved for sale, sold, for any date range
- **Time Between Steps** — the median, and where cards wait longest
- **Cuts** — by price tier, owner type and channel
- **Cost** — incentive paid per consigned card, against commission earned

## Who Sees It

- **Consignment Staff** — all of it
- **Not Shown** — ID and bank details stay with finance

:::detail{title="Product decisions" for="pm"}
The model only pays off when vaulted cards become consignments, and the online
form leaves staff with two queues to clear and a list of cards nobody has asked
about. The dashboard puts the cards worth a conversation, the approvals that
hold a sale up, and the sales that have stalled in one place.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Consignment staff | Many vaulted cards, few consigned | Sees which cards to ask about first, and reaches the owner in one step |
| Consignment staff | Requests waiting | Approves the clean ones in bulk and spends time on the flagged ones |
| Product | Judging the model | Reads where cards wait longest between deposit and sale |

**Not in scope.** Contacting owners in bulk automatically; the owner's own dashboard.

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| One dashboard for the conversion work | Decided | List, outreach, approvals, on-sale monitor and funnel are one internal view, not separate tools | Product |
| Ranked by how likely to sell | Decided | Liquidity and market price lead, so staff ask about the cards most likely to sell | Product |
| No ID or bank details | Decided | They stay with finance | Product |
| Approval target | ❓ Open | How long a consignment may wait | Product |
| Slow-card threshold | ❓ Open | Days with no sale before a card is flagged | Product |
| Contact limit | ❓ Open | How soon the same owner may be contacted again | Product |
:::
