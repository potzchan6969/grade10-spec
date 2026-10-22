---
title: Top-ups
order: 4
---

## Packs

A member buys points in packs an operator sets.

| Rule | Value |
| --- | --- |
| Currency | **HKD** |
| Pack | **Points and a discount**, both set by an operator; the discount stays under a ceiling only a deploy changes |
| Price | **The points less the discount** — 10,000 points at 5% off costs **$9,500** |
| Paid by | **Card, on Stripe's checkout** — Apple Pay and Google Pay pay by card; no coupon, gift card, promotion code or points pays for a pack |
| Price fixed | **When checkout opens** — a later edit to the pack or its discount changes no pack already bought |

## Buying a Pack

- **Chosen** — on the site, from the packs on sale, and paid on Stripe's
  checkout
- **Credited** — as soon as payment clears, into the top-up pool; earned
  points still wait for their order to complete
- **Held** — a pack above the review threshold waits for an operator before
  its points arrive — [Limits](#limits)
- **Not paid** — a checkout left unpaid, replaced or failed credits nothing
- **One open checkout** — starting another expires the earlier one; a
  payment that still lands on it credits too, and is flagged
- **Receipt** — Stripe's own email, to the account email the member is
  signed in with; the member's top-up history links it
- ❓ **A Grade10 email** — on credit, hold, approval and rejection; it waits
  on a way to reach members, chosen with the
  [Expiry Reminders](/p/grade10-site/loyalty/expiry-reminders) channel.
  Product

| Refusal | Meaning |
| --- | --- |
| Top-ups off | An operator has not switched them on, or card payment is not set up |
| Paused | This member's top-ups are paused, by a chargeback, a fraud warning or an operator |
| Off sale | The pack is no longer on sale |
| Over today's cap | The pack would pass today's top-up cap; the member reads what is left today |

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
| Daily top-up cap | Points a member buys in a Hong Kong day, by the day the checkout opened: open, held and credited top-ups; an expired, failed or rejected one frees its share | The pack is refused, saying what is left today |
| Review threshold | One top-up's points, strictly above it | Held: the card is authorised at checkout and charged only when an operator approves; a rejected top-up is never charged, and an authorisation lapses after 7 days, expiring the top-up |
| Daily spend cap | Points a member pays at checkout in a Hong Kong day, both pools together; a reward bought with points does not count | A bigger ask is trimmed to what the day still allows; a debit that lands over it is taken whole, never cut short, and flagged |

- **Flagged** — a limit reached is flagged for operators, a cap once per
  member per day
- ❓ **"Flag multiple limit"** — the owner's words, read as several limits,
  each set by an operator and each flagged when reached; a spend cap per pool
  would be one more setting. Product confirms the reading

## Topped-up Points

Topped-up points sit in a pool of their own inside the one balance.

- **Spent like earned points** — 1 point pays $1 at checkout, and topped-up
  points buy rewards too —
  [Paying with Points](/p/grade10-site/loyalty/paying-with-points)
- **Earned points first** — a bill or a reward takes earned points first,
  then topped-up ones, oldest first inside each
- **No tier progress** — never toward reaching or keeping a tier —
  [Tiers](/p/grade10-site/loyalty/tiers#tier-progress)
- **No points earned** — a pack earns nothing, and a bill earns only on the
  part paid in money
- **Shown apart** — the balance and the history show earned and topped-up
  points apart
- **Lapse with the balance** — on its one inactivity date; a top-up counts as
  activity and moves the date out, as a purchase does —
  [Points](/p/grade10-site/loyalty/points#expiry)
- ❓ **Paid value lapsing** — whether topped-up points may lapse at all, and
  what deleting an account does to them. Legal and Finance

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

- **Chargeback** — takes back the points the top-up still holds, those
  returned to it included
- **Short** — what was already spent is counted short and flagged, and an
  operator deducts it by hand — [Operator Console](#operator-console)
- **Paused** — a chargeback or Stripe's early fraud warning pauses the
  member's top-ups until an operator resumes them
- **Dispute won** — the points it took go back to the top-up pool; a dispute
  lost moves nothing more
- **Refund in Stripe's dashboard** — takes back the refunded share of the
  points, as a chargeback does
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
| Deducts | an operator, toward the 500 short · earned pool | −200 | 0 |

The chargeback takes back only what the top-up still holds, and pauses the
member's top-ups. The 500 already spent are counted short and flagged; a
deduction never takes more than the pool holds, so 300 stay short.
:::

:::example{title="A dispute won"}
| Step | Event | Points | Balance |
| --- | --- | --- | --- |
| Holds | 1,000 topped-up points, none spent | | 1000 |
| Charged back | the pack's $950 disputed | −1000 | 0 |
| Won | the dispute closes in Grade10's favour · top-up pool | +1000 | 1000 |

A dispute lost moves nothing more.
:::

## Returns

Returned points go back to the pool they were paid from —
[Paying with Points](/p/grade10-site/loyalty/paying-with-points#refunds).

- **In the ratio paid** — a refund comes back in the bill's own split: on a
  bill paid 60% in points and 40% by card, 60% of each refund is points,
  split across the pools as the payment took them, and 40% goes to the card
- ❓ **When the ratio starts** — it replaces whole goods or nothing in the
  store's refunds, after the store's per-line settlement. Product

## Operator Console

Top-ups start switched off; an operator turns them on and runs them from the
console.

- **Packs** — their points, discount and order, and whether each is on sale
- **Limits** — the daily top-up cap, the review threshold and the daily spend
  cap
- **Review queue** — approving a held top-up charges the card and credits the
  points; rejecting it cancels the authorisation, with nothing charged
- **Pause and resume** — an operator can pause a member's top-ups by hand,
  and only an operator resumes them
- **Flags** — limits reached, chargebacks, fraud warnings, refunds made in
  Stripe's dashboard, shortfalls and late payments; an operator clears each
- **Deducting by pool** — a deduction names the pool it takes from, never
  more than that pool holds; a credit by hand lands in the earned pool —
  [Operator Console](/p/grade10-site/loyalty/operator-console#moving-points)
- **What is owed** — the liability figure shows topped-up points still held
  apart from earned ones
- **Permissions** — packs, limits and review need `loyalty:finance`; pausing,
  resuming, flags and deductions need `loyalty:adjust`

:::detail{title="Code map" for="engineer"}
- **Build plan** — [point top-ups plan](https://github.com/9gag/grade10/blob/main/docs/temp/point-top-ups-plan.md)
- **Design record** — [loyalty architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/loyalty.md)
:::

:::detail{title="Product decisions" for="pm"}
A member who pays with points can buy more of them as a pack, at a discount,
and Grade10 has the money before the goods are chosen. A pack is also a way to
move money, so it carries limits, a review and no refund. Measured by top-up
revenue, the share of points paid at checkout that were topped up, and the
chargeback rate on top-ups.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Packs and price | Decided | An operator sets each pack's points and discount; the price is the points less the discount, final when checkout opens. | Product |
| Paid by | Decided | Stripe alone; no coupon, gift card or points pays for a pack. | Product |
| Credit | Decided | When payment clears; earned points still arrive when their order completes. | Product |
| Held for review | Decided | A top-up above an operator-set amount waits for an operator before its points arrive. | Product |
| Daily limits | Decided | An operator-set cap on points bought a day, and a daily cap on points paid at checkout. | Product |
| Spending | Decided | 1 point pays $1, earned or topped-up; topped-up points never add tier progress. | Product |
| Earning | Decided | Points paid at checkout earn nothing; on a split bill only the money earns. | Product |
| No refunds | Decided | No refund, cash-out or transfer. A chargeback takes the top-up's points back, and an operator deducts the rest by hand. | Product |
| Returns | Decided | In the ratio paid, each point back to the pool it came from. | Product |
| Two pools | Decided | One balance, earned and topped-up points kept apart on the same ledger. | Engineering |
| Spend order | Decided | Earned first, then topped-up, oldest first inside each, so a chargeback finds more of a recent top-up unspent. | Engineering |
| Expiry | Decided | Topped-up points lapse with the balance on its one date, and a top-up counts as activity. | Engineering |
| Units and day | Decided | Limits count points, $1 each at the spend rate; the top-up cap counts on the Hong Kong day the checkout opened. | Engineering |
| Top-up cap | Decided | Counts top-ups opened, held or credited that day; an expired, failed or rejected one frees its share. | Engineering |
| Review threshold | Decided | Strictly above it. The card is authorised at checkout and charged only on approval, so a rejected top-up is never charged; an authorisation lapses after 7 days. | Engineering |
| Spend cap | Decided | One daily cap over both pools. A spend is trimmed to what the day allows, and a debit that lands over it is taken whole and flagged. Rewards do not count. | Engineering |
| One open checkout | Decided | Starting another expires the earlier one. | Engineering |
| Pause | Decided | A chargeback or an early fraud warning pauses a member's top-ups until an operator resumes them. | Engineering |
| Disputes | Decided | Opened takes back what the top-up still holds and flags the rest; won gives it back; lost moves nothing more. A refund in Stripe's dashboard takes back its share the same way. | Engineering |
| Credits by hand | Decided | Always to the earned pool, because only a paid top-up fills the top-up pool. | Engineering |
| Receipts | Decided | Stripe's own email, to the account email the member signs in with; the programme keeps the receipt link, never the address. | Engineering |
| Payment methods | Decided | Card only, Apple Pay and Google Pay included; no promotion codes. | Engineering |
| Switched off at first | Decided | Top-ups start off until an operator turns them on. | Engineering |
| Permissions | Decided | Packs, limits and review under `loyalty:finance`; pause, resume, flags and deductions under `loyalty:adjust`; reads under `loyalty:read`. | Engineering |
| Grade10 email | ❓ Open | An email on credit, hold, approval and rejection needs a way to reach members, chosen with the Expiry Reminders channel. | Product |
| Paid value lapsing | ❓ Open | Whether topped-up points may lapse on inactivity, and what deleting an account does to them. | Legal and Finance |
| Stored value licence | ❓ Open | The single-issuer exemption under the Payment Systems and Stored Value Facilities Ordinance (Cap. 584), confirmed before launch. | Legal |
| Returns in the ratio paid | ❓ Open | When the ratio rule replaces whole goods or nothing in the store's refunds; the store's per-line settlement comes first. | Product |
| "Flag multiple limit" | ❓ Open | Read as several limits, each set by an operator and each flagged when reached; a spend cap per pool would be one more setting. | Product |

| Risk | Control |
| --- | --- |
| A stolen card buys points and spends them, then the cardholder charges back | Review above the threshold; earned points spent first; the chargeback takes back what is left and pauses top-ups; the rest is deducted by hand |
| Many top-ups a day to move money through the shop | The daily top-up cap per member, counted when checkout opens; one open checkout at a time |
| Top up, buy goods, return them for a card refund (套現) | Returns come back in the ratio paid, points to their pool; a top-up itself is never refunded |
| Top up, pay for a gift card with points, sell the card | Points pay qualifying goods only, but the shop spreads a points discount over a gift card on the same sale — [Discounts](/p/grade10-site/store/discounts) |
| Value moved to another member | No transfer exists; an operator credit lands in the earned pool |
| A balance cashed out | No path pays points out |
| Discounts bought at scale | A deploy-set ceiling on a pack's discount, and the daily spend cap |
| Many accounts, one card | Each account's cap counts alone; nothing links accounts by card |
:::
