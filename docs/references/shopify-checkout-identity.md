# Shopify integration — checkout & identity

## What we want

Keep grade10 as the single source of truth for who a user is, while letting
Shopify run catalog, inventory, fulfillment, and payment — without adopting
Shopify as a second identity system.

## Ownership (confirmed)

- Grade10 owns accounts and authentication — its own database, its own
  session, source of truth for user identity.
- Shopify owns product catalog, inventory, fulfillment, and shipment — its
  own database.
- Shopify owns the checkout page itself (hosted, not embeddable, no
  automatic redirect back to grade10 after payment).

No Shopify IdP (Multipass, Customer Account API) is needed to make this
work — checkout already runs on grade10's own sign-in, and Shopify never
needs to recognize the buyer to complete a sale.

## Checkout flow (target)

1. User visits the site.
2. User registers as a member (grade10-auth).
3. User adds products to a cart — **today this is client-side (localStorage),
   not server-stored**; server-side cart is a separate, undecided change if
   wanted (e.g. for cross-device persistence).
4. User tells the backend to check out with that cart.
5. Backend re-prices from Shopify's catalog, opens a pending order in its own
   DB, then asks Shopify's Storefront API for a cart — stamped with the
   pending order id as a cart attribute — and gets back a checkout URL.
   That URL is a bearer link: anyone holding it can pay, and the order is
   anonymous on Shopify's side (no name, email, or address sent). Fetch it
   fresh right before redirecting rather than caching it — Shopify can
   rotate it.
6. User is redirected to that URL, fills in shipping and payment on
   Shopify's own page. Grade10 can prefill shipping/contact via
   `buyerIdentity` on the cart — **not built yet, small addition** — but this
   never touches payment; a saved card only autofills if the buyer already
   has Shop Pay, independent of anything grade10 does.
7. User pays. Shopify creates the order, associated with no customer.
8. Shopify notifies grade10 via a signed webhook with the pending order id
   (backed by a 5-minute reconcile cron and an on-demand reconcile if the
   buyer opens that order in grade10 later — the webhook is not the only
   path).
9. Grade10 looks up the pending order and knows exactly who placed it —
   checkout requires sign-in, so the order was never actually anonymous on
   grade10's side, only on Shopify's.
10. Grade10 writes the customer back onto the Shopify order
    (`orderCustomerSet`, same `write_orders` scope family already granted
    for refunds) — this
    is what makes the receipt show a name instead of guest, and puts the
    order into Shopify's own customer history/segments. Pairing starts at
    registration and usually completes long before checkout; when the
    customer does not exist yet, this write lands later through the
    attribution pass that drains orders still owed `orderCustomerSet`
    (`shopify-membership-pos.md`).

## Limitations

- **Bearer link, not identity-bound.** Whoever holds the checkout URL can
  pay — with their own card — and the order attaches to whoever grade10
  created it for. That's an attribution risk, not a stolen-card risk; not
  fixed by anything discussed here.
- **No return to grade10 after payment.** Shopify's hosted checkout does
  not auto-redirect — the buyer lands on Shopify's own order-status page.
  A Thank-you/order-status extension could add a clickable link back, but
  not an automatic bounce. Order confirmation still works (webhook/cron),
  just not the "back on our site" moment.
- **No control over saved payment methods.** Only Shop Pay remembers a
  card, and only if the buyer already has it — grade10 can't add or
  influence this without replacing Shopify checkout entirely.
- **Timing on the confirmation email is unverified.** Shopify likely emails
  order confirmation before grade10's webhook-triggered `orderCustomerSet`
  lands, so that first email may still show no name even after everything
  above ships. Worth testing, not assuming.
- **Checkout page stays Shopify's own look and domain.** A custom/branded
  domain (e.g. `checkout.grade10.com`) is a cheap, independent fix — a
  dedicated checkout subdomain CNAME'd to Shopify plus a setting in
  Shopify admin, no code — but the page itself is still Shopify's template
  either way. Grade10's store isn't on Shopify's Online Store channel, so
  this checkout subdomain has to be set up on its own; it won't inherit
  from grade10's existing site domain.
- **Points codes meet an anonymous buyer.** Loyalty's discount codes are
  minted per member and scoped to the paired customer through
  `discountCodeBasicCreate`'s `context` input (`customerSelection` is
  deprecated). Our checkout attaches no customer, so whether Shopify
  enforces that scope by matching the checkout email against the paired
  customer — and whether the cart-stage `applicable` flag evaluates it —
  is a dev-shop release gate, never an assumption. The unscoped
  contingency (usage limit 1, minimum subtotal at face value, short
  expiry, code text shown only in the member's own session) is
  pre-designed in `shopify-membership-pos.md`.

## Options considered, and why not now

- **Multipass / Customer Account API** (Shopify's own buyer login/SSO) —
  would let Shopify recognize the buyer for prefill or saved cards. Not
  needed: grade10 already owns identity, and checkout doesn't require
  Shopify to know who's paying.
- **Draft orders** (create the order via Admin API with a customer
  attached from the start) — moves order creation onto the privileged
  Admin path, which today deliberately stays off every path a shopper can
  reach. Made unnecessary by `orderCustomerSet`, which gets the same
  result after the fact on infrastructure already in place.
- **Fully custom checkout page** (own UI, Stripe for payment, write
  completed orders into Shopify for fulfillment) — the only real path to
  saved cards and full control. Real scope increase: grade10 would own
  PCI-relevant payment collection, tax, discounts, and fraud checks that
  Shopify currently handles for free. Worth it only if the hosted-checkout
  redirect becomes an actual product problem, not preemptively.

## Settled elsewhere

- **When to create the Shopify customer.** Decided: at registration,
  guaranteed by an outbox and sweep so sign-up still never waits on
  Shopify's uptime — `shopify-membership-pos.md` carries the design.
- **Server-stored cart.** Not part of anything discussed; today's cart is
  client-side. Only worth changing for a concrete need (e.g. cross-device
  cart).
- **Physical store.** Designed in `shopify-membership-pos.md`: staff
  attach the paired customer to the sale by email through Shopify's own
  POS flow, so a physical order attributes the same way an online one
  does; a POS UI extension is the staff-facing loyalty terminal.
