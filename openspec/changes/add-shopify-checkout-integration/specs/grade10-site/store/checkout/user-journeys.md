# grade10-site/store/checkout User Journeys

## ADDED User journeys

### grade10-site-store-checkout-US-05: Collector resumes one purchase safely

**As a** signed-in collector who repeats Pay, reloads or loses an answer,
**I want** the store to return my existing invoice or purchase state,
**so that** I do not accidentally create or pay for a second purchase.

### grade10-site-store-checkout-US-06: Collector keeps the cart built after Pay

**As a** signed-in collector who changes the cart or tender after starting payment,
**I want** the older invoice retired and my later cart preserved when payment settles,
**so that** a delayed purchase cannot remove my later choices.

## MODIFIED User journeys

### grade10-site-store-checkout-US-01: Collector sends a current cart to hosted payment

**As a** signed-in collector,
**I want** to review my current cart and send its accepted tender to Shopify,
**so that** I pay for the lines and choices I just saw.

### grade10-site-store-checkout-US-02: Collector repairs a changed cart line

**As a** collector whose cart changes before the payment decision,
**I want** the changed line named before I pay,
**so that** I fix the basket instead of paying for stale goods.

### grade10-site-store-checkout-US-03: Collector finds the paid order after Shopify

**As a** signed-in collector who paid on Shopify,
**I want** to return to Grade10, find the order while it settles and see the current cart,
**so that** I trust the store kept my purchase and later choices.

### grade10-site-store-checkout-US-04: Signed-out collector is asked to sign in

**As a** collector who is not signed in,
**I want** checkout to explain the identity requirement,
**so that** I sign in before an order or payment is started.

## REMOVED User journeys

None.
