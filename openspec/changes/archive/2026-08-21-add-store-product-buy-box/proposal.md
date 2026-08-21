# A card is bought where it is read

**Author:** @seankcw - 2026-08-20

## Why

A collector who opens a card's page can read everything about it and buy
nothing. [`add-store-product-page`](../add-store-product-page/proposal.md) gave
each card an address that answers whole — its name, its description, every
variant priced, all before a script runs — and the page stops there. The only
place the storefront sells is the grid: a tile carries an add, a card's own
page carries none. So the surface a shared link, a search result and an unfurl
all lead to is the one surface that cannot take a collector's money. They go
back to the grid and hunt for the tile they arrived from.

It is sharper for a card listed in more than one grade. A tile adds whatever
is for sale, because a tile has room for one price. The card's page is where
the grades stand side by side with their own prices — the place the choice is
actually made — and it is the place that cannot act on it. The page shows a
collector a PSA 9 for less and offers them no way to take it.

**Metric:** carts started from a card's own address — from none today to the
share of adds that a page a collector arrived at directly should carry.
**Acceptance signal:** someone opening a link to a card picks a grade and adds
it without leaving the page.

## What Changes

- **A card is bought from its own page.** The page opens with the grade it
  prices already chosen, a collector may choose another it lists, and adding
  puts that grade in the cart the storefront already keeps. They stay on the
  card, and what the site says is in the cart changes.
- **A card nobody can buy says so where the buying happens.** A card with
  nothing for sale, and a grade that is sold out while another is not, are
  different states and read differently — neither is a missing control.

## Non-Goals

- **Cards related to this one.** Nothing in the catalogue says which cards are
  related: a product carries no collection membership, so a strip of them
  cannot be read at all today. It wants catalogue capability first, and that is
  its own change.
- **What the cart is, and what happens after it.** `grade10-store/shopify-commerce`
  owns checkout, price and inventory validation, and the handover to Shopify.
  This change adds a line to the cart and nothing beyond it.
- **A cart surface of its own.** Where a collector reviews and edits what they
  picked is a page this change does not add.
- **What a product is.** The catalogue's fields are
  `grade10-store/shopify-commerce`'s; this reads what it already publishes.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-store/product-page`: what a card's page offers beyond reading —
  choosing a grade, adding it, and how a card nobody can buy reads.

## Impact

The card's page and the storefront cart it already shares with the grid. No
catalogue read is added: every fact the page needs is one it already renders.
Nothing about serving changes — the page still answers whole before a script
runs, and choosing and adding are what a collector does after it has.
