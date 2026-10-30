---
title: Cart Drawer
spec: grade10-site/store/cart-drawer
order: 4
---

The Cart Drawer opens over the page the collector is on: they check what is in
the cart, put a promo code and points against it, and go on to checkout or
back to that page.

## Reviewing the Cart

- **Current Read** — every line read against the shop on open; the price and
  the stock are the shop's own — [Cart Validation](/p/grade10-site/store/cart-validation)
  - **Unresolved** — while the read is pending or failed, the lines, the
    totals and Checkout wait; nothing held is shown as current
  - **Lines Whose Product Left the Shop** — leave the cart on open, with one
    notice; a sold-out line stays, marked, until the collector removes it
- 🚧 **Product Pictures** — each product's current picture, so the collector
  recognises what they are buying
- **Edits** — quantity and removal, written to the same cart the page holds
- **Whose Cart** — a signed-in member's, kept at the store; a guest's, kept
  in this browser. Signing in moves the browser's lines into the member's cart
  - ❓ **A Product in Both Carts** — signing in combines the two lines into
    one, its quantity the sum of both. Product confirms it runs
- **The Choice Follows the Cart** — the code and the points chosen, held with
  the lines, so both are still there after a reload and on another device;
  the figures are read again either way
- **When the Session Ends** — an open drawer closes by itself, with no
  message, when the member signs out in another tab of this site or the
  session expires; a guest's drawer stays open

::story{id="store-cart-blocks-cartdrawer--default" title="The cart drawer"}

::story{id="store-cart-blocks-cartdrawer--unavailable-items-removed" title="Lines whose product left the shop, leaving"}

## Promo Code

