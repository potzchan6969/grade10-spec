---
page: grade10-site/loyalty/operator-console
reviewed: TBC
---

The page has no examples or flows of its own; the expiry worked through an
operator is walked on Points as `expiry-operator-restart`. Cite a row below
as `grade10-site/loyalty/operator-console#<id>`.

## Permissions

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| permission-refused | an operator without an action's permission | they attempt it | refused | smoke |
| read-only-sections | an operator who may only read members | they open the console | they can find and read members, and see no section that moves points, restarts the expiry, grants invitations, edits rewards, removes a tier, cancels a redemption or shows the log | |
| move-points-not-remove-tier | an operator who may only move points | they try to remove a tier | refused | |
| move-points-not-cancel | an operator who may only move points | they try to cancel a redemption | refused | |
| second-factor-gate | an operator allowed an action, with no verified second factor | they attempt it | they are taken to verify, and the action completes after | |
| log-tamper | a recorded operator action | it is altered or removed | verifying the log names where it breaks | |
| log-unwritable | the operator log cannot be written | an operator attempts a change | refused, not run unrecorded | |

## Reading a Member

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| member-link | an operator viewing a member | they share the address | the same member opens for the recipient | |
| no-identity-without-permission | an operator with loyalty permissions but not identity | they find a member | the loyalty state shows, with no name or email | smoke |
| identity-read-logged | an operator with the identity permission | they read members' names | the log records who read which members and how many, never the names | |
| identity-unreachable | the identity system cannot be reached | an operator finds a member | the console says so, and shows no blank name | |

## Moving Points

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| correction-no-promotion | a Silver member 50 points short of Gold | an operator adds 100 points as a correction | the points are spendable; progress toward Gold is unchanged | smoke |
| grant-promotes | a Silver member 50 points short of Gold | an operator grants 100 campaign points | they count toward Gold, and the member reaches it | |
| form-names-date | a member with a live balance | an operator opens the add-points form | it names the day the points will lapse | |
| form-starts-window | a member with nothing live | an operator opens the add-points form | it says the points start the member's window rather than join one | |
| reason-to-log | an operator grant with a reason | it is written | the reason is in the operator log; the member never sees it | |

## Restarting the Expiry

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| restart-from-today | a balance lapsing in 2 months | an operator restarts it | the whole balance lapses twelve months from today; the reason is in the log | smoke |
| restart-never-shortens | a balance lapsing in 13 months | an operator restarts it | the date stays where it was | |
| restart-no-revival | a balance that has lapsed, then a new earn | an operator restarts it | what lapsed stays lapsed; only the new points take the new date | |
| restart-moves-no-points | a balance of 115 | an operator restarts it | the balance stays 115 and nothing reaches the member's activity | |
| restart-permission | an operator who may only read members | they try to restart a window | refused | |

## Authoring a Reward

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| money-off-from-console | the reward form | an operator saves Money off with a discount, a scope and a combine setting | the reward is saved with that definition, with no admin API call | smoke |
| gift-from-console | the reward form | an operator saves Gift with a purchase with one variant and a minimum spend | it is saved as a gift for that variant | |
| free-item-saved | the reward form | an operator chooses Free item, picks one variant and saves | saved as a product coupon at 100%, no maximum, on that variant | |
| free-item-reopens | a stored product coupon at 100%, no maximum, on one variant, $500 minimum | an operator opens or duplicates it | Free item is chosen, the variant picked, $500 the minimum | |
| capped-stays-money-off | a stored 100% coupon with a maximum, or on two variants, or on one product | an operator opens it | Money off is chosen, with that discount and scope | |
| choice-opens-empty | Free item chosen with a variant picked | the operator moves to Money off, then back | Money off has no amount and no scope picked; Free item has no variant picked | |
| online-only-scope | a new Money off reward | the operator scopes it to named products or a filter and saves | the form shows online only and offers no till channel; it saves online alone | |
| online-only-stored | a stored reward on named products for online and the till | the operator saves it unchanged | it saves online alone; moving the scope to named variants first shows both channels again | |
| retired-handover-kept | a stored manual handover or counter collection | the operator renames it and saves | no choice is made, and the handover is unchanged | |
| retired-handover-duplicate | a stored manual handover | the operator duplicates it | the copy opens on Money off | |
| missing-part-refused | a gift with no minimum spend, a free item with no variant, Money off with no amount or empty scope, or a window ending before it starts | the operator saves | nothing is saved, and the form names what is missing | |
| basket-check | a complete reward and a basket the operator built | the basket check runs | it states what the coupon takes off, or why it would not apply; nothing is saved | |
| currency-mark | any money field | the form shows it | `HKD` in front of the amount | |
