---
title: Tier Reminders
spec: grade10-site/loyalty/tier-reminders
order: 11
---

::phase{id="pre-store-launch" priority="P2"}

## Raising a Tier Reminder

- 🚧 **Owed when the period is closing** - a Gold member whose period ends
  within a lead time and whose earned points in it fall short of keeping
  the tier is owed a reminder - [Tiers](/p/grade10-site/loyalty/tiers)
- 🚧 **What it names** - the member, the day their period ends, the points
  they have earned in it and the points still needed to keep the tier
- 🚧 **Raised once** - the same member and period end raise one reminder,
  however often the programme looks
- 🚧 **Gone at once** - a reminder stops being owed the moment the member
  reaches the keep line, the period ends, or a refund or an operator
  removes the tier - [Tiers](/p/grade10-site/loyalty/tiers)
- ❓ **Silver periods** - a Silver period always rolls into a fresh one, so
  there is nothing to warn about; whether a member approaching Gold in
  their Silver period hears anything is open. Product
- ❓ **Black invitations** - an invitation's end is set by an operator and
  observed, not scheduled; whether its end owes a warning is open. Product

## Carrying a Tier Reminder

- 🚧 **Email carries it** - the owed reminder is sent to the member's email
  address, naming the period's end and the points still needed. The
  letters live in `apps/emails/emails/loyalty`. Product
- 🚧 **Lead time** - the reminder is owed once the period's last day is 30
  days off or nearer, one configured lead, the same value the points
  reminder carries

:::detail{title="Product decisions" for="pm"}
A member who drops off Gold without knowing the line was coming has been
failed by the programme, not by their own inattention. Measured by the
share of Gold members who reach the keep line before their period ends
rather than dropping to Silver.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| What is raised | 🚧 Being built | That a reminder is owed, naming the member, the period end, the points earned and the points still needed. | Product |
| Which channel carries it | 🚧 Being built | Email, the same channel the points reminder ships on. | Product |
| Lead time | 🚧 Being built | One lead of 30 days, matching the points reminder; a ladder or a different lead is a value, not a rule ([9gag/grade10#1693](https://github.com/9gag/grade10/issues/1693#issuecomment-6571705441)). | Product |
| A Gold member under a Black invitation | 🚧 Being built | Owed no reminder while the invitation stands: the member sees Black and loses nothing they can see this period ([9gag/grade10#1693](https://github.com/9gag/grade10/issues/1693#issuecomment-6597982648)). | Product |
| Silver periods and Black invitations | ❓ Open | Neither owes a warning yet: Silver rolls over and an invitation's end is operator-set. | Product |
:::
