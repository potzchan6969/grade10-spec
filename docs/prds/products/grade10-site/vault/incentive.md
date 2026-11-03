---
title: Incentive
order: 2
---

A daily amount paid on eligible vaulted cards, consigned or not, from each card's Earning Starts date.
It is paid into the [Earnings Wallet](/p/grade10-site/account/earnings-wallet).

## Daily Amount

- 🚧 **Daily Incentive** — market price × liquidity factor × yearly rate ÷ 365
  - **Built** — the same formula, the factor's model still the owner's draft; each day's price, rate of exchange, factor, rate and settings are kept with its amount, so a changed setting never changes an amount already credited
- 🚧 **Market Price** — the median of the card's sales on SNKRDUNK over 30 days, outliers removed
  - **SNKRDUNK Card Required** — every card taken at the counter names its SNKRDUNK card, kept in Inventory and remembered on its catalogue product for the next copy
  - **Fixed Price** — entered by an admin only for a card with no SNKRDUNK listing to link; it stands as the card's market price until a SNKRDUNK card is linked
    - **SNKRDUNK Wins** — a linked SNKRDUNK card always replaces the fixed price, and an admin can't set one while the card's product already has a SNKRDUNK card
    - **A Changed Price** — applies from the next day; a mistake corrected is worked again like any other price
    - **Liquidity on a Fixed Price** — a fixed factor, an admin setting starting at 0.5, with no minimum sales, since no sales stand behind the price
  - **Estimate at Intake** — the intake form shows about how much each card earns a day and over a year, by this formula on the day's figures, from its Earning Starts date
  - **A Day's Price** — the window's median is of every SNKRDUNK sale in it, each dated at +08:00; a day older than SNKRDUNK's week counts its one daily average; the day still in progress counts none
  - **Evidence** — each SNKRDUNK answer is kept as it came, and a price shows every sale behind it: counted, an outlier, or excluded by staff
  - **In US Dollars** — SNKRDUNK prices are already in US dollars, and an admin enters a fixed price in US dollars, so a day's incentive is never converted
  - **Unlikely Data** — a price or a rate of exchange that jumps too far from the day before is used all the same and flagged for staff; a figure staff find wrong is corrected in Inventory's market prices — re-read from SNKRDUNK, or a wrong sale excluded — and every day priced from it is worked again, the difference credited or taken back
  - **Built** — a deployed environment imports rates of exchange but prices no card until the price worker that supplies the sales is connected, so no card earns there yet
- 🚧 **Liquidity Factor** — how easily the card sells, from 0.2 to 1: velocity × price stability
  - **Velocity** — sales in 30 days ÷ the sales target for its price tier, at most 1
  - **Price Stability** — 1 − price variation, at least 0.5
  - **Price Variation** — the median distance of each sale from the market price, as a share of it
- 🚧 **Yearly Rate** — 3%; the same for vault-only and consigned cards

A HKD 10,000 card, worked through:

| Step | Working | Result |
| --- | --- | --- |
| Market price | the median of 30 days' sales on SNKRDUNK | HKD 10,000 |
| Price tier | US$650 – 2,599: at least 3 sales, a target of 10 | 12 sales: eligible |
| Velocity | 12 ÷ 10, at most 1 | 1.00 |
| Price variation | sales of 9,000, 9,500, 10,000, 10,500 and 13,000 sit 1,000, 500, 0, 500 and 3,000 from the median; the middle distance, 500, is 5% of it | 5% |
| Price stability | 1 − 5% | 0.95 |
| Liquidity factor | 1.00 × 0.95 | 0.95 |
| Daily incentive | 10,000 × 0.95 × 3% ÷ 365 | about HKD 0.78, ≈ US$0.10 |

With 15% variation instead, stability is 0.85 and the card earns about HKD
0.70 a day. Under a 30-day vesting, that card's first 30 days, about US$2.70,
reach the wallet together on day 30, and each day's amount drips in after that.

## Price Tiers

| Market price (US$) | Minimum sales in 30 days | Sales target |
| --- | --- | --- |
| Under 130 | 10 | 40 |
| 130 – 649 | 5 | 20 |
| 650 – 2,599 | 3 | 10 |
| 2,600 and up | 2 | 5 |

- 🚧 **Why Tiers** — expensive cards sell less often, so they need fewer sales to qualify and to reach full velocity
- 🚧 **Tier of the Day** — worked out each day from that day's market price
- 🚧 **Liquidity Settings** — the tiers, the stability floor of 0.5, the factor floor of 0.2 and the 3 grace days are admin settings starting at these figures; a change applies from the next day, and each day keeps the figures it was worked on

## Earning

- 🚧 **Earning Starts** — each card's own start date, set on the intake form: the day after intake unless staff choose another, and never before the Vault Terms are signed - [Vault Intake](/p/grade10-site/vault/intake#intake-form)
  - **Pinned to the Card** — signed with the Vault Terms; vesting counts from it
  - **Once Authenticated** — a card checked later earns from its start date once it passes, those days paid in full; a card that fails never earns and loses nothing
  - **Built** — a card earns from the day it is placed in the vault, once it passes authentication
