# Vault-first consignment

The owner's product specification for the vault-first consignment model as of 2026-10-29: owners deposit cards into the Grade10 vault, eligible cards earn a daily incentive, and owners consign vaulted cards online to the store or the auction. It was worked out in the interactive walkthrough and is kept here as the draft it records. No PRD page or change carries it yet; decisions move into `docs/prds/` when a change takes it up. Rule ids (VA2, IC14, …) are the walkthrough's and are stable for citing. Open items are marked ❓.

## End-to-end flow

1. **Deposit** — Owner drops cards at CWB or an event. Free; staff record and photograph each card.
2. **Enter the vault** — Card is authenticated and stored in the vault.
3. **Incentive approval** (internal) — Staff check the card's price match and liquidity, then approve it to earn. Staff can skip it at deposit if they already verified the card.
4. **Daily incentive** — Approved, eligible cards earn a daily amount into the earnings wallet.
5. **Consign** — Owner chooses store, auction or both, and sets the lowest acceptable price.
6. **Consignment approval** (internal) — Staff check the listing, set the list or starting price, and approve it for sale.
7. **Sale & settlement** — Sold in store or at auction (one channel at a time), shipped from the vault; incentive stops.
8. **Cash out** — Owner cashes out incentive and sale proceeds after KYC (min HKD 500, every 7 days).

Off the main path:

- **Vault withdrawal** — Owner takes a card back. KYC first; vesting incentive (before the vesting period ends) or the current day's incentive is forfeited; collected at CWB.
- **Consignment withdrawal** — Owner ends a store or auction consignment before the card sells. It comes off sale and stays in the vault.

## Phases

### Phase A — Vault & incentive (Mid Nov 2026)

Owners deposit cards into the vault and earn daily incentive on eligible cards.

- **Vault** — Deposit at CWB or events, with photos and condition notes; Authentication before a card can earn; Custody locations and moves
- **Incentive** — SNKRDUNK 30-day price feed; Liquidity factor and eligibility; Daily accrual into the earnings wallet
- **Identity** — Email confirmation and phone number at deposit, plus ownership declaration
- **View & Management** — Owner dashboard: cards, value, daily incentive, wallet; Staff vault dashboard

Guardrails:

- Cash-out is not available until Phase B, so incentive only builds up
- Withdrawals are handled by staff by hand

Done when:

- Deposit a card at an event, with photos and the owner's confirmation
- The card is authenticated, approved in incentive approval, and starts earning the next day
- The owner sees the card and its daily incentive in their dashboard

### Phase B — Consign & sell (6 Dec 2026 (store))

Owners consign cards from the vault; Grade10 sells them in store or at auction, settles, and owners can cash out.

- **Consign** — One-tap consign from the vault, with per-card terms; Consignment Agreement signed in the app
- **Selling** — Shopify POS at CWB and events; Auction listing from vault stock
- **Money** — Settlement statements and commission invoices; Incentive stops when the card is sold
- **Wallet** — Basic cash-out: minimum HKD 500, once every 7 days; Payout by FPS or bank transfer to an account in the verified name, saved to the profile
- **Identity** — KYC at the first cash-out or sale payout
- **Staff tools** — Internal consignment dashboard: conversion list, approval queues, on-sale monitor, funnel

Guardrails:

- Price changes are entered by staff

Done when:

- Consign a vaulted card and sign the agreement
- Sell it in store and at auction
- Sale proceeds and incentive reach the wallet
- An owner passes KYC and cashes out their sale proceeds and incentive

### Phase C — Withdrawal (Date: TBD)

Owners take cards out of the vault through the product.

- **Vault** — Card withdrawal by appointment; incentive already in the wallet is kept
- **Identity** — KYC at the first withdrawal, if not already done

On go-live:

- Withdrawals handled by hand are entered into the system

Done when:

- An owner withdraws a card; incentive already in the wallet stays cashable

## Rules by domain

### Vault & custody (Phase A)

The vault is the top of the funnel: any owner can deposit cards for free. Grade10 holds them, and eligible cards earn daily incentive. The goal is to turn deposits into consignments.

States: Card: Deposited → Authenticated → In vault → Approved to earn (earning) → Consigned → Sold | Withdrawn


**Deposit**

