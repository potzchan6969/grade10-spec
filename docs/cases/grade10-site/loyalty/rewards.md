---
page: grade10-site/loyalty/rewards
reviewed: TBC
---

The page's own examples are cases too, cited by their ids:
`shop-buy-and-short` and `reverse-unused`. The rows below prove what no
example walks. Cite one as `grade10-site/loyalty/rewards#<id>`.

## Reward Types

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| fixed-off-filter | a $50 off Pokémon coupon, a basket of a Pokémon card and a Yu-Gi-Oh card | it is applied | $50 comes off the Pokémon line alone | smoke |
| percent-capped | a 10% off sealed coupon, up to $200, on $3,000 of sealed goods | it is applied | $200 comes off, not $300 | |
| percent-no-cap | a 10% coupon with no maximum discount, on $3,000 of matching goods | it is applied | $300 comes off | |
| whole-order-shared | a $50 off any order coupon, a basket of three lines | it is applied | every line shares the $50 | |
| gift-under-minimum | a free booster pack over $500, a basket of $400 | the gift is applied | refused until the basket reaches $500 | |
| gift-adds-line | a free booster pack over $500, a basket of $600 | the gift is applied | a free line for the pack's variant is added | |
| gift-minimum-required | an operator authoring a gift | they leave the minimum spend at zero or empty | the gift cannot be saved | |
| filter-scope-online-only | a coupon scoped to a catalog filter that names the till | the member is at the till | it is good online only | |

## Reward Shop

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| shop-signed-out | a visitor not signed in | they read the reward shop | live rewards, each with its cost and coupon validity; no stock count | |
| shop-out-of-window | a reward outside its window, or archived | a member tries to buy it | refused | |
| shop-last-unit | one unit left of a stocked reward | two members buy it at once | one gets it; the other is refused as out of stock | |
| shop-oldest-first | a balance from two earns | the member buys a reward | one debit, taken from the oldest points first | |
| shop-repriced | a member bought a reward at 500 points | the reward is repriced to 700 | the earlier redemption still reads 500 | smoke |
| shop-menu-online-only | a reward scoped to named products, naming the till too | a member reads the menu | it reads online only, before any points go | |
| shop-twice-costs-once | a member buying a reward | the same redemption is sent twice, with a reload between | one redemption, one debit | |
| one-unit | a member who wants two of a reward | they redeem | the menu offers no quantity; they redeem twice, paying the cost each time | |
| collection-window | a reward collected in person and a money-off reward | the member reads the menu | the first states its collection window; the second states its validity | |
| redeem-refused | a redemption refused | the member reads the menu | the refused row says why and can be pressed again; the other rows stay pressable | |

## Using a Reward

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| coupon-at-once | a member with enough points | they buy a reward | the coupon and its validity are in their list at once | smoke |
| till-code-once | a product coupon applied at the till | the same sale is planned again | it keeps the coupon and mints no second code | |
| till-gift-no-code | a gift coupon applied at the till | the sale is planned | the gift goes on as its own line at nothing, with no code | |
| free-item-not-added | a free item coupon, a basket without that variant | it is applied online | refused as Nothing matches; no line added, total unchanged | |
| refund-keeps-coupon-used | a paid order that spent a coupon and points as a discount | it is refunded in full | the coupon stays used and its points stay spent; the discount points come back | |
| physical-reward-sale | a physical reward's coupon at the till | staff ring the item up | the coupon takes 100% off and the order goes through at nothing | |

## Reward Catalog

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| redefined-reward | a coupon bought under a $50 definition | the reward is redefined to $30 | the coupon still takes $50 | |
| revalidated-reward | a coupon bought when the reward ran 30 days | the reward is changed to 14 days | the coupon still runs 30 days | |
| archived-in-history | a reward the member bought | it is archived | the member's history still names it | |

## Cancelling a Redemption

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| reverse-used-refused | a redemption whose coupon is used | an operator reverses it | refused, the operator told why; points stay spent | smoke |
| reverse-claimed-refused | a coupon claimed by a sale that can still collect its code | an operator reverses its redemption | refused, naming that sale | |
| reverse-after-release | that sale gives the coupon back | the operator reverses again | the coupon is voided and the points return | |
| reverse-lapsed | a member whose balance has lapsed | an operator reverses an unused redemption | nothing is returned, and the operator is told why | |
| reverse-running-day | a balance brought to 0 by a redemption | it is reversed | the points come back under the day the balance still runs to | |
| reverse-tier-untouched | a member at Gold | a redemption is reversed | tier progress is unchanged | |
| reverse-no-member-way | a member holding an unused coupon | they look for a way to get their points back | no member surface offers one | |
| reverse-on-record | an operator reverses a redemption | the log is read | it names who and why | |
| reverse-unlimited-stock | a redemption of an unlimited reward | it is reversed | no stock is returned | |
