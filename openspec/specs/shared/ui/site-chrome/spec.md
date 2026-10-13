# shared/ui/site-chrome Specification

## Purpose
The chrome every storefront wraps its pages in: the site header and the site
footer, shipped once from the design system so two brands render the same
shell. The components own the layout; the application owns every string, every
destination, and every control that does something.

## Feature set

- Chrome exports
  - Header and footer: `Nav` and `Footer` from the design-system entry, each usable alone
  - `SiteHeader`: shared header composition with application-supplied content and session
  - Public types: `SiteHeaderProps`, `SiteHeaderCopy`, and `SiteHeaderSession`
- Header controls
  - Handler-gated: search, account, cart, Profile, My Orders, and Membership
    render only when their handler is supplied, or, for account and cart,
    their slot; Membership also needs its copy
  - No wishlist: the header does not offer a wishlist control
  - Account menu: Sign In when signed out; signed in, an initial avatar above
    the sign-in email, or the account label alone with no email, above the
    items in one fixed order - Profile, My Orders, My Auctions, Membership,
    Sign Out - each gated item omitted on its own; no other item joins, KYC
    and a second orders item included
  - Compact menu: left drawer for navigation and utilities, with language in
    a nested drawer
  - Wide layout: primary navigation and language stay in the bar
  - Cart slot: a `cartSlot` on `Nav` replaces the built-in cart control and
    never runs `onCartClick`
  - Cart count: `SiteHeader` shows a round brand indicator on the cart icon for the supplied active-line count; hidden when empty or omitted
- External links
  - New-tab destinations: a `NavLink` marked `external` opens in a new tab with
    `rel="noopener noreferrer"` in primary nav (wide bar and compact drawer)
    and in the utility strip / compact utility list
- Current surface
  - Marked destination: the chrome can mark which surface is being viewed
- Footer
  - Supplied sections: columns and links the application provides; empty sections stay empty
- No defaulted content
  - Application-owned copy: nothing visible is invented by the chrome

## Requirements

### Requirement: The chrome exports

The design system SHALL export, from its public entry, the `Nav` and `Footer`
components and these types: `NavProps`, `NavItem`, `NavLink`, `NavCopy`,
`NavAccountPresentation`, `NavLocale`, `FooterProps`, `FooterColumn`,
`FooterLink`, and `FooterCopy`.

Each SHALL take the words it renders in a single `copy` prop of its own copy
type; every other input — the destinations, the handlers, the promotional and
utility regions, the locale set and the selected locale, the account
presentation, and optional account and cart slots — SHALL remain its own prop.

`Nav` and `Footer` SHALL each be renderable on their own, in either order, and
neither SHALL require the other.

<!-- trace:scenario id=g10.shared-site-chrome.SC-xvs rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-01 - An application imports the chrome
**Serves:** Chrome exports - an application imports the chrome

- **WHEN** an application imports each name above from the design system's public entry
- **THEN** every import resolves

<!-- trace:scenario id=g10.shared-site-chrome.SC-rfu rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-02 - A page renders one without the other
**Serves:** Chrome exports - a page renders one without the other

- **WHEN** an application renders the header without the footer, or the footer
  without the header
- **THEN** it renders as specified, with no missing-context error

<!-- trace:scenario id=g10.shared-site-chrome.SC-v7l rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-03 - The chrome's words arrive as one group
**Serves:** Chrome exports - the chrome's words arrive as one group

- **WHEN** an application supplies the chrome's words
- **THEN** it passes one object per component, typed by that component's copy type
- **AND** a word it omits is a type error rather than an empty region

### Requirement: A control renders only when it can act

`Nav` SHALL render its search, account, and cart controls only when the
application supplies a handler for that control, or — for account and cart —
supplies that control's slot (`accountSlot`, `cartSlot`). A control with no
handler and no slot SHALL be absent from the rendered header — not present and
inert, and not visually disabled.

