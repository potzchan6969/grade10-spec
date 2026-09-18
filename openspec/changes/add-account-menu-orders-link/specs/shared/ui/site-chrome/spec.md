## Feature set

- Header controls
  - Handler-gated: search, account, cart, and My Orders render only when a
    handler is supplied
  - No wishlist: the header does not offer a wishlist control
  - Account menu: Sign In when signed out; signed in, Profile, My Auctions,
    and Sign out, plus My Orders between Profile and My Auctions when its
    handler is supplied
  - Compact menu: left drawer for navigation and utilities, with language in
    a nested drawer
  - Wide layout: primary navigation and language stay in the bar

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
account icon and SHALL open a menu of Profile, My Auctions, and Sign out. The
menu SHALL NOT include KYC. Activating each item SHALL invoke the matching
supplied handler.

**Cart, search, and My Orders** - Cart, search, and My Orders SHALL remain
absent unless the application supplies their handlers. When the application
supplies a My Orders handler, My Orders SHALL join the menu between Profile
and My Auctions, and activating it SHALL invoke that handler.

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

- **GIVEN** `session` is `"signed-in"` and a My Orders handler is supplied
- **WHEN** the collector activates the account control
- **THEN** a menu offers Profile, My Orders, My Auctions, and Sign out
- **AND** the menu does not offer KYC

#### Scenario: shared-ui-site-chrome-SC-18 - Auction-first chrome omits cart
**Serves:** Chrome exports - auction-first chrome omits cart

- **GIVEN** `SiteHeader` with no cart handler
- **WHEN** it renders
- **THEN** no cart control appears, and no space is reserved for one

#### Scenario: shared-ui-site-chrome-SC-29 - Signed in with no My Orders handler
**Serves:** Chrome exports - signed in shows the account menu

- **GIVEN** `session` is `"signed-in"` and no My Orders handler is supplied
- **WHEN** the collector activates the account control
- **THEN** the menu offers Profile, My Auctions, and Sign out
- **AND** the menu does not offer My Orders
