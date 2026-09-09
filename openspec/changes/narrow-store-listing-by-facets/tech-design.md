# Tech design

## Context

See `proposal.md` — Why. The requirements are
`openspec/specs/grade10-site/store/product-listing/spec.md` as this change
deltas it.

What already exists, and shapes every decision below:

- **The wire is complete.** `catalog.filters` and `catalog.products` both take
  `cursor`, `limit`, `q`, `sort`, `types`, `worlds`, and both narrow, count and
  order over the whole set. Nothing on the backend changes.
- **The components are complete.** The shared listing surface already takes
  filter groups, a selection, applied-filter chips, a sort trigger and search
  callbacks — `shared/ui/store-product-listing` settled that in
  `sync-product-list-page`. No export moves and no component gains a prop.
- **The gap is the site's data layer.** The storefront's catalogue reads send
  only `{cursor, limit}` and never call `catalog.filters`; search and order are
  computed in the browser over the loaded page. That, and the page that drives
  it, is the whole of this change in the application repository.
- **Two routes, not one.** A collection is readable only through
  `catalog.collection(handle)`, which takes no query; `catalog.products` takes
  the query but has no collection dimension. The spec's one-narrowing-at-a-time
  rule is that constraint made explicit rather than a preference.

## Goals / Non-Goals

**Goals**

- One canonical spelling per distinct query, from the address through to the
  cache key
- A page that holds no filter, search or order state of its own
- Fixtures that narrow, count, search and order the way the backend does, so
  the frontend is verifiable without a running worker

**Non-Goals**

- Widening `catalog.products` with a collection dimension — see Decisions
- Changing any backend service, contract or Shopify adapter
- Reworking infinite scroll, the cart stepper, or the product card

## Decisions

### The address is the state

The page reads its whole query from the address and writes narrowings back to
it. It holds no filter, search or order state of its own.

- **Why** — `SC-06`, `SC-07`, `SC-11` and `SC-14` all turn on the address and
  the history entry being the same fact. Two sources drift, and Back stops
  working the moment they do.
- **Rejected** — React state mirrored into the address on change, which is what
  the page does today for its cursor stack. It survives only while nothing
  writes the address from outside, and the front door does exactly that.

### The cursor stays out of the address

Paging is view state: a cursor stack in the page, dropped whenever the
canonical query string changes.

- **Why** — a shared link should open the narrowing, not the reader's scroll
  depth. Dropping the stack on a query change is automatic once the query is
  the address, because the stack is keyed to it.
- **Rejected** — a cursor in the address. Every scroll would mint a history
  entry, and Back would walk the page back a screen at a time instead of
  undoing a narrowing.

### One canonical query string

Parameters in name order, facet values deduped and sorted, free text folded the
way the backend folds a title, the default page size omitted — the shape the
admin design-review bench already builds and the backend already parses.

- **Why** — one spelling per distinct query means one address, one React Query
  key, and one backend cache entry. Two spellings of the same narrowing
  silently double all three.
- **Rejected** — passing the raw `URLSearchParams` through. It works until two
  paths produce the same narrowing spelled differently, which selecting choices
  in a different order already does.

### The filters key omits cursor, limit and order

The facet read is keyed on `q`, `types` and `worlds` alone — the backend's own
`FILTER_QUERY_KEYS`.

- **Why** — a count describes the set, not the page or its order, so paging and
  re-ordering must not refetch the taxonomy. It also matters for cost: where
  the shop has not configured its storefront filters the backend walks the
  whole catalogue to count, and this keeps that walk to one per narrowing
  rather than one per page.
- **Rejected** — keying both reads identically. Simpler to write, and it turns
  every scroll into a second catalogue walk.

### The route is chosen by the query, not by a mode flag

`catalog.collection(handle)` when the address names a collection and carries no
facet, no free text and no order; `catalog.products(query)` in every other
case, the collection dropped.

- **Why** — it makes `SC-06`, `SC-08` and `SC-09` one predicate over the parsed
  address rather than three branches, so a hand-crafted address and a click
  resolve the same way.
