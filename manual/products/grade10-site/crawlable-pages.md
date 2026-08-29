---
title: What an address serves
summary: Real content, share metadata and an honest status in the first response, before any script runs.
spec: grade10-site/crawlable-pages
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
read without running scripts.

Crawlers are told what to fetch: `robots.txt` permits the public surfaces and
says where the sitemap is. The sitemap is read when it is fetched, not when the
site was built, so a card the catalogue gained this morning is listed with no
deploy behind it. It lists nothing session-gated, no unfilled pattern, and
nothing that does not answer.

::spec{id="grade10-site/crawlable-pages" scenario="crawlable-pages-SC-10"}

An address answers with its true status. One nested under a surface answers 200
as the deepest surface that names it; one the site does not hold answers 404 —
and still shows the not-found surface rather than a bare error page.

The profile and sign-in are session-shaped and out of scope here. The auction's
lot pages are in scope, and apply every requirement below per lot.

## What a collector, a crawler and a link preview do

::journeys{id="grade10-site/crawlable-pages"}

:::detail{title="Where this is implemented" for="engineer"}
An SPA's server-rendered half lives in its `src/serving/` directory; read
[docs/architecture/serving.md](https://github.com/9gag/grade10/blob/main/docs/architecture/serving.md)
before touching it. Per-locale addresses, alternates and the document language
declaration bind the same surfaces and are the localization capability's.
:::

## The contract

::spec{id="grade10-site/crawlable-pages"}
