## 1. Guest checkout (grade10)

- [x] 1.1 The signed-out drawer leads with Check out as guest and a quiet Sign in link; a guest sees no points and no member codes (`CartDrawerHost`, `CartDrawer.test.tsx`)
- [x] 1.2 A guest checkout writes an order with no owner and no customer, and Shopify's page takes the email (`createGuestCheckout`, `checkout.test.ts`)
- [x] 1.3 Signing in from the drawer merges this browser's cart into the member cart and reopens the drawer on the same page
- [x] 1.4 A guest's browser cart keeps the basket until this browser reads the order paid (`useGuestCartSettlement`)
- [x] 1.5 Every web order carries its private link; `/orders/latest` and the link page show the order signed out, name the receipt's address, and ask to add it; the owner signed in is sent to the account's copy (`OrderLinkPage`, `LatestOrderPage`)
- [x] 1.6 A sign-in that proves the order's email joins every paid guest order under it (`linkGuestOrders`); another account's sign-in names the order's email and offers a link to it
- [x] 1.7 A guest order earns nothing, joined or not (`recordCompletion`, `completion.test.ts`)

## 2. Shared UI (grade10-spec)

- [x] 2.1 `CartDrawerFooter` and `CartDrawer` take `onSignIn` and the sign-in copy; `heldPromoCodes: null` hides the member section; guest footer stories

## 3. Record (grade10-spec) (owner: @kinisworking)

- [x] 3.1 Requirement deltas for the cart drawer and the shared store cart, folded into the durable specs; the checkout guest requirement was already durable
- [x] 3.2 The order-detail and order-history requirements — blocked: those capabilities are introduced by `add-grade10-customer-order-pages`, not yet a durable spec; the journeys stay on this change
- [ ] 3.3 Figma frames for the guest footer and the order link — blocked: needs the designer in Figma

## 4. The walk (grade10)

- [ ] 4.1 Walk a guest from the drawer through Shopify's page back to the order link, then sign in under the receipt's address and find the order in My Orders — blocked: needs a running store worker against a Shopify shop and a mailbox for the magic link
