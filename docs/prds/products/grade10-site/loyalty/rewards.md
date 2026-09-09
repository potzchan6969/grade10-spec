---
title: Rewards
spec: grade10-site/loyalty/programme
order: 3
---

## Reward Types

Three kinds, and no two share a shape. A reward is a product coupon or a gift.
The third kind, an order coupon, is the store's own code and a reward never
defines one.

All three state a **title**, the **currency** they are priced in, and a
**threshold** — the goods a basket must hold before the reward applies, read
from the lines themselves and never from a total handed in beside them.

### Order coupon

A fixed amount off the whole order, riding no line and capped by the goods it
may come off.

- **Takes off** — a fixed amount, never a share
- **Applies to** — the whole order, or products and variants named outright;
  never a filter, because the shop scopes its own codes and knows nothing of
  the catalog's worlds and types
- **Reaches goods with no variant** — a counter's custom sale, a repair, a
  price override — where it applies to the whole order

An operator mints these as store promotions, not as rewards —
[Discounts](/p/grade10-site/store/discounts).

### Product coupon

Money off the lines it applies to, and the only kind that takes a share rather
than an amount.

- **Takes off** — a fixed amount, or a percentage with an optional ceiling on
  the whole cut
- **Applies to** — **products** or **variants** named outright, a **filter**
  over the catalog's worlds and types, or the whole order
- **Refused** where no line in the basket matches

| Reward | Takes off | Applies to |
| --- | --- | --- |
| $50 off Pokémon | Fixed $50 | Filter · worlds = Pokémon |
| 10% off sealed, up to $200 | 10%, ceiling $200 | Filter · types = sealed |
| $30 off a booster box | Fixed $30 | The variant it names |
| A free booster pack | 100% | The variant it names |

A free item is the last row: 100% off the one variant. It stands on its own,
so the basket needs nothing in it but the item itself.

### Gift

A free line the coupon adds to the order, rather than money off a line already
in it. Spend this much, take this away too.

- **The variant it names** is the whole definition — it says nothing about
  what it takes off or what it applies to
- **Always carries a threshold above zero**, so a gift rides on a purchase and
  never on an empty basket
- **Refused where the basket already holds that variant** — a gift is a line
  added, never a line paid for

| Reward | What is added |
| --- | --- |
| A free booster pack over $500 | The pack's own variant |

A free item a member simply claims is a product coupon at 100%, not a gift.

## Reward Catalog