- **Rejected** — adding a `collection` dimension to `catalog.products`. It is
  the better shape and should happen eventually, but the Storefront API cannot
  intersect a collection with metafield filters natively, so it would push the
  backend onto its catalogue walk for every scoped narrowing. Out of scope
  here, and the spec forbids the combined behaviour it would enable.

### An empty taxonomy is `ready`, never `empty`

The facet groups reach the panel as a settled state carrying an empty list.

- **Why** — the shared panel renders a message for the `empty` state, and
  `SC-12` requires nothing be said in place of the groups. A shop that has
  configured no facets is not a fault the collector is told about.
- **Rejected** — hiding the sidebar. The search field lives inside it, and
  `SC-14` needs search whether or not any facet exists.

### Typing replaces the history entry; settling pushes one

Free text rewrites the current address while the collector types, and pushes a
new entry once it settles.

- **Why** — `SC-14` puts the words in the address, and `SC-07` makes Back undo
  a narrowing. A history entry per keystroke satisfies the first and destroys
  the second.
- **Rejected** — writing the address only on submit. The listing has no submit,
  and a narrowing the address does not carry cannot be linked.

### The fixture client answers facets for real

`FixtureStoreProcedureClient` gains a taxonomy with counts, and narrows,
searches and orders its products the way the backend does.

- **Why** — every frontend group here is verified against fixtures rather than
  a running worker, so a fixture that answers `[]` to `catalog.filters` cannot
  hold up a single scenario in this change.
- **Rejected** — per-test mocks. Each test would restate the narrowing
  semantics, and they would drift from the backend one test at a time.

## Risks / Trade-offs

- **A shared link names a facet choice the shop has since dropped** → the
  backend already refuses to send a filter naming nothing it knows, rather than
  answering the whole catalogue mislabelled as narrowed. The page renders the
  narrowing that came back and rewrites the address to match it, so a stale
  link degrades to a wider listing instead of a wrong one.
- **The facet count and the grid come from two requests and can disagree
  mid-flight** → both are keyed on the same canonical query string, so they
  settle together; the count is rendered from the settled taxonomy only, never
  from an in-flight one.
- **A shop with unconfigured storefront filters makes every facet read walk the
  catalogue** → the filters key omits cursor, limit and order, so a browsing
  session costs one walk per narrowing rather than one per page. The backend
  logs the fallback loudly; nothing here silences it.
- **Retiring `sortPopular` changes the resting order of the listing** → the
  catalogue's own order is what a shop already merchandises into, so the change
  is visible but not arbitrary. Nothing persists a collector's previous choice,
  so no stored value points at a retired option.
- **Four locales fall out of step while the keys move** → the message package
  refuses a key left unanswered or answered twice, so an incomplete rename
  fails its own tests rather than shipping a blank label.

## Migration Plan

No data migration and no deploy sequencing: the wire is unchanged, so the
frontend can land before, after, or without any backend release.

The `grade10-spec` group lands first and reaches the application through a
submodule bump — the message keys must exist before the page names them.
Rollback is the revert of that bump plus the frontend commits; no shop
configuration, no stored state, and no address the site ever wrote becomes
unreadable, since an address naming a collection goes on being honoured.

## Archive notes

Two things the archive carries by hand, and no check catches. `openspec
archive` folds `## Requirements` and nothing else; `archive:preflight` gates
the `## Feature set` and `user-journeys.md` copies. Neither sees these.

- **The durable Purpose goes stale** — it reads "What the listing shows,
  filters and sorts is unchanged by this capability; only its address is",
  which the address change that wrote it made true and this change makes
  false. Rewrite it at the fold.
- **`Same document` loses its bullet** — the `Collection as a way in` group
  here carries three bullets, and not the one the retired `Collection in the
  address` group held, though the MODIFIED requirement still states that which
  collection an address names does not change which document it serves. Decide
  at the fold whether the feature set keeps it.
