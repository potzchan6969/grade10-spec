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
  - **Denominated in US Dollars** — everything in the wallet reads US$, from the start; decided by the owner, 2026-10-30
  - **Proceeds in Hong Kong Dollars** — converted once when credited, at the day's European Central Bank rate, kept with the amount; a refund takes back that same US$ amount
    - 🚧 **A Lot in Its Own Dollars** — an auction sells in US dollars, so a lot's proceeds are credited as they are, converted once and never twice
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
- 🚧 **A Refund, and the Card** — the proceeds are reversed here; whether the card is listed again or the mandate ends is consignment's - [Consigning](/p/grade10-site/consignment/consigning#refunds)
- **Payout** — sale price less commission, never below HKD 0; shipping, tax, payment fees and insurance are not part of the sale price
- **Refund After Payout** — a cancelled, refunded or returned order is reversed from the wallet, with a credit note
- **Debt** — deductions the wallet can't cover; cash-outs stop until it is cleared
- **Statements** — each period, one settlement statement and one commission invoice per collector, listing each order

::image{src="assets/diagrams/consignment-proceeds.svg" alt="Proceeds and refunds through the wallet: the buyer pays at the till, online or for a lot; 3 business days later on Hong Kong's calendar the sale less commission is credited to the wallet in US dollars, converted once, and can be cashed out through the money-out gate; a refund once credited is reversed at the same US dollar amount, and a wallet too short to cover it is in debt"}

## Cash-Out

- 🚧 **Request** — at least US$65 and at most US$6,500, one every 7 days; each figure an admin setting
  - 🚧 **Asked from the Wallet** — the collector asks from their wallet page: the amount and what it arrives in, where it goes, a review, then a submitted confirmation
  - **Review Above** — an admin setting, off by default: a request above it waits for finance, as a held cash-out does
  - **Currency** — cashed out in Hong Kong dollars or US dollars; an HKD request is quoted at the request's rate, kept with it, and a USD or overseas-bank request is handled manually by our team - decided by the owner, 2026-10-30
  - 🚧 **US Dollars and Overseas Banks Go Manual** — the collector submits it the same way, and it lands with the team as a manual request, never paid online
  - **Built** — staff-side only: the collector's page to see the wallet, save a payout account and ask for a cash-out is not built yet
- 🚧 **Paid** — within 3 business days, by FPS or bank transfer
  - **Built** — by bank transfer, to a payout account whose name matches the verified identity
- 🚧 **Held While It Is Paid** — the amount leaves what can be cashed out the moment it is asked for, and comes back if its batch is rejected
- 🚧 **Account** — entered on the first request, saved to the profile and filled in next time; in the verified collector's name; a Hong Kong bank account or an FPS handle
  - 🚧 **Changing It** — the collector may change it, after passing the identity check again
- **Held** — while the collector has a debt

## Payouts

What finance does with the requests.

- **Batches** — finance approves cash-outs in batches, pays them by FPS or bank transfer to the saved account, and marks each paid with its payment reference
  - 🚧 **Two Treasurers** — a batch is approved by a treasurer other than the one who gathered it
  - 🚧 **A Bounced Payment Comes Back** — staff return one cash-out of a paid batch, and its amount is back in the wallet
