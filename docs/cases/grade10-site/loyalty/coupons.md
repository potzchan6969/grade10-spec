---
page: grade10-site/loyalty/coupons
reviewed: TBC
---

The page's own flows are cases too, cited by their ids:
`online-retaken-paid`, `till-walked-away`, `till-retaken-paid` and
`refused-earlier-sale-stands`. The rows below prove what no flow walks.
Cite one as `grade10-site/loyalty/coupons#<id>`.

## Validity

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| one-use | a coupon spent by a paid order | the member tries it again | refused as Not standing | smoke |
| expired-no-return | a coupon past its end, unused | the member reads their balance | the points stay spent; the coupon is counted as breakage | |
| own-clock | a coupon with 20 days left | the member's balance lapses | the coupon still runs its 20 days | |
| coupon-states | a member holding an available, a used, a void and an expired coupon | they read their coupons | each reads its own state | |
| no-code-shown | a reward coupon and a store coupon | the member reads their list | the store coupon shows its code; the reward coupon shows none | |
| auction-refused | a member with a coupon | they try it on an auction purchase | refused | |
| codes-masked | a surface that must not show codes | it lists the member's coupons | every code is masked with the same word | |

## Applying one

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| unpaid-still-spendable | a coupon on an online checkout nobody paid | the member reads the cart drawer | it reads available, naming no sale | smoke |
| counter-keeps-cart | a coupon on a counter sale nobody tendered | the member claims it online | the checkout takes the cut; the counter sale keeps its cart and its code is deactivated | |
| till-takes-from-online | an open online checkout carrying the coupon | staff apply it at the till | the sale takes the cut; the online order is cancelled | |
| second-till | a coupon on a sale at one till | the member presents it at another | the second sale takes it; the first sale's code is deactivated | |
| paid-not-settled-refused | an online checkout paid, not yet settled | the member claims the coupon elsewhere | refused as An earlier sale stands; the paid checkout keeps the cut | |
| submitting-refused | a sale claimed it under five minutes ago, no order written | the coupon is claimed elsewhere | refused as An earlier sale stands | |
| stopped-checkout-freed | a checkout stopped over five minutes ago, no order written | the coupon is claimed elsewhere | the claim stands | |
| counter-hour | a counter sale the member walked away from | an hour passes since its last plan | the coupon is back in the wallet; the sale keeps its cart | |
| online-expired-keeps | an online order that expired while its code can still be collected | the programme's clock runs | the claim stands until the code is dead, then the coupon is spendable and nothing is forfeit | |
| retaken-after-refused-plan | a till sale whose plan was refused, giving its claim back | staff plan it again | the sale takes the coupon | |
| site-discount-wins | a shop automatic discount that takes more and cannot stack | the coupon is applied | the shop keeps its cut; the coupon stays in the wallet | |
| coupon-and-points | a reward coupon and points on one order | both are applied | both stand | smoke |

## Refusals

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| not-held | a code bound to another member | it is applied | answered as a code nobody minted | |
| till-online-only-panel | a coupon good online only | staff open the member's panel | it reads online only and cannot be applied | |
| till-online-only-phone | a coupon scoped to named products, naming the till | the member presents it from their phone | `This coupon cannot be used on this sale.`; the price is unchanged | |
| written-too-late | a sale whose order is written over a minute after its claim | it is submitted | refused; the member reads it took too long and to submit again; the coupon is back in the wallet | |
| gift-already-held | a gift whose variant the basket already carries | it is applied | refused as Gift already held | |
| wrong-currency | a basket in USD | a coupon is applied | refused as Wrong currency | |

## Spending one

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| no-cut-given-back | a counter sale that promised a coupon and was paid without its cut | it settles | the coupon is unused and spendable | |
| two-collect-once | a later sale claims the coupon; the earlier counter sale pays with its old code | both are paid, either order | the coupon is used once, by the later sale; the earlier sale is reported | |
| old-code-unclaimed | a counter sale pays with a code it let go, no other sale claiming the coupon | it settles | it spends the coupon and is reported | |
| used-refunded | a coupon used by an order | the order is refunded | the coupon stays used and its points stay spent | |

## Store promotions

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| store-coupon-listed | a store coupon minted for a member | they open the cart drawer | it is listed with their reward coupons, answered against the cart | |
