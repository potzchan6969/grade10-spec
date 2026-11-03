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
- 🚧 **Mail-In** — the collector asks online and posts the cards to the KEC warehouse; Phase 3 - [Mail-In](/p/grade10-site/vault/intake#mail-in)

## Intake Form

The one form for every in-person intake, at a card event or the shop's counter.
Keeping a card in the vault and consigning it differ only in what the collector
signs - [Consignment Counter](/p/grade10-site/consignment/counter).

1. 🚧 **Consignor**
   - **Account** — found by email, or a light account opened and an invite sent; the phone number is taken if the account has none, never confirmed by a code
   - **ID Record** — staff read the ID document in hand: the legal name as shown, the kind of document, its number, and a tick that the collector is 18 or over
     - **Kinds** — an HKID, a Taiwan national ID, a Taiwan resident certificate in its old or new form, or a passport, each checked against its own format
     - **Number Kept Masked** — typed once, kept only as a mask that never shows the check digit (A12*****) and a one-way digest; the full number and the date of birth are never stored
     - **Use That Account** — when the same ID is already on another account, staff are told and offered that account
       - **Which Account** — named only to staff who may read identity records; others are told to ask a supervisor
       - **Kept Here Anyway** — staff may keep the cards on the account in hand only with a recorded reason
   - **Ownership Declaration** — the collector declares they own every card
   - **Collection Notice** — shown before the ID is read
   - **Taken At** — required: the shop or a card event; where each card starts in inventory - [Locations](/p/grade10-admin/inventory/locations#places)
   - **Kept At** — where the cards will be held, a place that holds vaulted cards; it starts as Taken At's destination, and a card elsewhere shows To Move until it arrives - [Transit](/p/grade10-admin/inventory/transit)
2. 🚧 **Items** — one row per card: the product, its condition or certificate, its SNKRDUNK card or a fixed price, and front and back photos - [Products and Stock](/p/grade10-admin/inventory/catalog#product-schemas)
   - **A Price Source for Every Card** — a card with neither a SNKRDUNK card nor a fixed price is not received; only staff who may set fixed prices can give one, so others ask an admin
   - **Market Price** — the card's 30-day price, shown to the collector, with its sales and liquidity in the staff's detail view
   - **Estimated Incentive** — about how much a day and over a year, at today's price, or Not Eligible - [Incentive](/p/grade10-site/vault/incentive#daily-amount)
   - **Earns Incentive** — a tick on each card, on by default
   - **Earning Starts** — the day each card starts earning; the day after intake unless staff choose another - [Incentive](/p/grade10-site/vault/incentive#earning)
   - **Authenticated Here or Check Later** — per card - [Authentication](/p/grade10-site/vault/intake#authentication)
   - **Receive** — one press takes every card into the vault and inventory at Taken At and prints its label; a card refused is named, and the rest wait for it
3. 🚧 **Keep or Consign** — per card, with Keep All and Consign All; a consigned card takes its terms there - [Consignment Counter](/p/grade10-site/consignment/counter#terms)
4. 🚧 **Sign** — in one handover, on the shop's tablet or by one email
   - **One Live Link** — emailing the link ends the one on the tablet, and a link opened on the tablet ends the one emailed; the email can be sent again
   - **Vault Terms and Custody Receipt** — always, first
   - **Consignment Agreement** — only when a card is consigned
   - **Agreement Declined** — the Vault Terms still stand, and its cards are kept in the vault

## Authentication

Professional staff check that each card is genuine. The check fits around the
intake, so an intake never waits for it.

- 🚧 **At the Counter** — the usual way: staff check the card before the collector signs, and a card that fails comes off the form
- 🚧 **Checked Later** — the card is photographed and kept unchecked, the collector agrees the terms and signs the same visit, and staff check it afterwards
  - **Progress** — staff record each step, and the collector is told when the card passes or fails
  - **Until It Passes** — held in the vault as Authenticating; it neither earns nor goes on sale, and its incentive approval can't be skipped
  - **Fails Later** — returned to the collector; a consignment signed for it is cancelled, never having been listed
  - **Same Terms** — it signs the standard Vault Terms, which say it earns from its start date once it passes; a card that fails loses nothing

## Mail-In

Phase 3. The business hasn't confirmed how mail-in runs, so it is written now and
built later.

1. 🚧 **Request** — from the collector's account: the cards, each with its condition or certificate and the collector's own photos
   - **Phone Number and Declaration** — as at the counter
   - **ID Record** — taken from the identity check passed online, since no staff see the collector - [Earnings Wallet](/p/grade10-site/account/earnings-wallet#identity-check)
   - **Verified Once** — no staff see the ID, so the request asks for the account's identity check once, before the Vault Terms are signed; an account already verified is asked nothing, and approval asks nothing more
   - **Vault Terms** — signed online
   - **Estimated Incentive and Keep or Consign** — as on the intake form
2. 🚧 **Posting** — a request reference to put in the parcel, the KEC warehouse's address, and packing guidance
3. 🚧 **Received at KEC** — staff match the parcel to the request and record and photograph the cards
   - **Not as Described** — a card missing, damaged or not as described is raised for review, and the collector is told
   - **Custody Receipt** — sent to the collector to confirm
4. 🚧 **Authenticated at KEC** — a card that passes goes to the vault and on to incentive approval; one that fails is returned and never earns - [Incentive](/p/grade10-site/vault/incentive#earning)

- 🚧 **Request States** — Requested, In Transit, Received at KEC, Authenticating, then Approved and sent to the vault, Failed and returned, or Not Received once the request expires; the collector is told of each
- 🚧 **Mail-In Costs** — the collector pays inbound shipping and insurance and the return of a card not as described; Grade10 pays the return of a card that fails
  - **Return Fee** — an admin setting, unset until Finance sets it, pinned to the Vault Terms the request signs; taken from the wallet first
- 🚧 **Request Expiry** — an unreceived request becomes Not Received after 30 days, an admin setting pinned to the Vault Terms, with a reminder a week before

## What an Intake Needs

- 🚧 **Account** — a Grade10 account with a confirmed email
- 🚧 **Phone Number** — on the account, for contact and abuse checks; it proves no identity
- 🚧 **Signed Declaration** — that the collector owns the cards
- 🚧 **ID Record** — read by staff at intake, kept on the collector's account for every service; the identity a retrieval is checked against - [Vault Retrieval](/p/grade10-site/vault/vault-retrieval#collection)
- 🚧 **No Identity Check** — identity is verified once per account, only before money leaves Grade10 - [Earnings Wallet](/p/grade10-site/account/earnings-wallet#identity-check)

## Card States

1. 🚧 **Received** — recorded and photographed at intake, or on arrival at KEC
2. 🚧 **Authenticating** — at the counter, or later for a card kept unchecked - [Authentication](/p/grade10-site/vault/intake#authentication)
3. 🚧 **In the Vault** — passed and in custody under signed Vault Terms
4. 🚧 **Earning** — from its Earning Starts date, once authenticated - [Incentive](/p/grade10-site/vault/incentive#earning)

- 🚧 **Failed** — returned to the collector; it never earns
- 🚧 **Afterwards** — an earning card is consigned, sold or retrieved; a consignment ended or unsold comes back earning - [Consignment Retrieval](/p/grade10-site/consignment/consignment-retrieval)

::image{src="assets/diagrams/vault-card-life.svg" alt="A card in the vault: Received, Authenticating, In the Vault, Approved to Earn and Consigned; a card that fails authentication is Failed and returned; an earning card is Retrieved, collected at the shop; a consigned card is Sold, or comes back earning when the consignment ends or it goes unsold"}

## Custody

- 🚧 **Locations** — the shop in Causeway Bay, the KEC warehouse, and a card event until the card moves
  - **Holds Vaulted Cards** — a setting on each storage unit: the shop's safe and lockers hold vaulted cards, and KEC's units don't until an admin switches them on - [Locations](/p/grade10-admin/inventory/locations#places)
  - **After an Event** — the card moves to the event's destination, or another place staff choose
  - **KEC Warehouse** — Kerry Logistics' warehouse, where mail-in parcels are received and authenticated - [Inventory and Sales Channels](/p/grade10-site/store/inventory-and-channels#inventory-location)
  - **In Transit** — a card between two locations; not a location itself
- **Shipping** — Kerry Logistics comes to the shop to take what ships - [Inventory and Sales Channels](/p/grade10-site/store/inventory-and-channels#inventory-location)
- **Moves** — recorded when the card leaves and when it arrives, both confirmed by hand by staff - [Vault Operations](/p/grade10-site/vault/operations#moves)
- 🚧 **Storage Fee** — an admin setting, nothing for now; every change logged
  - **Pinned to the Vault Terms** — the fee in force when the collector signs; a change reaches only Vault Terms signed after it, so a collector already in the vault pays a new fee only once they sign new terms

:::callout{kind="note"}
- ❓ **Custody Places in the Vault Terms** — the words that name where cards may be held, so a place added later needs no new signature. Legal confirms
:::

:::detail{title="Product decisions" for="pm"}
The intake is the top of the funnel, so it asks for as little as it safely
can: an account, a phone number, a declaration and the ID staff read in hand.

- **Events first, then the shop, then the post** — Phase 1 takes cards in person at card events, where staff reach collectors; the shop's counter joins in Phase 2 on the same form; mail-in waits for Phase 3, once the business settles how parcels are handled
- **Storage at nothing for now, as a setting** — a fee would turn away the intakes the incentive is paying for, and a setting leaves room to charge one later without a rebuild; pinned to the Vault Terms, so a fee is never added to terms a collector already signed
- **Checked at the counter, or later** — the counter check is the usual way, but an intake shouldn't wait for a professional to be free; a card kept unchecked earns and sells nothing until it passes, so taking it early costs nothing
- **One form, two papers** — keeping and consigning share every step and differ only in what is signed; the Vault Terms never wait on the consignment, so a declined agreement leaves the cards in the vault - the counter review, round 2, 2026-11-02
- **The ID read at intake, kept masked** — a retrieval is matched against it at the counter, so no identity check is needed to take a card home, and no usable ID number is stored, under the Privacy Commissioner's Code of Practice on the ID Card Number; confirmed with the 18-or-over tick and IDs in any Hong Kong or Taiwan format in the counter review, 2026-11-02; kept once per account for every service, with the mask hiding the check digit, in the counter review, round 2, 2026-11-02
- **A phone number captured, not confirmed** — it serves contact and abuse checks and proves no identity
- **Where vaulted cards may be held is a setting** — any storage unit can hold them once an admin allows it, so KEC can start holding vaulted cards without a rebuild; mail-in costs follow the recommendation, with the return fee and expiry as settings - the counter review, round 3, 2026-11-02
:::