- **VA1** — Depositing is free.
  - At CWB or a temp event location; KEC warehouse TBC
  - Staff use the deposit form (IN1–IN5)
  - The owner e-signs the Vault Terms and confirms the Custody Receipt
- **VA2** — Before a card earns, it goes through these steps:
  - Received: staff record and photograph it at deposit (Custody Receipt PR1)
  - Authenticating: checked at deposit in this phase
  - In vault: passed and stored; not earning yet
  - Approved to earn: staff approve it in incentive approval (OP6), or it is approved at deposit when staff tick Skip incentive approval (IN3); incentive counts from the day after approval (IC11)
  - Failed: returned to the owner; it never earns
- **VA3** — No storage fee for now.

**Custody**

- **VA4** — Vault locations:
  - CWB store
  - KEC warehouse (TBC)
  - Temp event location (until moved)
  - In transit (NOT an actual location)
- **VA5** — Every move between locations is recorded when the card leaves and when it arrives.
  - In this phase, staff confirm both by hand in the internal portal; no label scanning

### Deposit form (Phase A)

How staff register cards entering the vault, get the owner's e-signature, and optionally consign cards right away.


**Form steps**

- **IN1** — Step 1, deposit location:
  - CWB store, a temp event location, or KEC warehouse (TBC)
- **IN2** — Step 2, owner:
  - Find the Grade10 account by email, or create one and send an invite
  - Phone number captured if the account has none (no one-time code)
  - Owner declares they own every card
- **IN3** — Step 3, cards to send to the vault:
  - Card, condition or cert, front and back photos
  - SKU label generated
  - 30-day SNKRDUNK price shown to the owner; sales count and liquidity in the staff detail view
  - Estimated daily incentive, or 'Not eligible'
  - A Skip incentive approval checkbox on each card (OP6): ticked when staff have authenticated the card and verified its value on the spot; unticked by default, so the card waits for approval
- **IN4** — Step 4, consign now (optional), per card:
  - Consign now: yes or no
  - Service: Store, Auction or Both
  - Lowest acceptable price (a hard limit): required for Store or Both, optional for Auction (none means no reserve)
  - Commission %
  - Grade10 sets the list or starting price at approval (OP3)
- **IN5** — Step 5, sign and confirm:
  - Vault Terms (DC1): e-signed by the owner
  - Consignment Agreement (DC2): e-signed, only if any card is consigned now
  - Custody Receipt (PR1): confirmed
  - On a tablet, or by a link sent to the owner's email

### Vault withdrawal (Phase C)

An owner takes a card out of the vault and back home.

States: Withdrawal: Requested → Moving to CWB → Ready for collection → Collected | Cancelled


**Request**

- **VW1** — The owner requests a withdrawal from their dashboard; staff can also request it for them.
  - Only for cards in the vault that aren't consigned
  - A consigned card must have its consignment withdrawn first (WS1, WA1)
  - Not possible once the card is sold or in the settlement hold
- **VW2** — KYC must be complete before the request is accepted (ID2).
- **VW3** — Incentive already in the wallet stays with the owner and can be cashed out.
  - Before vesting ends (IC12): all held incentive on that card is forfeited
  - After it: only the current day's incentive is forfeited
  - The owner sees the amount before confirming

**Collection**

- **VW4** — If the card is held outside CWB, it moves to CWB first. The collection appointment opens once it arrives.
  - When staff confirm arrival at CWB, the owner gets an email saying the card is ready, with a link to book a collection appointment
  - The owner also sees it in the dashboard
- **VW5** — Handover at CWB:
  - ID check against the owner's KYC record; the name and ID number must match
  - A collector the owner named in their dashboard shows their own ID, which must match the name given
  - Condition checked against the deposit photos
  - The collector confirms the Withdrawal Note (PR3)

### Incentive (Phase A)

A daily amount paid on eligible vaulted cards, treated as an acquisition cost. Revenue comes from consignment commission.


**Formula**

- **IC1** — Daily incentive = 30-day average sale price × liquidity factor × annual rate ÷ 365
  - Example: HKD 10,000 card, liquidity factor 0.6, 3% a year = about HKD 0.49 a day
- **IC2** — 30-day average sale price comes from SNKRDUNK:
  - Median of sales in the last 30 days, outliers removed
  - At least the minimum sales for its price tier (IC14), or the card doesn't earn
  - No SNKRDUNK price, or fewer sales than its tier minimum: Not eligible; staff can't enter a price by hand
  - A card that was earning and loses its price keeps earning on its last value during the grace days (IC15)
