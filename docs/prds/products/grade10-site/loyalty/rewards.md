---
title: Rewards
spec: grade10-site/loyalty/programme
order: 3
---

A reward is an item on the menu, taken with points or granted on a date the
programme already knows. Taking one is a redemption: a single debit of the
balance, oldest points first, refused whole when the balance is short, and
remembered at the price paid so repricing the menu never rewrites what an
earlier redemption cost ([[grade10-site-loyalty-programme-SC-29]]). What the
member then holds depends on what the reward is — a physical item waiting
at the counter, a money-off code, or nothing further to deliver.

## Menu

| Field | Meaning |
| --- | --- |
| Cost | Points per redemption; copied onto each redemption when it is made |
| Earned by | Points at that cost, a birthday, or registering |
| Applies to | The whole order, or the products a custom-data group names |
| Cap | The most one redemption takes off, where the reward is a share of the order |
| Channel | Online, in the shop, or both |
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

## Earning a reward

Points are one way onto a reward, not the only one.

- **Points** — the member exchanges them at the reward's cost, oldest lots
  first
- **Birthday** — granted once a year, on the birthday the member's profile
  holds
- **Registration** — granted once, when the account is created

A granted reward costs no points and is otherwise the same reward: it mints
what its kind mints, and stock, window and archiving bind it the way they bind
a purchase.

❓ **Whose birthday** — no surface collects one today, so a birthday reward has
nothing to fire on.

## What a reward takes off

- **The whole order, or a group of products** — a product reward names its
  group through the catalogue's custom data, never a list of products written
  on the reward, so a product joins the group by being edited
- **A cap** — an order reward states the most one redemption can take off, so
  a share of a large order never outgrows what the menu meant
- **Online, in the shop, or both** — a reward says where it can be spent, and
  a member is offered only what the channel they are in takes

An order carries one discount at a time and a reward's coupon is in that
count — [Discounts](/p/grade10-site/store/discounts).

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
Rewards ship narrower than decided:

- **The console's reward form** sets only slug, name, description, cost, stock
  and window, so a collect-in-store or money-off reward has to be created
  through the admin API
- **Per-unit quantities** are switched off — the deployed programme declares
  no per-redemption or per-day bound, so every reward is redeemed one at a
  time
- **Nobody is told at handover** — the collection notifier is a declared seam
  the assembly leaves empty
- **A reward's group, cap, channel and how it is earned** are read by nothing
  yet; every reward is bought with points and takes a fixed amount off any
  order, in either channel
:::

:::callout{kind="warning"}
The durable spec knows a reward as an entitlement with no delivery. The
fulfilment lifecycle, collection at the counter, paying with points and the
member's own undo are specified only in the in-flight
`revise-loyalty-programme-rules` and `add-shopify-membership-pos` changes. The
group, the cap, the channel and the grant triggers are decided here and
carried by no spec yet.
:::

## Test cases

::cases{id="grade10-site/loyalty/programme"}

:::detail{title="Redeeming and draining" for="engineer"}
The redemption snapshots the reward's cost, quantity, fulfilment kind and
template. Lock order is member row then reward row; stock decrements by a
guarded update that rolls the whole transaction back on zero rows. The drain
claims with `for update skip locked`, calls the vendor outside any
transaction, and completes with a single guarded update — a reversal landing
mid-attempt reads as zero rows, and the just-made artifact is deactivated. The
code is random, committed before the first vendor call, so a crash leaves a
code a retry can ask for again.
:::

:::detail{title="Spending and metrics" for="engineer"}
Paying with points is its own ledger kind, `pay`, with `capture` for the
settlement debit and a keyed return; nothing is ever reserved — a `point_holds`
table was added and dropped again. Operator moves sit behind
`loyalty:adjust`: retry, settle, reverse, and returning a captured spend.
Metrics: `loyalty.points.redeemed`, `loyalty.fulfillment.*`,
`loyalty.collection.completed` and `.expired`, `loyalty.redemption.reversal_stuck`.
:::
