## Feature set

- Account control
  - Session-aware entry: a primary Sign In button when signed out, the
    account icon when signed in
  - Account menu: signed in, the sign-in email with its small initial avatar
    above the items — Profile first wherever it is carried, then My Auctions
    and Sign Out on auction launch, or My Orders, My Auctions, Membership,
    and Sign Out once Store answers

## MODIFIED Requirements

### Requirement: Signed-in collectors open account destinations from the header menu

The account control of a signed-in collector opens a menu of destinations.

**The menu** - When the collector is signed in, activating the account
control SHALL open a menu that shows their sign-in email with its small
initial avatar above the items, falling back to the account label when no
email is available. The menu SHALL offer My Auctions and Sign Out. Where the
profile is carried, Profile SHALL join first. Once Store answers, the menu
SHALL also offer My Orders, between Profile and My Auctions where Profile is
offered, or otherwise before My Auctions, and Membership after My Auctions.
Until Store answers, the menu SHALL NOT offer My Orders or Membership.

**Each item** - Activating Profile, where it is offered, SHALL take them to
the profile. Activating My Orders, where it is offered, SHALL take them to
My Orders. Activating My Auctions SHALL take them to My Auctions. Activating
Membership, where it is offered, SHALL invoke Membership's handler and SHALL
NOT navigate to a membership address the site withholds. Activating Sign Out
SHALL start sign-out.

**Sign Out label** - The menu's sign-out item SHALL read "Sign Out".

**Not offered** - The menu SHALL NOT offer KYC until it is in scope for the
header.

**Profile sign-out** - Wherever the profile is carried, it SHALL continue to
offer sign-out as well.

#### Scenario: grade10-site-site-page-shell-SC-17 - Account menu lists auction-first destinations
**Serves:** grade10-site-site-page-shell-US-03 - the collector's account menu once Store answers

- **GIVEN** a signed-in collector, the profile is carried, and Store answers
- **WHEN** they activate the account control
- **THEN** the menu shows their sign-in email with its small initial avatar above the items
- **AND** the menu offers Profile, My Orders, My Auctions, Membership, and Sign Out, in that order
- **AND** the menu does not offer KYC

#### Scenario: grade10-site-site-page-shell-SC-18 - Sign out from the menu
**Serves:** grade10-site-site-page-shell-US-03 - Collector reaches account destinations from the header

- **GIVEN** a signed-in collector with the account menu open
- **WHEN** they activate Sign Out
- **THEN** sign-out starts
- **AND** the profile still offers sign-out when they are signed in

#### Scenario: grade10-site-site-page-shell-SC-27 - Account menu omits My Orders before Store answers
**Serves:** grade10-site-site-page-shell-US-03 - the collector's account menu before Store answers

- **GIVEN** a signed-in collector, the profile is carried, and Store does not yet answer
- **WHEN** they activate the account control
- **THEN** the menu shows their sign-in email with its small initial avatar above the items
- **AND** the menu offers Profile, My Auctions, and Sign Out, in that order
- **AND** the menu does not offer My Orders or Membership

#### Scenario: grade10-site-site-page-shell-SC-28 - Account menu omits Profile once Store answers
**Serves:** grade10-site-site-page-shell-US-03 - Collector reaches account destinations from the header

- **GIVEN** a signed-in collector, the profile is not carried, and Store answers
- **WHEN** they activate the account control
- **THEN** the menu offers My Orders, My Auctions, Membership, and Sign Out
- **AND** the menu does not offer Profile

#### Scenario: grade10-site-site-page-shell-SC-29 - Account menu omits Profile and My Orders before Store answers
**Serves:** grade10-site-site-page-shell-US-03 - Collector reaches account destinations from the header

- **GIVEN** a signed-in collector, the profile is not carried, and Store does not yet answer
- **WHEN** they activate the account control
- **THEN** the menu offers My Auctions and Sign Out
- **AND** the menu does not offer Profile, My Orders, or Membership

#### Scenario: grade10-site-site-page-shell-SC-30 - Account menu shows the sign-in email and avatar
**Serves:** grade10-site-site-page-shell-US-03 - identifying the signed-in collector at the top of the menu

- **GIVEN** a signed-in collector with a sign-in email
- **WHEN** they activate the account control
- **THEN** the menu shows their sign-in email with its small initial avatar above the items

#### Scenario: grade10-site-site-page-shell-SC-31 - Account menu falls back to the account label without a sign-in email
**Serves:** grade10-site-site-page-shell-US-03 - identifying the signed-in collector at the top of the menu

- **GIVEN** a signed-in collector whose sign-in email is not available
- **WHEN** they activate the account control
- **THEN** the menu shows the account label above the items in place of an email

#### Scenario: grade10-site-site-page-shell-SC-32 - Account menu offers Membership after My Auctions once Store answers
**Serves:** grade10-site-site-page-shell-US-03 - reaching Membership from the same menu once Store answers

- **GIVEN** a signed-in collector and Store answers
- **WHEN** they activate the account control
- **THEN** Membership appears after My Auctions and before Sign Out

#### Scenario: grade10-site-site-page-shell-SC-33 - Sign Out reads in Title Case
**Serves:** grade10-site-site-page-shell-US-03 - Collector reaches account destinations from the header

- **GIVEN** a signed-in collector with the account menu open
- **WHEN** they view the menu
- **THEN** the last item reads "Sign Out"

#### Scenario: grade10-site-site-page-shell-SC-34 - Activating Membership invokes its handler without a withheld route
**Serves:** grade10-site-site-page-shell-US-03 - reaching Membership from the same menu once Store answers

- **GIVEN** a signed-in collector, Store answers, and Membership is offered
- **WHEN** they activate Membership
- **THEN** the supplied Membership handler is invoked
- **AND** the browser does not navigate to a membership address the site withholds
