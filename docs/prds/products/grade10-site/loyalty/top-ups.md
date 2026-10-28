---
title: Top-ups
order: 11
---

## Packs

A member buys points in packs an operator sets.

| Rule | Value |
| --- | --- |
| Currency | **HKD** |
| Pack | **Points and a discount**, both set by an operator |
| Price | **The points less the discount** — 10,000 points at 5% off costs **$9,500** |
| Discount ceiling | **20%**, set by deploy |
| Largest pack | **100,000 points**, set by deploy |
| Paid by | **Card, on Stripe's checkout** — Apple Pay and Google Pay pay by card; no coupon, gift card, promotion code or points pays for a pack |
| Price fixed | **When checkout opens** — a later edit to the pack or its discount changes no pack already bought |

- **Past a lowered ceiling** — a pack leaves sale until an operator reprices
  it

## Buying a Pack

- **Chosen** — on the site, from the packs on sale, and paid on Stripe's
  checkout
- **Credited** — as soon as payment clears, into the top-up pool; earned
  points still wait for their order to complete
- **Held** — a pack above the review threshold waits for an operator before
  its points arrive — [Limits](#limits)
- **Checkout** — open for 35 minutes; one left unpaid credits nothing
- **Came back without paying** — the checkout ends at once, and its share of
  the day is free again
- **Receipt** — Stripe's own email, to the address the member is signed in
  with; the member's points history links it on the entry
- **Account deleted** — an open checkout or a held pack closes with nothing
  charged; a payment that lands after is flagged for an operator to refund
- **Told before paying** — checkout says a pack is never refunded, cashed
  out or moved, and the member accepts the terms before paying
  ❓ the wireframe shows no accept step before Stripe, so whether Stripe's page carries the acceptance is open (Product, Legal)
- ❓ **The words** — a draft until Legal confirms them. Legal
- ❓ **A Grade10 email** — on credit, hold, approval and rejection; it waits
  on a way to reach members, chosen with the
  [Expiry Reminders](/p/grade10-site/loyalty/expiry-reminders) channel.
  Product

| Refusal | Meaning |
| --- | --- |
| Top-ups off | An operator has not switched them on, or card payment is not set up |
| Paused | This member's top-ups are paused; why is the operators' to read |
| Off sale | The pack is no longer on sale |
| Over today's cap | The pack would pass today's top-up cap; the member reads what is left today |

❓ the wireframe's refused pack only says it is over today's limit; whether it also names the remaining allowance is open (Product, Designer)
| Not opened | Stripe would not open a checkout; nothing was charged |

:::example{title="A pack bought"}
| Step | Event | Points | Balance | Progress |
| --- | --- | --- | --- | --- |
| Holds | 200 points earned on purchases | | 200 | 200 |
| Buys | a 1,000-point pack at 5% off, $950 by card | | 200 | |
| Credited | payment clears · top-up pool | +1000 | 1200 | 200 |

The card pays $950 for points that pay $1,000 at checkout. Tier progress
stays at 200.
:::

## Limits

Each limit is set by an operator and counted in points, $1 each at the spend
rate, never the price paid.

| Limit | Counts | Past it |
| --- | --- | --- |
| Daily top-up cap | Points a member buys in a Hong Kong day, by the day the checkout opened: every top-up open, held or credited. A checkout holds its share until it is paid or ends | The pack is refused, saying what is left today |
| Review threshold | One top-up's points, strictly above it | Held: the card is authorised at checkout and charged only when an operator approves; a rejected top-up is never charged, and an authorisation lapses after about 7 days |
| Daily spend cap | Points a member spends in a Hong Kong day, both pools together: at checkout and on rewards | A bigger ask is trimmed or refused; a bill the shop already discounted is taken whole |

- **Flagged** — each cap reached is flagged for operators, once per member
  per day, and a bill that passes the spend cap once more
- ❓ **"Flag multiple limit"** — the owner's words, read as several limits,
  each set by an operator and each flagged when reached; a spend cap per pool
  would be one more setting. Product confirms the reading

## Topped-up Points

Topped-up points sit in a pool of their own inside the one balance.

- **Spent like earned points** — 1 point pays $1 at checkout, and topped-up
  points buy rewards too —
  [Paying with Points](/p/grade10-site/loyalty/paying-with-points)
- ❓ **Earned points first** — a bill or a reward takes earned points first,
  then topped-up ones, oldest first inside each. Product confirms the order
- **No tier progress** — never toward reaching or keeping a tier —
  [Tiers](/p/grade10-site/loyalty/tiers#tier-progress)
- **No points earned** — a pack earns nothing, and a bill earns only on the
  part paid in money
- **Shown apart** — the balance and the history show earned and topped-up
  points apart
- **Lapse with the balance** — on its one inactivity date; a pack counts as
  activity and moves the date out, as a purchase does —
  [Points](/p/grade10-site/loyalty/points#expiry)
- **Account deleted** — topped-up points end with the rest of the balance

:::example{title="Paid with both pools" tier="Silver"}
- Booster box $1,000

| Step | Event | Points | Balance |
| --- | --- | --- | --- |
| Checkout | 500 points asked for · holds 200 earned, 1,000 topped-up | | 1200 |
| Debits | order paid · 200 earned first, then 300 topped-up | −500 | 700 |
| Earns | order completes · the $500 paid by card, 50 pts × 1 | +50 | 750 |

The 700 left are all topped-up, and the 50 new points start the earned pool
again. The $500 paid in points earns nothing.
:::

## No Refunds

A top-up is never refunded, cashed out or moved to another member.

- **Chargeback** — takes back the disputed share of the pack's points, from
  those the pack still holds; a chargeback of half the price takes half
- **Short** — points already spent are counted short and flagged; an
  operator recovers them from the member's other points, bought first, never
  past what the member holds — [Operator Console](#operator-console)
- **Brought back by a return** — points a return gives back to a
  charged-back pack are taken back at once
- **Paused** — the first chargeback or Stripe fraud warning pauses the
  member's top-ups until an operator resumes them
- **Dispute won** — every point it took goes back, those an operator
  recovered included; a dispute lost moves nothing more
- **Refund in Stripe's dashboard** — the refunded share of the points comes
  back with the money
- **No transfer** — only a paid top-up fills the top-up pool; an operator
  credit always lands in the earned pool

:::example{title="Charged back after part was spent"}
| Step | Event | Points | Balance |
| --- | --- | --- | --- |
| Holds | 300 earned points | | 300 |
| Credited | a 1,000-point pack, $950 by card · top-up pool | +1000 | 1300 |
| Debits | 800 points paid at checkout · 300 earned, then 500 topped-up | −800 | 500 |
| Earns | a later order, $2,000 at 1× | +200 | 700 |
| Charged back | the pack's $950 · the 500 topped-up points still held | −500 | 200 |
| Recovers | an operator, toward the 500 short · earned pool | −200 | 0 |

The chargeback takes back only what the pack still holds, and pauses the
member's top-ups. The 500 already spent are counted short and flagged;
recovering never takes more than the member holds, so 300 stay short.
:::

:::example{title="A return after a chargeback"}
| Step | Event | Points | Balance |
| --- | --- | --- | --- |
| Credited | a 1,000-point pack, $950 by card · top-up pool | +1000 | 1000 |
| Debits | 400 points paid at checkout | −400 | 600 |
| Charged back | the pack's $950 · the 600 still held | −600 | 0 |
| Returned | the order the 400 paid for · back to the top-up pool | +400 | 400 |
| Taken back | the 400 the chargeback was short | −400 | 0 |

The return closes the shortfall with the pack's own points, and nothing is
left to recover.
:::

:::example{title="Half the price disputed"}
| Step | Event | Points | Balance |
| --- | --- | --- | --- |
| Holds | 1,000 topped-up points, none spent | | 1000 |
| Charged back | $475 of the pack's $950 | −500 | 500 |
| Won | the dispute closes in Grade10's favour · top-up pool | +500 | 1000 |

A dispute lost moves nothing more.
:::

## Returns

Returned points go back to the pool they were paid from —
[Paying with Points](/p/grade10-site/loyalty/paying-with-points#refunds).

- **Whole goods, or nothing** — a return of every good gives every point
  back; a part return gives none back
- **A part return by hand** — an operator decides each case, and returns
  points from the console where they are owed —
  [Operator Console](/p/grade10-site/loyalty/operator-console#moving-points)

## Operator Console

Top-ups start switched off; an operator turns them on and runs them from the
console.

- **Switching on** — refused while the daily top-up cap or the review
  threshold is unset
- ❓ **Launch** — top-ups stay off until Stripe is set up and Legal
  confirms the words checkout shows. Product and Legal
- **Packs** — their points, discount and order, and whether each is on sale
- **Limits** — the daily top-up cap, the review threshold and the daily spend
  cap
- **Review queue** — approving a held top-up charges the card and credits the
  points; rejecting it cancels the authorisation, with nothing charged
- **Pause and resume** — an operator can pause a member's top-ups by hand,
  and only an operator resumes them
- **Flags** — limits reached, chargebacks, fraud warnings, refunds made in
  Stripe's dashboard, shortfalls, payments on a closed top-up or a deleted
  account, and a charge for a different amount; an operator clears each
- **Recover** — a top-up's shortfall comes out of the member's other points,
  bought first, then earned, never more than they hold
- **What is owed** — the liability figure shows topped-up points still held
  apart from earned ones
- **Permissions** — packs, limits and review need `loyalty:finance`;
  pausing, resuming, flags, recovering and deductions need `loyalty:adjust`

:::detail{title="Code map" for="engineer"}
- **Design record** — [loyalty architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/loyalty.md#bought-points-sit-in-a-pool-of-their-own)
- **Ceilings** — `GRADE10_LOYALTY_PROGRAM.topUps` in `packages/app-env`
- **Stripe** — [deployment](https://github.com/9gag/grade10/blob/main/docs/deployment.md#stripe-for-points-packs)
- **Runbook** — [running point top-ups](https://github.com/9gag/grade10/blob/main/docs/operations.md#running-point-top-ups)
:::

:::detail{title="Product decisions" for="pm"}
A member who pays with points can buy more of them as a pack, at a discount,
and Grade10 has the money before the goods are chosen. A pack is also a way to
move money, so it carries limits, a review and no refund. Measured by top-up
revenue, the share of points paid at checkout that were topped up, and the
chargeback rate on top-ups.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Two pools | Decided | One balance, earned and topped-up points kept apart on the same ledger, so a chargeback and the liability can tell them apart. | Engineering |
| Spend order | ❓ Open | Shipped: earned first, so a chargeback finds more of a pack unspent. The cost: after an account takeover the member's own earned points go first. | Product |
| Daily top-up cap | ❓ Open | Shipped: every checkout counts until it is paid or ends, so checkouts opened side by side cannot pass the cap. The cost: an abandoned checkout holds its share up to 35 minutes, unless the member comes back from it. | Product |
| Spend cap | ❓ Open | Shipped: one cap over both pools, counting points on rewards with points paid at checkout. | Product |
| Review | ❓ Open | Shipped: per pack, strictly above the threshold, as the owner's words say. Packs bought one under the line reach the daily cap unreviewed. | Product |
| Ceilings | ❓ Open | Shipped: 20% off and 100,000 points a pack, set by deploy. | Product |
| Payment methods | ❓ Open | Shipped: card only, Apple Pay and Google Pay included; FPS, Alipay HK and WeChat Pay would need a path with no review. | Product |
| Pause | ❓ Open | Shipped: the first chargeback or fraud warning pauses top-ups until an operator resumes them. | Product |
| Refund in Stripe's dashboard | ❓ Open | Shipped: takes back the refunded share of the points, as a chargeback does. | Product |
| Launch | ❓ Open | Shipped off; switched on once Stripe is set up and Legal confirms the words. | Product and Legal |
| Part returns | Decided | A part return gives no points back; an operator handles each case by hand. | Product |
| Told before paying | ❓ Open | Checkout states no refund, no cash-out and no transfer, and the member accepts the terms: the proof a disputed charge is fought with. | Product |
| The words | ❓ Open | What checkout says, a draft until confirmed. | Legal |
| Paid value lapsing | Decided | Topped-up points lapse with the balance, and end with it when an account is deleted. | Product |
| Stored value licence | Decided | Grade10 qualifies for the single-issuer exemption under the Payment Systems and Stored Value Facilities Ordinance (Cap. 584). | Legal |
| Grade10 email | ❓ Open | An email on credit, hold, approval and rejection needs a way to reach members, chosen with the Expiry Reminders channel. | Product |
| "Flag multiple limit" | ❓ Open | Read as several limits, each set by an operator and each flagged when reached. | Product |
| Gift cards | ❓ Open | Whether topped-up points may pay on a sale holding a gift card. | Product |
| Many accounts, one card | ❓ Open | Whether a card's top-ups are capped across the accounts it pays for. | Product |

| Risk | Control |
| --- | --- |
| A stolen card buys points and spends them, then the cardholder charges back | Review above the threshold; earned points spent first; the chargeback takes back its share and pauses top-ups; an operator recovers the rest |
| Many top-ups a day to move money through the shop | The daily top-up cap per member, counting every checkout not yet closed |
| Top up, buy goods, return them for a card refund (套現) | A whole return gives points back as points and money to the card; a part return gives none back unless an operator decides; a top-up itself is never refunded |
| Top up, pay for a gift card with points, sell the card | Points pay qualifying goods only, but the shop spreads a points discount over a gift card on the same sale — [Discounts](/p/grade10-site/store/discounts); open above |
| Value moved to another member | No transfer exists; an operator credit lands in the earned pool |
| A balance cashed out | No path pays points out |
| Discounts bought at scale | The deploy-set ceilings, and the daily spend cap |
| Many accounts, one card | Each account's cap counts alone; open above |
:::
