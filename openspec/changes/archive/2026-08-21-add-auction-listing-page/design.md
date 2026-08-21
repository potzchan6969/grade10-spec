## Context

The grade10 site keeps every address it answers in one table, each surface
declaring its address and how it is served: a surface written by the build, or
one rendered when its address is asked for. A lot's address was the single
route that table did not carry — it was matched by a pattern kept beside the
table, and served as an address nested inside the prerendered auction.

`grade10-store/product-page` already solved the same problem for a card, and
this change follows it rather than inventing a second shape. What a lot is,
how bidding works on it and what the catalogue publishes are settled in
`grade10-auction/auction` and do not move here.

Requirements are in the delta specs; motivation is in `proposal.md`.

## Goals / Non-Goals

**Goals:**

- A lot's address is a surface in the table like any other, so the route, the
  mailed link and what serving matches all derive from one declaration.
- The served document carries the lot, and stays on screen once scripts run.
- Follow the card's shape closely enough that the two stay comparable.

**Non-Goals:**

- A sitemap rendered from the catalogue. Cards are waiting on the same thing;
  when it is built it covers both.
- Any change to bidding, extensions or authorizations.
- Per-locale lot addresses — `add-site-localization` already rules a rendered
  surface out of those.

## Decisions

### The lot is a row in the surface table, not a pattern beside it

The table is what serving, routing and link-minting all read. A lot address
declared outside it is the one address those three could disagree about, and
the mailed link could drift from what the router matches.

*Rejected:* keeping the pattern constant next to the table. It reads as
tidy — the pattern is still derived from the auction's address — but it leaves
the table's claim ("every address this site answers") false by exactly one
entry, which is the drift this design is trying to remove.

*Rejected:* declaring parent/child links between surfaces. Precedence already
falls out of matching (below), so an explicit hierarchy would be a second
mechanism saying what the first already says.

### Precedence is longest-match, not a declared hierarchy

`/auction/listings/<id>` matches both the auction's subtree pattern and the
lot's own. The router resolves the deepest matching route, and serving matches
through the same patterns, so both pick the lot without being told to. This is
what lets the spec say "the deepest surface naming an address is the one that
answers it" without either matcher gaining a special case.

The card already relies on this against the store's subtree; the lot is the
second instance, not a new rule.

### The loader's read seeds the view; the view still refetches

The document has to carry the lot before scripts run, and the page has to stay
live afterwards, because bids move under it. So the route reads the lot and
hands it to the view as the value its query starts from, rather than the view
opening a second, empty read.

*Rejected:* the view taking a finished lot and not querying at all. The page
would be correct at the instant it was served and then wrong for as long as it
stayed open.

*Rejected:* letting the view refetch from empty and showing its skeleton
first. That is what the implementation did before review, and it is what
"A served lot becomes live without blanking" exists to forbid: the document
carried the lot's name in its title while its body said nothing.

### A value that follows the clock crosses the boundary as data

The lot's page shows how long bidding has left, computed from the current
instant. Evaluating that instant while rendering means the worker and the
browser evaluate it at different moments, so the browser's first render
disagrees with the document it is taking over — the defect review found once
the lot became a rendered surface.

The instant therefore arrives with the lot, from the route, so the served
render and the browser's first render agree by construction; the countdown
starts ticking after mount. This is `frontend-structure`'s existing rule
("nothing rendered may be nondeterministic — pass the value in from the
loader"), which the surface simply did not fall under while it was never
rendered on the server.

*Rejected:* rendering the remaining time only after mount. The served document
would then carry nothing where the close belongs, which is content missing
from the page a crawler reads.

*Rejected:* serving the close as an absolute date and swapping to a relative
countdown on mount. It hydrates cleanly, but the collector sees the value
change shape for no reason they can perceive.

### The read a route makes is published by the slice

A route loader runs where no component does, so it cannot resolve the
feature's tokens through a hook. The listings slice publishes the read itself,
beside its hooks, over the same repository the hook resolves — the shape the
products slice already uses, so one fixture binding covers both.

*Rejected:* the app resolving the repository token directly. It reaches past
the slice's public surface and puts knowledge of the slice's wiring in the
site.

## Risks / Trade-offs

- **Every lot open now costs a render and a catalogue read**, where the
  auction's static document previously answered. Accepted: it is the only way
  the address can name the lot, and cards already pay it.
- **A pulled lot's link now fails visibly.** Previously it answered 200 with
  the catalogue, which looked healthy and told the collector nothing. A 404
  with the not-found surface is the honest answer and the one the spec asks
  for, but it will surface broken links that were silently "working".
- **The auction's document no longer answers lot addresses.** Anything holding
  a cached response for one — an edge cache, a warmed link preview — will be
  serving the old answer until it expires.
- **Two surfaces now follow one shape by convention, not by construction.**
  The card and the lot have near-identical route modules. Factoring them
  together is tempting and premature: the third instance is what should decide
  the abstraction, not the second.

## Open Questions

None that block delivery. Whether a closed-but-published lot should keep
answering is already settled by the specs — the catalogue decides what is
published, and a closed lot it still publishes still answers, carrying its
result.
