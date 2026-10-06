---
title: Expiry Reminders
spec: grade10-site/loyalty/expiry-reminders
order: 10
---

## Values

| Rule | Value |
| --- | --- |
| Lead times | ❓ How many days before the day, and how many reminders. Product |
| Smallest balance reminded about | ❓ Whether a balance too small to spend is worth a reminder. Product |
| Clock | 🚧 Asia/Hong_Kong, the same clock the window runs on |
| Repeats | 🚧 One reminder per member, per expiry date, per lead time |

## Raising a Reminder

🚧 The programme works out, whenever asked, which members are owed a
reminder.

- 🚧 **Owed by the balance's own date** — a member is owed a reminder once
  their balance expires within a lead time and they still hold points that
  expire on it — [Points](/p/grade10-site/loyalty/points#expiry)
- 🚧 **Lead times that cannot work are refused** — an empty set, a lead
  repeated, a lead under 1 day, or a lead as long as the window or longer,
  365 days on 12 months, stops the programme from starting
- 🚧 **Named by its lead** — the reminder carries which lead time raised it,
  so two lead times on one date are two reminders and never one repeated
- 🚧 **Raised once** — the same member, day and lead time raise one reminder,
  however often the programme looks
- 🚧 **Dropped when the day moves** — buying, redeeming or an operator
  restarting the window moves the day, and a reminder still owed against the
  day it replaced is dropped
- 🚧 **Dropped when there is nothing left** — the balance lapsing, or a
  claw-back, a correction or a deleted account bringing it to nothing, drops
  what is still owed
- 🚧 **Gone at once** — a reminder stops being owed the moment its day moves,
  its balance empties or the balance lapses, with nothing waiting on a nightly
  pass

## What a Reminder Holds

- 🚧 **The member** — who it is owed to
- 🚧 **The day** — the day their balance expires
- 🚧 **The points** — how many of their points expire on it, kept current
  while the day stands
- 🚧 **The lead time** — which one raised it

## Delivery

🚧 A reminder says that one is owed; it is not a message. Nothing reads it
yet, so no member is told anything.

## Carrying a Reminder

- ❓ **Which channel carries it** — email, a push notification, the member card
  in a wallet, the site itself, or more than one. Product
- ❓ **Declining reminders** — whether a member can turn them off, and where.
  Product

:::detail{title="Product decisions" for="pm"}
A member who loses points they meant to spend has been failed by the
programme, not by their own inattention. Measured by the share of members who
spend rather than lose a balance that was about to lapse.

Raising the reminder and carrying it are two decisions, and only the first is
settled. A reminder that names no channel can be read by any channel later
without the rule for who is owed one changing again.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| What is raised | Decided | That a reminder is owed, naming the member, the day, the points and the lead time. | Product |
| Why nothing is sent yet | Decided | The channel is its own choice; knowing who is owed a reminder is what lets it be made later. | Product |
| How lead times are set | Decided | As a set the programme carries, so one reminder or a ladder is a value rather than a rule; a programme that carries none owes no reminder. | Product |
| Lead times | ❓ Open | How many days before the day, and how many reminders. | Product |
| Smallest balance reminded about | ❓ Open | Whether a balance too small to spend is worth a reminder. | Product |
| Which channel carries it | ❓ Open | Email, push, the wallet card, the site, or more than one. | Product |
| Declining reminders | ❓ Open | Whether a member can turn them off, and where. | Product |
:::
