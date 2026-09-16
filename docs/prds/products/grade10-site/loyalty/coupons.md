---
title: Coupons
spec: grade10-site/loyalty/programme
order: 5
reviewed: 2026-09-15
---

A coupon is Grade10's own instrument: what a redemption leaves the member
holding, and what an order carries to spend it. Grade10 prices it against
the order's lines; a Shopify discount — a custom discount on the draft order,
a line discount, or a code — is only how that price reaches the order and
how the checkout shows it, never what decides it.

::image{src="assets/diagrams/coupon-life.svg" alt="A coupon from redeemed or granted, to available, to claimed by a sale, to used when that order is paid, with the Shopify discount code a claim mints above it"}

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

- **Expired is spent** — an unused coupon past its end returns nothing, and is
  counted as breakage
- **Birthday month** `TBC` — a definition can hold a coupon to the month of
  the member's birthday; loyalty holds no birthday, so every coupon asking
  for one is refused

::story{id="loyalty-membership-couponlist--default" title="The coupons a member holds"}

## Applying one

| Channel | How it lands |
| --- | --- |
| Online | Chosen in the cart drawer or at `/checkout` from the coupons the member holds; its Shopify Discount is minted when the checkout is submitted and the draft order carries it |
| At the till | Chosen inside the till session — a shopkeeper applies it from the member's panel, or the member opens it on their own phone and the till scans it; its Shopify Discount is minted the moment it is chosen and reused for that sale |

- **Answered before chosen** — the drawer answers every coupon against the
  cart, and holds none by reading — [Cart Drawer](/p/grade10-site/store/cart)
- 🚧 **Nothing is held** — a coupon stays available until a paid order spends
  it, so a checkout the member walks away from costs them nothing —
  [Discounts](/p/grade10-site/store/discounts)
- 🚧 **The newest claim is the only live one** — choosing a coupon again takes
  it off every earlier sale first
- 🚧 **A sale that ends gives it back** — a counter sale nobody paid releases
  its coupon within the hour, not the next day
- 🚧 **A sale that took the money keeps it** — and a coupon on a checkout the
  shop will not close is refused rather than taken
- **A sale that beats it** — where the two cannot stack the shop keeps the
  larger cut and the coupon goes back to the wallet —
  [Discounts](/p/grade10-site/store/discounts)
- **The order's one discount** — a reward coupon is in that count; points
  paid against the bill, free shipping and the site's own discounts sit
  outside it — [Discounts](/p/grade10-site/store/discounts)

:::detail{title="One coupon, two sales" for="engineer"}
- **One conditional write decides it** — the claim lands only where the coupon
  is still available, and one live claim per coupon is a database rule
- **The sale that loses asks again** — it cancels the earlier sale first, and
  is refused by name where that checkout is still live

::image{src="assets/diagrams/coupon-contested-claim.svg" alt="Two sales claiming one coupon: the reservation write settles it, and the sale that loses cancels the earlier one and asks again"}
:::

:::detail{title="Giving a claim back" for="engineer"}
- **Before the commit** — the request's own guard, on every exit
- **After it** — a release attempt as the write lands, then the outbox
- **Under both** — the programme releases anything still pending after 25 hours

::image{src="assets/diagrams/coupon-claim-safety-net.svg" alt="The three routes a held claim takes back to the wallet, with the programme's sweep under all of them"}
:::

## Cases

:::flow{title="Online" case="Paid" diagram="assets/diagrams/coupon-online-paid.svg"}
## *Member* — **Picks a coupon**
From the cart drawer or `/checkout`. Reading the list holds nothing.

## *Store* — **Asks the programme**
Every earlier sale of theirs naming this coupon gives it back first.

## *Store* — **Promises the order**
The cut lands on the lines, and a code is minted for this member, for a day.

## *Member* — **Pays the invoice**
Until this moment the coupon is spent on nothing.

## *Loyalty* — **The coupon is spent**
The paid order stamps it used. Nothing else does.
:::

:::flow{title="Online" case="Taken by the next sale" diagram="assets/diagrams/coupon-taken-next.svg"}
## *Member* — **Picks it on a second sale**
The same coupon, on a sale opened after the first.

## *Store* — **Frees the earlier sale**
Its cut comes off and its code is deactivated; an online order is cancelled, a counter sale keeps its cart.

## *Store* — **The new sale claims it**
The cut lands there instead.

## *Member* — **One live coupon**
One coupon, spendable, as before. Only the sale it left has changed.
:::

:::flow{title="Online" case="Retaken, then paid" diagram="assets/diagrams/coupon-retaken-paid.svg"}
## *Member* — **Reaches checkout with a coupon**
A code is minted for the cart, ephemeral.

## *Member* — **A second cart claims it first**
Frees the earlier cart's claim and code, and claims it there instead.

## *Loyalty* — **Whichever cart pays is the one that used it**
The paid order stamps it used. Nothing else does.
:::

:::flow{title="At the till" case="Walked away" diagram="assets/diagrams/coupon-walked-away.svg"}
## *Shopkeeper* — **Applies it at the till**
From the member's panel, or the member opens it on their phone and the till scans it.

## *Member* — **Leaves without paying**
The shop owns that cart, so the sale is never cancelled.

## *Store* — **The sale runs out of time**
An hour after the sale was planned, not a day.

## *Store* — **The coupon comes off**
The cut and the code go; a sale that pays anyway is settled against what it carried.
:::

:::flow{title="Refused" case="An earlier sale stands" diagram="assets/diagrams/coupon-earlier-sale-stands.svg"}
## *Member* — **Picks a coupon**
An earlier sale of theirs is carrying it.

## *Store* — **Tries to free it**
The shop will not close that checkout, and its bill can still collect.

## *Store* — **Refuses by name**
Taking the coupon would put the same money on two bills.

## *Member* — **Told which sale**
They read that an earlier sale holds the cut, never that the coupon is unavailable.
:::

## Refusals

The member is told which of these answered, and never left with a basket that
quietly lost a coupon.

### Coupon

| Refusal | Meaning |
| --- | --- |
| Not held | Not a coupon this member holds; a code bound to another member is answered as one nobody minted |
| Not standing | Already spent, or otherwise not available |
| Expired | Its own validity passed |
| Wrong channel | The definition does not name the channel it is being spent in |
| Not eligible | The definition's eligibility is not met |
| 🚧 An earlier sale stands | A sale carrying this coupon that could not be closed, so its cut still stands |

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

- 🚧 **A sale that did not carry it did not spend it** — a counter sale whose
  cut the shop never gave hands the coupon back
- **Used has no way back** — cancelling or refunding that order leaves the
  coupon used and the points spent
- **An unused one an operator can reverse** — voided, with the points that
  bought it — [Rewards](/p/grade10-site/loyalty/rewards)
- **A lapsed coupon stays spent** — what lapsed is counted as coupons and as
  the points they cost, never as money

## Store promotions

The store mints its own coupons — order, product and gift alike — and they are
the store's instrument, not the programme's.

- **Minted by an operator alone** — a code prefix, a validity in days and the
  one member it belongs to — [Discounts](/p/grade10-site/store/discounts)
- **Listed for its member** — with their reward coupons in the cart drawer
  and at `/checkout`, answered against the cart before it is picked
- **Never a reward** — no reward defines an order coupon; those are the
  store's to mint — [Discounts](/p/grade10-site/store/discounts)

:::detail{title="Code map" for="engineer"}
::image{src="assets/diagrams/coupon-claim-mechanism.svg" alt="One claim from the store's ask through payment to its settlement, and the give-back leg taken where the sale ends instead"}

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