`Nav` SHALL NOT render a wishlist control.

The locale control SHALL present language options the application supplies; it
SHALL NOT present a currency switch. On the wide breakpoint the supplied locale
label SHALL appear in the bar (interactive only when a locale handler is
supplied). Below the wide breakpoint the locale label SHALL appear as the
language row inside the compact menu, and language options SHALL open in a
nested drawer when a locale handler is supplied.

When the application supplies `onAccountClick` and no `accountSlot`, `Nav`
SHALL render the account control as an icon by default, or as a primary Sign In
button when `accountPresentation` is `"sign-in"`.

<!-- trace:scenario id=g10.shared-site-chrome.SC-5a2 rev=2 -->
#### Scenario: shared-ui-site-chrome-SC-04 - A storefront with no cart
**Serves:** Header controls - a storefront with no cart

- **GIVEN** an application that supplies neither a cart handler nor a cart slot
- **WHEN** the header renders
- **THEN** no cart control appears in it, and no space is reserved for one

<!-- trace:scenario id=g10.shared-site-chrome.SC-at6 rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-05 - Only the supplied controls appear
**Serves:** Header controls - only the supplied controls appear

- **GIVEN** an application that supplies a handler for the account control alone
- **WHEN** the header renders
- **THEN** the account control appears
- **AND** the search and cart controls do not

<!-- trace:scenario id=g10.shared-site-chrome.SC-aq6 rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-06 - Wishlist is not a header control
**Serves:** Header controls - wishlist is not a header control

- **WHEN** the header renders
- **THEN** no wishlist control appears, and no space is reserved for one

<!-- trace:scenario id=g10.shared-site-chrome.SC-dti rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-07 - The locale label without a handler
**Serves:** Header controls - the locale label without a handler

- **GIVEN** an application that supplies a locale label and no locale handler
- **WHEN** the header renders at the wide breakpoint
- **THEN** the label is displayed in the bar
- **AND** nothing about it invites a click

<!-- trace:scenario id=g10.shared-site-chrome.SC-bv8 rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-19 - Sign In presentation
**Serves:** Header controls - Sign In presentation

- **GIVEN** an application that supplies `onAccountClick`,
  `accountPresentation` `"sign-in"`, and Sign In copy
- **WHEN** the header renders
- **THEN** a primary Sign In button appears
- **AND** the account icon does not

### Requirement: An empty region of the header is absent

`Nav` SHALL omit the promotional bar when the application supplies no promo
content, and SHALL omit the utility row when the application supplies no
utility links. An omitted region SHALL occupy no height.

<!-- trace:scenario id=g10.shared-site-chrome.SC-76j rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-08 - No promo content
**Serves:** Footer - no promo content

- **WHEN** the header renders with no promo content
- **THEN** no promotional bar appears and the header is shorter by its height

<!-- trace:scenario id=g10.shared-site-chrome.SC-1hu rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-09 - No utility links
**Serves:** Footer - no utility links

- **WHEN** the header renders with an empty set of utility links
- **THEN** no utility row appears, and no empty strip is left in its place

### Requirement: The header marks the current surface

`Nav` SHALL mark the navigation item the application identifies as current,
both visually and to assistive technology, and SHALL mark no item when the
application identifies none.

<!-- trace:scenario id=g10.shared-site-chrome.SC-qpt rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-10 - A surface is current
**Serves:** Current surface - a surface is current

- **GIVEN** navigation items of which one is marked current
- **WHEN** the header renders
- **THEN** that item is distinguished from the others and is announced as the
  current page
- **AND** no other item is

<!-- trace:scenario id=g10.shared-site-chrome.SC-8vo rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-11 - No surface is current
**Serves:** Current surface - no surface is current

- **WHEN** the header renders with no item marked current
- **THEN** no item is announced as the current page

### Requirement: The footer omits a section it has no content for