- **IC3** — Liquidity factor (L), between 0.2 and 1: ❓ T1
  - L = velocity × price stability
  - Velocity = min(1, sales in 30 days ÷ the sales target for its price tier (IC14))
  - Price stability = 1 − min(0.5, price variation)
  - Price variation = the median distance of each sale from the 30-day median price, divided by that median
  - Example: sales 9,000 / 9,500 / 10,000 / 10,500 / 13,000 → median 10,000, distances 1,000 / 500 / 0 / 500 / 3,000, middle distance 500, variation 5%, stability 0.95
  - Below 0.2: not eligible
- **IC14** — Price tiers set the minimum sales and sales target, by the card's 30-day median price: ❓ T1
  - Under HKD 1,000: at least 10 sales, target 40
  - HKD 1,000 to 4,999: at least 5 sales, target 20
  - HKD 5,000 to 19,999: at least 3 sales, target 10
  - HKD 20,000 and up: at least 2 sales, target 5
  - Expensive cards sell less often, so they need fewer sales to qualify and to reach full velocity
  - The tier is worked out again each day from that day's median price
- **IC15** — Grace days, when SNKRDUNK has no price for a card that was earning: ❓ T1
  - The card keeps earning on its last price and liquidity factor for up to 3 days
  - From day 4 without a price it stops, until a price comes back (IC13)
  - A new price ends the grace period and resets the count
  - Grace covers only missing price data. A card that has a price but too few sales or L below 0.2 stops the same day
  - A card that has never had a price gets no grace days
  - Staff and the owner see 'Using last price, day X of 3'
- **IC4** — Annual rate: 3% for now. It may change; changes are set by admins and logged (IO3).

**Eligibility and limits**

- **IC5** — Only selected cards earn daily incentive. Other cards can still be deposited, stored and consigned; the deposit form marks them Not eligible. ❓ T2
- **IC6** — Caps per card and per account. ❓ T3
- **IC13** — Eligibility is checked every day, so a card can stop and start earning:
  - It stops on any day it has no price (after the grace days in IC15), fewer sales than its tier minimum (IC14), L below 0.2, its product is no longer eligible, or staff pause it
  - Incentive already posted stays in the wallet; held incentive is still released on day N (IC12)
  - Days it doesn't qualify are not paid later
  - It starts again automatically the next day it qualifies
  - The owner dashboard shows why a card isn't earning

**How incentive builds up**

- **IC11** — Daily drip into the wallet:
  - Once a day, after midnight Hong Kong time, each eligible card's incentive for the previous day is posted to the wallet
  - Once posted, it can be cashed out
  - Counting starts the day after approval: staff approve the card in incentive approval (OP6), or approval is skipped at deposit (IN3). It does not start at authentication, and days waiting for approval are not paid later
  - The day's price and liquidity factor are fixed at the start of the day
  - Fractions of a cent carry over to the next day, so rounding never gains or loses money
- **IC12** — One-time vesting period, held on the card (not in the wallet): ❓ T4
  - For its first N days in the vault, a card's daily incentive vests on the card; it isn't in the wallet yet
  - On day N, everything vested is posted to the wallet at once; after that it drips in daily (IC11)
  - Vesting happens once per deposit, not on a rolling basis
  - Withdrawing the card before day N forfeits what's vesting; nothing already in the wallet is ever taken back
  - Sale proceeds aren't affected
- **IC16** — A card sold before its vesting period ends (IC12), for example sold on day 60 of a 90-day period: ❓ T9
  - Sale proceeds are paid as usual (SE1)
  - What happens to the incentive still vesting is a business decision: only the vested days, or the full period
- **IC7** — Incentive can be cashed out whether or not the card is consigned, under the cash-out rules (WL4).
- **IC8** — Vault-only and consigned cards earn the same rate.
- **IC9** — Incentive on a card stops when the card is sold. ❓ T5
- **IC10** — Withdrawing a card forfeits:
  - All held incentive, if the card leaves before vesting ends (IC12)
  - Otherwise, only the current day's incentive not yet dripped

### Earnings wallet (Phase B)

Where incentive and sale proceeds collect before the owner cashes out.


