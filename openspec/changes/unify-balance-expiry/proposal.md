# One expiry date for a member's whole balance

**Author:** @brianchacha6969 - 2026-09-14

Product context: [Points · Expiry](../../../docs/prds/products/grade10-site/loyalty/points.md#expiry).

## Why

A member reads two dates on one card. Their balance names one day, and points
an operator gave them name another, and buying again moves only the first. The
member has no way to tell the two apart, and nothing on the card explains why
the second did not move.

The headline is worse than confusing. It names the last day any point the
member holds survives to, so a member carrying a grant is shown a date most of
their points will never reach. They are told their points are safe until a day
on which most of them are already gone.

Nothing about the two dates is worth the confusion. A member believes they
have one balance with one expiry, and every purchase pushes it out. The
programme already behaves that way for everything a purchase or a redemption
records; only points an operator added behave otherwise.

The measurable claim: **share of members who spend rather than lose a balance
that was about to lapse**, alongside the count of members who lose points
within thirty days of being shown a later date — which should reach zero.

## What Changes

- **BREAKING — Points an operator adds take the balance's date.** A campaign
  grant, a correction, a welcome bonus and a reward handed over outright all
  expire with the rest of the balance instead of living out a year of their
  own. They still push no date out.
- **Points added to an empty balance start the date.** Where the member holds
  nothing live, the points an operator adds start the window from their own
  day. Nothing that had already lapsed counts again.
- **An operator restarts the window.** One action, no day to pick: the window
  runs again from today. It is how points an operator gave outlive the balance
  they joined, and it is on the record with a reason.
- **BREAKING — Giving a reward outright stops resetting the window.** Handing
  a member a reward they did not spend points for counts as the member's
  activity today and buys their whole balance another year. It is not their
  activity.
- **A reversal into a lapsed balance returns nothing spendable.** Points paid
  and then returned after the window has passed come back already lapsed,
  rather than sitting on the ledger as a balance the next sweep removes.
- **The member's card says one line** — how many points expire and the day
  they go — and warns inside the last thirty days. The separate count of what
  is expiring soon is the same number as the balance now, so it leaves the
  member's summary. It stays on the wire, unread, until no released version
  still asks for it.
- **The console names the date before it writes.** The form that adds points
  states the day those points will expire, and says when they would start the
  member's window rather than join one.
- **Every member's date moves up to the longest-lived point they hold**, once,
  so that no date a member has already been shown moves backwards.

## Non-Goals

- Warning a member before their points lapse. Nothing does today, and this
  change does not add it; it is a ❓ on the Points page.
- Letting an operator choose the day a restart lands on.
- Changing what a purchase or a redemption does to the window.
- Changing what a reversal of an unused redemption restores.

## Capabilities

- Modified: `grade10-site/loyalty/programme`

## Impact

- **Spec store** — the membership summary's export contract gains the expiry
  line and loses the expiring-soon figure; the member's words change in every
  language the programme speaks.
- **Application** — the programme's own service, the member surface, the
  operator console and the till panel. The till reads one date already and
  only its label changes.
- **Members holding points an operator added** carry a date further out than
  the balance they joined. They keep it: the one-off move is upwards.

## Follow-on changes

- Take the expiring-soon figure off the membership summary once no released
  version reads it.
- Warn a member before the day their points lapse.

## References

- [Points · Expiry](../../../docs/prds/products/grade10-site/loyalty/points.md#expiry)
- [Operator Console · Moving Points](../../../docs/prds/products/grade10-site/loyalty/operator-console.md#moving-points)
- [Operator Console · Restarting the Expiry](../../../docs/prds/products/grade10-site/loyalty/operator-console.md#restarting-the-expiry)
- [Profile · Membership Page](../../../docs/prds/products/grade10-site/loyalty/profile.md#membership-page)
- [Paying with Points · Refunds](../../../docs/prds/products/grade10-site/loyalty/paying-with-points.md#refunds)