`Footer` SHALL display the supplied brand block, link columns, social links,
copyright, legal links, and locale, and SHALL omit any of the columns, social
links, or legal links the application supplies none of, rather than rendering
an empty heading or an empty row.

<!-- trace:scenario id=g10.shared-site-chrome.SC-w1j rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-12 - Every section is supplied
**Serves:** Footer - every section is supplied

- **WHEN** the footer renders with a brand block, columns, social links,
  copyright, legal links, and a locale
- **THEN** all of them are displayed

<!-- trace:scenario id=g10.shared-site-chrome.SC-gqk rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-13 - A section has no content
**Serves:** Footer - a section has no content

- **WHEN** the footer renders with no social links, no legal links, or an
  empty set of columns
- **THEN** nothing stands in its place — no heading, no empty row, no reserved
  space

### Requirement: The chrome carries no content of its own

`Nav` and `Footer` SHALL render no visible copy the application did not
supply — no brand name, no navigation label, no link text, and no fallback for
an omitted value.

<!-- trace:scenario id=g10.shared-site-chrome.SC-7ls rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-14 - Nothing is defaulted
**Serves:** No defaulted content - nothing is defaulted

- **WHEN** the chrome renders
- **THEN** every visible string is one the application supplied

### Requirement: An external link opens in a new tab

A link the application marks external opens in a new tab wherever the chrome
renders it.

**The flag** - `NavLink` SHALL accept an optional `external` flag.

**New-tab destinations** - When a link is marked `external`, `Nav` SHALL render
it with `target="_blank"` and `rel="noopener noreferrer"` wherever that link
appears — primary navigation on a wide viewport, primary items in the compact
menu drawer, the wide utility strip, and utility items in the compact menu.

**Same tab** - When `external` is omitted or false, the link SHALL navigate in
the same browsing context.

**Application decides** - The chrome SHALL NOT invent which links are external
— the application supplies the flag with the link.

<!-- trace:scenario id=g10.shared-site-chrome.SC-cmm rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-27 - External link opens a new tab
**Serves:** External links - new-tab destinations

- **GIVEN** a primary or utility link marked `external`
- **WHEN** the header renders that link in the primary nav, utility strip, or
  the compact menu
- **THEN** the link carries `target="_blank"` and `rel="noopener noreferrer"`

<!-- trace:scenario id=g10.shared-site-chrome.SC-80n rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-28 - Same-tab link stays in place
**Serves:** External links - new-tab destinations

- **GIVEN** a link with no `external` flag
- **WHEN** the header renders that link
- **THEN** the link has no `target="_blank"`

### Requirement: SiteHeader composes Nav with session-aware account entry

The shared header takes its content and session from the application and
renders the matching account entry.

**Exports** - The shared UI package SHALL export `SiteHeader` and the types
`SiteHeaderProps`, `SiteHeaderCopy`, and `SiteHeaderSession` from its public
entry.

**Composition** - `SiteHeader` SHALL compose the design-system `Nav` and SHALL
take all brand, navigation, locale, and destination content through props.

**No application state** - It SHALL NOT fetch, route, or read application
session stores itself - the application supplies `session` as `"signed-out"` or
`"signed-in"`.

**Signed out** - When `session` is `"signed-out"`, `SiteHeader` SHALL render a
primary Sign In button (not the account icon) and SHALL invoke the supplied
sign-in handler when that button is activated.

**Signed in** - When `session` is `"signed-in"`, `SiteHeader` SHALL render the
account icon and SHALL open a menu that shows a small (`xs`) initial avatar
above `accountEmail`, both above the items. When `accountEmail` is not
supplied, the menu SHALL show `copy.accountMenuLabel` in its place and no
avatar. The items SHALL include at minimum My Auctions and Sign Out. The
menu SHALL NOT include KYC. Activating each item SHALL invoke the matching
supplied handler.

**Sign Out label** - The account menu's sign-out item SHALL read "Sign Out".

