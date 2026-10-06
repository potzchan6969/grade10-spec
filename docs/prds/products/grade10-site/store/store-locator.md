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

🚧 **Same name** — the page names the shop in the same words the free pick-up
claim uses, in each language the site speaks; the table gives the English

❓ **Where the facts are kept** — Product and Operations choose between the
brand's own copy and the booking diary's main shop, which also holds a phone
and holiday dates; Operations confirms

❓ **Phone** — whether a public number is shown; Operations confirms

❓ **Holiday hours** — until Operations confirms them, every day uses the
hours above

❓ **Translated address and hours** — whether the address and hours are
translated like the name; Product confirms

❓ **URL path** — a top-level address, outside `/store`:
`/<lang>/store-locator`, `/<lang>/find-us` or `/<lang>/store-location`;
Product confirms

## The Page

🚧 **Location & Hours** — under that heading, the page shows a map of the
shop, the store name, the full street address and the week's hours, in the
first response before any script runs

🚧 **Map opens Maps** — activating the map opens Google Maps for the same
address in a new tab, before any script runs and when Google's map has not
loaded; there is no separate Get directions control

🚧 **Chrome reaches it** — Store Locator in the header and footer leads to
this page: in the header directly before Help, which ends the primary nav, and
first in the footer's Help column, ahead of Docs. The header marks it while the
collector is here. It waits with the store, so auction-first chrome has none —
[Carried Surfaces](/p/grade10-site/site/carried-surfaces)

🚧 **Document identity** — the page carries its own title, meta description
and Open Graph tags, distinct from every other public surface, and the
sitemap lists it — [Crawlable Pages](/p/grade10-site/site/crawlable-pages)

🚧 **Narrow screens** — at 375px wide the page scrolls only vertically

❓ **Title and description copy** — Product confirms the strings

## From Elsewhere

🚧 **Free pick-up on Product Details** — the store name in the free pick-up
claim opens Store Locator in the same tab, in the page's language —
[Product Details](/p/grade10-site/store/product-page#free-pick-up)

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
| Same shop as free pick-up | Decided | Name, address, hours and Maps destination are the free pick-up claim's shop, kept in one place; which place is the open row Where the facts are kept. | Product |
| Map opens Maps | Decided | The map is one link to Google Maps, in a new tab; no second Get directions control. | Product |
| Free pick-up links here | Decided | Product Details free pick-up opens this page. | Product |
| Waits with the store | Decided | Store Locator is carried with the store, so a build without the store has no page, link or sitemap entry for it. The footer already draws it only beside the shop column (grade10 `apps/frontend/grade10/src/chrome/SiteShell.tsx:184-195`). | Product |
| URL path | ❓ Open | Recommended `/<lang>/store-locator`, matching the chrome label and the block; every option is top-level, since an address under `/store` would mark Store as current too; `/<lang>/find-us` and `/<lang>/store-location` are the alternatives. An address is costly to change once crawled. | Product |
| Where the facts are kept | ❓ Open | Recommended the brand's own copy now, shared with the free pick-up claim and translated; the booking diary's main shop once booking launches and the diary is translated. The diary is one source with the grading emails, but booking is not carried on public builds. | Ops / Product |
| Phone and holiday hours | ❓ Open | Recommended neither in this change: every day uses 11am – 9pm until Operations names a public phone and exceptions. | Ops / Product |
| Title and description strings | ❓ Open | Recommended title "Store Locator — Grade10" and description "Where to find the Grade10 shop in Causeway Bay, Hong Kong, and when it is open." The description leaves the hours out so it cannot drift from them. | Product |
| Translated address and hours | ❓ Open | Recommended: translate the address like the store name, and write the hours in each language's own format. | Product |
:::
