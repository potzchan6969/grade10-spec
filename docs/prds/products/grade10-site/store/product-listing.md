---
title: Product Listing
spec: grade10-site/store/product-listing
order: 2
---

The product listing is where a collector browses the catalogue and opens a
product.

- **Every product** — a card that opens its Product Details Page
- **Filter and sort** — the filter bar narrows the catalogue and orders it
- **URL** — the collection is in it, so a listing can be linked and shared
  1. `grade10.com/store/collections` — the whole catalogue
  2. `grade10.com/store/collections?collection=<handle>` — one collection
  3. `grade10.com/store/products/<handle>` — a product's details page

## What it looks like

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4396-5424" title="Product list filter bar"}

::story{id="pages-product-list-page--default" title="The listing, whole"}

::story{id="store-product-listing-productbrowse--no-match" title="A narrowing nothing matches"}

::story{id="store-product-listing-productbrowse--empty-catalog" title="A catalogue with nothing in it"}
