## Goals

- The listing and product page report Shopify's availability consistently without exposing stock counts or scarcity cues.
- A collector can request a quantity for the product's one sellable item; the cart reports any short fill when it reviews the line.
- Cart opening and checkout use the existing live availability and price review.

## Non-Goals

- Changing Shopify's availability policy or introducing a pre-order state.
- Adding a backend endpoint, database field, or shared UI component contract.
- Changing cart or checkout behavior beyond using the status and review contracts already specified by this change.
- Reworking the product page layout beyond showing availability for its one sellable item.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | How does a browse add control handle a requested quantity above the shop's count? | Keep the collector's requested quantity unbounded by the browse read; the cart review reports and reduces a short fill. - decided by the round | Keeping the stock-derived stepper maximum, which prevents the specified partial-fill request from reaching cart review |
| Q2 | Which durable capabilities does this change alter? | Modify Store product listing and product page requirements to remove stock-derived quantity limits and scarcity messages; the product page keeps one sellable item and no shopper-facing variant choice. - decided by the round and aligned with the active product-page redesign | Leaving `Modified Capabilities: None`, which would keep contradictory listing and product-page rules in force |
| Q3 | What remains visible when either cart read fails after prior availability was shown? | Mark affected lines unchecked and do not present their previous availability, price, or cart total as current; offer retry and keep checkout unavailable until a later read confirms the lines. | Reusing a stale line status while hiding only the price, which could imply the failed review confirmed it |
| Q4 | How does the product page use Shopify variants when it shows availability and adds an item? | Use the Shopify sale identifier internally for the one sellable item's availability and cart identity; offer no size, option, or variant choice to the collector. - decided by the user in response to the feature-branch review | Adding a variant chooser so the collector selects the sale identity |

## Raised

| Capability | Question | Landed |
| --- | --- | --- |
| `grade10-site/store/cart-validation` | Should a failed cart-open or checkout read leave the last displayed availability status in place? | Q3 |
| `grade10-site/store/product-listing` | Does cheapest-first ordering exclude unavailable products, as the active journey says, or include them, as the Product Listing PRD says? | `❓ docs/prds/products/grade10-site/store/product-listing.md` — Price order |
