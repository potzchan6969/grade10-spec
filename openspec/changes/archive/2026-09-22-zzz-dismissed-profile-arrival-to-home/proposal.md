**Author:** @sean - 2026-09-15

## Why

A signed-out collector who opens ZZZ's profile address directly — a typed
address, a bookmark, going back to it — is asked to sign in over a blank
page, and the durable spec still says dismissing correct the address to
sign-in. It does not: dismissing leaves the collector on `/profile` with
nothing on it and no way off it but the header, which offers nothing either.
`grade10-site` had the same defect and fixed it in
`ask-sign-in-before-navigating`; ZZZ never got the same fix.

ZZZ has no in-app link to the profile at all today — home's Sign In button
opens the dialog in place rather than navigating, and nothing else points at
it — so the other half of that change, the guard that asks before an in-app
navigation, has nothing in this product to guard. This change carries only
the part ZZZ actually needs.

**Metric:** share of signed-out profile arrivals that end with the collector
back on a readable surface, whether by signing in or by dismissing.

**Acceptance signal:** opening `/profile` signed out shows the dialog over a
blank page as it does today; dismissing it now renders home instead of
leaving the collector on the blank page.

No domain impact: `zzz-site/site` carries no domain suite, and no
cross-feature path traces a navigation journey.

## What Changes

- **Dismissing a profile arrival goes home.** A collector with no session who
  leaves the sign-in dialog at the profile's address is taken to home,
  replacing the entry the profile holds, so going back leads where they came
  from rather than to the profile asking again.
- **The durable requirement is corrected to match what ships.** "The session
  corrects a session-decided address" has stated since it was written that a
  signed-out profile visit is corrected to the sign-in address; the site has
  never done that — the address stays `/profile` and the dialog opens over it.
  This narrows that requirement to home and sign-in, which do still correct,
  and gives the profile its own requirement stating what it actually does.
  Home and sign-in's rules restate under new ids; `zzz-site-site-navigation-SC-06`
  retires outright and is not reissued.

## Non-Goals

- **A navigation guard before an in-app link.** `ask-sign-in-before-navigating`
  built one for grade10-site because links to its gated surfaces are
  everywhere; ZZZ has none pointing at the profile, so there is nothing to
  guard. Building it now would be untested machinery for a navigation pattern
  the product does not have.
- **Home's self-correction for a signed-in visitor.** That is the opposite
  direction — "you don't need this page" rather than "you need an account" —
  and is untouched.
- **The stale sign-in address's own redirect.** `/login` already sends every
  visitor on to home or the profile depending on session; unaffected.

## Capabilities

### Modified Capabilities

- `zzz-site/site/navigation`: what the profile does for a collector who
  arrives with no session, and the narrowing of the address-correction
  requirement that no longer covers it

## Impact

- ZZZ's `SessionDecided` gains the same front-door-on-dismissal behaviour
  `grade10-site`'s already has, scoped to its one gated surface.
- One durable test case (`zzz-site-site-navigation-US2-TC3-1`, still `draft`)
  asserted the wrong behaviour and is replaced.

## References

- [Navigation · The Profile Without a Session](../../../docs/prds/products/zzz-site/site/navigation.md#the-profile-without-a-session)

## Follow-on changes

- A navigation guard becomes worth building the day something in ZZZ links to
  the profile in-app.