**Profile, Cart, search, My Orders, and Membership** - Profile, Cart, search,
My Orders, and Membership SHALL remain absent unless the application
supplies their handlers; Membership additionally requires `copy.membership`.
The account menu's items SHALL follow the fixed order Profile, My Orders, My
Auctions, Membership, Sign Out, each of Profile, My Orders, and Membership
omitted independently wherever its own handler (and, for Membership, its
copy) is not supplied, opening directly on whichever item is next. The menu
SHALL offer no item beyond these five, so `SiteHeaderProps` and
`SiteHeaderCopy` take no handler or label for a second orders item.

<!-- trace:scenario id=g10.shared-site-chrome.SC-ff5 rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-15 - An application imports SiteHeader
**Serves:** Chrome exports - an application imports SiteHeader

- **WHEN** an application imports `SiteHeader`, `SiteHeaderProps`,
  `SiteHeaderCopy`, and `SiteHeaderSession` from the shared UI package's public
  entry
- **THEN** every import resolves

<!-- trace:scenario id=g10.shared-site-chrome.SC-7fd rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-16 - Signed out shows Sign In
**Serves:** Chrome exports - signed out shows Sign In

- **GIVEN** `session` is `"signed-out"` and Sign In copy is supplied
- **WHEN** `SiteHeader` renders
- **THEN** a primary Sign In button appears
- **AND** no account icon control appears

<!-- trace:scenario id=g10.shared-site-chrome.SC-yiu rev=2 -->
#### Scenario: shared-ui-site-chrome-SC-17 - Signed in shows the account menu
**Serves:** Header controls - the account menu's fixed order with every handler supplied

- **GIVEN** `session` is `"signed-in"`, `accountEmail` is supplied, an
  `onProfile` handler is supplied, a My Orders handler is supplied, and
  `onMembership` with `copy.membership` are supplied
- **WHEN** the collector activates the account control
- **THEN** the menu shows the `xs` avatar above `accountEmail`, both above the items
- **AND** the menu offers Profile, My Orders, My Auctions, Membership, and
  Sign Out, in that order, with Profile first, and no other item
- **AND** the menu does not offer KYC

<!-- trace:scenario id=g10.shared-site-chrome.SC-i31 rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-18 - Auction-first chrome omits cart
**Serves:** Chrome exports - auction-first chrome omits cart

- **GIVEN** `SiteHeader` with no cart handler
- **WHEN** it renders
- **THEN** no cart control appears, and no space is reserved for one

<!-- trace:scenario id=g10.shared-site-chrome.SC-xyv rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-29 - Signed in with no My Orders handler
**Serves:** Header controls - the account menu goes from Profile to My Auctions when My Orders has no handler

- **GIVEN** `session` is `"signed-in"`, an `onProfile` handler is supplied,
  and no My Orders handler is supplied
- **WHEN** the collector activates the account control
- **THEN** the menu offers Profile, My Auctions, and Sign Out
- **AND** the menu does not offer My Orders

<!-- trace:scenario id=g10.shared-site-chrome.SC-cp9 rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-30 - Signed in with no Profile handler
**Serves:** Header controls - the account menu opens directly on My Orders when Profile has no handler

- **GIVEN** `session` is `"signed-in"`, no `onProfile` handler is supplied, and
  a My Orders handler is supplied
- **WHEN** the collector activates the account control
- **THEN** the menu offers My Orders, My Auctions, and Sign Out, opening
  directly on My Orders
- **AND** the menu does not offer Profile

<!-- trace:scenario id=g10.shared-site-chrome.SC-y8d rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-31 - Signed in with neither Profile nor My Orders handler
**Serves:** Header controls - the account menu opens directly on My Auctions when neither Profile nor My Orders has a handler

- **GIVEN** `session` is `"signed-in"`, no `onProfile` handler is supplied, and
  no My Orders handler is supplied
- **WHEN** the collector activates the account control
- **THEN** the menu offers only My Auctions and Sign Out, opening directly on
  My Auctions
