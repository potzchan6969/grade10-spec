---
title: Vault Deposit
order: 7
---

The vault-first deposit: a collector leaves cards in the vault for free, and
eligible cards earn a daily incentive. It replaces the storage lane of a case;
the financed lane is unchanged - [Case Lifecycle](/p/grade10-site/vault/case-lifecycle).

:::callout{kind="note"}
- ❓ **Not built yet** — the owner's model as of 2026-10-29; no change carries it yet - [Vault-First Consignment](/references/vault-first-consignment). Product confirms
:::

## Deposit Form

Staff register the cards on the deposit form, at the shop's counter or an event.

1. **Location** — the shop in Causeway Bay or an event location
2. **Collector** — found by email, or a new account created and an invite sent
   - **Phone Number** — taken if the account has none; not confirmed by a code
   - **Ownership Declaration** — the collector declares they own every card
3. **Cards** — card, condition or certificate, front and back photos; a label printed for each
   - **Market Price** — the card's 30-day price, shown to the collector
   - **Estimated Daily Incentive** — or Not Eligible, for a card that earns nothing
   - **Skip Incentive Approval** — a checkbox on each card, unticked by default; staff tick it when they have already authenticated the card and verified its value on the spot, so it needn't wait for approval - [Incentive](/p/grade10-site/vault/incentive#incentive-approval)
4. **Consign Now** — optional, per card: the store, the auction or both, the lowest acceptable price (required for the store or both, optional for the auction) and the commission; Grade10 sets the list or starting price at approval - [Consigning](/p/grade10-site/consignment/consigning#listing-approval)
5. **Sign** — on the shop's tablet, or by a link emailed to the collector
   - **Vault Terms** — signed
   - **Consignment Agreement** — signed only where a card is consigned now
   - **Custody Receipt** — confirmed

:::callout{kind="note"}
- ❓ **Warehouse location** — whether the Kowloon warehouse takes deposits. Product confirms
:::

## What a Deposit Needs

- **Account** — a Grade10 account with a confirmed email
- **Phone Number** — on the account, for contact and abuse checks; it proves no identity
- **Signed Declaration** — that the collector owns the cards
- **Identity Check** — not at deposit; it comes before money or a card leaves Grade10 - [Earnings Wallet](/p/grade10-site/account/earnings-wallet#identity-check)

## Card States

1. **Received** — recorded and photographed at deposit
2. **Authenticating** — checked at deposit
3. **In the Vault** — passed and stored; not earning yet
4. **Approved to Earn** — passed incentive approval, or approved at deposit where staff skipped it; earning from the next day - [Incentive](/p/grade10-site/vault/incentive#incentive-approval)

- **Failed** — returned to the collector; it never earns

## Custody

- **Locations** — the shop in Causeway Bay and an event location until the card moves; the Kowloon warehouse is open, as the note above says
  - **In Transit** — a card between two locations; not a location itself
- **Moves** — recorded when the card leaves and when it arrives, both confirmed by hand by staff
  - **Missing or Damaged** — on arrival, raised for review
- **Storage** — free

:::detail{title="Product decisions" for="pm"}
The deposit is the top of the funnel, so it asks for as little as it safely
can: an account, a phone number and a declaration. The identity check waits for
the moment money or a card leaves.

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Free deposit and storage | Decided | No storage fee for now | Product |
| Authenticated at deposit | Decided | In this phase the card is checked at the counter, before it is stored | Product |
| Moves confirmed by hand | Decided | No label scanning in this phase | Operations |
| Phone captured, not confirmed | Decided | No one-time code; the number serves contact and abuse checks | Product |
| Warehouse deposits | ❓ Open | Whether the Kowloon warehouse is a deposit location | Product |
:::
