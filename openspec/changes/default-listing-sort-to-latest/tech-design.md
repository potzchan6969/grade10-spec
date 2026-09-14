## Context

The listing's order lives in one value, `sort` on the catalogue query, which is
`null` until a collector picks an option. `null` travels to the catalogue as no
order at all, so the shop's own order stands, the trigger reads `Sort by` with
nothing after it, and no option in the menu is marked.

That same `null` carries a second meaning on the site. A collection survives
only while nothing else narrows the listing, and the page reads "nothing else"
as no facets, no free text and `sort === null`. Resting on latest by setting
the query's own default would therefore drop every collection the moment the
listing opened.

The collector-facing menu already offers latest, lowest price and highest price
and nothing else. The workbench under `apps/admin/grade10` still lists
Popularity as a disabled option, and the design system's fixtures already rest
on latest.

## Goals / Non-Goals

**Goals:**

- The listing opens ordered by latest product, saying so in the trigger and in
  the menu
- An address carrying no order opens the same listing as one carrying latest
- A collection is still a way into the listing

**Non-Goals:**

- A popularity signal — nothing computes one
- The facet counts, the collection chrome, or the search behaviour
- The catalogue contract's own `sort`, which stays optional

## Decisions

**A resting order, not a changed default.** `sort` keeps `null` as "the
collector has chosen nothing", and one constant names what that rests on. The
read resolves it — the catalogue is always asked for latest when nothing is
chosen — and the page's copy resolves it the same way, so the trigger and the
selected option follow. Setting `EMPTY_CATALOG_QUERY.sort` to latest instead
was tried in design and rejected: `sort !== null` is what the site reads as "a
query is in force", so a collection would be dropped by opening the listing.

**The address stays clean.** Resting on latest writes no `sort` into the
address; picking latest from the menu writes one. Both open the same listing,
which is what the scenario asks, and an unnarrowed listing keeps the address it
is shared with.

**The workbench loses Popularity rather than disabling it.** A disabled option
is still the menu claiming an order the catalogue cannot answer. The workbench
rests on latest for the same reason the site does — it exists to read what the
contract answers.

## Risks / Trade-offs

- **Every unnarrowed listing now walks the catalogue.** Shopify's own search
  answers price orders and free text, but has no recency key, so a latest
  browse walks the catalogue into memory once per cold cache entry — the
  ceiling already recorded in the store's browse module. At tens of products
  this is not noticeable; the successor is the webhook-fed projection that
  ceiling already names, and this change moves the walk from an order a
  collector picks to the one they arrive on
- **The resting order is resolved in two places** — the read and the copy. A
  third reader would be a third place to forget it, so the constant is exported
  from the catalogue model rather than spelled at either call site
