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
  - Handler-gated: search, account, and cart render only when a handler is supplied
  - No wishlist: the header does not offer a wishlist control
  - Auction-first account: Sign In when signed out; Profile, My Auctions, and Sign out when signed in
  - Compact menu: left drawer for navigation and utilities, with language in a nested drawer
  - Wide layout: primary navigation and language stay in the bar
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
presentation, and an optional account slot — SHALL remain its own prop.

`Nav` and `Footer` SHALL each be renderable on their own, in either order, and
neither SHALL require the other.

#### Scenario: shared-ui-site-chrome-SC-01 - An application imports the chrome
**Serves:** Chrome exports - an application imports the chrome

- **WHEN** an application imports each name above from the design system's public entry
- **THEN** every import resolves

#### Scenario: shared-ui-site-chrome-SC-02 - A page renders one without the other
**Serves:** Chrome exports - a page renders one without the other

- **WHEN** an application renders the header without the footer, or the footer
  without the header
- **THEN** it renders as specified, with no missing-context error

#### Scenario: shared-ui-site-chrome-SC-03 - The chrome's words arrive as one group
**Serves:** Chrome exports - the chrome's words arrive as one group

- **WHEN** an application supplies the chrome's words
- **THEN** it passes one object per component, typed by that component's copy type
- **AND** a word it omits is a type error rather than an empty region

### Requirement: A control renders only when it can act

`Nav` SHALL render its search, account, and cart controls only when the
application supplies a handler for that control, or — for account only —
supplies an `accountSlot`. A control with no handler and no account slot SHALL
be absent from the rendered header — not present and inert, and not visually
disabled.

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

#### Scenario: shared-ui-site-chrome-SC-04 - A storefront with no cart
**Serves:** Header controls - a storefront with no cart

- **GIVEN** an application that supplies no cart handler
- **WHEN** the header renders
- **THEN** no cart control appears in it, and no space is reserved for one

#### Scenario: shared-ui-site-chrome-SC-05 - Only the supplied controls appear
**Serves:** Header controls - only the supplied controls appear

- **GIVEN** an application that supplies a handler for the account control alone
- **WHEN** the header renders
- **THEN** the account control appears
- **AND** the search and cart controls do not

#### Scenario: shared-ui-site-chrome-SC-06 - Wishlist is not a header control
**Serves:** Header controls - wishlist is not a header control

- **WHEN** the header renders
- **THEN** no wishlist control appears, and no space is reserved for one

#### Scenario: shared-ui-site-chrome-SC-07 - The locale label without a handler
**Serves:** Header controls - the locale label without a handler

- **GIVEN** an application that supplies a locale label and no locale handler
- **WHEN** the header renders at the wide breakpoint
- **THEN** the label is displayed in the bar
- **AND** nothing about it invites a click

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

#### Scenario: shared-ui-site-chrome-SC-08 - No promo content
**Serves:** Footer - no promo content

- **WHEN** the header renders with no promo content
- **THEN** no promotional bar appears and the header is shorter by its height

#### Scenario: shared-ui-site-chrome-SC-09 - No utility links
**Serves:** Footer - no utility links

- **WHEN** the header renders with an empty set of utility links
- **THEN** no utility row appears, and no empty strip is left in its place

### Requirement: The header marks the current surface

`Nav` SHALL mark the navigation item the application identifies as current,
both visually and to assistive technology, and SHALL mark no item when the
application identifies none.

#### Scenario: shared-ui-site-chrome-SC-10 - A surface is current
**Serves:** Current surface - a surface is current

- **GIVEN** navigation items of which one is marked current
- **WHEN** the header renders
- **THEN** that item is distinguished from the others and is announced as the
  current page
- **AND** no other item is

#### Scenario: shared-ui-site-chrome-SC-11 - No surface is current
**Serves:** Current surface - no surface is current

- **WHEN** the header renders with no item marked current
- **THEN** no item is announced as the current page

### Requirement: The footer omits a section it has no content for

`Footer` SHALL display the supplied brand block, link columns, social links,
copyright, legal links, and locale, and SHALL omit any of the columns, social
links, or legal links the application supplies none of, rather than rendering
an empty heading or an empty row.

#### Scenario: shared-ui-site-chrome-SC-12 - Every section is supplied
**Serves:** Footer - every section is supplied

- **WHEN** the footer renders with a brand block, columns, social links,
  copyright, legal links, and a locale
- **THEN** all of them are displayed

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

#### Scenario: shared-ui-site-chrome-SC-27 - External link opens a new tab
**Serves:** External links - new-tab destinations

- **GIVEN** a primary or utility link marked `external`
- **WHEN** the header renders that link in the primary nav, utility strip, or
  the compact menu
- **THEN** the link carries `target="_blank"` and `rel="noopener noreferrer"`

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
session stores itself — the application supplies `session` as `"signed-out"` or
`"signed-in"`.

**Signed out** - When `session` is `"signed-out"`, `SiteHeader` SHALL render a
primary Sign In button (not the account icon) and SHALL invoke the supplied
sign-in handler when that button is activated.

**Signed in** - When `session` is `"signed-in"`, `SiteHeader` SHALL render the
account icon and SHALL open a menu of Profile, My Auctions, and Sign out. The
menu SHALL NOT include Orders or KYC. Activating each item SHALL invoke the
matching supplied handler.

**Cart and search** - Cart and search SHALL remain absent unless the
application supplies their handlers.

#### Scenario: shared-ui-site-chrome-SC-15 - An application imports SiteHeader
**Serves:** Chrome exports - an application imports SiteHeader

- **WHEN** an application imports `SiteHeader`, `SiteHeaderProps`,
  `SiteHeaderCopy`, and `SiteHeaderSession` from the shared UI package's public
  entry
- **THEN** every import resolves

#### Scenario: shared-ui-site-chrome-SC-16 - Signed out shows Sign In
**Serves:** Chrome exports - signed out shows Sign In

- **GIVEN** `session` is `"signed-out"` and Sign In copy is supplied
- **WHEN** `SiteHeader` renders
- **THEN** a primary Sign In button appears
- **AND** no account icon control appears

#### Scenario: shared-ui-site-chrome-SC-17 - Signed in shows the account menu
**Serves:** Chrome exports - signed in shows the account menu

- **GIVEN** `session` is `"signed-in"`
- **WHEN** the collector activates the account control
- **THEN** a menu offers Profile, My Auctions, and Sign out
- **AND** the menu does not offer Orders or KYC

#### Scenario: shared-ui-site-chrome-SC-18 - Auction-first chrome omits cart
**Serves:** Chrome exports - auction-first chrome omits cart

- **GIVEN** `SiteHeader` with no cart handler
- **WHEN** it renders
- **THEN** no cart control appears, and no space is reserved for one

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
handlers (or account slot) are supplied.

**Wide only** - The utility strip and the centered primary nav row SHALL appear
only at the wide breakpoint.

**Gutter** - Compact drawers SHALL leave a visible gutter beside the panel
rather than spanning the full viewport width.

**Copy** - `copy.menu` names the menu trigger; `copy.menuTitle` names the
drawer title; `copy.language` names the language nested drawer title.

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

#### Scenario: shared-ui-site-chrome-SC-21 - Wide viewport keeps the bar layout
**Serves:** Header controls - wide viewport keeps the bar layout

- **GIVEN** a viewport at the wide breakpoint
- **WHEN** the header renders
- **THEN** primary navigation and language appear in the bar
- **AND** the compact menu trigger is absent
