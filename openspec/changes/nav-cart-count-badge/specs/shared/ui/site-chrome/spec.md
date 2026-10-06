# shared/ui/site-chrome Specification

## Feature set

- Header controls
  - Cart slot: a `cartSlot` on `Nav` replaces the built-in cart control and
    shows even with no cart handler
  - Cart count: `SiteHeader` shows a round brand indicator on the cart icon for the supplied active-line count; hidden when empty or omitted

## MODIFIED Requirements

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

<!-- trace:scenario id=g10.shared-site-chrome.SC-5a2 rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-04 - A storefront with no cart
**Serves:** Header controls - a storefront with no cart

- **GIVEN** an application that supplies no cart handler
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

## ADDED Requirements

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

- **GIVEN** `Nav` with a `cartSlot` and an `onCartClick` handler
- **WHEN** the header renders
- **THEN** the slot content appears in the cart control position
- **AND** the built-in cart icon button is not rendered
- **AND** activating the slot content does not call `onCartClick`

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

- **GIVEN** `SiteHeader` with a cart handler and `cartItemCount` of `0` (or omitted)
- **WHEN** the header renders
- **THEN** the cart control appears
- **AND** no count indicator appears on it
- **AND** the cart control's accessible name carries no count

<!-- trace:scenario id=g10.shared-site-chrome.SC-1ow rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-24 - One active line shows `1`
**Serves:** Header controls - one active line shows `1`

- **GIVEN** `SiteHeader` with a cart handler and `cartItemCount` of `1`
- **WHEN** the header renders
- **THEN** a brand count indicator on the cart control displays `1`
- **AND** the cart control's accessible name includes `1`
- **AND** the count indicator itself is hidden from assistive technology

<!-- trace:scenario id=g10.shared-site-chrome.SC-xw7 rev=1 -->
#### Scenario: shared-ui-site-chrome-SC-25 - Multi-item count matches the drawer title
**Serves:** Header controls - multi-item count matches the drawer title

- **GIVEN** `SiteHeader` with a cart handler and `cartItemCount` of `3`
- **WHEN** the header renders
- **THEN** a brand count indicator on the cart control displays `3`
- **AND** the cart control's accessible name includes `3`
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
