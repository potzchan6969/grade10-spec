---
title: Crawlable Pages
spec: grade10-site/site/crawlable-pages
order: 2
---

A public surface is one a collector reaches with no session — today the
marketing page, the store and the auction. Every one of them puts its title,
description, headline and static copy in the first response. A collector on a
slow connection, a crawler and a link preview all get something real without
executing anything, and scripts then make that surface interactive rather than
redrawing it from blank.

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

- 🚧 **One item, one address** — an item for sale answers at one address only.
  The channel it sells in is fixed when it is first published, so the same item
  is never offered under a second channel as well
- 🚧 **A channel's paths stop at its top-level category** — a subcategory, a
  publisher, a brand, a theme, a grade, a year, an order, or one seller's items
  is a way of reading a channel's own address, carried in the query. The
  address without the query is the one a search engine is told to keep
- 🚧 **One identity address, shared** — a seller or a shop the site names has
  one address, the same one from every channel; no channel keeps a copy of its
  own
- 🚧 **A replaced address redirects for good** — an address the site no longer
  uses sends the reader on to the one that replaced it, permanently, and
  nothing on the site links it, names it or lists it again

## Server rendering

:::detail{title="Code map" for="engineer"}
An SPA's server-rendered half lives in its `src/serving/` directory; read
[docs/architecture/serving.md](https://github.com/9gag/grade10/blob/main/docs/architecture/serving.md)
before touching it. Per-locale addresses, alternates and the document language
declaration bind the same surfaces and are the localization capability's.
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
page holds. How a search engine ranks any of it.

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
:::
