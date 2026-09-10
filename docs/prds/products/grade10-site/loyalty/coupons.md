---
title: Coupons
spec: grade10-site/loyalty/programme
order: 5
---

A coupon is Grade10's own instrument: what a redemption leaves the member
holding, and what an order carries to spend it. Grade10 prices it against
the order's lines; a Shopify discount — a custom discount on the draft order,
a line discount, or a code — is only how that price reaches the order and
how the checkout shows it, never what decides it.

## Validity

A coupon carries the reward's definition as it stood on the day it was bought,
so redefining the reward never rewrites a coupon a member already holds —
[Rewards](/p/grade10-site/loyalty/rewards).

| Property | Value |
| --- | --- |
| What it takes off | What that definition says |
| Uses | **One** |
| Who | The member who redeemed it |
| Channels | Only the selling channels the definition names |
| Runs from | The redemption, for the whole days the reward states |
| Expiry | Read off the clock, never written down |

- **Expired is spent** — an unused coupon past its end returns nothing by
  itself; what members forfeit is counted as breakage where Finance can read it
- **Birthday month** `TBC` — a definition can hold a coupon to the month of
  the member's birthday; loyalty holds no birthday, so every coupon asking
  for one is refused

::story{id="loyalty-membership-couponlist--default" title="The coupons a member holds"}

## Applying one

| Channel | How it lands |
| --- | --- |
| Online | 🚧 The draft order the checkout builds carries its Shopify Discount |
| At the till | 🚧 A shopkeeper applies it from the member's panel, or types it, and the terminal mints its Shopify Discount onto the sale |

- **Held for an order, then settled** — a coupon is held against the order
  being paid, and freed again if that order is not
- **A stuck hold frees itself** — **24 hours** on, a hold nothing ever settled
  is released
- **One live attempt** — a second application while one is in flight is
  refused
- 🚧 **The order's one discount** — a reward coupon is in that count; points
  paid against the bill, free shipping and the site's own discounts sit
  outside it — [Discounts](/p/grade10-site/store/discounts)

## Refusals

The member is told which of these answered, and never left with a basket that
quietly lost a coupon.

### Coupon

| Refusal | Meaning |
| --- | --- |
| Not held | Not a coupon this member holds |
| Not standing | Already spent, or otherwise not available |
| Expired | Its own validity passed |
| Wrong channel | The definition does not name the channel it is being spent in |
| Not eligible | The definition's eligibility is not met |
| Attempt in flight | Another application of the same coupon is already live |

### Basket

| Refusal | Meaning |
| --- | --- |
| Under the threshold | The basket holds less than the coupon asks for |
| Wrong currency | Not the programme's currency |
| Nothing matches | No line matches what the coupon applies to, or the catalogue could not be read |
| Every line free | Every eligible line is already fully discounted |
| The cut will not split | The amount cannot be divided across the eligible lines |
| Gift already held | A gift whose variant the basket already carries |

## Spending one

**The paid order stamps it used, and nothing else does.** A coupon on a draft
nobody paid was never spent.

- **Used has no way back** — cancelling or refunding that order leaves the
  coupon used and the points spent
- **An unused one an operator can reverse** — the coupon is voided and the
  points that bought it come back with it —
  [Rewards](/p/grade10-site/loyalty/rewards)
- **A lapsed coupon stays spent** — what lapsed is counted as coupons and as
  the points they cost, never as money

## Store promotions

The store mints its own coupons — order, product and gift alike — and they are
the store's instrument, not the programme's.

- **Minted by an operator alone** — a code prefix, a validity in days, and
  optionally the one member it belongs to
- **Never a reward** — no reward defines an order coupon; those are the
  store's to mint — [Discounts](/p/grade10-site/store/discounts)

:::callout{kind="warning"}
The durable spec has no notion of a coupon: a redemption there is an
entitlement with no settlement. Everything on this page is specified in the
in-flight `revise-loyalty-programme-rules` and `add-shopify-membership-pos`
changes.
:::

:::detail{title="Where a coupon lives" for="engineer"}
- **Two registries** — loyalty's `coupon_instances` is the member's own, one
  row per redemption carrying the definition it was bought under, as
  `available`, `reserved`, `used`, `expired`, `void`, with no transition out of
  `used`; the store's own registry holds every coupon the store issued whatever
  granted it, as `live`, `used`, `void`
- **Expiry is read, never written** — a row reads expired the instant its date
  passes, and no read path writes
- **`coupon_usages`** — one attempt to apply one coupon to one order, keyed for
  idempotency and unique on a live attempt per coupon, which is what answers
  `idempotency_conflict`
- **Provider artifact** — 🚧 `discount_code`, minted once the basket
  qualifies, the same as the store's own order coupon
- **An order code's reach** — the whole order, named products, or named
  variants; never a catalogue filter, since the shop knows nothing of worlds
  and types
- **Refusal reasons** — `not_found`, `not_available`, `expired`,
  `wrong_channel`, `birthday_unavailable`, `not_eligible`,
  `idempotency_conflict` from the programme's own guards; `minimum_subtotal`,
  `currency_mismatch`, `no_eligible_lines`, `line_already_free`,
  `cut_cannot_split`, `gift_in_basket` from the shared evaluator
- **Stale holds** — `STALE_RESERVATION_HOURS = 24`; metric
  `loyalty.coupon.reservation_released`
:::
