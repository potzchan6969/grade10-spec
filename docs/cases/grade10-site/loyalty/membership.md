---
page: grade10-site/loyalty/membership
reviewed: TBC
---

The page's own examples and flows are cases too, cited by their ids:
`registration-to-paired-member` and `attribution-replays-refund`. The rows
below prove what no example walks. Cite one as
`grade10-site/loyalty/membership#<id>`.

## Behind the Account

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| member-with-account | a collector with no account | they register | they are a member at once, at the entry tier with no points, and no join step is offered | smoke |
| no-identity-in-programme | a new member | the member record is made | it holds an opaque user id, the ledger and the tier; no name or email | |
| shopify-key-opaque | a member paired to a Shopify customer | the customer is written | its metafield holds the opaque key, never the account id | |
| pairing-waits-for-verified-email | a member whose email is not verified | the store pairs them | nothing is written to the shop until the email is verified | |

## Purchases Before the Account

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| guest-order-no-points | a site guest order, its email later joined to an account | it completes | no points | building |
| till-customer-attributed | a till guest sale with a Shopify customer carrying the guest's email | an account with that verified email is paired to it | the sale is attributed on the next pass and its points land | smoke |
| operator-attributes | a till guest sale with no customer | an operator attributes it with evidence | the points land, and the evidence is recorded | |
| second-claim-refused | a sale already attributed to one member | a second attribution is asked for | it is refused, naming the holder | |
| revoke-and-reattribute | a sale attributed to the wrong member | the operator revokes the claim and attributes it to the right one | the first member loses the points it granted; the second earns them | |
| attribution-amount-unknown | a sale not yet priced | an operator attributes it | refused, never guessed | |
| walk-in-mark | a paid till sale with no member and no customer | an operator marks it a walk-in | it stops asking for a link | |
| walk-in-linked-later | a sale marked a walk-in | a member shows the receipt and it is linked | the points land and the mark clears | |

## Membership Page

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| card-skin | a Gold member | they open `/membership` | the card wears the gold skin, with points to spend, what they pay at checkout and the earn rate | building |
| card-opens-benefits | the membership card | the member presses anywhere on it | Tier & Benefits opens | building |
| card-no-expiry-line | a member holding points | they read the card | it names no expiry day or count | building |
| black-no-progress | a Black member | they read the card | no run to keep or upgrade the tier is shown | building |
| two-counts | a member whose points toward the tier differ from their points to spend | they read the page | two figures, never one total | smoke |
| programme-balance | a sale a channel recorded that the programme has not yet taken | the member reads the balance | it does not include that sale | |
| dates-hong-kong | a member abroad | they read any date on the page | it reads in Hong Kong time | |
| section-fails-alone | the reward catalog fails to load | the member opens the page | the balance and the other sections still show | |

## Member Pass

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| pass-code-life | a pass showing a code | 10 minutes pass with no scan | the code lapses and the pass says so | |
| pass-once | a code a till took by QR | the short code is typed at another till | refused, naming where and when it was taken | smoke |
| pass-wrong-codes | a shop | 10 wrong codes are typed in 5 minutes | code entry pauses for that shop | |
| pass-letters-only | any short code | it is shown | 8 letters, no digits, none of I, L, O or U | |
| pass-new-code-keeps-old | a code the member has read out | they reopen the page for a new code | the earlier code still works until used or expired | |
| pass-email | a member | the pass shows | their account email under the tier badge, no name | building |
| pass-rotates | a code the till accepts | the till takes it | the pass shows the next code; it never shows a used state | building |
| pass-wake-lock | the pass alone on a phone | it stays up | the screen does not dim or lock | building |

## Histories

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| history-correction-down | an operator takes points off with a reason | the member reads their activity | Points taken off, with no reason | |
| history-returned | a sale paid with points is refunded | the member reads their activity | Points returned | |
| history-channel | an earn at the counter | the member reads their activity | the line says it came from the counter | |
| history-archived-reward | a reward redeemed, then archived | the member reads their activity | the entry still names the reward | |
| notified-without-code | a member identified at the till by email | the sale spends their points | they get a notice at once | |

## Privacy

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| no-pricing-in-activity | a Gold earn | the member reads its entry | no tier rate, money arithmetic or retry key | |
| delete-ends-membership | a member with a balance, tier progress, a coupon and a waiting collection, inside a live window | the account is deleted | balance and progress are 0, the coupon is void, the collection is cancelled without a refund, at once | smoke |
| delete-keeps-ledger | a deleted account | an auditor reads the ledger | its entries are still there | |
