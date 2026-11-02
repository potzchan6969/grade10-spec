---
title: Vault Retrieval
order: 4
---

The collector takes a card out of the vault and home. Phase 3; until then
staff run retrievals by hand. It replaces the storage
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
A card held at the KEC warehouse or an event moves to Causeway Bay first; staff confirm it arrived.

## Collector — Book a collection
The ready email links to a collection appointment.

## Staff — Hand it over
The ID checked against the one recorded at intake, the condition against the intake photos; the collector confirms the Retrieval Note. Incentive already in the wallet stays cashable.
:::

## Request

- 🚧 **Who** — the collector from their dashboard, or staff for them
- 🚧 **Which Cards** — in the vault and not consigned; a consigned card ends its consignment first - [Consignment Retrieval](/p/grade10-site/consignment/consignment-retrieval)
- 🚧 **No Identity Check First** — the ID was recorded at intake, and staff check it at the handover
- 🚧 **What Is Forfeited** — shown before the collector confirms
  - **Before Release** — everything vesting on the card
  - **After Release** — only the day's incentive not yet posted
  - **In the Wallet** — never; it stays cashable

## No Retrieval Fee

- 🚧 **Forfeit Is the Only Cost** — a card taken back early loses what is vesting, as its signed terms say, and pays no fee - [Incentive](/p/grade10-site/vault/incentive#reaching-the-wallet)
  - **Built** — a fee for a card taken back inside its first days, HKD 0 by default with its period unset, paid by card on a Shopify invoice before the card is handed back; it is removed - the counter review, round 3, 2026-11-02
- 🚧 **Ending a Consignment First** — consignment's own fee, only once an auction lot is prepared - [Consignment Retrieval](/p/grade10-site/consignment/consignment-retrieval)

## Collection

- 🚧 **Moving to Causeway Bay** — a card at the KEC warehouse or an event moves to the shop first
- 🚧 **Ready Email** — when staff confirm it arrived, the collector is emailed a link to book a collection appointment; the dashboard shows it too
- 🚧 **Handover** — at the shop, by appointment
  - **Identity** — staff check the collector's face against their ID, and the ID against the one recorded at intake, or the identity check for a mail-in: the legal name must match, and the ID number typed again must match the stored digest
  - **A Mismatch** — the card is handed over only with a recorded reason, naming the staff member who gave it
  - **Someone Else Collecting** — a person the collector named in the dashboard shows their own ID
  - **Condition** — checked against the intake photos
  - **Retrieval Note** — confirmed by whoever collects

## Retrieval States

1. 🚧 **Requested**
2. 🚧 **Moving to Causeway Bay**
3. 🚧 **Ready for Collection**
4. 🚧 **Collected**

- 🚧 **Cancelled** — the request is called off before collection

:::detail{title="Product decisions" for="pm"}
A retrieval is the one moment a card leaves Grade10's hands, so it is handed
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
