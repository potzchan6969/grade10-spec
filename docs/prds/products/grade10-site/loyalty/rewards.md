---
title: Rewards
spec: grade10-site/loyalty/programme
order: 3
---

## Reward Types

| Type | Discount | Scope | Minimum spend | Example |
| --- | --- | --- | --- | --- |
| Product coupon | A fixed amount, or a percentage with a maximum discount | Named products or variants, a filter over the catalog's worlds and types, or the whole order | Optional | $50 off Pokémon |
| Gift | A free line added to the order, the variant it names | — | Required, above zero, so a gift always rides on a purchase | A free booster pack over $500 |

Both are coupons, Grade10's own instrument, and a reward that takes money
off the whole order is a product coupon whose scope is the whole order —
[Coupons](/p/grade10-site/loyalty/coupons). The store's own promotions use
the same coupons without a reward in front —
[Discounts](/p/grade10-site/store/discounts).

Both kinds state:

- **Title** — what the member reads
- **Currency** — what the reward is priced in
- **Minimum spend** — the goods a basket must hold before the reward
  applies, read from the lines themselves, never from a total handed in
  beside them
- **Combines with** — which of the shop's own product, order and
  shipping discounts the coupon stacks with; the store default where the
  reward states none — [Discounts](/p/grade10-site/store/discounts)

| Reward | Discount | Scope | Minimum spend |
| --- | --- | --- | --- |
| $50 off Pokémon | Fixed $50 | Filter · worlds = Pokémon | — |
| 10% off sealed, up to $200 | 10%, maximum discount $200 | Filter · types = sealed | — |
| $30 off a booster box | Fixed $30 | The variant it names | — |
| $50 off any order | Fixed $50 | The whole order | — |
| A free booster pack | 100% | The variant it names | — |
| A free booster pack over $500 | A free line, the pack's own variant | — | $500 |

A free item a member claims is a product coupon at 100%; a gift is a line
added on top of a purchase.

## Ways to Get a Reward

| Way | When | Cost |
| --- | --- | --- |
| Reward shop | A member buys it | Points, the reward's cost |
| Birthday `TBC` | Once a year, on the birthday the member's profile holds | None |
| Registration `TBC` | Once, when the account is created | None |
| Operator gift `TBC` | An operator hands one out, for a campaign or as goodwill | None |

Every reward is bought with points; the other three ways wait to be
confirmed.

## Reward Shop

What a member can buy right now: in stock, inside its window, not archived.
Stock reads as a yes or no, never a count.

- **One debit** — a single debit of the balance, oldest points first
- **All or nothing** — a balance short of the cost is refused whole, never
  part paid
- **Priced when taken** — the cost is copied onto the redemption, so
  repricing the catalog never rewrites what an earlier redemption cost
- **Nothing is held** — points are spent at the moment of taking, not
  reserved
- **What the coupon needs, before the points go** — a coupon is money off
  somewhere, not money, so the menu states the basket it has to reach and the
  one channel it is good at where it names only one. A member who reads that
  after the redemption is holding something no cart of theirs will take

:::example{title="Buying from the shop"}
| Step | Event | Points | Balance |
| --- | --- | --- | --- |
| Holds | 700 points already earned |  | 700 |
| Buys | a 500-point reward | −500 | 200 |
| Buys | a 300-point reward, refused — 200 is short | 0 | 200 |

The second buy takes nothing; the balance stays at 200.
:::

::story{id="loyalty-membership-rewardmenu--default" title="The reward shop"}

## Using a Reward

A money-off or gift reward becomes a coupon the moment it is bought,
carrying the definition it was bought under.

- **Made instantly** — the coupon is idle in the member's own list the
  instant the points are spent
- **Applied online** — on the store's own checkout page, before Shopify's
  checkout. The cut reaches the order as the coupon's own Shopify
  discount code, minted for that basket, rather than welded onto the draft's
  lines
