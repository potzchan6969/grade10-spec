---
title: Coupons
spec: grade10-site/loyalty/programme
order: 5
---

A coupon is Grade10's own instrument: what a redemption leaves the member
holding, and what an order carries to spend it. Grade10 decides whether the
member may spend it on the order's lines; online, the shop prices it, from a
Shopify discount code carrying the coupon's own value — a 10% coupon is a 10%
code — and the cut the buyer pays is the shop's own figure.

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
| Channels | The selling channels the definition names, online alone for a scope the till cannot match, and the till alone for a gift, whatever channels it names - [Reward Types](/p/grade10-site/loyalty/rewards#reward-types) |
| Runs from | The redemption, for the whole days the reward states |
| Expiry | Read off the clock, never written down |

- **Expired is spent** — an unused coupon past its end returns nothing, and is counted as breakage
- **Birthday month** `TBC` — a definition can hold a coupon to the month of
  the member's birthday; loyalty holds no birthday, so every coupon asking
  for one is refused

- **The picture** — the coupon list shown here draws a code only where the
  coupon is passed one; 🚧 a money-off redemption mints one member-readable
  code, unique to it — [Rewards](/p/grade10-site/loyalty/rewards#using-a-reward)

::story{id="loyalty-coupons-blocks-couponlist--codeless" title="The coupons a member holds"}

- **Ordered for the next spend** — Available reads nearest expiry first;
  Used & Expired reads newest first
- 🚧 **Running out reads louder** — an available coupon inside its last
  14 days draws its Use by line emphasised
- 🚧 **Online-only is never a QR** — a coupon the till cannot match names
  its scope and carries no Use now, so no member holds out a code the sale
  refuses
- 🚧 **The wallet re-reads when the scan closes** — `CouponList` reports
  its scan surface's open and close; closing it puts the token away and
  re-reads the coupons, so one staff just scanned reads as used the moment
  the member pockets their phone. The list does not listen while the card
  is up
- **The scan token's life** — each Use now mints a fresh presentation of
  the member card naming the coupon: it lives ten minutes, one scan consumes
  it, and while held out it renews itself a minute before it runs out and
  when the screen wakes, so whatever is on screen scans; a coupon that can
  no longer be shown puts the square away. It is the same on a sale: a scan
  over the member's own sale opens a new session that keeps the sale and its
  points, and chooses the coupon for staff to apply
- 🚧 **Its own page** — the wallet is its own Coupons page, Available and
  Used & Expired as tabs; Membership's Coupons section draws the same
  ledger, tabs and empty lines
- 🚧 **Points still buy more** — under the Available list sits a Rewards
  upsell ("Want more coupons?"); on the Coupons page its CTA opens the
  Rewards page, on Membership it switches the rail to the Rewards
  section

::story{id="loyalty-coupons-screens-coupons--default" title="The Coupons page"}

## Applying one

| Channel | How it lands |
| --- | --- |
| Online | Chosen in the cart drawer or at `/checkout` from the coupons the member holds; its Shopify Discount is minted when the checkout is submitted and the draft order carries it. Never a gift |
| At the till | For a scope the till can match, chosen inside the till session - a shopkeeper applies it from the member's panel, or the member opens it on their own phone and the till scans it - before a sale, that one scan also identifies the member; a product coupon's Shopify Discount is minted the moment it is chosen and reused for that sale, and a gift goes on as its own line, discounted to nothing |

- **Answered before chosen** — the drawer answers every coupon against the
  cart, and holds none by reading — [Cart Drawer](/p/grade10-site/store/cart)
- **Nothing is held** — a coupon stays available until a paid order spends
  it, so a checkout the member walks away from costs them nothing —
  [Discounts](/p/grade10-site/store/discounts)
- **The newest claim is the only live one** — choosing a coupon again takes
  it off every earlier sale first
- **A gift keeps its minimum to the end** — staff ringing the sale below a
  gift's minimum spend after Apply take its line back off, the coupon goes
  back to the wallet and staff are told
- **A sale locked for tender keeps its minimum too** — nothing may write to
  it, so the gift's line stays and staff are told to cancel the tender and
  remove the gift; the sale is never let through below the minimum
- **No membership, no gift** — a sale the till cannot tie to a member offers
  no gift; the coupon stays with the member for a later visit, and staff
  never key a free line in its place
- **A return keeps the gift with the member** — whatever the sale falls to,
  the gift is never taken back, and its coupon stays used
- **A sale that ends gives it back** — a counter sale nobody paid releases
  its coupon when a newer promise retires it, or an hour after its last plan,
  not the next day
- **An online checkout that took the money keeps it** — and so does one the shop will not close,
  or a sale still being submitted, for its first five minutes; the claim is refused
- **A sale that gave it back can take it again** — a till sale carries it
  on the plan after a refused one; a sale the shop collected never does
- **A sale that beats it** — where the two cannot stack the shop keeps the
  larger cut and the coupon goes back to the wallet —
  [Discounts](/p/grade10-site/store/discounts#order-of-application)
- **The order's one discount** — a reward coupon is in that count; points
  paid against the bill, free shipping and the site's own discounts sit
  outside it — [Discounts](/p/grade10-site/store/discounts#one-discount-at-a-time)

:::detail{title="One coupon, two sales" for="engineer"}
- **One conditional write decides it** — the claim lands only where the coupon
  is still available, and one live claim per coupon is a database rule
- 🚧 **The sale that loses asks again** — it retires the earlier sale first,
  and is refused by name where that checkout took the money, will not close,
  or is still being submitted

::image{src="assets/diagrams/coupon-contested-claim.svg" alt="Two sales claiming one coupon: one conditional claim settles it, and the sale that loses retires the earlier one and asks again"}
:::

:::detail{title="Giving a claim back" for="engineer"}
- **Before the commit** — the request's own guard, on every exit
- **After it** — a release attempt as the write lands, then the outbox,
  retried until an hour past the programme's sweep
- **A claim whose order was never written** — released by the next claim on
  that coupon once the claim is five minutes old
- **Under all three** — the programme releases any claim still standing 25 hours
  after it was made: an expired online order's once its code is dead, or one
  a checkout left when it stopped before its order was written

::image{src="assets/diagrams/coupon-claim-safety-net.svg" alt="The three routes a claimed coupon takes back to the wallet, with the programme's sweep under all of them"}
:::

## Cases

:::flow{title="Online" case="Retaken, then paid" diagram="assets/diagrams/coupon-retaken-paid.svg"}
## *Member* — **Reaches checkout with a coupon**
A code is minted for the cart, ephemeral.

## *Member* — **A second cart claims it first**
Frees the earlier cart's claim and code, and claims it there instead.

## *Loyalty* — **The cart that claims it uses it when paid**
The paid order stamps it used. The earlier cart was cancelled with its code, so it cannot pay.
:::

:::flow{title="At the till" case="Walked away" diagram="assets/diagrams/coupon-walked-away.svg"}
## *Shopkeeper* — **Applies it at the till**
From the member's panel, or the member opens it on their phone and the till scans it; before a sale, that scan also identifies the member.

## *Member* — **Leaves without paying**
The shop owns that cart, so the sale is never cancelled.

## *Store* — **The sale runs out of time**
An hour after its last plan, not a day.

## *Store* — **The coupon comes off**
Its code is deactivated, or a gift's line stays on the cart, and the coupon is back in the wallet. A sale paid anyway is settled as [Spending one](#spending-one) says.
:::

:::flow{title="At the till" case="Claimed again, then paid" diagram="assets/diagrams/coupon-till-retaken-paid.svg"}
## *Shopkeeper* — **Applies it on a sale**
A product coupon's code is minted the moment it is chosen.

## *Shopkeeper* — **A second sale claims it first**
Frees the earlier sale's claim and code, and claims it there instead.

## *Loyalty* — **The sale that claims it uses it when paid**
An earlier sale paid with its old code spends nothing, and is reported.
:::

:::flow{title="Refused" case="An earlier sale stands" diagram="assets/diagrams/coupon-earlier-sale-stands.svg"}
## *Member* — **Picks a coupon**
An earlier sale of theirs is carrying it.

## *Store* — **Tries to free it**
The shop will not close that checkout, and its bill can still collect.

## *Store* — **Refuses by name**
Taking the coupon would put the same money on two bills.

## *Member* — **Told an earlier sale stands**
They read that an earlier sale holds the cut, never that the coupon is unavailable.
:::

## Refusals

The member reads which refusal answered; no basket quietly loses a coupon.

### Coupon

| Refusal | Meaning |
| --- | --- |
| Not held | Not a coupon this member holds; a code bound to another member is answered as one nobody minted |
| Not standing | Already spent, or otherwise not available |
| Expired | Its own validity passed |
| Wrong channel | Not good in the channel it is being spent in - [Validity](#validity). At the till the panel marks it online only and staff cannot apply it; on the member's phone it carries no Use now, and a presentation that reaches the store anyway reads `This coupon cannot be used on this sale.` |
| Online only by scope | A coupon scoped to named products or a catalog filter, whatever channels it names; at the till it reads as Wrong channel does |
| Not eligible | The definition's eligibility is not met |
| An earlier sale stands | An online checkout carrying this coupon that took the money or could not be closed, or a sale still being submitted with it, so its cut still stands |
| Written too late | A checkout or counter sale whose order is written more than a minute after its claim; the coupon is back in the wallet. The member reads that the checkout took too long and to submit it again; staff, that the sale took too long and to apply it again |

### Basket

| Refusal | Meaning |
| --- | --- |
| Under the threshold | The basket holds less than the coupon asks for |
| Wrong currency | Not the programme's currency |
| Nothing matches | No line matches what the coupon applies to, or the catalogue could not be read |
| Every line free | Every eligible line is already fully discounted |
| The cut will not split | The amount cannot be divided across the eligible lines |
| Gift already held | A gift whose variant the basket already carries |
| Site discount gives more | The shop's own automatic discount and this coupon cannot both apply, and the automatic takes more; the coupon stays in the wallet |
| Refused by the shop | The shop would not apply the coupon's code to this basket |

## Spending one

**The paid order stamps it used, and nothing else does.** A coupon on a draft
nobody paid was never spent.

- **A sale that did not carry it did not spend it** — a counter sale whose
  cut the shop never gave hands the coupon back
- **A code collected after it was let go** — reported to an operator with
  the order on it; the paid sale spends the coupon unless another sale
  claims it
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
- **A store gift is the till's too** — a gift the store mints is refused
  online as the wrong channel, as a reward's is, and goes on at the counter
  from the member's panel or a typed code
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

:::detail{title="Product decisions" for="pm"}
A coupon held for a sale nobody paid locks a member out of their own reward,
at the counter and online alike. So no coupon is held: a claim takes it off
every earlier sale, and a paid sale spends it only where the shop gave the cut. The decisions behind it
are on [Discounts](/p/grade10-site/store/discounts).

| Measure | Target |
| --- | --- |
| Coupon claims refused as unavailable | Zero |
| Coupons spent within a day of a counter sale the member walked away from | Counted |

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| A rate at the shop's rate | Decided | Online, a percentage coupon is minted as a percentage code, so the shop takes the rate as it rounds it rather than a fixed amount the store worked out. A ceiling the rate would pass is minted as that ceiling, in money, because a shop code caps no rate. At the till a coupon is still minted as the store's own cut. | Product |
| Deactivating a code | Decided | It never refuses a claim. The shop honours a code a cart already carries, so settlement guards the money and the deactivation is retried. | Product |
| What the member is shown | Decided | A coupon a sale claims reads as it would unclaimed: no claimed state, no sale named, and nothing said when a claim moves. A till spend they were told had landed is still corrected if its sale is abandoned unpaid. | Product |
| An online order that expires | Decided | It keeps its claim until its code can no longer be collected, and the programme's clock then releases it. A counter sale gives its coupon back at its hour. | Engineering |
| A gift on a sale locked for tender | Decided | Staff are told to cancel the tender and remove the gift. The extension cannot write to a locked sale, and letting it through hands out a gift below its minimum. | Product |
| A gift with no membership to reach | Decided | Refused; the member comes back. A free line keyed by hand spends no coupon, so the same gift could be claimed again online or at another till. | Product |
| A returned sale's gift | Decided | The member keeps it. Staff never price a gift out of a refund at the counter, and the coupon already stays used. | Product |
| What a gift asks at the till | ❓ Open | Today's rules take the gift product at 100% off — its line is discounted to nothing and settlement reads it free. An item the member still part-pays at the counter fits none of those rules, and "gift" promises free in the name itself: a part-paid redemption would need the term amended or a new one. | Product |
| A code collected after it was let go | Decided | The paid sale spends the coupon where no other sale claims it, so a counter sale that pays with its old code costs the member the coupon once. Where another sale claims it, that sale spends it and the paid one is reported. | Product |
:::
