---
title: Serving a Site's Addresses
order: 2
---

Which address a brand's site answers, and with what. A site with public
surfaces puts a worker in front of the built assets —
`apps/frontend/grade10/src/serving/` is the worked example — and resolves
every address through the application's own route table, never through which
file happens to exist. A site with none serves the assets alone, below. The
table is
`src/surfaces.ts`: the route modules, the chrome and this worker all name a
surface from it, so none of them can disagree about where a surface lives or how
far it reaches. A backend is the one caller outside it — a package may not
import an app, so mail that links to a site types its own path against
`siteUrl`, and moving a surface means moving that too.

## What answers an address

### The assets answer what the build wrote

- `ASSETS` is pointed at `dist/client`, so a file that exists is served before
  the worker runs and never reaches it
- `not_found_handling: "none"` — a miss falls through to the worker.
  `single-page-application` would answer 200 with the marketing shell for an
  address the site does not answer
- `html_handling: "drop-trailing-slash"` — the addresses the sitemap and every
  `og:url` publish are the ones that answer rather than redirect

### A surface owns every address beneath it, unless a nested surface names it

- `SERVED_PATTERNS` gives each surface its own address plus everything under
  it, so `/store/graded/psa-10` is the store and is answered with the store's
  document
- Where more than one surface could own an address, the deepest one naming it
  answers: a mailed lot link at `/auction/listings/<id>` is the lot, not the
  auction, and unfurls as that lot. The router and the worker match through
  the same patterns, so neither has to be told which wins
- A surface that answers at one address is prerendered: the build writes the
  document and the worker serves that file, for the surface's address and for
  every address beneath it that no other surface names — one such address per
  language the site answers in, below
- A surface whose address carries a parameter (`/store/products/:handle`,
  `/auction/listings/:listingId`) has no one document to write, so it is
  rendered when it is asked for — which is what lets a card or a lot name
  itself in the document rather than after a script runs. It still answers at
  one address per language, below
- An address no surface owns is rendered as the not-found surface and refused
  with 404, so nothing about the response claims the address was answered

### Every public surface answers at one address per language

`src/locale/addresses.ts` holds the whole table — which segment a language
claims at the front of an address, and every derivation from it. The default
claims none, so English keeps the addresses the site has always answered at;
`zh-Hant` is `/tc` and `zh-Hans` is `/sc`. Nothing outside that module names a
prefix, and a language the brand gains without one there is a compile error.

Being public is the whole of the rule, so a surface added later inherits its
prefixes by being one. Whether the build wrote a document is a separate
question, and `surfaces.ts` answers it separately: `hasVariants` is the first,
`prerenderedDocument` the second, and conflating them is what once answered
`/tc/store/products/<handle>` with the storefront.

- The route table enumerates the variants over the same route module, so an
  address under a prefix no language claims matches nothing and falls to
  not-found — which is what it is. A card's and a lot's prefixed patterns are
  registered under the prefixed catalogue above them, so the deepest surface
  naming an address still wins there
- The build prerenders the variants of a surface it writes a document for, so
  the document a crawler is handed is already in that language rather than
  switching once scripts run. A card and a lot are rendered when asked for in
  every language alike — the prefix multiplies their addresses, not their
  documents
- Every one of those addresses publishes its variants: a surface's `meta` names
  each of them, a card's and a lot's derived from its own address, and the
  sitemap lists each of them
- The worker hands over the document the address names: its entries are keyed
  by surface and language, and a variant's file is written at the variant's
  own address. A surface with no file is rendered, prefixed or not
- The address decides the language, whatever the request remembers — which is
  what lets a shared link and a search result mean what they say. An
  unprefixed public address is the default language's and reads nothing off
  the request, so the document is one set of bytes for every request and a
  crawler is answered deterministically; a collector whose memory is not the
  default is moved to their own address once the browser has hydrated,
  replacing the history entry
- A session-shaped surface — the profile, sign-in — stays unprefixed and is
  the one thing that still reads the language off the request's `locale`
  cookie, the same cookie the auth service reads for a login email. It has no
  address in another language to be moved to
