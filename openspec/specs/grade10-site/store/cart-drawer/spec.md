# grade10-site/store/cart-drawer Specification

## Purpose

The Grade10 Store cart drawer lets a collector recognise the products in the current reviewed cart without leaving the page.

## Feature set

- Product pictures
  - Current catalogue: shows each retained line's first product picture from the existing live read
  - Correct line: joins picture facts only to the confirmed matching variant
  - Missing picture: preserves the placeholder, amounts and readiness
  - Restored cart: obtains pictures from review rather than persisted intent
  - Compatible responses: accepts legacy and enriched reviewed-line payloads

## Requirements

### Requirement: Reviewed product pictures follow the current cart

The drawer SHALL show each retained line's first current product picture,
matching the collection card's picture selection. The existing batched live
review SHALL supply it without a separate product request per line. The
application SHALL join picture facts by variant identity only for the current
cart lines confirmed by that review. Unmatched, removed or unreviewed lines
SHALL NOT receive another line's picture or stale picture facts.

Picture facts SHALL remain reviewed display data. Stored cart intent and
cart-write inputs SHALL contain no picture metadata. Restoring an image-free
member cart SHALL obtain its pictures through a fresh review. Missing pictures
SHALL leave the existing placeholder, quantities, status, money, badge count
and checkout readiness unchanged. Catalogue failure SHALL retain the existing
unresolved-read outcome and Checkout guard.

A picture resource that fails to load after a successful review SHALL NOT
change the accepted line facts, amounts or checkout readiness. The existing
browser image presentation remains in effect.

<!-- trace:scenario id=g10.store-cart-drawer.SC-0d6 rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-34 - The first current product picture reaches its line
**Serves:** g10.store-cart-drawer.US10 - Collector recognises products in the reviewed cart

- **GIVEN** 2 retained cart lines whose products each have several current catalogue pictures
- **WHEN** the existing batched live review succeeds
- **THEN** each line shows its own product's first picture, with the catalogue URL and its query parameters preserved
- **AND** no separate product request is made for either line

<!-- trace:scenario id=g10.store-cart-drawer.SC-vq6 rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-35 - Missing pictures preserve the cart's other facts
**Serves:** g10.store-cart-drawer.US10 - Collector recognises products in the reviewed cart

- **GIVEN** a retained product with no catalogue pictures
- **WHEN** its live review succeeds
- **THEN** its existing picture placeholder is shown
- **AND** quantity, status, prices, subtotal, badge count and checkout readiness match the same review without picture enrichment

<!-- trace:scenario id=g10.store-cart-drawer.SC-toh rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-36 - Pictures join only to confirmed current lines
**Serves:** g10.store-cart-drawer.US10 - Collector recognises products in the reviewed cart

- **GIVEN** a review whose lines arrive in a different order from the cart, with one removed variant and one current line the review did not confirm
- **WHEN** the drawer joins the review to the current cart
- **THEN** each confirmed retained line receives only the picture for its own variant identity
- **AND** the removed line is absent and the unreviewed line receives no picture from that review
- **AND** existing quantity and checkout-readiness guards remain in effect

<!-- trace:scenario id=g10.store-cart-drawer.SC-4fw rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-37 - Restoring cart intent obtains pictures through review
**Serves:** g10.store-cart-drawer.US10 - Collector recognises products in the reviewed cart

- **GIVEN** a member cart restored from intent containing no picture metadata
- **WHEN** the collector reloads, opens the drawer and its fresh live review succeeds
- **THEN** current pictures appear on their matching lines

<!-- trace:scenario id=g10.store-cart-drawer.SC-gzj rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-42 - A sold-out line retains its product picture
**Serves:** g10.store-cart-drawer.US10 - Collector recognises products in the reviewed cart

- **GIVEN** a sold-out retained line whose product has a current catalogue picture
- **WHEN** its live review succeeds
- **THEN** the line shows its own first product picture and existing sold-out treatment
- **AND** prices, quantity, status, count, totals and checkout readiness remain unchanged

