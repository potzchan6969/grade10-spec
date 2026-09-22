## Context

ZZZ's `SessionDecided` already answers an arrival at the profile without a
session correctly in every respect but one: it opens the dialog over the
profile's own address and keeps the collector there while they sign in. What
it does not do is give them anywhere to go if they leave without one — the
dialog closes and the blank page stays.

`grade10-site` solved the identical problem in `ask-sign-in-before-navigating`
by sending a dismissed arrival to the marketing address, replacing the entry.
ZZZ has one gated surface rather than several, and no in-app link ever
navigates to it, so this change carries only that fix — not the navigation
guard grade10-site also built, which would have nothing to guard here.

## Goals / Non-Goals

**Goals:**

- A collector who dismisses sign-in at the profile's address lands somewhere
  they can read, with Back leading where they came from.

**Non-Goals:**

- A navigation guard before an in-app link to the profile — none exists.
- Home's self-correction for a signed-in visitor, and `/login`'s redirect —
  both already correct, untouched.

## Decisions

### The fix is `SessionDecided` alone

`SessionDecided` already holds the one place that knows both "this is an
arrival, not an asked-for navigation" and "the session answered none" — the
same effect that opens the dialog is where leaving it is noticed. Grade10's
solution is a `useRef` flag for whether the dialog has been shown and a
`useNavigate` call on the transition from shown to gone with still no
session; the same shape ports directly, keyed off `asked !== "home"` in place
of grade10's per-surface `signedOut: "ask"` table, since ZZZ has exactly one
surface this applies to and nothing to look up.

- **Rejected: extending ZZZ's `ROUTES` with grade10's `kind`/`signedOut`
  classification.** Three routes, one of them gated — a lookup table buys
  nothing a single condition does not already say, and it would carry the
  `"open"` branch grade10-site needs (a booking's private link, the signing
  ceremony) that nothing in ZZZ has a use for.

## Risks / Trade-offs

- **[Home's own redirect-when-signed-in could interact with the new
  dismiss-to-home navigation]** → They are opposite directions on different
  triggers — one fires on arrival with a session, the other on dismissal
  without one — and neither surface is ever in both states at once.
