# Points expiry reminders reach members by email

**Author:** @tangconst - 2026-11-02

Product context: [Expiry Reminders](../../../docs/prds/products/grade10-site/loyalty/expiry-reminders.md).

## Why

The programme already answers which members are owed a warning before
their points lapse — the member, the day, the points, the lead time that
raised it — and nobody is told. A member who never opens the Membership
page still loses every point they hold without one word of warning.

The channel question left open on the page is now settled: email goes
first. The owed reminder names no channel, so a push, the wallet card or
the site can read the same record later without the rule changing.

The measurable claim: **share of members who spend rather than lose a
balance that was about to lapse** — the metric the reminder was raised to
move, finally able to move.

## What Changes

- **An owed reminder is sent by email.** Each owed reminder raises one
  email to the member's address, naming the day their balance expires and
  how many points lapse on it — one send per member, day and lead time.
- **A reminder that stops being owed goes unsent.** The day moving, the
  balance emptying or lapsing, or the programme dropping its lead time
  drops the send with it — a member never reads a warning that is no
  longer true.
- **The letters are designed in the spec store.** Preview letters live in
  `apps/emails/emails/loyalty` (`points-expiring`, zh-HK with an English
  preview variant), written in the `LoyaltyLetter` shell with campaign
  tags on the call-to-action.

## Non-Goals

Decided in [decisions.md](decisions.md): a second channel, a member
opt-out surface, and any change to who is owed a reminder or when.

## Capabilities

- **Modified Capabilities**
  - `grade10-site/loyalty/expiry-reminders` — the reminder owed by the
    programme is now carried by email; a new delivery requirement, the
    raising rules untouched.

## Impact

- `apps/emails/emails/loyalty/` — the letters this change sends, already
  drafted as preview source; the app repo's `@grade10/email` lane renders
  them at send.
- Consuming application: grade10-site — the member-facing email goes to
  every member owed a reminder under the existing raising rules.

## Open Questions

- **Declining reminders** — whether a member can turn them off, and where.
  ❓ Product, open on the capability page; the email ships with no
  opt-out surface until it is answered.

## Follow-on changes

- A push notification or the wallet card reading the same owed reminder —
  the reminder names no channel, so adding one is a delivery change, not
  a rule change.
- A member setting for muting reminders, once Product answers whether
  they can decline.
