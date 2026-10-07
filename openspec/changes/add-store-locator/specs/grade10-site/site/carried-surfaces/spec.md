# grade10-site/site/carried-surfaces Specification

## Feature set

- What a build carries
  - Store surfaces: the store, its collections, a card's page, the shop's two
    handed-out addresses, the cart, the checkout, a collector's order history
    and order detail, and Store Locator

## ADDED Requirements

### Requirement: Store Locator waits with the store

Store Locator, the shop's location and hours, is a surface of the store's
set.

**One gate** - A build SHALL carry Store Locator wherever it carries the
store's set, and SHALL withhold it wherever it withholds the store's set:
its address, its header and footer items and its sitemap entry move with
the store, on every lane.

<!-- trace:scenario id=g10.site-carried-surfaces.SC-wjy rev=1 -->
#### Scenario: grade10-site-site-carried-surfaces-SC-41 - Store Locator waits with the store
**Serves:** `grade10-site-site-carried-surfaces-US-01`, `grade10-site-site-carried-surfaces-US-03` - the collector and the crawler on a build whose shop has not opened meet no shop location either

- **GIVEN** a build made for production or preview
- **WHEN** a collector opens the Store Locator address
- **THEN** it is not found
- **AND** neither the header nor the footer names Store Locator
- **AND** the sitemap does not list it
- **AND** a build made for development or staging answers it, names it in the
  header and the footer, and lists it in the sitemap
