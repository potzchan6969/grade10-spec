**Author:** @sean - 2026-09-15

## Why

`require-sign-in-to-add-to-cart` takes the guest cart away: a collector with no
session cannot put a card in a cart from a product page or a listing tile, and
no cart holds their lines. The Cart control in the header was not part of that
change, so it still opens the drawer for them — onto a cart that can no longer
have anything in it.

So the one control on every Store page that says "your cart" is the one place
the site still answers a signed-out collector with an empty room. They pressed
it to see what they had picked; the honest answer is that the cart is theirs
once they sign in.

**Metric** — sign-ins started from the header cart, as a share of presses of it
by collectors with no session. A press that ends in a sign-in is the control
doing its job; a press that ends in a dismissal is the ask arriving at the
wrong moment, and a rate that stays near zero says the control should be hidden
from them instead.

## What changes

- The Cart control opens the sign-in dialog while no session is signed in,
  rather than the cart drawer.
- The drawer the collector pressed for opens by itself once the session
  arrives, the way an add pressed without a session completes itself.
- Dismissing the dialog leaves them signed out with no drawer, and nothing
  waiting to happen later.
- A collector who is signed in presses Cart and gets the drawer, unchanged.

A session that has not resolved yet counts as no session, so the control asks.
The header already shows a Sign In button beside it in that moment, and one
rule — no session in hand, ask — is the one a reader can hold.

The requirement naming what may depend on the session is
`auction-first-site-header`'s to fold, and it carries the sentence that widens
to the Cart control. This change adds a requirement and modifies none, so the
two fold in either order.

## Capabilities

- `grade10-site/site/page-shell`

## Non-Goals

- **The drawer's own contents.** What a member sees once it opens is
  `shared/ui/store-cart`'s and does not change.
- **Hiding the control.** The cart stays in the header for a signed-out
  collector; whether it should disappear instead is what the metric is for.
- **Checkout.** Who may pay, and with what, is `grade10-site/store/checkout`'s.
- **The cart count badge.** `nav-cart-count-badge` is in flight on
  `shared/ui/site-chrome`; what a signed-out collector's badge reads is that
  change's.

## Open questions

- Should the control disappear for a signed-out collector rather than ask?
  Settled by whoever owns the header's shape once the metric above has a
  month of data.

## Follow-on changes

- The same ask from the checkout address, which a signed-out collector can
  still open directly.

## References

- [Page Shell · Cart](../../../docs/prds/products/grade10-site/site/page-shell.md#cart)
- [Cart Drawer](../../../docs/prds/products/grade10-site/store/cart.md)
- [Sign-In Dialog](../../../docs/prds/products/shared/ui/auth-sign-in.md)
