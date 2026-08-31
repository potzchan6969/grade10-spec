# Card and lot addresses name their language

**Author:** @seankcw - 2026-08-24

## Why

A collector reading the store in Traditional Chinese opens a card and the page
is Traditional Chinese — until they share the link. The address they copy,
`/store/products/<handle>`, carries no language. Whoever opens it next is
answered in the language *their* browser remembers, and a browser with no
memory is answered in English. Every crawler is such a browser.

So the Chinese half of the catalogue is unreachable from outside the site. The
marketing page, the storefront and the auction each answer at three addresses
and each declares the other two; the cards and lots beneath them answer at one,
declare no variants, and appear in no sitemap. A search for a card by its
Chinese name can only ever find the English page, and a Chinese-language link
shared into a group chat opens in English for everyone in it. Cards and lots
are where a collector actually lands from outside — the surfaces above them are
the front door, not the destination.

Two things make this worse than a gap. The storefront's listings arrive by
script, so a crawler following links from `/tc/store` may never discover a card
address at all — the sitemap is the only reliable path in, and it names none of
them. And a prefixed card address is not merely absent: `/tc/store/products/<handle>`
answers today with status 200 and the Traditional Chinese *storefront*, because
the prefixed store surface owns everything beneath it and no card surface is
registered under the prefix. A collector who edits a URL, or a crawler that
guesses the pattern the other surfaces follow, is shown the wrong page and told
it was the right one.

Measure: cards and lots indexed under `/tc` and `/sc` — structurally zero today
— and the share of organic entries onto a card or lot address that land in
Chinese.

## What Changes

- Every public surface takes an address per locale, not just the ones the build
  writes a document for. A card and a lot each answer at their existing address
  in English and under `/tc` and `/sc` in the two Chinese, and each of those
  declares the other two as its alternates.
- **BREAKING** `/tc/store/products/<handle>` and `/tc/auction/listings/<id>`
  stop answering as the storefront and the auction. They answer as the card and
  the lot, in that language — or 404 when the catalogue holds no such thing,
  the way the unprefixed addresses already do.
- The unprefixed card and lot addresses become the English canonical and stop
  varying by what a browser remembers. A collector whose remembered locale is
  not the default ends at that locale's address, the same rule the marketing
  page, storefront and auction already follow.
- The sitemap lists every card and lot the catalogue holds, once per locale,
  and is produced when it is asked for rather than written by the build — a
  card added to the catalogue appears without a deploy.
- Links out of a Chinese storefront or auction point at the Chinese card and
  lot addresses.

## Non-Goals

- ZZZ. It speaks one language and its addresses carry no prefix; nothing here
  reaches it.
- Session-shaped surfaces. The profile and sign-in stay unprefixed and keep
  rendering the remembered locale.
- Translating what a merchant or seller typed. A card's name and description
  render as authored on every one of its addresses; this change moves the
  platform's own copy and the addresses, not the catalogue's content.
- Admin panels, which the localization capability already puts out of scope.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `localization`: the requirement that a grade10 public address names its
  language currently exempts a surface rendered when its address is asked for.
  That exemption goes: every public surface answers at one address per locale,
  and the memory redirects an unprefixed arrival on all of them.
- `grade10-site/crawlable-pages`: the sitemap currently lists exactly the
  surfaces the build writes a document for and is forbidden from naming a card
  or a lot. It now names every one of them, per locale, read from the catalogue
  when the sitemap is fetched.

## Impact

- The grade10 site's address table and the worker in front of it: a prefixed
  address must resolve to the deepest surface naming it, which is what today's
  `/tc/store/products/<handle>` mis-serve fails to do.
- The sitemap becomes catalogue-sized. Three locales multiply it, and a crawler
  refuses a sitemap past a fixed number of URLs and a fixed size — how it stays
  under that is delivery's to settle.
- Existing unprefixed card and lot links keep working and keep their meaning:
  they are the English address, and the sitemap and the alternates say so.
- `grade10-store/product-page` and `grade10-auction/listing-page` already defer
  to `grade10-site/crawlable-pages` for share metadata and sitemap entries;
  neither needs a requirement changed, and the product-page purpose's claim of
  a sitemap entry per card becomes true.
