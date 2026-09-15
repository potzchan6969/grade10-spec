---
title: Shopify Integration
spec: grade10-site/store/membership
order: 7
---

Shopify is the online checkout and the till: it prices the basket, takes the
payment and shows a discount, and never holds a balance, a tier or a coupon.

## Two Channels, One Pipeline

Both channels settle the same way: the money lands at Shopify, the store
records the order, and the programme moves the balance once.

<!-- equal-width: 2,3 -->
| Stage | Online | At the till |
| --- | --- | --- |
| Where points are chosen | The store's own `/checkout` page | The terminal, inside an identified session |
| What carries the discount | One "Points" order discount on the draft order | The same "Points" amount off the cart |
| Who takes the money | Shopify's invoice page | The counter, in Shopify POS |
| How the paid order is found | The draft is read back for the order it became | The store's order id on the cart |
| When points leave the balance | On the paid order, once, scaled to what the shop applied | The same |
| What undoes it before payment | A newer checkout, or the reconciling pass, deletes the draft | Staff take the discount off, then the order id |
| What a refund does | Claws the earn back line by line; returns the points paid only on the whole of the goods | The same |

::image{src="assets/diagrams/shopify-order-pipeline.svg" alt="The paid path both channels share, from choosing points to the balance moving"}

## Customer Pairing

| Rule | Value |
| --- | --- |
| Link | **An opaque member key** in a unique customer metafield, never the account id |
| Count | **One Shopify customer per member** |

- **Seeded at join** — the pairing is written with the enrolment and waits on
  Shopify for nothing
- **Verified email only** — the drain writes nothing to the shop until the
  member's email is verified
- **A conflict parks** — a customer already carrying another member's key is
  left for an operator to see and clear by hand
- **A retry lands once** — pairing retried after a lost response finds the
  same customer, never a new one
- **Nobody is left unpaired** — a sweep pairs members from before pairing
  shipped, and re-running it changes nothing
- **A stale customer is repaired** — one the shop no longer knows is repaired
  on the next pass
- **A merge on the shop** — the pairing moves to the surviving customer and
  the member key is asserted on it again
- **Erasure** — a customer this platform created is deleted; a customer it
  adopted keeps its record and loses the key. Where Shopify refuses to delete
  one over its orders, the platform files Shopify's own erasure request and
  waits for the acknowledgment

## Online Checkout

Every online checkout is a Shopify draft order and its invoice.

| The draft carries | As |
| --- | --- |
| Member | The draft's customer, so a customer-scoped code evaluates |
| Points | One fixed-amount order discount named "Points" |
| Product and gift coupons | Per-unit line discounts named "Coupon" |
| Order coupon | The draft's discount code |
| Prices | None on the lines — the shop prices at payment |
| Shipping | None — the invoice page prices it |

- **One draft per member** — a newer checkout deletes the older one, and the
  points it promised come back
- **Never updated** — a write unlinks an invoice already in progress, so the
  member pays the invoice link as it was made; the draft's id is recorded
  before that link leaves
- **Found after payment** — a paid invoice carries no cart token, so the store
  reads the draft back to find its order
- **No live price, no stock held, no automatic discount** — an open invoice
  re-reads the catalog
- **Refused** — a shop without the draft-order scope declines the whole
  checkout; a code the shop silently drops deletes the draft and refuses the
  checkout
- **On by default** — points spending is on for Grade10 in every
  environment; one brand switch turns it off on both channels, as an
  emergency stop, and nothing already promised or paid is touched

:::flow{title="Online checkout" case="Paid" diagram="assets/diagrams/shopify-online-paid.svg"}
## *Member* — **Chooses points and a coupon**
On the store's own `/checkout` page, before Shopify has seen the basket.

## *Store* — **Draft order created**
The member is the draft's customer, the points are one fixed-amount order discount named "Points", each product or gift coupon is a per-unit line discount named "Coupon", and an order code goes on as the draft's own discount code. The store's order id is a custom attribute on the draft, and the lines carry no prices, because the shop prices them at payment.

