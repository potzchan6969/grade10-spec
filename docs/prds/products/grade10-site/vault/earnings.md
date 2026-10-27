---
title: Earnings
order: 3
---

A card kept in the vault earns its owner a small incentive every day, credited
to one balance on the owner's account. Storage stays free; the incentive is
what Grade10 pays to keep the cards it hopes to sell. The owner's draft is
[G10 Vault and Consignment](/references/g10-vault-and-consignment-draft).

## Values

Every figure is a setting an admin changes in the console, logged with who
changed it and when; the value below is the default it starts on.

| Setting | Default |
| --- | --- |
| Annual rate | **3%** a year; each card keeps the rate it was given |
| Days before the incentive can be cashed out (N) | unset; **30** or **60** are asked for |
| How the first N days are credited | credited every day and locked until day N |
| Days from the start the early withdrawal fee applies (Y) | unset |
| Early withdrawal fee | **HKD 0** |
| Market price | the median of the last **30** days of SNKRDUNK sales, outliers removed |
| Fewest sales to earn | **5** in 30 days |
| Currency | the brand's; HKD for Grade10 |

- 🚧 **Two ways to credit, one switch** - the first N days are either
  credited every day and locked, or held and credited at once on day N; an
  admin picks one, and the balance reads the same after day N either way
- ❓ Owner - **Which way to launch on** - the switch's starting value; the
  owner's own reading is credited daily and locked
- ❓ Owner - **N and Y** - the two figures are unset until the owner names
  them

## What a card earns

- 🚧 **Per card** - every card in a case earns on its own, at its own rate,
  from its own contract's effective start date
- 🚧 **From the start date** - a card earns from the day its contract takes
  effect, after it has passed authentication; a card that fails never earns
- 🚧 **Every day after midnight** - shortly after midnight Hong Kong time,
  each earning card's amount for the day before is credited; fractions of a
  cent carry to the next day, and a day is never paid twice
- 🚧 **The figures are kept** - each day's amount records the price, the
  factor and the rate it was worked from, so changing a setting never changes
  an amount already credited
- 🚧 **Price data runs late** - a card keeps its last price for a few days
  when the feed misses, then stops earning until the feed returns
- 🚧 **Paused** - staff stop a card, or every card on an account, from
  earning; a paused card earns nothing until staff release it
- ❓ Owner - **The daily amount** - the draft works it as the market price x
  a liquidity factor x the rate / 365; whether the factor still applies now
  that each card carries its own rate, and the factor's model (T1)
- ❓ Owner - **Which cards earn** - only selected products, grades or value
  ranges (T2), and the caps per card and per account (T3)
- ❓ Owner - **When it stops** - when the card is marked sold, received or
  settled (T5)

## The balance

- 🚧 **One balance** - every card's incentive lands in one balance on the
  owner's account, whichever case the card is in
- 🚧 **Cashable and locked** - the balance shows what can be cashed out and
  what is still locked, each locked amount with the day it unlocks
- 🚧 **Never spent here** - the balance is cashed out only; it never pays for
  anything at Grade10
- ❓ Owner - **Cash-out** - the minimum, how often, the payout rails and the
  approval, from the draft's Phase B; nothing is cashed out until they are
  settled
- ❓ Owner - **Taken back early** - whether a card withdrawn inside its N days
  loses the incentive still locked; the draft says it does

## Taking a card back early

- 🚧 **Early withdrawal fee** - a card taken back inside its first Y days owes
  the vault's early withdrawal fee; the fee may be 0, and consignment keeps a
  fee of its own
- 🚧 **Paid online or at the till** - the owner pays the fee from a payment
  link, or at the shop's till against the withdrawal's reference; the card is
  not handed back until it is paid
- 🚧 **Seen before it is owed** - the owner sees the fee, and what a withdrawal
  costs them in incentive, before they confirm

:::detail{title="Code map" for="engineer"}
- **Where it lands** - `packages/vault` for the case, its cards and the daily
  credit; the balance as a ledger of its own beside it, since the vault and
  the commerce databases may not read each other
- **The fee** - the vault's obligations seam, `money/obligations.ts`, which
  release already refuses on
- **The till** - the POS extension in `packages/pos` and the store's
  `sale.plan`, the same binding a counter sale uses
:::

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| The vault earns, finance lends | Decided | One vaulting base: a case holds many cards, each with its own incentive rate, and a financed card adds its own financing term | Owner |
| The clock is the card's | Decided | Per card from its contract's effective start date, not per case, so cards in one case unlock on their own days | Owner |
| Credited while locked | Decided | The incentive accrues from day one; the N days only stop it being cashed out. The draft's held-then-posted reading stays as a switch | Owner |
| Two early fees | Decided | The vault and consignment each have their own, either may be 0; the vault's runs on a Y-day period of its own | Owner |
| KYC | ❓ | When identity is asked for is still being discussed; every trigger is a setting until it is | Owner |
:::
