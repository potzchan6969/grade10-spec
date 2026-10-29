---
title: Incentive
order: 2
---

A daily amount paid on approved, eligible vaulted cards, consigned or not.
It is paid into the [Earnings Wallet](/p/grade10-site/account/earnings-wallet).

## Daily Amount

- 🚧 **Daily Incentive** — market price × liquidity factor × yearly rate ÷ 365
  - HKD 10,000 card, liquidity factor 0.85, 3% a year: about HKD 0.70 a day
- 🚧 **Market Price** — the median of the card's sales on SNKRDUNK over 30 days, outliers removed; staff never enter a price by hand
- 🚧 **Liquidity Factor** — how easily the card sells, from 0.2 to 1: velocity × price stability
  - **Velocity** — sales in 30 days ÷ the sales target for its price tier, at most 1
  - **Price Stability** — 1 − price variation, at least 0.5
  - **Price Variation** — the median distance of each sale from the market price, as a share of it
- 🚧 **Yearly Rate** — 3%; the same for vault-only and consigned cards

## Price Tiers

| Market price (HKD) | Minimum sales in 30 days | Sales target |
| --- | --- | --- |
| Under 1,000 | 10 | 40 |
| 1,000 – 4,999 | 5 | 20 |
| 5,000 – 19,999 | 3 | 10 |
| 20,000 and up | 2 | 5 |

- 🚧 **Why Tiers** — expensive cards sell less often, so they need fewer sales to qualify and to reach full velocity
- 🚧 **Tier of the Day** — worked out each day from that day's market price

## Earning

- 🚧 **Incentive Approval** — staff check the card's SNKRDUNK match, its price and its liquidity, then approve it
  - **Approved** — earns from the next day; days waiting for approval are not paid later
  - **Rejected or Held** — stays in the vault without earning; the collector sees why
  - **Skipped at Deposit** — staff who already authenticated the card and verified its value tick Skip Incentive Approval on the deposit form; the card is approved when the deposit is submitted, and the skip is recorded with the staff member - [Vault Deposit](/p/grade10-site/vault/deposit#deposit-form)
- 🚧 **Eligible on the Day** — checked every day; a card earns on a day it has a market price, its tier's minimum sales, a liquidity factor of 0.2 or more, an eligible product, and no pause
  - **Not Eligible** — earns nothing that day and is not paid later; it earns again the next day it qualifies, and the dashboard says why
- 🚧 **Grace Days** — a card that was earning and loses its market price keeps earning on its last price and liquidity for up to 3 days
  - **Day 4** — it stops until a price comes back; a new price resets the count
  - **Only Missing Prices** — a card with a price but too few sales, or liquidity under 0.2, stops the same day; a card that never had a price gets none
  - **Shown** — "Using last price, day 2 of 3" to staff and the collector
- 🚧 **Stops** — when the card is sold

:::callout{kind="note"}
- ❓ **Liquidity model, tiers and grace days** — the formula, the tier figures and 3 grace days are drafts. Product confirms
- ❓ **Eligible products** — which products, grades or value ranges earn. Product confirms
- ❓ **Caps** — the most value counted per card, and the most incentive per account a month. Product confirms
- ❓ **When a sold card stops** — marked sold, the buyer pays, or proceeds settle. Product confirms
:::

## Reaching the Wallet

- 🚧 **Daily Drip** — after midnight Hong Kong time, each card's incentive for the day before is posted to the wallet
  - **Fixed for the Day** — the day's price and liquidity are set at its start
  - **Fractions of a Cent** — carry to the next day, so rounding never gains or loses money
  - **Live Estimate** — the dashboard may show the day so far; only the posted amount counts
- 🚧 **Vesting** — for its first days in the vault a card's incentive vests on the card, not in the wallet
  - **Release** — on the last vesting day everything vested is posted at once; daily drips follow
  - **Once a Deposit** — vesting runs once, not again on every stretch
  - **Shown Beside the Wallet** — "Vesting: HKD X", with its release date; not cashable
  - **Withdrawn Early** — a card that leaves the vault before release forfeits what is vesting
  - **Sold Early** — a card sold before release, say on day 60 of 90; sale proceeds are paid as usual, and the note below says what happens to the incentive
- 🚧 **Never Taken Back** — incentive in the wallet stays the collector's, whatever happens to the card

:::callout{kind="note"}
- ❓ **Vesting period** — 30 or 60 days. Product confirms
- ❓ **Incentive when a card sells during vesting** — only the vested days (recommended: pays what the card earned), or the full period (pays the remaining days too, at a higher cost). Decide with when a sold card stops earning. Product confirms
:::

## Settings

- 🚧 **Admin Settings** — the rate, the liquidity model, eligible products, caps and the price check's limits; every change logged
- 🚧 **Pause and the Daily Run** — staff pause incentive, the price import and the drip run daily - [Vault Operations](/p/grade10-site/vault/operations#daily-run)

:::detail{title="Product decisions" for="pm"}
The incentive is an acquisition cost: it pays a collector to keep cards where
consigning them is one step away. It rewards cards Grade10 can sell, which is
why the market price and liquidity drive it, and vesting protects against
deposit, cash out and leave.

- **Market price from SNKRDUNK's 30-day median** — so one odd sale can't move it, and no staff member types a price
- **Liquidity in the amount** — a card that sells easily and holds its price earns more, so the cost follows the cards Grade10 can sell
- **Approved before earning** — an internal check of the price match before a card costs anything; staff who already checked it at the counter may skip it, and the skip is recorded
- **Vest on the card, not in the wallet** — the wallet only ever holds cashable money, and nothing in it is clawed back
- **One rate for every card** — vault-only and consigned cards earn the same, so consigning never costs the collector the incentive
- **Not in scope** — a rate that steps down over time; a price staff type in
:::
