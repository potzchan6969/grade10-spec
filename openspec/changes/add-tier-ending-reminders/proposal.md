# A warning before a Gold period ends

**Author:** @tangconst - 2026-11-02

Product context: [Tier Reminders](../../../docs/prds/products/grade10-site/loyalty/tier-reminders.md),
[Tiers](../../../docs/prds/products/grade10-site/loyalty/tiers.md).

## Why

A Gold member who earned short of the keep line drops to Silver the
instant their period closes — a demotion they may learn about only when
their next order earns less. The programme knows the period's end and the
points still needed months ahead; nothing warns the member.

The points expiry reminder already proves the shape: the programme
answers who is owed a warning, and email carries it. This change raises
the same kind of reminder for a tier period closing below the keep line
and ships it on the same channel.

The measurable claim: **share of Gold members who reach the keep line
before their period ends rather than dropping to Silver**.

## What Changes

- **A tier reminder is owed when the period is closing.** A Gold member
  whose period ends within a lead time, and whose points earned inside it
  fall short of keeping the tier, is owed a reminder naming the member,
  the day the period ends, the points earned and the points still needed.
- **One reminder per member and period end.** Asking again raises no
  second one; a member who reaches the keep line is owed nothing more.
- **A reminder that stops being true is gone at once.** Reaching the keep
  line, the period ending, or a refund or an operator removing the tier
  drops what is still owed.
- **Email carries it.** The owed reminder is sent to the member's
  address, once per member and period end; the letter lives in
  `apps/emails/emails/loyalty/gold-tier-ending`, zh-HK with an English
  preview variant.

## Non-Goals

Decided in [decisions.md](decisions.md): warnings for Silver periods and
Black invitations, a second channel, and any change to how tiers are
earned, kept or dropped.

## Capabilities

- **New Capabilities**
  - `grade10-site/loyalty/tier-reminders` — a member owed a warning
    before their tier period closes below the keep line, carried by
    email. Mirrors `grade10-site/loyalty/expiry-reminders` in shape.

## Impact

- `apps/emails/emails/loyalty/gold-tier-ending*.tsx` — the letters this
  change sends, already drafted as preview source.
- Consuming application: grade10-site — the email goes to every Gold
  member owed one under the new raising rules.

## Open Questions

- **Lead time** — the points reminder carries 30 days; this change starts
  from the same value. ❓ Product, open on the capability page.
- **Silver periods and Black invitations** — neither owes a warning yet;
  whether either should is open. ❓ Product.

## Follow-on changes

- A member reaching Gold late in a Silver period could hear the upside
  the same way — an upgrade nudge reading the same period facts.
