---
title: Coupons
spec: grade10-store/loyalty
order: 4
---

A coupon is the money-off code a redemption mints: a single-use Shopify
discount code for a fixed amount, scoped to the member's own Shopify customer,
that the online checkout and the POS both validate natively. One redemption
mints one code. The engine that debits the points names no vendor; the one
Shopify-shaped piece of the loyalty product is the fulfiller that asks the
store to mint.

## What a code is

| Property | Value |
| --- | --- |
| Amount | The reward's money, at HKD 1 a point |
| Uses | One, and once per customer |
| Who | The member's paired Shopify customer, online and at the till |
| Validity | From minting, for the days the reward states; a code minted near the end of a menu window is not born dying |
| Minimum purchase | The code's own value — a code bigger than the cart is refused, never burned for less |
| Stacking | Combines with product and shipping discounts; never with another order-level discount, so one points code per order |

## Minting

The store records the code before it asks Shopify for it, so a lost answer is
finished by the retry rather than minted twice, and a code the shop already
holds is adopted. A member whose customer pairing has not converged waits: the
redemption reads as preparing until the pairing lands, and a member whose
pairing was erased is parked for an operator. When a pairing moves to a
different customer, that member's live codes are re-scoped in the same pass.

## The life of a code

| State | Meaning |
| --- | --- |
| Live | Minted and spendable; the member reads it as ready |
| Used | A paid order carried it; the member reads it as used |
| Void | Deactivated by a reversal; the member reads it as cancelled |

Use is decided by the paid order that carried the code — from either channel —
never by the vendor's lagging usage count. A live code whose validity passes
stays spent: bought but not used is the member's responsibility, and the money
is counted as breakage in the liability register rather than silently
returned. A code used after its redemption was reversed, used twice, or used by
another customer raises a mismatch an operator settles.

## What the member sees

The membership page lists every code in full, with its value and expiry — a
masked code cannot be read out at a till. Used and cancelled codes stay on the
list and say so. A live code carries the member's own undo: the points come
back and the code is deactivated, unless the code has already paid for
something, in which case the points stay spent and the page says why.

::story{id="loyalty-membership-couponlist--default" title="The codes a member holds"}

## Where a code is accepted

Online, the buyer types the code at Shopify's checkout, or the membership page
attaches it to the basket where the shop allows. At the till, staff apply a
member's open code from the terminal, or the member reads it out. Where the
till spends points as a fixed amount off the sale instead, no code is minted
for that spend — [Shopify Integration](/p/membership/shopify-integration).

Store promotions are the store's own coupons, minted by an operator with a
prefix and a threshold, and are not part of the programme.

:::callout{kind="warning"}
The durable spec has no notion of a code: a redemption there is an entitlement
with no settlement. Everything on this page is specified in the in-flight
`revise-loyalty-programme-rules` and `add-shopify-membership-pos` changes.
:::

## Journeys

::journeys{id="grade10-store/loyalty"}

::cases{id="grade10-store/loyalty"}

:::detail{title="For engineers" for="engineer"}
The loyalty worker's fulfiller for the `money_off_code` kind calls the store
worker's `MembershipEntrypoint` over a service binding — mint, deactivate,
usage, liability — so loyalty holds no Shopify credential. The store's
`minted_codes` registry is written first; the vendor call is
`discountCodeBasicCreate` with `usageLimit: 1`, `appliesOncePerCustomer`, a
minimum subtotal equal to the amount, `combinesWith` refusing order discounts,
and eligibility through `context` rather than the deprecated
`customerSelection`. Usage is written by order ingestion matching the paid
order's discount codes case-insensitively, and the vendor's `asyncUsageCount`
is deliberately unreachable from the port.

The liability register reports outstanding points as a count and the money
out in codes as money, answering `none` where nothing mints and `unavailable`
with a reason where the register cannot be read — never a zero. Metrics:
`membership.code.minted`, `.used`, `.mismatch`, `loyalty.codes.outstanding_minor`.
:::
