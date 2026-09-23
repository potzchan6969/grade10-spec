## Goals

- The listing and product page report Shopify's availability consistently without exposing stock counts or scarcity cues.
- A collector can select a product variant and request a quantity; the cart reports any short fill when it reviews the line.
- Cart opening and checkout use the existing live availability and price review.

## Non-Goals

- Changing Shopify's availability policy or introducing a pre-order state.
- Adding a backend endpoint, database field, or shared UI component contract.
- Changing cart or checkout behavior beyond using the status and review contracts already specified by this change.
- Reworking the product page layout beyond the variant status and selection needed to fulfill its existing capability contract.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | How does a browse add control handle a requested quantity above the shop's count? | Keep the collector's requested quantity unbounded by the browse read; the cart review reports and reduces a short fill. - decided by the round | Keeping the stock-derived stepper maximum, which prevents the specified partial-fill request from reaching cart review |
| Q2 | Which durable capabilities does this change alter? | Modify Store product listing and product page requirements to remove stock-derived quantity limits and scarcity messages. - decided by the round | Leaving `Modified Capabilities: None`, which would keep contradictory listing and product-page rules in force |
| Q3 | What remains visible when either cart read fails after prior availability was shown? | Mark affected lines unchecked and do not present their previous availability, price, or cart total as current; offer retry and keep checkout unavailable until a later read confirms the lines. | Reusing a stale line status while hiding only the price, which could imply the failed review confirmed it |

## Raised

| Capability | Question | Landed |
| --- | --- | --- |
| `grade10-site/store/cart-validation` | Should a failed cart-open or checkout read leave the last displayed availability status in place? | Q3 |
