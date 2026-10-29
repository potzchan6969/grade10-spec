---
title: Incentive
order: 8
---

A daily amount paid on approved, eligible vaulted cards, consigned or not.
It is paid into the [Earnings Wallet](/p/grade10-site/account/earnings-wallet).

:::callout{kind="note"}
- ❓ **Not built yet** — no change carries it yet. Product confirms
:::

## Daily Amount

- **Daily Incentive** — market price × liquidity factor × yearly rate ÷ 365
  - HKD 10,000 card, liquidity factor 0.85, 3% a year: about HKD 0.70 a day
- **Market Price** — the median of the card's sales on SNKRDUNK over 30 days, outliers removed; staff never enter a price by hand
- **Liquidity Factor** — how easily the card sells, from 0.2 to 1: velocity × price stability
  - **Velocity** — sales in 30 days ÷ the sales target for its price tier, at most 1
  - **Price Stability** — 1 − price variation, at least 0.5
  - **Price Variation** — the median distance of each sale from the market price, as a share of it
- **Yearly Rate** — 3%; the same for vault-only and consigned cards

## Price Tiers

| Market price (HKD) | Minimum sales in 30 days | Sales target |
| --- | --- | --- |
| Under 1,000 | 10 | 40 |
| 1,000 – 4,999 | 5 | 20 |
| 5,000 – 19,999 | 3 | 10 |
| 20,000 and up | 2 | 5 |

- **Why Tiers** — expensive cards sell less often, so they need fewer sales to qualify and to reach full velocity
- **Tier of the Day** — worked out each day from that day's market price

## Earning

- **Incentive Review** — staff check the card's SNKRDUNK match, its price and its liquidity, then approve it
  - **Approved** — earns from the next day; days waiting for approval are not paid later
  - **Rejected or Held** — stays in the vault without earning; the collector sees why
- **Eligible on the Day** — checked every day; a card earns on a day it has a market price, its tier's minimum sales, a liquidity factor of 0.2 or more, an eligible product, and no pause
  - **Not Eligible** — earns nothing that day and is not paid later; it earns again the next day it qualifies, and the dashboard says why
- **Grace Days** — a card that was earning and loses its market price keeps earning on its last price and liquidity for up to 3 days
  - **Day 4** — it stops until a price comes back; a new price resets the count
  - **Only Missing Prices** — a card with a price but too few sales, or liquidity under 0.2, stops the same day; a card that never had a price gets none
  - **Shown** — "Using last price, day 2 of 3" to staff and the collector
- **Stops** — when the card is sold

:::callout{kind="note"}
- ❓ **Liquidity model, tiers and grace days** — the formula, the tier figures and 3 grace days are drafts. Product confirms
- ❓ **Eligible products** — which products, grades or value ranges earn. Product confirms
- ❓ **Caps** — the most value counted per card, and the most incentive per account a month. Product confirms
- ❓ **When a sold card stops** — marked sold, the buyer pays, or proceeds settle. Product confirms
:::

## Reaching the Wallet

- **Daily Drip** — after midnight Hong Kong time, each card's incentive for the day before is posted to the wallet
  - **Fixed for the Day** — the day's price and liquidity are set at its start
  - **Fractions of a Cent** — carry to the next day, so rounding never gains or loses money
  - **Live Estimate** — the dashboard may show the day so far; only the posted amount counts
- **Vesting** — for its first days in the vault a card's incentive vests on the card, not in the wallet
  - **Release** — on the last vesting day everything vested is posted at once; daily drips follow
  - **Once a Deposit** — vesting runs once, not again on every stretch
  - **Shown Beside the Wallet** — "Vesting: HKD X", with its release date; not cashable
  - **Withdrawn Early** — a card that leaves the vault before release forfeits what is vesting
- **Never Taken Back** — incentive in the wallet stays the collector's, whatever happens to the card

:::callout{kind="note"}
- ❓ **Vesting period** — 30 or 60 days. Product confirms
:::

## Settings and Controls

- **Admin Settings** — the rate, the liquidity model, eligible products and caps; every change logged
- **Pause** — staff pause incentive on a card or an account flagged by an abuse check; nothing accrues until they release it
- **Price Import** — runs daily; its status is visible to staff

:::detail{title="Product decisions" for="pm"}
The incentive is an acquisition cost: it pays a collector to keep cards where
consigning them is one step away. It rewards cards Grade10 can sell, which is
why the market price and liquidity drive it, and it protects against deposit,
cash out and leave with vesting.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector | Deposits a liquid card | Sees what it earns each day and why a card isn't earning |
| Finance | Pays the incentive | A cost that tracks the cards Grade10 can sell, never paid twice |

**Not in scope.** Different rates for vault-only and consigned cards; a rate
that steps down over time; a price staff type in.

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Market price from SNKRDUNK | Decided | The 30-day median, so one odd sale can't move it | Product |
| Liquidity in the amount | Decided | A card that sells easily and holds its price earns more | Product |
| 3% a year | Decided | The starting rate; admins may change it | Product |
| Vest on the card | Decided | Rather than lock the wallet: the wallet only ever holds cashable money, and nothing in it is clawed back | Product |
| Approved before earning | Decided | An internal review checks the price match before a card costs anything | Product |
| Price tiers | ❓ Open | Minimum sales and target by market price; figures are drafts | Product |
| Grace days | ❓ Open | 3 days on the last price when data is missing | Product |
| Vesting period | ❓ Open | 30 or 60 days | Product |
| Eligible products | ❓ Open | Which products, grades or value ranges earn | Product |
| Caps | ❓ Open | Per card and per account a month | Product |
| When a sold card stops | ❓ Open | Recommended: when marked sold | Product |
:::