```json
{
  "input": {
    "lineItems": [
      {
        "variantId": "gid://shopify/ProductVariant/44556677889900",
        "quantity": 2,
        "appliedDiscount": {
          "valueType": "FIXED_AMOUNT", "value": 2.5,
          "title": "Coupon", "description": "Coupon"
        }
      }
    ],
    "appliedDiscount": {
      "valueType": "FIXED_AMOUNT", "value": 12,
      "title": "Points", "description": "Points"
    },
    "discountCodes": ["G10-WELCOME-20"],
    "purchasingEntity": { "customerId": "gid://shopify/Customer/7788990011" },
    "customAttributes": [
      { "key": "grade10_order_id", "value": "0f6c2c1e-6a0a-4c33-9d2a-1e6b0e2f9c11" }
    ]
  }
}
```

A coupon's discount is per unit, so 2.5 on a quantity of 2 is the $5 the line loses; 12 is the whole $12 of points. No points leave the balance and no stock is held; a reward coupon is held against the order and freed if it is never paid — [Coupons](/p/grade10-site/loyalty/coupons)

## *Shopify* — **Invoice link issued**
The shop answers with the draft and the link the member pays at. The draft's id is recorded before that link leaves, so no payment can arrive on an order the store cannot bind.

## *Member* — **Pays**
On the invoice page, where the shipping is priced and the tax is added.

## *Shopify* — **Order paid**
The webhook, signed over its own bytes. Each discount names itself, and each line says which of them took what off it.

```json
{
  "admin_graphql_api_id": "gid://shopify/Order/1001",
  "name": "#G10-10482",
  "cart_token": null,
  "currency": "HKD",
  "subtotal_price": "19.50",
  "current_total_discounts": "20.50",
  "discount_applications": [
    { "title": "Points" },
    { "title": "Coupon" },
    { "code": "G10-WELCOME-20" }
  ],
  "line_items": [
    {
      "title": "Charizard VMAX",
      "quantity": 2,
      "price": "20.00",
      "discount_allocations": [
        { "amount": "12.00", "discount_application_index": 0 },
        { "amount": "5.00", "discount_application_index": 1 },
        { "amount": "3.50", "discount_application_index": 2 }
      ]
    }
  ],
  "note_attributes": [
    { "name": "grade10_order_id", "value": "0f6c2c1e-6a0a-4c33-9d2a-1e6b0e2f9c11" }
  ]
}
```

The store finds its points by the title "Points", whatever case the shop wrote it in

## *Store* — **Order marked paid**
The bytes are verified, the delivery is deduped on Shopify's webhook id, and the draft is read back for the order it became, because a paid invoice carries no cart token. The qualifying goods are priced once and the order event is written with the status in one transaction, so a redelivery writes nothing.

```json
{
  "orderId": "9c1e4a70-6f83-4d02-b6a1-0e3f5c9d21ab",
  "kind": "paid",
  "sourceRef": "9c1e4a70-6f83-4d02-b6a1-0e3f5c9d21ab",
  "userId": "usr_01J8ZQ4X7K",
  "earningMinor": 1950,
  "currency": "HKD",
  "occurredAt": "2026-09-10T04:21:07.113Z"
}
```

## *Loyalty* — **Points debited, earn granted**
The promised points are debited, scaled to what the shop applied and never above the promise; the coupon is marked used; the earn lands on the same goods — [Paying with Points](/p/grade10-site/loyalty/paying-with-points) and [Points](/p/grade10-site/loyalty/points)
:::

:::flow{title="Online checkout" case="Abandoned or replaced" diagram="assets/diagrams/shopify-online-abandoned.svg"}
## *Member* — **Leaves the invoice unpaid**
Or opens another checkout, which supersedes this one.

