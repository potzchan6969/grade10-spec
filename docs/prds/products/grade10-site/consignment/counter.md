---
title: Consignment Counter
audience: operator
order: 5
---

Consigning at the counter is the vault's intake form with cards set to
Consign: staff take the consignor, the cards and the photos there, receive
them into the vault, then set what is consignment's own - the terms and the
agreement - [Vault Intake](/p/grade10-site/vault/intake#intake-form).

- 🚧 **New Consignment** — opens the intake form with every card set to Consign
- 🚧 **Keep or Consign** — per card, after the cards are received, with Keep All and Consign All

## Terms

- 🚧 **Per Consigned Card** — the channel, the lowest acceptable price, the commission and the minimum commission - [Consigning](/p/grade10-site/consignment/consigning#terms)
  - **Channel** — the store or the auction; required on every card
  - **Lowest Acceptable Price** — price-checked against the card's market price
  - **Commission** — Grade10's rate for the channel; another rate takes `consignment:approve`
  - **Minimum Commission** — optional, takes `consignment:approve`, and refused at or above the lowest acceptable price
    - 🚧 **The Schedule's Minimum Too** — the lowest price clears the channel's minimum from the schedule as well
  - **List Price Later** — Grade10 sets it at approval - [Consignment Console](/p/grade10-site/consignment/operator-console#one-consignment)
- 🚧 **No Incentive** — the vault's daily incentive replaces it - [Incentive](/p/grade10-site/vault/incentive)
- 🚧 **No Payout Account** — the consignor names one at cash-out - [Earnings Wallet](/p/grade10-site/account/earnings-wallet#cash-out)

## Signing

- 🚧 **With the Vault Terms** — the Consignment Agreement rides on the Vault Terms' own link, a QR on the tablet or one email, and is signed after them - [Vault Intake](/p/grade10-site/vault/intake#intake-form)
  - **Done Opens It** — once the Vault Terms seal, Done opens the agreement on the same link; several consignments from one visit follow one after another
  - **Prepared on Its Own** — the agreement's own prepare and hand-over stay as a fallback
  - **Every Agreement Out** — Start the next intake waits until every consigned card has its agreement out
- 🚧 **The Consignor's Legal Name** — the agreement prints the legal name from the ID read at intake
- 🚧 **Declined or Expired** — cancels its consignment; the Vault Terms still stand, and the cards are kept in the vault
- 🚧 **Voided by Staff** — the consignment stands, and the agreement is prepared again
- 🚧 **Abandoned** — a consignment with no agreement out for 7 days, never prepared or voided, is cancelled
- 🚧 **The Counter Ends at Signing** — a signed consignment waits in Pending Approval, where Grade10 sets the price and lists it - [Consignment Console](/p/grade10-site/consignment/operator-console#queue)

## Partners

- 🚧 **Partner Consignment** — a partner's cards are consigned without the vault: taken in on the console with the same item rows, paid by bank, and given back through Inventory's release; after 6 December - [Consignment Console](/p/grade10-site/consignment/operator-console)
  - **Collectors Always Vault** — a collector's card is consigned only once it is a vaulted card
