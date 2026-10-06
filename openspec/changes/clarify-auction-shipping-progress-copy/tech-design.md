# Technical Design

## Delivery

- **Derivation** - Keep the paid and unfulfilled auction-order derivation. Only its displayed name changes from Processing to Preparing Shipment.
- **Vocabulary** - Update `auctionOrders.status.processing` in the four Grade10 catalogues. The store order-status vocabulary stays unchanged.
- **Winner Order** - Update the preview and story state so Shipping is the current progress step for Preparing Shipment and Shipped. Preparing Shipment reads Preparing to ship; Shipped keeps its day-only date and tracking when present.
- **My Auctions** - Update the record fixtures and stories so Preparing Shipment and Shipped use the muted default Badge variant.

## Boundaries

- **No persistent change** - No API, database field, derived-status rule, or stepper animation changes.
- **Tracking chrome** - Keep the existing carrier link on the tracking number; Order Progress adds no separate carrier name. The carrier-name row in `Records the winner keeps` is not touched here: `define-public-auction-identifiers` owns that requirement and removes the name. Shipped and Delivered letters stay as they are.
- **No application group** - The store owns the catalogues, preview, fixtures, and story assertions. A consuming application only takes the published submodule update.

## Verification

- **Preparing Shipment** - `winner-order-SC-55` proves the badge, current Shipping step, Preparing to ship subtext, and absence of a sixth step.
- **Derived status** - `auction-status-SC-07` proves paid plus unfulfilled reads Preparing Shipment.
- **Published states** - Winner Order and My Auctions stories prove the Preparing Shipment and Shipped labels and Badge variants.
