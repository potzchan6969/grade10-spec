## Feature set

- Account control
  - Session-aware entry: a primary Sign In button when signed out, the
    account icon when signed in
  - Account menu: signed in, the icon opens Profile, My Orders, My Auctions,
    and Sign out; the profile also offers Sign out

## MODIFIED Requirements

### Requirement: Signed-in collectors open account destinations from the header menu

The account control of a signed-in collector opens a menu of four
destinations.

**The menu** - When the collector is signed in, activating the account control
SHALL open a menu of Profile, My Orders, My Auctions, and Sign out.

**Each item** - Activating Profile SHALL take them to the profile. Activating
My Orders SHALL take them to My Orders. Activating My Auctions SHALL take them
to My Auctions. Activating Sign out SHALL start sign-out.

**Not offered** - The menu SHALL NOT offer KYC until it is in scope for the
header.

**Profile sign-out** - The profile SHALL continue to offer sign-out as well.

#### Scenario: grade10-site-site-page-shell-SC-17 - Account menu lists auction-first destinations
**Serves:** grade10-site-site-page-shell-US-03 - Collector reaches account destinations from the header

- **GIVEN** a signed-in collector
- **WHEN** they activate the account control
- **THEN** the menu offers Profile, My Orders, My Auctions, and Sign out
- **AND** the menu does not offer KYC

#### Scenario: grade10-site-site-page-shell-SC-18 - Sign out from the menu
**Serves:** grade10-site-site-page-shell-US-03 - Collector reaches account destinations from the header

- **GIVEN** a signed-in collector with the account menu open
- **WHEN** they activate Sign out
- **THEN** sign-out starts
- **AND** the profile still offers sign-out when they are signed in
