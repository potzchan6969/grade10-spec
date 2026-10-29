---
title: Order Details
spec: grade10-site/store/order-detail
order: 7
---

## Order

- **Owner-Only Address** — `grade10.com/profile/orders/<order-id>`, for the
  signed-in collector who placed it; sign-in keeps the collector there; an
  unknown order and another collector's order look the same
- 🚧 **Store Orders Only** — a ticket order placed on
  [Tickets](/p/grade10-site/ticketing) is answered by the ticketing platform's
  own order page, never this one - [Your Tickets](/p/grade10-site/ticketing/your-tickets)
- **Known Facts** — only what the Store supplies: the order's identity, items,
  quoted and paid totals, refunds, fulfilment, estimates, tracking, payment
  method, address, discounts, shipping, tax and points; a missing fact leaves
  its group out rather than claim what the page cannot prove
- **Read States** — loading, a failure in the site's language with Retry, and
  not-found, each distinct at the same address

::story{id="store-order-detail-blocks-orderdetails--no-optional-groups" title="An order with only supplied facts"}

## Delivery Status

- **Steps** — follow the parcels, not the status badge
  - **Order Placed** — until a parcel is labelled or handed over
  - **Shipping** — from then on, naming the carrier and number
    - **Track Order** — opens the carrier's page when the Store supplies an
      `https` address for it; any other scheme, such as `javascript:`, offers
      no Track Order
  - **Completed** — once every item shipped and every parcel arrived, as
    [Order Status](/p/grade10-site/commerce/order-status) counts arrival;
    until then it carries the latest estimate among parcels still on their
    way, labelled as an estimate
  - **Dropped Parcel** — a canceled parcel or a voided label counts for
    nothing, Track Order included
  - **Step Not Reached** — no date of its own, only Completed's labelled
    estimate; a just-placed order has only Order Placed reached
- **Stopped Order** — canceled, or refunded in full, before delivery: the steps
  end at Canceled or Refunded, after Shipping only when a parcel had already
  left
  - **Refunded** — the gold tick a reached step draws: the money came back as
    asked
  - 🚧 **Canceled** — a muted ✕ rather than the gold tick, so a stop never
    reads as success; the stepper's design adds the state
- **Status Badge** — beside the steps; reads Completed only once the Completed
  step is reached

::story{id="store-order-detail-blocks-orderdetails--item-coupon" title="One order, in detail"}

## Items

- **Product Picture** — each item's current product picture, on earlier
  purchases too, on the owner's page and the order link; an unavailable
  picture keeps the placeholder and the order still opens
- **Refunded Item** — a line a refund gave units back from shows as two rows:
  the units kept, then the units refunded, struck through under a Refunded
  label with Refund issued on {date}, the day the latest refund naming that
  line was issued
  - **Refunded Whole** — the refunded row alone
  - **Refund Naming No Line** — such as delivery alone, splits no line

## Order Summary

- **Full Refund** — the paid total stays, and the whole amount shows as its
  Refund row below it: charged, then returned
