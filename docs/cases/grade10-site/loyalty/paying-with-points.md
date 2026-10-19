---
page: grade10-site/loyalty/paying-with-points
reviewed: TBC
---

The page's own examples are cases too, cited by their ids: `pay-online`,
`pay-abandoned`, `pay-shop-applies-less`, `refund-whole-order` and
`refund-part-order`. The rows below prove what no example walks. Cite one as
`grade10-site/loyalty/paying-with-points#<id>`.

## Rules

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| rate-one-dollar | a Silver member, an $800 order of qualifying goods | they pay 100 points | $700 is due in money; the order earns 70 points, on $700 | smoke |
| no-shipping-tax | $200 of goods, $30 shipping, 500 points held | the member asks for 500 points | trimmed to 200; shipping is paid in money | |
| no-gift-card | an order of a gift card alone | the member asks for points | nothing to pay with points | |
| cap-after-code | $300 of goods, a $50 code, 500 points held | the member asks for 300 points | trimmed to 250 | |
| cap-balance | $300 of goods, 80 points held | the member asks for 100 | trimmed to 80 | |
| spend-is-activity | a balance lapsing 2027/01/03 | the member pays 10 points on 2026/06/01 | the balance now lapses 2027/06/01 | |
| auction-no-points | a member with points | they try to pay an auction purchase with points | refused | |
| till-switch-off | a manager turns off the till's points spending | a member is at the till | the sale completes as an ordinary sale; an attached member still earns | |
| email-switch-off | a manager turns off typed-email spending | staff identify a member by card | points still spend | |
| deduction-title | a member spends points online or at the till | the order is paid | its discount reads "Deduction from Points" | |
| old-points-title | a paid order whose points discount is titled "Points" | it lands | the balance is debited once, for that discount | |

## Online

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| debit-once | a paid order delivered twice | it lands | the balance is debited once | smoke |
| balance-fell | 100 points promised; the balance falls to 70 before payment | the order is paid | 70 points are debited; the shortfall is alerted | |
| no-points-title | 100 points promised; the paid order's discounts carry no points title | it lands | the debit is the applied total less every other discount, never over 100 | |

## At the Till

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| double-tap | staff tap Apply twice | the spend lands | one spend, both taps answer the same | smoke |
| read-back | staff apply 100 points | before it commits | the member sees points spent, money due, balance after and points this sale will earn | |
| staff-order-discount | a staff order discount on the sale | staff try to spend points | refused until staff take it off | |
| keyed-points-title | a sale with no store order id and a discount staff keyed "Points" | staff open the member's panel | no points, no coupon and no Apply until staff remove it | |
| resumed-sale-title | a parked sale carrying a "Points" discount | staff resume it and apply again | one discount, titled "Deduction from Points" | |
| undo-before-paid | points applied | staff clear the discounts before payment | nothing is debited | |
| member-notified | a till spend | the sale is paid | the member is notified of points, amount and location, never a code | |
| notice-corrected | a member told a spend landed | the sale is abandoned unpaid | a correction notice is sent | |
| till-never-reverses | a paid till spend | staff look for a reversal | the till offers none; an operator reverses it from the loyalty admin | |

## Refunds

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| cancelled-before-paid | 100 points promised | the order is cancelled before payment | nothing is debited, nothing comes back | |
| kept-gift-card | points paid on qualifying goods and a gift card | every qualifying good is refunded, the gift card kept | nothing comes back automatically; an operator can return it once | |
| returned-running-day | a balance brought to 0 by a points spend | the whole order is refunded | the points come back under the day the balance still runs to | |
