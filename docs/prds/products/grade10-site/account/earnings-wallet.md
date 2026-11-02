---
title: Earnings Wallet
order: 8
---

One wallet per collector, where everything they can cash out collects: the
vault's daily incentive and consignment sale proceeds -
[Incentive](/p/grade10-site/vault/incentive),
[Consigning](/p/grade10-site/consignment/consigning).

## Wallet

- 🚧 **Available Amount** — incentive and sale proceeds posted, less cash-outs; all of it cashable
  - **Denominated in US Dollars** — everything in the wallet reads US$; decided by the owner, 2026-10-30
  - **Incentive** — posted daily, after the card's vesting - [Incentive](/p/grade10-site/vault/incentive#reaching-the-wallet)
  - **Sale Proceeds** — posted 3 business days after the buyer pays
  - **Vesting** — shown beside it, with its release date; not part of the wallet
  - **Built** — one balance per owner, showing what can be cashed out and what is still locked, each locked amount with the day it unlocks; sale proceeds reach it only where the brand pays consignors into it
- 🚧 **Earnings, Not a Balance** — cashed out only, never spent on Grade10
- 🚧 **Corrections Take a Second Person** — a wrong entry is reversed, never edited, by someone other than whoever wrote it

## Sale Proceeds

- 🚧 **When** — 3 business days after the buyer pays, without waiting for delivery
- 🚧 **Into the Wallet** — always; the counter asks for no payout account, and the collector names one at cash-out
  - **In the Store** — from payment at the shop's counter
  - **At Auction** — from the winner's payment
  - **Built** — one setting for the brand picks where a person's proceeds go, and the consignment agreement pins it when it seals; a partner is always paid by bank. Paid after the return window by default
    - **A Bank Account for the Consignment** — the counter names the account with the terms, before the agreement is prepared, and the agreement prints it; it pays that consignment alone and stays off the consignor's list
    - **A Bank Account Kept on Their List** — the same, and the account joins the consignor's list for the counter to pick next time; the default
    - **Into the Wallet** — credited once each sale is settled, with no bank details on file; a refund after that is a negative entry. An incentive paid at signing goes there too, unless the counter pays it on the spot
- **Payout** — sale price less commission, never below HKD 0; shipping, tax, payment fees and insurance are not part of the sale price
- **Refund After Payout** — a cancelled, refunded or returned order is reversed from the wallet, with a credit note
- **Debt** — deductions the wallet can't cover; cash-outs stop until it is cleared
- **Statements** — each period, one settlement statement and one commission invoice per collector, listing each order

## Cash-Out

- 🚧 **Request** — at least US$65, one every 7 days
  - **Currency** — cashed out in Hong Kong dollars or US dollars; an HKD request pays the day's converted amount, and a USD or overseas-bank request is handled manually by our team - decided by the owner, 2026-10-30
  - **Built** — staff-side only: the collector's page to see the wallet, save a payout account and ask for a cash-out is not built yet
- 🚧 **Paid** — within 3 business days, by FPS or bank transfer
  - **Built** — by bank transfer, to a payout account whose name matches the verified identity
- 🚧 **Held While It Is Paid** — the amount leaves what can be cashed out the moment it is asked for, and comes back if its batch is rejected
- **Account** — entered on the first request, saved to the profile and filled in next time; in the verified collector's name
  - 🚧 **Changing It** — the collector may change it, after passing the identity check again
- **Held** — while the collector has a debt

:::callout{kind="note"}
- ❓ **Cash-out maximum** — US$6,500 (≈ HKD 50,000) a request, or no maximum with a manual review above a threshold. Finance confirms before Phase 2, 6 December
:::

## Payouts

What finance does with the requests.

- **Batches** — finance approves cash-outs in batches, pays them by FPS or bank transfer to the saved account, and marks each paid with its payment reference
  - 🚧 **Two Treasurers** — a batch is approved by a treasurer other than the one who gathered it
  - 🚧 **A Bounced Payment Comes Back** — staff return one cash-out of a paid batch, and its amount is back in the wallet
- **Collectors in Debt** — listed, their cash-outs held until the debt is cleared
- **Statements** — issued each period, with a credit note for a refund after settlement - [Vault Documents](/p/grade10-site/vault/documents#papers)

## Identity Check

- 🚧 **When** — where money leaves Grade10: when the first cash-out is requested, and when the cash-out account changes; never at a consignment intake - [KYC](/p/grade10-site/account/kyc)
  - **Mail-In** — before staff approve a mailed-in card, since no staff see the collector - [Mail-In](/p/grade10-site/vault/intake#mail-in)
  - **Proceeds Held** — sale proceeds reach the wallet unchecked, and can't be cashed out until the check passes
  - **Not for a Retrieval** — staff check the ID at the counter against the one recorded at intake - [Vault Retrieval](/p/grade10-site/vault/vault-retrieval#collection)
  - **Built** — at every cash-out and before sale proceeds reach the wallet; each point is an admin setting - [Identity Check](/p/grade10-site/finance/identity-check#gate)
- 🚧 **Verified Name** — every cash-out goes only to the verified collector
- 🚧 **Review** — finance approves or rejects, with a reason shown to the collector

## Abuse Checks

- 🚧 **Signals** — accounts sharing a phone, device or bank account; a card vaulted, retrieved and vaulted again; a card's price moving sharply on SNKRDUNK
- 🚧 **Review** — staff may pause incentive on the card or the account

:::detail{title="Product decisions" for="pm"}
One wallet holds everything a collector can take out, so the collector reads one
number and finance pays one way. Money only leaves to a verified name; the
intake itself stays light.

- **Paid 3 business days after the buyer pays** — proceeds don't wait for delivery or a return window; a rare refund is reversed from the wallet instead
- **At least HKD 500, once every 7 days** — keeps payouts batchable for finance
- **Identity before money leaves, not at intake** — anti-money-laundering practice asks for it at the exit, and asking at the door would turn intakes away
- **Earnings, not a balance** — it is cashed out only, so it never reads as store credit
- **Not in scope** — spending the wallet on Grade10; payout to a card

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| KYC | ❓ | When identity is asked for is still being discussed; today's rule stands at deposit, and cash-out and sale proceeds ask always until it is. The counter review of 2026-11-02 took it off consignment intake and sale proceeds, leaving the cash-out | Owner |
| Cash-out | ❓ | At least US$65, every 7 days, paid in HKD or USD, to an account in the owner's verified name, a debt blocking it, a batch approved by a second treasurer | Owner |
| The payout flow | 🚧 | Proceeds go to the wallet, and the account is named at cash-out, not at the counter - the counter review, 2026-11-02, settling the brand setting left open on 2026-10-27; a partner is always paid by bank | Owner |
:::

:::detail{title="Code map" for="engineer"}
- **The wallet** - `packages/vault/backend/src/earnings/`, a module with its
  own RPC entrypoint in the vault wall; consignment proceeds arrive over
  `ConsignmentVault`
- **Cash-out** - `packages/vault/backend/src/earnings/cashOut.ts`, with the
  batches on the vault's money register
:::
