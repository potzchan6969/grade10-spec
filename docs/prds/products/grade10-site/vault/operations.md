---
title: Vault Operations
audience: operator
order: 6
---

The staff side of the vault, in the internal portal: the cards waiting at each
step, the moves between locations, who may do what, the daily run, and what
management tracks. Turning vaulted cards into consignments has its own view -
[Consignment Dashboard](/p/grade10-site/consignment/dashboard).

## Queues

- 🚧 **Intake Queue** — cards waiting for authentication, kept unchecked at intake - [Authentication](/p/grade10-site/vault/intake#authentication)
  - **Pass** — the card enters the vault and waits for incentive approval, unless staff skipped it at intake; it earns nothing until approved - [Incentive](/p/grade10-site/vault/incentive#earning)
  - **Fail** — the collector is told and the card is returned; it never earns
- 🚧 **Incentive Approval** — cards waiting to be approved to earn - [Incentive](/p/grade10-site/vault/incentive#earning)
  - **Second Approver** — a second staff member approves a card above a value threshold, skipped at intake or not
- 🚧 **Retrieval Queue** — requests waiting for a move to Causeway Bay, the collection appointments, and the handover with the ID check and the Retrieval Note - [Vault Retrieval](/p/grade10-site/vault/vault-retrieval)

:::callout{kind="note"}
- ❓ **Second approver** — the value above which a second staff member approves. Product confirms
:::

## Moves

- **A Move** — created by staff, and confirmed by hand when the card leaves and when it arrives - [Vault Intake](/p/grade10-site/vault/intake#custody)
  - 🚧 **Missing or Damaged** — on arrival, raised as a discrepancy for review

## Roles

- 🚧 **Vault Staff** — intake, custody and retrievals
- 🚧 **Consignment Staff** — listings and sales
- **Finance** — cash-outs, the identity check and statements; the only role that sees the identity check's documents and bank details
- 🚧 **ID at Intake** — vault staff read the collector's ID in hand and see it afterwards only as its mask

## Daily Run

- 🚧 **Price Import** — from SNKRDUNK each day, its status shown to staff; a card missing its price runs on its grace days - [Incentive](/p/grade10-site/vault/incentive#earning)
- 🚧 **Daily Drip** — once a day, one ledger entry per card; running it twice for the same day never pays twice
- 🚧 **Pause** — staff pause incentive on a card or an account an abuse check flagged; nothing accrues until they release it - [Earnings Wallet](/p/grade10-site/account/earnings-wallet#abuse-checks)

## Staff Dashboard

- 🚧 **At a Glance** — intakes waiting for authentication, cards by location and status, incentive paid against cards consigned, abuse flags, and retrievals and cash-outs waiting
- 🚧 **Reports** — cards vaulted, consigned and sold by owner type; incentive paid against commission earned; days in the vault before consigning; cards earning but never consigned, by age

:::detail{title="Product decisions" for="pm"}
A small team runs the vault by hand in its first phases, so the portal leads
with what is waiting.

- **Three roles** — the identity check's documents and bank details stay with
  finance, so the staff who handle cards and listings never see them
- **Moves by hand** — staff confirm each leg; label scanning was left for later
- **Not in scope** — stocktake, until after launch
:::
