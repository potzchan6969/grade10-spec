# grade10-site/site/page-shell Specification

## Feature set

- Account control
  - Account menu: signed in, the sign-in email with its avatar - the profile
    image, else the email's initial - above My Auctions and Sign Out; Profile
    joins first wherever the account page is carried, Membership right after
    it wherever the membership page is carried, and My Orders ahead of My
    Auctions once Store answers; Sign Out stays last; KYC and any item whose
    page the site withholds stay out

## MODIFIED Requirements

### Requirement: Signed-in collectors open what the build carries from the account menu

The account control of a signed-in collector opens a menu of destinations.

**The menu** - When the collector is signed in, activating the account
control SHALL open a menu that shows the small avatar of the collector, then
their sign-in email, above the items. Wherever the site carries the account
page, the avatar SHALL show the image the collector chose on their profile;
it SHALL show the initial of their sign-in email where they have chosen none
or the image fails to load. The menu SHALL offer My
Auctions and Sign Out, with Sign Out last. Once Store answers, the menu SHALL
also offer My Orders, immediately before My Auctions. Wherever the site
carries the account page, the menu SHALL also offer Profile, as its first
item. Wherever the site carries the membership page, the menu SHALL also
offer Membership, immediately after Profile and ahead of My Orders, and as
its first item where the account page is withheld. The items therefore read
Profile, Membership, My Orders, My Auctions, Sign Out, each item the menu does
not offer leaving the others in that order.

**Membership follows the build** - Whether the site carries the membership
page SHALL alone decide whether the menu offers Membership: the menu SHALL
offer it whatever the loyalty programme answers, an unanswered or failed read
included.

**Withheld pages** - The menu SHALL NOT offer an item whose page the site
withholds: My Orders until Store answers, Profile where the account page is
withheld, and Membership where the membership page is withheld.

**Each item** - Activating Profile SHALL take them to the account page.
Activating Membership SHALL take them to the membership page at
`/membership`. Activating My Orders SHALL take them to My Orders at
`/store/my-orders`. Activating My Auctions SHALL take them to My Auctions.
Activating Sign Out SHALL start sign-out.

**Sign Out label** - The menu's sign-out item SHALL read "Sign Out".

**Membership label** - The menu's membership item SHALL read "Membership" in
English, 会员 in Simplified Chinese, and 會員 in Traditional Chinese.

**Not offered** - The menu SHALL NOT offer KYC.

<!-- trace:scenario id=g10.site-page-shell.SC-y2l rev=3 -->
#### Scenario: grade10-site-site-page-shell-SC-56 - Account menu once Store answers
**Serves:** grade10-site-site-page-shell-US-03 - the collector's account menu once Store answers

- **GIVEN** a signed-in collector and Store answers
- **WHEN** they activate the account control
- **THEN** My Orders comes immediately before My Auctions
- **AND** Sign Out is the last item
- **AND** the menu does not offer KYC

<!-- trace:scenario id=g10.site-page-shell.SC-04a rev=2 -->
#### Scenario: grade10-site-site-page-shell-SC-57 - Sign out from the menu
**Serves:** grade10-site-site-page-shell-US-03 - leaving the session from the header

- **GIVEN** a signed-in collector with the account menu open
- **WHEN** they activate Sign Out
- **THEN** sign-out starts

<!-- trace:scenario id=g10.site-page-shell.SC-u71 rev=2 -->
#### Scenario: grade10-site-site-page-shell-SC-58 - Account menu omits My Orders before Store answers
**Serves:** grade10-site-site-page-shell-US-03 - the collector's account menu before Store answers

- **GIVEN** a signed-in collector and Store does not yet answer
- **WHEN** they activate the account control
- **THEN** the menu offers My Auctions, and Sign Out as the last item
- **AND** the menu does not offer My Orders

<!-- trace:scenario id=g10.site-page-shell.SC-agf rev=3 -->
#### Scenario: grade10-site-site-page-shell-SC-59 - Account menu omits Profile where the account page is withheld
**Serves:** grade10-site-site-page-shell-US-03 - the collector's account menu on a build without the account page

- **GIVEN** a signed-in collector, Store answers, and the site withholds the
  account page and the membership page
- **WHEN** they activate the account control
- **THEN** the menu opens on My Orders
- **AND** the menu does not offer Profile

<!-- trace:scenario id=g10.site-page-shell.SC-n9c rev=2 -->
#### Scenario: grade10-site-site-page-shell-SC-60 - The auction-launch account menu
**Serves:** grade10-site-site-page-shell-US-03 - the collector's account menu on auction launch

- **GIVEN** a signed-in collector on a build that withholds Store, the account
  page and the membership page, as the auction launch does
- **WHEN** they activate the account control
- **THEN** the menu offers My Auctions and Sign Out, in that order, and no other item

<!-- trace:scenario id=g10.site-page-shell.SC-3y1 rev=2 -->
#### Scenario: grade10-site-site-page-shell-SC-61 - Account menu shows the sign-in email and avatar
**Serves:** grade10-site-site-page-shell-US-03 - identifying the signed-in collector at the top of the menu

