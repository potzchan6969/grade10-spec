---
title: Rewards
spec: grade10-site/loyalty/programme
order: 3
---

A reward is an item on the menu priced in points. Redeeming one is a
redemption: a single debit of the balance, oldest points first, refused whole
when the balance is short, and remembered at the price paid so repricing the
menu never rewrites what an earlier redemption cost ([[grade10-site-loyalty-programme-SC-29]]). What
the member then holds depends on what the reward is — a physical item waiting
at the counter, a money-off code, or nothing further to deliver.

## The menu

| Field | Meaning |
| --- | --- |
| Cost | Points per redemption; copied onto each redemption when it is made |
| Stock | Optional; a stocked reward is never oversold ([[grade10-site-loyalty-programme-SC-30]]) |
| Window | Optional; outside it the reward cannot be redeemed ([[grade10-site-loyalty-programme-SC-31]]) |
| Kind | How a redemption is handed over — see the table below |
| Archived | Retired from the menu, still readable in history ([[grade10-site-loyalty-programme-SC-61]]) |

The public menu shows only what a member can buy: in stock, inside its window,
not archived, with stock shown as a yes or no and never a count
([[grade10-site-loyalty-programme-SC-32]]).

| Kind | What the member holds | When it is theirs |
| --- | --- | --- |
| Manual | Nothing further — handed over at the counter | The moment the points are spent |
| Collect in store | A pending collection with a deadline, so many days from the redemption | When staff confirm the handover at the till |
| Money-off code | A single-use Shopify discount code — [Coupons](/p/grade10-site/loyalty/coupons) | When the code is minted, normally within seconds |

A money-off reward's code is worth exactly its cost at HKD 1 a point; the
menu refuses a reward whose money and points disagree, and a nightly audit
re-checks every live reward against the running rate.

::story{id="loyalty-membership-rewardmenu--default" title="The reward menu"}

## Fulfilment

A redemption is what the member bought; fulfilment is whether they hold it
yet. The member reads **preparing** or **ready**, and never how many attempts
it took or what the vendor said.

| State | Meaning |
| --- | --- |
| Pending | Owed; a drain delivers it every five minutes and once straight after the redemption |
| Fulfilled | Delivered — the code exists, or the item was handed over |
| Failed | Parked after a permanent refusal or fifteen attempts; an operator retries, settles by hand, or reverses |
| Awaiting collection | Paid for; waiting at the counter until its deadline |
| Collected | Staff confirmed the handover, once |
| Expired | The collection window closed; the points stay spent and the stock returns |

Retries back off from a minute to an hour. Fifteen attempts is a lifetime
bound: un-parking re-arms the next attempt against the operator who asked and
leaves the count alone.

## Collecting at the counter

A collect-in-store reward is parked the moment it is paid for, kept out of
every retry and failure alarm, and listed on the member's page with where and
by when to collect it. Staff verify it at the till and confirm the handover;
the confirmation records who and when, and a second till gets a distinct
refusal naming them. A window that closes moves the redemption to expired —
no refund by itself, the same rule as an unused code — and restocks the item
once.

::story{id="loyalty-membership-pendingcollectionlist--default" title="Rewards waiting at the counter"}

## Paying with points

Points also settle straight against a bill, with no menu item and no code: one
point pays HKD 1 of qualifying goods, never shipping or tax, and the part paid
in points earns nothing. Online, the amount is chosen at checkout and debited
only when the invoice is paid, scaled to what the shop actually took off. At
the till, staff spend an exact amount on the member's behalf. A refund returns
the points all or nothing: only when the whole of the goods comes back. How
each channel carries it is on
[Shopify Integration](/p/grade10-site/loyalty/shopify-integration).

## Reversing a redemption

Reversal restores each consumed lot as its own credit on that lot's original
date ([[grade10-site-loyalty-programme-SC-33]]), so it cannot extend the life of points, and it
restocks only when the redemption took a unit ([[grade10-site-loyalty-programme-SC-34]]). A member
can reverse their own unused code from the membership page; an operator can
reverse anything a member is still owed. A used code and a collected item are
never reversed — the reward was consumed, and giving the points back would
pay for it twice. A reversal after the balance has already lapsed voids the
artifact but returns nothing.

:::callout{kind="warning"}
Three things about rewards ship narrower than decided. The console's reward
form sets only slug, name, description, cost, stock and window — every reward
created from it is a manual handover, so a collect-in-store or money-off
reward has to be created through the admin API. Per-unit quantities are
switched off: the deployed programme declares no per-redemption or per-day
bound, so every reward is redeemed one at a time. And nobody is told at
handover: the collection notifier is a declared seam the assembly leaves
empty.
:::

:::callout{kind="warning"}
The durable spec knows a reward as an entitlement with no delivery. The
fulfilment lifecycle, collection at the counter, paying with points and the
member's own undo are specified only in the in-flight
`revise-loyalty-programme-rules` and `add-shopify-membership-pos` changes.
:::

## Journeys

::journeys{id="grade10-site/loyalty/programme"}

::cases{id="grade10-site/loyalty/programme"}

:::detail{title="For engineers" for="engineer"}
The redemption snapshots the reward's cost, quantity, fulfilment kind and
template. Lock order is member row then reward row; stock decrements by a
guarded update that rolls the whole transaction back on zero rows. The drain
claims with `for update skip locked`, calls the vendor outside any
transaction, and completes with a single guarded update — a reversal landing
mid-attempt reads as zero rows, and the just-made artifact is deactivated. The
code is random, committed before the first vendor call, so a crash leaves a
code a retry can ask for again.

Paying with points is its own ledger kind, `pay`, with `capture` for the
settlement debit and a keyed return; nothing is ever reserved — a `point_holds`
table was added and dropped again. Operator moves sit behind
`loyalty:adjust`: retry, settle, reverse, and returning a captured spend.
Metrics: `loyalty.points.redeemed`, `loyalty.fulfillment.*`,
`loyalty.collection.completed` and `.expired`, `loyalty.redemption.reversal_stuck`.
:::
