---
title: Shopify Integration
spec: grade10-site/store/membership
order: 6
---

Shopify is the programme's two doors: the online checkout and the POS at the
counter. It prices the basket, takes the money and validates a code natively;
it is never the source of truth for a balance, a tier or a coupon, and no
tier is mirrored to it. What binds the two systems is one Shopify customer
per member, one order pipeline for every channel, and one draft-order shape
that carries whatever the programme takes off a bill.

## One customer per member

Every member has exactly one Shopify customer, paired server-side behind the
account. The link is an opaque member key written into a unique customer
metafield — never the account id, never anything unverified — so a lost answer
is adopted by the retry rather than duplicated. Joining seeds the pairing and
never waits on Shopify; a drain converges it, refusing to write until the
member's email is verified. A customer already carrying another member's key
parks the pairing as a conflict where an operator can see and clear it; a
customer the shop no longer knows is repaired on the next pass. Erasing a
member erases the customer irreversibly, and a customer merge on the shop
repoints the pairing at the survivor and re-asserts the member key on it.

## Online checkout

Every online checkout is a Shopify draft order and its invoice. The draft is
the one vehicle that carries, at once, the member as the purchasing entity, a
merchant-applied fixed discount for the points, per-line discounts for the
store's own product coupons, and any discount code the shop evaluates.

:::flow{title="From basket to paid order"}
## The basket is priced
The store prices the basket live and asks the programme what the member can
spend: the qualifying goods after the store's own coupons, never shipping or
tax, capped at the balance. Nothing is held.

## The draft is created
Line items carry no prices — the shop prices at payment. The order-level
discount is a fixed amount titled "Points"; product and gift coupons ride as
per-unit line discounts titled "Coupon"; order coupons go in the discount
codes. The draft names the member's Shopify customer, so a customer-scoped
code evaluates. The draft's id is recorded before the invoice
link leaves the worker.

## The buyer pays the invoice
The store never updates, completes or sends the draft: a write unlinks an
in-progress invoice, and the buyer pays the invoice link directly. One payable
promised draft exists per member — a newer checkout deletes the older draft
and its promise comes back.

## Settlement is found
An invoice-paid order carries no cart token, so the reconcile pass reads the
draft back and finds its order. The paid transition stamps the qualifying
goods, writes the order event, and hands the goods amount and the points
promise to the programme together.

## Points are captured
The promise is scaled to what the shop actually took off. A shop that stated
no discount debits nothing and says so loudly; a short capture debits less. A
refund returns the points only when the whole of the goods comes back.
:::

A draft evaluates no automatic discount, guarantees no price — an open invoice
re-reads the catalogue — and reserves no stock. Refusals are explicit: a shop
without the draft-order scope declines the points tender rather than selling
at full price, and a code the shop silently dropped deletes the draft and
refuses the checkout.

Points off the online bill are on in every environment. The brand's switch in
`packages/app-env` turns the online checkout off on its own; the till spends
on the shop's POS switches and does not stop with it.

## Orders reaching the programme

Four webhooks carry money: order paid, order cancelled, refund created, and
order edited, which is heard as news only. Each is verified over its raw
bytes, deduplicated on Shopify's own webhook id, and applied to the store's
order machine; the order event written by the paid transition is what reaches
the programme, exactly once, with the channel on it. A physical-store order
arrives on the same webhook, is ingested once whether by webhook or by the
reconciling sweep, and is attributed to a member through the customer on the
sale — or later, by an operator, when the sale was rung up before the member
joined.

## The POS extension

The loyalty terminal is a Shopify POS UI extension: one tile on the POS home
screen, one modal that holds the whole staff flow, and a read-only badge on
Shopify's own customer details. Three extension-only apps — development,
staging, production — carry it, with no server, no scopes and no admin access
of their own; a manager activates a published version per location and pins
the tile. One rule decides every branch: the sale is happening whatever the
programme thinks, so every unhappy answer lands staff in a normal sale.

| Surface | Job | Spends |
| --- | --- | --- |
| Home tile | Opens the modal; badges only "membership unavailable" | Never |
| Modal | Identify, read the panel, spend, confirm a collection | Through a session |
| Customer details badge | Name, tier and balance for any paired customer staff find in Shopify's own search | Never |

:::flow{title="Points at the till"}
## Identify the member
Scan the code on the member card — from the site or from either wallet pass —
type the same value beneath it, or type the exact email on the account. A miss
says only that no member was found.
Either identification opens a ten-minute session bound to the shop and the
member — never to the staff label, which changes when staff switch by PIN.

## Read their standing
The panel shows tier, both counts, window progress, the renewal and
points-active-until dates, recent activity, the rewards the balance affords,
and pending collections.

## Attach them to the sale
The terminal sets the customer on the cart and confirms it against the cart
itself. Spending stays disabled until the cart's customer is the paired one,
the cart carries no other discount, and the cart total covers the amount;
each unmet condition says which.

