# grade10-site/site/page-shell Specification

## Purpose
What every page of the grade10 site is wrapped in: the header a collector
navigates from, the region a surface renders into, and the footer that closes
the page. One shell for the marketing page, the store, the auction, the
account page, sign-in, and not-found, so no surface can ship without the site
around it.

## Feature set

- Account control
  - Account menu: signed in, the sign-in email with its initial avatar above
    My Auctions and Sign Out; My Orders joins ahead of My Auctions once Store
    answers; Sign Out stays last; KYC, My Auction Orders and any item whose
    page the site withholds stay out
  - Account page sign-out: the account page offers Sign Out wherever it is
    carried

## MODIFIED Requirements

### Requirement: The account control leads where the collector can go

The site SHALL show an account entry in the header at all times once the
session has resolved. When the collector is signed out, it SHALL be a primary
Sign In button that leads to sign-in. When the collector is signed in, it SHALL
be the account icon that opens the account menu.

Signing out SHALL be offered from the account menu, and on the account page
wherever the site carries it.

<!-- trace:scenario id=g10.site-page-shell.SC-m3w rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-06 - Signed in
**Serves:** grade10-site-site-page-shell-US-03 - Collector reaches account destinations from the header

- **GIVEN** a signed-in collector
- **WHEN** they activate the account control
- **THEN** the account menu opens

<!-- trace:scenario id=g10.site-page-shell.SC-0ao rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-07 - Signed out
**Serves:** grade10-site-site-page-shell-US-03 - Collector reaches account destinations from the header

- **GIVEN** a collector who is not signed in
- **WHEN** they activate Sign In
- **THEN** they arrive at sign-in

<!-- trace:scenario id=g10.site-page-shell.SC-e9z rev=2 -->
#### Scenario: grade10-site-site-page-shell-SC-08 - Sign-out has one home
**Serves:** grade10-site-site-page-shell-US-03 - Collector reaches account destinations from the header

- **GIVEN** a signed-in collector on a build that carries the account page
- **WHEN** they open the account menu, and then the account page
- **THEN** the account menu offers Sign Out
- **AND** the account page offers Sign Out

### Requirement: The header marks the surface being viewed

The site SHALL mark the navigation item matching the current surface, and
SHALL mark none when the current address belongs to no navigation item.

<!-- trace:scenario id=g10.site-page-shell.SC-q3w rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-13 - A collector is on a listed surface
**Serves:** grade10-site-site-page-shell-US-05 - Collector locates the current surface in the navigation

- **GIVEN** a collector on a surface the navigation lists, or on any address beneath it
- **WHEN** the header renders
- **THEN** that navigation item is marked as the current page

<!-- trace:scenario id=g10.site-page-shell.SC-xiu rev=2 -->
#### Scenario: grade10-site-site-page-shell-SC-14 - A collector is on an unlisted surface
**Serves:** grade10-site-site-page-shell-US-05 - Collector locates the current surface in the navigation

- **GIVEN** a collector on the account page, sign-in, or an unrecognized address
- **WHEN** the header renders
- **THEN** no navigation item is marked as the current page

## REMOVED Requirements

### Requirement: Signed-in collectors open account destinations from the header menu

**Reason:** It required Membership once Store answers and Profile wherever the
account page is carried, which Page Shell holds open (Q5, Q1), stated
account-page sign-out a second time, and required a label fallback the site
never shows: a signed-in collector always has an email.

**Migration:** Replaced by "Signed-in collectors open what the build carries
from the account menu", whose scenarios carry every settled outcome under new
numbers; a carried scenario keeps its trace marker. Membership's place in the menu waits on Q5, account-page sign-out stays
with the account control requirement, and the label fallback is `SiteHeader`'s
alone, in `shared/ui/site-chrome`.

## ADDED Requirements

### Requirement: Signed-in collectors open what the build carries from the account menu

The account control of a signed-in collector opens a menu of destinations.

**The menu** - When the collector is signed in, activating the account
control SHALL open a menu that shows the small initial avatar of their
sign-in email, then the email, above the items. The menu SHALL offer My
Auctions and Sign Out, with Sign Out last. Once Store answers, the menu SHALL
also offer My Orders, immediately before My Auctions.

**Withheld pages** - The menu SHALL NOT offer an item whose page the site
withholds: My Orders until Store answers, Profile where the account page is
withheld, and Membership where the membership page is withheld.

**Each item** - Activating My Orders SHALL take them to My Orders at
`/profile/orders`. Activating My Auctions SHALL take them to My Auctions.
Activating Sign Out SHALL start sign-out.

**Sign Out label** - The menu's sign-out item SHALL read "Sign Out".

**Not offered** - The menu SHALL NOT offer KYC or My Auction Orders.

<!-- trace:scenario id=g10.site-page-shell.SC-y2l rev=2 -->
#### Scenario: grade10-site-site-page-shell-SC-56 - Account menu once Store answers
**Serves:** grade10-site-site-page-shell-US-03 - the collector's account menu once Store answers

- **GIVEN** a signed-in collector and Store answers
- **WHEN** they activate the account control
- **THEN** My Orders comes immediately before My Auctions
- **AND** Sign Out is the last item
- **AND** the menu does not offer KYC or My Auction Orders

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

<!-- trace:scenario id=g10.site-page-shell.SC-agf rev=2 -->
#### Scenario: grade10-site-site-page-shell-SC-59 - Account menu omits Profile where the account page is withheld
**Serves:** grade10-site-site-page-shell-US-03 - the collector's account menu on a build without the account page

- **GIVEN** a signed-in collector, Store answers, and the site withholds the account page
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

<!-- trace:scenario id=g10.site-page-shell.SC-3y1 rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-61 - Account menu shows the sign-in email and avatar
**Serves:** grade10-site-site-page-shell-US-03 - identifying the signed-in collector at the top of the menu

- **GIVEN** a signed-in collector
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
- **THEN** they arrive at My Orders at `/profile/orders`

<!-- trace:scenario id=g10.site-page-shell.SC-lcs rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-65 - My Auctions opens My Auctions
**Serves:** grade10-site-site-page-shell-US-03 - reaching My Auctions from the header

- **GIVEN** a signed-in collector with the account menu open
- **WHEN** they activate My Auctions
- **THEN** they arrive at My Auctions
