---
title: Crawlable Pages
spec: grade10-site/site/crawlable-pages
order: 2
---

A public surface is one a collector reaches with no session, on a build that
carries it — [Carried Surfaces](/p/grade10-site/site/carried-surfaces). Every
one of them puts its title, description, headline and static copy in the first
response. A collector on a slow connection, a crawler and a link preview all
get something real without executing anything, and scripts then make that
surface interactive rather than redrawing it from blank.

Each surface names itself. Its title and description belong to it and no other
surface, and on an in-page navigation the document title becomes the
destination's. A shared link unfurls from Open Graph tags a preview fetcher can
read without running scripts. A surface with a picture of its own — a store
card's page — hands it over already at the box a preview lays out and says the
dimensions, so the preview is drawn before the picture has been fetched. A
surface with no picture carries no image tag rather than a broken one. Every
surface names the card shape it wants — wide where it hands a picture over,
small where it does not — because a fetcher may size the card from that name
rather than from the picture.

Crawlers are told what to fetch: `robots.txt` permits the public surfaces and
says where the sitemap is. The sitemap is read when it is fetched, not when the
site was built, so a card the catalogue gained this morning is listed with no
deploy behind it. It lists nothing session-gated, no unfilled pattern, and
nothing that does not answer.

An address answers with its true status. One nested under a surface answers 200
as the deepest surface that names it; one the site does not hold answers 404 —
and still shows the not-found surface rather than a bare error page.

The profile and sign-in are session-shaped and out of scope here. The auction's
lot pages are in scope, and apply every requirement below per lot.

## One Address Per Thing

The site answers for one thing at one address. A second address for the same
thing splits what a search engine has learned about it between the two.

- **One item, one address** — an item for sale answers at one address only.
  The channel it sells in is fixed when it is first published, so the same item
  is never offered under a second channel as well
- **A channel's paths stop at its top-level category** — a subcategory, a
  publisher, a brand, a theme, a grade, a year, an order, or one seller's items
  is a way of reading a channel's own address, carried in the query. The
  address without the query is the one a search engine is told to keep
- **One identity address, shared** — a seller or a shop the site names has
  one address, the same one from every channel; no channel keeps a copy of its
  own
- **A replaced address redirects for good** — an address the site no longer
  uses sends the reader on to the one that replaced it, permanently, and
  nothing on the site links it, names it or lists it again

:::callout{kind="warning"}
What ships and what the durable spec says have parted company here: the three
sections below already run in production, and
`openspec/specs/grade10-site/site/crawlable-pages` has not yet folded them
into checkable requirements.
:::

## Search Result Text

- **The merchant's words come first** — a card's search-result title and
  description are the ones written in the shop's own SEO fields when the
  merchant wrote them; where either is blank, the catalogue's own title and
  description stand in its place
- **Cut on a word, not mid-sentence** — a description longer than a result
  shows is cut at 160 characters, ending on a word and saying it was cut; the
  whole text still lives on the page and in its structured data
- **Vendor is the brand** — the shop's vendor field names who a card's
  product is by, the word a search engine's own brand facet reads

## What Each Surface Calls Itself

The names live in the message catalogs — `head.json`, once per language, in
`packages/i18n/messages/grade10/`. The table mirrors the English ones so a
reader sees them without opening the catalog; where a row and the catalog
disagree, the catalog is right. The auction's two rows, the two legal pages
and not-found answer on every lane today; the rest wait behind their own
gates or their builds — [Carried Surfaces](/p/grade10-site/site/carried-surfaces).
Session-shaped surfaces — sign-in, the profile, a collector's orders and
cases — keep off this list.