- **AND** the menu does not offer Profile or My Orders

<!-- trace:scenario id=g10.shared-site-chrome.SC-bjp rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-32 - Activating Profile invokes its handler
**Serves:** Header controls - the account menu's Profile item takes the collector to the supplied destination

- **GIVEN** `session` is `"signed-in"` and an `onProfile` handler is supplied
- **WHEN** the collector activates Profile in the account menu
- **THEN** the supplied `onProfile` handler is invoked
- **AND** no other account-menu handler is invoked

<!-- trace:scenario id=g10.shared-site-chrome.SC-xzm rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-43 - Activating My Orders invokes its handler
**Serves:** Header controls - the account menu's My Orders item invokes the supplied handler

- **GIVEN** `session` is `"signed-in"` and a My Orders handler is supplied
- **WHEN** the collector activates My Orders in the account menu
- **THEN** the supplied My Orders handler is invoked
- **AND** no other account-menu handler is invoked

<!-- trace:scenario id=g10.shared-site-chrome.SC-h0z rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-33 - Signed out ignores the Profile and My Orders handlers
**Serves:** Chrome exports - signed out shows Sign In

- **GIVEN** `session` is `"signed-out"`, an `onProfile` handler is supplied,
  a My Orders handler is supplied, and `onMembership` with `copy.membership`
  are supplied
- **WHEN** `SiteHeader` renders
- **THEN** a primary Sign In button appears
- **AND** no account icon, Profile item, My Orders item, or Membership item
  appears

<!-- trace:scenario id=g10.shared-site-chrome.SC-hhb rev=2 -->
#### Scenario: shared-ui-site-chrome-SC-34 - Account menu shows accountEmail with its avatar
**Serves:** grade10-site/site/page-shell#grade10-site-site-page-shell-US-03 - identifying the signed-in collector at the top of the menu

- **GIVEN** `session` is `"signed-in"` and `accountEmail` is supplied
- **WHEN** the collector activates the account control
- **THEN** the menu shows a small (`xs`) initial avatar above `accountEmail`,
  both above the items

<!-- trace:scenario id=g10.shared-site-chrome.SC-bzz rev=2 -->
#### Scenario: shared-ui-site-chrome-SC-35 - Account menu falls back to copy.accountMenuLabel without accountEmail
**Serves:** Header controls - the menu falls back to the supplied label when no email is available

- **GIVEN** `session` is `"signed-in"`, `accountEmail` is not supplied, and
  `copy.accountMenuLabel` is supplied
- **WHEN** the collector activates the account control
- **THEN** the menu shows `copy.accountMenuLabel` above the items in place of
  an email
- **AND** no avatar shows

<!-- trace:scenario id=g10.shared-site-chrome.SC-agk rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-36 - Membership requires both its handler and its copy
**Serves:** Header controls - the account menu never opens a dead Membership control

- **GIVEN** `session` is `"signed-in"`, `onMembership` is supplied, and
  `copy.membership` is not supplied
- **WHEN** the collector activates the account control
- **THEN** the menu does not offer Membership

<!-- trace:scenario id=g10.shared-site-chrome.SC-cl2 rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-37 - Sign Out reads in Title Case
**Serves:** Header controls - the account menu's Sign Out label matches product direction

- **GIVEN** `session` is `"signed-in"`
- **WHEN** the collector activates the account control
- **THEN** the last item reads "Sign Out"

<!-- trace:scenario id=g10.shared-site-chrome.SC-w7p rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-38 - Membership joins after My Auctions without a My Orders handler
**Serves:** Header controls - Membership's position holds independently of My Orders' own gating

- **GIVEN** `session` is `"signed-in"`, `onMembership` and `copy.membership`
  are supplied, and no My Orders handler is supplied
- **WHEN** the collector activates the account control
- **THEN** the menu offers My Auctions, Membership, and Sign Out, in that
  order
- **AND** the menu does not offer My Orders