**Wallet**

- **WL1** — The wallet can only be cashed out, not spent on Grade10. It's labelled as earnings, not as a balance to spend.
- **WL2** — Shows the available amount: incentive and sale proceeds already posted, minus cash-outs.
  - Incentive is posted daily (IC11), after the card's vesting period (IC12)
  - Sale proceeds are posted 3 business days after the buyer pays (SE1)
  - Anything posted can be cashed out
  - Vesting incentive is shown next to the wallet balance as a display-only total (Vesting: HKD X, released on date); it isn't part of the wallet and can't be cashed out
- **WL3** — Sale proceeds go into the wallet. The owner then cashes out.

**Cash-out**

- **WL4** — Cash-out rules: ❓ T8
  - Minimum HKD 500 per request
  - Maximum per request (amount TBC)
  - One request every 7 days
  - Paid within 3 business days of the request (T+3)
  - Not while the owner has an open debt
- **WL5** — Cash-out destination:
  - The owner enters a bank account or FPS ID when requesting a cash-out
  - It's saved to their profile and pre-filled next time; they can change it
  - The account name must match the verified owner (KYC)

### Consign from vault (Phase B)

Turning vaulted cards into consignments, the core revenue. Owners consign from their dashboard, or staff do it at deposit.


**Consigning**

- **CS1** — The owner consigns online from their dashboard; there is no in-store or paper submission.
  - No new intake: the card is already authenticated and in the vault
  - The owner chooses Store, Auction or Both for each card
  - Even with Both, a card is on sale in one channel at a time (CS8)
  - Staff can help an owner use the dashboard, but the owner submits and signs
- **CS2** — Terms per card:
  - Channel: Store, Auction or Both
  - Store: commission can differ by channel (in store and marketplace)
  - Auction: one commission %
  - Optional minimum charge
  - Lowest acceptable price, checked by CS9:
  - Store: required. It is the lowest the owner will sell for in store; staff may price higher at their will, which helps both sides
  - Auction: optional. Without one there is no reserve and the lot sells at the winning bid; with one, it is the reserve
  - Both: required, and it covers both channels
  - Grade10 sets the list price (store, never below the lowest acceptable price) or the starting price (auction) at approval
  - Consignment period: 1 year from signing
- **CS3** — One Consignment Agreement per consignment, signed in the app.
- **CS6** — Consign form in the owner dashboard:
  - Step 1: choose cards already in the vault
  - Step 2: per card, sell via Store, Auction or Both, lowest acceptable price (required for Store or Both, optional for Auction) checked as in CS9; commission shown at Grade10's rate for each channel chosen
  - Step 3: review estimated payout and e-sign the Consignment Agreement
  - Staff approve every online request before it goes on sale (OP3); the owner sees Pending approval until then
- **CS7** — Changing the lowest acceptable price after consigning:
  - The owner changes it from their dashboard; staff approve it like a new listing (OP3)
  - Store: if the new lowest price is above the current list price, Grade10 raises the list price to match
  - Auction: allowed until the catalogue is published; after that it's locked
  - The price check in CS9 applies to the new price
  - The Consignment Agreement gets a new version (DC-R1)
- **CS8** — A card consigned to Both is on sale in one channel at a time:
  - It is never on the store shelf and in an auction at once
  - One Consignment Agreement and one lowest acceptable price cover both channels; the commission is the rate of the channel it sells in
  - Staff decide which channel it starts in, when they approve it (OP3); the owner doesn't choose the order
  - If it doesn't sell there, staff move it to the other channel without the owner signing again
  - Moving it takes it off the first channel at once; an auction lot can only move before the catalogue is published (WA1), or after the auction ends unsold
  - The owner dashboard shows which channel it is in now
- **CS9** — Price check on the lowest acceptable price, on the consign form and when it is changed (CS7): ❓ T10
  - It is compared with the card's market price, the 30-day SNKRDUNK median (IC2)
  - More than 20% below market: a warning that suggests raising it; the owner must confirm a second time to keep it, and isn't forced to raise it
  - More than 50% above market: rejected, because a price that far above market would hurt the chance of a sale; the owner must lower it
  - The 20% and 50% limits are proposed and are admin settings (IO3)
  - A card with no market price has no check
  - Staff see the market price and whether the owner confirmed a low price when they approve the listing (OP3), so there is less back-and-forth

