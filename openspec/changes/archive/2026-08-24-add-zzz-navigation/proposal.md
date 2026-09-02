# ZZZ site navigation

**Author:** @seankcw - 2026-08-18

## Why

The ZZZ site has one address. Home, sign-in, and the profile all answer at
`/`, switched by component state and the session — so nothing in the app can
be pointed at. A collector cannot bookmark sign-in or share their way back
to it; a refresh mid sign-in forgets where they were and lands them home;
Back leaves the site instead of stepping back to home; and no mail the site
ever sends can link deeper than the front door.

The grade10 site already answers addresses on the framework, and
`grade10-site/site/navigation` specs what navigating between its surfaces does.
ZZZ is the second brand assembled from the same packages, about to grow the
same kinds of surfaces, and today it has neither addresses nor a single
capability recorded for its product. Giving its three views addresses on the
same framework costs little now and sets the contract every ZZZ surface after
them inherits.

**Metric:** addresses the ZZZ site answers — from one to every view it
has, and growing with each surface instead of staying at one.
**Acceptance signal:** a shared or mailed link to sign-in or the profile
lands there, and a refresh mid sign-in stays on sign-in.

## What Changes

- **Every view gets an address.** Home at `/`, sign-in at `/login`, the
  profile at `/profile`, on the framework the grade10 site runs — and an
  address the site does not answer gets an honest not-found view instead of
  quietly showing home.
- **Navigation becomes the ZZZ site's first capability.** Which surface an
  address resolves to, how the session corrects one, and what a navigation
  preserves — the same contract the grade10 site specs, bound to this
  product.
- **What each view offers does not change.** Home stays the signed-out
  surface; a signed-in collector at `/` is corrected to their profile, as
  the session decides for them today.

## Non-Goals

- **Crawlability, and a worker in front of the site.** No prerendering, no
  sitemap, no per-view identity work, and no serving-side refusal: ZZZ keeps
  answering every address with the app shell, so an address the site does not
  answer renders not-found under a 200. If ZZZ wants what
  `grade10-site/site/crawlable-pages` gives grade10, that is its own change
  against these addresses.
- **New surfaces or a storefront.** The three views the app has, plus the
  not-found view honesty requires. The day ZZZ grows a real storefront at
  `/`, that change revises what home answers.
- **Data loading through the router.** A view reads its own data as it does
  today; the router hands it the address and nothing else.
- **Feature packages touching the router.** `packages/*/frontend` stays
  router-free, for both brands, for the same reasons.

## Capabilities

### New Capabilities

- `zzz-site/site/navigation`: the first capability of the `zzz` product —
  which surface an address resolves to, how the session corrects a
  session-decided address, what a navigation preserves, and what code a
  surface loads.

### Modified Capabilities

None.

## Impact

- **ZZZ SPA (`apps/frontend/zzz`)** — the whole change lands here: the build
  runs through the framework's Vite plugin and a `react-router.config.ts`,
  the three views become route modules over one address table, a small
  not-found view arrives, `index.html` retires into a root module that keeps
  declaring Korean, and the state-switched rendering in the app root goes.
  Two dependencies arrive: `react-router` and `@react-router/dev`.
- **The ZZZ worker's wrangler config** — the asset directory follows the
  framework's build output, in every environment. What the worker is stays
  the same: static assets, every address answered with the shell.
- **This repository** — nothing. The not-found copy the view needs is already
  here, brand-neutral and answered in Korean; no component, token, or catalog
  changes.
- **What the grade10 repository documents** — the `frontend-structure` skill
  says the other SPAs route by hand and ship an `index.html`; both stop being
  true, so the skill and `docs/architecture/serving.md` say which shape each
  site runs.
- **Backend services** — none touched.
- **Deployment** — the app keeps deploying as one unit of static assets
  from the same worker.
