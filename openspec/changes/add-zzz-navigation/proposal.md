# ZZZ site navigation

**Author:** @seankcw - 2026-08-18

## Why

The ZZZ site has one address. Home, sign-in, and the profile all answer at
`/`, switched by component state and the session — so nothing in the app can
be pointed at. A collector cannot bookmark sign-in or share their way back
to it; a refresh mid sign-in forgets where they were and lands them home;
Back leaves the site instead of stepping back to home; and no mail the site
ever sends can link deeper than the front door.

`adopt-react-router` gives the grade10 site a routing foundation and specs
its navigation behavior. ZZZ is the second brand assembled from the same
packages, about to grow the same kinds of surfaces, and today it has neither
addresses nor a single capability recorded for its product. Giving its
three views addresses on the same foundation costs little now and sets the
contract every ZZZ surface after them inherits.

**Metric:** addresses the ZZZ site answers — from one to every view it
has, and growing with each surface instead of staying at one.
**Acceptance signal:** a shared or mailed link to sign-in or the profile
lands there, and a refresh mid sign-in stays on sign-in.

## What Changes

- **Every view gets an address.** Home at `/`, sign-in at `/login`, the
  profile at `/profile`, on the same routing foundation
  `adopt-react-router` decides — and an address the site does not answer
  gets an honest not-found view instead of quietly showing home.
- **Navigation becomes the ZZZ site's first capability.** Which surface an
  address resolves to, how the session corrects one, and what a navigation
  preserves — the same contract the grade10 site specs, bound to this
  product.
- **What each view offers does not change.** Home stays the signed-out
  surface; a signed-in collector at `/` is corrected to their profile, as
  the session decides for them today.

## Non-Goals

- **Crawlability.** No prerendering, no sitemap, no per-view identity work;
  if ZZZ wants what `add-crawlable-public-pages` gives grade10, that is its
  own change against these addresses.
- **New surfaces or a storefront.** The three views the app has, plus the
  not-found view honesty requires. The day ZZZ grows a real storefront at
  `/`, that change revises what home answers.
- **Data loading through the router.** Same boundary as
  `adopt-react-router`.
- **Feature packages touching the router.** `packages/*/frontend` stays
  router-free, for both brands, for the same reasons.

## Capabilities

### New Capabilities

- `zzz/navigation`: the first capability of the `zzz` product —
  which surface an address resolves to, how the session corrects a
  session-decided address, what a navigation preserves, and what code a
  surface loads.

### Modified Capabilities

None.

## Impact

- **ZZZ SPA (`apps/frontend/zzz`)** — the whole change lands
  here: the build adopts the framework's Vite plugin, the three views
  become route modules, a small not-found view arrives, and the
  state-switched rendering in the app root retires. Two dependencies
  arrive: `react-router` and `@react-router/dev`.
- **This repository** — nothing beyond this change. No component, token, or
  shared package changes.
- **Backend services** — none touched.
- **Deployment** — the app keeps deploying as one unit of static assets
  from the same worker.
