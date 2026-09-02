# Design: ZZZ site navigation

Capability delta:
[`zzz-site/site/navigation`](specs/zzz-site/site/navigation/spec.md).
Motivation: [proposal.md](proposal.md) — Why.

## Context

The ZZZ site renders three views from one address: the app root switches on a
signing-in flag and the session, so the address bar never moves and nothing
can be pointed at. There is no route table, no history handling, and no
not-found — an unknown address renders whatever the session decides. The
`zzz` product has no capabilities recorded; this change writes its first.

The grade10 site has gone well past adopting a router since. It runs the
framework with `ssr: true` behind a worker of its own: one address table
(`src/surfaces.ts`) that the route modules, the chrome and the worker all
read, a written document for every surface that answers at one address, an
address per language, and a status that says what happened.
`docs/architecture/serving.md` and the `frontend-structure` skill are where
that shape is written down, and `grade10-site/site/navigation` is what the
navigating half of it promises.

ZZZ takes the navigating half and leaves the serving half. What is
ZZZ-shaped is decided here; everything else is read from those two documents
rather than re-decided.

## Goals / Non-Goals

- **Goal:** the two brands promise the same navigation behavior, each under
  its own product's capability, so a collector and an engineer meet one
  contract on both.
- **Goal:** one set of conventions across the two apps — the same framework,
  the same address table, the same route-module shape — so moving between
  them costs nothing to learn.
- **Goal:** today's behavior survives by specification — home stays the
  signed-out surface, the session still decides what a collector sees.
- **Non-goal:** crawlability, and the honest statuses that come with it. ZZZ
  keeps answering every address with the app shell, so an address the site
  does not answer renders not-found under a 200; a ZZZ change that wants
  what `grade10-site/site/crawlable-pages` promises owns both.
- **Non-goal:** a `ui.md`. The one new view — not-found — is the smallest
  honest statement built from existing design-system primitives over copy the
  platform already ships; no Figma frame exists or is needed, and nothing
  else changes visually.

## Decisions

### The framework, without the worker

The app adopts the framework grade10 runs — the `@react-router/dev` Vite
plugin, a root module, one thin route module per surface lazily importing its
view, generated route types — and stops there. `ssr: false`, no prerender
list, and wrangler keeps answering every address with the shell
(`not_found_handling: "single-page-application"`), which is what the site
serves today.

grade10 put a worker in front of its assets because a crawler reads its
pages: it resolves an address through the route table and refuses an unknown
one with a 404. ZZZ's three views are session-shaped and nothing crawls them,
so that worker would be machinery with no reader — and a soft 200 on an
address a collector mistyped costs them nothing the not-found surface does
not already tell them. The day ZZZ grows a public storefront, the worker and
its address-to-document matcher arrive with that change, reading the address
table this one puts there.

*Alternatives:* adopt grade10's serving shape now — rejected: prerendering,
statuses and share metadata are the crawlable-pages problem, and solving it
for a site with no public surface buys nothing and doubles what a ZZZ deploy
is. Hand-roll a route table and address hook — rejected: it re-creates the
machinery grade10 retired. A different router for a three-view app —
rejected: two brands on two routing conventions doubles what every engineer
carries for no behavior.

### The address table, even for three addresses

`src/surfaces.ts` names every address and the pattern each surface matches;
`src/routes.ts` gives each one a route module, and `src/routes/<surface>.tsx`
holds its `handle`, the props its page takes, and nothing else. Three
addresses do not need a table — the convention does, and it is what a
storefront, a worker, or a second language would each read instead of
inventing their own.

### The document moves into the root module

Framework mode renders the document, so `index.html` retires and what it and
`main.tsx` carry moves into the app: `lang="ko"` on the root module's
layout, `BrandIntlProvider brand="zzz"` around the outlet, the dev sign-in
mount in the client entry. The localization capability's *The ZZZ document is
Korean* is asserted today against `index.html` read as text; it moves to the
rendered root, or it stops being covered without anything failing.

### Home stays the signed-out surface

`/` answers home for a collector without a session and corrects a signed-in
collector to `/profile`, replacing the entry. This preserves exactly what the
session decides today — a signed-in collector has never seen home — while
giving the profile the address it never had.

*Alternatives:* make home public for everyone — rejected: home offers only a
sign-in prompt, so showing it to a signed-in collector is a behavior change
smuggled into a routing change; the storefront change that gives home
something to offer revises this. Keep the profile answering at `/` —
rejected: two addresses for one surface, and no address means home.

### Not-found arrives with addresses

Once addresses exist, an unknown one has to answer something, and answering
home is the soft-404 habit the grade10 site's specs already refuse. The site
gains a minimal not-found view naming the failed address, rendered without
waiting for the session — the session has no say over an address the site
does not answer.

Its words already exist: `notFound.title` and `notFound.description` are
brand-neutral keys answered in Korean, so the view is composition over the
shared catalogue rather than new copy.

*Alternatives:* resolve unknown addresses to home — rejected above. Reuse the
grade10 site's not-found page — rejected: pages are brand-owned view code;
what is shared is the requirement's shape and the copy, not the component.

### Feature packages stay router-free

The rule `grade10-site/site/navigation` already holds the grade10 app to, now
load-bearing from both sides: `@grade10/store-frontend` and
`@grade10/auth-frontend` serve both brands, so a router import in either
would bind the two apps' routing choices together. Views read the address and
hand features props.

## Risks

- **Two shapes across the brands.** grade10 serves rendered documents from a
  worker; ZZZ serves a shell. The `frontend-structure` skill says today that
  the other SPAs route by hand and ship an `index.html` — both stop being
  true here, so this change corrects what an engineer reads rather than
  leaving them to find out. What the difference is and why lives in
  `docs/architecture/serving.md`.
- **Convention drift between the brands.** Two apps now hold route modules
  independently. Mitigated by structural sameness — same plugin, same address
  table, same module shape — and by both capabilities' scenarios pinning the
  same behavior.
- **A session flash at `/`.** Home is session-decided, so it waits for the
  session like the profile does; the wait is the same one the whole app
  imposes today, not a regression.