**Encouraging consignment**

- **CS4** — The owner dashboard shows:
  - The card's market price from SNKRDUNK
  - What it earns each day
  - A one-tap Consign button

**Contract end**

- **CS5** — When the 1-year period ends unsold, the card returns to vault-only and keeps earning. The owner can consign again or withdraw.

### Store consign (Phase B)

Selling consigned cards in store and, once it launches, on the marketplace.


**Sale channel**

- **ST1** — A card on sale in the store is listed in both store channels at the same time:
  - In store: Shopify POS at CWB and events
  - Marketplace: online, when it launches (no date yet)
  - The first sale wins; the card comes off the other store channel at once
  - A card consigned to Both is not in an auction while it is on the shelf (CS8)
  - Commission can differ by channel

**Price**

- **ST2** — Price changes are entered by staff. Staff may raise the price at their will, which helps owner and house alike. A price can never go below the lowest acceptable price.

**Fulfilment**

- **ST3** — In store, the buyer takes the card at the counter. Marketplace orders ship from the vault. Cards held outside the selling location move there first.

### Auction consign (Phase B)

Selling consigned cards as auction lots, shipped from the vault.


**Listing**

- **AU1** — Auction listing from vault stock.
  - A card consigned to Both is not on the store shelf while its lot is open (CS8)
  - The reserve is the lowest acceptable price, if the owner set one; without it there is no reserve and the lot sells at the winning bid
  - Commission on the hammer price only
  - If the winner doesn't pay, the card is relisted

**Fulfilment**

- **AU2** — Sold cards ship from the vault location, or the buyer collects at CWB.

### Consign withdrawal (Store) (Phase B)

An owner ends a store consignment before the card sells. The card stays in the vault.

States: Card: On sale → Withdrawal requested → Off sale → In vault (earning)


**Request**

- **WS1** — The owner ends the consignment from their dashboard; staff can also do it for them.
  - Allowed while the card is on sale
  - Not allowed once it's sold, in the settlement hold, or in an open order
- **WS2** — Fee for ending a consignment early. ❓ T7
  - If charged, it's taken from the wallet
  - If the wallet is short, the owner pays at the CWB counter, or it becomes a debt (SE4)
  - An owner can also ask staff in store to end it; staff do it for them in the portal

**What happens**

- **WS3** — The card comes off sale straight away:
  - The Shopify product is set unavailable
  - It doesn't wait for any stock sync
- **WS4** — The card goes back to vault-only:
  - It stays where it is; no move needed unless it's at an event
  - It keeps earning
- **WS5** — The consignment ends for that card. The owner's dashboard records the date and reason.

### Consign withdrawal (Auction) (Phase B)

An owner ends an auction consignment before the card sells. The card stays in the vault.

States: Card: Lot prepared → Withdrawal requested → Removed from auction → In vault (earning)


**Request**

- **WA1** — The owner ends the consignment from their dashboard; staff can also do it for them.
  - Allowed until the lot is published in the auction catalogue
  - Locked once the catalogue is published, so bidders never see a lot disappear
- **WA2** — Fee for ending a consignment early. ❓ T7
  - If charged, it's taken from the wallet
  - If the wallet is short, the owner pays at the CWB counter, or it becomes a debt (SE4)
  - An owner can also ask staff in store to end it; staff do it for them in the portal

**What happens**

- **WA3** — The lot is removed from the upcoming auction, and staff are notified.
- **WA4** — The card goes back to vault-only:
  - It stays in the vault
  - It keeps earning

**Unsold at auction**

- **WA5** — If the card doesn't sell, or the winner doesn't pay and it isn't relisted:
  - It goes back to vault-only
  - The owner can consign it again or withdraw it from the vault

### Sale settlement (Phase B)

Turning a sale into money in the owner's wallet.


**Release**

- **SE1** — Sale proceeds are settled to the owner's wallet 3 business days after the buyer has paid (T+3), without waiting for delivery.
  - Store: from payment at the counter or the online order
  - Auction: from the winner's payment
  - Paid into the wallet, not per order; the Settlement Statement lists each order
  - If the order is later cancelled, refunded or returned, the payout is reversed: taken from the wallet, or raised as a debt (SE4), with a Credit Note (DC5)
