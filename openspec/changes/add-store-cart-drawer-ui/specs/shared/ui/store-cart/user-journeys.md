## Context user journeys

### shared-ui-store-cart-US-02: Shopper reviews what the cart holds

**As a** shopper,
**I want** the drawer to show my items with a count that ignores sold-out
items, an edge fade when there are more, and an empty state when the cart
holds nothing,
**so that** I can see what I am buying, or that there is nothing to buy yet.

### shared-ui-store-cart-US-04: Shopper dismisses the cart drawer

**As a** shopper,
**I want** to close the drawer from its close button, the backdrop, or the
Escape key, with the page behind it held still,
**so that** I can leave the cart without losing my place on the page beneath
it.

## User journeys

### shared-ui-store-cart-US-19: Shopper waits for an accepted tender choice

**As a** shopper,
**I want** the drawer to hold my accepted figures while a tender change finishes,
**so that** I cannot submit conflicting changes or continue with an unresolved choice.

## ADDED User journeys

### shared.ui-store-cart.US19: Shopper waits before another drawer action

**As a** shopper whose drawer is waiting for an answer,
**I want** the item controls, tender controls and navigation actions to wait together,
**so that** no remaining control can start a conflicting action.

### shared.ui-store-cart.US20: Shopper resumes after the drawer receives an answer

**As a** shopper whose drawer is no longer waiting,
**I want** only currently available actions to return without repeating an earlier action,
**so that** I decide what happens next from the accepted cart or its failure feedback.