- **Collectors in Debt** — listed, their cash-outs held until the debt is cleared
- **Statements** — issued each period, with a credit note for a refund after settlement - [Vault Documents](/p/grade10-site/vault/documents#papers)

## Identity Check

- 🚧 **One Check, for the Account** — identity is verified once per account and reused, never by a service at an intake, a signing or a sale - [KYC](/p/grade10-site/account/kyc)
- 🚧 **Before Money Leaves** — a cash-out, or a loan advance when the loan offer is accepted, before the transfer; also once for a mail-in, where no staff see the ID - [Vault Intake](/p/grade10-site/vault/intake#mail-in)
  - **A Loan Whose ID Doesn't Match** — acceptance is refused and the case goes on the held list; once an approver clears it, staff accept the offer again - [Held List](/p/grade10-site/account/earnings-wallet#held-list)
  - **Verified Again Before Payout** — the check runs again at payout, under the new verification, before the transfer
  - **The Store's Bid Bar** — reads the same check - [Identity Check](/p/grade10-site/finance/identity-check)
- 🚧 **When** — at the first cash-out, when the cash-out account changes, and when a new ID has been recorded on the account since the last check
  - **Proceeds Held** — sale proceeds reach the wallet unchecked, and can't be cashed out until the check passes
  - **Not for a Retrieval** — staff check the ID at the counter against the one recorded at intake - [Vault Retrieval](/p/grade10-site/vault/vault-retrieval#collection)
  - **Built** — at every cash-out and before sale proceeds reach the wallet; each point is an admin setting - [Identity Check](/p/grade10-site/finance/identity-check#gate)
- 🚧 **Against the Intake ID** — the verified ID is compared with the ID staff recorded at intake - [Vault Intake](/p/grade10-site/vault/intake#intake-form)
  - **Same Document** — the numbers must match; a different number holds the cash-out
  - **Another Document** — the collector is asked to verify with the document shown at intake; if they verify with another, the legal names are compared, and a different name holds the cash-out
  - **Held for Finance** — a held cash-out is not paid until an approver clears it, or refuses it with a reason and the amount returns to the wallet - [Held List](/p/grade10-site/account/earnings-wallet#held-list)
- 🚧 **Verified Name** — every cash-out goes only to the verified collector
- 🚧 **Review** — finance approves or rejects, with a reason shown to the collector

::image{src="assets/diagrams/money-out-gate.svg" alt="The money-out gate: a cash-out request or an accepted loan offer asks whether the account is verified, then compares it with the ID read at intake, by number for the same kind of document or else by name; a match passes, stamps the account, and the money leaves, batched or transferred; a difference puts it on the held list, oldest first, for any approver but its owner, who refuses it with a reason and the amount returns to the wallet, or clears it, a loan then accepted again; a cleared cash-out above the review line goes to amount review by another approver before it is paid"}

## Held List

The console's list of what the money-out gate held, on the earnings desk.

- 🚧 **What It Lists** — held cash-outs, then loan offers held at acceptance, oldest first, each with why: above the review amount, the ID number differs, or the name differs
- 🚧 **Who Decides** — any approver (`vault:approve`) clears or refuses each, with a reason recorded
  - **Never Their Own** — an approver never decides their own cash-out or loan
- 🚧 **Cleared** — a cash-out goes on to its batch; staff accept a cleared loan offer again
  - **Above the Review Line** — a cash-out cleared for its ID that is above the review line moves to amount review, and another approver decides it
- 🚧 **Refused** — a cash-out's amount returns to the wallet; a refused loan stays refused at its next acceptance
- 🚧 **A Decision Stands** — once one is recorded, an approver acting the other way is told it stands

## Abuse Checks

- 🚧 **Signals** — accounts sharing a phone, device or bank account; a card vaulted, retrieved and vaulted again; a card's price moving sharply on SNKRDUNK
- 🚧 **Review** — staff may pause incentive on the card or the account

:::detail{title="Product decisions" for="pm"}
One wallet holds everything a collector can take out, so the collector reads one
number and finance pays one way. Money only leaves to a verified name; the
intake itself stays light.

- **Paid 3 business days after the buyer pays** — proceeds don't wait for delivery or a return window; a rare refund is reversed from the wallet instead
- **At least US$65, once every 7 days** — keeps payouts batchable for finance
- **Identity before money leaves, not at intake** — anti-money-laundering practice asks for it at the exit, and asking at the door would turn intakes away; one check for the account, compared with the ID read at intake, so a mistyped email at the counter can't send one collector's money to another - the counter review, round 2, 2026-11-02
- **Earnings, not a balance** — it is cashed out only, so it never reads as store credit
- **Not in scope** — spending the wallet on Grade10; payout to a card

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| KYC | 🚧 | Identity is verified per account, only at cash-out, and compared with the ID recorded at intake; a contradiction holds the cash-out for finance - the counter review, round 2, 2026-11-02, settling the question open since deposit | Owner |
| Loans and the identity check | Decided | A loan advance is money leaving Grade10, so the account's one check is required when the loan offer is accepted, before the transfer - the counter review, round 3, 2026-11-02 | Product |
| Cash-out | Decided | At least US$65 and at most US$6,500, every 7 days, paid in HKD or USD, to an account in the owner's verified name, a debt blocking it, a batch approved by a second treasurer; the figures are admin settings, with a review threshold off by default - the counter review, round 3, 2026-11-02 | Product |
| A held loan | 🚧 | A loan whose verified ID contradicts the intake ID is held for an approver like a cash-out, not refused for good, so a mistyped counter ID never bars a loan; nobody decides their own, and a cash-out cleared above the review line takes a second approver for the amount - the S7 review, 2026-11-03 | Owner |
| Money-lenders licence | ❓ | Whether the licence asks for more than the account check before a loan is paid out | Legal |
| The payout flow | 🚧 | Proceeds go to the wallet, and the account is named at cash-out, not at the counter - the counter review, 2026-11-02, settling the brand setting left open on 2026-10-27; a partner is always paid by bank | Owner |
:::

:::detail{title="Code map" for="engineer"}
- **The wallet** - `packages/vault/backend/src/earnings/`, a module with its
  own RPC entrypoint in the vault wall; consignment proceeds arrive over
  `ConsignmentVault`
- **Cash-out** - `packages/vault/backend/src/earnings/cashOut.ts`, with the
  batches on the vault's money register
:::
