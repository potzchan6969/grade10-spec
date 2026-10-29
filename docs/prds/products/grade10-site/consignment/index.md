---
title: Consignment
icon: storefront
---

Consignment is selling a card a collector keeps in the Grade10 vault, in the
store or at auction, for a commission. The card is already deposited and
authenticated - [Vault Deposit](/p/grade10-site/vault/deposit) - so consigning
is an online application on a vaulted card, with no second intake. The vault
is the top of the funnel; consignment commission is the revenue.

:::callout{kind="note"}
- ❓ **Not built yet** — the owner's model as of 2026-10-29; no change carries it yet. The working draft is [Vault-First Consignment](/references/vault-first-consignment). Product confirms each figure below
:::

## One Card

:::flow{title="One card"}
## *Collector* - **Deposits**
At the shop's counter or an event, for free; staff record and photograph each card - [Vault Deposit](/p/grade10-site/vault/deposit).

## *Staff* - **Authenticate and store it**
The card is checked at deposit and put away in the vault.

## *Staff* - **Approve it to earn**
An internal review checks the card's market price and how easily it sells, then approves it - [Incentive](/p/grade10-site/vault/incentive#incentive-review).

## *Collector* - **Earns daily**
An approved card earns a daily amount into the earnings wallet.

## *Collector* - **Consigns**
From their dashboard: the store or the auction, and the lowest price they accept - [Consigning](/p/grade10-site/consignment/consigning).

## *Staff* - **Review the listing**
An internal review sets the list or starting price and approves it for sale.

## *Buyer* - **Buys it**
In the shop, online or at auction; the card ships from the vault and stops earning.

## *Collector* - **Cashes out**
Sale proceeds reach the wallet 3 business days after the buyer pays; the collector cashes out after the identity check - [Earnings Wallet](/p/grade10-site/account/earnings-wallet).
:::

- **Off the Main Path**
  - **Ending a Consignment** — the card comes off sale and stays in the vault, earning - [Ending a Consignment](/p/grade10-site/consignment/ending-a-consignment)
  - **Vault Withdrawal** — the card goes back to the collector - [Vault Withdrawal](/p/grade10-site/vault/vault-withdrawal)
- **One Card, One Channel** — a card is consigned to the store or the auction, never both
- **Card States** — deposited, authenticated, in the vault, approved to earn, consigned, then sold or withdrawn

## Values

Every figure is a setting an admin changes, each change logged; the value below
is the default it starts on.

| Setting | Default |
| --- | --- |
| Consignment period | **1** year from signing |
| Sale proceeds | in the wallet **3** business days after the buyer pays |
| Fee for ending early | ❓ unset |
| Currency | HKD |

- **Vault Figures** — the free deposit, the incentive rate and vesting - [Incentive](/p/grade10-site/vault/incentive)
- **Wallet Figures** — cash-out minimum, interval and maximum - [Earnings Wallet](/p/grade10-site/account/earnings-wallet)

## Phases

| Phase | Date | What the collector can do |
| --- | --- | --- |
| A — Vault and incentive | mid Nov 2026 | Deposit, see cards in the dashboard and earn incentive; nothing cashes out yet |
| B — Consign and sell | 6 Dec 2026 (store) | Consign online, sell in the store and at auction, cash out after the identity check |
| C — Withdrawal | ❓ unset | Take a card out of the vault by appointment |

- **Phase A Guardrails** — withdrawals run by hand by staff; incentive builds up until cash-out opens
- **Phase B Guardrails** — a store price change is agreed offline and entered by staff

:::detail{title="Product decisions" for="pm"}
Collectors hold cards they might sell some day but won't list today. Asking
them to consign up front loses most of them. A free vault with a small daily
return wins the deposit first; once the card sits in Grade10's vault,
consigning it is one step from the dashboard, with no second intake.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector who might sell | Holds cards with no plan to list them | Deposits for free, sees what each card earns, and consigns when the price suits |
| Collector who wants a return | Holds liquid cards | Earns a daily amount and cashes it out |
| Collector who wants safekeeping | Wants the cards stored safely | Deposits; ineligible cards are stored and can still be consigned |
| Shop staff | A collector at the counter or an event | Registers, photographs and signs in one visit |
| Treasurer | Money owed to collectors | Pays cash-outs in batches to verified accounts |

**Not in scope.** Spending the wallet on Grade10; a storage fee; scanning labels
to record moves; a price staff type in by hand.

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Deposit to consignment | Share of deposited cards consigned, and the days in the vault before consigning | Product |
| Incentive cost | Incentive paid against commission earned | Finance |
| Earning, never consigned | Cards earning past an age without ever being consigned | Product |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Vault first | Decided | The vault is the top of the funnel; consignment starts from a vaulted card, never a new intake | Product |
| A daily incentive, not one at consignment | Decided | Replaces the 5% incentive paid at consignment: a daily amount on eligible vaulted cards, paid whether or not the card is consigned | Product |
| Consign fully online | Decided | The collector consigns and signs from their dashboard; staff may help but do not submit | Product |
| Lowest acceptable price only | Decided | Replaces a list price and floor agreed at signing: the collector sets only the lowest price they accept; Grade10 sets the list or starting price at review | Product |
| Paid T+3 after the buyer pays | Decided | Replaces payout after the return window: proceeds reach the wallet 3 business days after payment; a later refund is reversed from the wallet | Product |
| Vesting on the card | Decided | For a card's first days in the vault its incentive vests on the card and reaches the wallet in one go, once per deposit; nothing in the wallet is ever taken back | Product |
| Two internal reviews | Decided | Staff approve a card before it earns and a listing before it sells | Product |
| No phone code | Decided | The phone number is captured, not confirmed; identity rests on the identity check alone | Product |
| Vesting period | ❓ Open | 30 or 60 days | Product |
| Cash-out maximum | ❓ Open | HKD 50,000 a request, or none with a manual review above a threshold | Finance |
| Fee for ending early | ❓ Open | None, a fixed fee a card, or a fee only once an auction lot is prepared | Product |
:::
