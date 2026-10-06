## Context

- **One table decides a build** — every address the grade10 site answers is
  a row in `apps/frontend/grade10/src/surfaces.ts`, with a `kind` and a
  `gate`. Route registration and the not-found holes (`src/routes.ts`), the
  prerender list, the worker, the sitemap (`src/serving/crawlerDirectory.ts`),
  `scripts/check-public-pages.mjs` and the browser smoke lane all read
  `carriedSurfaces(gates)`, so a row is carried or withheld everywhere at once
- **The chrome names surfaces by route id** — `src/chrome/siteContent.ts`
  holds the header's `NAV_LINKS` and the footer's links; `navLinksFor` drops
  what a build does not carry, and Help is appended after the table. The
  footer draws Store Locator only beside the shop column
  (`src/chrome/SiteShell.tsx:184-195`); its `#` link and the listing's `#`
  utility row are removed by the grade10 `fix` the proposal names, before
  this change
- **A surface's head is the brand's catalog** — `surfaceHead` reads
  `head[surface]` from the grade10 layer, so a prerendered row with no head
  entry is a compile error
- **Free pick-up is a dead link today** — `StoreProductMetadata` defaults
  `pickupHref` and `shippingFeeHref` to `#`, and `ProductView` passes neither
  (`packages/grade10-store/frontend/src/features/products/product/presentation/views/ProductView.tsx:132`)
- **The store name is answered in `shared/`** — `product.hongKongGrade10Store`
  in four languages, Korean among them, although only grade10 has the shop
- **The reveal hides server markup** — `useFirstPaintReveal` renders every
  section at `opacity-0` until an effect runs after hydration; its four blocks
  (order details, order history, auction record, winner order) are session
  surfaces, so nobody has met it on a public page yet. The preview's Store
  Locator page story is a fifth user, importing the hook and its classes by
  relative path (`apps/preview/src/pages/store-locator-page.stories.tsx:8-15`),
  and the preview's order history, order details, winner order and My Auctions
  page stories wait on the blocks' `data-revealed`
- **No source holds the shop's facts** — the app repository names neither
  the address nor the hours; the preview's fixture is the only copy
  (`packages/ui/src/blocks/store-order-detail/fixtures.ts:193`)

## Goals / Non-Goals

**Goals**

- **One row, one gate** — Store Locator is carried, linked and listed by the
  same row, behind the store's gate, with nothing in the chrome or the
  sitemap deciding it a second time
- **Whole in the document** — the page's words, facts and map link are in
  the prerendered HTML and visible with no script having run
- **One name, two surfaces** — the free pick-up claim and Store Locator read
  the store name from one catalog key

**Non-Goals**

- **A data read** — no loader, no service, no table; the page is built from
  the catalogs and one constant module
