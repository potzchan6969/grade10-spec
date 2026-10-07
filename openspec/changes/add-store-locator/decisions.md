## Goals

- A collector looking for Grade10's one Hong Kong shop reads its address and
  hours on one public page, and opens Google Maps from its map.
- The header and footer Store Locator and the free pick-up claim on Product
  Details lead to that page wherever the build carries the store.
- Every application builds the page from one shared `StoreLocator` block, with
  every word and fact passed in.

## Non-Goals

- **Multi-store finder** — search, ZIP or city, distance, filters, amenities,
  stock by store, a store picker or "My store".
- **In-app turn-by-turn** — Google Maps owns directions.
- **Checkout store selection** — Shopify owns checkout.
- **GRADE as a chrome destination** — a separate product decision.
- **A separate SEO change** — title, description, Open Graph and sitemap are
  `grade10-site/site/crawlable-pages`'s.
- **The pickup claim on Order Details** — a follow-on once that surface's
  pickup facts sit beside this page.
- **ZZZ** — no Store Locator for that brand here.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | A finder or one shop's page? | One shop's Location & Hours page: map, name, street address and the week's hours | A multi-store finder, which would invent search, distance and a store list for one location |
| Q2 | Which facts does the page show? | The same name, address, hours and Maps destination as free pick-up | A second set of shop facts for this page, which can drift from the claim |
| Q3 | How does a collector reach Google Maps? | The map is one link to Google Maps for the shop's address, opening in a new tab | A separate Get directions control beside the map |
| Q4 | What does free pick-up on Product Details do? | The store name in the claim opens Store Locator; a fulfilment label the site has no page for is not a link | A non-interactive claim; a `#` link, as `StoreProductMetadata` defaults to |
| Q5 | Which builds carry Store Locator? | The ones carrying the store: Store Locator joins the store's set in `grade10-site/site/carried-surfaces`, so the route, the chrome items and the sitemap entry share one gate - decided by the round, from the page-shell line and the footer, which draws it only beside the shop column (grade10 `apps/frontend/grade10/src/chrome/SiteShell.tsx:184-195`) | Carried on every lane as an "every other surface"; a second chrome gate stated only in this capability |
| Q6 | Where does Store Locator sit in the chrome? | Directly before Help, which ends the primary nav (grade10 `apps/frontend/grade10/src/chrome/SiteShell.tsx:141-151`); first link of the footer's Help column, ahead of Docs - decided by the round, from page-shell's Help line and the preview's store-launch footer | After Auction, which holds only on the preview's reduced nav |
| Q7 | Is the shop name English everywhere? | No - it is the brand's copy in each language, read from the same words as the free pick-up claim, in the grade10 brand layer - decided by the round | The English name fixed in the spec, while the claim already reads 香港 Grade10 商店 in Chinese; the name in `shared/`, which answers a Grade10 fact for every brand |
| Q8 | Does this capability own the title, description, Open Graph tags and sitemap entry? | No - `grade10-site/site/crawlable-pages` binds the address, as it binds Store home; this capability keeps one scenario that its title and description differ - decided by the round | A requirement and a crawler journey here, restating crawlable-pages |
| Q9 | Which address does Store Locator answer at? | `/<lang>/store-locator`, matching the chrome label, the block, the story id and the chrome copy key. It is top-level: under `/store` the header would mark Store as well as Store Locator - decided by Product (@tangconst), as recommended. Carried by Store Locator · The Page, the URL line, and task 2.3 | `/<lang>/find-us`; `/<lang>/store-location` |
| Q10 | What are the title and the meta description? | A `storeLocator` head entry: title `Store Locator — Grade10`, description `Where to find the Grade10 shop in Causeway Bay, Hong Kong, and when it is open.`, leaving the hours out so it cannot drift from them - decided by Product (@tangconst), as recommended. Carried by Store Locator · The Page, the Document identity line, and task 1.6 | A description that prints the hours |
| Q11 | Are the address and hours translated? | Yes: the address is translated like the store name, and the hours are written in each language's own format - decided by Product (@tangconst), as recommended. Carried by Store Locator · Shop, the In each language line, the requirement "Store Locator answers with Location & Hours" with `grade10-site-store-store-locator-SC-10`, and task 1.6 | English address and hours in every language, which sit oddly beside a translated name |
| Q12 | Where are the shop facts kept? Asked of Product and Operations | The brand's own copy, shared by the free pick-up claim and Store Locator: the English address once in the site's shop module, which also builds the Maps destination and the embed, and the name, the translated address and the hours in the grade10 catalogs. The booking diary's main shop takes over once booking launches and the diary is translated - decided by Product (@tangconst), as recommended. Carried by Store Locator's Product decisions, the Where the facts are kept row, and tasks 1.6 and 2.3 | The diary's main shop now: one source with the grading emails, with a phone and holiday dates, but booking is not carried on public builds and its name and address are untranslated |
| Q13 | Is a public phone shown, and are there holiday hours? Asked of Operations | Neither in this change: the page shows no phone, and every day uses 11am – 9pm until Operations names a phone and holiday hours, which a follow-on change adds - decided by Product (@tangconst), as recommended. Carried by Store Locator · Shop, the No phone, no holiday hours line | A phone and holiday hours now, from facts nobody has confirmed |
| Q14 | Is the Storybook assembly the agreed look? | Yes, until a Figma frame is drawn. This change's interim, handed to draw-store-locator-page, where the designer confirms or redraws it. Carried by Store Locator Block · Designs, the Agreed look line | A frame drawn before the page is built |
| Q15 | What does the block show with no hours? | No such state: the hours are typed as a non-empty list, so a block with no hours rows does not build, as Q21 settles for the Maps destination; the site always supplies the shop's hours. This change's interim, handed to draw-store-locator-page, where the designer confirms or redraws it. Carried by the requirement "StoreLocator shows supplied Location & Hours" with `shared-ui-store-locator-SC-07`, and task 1.2 | The hours section left out, with a story of its own; a titled, empty hours section |
| Q16 | One hours row per day, or one Every day row? | One row per day, Monday first, which holds when a day or a holiday has its own hours. This change's interim, handed to draw-store-locator-page, where the designer confirms or redraws it. Carried by `ui-design.md`'s Default state and task 1.6 | One Every day row |
| Q17 | Does the map open Google Maps before any script runs? | Yes - the map's link is in the first response and opens Google Maps with no script, like the rest of the page - decided by the round, from the page's first-response line and `tech-design.md` | A link a script attaches once the page has loaded |
| Q18 | What does the map do when Google's embedded map does not load? | It keeps its place and still opens Google Maps for the shop; the link does not wait on the embedded map - decided by the round, from `tech-design.md` | A map that leads nowhere until the embedded map loads |
| Q19 | How does the map's place look when the embedded map does not load? | The map's box keeps its size and its muted background, with no message; the link still opens Google Maps. This change's interim, handed to draw-store-locator-page, where the designer confirms or redraws it. Carried by `ui-design.md`'s Map not loaded state | A message in the box; the box collapsed |
| Q20 | Does the store name in free pick-up open Store Locator in the same tab? | Yes - in the same tab and in the product page's language, like every link the site draws to its own pages; only the map, which leaves the site, opens a new tab - decided by the round | A new tab, as the map opens |
| Q21 | What does the block draw with no Maps destination? | Nothing: the map embed and the Maps destination are required props, so a block with no destination does not build - decided by the round, from `tech-design.md` | The map with no link; the block with no map |
| Q22 | Once Shipping fee is not a link, does it keep the underline the product page draws? | No: plain, like the text around it, since an underline on a label with no page reads as a broken link. This change's interim, handed to draw-store-locator-page, where the designer confirms or redraws it. Carried by Product Details · Free Pick-up, the No dead label line, and task 1.4 | The underline the redesign draws |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-site/store/store-locator | Accept review: the address Store Locator answers at is unsettled. | Q9 |
| grade10-site/store/store-locator | Accept review: the title and description strings are unsettled. | Q10 |
| grade10-site/store/store-locator | Accept review: the shop's address and hours have no translation, although its name has one. | Q11 |
| grade10-site/store/store-locator | Accept review: the page fixes the hours as copy, while the grading emails print them from the booking diary. | Q12 |
| grade10-site/store/store-locator | Accept review: phone and holiday hours are unsettled. | Q13 |
| shared/ui/store-locator | Accept review: no Figma frame draws the page. | Q14 |
| shared/ui/store-locator | Accept review: no requirement and no story says what the block shows with no hours rows, and a draft case already asserts one answer. | Q15 |
| shared/ui/store-locator | Accept review: the story draws seven day rows; the page says every day. | Q16 |
| grade10-site/store/store-locator | Accept review: the map's box has no agreed look when the embedded map does not load. | Q19 |
| grade10-site/store/product-page | Accept review: Shipping fee stops being a link, and the underline the redesign draws would read as a broken link. | Q22 |
| grade10-site/store/store-locator | Blind pass: does the map open Google Maps before scripts run? The page's content is visible without scripts; the map's link is not said to work then. | Q17 |
| grade10-site/store/store-locator | Blind pass: what does the collector see when the embedded map does not load, and does the map still lead to Google Maps? | Q18 |
| grade10-site/store/product-page | Blind pass: does the store name in free pick-up open Store Locator in the same tab or a new one? The map's new tab is stated; the claim's link is not. | Q20 |
| shared/ui/store-locator | Blind pass: what does the block draw when no Maps destination is supplied - the map with no link, or no map? Empty hours is stated; a missing destination is not. | Q21 |