<!-- trace:scenario id=g10.shared-site-chrome.SC-oe5 rev=2 -->
#### Scenario: shared-ui-site-chrome-SC-39 - Activating Membership invokes its handler
**Serves:** Header controls - the account menu's Membership item invokes the supplied handler

- **GIVEN** `session` is `"signed-in"`, `onMembership` is supplied, and
  `copy.membership` is supplied
- **WHEN** the collector activates Membership in the account menu
- **THEN** the supplied `onMembership` handler is invoked
- **AND** no other account-menu handler is invoked

<!-- trace:scenario id=g10.shared-site-chrome.SC-0eb rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-40 - Signed in with a My Orders handler but no Membership handler
**Serves:** Header controls - the account menu omits Membership until its own handler is supplied

- **GIVEN** `session` is `"signed-in"`, a My Orders handler is supplied, and
  no `onMembership` handler is supplied
- **WHEN** the collector activates the account control
- **THEN** the menu offers My Orders, My Auctions, and Sign Out
- **AND** the menu does not offer Membership

<!-- trace:scenario id=g10.shared-site-chrome.SC-61e rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-42 - SiteHeader takes no second orders item
**Serves:** Chrome exports - the public types name only the account menu's five items

- **GIVEN** an application renders `SiteHeader`
- **WHEN** it passes `onOrders`, or `orders` in `copy`
- **THEN** its type check refuses each

### Requirement: Compact viewports open navigation from a left menu drawer

Below the wide breakpoint a menu control opens a drawer holding what the bar no
longer shows.

**Menu control** - Below the wide breakpoint, `Nav` SHALL render a leading menu
control that opens a left drawer.

**Drawer order** - The drawer SHALL list primary navigation first, then utility
links when supplied (styled like the primary links), then search when a search
handler is supplied, and SHALL offer language switching through a nested drawer
opened from a row that shows the active language.

**In the bar** - Account / Sign In and Cart SHALL remain in the bar when their
handlers (or their slots) are supplied.

**Wide only** - The utility strip and the centered primary nav row SHALL appear
only at the wide breakpoint.

**Gutter** - Compact drawers SHALL leave a visible gutter beside the panel
rather than spanning the full viewport width.

**Copy** - `copy.menu` names the menu trigger; `copy.menuTitle` names the
drawer title; `copy.language` names the language nested drawer title.

<!-- trace:scenario id=g10.shared-site-chrome.SC-79u rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-20 - Compact menu holds nav and language
**Serves:** Header controls - compact menu holds nav and language

- **GIVEN** a viewport below the wide breakpoint, with primary items, utility
  links, and a locale handler supplied
- **WHEN** the collector opens the menu
- **THEN** the drawer lists the primary items, then the utility links in the
  same link style
- **AND** a language row opens a nested drawer of the brand's languages
- **AND** Account / Sign In and Cart remain in the bar when supplied
- **AND** the menu panel leaves a visible gutter beside the viewport edge

<!-- trace:scenario id=g10.shared-site-chrome.SC-ebi rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-21 - Wide viewport keeps the bar layout
**Serves:** Header controls - wide viewport keeps the bar layout

- **GIVEN** a viewport at the wide breakpoint
- **WHEN** the header renders
- **THEN** primary navigation and language appear in the bar
- **AND** the compact menu trigger is absent

### Requirement: Nav accepts a cart slot

A supplied cart slot stands in for the built-in cart control.

**Cart slot** - `Nav` SHALL accept an optional `cartSlot`.

**Supplied** - When `cartSlot` is supplied, `Nav` SHALL render that node in
place of the built-in cart control and SHALL NOT use `onCartClick`.

**Omitted** - When `cartSlot` is omitted, the built-in cart control SHALL
continue to follow the handler-gated cart rule.

<!-- trace:scenario id=g10.shared-site-chrome.SC-6id rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-22 - Cart slot replaces the built-in cart
**Serves:** Header controls - cart slot replaces the built-in cart

