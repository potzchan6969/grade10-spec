# Settle a sale against the lines the shop actually sold

**Author:** @ecchochan - 2026-09-04

Product context: [Discounts](../../../docs/prds/products/grade10-site/store/discounts.md)
and [Refunds](../../../docs/prds/products/grade10-site/store/refunds.md).

## Why

The shop states, line by line, what it sold and what each discount took off it;
the store reads those bodies, keeps the totals, and drops the lines. Every later
question of the form *what did the shop apply, and to which line* is then
answered from the store's own promise instead — so a returned gift card claws
back points it never earned, and a coupon whose cut staff removed is spent
anyway.

The measurable claims: **share of settled orders whose money is priced from the
shop's own lines**, and **points reversed per month that no returned good
earned**.

## What Changes

- **A paid order keeps its settled lines.** What the shop sold, what each line
  earned, and what each discount allocated to it, recorded once when the order
  settles and never recomputed — the same record every money rule then reads.
- **A claw-back is priced on the lines that came back.** A refund names the
  lines it returns; the earning reversed is what those lines earned. Returning
  a gift card reverses nothing, and a split return reaches the same basis as
  one refund would.
- **A points tender returns only when everything it was spread over does.** The
  tender is one discount the shop spreads across every line it sold, so a member
  returning every card and keeping a gift card gets none of it back. Reading it
  against what earned instead hands back the points that bought the card — money
  minted every time the member repeats it. The member left short is reported,
  and an operator returns the points by hand.
- **A welded coupon is corroborated by its cut, not by its variant.** Today a
  product or gift coupon is spent whenever the sale sold that variant, so a cut
  staff took off after the apply still burns the member's coupon.
- **A discount is worth what the shop allocated to it**, not what this store
  minted — the points tender included. Today the points captured are the
  order's whole applied discount less every other instrument, so a shopkeeper's
  own manual cut is read as points wherever the shop honoured less than the
  Store promised. The same subtraction stands in for an order code adopted from
  a sale the till never reported, and for the shop's own automatic promotions,
  which reach the applied total and belong to no instrument.
- **BREAKING** — `PaymentOrderLine` and `PaymentRefundFact` gain the provider's
  line handles and allocations. Every payment provider states them or says it
  cannot; a provider that cannot keeps today's pro-rated answer, named as such.

## Non-Goals

- **Points as line discounts.** Spending points across the qualifying lines is
  what would let a tender be returned line by line, and stop it reaching a gift
  card at all. A change of its own; until it lands the whole sale is the only
  honest threshold.
- **The eligible-goods rule.** What earns and what does not is the loyalty
  capability's, unchanged here; this change only prices it per line.
- **A member-facing return flow.** A refund is still an operator's move in
  Shopify.

## Capabilities

### New Capabilities

- `grade10-site/store/order-settlement` — what a paid order records about the
  lines the shop sold, and what every money rule reads from it: the earn basis,
  a claw-back's price, and whether a coupon was really taken.

### Capabilities this one must agree with

- `grade10-site/store/membership` (active change `add-shopify-membership-pos`) —
  its rule that only eligible goods earn, on every channel, stands as written.
  ❓ That change has shipped and is not yet archived, so its capability has no
  durable spec to modify; the corroboration rule inside it is restated here as
  an added requirement rather than a delta. Archiving it first would let this
  change modify the rule in place.

## Impact

- **When it must land** — before the first production order, or behind a
  backfill of every order settled without it. The record is written at
  settlement; the shop keeps the lines afterwards, and the Admin sweep already
  asks for `lineItems.nodes.id` and `discountAllocations`, so the fallback is a
  sweep and a re-pricing rather than a loss. What no sweep undoes is a refund
  already priced from the estimate and a coupon already spent on it.
- **Schema** — settled lines keyed by order and the provider's own line handle,
  and what each named discount allocated to them beside it. What a welded
  coupon put on a line is already `order_coupon_cuts`; the refund totals on
  `orders` stay as they are.
- **Wire** — the Shopify webhook and Admin decoders keep `line_items[].id`,
  `discount_allocations[].amount`, `discount_codes[].amount`, and
  `refund_line_items[].line_item_id`, all of which are read and discarded today.
- **What it closes** — the gift-card claw-back, a tender returned for a sale
  the member still holds part of, a split return never reaching the whole
  basis, a coupon burned for a cut nobody gave, and an adopted code counted at
  face value.
- **What it leaves open** — a shop that states no goods split is measured
  against a charge carrying shipping the goods never did, so a goods-only
  return of the whole sale falls short of returning the tender. Reported for an
  operator, and closed for good by spending points per line.
