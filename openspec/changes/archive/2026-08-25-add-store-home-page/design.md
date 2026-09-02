# Design: A store front door

## Context

See [proposal.md](proposal.md) — Why. Three constraints shape everything
below.

**The blocks exist.** `@grade10/ui` already exports `StoreHomeHero`,
`StoreSectionHeader`, `StoreCollectionGrid`, `StoreCollectionTile` and
`StoreCollectionSummary`, and `apps/preview` in grade10-spec carries a page
story assembling frame `4171:9023` from them beside `Nav`, `ProductCard` and
`Footer`. The submodule this repository pins already has all of it. No
component work.

**A surface is a row in one table.** `apps/frontend/grade10/src/surfaces.ts`
is what the router, the worker serving documents, the sitemap, the head
builder and the chrome all read. Adding a surface means adding a row and
answering the compile errors that follow: a route module, a head entry in the
catalogs, and — for a written surface — an entry in `routes.ts`'s `MODULES`.
Nothing about serving is decided outside that table.

**Every key is answered for every brand.** `@grade10/i18n` types a message
key from `sharedCatalogs.en & brandCatalogs.grade10.en`, and
`resolution.test.ts` fails when any brand and language leaves one unanswered.
A key that says something about a brand — the hero's eyebrow — therefore lands
for zzz as well as grade10, even though zzz has no front door.

## Goals / Non-Goals

Beyond the proposal's scope:

- **Goal:** the front door composes exactly what the preview story composes,
  so grade10-spec's page story stays the reference and a drift between them is
  visible.
- **Non-goal:** a shared "store home" React component. The page is assembly —
  destinations, reads and copy — which is application-owned by
  `shared/frontend-composition`. What is reusable is already in `@grade10/ui`.
- **Non-goal:** touching the catalog slice's ports. Every read the front door
  makes exists: `useCollections` for the bento and `useCollection` for the
  merchandised row.

## Decisions

### The listing moves to `/store/collections`; `/store` becomes the front door

`/store` stays answering, so no link breaks — it answers with the front door.
The listing keeps its behaviour and takes a new row in the surface table,
prerendered like the surfaces beside it. `/store` already owns every address
beneath it (`SURFACE_PATTERNS` appends `/*`), and a nested surface naming an
address renders instead of the one above it — the rule `/store/products/:handle`
already relies on, so the listing needs no new matching machinery.

*Alternatives rejected.* **Front door at `/`, listing left alone** — the
frame's nav draws the store as the surface being viewed, and `/` is the
brand's front door across both products, not the store's. **Listing retired** —
throws away a shipped surface and leaves the bento pointing at nothing.
**Redirect `/store` to the listing and put the front door at `/store/home`** —
buries the surface the design puts first behind the one it puts second.

### A collection scopes the listing through a query, not a path segment

`/store/collections?collection=<handle>` narrows the listing. The listing
stays one prerendered document; the narrowing is applied by the page once
scripts run, which is when its cards arrive anyway.

A path segment (`/store/collections/<handle>`) would make each collection a
rendered surface with its own read, title, description and `og:url` — the card
page's shape. That is a real surface worth having and it is a different
change: it needs a read per handle, a refusal for an unknown one, and a
sitemap the worker renders. A query keeps a link shareable today without
claiming an identity the page cannot yet serve.

The listing already holds its narrowing as page state (`FilterSelection`).
This change makes the address that state's home: read on mount, written on
change with a history entry, so back undoes a narrowing.

*Alternative rejected:* leaving the narrowing as page state and having tiles
navigate with router state. Router state does not survive a shared link or a
reload, which is the whole point of a tile.

### The front door is the shop's collections, artwork and all

Every tile comes from `useCollections()`: the collections the catalogue lists,
in the order it lists them, each carrying its own title and its own image. The
first takes the bento's large cell and is what the product row merchandises.
The application states nothing — no table of handles, no icons, no rank — so a
collection reaches the front door by being in the shop.

A collection the catalogue lists without an image still renders; its tile is
identified by its name rather than left out, because a shop that has not
uploaded artwork yet has still made the collection.

