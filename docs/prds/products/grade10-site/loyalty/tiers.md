---
title: Tiers
spec: grade10-site/loyalty/programme
order: 2
---

A tier is the rate a member earns at. It is derived on every read from what
the member has earned, the period they hold it for, and any live invitation —
never stored as a decision — so a period that ran out a second ago already
reads as Silver before any sweep runs. A ladder that is ambiguous stops the
product at boot rather than at the moment a member is evaluated
([[grade10-site-loyalty-programme-SC-17]], [[grade10-site-loyalty-programme-SC-18]], [[grade10-site-loyalty-programme-SC-19]], [[grade10-site-loyalty-programme-SC-20]],
[[grade10-site-loyalty-programme-SC-21]]).

## Ladder

| Tier | Earns | Reached by | Kept by |
| --- | --- | --- | --- |
| Silver | 1× | Every member starts here | — |
| Gold | 1.2× | 500 points earned in a rolling 12 months | 500 points earned inside the 12-month period |
| Black | 1.7× | Invitation only | Until the invitation ends or is revoked |

These are deployed values, changed by a deploy and never by an operator.

## Tier Progress

A member holds **one balance**: earning adds to it, redeeming takes from it,
and it expires only after 12 months with no activity.

**Tier progress is not a second balance.** The progress is determined by summing the points the member earned in a period.

- **Reaching a tier** — what they earned in the last 12 months
- **Keeping one** — what they earned in the tier period, the 12 months since
  it began

Only earning moves the progress. Redeeming takes from the balance and leaves
the progress untouched, so spending can never cost a member their tier.

:::callout{kind="note"}
A refund takes back the points its order earned, counted against the day of
that order rather than the day of the refund. Where those points were the only
thing holding a tier, the member stops holding it, and a period they alone
extended goes back to its old end.
:::

## Earn Multiplier

Customer reaches a tier upon reaching the points required for that tier.
The multiplier is only applied starting from the next order.

## Keeping and losing a tier

A tier is held for a **tier period**: **12 months** from the day it was
reached. What the member earns inside the period decides what happens at the
end of it.

- **≥ 500 points** — the period extends 12 months from its own end
- **< 500 points** — the member goes back to Silver

Progress in one period is not carried over to the next.

:::callout{kind="note"}
**Tier history is lazily evaluated, i.e. evaluated when read.** 
We have a cron sweep to render the record for analytics purposes.
:::

:::example{title="A member's three years" periods="Gold=gold"}
| When | Event | Points | Balance | Progress | Period |
| --- | --- | --- | --- | --- | --- |
| 2025/02/10 | buys $2,500 · 250 at 1× | +250 | 250 | 250 | Silver |
| 2025/11/01 | buys $2,000 · 200 at 1×, fifty short | +200 | 450 | 450 | |
| 2026/02/14 | buys $1,000 · 100 at 1× · the opening 250 ages out | +100 | 550 | 300 | |
| 2026/03/01 | buys $3,000 · 300 at 1×, reaching 600 — **Gold** | +300 | 850 | 0 | Gold · to 2027/03/01 |
| 2026/03/05 | redeems 500 | −500 | 350 | | |
| 2026/09/20 | buys $5,000 · 600 at 1.2×, past 500 · the period extends | +600 | 950 | 600 | |
| 2027/03/01 | the old period ends, the new one counts from zero | | 950 | 0 | Gold · to 2028/03/01 |
| 2027/09/20 | twelve months with no activity · the balance lapses | −950 | 0 | | |
| 2028/02/01 | buys $4,000 · 480 at 1.2×, twenty short | +480 | 480 | 480 | |
| 2028/03/01 | the period ends on 480, short of 500 — **Silver** | | 480 | 0 | Silver |
| 2028/03/04 | buys $1,000 · 100 at 1× again | +100 | 580 | 100 | |

- **The rate** is $10 a base point, then the tier's own multiplier, and it is
  read before the order is priced — so the purchase that reaches Gold still
  earns at 1×, and the first purchase back on Silver earns at 1× again
- **Progress** is measured over whatever the Period column names: the rolling
  twelve months while no tier period is running, what the tier period has
  counted once one is
- **A rolling twelve months** — in February the balance climbs to 550 while the
  progress falls to 300, because the opening 250 is older than twelve months by
  the 14th; by March the member holds 850 points and reaches Gold on the 600
  still inside the window
- **Reaching, then keeping** — the 600 that won Gold counts toward nothing
  afterwards, because a period counts only what is earned after it starts; the
  same happens on 2027/03/01, so what was earned that September cannot buy a
  third period
- **March 2026** — the redemption takes 500 from the balance and nothing from
  the progress, so it can neither demote the member nor delay the tier
- **September 2026** — the period extends from its own end, never from that
  day, so the anniversary is kept
- **September 2027** — the balance dies of inactivity while the tier lives on:
  the member holds Gold for five more months with nothing to spend
- **February 2028** — $4,000 is activity, so the balance lives another year,
  and 480 is twenty short of 500, so the period is not saved: what keeps the
  points and what keeps the tier are two different sums
- **March 2028** — the climb starts again at the period's end, so the 480
  counts toward nothing and the 100 three days later is the whole of it
:::

## Black, by invitation

- **The grant** — an operator's, naming who granted it, why, and optionally
  when it ends; revocable, and a member holds at most one live invitation per
  tier
- **No end date** — it holds until it is revoked
- **Its end is observed, not scheduled** — the member stops holding Black the
  instant the date passes, and the history records it at the next evaluation
- **Never the earned floor** — every evaluation runs twice, once ignoring
  invitations and once with them, so a Gold earned while invited survives
  losing the invitation, and an invitation neither raises what was earned nor
  extends a period
- **Not enforced** — the annual cap and the approval step the owner's draft
  asks for

:::detail{title="Data model" for="engineer"}
- **The member row** holds the earned tier, the day it was reached, both ends of
  its period — all four set or all four null — and the demotion date
- **The period start is stored, not inverted** from the end, because month
  arithmetic clamps: a period stamped on 29 February ends on 28 February, and
  walking that back would open the period a day before the earn that bought it
- **The window is open-ended above**, so a backdated earn counts the moment it
  lands, and floored at the demotion date — or at a virtual one for a period
  that has lapsed and not yet been reviewed
:::

:::detail{title="Nightly sweeps and metrics" for="engineer"}
- **The nightly cron**, in order and each on its own budget — the expiry sweep,
  the tier review, the reward-template audit, the lapsed-collection sweep
- **Metrics** — `loyalty.tier.changed` by tier and cause; per review,
  `loyalty.tier.review.demoted`, `.retained`, `.failures`, `.skipped` and
  `.leftover`
- **Invitations** are granted and revoked behind `loyalty:invite`, and nothing
  sweeps them
:::
