---
title: Rewards
spec: grade10-site/loyalty/programme
order: 3
---

## Reward Types

| Type | Discount | Scope | Minimum spend | Example |
| --- | --- | --- | --- | --- |
| Product coupon | A fixed amount, or a percentage with an optional maximum discount | Named products or variants, a filter over the catalog's worlds and types, or the whole order | Optional | $50 off Pokémon |
| Gift | A free line added to the order, the variant it names | — | Required, above zero, so a gift always rides on a purchase | A free booster pack over $500 |

**A gift is handed over at the till alone** - whatever channels a gift's
definition names, online refuses it as the wrong channel; the console locks
its channel to In store

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
  reward states none — [Discounts](/p/grade10-site/store/discounts#authoring-rules)

| Reward | Discount | Scope | Minimum spend |
| --- | --- | --- | --- |
| $50 off Pokémon | Fixed $50 | Filter · worlds = Pokémon | — |
| 10% off sealed, up to $200 | 10%, maximum discount $200 | Filter · types = sealed | — |
| $30 off a booster box | Fixed $30 | The variant it names | — |
| $50 off any order | Fixed $50 | The whole order | — |
| A free booster pack | 100% | The variant it names | — |
| A free booster pack over $500 | A free line, the pack's own variant | — | $500 |

**Online only by product or filter** - a till sale names its goods by
variant alone, so a coupon scoped to named products or a filter is online only

## Ways to Get a Reward

| Way | When | Cost |
| --- | --- | --- |
| Reward shop | A member buys it | Points, the reward's cost |
| Birthday `TBC` | Once a year, on the birthday the member's profile holds | None |
| Registration `TBC` | Once, when the account is created | None |
| Operator gift `TBC` | An operator hands one out, for a campaign or as goodwill | None |

## Reward Shop

What a member can buy right now: in stock, inside its window, not archived.
Stock reads as a yes or no, never a count.

- **One debit** - a single debit of the balance, oldest points first
- **All or nothing** - a balance short of the cost is refused whole, never
  part paid
- **Priced when taken** - the cost is copied onto the redemption, so
  repricing the catalog never rewrites what an earlier redemption cost
- **Nothing is held** - points are spent at the moment of taking, not reserved
- **What the coupon needs, before the points go** - the basket it has to
  reach, and the one channel it is good at where there is only one
- 🚧 **Online only on the menu** - a reward scoped to named products or a
  catalog filter reads online only, whatever channels it names
- 🚧 **A card per reward** - the shop draws the item's art or the coupon's
  gift tile, the deadline where one is named, and the price; a press opens
  the checkout
- 🚧 **One per press** - a redemption is always one unit; the menu offers
  no quantity
- 🚧 **The checkout is a surface, not a page** - a bottom sheet under
  640px, a dialog from it up; it restates the reward, names where the
  coupon is spendable and how long it is good for, and shows the balance
  before and after - a short balance names the deficit in the warning
  tone and refuses whole. On the dialog the actions sit right behind a
  Cancel; on the sheet the redeem spans the width. A refusal splits two
  ways: the reward being gone closes the surface, while a retryable
  refusal keeps it open and the press live — either is raised outside as
  a toast, and a balance dropped mid-checkout re-reads the deficit row
  the same way
- 🚧 **The redeemed state stays in the surface** - the ticket the
  redemption issued: every redemption mints a member-readable code —
  gift or discount alike — and the scan QR names that redemption.
  A discount coupon's ticket carries the code, a gift's names the
  collection in its place. A ticket
  spendable or collectable at the till carries a Use now control, and the
  member's scan QR opens as its own card apart from the ticket — a
  coupons grid lays the scan out where it fits without reshaping the
  ticket — on the surfaces a member can open there, the rewards
  page, the coupons page; the cart's select sheet carries none, and an
  online-only ticket carries none. A spent coupon's ticket mutes, names
  it used, and drops the scan control, and a spent coupon leaves the coupons
  section
- **The scan QR presents the member, naming the redemption** - the
  redemption's code is its fixed reference, read or typed, never the till
  credential; the QR is a short-lived, single-use presentation of the
  member card that names the redemption, renewed silently while shown, so
  a screenshot or a code read aloud cannot spend it
- **What the till reads** - one scan: it finds the member and puts the
  coupon on the sale, so staff never scan the member pass as well
- 🚧 **Apply belongs to the cart** - nothing on the shop, the redeemed
  ticket or the coupons page offers to apply a coupon; the cart's
  apply-rewards flow is the only place it happens
- ❓ **A settle that half-fails** - the points debit but the coupon never
  mints: whether the redemption settles atomically or a refund path
  catches it is Backend's call

:::example{title="Buying from the shop"}
| Step | Event | Points | Balance |
| --- | --- | --- | --- |
| Holds | 700 points already earned |  | 700 |
| Buys | a 500-point reward | −500 | 200 |
| Buys | a 300-point reward, refused — 200 is short | 0 | 200 |

The second buy takes nothing; the balance stays at 200.
:::

::story{id="loyalty-rewards-blocks-rewardmenu--default" title="The reward shop"}

## Using a Reward

A money-off or gift reward becomes a coupon the moment it is bought,
carrying the definition it was bought under.

- **Made instantly** — the coupon is idle in the member's own list the
  instant the points are spent
- **Applied online** — a product coupon, on the store's own checkout page, before Shopify's
  checkout. The cut reaches the order as the coupon's own Shopify
  discount code, minted for that basket, rather than welded onto the draft's
  lines
- 🚧 **The member reads a code of their own** — every redemption mints
  one member-readable code, unique to that redemption and bound to the
  member, and the scan QR names it; a gift's ticket shows the
  collection in its place, by display choice. The code is good online and at
  the till; the per-sale discount code a claim mints is a different code,
  unchanged
- **Applied at the counter** — for a scope the till can match, inside the
  till session: staff apply it from the member's panel, or the member opens
  it on their phone and the till scans it - before a sale, that one scan also
  identifies the member and opens the session; a product coupon's code is
  minted when applied, for that sale alone, and a gift
  goes on as its own line, discounted to nothing, with no code -
  [Reward Types](#reward-types)
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

Every reward the programme knows, on sale or not; the
[Reward Shop](#reward-shop) is the part of it a member can buy.

| Field | Meaning |
| --- | --- |
| Slug and name | The id it is referred to by, and what the member reads |
| Cost | Points per redemption, copied onto the redemption when it is made |
| Definition | Its kind, discount, scope and what it combines with, copied onto the redemption and the discount code that carries its coupon to the shop, so redefining a reward never rewrites one already taken - [Authoring a Reward](/p/grade10-site/loyalty/operator-console#authoring-a-reward) |
| Stock | Optional; a stocked reward is never oversold |
| Window | Optional; outside it the reward cannot be redeemed |
| Archived | Retired, still readable in the member's own history |

- **How it is obtained** `TBC` - no field carries it, so every live reward
  is on sale
- 🚧 **Units per redemption** - a redemption is always one unit; the
  member surface offers no quantity. Any per-day bound stays an operator
  rule the member never sees
- ❓ **The physical catalog** - which items, and their point prices; Product's
  call

## Cancelling a Redemption

> Backend generic feature support, no UX is planned to support it

A reversal takes back a coupon the member still holds and returns the
points that bought it — both move together, or the member ends up holding
one and not the other. It is an operator's move, never a member's.

- **Unused reverses** — the coupon is voided, and the points go back to the
  day the balance still runs to, even onto a balance brought to nothing, so a
  reversal never lengthens the life of points
- **Used does not** — a used coupon stays used; cancelling or refunding the
  order that carried it changes nothing, and the points stay spent
- **Claimed by a sale does not** — refused, naming that sale, until the
  sale gives the coupon back
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
