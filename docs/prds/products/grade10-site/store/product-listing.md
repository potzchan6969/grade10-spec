---
title: Product Listing
spec: grade10-site/store/product-listing
order: 2
---

The product listing is where a collector filters and sorts the whole
catalogue, at its own address beneath the store.

- **Address** — its own title, description and share metadata, in every
  language the site answers ([[product-listing-SC-01]])
- **Collection in the address** — a narrowing of this one listing, never a
  page of its own; every collection opens the same document
  1. **One the catalogue carries** — opens already narrowed
     ([[product-listing-SC-03]])
  2. **None** — lists everything ([[product-listing-SC-04]])
  3. **One the catalogue has nothing for** — lists everything as itself, not
     a missing page ([[product-listing-SC-05]])
- **Narrowing inside the page** — writes the collection into the address,
  so what a collector sees can be linked ([[product-listing-SC-06]]); back
  restores the previous narrowing ([[product-listing-SC-07]])

## What it looks like

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4098-1868" title="Product listing"}

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4396-5424" title="Product list filter bar"}

::story{id="pages-product-list-page--default" title="The listing, whole"}

::story{id="store-product-listing-productbrowse--no-match" title="A narrowing nothing matches"}

::story{id="store-product-listing-productbrowse--empty-catalog" title="A catalogue with nothing in it"}

## Journeys

::journeys{id="grade10-site/store/product-listing"}
