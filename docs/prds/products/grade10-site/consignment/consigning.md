---
title: Consigning
order: 1
---

## Two Ways In

- 🚧 **At Intake** — the main way: staff set a card to Consign on the intake form; it is registered into the vault first and consigned in the same visit, and the collector signs the Consignment Agreement with the Vault Terms - [Vault Intake](/p/grade10-site/vault/intake#intake-form)
- 🚧 **From the Dashboard** — a card already in the vault, on the consign form below
- 🚧 **Approved Alike** — either way, staff approve the listing before it goes on sale - [Listing Approval](/p/grade10-site/consignment/consigning#listing-approval)

## Consign Form

From the dashboard, for cards already in the vault.

1. 🚧 **Cards** — chosen from the collector's vaulted cards
2. 🚧 **Terms** — per card, the store or the auction, and the lowest acceptable price; the commission shown at Grade10's rate for the channel chosen
3. 🚧 **Review and Sign** — the estimated payout, then the Consignment Agreement signed in the app

- 🚧 **Pending Approval** — what the collector sees until staff approve the listing
- 🚧 **Staff Help** — staff may help a collector use the dashboard; the collector submits and signs

## Terms

The collector sets one price, the lowest acceptable price: a hard limit no sale
goes below. Grade10 prices the listing at approval.

| Term | At the store | At auction |
| --- | --- | --- |
| 🚧 Lowest acceptable price | required: the lowest the collector sells for; staff may price higher at their will | required: the reserve; the lot never sells below it |
| 🚧 Price Grade10 sets | the list price, never below the lowest acceptable price | the starting price |
| Commission | 🚧 a share of the sale price, one rate for the store, replacing the price bands | a share of the hammer price only, one rate; the buyer's premium is Grade10's |

- **Commission**
  - **Minimum Charge** — optional, per card
  - **Pinned to the Agreement** — the rates in force when the agreement is prepared; a later change reaches only the next agreement
  - **Outside the Schedule** — a rate negotiated for a partner is set by someone who may approve it - [Consignment Console](/p/grade10-site/consignment/operator-console#grants)
- 🚧 **Consignment Period** — 1 year from signing
  - **Built** — a term from the brand's settings; its dates are set when the agreement seals, an item ends on its latest signed renewal, and a lot already placed runs to its close
- **Agreement** — one Consignment Agreement a consignment; a change makes a new version, never an edit
  - 🚧 **Renewal Is Signed** — extending or repricing prepares a renewal the consignor signs, linked to the one it renews
- 🚧 **No Incentive at Consigning** — built as a setting that starts at 0, so the agreement leaves its line out; a vaulted card earns the vault's daily incentive instead - [Incentive](/p/grade10-site/vault/incentive)

## Price Check

On the intake form's Keep or Consign step, on the consign form, and whenever the lowest price is changed.

- 🚧 **Market Price** — the card's 30-day SNKRDUNK median, or the fixed price an admin entered in its place; a card with no market price has no check
- 🚧 **The Check** — how far the lowest acceptable price sits from the market price:

```text
gap = (lowest acceptable price − market price) ÷ market price

gap more than 20% below   warned; kept only if the collector confirms again
gap more than 50% above   refused; the collector lowers it to continue
otherwise                 accepted
```

- 🚧 **Never Forced Up** — a warned collector may keep a low price
- 🚧 **Settings** — the 20% and 50% limits are admin settings
- 🚧 **At Approval** — staff see the market price and whether the collector confirmed a low price, so there is less back-and-forth

For a card with a market price of HKD 10,000:

| Lowest acceptable price | Gap | Outcome |
| --- | --- | --- |
| HKD 7,500 | 25% below | warned; kept if the collector confirms again |
| HKD 9,000 | 10% below | accepted |
| HKD 14,000 | 40% above | accepted |
| HKD 16,000 | 60% above | refused; the collector lowers it |

- 🚧 **Limits** — 20% below and 50% above, each an admin setting that can be switched off; a low price the collector confirms keeps the limits it was checked against

## Listing Approval

- 🚧 **Staff Approval** — every consignment, before it goes on sale
  - **Authenticated First** — a card checked later waits until it passes - [Authentication](/p/grade10-site/vault/intake#authentication)
  - **The Vault's Word on Each Card** — approval waits until the Vault Terms seal and the card is authenticated; the vault also confirms each card is the collector's and still held, and the market price is read by Grade10, never sent by the page
  - **List or Starting Price** — set by Grade10, as the terms say
  - **Approved** — listed: a store product, or the card added to an auction lot
  - **Rejected** — the mandate ends as rejected, the collector is emailed why, and the card stays in the vault, earning
- 🚧 **Changing the Lowest Price** — from the dashboard; approved like a new listing
  - **In the Store** — a new lowest price above the list price raises the list price to match
  - **At Auction** — until the catalogue is published, then locked

## Consign to Store & Auction

- 🚧 **One Channel a Consignment** — for the store or the auction; a card unsold in one goes to the other under a new consignment, signed again; it is never in both at once - [Services and Hand-offs](/p/grade10-admin/inventory/services#hand-offs)

### At the Store

- **One Product, Every Store Channel** — the card is one store product, on the shop's tills at Causeway Bay and events, in the online store and at partners - [Inventory and Sales Channels](/p/grade10-site/store/inventory-and-channels)
  - 🚧 **Shop, Online or Both** — staff list a store card in the shop only, online only, or both
  - **First Sale Wins** — the card comes off the other channels at once; a second sale of the same card is refunded
    - 🚧 **Sold Twice** — a till sale of a card an online buyer paid for at the same moment stands; the online buyer is refunded and staff alerted
  - 🚧 **One Buyer at a Time** — an open order holds the card, refusing every other buyer until it is paid, expires or is cancelled
  - 🚧 **Phase 1: the Shop's Tills Only** — the online store and partners are switched off, so a card consigned to the store sells at the shop in Causeway Bay and at events until they are switched on
  - **Marketplace** — online, later, with no date; it joins as one more store channel, the first sale wins, and its commission is decided then
- **Sales Report Themselves** — the store and the auction report each sale, delivery and refund; staff record one by hand only where a channel didn't
- 🚧 **Price Changes** — entered by staff; they may raise the price at their will, never below the lowest acceptable price
  - **Later, by Rule** — from the latest sale, never below the lowest acceptable price; the product's details and filters come from the vaulted item - [Store Listings](/p/grade10-site/store/store-listings)
- 🚧 **Handover** — the buyer takes the card at the counter; a card held elsewhere moves to the shop first
  - **Online Orders** — once online is on, an order ships from the shop, Kerry Logistics collecting it there
  - **First Hold Wins** — a card held for an online checkout is the shop's to keep for that checkout; the till never cancels it
  - **Released to Its Buyer** — on delivery, under the consignment agreement; no release paper, no early retrieval fee, and the card's credited incentive is kept - [Case Lifecycle](/p/grade10-site/finance/case-lifecycle)

:::callout{kind="note"}
- ❓ **The release clause** — its exact words in the consignment agreement; a draft prints until they are confirmed. Legal confirms
:::

### At Auction

- 🚧 **Lot** — listed from the vault; the reserve is the lowest acceptable price
  - **Built** — the lot opens at the floor agreed at signing, with no reserve; an HKD floor at a dollar auction is converted at US$1 = HK$7.85, rounded up, the rate kept on the lot, and the sale comes back in HKD
- 🚧 **Winner Doesn't Pay** — the card is relisted
- 🚧 **Handover** — shipped from the shop, or collected there

## The Sale Price

- **Paid on the Listed Price** — a discount the buyer gets at checkout is Grade10's, and so is a refund where the buyer keeps the card
- **The Collector's Until Sold** — ownership passes to the buyer only when the card is delivered or collected
- **Points and Discounts** — points, coupons and the shop's discounts reach a consigned card, and the collector is still paid on the listed price; staff leave consigned cards out of a discount by its collection in the store

## Refunds

- 🚧 **After Delivery** — the mandate ends and the proceeds are reversed from the wallet - [Earnings Wallet](/p/grade10-site/account/earnings-wallet#sale-proceeds)
  - **A Card Sent Back** — comes in through a new intake, since the vault released it to its buyer - [Vault Intake](/p/grade10-site/vault/intake#intake-form)
- 🚧 **Before Delivery** — while the vault still holds the card
  - **In the Store** — the refund may relist the card for the rest of its term
  - **At Auction** — the refund ends the mandate, and the card is vault-only again

## Consignment States

1. 🚧 **Ready to Sign** — `profile.consignments.view.signing` ("Ready to sign"): consigned at intake, the agreement not yet signed
2. 🚧 **Waiting for Approval** — `profile.consignments.view.pending` ("Waiting for approval"): signed, until staff approve the listing
3. 🚧 **On Sale** — `profile.consignments.view.onsale` ("On sale"): in the store or at auction, still earning
4. 🚧 **Sold** — `profile.consignments.view.sold` ("Sold"): the card stops earning; proceeds reach the wallet 3 business days after the buyer pays
5. 🚧 **Closed** — `profile.consignments.view.closed` ("Closed"): the sale settled

- 🚧 **Ended** — `profile.consignments.view.ended` ("Ended"): declined, lapsed, rejected, unsold, taken off sale or refunded; a card still in the vault is vault-only again and keeps earning

::image{src="assets/diagrams/consignment-mandate.svg" alt="A sale mandate: Ready to sign, made at Keep or Consign; Waiting for approval, which waits for the vault's word; On sale in the store or at auction; Sold, when the card stops earning; Closed with the proceeds in the wallet. A declined or lapsed agreement, a rejection, or a card unsold or taken off sale ends the mandate, and the card keeps earning; a sale refunded has its proceeds reversed, and a store refund before delivery relists the card, while a refund after delivery or at auction ends the mandate"}

## Seller Name

- **Off by Default** — the store and the lot name no consignor
- **Turned On** — by an admin for one consignment, only where the collector agreed to be named in its agreement
- **Display Name** — the name the collector gave to be shown, never their legal name
- **Agreement Withdrawn** — the name comes off the store and the lot at once

## Notifications

By email, in the collector's language.

| Notification | When |
| --- | --- |
| Agreement signed | the sealed agreement, with its terms |
| On sale | listed in the shop or at auction, with its link |
| Price changed | staff changed the price |
| Off sale | taken off sale, with the reason |
| Sold | the sale price, and when the proceeds reach the wallet |
| Ended unsold | the period ended without a sale |

- 🚧 **Pending Approval** — a notification when staff approve or reject a consignment the collector submitted
- 🚧 **Ended Unsold** — says the card is back in the vault and earning
- 🚧 **Sold** — names the day the proceeds reach the wallet, 3 business days after the buyer pays

## End of the Period

- 🚧 **Unsold After a Year** — the card goes back to vault-only and keeps earning; the collector consigns it again or retrieves it

:::detail{title="Product decisions" for="pm"}
A consigned card is always a vaulted card, authenticated and photographed once,
so consigning it takes no second intake: a tick on the intake form, or a few
taps later. Asking only for the lowest price the collector accepts
lets Grade10 price the listing while the collector keeps a hard limit.

- **Vault first, then consign** — at intake both happen in one visit, the card registered into the vault before it is consigned; later the collector consigns from the dashboard, where staff may help but never submit. Either way the collector signs, so the agreement is their own act
- **Every lot has a reserve** — the lowest price is required at auction too, so the price check and the minimum commission always have a floor to read - owner, 2026-11-03
- **The price check warns low and refuses high** — a low price may be the collector's reason and is confirmed twice; a price far above market would only stall the sale
- **One channel a consignment** — a card is never on the shelf and in an auction together, and moving it is signed again, so the consignor agrees to each channel's terms; this replaces one agreement for both, moved without a second signature - owner, 2026-11-03
- **A year's period** — long enough for an auction cycle and a slow card, and an unsold card simply goes back to earning
- **Not in scope** — a paper consignment; a collector consigning a card that isn't vaulted, which only a partner does, after 6 December; the collector setting the list price

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| The shop and online | 🚧 | One store product per consigned item; staff list it in the shop, online or both - decided by the owner, 2026-10-27, reversing no shop-only listing of 2026-10-11; Phase 1 opens the shop's tills only, the other channels switched on later - owner, 2026-10-30 | Product |
| Instant incentive | 🚧 | The consignor is paid an incentive on the item's estimated value instantly when the consignment is taken - decided under the owner's delegation, 2026-10-16; it defaults to 0 now that a vault card earns daily, and stays a setting - 2026-10-27 | Owner |
| Open items settled | Decided | The price check's limits are admin settings; the first hold wins at the counter, as built; discounts reach consigned cards at Grade10's cost; partners consign without the vault after 6 December - the counter review, round 3, 2026-11-02 | Product |
| Selling from the vault | Decided | A storage card is consigned where it sits and released to its buyer on delivery under the consignment agreement; the exact clause is confirmed later - owner, 2026-10-27 | Owner |
:::