- **SE2** — Payout = sale price − commission (floored at HKD 0).
  - Shipping, tax, payment processing fee and insurance are not part of the sale price

**Statements**

- **SE3** — Each period: one Settlement Statement and one Commission Invoice per owner.
- **SE4** — If deductions exceed the wallet, a debt is raised and cash-outs stop until it is cleared.
- **SE5** — Money is stored as integer minor units with a currency code (HKD).

### Identity & risk (Phase A → C)

Low friction at deposit, full checks before money or cards leave Grade10.


**At deposit**

- **ID1** — To deposit:
  - Grade10 account with confirmed email
  - Phone number on the account (captured, not confirmed by one-time code)
  - Signed declaration that the owner owns the cards
  - The phone number is for contact and abuse checks (ID4); it doesn't prove identity. Identity is proven only by KYC (ID2)

**KYC**

- **ID2** — KYC is required at the first of: ❓ T6
  - First cash-out
  - First consignment sale payout
  - Any card withdrawal
  - Total vault value above a set amount
- **ID3** — Withdrawals and cash-outs go only to the verified identity.

**Abuse checks**

- **ID4** — Signals for review:
  - Several accounts sharing a phone, device or bank account
  - The same card deposited, withdrawn and deposited again
  - Prices for a card moving sharply on SNKRDUNK

### Documents (Phase A → C)

PDF documents are kept outside the platform (contracts, accounts). Platform records live in the owner's dashboard and can be exported.


**Rules**

- **DC-R1** — PDF documents are generated from stored data and never edited; a correction is a new version.
- **DC-R2** — Platform records are timestamped, can't be edited, and can be exported to PDF.

### Owner dashboard (Phase A → C)

What the owner sees in their Grade10 account.


**Owner**

- **DB1** — Owner dashboard:
  - Cards in the vault, with status and market price
  - Daily incentive per card, vesting incentive with its release date, and the available amount
  - Consign button
  - Documents and records
  - Why a card isn't earning (IC13)
  - Cash-out and KYC status (Phase C)

### Vault operations (Phase A)

Staff tools in the internal portal for running the vault day to day.


**Deposits**

- **OP1** — Deposit queue:
  - Cards waiting for authentication
  - Pass: the card enters the vault and joins the incentive approval queue (OP6), unless approval was skipped at deposit (IN3); it doesn't earn until approved
  - Fail: the owner is told and the card is returned; it never earns

**Incentive approval**

- **OP6** — Incentive approval, between entering the vault and earning:
  - Staff check the card's SNKRDUNK match, price and liquidity factor (IC2, IC3)
  - Approve: the card starts earning from the next day (IC11)
  - Reject or hold: the card stays in the vault without earning; the owner sees the reason
  - Skipped at deposit: staff who already authenticated the card and verified its value at the counter or an event tick Skip incentive approval on the deposit form (IN3); the card is approved when the deposit is submitted, and the skip is recorded with the staff member
  - A second staff member approves cards above a value threshold, skipped or not (TBC)

**Custody**

- **OP2** — Moves between locations:
  - Create a move; staff confirm by hand when the card leaves and arrives
  - Missing or damaged on arrival raises a discrepancy for review

**Consignment**

- **OP3** — Consignment approval, between consign and sale:
  - Check each listing the owner submitted before it goes on sale
  - See the market price against the lowest acceptable price, and whether the owner confirmed a low price (CS9)
  - For a card consigned to Both, choose which channel it starts in (CS8)
  - Set the list price (store), never below the lowest acceptable price, or the starting price (auction); staff may price a store card higher at their will
  - Create the Shopify product (store) or add the card to an auction lot
  - Approve: the listing goes on sale; reject: the owner is told why and can edit and resubmit

**Withdrawals**

- **OP4** — Withdrawal queue:
  - Requests waiting for a move to CWB
  - Collection appointments
  - Handover with ID check and Withdrawal Note

**Access**

- **OP5** — Staff roles:
  - Vault staff: deposits, custody, withdrawals
  - Consignment staff: listings and sales
  - Finance: cash-outs, KYC, statements; the only role that sees ID and bank details

### Incentive operations (Phase A)

Running and controlling the daily incentive.


**Price data**

- **IO1** — SNKRDUNK price import runs daily:
  - Import status is visible to staff
  - If data is missing, the grace days apply (IC15)

