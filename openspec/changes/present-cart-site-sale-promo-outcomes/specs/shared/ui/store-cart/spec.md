## Feature set

- Site sale and promo outcomes
  - On sale: a site sale shows on the lines it cuts as the sale price beside the struck list price, never as a summary row
  - Subtotal: the sum of each line's price times its quantity, leaving out a sold-out line
  - Stacked: the lines keep the sale and the summary shows only the code's discount
  - Refused: the lines and totals stay on the sale and the promo sheet says why
  - Replaced: each line the code takes the sale from shows the list price with nothing struck through, and the summary shows only the code's discount
  - Removed: the code's discount leaves, and the sale returns to lines the code had taken it from while it still runs
  - Held, cannot apply: a held code that cannot apply is listed apart from the ones that can, muted with its reason and no Apply

## ADDED Requirements

### Requirement: A site sale reaches the drawer only on its lines

The consumer's quote owns every amount; the drawer computes none.

**Consumer supplies** - The consumer SHALL supply a site sale only on the lines
it cuts, as each line's `price` (the sale price) and `originalPrice` (the list
price), each the price of one, and never as `PromoState`. Where a promo code
meets a site sale on one cart, it SHALL supply the code only as `PromoState`,
and never as a line's `couponCode`. The `subtotal` it supplies SHALL be the
sum of each line's price times its quantity, over every line but a sold-out
one, in every outcome.

**Drawer renders** - Given such a line, the drawer SHALL render the sale price
with the list price struck through. It SHALL strike any `originalPrice` it is
given and compare no amounts. Given a line with no `originalPrice`, it SHALL
render the price alone. It SHALL render the supplied Subtotal.

<!-- trace:scenario id=g10.shared-store-cart.SC-ycc rev=1 -->
#### Scenario: shared-ui-store-cart-SC-26 - Site sale lines show the struck list price and add no summary row
**Serves:** shared-ui-store-cart-US-13 - Shopper reads a site sale on the cart lines

- **GIVEN** a cart whose quote applies a site sale on some lines, one of them
  holding more than one, but not on another, with one sold-out line, and no
  promo code
- **WHEN** the drawer renders those lines and the summary
- **THEN** each sale line shows the sale price and the struck list price, the
  line off the sale shows its price alone, the Subtotal matches the sum of
  each line's price times its quantity and leaves out the sold-out line, and
  the footer shows no discount row

<!-- trace:scenario id=g10.shared-store-cart.SC-ahq rev=1 -->
#### Scenario: shared-ui-store-cart-SC-47 - A list price equal to the price is still struck through
**Serves:** shared-ui-store-cart-US-13 - Shopper reads a site sale on the cart lines

- **GIVEN** a line whose supplied list price equals its price
- **WHEN** the drawer renders that line
- **THEN** the line shows the price and the list price struck through beside
  it, as on any sale line

### Requirement: A stacked promo keeps the sale lines and adds only the code's discount

Given lines on the site sale and `PromoState` `applied` with the code and its
discount amount, the drawer SHALL render each line's sale price with its list
price struck through, and exactly one discount row, for that code, with its
amount.

<!-- trace:scenario id=g10.shared-store-cart.SC-zxr rev=1 -->
#### Scenario: shared-ui-store-cart-SC-27 - Stacked code appears only as the footer discount on sale lines
**Serves:** shared-ui-store-cart-US-14 - Shopper stacks a promo on the site sale

- **GIVEN** a cart with a site sale on its lines and a promo code that stacks
- **WHEN** the drawer shows the applied code
- **THEN** the lines still show the sale price and the struck list price,
  the Subtotal matches the sum of each line's price times its quantity, and
  the footer shows exactly one discount row, for the code, with its amount

### Requirement: A refused promo leaves the site sale in place and names the refusal

Given lines on the site sale and a refused code, the consumer SHALL supply
`PromoState` `expanded` with the refusal as its `error`, and the same line
prices, `subtotal` and `estimatedTotal` as before the attempt. The drawer
SHALL keep each line's sale price and struck list price, SHALL render no
discount row, and the promo sheet SHALL show the refusal message.

