---
title: Membership
icon: medal
---

One points programme across every Grade10 door. A member earns on qualifying
spend, their tier sets the rate they earn at, and points settle two ways: as a
coupon an order carries at either checkout, or straight off the bill. Grade10
runs in HKD on Hong Kong time: one point per HKD 10 of qualifying goods, and
one point pays HKD 1 back.

The engine is brand-neutral and names no vendor. Shopify is a channel — the
online checkout and the POS at the counter — and never the source of truth for
a balance, a tier or a code. ZZZ has no programme.

| Page | What it holds |
| --- | --- |
| [Points](/p/grade10-site/loyalty/points) | The earning rules, qualifying goods, refunds, expiry and operator grants |
| [Tiers](/p/grade10-site/loyalty/tiers) | Silver, Gold and Black — how a tier is reached, kept, lost and given |
| [Rewards](/p/grade10-site/loyalty/rewards) | What a reward is, the catalog, the shop, what a member holds, and how one is given |
| [Paying with Points](/p/grade10-site/loyalty/paying-with-points) | Points straight off a bill, online and at the till |
| [Coupons](/p/grade10-site/loyalty/coupons) | How a coupon reaches an order at each checkout, and what happens when one goes wrong |
| [Profile](/p/grade10-site/loyalty/profile) | Membership with the account, the membership page, the member card and the member's own histories |
| [Shopify Integration](/p/grade10-site/loyalty/shopify-integration) | Customer pairing, the draft-order checkout, the POS extension, discounts and shipping |
| [Member Card in a Wallet](/p/grade10-site/loyalty/wallet-member-card) | The card in Google Wallet and Apple Wallet — what each code can do, and how a pass stays current |

Three audiences touch it. **Members** get the membership with their account,
carry a member card at `/membership`, and read tier, balance, what is expiring
and their own history on one surface. **Staff** run a loyalty terminal inside
Shopify POS at the till. **Operators** run the programme from the admin
console.

:::detail{title="Product decisions" for="pm"}
Repeat purchase is the cheapest revenue Grade10 has, and the physical store —
the majority of card sales — sells to anonymous guests. The programme gives a
returning buyer a visible, growing reason to buy again, makes the counter a
member channel, lets the business run promotions and reward individual
members without a deploy, and keeps what a purchase earns auditable. The
owner's draft it implements is
[the programme reference](/references/grade10-loyalty-program); the delivery
plan for the counter is [the Shopify membership and POS
notes](/references/shopify-membership-pos). The checkable rules are
[[grade10-site/loyalty/programme]] and the in-flight
`grade10-site/store/membership` capability. Each page records the decisions
behind its own rules, and what is still open is gathered below under Pending
spec.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Buyer | Has bought before, browsing again | Sees what they have accumulated and what it is nearly worth |
| Buyer | Deciding between Grade10 and elsewhere | Knows this purchase moves them toward a better rate |
| Buyer | At the counter | Registers, earns, spends points, and collects rewards without their own phone doing more than showing a code |
| Store staff | Member at the counter | Identifies them in seconds and reads, spends, or hands over on their behalf |
| Support operator | A buyer disputes a balance | Can read the member's history and correct it, on the record |
| Marketing operator | Running a sign-up promotion | Can grant points that count toward tier, without a deploy |
| Owner | Deciding who gets the top tier | Grants it deliberately, to a named person, with a reason |

**Not in scope.** Paid membership — every tier is free, the top one is given.
Earning outside Grade10 store and counter purchases, beyond operator-granted
campaign points; auction wins and credit top-ups are later-phase candidates
and earn nothing today. Redeeming against an auction — points and coupons buy
nothing there, in any phase. SMS verification, and NFC tap in any wallet.
Tier-based discounts beyond the earn multiplier — no tier gets a percentage
off or free shipping. Cross-brand membership — ZZZ buyers are a separate
population with no programme.

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Repeat purchase rate | Share of buyers with a second purchase within 90 days, members against non-members | Product |
| Physical attribution | Share of physical-store transactions attributed to a member | Product |
| Staff-assisted redemption | Staff-assisted redemptions completed per week | Product |
| Tier progression | Members reaching Gold per month | Product |
| Tier retention | Share of Gold members who earn the retention threshold inside their validity period | Product |
| Point redemption | Share of earned points redeemed before the balance expires | Product |
| Coupon usage | Share of issued codes used before their own validity ends | Product |
| Arriving by pass | Share of counter identifications made from a wallet pass | Product |
| Codes that never landed | Counter identifications that expired or replayed before staff scanned them | Product |
| Points outstanding | Unexpired, unredeemed points, plus the money out in unused codes, as a liability | Finance |
| Earning delivery | Money events awaiting delivery to the programme, and their age | Engineering |

**Risks.** Earning is delivered at least once and retried, so a member who
buys during an outage still earns; the alternative is silent, uncorrectable
point loss for real purchases. At HKD 1 per point the programme returns 10%
of spend at the entry tier and 17% at the top — generous against retail
norms, and the single input that decides whether the catalog's prices and the
reported liability are sustainable. Activity-based expiry makes the
outstanding balance stickier: a member who buys once a year never loses a
point. A member's identity never enters the programme, so a leak of the
loyalty database exposes balances and identifiers, not people.
:::