- **Points** — when the shop names the settled order's points discount, under
  either points title ([Paying with Points](/p/grade10-site/loyalty/paying-with-points#rules)),
  a Points credit after Discount: its label names how many were deducted,
  such as `Points (100 pts)`, and its value is the money credit, in the cart
  drawer's success style
  - **No Points Row** — an order whose shop named no points discount, even
    where its points were debited from the rest of the applied total, since
    that figure can hold money staff took off by hand; the debit still shows
    as Points put toward a purchase — [Histories](/p/grade10-site/loyalty/membership#histories)
- **Points to Earn** — on an order that will earn, until it completes: what the
  goods still held earn at the member's tier now; then Points Earned: what it
  earned less any refund's claw-back — [Points](/p/grade10-site/loyalty/points)
  - **No Points Section** — on an order that will not earn: one canceled or
    refunded in full, a guest order, joined to an account or not, or one
    whose goods still held earn nothing; nor on one whose points the
    programme cannot say right now
- **Amount Marks** — `$` with two decimals, such as `$1,770.00`, and a bare
  `$0` for zero; Total keeps `HK$` with two decimals, such as `HK$1,704.50`

::story{id="store-order-detail-blocks-orderdetails--with-points-credit" title="Points credit on the summary"}

## Order Link

- **Link** — `grade10.com/orders/<order-id>`, for every web order, guest or
  member, behind the View order button in Shopify's order emails; Grade10
  sends no store email of its own
  - **Secret** — carried after `#`, so no server or log sees it
  - **Not Indexed** — search engines are told not to index it
- **Signed Out** — the order page opens for whoever holds the link
  - **Receipt Line** — the placed-on line names the email the receipt went
    to: Placed on {date}. Receipt sent to {email}.
  - **Account Toast** — persistent, with one Sign in action: on a guest's
    order it asks to add the order to an account, "Sign in to see it with
    your other orders"; closing it hides it for this order
    - **Joined at Payment** — a guest order that joined an account at payment
      is that member's order, so the toast asks to sign in to see it, as on
      any member's order - [Checkout](/p/grade10-site/store/checkout#guest-checkout)
    - **Added** — after a sign-in that proves the order's email, the order
      joins the account and the toast says so, with a way to it; the magic
      link proves the email, so it works on another device
    - **Another Email** — a Google account under another email signs the
      buyer in but does not add the order; the toast says the order was
      placed with {email} and offers a magic link to it
  - **Signed Out Only** — the receipt line and the toast show whenever an
    order page is viewed signed out, back from checkout or from a link opened
    later; signed in, neither shows
- **Owner Signed In** — sent to `grade10.com/profile/orders/<order-id>`
- **Someone Else Signed In** — the same page as anyone holding the link
- **Wrong Link** — an unknown order or a wrong secret shows not-found; a link
  holder may hold no account, so the way out is the store, not My Orders
- **No Account Facts** — guest or member, no loyalty points at all: no Points
  to Earn, no Points Earned, no Points row in the summary; no wallet or
  account details either

::story{id="store-order-detail-screens-order-link--guest-order" title="An order opened from its link"}

::story{id="store-order-detail-screens-order-link--member-order-signed-out" title="A member's order link, signed out"}

## Back From Checkout

- **Latest Order** — `grade10.com/orders/latest`, where the Continue button on
  Shopify's Thank you page lands: the order this browser last sent to Shopify
  - **Guest** — their order link, secret included
  - **Member** — the order under their profile
  - **Nothing Remembered** — a signed-in member sees their order list; anyone
    else sees the store
  - **One Day** — the browser forgets the order a day after checkout, and as
    soon as Continue has used it; a new checkout replaces it
  - **Another Device** — a buyer who pays on a different device lands on
    Nothing Remembered; a guest's link still arrives in Shopify's
    confirmation email
  - **Not Indexed** — search engines are told not to index it

::story{id="store-order-detail-screens-order-link--just-paid" title="A guest back from checkout, with the account ask as a toast"}

:::detail{title="Back from checkout" for="engineer"}
- **Continue** — Shopify's Thank you page always sends it to the bare checkout host, which redirects to `grade10.com/orders/latest`
:::

:::detail{title="Product decisions" for="pm"}
- **Order pictures** — the first current product picture, as the cart does, rather than a purchase-time image; a later image edit can appear on an earlier order, and a removed product may have none
- **Order link for every order** — member orders included; a forwarded email lets a holder see a member's order, accepted because the page shows no account facts
- **The account prompt on our order page** — not on a Shopify Thank-you extension
- **Shipping step label** — the step reads Shipping, matching winner orders; the badge keeps the status name Shipped
- **Delivery steps follow the parcel** — a stepper driven by the badge ticked Completed while the parcel was still travelling, ticked every step on a refund before shipping, and drew a canceled order as still on its way. A parcel whose carrier never reports delivery stays on Shipping until staff mark it delivered - [Order Status](/p/grade10-site/commerce/order-status)
- **How a stopped order ends** — a canceled order's muted ✕ means a stop never reads as delivered; a refunded order keeps the tick, since the money came back as asked. Dropping the steps for a sentence was ruled out - [handoff](https://github.com/9gag/grade10-spec/pull/1346)
- **Steps not reached** — nothing under an unreached step's label; a Pending placeholder was ruled out
- **Refunded items** — showing the refund only in the summary was ruled out: it leaves a collector guessing which item came back
- **A full refund's summary** — drawn as a partial one; a note under the total and a netted HK$0.00 row were ruled out
:::
