---
title: Vault Withdrawal
order: 4
---

The collector takes a card out of the vault and home. Phase 3; until then
staff run withdrawals by hand. It replaces the storage
lane's release; a financed case releases as before -
[Case Lifecycle](/p/grade10-site/finance/case-lifecycle).

:::flow{title="Taking a card home"}
# Asking

## Collector — Request
From the dashboard, or staff for them; a consigned card ends its consignment first and comes back to the vault.

## Collector — Confirm what is forfeited
Everything still vesting before release, or only the day's incentive after it.

# Collecting

## Staff — Move it to the shop
A card held at an event moves to Causeway Bay first; staff confirm it arrived.

## Collector — Book a collection
The ready email links to a collection appointment.

## Staff — Hand it over
The ID checked against the one recorded at intake, the condition against the intake photos; the collector confirms the Withdrawal Note. Incentive already in the wallet stays cashable.
:::

## Request

- 🚧 **Who** — the collector from their dashboard, or staff for them
- 🚧 **Which Cards** — in the vault and not consigned; a consigned card ends its consignment first - [Ending a Consignment](/p/grade10-site/consignment/ending-a-consignment)
- 🚧 **No Identity Check First** — the ID was recorded at intake, and staff check it at the handover
- 🚧 **What Is Forfeited** — shown before the collector confirms
  - **Before Release** — everything vesting on the card
  - **After Release** — only the day's incentive not yet posted
  - **In the Wallet** — never; it stays cashable

:::callout{kind="note"}
- ❓ **Admin fee** — whether a withdrawal is charged; built as the early withdrawal fee below. Product confirms
:::

## Early Withdrawal Fee

As built: a card taken back inside its first days owes the vault's fee, fixed
on the day of the request. Consignment's fee for ending early is its own -
[Ending a Consignment](/p/grade10-site/consignment/ending-a-consignment).

- 🚧 **Default** — HKD 0, and the period it applies for is unset
- 🚧 **Paid by Card on an Invoice** — one Shopify invoice per request, paid from its link or loaded at the shop's till; the withdrawal paper prints the link, and the card is not handed back until it is paid
- 🚧 **Never From the Wallet** — recorded on the vault's money register as paid by card
- 🚧 **Withdrawn, Voided** — a request that is withdrawn voids its invoice
- 🚧 **Waived by Two** — staff may waive a fee with a second person's approval; a fee a refund reopens before the card leaves can then only be waived
- 🚧 **Seen Before It Is Owed** — the collector sees the fee, and what the withdrawal costs in incentive, before they confirm
- 🚧 **A Refund** — staff are alerted as soon as the shop hears of it. Before the card leaves, the release reads the fee again and holds the card; after, it is recorded on the card when staff check its payment, and nothing is taken back from the collector on its own

:::callout{kind="note"}
- ❓ **The fee's period** — how many days from the start the fee applies; unset until the owner names it. Owner confirms
:::

## Collection

- 🚧 **Moving to Causeway Bay** — a card held elsewhere moves to the shop first
- 🚧 **Ready Email** — when staff confirm it arrived, the collector is emailed a link to book a collection appointment; the dashboard shows it too
- 🚧 **Handover** — at the shop, by appointment
  - **Identity** — staff check the collector's face against their ID, and the ID against the one recorded at intake: the legal name must match, and the ID number typed again must match the stored digest
  - **A Mismatch** — the card is handed over only with a recorded reason, naming the staff member who gave it
  - **Someone Else Collecting** — a person the collector named in the dashboard shows their own ID
  - **Condition** — checked against the intake photos
  - **Withdrawal Note** — confirmed by whoever collects

## Withdrawal States

1. 🚧 **Requested**
2. 🚧 **Moving to Causeway Bay**
3. 🚧 **Ready for Collection**
4. 🚧 **Collected**

- 🚧 **Cancelled** — the request is withdrawn before collection

:::detail{title="Product decisions" for="pm"}
A withdrawal is the one moment a card leaves Grade10's hands, so it is handed
over in person, against the ID recorded at intake.

- **Collected in person, at the shop** — no shipping back, so the card is handed only to someone whose ID was checked
- **Checked against the intake ID, not the identity check** — staff saw the ID at intake, so matching it at the counter is enough, and a collector who never cashes out isn't asked to verify online
- **The wallet is kept** — incentive already posted stays the collector's; only what is still vesting is forfeited

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Two early fees | Decided | The vault and consignment each have their own, either may be 0; the vault's runs on a period of its own | Owner |
| The fee at the till | Decided | A Shopify invoice paid by link or loaded at the till, so no amount is typed - decided under the owner's delegation, 2026-10-27 | Product |
| The fee is paid by card | Decided | The early fee is paid on a Shopify invoice and recorded on the vault's money register, never taken from the wallet | Product |
:::

:::detail{title="Code map" for="engineer"}
- **The fee** - `money/obligations.ts`, which release already refuses on; the
  invoice is a Shopify draft order the store issues over `VaultFeeInvoices`
  and the vault reads back, settling only from that read-back
:::