## Preview the spend
"Use max" pre-fills the smaller of the balance and the qualifying goods on the
cart; a field takes another amount. The server computes the read-back and
answers an intent that pins it.

## Confirm, facing the member
Spend N, pay HKD X, balance after Y, earns about Z. Staff tap; the member
touches nothing. A double tap replays the same intent rather than spending
twice.

## The discount lands on the cart
The terminal writes the store's order id on the cart first, then a fixed
amount titled "Points" comes off the sale, confirmed against the cart. The
promise is trimmed to what the cart shows; a discount that never landed is
not one the member pays for. Nothing is held: the points leave the balance
when the paid sale lands, never at apply.

## Undo, before tender
Staff remove every discount from the cart, then the order id, and the promise
is dropped; the balance was never touched. A promise nobody tenders expires
after an hour, and a sale the cart collects after that still settles. Once
tendered, taking points back is a refund, on the refund's own rule.
:::

Collecting a physical reward runs through the same session: the pending
redemption shows the reward, the points paid and the date; staff verify and
confirm, and the staff label lands in the programme's record. A second till
gets a refusal naming when and who. Earning needs none of this — attaching
the customer to the sale is enough, and the points arrive through the order
webhook even with the terminal dark.

### Switches

Every switch defaults in code, is stored per shop only as a deviation, and is
enforced on the very next request. An operator flips them from the admin
console.

| Switch | Default | What it governs |
| --- | --- | --- |
| Terminal enabled | On | Off: identification refuses and sales continue as guest sales; the undo goes with it |
| Email spend | On | Spending on a session opened by a staff-typed email |
| Phone lookup | Off | Identification by a staff-typed number; ships dark |
| Phone spend | Off | Spending on a phone session; pinned off until numbers are verified |
| Cart identify | Off | A customer already on the sale identifies the member with no scan |
| Cart spend | Off | Spending on a cart session |
| Card spend | On | Spending on a session opened by a scanned or typed member card |

The card's two arms — scanned and typed — share one spend switch, because they
carry one code. Neither has a switch of its own for identification: stopping
the counter means the terminal switch, which also removes the undo staff need
for spends already on carts.

## Discounts and shipping

A tier is worth its earn multiplier and nothing else. No Shopify Function,
automatic discount, customer segment or tag carries a tier, and no tier gets a
percentage off or free shipping. What the programme takes off a bill is always
the points: the draft's order-level discount online, the cart discount at the
till.

Shipping is the store's flat rule — HKD 60, free at or above HKD 800 — served
by one function to both the checkout preview and Shopify's carrier callback.
Points never pay for shipping and shipping never earns, by construction: the
tender is an order-level pre-tax discount over qualifying lines, and a refund
of the delivery alone returns no points. A shipping promotion could ride
beside the points discount; none is created today. No draft order carries a shipping line — Shopify prices
shipping on the invoice page — and the POS has no ship-to-customer flow, no
draft order and no shipping at all.

:::callout{kind="warning"}
The carrier callback is written but not registered on staging: the shop's
plan refuses it, so the invoice page charges the shop's own manual rate while
the checkout previews ours. Whether the carrier request carries the basket
before or after discounts is unanswered, so preview and charge can diverge
exactly where points or coupons straddle the free bar.
:::

:::detail{title="For engineers" for="engineer"}
Pairing lives in `packages/grade10-store/backend/src/services/pairing` over
the `payment_customers` table; the metafield is `membership.member_id`, type
`id`, unique. The draft-order client is `packages/shopify/backend`'s
`draftOrders.ts` — create, read and delete only. The points tender is
`services/pointsTender.ts` and `services/loyalty/pointsSpend.ts`, gated by
`POINTS_TENDER` in `packages/app-env`. Webhooks land on one route in the
store worker; the loyalty sink is `worker/commerce/loyaltySink.ts`.

The extension is `integrations/shopify-pos/grade10`, outside `apps/` with its
own publish lane, rendering Polaris web components on API 2026-07 with a byte
budget per target. It talks to a tRPC gateway the loyalty package exports and
the store worker mounts at `/api/pos`, authenticated by the POS session token
as the shop principal `pos:<shop>` — outside every human role, holding
exactly config, identify, plan and confirm a sale, collect, and end. The gateway session rides
`x-pos-session`, rotated on every call; every build stamps `x-pos-client`
and the gateway refuses below its minimum. Short-code entry is capped at ten
misses in five minutes per shop, email and phone at twenty. Flags are the
`pos_flags` table behind a typed registry; a till sale is one `orders` row
per session (`services/pos/sale.ts`), rewritten on every plan and trimmed to
what the cart took, so one sale never carries two. The longer working notes are
[the Shopify membership and POS plan](/references/shopify-membership-pos)
and [the POS extension notes](/references/shopify-pos-extension).
:::