| Surface | Address | Catalog key | Title | Description | Share image |
| --- | --- | --- | --- | --- | --- |
| Front door | `/` | `marketing` | Grade10 — graded cards, bought and sold in one place | Buy graded slabs outright from the Grade10 store, or bid on the ones that only come up once. One account carries your profile, your orders, and your bids. | none |
| Auction | `/auction` | `auction` | Auctions — Grade10 | Every published Grade10 sale and the lots under it, with the top bid on each. Browsing needs no account; bidding does. | none |
| Auction lot | `/auction/listings/{slug}` | `auctionListing` | {name} — Auction \| Grade10 | {name}, up for auction at Grade10. | ❓ none — a lot's share tags name no image today |
| Store | `/store` | `store` | Marketplace — Grade10 | Sealed boxes, singles and graded slabs, priced and ready to ship. Start from a collection, or bid on the cards that only come up once. | none |
| Collections | `/store/collections` | `storeCollections` | All collections — Grade10 | Graded slabs at a fixed price, each listed with its grade. Browse every collection the Grade10 store carries and check out when you are ready. | none |
| Product | `/store/products/{handle}` | `product` | {name} — Marketplace \| Grade10 | {name}, listed at the Grade10 store. | the card's first catalogue image, at 1200×630 |
| Terms | `/terms` | `terms` | Terms of Service — Grade10 | The terms you agree to when you buy, bid, grade or vault a card with Grade10. | none |
| Privacy | `/privacy` | `privacy` | Privacy Policy — Grade10 | What Grade10 records about a collector, why it is kept, and what a collector can ask for it. | none |
| About | `/about` | `about` | About — Grade10 | Grade10 is backed by MemeStrategy and 9GAG. It buys, sells, grades, vaults and finances graded cards. | none |
| Press | `/press-releases` | `press` | Press releases — Grade10 | Every press release Grade10 has published, newest first. | none |
| Press article | `/press-releases/{slug}` | `pressArticle` | {title} — Press \| Grade10 | {title}, a Grade10 press release. | none |
| Shows | `/shows` | `shows` | Shows — Grade10 | The shows where the Grade10 community gathers — what's coming up, and the record of past editions. | none |
| Media coverage | `/media-coverage` | `mediaCoverage` | Media coverage — Grade10 | What the press says about Grade10: stories on its events, the collectibles market, vaulting, finance and trading cards. | none |
| Book a visit | `/book` | `book` | Book a visit — Grade10 | Pick a service, a shop and a time to bring a card in. No account needed. | none |
| Manage a visit | `/book/manage` | `bookManage` | Your visit — Grade10 | See, move or cancel a visit you booked with Grade10. | none |
| Your visits | `/book/mine` | `bookMine` | Your visits — Grade10 | Every visit booked with Grade10 under your email address. | none |
| Walk-in | ❓ under `/book` | `bookWalkIn` | Walk in — Grade10 | Today's walk-in wait and hours at a Grade10 shop. | none |
| Walk-in ticket | ❓ under `/book` | `bookTicket` | Your ticket — Grade10 | Follow your place in the walk-in line at a Grade10 shop. | none |
| Grading | `/grading` | `grading` | Card grading — Grade10 | Get your cards graded by PSA, CGC or BGS. Plan your list and see the fees, hand it in at the shop, and collect your slabs there. | none |
| Store Locator | `/store-locator` | `storeLocator` | Store Locator — Grade10 | Where to find the Grade10 shop in Causeway Bay, Hong Kong, and when it is open. | none |
| Membership | `/membership` | `membership` | Membership — Grade10 | The Grade10 membership programme: points on every order, tiers and member rewards. | none |
| Join | `/join` | `join` | Join the programme — Grade10 | Join Grade10's membership programme: earn points on every order and move up tiers for better rewards. | none |
| Not found | any address the site does not hold | `notFound` | Nothing is here — Grade10 | The link may be wrong, or the page may have moved. | none |

Only a card's page carries a share image today; no brand-level `og:image`
asset exists, so every other surface names its card shape and no image.

## One Address, Every Language

- **A canonical link matches the share address** — the same address `og:url`
  names, so a reader consolidating by either sees one page
- **Every language answers, one default among them** — each surface names
  its own address per language as an alternate, plus one `x-default` address
  for a reader whose language none of them is
- **A locale follows the shop, not the script** — a language's `og:locale`
  carries the territory the shop trades from rather than a bare script tag;
  Traditional Chinese carries Hong Kong's, because that is where the shop is

## Structured Data

- **The front door names the organisation** — the site's own name, address
  and logo, in schema.org's words, so a search engine can attribute the site
  rather than guessing
