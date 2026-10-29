---
title: Vault Intake
order: 1
---

The vault-first intake: a collector leaves cards in the vault, at no charge for
now, and eligible cards earn a daily incentive. It replaces the storage lane of a case;
the financed lane is unchanged - [Case Lifecycle](/p/grade10-site/finance/case-lifecycle).

## Ways In

- 🚧 **Card Event** — staff meet collectors in person and register their cards on the intake form; Phase 1
- 🚧 **The Shop's Counter** — a collector brings cards to the shop in Causeway Bay; the same form and flow as an event; Phase 2

## Intake Form

Staff register the cards on the intake form, at a card event or the shop's counter.

1. 🚧 **Location** — the card event, or the shop in Causeway Bay from Phase 2
2. 🚧 **Collector** — found by email, or a new account created and an invite sent
   - **Phone Number** — taken if the account has none; not confirmed by a code
   - **ID** — staff read the collector's ID document in hand: the legal name as shown, the ID type, the ID number, and a tick that the collector is 18 or over
     - **Number Kept Masked** — typed once, and kept only as a mask (A1****6(7)) and a one-way digest; the full number and the date of birth are never stored
   - **Ownership Declaration** — the collector declares they own every card
3. 🚧 **Cards** — card, condition or certificate, front and back photos; a label printed for each
   - **Market Price** — the card's 30-day price, shown to the collector
   - **Sales and Liquidity** — the card's sales count and liquidity, in the staff's detail view
   - **Estimated Daily Incentive** — or Not Eligible, for a card that earns nothing
   - **Skip Incentive Approval** — a checkbox on each card, unticked by default; staff tick it when they have already authenticated the card and verified its value on the spot, so it needn't wait for approval - [Incentive](/p/grade10-site/vault/incentive#earning)
4. 🚧 **Consign Now** — optional, per card; the card is registered into the vault first, then consigned in the same visit: the store, the auction or both, the lowest acceptable price (required for the store or both, optional for the auction), price-checked as on the consign form, and the commission; Grade10 sets the list or starting price at approval - [Consigning](/p/grade10-site/consignment/consigning#listing-approval)
5. 🚧 **Sign** — on the shop's tablet, or by a link emailed to the collector
   - **Vault Terms** — signed
   - **Consignment Agreement** — signed only where a card is consigned now
   - **Custody Receipt** — confirmed

:::callout{kind="note"}
- ❓ **ID at intake** — whether 18 is the minimum age to vault, and whether intake may collect the HKID number, kept only as a mask and digest, under the Privacy Commissioner's Code of Practice on the ID Card Number; recommended: 18, and the number kept as a mask and digest. Product confirms before Phase 1, mid November
:::

## Authentication

Professional staff check that each card is genuine. The check fits around the
intake, so an intake never waits for it.

- 🚧 **At the Counter** — the usual way: staff check the card before the collector signs, and a card that fails comes off the form
- 🚧 **Checked Later** — the card is photographed and kept unchecked, the collector agrees the terms and signs the same visit, and staff check it afterwards
  - **Progress** — staff record each step, and the collector is told when the card passes or fails
  - **Until It Passes** — held in the vault as Authenticating; it neither earns nor goes on sale, and its incentive approval can't be skipped
  - **Fails Later** — returned to the collector; a consignment signed for it is cancelled, never having been listed

:::callout{kind="note"}
- ❓ **Terms for a card checked later** — whether it signs special terms. Product confirms before Phase 1, mid November
:::

## What an Intake Needs

- 🚧 **Account** — a Grade10 account with a confirmed email
- 🚧 **Phone Number** — on the account, for contact and abuse checks; it proves no identity
- 🚧 **Signed Declaration** — that the collector owns the cards
- 🚧 **ID Recorded** — the legal name, ID type, masked number and digest, and 18 or over, read by staff at intake; the identity a withdrawal is checked against - [Vault Withdrawal](/p/grade10-site/vault/vault-withdrawal#collection)
- 🚧 **Identity Check** — not at an intake in person; it comes before money leaves Grade10 - [Earnings Wallet](/p/grade10-site/account/earnings-wallet#identity-check)

## Card States

1. 🚧 **Received** — recorded and photographed at intake
2. 🚧 **Authenticating** — at the counter, or later for a card kept unchecked - [Authentication](/p/grade10-site/vault/intake#authentication)
3. 🚧 **In the Vault** — passed and stored; not earning yet
4. 🚧 **Approved to Earn** — passed incentive approval, or approved at intake where staff skipped it; earning from the next day - [Incentive](/p/grade10-site/vault/incentive#earning)

- 🚧 **Failed** — returned to the collector; it never earns
- 🚧 **Afterwards** — an earning card is consigned, sold or withdrawn; a consignment ended or unsold comes back earning - [Ending a Consignment](/p/grade10-site/consignment/ending-a-consignment)

::image{src="assets/diagrams/vault-card-life.svg" alt="A card in the vault: Received, Authenticating, In the Vault, Approved to Earn and Consigned; a card that fails authentication is Failed and returned; an earning card is Withdrawn, collected at the shop; a consigned card is Sold, or comes back earning when the consignment ends or it goes unsold"}

## Custody

- 🚧 **Locations** — the shop in Causeway Bay, and a card event until the card moves
  - **In Transit** — a card between two locations; not a location itself
- **Shipping** — Kerry Logistics comes to the shop to take what ships; it is never a location - [Inventory and Sales Channels](/p/grade10-site/store/inventory-and-channels#inventory-location)
- **Moves** — recorded when the card leaves and when it arrives, both confirmed by hand by staff - [Vault Operations](/p/grade10-site/vault/operations#moves)
- 🚧 **Storage Fee** — an admin setting, nothing for now; every change logged
  - **Pinned to the Vault Terms** — the fee in force when the collector signs; a change reaches only Vault Terms signed after it, so a collector already in the vault pays a new fee only once they sign new terms

:::detail{title="Product decisions" for="pm"}
The intake is the top of the funnel, so it asks for as little as it safely
can: an account, a phone number, a declaration and the ID staff read in hand.

- **Events first, then the shop** — Phase 1 takes cards in person at card events, where staff reach collectors; the shop's counter joins in Phase 2 on the same form
- **Storage at nothing for now, as a setting** — a fee would turn away the intakes the incentive is paying for, and a setting leaves room to charge one later without a rebuild; pinned to the Vault Terms, so a fee is never added to terms a collector already signed
- **Checked at the counter, or later** — the counter check is the usual way, but an intake shouldn't wait for a professional to be free; a card kept unchecked earns and sells nothing until it passes, so taking it early costs nothing
- **The ID read at intake, kept masked** — a withdrawal is matched against it at the counter, so no identity check is needed to take a card home, and no usable ID number is stored
- **A phone number captured, not confirmed** — it serves contact and abuse checks and proves no identity
:::