**Daily accrual**

- **IO2** — The daily drip runs once a day:
  - One ledger entry per card per day
  - Running it twice for the same day never pays twice
  - The owner dashboard can show a live estimate during the day; only the posted amount counts

**Settings**

- **IO3** — Admins set and change, with every change logged:
  - Annual rate (3% for now)
  - Liquidity factor settings (T1)
  - Eligible products (T2)
  - Caps (T3)
  - Price check limits for the lowest acceptable price (CS9)

**Controls**

- **IO4** — Review flags from abuse checks (ID4):
  - Staff can pause incentive on a card or an account
  - Paused incentive doesn't accrue until staff release it

### Consignment dashboard (Phase B)

One internal view for consignment staff to turn vaulted cards into consignments, and consignments into sales, faster. The measure is conversion: the share of vaulted cards that get consigned, and the time it takes.


**Find cards to convert**

- **CD1** — Conversion list: vaulted cards that are earning and not consigned:
  - One row a card: owner, market price (IC2), liquidity, days in the vault, incentive paid so far, last contact
  - Ranked by how likely the card is to sell: liquidity and market price first, then days in the vault
  - Filters: price tier (IC14), liquidity, days in the vault, owner type, contact status
  - Cards that have earned for a long time without being consigned are flagged (RP2)
- **CD2** — Owner outreach, from the same row:
  - Send the owner an email with the card's market price and a link to the consign form
  - Log a call or message by hand, with its outcome: interested, not now, declined
  - Each card shows when the owner was last contacted, so nobody is contacted twice in a short time (limit TBC)
  - A declined card leaves the list until staff bring it back

**Speed up approval**

- **CD3** — Consignment approval queue (OP3), oldest first:
  - Consignments waiting for approval, with how long each has waited
  - Each row shows the owner's lowest acceptable price against the market price, and any low-price warning the owner confirmed (CS9)
  - Approve, reject with a reason, and set the list or starting price and the starting channel (CS8), all in the row
  - Bulk approve for rows with nothing flagged
  - Target time to approve: TBC
- **CD4** — Incentive approval queue (OP6), oldest first:
  - Cards waiting to be approved to earn, with the SNKRDUNK match and liquidity beside each
  - Cards approved at deposit (IN3) don't appear

**Keep sales moving**

- **CD5** — On-sale monitor:
  - Cards on sale, by channel and days on sale
  - A card with no sale after a set number of days is flagged, so staff can lower the list price (never below the lowest acceptable price) or move a Both card to the other channel (CS8); the number of days is TBC
  - Auction lots that ended unsold are listed to move or relist (WA5)

**Measure conversion**

- **CD6** — Conversion funnel, for any date range:
  - Deposited, approved to earn, consigned, approved for sale, sold
  - Median time between steps, and where cards wait longest
  - By price tier, owner type and channel
  - Incentive paid per consigned card, against commission earned (RP2)
- **CD7** — Who sees it:
  - Consignment staff
  - No ID or bank details; those stay with finance (OP5)

### Finance operations (Phase A → C)

Paying owners and keeping the accounts right.


**Identity**

- **FO1** — KYC review queue: approve or reject, with a reason shown to the owner.

**Cash-outs**

- **FO2** — Cash-out requests:
  - Approved in batches
  - Paid by FPS or bank transfer to the saved account
  - Marked paid with the payment reference

**Sales**

- **FO3** — Each period:
  - Settlement Statements and Commission Invoices are generated
  - Credit notes for refunds after settlement
- **FO4** — Owners in debt are listed; their cash-outs are held until the debt is cleared.

### Staff dashboard & reports (Phase A → C)

What management and staff track.


**Staff dashboard**

- **RP1** — Staff dashboard:
  - Deposits waiting for authentication
  - Cards by location and status
  - Incentive paid out vs. cards consigned (conversion)
  - Review flags from abuse checks
  - Withdrawals and cash-outs waiting

**Reports**

- **RP2** — Funnel and cost:
  - Cards deposited, consigned and sold, by owner type
  - Incentive paid vs. commission earned
  - Days in the vault before consigning
  - Cards earning but never consigned (aging)

## Open questions

