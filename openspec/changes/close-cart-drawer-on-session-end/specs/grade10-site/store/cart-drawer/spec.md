## Purpose

The Grade10 Store cart drawer lets a collector recognise the products in the current reviewed cart without leaving the page. It lets them review and edit that cart, then continue through an existing site address.

## Feature set

- Session end
  - Member signed out: an open drawer closes when the member it was open for is signed out, in another tab or by expiry
  - Silent close: the drawer closes with no message
  - Drawer kept: a guest's drawer, and a drawer open across a switch from one member to another, stay open

## ADDED Requirements

### Requirement: An open drawer closes when its member's session ends

An open cart drawer SHALL close by itself, with no toast, notice or prompt to
sign in, when the member it was open for is signed out in another tab of this site
in this browser or their session expires. The drawer SHALL follow the session its tab
shows, as `shared/auth/session` states, and SHALL close only when that session
goes from a signed-in member to nobody. The drawer of a collector with no
session SHALL stay open, because there is no session to end. A session the tab
is still reading, or cannot read, SHALL NOT close the drawer, and neither SHALL a
switch the tab reads directly from one member to another, which leaves the
drawer open on the new member's cart. A tab that reads nobody between the two
members closes the drawer, as it does for any sign-out.

When Proceed to Checkout meets an expired session, that session has ended like
any other, and the drawer SHALL close. That close takes precedence over the drawer
staying open on its redirecting state until the hosted invoice, and over the
failed state that restores Checkout. What checkout then asks of the collector
is `grade10-site/store/checkout`'s. The drawer SHALL NOT reopen when the
collector signs in again without having opened the cart since.

<!-- trace:scenario id=g10.store-cart-drawer.SC-jq7 rev=1 -->
#### Scenario: g10.store-cart-drawer.SC46 - Signing out in another tab closes the open drawer
**Serves:** g10.store-cart-drawer.US14 - the collector who signs out in one tab and comes back to another with the cart open

- **GIVEN** a signed-in member with the cart drawer open on a Store surface, and the site open in another tab of this browser
- **WHEN** the member signs out in the other tab
- **THEN** the drawer closes without the collector acting on this tab
- **AND** the header shows Sign In with no drawer open beside it

<!-- trace:scenario id=g10.store-cart-drawer.SC-7ep rev=1 -->
#### Scenario: g10.store-cart-drawer.SC47 - An expired session closes the open drawer
**Serves:** g10.store-cart-drawer.US14 - the collector who returns after the session ran out with the cart left open

- **GIVEN** a signed-in member whose cart drawer is open and whose tab was left unattended
- **WHEN** the session expires and the collector returns to the tab
- **THEN** the drawer closes without the collector pressing Close

<!-- trace:scenario id=g10.store-cart-drawer.SC-53j rev=1 -->
#### Scenario: g10.store-cart-drawer.SC48 - The close says nothing
**Serves:** g10.store-cart-drawer.US14 - the collector who finds the cart gone with nothing said about it

- **GIVEN** a signed-in member with the cart drawer open on a surface that needs no session
- **WHEN** the member's session ends and the drawer closes
- **THEN** no toast, notice or prompt to sign in appears because of it

<!-- trace:scenario id=g10.store-cart-drawer.SC-l85 rev=1 -->
#### Scenario: g10.store-cart-drawer.SC49 - A drawer open for a collector with no session stays open
**Serves:** g10.store-cart-drawer.US14 - a collector who never had a session is not one whose session ended

- **GIVEN** a collector with no session who pressed Cart before the tab's first read of the session answered, so the drawer is open on the cart this browser holds
- **WHEN** that read answers that nobody is signed in
- **THEN** the drawer stays open
- **AND** it still shows the cart this browser holds

<!-- trace:scenario id=g10.store-cart-drawer.SC-dd4 rev=1 -->
#### Scenario: g10.store-cart-drawer.SC50 - A session still being read leaves the drawer open
**Serves:** g10.store-cart-drawer.US14 - a member whose session is still good finds the cart as they left it

- **GIVEN** a signed-in member with the cart drawer open
- **WHEN** the tab reads the session again, and the read has not yet answered, and then answers that the same member is signed in
- **THEN** the drawer stays open at both moments

<!-- trace:scenario id=g10.store-cart-drawer.SC-fg7 rev=1 -->
#### Scenario: g10.store-cart-drawer.SC51 - A switch to another member leaves the drawer open on their cart
**Serves:** g10.store-cart-drawer.US14 - a member who returns to a tab now signed in as somebody else

- **GIVEN** a signed-in member with the cart drawer open
- **WHEN** this tab's next reading of the session is a different member, with no reading of nobody between
- **THEN** the drawer stays open
- **AND** it shows the new member's cart and nothing of the first member's

<!-- trace:scenario id=g10.store-cart-drawer.SC-w1i rev=1 -->
#### Scenario: g10.store-cart-drawer.SC52 - Checkout meeting an expired session closes the drawer
**Serves:** g10.store-cart-drawer.US14 - a member whose session ran out while the cart was open and who presses Proceed to Checkout

- **GIVEN** a signed-in member with the cart drawer open on a reviewed cart, whose session has expired
- **WHEN** the member activates Proceed to Checkout and checkout answers that nobody is signed in
- **THEN** the drawer closes

<!-- trace:scenario id=g10.store-cart-drawer.SC-gey rev=1 -->
#### Scenario: g10.store-cart-drawer.SC53 - Signing in again does not reopen the drawer
**Serves:** g10.store-cart-drawer.US14 - a collector who signs in again after the cart closed

- **GIVEN** a drawer closed because its member's session ended, in another tab or at checkout
- **AND** the collector has not opened the cart since
- **WHEN** the collector signs in again
- **THEN** the drawer stays closed

<!-- trace:scenario id=g10.store-cart-drawer.SC-tpw rev=1 -->
#### Scenario: g10.store-cart-drawer.SC54 - A session read that fails leaves the drawer open
**Serves:** g10.store-cart-drawer.US14 - a member whose session is still good finds the cart as they left it

- **GIVEN** a signed-in member with the cart drawer open
- **WHEN** the tab cannot read the session, because the service cannot be reached or fails to answer
- **THEN** the drawer stays open
