## Goals

- A Gold member below the keep line with their period closing is told —
  the day it ends and the points still needed — in time to keep the tier.
- A member never receives a warning that has stopped being true.

## Non-Goals

- Changing how tiers are earned, kept or dropped — the ladder, the keep
  line and the period rules on Tiers are untouched.
- Warnings for Silver periods (which roll over) or Black invitations
  (whose end is operator-set and observed, not scheduled) — both open on
  the capability page.
- A second channel — email alone ships here, matching the points
  reminder's channel.
- Points expiry reminders — already raised and being carried by
  `carry-expiry-reminders-by-email`.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Who is owed a tier reminder? | A Gold member whose period ends within a lead time and whose earned points in it fall short of the keep line - decided by the author, 2026-11-02; carried by the raising requirement | Warning every member, or warning Silver members approaching Gold — the settled line is the member about to lose something they hold |
| Q2 | What does the reminder name? | The member, the day the period ends, the points earned in it and the points still needed to keep the tier - decided by the author; carried by the raising requirement | Naming only the day — without the gap, the member cannot tell whether to act |
| Q3 | Which channel carries it? | Email, the channel the points expiry reminder ships on - decided by the author; carried by the page's Carrying a Tier Reminder | Push or the wallet card first — settling on the one channel already being built keeps the letters and the send identical |
| Q4 | What is the lead time? | ❓ Product - recommended: 30 days, matching the points reminder; the reminder is owed once the period end falls inside it, as a configured value rather than a rule | A longer or shorter lead, or a ladder — a value the programme carries, settled by Product |
| Q5 | Raised once or repeated? | Once per member and period end - decided by the author; carried by the raising requirement | A reminder per lead time in a ladder — moot while one lead stands; a ladder is a later value |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