- **A new gate** — Store Locator opens with the store ([Q5](decisions.md#decisions))
- **The listing's utility row** — its `#` links are a `fix` in grade10 before
  this change, as the proposal states

## Decisions

### Store Locator is one row behind the store's gate

The address, which builds answer it, and what a crawler is offered are
specified by `grade10-site/store/store-locator`, `grade10-site/site/carried-surfaces`
and `grade10-site/site/crawlable-pages`. The implementation adds one row:

```ts
storeLocator: {
  address: "/store-locator", // Q9
  kind: "prerendered",
  gate: "store",
  e2e: { doSmoke: true, session: "anonymous" },
},
```

- **Derived from the row** — `routes.ts` gains `storeLocator:
  "routes/store-locator.tsx"` in `MODULES`, which the compiler asks for and
  from which the language-prefixed addresses derive; the not-found holes on
  uncarried builds, the prerendered document, the sitemap entry, the
  public-pages check and the smoke lane follow from the row
- **The unprefixed address is listed** — `routesFor` registers each
  surface's unprefixed English address by its own `at` line
  (grade10 `apps/frontend/grade10/src/routes.ts:157-190`), so it gains
  `...at("storeLocator", MODULES.storeLocator)`, ranked with the other
  top-level surfaces; without it the English address falls to not-found
- **Outside `/store`** — an address beneath `/store` sits inside the store's
  pattern (`/store/*`) and `isWithin` would mark Store as current there too;
  every option in Q9 is a top-level address
- **Rejected** — a `storeLocator` gate of its own, which would open the page
  apart from the shop its footer column stands beside

### The chrome reads the same row

- **Header** — `NAV_LINKS` gains `{ label: "storeLocator", to: "storeLocator" }`
  as its last entry, so `navLinksFor` drops it where the build does not carry
  it and Help, appended after the table, follows it. Current marking is the
  existing `isWithin(current, link.to)`
- **Footer** — the Help column gains a `FooterSiteLink` to `storeLocator`,
  first in the column, drawn where `storeLocator` is in
  `carriedSurfaces(config.gates).served`. It keys on the row rather than on
  the shop column's read, so it is present on the first render rather than
  after the collections answer
- **Words** — `chrome.nav.storeLocator` joins the shared layer in all four
  languages, the words `chrome.footer.storeLocator` already holds

### The page is the block over catalog copy and one constant module

- **Route** — `routes/store-locator.tsx` returns `surfaceHead("storeLocator",
  location.pathname)` from `meta` and renders `pages/store-locator/StoreLocatorPage.tsx`;
  no loader
- **Words** — a `storeLocator` namespace in the grade10 brand layer, in
  `en`, `zh-Hant` and `zh-Hans`: the heading, the hours heading, the map's
  title and link name, the address lines, and the hours rows Q16 settles (a
  day label and an hours text each; recommended seven, Monday first). Day
  labels are catalog words, never `Intl` output, which can differ between
  the Node prerender and the browser and break hydration. How the address
  and hours read in Chinese is Q11
- **Store name** — `product.hongKongGrade10Store` moves from `shared/` to the
  grade10 layer (a `product` file per language) and both surfaces read that
  key; Korean loses it, since ZZZ has no shop
- **Head** — `head.storeLocator` with `title` and `description` in the three
  grade10 head files (Q10)
- **Maps** — `pages/store-locator/shop.ts` builds the Maps destination
  (`https://www.google.com/maps/search/?api=1&query=…`) and the embed source
  (`https://www.google.com/maps?q=…&output=embed`) from one address query
  string, so the link and the map cannot name two places. Neither is copy:
  the address the query names does not change with the language
- **Q12** — if Product and Operations choose the booking diary's main shop,
  only the module that supplies the facts changes; the block and the route
  do not

### StoreLocator draws the map as one link over an inert embed

The block's exports and behaviour are `shared/ui/store-locator`'s. The
implementation lives in `packages/ui/src/blocks/store-locator/store-locator.tsx`:

| Prop | Type | Note |
| --- | --- | --- |
| `copy` | `StoreLocatorCopy` | `heading`, `hoursHeading`, `mapTitle`, `openMap` |
| `name` | `string` | |
| `addressLines` | `readonly string[]` | |
| `hours` | `readonly StoreLocatorHoursRow[]` | `{ day, hours }` |
| `mapEmbedSrc` | `string` | required |
| `mapsHref` | `string` | required |

- **One stop** — the `iframe` carries `inert`, `aria-hidden` and
  `pointer-events-none`; an `<a target="_blank" rel="noopener noreferrer">`
  covers it, named by `copy.openMap`. `tabIndex={-1}` alone, as the preview
  draws it, keeps the frame's own controls in the tab order in Chromium;
  `inert` removes the frame and its document
- **Both map props required** — the type refuses a block with no
  destination, so a map that leads nowhere is not a state the block has
- **Layout** — the preview page's: a container grid, map first, one column
  below `@3xl`; the page story moves to compose the block
- **Heading** — the block draws the page's `h1`, since it is the page's
  whole content between the chrome

### The first-paint reveal runs in CSS

`packages/ui/src/blocks/shared/use-first-paint-reveal.ts` becomes a set of
classes and a delay helper, with no hook and no `revealed` state:

- **Resting state visible** — the markup carries `animate-in fade-in
  slide-in-from-bottom-2` at the same 280 ms and easing, `fill-mode-both`,
  the stagger as `animation-delay` (40 ms a step, capped at 6), and
  `motion-reduce:animate-none`. Without CSS animation the section is simply
  there
- **Every user moves** — order details, order history, auction record and
  winner order drop `useFirstPaintReveal` and their `revealed` flags; the
  preview's Store Locator page story moves to the classes; the blocks' stories
  and the preview's order history, order details, winner order and My Auctions
  page stories stop waiting on `data-revealed`. All of them move in one commit,
  so no commit leaves an importer of the removed hook
- **Hydration** — hydration reuses the server's elements, so the entrance
  runs once on first paint and not again; a client navigation mounts new
  elements and runs it as today
- **Rejected** — a `<noscript>` override, which covers a collector with
  scripts off but leaves the page hidden until hydration for one whose
  scripts are slow; a reveal local to `StoreLocator`, which would keep two
  mechanisms for one motion

### Free pick-up links only where a page answers

- **Block** — `StoreProductMetadata` drops both `#` defaults; a label with no
  href is drawn as the line's own text. No consumer passes `shippingFeeHref`,
  so Shipping fee is never a link
- **Feature view** — `ProductView` gains an optional `pickupHref` and passes
  it through
- **Preview** — the product detail passes the workbench's Store Locator story
  as `pickupHref`, so the agreed look links the store name as the site does
- **Site** — `pages/store/ProductPage.tsx` passes `addressOf("storeLocator")`
  where the build carries `storeLocator`; the product page and Store Locator
  share the store's gate, so the claim is a link wherever the page answers
- **Same tab** — the claim is an in-site link, opened in place like every
  other link the site draws to its own pages

## Risks / Trade-offs

- **[Risk] Google refuses the keyless embed** → the link over the map does
  not depend on the frame loading, so activating the map's place still opens
  Google Maps; the box keeps its size and muted background until the designer
  answers Q19
- **[Risk] The reveal change moves four agreed blocks** → the motion values
  are unchanged and only the mechanism moves; the commit carries a
  `Design-Override:` trailer on the designer's yes, and each block's stories
  run in the same commit
- **[Risk] The address is costly to change once crawled** → the row is not
  merged before Q9 is answered; the change cannot be accepted with Q9 open
- **[Trade-off] Shop facts in the catalogs** — a change of hours is a catalog
  edit and a deploy; accepted until Q12 is answered

## Migration Plan

1. **This store** — the block, the CSS reveal, the metadata labels and the
   catalogs land; the preview page composes the block
2. **grade10** — bump `external/grade10-spec`, then the row, the route, the
   chrome and the product page land in one deploy, so the footer gains Store
   Locator and the pick-up claim its link with the page's arrival
3. **Rollback** — revert the grade10 commit; the row's removal takes the
   route, the chrome links and the sitemap entry with it

## Open Questions

- **Agreed look** — Q14 to Q16 and Q19 are the designer's; none changes the
  props, the route or the tasks, only the stories and the hours rows supplied
- **Non-link label look** — Q22, whether a label with no page keeps the
  underline the redesign draws; the designer's, and a class on one element
