**Author:** @sean - 2026-09-15

## Why

A collector without a session who follows a link to the vault, the checkout,
their profile or their bids is taken there and asked afterwards. The address
becomes the one they asked for, the surface renders nothing, and the sign-in
dialog opens over the blank. Dismissing it leaves them on a page with nothing
on it, and the only way on is the chrome.

The header links one of these surfaces on every page, and the product pages,
the cart drawer and the membership sections link others, so this is one click
away from most of the site. The dialog is the right answer and already works;
what is wrong is that the navigation is spent before anyone asks whether the
collector can use what it leads to.

**Metric:** share of signed-out link follows to an account surface that end in
a session in the same visit, and the share that end with the collector back on
a public surface having pressed nothing but Dismiss.

**Acceptance signal:** a signed-out collector who follows the header link to
the vault stays on the page they were reading with the sign-in dialog over it;
dismissing leaves that page as it was; signing in renders the vault without a
second press.

No domain impact: `grade10-site/site` carries no domain suite, and no
cross-feature path traces a navigation journey.

## What Changes

- **The ask comes before the address changes.** A navigation taken inside the
  site to a surface that has nothing on it without an account does not move the
  address. The sign-in dialog opens over what the collector was reading, and
  dismissing it leaves that page as it was.
- **Signing in carries them on.** A session arriving while that dialog is open
  takes the collector to the surface they asked for, with nothing to press a
  second time.
- **An address opened from outside is answered where it lands.** A typed
  address, a bookmark, a mailed link or the back button lands on the surface
  itself, which asks there. This already runs and has never been written down.
- **Each session-shaped surface says which it is.** The ones opened by a secret
  in their link, and the one that invites sign-in in its own words, are entered
  as asked.
- **The address correction is retired.** The durable spec still says the profile
  address answers sign-in and the sign-in address answers the profile, each
  replacing the entry it corrects. The site stopped doing that when sign-in
  became a dialog; the requirement has outlived it and this change replaces it
  rather than leaving the capability contradicting itself.

## Non-Goals

- **Changing the sign-in dialog.** `shared/ui/auth-sign-in` already fronts
  mid-flow sign-in; this change only says when the site summons it.
- **Where an email sign-in lands.** Following a link leaves the page, so the
  collector comes back to the brand home rather than the surface they asked
  for. That is today's behaviour for every sign-in, not something this change
  introduces, and carrying the intended address through the link is its own
  change.
- **Holding back and forward.** The browser has already moved by the time the
  site can be consulted, and stopping it would leave the address and the page
  disagreeing. Those arrivals are answered on the surface.
- **A collector's own visits.** That page invites sign-in in its own words, and
  asking first would hide the invitation behind a dialog.
- **Which surfaces need an account.** The set is the one in force today; this
  change writes it down rather than revising it.

## Capabilities

### Modified Capabilities

- `grade10-site/site/navigation`: where a surface that needs an account asks
  for one — before an in-app navigation rather than after it — and the
  retirement of the address correction it replaces

## Impact

- The grade10 site's address table gains a second answer per session-shaped
  surface, and one guard above every route reads it.
- The shared sign-in overlay carries what an ask was for, so a session
  arriving in page finishes the navigation the collector was stopped on.
- Two suites that asserted the old behaviour — the address changing to the
  profile while signed out — assert the new one.

## References

- [Navigation · Surfaces That Need an Account](../../../docs/prds/products/grade10-site/site/navigation.md#surfaces-that-need-an-account)
- [Sign-In Dialog](../../../docs/prds/products/shared/ui/auth-sign-in.md)

## Follow-on changes

- An email sign-in could finish on the surface the collector asked for, rather
  than the brand home, by carrying that address through the link.
- The same rule could cover the ZZZ site, whose session surfaces still ask
  after the navigation.
