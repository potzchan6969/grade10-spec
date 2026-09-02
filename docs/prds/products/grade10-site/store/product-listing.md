---
title: Product Listing
spec: grade10-site/store/product-listing
order: 2
---

The product listing is where a collector filters and sorts the whole catalogue. It
lives at its own address beneath the store, with its own title, description and
share metadata, and a document written for it in every language the site answers.
What the listing shows and does did not change when it moved — only where it
answers.

The interesting part is the collection in the address. A collection is a
narrowing of this one listing, not a surface of its own, so every collection
opens the same document: an address naming one the catalogue carries opens
already narrowed to it, one naming none lists everything, and one naming a
collection the catalogue has nothing for lists everything as itself rather than
refusing. That last case is deliberate — a way of narrowing that has gone empty
is not a missing page.

Narrowing from inside the page writes the collection into the address, so a
collector can link to what they are looking at, and going back restores the
previous narrowing.

## What it looks like

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4098-1868" title="Product listing"}

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4396-5424" title="Product list filter bar"}

::story{id="pages-product-list-page--default" title="The listing, whole"}

::story{id="store-product-listing-productbrowse--no-match" title="A narrowing nothing matches"}

::story{id="store-product-listing-productbrowse--empty-catalog" title="A catalogue with nothing in it"}

## Journeys

::journeys{id="grade10-site/store/product-listing"}
