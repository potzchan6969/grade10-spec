**Author:** @mason5991 - 2026-10-14

## Why

An operator who sells to Hong Kong and Taiwan collectors writes each lot's
title and description once, in English, and every collector reads that, whatever
language they browse the site in. The rest of the page already speaks their
language; the lot, the thing they decide on, does not.

Metric: share of Traditional and Simplified Chinese lot-page views that end in
a bid, against the English-page share. Unmeasured today; first delivery sets
the baseline.

## What Changes

- **Title and description per language** - an operator writes a listing's title
  and description in English, Traditional Chinese and Simplified Chinese, on the
  create and edit forms; English stays the one required text
- **Copy block language choice** - the listing's admin detail page shows the
  title and description in a language chosen once for the block, marking a
  language with no text as the English fallback
- **Collectors read their own language** - the card, the lot page and its share
  metadata show the text in the language the page is read in, English where the
  operator wrote none; one Chinese is never shown in place of the other
- **Search finds translated titles** - the admin Listings search matches a
  listing by any language's title
- **Relist keeps every language** - the new draft opens with all three texts
- **Product name and description per language** - an inventory admin writes a
  product's name and description in the same three languages on the product
  editor, reads them on the Details section of the product page, and finds a
  product by a translated name; the store pages read them in a later change
- **Labs seeds** - every admin Labs listing seed fills the Traditional and Simplified Chinese texts on the listing and its product
- **Customer view languages** - the editor's and record's preview of the lot page offers EN, 繁中 and 简中 on the desktop and phone frames, with the lot page title following the choice and no description drawn
- **BREAKING** - Localization states that anything a seller typed renders as
  authored; this change makes an auction listing's title and description the
  one exception

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-admin/auction/listing`: per-language title and description on the
  forms, the Copy block's language choice, translated titles in the Listings
  search, Relist carrying every language
- `grade10-site/auction/listing-page`: the card, the lot page and its share
  metadata read in the page's language, with the English fallback
- `grade10-admin/inventory/catalog`: per-language product name and description
  on the editor and the Details section, translated names in the product search
- `shared/localization`: the source-language rule gains the auction listing
  exception

## References

- [Auction Management](../../../docs/prds/products/grade10-admin/auction/management.md#listings)
- [Auction](../../../docs/prds/products/grade10-site/auction/display.md#listing-schema)
- [Localization](../../../docs/prds/platform/shared/localization.md)
- [Products and Stock](../../../docs/prds/products/grade10-admin/inventory/catalog.md#product-identity)

## Impact

- `packages/grade10-auction`: contracts, backend (listing storage, projection,
  Listings search, Relist), admin forms and Copy block, storefront card and lot
  page
- A migration adds the translated texts to listings and to products; existing listings need no
  backfill
- `packages/frontend-console`: the shared customer view and `scripts/lib/bundle-fence.mjs`
- No consumer outside Auction: the order, invoice, email, push and Slack texts
  keep the English title

## Suite Impact

- **Domain** - `grade10-admin/auction` takes a case: `g10adm.auction-dmn.US5-TC1` walks the operator writing a language, the collector reading it and staff quoting the English title (decision 25)
- No domain impact: `grade10-site/auction` - its domain suite traces `grade10-site-auction-listing-page-US-01` and `grade10-site-auction-listing-page-US-02` and walks the English address; the change adds no path across capabilities there, and the path from the operator to the collector is the admin domain case
- No domain impact: `grade10-admin/inventory` - it has no domain suite and the change touches one capability in it
- No product impact: `grade10-admin/product-tcs.md` traces `grade10-admin-inventory-catalog-US-12`, `grade10-admin-inventory-catalog-US-13` and listing journeys this change does not touch
- No platform impact: the store has no `platform-tcs.md`

## Follow-on changes

- The store's product listing and product page reading the translated product name and description
- A collector search over auction lots, when the site has one, finds a lot by
  any language's title
- Translated product names in Auction's `productSearch`, if a screen ever calls it
- Further languages for a listing's texts
