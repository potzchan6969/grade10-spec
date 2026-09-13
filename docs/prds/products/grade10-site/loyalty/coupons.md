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
| Online | Chosen in the cart; its Shopify Discount is minted when the checkout is submitted and the draft order carries it |
| At the till | Chosen inside the till session — a shopkeeper applies it from the member's panel, or the member opens it on their own phone and the till scans it; its Shopify Discount is minted the moment it is chosen and reused for that sale |

- **Held for an order, then settled** — a coupon is held against the order
  being paid, and freed again if that order is not
- **A sale that beats it** — where the shop's own sale and the coupon
  cannot stack, the shop keeps the larger cut; the coupon goes back to the
  wallet, the order goes through, and the member is told —
  [Discounts](/p/grade10-site/store/discounts)
- **A stuck hold frees itself** — **24 hours** on, a hold nothing ever settled
  is released
- **One live attempt** — a second application while one is in flight is
  refused
- **The order's one discount** — a reward coupon is in that count; points
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

:::detail{title="Code map" for="engineer"}
- **Reward coupons** — `packages/loyalty/backend/src/services/rewards/coupons.ts`,
  rows of `coupon_instances` and `coupon_usages` in
  `packages/loyalty/backend/src/db/schema/rewards.ts`
- **The store's own coupons** — `packages/grade10-store/backend/src/services/coupons`,
  applied to a sale by `apply.ts` there
- **One vocabulary and one evaluator** — `@grade10/coupons-contracts`,
  `packages/coupons/contracts/src/evaluate.ts`
- **Design records** —
  [loyalty architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/loyalty.md)
  and
  [commerce architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/commerce.md#coupons-speak-one-vocabulary)
:::
