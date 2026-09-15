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
| Clock | Asia/Hong_Kong, the same clock the window runs on |
| Repeats | 🚧 One reminder per member, per expiry date, per lead time |

## Raising a Reminder

🚧 The programme works out which members are close to losing points, and
records that each of them is owed a reminder.

- 🚧 **Owed by the balance's own date** — a member is owed a reminder once
  their balance expires within a lead time and they still hold points that
  expire on it — [Points](/p/grade10-site/loyalty/points#expiry)
- 🚧 **Named by its lead** — the reminder carries which lead time raised it,
  so two lead times on one date are two reminders and never one repeated
- 🚧 **Raised once** — the same member, day and lead time raise one reminder,
  however often the programme looks
- 🚧 **Dropped when it stops being true** — buying, redeeming or an operator
  restarting the window moves the day, and a reminder still owed against the
  day it replaced is dropped
- 🚧 **Dropped when there is nothing left** — a balance spent to nothing, and
  a day that has passed, drop what is still owed

## What a Reminder Holds

- 🚧 **The member** — who it is owed to
- 🚧 **The day** — the day their balance expires
- 🚧 **The points** — how many of their points expire on it
- 🚧 **The lead time** — which one raised it

## Delivery

🚧 A reminder is the record that one is owed, not a message. Nothing reads it
yet, so no member is told anything.

❓ **Which channel carries it** — email, a push notification, the member card
in a wallet, the site itself, or more than one. Product.

:::detail{title="Product decisions" for="pm"}
A member who loses points they meant to spend has been failed by the
programme, not by their own inattention. Measured by the share of members who
spend rather than lose a balance that was about to lapse.

Raising the reminder and carrying it are two decisions, and only the first is
settled. A record that names no channel can be read by any channel later
without the rule for who is owed one changing again.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| What is raised | Decided | A record that a reminder is owed, naming the member, the day, the points and the lead time. | Product |
| Why nothing is sent yet | Decided | The channel is its own choice; the record is what lets it be made later. | Product |
| Lead times | ❓ Open | How many days before the day, and how many reminders. | Product |
| Smallest balance reminded about | ❓ Open | Whether a balance too small to spend is worth a reminder. | Product |
| Which channel carries it | ❓ Open | Email, push, the wallet card, the site, or more than one. | Product |
| Declining reminders | ❓ Open | Whether a member can turn them off, and where. | Product |
:::
