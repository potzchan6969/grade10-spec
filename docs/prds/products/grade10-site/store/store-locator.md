---
title: Store Locator
spec: grade10-site/store/store-locator
order: 4
---

Store Locator is the public page for Grade10's one Hong Kong shop: where it
is, when it is open, and a way into Google Maps. It is a store detail, not a
multi-store finder.

## Shop

| Fact | Value |
| --- | --- |
| **Name** | Hong Kong Grade10 Store |
| **Address** | 13 Pak Sha Road, Causeway Bay, Hong Kong |
| **Hours** | 11am – 9pm, every day |
| **Maps** | Google Maps for that address |

❓ **Phone** — confirm with ops whether a public number is shown.

❓ **Holiday hours** — confirm with ops; until then every day uses the hours
above.

❓ **URL path** — not required under `/store`; candidates include `/find-us`
and `/store-location`. Product settles the path.

## The Page

🚧 **Location & Hours** — the page shows a map of the shop, the store name,
the full street address, and the week's hours, in the first response before
any script runs

🚧 **Map opens Maps** — activating the map opens Google Maps for the same
address; there is no separate Get directions control

🚧 **Chrome reaches it** — Store Locator in the header and footer leads to
this page once the site answers it, and the chrome marks it while the
collector is here

🚧 **Document identity** — the page carries its own title, meta description,
and Open Graph tags, distinct from every other public surface, and the
sitemap lists it

❓ **Title and description copy** — exact strings are unsettled; they must
differ from Store home, the listing, and Product Details

## From Elsewhere

🚧 **Free pick-up on Product Details** — the free pick-up claim names this
shop and opens Store Locator

## Designs

::story{id="pages-store-locator-page--default" title="Store Locator — default"}

::story{id="pages-store-locator-page--narrow" title="Store Locator — narrow"}

:::detail{title="Product decisions" for="pm"}
Collectors need one honest answer for where the shop is. A finder UI for one
Hong Kong location would invent search, distance and a store list nobody can
use.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector looking for the shop | Opens Store Locator from chrome or free pick-up | Sees the Hong Kong address, hours, and a map that opens Google Maps. |
| Collector on Product Details | Reads free pick-up | Opens Store Locator for the same shop. |
| Crawler or link preview | Fetches the address with no scripts | Gets a distinct title, description, and Open Graph tags. |

**Not in scope.** Multi-store search, ZIP or city, distance, amenities chips,
stock by store, store picker, in-app turn-by-turn, checkout store selection.
GRADE as a chrome destination. A separate SEO programme beyond crawlable-pages.

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Store Locator opens | Opens of the public address from chrome and from free pick-up. Unmeasured; first delivery sets the baseline. | Product |
| Maps opens | Activations of the map that leave for Google Maps. Unmeasured. | Product |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| One shop, detail only | Decided | Grade10 has one Hong Kong store; the page is Location & Hours, not a finder. | Product |
| Same address as free pickup | Decided | Name, street lines, hours and Maps destination match the free-pickup facts used on order details. | Product |
| Map opens Maps | Decided | The map embed is the way into Google Maps; no second Get directions control. | Product |
| Free pick-up links here | Decided | Product Details free pick-up opens this page. | Product |
| Path under `/store` | ❓ Open | Path need not live under `/store`; Product picks among `/find-us`, `/store-location`, and similar. | Product |
| Phone and holiday hours | ❓ Open | Fixture hours stand until ops names a public phone and exceptions. | Ops / Product |
| Title and description strings | ❓ Open | Distinct strings are required; exact copy is unsettled. | Product |
:::