<!-- trace:scenario id=g10.store-cart-drawer.SC-3lt rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-43 - An unavailable variant supplies no picture facts
**Serves:** g10.store-cart-drawer.US10 - Collector recognises products in the reviewed cart

- **GIVEN** a cart line whose variant is unavailable
- **WHEN** its live review completes
- **THEN** the reviewed line omits both picture fields
- **AND** the drawer follows the existing unavailable-line cleanup

<!-- trace:scenario id=g10.store-cart-drawer.SC-8ty rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-44 - Picture enrichment leaves intent free of picture metadata
**Serves:** Product pictures - retaining only cart intent when reviewing or editing a pictured line

- **GIVEN** an existing member cart or guest transport intent without picture metadata
- **WHEN** the cart is reviewed, its quantity is changed and its intent is saved
- **THEN** persistence and write inputs retain variant and quantity facts without picture URLs or alt text
- **AND** picture facts remain current reviewed display data only

<!-- trace:scenario id=g10.store-cart-drawer.SC-lbo rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-38 - A failed catalogue read keeps the existing unresolved outcome
**Serves:** g10.store-cart-drawer.US10 - Collector recognises products in the reviewed cart

- **GIVEN** a drawer whose current catalogue read fails
- **WHEN** it renders that failure
- **THEN** it keeps the existing unresolved feedback, retry behavior and Checkout guard
- **AND** picture enrichment does not turn the failure into a successful review or an unavailable-product result

<!-- trace:scenario id=g10.store-cart-drawer.SC-h93 rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-45 - A picture resource failure keeps accepted cart facts
**Serves:** g10.store-cart-drawer.US10 - Collector recognises products in the reviewed cart

- **GIVEN** a successful live review for an available line with a supplied picture URL
- **WHEN** the picture resource fails to load in the browser
- **THEN** price, quantity, status, totals and checkout readiness remain accepted
- **AND** the cart review is not changed into a failure

### Requirement: Reviewed picture fields are optional and compatible

Reviewed lines SHALL accept these additive display fields. Existing guest and
member review transports, basket quote and checkout outcomes carrying reviewed
lines SHALL preserve their existing outcomes and amounts.

| Field | Type | Absence And Meaning |
| --- | --- | --- |
| imageSrc | Optional string | First current product picture URL; omitted when no picture or live variant exists |
| imageAlt | Optional string | Catalogue alt text when non-empty; omitted when absent, null or empty |

Legacy responses omitting both fields SHALL decode successfully. Enriched
responses SHALL decode successfully with both the current and previous
production response schemas; the previous schema need not retain the added
fields. Invalid supplied field types SHALL fail current decoding rather than
being silently treated as absent. The drawer SHALL pass supplied picture facts
to the existing shared picture contract, including its item-name alt fallback.

<!-- trace:scenario id=g10.store-cart-drawer.SC-ier rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-39 - Legacy and enriched responses remain compatible
**Serves:** Product pictures - carrying review responses across backend and frontend rollout

- **WHEN** guest or member review, basket quote or checkout reviewed-line responses are decoded with legacy fields alone or with valid picture fields added
- **THEN** both current and previous production response decoders accept them
- **AND** the current decoder retains supplied picture facts
- **AND** existing outcomes and amounts remain unchanged

<!-- trace:scenario id=g10.store-cart-drawer.SC-2yu rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-40 - Invalid supplied picture fields fail decoding
**Serves:** Product pictures - refusing malformed reviewed display facts at the response boundary

- **WHEN** a response supplies a non-string image source or alt field, including null
- **THEN** the current production response decoder refuses the malformed response

<!-- trace:scenario id=g10.store-cart-drawer.SC-0wy rev=1 -->
#### Scenario: grade10-site-store-cart-drawer-SC-41 - Catalogue alt text reaches the shared fallback
**Serves:** g10.store-cart-drawer.US10 - Collector recognises products in the reviewed cart

- **WHEN** a reviewed product has a picture with supplied non-empty alt text, including whitespace-only text, or absent, null or empty catalogue alt text
- **THEN** the supplied non-empty text reaches the picture's alt attribute unchanged
- **AND** absent, null or empty catalogue alt text uses the line's current item name through the shared contract
