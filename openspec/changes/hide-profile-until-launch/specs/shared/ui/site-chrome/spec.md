## Feature set

- Chrome exports
  - Header and footer: `Nav` and `Footer` from the design-system entry, each usable alone
  - `SiteHeader`: shared header composition with application-supplied content and session
  - Public types: `SiteHeaderProps`, `SiteHeaderCopy`, and `SiteHeaderSession`
- Header controls
  - Handler-gated: search, account, cart, Profile, and My Orders render only
    when a handler is supplied
  - No wishlist: the header does not offer a wishlist control
  - Account menu: Sign In when signed out; signed in, My Auctions and Sign
    out, plus Profile first when its handler is supplied and My Orders
    between Profile and My Auctions when its handler is supplied
  - Compact menu: left drawer for navigation and utilities, with language in
    a nested drawer
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

## MODIFIED Requirements

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
account icon and SHALL open a menu of My Auctions and Sign out. The menu
SHALL NOT include KYC. Activating each item SHALL invoke the matching
supplied handler.

**Cart, search, Profile, and My Orders** - Cart, search, Profile, and My
Orders SHALL remain absent unless the application supplies their handlers.
The account menu's items SHALL follow the fixed order Profile, My Orders,
My Auctions, Sign out, omitting Profile or My Orders wherever no matching
handler is supplied and opening directly on whichever item is next.
Activating Profile or My Orders SHALL invoke its matching handler.

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

- **GIVEN** `session` is `"signed-in"`, an `onProfile` handler is supplied, and
  a My Orders handler is supplied
- **WHEN** the collector activates the account control
- **THEN** a menu offers Profile, My Orders, My Auctions, and Sign out, with
  Profile first and ahead of My Orders
- **AND** the menu does not offer KYC

#### Scenario: shared-ui-site-chrome-SC-18 - Auction-first chrome omits cart
**Serves:** Chrome exports - auction-first chrome omits cart

- **GIVEN** `SiteHeader` with no cart handler
- **WHEN** it renders
- **THEN** no cart control appears, and no space is reserved for one

#### Scenario: shared-ui-site-chrome-SC-29 - Signed in with no My Orders handler
**Serves:** Chrome exports - signed in shows the account menu

- **GIVEN** `session` is `"signed-in"`, an `onProfile` handler is supplied, and
  no My Orders handler is supplied
- **WHEN** the collector activates the account control
- **THEN** the menu offers Profile, My Auctions, and Sign out
- **AND** the menu does not offer My Orders

#### Scenario: shared-ui-site-chrome-SC-30 - Signed in with no Profile handler
**Serves:** Header controls - the account menu opens directly on My Orders when Profile has no handler

- **GIVEN** `session` is `"signed-in"`, no `onProfile` handler is supplied, and
  a My Orders handler is supplied
- **WHEN** the collector activates the account control
- **THEN** the menu offers My Orders, My Auctions, and Sign out, opening
  directly on My Orders
- **AND** the menu does not offer Profile

#### Scenario: shared-ui-site-chrome-SC-31 - Signed in with neither Profile nor My Orders handler
**Serves:** Header controls - the account menu opens directly on My Auctions when neither Profile nor My Orders has a handler

- **GIVEN** `session` is `"signed-in"`, no `onProfile` handler is supplied, and
  no My Orders handler is supplied
- **WHEN** the collector activates the account control
- **THEN** the menu offers only My Auctions and Sign out, opening directly on
  My Auctions
- **AND** the menu does not offer Profile or My Orders

#### Scenario: shared-ui-site-chrome-SC-32 - Activating Profile invokes its handler
**Serves:** Header controls - the account menu's Profile item takes the collector to the supplied destination

- **GIVEN** `session` is `"signed-in"` and an `onProfile` handler is supplied
- **WHEN** the collector activates Profile in the account menu
- **THEN** the supplied `onProfile` handler is invoked
- **AND** no other account-menu handler is invoked

#### Scenario: shared-ui-site-chrome-SC-33 - Signed out ignores the Profile and My Orders handlers
**Serves:** Chrome exports - signed out shows Sign In

- **GIVEN** `session` is `"signed-out"`, an `onProfile` handler is supplied, and a My Orders handler is supplied
- **WHEN** `SiteHeader` renders
- **THEN** a primary Sign In button appears
- **AND** no account icon, Profile item, or My Orders item appears
