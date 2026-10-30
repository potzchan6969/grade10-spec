---
title: Tiers
spec: grade10-site/loyalty/programme
order: 2
---

## Ladder

| Tier | Earns | Reached by | Kept by |
| --- | --- | --- | --- |
| Silver | 1× | Joining, or dropping from Gold or Black | Always — the period simply starts again |
| Gold | 1.2× | 500 points earned inside the Silver period | 500 points earned inside the Gold period |
| Black | 1.7× | Invitation only | Until the invitation ends or is revoked |

These are deployed values, changed by a deploy and never by an operator: an
operator who can rewrite what a purchase earns can mint money. The reward
catalog is the lever an operator holds.

- **Changing the period, the clock or the retention threshold** — the tier
  period's length, the time zone and the retention threshold are read live
  rather than frozen per member, so changing one re-judges every period still
  running; such a deploy ships with a planned migration of current periods.
  The owner's call, made 2026/10/30

## Tier Progress

A member holds **one balance**: earning adds to it, redeeming takes from it,
and it expires 12 months after the last activity.

**Tier progress is not a second balance.** It is the points the member earned
inside their current **tier period**, and the same figure answers both
questions:

- **Reaching Gold** — what they earned in the current Silver period
- **Keeping Gold** — what they earned in the current Gold period
- **Topped-up points** — count toward neither; a points pack adds to the
  balance alone — [Top-ups](/p/grade10-site/loyalty/top-ups)

Only earning moves the progress. Redeeming takes from the balance and leaves
the progress untouched, so spending can never cost a member their tier.

:::callout{kind="note"}
A refund takes back the points its order earned, counted against the day of
that order rather than the day of the refund. Where those points reached Gold,
the promotion is undone and the member is back in the Silver period it ended.
Where they kept Gold, that Gold period ends on its old date and a Silver period
starts there, with what they earned since counting toward it. Orders earned at
Gold's rate in between keep what they earned.
:::

- **A refunded promotion** — the member goes back to the Silver period the
  promotion ended rather than starting a fresh one on the refund day, since a
  refund undoes the order instead of demoting them. The owner's call, made
  2026/10/29

## Earn Multiplier

Customer reaches a tier upon reaching the points required for that tier.
The multiplier is only applied starting from the next order.

## Tier Period

Silver and Gold are each held for a **tier period** of **12 months**; Black is
held by its invitation. A period counts from the moment the member arrives on
the tier:

- **Silver** — the moment they register as a member, or the moment they drop
  to Silver from Gold or Black
- **Gold** — the order that takes their Silver-period progress to 500

It ends at the close of its anniversary date, 23:59:59.999 Hong Kong time, and
the next period starts the instant after. An order placed late on the last day
still counts in the period it closes.

Progress starts at zero with every period, and earning before it began counts
toward nothing in it. A purchase counts toward the period it reaches the
member's record in — a till sale attributed later, or a ticket bought on an
email before the account existed, counts toward the period it lands in. Reaching
Gold ends the Silver period there and starts the Gold one; the order that
reaches it counts toward the Silver period alone, points past 500 included.

- **The end of the Hong Kong day** — a period ends at 23:59:59.999 in the
  shop's zone on its anniversary date rather than at the hour it opened, so a
  member is never told a period runs to a date and then loses that date's
  afternoon. Counting still starts at the opening event. The owner's call,
  made 2026/10/29
- **Periods date from joining** — the first Silver period opens when the
  member registers, and nothing earned before that counts toward a tier. A
  site guest order earns nothing at all —
  [Points](/p/grade10-site/loyalty/points). The owner's call, made 2026/10/30
- **Counting a purchase when it lands** — rather than on its order date, so
  no period a member was shown is ever re-judged. Only a till sale or a ticket
  bought on an email can land after the purchase, and either counts once it
  lands after joining. The owner's call, made 2026/10/29; narrowed to those
  two 2026/10/30

## Keeping a Tier

What the member earns inside the period decides what happens at the end of
it.

- **Silver** — a new 12-month Silver period starts where the last one ended;
  whatever it earned short of 500 is gone
