---
title: Store Locator
spec: grade10-site/store/store-locator
order: 4
---

Store Locator is the public page for Grade10's one Hong Kong shop: where it
is, when it is open, and a way into Google Maps. It is a store detail, not a
multi-store finder.

## Location and Hours

- **Map** — a map of the shop; activating it opens Google Maps for the same
  address in a new tab, even when Google's map has not loaded; there is no
  separate Get directions control
- **Store Name** — Hong Kong Grade10 Store, in the free pick-up claim's own
  words
- **Street Address** — 13 Pak Sha Road, Causeway Bay, Hong Kong
- **Hours** — 11am – 9pm, every day
- **No Phone, No Holiday Hours** — the page shows no phone number, and every
  day uses the hours above until Operations names a phone and holiday hours
- **In Each Language** — the name, the address and the hours read in the
  collector's language, the hours in that language's own format; the values
  above are the English
- **Without Scripts** — the page, its facts and the map's way into Google
  Maps all work in the first response, before any script runs
- 🚧 **Small Screens** — at 375px wide the page scrolls only vertically

::story{id="store-store-locator-screens-store-locator--default" title="Store Locator"}

::story{id="store-store-locator-screens-store-locator--narrow" title="Small screen"}

## Links to the Page

- **Header** — Store Locator directly before Help, which ends the primary nav
  - **Current Page** — the header marks Store Locator alone while the
    collector is here, not Store
- **Footer** — Store Locator first in the Help column, ahead of Docs
- **Free Pick-Up on Product Details** — the store name in the free pick-up
  claim opens Store Locator in the same tab, in the page's language -
  [Product Details](/p/grade10-site/store/product-page#free-pick-up)
- **Waits With the Store** — a site that doesn't carry the store, such as an
  auction-first one, has no Store Locator in its chrome -
  [Carried Surfaces](/p/grade10-site/site/carried-surfaces)

## Sharing the Page

- **Web Address** — `grade10.com/<lang>/store-locator`, outside `/store`
- **Link Preview** — its own title, description and Open Graph tags, distinct
  from every other public surface; the sitemap lists it -
  [Crawlable Pages](/p/grade10-site/site/crawlable-pages)
  - **Title** — `Store Locator — Grade10`
  - **Description** — `Where to find the Grade10 shop in Causeway Bay, Hong
    Kong, and when it is open.`, leaving the hours out so it cannot drift
    from them

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