- 🚧 **A card is a product with an offer** — the merchant's vendor as its
  brand, one offer for the card's one item, priced and available exactly as
  the page shows it, a struck-through price carried as the same saving the
  page draws
- **The trail above a surface is a breadcrumb** — the same steps the page
  draws, in the order it draws them, in the page's own language
- **Never a claim past the page** — structured data restates only what the
  page already shows; nothing here is asserted that a collector reading the
  page would not also see

## Server rendering

:::detail{title="Code map" for="engineer"}
- **Server-rendered half** — an SPA's `src/serving/` directory; read
  [docs/architecture/serving.md](https://github.com/9gag/grade10/blob/main/docs/architecture/serving.md)
  before touching it
- **Localization** — per-locale addresses, alternates and the document
  language declaration are the localization capability's
- **Search result text, canonical/alternate links, locale tags** —
  `apps/frontend/grade10/src/surfaceHead.ts`
- **Structured data** — `apps/frontend/grade10/src/structuredData.ts`
:::

:::detail{title="Product decisions" for="pm"}
A collector searching for a card should land on the page the site would have
shown them anyway. Two addresses for one thing split that page's standing
between them, and the site says which one counts rather than leaving a search
engine to pick.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector arriving from a search | Searches for a card the site sells | Opens the one address that sells it, not a near-copy of it. |
| Collector narrowing a channel | Picks a grade, a year or a seller | Reads the narrowing, and shares an address that opens the channel. |
| Collector following an old link | Opens an address the site has replaced | Lands on what replaced it, once, without a second hop. |

**Not in scope.** Which channels the site sells through. What a seller's own
page holds. How a search engine ranks any of it. Which shopping engines a
refund policy unlocks listing on.

| Signal | Definition | Owner |
| --- | --- | --- |
| Addresses held per item | How many addresses a search engine holds for one item. Unmeasured; the first delivery sets the baseline. | Product |
| Narrowed addresses indexed | How many narrowed readings of a channel a search engine holds separately from the channel itself. Unmeasured. | Product |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| The rules bind every channel | Decided | The rules are written for any channel the site answers rather than for the ones it answers today, so a channel added later arrives bound by them instead of needing them written again. | Product |
| The channel is fixed at first publication | Decided | An item's channel is settled when it is first published and never moves, because an item that changed channel would leave its first address behind as a second page for the same thing. | Product |
| Narrowing rides the query | Decided | A subcategory, a grade, a year, an order or a seller narrows a channel through its query, never through a path of its own. A path per narrowing multiplies addresses by every combination a collector can pick, and each of them says almost what the channel already says. | Engineering |
| A replacement redirects permanently | Decided | A replaced address answers with a permanent redirect, so a reader that remembers the answer stops asking. A temporary one keeps both addresses alive indefinitely. | Engineering |
| Identity is shared, never per channel | Decided | A seller or a shop has one address for the whole site. A copy per channel would divide what is known about one seller by the number of channels they sell in. | Product |
| Marketplace and seller pages | ❓ Open | Neither is built, and nobody has settled what a seller's page holds or which channel a marketplace would be. The rules above already bind both; the pages themselves need their own decision. | Product |
| Merchant SEO words override the catalogue's | Decided | A merchant's own SEO title and description win over the catalogue's when they set them, because the words closest to the sale are the ones most worth trusting a search result to show. | Product |
| Item templates name their channel | Decided | A product's title template reads `{name} — Marketplace \| Grade10` and a lot's `{name} — Auction \| Grade10`, because the two previously shared one template and a card's page could answer under a lot's name. | Product |
| Structured data restates, never invents | Decided | Structured data carries only what the page itself shows — a price, an image, a trail — so a rich result can never claim something a collector opening the page would not also see. | Engineering |
| Locale tags follow the shop's territory | Decided | A language's share locale names the territory the shop trades from rather than its script, because that is what a preview fetcher and a search engine route a result by. | Product |
| Refund policy copy | ❓ Open | A shopping engine refuses to list the shop's products until it publishes an approved refund and return policy; today's page is an unapproved placeholder kept off every stage. Legal owns supplying the real wording before the surface can go live. | Product |
:::
