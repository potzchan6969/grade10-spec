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
| Least cash-out | **HKD 500** |
| Time between cash-outs | **7** days |

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
- 🚧 **Price data runs late** - when a day's price or rate of exchange has
  not arrived, the card waits and is paid for the day in full once it does;
  a card whose market had no sales for 3 days earns nothing for those days
- 🚧 **Unlikely data is flagged, not held** - a market price or a rate of
  exchange that jumps too far from the day before is used all the same and
  flagged for staff; a figure staff find wrong is corrected in Inventory's
  market prices, and every day priced from it is worked again, the
  difference credited or taken back on that day's unlock date
- 🚧 **No price until the price worker is connected** - a deployed
  environment imports rates of exchange but prices no card, so no card earns
  there until the price worker that supplies the sales exists and is
  connected
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
  delivered or settled (T5); a production release is refused until it is
  named. On settled, a sold card keeps earning after its buyer has it until
  the sale is settled
- 🚧 **A reversed sale** - a sale that is undone takes the stop away, and the
  card earns on as before

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
- ❓ Owner - **A sale forfeits nothing** - a card sold through
  consignment and released to its buyer is not an early withdrawal: its
  credited incentive stays and unlocks on its own day; built this way
- 🚧 **Sale proceeds** - a sale paid to the balance credits its proceeds once
  it is settled; a refund after that is a negative entry, and a balance below
  zero is a debt that new credits pay down first
- 🚧 **Corrections take a second person** - a wrong entry is reversed, never
  edited, by someone other than whoever wrote it

## Cashing out

- 🚧 **To the owner's own account** - a cash-out is paid by bank transfer to
  a payout account whose name matches the owner's verified identity
- 🚧 **Held while it is paid** - the amount leaves what can be cashed out the
  moment it is asked for, and comes back if its batch is rejected
- 🚧 **A debt blocks it** - nothing is cashed out while the balance owes
- 🚧 **Two treasurers** - cash-outs are gathered into a batch, and the batch is
  approved by a treasurer other than the one who gathered it
- ❓ Owner - **The minimum and the interval** - at least HKD 500, and no
  sooner than 7 days after the last
- ❓ Owner - **Identity at cash-out** - a verified identity is asked for
  at every cash-out and before sale proceeds reach the balance; built as
  always

## Taking a card back early

- 🚧 **Early withdrawal fee** - a card taken back inside its first Y days owes
  the vault's early withdrawal fee, fixed on the day of the request; the fee
  may be 0, and consignment keeps a fee of its own
- 🚧 **Paid by card on an invoice** - one Shopify invoice per withdrawal
  request, paid from its link or loaded at the shop's till; the withdrawal
  paper prints the link. The card is not handed back until it is paid
- 🚧 **Never from the balance** - the fee is recorded on the vault's money
  register as paid by card; it is never taken from the earnings balance
- 🚧 **Withdrawn, voided** - a withdrawal request that is withdrawn voids its
  invoice
- 🚧 **Waived by two** - staff may waive a fee, with a second person's
  approval; a fee a refund reopens before the card leaves can then only be
  waived
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
  and the vault reads back, settling only from that read-back
- **Cash-out** - `packages/vault/backend/src/earnings/cashOut.ts`, with the
  batches on the vault's money register
- **When it stops** - `stopOn` in `packages/app-env/src/earnings.ts`, which
  refuses a production deploy while unset
:::

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| The vault earns, finance lends | Decided | One vaulting base: a case is everything handed in on one visit, made of one-card contracts, each with its own incentive rate, and a financed card is its own financed contract | Owner |
| The clock is the card's | Decided | Per card from its contract's effective start date, not per case, so cards in one case unlock on their own days | Owner |
| Credited while locked | Decided | The incentive accrues from day one; the N days only stop it being cashed out. The held-then-posted reading is a way of showing it, never a second way of crediting it | Owner |
| Two early fees | Decided | The vault and consignment each have their own, either may be 0; the vault's runs on a Y-day period of its own | Owner |
| Prices in yen | Decided | Converted at the ECB's daily reference rate; a rate outside its bounds, or moving too far in a day, is flagged for staff - decided by the owner, 2026-10-27, flagged rather than held on 2026-10-28 | Owner |
| Where prices come from | Decided | A separate price worker, reached by a service binding; its answer's shape is assumed until it exists - decided by the owner, 2026-10-27 | Owner |
| The fee at the till | Decided | A Shopify invoice paid by link or loaded at the till, so no amount is typed - decided under the owner's delegation, 2026-10-27 | Product |
| KYC | ❓ | When identity is asked for is still being discussed; today's rule stands at deposit, and cash-out and sale proceeds ask always until it is | Owner |
| A sale is not an early withdrawal | ❓ | A card sold through consignment forfeits nothing; its credited incentive unlocks on its own day - built so, 2026-10-27 | Owner |
| The fee is paid by card | Decided | The early fee is paid on a Shopify invoice and recorded on the vault's money register, never taken from the earnings balance | Product |
| Nothing is held | Decided | An unlikely price or rate is used and flagged, never held, because a credit stays locked until day N and nothing is cashed out without a second treasurer; a wrong one is corrected in Inventory and the days it priced are worked again with no second approver - decided by the owner, 2026-10-28 | Owner |
| A late fact waits | Decided | A day whose price or rate has not arrived waits and is paid in full, rather than earning nothing after 3 days - decided by the owner, 2026-10-28 | Owner |
| Cash-out | ❓ | At least HKD 500, every 7 days, to an account in the owner's verified name, a debt blocking it, a batch approved by a second treasurer | Owner |
:::
