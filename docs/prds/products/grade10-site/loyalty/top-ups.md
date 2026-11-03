---
title: Top-ups
order: 11
---

::phase{id="pre-store-launch" priority="P0"}

## Packs

A member buys points in packs an operator sets.

| Rule | Value |
| --- | --- |
| Currency | **HKD** |
| Pack | **Points and a price**, both set by an operator |
| Discount | **What the price saves on the points' value**, shown beside the pack — 10,000 points at $9,500 reads 5% off |
| Paid by | **Card, on Stripe's checkout** — Apple Pay and Google Pay pay by card; no coupon, gift card, promotion code or points pays for a pack |
| Price fixed | **When checkout opens** — a later edit to the pack changes no pack already bought |

- **Warned, not refused** — the console warns an operator saving a pack
  priced more than 20% below its points' value, priced above it, or holding
  more than 100,000 points; the pack saves as set

## Buying a Pack

- **Chosen** — on the site, from the packs on sale, and paid on Stripe's
  checkout
- **Credited** — as soon as payment clears, into the balance; earned points
  still wait for their order to complete
- **Checkout** — open for 35 minutes; one left unpaid credits nothing
- **One at a time** — starting a checkout ends the member's open one first
- **Came back without paying** — the checkout ends at once
- **Receipt** — Stripe's own receipt email, to the address the member is
  signed in with, confirms the top-up; the pack's entry in the member's
  points history opens it
**Picked over Membership** — the Top-up Points button opens the pack
  picker over the Membership page, and the member comes back to that page
**A wait that cannot be dismissed** — while the payment is confirmed, a
  dialog on a wide viewport, a drawer on a narrow one
**The outcome is a toast on Membership** — points added names the
  points and the new balance; payment not completed says nothing was
  charged, with Try again; a payment still unconfirmed after half a minute
  closes the wait and says the points will show in Points History
**Points History is the only record** — a credited pack's whole entry
  opens its receipt, a chargeback reads as a negative line, and a checkout left
  unpaid writes no entry; there is no top-up history page
- **Account deleted** — an open checkout closes with nothing charged; a
  payment that lands after is flagged for an operator to refund
- **Told before paying** — checkout says a pack is never refunded, cashed
  out or moved, and the member accepts the terms on Stripe's checkout page
  before paying
- ❓ **Where the terms are accepted** — the wireframe shows no accept step
  before Stripe, so whether Stripe's page alone carries it is open. Product
  and Legal
- ❓ **The words** — a draft until Legal confirms them. Legal

| Refusal | Meaning |
| --- | --- |
| Top-ups off | An operator has not switched them on, or card payment is not set up |
| Paused | This member's top-ups are paused; why is the operators' to read |
| Off sale | The pack is no longer on sale |
| Over today's cap | The pack would pass today's top-up cap; the member reads what is left today |
| Not opened | Stripe would not open a checkout; nothing was charged |

❓ the wireframe's refused pack only says it is over today's limit; whether it also names the remaining allowance is open (Product, Designer)

:::example{title="A pack bought"}
| Step | Event | Points | Balance | Progress |
| --- | --- | --- | --- | --- |
| Holds | 200 points earned on purchases | | 200 | 200 |
| Buys | a 1,000-point pack for $950, by card | | 200 | |
| Credited | payment clears | +1000 | 1200 | 200 |

The card pays $950 for points that pay $1,000 at checkout. Tier progress
stays at 200.
:::

## Limits

An operator sets one limit, counted in points, $1 each at the spend rate,
never the price paid.

| Limit | Counts | Past it |
| --- | --- | --- |
| Daily top-up cap | Points a member has paid for in a Hong Kong day, by the day the checkout opened. A checkout not yet paid counts nothing | The pack is refused, saying what is left today |

- **Fraud** — Stripe's own fraud screening checks every card payment; no pack
  waits for an operator
- ❓ **Heavy top-ups** — a member who reaches the daily cap, or is refused by
  it, raises an alert, once per member per day, for an operator to review
  whether their top-ups look abnormal; the alert blocks nothing. Product
  confirms what counts as heavy

## Bought Points

A pack's points join the one balance.

