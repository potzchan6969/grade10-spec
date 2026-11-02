---
title: Consignment
icon: storefront
---

Consignment is selling a card a collector keeps in the Grade10 vault, in the
store or at auction, for a commission. Every consigned card is a vaulted card:
it is registered into the vault first, then consigned, either in the same visit
or later from the collector's dashboard, with no second intake -
[Vault](/p/grade10-site/vault).

:::flow{title="Intake and consign"}
# At the counter

## Collector — Intake and consign
At a card event, or the shop's counter from Phase 2; on the intake form staff set the card to Consign, with the store, the auction or both and the lowest price the collector accepts.

## Collector — Sign
The Vault Terms and the Consignment Agreement together, on the shop's tablet or by an emailed link.

## Staff — Vault it first
The card is authenticated, at the counter or later, and stored; it goes on sale only once it passes, and earns once approved, like any vaulted card.

# Selling

## Staff — Approve the listing
Grade10 sets the list or starting price, and for both channels where the card starts.

## Buyer — Buy it
At the shop's counter, online or at auction; the card stops earning.

## Grade10 — Settle
Sale price less commission reaches the wallet 3 business days after the buyer pays.
:::

- **Consign Later** — a card already in the vault, consigned by the collector from the dashboard and approved the same way - [Consigning](/p/grade10-site/consignment/consigning#consign-form)

| Page | What it holds |
| --- | --- |
| [Consigning](/p/grade10-site/consignment/consigning) | The two ways in, the consign form, the terms, the price check, approval, the store and the auction, notifications |
| [Consignment Retrieval](/p/grade10-site/consignment/consignment-retrieval) | Taking a card off sale before it sells |
| [Consignment Dashboard](/p/grade10-site/consignment/dashboard) | The staff view that turns vaulted cards into sales |
| [Consignment Console](/p/grade10-site/consignment/operator-console) | The admin section's queue, one consignment, payouts and settings |
| [Consignment Counter](/p/grade10-site/consignment/counter) | Taking a consignor's items in one visit: the consignor, the items, the terms |
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

- **Vault first, in one visit** — at intake the card is registered into the vault, then consigned on the same form, so the collector signs once; a card consigned later is consigned from the dashboard. It replaces the old intake, which consigned a card that was never vaulted
- **Lowest acceptable price only** — replaces a list price and floor agreed at signing: the collector keeps a hard limit and Grade10 prices the listing, so there is less back-and-forth
- **Paid 3 business days after the buyer pays** — replaces payout after the return window; a later refund is reversed from the wallet, so the collector isn't kept waiting on a rare return
- **No incentive at consigning** — replaces the incentive paid on consigning: a vaulted card earns daily, consigned or not, so consigning never costs the collector the incentive - [Incentive](/p/grade10-site/vault/incentive)
- **Not in scope** — one card in the store and at auction at once; the collector setting the list price
:::
