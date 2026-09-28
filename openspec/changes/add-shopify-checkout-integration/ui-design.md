## Screens

### Shopify Thank You and Order status

No Figma frame or Storybook story exists for Shopify's hosted confirmation
surface. Shopify's Checkout UI extension editor is the layout source. The
extension adds one Grade10 order link in the Thank You and Order status page
extension slot; it does not retarget or depend on the native Continue shopping
button.

### Grade10 order route

The existing Grade10 order route remains the destination. This change adds no
new Grade10 page layout.

## Components

| Export | Package | Role |
| --- | --- | --- |
| Shopify Checkout UI extension `Link` and layout primitives | Shopify checkout extension package in `integrations/shopify-pos/grade10` | Render the Grade10 order link on the hosted Thank You and Order status pages |
| Existing Grade10 order route and order detail | `apps/frontend/grade10` | Resolve and show the matching local order |
| Grade10 checkout and order copy | `@grade10/i18n` | The link label and recovery/support copy in every supported storefront locale |

No new `@grade10/ui` export or design-system primitive is needed. The
extension package and its Shopify app configuration are implementation work in
the application repository.

## States

### Shopify Thank You and Order status

| State | Shows | Anchor |
| --- | --- | --- |
| Shopify order identity resolves | A visible Grade10 order link for the matching local order | `grade10-site-store-checkout-US-03` |
| Link is resolving | The extension keeps the link unavailable until the local correlation resolves; it does not invent an order URL | `grade10-site-store-checkout-US-03` |
| Correlation cannot resolve | A support outcome and no guessed Grade10 order URL | `Order settlement and return` |