<!-- trace:scenario id=g10.shared-store-cart.SC-8bx rev=1 -->
#### Scenario: shared-ui-store-cart-SC-28 - Refused code leaves sale lines and shows the refusal
**Serves:** shared-ui-store-cart-US-15 - Shopper is refused a promo against the site sale

- **GIVEN** a cart with a site sale on its lines
- **WHEN** the shopper applies a promo code the quote refuses, typed or picked
  from the held codes that can apply
- **THEN** the lines, the Subtotal and the estimated total stay on the site
  sale, the footer shows no discount row, and the promo sheet shows the
  refusal

### Requirement: A held code that cannot apply is muted with its reason

A held code the consumer marks `applicable: false` SHALL render muted in the
promo sheet, listed apart from the held codes that can apply, with its
`inapplicableReason` and no Apply control, whatever callbacks are supplied.

<!-- trace:scenario id=g10.shared-store-cart.SC-gas rev=1 -->
#### Scenario: shared-ui-store-cart-SC-29 - An inapplicable held promo has no Apply control
**Serves:** shared-ui-store-cart-US-15 - Shopper is refused a promo against the site sale

- **GIVEN** a held promo the quote marks not applicable for this cart
- **WHEN** the promo sheet lists that code
- **THEN** the ticket is muted, shows why it cannot apply, and offers no
  Apply control

<!-- trace:scenario id=g10.shared-store-cart.SC-tp9 rev=1 -->
#### Scenario: shared-ui-store-cart-SC-46 - Held codes that cannot apply are listed apart from the ones that can
**Serves:** shared-ui-store-cart-US-15 - Shopper is refused a promo against the site sale

- **GIVEN** a cart on the site sale holding one code that can apply and one
  the quote marks not applicable
- **WHEN** the shopper opens the promo sheet
- **THEN** the code that can apply shows its Apply control, and the code that
  cannot is listed apart from it, muted, with its reason and no Apply control

### Requirement: A replacing promo takes the sale from its lines and shows only the code's discount

The consumer SHALL supply each line the code takes the sale from at its list
price with no `originalPrice`, and `PromoState` `applied` with the code and its
discount amount. Which lines a code takes is the quote's, line by line. The
drawer SHALL render each such line's list price with nothing struck through,
any line still on the sale as a sale line, and exactly one discount row, for
that code, with its amount.

<!-- trace:scenario id=g10.shared-store-cart.SC-6r0 rev=1 -->
#### Scenario: shared-ui-store-cart-SC-30 - Replacing code shows list prices on the lines it takes and only the footer discount
**Serves:** shared-ui-store-cart-US-16 - Shopper's promo replaces the site sale

- **GIVEN** a cart whose quote let a promo code take the site sale from some
  lines and leave it on another
- **WHEN** the drawer renders
- **THEN** each line the code took the sale from shows its list price with
  nothing struck through, the line left on the sale shows the sale price and
  the struck list price, the Subtotal matches the sum of each line's price
  times its quantity, and the footer shows exactly one discount row, for the
  code, with its amount

### Requirement: Removing a promo drops its discount and returns the sale it had replaced

Once the shopper removes an applied code, the consumer SHALL supply
`PromoState` other than `applied`, and the drawer SHALL render no discount row
for that code. Where the code had replaced the site sale and the quote still
carries the sale, the consumer SHALL supply those lines on the sale again, and
the drawer SHALL render each sale price with its list price struck through.

<!-- trace:scenario id=g10.shared-store-cart.SC-07s rev=1 -->
#### Scenario: shared-ui-store-cart-SC-31 - Removing a stacked or replacing code leaves the lines on the sale
**Serves:** shared-ui-store-cart-US-17 - Shopper removes a promo and keeps the site sale

- **GIVEN** a cart showing an applied promo that stacked on or replaced a
  site sale, and the site sale still runs
- **WHEN** the shopper removes that promo
- **THEN** the lines show the sale price and the struck list price, the
  Subtotal matches the sum of each line's price times its quantity, and the
  footer shows no discount row for that code