- **One Code** — one per cart, typed or picked; a second replaces the first
- **Typed** — a code the store knows takes its cut off the total at once; one
  it refuses stays in the field with the refusal's own sentence, and the total
  does not move — [Coupons](/p/grade10-site/loyalty/coupons#refusals)
- **Picked** — a held code, applied the same way from the list; one that
  cannot ride this cart is listed apart with its reason
  - **Held Codes** — the member's own store codes and reward coupons, plus the
    public codes; the ones that fit first, the soonest to expire first
  - **Public Codes** — codes open to everyone, listed to guests and members
    alike; a guest sees these only, and a member-only code typed by a guest
    gets the same refusal as a code nobody minted —
    [Discounts](/p/grade10-site/store/discounts#public-codes)
  - **Refused by the Shop** — a code the store holds but the shop would not
    apply to this basket, listed with that reason; the total does not move
  - 🚧 **Running Out Reads Louder** — a live code in its last 14 days keeps
    its title and detail, with only its use-by date emphasised
  - 🚧 **Wallet Not Answered** — the codes the store minted still listed and
    a typed code still applies; the drawer says the programme's rewards could
    not be read
- **The Shop's Figure** — a code's cut is what the shop takes, so a 10% code
  takes 10% as the shop rounds it
- **Set Aside for a Site Discount** — where the code and a site discount
  cannot both apply and the site discount takes more, the drawer says so and
  the total shows the site discount, as the shop's checkout does; the code
  stays in the wallet — [Discounts](/p/grade10-site/store/discounts#order-of-application)
- 🚧 **Removed** — removing the code puts it back in the list; a cart edit
  that makes it stop fitting takes it off with a notice
- 🚧 **Gift** — a code that gives an item adds it as a line at no charge;
  taking that line out puts the code back
- 🚧 **Refusals in the Reader's Language** — every reason a code or the
  points are refused, said in the site's own words, by its cause

::story{id="store-cart-blocks-cartdrawerfooter-guest--member-with-public-codes" title="A member's codes beside the public ones"}

## Points

- **Offered** — to a member the programme knows, with the balance, the rate
  and the most this cart can take after the code
  - **Rate** — $1 a point, after the code, on qualifying goods only —
    [Paying with Points](/p/grade10-site/loyalty/paying-with-points)
- **Applied** — a chosen number of points, or the most the cart can take,
  carried to checkout with the saving the store quotes; an ask past the
  ceiling is trimmed to it, and a change that fails keeps the last one
  accepted
  - **Removing Points** — clears them and keeps the code
- **Nothing Left** — a code that took the whole of the goods leaves points
  nothing to pay, and the field says so
- **Not Offered** — to a guest, a member outside the programme, or while the
  programme has not answered

::story{id="store-cart-blocks-cartdrawerfooter-interactive--interactive-member" title="A code and points on the cart"}

## Estimated Total

- **Estimated Total** — goods − site discounts − code − points, as the shop's
  checkout prices them; before shipping and tax
  - **Shop's Answer** — within 2.5 s; past it, or where the shop does not
    answer, the store's own figures, with no site discount in them
- **Discounts on a Line and Below It** — which price a line strikes, and the
  footer's rows in order — [Discounts](/p/grade10-site/store/discounts#where-each-shows)

## Checkout

- **Created from the Drawer** — Proceed to Checkout sends the reviewed lines,
  the code and the points straight to Shopify; there is no separate checkout
  page to reopen or re-read them
  - 🚧 **Sent** — the order is promised with the same code and points the
    drawer shows — [Shopify Integration](/p/grade10-site/loyalty/shopify-integration#online-checkout)
  - **After Paying** — paying the invoice clears the cart, the code and the
    points with it — [Checkout](/p/grade10-site/store/checkout#after-paying)
- **Guest** — checks out as a guest, with a way to sign in for points and
  rewards — [Checkout](/p/grade10-site/store/checkout#guest-checkout)
  - **Signing In** — reopens the drawer on the member's cart, with points and
    the wallet; the guest's code moves to it unless it already holds one
- **No Identity Check** — a checkout of any value asks nothing about who the
  buyer is — [KYC](/p/grade10-site/account/kyc)

::story{id="store-cart-screens-cart-drawer-guest--guest" title="The drawer's guest checkout"}

## Pending Operations

- **Wait Before Another Action** — while the drawer reads, saves or starts
  checkout, it takes no cart edit, code or points action, product link or
  checkout; closing it still works

::story{id="store-cart-blocks-cartdrawer--interaction-pending" title="A cart drawer that stays dismissible while pending"}

:::detail{title="Test cases" for="qa"}
[Test cases · grade10-site/store/cart-drawer](https://github.com/9gag/grade10-spec/tree/main/openspec/specs/grade10-site/store/cart-drawer)
:::

:::detail{title="How the total is priced" for="engineer"}
- **The Quote** — the store asks the shop to price the basket the same way the checkout's promise is priced, so the drawer and the checkout agree
- **The Held Choice** — the code and the points are stored with the cart and changed together, as one choice
- **The Wallet Read** — the loyalty programme lists the member's coupons that fit the cart, on the store's own rules rather than the shop's
- **The Drawer** — one drawer in the site's shell, over the store's shared cart and checkout state

::image{src="assets/diagrams/store-cart-quote.svg" alt="How the drawer and the store arrive at the cart's total"}

- **Commerce architecture** — [docs/architecture/commerce.md](https://github.com/9gag/grade10/blob/main/docs/architecture/commerce.md)
:::

:::detail{title="Product decisions" for="pm"}
The drawer serves a collector who wants to check the cart, and what a code
and points do to it, without leaving the product or collection they are
considering. Its value is a total they can trust before they go to pay.

- **Overlay, not page** — the cart stays attached to the browsing moment; a new route would make the collector leave before the drawer solves anything
- **Cart in the header everywhere** — on every surface the drawer answers, Auction included, so checkout stays one tap away
- **Wait, rather than disable Checkout alone** — the drawer waits for its reads and writes before accepting another action
- **Dismissible while pending** — close, backdrop and Escape stay available, so a slow request does not trap the collector; chosen over disabling dismissal
- **The product's first picture** — as the collection card shows it, from the current read; variant pictures, or pictures held with the cart, can differ from the catalogue
- **Closes when the session ends** — chosen over leaving it open and empty, which reads as a cart with nothing in it beside a header that says Sign In
- **Another member's code** — answered as a code nobody minted, so a typed code tells nobody whose wallet it is in
- **Priced by the shop** — the shop prices the basket as its checkout will, so a code shown as applied is applied at checkout; the held list stays on the store's own rules, because asking the shop once per held code on every edit is too many calls
- **Not in scope** — a dedicated cart page; variant-specific pictures; shipping and tax before the invoice; a second code on one cart
- **Measured by** — drawer-to-checkout sessions, as Cart Opened then Checkout Started — [Mixpanel Events](/p/grade10-site/analytics/mixpanel-events)
  - ❓ **Unmeasured** — failed open reviews, and refused codes and points by reason; nothing records them yet. Engineering confirms
:::