- **Gold, ≥ 500 points** — a new Gold period starts where the last one ended
- **Gold, < 500 points** — the member drops to Silver and a fresh Silver
  period starts the instant after; a live invitation keeps them on Black
  above it
- **Taken back by an operator** — a tier reached or granted in error is
  removed on the record, whatever its period says; it takes its own
  permission, `loyalty:demote`, apart from granting an invitation, so an
  operator who may only move points or invite cannot demote anyone

- **Removing a tier is its own permission** — `loyalty:demote`, as the
  programme and the console hold it, not the invitation permission this page
  once named. The owner's call, made 2026/10/30

- ❓ **Retention threshold** — 500 today, the same figure that reaches Gold,
  because the programme sets no separate one. A softer figure around 400 is
  under review; it is a new key on the Gold rung, and it changes the size of the
  first downgrade cohort. The owner settles it before the first period ends.
- ❓ **Re-qualifying early** — reaching 500 in month two secures the next
  period, which still counts from zero at its own start, so the rest of the
  year's earning counts toward neither retention nor the next rung. Whether that
  is the intended nudge is the owner's call.

:::callout{kind="note"}
**Tier history is lazily evaluated, i.e. evaluated when read.** 
We have a cron sweep to render the record for analytics purposes.
:::

:::example{title="A member's three years" periods="Gold=gold"}
| When | Event | Points | Balance | Progress | Period |
| --- | --- | --- | --- | --- | --- |
| 2025/01/15 | registers | | 0 | 0 | Silver · to 2026/01/15 |
| 2025/02/10 | buys $2,500 · 250 at 1× | +250 | 250 | 250 | |
| 2025/11/01 | buys $2,000 · 200 at 1×, fifty short | +200 | 450 | 450 | |
| 2026/01/15 | the Silver period ends at the close of the day on 450 · a new one counts from zero | | 450 | 0 | Silver · to 2027/01/15 |
| 2026/02/14 | buys $1,000 · 100 at 1× | +100 | 550 | 100 | |
| 2026/03/01 | buys $4,000 · 400 at 1×, reaching 500 — **Gold** | +400 | 950 | 0 | Gold · to 2027/03/01 |
| 2026/03/05 | redeems 500 | −500 | 450 | | |
| 2026/09/20 | buys $5,000 · 600 at 1.2×, past 500 · Gold is kept | +600 | 1050 | 600 | |
| 2027/03/01 | the Gold period ends on 600 · a new one counts from zero | | 1050 | 0 | Gold · to 2028/03/01 |
| 2027/09/20 | twelve months with no activity · the balance lapses | −1050 | 0 | | |
| 2028/02/01 | buys $4,000 · 480 at 1.2×, twenty short | +480 | 480 | 480 | |
| 2028/03/02 | the Gold period ended at the close of 2028/03/01 on 480, short of 500 — **Silver** from midnight | | 480 | 0 | Silver · to 2029/03/02 |
| 2028/03/04 | buys $1,000 · 100 at 1× again | +100 | 580 | 100 | |
:::

::image{src="assets/tier-periods.svg" alt="The same three years as tier progress over time: each period climbs from zero, Gold starts at zero on the order that reaches 500, 600 keeps it, and 480 drops the member to Silver"}

## Black Tier

- **The grant** — an operator's, naming who granted it, why, and optionally
  when it ends; revocable, and a member holds at most one live invitation per
  tier
- **No end date** — it holds until it is revoked
- **Its end is observed, not scheduled** — the member stops holding Black the
  instant the date passes and lands on the tier they earned beneath it, in the
  period that was running there all along; the history records it at the next
  evaluation
- **Never the earned floor** — every evaluation runs twice, once ignoring
  invitations and once with them, so a Gold earned while invited survives
  losing the invitation, and an invitation neither raises what was earned nor
  moves a period
- **An invitation never moves a period** — a Silver member at 300 in a period
  from January, invited to Black in May, who earns 150 while invited and loses
  the invitation in August, is back on Silver in the same January period at
  450, ending the next January. Starting a fresh period when the invitation
  ended would have thrown the 450 away. The owner's call, made 2026/10/30
- ❓ **Annual cap and approval** — the owner's draft asks for both; neither is
  fixed and the programme enforces neither, so an invitation with no end date
  holds until revoked. The owner's call
