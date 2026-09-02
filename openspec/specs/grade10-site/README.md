# grade10-site

The grade10 site — the collector-facing application. It holds the shell every
page renders in, how the site answers an address, and every surface inside it:
the store, the auction, and the loyalty programme. The operator surfaces that
publish and close out an auction listing belong to `grade10-admin`.

Capabilities are grouped one level further, by the domain inside the site they
belong to.

## `site` — the site itself

| Capability | What it governs |
| --- | --- |
| [`site/page-shell`](site/page-shell/spec.md) | The header, region, and footer every page is wrapped in. |
| [`site/navigation`](site/navigation/spec.md) | Which surface an address resolves to once the site is running in the browser, and what a navigation preserves. |
| [`site/crawlable-pages`](site/crawlable-pages/spec.md) | What a public address serves before any script runs: title, description, share metadata, sitemap, and an honest status. |

## `store`

| Capability | What it governs |
| --- | --- |
| [`store/home`](store/home/spec.md) | What the store address serves: the hero, the collections, and the merchandised row. |
| [`store/product-listing`](store/product-listing/spec.md) | Where the browse listing answers, and how an address narrows it to one collection. |
| [`store/product-page`](store/product-page/spec.md) | What one card's address serves, and the refusal when the catalogue holds no such card. |

## `auction`

| Capability | What it governs |
| --- | --- |
| [`auction/auction`](auction/auction/spec.md) | The auction itself: the listings catalogue, the scheduled and extendable bidding window, and the one card authorization a bidder holds per listing. |
| [`auction/listing-page`](auction/listing-page/spec.md) | What one lot's address serves, what a shared link unfurls as, and the refusal when no such lot exists. |
| [`auction/auto-bidding`](auction/auto-bidding/spec.md) | A collector commits a maximum, and Grade10 bids for them only as far as needed to lead. |
| [`auction/bidding-history`](auction/bidding-history/spec.md) | A collector's private index of every retained bidding interaction on their own account. |
| [`auction/listing-media`](auction/listing-media/spec.md) | Alt text and named public sizes for a listing's gallery images, and how the catalogue consumes them. |

## `loyalty`

| Capability | What it governs |
| --- | --- |
| [`loyalty/programme`](loyalty/programme/spec.md) | The points-and-tiers membership programme: earning, expiry, tiers, the reward menu, and the operator actions that run it. |

A capability's OpenSpec ID is `grade10-site/<domain>/<capability>`. Add one as a
change under `openspec/changes/` rather than directly.
