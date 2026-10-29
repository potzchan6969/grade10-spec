---
title: Vault Withdrawal
order: 9
---

The collector takes a card out of the vault and home. Phase C; until then
staff run withdrawals by hand. It replaces the storage
lane's release; a financed case releases as before -
[Case Lifecycle](/p/grade10-site/finance/case-lifecycle).

:::callout{kind="note"}
- ❓ **Not built yet** — no change carries it yet. Product confirms
:::

## Request

- **Who** — the collector from their dashboard, or staff for them
- **Which Cards** — in the vault and not consigned; a consigned card ends its consignment first - [Ending a Consignment](/p/grade10-site/consignment/ending-a-consignment)
- **Identity Check** — complete before the request is accepted
- **What Is Forfeited** — shown before the collector confirms
  - **Before Release** — everything vesting on the card
  - **After Release** — only the day's incentive not yet posted
  - **In the Wallet** — never; it stays cashable

## Collection

- **Moving to Causeway Bay** — a card held elsewhere moves to the shop first
- **Ready Email** — when staff confirm it arrived, the collector is emailed a link to book a collection appointment; the dashboard shows it too
- **Handover** — at the shop, by appointment
  - **Identity** — checked against the collector's identity record; name and ID number must match
  - **Someone Else Collecting** — a person the collector named in the dashboard shows their own ID
  - **Condition** — checked against the deposit photos
  - **Withdrawal Note** — confirmed by whoever collects

## Withdrawal States

1. **Requested**
2. **Moving to Causeway Bay**
3. **Ready for Collection**
4. **Collected**

- **Cancelled** — the request is withdrawn before collection

:::detail{title="Product decisions" for="pm"}
A withdrawal is the one moment a card leaves Grade10's hands, so it carries the
full identity check and an in-person handover.

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Collected in person | Decided | At the shop, by appointment; no shipping back | Product |
| Wallet kept | Decided | Incentive already in the wallet stays the collector's | Product |
| Arrival email | Decided | The collector hears when the card is ready to collect | Product |
| Admin fee | ❓ Open | Whether a withdrawal is charged | Product |
:::
