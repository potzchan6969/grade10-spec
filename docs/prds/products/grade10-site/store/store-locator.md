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

- **In each language** — the name, the address and the hours read in the
  collector's language, the hours in that language's own format; the name is
  the free pick-up claim's own words, and the table gives the English
- **No phone, no holiday hours** — the page shows no phone number, and every
  day uses the hours above until Operations names a phone and holiday hours

## The Page

- **URL** — `grade10.com/<lang>/store-locator`, outside `/store`, so the
  header marks Store Locator alone
- **Location & Hours** — under that heading, the page shows a map of the
  shop, the store name, the full street address and the week's hours, in the
  first response before any script runs
- **Map opens Maps** — activating the map opens Google Maps for the same
  address in a new tab, before any script runs and when Google's map has not
  loaded; there is no separate Get directions control
- **Chrome reaches it** — Store Locator in the header and footer leads to
  this page: in the header directly before Help, which ends the primary nav, and
  first in the footer's Help column, ahead of Docs. The header marks it while the
  collector is here. It waits with the store, so auction-first chrome has none -
  [Carried Surfaces](/p/grade10-site/site/carried-surfaces)
- **Document identity** — the page carries its own title, meta description
  and Open Graph tags, distinct from every other public surface, and the
  sitemap lists it - [Crawlable Pages](/p/grade10-site/site/crawlable-pages).
  The title is `Store Locator — Grade10`; the description is `Where to find
  the Grade10 shop in Causeway Bay, Hong Kong, and when it is open.`, which
  leaves the hours out so it cannot drift from them
- 🚧 **Narrow screens** — at 375px wide the page scrolls only vertically

## From Elsewhere

- **Free pick-up on Product Details** — the store name in the free pick-up
  claim opens Store Locator in the same tab, in the page's language -
  [Product Details](/p/grade10-site/store/product-page#free-pick-up)

## Designs

::story{id="store-store-locator-screens-store-locator--default" title="Store Locator - default"}

::story{id="store-store-locator-screens-store-locator--narrow" title="Store Locator - narrow"}

:::detail{title="Test cases" for="qa"}
[Test cases · grade10-site/store/store-locator](https://github.com/9gag/grade10-spec/tree/main/openspec/specs/grade10-site/store/store-locator)
:::

:::detail{title="Product decisions" for="pm"}
Collectors need one honest answer for where the shop is. A finder UI for one
Hong Kong location would invent search, distance and a store list nobody can
use.

- **`/<lang>/store-locator`** — it matches the chrome label and the block; `/<lang>/find-us` and `/<lang>/store-location` were the alternatives
- **The brand's own copy of the facts** — shared with the free pick-up claim and translated; the booking diary's main shop takes over once booking is carried on public builds and the diary is translated, since its name and address are English only
- **Address and hours translated** — so the page reads in one language
- **Not in scope** — multi-store search, ZIP or city, distance, amenities, stock by store, a store picker, turn-by-turn, choosing a store at checkout; GRADE as a chrome destination; SEO beyond Crawlable Pages
- ❓ **Unmeasured** — Store Locator opens from chrome and free pick-up, and map activations that leave for Google Maps; nothing records them yet. Product confirms
:::
