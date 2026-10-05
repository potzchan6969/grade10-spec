## Screens

### Grade10 Cart Drawer

Use the existing drawer's current review, tender estimate, checkout action,
named-line feedback and account-verification feedback. The existing drawer
host shows the threshold message with an account action when checkout returns
the verification outcome. Reuse the existing empty, pending and failed states;
no new shared UI export or page is added. The checkout action remains
unavailable while its request is pending.

### Grade10 Orders

Reuse the existing orders list and order detail. Display the states returned by
the existing backend and refresh the cart after observed payment; do not clear
it merely on return from Shopify.

### Shopify Thank You and Order Status

Use the existing Shopify extension package and Shopify layout primitives for
one static Grade10 Your Orders link on both confirmation surfaces. This link
does not depend on the native Continue shopping action.

## Components

| Export | Package | Role |
| --- | --- | --- |
| Existing Cart Drawer | `@grade10/ui` | Basket review, tender, pending checkout and verification feedback |
| Existing orders surfaces | `apps/frontend/grade10` | Pending and paid order results |
| Shopify extension Link | Existing Shopify integration package | Static Your Orders return |
| Existing checkout copy | `@grade10/i18n` | Localized feedback and link labels |

## States

| State | Shows | Journey | Requirement Disposition |
| --- | --- | --- | --- |
| Ready drawer | Current basket, accepted tender and estimated total | grade10-site-store-checkout-US-01 | `grade10-site-store-checkout-SC-01`, `grade10-site-store-checkout-SC-02` |
| Checkout request pending | Unavailable checkout action | grade10-site-store-checkout-US-01 | `grade10-site-store-checkout-SC-34` |
| Refused or failed | Existing feedback and ready-basket retry | grade10-site-store-checkout-US-02 | `grade10-site-store-checkout-SC-03`, `grade10-site-store-checkout-SC-04`, `grade10-site-store-checkout-SC-07`, `grade10-site-store-checkout-SC-38` |
| Verification required | Existing account-verification feedback and account action | grade10-site-store-checkout-US-01 | `grade10-site-store-checkout-SC-37` |
| Returned pending order | Existing settling state | grade10-site-store-checkout-US-03 | `grade10-site-store-checkout-SC-12` |
| Loading, failed or empty orders | Existing loading, error/Retry or empty/Shop now treatment | grade10-site-store-checkout-US-03 | **Out of suite:** unchanged order-page states verified in `apps/frontend/grade10/src/pages/orders/OrderHistoryPage.test.tsx` |
| Shopify confirmation | Static Your Orders link | grade10-site-store-checkout-US-03 | `grade10-site-store-checkout-SC-15` |
| Signed-out collector | Existing sign-in action | grade10-site-store-checkout-US-04 | `grade10-site-store-checkout-SC-06` |