*Alternatives rejected.* **A stated table in the application** — an ordered
list of handles with an emoji each, which is what this change shipped first.
It matched the frame exactly and cost nothing to build, but a collection the
shop adds is invisible until someone edits code, a typo drops a tile silently,
and nothing tests the table itself. **Shopify metafields for an icon and a
rank** — merchandiser-controlled and the closest to the frame, at the cost of
the Shopify query, the codec, the contracts, the worker and both fixtures, and
a front door that quietly loses a tile when a metafield is unset. Worth doing
when merchandising asks for an order the shop's own cannot express.

**Known deviation from the frame.** `StoreCollectionTile` draws its icon well
as a 48px disc, sized for the emoji the frame puts there. A collection's image
is a photograph. It is rendered to fill that disc, which is not what
`4195:1050` shows — recorded here rather than absorbed silently, and settled
with design in the review this change ends on.

### The hero's image ships with the application

Exported from frame `4171:9051` and imported by the page, so the build hashes
it and the prerendered document carries a real `src`. It is brand art for one
surface of one application — not a design-system asset — so it does not belong
in grade10-spec. grade10-spec's `store-home-hero.fixture.png` stays what it
is: a story fixture.

A static import rather than a URL built from `import.meta.url`, which
`add-store-product-page` already had to remove from `@grade10/ui` because a
worker has no module URL.

### Copy splits the way `chrome` already splits

`storeHome` joins the shared catalogs with the words no brand claims — the
headline, the description, the two hero button labels, browse-all, the
collections heading, and the loading and retry lines. The eyebrow is the
brand's name, so it lands in each brand's own catalog the way `chrome.wordmark`
does — grade10 and zzz both, because every key is answered for every brand.

The listing's new address needs its own `head` entry, and the store's existing
one is rewritten: it describes a catalogue today and has to describe a front
door, or the two surfaces fail `Two surfaces, two names`.

*Alternative rejected:* putting the whole hero in the brand catalogs. Only the
eyebrow says anything about a brand; the rest would be three languages of
duplicate wording per brand for no gain.

### The merchandised row uses `ProductCard` directly, not `ProductList`

`ProductList` fixes its own grid — `auto-fill` from a 240px minimum with 32px
gaps — because the listing's column count follows the width left by a fixed
sidebar. The front door has no sidebar and the frame draws five fixed columns
at 16px gaps. The preview story maps `ProductCard` over a
`grid-cols-5 gap-4` and that is what the page does.

## Risks / Trade-offs

- **A shared link to a narrowed listing is not a shareable page.** Its title,
  description and `og:url` are the unscoped listing's. → Accepted, and named
  as a non-goal: collection pages are the change that fixes it.
- **The front door's collections are a deploy away from changing.** A new
  collection does not appear on it until the table names it. → The row it
  merchandises is not — that follows the shop. The bento is layout, and layout
  is a deploy.
- **The bento is drawn for exactly seven tiles**, one of them double-width.
  Fewer collections leaves the grid short; more overflow into a third row. →
  The tile component already handles both — the grid is `grid-cols-5` with
  content-sized rows. It will not match the frame, which is the honest
  outcome of the shop and the table disagreeing.
- **`/store` no longer lists products.** Anything outside this repository that
  treated it as the catalogue — an ad, an email, a bookmark — now lands on the
  front door. → It is a store landing page with a Shop button on it, not a
  refusal, and every one of those links keeps working.
- **The prerendered listing's static copy must survive the move.** The build's
  public-pages check holds every written surface to a minimum of real copy
  (`MIN_STATIC_COPY`). → The listing carries its existing title and intro to
  the new address; the front door's hero copy clears the bar on its own.

## Migration Plan

No data, no schema, no backend. The move is a deploy: `/store` starts
answering with the front door, `/store/collections` starts answering at all,
and the sitemap gains an address per language. Rolling back is deploying the
previous build — nothing persists that a rollback would strand.

The one ordering constraint is the submodule: the i18n keys land in
grade10-spec first, and the application bumps the pin before anything reads
them.
