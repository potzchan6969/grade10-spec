---
title: Tiers
spec: grade10-site/loyalty/programme
order: 2
---

A tier is the rate a member earns at. It is derived on every read from what
the member has earned, the term they hold it for, and any live invitation —
never stored as a decision — so a term that ran out a second ago already
reads as Silver before any sweep runs. A ladder that is ambiguous stops the
product at boot rather than at the moment a member is evaluated
([[loyalty-SC-17]], [[loyalty-SC-18]], [[loyalty-SC-19]], [[loyalty-SC-20]],
[[loyalty-SC-21]]).

## The ladder

| Tier | Earns | Reached by | Kept by |
| --- | --- | --- | --- |
| Silver | 1× | Every member starts here | — |
| Gold | 1.2× | 500 tier points inside a rolling twelve months | 500 tier points inside the twelve-month term |
| Black | 1.7× | Invitation only ([[loyalty-SC-25]]) | Until the invitation ends or is revoked |

These are deployed values, changed by a deploy and never by an operator.

## Two counts

Earning credits both **tier points** and the **redeemable balance**; a
redemption spends only the balance. Tier points are the sum of what a member
earned inside the window, and a claw-back subtracts from the same window on
the date of the earn it cancels, so the penalty ages out with the earn. The two
are never summed on any surface, and neither can take the other: losing the
balance to inactivity does not lose the tier, and losing the tier does not
lose the balance.

## Reaching a tier

Promotion is immediate. The instant an earn takes a member's tier points past
500, including on a first purchase, they hold Gold and a twelve-month term
starts that day. The higher rate applies from the next purchase: the
multiplier is read before the purchase is priced, so one large order cannot
claim a rate it had not reached when it was made.

## Keeping and losing a tier

A term is twelve months from the day the tier was reached. Earning 500 tier
points inside the term extends it by another twelve months from its own end,
the moment an evaluation sees it — the anniversary is kept, and there is no
year-end reckoning. A term that ends without that lands the member on the
highest tier their rolling window still attains, as a fresh attainment with a
fresh term; usually that is Silver.

Losing a tier stamps a demotion date, and only earnings dated after it count
toward climbing back. Otherwise the window that just lapsed would re-promote
the member the next morning. Spending points never demotes anyone.

A refund re-evaluates the tier at once: refunded spend is spend that never
happened, so a tier held only on that money drops with it, and a retention
extension it alone supported is withdrawn.

A nightly review walks every term that has ended, records the drop or the
retention in the tier history, and counts who fell and who re-earned. It
writes history; it decides nothing, because every read already resolved the
tier live. Each move a member makes is one row in that history, with its
cause ([[loyalty-SC-16]]).

:::callout{kind="warning"}
The durable spec describes a tier that ratchets up and never drops
([[loyalty-SC-14]]), and names the first two rungs Platinum and Diamond. What
runs is the twelve-month term above, with persisted ids `silver`, `gold` and
`black`. The rewrite is in flight under `revise-loyalty-programme-rules`.
:::

## Black, by invitation

Black is held only through an operator's grant, which names who granted it,
why, and optionally when it ends; it can be revoked, and a member holds at
most one live invitation per tier ([[loyalty-SC-26]], [[loyalty-SC-27]],
[[loyalty-SC-28]]). Every evaluation runs twice, once ignoring invitations
and once with them, so a Gold earned while invited survives losing the
invitation, and an invitation never becomes the earned floor nor extends a
term. An invitation whose end date passes is observed, not scheduled
([[loyalty-SC-15]]).

An invitation granted with no end date holds until it is revoked. The annual
cap and the approval step the owner's draft asks for are not enforced.

## Journeys

::journeys{id="grade10-site/loyalty/programme"}

::cases{id="grade10-site/loyalty/programme"}

:::detail{title="For engineers" for="engineer"}
The member row stores the earned tier, the day it was reached, and both ends of
its period — all four set or all four null — plus the demotion date. The period
start is stored rather than inverted from the end, because month arithmetic
clamps: a term stamped on 29 February ends on 28 February, and walking that
back would open the period a day before the earn that bought it. The tier
window is open-ended above so a backdated earn counts the moment it lands, and
floored at the demotion date, or at a virtual one for a term that has lapsed
and not yet been reviewed.

The nightly cron runs the expiry sweep, then the tier review, then the
reward-template audit, then the lapsed-collection sweep, each on its own
budget. Metrics: `loyalty.tier.changed` by tier and cause, and per review
`loyalty.tier.review.demoted`, `.retained`, `.failures`, `.skipped`,
`.leftover`. Invitations are granted and revoked behind `loyalty:invite`, and
nothing sweeps them.
:::