- **Applied at the counter** — inside the till session, staff apply the
  coupon from the member's panel, or the member opens it on their own phone
  and the till scans it; either way its code is minted the moment it is
  chosen, for that sale alone, and never shown as the coupon itself
- **Used by the paid order** — the paid order is what marks the coupon
  used, never a vendor's lagging count
- **One discount at a time** — an order carries one discount at a time,
  and a reward is in that count, so a free item and a money-off coupon are
  two sales
- **A refund does not give the coupon back** — a refunded sale returns the
  goods, the money and any points spent as a discount on it; a coupon it
  already used stays used, and the points that bought it stay spent

States, holding and refusals are on
[Coupons](/p/grade10-site/loyalty/coupons).

A physical reward is an ordinary sale — staff ring the item up, its coupon
takes 100% off it, and the order goes through at nothing. ❓ Online, that order
is HKD 0 plus shipping — whether it ships free or is collection only is
Product's call.

❓ **A redeemed item stays off the shelf** — stock comes off at the redemption,
so a coupon that expires unspent never puts it back. Either reward stock is a
budget rather than a shelf count, or an operator restores the unit by hand.

## Reward Catalog

Every reward the programme knows, on sale or not. The catalog defines what
a reward is; the [Reward Shop](#reward-shop) is the part of it a member
can buy.

| Field | Meaning |
| --- | --- |
| Slug and name | The id it is referred to by, and what the member reads |
| Cost | Points per redemption, copied onto the redemption when it is made |
| Definition | Its kind, discount, scope and what it combines with, copied onto the redemption too, so redefining a reward never rewrites one already taken |
| Stock | Optional; a stocked reward is never oversold |
| Window | Optional; outside it the reward cannot be redeemed |
| Archived | Retired, still readable in the member's own history |

- **How it is obtained** `TBC` — bought, or given on a birthday or at an
  event; no field carries this, so every live reward is on sale
- **Units per redemption** `TBC` — a reward is taken one at a time until
  the per-redemption and per-day bounds are chosen
- ❓ **The physical catalog** — which items, and their point prices; Product's
  call
- **A reward's combine setting** is carried onto the coupon a redemption
  issues, and onto the code that carries it to the shop

## Cancelling a Redemption

> Backend generic feature support, no UX is planned to support it

A reversal takes back a coupon the member still holds and returns the
points that bought it — both move together, or the member ends up holding
one and not the other. It is an operator's move, never a member's.

- **Unused reverses** — the coupon is voided, and every point lot comes
  back on its own original date, so a reversal never lengthens the life of
  points
- **Used does not** — a used coupon stays used; cancelling or refunding the
  order that carried it changes nothing, and the points stay spent
- **A physical reward, the same way** — waiting for collection cancels like
  an unused coupon voids; already collected stays given, like a used one
- **Held for an order does not** — it is attached to an order being paid,
  and waits for that order to settle either way
- **A lapsed balance does not** — there is nothing left to return into
- **Tier is untouched** — a redemption never touched tier progress, so
  reversing one leaves it exactly where it was

Where a reversal is refused and the member is still owed something, an
operator gives rather than takes back:

- **Grant the reward again** — where the member never got what they paid
  for
- **Grant points instead** — where the reward no longer suits them

:::example{title="Reversing a redemption"}
| Step | Event | Points | Balance |
| --- | --- | --- | --- |
| Holds | 500 points |  | 500 |
| Buys | a 500-point reward | −500 | 0 |
| Reverses | the operator voids the coupon | +500 | 500 |
:::

Points paid against a bill are returned by their own rules —
[Paying with Points](/p/grade10-site/loyalty/paying-with-points).

:::detail{title="Code map" for="engineer"}
- **Rewards service** — `packages/loyalty/backend/src/services/rewards`,
  behind the `RewardFulfiller` port the app assembly plugs in
- **Design record** —
  [loyalty architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/loyalty.md)
:::