- **GIVEN** `Nav` with a `cartSlot`, with or without an `onCartClick` handler
- **WHEN** the header renders
- **THEN** the slot content appears in the cart control position
- **AND** the built-in cart icon button is not rendered
- **AND** activating the slot content runs only the slot's own action, never a
  supplied `onCartClick`

### Requirement: SiteHeader owns the cart count badge

The header shows the count the application supplies on the cart icon, and hides
it when there is nothing to count.

**Cart count** - When `SiteHeader` is supplied a cart handler and a
`cartItemCount` greater than zero, `SiteHeader` SHALL compose the cart control
with a design-system `StatusIndicator` (`type="count"`, `variant="brand"`)
displaying that count.

**Hidden when empty** - When `cartItemCount` is omitted, zero, or the cart
handler is absent, `SiteHeader` SHALL NOT show a count indicator.

**Through the slot** - Design-system `Nav` SHALL NOT accept or interpret a cart
count. `SiteHeader` SHALL pass the badged cart control through `Nav`'s
`cartSlot`.

**Accessible name** - The cart control's accessible name SHALL be the
supplied `copy.cart` label, followed by the count in parentheses while a count
indicator shows, such as `Cart (3)`. The indicator SHALL be hidden from
assistive technology.

**Supplied, not derived** - `SiteHeader` SHALL display the supplied
`cartItemCount` unchanged and SHALL NOT derive it from cart lines.

<!-- trace:scenario id=g10.shared-site-chrome.SC-szi rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-23 - Empty cart hides the count
**Serves:** Header controls - empty cart hides the count

- **GIVEN** `SiteHeader` with a cart handler, `copy.cart` of `Basket`, and
  `cartItemCount` of `0` (or omitted)
- **WHEN** the header renders
- **THEN** the cart control appears
- **AND** no count indicator appears on it
- **AND** the cart control's accessible name is `Basket`, with no count

<!-- trace:scenario id=g10.shared-site-chrome.SC-1ow rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-24 - One active line shows `1`
**Serves:** Header controls - one active line shows `1`

- **GIVEN** `SiteHeader` with a cart handler and `cartItemCount` of `1`
- **WHEN** the header renders
- **THEN** a brand count indicator on the cart control displays `1`
- **AND** the cart control's accessible name includes `1`
- **AND** the count indicator itself is hidden from assistive technology
- **AND** the badged control reaches `Nav` as its `cartSlot`, with no built-in
  cart control beside it
- **AND** `NavProps` takes no cart count

<!-- trace:scenario id=g10.shared-site-chrome.SC-xw7 rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-25 - Multi-item count matches the drawer title
**Serves:** Header controls - multi-item count matches the drawer title

- **GIVEN** `SiteHeader` with a cart handler, `copy.cart` of `Basket`, and
  `cartItemCount` of `3`
- **WHEN** the header renders
- **THEN** a brand count indicator on the cart control displays `3`
- **AND** the cart control's accessible name is `Basket (3)`
- **AND** `CartDrawerHeader` given the same count of `3` shows `3` in its
  title badge

<!-- trace:scenario id=g10.shared-site-chrome.SC-bc3 rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-26 - Large count is not truncated
**Serves:** Header controls - large count is not truncated

- **GIVEN** `SiteHeader` with a cart handler and `cartItemCount` of `123`
- **WHEN** the header renders
- **THEN** the count indicator displays `123` in full
- **AND** the cart control's accessible name includes `123`

<!-- trace:scenario id=g10.shared-site-chrome.SC-92l rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-41 - A count without a cart handler shows nothing
**Serves:** Header controls - a count without a cart handler shows nothing

- **GIVEN** `SiteHeader` with no cart handler and `cartItemCount` of `3`
- **WHEN** the header renders
- **THEN** no cart control appears, and no space is reserved for one
- **AND** no count indicator appears in the header
