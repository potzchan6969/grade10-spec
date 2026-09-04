---
title: Points Earning
spec: grade10-site/loyalty/programme
order: 1
---

A point is HKD 10 of qualifying goods, priced once when a paid order reaches
the programme. Behind every member is an append-only ledger of dated point
lots, and a balance is a query over it — nothing is edited, so nothing can
quietly drift ([[grade10-site-loyalty-programme-SC-03]], [[grade10-site-loyalty-programme-SC-04]], [[grade10-site-loyalty-programme-SC-05]]). A
purchase recorded twice under its own key answers once and records nothing
twice ([[grade10-site-loyalty-programme-SC-10]], [[grade10-site-loyalty-programme-SC-11]]).

## The rate

| Rule | Value |
| --- | --- |
| Currency and clock | HKD, Asia/Hong_Kong. A foreign currency is refused ([[grade10-site-loyalty-programme-SC-07]]) |
| Base rate | 1 point per HKD 10 of qualifying goods after discounts |
| Multiplier | The tier held when the purchase is processed — Silver 1×, Gold 1.2×, Black 1.7× |
| Rounding | Base points floor first, then the multiplier, floored again: HKD 139 at 1.2× earns 15 |
| Event date | The seller's own date, so a late webhook keeps its day ([[grade10-site-loyalty-programme-SC-08]]); more than five minutes ahead is refused ([[grade10-site-loyalty-programme-SC-09]]) |

Every credit records the money, the base points and the multiplier it was
priced with, so what an entry granted is explained by the entry alone. Earning
credits two counts at once: the redeemable balance, and the tier points that
count toward reaching or keeping a tier.

## What earns

Qualifying goods are the lines of a paid order at their after-discount,
tax-free value. A coupon has already lowered that figure, and a whole-order
discount is split across every line in proportion to line value, so it cannot
be pushed onto the non-earning part of a basket.

| Earns | Earns nothing |
| --- | --- |
| Online store purchases | Shipping and tax — never a line item |
| Physical-store purchases attributed to a member | Gift cards, credit top-ups and grading services, by SKU prefix and by product type or tag |
| Campaign grants by an operator | The part of an order paid with points, or with a points code |
|  | Auction wins and credit top-ups, in this phase |

The exclusion list is a blocklist: a product nothing names earns. A line the
rule cannot classify leaves the whole order unpriced rather than earning on a
guess, and an order priced at zero is settled without a call.

## How a purchase reaches the programme

The store never waits on loyalty at the moment of sale. When an order becomes
paid, the same transaction writes an order event; a drain delivers it, and the
event's own id is the idempotency key, which is what makes a redelivery free
([[grade10-site-loyalty-programme-SC-39]], [[grade10-site-loyalty-programme-SC-40]], [[grade10-site-loyalty-programme-SC-41]]). Before a drain
delivers anything it checks the programme's currency and earn basis against
its own, and a mismatch stops the drain rather than earning on two different
bases under one name ([[grade10-site-loyalty-programme-SC-43]]). A refusal is reported, not swallowed
([[grade10-site-loyalty-programme-SC-44]]).

Retries back off from a minute to an hour. After twelve attempts an event
parks where an operator can retry it, and the age of the oldest undelivered
event is a gauge beside its depth. Every entry names the channel that sold —
online or in-store — and one balance holds across both.

## Refunds

A refund claws back what the refunded money earned, and never more than the
member still holds from it ([[grade10-site-loyalty-programme-SC-35]], [[grade10-site-loyalty-programme-SC-36]],
[[grade10-site-loyalty-programme-SC-42]]). The seller sends the goods share of a refund, priced from
the same basis the earn used, so refunding a delivery removes no points. A
refund that arrives before its earn is not lost; it claws back once the earn
lands ([[grade10-site-loyalty-programme-SC-37]]). Points already spent or expired cannot be reached,
and the gap is counted by cause rather than driving anyone negative.

A claw-back also cancels the tier contribution it removes ([[grade10-site-loyalty-programme-SC-38]])
and re-evaluates the tier at once — [Tiers](/p/grade10-site/loyalty/tiers).

## Expiry

The redeemable balance lapses after twelve months with no activity. Every
purchase and every redemption pushes that date to twelve months from its own
day, forwards only, so a late record shortens nothing. A campaign grant, a
correction and a reversal are not activity. Whatever is already dead is
settled before the clock moves, so a lapse that has happened is never
revived. Expiry needs no sweep to be true: a lot past its date stops counting
the instant it is read, and the nightly sweep only writes the record
([[grade10-site-loyalty-programme-SC-13]]).

:::callout{kind="warning"}
The durable spec still says a credit expires twelve months after the activity
that earned it ([[grade10-site-loyalty-programme-SC-12]]). What runs is the activity clock above — the
whole balance lives while the member keeps buying or redeeming. The rewrite is
in flight under `revise-loyalty-programme-rules`.
:::

## Grants by operators

An operator can add points two ways, and the difference is the whole point.
A **campaign grant** — a sign-up promotion, a goodwill gift — credits both
counts, so it can move a member up a tier ([[grade10-site-loyalty-programme-SC-49]]). A
**correction** credits or debits the redeemable balance alone, so fixing a
mistake never promotes anyone ([[grade10-site-loyalty-programme-SC-48]]). Neither keeps the balance
alive. The reason an operator types goes to the audit trail; the ledger
carries only its digest.

## Journeys

::journeys{id="grade10-site/loyalty/programme"}

::cases{id="grade10-site/loyalty/programme"}

:::detail{title="For engineers" for="engineer"}
The programme is one config, `apps/backend/grade10/loyalty/src/program.ts`,
parsed for every environment at assembly; an unknown key fails the boot.
Eligibility is computed at the order's paid transition and stamped once onto
the order — from the provider's itemised lines where it itemises, otherwise
from the store's own items with the whole-order discount apportioned by
largest remainder. The design record is
[loyalty architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/loyalty.md)
and the commerce side is
[commerce architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/commerce.md).

Idempotency keys the store sends: `earn:<event id>` for a spend,
`revoke:<event id>` for a refund, the order id for a points capture. Loyalty
prefixes the earn key again, so stored keys read `earn:earn:<id>`; that is
kept on purpose. Metrics: `loyalty.points.earned`, `.expired`,
`.dead_on_arrival` on its own series, `loyalty.clawback.shortfall` by cause,
`commerce.order_event.undelivered` and `.stuck` on the store side.
:::