- A navigation made in the browser asks at the surface's address with the
  framework's `.data` suffix, and the front door's under a placeholder
  segment. Both are read back to the surface's address before the language is
  taken off it, or a navigation into `/tc` would be answered in English

### What a crawler is told to fetch

`src/serving/crawlerDirectory.ts` holds both, and neither carries a host of its
own — the site it is served from is passed in, so what a crawler reads on
staging names staging.

- `robots.txt` is a file the build writes beside the pages. Nothing in it
  depends on what the catalogue holds
- The sitemap it names is not a file. `routes/sitemap.ts` is a resource route:
  it reads every card the storefront holds and every lot the auction holds
  through the same container a route loader reads one card through, and lists
  each of them once per language, so a card the shop gains is listed with no
  deploy in between. Writing one into the build would put it in front of the
  worker and freeze the catalogue at the moment of the deploy, which the check
  that reads a build refuses
- It carries a cache directive of its own, because every fetch walks the whole
  catalogue. How many addresses it named goes out as a gauge, and crossing the
  count this site holds itself to is said out loud — a crawler stops reading at
  50,000 URLs and drops the rest without saying so

### The application answers its own half

A navigation made in the browser rather than in the address bar is served by
the framework, at addresses the framework names: the manifest it discovers a
surface through (`/__manifest`, wherever `build.routeDiscovery.manifestPath`
puts it) and the `.data` it then loads that surface from. Neither is a
document, and both fall inside a surface — the data for a lot falls on the
lot's own. Two rules follow, and breaking either breaks every in-app navigation
while leaving a typed address working:

- Never refuse one for belonging to no surface. Whether something claims a
  surface is read off what came back — a document, by content type — not off
  the address it was asked at
- Never answer one with the document of the surface it sits beneath. That is
  chosen before anything renders, so `serveAddress` reads the address: the
  manifest path the build carries, and the framework's `.data` suffix

## A site with no worker

The ZZZ site has three session-shaped surfaces and nothing a crawler reads, so
nothing sits in front of its assets. Every address is answered with the one
document the build writes, and the route table resolves it once scripts run.

- `not_found_handling: "single-page-application"` — an address no file matches
  is answered with that document rather than falling through to a worker there
  is none of
- So an address the site does not answer comes back `200` and renders the
  not-found surface. The collector is told; the response is not. Nothing reads
  these pages but a browser, which is what makes that trade payable
- The address table is still `src/surfaces.ts`, and the build still writes one
  document — from the root module, in SPA mode, rather than per surface
- The day the site grows a public surface, that change brings the worker: the
  matcher above reads the same table, so what arrives is serving, not a
  rewrite of the application

Both admin panels serve the same way, and always will: every console surface is
behind a session and a grant, so there is nothing for a crawler to read and
nothing to render per request. Their tables say less than a site's — a console
answers the addresses it names and no others, so there is no splat giving a
section everything beneath it and a mistyped address is the not-found surface
rather than the nearest section.

## Refusing an address

### A refusal is the worker's answer, not the render's

The site renders its own not-found surface and the worker rewrites the status,
so a collector sees the site rather than a bare error. What the render asked
for does not carry over: the refusal goes out `Cache-Control: no-store`.

A refusal that inherits the render's directives outlives its own fix. The
framework serves its manifest `public, max-age=31536000, immutable`; a 404
built from that response was stored by every browser that saw it, and no
deploy could correct it — the manifest's address only changes when the client
build's version does, and a fix to serving alone leaves that version untouched.
A browser already holding one is cleared by refetching with `cache: "reload"`,
or by clearing the site's data.

## Debugging a navigation that fails

- A navigation asks for at most two things: the manifest, and the `.data` for
  the surface when a route on the way has a loader. Neither is a document — if
  either answers HTML or a 404, serving claimed something it should not have
- `Error: 404` thrown from `patchRoutesOnNavigation` is the manifest fetch. The
  Network panel's Size column says whether it was answered from the browser's
  cache rather than by the site
- The serving lab at `/demo/serving` (dev only) prints what each address
  answers with, read from the modules serving itself runs
