---
title: Order Details
spec: grade10-site/store/order-detail
order: 7
---

Order Details is one private account of a Store purchase. The address names an
order, while the owner check decides whether anything can be shown; an unknown
id and another collector's id deliberately look the same.

The first delivery shows only facts the typed Store order already carries:
items, quoted and paid totals, refunds, fulfilment, estimates, and tracking.
Payment method, address, discounts, shipping, tax, and loyalty
stay absent until the Store supplies them. Omitting those groups is more useful
than filling the designed page with claims the frontend cannot prove.

## Order

**Owner-only address** — a signed-in collector sees one order at
`grade10.com/profile/orders/<order-id>`; sign-in keeps the collector at that
address; an unknown order and another collector's order look the same

**Known facts** — the page shows the supplied order identity, items, money,
address, payment and refund facts, and leaves each missing fact absent

**Progress and tracking** — a collector sees the Store-supplied fulfilment
state and can follow a safe carrier address when one is supplied

❓ **Steps not reached** — a delivery step the order has not reached shows
with no date; a just-placed order has only Order Placed reached. Design
confirms

❓ **A full refund** — the summary keeps the paid total and shows the whole
amount as its Refund row. Design confirms

❓ **A safe carrier address** — an `https` address opens; any other scheme,
such as `javascript:`, offers no Track Order. Engineering confirms

**Read states** — loading, localized failure with Retry, and not-found stay
distinct at the same address

## Product Pictures

🚧 **Recognise an item** - each item shows its current product picture on the
owned order and its private link, including earlier purchases. An unavailable
picture keeps the existing placeholder without preventing the order from opening.

## Order Link

Every web order, guest or member, opens at `grade10.com/orders/<order-id>`
from the View order button in Shopify's order emails. Grade10 sends no
store email of its own. The link carries its secret after `#`, so no server
or log sees it.

- **Signed out** - the order page opens for whoever holds the link; the
  placed-on line names the email the receipt went to and a persistent
  toast offers sign-in — add this order to an account on a guest's,
  sign in to see it on a member's
- **Owner signed in** - sent to `grade10.com/profile/orders/<order-id>`
- **Someone else signed in** - the same public page as anyone holding the
  link
- **Wrong link** - an unknown order or a wrong secret shows not-found;
  a link holder may hold no account, so the way out is the store, not
  Your Orders
- **Not indexed** - search engines are told not to index the address
- **No account facts** - guest or member, the link page shows no loyalty
  points at all: no Points to Earn, no Points Earned, and no Points row in
  the summary; no wallet or account details either

## Back From Checkout

The Continue button on Shopify's Thank you page always goes to the bare
checkout host, which sends it to `grade10.com/orders/latest`. That page opens
the order this browser last sent to Shopify.

- **Guest** - their private order page, link and secret included
- **Member** - the order under their profile
- **Order confirmed** - the guest's page is the order page; the
  placed-on line names the email the receipt went to — Placed on {date}.
  Receipt sent to {email}.
- 🚧 **Create an account** - a persistent toast on the order page asks to
  add this order to an account - Sign in to see it with your other
  orders - with one Sign in action; closing it hides it for this order
- **Joined at payment** - a guest order that joined an account at payment
  is that member's order, so the toast asks to sign in to see it -
  [Checkout](/p/grade10-site/store/checkout#guest-checkout)
- **Added** - after a sign-in that proves the order's email the order
  joins the account and the toast says so, with a way to it. The magic
  link proves the email, so it works on another device
- **Signed out only** - the email note and the toast show whenever an
  order page is viewed signed out — this return or a link opened later;
  signed in, neither shows
- **Another email** - a Google account under another email signs the
  buyer in but does not add the order; the toast says the order was
  placed with {email} and offers a magic link to it
- **Nothing remembered** - a signed-in member sees their order list; anyone
  else sees the store
- **One day** - the browser forgets the order a day after checkout, and as
  soon as Continue has used it; a new checkout replaces it
- **Another device** - a buyer who pays on a different device lands on the
  fallback. A guest's link still arrives in Shopify's confirmation email
- **Not indexed** - search engines are told not to index the address

## Order Summary

🚧 **Points** — when the shop names the settled order's points discount, under
either points title ([Paying with Points](/p/grade10-site/loyalty/paying-with-points#rules)),
Order Summary shows a Points credit after Discount: the label names how many
were deducted (for example `Points (100 pts)`), and the value is the money
credit in the same success style as the cart drawer

🚧 **No Points row** — on an order whose shop named no points discount, even
where its points were debited from the rest of the applied total, because that
figure can hold money staff took off by hand; the debit still shows as Points
put toward a purchase — [Histories](/p/grade10-site/loyalty/membership#histories)

🚧 **Points to earn** — an order that will earn shows Points to Earn until it
completes, then Points Earned — [Points](/p/grade10-site/loyalty/points)

🚧 **No points section** — an order that will not earn shows no points
section at all: one canceled or refunded in full, or a guest order, joined
to an account or not

**Amount marks** — summary lines use `$` with two decimals (`$1,770.00`),
except bare `$0` when the amount is zero; Total keeps `HK$` with two decimals
(`HK$1,704.50`)

## Designs

::story{id="store-order-detail-blocks-orderdetails--item-coupon" title="One order, in detail"}

::story{id="store-order-detail-blocks-orderdetails--with-points-credit" title="Points credit on the summary"}

::story{id="store-order-detail-blocks-orderdetails--no-optional-groups" title="An order with only supplied facts"}

::story{id="store-order-detail-screens-order-link--just-paid" title="A guest back from checkout, with the account ask as a toast"}

::story{id="store-order-detail-screens-order-link--guest-order" title="An order opened from its link"}

::story{id="store-order-detail-screens-order-link--member-order-signed-out" title="A member's order link, signed out"}

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Order pictures | Decided | Use the first current product picture, as the cart does, rather than a purchase-time image. A later product-image edit can appear on an earlier order; a removed or unpublished product may have no picture. Order access and recorded purchase facts stay unchanged. Selected from the recommended fix on 2026-10-22. | Product |
| Order link for every order | Decided | Every order email's View order button carries the private link, member orders included. A forwarded email lets a holder see a member's order — accepted; the page shows no account facts. Decided 2026-10-13. | Product |
| Post-checkout prompt | Decided | The account prompt lives on the Grade10 order page after checkout, not on a Shopify Thank-you extension. Decided 2026-10-13. | Product |
| Another email | Decided | Only a sign-in that proves the order's email adds it — a magic link to that email or a Google account under it; a Google account under another email signs the buyer in and adds nothing, and the toast offers a magic link to the order's email. Decided 2026-10-13. | Product |
| Points section | Decided | An order that will earn shows Points to Earn before completion and Points Earned after; an order that will not earn — canceled or fully refunded, or a guest order, joined or not — shows no points section at all. Decided 2026-10-13; a joined guest order earns nothing from 2026-10-14. | Product |
| Shipping step label | Decided | The delivery step reads Shipping (in progress), matching winner orders; the status badge keeps the status name Shipped. Decided 2026-10-13. | Product |
:::
