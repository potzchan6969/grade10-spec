---
page: grade10-site/loyalty/shopify-integration
reviewed: TBC
---

The page's own flows are cases too, cited by their ids: `online-paid`,
`online-abandoned`, `online-refunded`, `till-paid`, `till-guest-sale` and
`till-undone`. The rows below prove what no flow walks. Cite one as
`grade10-site/loyalty/shopify-integration#<id>`.

## Two Channels, One Pipeline

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| title-new-both-channels | a member spending points online or at the till | the order is paid | its points discount reads "Deduction from Points", in every site language | |
| title-older-counts | a paid order whose points discount reads " points " | it lands | it is read as the points discount and debited once | |

## Customer Pairing

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| pair-no-account-id | a member paired with a Shopify customer | the customer is created or updated | it carries the opaque member key and never the account id | smoke |
| pair-shopify-down | Shopify unreachable | a collector registers | the account works at once; the pairing lands once Shopify answers | smoke |
| pair-unverified-email | an email not yet verified | the drain runs | nothing is written to the shop | |
| pair-typed-email-adopts-nothing | a guest checkout under the email of a member who never verified it | pairing runs | that customer is not adopted as the member's pair | |
| pair-account-from-purchase | a guest buying under an email no account holds | the account is created after payment | it pairs with the customer the purchase made | |
| pair-lost-response | a customer creation whose response was lost | pairing retries | it finds the same customer; no second one | |
| pair-conflict-parks | a customer already carrying another member's key | pairing runs | the member parks in a conflict an operator sees | |
| pair-merge | a paired customer merged into another on the shop | the next pass runs | the pairing moves to the surviving customer, the key asserted on it | |
| erase-created | a customer this platform created | the member is erased | the customer is deleted, and no retry or repair brings it back | smoke |
| erase-adopted | a customer this platform adopted | the member is erased | the customer keeps its record and loses the key | |
| erase-racing-retry | a pairing retry creating the customer while erasure completes | erasure finishes | that customer is found and removed | |

## Orders Reaching the Programme

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| order-webhook-and-sweep | one till sale | it arrives by webhook and by the sweep | one order is recorded | smoke |
| order-own-checkout | an order the store's checkout created | the sweep or a webhook carries it | no second record | |
| refund-before-order | a refund naming an order not yet recorded | the refund arrives | the order is fetched and recorded first | |
| refund-no-owner-twice | a sale with no owner | its refund arrives twice | recorded once, and replayed when the sale gets an owner | |
| claim-second-refused | a sale already claimed | a second claimer tries | refused, naming who holds it | |
| claim-revoked | a wrong claim that granted points | an operator revokes it and claims for the right member | the points come back, and the right member earns | |
| till-gift-card | a gift card sold at the till to a member | the sale is paid | the gift card earns nothing | |
| till-points-lower-earn | a till sale part paid with points | the sale is paid | earning prices only the goods after the points | |

## POS Extension

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| code-replayed | a QR already taken at a till | it is scanned again | refused, naming where and when it was first used | smoke |
| email-miss | a staff-typed email matching no member | staff look it up | the answer says only that none was found, an unknown and an unpaired address alike | |
| lookup-recorded | staff identifying a member by email | the lookup runs | it is recorded with how, and the staff and location labels; the email is not kept | |
| lookup-another-member | a member on the sale | a scan finds a different member | the till shows the new one, and a spend started before the switch acts for nobody else | |
| double-tap | a spend | staff submit it twice quickly | one redemption, the same answer both times | smoke |
| member-told | a till spend or coupon | the sale is paid | the member is told the points, the amount and the location, never the code | |
| member-correction | a spend the member was told landed | the sale is left unpaid | a correction notice | |
| name-shop-name-outage | a member with a name chosen for the shop | the account service is down and staff open a session | the saved name shows | |
| name-placeholder | a member with no name chosen for the shop | the account service is down and staff open a session | 會員 | |
| name-80-chars | a name chosen for the shop of 80 characters | staff open the session and the badge | all 80 characters are sent | |
| title-older-at-till | a till sale with the order id and a "Points" discount | staff take the benefits off | it counts as the member's points and comes off before the order id | |
| title-unmarked-discount | a till sale with no order id and a discount keyed "Deduction from Points" | staff open the panel | no points, no coupons, no Apply until it is removed | |
| switch-terminal-off | Terminal enabled turned off mid-day | a member's sale is rung up with the customer attached | the sale completes as a guest sale and still earns | smoke |
| switch-email-spend-off | Email spend off | a member identified by QR, and one by email | the QR session spends; the email session reads only | |
| outdated-extension | an outdated extension at a till | staff ring up a sale | membership is off and the sale goes on | |

## Discounts and Shipping

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| shipping-free-bar | goods of $820, $40 of points | the shipping is priced | free; the bar reads goods before discounts | |
| shipping-under-bar | goods of $500 | the shipping is priced | $60 | |
