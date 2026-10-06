---
title: Cart Drawer
spec: shared/ui/store-cart
order: 5
reviewed: 2026-09-11
---

The cart is a drawer that slides in over the page. It lists the items the
shopper is buying and fades at the edge when there is more to scroll to.

Opening it re-reads current status and price against the catalogue, because a
cart is the one place a stale price is expensive; a cart with lines waits
behind skeleton placeholders. Sold-out lines are marked. The drawer title's
count is one per line, whatever its quantity, and leaves out sold-out and
unavailable lines. A line's stepper stops at a maximum the application
supplies, beside a remaining count the application words; the drawer derives
neither. A line already carrying the low-stock warning shows both - one says
what was already changed, the other says what is left.

It closes three ways — the close control, the dimmed backdrop, and Escape — and
locks the page behind it while it is open. Pressing checkout puts the button
into a redirecting state and hands the intent to the application, which is what
actually creates the checkout session.

## Empty Cart

🚧 **Empty** - when the cart holds nothing, the design-system empty state: a
cart icon, a title, and a line under it where the application supplies one,
with no count on the drawer title and no footer. It offers no action of its
own.

🚧 **Not read yet** - until the cart is read, the drawer stays loading: a blank
body, a skeleton for the title's count and no footer. If that read fails, the
application also says the cart could not be checked and offers Retry, naming
no line, as [Cart Validation](../../grade10-site/store/cart-validation.md) asks
for a cart whose lines are not loaded. A cart read empty shows the empty
state, even when its price check fails.

🚧 **Only delisted lines** - the drawer shows the empty state and removes them
with its one toast.

🚧 **Only sold-out lines** - not empty: the lines show marked sold out, with the
footer and no count on the drawer title.

## Tender Actions

🚧 **Unresolved choice** — tender actions and Checkout wait while the
application saves a choice; accepted figures stay visible until it answers.

🚧 **Tender actions need an answer** — a promo or points action appears only
when the application supplies the callback that can perform it. The drawer can
show current tender context without offering an action that cannot change it.

## Site Sale And Promo Codes

🚧 An automatic storewide sale on a line shows as the sale unit price with the
list price struck through. The summary does not add a separate Store sale row
for that cut.

🚧 When a promo code stacks on that sale, the lines keep the sale and
compare-at, the Subtotal is their sum, and the footer names only the code's
Discount. When the code replaces the sale, lines return to list price and the
footer shows only the code. When the code is refused, lines stay on the sale
and the sheet names why. Removing a code that replaced the sale puts the sale
back on the lines.

🚧 **Held, cannot apply** — a held code that cannot apply on this cart is
muted with its reason and no Apply.

::story{id="store-cart-cartitem--sale-price" title="A line on the store sale"}

::story{id="store-cart-cartdrawer-auto-discount--refuse" title="A refused promo on the store sale"}

::story{id="store-cart-cartdrawer-auto-discount--stack" title="A promo stacked on the store sale"}

::story{id="store-cart-cartdrawer-auto-discount--replace" title="A promo that replaces the store sale"}

::story{id="store-cart-cartdrawer-auto-discount--fallback-after-remove" title="The store sale back after the promo is removed"}

::story{id="store-cart-promoticket--not-applicable" title="A held code that cannot apply"}

::story{id="store-cart-cartdrawer--default" title="The drawer with items"}

::story{id="store-cart-cartdrawer--empty-state" title="An empty cart"}

::story{id="store-cart-cartdrawer--fetching-on-open" title="The skeleton state while the drawer re-reads prices"}

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4735-6493" title="Historical Figma — superseded by Storybook"}

:::detail{title="Test cases" for="qa"}
::cases{id="shared/ui/store-cart"}
:::

:::detail{title="Product decisions" for="pm"}
A shopper who opens the cart needs to see what they are buying, or that there
is nothing to buy yet. Rows that stand in for missing items read as actions the
shopper cannot take, and make an empty cart look unfinished.

**Not in scope.** A cart page of its own. Brand words for the empty cart beyond
its title and the line under it.

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Empty cart | ❓ Product manager to confirm: no metric, since the change corrects how a shared block looks and the host's cart analytics own any measure; or the share of empty-cart opens followed by a product view in the same session, measured in the Grade10 host. Recommended: no metric | Product |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Empty cart action | Decided | None. The drawer offers no Browse More, so no host has to build a way into the catalogue that an empty cart cannot complete | Product |
| Few items | Decided | The drawer lists only what the cart holds and scrolls what does not fit, instead of filling five rows with placeholders | Product |
| Look | Decided | The block's stories are the agreed look; the Figma cart frames are historical | Design |
| Figma cart frames | Open | ❓ Designer to confirm: retire `Cart Item Slot` and redraw the empty frames to match the empty-cart story, or label the frames historical in Figma. Recommended: redraw | Design |
:::
