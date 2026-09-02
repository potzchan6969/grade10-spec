# Grade 10 Loyalty Program

The owner's draft, and the decided reference for the program as of 2026-08.
The requirements derived from it are the `revise-loyalty-programme-rules` and
`add-shopify-membership-pos` changes; until those archive, the main specs are
still the older ones. The product decisions it led to are recorded in
[the programme PRD](../prds/products/membership/index.md). What engineering chose where
this draft is silent is in the Decision record of
[the loyalty service page](../prds/platform/loyalty-service.md). Values written as variables (rates, thresholds,
months) are program config, tunable per environment.

## 1. Program Structure & Tiers

Three tiers with earn-rate acceleration. Tier points are tracked separately
from redeemable points (dual-ledger model). Members start at Silver.

| Tier | Requirements | Earn rate |
| :--- | :--- | :--- |
| **Silver** | Free, activated on sign-up. | 1× |
| **Gold** | Auto-upgrade on earning 500 tier points in a rolling 12-month window. | 1.2× |
| **Black** | Invite-only, CEO approval, annual cap. Full spec TBD — parked. | 1.7× |

**Upgrade & validity rules**

- Upgrade is immediate on hitting 500 tier points, including on the first
  purchase.
- The higher earn rate applies from the *next* purchase, not the
  triggering transaction.
- A tier is valid 12 months from its activation date; when the period ends
  without meeting the retention threshold, the member downgrades to
  Silver immediately.
- ❓ Retention threshold: baseline is 500 tier points during the validity
  period; the business may set a lower one (e.g. 400) as a softer
  re-qualification option.

## 2. Earning Mechanics

- **Base rate**: 1 point per HKD 10 spent, multiplied by the tier rate.
- **Basis**: the after-discount final transaction value; a points coupon
  reduces it too, so redeemed value never earns.
- **Rounding**: fractional points round down.
  Examples from the draft: $125.50 → 12 points; $100 → 10 (12 at 1.2×);
  $139 → 13 (15 at 1.2× — base points floored first, then multiplied,
  then floored again). (Engineering carries the floor's place as deployed
  config, base-points-first to start.)
- **Scope (Phase 1)**: online store purchases and physical store (POS)
  purchases.
- **Later phases**: auction wins, credit top-ups.
- **Not in scope**: shipping charges, grading service fees, gift cards,
  and unlisted categories.

## 3. Points Lifecycle (Dual-Ledger Model)

Two independent clocks: tier validity (12 months from upgrade) and points
expiry (12 months of inactivity).

- **Tier points** (external naming TBC): cumulative points earned in the
  qualifying window; never reduced by redemption; determine upgrades.
- **Redeemable points** (external naming TBC): the spendable balance —
  up on earn, down on redemption, subject to expiry.
- **Expiry**: activity-based — the entire redeemable balance expires only
  after 12 months with no earn or redeem activity; any purchase or
  redemption resets the clock for the whole balance. Benchmarked against
  Sephora US, Nordstrom, Marriott Bonvoy, Starbucks.

## 4. Redemption & Coupon Mechanics

**Points → cash discount**

- Triggered at checkout, online or physical.
- Conversion is one-way and irreversible — no coupon-to-points reversal.
  A coupon that expires unused stays spent: bought but not used is the
  member's responsibility. Points return only through an admin specially
  cancelling a redemption as an explicit credit act. (Engineering carries
  auto-reversal of unused expired coupons behind a config flag, off.)
- ❓ Exchange rate: TBD — it prices every item on the redemption menu and
  sets total program economics.

**Physical item redemption** — ❓ trigger, conversion, and rate all TBD;
the in-store collection flow below is the agreed shape.

## 5. Channels & Platform

- **Platform**: built in-house on Grade 10 auth/CRM; purchase events
  originate from Shopify and reach the loyalty engine.
- **Online store**: Shopify — earn + redeem in Phase 1.
- **Physical store**: Shopify POS — earn + redeem in Phase 1 (Wave
  Commerce is the setup partner, not a system to integrate).
- **In-store member ID**: a QR code from the member's card — dynamic and
  short-lived, dead after one scan — or the customer's email address
  (matching their account identity). One scan or lookup instantly
  authorizes the terminal to read and act for that member (lookup,
  earning attribution, spending, collection) for the visit; the member
  never confirms on their own app.

## 6. In-store Flows

**Register a new member** — the customer registers themselves; staff never
handle registration. Staff point at the counter QR (or give the URL); the
customer creates the account on their own phone; the engine creates a
Silver member at 0 points, pairs a Shopify customer, and sends a welcome
email; staff attach that customer to the current sale by email so this
purchase earns. Registration must finish before the sale is finalised for
that sale to earn directly — a sale rung up first is attributed later
through the guest-claim path.

**Retrieve membership information** — staff open Member Lookup on the
loyalty terminal and scan the member's QR or enter their email.
Displayed: name, email, tier, redeemable balance, tier points in the
current window against the threshold, tier renewal date,
points-active-until date, the last few transactions, and the redemption
items the balance affords.

**Spend points at the till** — after identifying the member, staff redeem
points on their behalf against the current sale: pick an amount (or "use
max"), read the numbers back to the member from the terminal (spend N,
pay X, balance after, points this sale earns), confirm, and the discount
applies to the order — nothing requires the member's own phone. The
member is notified instantly on every staff-assisted redemption; a
same-visit mistake is cancelled by staff before tender.

**Use a discount coupon** — the member has already redeemed points on the
member portal and holds a Shopify discount code. They present it; staff
type it at the POS (or apply it from the member's open-codes list on the
terminal); Shopify validates and applies it natively.

**Collect a physical reward** — the redemption is already paid in points
and pending collection. Staff look the member up by email, verify the
pending redemption matches the request, and tap Mark as Collected (with
confirmation); the engine records the timestamp and staff identity; staff
hand over the item. If reward stock lives in Shopify inventory, a
zero-value sale or an auto-generated 100%-off code decrements it through
the POS.

Redemption statuses: **Pending Collection** (points deducted, awaiting
pickup) → **Collected** (staff confirmed) · **Expired** (collection window
passed — no refund, the member's responsibility, same as an expired
coupon) · **Cancelled** (an admin act: redemption reversed, points
refunded).

**Earning on an in-store purchase** — staff attach the customer profile
(found by email) and complete the sale; Shopify's webhook reaches the
loyalty engine, which matches the order to the member, credits
after-discount value × tier multiplier (rounded down) to both ledgers,
evaluates the tier threshold, and resets the expiry clock; optionally a
points-earned email goes out. A sale completed with no customer attached
earns nothing until attributed.
