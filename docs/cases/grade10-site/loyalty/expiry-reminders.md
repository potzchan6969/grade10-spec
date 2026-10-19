---
page: grade10-site/loyalty/expiry-reminders
reviewed: TBC
---

The page's own examples are cases too, cited by their ids:
`reminder-thirty-days` and `reminder-day-moves`. The rows below prove what no
example walks. Cite one as `grade10-site/loyalty/expiry-reminders#<id>`.

## Values

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| one-point-owed | a member holding 1 point, its day 10 days off | the programme is asked who is owed a reminder | a reminder naming 1 point | |
| clock-hong-kong | a balance lapsing 2027/02/02, the clock at 23:59 on 2027/01/02 Hong Kong time | the clock passes 00:00 on 2027/01/03 Hong Kong time, still 2027/01/02 in UTC | nothing owed before midnight; one reminder after it, naming the 30-day lead | |
| one-per-lead | a member owed a reminder on Grade10's programme | the programme is asked again, any number of times | the same reminder, never a second one | smoke |

## Raising a Reminder

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| no-points-nothing-owed | a member holding no points, the date on their window 10 days off | the programme is asked | nothing owed | |
| outside-every-lead | a member whose day is further off than every lead time | the programme is asked | nothing owed | |
| two-leads-two-reminders | a programme with leads of 30 and 7 days, a member whose day is 5 days off | the programme is asked | two reminders for the day, one naming 30 and one naming 7 | |
| no-lead-setting | a programme with no lead-time setting | it starts | it starts, and no member is owed a reminder | |
| lead-setting-refused | a lead-time setting with no lead, a lead of 0, a lead repeated, or 365 days on a 12-month window | the programme starts | it does not start, and names what it refuses | smoke |
| lead-364-starts | a lead of 364 days on a 12-month window | the programme starts | it starts | |
| redeem-drops-reminder | a member owed a reminder | they redeem | no reminder for the old day from that moment; none for the new day until it is within a lead | |
| restart-drops-reminder | a member owed a reminder | an operator restarts their window | no reminder for the old day; none for the new day, 12 months off | |
| grant-onto-nothing-drops-reminder | a member owed a reminder for 2027/01/13, every point corrected away on 2027/01/03 | an operator grants or corrects 50 points onto the balance | no reminder for 2027/01/13; the new day is 12 months from the grant | |
| late-order-moves-day | a member owed a reminder for 2027/01/13, 500 points | an order of 2026/01/20 earning 10 points is recorded late | no reminder for 2027/01/13; one for 2027/01/20, 510 points | |
| clawback-to-nothing | a member owed a reminder | a refund claws back the whole balance, the day in place | the reminder is no longer owed, at once | |
| correction-to-nothing | a member owed a reminder | an operator corrects the whole balance away | the reminder is no longer owed, at once | |
| account-deleted | a member owed a reminder | they delete their account | no reminder owed to them from that moment | |
| lapse-unread | a reminder nothing has ever read | the day passes | it is no longer owed | |
| lead-taken-out | a programme with leads of 30 and 7 days, a member owed both | it starts again with the 7 taken out | no reminder naming 7; the one naming 30 is the same as before | |
| points-returned-owed-again | a member owed a reminder, brought to nothing, the day 20 days off | a redemption is reversed, or points paid at checkout come back by a refund or an operator | the same reminder is owed again, never a second one | |

## What a Reminder Holds

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| reminder-names-four | a member owed a reminder | it is read | it names the member, the day, the points expiring on it and the lead time | smoke |
| clawback-count-current | a member owed a reminder naming 500 points | a refund claws back 100, the day in place | the same reminder, naming 400 points | |

## Delivery

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| nothing-sent | a member owed a reminder | any time while it is owed | no message reaches them by any channel, and no surface they read shows it | smoke |
