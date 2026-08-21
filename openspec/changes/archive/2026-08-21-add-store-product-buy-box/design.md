# Design: A card is bought where it is read

Capability delta:
[`grade10-store/product-page`](specs/grade10-store/product-page/spec.md).
Motivation: [proposal.md](proposal.md) — Why.

## Context

[`add-store-product-page`](../add-store-product-page/design.md) put a card at
its own address and left the page reading-only. Three things it settled decide
how the buying goes on top.

- **The read runs before the page does.** A route loader answers with the card,
  so every fact the buying needs — which variants exist, what each costs,
  which are for sale — is already in the document. Nothing here adds a read.
- **The page is rendered twice.** The worker answers the request, the browser
  takes the document over. A control the page renders is in the served bytes
  and becomes live at hydration.
- **The storefront already sells.** `useCart` and its `add` mutation are what
  the grid's tile calls; `AddToCart` merges a repeat add into one line and
  refreshes the price the catalogue last showed. The cart lives in browser
  storage, namespaced per brand.

## Goals / Non-Goals

- **Goal:** the choice a collector makes on the page is the thing that lands in
  the cart — never whichever variant the catalogue happened to list first.
- **Goal:** the page still answers whole. Buying is what a collector does after
  the document arrived, and nothing about it may take a fact out of the bytes.
- **Non-goal:** a second way to add. The grid's add and the page's add reach the
  same use case; this adds a caller, not a mechanism.
- **Non-goal:** anything the cart leads to. Reviewing, editing, checking out.

## Decisions

### The buy box is composed in the app, not authored as a shared block

`ProductPage` and the auction pages compose `@grade10/design-system` primitives
directly. `@grade10/ui` does carry the analogous panel for the other product —
`ListingBidPanel` — but nothing in this repository imports it yet; `StorePage`'s
`ProductList` is the only block a page reaches for today.

**Alternative rejected:** authoring a `ProductBuyPanel` block in grade10-spec
and importing it. It makes a one-repository change span two clones and a
submodule bump, for presentation exactly one brand renders: `apps/frontend/zzz`
has home, profile and sign-in, and no card page at all. The spec here is about
what the page offers, not about a component contract two brands share.

**Revisit when** zzz gains a card page. At that point the panel is shared
presentation and belongs in `@grade10/ui`, with `shared-ui` requirements naming
its export.

### Which variant is chosen is page state

Nothing in `@grade10/store-frontend` learns that a collector is looking at a
grade. The page holds the choice, the way `AuctionsPage` holds which sale is
open — a selection is presentation, not something the data layer models.

The page opens on `pricedVariant(product)`, the export the store package
already publishes to say which variant a surface acts on. A card with one
thing to buy therefore needs no choice made, which is the spec's second
scenario, and the same rule decides what the page prices in its headline.

**Alternative rejected:** a `useProductSelection` hook or a selection in the
container. It would put a browser interaction behind dependency injection to
no end — nothing else reads it, and nothing persists it.

### Nothing new is written for the repeat add

`AddToCart` already gains quantity on a line whose variant is in the cart
rather than adding a second one. `The same card twice` is therefore a scenario
this change **proves from the page**, not one it implements. A task that
re-implemented it in the page would be a second answer to a question the
domain already answers.

### The count the page shows is the page's own

`StorePage` renders `N items in your cart` from `useCart().itemCount`; the site
chrome carries no cart at all. The card's page says what the cart holds the
same way, which satisfies `The collector keeps their place` without a
site-wide surface change.

**Alternative rejected:** a cart count in `SiteShell`. It is the right home
eventually, but it is a change to every surface of the site and it wants
somewhere to lead — and the cart surface is a Non-Goal here. Doing it now
would ship a control that goes nowhere.

### A sold-out variant stays listed, priced, and unchoosable

`availableForSale` per variant already decides what the page badges. The picker
disables what cannot be bought rather than dropping it: a card listing a PSA 10
sold and a PSA 9 for sale must read as both, and a grade that vanished when it
sold would read as a card that never had it.

## Risks / Trade-offs

- **The cart count is empty in the served document.** Browser storage reads
  empty where there is no browser, so the worker renders a pending cart query
  and no count. The browser's first render is pending too — react-query has not
  resolved on mount — so the served markup and the first client render agree,
  and the count settles after. This is the same shape the session already has,
  and `serving/hydration.test.tsx` is where it stays honest: a count rendered
  from resolved state on one side only would be markup React throws away.
- **A control is in the bytes before it works.** The add button is served and
  goes live at hydration. That is what every control on the site already does;
  it is called out because this is the first one whose press moves money-shaped
  state.
- **Two ways to add, one use case.** The grid and the page build a `CartLine`
  each. They must agree on the line's title and price or one card reads two
  ways in the cart — the reason to build the line the same way rather than a
  new way that happens to look right.

## Open Questions

None. What was open went to the author before drafting: scope, how a variant is
chosen, where the collector lands after adding, and what a sold-out card
offers.
