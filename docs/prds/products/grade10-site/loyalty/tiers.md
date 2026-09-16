---
title: Tiers
spec: grade10-site/loyalty/programme
order: 2
reviewed: 2026-09-15
---

## Ladder

| Tier | Earns | Reached by | Kept by |
| --- | --- | --- | --- |
| Silver | 1× | Every member starts here | — |
| Gold | 1.2× | 500 points earned in a rolling 12 months | 500 points earned inside the 12-month period |
| Black | 1.7× | Invitation only | Until the invitation ends or is revoked |

These are deployed values, changed by a deploy and never by an operator: an
operator who can rewrite what a purchase earns can mint money. The reward
catalog is the lever an operator holds.

## Tier Progress

A member holds **one balance**: earning adds to it, redeeming takes from it,
and it expires 12 months after the last activity.

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

❓ **A claw-back demotion** — the engine stamps it as a lapse, so a member
refunded down from a higher rung reads zero progress while still holding the
unrefunded points that landed them on the lower one, and keeps the higher
rung's period dates. Whether that counts as losing a tier, and whether the
lower rung gets a fresh period, is the owner's call.

## Earn Multiplier

Customer reaches a tier upon reaching the points required for that tier.
The multiplier is only applied starting from the next order.

## Keeping a Tier

A tier is held for a **tier period**: **12 months** from the day it was
reached. What the member earns inside the period decides what happens at the
end of it.

- **≥ 500 points** — the period extends 12 months from its own end
- **< 500 points** — the member falls to the highest tier they still hold,
  Silver unless a Black invitation is live
- **Taken back by an operator** — a tier reached or granted in error is
  removed on the record, whatever its period says; it takes the same
  permission as granting an invitation, so an operator who may only move
  points cannot demote anyone

Progress in one period is not carried over to the next.

❓ **Retention threshold** — 500 today, the same figure that reaches Gold,
because the programme sets no separate one. A softer figure around 400 is
under review; it is a new key on the Gold rung, and it changes the size of the
first downgrade cohort. The owner settles it before the first period ends.

❓ **Re-qualifying early** — reaching 500 in month two extends the period from
its own end, and the new period counts from zero there, so the rest of the
year's earning counts toward neither retention nor the next rung. Whether that
is the intended nudge is the owner's call.

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
:::

## Black Tier

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
- ❓ **Annual cap and approval** — the owner's draft asks for both; neither is
  fixed and the programme enforces neither, so an invitation with no end date
  holds until revoked. The owner's call