## *Store* — **Draft deleted**
A newer checkout deletes the older draft before it asks for anything, so that invoice can never collect, and then closes the order. A member who never comes back is closed out by the reconciling pass instead: it gives up on a checkout past its 1 hour and its retries, deletes the draft, and closes the order the same way. A draft the shop refuses to delete is logged, and its order stays open.

## *Loyalty* — **Nothing moves**
No order event was ever written, so the balance never changed and the whole of it is offered again at the next checkout.
:::

:::flow{title="Online checkout" case="Refunded" diagram="assets/diagrams/shopify-online-refunded.svg"}
## *Member* — **Returns the goods**
Some of them, or all of them.

## *Shopify* — **Refund created**
The webhook carries what the refund actually took back.

## *Store* — **Goods share priced**
The refund's share of the qualifying goods is worked out line by line, each capped at what that line earned. Shipping and tax never enter it.

## *Loyalty* — **Earn clawed back**
The earn comes back line by line, and never more than the member still holds from that money. The points paid come back only when the goods a refund states reach the whole of the order's goods — [Points](/p/grade10-site/loyalty/points) and [Paying with Points](/p/grade10-site/loyalty/paying-with-points)
:::

What points pay for and how a spend settles is on
[Paying with Points](/p/grade10-site/loyalty/paying-with-points); what a code
does at each checkout is on [Coupons](/p/grade10-site/loyalty/coupons).

## Orders Reaching the Programme

| Webhook | Effect |
| --- | --- |
| Order paid | An order event to the programme, with the channel on it |
| Order cancelled | The order is recorded cancelled; nothing promised was ever debited |
| Refund created | The refund's goods share reaches the programme |
| Order edited | News only |

- **Verified over raw bytes** — each delivery is checked before it is read
- **Deduplicated** — on Shopify's own webhook id, which a redelivery reuses
- **Once** — the paid transition writes the order event exactly once
- **A till sale** — arrives on the same webhook or through the reconciling
  sweep, and is ingested once either way
- **A refund before the order** — one naming an order not yet recorded
  fetches and records that order first
- **Attribution** — through the customer on the sale, or later by an operator
  where the sale was rung up before the member joined

## POS Extension

The loyalty terminal is a Shopify POS UI extension.

| Surface | Job | Spends |
| --- | --- | --- |
| Home tile | Opens the modal; badges only "membership unavailable" | Never |
| Modal | Identify, read the panel, spend, confirm a collection | Through a session |
| Customer details badge | Name, tier and balance for any paired customer staff find in Shopify's own search | Never |

- **Three apps** — development, staging and production, each extension-only
  with no server, no scopes and no admin access of its own; a manager
  activates a version per location and pins the tile
- **The sale always goes on** — every refusal leaves staff in a normal sale

### Session

| Rule | Value |
| --- | --- |
| Life | **10 minutes** |
| Bound to | **The shop and the member**, never the staff label |

| Arm | Identifies by | Spends | Collects | Switch |
| --- | --- | --- | --- | --- |
| QR | The square on the member card | Yes | Yes | None |
| Short code | The 8 letters beneath it | Yes | Yes | None |
| Wallet pass, Google | The code the phone makes from the pass | Yes | Yes | None |
| Wallet pass, Apple | The durable code printed in the pass | No | No | None, and no switch can grant either |
| Email | The exact email on the account | With Email spend | Always | Email spend |
| Phone | A number staff type | With Phone spend | Only when it may spend | Phone lookup · Phone spend |
| Cart customer | The customer already on the sale | With Cart spend | Always | Cart identify · Cart spend |

- **A miss says nothing** — a staff-typed email matching no member answers
  only that none was found, and repeated lookups are throttled
- **Attach** — the terminal sets the customer on the cart and checks it;
  spending stays off until the cart's customer is the paired one, no staff
  order discount is on the sale, and what the shop's offers leave of the
  goods covers the amount — [Discounts](/p/grade10-site/store/discounts)
