## Feature set

- Header controls
  - Handler-gated: search, account, cart, Profile, My Orders, and Membership
    render only when a handler is supplied
  - No wishlist: the header does not offer a wishlist control
  - Account menu: signed in, the sign-in email with its small initial avatar
    above the items; Profile joins first, ahead of My Orders, when its
    handler is supplied; My Orders joins ahead of My Auctions when its
    handler is supplied, Membership joins after My Auctions when its handler
    is supplied, Sign Out is always last and reads "Sign Out"
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
account icon and SHALL open a menu that shows `accountEmail` with a small
(`xs`) initial avatar above the items, falling back to `copy.accountMenuLabel`
when `accountEmail` is not supplied, followed at minimum by My Auctions and
Sign Out. The menu SHALL NOT include KYC. Activating each item SHALL invoke
the matching supplied handler.

**Sign Out label** - The account menu's sign-out item SHALL read "Sign Out".

**Profile, Cart, search, My Orders, and Membership** - Profile, Cart, search,
My Orders, and Membership SHALL remain absent unless the application
supplies their handlers; Membership additionally requires `copy.membership`.
The account menu's items SHALL follow the fixed order Profile, My Orders, My
Auctions, Membership, Sign Out, each of Profile, My Orders, and Membership
omitted independently wherever its own handler (and, for Membership, its
copy) is not supplied, opening directly on whichever item is next. Activating
Profile SHALL invoke its matching handler. Activating My Orders SHALL invoke
its matching handler. Activating Membership SHALL invoke the supplied
`onMembership` handler and SHALL NOT navigate to a membership address the
site withholds.

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
**Serves:** grade10-site/site/page-shell#grade10-site-site-page-shell-US-03 - the collector's account menu once the application's Store answers

- **GIVEN** `session` is `"signed-in"`, `accountEmail` is supplied, an
  `onProfile` handler is supplied, a My Orders handler is supplied, and
  `onMembership` with `copy.membership` are supplied
- **WHEN** the collector activates the account control
- **THEN** the menu shows `accountEmail` with its `xs` avatar above the items
- **AND** the menu offers Profile, My Orders, My Auctions, Membership, and
  Sign Out, in that order, with Profile first
- **AND** the menu does not offer KYC

#### Scenario: shared-ui-site-chrome-SC-18 - Auction-first chrome omits cart
**Serves:** Chrome exports - auction-first chrome omits cart

- **GIVEN** `SiteHeader` with no cart handler
- **WHEN** it renders
- **THEN** no cart control appears, and no space is reserved for one

#### Scenario: shared-ui-site-chrome-SC-29 - Signed in with no My Orders handler
**Serves:** grade10-site/site/page-shell#grade10-site-site-page-shell-US-03 - the collector's account menu before the application's Store answers

- **GIVEN** `session` is `"signed-in"`, an `onProfile` handler is supplied,
  and no My Orders handler is supplied
- **WHEN** the collector activates the account control
- **THEN** the menu offers Profile, My Auctions, and Sign Out
- **AND** the menu does not offer My Orders

#### Scenario: shared-ui-site-chrome-SC-30 - Signed in with no Profile handler
**Serves:** Header controls - the account menu opens directly on My Orders when Profile has no handler

- **GIVEN** `session` is `"signed-in"`, no `onProfile` handler is supplied, and
  a My Orders handler is supplied
- **WHEN** the collector activates the account control
- **THEN** the menu offers My Orders, My Auctions, and Sign Out, opening
  directly on My Orders
- **AND** the menu does not offer Profile

#### Scenario: shared-ui-site-chrome-SC-31 - Signed in with neither Profile nor My Orders handler
**Serves:** Header controls - the account menu opens directly on My Auctions when neither Profile nor My Orders has a handler

- **GIVEN** `session` is `"signed-in"`, no `onProfile` handler is supplied, and
  no My Orders handler is supplied
- **WHEN** the collector activates the account control
- **THEN** the menu offers only My Auctions and Sign Out, opening directly on
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

- **GIVEN** `session` is `"signed-out"`, an `onProfile` handler is supplied,
  a My Orders handler is supplied, and `onMembership` with `copy.membership`
  are supplied
- **WHEN** `SiteHeader` renders
- **THEN** a primary Sign In button appears
- **AND** no account icon, Profile item, My Orders item, or Membership item
  appears

#### Scenario: shared-ui-site-chrome-SC-34 - Account menu shows accountEmail with its avatar
**Serves:** grade10-site/site/page-shell#grade10-site-site-page-shell-US-03 - identifying the signed-in collector at the top of the menu

- **GIVEN** `session` is `"signed-in"` and `accountEmail` is supplied
- **WHEN** the collector activates the account control
- **THEN** the menu shows `accountEmail` with a small (`xs`) initial avatar
  above the items

#### Scenario: shared-ui-site-chrome-SC-35 - Account menu falls back to copy.accountMenuLabel without accountEmail
**Serves:** Header controls - the menu falls back to the supplied label when no email is available

- **GIVEN** `session` is `"signed-in"`, `accountEmail` is not supplied, and
  `copy.accountMenuLabel` is supplied
- **WHEN** the collector activates the account control
- **THEN** the menu shows `copy.accountMenuLabel` above the items in place of
  an email

#### Scenario: shared-ui-site-chrome-SC-36 - Membership requires both its handler and its copy
**Serves:** Header controls - the account menu never opens a dead Membership control

- **GIVEN** `session` is `"signed-in"`, `onMembership` is supplied, and
  `copy.membership` is not supplied
- **WHEN** the collector activates the account control
- **THEN** the menu does not offer Membership

#### Scenario: shared-ui-site-chrome-SC-37 - Sign Out reads in Title Case
**Serves:** Header controls - the account menu's Sign Out label matches product direction

- **GIVEN** `session` is `"signed-in"`
- **WHEN** the collector activates the account control
- **THEN** the last item reads "Sign Out"

#### Scenario: shared-ui-site-chrome-SC-38 - Membership joins after My Auctions without a My Orders handler
**Serves:** Header controls - Membership's position holds independently of My Orders' own gating

- **GIVEN** `session` is `"signed-in"`, `onMembership` and `copy.membership`
  are supplied, and no My Orders handler is supplied
- **WHEN** the collector activates the account control
- **THEN** the menu offers My Auctions, Membership, and Sign Out, in that
  order
- **AND** the menu does not offer My Orders

#### Scenario: shared-ui-site-chrome-SC-39 - Activating Membership invokes its handler
**Serves:** Header controls - the account menu's Membership item invokes the supplied handler

- **GIVEN** `session` is `"signed-in"`, `onMembership` is supplied, and
  `copy.membership` is supplied
- **WHEN** the collector activates Membership in the account menu
- **THEN** the supplied `onMembership` handler is invoked
- **AND** no other account-menu handler is invoked
- **AND** the browser does not navigate to a membership address the site
  withholds

#### Scenario: shared-ui-site-chrome-SC-40 - Signed in with a My Orders handler but no Membership handler
**Serves:** Header controls - the account menu omits Membership until its own handler is supplied

- **GIVEN** `session` is `"signed-in"`, a My Orders handler is supplied, and
  no `onMembership` handler is supplied
- **WHEN** the collector activates the account control
- **THEN** the menu offers My Orders, My Auctions, and Sign Out
- **AND** the menu does not offer Membership
