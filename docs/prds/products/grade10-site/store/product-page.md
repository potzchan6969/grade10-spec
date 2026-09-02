---
title: Product Details Page
spec: grade10-site/store/product-page
order: 3
---

The product details page is one card: what it is, what each grade costs, and
the button to buy it.

- **Card** — name, description, images, a price per grade; badges, compare-at
  price and low-stock notes where the catalogue provides them
- **Buy** — pick a grade and quantity, add to cart, stay on the page while
  the cart total updates; the same grade added again stays on one line
- **Sold out** — a grade sold out says so and cannot be added; a card with
  nothing to buy keeps its prices
- **Shipping and pickup** — shown on the card where the catalogue provides
  them
- **URL** — `grade10.com/store/products/<handle>`; a handle that is not a
  card answers 404 with the site's not-found page

## What it looks like

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4098-2423" title="Product detail"}

## Journeys

::journeys{id="grade10-site/store/product-page"}
