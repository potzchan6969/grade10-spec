# Remove collection banner

**Author:** @constancetang - 2026-08-18

## Why

The listing page currently stacks a collection hero above the results: trail,
collection name, description, and an optional pack shot. The list header now
carries that collection name as its title, so a shopper meets the same name
twice, once as a full-width banner and again beside the result count. The
banner's description and image are not used to choose a product; they occupy
the first screen of every category and search results page before the grid.

Removing the hero leaves one title, on the header, and puts the products
closer to the top of the page. Time to first product tile should fall as a
result, and a shopper comparing Storybook to the listing they use should no
longer meet a banner the surface has dropped.

## What Changes

- **`CollectionBanner` leaves the listing surface.** **BREAKING:**
  `CollectionBanner` and `CollectionBannerProps` are removed from the shared
  UI package. Breadcrumbs, description, and image leave with it.
- **Collection identity stays on the list header.** The consumer-supplied
  `title` on `ProductListHeader` / `ProductBrowse` is the collection name.
- **The product list page no longer renders the banner.** The preview
  assembly is `Nav`, `ProductBrowse`, `Footer`.

## Capabilities

- **New Capabilities:** none
- **Modified Capabilities:**
  - `shared/ui/store-product-listing`: the listing surface no longer exports
    or requires a collection banner

## Impact

- `@grade10/ui`: delete `CollectionBanner`, its stories, Code Connect
  template, and fixture. Drop both names from the public entry.
- `apps/preview`: drop the banner from the product list page.
- Consuming applications must stop importing `CollectionBanner` and stop
  passing breadcrumbs, description, and a banner image into the listing
  page. Typecheck catches leftovers. Keep passing `title`.

## Non-goals

- Relocating breadcrumbs, description, or a hero image onto
  `ProductListHeader` or `ProductBrowse`.
- Changing the list header title, count, sort, or filter controls.
- Republishing or deleting the Figma set `Product / Collection Banner`
  (`4248:5104`). That set still exists; this change records the mismatch.