- **Plan** — one sale row per session, rewritten on every plan, capped at 20
  plans in 5 minutes
- **Discount on the cart** — the store's order id first, then the "Points"
  fixed discount; the promise is trimmed to what the cart shows
- **Shown before it commits** — points spent, money still due, balance after
  and points this sale will earn, priced by the platform
- **Confirm** — the button locks while it runs, so a double tap spends once
- **Undo before tender** — staff remove the discounts, then the order id, and
  the promise is dropped
- **No reversal at the till** — undoing before tender only drops the
  discounts; reversing a spend once it settles is the console's job, never
  the till's
- **Expiry** — a promise nobody tenders expires after 1 hour; a sale the cart
  pays after that still settles
- **Earning** — the customer on the sale is enough, terminal or not

:::flow{title="At the till" case="Paid" diagram="assets/diagrams/shopify-till-paid.svg"}
## *Shopkeeper* — **Rings up the sale**
In Shopify POS, as any other sale.

## *Shopkeeper* — **Identifies the member**
One arm answers, and the store opens a session on it: 10 minutes, bound to the shop and the member. The terminal also sets the paired customer on the cart, because that customer is what attributes the sale even when nothing else answers.

## *Shopkeeper* — **Plans the spend**
Points and coupons, priced against the lines the terminal claims. The store writes one sale row per session and rewrites it on every later plan.

## *Shopify* — **Cart carries the discount**
The store's order id goes onto the cart first, then the "Points" amount comes off it. A sale carrying the id and less money off settles only what the shop took off; money off with no id is a discount the store cannot bind to a sale.

```json
{
  "addCartProperties": { "grade10_order_id": "3b7d0c9e-2f41-4c8e-9a55-71b0d3e6c204" },
  "applyCartDiscount": ["FixedAmount", "Points", "12.00"]
}
```

Each write is read back off the cart and confirmed by its title, its amount and its currency before the next one goes on

## *Shopkeeper* — **Takes payment**
At the counter, in Shopify POS.

## *Shopify* — **Order paid**
The same webhook as online, carrying the shop's own counter channel.

```json
{
  "admin_graphql_api_id": "gid://shopify/Order/1042",
  "source_name": "pos",
  "cart_token": null,
  "currency": "HKD",
  "subtotal_price": "88.00",
  "customer": { "admin_graphql_api_id": "gid://shopify/Customer/7788990011" },
  "discount_applications": [{ "title": "Points" }],
  "note_attributes": [
    { "name": "grade10_order_id", "value": "3b7d0c9e-2f41-4c8e-9a55-71b0d3e6c204" }
  ]
}
```

## *Store* — **Sale marked paid**
The order id on the cart is a claim, not proof: it binds only where the shop's own counter channel rang the sale, the customer on it is the paired one, and the currency matches. Then the sale is marked paid and the order event is written once, the same shape the online order writes.

## *Loyalty* — **Points debited, earn granted**
The same debit and the same earn as online, recorded against the counter rather than the online store.
:::

:::flow{title="At the till" case="Guest sale, claimed later" diagram="assets/diagrams/shopify-till-guest.svg"}
## *Shopkeeper* — **Rings up a guest sale**
Nobody is identified, or the terminal is off, or the programme did not answer. Staff are told which, and the sale goes on as an ordinary sale.

## *Shopify* — **Order paid**
No order id on the cart, so there is no promise to bind to.

## *Store* — **Recorded with no owner**
The sale is recorded with its goods priced and nobody named. A customer on the sale is looked at again on every pass — 5 minutes after the sale, then hourly, and given up on after 30 days.

