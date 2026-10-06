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

🚧 **Not read yet** - the drawer never shows the empty state for a cart it has
not read. While the read runs, it shows a blank body, a skeleton for the
title's count and no footer. A cart read empty shows the empty state, even
when its price check fails.

🚧 **First read fails** - the drawer keeps that blank body, never the empty
state, while the application offers Retry and names no line, as
[Cart Validation](../../grade10-site/store/cart-validation.md) asks for a cart
whose lines are not loaded.

🚧 **Only delisted lines** - the drawer shows the empty state and removes them
with its one toast.

🚧 **Only sold-out lines** - not empty: the lines show marked sold out, with
the footer and no count on the drawer title.

## Tender Actions

🚧 **Unresolved choice** - tender actions and Checkout wait while the
application saves a choice; accepted figures stay visible until it answers.

🚧 **Tender actions need an answer** - a promo or points action appears only
when the application supplies the callback that can perform it. The drawer can
show current tender context without offering an action that cannot change it.

## Site Sale and Promo Codes

A site sale is a storewide cut the shop applies with no code. The
application's quote decides whether a promo code stacks on it, is refused, or
replaces it; the drawer shows that outcome and works out no amount.

🚧 **On sale** - a line on the sale shows the sale price with the list price
struck through, even a list price equal to the sale price. The summary adds no
Store sale row.

❓ **The struck price read aloud** - how a screen reader tells the struck list
price from the price charged. The designer's call.

🚧 **Subtotal** - the sum of each line's price times its quantity, leaving
out sold-out and unavailable lines, as the drawer title's count does.

🚧 **Stacked** - a code that stacks leaves the sale on the lines; the summary
shows only the code's discount.

🚧 **Refused** - a refused code leaves the lines and the totals on the sale;
the promo sheet says why.

🚧 **Replaced** - a code that replaces the sale puts each line it takes the
sale from at the list price, with nothing struck through; the summary shows
only the code's discount.

🚧 **Removed** - removing the code drops its discount. Where the code had
replaced the sale, the sale returns to the lines while it still runs.

🚧 **Held, cannot apply** - a held code that cannot apply on this cart is
listed apart from the ones that can, muted with its reason and no Apply.

❓ **A picked code the quote refuses** - whether its ticket stays among the
ones that can apply, with its Apply, or moves apart, muted with the refusal as
its reason, or each application chooses. The designer's call.

::story{id="store-cart-cartitem--sale-price" title="A line on the site sale"}

::story{id="store-cart-cartitem--equal-list-price" title="A list price equal to the price, still struck through"}

::story{id="store-cart-cartdrawer-auto-discount--on-sale" title="The site sale beside a line off it and a sold-out line"}

::story{id="store-cart-cartdrawer-auto-discount--refuse" title="A refused promo on the site sale"}

::story{id="store-cart-cartdrawer-auto-discount--stack" title="A promo stacked on the site sale"}

::story{id="store-cart-cartdrawer-auto-discount--replace" title="A promo that replaces the site sale"}

::story{id="store-cart-cartdrawer-auto-discount--fallback-after-remove" title="The site sale back after the promo is removed"}

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

A shopper with a site sale and a promo code on one cart has to tell from the
drawer which cut priced each line, and whether removing the code brings the
sale back. The drawer shows one shape per outcome, from the amounts the
application supplies.

**Not in scope.** A cart page of its own. Brand words for the empty cart beyond
its title and the line under it. An automatic cut off the whole order, such as
a spend threshold: the drawer shows sales that sit on lines, and the invoice
prices the rest. Pricing the shop's sale in Grade10's drawer, which leaves it
to the invoice - [Cart Drawer](/p/grade10-site/store/cart). A code shown on a
line: in every outcome here, the code's discount shows in the summary.

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Empty cart | The CartDrawer Empty State, Empty State Without Description, Loading No Lines, Only Delisted Lines and Only Sold Out Lines stories and the CartDrawerBody Empty story each show their state, and their play tests pass. | Engineering |
| Outcome stories | The CartItem Sale Price and Equal List Price stories, the five Auto Discount stories and the PromoTicket Not Applicable story each show their outcome, and their play tests pass. | Engineering |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Empty cart action | Decided | None. The drawer offers no Browse More, so no host has to build a way into the catalogue that an empty cart cannot complete | Product |
| Few items | Decided | The drawer lists only what the cart holds and scrolls what does not fit, instead of filling five rows with placeholders | Product |
| Look | Decided | The block's stories are the agreed look; the Figma cart frames are historical | Design |
| Combine rules | Decided | The drawer shows the outcome the quote returns. Whether a code stacks, is refused or replaces the sale, including a product sale that refuses every code, is the shop's pricing - [Discounts · One discount at a time](/p/grade10-site/store/discounts#one-discount-at-a-time). Chosen over encoding those rules in the drawer. | Product |
| No sale row | Decided | A site sale shows only on the lines it cuts, so each cut appears once; the summary names no automatic cut. | Product |
| Picked code refused | Open | ❓ Designer to confirm: after the quote refuses a held code the shopper picked, its ticket stays among the ones that can apply with its Apply, moves apart, muted, with the refusal as its reason, or each application chooses. Recommended: moves apart | Design |
| Struck price read aloud | Open | ❓ Designer to confirm: how a screen reader tells the struck list price from the price charged - hidden labels the application supplies, such as Sale price and Was, or a strike element with no new words. Recommended: hidden labels, through one follow-on change for every struck price | Design |
:::