- ❓ **T1 · Liquidity factor** (P0) — Is the draft liquidity factor (velocity × price stability, floor 0.2) the working model? Are the price tiers (IC14) and the 3 grace days (IC15) right?
  - Why: Decides how much each card earns and which cards are eligible.
  - Blocks: IC3, IC14, IC15
- ❓ **T2 · Which cards earn incentive** (P0) — Which products, grades or value ranges earn incentive?
  - Why: Keeps the cost on cards Grade10 wants to sell.
  - Blocks: IC5
- ❓ **T3 · Caps** (P1) — What is the maximum value counted per card, and the maximum incentive per account per month?
  - Why: Limits exposure to one expensive card or one large depositor.
  - Blocks: IC6
- ❓ **T4 · Vesting period before incentive reaches the wallet** (P0) — How many days must a card stay in the vault before its incentive is posted to the wallet?
  - Why: Stops owners depositing, cashing out incentive quickly and leaving. Longer protects more but delays the first payout owners see.
  - Blocks: IC12
  - Option: 30 days — 
  - Option: 60 days — 
- ❓ **T5 · When incentive stops on a sale** (P1) — When does incentive on a sold card stop: when it's marked Sold, when the buyer pays, or when proceeds are settled (T+3)?
  - Why: Proceeds settle 3 business days after the buyer pays. Stopping at Sold is simplest; stopping later pays a few extra days.
  - Blocks: IC9
  - Option: When marked Sold — Recommended: the card is no longer the owner's to hold
  - Option: When the buyer receives the card — 
  - Option: When settlement is released — 
- ❓ **T6 · KYC vault value threshold** (P1) — Above what total vault value is KYC required even without a cash-out or withdrawal?
  - Why: Closes the gap for large depositors who never cash out.
  - Blocks: ID2
  - Option: HKD 50,000 — 
  - Option: HKD 100,000 — 
- ❓ **T7 · Fee for ending a consignment early** (P1) — Does the owner pay a fee when ending a store or auction consignment before the card sells?
  - Why: Covers listing and handling work, and discourages consigning just to test a price.
  - Blocks: WS2, WA2
  - Option: No fee — Simplest; consigning stays low-risk for owners
  - Option: Fixed fee per card — Covers handling cost
  - Option: Fee only after the auction lot is prepared — Charges only when work is wasted
- ❓ **T8 · Cash-out maximum** (P1) — What is the most an owner can cash out in one request?
  - Why: Limits loss from a taken-over account and keeps payouts within finance's limits.
  - Blocks: WL4
  - Option: HKD 50,000 per request — Covers most sellers; larger amounts split over weeks
  - Option: No maximum, manual review above a threshold — No friction for big sellers; finance checks large amounts
- ❓ **T9 · Incentive when a card sells during vesting** (P1) — A card vests for N days (say 90) and sells on day 60: does the owner get only the 60 days vested, or the full 90 days including the remaining 30?
  - Why: Paying the full period rewards consigning early but pays for days the card wasn't in the vault. Decide together with when incentive stops on a sale (T5).
  - Blocks: IC16, IC12
  - Option: Only the vested days (60) — Recommended: pays what the card earned; cost stays tied to time in the vault
  - Option: The full period (90) — Pays the remaining 30 days as well; removes any reason to wait out vesting before consigning, at a higher cost
- ❓ **T10 · Price check limits** (P1) — Are 20% below and 50% above the market price the right limits for the lowest acceptable price?
  - Why: Too tight blocks owners who have a reason for their price; too loose lets through prices that won't sell.
  - Blocks: CS9

## Incentive calculator

Daily incentive = P × L × R ÷ 365, where P is the 30-day SNKRDUNK median price, L the liquidity factor (IC3) and R the annual rate (config, 3% for now). L = min(1, sales ÷ tier target) × (1 − min(0.5, price variation)). Price tiers (IC14, config):

| 30-day median (HKD) | Minimum sales | Target sales |
|---|---|---|
| Under 1,000 | 10 | 40 |
| 1,000–4,999 | 5 | 20 |
| 5,000–19,999 | 3 | 10 |
| 20,000 and up | 2 | 5 |

Worked example: P = HKD 10,000, 12 sales, 15% variation → tier 5,000–19,999, velocity min(1, 12 ÷ 10) = 1.00, stability 0.85, L = 0.85, daily = 10,000 × 0.85 × 3% ÷ 365 ≈ HKD 0.70.
