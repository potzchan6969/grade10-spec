---
title: Consignment
icon: storefront
---

Consignment is selling a card a collector keeps in the Grade10 vault, in the
store or at auction, for a commission. The card is already deposited and
authenticated, so consigning is an online application on a vaulted card, with
no second intake - [Vault](/p/grade10-site/vault).

:::flow{title="One consignment"}
# Consigning

## Collector — Consign
From the dashboard: the store, the auction or both, the lowest price they accept, and the agreement signed in the app.

## Staff — Approve the listing
Grade10 sets the list or starting price, and for both channels where the card starts.

# Selling

## Buyer — Buy it
In the shop, online or at auction; the card ships from the vault and stops earning.

## Grade10 — Settle
Sale price less commission reaches the wallet 3 business days after the buyer pays.
:::

| Page | What it holds |
| --- | --- |
| [Consigning](/p/grade10-site/consignment/consigning) | The consign form, the terms, the price check, approval, both channels, the store and the auction |
| [Ending a Consignment](/p/grade10-site/consignment/ending-a-consignment) | Taking a card off sale before it sells |
| [Consignment Dashboard](/p/grade10-site/consignment/dashboard) | The staff view that turns vaulted cards into sales |
| [Consignment Console](/p/grade10-site/consignment/operator-console) | The admin section's queue, one consignment, payouts and settings |
| [Earnings Wallet](/p/grade10-site/account/earnings-wallet#sale-proceeds) | Sale proceeds, statements and cash-out |

## Values

Every figure is a setting an admin changes, each change logged; the value below
is the default it starts on.

| Setting | Default |
| --- | --- |
| Consignment period | **1** year from signing |
| Sale proceeds | in the wallet **3** business days after the buyer pays |
| Fee for ending early | ❓ unset |
| Currency | HKD |

- 🚧 **Proceeds as built** - the brand's payout setting picks where they go,
  by default a bank account kept on the consignor's list after the return
  window - [Earnings Wallet](/p/grade10-site/account/earnings-wallet#sale-proceeds)

:::detail{title="Product decisions" for="pm"}
For a collector whose card is already in the vault, consigning should take a
minute from a phone; for Grade10, the commission is what pays for the vault.

- **Consign fully online** — the collector consigns and signs from the dashboard; a counter or paper consignment was the old intake, and a vaulted card needs none
- **Lowest acceptable price only** — replaces a list price and floor agreed at signing: the collector keeps a hard limit and Grade10 prices the listing, so there is less back-and-forth
- **Paid 3 business days after the buyer pays** — replaces payout after the return window; a later refund is reversed from the wallet, so the collector isn't kept waiting on a rare return
- **No incentive at consigning** — replaces the incentive paid on consigning: a vaulted card earns daily, consigned or not, so consigning never costs the collector the incentive - [Incentive](/p/grade10-site/vault/incentive)
- **Not in scope** — one card in the store and at auction at once; the collector setting the list price
:::
