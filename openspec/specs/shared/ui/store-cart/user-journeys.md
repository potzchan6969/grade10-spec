## User journeys

### shared-ui-store-cart-US-02: Shopper reviews what the cart holds

**As a** shopper,
**I want** the drawer to show my items with a count that ignores sold-out
items, an edge fade when there are more, and an empty state when the cart
holds nothing,
**so that** I can see what I am buying, or that there is nothing to buy yet.

### shared-ui-store-cart-US-03: Shopper opens the cart on current prices

**As a** shopper,
**I want** the drawer to read fresh product status and pricing when it opens,
showing skeletons while that read is in flight,
**so that** I decide against the current prices rather than stale ones.

### shared-ui-store-cart-US-04: Shopper dismisses the cart drawer

**As a** shopper,
**I want** to close the drawer from its close button, the backdrop, or the
Escape key, with the page behind it held still,
**so that** I can leave the cart without losing my place on the page beneath
it.

### shared-ui-store-cart-US-05: Shopper proceeds from the cart to checkout

**As a** shopper,
**I want** the checkout button to show it is redirecting while the
application creates the session,
**so that** I know the checkout is under way, and see the button return to
its label if it fails.

### shared-ui-store-cart-US-06: Shopper opens a cart that held a delisted product

**As a** shopper,
**I want** a product that left the catalogue to disappear after the drawer
finishes loading, with one toast,
**so that** I am not shown a sold-out row for something the store no longer
sells.

### shared-ui-store-cart-US-07: Shopper edits a low-stock line and the warning quiets

**As a** shopper,
**I want** the low-stock warning to hide after I change that line's quantity,
**so that** it does not keep shouting after I have acted, and it returns if the line is adjusted again.

### shared-ui-store-cart-US-08: Shopper raises a line to the last unit the shop has

**As a** shopper,
**I want** a line's stepper to stop where the shop runs out, and the line to
say how many are left,
**so that** I am not still raising a number the checkout will quietly put back
down.

### shared-ui-store-cart-US-13: Shopper reads a site sale on the cart lines

**As a** shopper,
**I want** an automatic site sale to show as the lower price with the list
price struck through on each line, without a second Store sale line in the
summary,
**so that** I can trust the Subtotal as the sum of the lines I can still buy,
at the prices I see on them.

### shared-ui-store-cart-US-14: Shopper stacks a promo on the site sale

**As a** shopper,
**I want** a promo that stacks to leave the sale prices on the lines and add
only its own Discount in the footer,
**so that** I can see both cuts without the summary inventing a Store sale
row.

### shared-ui-store-cart-US-15: Shopper is refused a promo against the site sale

**As a** shopper,
**I want** a code that cannot combine with the site sale to leave my sale
prices alone and tell me why, including on a held ticket I cannot Apply,
**so that** I am not left wondering whether the sale or the code won.

### shared-ui-store-cart-US-16: Shopper's promo replaces the site sale

**As a** shopper,
**I want** a replacing promo to put the list price back on each line it takes
the sale from and show only that code's Discount in the footer,
**so that** I know the site sale is no longer on those lines.

### shared-ui-store-cart-US-17: Shopper removes a promo and keeps the site sale

**As a** shopper,
**I want** removing the promo to drop its discount and, where it had replaced
the site sale, put the sale back on the lines while the sale still runs,
**so that** I am not left at full list price after clearing a code.