- **GIVEN** a signed-in collector who has chosen no profile image
- **WHEN** they activate the account control
- **THEN** the menu shows the small initial avatar of their sign-in email, then the email, above the items

<!-- trace:scenario id=g10.site-page-shell.SC-m6b rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-62 - Sign Out reads in Title Case
**Serves:** grade10-site-site-page-shell-US-03 - leaving the session from the header

- **GIVEN** a signed-in collector with the account menu open
- **WHEN** they view the menu
- **THEN** the last item reads "Sign Out"

<!-- trace:scenario id=g10.site-page-shell.SC-th1 rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-63 - Account menu omits Membership where the membership page is withheld
**Serves:** grade10-site-site-page-shell-US-03 - the collector's account menu on a build without the membership page

- **GIVEN** a signed-in collector, Store answers, and the site withholds the membership page
- **WHEN** they activate the account control
- **THEN** the menu does not offer Membership

<!-- trace:scenario id=g10.site-page-shell.SC-70a rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-64 - My Orders opens order history
**Serves:** grade10-site-site-page-shell-US-03 - reaching order history from the header

- **GIVEN** a signed-in collector, Store answers, and the account menu is open
- **WHEN** they activate My Orders
- **THEN** they arrive at My Orders at `/store/my-orders`

<!-- trace:scenario id=g10.site-page-shell.SC-lcs rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-65 - My Auctions opens My Auctions
**Serves:** grade10-site-site-page-shell-US-03 - reaching My Auctions from the header

- **GIVEN** a signed-in collector with the account menu open
- **WHEN** they activate My Auctions
- **THEN** they arrive at My Auctions

<!-- trace:scenario id=g10.site-page-shell.SC-79q rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-66 - Account menu opens on Profile where the account page is carried
**Serves:** grade10-site-site-page-shell-US-03 - the collector's account menu on a build with the account page

- **GIVEN** a signed-in collector on a build that carries the account page
- **WHEN** they activate the account control
- **THEN** Profile is the first item

<!-- trace:scenario id=g10.site-page-shell.SC-o1v rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-67 - Profile opens the account page
**Serves:** grade10-site-site-page-shell-US-03 - reaching the account page from the header

- **GIVEN** a signed-in collector on a build that carries the account page, with the account menu open
- **WHEN** they activate Profile
- **THEN** they arrive at the account page

<!-- trace:scenario id=g10.site-page-shell.SC-saj rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-79 - Account menu shows the profile image
**Serves:** grade10-site-site-page-shell-US-03 - identifying the signed-in collector at the top of the menu

- **GIVEN** a signed-in collector who chose a profile image
- **WHEN** they activate the account control
- **THEN** the menu's avatar shows that image, then the email, above the items
- **AND** once they remove the image, the menu's avatar shows their email's initial

<!-- trace:scenario id=g10.site-page-shell.SC-90t rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-80 - Membership comes right after Profile where the membership page is carried
**Serves:** grade10-site-site-page-shell-US-03 - the collector's account menu on a build with the membership page

- **GIVEN** a signed-in collector, Store answers, and the site carries the
  account page and the membership page
- **WHEN** they activate the account control
- **THEN** the menu offers Profile, Membership, My Orders, My Auctions, and
  Sign Out, in that order

<!-- trace:scenario id=g10.site-page-shell.SC-vsh rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-81 - Membership opens the membership page
**Serves:** grade10-site-site-page-shell-US-03 - reaching the membership page from the header

- **GIVEN** a signed-in collector on a build that carries the membership page,
  with the account menu open
- **WHEN** they activate Membership
- **THEN** they arrive at the membership page at `/membership`

<!-- trace:scenario id=g10.site-page-shell.SC-gnd rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-82 - Account menu opens on Membership where only the account page is withheld
**Serves:** grade10-site-site-page-shell-US-03 - the collector's account menu on a build with the membership page and without the account page

- **GIVEN** a signed-in collector, and the site withholds the account page and
  carries the membership page
- **WHEN** they activate the account control
- **THEN** the menu opens on Membership
- **AND** the menu does not offer Profile

<!-- trace:scenario id=g10.site-page-shell.SC-ju2 rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-83 - Membership stays offered while the loyalty programme cannot answer
**Serves:** grade10-site-site-page-shell-US-03 - the collector's account menu while the programme is down

- **GIVEN** a signed-in collector on a build that carries the membership page,
  and the loyalty programme cannot answer
- **WHEN** they activate the account control
- **THEN** the menu offers Membership

<!-- trace:scenario id=g10.site-page-shell.SC-3sh rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-84 - Membership reads in the site's language
**Serves:** grade10-site-site-page-shell-US-03 - finding the membership page by its name in the collector's language

- **GIVEN** a signed-in collector on a build that carries the membership page
- **WHEN** they open the account menu in English, in Simplified Chinese, and in
  Traditional Chinese
- **THEN** the membership item reads "Membership", 会员, and 會員 respectively
