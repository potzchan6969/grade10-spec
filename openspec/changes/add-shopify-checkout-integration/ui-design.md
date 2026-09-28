## Screens

### Shopify Thank You and Order status

No Figma frame or Storybook story exists for Shopify's hosted confirmation
surface. Shopify's Checkout UI extension editor is the layout source. The
extension adds one static Grade10 Your Orders link in the Thank You and Order
status page extension slot; it does not retarget or depend on the native
Continue shopping button.

### Grade10 order route

The existing Grade10 order route remains the destination. This change adds no
new Grade10 page layout.

## Components

| Export | Package | Role |
| --- | --- | --- |
| Shopify Checkout UI extension `Link` and layout primitives | Shopify checkout extension package in `integrations/shopify-pos/grade10` | Render the static Grade10 Your Orders link on the hosted Thank You and Order status pages |
| Existing Grade10 orders surface | `apps/frontend/grade10` | Show the matching local order after the member returns |
| Grade10 checkout and order copy | `@grade10/i18n` | The link label in every supported storefront locale |

No new `@grade10/ui` export or design-system primitive is needed. The
extension package and its Shopify app configuration are implementation work in
the application repository.

## States

### Shopify Thank You and Order status

| State | Shows | Anchor |
| --- | --- | --- |
| Thank You page | A visible Grade10 Your Orders link | `grade10-site-store-checkout-US-03` |
| Order status page revisit | The same Grade10 Your Orders link and the matching purchase in the orders surface | `grade10-site-store-checkout-US-03` |
| Native Continue shopping action | Not relied on for the Grade10 return | `Order settlement and return` |