Every reward the programme knows, on sale or not. The catalog defines what a
reward is; the [Reward Shop](#reward-shop) is the part of it a member can buy.

- **Slug and name** — the id it is referred to by, and what the member reads
- **Cost** — points per redemption, copied onto the redemption when it is made
- **Definition** — its kind, what it takes off and what it applies to, copied
  onto the redemption too, so redefining a reward never rewrites one already
  taken
- **Stock** — optional; a stocked reward is never oversold
- **Window** — optional; outside it the reward cannot be redeemed
- **Archived** — retired, still readable in the member's own history
- 🚧 **How it is obtained** — bought, or given on a birthday or at an event. No
  field carries this, so every live reward is on sale
- 🚧 **Units per redemption** — the programme declares no per-redemption or
  per-day bound, so a reward is taken one at a time

## Reward Shop

What a member can buy right now: in stock, inside its window, not archived.
Stock reads as a yes or no, never a count.

- **One debit** — a single debit of the balance, oldest points first
- **All or nothing** — a balance short of the cost is refused whole, never
  part paid
- **Priced when taken** — the cost is copied onto the redemption, so repricing
  the catalog never rewrites what an earlier redemption cost
- **Nothing is held** — points are spent at the moment of taking, not reserved

::story{id="loyalty-membership-rewardmenu--default" title="The reward shop"}

## Reward Inventory

What the member holds. A reward lands here the moment the points are spent,
carrying the definition it was bought under.

| State | Meaning |
| --- | --- |
| Idle | Held and spendable |
| Held for an order | Attached to an order being paid; freed again if that order is not paid |
| Used | A paid order carried it |
| Expired | Its own validity passed, unused |
| Cancelled | Reversed by an operator while unused, or voided when the account is closed |

- **One order at a time** — a reward is attached to one order, and a second
  attempt while one is live is refused
- **Used is decided by the paid order** that carried it, never by a vendor's
  lagging count
- **Expired stays spent** — bought but not used is the member's own, and the
  money is counted as breakage in the liability register

The member reads every reward in full, with what it takes off and when it
expires. Used, expired and cancelled ones stay on the list and say so.

## Reward Giveaways

A reward also reaches a member without points. A given reward costs nothing
and is otherwise the same reward: stock, window and archiving bind it the way
they bind a purchase.

- **Birthday** — once a year, on the birthday the member's profile holds
- **Registration** — once, when the account is created
- **Event** — an operator hands one out for a campaign or as goodwill

🚧 Nothing collects a birthday and no surface grants a reward, so every reward
is bought with points today.

## Fulfilment

Every reward is a coupon, so there is one path and nothing to wait for. The
coupon is made inside the redemption itself, no vendor is called, and it is
idle in the inventory the instant the points are spent. An order carries it —
at the checkout or at the till, online or in the shop — and that order is what
makes it used.

Collecting a physical reward is an ordinary sale. Staff ring the item up, the
member's coupon takes 100% off it, and the order goes through at nothing. The
sale is the handover and the paid order is what marks the coupon used, so
nothing parks, nothing is confirmed separately, and no deadline runs but the
coupon's own.

An order carries one discount at a time and a reward is in that count —
[Discounts](/p/grade10-site/store/discounts).

❓ **An uncollected item stays off the shelf** — a coupon that expires never
restocks. Either reward stock is a budget rather than a shelf count, or an
operator puts the unit back by hand.

## Putting a redemption right

A reversal takes back a coupon the member still holds and returns the points
that bought it. Both move together, or the member ends up holding one and not
the other. It is an operator's, never a member's.

- **An unused coupon reverses** — it is voided, and every point lot comes back
  on its own original date, so a reversal never lengthens the life of points
- **A used one does not** — used is used, and cancelling or refunding the
  order that carried it changes nothing. The points stay spent
- **One held for an order does not** — it is attached to an order being paid,
  and waits for that order to settle either way
- **A lapsed balance does not** — there is nothing left to return into

Where a reversal is refused and the member is still owed something, an
operator gives rather than takes back:

- **Grant the reward again** — where the member never got what they paid for
- **Grant points instead** — where the reward no longer suits them —
  [Points](/p/grade10-site/loyalty/points)

Points paid straight against a bill are the other instrument, and they come
back on their own terms —
[Paying with Points](/p/grade10-site/loyalty/paying-with-points).

:::callout{kind="warning"}
Decided here, and standing otherwise in the running programme:

- **Collection at the counter is built and goes away** — the shipped
  `collect_in_store` kind parks a redemption as awaiting collection with its
  own deadline, a till confirms the handover, and a nightly sweep expires a
  lapsed one and puts its unit back on the shelf. Making a physical reward a
  gift coupon retires all of it: the kind, the awaiting-collection, collected
  and expired states, the deadline, the till's confirm, the sweep and the
  member's list of things waiting
- **A waiting fulfilment can still park** — the drain backs off from a minute
  to an hour and parks a redemption after a permanent refusal or fifteen
  attempts. No fulfiller is plugged into the deployed programme, so nothing
  reaches those states, and the machinery stays for a reward the shop has to
  mint
- **The console's reward form** sets only slug, name, description, cost, stock
  and window, so a reward with a definition has to be created through the
  admin API
- **A reward's kind, and what it takes off and applies to,** are read by
  nothing yet; every
  reward takes a fixed amount off any order, in either channel
- **Specified only in flight** — the durable spec knows a reward as an
  entitlement with no delivery, so the inventory, the giveaways and the
  member's own view are carried by the `revise-loyalty-programme-rules` and
  `add-shopify-membership-pos` changes
:::

:::detail{title="Redeeming" for="engineer"}
The redemption snapshots the reward's cost, quantity, fulfilment kind and
template. Lock order is member row then reward row; stock decrements by a
guarded update that rolls the whole transaction back on zero rows. The three
built-in kinds settle inside that transaction — `manual` and `coupon` as
fulfilled, `collect_in_store` as awaiting collection — so only a kind behind
the `RewardFulfiller` port ever reaches the drain. A coupon reward mints one
instance per redemption and so may never be bought in a quantity.
:::

:::detail{title="Draining and metrics" for="engineer"}
The drain claims with `for update skip locked`, calls the vendor outside any
transaction, and completes with a single guarded update — a reversal landing
mid-attempt reads as zero rows, and the just-made artifact is deactivated. The
code is random, committed before the first vendor call, so a crash leaves a
code a retry can ask for again. Metrics: `loyalty.points.redeemed`,
`loyalty.fulfillment.*`, `loyalty.collection.completed` and `.expired`,
`loyalty.redemption.reversal_stuck`.
:::