- 🚧 **Incentive Approval** — staff check the card's SNKRDUNK match, its price and its liquidity; a card rejected or held is Not Eligible from the next day, and the collector sees why
- 🚧 **Eligible on the Day** — checked every day; a card earns on a day it has a market price, its tier's minimum sales, a liquidity factor of 0.2 or more, an eligible product, Earns Incentive ticked, and no pause
  - **Earns Incentive** — staff set it per card at intake, on by default; a later change takes a reason and applies from the next day; each change logged - [Vault Intake](/p/grade10-site/vault/intake#intake-form)
  - **Not Eligible** — earns nothing that day and is not paid later; it earns again the next day it qualifies, and the dashboard says why, never as a pause
  - **Earning Rules** — an admin list of the products, and the grades by each grader, that don't earn; empty by default, so every card earns
    - **Checked at Signing** — each card is checked when its Vault Terms are signed, and keeps that answer
    - **Cards Already Signed** — a rule reaches them only when staff apply it, with approval, from the next day; a day already earned is never taken back
  - **Value Cap** — the most of a card's market price that earns, an admin setting signed with the card; none by default
  - **Account Review** — an account earning more than an admin threshold in a month is reviewed by staff, never cut back; off by default
    - **Accounts to Review** — listed on the earnings desk until staff mark each one seen with a note
  - **Vesting Still Releases** — what vested before stays on the card and is released on its day; what is in the wallet stays there
  - **Built** — no tiers: at least **5** sales in 30 days for every card, every product eligible and no cap
- 🚧 **Grace Days** — a card that was earning and loses its market price keeps earning on its last price and liquidity for up to 3 days
  - **Day 4** — it stops until a price comes back; a new price resets the count
  - **Only Missing Prices** — a card with a price but too few sales, or liquidity under 0.2, stops the same day; a card that never had a price gets none
  - **Shown** — "Using last price, day 2 of 3" to staff and the collector
  - **Built** — no grace on a last price: a day whose price or rate of exchange has not arrived waits and is paid in full once it does, and a market with no sales for 3 days earns nothing for those days
- 🚧 **Stops** — when the card is sold
  - **Built** — which moment stops it is a setting, set to sold: the card stops earning on the day it is marked sold, and a sale that is reversed takes the stop away. Delivered and settled remain options; on settled a sold card would earn until its sale is settled. A production deploy is refused while it is unset
  - **Heard From Consignment** — the sale, a reversed sale, the delivery, the settlement and a refund after payout reach the vault once each

:::callout{kind="note"}
- ❓ **Value Cap on the Papers** — the words the Vault Terms print for a card's value counted up to its cap. Legal confirms
:::

## Reaching the Wallet

- 🚧 **Daily Drip** — after midnight Hong Kong time, each card's incentive for the day before is posted to the wallet
  - **Base Currency** — the wallet holds US dollars - decided by the owner, 2026-10-30
  - **HKD Beside It** — a Hong Kong dollar figure shown beside a wallet amount is a guide: the total at one day's European Central Bank rate
  - **Credited Each Morning** — the Hong Kong day closes at midnight, and its incentive posts as soon as its price is in
  - **Fixed for the Day** — the day's price and liquidity are set at its start
  - **Fractions of a Cent** — carry to the next day, so rounding never gains or loses money
  - **Live Estimate** — the dashboard may show the day so far; only the posted amount counts
  - **Built** — credited the day after it closes in Hong Kong; a day is never paid twice
- 🚧 **Vesting** — for its first 30 days from Earning Starts a card's incentive vests on the card, not in the wallet; the days are an admin setting signed with the card
  - **Release** — on the last vesting day everything vested is posted at once; daily drips follow
  - **Once an Intake** — vesting runs once, not again on every stretch
  - **Shown Beside the Wallet** — "Vesting: US$ X", with its release date; not cashable
  - **Retrieved Early** — a card its owner takes back before release forfeits what is vesting, as its signed terms say, and pays the early retrieval fee inside its period - [Vault Retrieval](/p/grade10-site/vault/vault-retrieval#early-retrieval-fee)
    - **Never Forfeits** — a pause, a Not Eligible day, a card that fails authentication, or any return Grade10 starts
  - **Sold Early** — a sale is not a retrieval: the card's vested days are paid on its own release day, with the sale proceeds paid as usual
  - **Built** — credited every day and locked until day N, or shown as one held figure posted on day N; an admin setting switches the view, every amount and unlock day the same either way, so it may be flipped at any time
  - **Forfeit at Release, as Built** — where the card's rule forfeits, releasing it before day N takes back what is still locked on it; a retrieval request that is called off takes back nothing
- 🚧 **Never Taken Back** — incentive in the wallet stays the collector's, whatever happens to the card

:::callout{kind="note"}
- ❓ **HKD Wording** — the words that call a Hong Kong dollar figure a guide on signed papers. Legal confirms
- ❓ **Forfeit Clause** — the Vault Terms' words for forfeiting what is vesting. Legal confirms
:::

## Settings

- 🚧 **Admin Settings** — the rate, the liquidity settings, the liquidity factor on a fixed price, the earning rules, the value cap, the early retrieval fee's period and amount, and the account review threshold; every change logged
- 🚧 **Pinned to the Card** — the rate, the vesting days, the forfeit rule, the value cap, Earning Starts, and the early retrieval fee's period and amount are pinned when the card's Vault Terms are prepared; a later change reaches only the next card
  - **Unset Refuses** — the paper is not prepared while the rate, the vesting days or the fee's period is unset
- 🚧 **Pause and the Daily Run** — staff pause incentive, the price import and the drip run daily - [Vault Operations](/p/grade10-site/vault/operations#daily-run)

:::detail{title="Product decisions" for="pm"}
The incentive is an acquisition cost: it pays a collector to keep cards where
consigning them is one step away. It rewards cards Grade10 can sell, which is
why the market price and liquidity drive it, and vesting protects against
vault, cash out and leave.

- **Market price from SNKRDUNK's 30-day median** — so one odd sale can't move it, and no staff member types a price
- **Liquidity in the amount** — a card that sells easily and holds its price earns more, so the cost follows the cards Grade10 can sell
- **A start date set at intake** — the collector sees on the form, and signs, the day each card starts earning, so earning never waits on where the card is placed; an approval that finds a problem stops the card from the next day - the counter review, round 2, 2026-11-02
- **Vest on the card, not in the wallet** — the wallet only ever holds cashable money, and nothing in it is clawed back
- **One rate for every card** — vault-only and consigned cards earn the same, so consigning never costs the collector the incentive
- **Not in scope** — a rate that steps down over time

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| The vault earns, finance lends | Decided | One vaulting base: a case is everything handed in on one visit, made of one-card contracts, each with its own incentive rate, and a financed card is its own financed contract | Owner |
| The clock is the card's | Decided | Per card from its contract's effective start date, not per case, so cards in one case unlock on their own days | Owner |
| Earning Starts | 🚧 | Set per card on the intake form, the day after intake by default, never before signing; it is the card's effective start date, and Not Eligible is its own reason rather than a pause - the counter review, round 2, 2026-11-02 | Product |
| Credited while locked | Decided | The incentive accrues from day one; the vesting days only stop it being cashed out. The held-then-posted reading is a way of showing it, never a second way of crediting it | Owner |
| Prices in yen | Decided | Converted at the ECB's daily reference rate; a rate outside its bounds, or moving too far in a day, is flagged for staff - decided by the owner, 2026-10-27, flagged rather than held on 2026-10-28 | Owner |
| Where prices come from | Decided | A separate price worker, reached by a service binding; its answer's shape is assumed until it exists - decided by the owner, 2026-10-27 | Owner |
| Nothing is held | Decided | An unlikely price or rate is used and flagged, never held, because a credit stays locked until vesting ends and nothing is cashed out without a second treasurer; a wrong one is corrected in Inventory and the days it priced are worked again with no second approver - decided by the owner, 2026-10-28 | Owner |
| A late fact waits | Decided | A day whose price or rate has not arrived waits and is paid in full, rather than earning nothing after 3 days - decided by the owner, 2026-10-28 | Owner |
| A day's SNKRDUNK price | Decided | The median counts every sale in the window, each on its date at +08:00, read from a kept snapshot of SNKRDUNK's answer; a day past SNKRDUNK's week counts its daily average. SNKRDUNK's week holds each sale and its longer history one average per Japan day, so neither is merged into the other - decided by the owner, 2026-11-02, in place of the day taking its last point (2026-10-30) | Owner |
| A sold card stops on the sale | Decided | It stops earning on the day it is marked sold, not at the delivery or the settlement, so a card earns nothing while its sale is being completed - decided by the owner, 2026-10-29 | Owner |
| A sale is not an early retrieval | Decided | A card sold through consignment forfeits nothing; its vested days are paid on its own release day - built so, 2026-10-27; confirmed in the counter review, round 3, 2026-11-02 | Product |
| The earnings model | Decided | Terms signed per card - the rate, 30 vesting days, forfeit on the owner's early retrieval, a value cap, Earning Starts, and the early retrieval fee's period and amount; a late pass backdates; earning rules are a deny-list; no account cap, a review instead; vesting always shown beside the wallet, so there is no view to choose; liquidity is the drafted formula with its tiers in US dollars - the counter review, round 3, 2026-11-02 | Product |
| The wallet in US dollars from the start | Decided | The wallet holds US dollars from Phase 1, so its ledger never needs converting; SNKRDUNK prices are US dollars already and a fixed price is entered in them - the counter review, round 3, 2026-11-02 | Product |
:::

:::detail{title="Code map" for="engineer"}
- **The case** - `vault.deposits` is the case; each card is a one-card vault
  case with its pinned `card_terms` - `docs/architecture/vault.md` in the app
- **The price** - market price days and ECB rate days in inventory, read over
  `VaultItemsService`; the sales come from the price worker's `PRICE_HISTORY`
  binding
- **When it stops** - `stopOn` in `packages/app-env/src/earnings.ts`, `sold`;
  a production deploy is refused if it is unset
:::