- **One balance** — once credited, bought points are points like any other;
  nothing spends them in an order of their own
- **Spent like any point** — 1 point pays $1 at checkout, and buys rewards
  too — [Paying with Points](/p/grade10-site/loyalty/paying-with-points)
- **No tier progress** — never toward reaching or keeping a tier —
  [Tiers](/p/grade10-site/loyalty/tiers#tier-progress)
- **No points earned** — a pack earns nothing, and a bill earns only on the
  part paid in money
- **In the activity** — a pack reads as points bought
- **Lapse with the balance** — on its one inactivity date; a pack counts as
  activity and moves the date out, as a purchase does —
  [Points](/p/grade10-site/loyalty/points#expiry)
- **Account deleted** — bought points end with the rest of the balance

## No Refunds

A top-up is never refunded, cashed out or moved to another member.

- **Chargeback** — takes the disputed share of the pack's points back from
  the balance; a chargeback of half the price takes half
- **Short** — what the balance cannot cover is counted short and flagged; an
  operator recovers it later from the member's points, never past what the
  member holds — [Operator Console](#operator-console)
- **Paused** — the first chargeback or Stripe fraud warning pauses the
  member's top-ups until an operator resumes them
- **Dispute won** — every point it took goes back, those an operator
  recovered included; a dispute lost moves nothing more
- **Refund in Stripe's dashboard** — takes the refunded share of the points
  back, as a chargeback does
- **No transfer** — nothing moves points from one member to another

:::example{title="Charged back after part was spent"}
| Step | Event | Points | Balance |
| --- | --- | --- | --- |
| Holds | 300 earned points | | 300 |
| Credited | a 1,000-point pack, $950 by card | +1000 | 1300 |
| Debits | 800 points paid at checkout | −800 | 500 |
| Earns | a later order, $2,000 at 1× | +200 | 700 |
| Charged back | the pack's $950 · 1,000 points owed, 700 held | −700 | 0 |

The chargeback takes what the balance holds and pauses the member's top-ups.
The other 300 are counted short and flagged; an operator recovers them from
points the member holds later.
:::

:::example{title="Half the price disputed"}
| Step | Event | Points | Balance |
| --- | --- | --- | --- |
| Holds | 1,000 bought points, none spent | | 1000 |
| Charged back | $475 of the pack's $950 | −500 | 500 |
| Won | the dispute closes in Grade10's favour | +500 | 1000 |

A dispute lost moves nothing more.
:::

## Returns

Returned points go back to the balance —
[Paying with Points](/p/grade10-site/loyalty/paying-with-points#refunds).

- **Whole goods, or nothing** — a return of every good gives every point
  back; a part return gives none back
- **A part return by hand** — an operator decides each case, and returns
  points from the console where they are owed —
  [Operator Console](/p/grade10-site/loyalty/operator-console#moving-points)
- **After a chargeback** — points a return gives back stay in the balance;
  the chargeback's shortfall stays for an operator to recover

## Operator Console

Top-ups start switched off; an operator turns them on and runs them from the
console.

- **Switching on** — refused while the daily top-up cap is unset
- ❓ **Launch** — top-ups stay off until Stripe is set up and Legal
  confirms the words checkout shows. Product and Legal
- **Packs** — their points, price and order, and whether each is on sale
- **Limit** — the daily top-up cap
- **Pause and resume** — an operator can pause a member's top-ups by hand,
  and only an operator resumes them
- **Flags** — heavy top-ups, chargebacks, fraud warnings, refunds made in
  Stripe's dashboard, shortfalls, payments on a closed top-up or a deleted
  account, and a charge for a different amount; an operator clears each
- **Recover** — a top-up's shortfall comes out of the member's points,
  never more than they hold
- **Permissions** — packs and the cap need `loyalty:finance`; pausing,
  resuming, flags, recovering and deductions need `loyalty:adjust`

:::detail{title="Code map" for="engineer"}
- **Design record** — [loyalty architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/loyalty.md#bought-points)
- **Stripe** — [deployment](https://github.com/9gag/grade10/blob/main/docs/deployment.md#stripe-for-points-packs)
- **Runbook** — [running point top-ups](https://github.com/9gag/grade10/blob/main/docs/operations.md#running-point-top-ups)
:::

:::detail{title="Product decisions" for="pm"}
A member who pays with points can buy more of them as a pack, at a discount,
and Grade10 has the money before the goods are chosen. A pack is also a way to
move money, so it carries a daily cap and no refund. Measured by top-up
revenue, the share of points paid at checkout that were bought, and the
chargeback rate on top-ups.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| One balance | Decided | Bought points join the one balance, with no pool or spend order of their own; a chargeback takes from the balance. | Product |
| Price | Decided | An operator sets a pack's points and price; the discount is read from them. | Product |
| Ceilings | Decided | None; the console warns past 20% off, above the points' value, and past 100,000 points. | Product |
| Daily top-up cap | Decided | Counts paid top-ups only. One checkout at a time, so checkouts opened side by side cannot pass it. | Product |
| Review | Decided | None; Stripe's fraud screening and the daily cap stand in for it. | Product |
| Spend cap | Decided | None for now. | Product |
| Heavy top-ups | ❓ Open | Shipped: an alert when a member reaches the daily cap or is refused by it, once a day. | Product |
| Receipt | Decided | Stripe's receipt email confirms a top-up; Grade10 sends none of its own. | Product |
| Payment methods | ❓ Open | Shipped: card only, Apple Pay and Google Pay included; FPS, Alipay HK and WeChat Pay are not offered. | Product |
| Pause | ❓ Open | Shipped: the first chargeback or fraud warning pauses top-ups until an operator resumes them. | Product |
| Refund in Stripe's dashboard | ❓ Open | Shipped: takes back the refunded share of the points, as a chargeback does. | Product |
| Launch | ❓ Open | Shipped off; switched on once Stripe is set up and Legal confirms the words. | Product and Legal |
| Where a pack is bought | Decided | From a Top-up Points button beside Member pass, the outcome a toast on Membership, so the rail stays navigation and the member never looks for a separate top-up page. | Design |
| Still confirming | Decided | A payment unconfirmed after half a minute closes the wait with a toast saying the points will show in Points History, instead of a wait the member cannot leave until Stripe answers. | Design |
| Receipt from history | Decided | The whole entry of a credited pack opens Stripe's receipt in a new tab, instead of a View receipt link on the entry. | Design |
| Unpaid top-up | Decided | A checkout left unpaid writes no ledger entry: nothing was charged and no points moved, so there is nothing for the member to read. | Product |
| Part returns | Decided | A part return gives no points back; an operator handles each case by hand. | Product |
| Told before paying | ❓ Open | Checkout states no refund, no cash-out and no transfer, and the member accepts the terms: the proof a disputed charge is fought with. | Product |
| The words | ❓ Open | What checkout says, a draft until confirmed. | Legal |
| Paid value lapsing | Decided | Bought points lapse with the balance, and end with it when an account is deleted. | Product |
| Stored value licence | Decided | Grade10 qualifies for the single-issuer exemption under the Payment Systems and Stored Value Facilities Ordinance (Cap. 584). | Legal |
| Gift cards | ❓ Open | Whether bought points may pay on a sale holding a gift card. | Product |
| Many accounts, one card | ❓ Open | Whether a card's top-ups are capped across the accounts it pays for. | Product |

| Risk | Control |
| --- | --- |
| A stolen card buys points and spends them, then the cardholder charges back | Stripe's fraud screening; the daily cap; the chargeback takes back its share and pauses top-ups; an operator recovers the rest |
| Many top-ups a day to move money through the shop | The daily top-up cap per member, one checkout at a time; heavy top-ups alerted |
| Top up, buy goods, return them for a card refund (套現) | A whole return gives points back as points and money to the card; a part return gives none back unless an operator decides; a top-up itself is never refunded |
| Top up, pay for a gift card with points, sell the card | Points pay qualifying goods only, but the shop spreads a points discount over a gift card on the same sale — [Discounts](/p/grade10-site/store/discounts); open above |
| Value moved to another member | No transfer exists |
| A balance cashed out | No path pays points out |
| Discounts bought at scale | The daily top-up cap; the console warns past 20% off |
| Many accounts, one card | Each account's cap counts alone; open above |
:::
