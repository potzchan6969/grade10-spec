---
title: Incentive
order: 2
---

A daily amount paid on approved, eligible vaulted cards, consigned or not.
It is paid into the [Earnings Wallet](/p/grade10-site/account/earnings-wallet).

## Daily Amount

- 🚧 **Daily Incentive** — market price × liquidity factor × yearly rate ÷ 365
  - HKD 10,000 card, liquidity factor 0.85, 3% a year: about HKD 0.70 a day
  - **Built** — the same formula, the factor's model still the owner's draft; each day's price, rate of exchange, factor, rate and settings are kept with its amount, so a changed setting never changes an amount already credited
- 🚧 **Market Price** — the median of the card's sales on SNKRDUNK over 30 days, outliers removed; staff never enter a price by hand
  - **In Another Currency** — a yen price is converted at the European Central Bank's daily reference rate
  - **Unlikely Data** — a price or a rate of exchange that jumps too far from the day before is used all the same and flagged for staff; a figure staff find wrong is corrected in Inventory's market prices, and every day priced from it is worked again, the difference credited or taken back
  - **Built** — a deployed environment imports rates of exchange but prices no card until the price worker that supplies the sales is connected, so no card earns there yet
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
  - **Built** — no approval step: a card earns from the day it is vaulted, its own effective start date, once it passes authentication; a card that fails never earns
  - **Skipped at Deposit** — staff who already authenticated the card and verified its value tick Skip Incentive Approval on the deposit form; the card is approved when the deposit is submitted, and the skip is recorded with the staff member - [Vault Deposit](/p/grade10-site/vault/deposit#deposit-form)
- 🚧 **Eligible on the Day** — checked every day; a card earns on a day it has a market price, its tier's minimum sales, a liquidity factor of 0.2 or more, an eligible product, and no pause
  - **Not Eligible** — earns nothing that day and is not paid later; it earns again the next day it qualifies, and the dashboard says why
  - **Built** — no tiers: at least **5** sales in 30 days for every card, every product eligible and no cap
- 🚧 **Grace Days** — a card that was earning and loses its market price keeps earning on its last price and liquidity for up to 3 days
  - **Day 4** — it stops until a price comes back; a new price resets the count
  - **Only Missing Prices** — a card with a price but too few sales, or liquidity under 0.2, stops the same day; a card that never had a price gets none
  - **Shown** — "Using last price, day 2 of 3" to staff and the collector
  - **Built** — no grace on a last price: a day whose price or rate of exchange has not arrived waits and is paid in full once it does, and a market with no sales for 3 days earns nothing for those days
- 🚧 **Stops** — when the card is sold
  - **Built** — which moment stops it is a setting; it is unset, and a production deploy is refused while it is. On settled, a sold card earns until its sale is settled; a sale that is reversed takes the stop away
  - **Heard From Consignment** — the sale, a reversed sale, the delivery, the settlement and a refund after payout reach the vault once each

:::callout{kind="note"}
- ❓ **Liquidity model, tiers and grace days** — the formula, the tier figures and 3 grace days are drafts. Product confirms
- ❓ **Eligible products** — which products, grades or value ranges earn. Product confirms
- ❓ **Caps** — the most value counted per card, and the most incentive per account a month. Product confirms
- ❓ **When a sold card stops** — marked sold, the buyer pays, or proceeds settle. Product confirms
- ❓ **A late pass** — whether a card that passes authentication after it was vaulted earns from its start date; built as earning from the start date. Owner confirms
:::

## Reaching the Wallet

- 🚧 **Daily Drip** — after midnight Hong Kong time, each card's incentive for the day before is posted to the wallet
  - **Fixed for the Day** — the day's price and liquidity are set at its start
  - **Fractions of a Cent** — carry to the next day, so rounding never gains or loses money
  - **Live Estimate** — the dashboard may show the day so far; only the posted amount counts
  - **Built** — credited the day after it closes in Hong Kong; a day is never paid twice
- 🚧 **Vesting** — for its first days in the vault a card's incentive vests on the card, not in the wallet
  - **Release** — on the last vesting day everything vested is posted at once; daily drips follow
  - **Once a Deposit** — vesting runs once, not again on every stretch
  - **Shown Beside the Wallet** — "Vesting: HKD X", with its release date; not cashable
  - **Withdrawn Early** — a card that leaves the vault before release forfeits what is vesting
  - **Sold Early** — a card sold before release, say on day 60 of 90; sale proceeds are paid as usual, and the note below says what happens to the incentive
  - **Built** — credited every day and locked until day N, or shown as one held figure posted on day N; an admin setting switches the view, every amount and unlock day the same either way, so it may be flipped at any time
  - **Forfeit at Release, as Built** — where the card's rule forfeits, releasing it before day N takes back what is still locked on it; a withdrawal request that is cancelled takes back nothing
- 🚧 **Never Taken Back** — incentive in the wallet stays the collector's, whatever happens to the card

:::callout{kind="note"}
- ❓ **Vesting period** — 30 or 60 days. Product confirms
- ❓ **Incentive when a card sells during vesting** — only the vested days (recommended: pays what the card earned), or the full period (pays the remaining days too, at a higher cost). Decide with when a sold card stops earning; built as a sale forfeiting nothing, its credited incentive unlocking on its own day. Product confirms
- ❓ **Which view to launch on** — credited daily and locked, the owner's own reading, or vesting held on the card. Owner confirms
- ❓ **Forfeit** — whether a card taken back inside its vesting days loses what is still locked; the draft says it does, and each card keeps the rule it was signed with. Owner confirms
:::

## Settings

- 🚧 **Admin Settings** — the rate, the liquidity model, eligible products, caps and the price check's limits; every change logged
- 🚧 **Pinned to the Card** — the rate, the vesting days, the early withdrawal fee's period and amount, and the forfeit rule are pinned when the card's custody paper is prepared; a later change reaches only the next card
  - **Unset Refuses** — the paper is not prepared while the rate, the vesting days or the fee's period is unset
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

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| The vault earns, finance lends | Decided | One vaulting base: a case is everything handed in on one visit, made of one-card contracts, each with its own incentive rate, and a financed card is its own financed contract | Owner |
| The clock is the card's | Decided | Per card from its contract's effective start date, not per case, so cards in one case unlock on their own days | Owner |
| Credited while locked | Decided | The incentive accrues from day one; the vesting days only stop it being cashed out. The held-then-posted reading is a way of showing it, never a second way of crediting it | Owner |
| Prices in yen | Decided | Converted at the ECB's daily reference rate; a rate outside its bounds, or moving too far in a day, is flagged for staff - decided by the owner, 2026-10-27, flagged rather than held on 2026-10-28 | Owner |
| Where prices come from | Decided | A separate price worker, reached by a service binding; its answer's shape is assumed until it exists - decided by the owner, 2026-10-27 | Owner |
| Nothing is held | Decided | An unlikely price or rate is used and flagged, never held, because a credit stays locked until vesting ends and nothing is cashed out without a second treasurer; a wrong one is corrected in Inventory and the days it priced are worked again with no second approver - decided by the owner, 2026-10-28 | Owner |
| A late fact waits | Decided | A day whose price or rate has not arrived waits and is paid in full, rather than earning nothing after 3 days - decided by the owner, 2026-10-28 | Owner |
| A sale is not an early withdrawal | ❓ | A card sold through consignment forfeits nothing; its credited incentive unlocks on its own day - built so, 2026-10-27 | Owner |
:::

:::detail{title="Code map" for="engineer"}
- **The case** - `vault.deposits` is the case; each card is a one-card vault
  case with its pinned `card_terms` - `docs/architecture/vault.md` in the app
- **The price** - market price days and ECB rate days in inventory, read over
  `VaultItemsService`; the sales come from the price worker's `PRICE_HISTORY`
  binding
- **When it stops** - `stopOn` in `packages/app-env/src/earnings.ts`, which
  refuses a production deploy while unset
:::
