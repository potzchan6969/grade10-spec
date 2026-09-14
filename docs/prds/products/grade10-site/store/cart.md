---
title: Cart Drawer
spec: grade10-site/store/cart-drawer
order: 4
---

The Cart Drawer is the collector's quick check while they browse: it opens over
the Store, tells only what the current cart read can support, and returns them
to the same page when they close it. It is not an order quote or a second
checkout.

The first delivery joins the shared drawer to Grade10's existing guest and
member carts. Price and availability come from Cart Validation; the drawer
adds no product enrichment or tender calculation of its own.

🚧 A signed-in collector can see held promo-code eligibility and the points
ceiling for the reviewed basket; neither changes the drawer total before one
applied quote can price them together.

## Designs

::story{id="store-cart-cartdrawer--default" title="The cart drawer"}

::story{id="store-cart-cartdrawer--unavailable-items-removed" title="Lines the store no longer sells, leaving"}

::story{id="store-cart-cartdrawer--empty-state" title="An empty cart"}

:::detail{title="Product decisions" for="pm"}
The drawer serves a collector who wants to check the cart without abandoning
the product or collection they are considering. Its value is speed and
confidence, not early access to checkout calculations.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Guest collector | Builds a cart while browsing | Reviews the browser cart without being forced to sign in. |
| Signed-in collector | Opens Cart from a Store page | Reviews the member cart attached to their session. |
| Collector whose cart moved | Opens Cart before checkout | Sees current facts or a clear unresolved state, never a stale claim. |

**Not in scope.** A dedicated cart page. Creating checkout from the drawer.
Product-image enrichment. Applying promo codes or loyalty points, or showing
shipping, tax, or discount amounts before one drawer quote can price them
together.

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Drawer-to-checkout sessions | Share of Store sessions that open Cart and proceed to checkout without first navigating there. The first delivery sets the baseline. | Product |
| Failed open reviews | Share of drawer opens whose current-cart read cannot complete. | Engineering |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Overlay, not page | Decided | Cart stays attached to the browsing moment; a new route would make the collector leave before the drawer solves anything. | Product |
| Store boundary | Decided | Cart belongs on Store surfaces and checkout, not in unrelated site chrome. | Product |
| Current read first | Decided | The drawer waits for Cart Validation rather than dressing held values as current. | Product |
| One session scope | Decided | Signed-out browsing uses the browser cart; a signed-in session uses its member cart. The drawer does not merge them. | Engineering |
| Honest summary | Decided | No image or adjustment enters the summary without an authoritative source. Shipping remains unknown and the estimated total stays at subtotal for this delivery. | Product |
| Tender follows a quote | Decided | Promo codes and points wait for one applied drawer quote that can also define invalidation, refusals and checkout handoff. Wiring the available endpoints one control at a time would show a partial total. | Product |
| Read-only tender facts | Decided | A signed-in collector may see the held codes that were answered for the reviewed basket and the points ceiling, but neither becomes selected or applied and the total remains the reviewed subtotal. Guests do not receive member-only reads. | Product |
| Existing checkout surface | Decided | The drawer opens `/checkout`; that surface keeps ownership of its live read and checkout creation. | Engineering |
:::
