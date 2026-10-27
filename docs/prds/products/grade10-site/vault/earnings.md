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
changed it and when; the value below is the default it starts on. A card's
rate, N, Y, fee and forfeit rule are pinned to it when its custody paper is
prepared, and a later change reaches only the next card prepared.

| Setting | Default |
| --- | --- |
| Annual rate | **3%** a year |
| Days before the incentive can be cashed out (N) | unset; **30** or **60** are asked for |
| How the first N days show | credited every day and locked until day N |
| Days from the start the early withdrawal fee applies (Y) | unset |
| Early withdrawal fee | **HKD 0** |
| Locked incentive on an early withdrawal | forfeited |
| Market price | the median of the last **30** days of SNKRDUNK sales, outliers removed |
| Fewest sales to earn | **5** in 30 days |
| A price that misses | kept for **3** days, then the card stops earning |
| Currency | the brand's; HKD for Grade10 |
| A price in another currency | converted at the European Central Bank's daily reference rate |

- 🚧 **Papers wait for N and Y** - an earning card's custody paper cannot be
  prepared while the rate, N or Y is unset, since the card keeps what it is
  signed with
- 🚧 **The switch changes the view, never the money** - the first N days are
  shown either as daily credits, each locked until day N, or as one held
  figure that posts on day N; every amount and unlock date is the same either
  way, so an admin may flip it at any time
- ❓ Owner - **Which view to launch on** - the owner's own reading is
  credited daily and locked
- ❓ Owner - **N and Y** - both are unset until the owner names them; N is
  needed before production earning starts
- ❓ Owner - **Forfeit** - whether a card taken back inside its N days loses
  the incentive still locked; the draft says it does, and each card keeps the
  rule it was signed with

## What a card earns

- 🚧 **Per card** - every card in a case is its own contract, earning at its
  own rate from its own effective start date, the day it is vaulted
- 🚧 **After authentication** - a card earns once it passes authentication; a
  card that fails is handed back and never earns
- ❓ Owner - **A late pass** - whether a card that passes after it was
  vaulted earns from its start date; built as earning from the start date
- 🚧 **The day after it closes** - each earning card's amount for a day is
  credited once the day has closed in Hong Kong; fractions of a cent carry to
  the next day, and a day is never paid twice
- 🚧 **The figures are kept** - each day records the price, the rate of
  exchange, the factor, the rate and the settings it was worked from, so a
  changed setting never changes an amount already credited
- 🚧 **Price data runs late** - a day is worked from the newest price
  published before it closed, so a day worked late reads exactly what an
  on-time day would have; a card keeps its last price for 3 days when the
  feed misses, then stops earning until the feed returns
- 🚧 **Bad data waits for a person** - a market price or a rate of exchange
  that jumps too far from the last accepted one is held until staff accept or
  replace it, and a day whose total incentive moves too far from the day
  before waits for staff to release it
- 🚧 **Paused** - staff stop a card, or every card on an account, from
  earning; a paused card earns nothing until staff release it
- 🚧 **Consigned from the vault** - a card the owner consigns from the vault
  keeps earning the vault incentive, and the consignment pays none of its own
- ❓ Owner - **The liquidity factor** - its model and thresholds (T1); built
  as the draft's market price x factor x rate / 365
- ❓ Owner - **Which cards earn** - only selected products, grades or value
  ranges (T2), and the caps per card and per account (T3); every card, no
  cap, until decided
- ❓ Owner - **When it stops** - when a consigned card is marked sold,
  received or settled (T5); a production release is refused until it is
  named

A card valued at HKD 10,000, with a factor of 0.6 at 3%, earns
HK$0.4932 a day: 49 or 50 cents are credited each day, the fraction carried,
and a year credits exactly HK$180.00, what the year earned.

## The balance

- 🚧 **One balance** - every card's incentive, and the proceeds of a card sold
  from the vault, land in one balance on the owner's account
- 🚧 **Cashable and locked** - the balance shows what can be cashed out and
  what is still locked, each locked amount with the day it unlocks
- 🚧 **Never spent here** - the balance is cashed out only; it never pays for
  anything at Grade10
- 🚧 **Forfeit at release** - where the card's rule forfeits, releasing it
  before day N takes back what is still locked on it; a withdrawal request
  that is cancelled takes back nothing
- 🚧 **Corrections take a second person** - a wrong entry is reversed, never
  edited, by someone other than whoever wrote it
- ❓ Owner - **Cash-out** - the minimum, how often, the payout rails and the
  approval, from the draft's Phase B; nothing is cashed out until they are
  settled

## Taking a card back early

- 🚧 **Early withdrawal fee** - a card taken back inside its first Y days owes
  the vault's early withdrawal fee, fixed on the day of the request; the fee
  may be 0, and consignment keeps a fee of its own
- 🚧 **Paid online or at the till** - one invoice per withdrawal request, paid
  from its link or QR code, or loaded at the shop's till; the card is not
  handed back until it is paid
- 🚧 **Seen before it is owed** - the owner sees the fee, and what a withdrawal
  costs them in incentive, before they confirm
- 🚧 **A refund after the card has left** - is recorded on the card and staff
  are alerted; nothing is taken back from the owner on its own

:::detail{title="Code map" for="engineer"}
- **The case** - `vault.deposits` is the case; each card is a one-card vault
  case with its pinned `card_terms` - `docs/architecture/vault.md` in the app
- **The balance** - `packages/vault/backend/src/earnings/`, a module with its
  own RPC entrypoint in the vault wall; consignment proceeds arrive over
  `ConsignmentVault`
- **The price** - market price days and ECB rate days in inventory, read over
  `VaultItemsService`; the sales come from the price worker's `PRICE_HISTORY`
  binding
- **The fee** - `money/obligations.ts`, which release already refuses on; the
  invoice is a Shopify draft order the store issues over `VaultFeeInvoices`
  and the vault reads back
:::

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| The vault earns, finance lends | Decided | One vaulting base: a case is everything handed in on one visit, made of one-card contracts, each with its own incentive rate, and a financed card is its own financed contract | Owner |
| The clock is the card's | Decided | Per card from its contract's effective start date, not per case, so cards in one case unlock on their own days | Owner |
| Credited while locked | Decided | The incentive accrues from day one; the N days only stop it being cashed out. The held-then-posted reading is a way of showing it, never a second way of crediting it | Owner |
| Two early fees | Decided | The vault and consignment each have their own, either may be 0; the vault's runs on a Y-day period of its own | Owner |
| Prices in yen | Decided | Converted at the ECB's daily reference rate; a rate outside its bounds, or moving too far in a day, is held for staff - decided by the owner, 2026-10-27 | Owner |
| Where prices come from | Decided | A separate price worker, reached by a service binding; its answer's shape is assumed until it exists - decided by the owner, 2026-10-27 | Owner |
| The fee at the till | Decided | A Shopify invoice paid by link or loaded at the till, so no amount is typed - decided under the owner's delegation, 2026-10-27 | Product |
| KYC | ❓ | When identity is asked for is still being discussed; today's rule stands until it is | Owner |
:::
