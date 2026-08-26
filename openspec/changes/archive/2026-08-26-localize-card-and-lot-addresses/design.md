## Context

See `proposal.md` for why. What shapes the approach is how the grade10 site
already answers an address.

One table names every surface and what kind it is: a surface the build writes a
document for, one rendered when its address is asked for, a session-shaped one,
and a lab. Everything else derives from it — the route modules, the patterns
the worker matches, the head tags, the sitemap. Language was layered on top of
that table by branching on the kind: a surface the build writes a document for
answers at one address per locale, and nothing else does.

That branch conflates two facts that are not the same fact:

- **Does this surface answer at one address per locale?**
- **Did the build write a file for it?**

They coincided while only prerendered surfaces had prefixes. Separating them is
most of this change. The rest is the sitemap, which today is a file the build
writes because it only ever named addresses the build knew.

The addresses are also read from outside the app: the check that reads a build
before it ships, and the serving lab. Neither may drift from the app's own
table, and both derive from it today.

## Goals / Non-Goals

**Goals:**

- One rule for every public surface, derived from the surface table rather than
  restated per kind — a surface added later gets its prefixes by being public.
- The unprefixed public document is the same bytes for every request, so it can
  be cached at the edge and a crawler is answered deterministically.
- The sitemap follows the catalogue without a deploy.

**Non-Goals:**

- Mail. The auction's mailed lot link is typed in a worker against `siteUrl`
  from `@grade10/app-env`; a package may not import an app's surface table, so
  a locale-aware mailed link needs its own address derivation and its own
  change. Today's mailed link keeps pointing at the unprefixed lot, which
  stays valid and redirects a collector who has a remembered locale.
- Prerendering cards or lots. They stay rendered when asked for; the prefix
  multiplies their addresses, not their documents.
- ZZZ, which speaks one language and derives no prefixes at all.

## Decisions

### The prefix follows from being public, not from having a file

Split the one predicate the address layer branches on into two: whether a
surface answers at one address per locale (now: every public surface) and
whether the build wrote a document for it (unchanged: only the prerendered
ones). The route table, the worker's address resolution, the head tags and the
link builders all read the first; only the worker's choice between serving a
file and rendering reads the second.

The prefixed card and lot patterns must be registered ahead of the prefixed
catalogue splat, exactly as the unprefixed ones already are — a surface owns
every address beneath it, so `/tc/store/*` swallows the card unless the card is
matched first. This is the mechanism behind today's mis-serve: the prefixed
splat exists and the prefixed card does not.

*Alternatives considered.* An optional locale segment in a single route
(`/:locale?/store/products/:handle`) collapses the enumeration to one pattern
but breaks a property the current design pays for deliberately: an address
under a prefix no language claims matches nothing and is refused. An optional
segment would match `/tcg/store` and answer it as the store in English. Also
rejected: keeping the branch and adding a second list of "rendered surfaces
that happen to have prefixes" — that is the conflation restated, and the next
kind of surface re-opens it.

### An unprefixed public address always renders the default locale

Today the document served at an unprefixed address is written in whatever
language the request's cookie names. Once every public surface has a prefixed
address, that behavior has no job left: the collector who has a remembered
locale belongs at their own address, and the unprefixed one is the English
canonical.

So the cookie stops deciding the language of a **public** document. It still
decides for a session-shaped surface, which has no prefixed address to move to,
and it still records a pick. The unprefixed public document becomes one set of
bytes for every request.

*Alternatives considered.* Leaving the cookie in place would keep one address
serving three languages with no `Vary` header — a shared cache would hand a
Chinese document to an English reader, and the canonical would be whichever
language the crawler's request happened to imply. Rejected.

### The redirect to a remembered locale stays in the browser

A collector whose memory is not the default is moved to their own address after
hydration, replacing the history entry — the mechanism the prerendered surfaces
already use, inherited by cards and lots as soon as they have variants.

*Alternatives considered.* A redirect issued by the worker off the cookie
reaches the collector sooner, but it puts the cookie back in the response path:
the unprefixed address would again vary by cookie, needing `Vary: Cookie` and
losing edge caching, and any crawler that acquired a cookie would be steered
off the canonical. Rejected for the same reason as above.

### The sitemap is rendered, robots.txt stays written

`robots.txt` names surfaces and a sitemap URL; nothing in it depends on the
catalogue, so it stays a file the build writes. The sitemap is answered by the
application when it is asked for, so that the addresses it names are the ones
the catalogue holds at that moment.

It reads the catalogue through the same seam a route loader does — the
product-page loader already reads one card outside a component through the
installed container — extended with reads that enumerate rather than fetch one:
every card handle, and every lot of every auction. Each belongs beside the
feature that owns it, in its own package, not in the app.

The response carries a cache directive of its own. A crawler refetches a
sitemap on its own schedule and does not need the catalogue to the second, and
without one every fetch walks the whole catalogue.

*Alternatives considered.* Writing the sitemap at build time from a catalogue
read during the build was rejected: it makes every catalogue change a deploy,
and the build would name cards a later deploy has withdrawn. A sitemap index
with a child document per locale was rejected **for now** — see the size risk
below; it is the escape hatch, not the starting shape.

### Cards and lots declare their alternates; the check moves

A card's head gains the same alternates a catalogue page carries, derived from
its own address. The build-reading check can no longer verify the sitemap,
because there is no file to read — that assertion moves to where the render can
be run, which is where the same check already holds the rules for surfaces with
no written document.

## Risks / Trade-offs

- **The sitemap outgrows what a crawler accepts** (50,000 URLs or 50 MB) →
  three locales multiply the catalogue by three. Emit a count the check
  asserts against a threshold below the limit, so crossing it fails a build
  rather than being discovered as a silently ignored sitemap. Sharding into a
  sitemap index is then a deliberate change with a trigger already in place.
- **Every sitemap fetch walks the whole catalogue** → the cache directive on
  the response bounds it. A misbehaving crawler otherwise turns the storefront
  API into the sitemap's rate limit.
- **A card withdrawn from the catalogue leaves indexed prefixed addresses**
  behind → they answer 404 with the not-found surface in that language, which
  is what the unprefixed address already does, and a crawler drops them.
- **Three addresses per card is three times the index surface** → the
  alternates are what tell a crawler they are one card in three languages. A
  card whose alternates are wrong is a duplicate-content problem, so the
  alternates are asserted per card, not only per catalogue page.
- **The unprefixed document stops honoring the cookie before the redirect
  runs** → a collector with a Chinese memory who opens an unprefixed card sees
  English for one paint before landing on their own address. The alternative
  put the cookie back in the response path; this is the accepted cost.