## *Loyalty* — **Earns when the sale is paired**
The earn is priced on the goods that sale settled, whenever the sale gets an owner. Past the 30 days an operator claims the sale by hand, with what they saw recorded beside their name — [Purchases Before the Account](/p/grade10-site/loyalty/profile#purchases-before-the-account)
:::

:::flow{title="At the till" case="Undone before tender" diagram="assets/diagrams/shopify-till-undone.svg"}
## *Shopkeeper* — **Takes the benefits off**
The gift lines, then the coupon discounts, then the "Points" discount, and the store's order id last, because a sale paid while the id is on the cart still binds to its row. The id stays on while a coupon code is on the sale, because Shopify will not remove one code at a time.

## *Store* — **Promise dropped**
The terminal reports what the sale still shows, and the row is trimmed to it: the points come off the row whether or not the discount came off the cart. Nothing was debited, because nothing was held.

## *Shopkeeper* — **Takes payment as an ordinary sale**
The sale carries on at full price.

## *Loyalty* — **Nothing moves**
No order event, so the balance never changed. A promise nobody tenders expires after 1 hour, and a cart paid after that still settles against its row.
:::

What a spend is allowed to pay for is on
[Paying with Points](/p/grade10-site/loyalty/paying-with-points).

### Switches

Every switch defaults in code, is stored per shop only as a deviation, and is
enforced on the next request. An operator flips them from the admin console.

| Switch | Default | Governs |
| --- | --- | --- |
| Terminal enabled | On | The whole till surface. Off: identification refuses and sales carry on as guest sales |
| Email spend | On | Spending on a session opened by a staff-typed email |
| Phone lookup | Off | Identifying by a staff-typed number |
| Phone spend | Off | Spending on a phone session |
| Cart identify | On | The customer already on the sale identifies the member |
| Cart spend | Off | Spending on a cart session |

QR, the short code and a wallet pass have no switch of their own; the terminal
switch is what stops them.

❓ **Phone lookup** — ships off until mobile numbers on the
[account profile](/p/grade10-site/account/profile) are verified; when it turns
on is the owner's call.

## Discounts and Shipping

- **A tier is its multiplier only** — no Shopify Function, automatic discount,
  customer segment or tag carries a tier
- **What the programme takes off** — the points and the coupons, and nothing
  tier-based

| Rule | Value |
| --- | --- |
| Shipping | **$60**, free at or above **$800** |
| Served by | **One function**, answering the checkout's shipping preview and Shopify's carrier callback alike |
| On a draft | **None** — the invoice page prices it |
| At the till | **None** — the counter ships nothing |

- **Points never pay shipping, shipping never earns** — the tender is an
  order-level pre-tax discount capped at the qualifying goods, so a refund of
  the delivery alone returns no points
- **No shipping promotion** — one could sit beside the points discount; none
  exists
- **The free bar is read before discounts** — the carrier request carries the
  shop's own line prices, gross of the draft's discounts, and the preview
  reads the same pre-discount basis, so the two agree where points or a coupon
  cross the bar

:::detail{title="Code map" for="engineer"}
- **Pairing** — `packages/grade10-store/backend/src/services/pairing`, and
  `sweeps/pairingDeletion.ts` for erasure
- **Draft orders** — `packages/shopify/backend/src/admin/draftOrders.ts`
- **Points tender** — `services/pointsTender.ts`,
  `services/loyalty/pointsSpend.ts`, switched by `POINTS_TENDER` in
  `packages/app-env`
- **Webhooks** — `routes/webhooks.ts`, sink `services/loyalty/sink.ts`
- **External orders** — `services/external`
- **POS extension** — `integrations/shopify-pos/grade10`
- **POS gateway** — `packages/grade10-store/backend/src/trpc/pos`, mounted at
  `/api/pos`
- **Till sale** — `services/pos/sale/sale.ts`
- **Switches** — `packages/grade10-store/contracts/src/pos.ts`
- **References** —
  [the Shopify membership and POS plan](/references/shopify-membership-pos)
  and [the POS extension notes](/references/shopify-pos-extension)
:::
