---
page: grade10-site/loyalty/points
reviewed: TBC
---

The page's own examples and flows are cases too, cited by their ids:
`earn-normal`, `earn-unclassified-line`, `earn-no-lines`, `earn-custom-sale`,
every `refund-*` and every `expiry-*`. The rows below prove what no example
walks. Cite one as `grade10-site/loyalty/points#<id>`.

## Rules

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| earn-rounding | a Gold member | an order of $139 qualifying goods completes | 15 points: 13 base points × 1.2, floored | smoke |
| earn-silver | a Silver member | an order of $139 qualifying goods completes | 13 points | |
| earn-black | a Black member | an order of $139 qualifying goods completes | 22 points: 13 × 1.7, floored | |
| foreign-currency | an order priced in USD | it completes | refused; no points, no ledger entry | |
| clock-hong-kong | an order completing at 00:30 Hong Kong time on 1 January | the member reads the ledger | the entry is dated 1 January | |
| earn-on-completion | a paid web order with two items, one fulfilled | the second item is fulfilled | the points land then, not at payment and not at carrier delivery | smoke, building |
| earn-partly-refunded | a paid web order, part refunded before its last item ships | the last item is fulfilled | it completes and earns on the net paid, though its badge reads Refunded | building |
| earn-fully-refunded | a paid web order refunded in full | its items are fulfilled | it never earns | building |
| earn-till | a member's sale rung at the till | the sale is paid at the counter | the points land at the counter | smoke |
| earn-guest-order | a site guest order, its email joined to an account or not | it completes | no points | building |
| earn-once | an order's completion delivered twice, or during a loyalty outage | delivery is retried until taken | the order earns exactly once | |
| earn-fraction | a Silver member | an order of $125.50 qualifying goods completes | 12 points | |
| earn-gold-1000 | a Gold member | an order of $1,000 qualifying goods completes | 120 points | |

## Qualification Criteria

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| basis-after-coupon | a Silver member, $200 of goods, a $20 coupon | the order completes | 18 points, on $180 | smoke |
| basis-no-shipping-tax | a Gold member, $139 of goods, $30 shipping and tax | the order completes | 15 points; shipping and tax add none | |
| discount-shared-by-value | a Silver member, a $100 card and a $100 gift card, $20 off the whole order | the order completes | the discount lands $10 on each line; 9 points, on the card's $90 | |
| gift-card-earns-nothing | an order of a gift card alone | it completes | no points | |
| top-up-earns-nothing | an order of a credit top-up alone | it completes | no points | |
| grading-fee-earns-nothing | an order of a grading fee alone | it completes | no points | |
| auction-win-earns-nothing | an auction win | it is paid and completes | no points | |
| fully-discounted | an order discounted to $0 | it completes | no points and no ledger entry | |
| paid-with-points | a Silver member, an $800 order, 100 points paid toward it | the order completes | 70 points, on the $700 paid in money | |
| other-channel | a member's sale outside the store and the till | it is paid | the sale completes; no points | |

## Refunds

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| refund-rejudges-tier | a member held at Gold by one order's points | that order is refunded in full | the points leave and the tier is judged again at once | |

## Expiry

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| expiry-dead-at-once | a balance whose date passed a minute ago, no nightly pass run | the member reads the balance | it reads 0 | |
| expiry-operator-correction | a live balance with a date | an operator adds or takes off points | the date does not move | |
| expiry-refund-keeps-date | a live balance lapsing 2027/01/03 | a refund claws back points on 2026/06/01 | the date stays 2027/01/03 | building |
| expiry-reward-handed-over | a live balance lapsing 2027/01/03 | an operator hands the member a reward outright on 2026/06/01 | the date stays 2027/01/03 | building |
