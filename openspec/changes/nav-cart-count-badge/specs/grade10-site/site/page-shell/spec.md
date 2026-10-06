# grade10-site/site/page-shell Specification

## Feature set

- Members-only cart
  - Active-line count: header and drawer agree without opening the drawer; unknown and signed-out counts stay hidden

## MODIFIED Requirements

### Requirement: The chrome does not wait for the session

The site SHALL render the header and the footer before the session has
resolved. The account entry's presentation and destination SHALL depend on the
session: signed out shows a primary Sign In button; signed in shows the account
icon that opens the account menu. What the Cart control opens and whether its
count badge appears SHALL depend on the session too, and nothing else in the
chrome SHALL. No chrome control SHALL appear, disappear, or move when the
session arrives. The cart count badge SHALL NOT change the presence or
position of the Cart control.

<!-- trace:scenario id=g10.site-page-shell.SC-9ud rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-04 - A first paint while the session resolves
**Serves:** grade10-site-site-page-shell-US-02 - Collector sees the chrome before the session resolves

- **WHEN** a collector opens the site and the session has not yet resolved
- **THEN** the header and the footer are already rendered
- **AND** the content region shows that the surface is loading

<!-- trace:scenario id=g10.site-page-shell.SC-yxt rev=2 -->
#### Scenario: grade10-site-site-page-shell-SC-05 - No layout shift when the session arrives
**Serves:** grade10-site-site-page-shell-US-02 - Collector sees the chrome before the session resolves

- **GIVEN** a page rendered while the session was resolving
- **WHEN** the session resolves
- **THEN** the account entry matches the session (Sign In when signed out,
  account icon when signed in)
- **AND** no other chrome control appears, disappears, or moves
- **AND** a cart count badge that later appears for a signed-in member leaves
  the Cart control where it was

## ADDED Requirements

### Requirement: The header shows the member cart's reviewed active-line count

On every surface whose header offers Cart, the site SHALL supply the header
and drawer title with the same active-line count from the current member's
reviewed basket. Each distinct active line SHALL count once, irrespective of
quantity. Active lines include `default` and `adjusted` lines and exclude
`soldOut` and `unavailable` lines. Checkout eligibility alone SHALL NOT
determine the count.

The header SHALL show the full positive count in wide and compact layouts.
It SHALL show no count badge when the reviewed basket has no active lines.
The count SHALL NOT introduce a Cart control on a surface that omits it.

<!-- trace:scenario id=g10.site-page-shell.SC-6jx rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-42 - Active lines count once
**Serves:** grade10-site-site-page-shell-US-08 - Collector sees the cart count without opening the drawer

- **GIVEN** a signed-in collector on a surface whose header offers Cart
- **AND** their reviewed basket has a `default` line with quantity `3`, an
  `adjusted` line with quantity `2`, a `soldOut` line, and an `unavailable` line
- **WHEN** the header displays the reviewed count
- **THEN** the header badge displays `2`
- **AND** the drawer title displays `2` when showing that same reviewed basket

<!-- trace:scenario id=g10.site-page-shell.SC-awn rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-43 - No active lines means no badge
**Serves:** grade10-site-site-page-shell-US-08 - Collector sees the cart count without opening the drawer

- **GIVEN** a signed-in collector on a surface whose header offers Cart
- **WHEN** their basket review succeeds with an empty basket or only sold-out
  and unavailable lines
- **THEN** the header has no count badge
- **AND** the Cart control remains available

<!-- trace:scenario id=g10.site-page-shell.SC-8v4 rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-44 - The full count survives a compact header
**Serves:** grade10-site-site-page-shell-US-08 - Collector sees the cart count without opening the drawer

- **GIVEN** a signed-in collector whose reviewed basket has `50` active lines
- **WHEN** a surface whose header offers Cart renders at a wide viewport or
  at `375` CSS pixels wide
- **THEN** its Cart badge displays `50`, without truncation
- **AND** the Cart control remains reachable without horizontal overflow

<!-- trace:scenario id=g10.site-page-shell.SC-e9p rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-45 - A count does not add an unanswered Cart control
**Serves:** grade10-site-site-page-shell-US-08 - Collector sees the cart count without opening the drawer

- **GIVEN** an auction-first build, whose header offers no Cart because Store
  does not answer the cart drawer
- **WHEN** a signed-in member whose cart holds active lines opens any surface
- **THEN** the header displays neither a Cart control nor its count badge

<!-- trace:scenario id=g10.site-page-shell.SC-rae rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-55 - The count follows the collector to another surface
**Serves:** grade10-site-site-page-shell-US-08 - Collector sees the cart count without opening the drawer

- **GIVEN** a signed-in collector whose Store header shows `2` active lines
- **WHEN** they move to Auction, whose header offers Cart once Store answers
- **THEN** the Auction header's Cart badge displays `2`
- **AND** showing it needs neither a new review nor opening the drawer

### Requirement: The cart count refreshes without opening the drawer

The site SHALL review the member's basket on cart hydration and after settled
cart mutations, with the drawer open or closed, and when the drawer opens and
on retry after a failed review. Once review succeeds, the header SHALL reflect
that reviewed basket without requiring the collector to open the drawer.

Before the member has a verified count, pending hydration or review SHALL
show no badge. During a later review for the same member, the header SHALL
retain that member's last verified count until the review completes, including
when the refresh follows a failed cart update. A failed review SHALL hide the
badge; a successful review SHALL replace it with the newly verified count.
The header SHALL NOT show a badge skeleton or invent a count from unreviewed lines.

The site SHALL NOT poll for, or subscribe to, cart changes made elsewhere.
A change made on another device SHALL appear after the next review.

<!-- trace:scenario id=g10.site-page-shell.SC-r0e rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-46 - Hydration supplies the count with the drawer closed
**Serves:** grade10-site-site-page-shell-US-08 - Collector sees the cart count without opening the drawer

- **GIVEN** a signed-in collector whose cart has not finished hydration
- **AND** the cart drawer stays closed
- **WHEN** hydration and basket review complete with `2` active lines
- **THEN** the header badge displays `2` without opening the drawer

<!-- trace:scenario id=g10.site-page-shell.SC-7el rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-47 - Settled mutations refresh the closed drawer's count
**Serves:** grade10-site-site-page-shell-US-08 - Collector sees the cart count without opening the drawer

- **GIVEN** a signed-in collector with `2` reviewed active lines
- **AND** the cart drawer is closed
- **WHEN** a cart mutation settles and the resulting basket is reviewed
- **THEN** adding a distinct active line changes the header count to `3`
- **AND** removing one of the original active lines instead changes it to `1`
- **AND** changing only an active line's quantity instead keeps it at `2`
- **AND** none of these outcomes requires opening the drawer

<!-- trace:scenario id=g10.site-page-shell.SC-mzr rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-48 - An unknown count has no badge
**Serves:** grade10-site-site-page-shell-US-08 - Collector sees the cart count without opening the drawer

- **GIVEN** a surface whose header offers Cart
- **WHEN** the current member has no verified count and cart hydration or
  basket review is pending
- **THEN** the header displays no count badge or badge skeleton
- **AND** the Cart control remains available in the same position

<!-- trace:scenario id=g10.site-page-shell.SC-79p rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-49 - Failed review clears the count until review succeeds
**Serves:** grade10-site-site-page-shell-US-08 - Collector sees the cart count without opening the drawer

- **GIVEN** a signed-in collector whose header showed `2` active lines
- **WHEN** review of their current basket fails
- **THEN** the header displays no count badge
- **AND** a later review, on opening the drawer or on retry, that succeeds
  with `1` active line restores a badge displaying `1`
- **AND** the Cart control stays available throughout

<!-- trace:scenario id=g10.site-page-shell.SC-k7b rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-53 - Same-member refresh retains the verified count
**Serves:** grade10-site-site-page-shell-US-08 - Collector sees the cart count without opening the drawer

- **GIVEN** the current member's header shows a verified count of `2`
- **WHEN** another review starts, including after a failed cart update
- **THEN** the badge keeps showing `2` while that review is pending
- **AND** a successful review replaces it with the resulting active-line count
- **AND** a failed review hides the badge instead
- **AND** switching members or signing out still clears the count immediately

<!-- trace:scenario id=g10.site-page-shell.SC-o8b rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-54 - A change from another device shows after the next review
**Serves:** grade10-site-site-page-shell-US-08 - Collector sees the cart count without opening the drawer

- **GIVEN** a signed-in collector whose header shows `2` active lines
- **AND** the same member adds a distinct line from another device
- **WHEN** no review of the basket runs on this device
- **THEN** the header keeps showing `2`
- **AND** opening the drawer reviews the basket, and the header and the drawer
  title both display `3`

### Requirement: The cart count belongs only to the current member

The site SHALL omit the count while the session is unresolved or signed out.
When session ownership changes, it SHALL clear the previous member's count
immediately and await the current member's reviewed basket. A late response
for a previous session SHALL NOT restore or replace the current count.

<!-- trace:scenario id=g10.site-page-shell.SC-b9m rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-50 - Signed-out and unresolved sessions have no count
**Serves:** grade10-site-site-page-shell-US-08 - Collector sees the cart count without opening the drawer

- **GIVEN** a surface whose header offers Cart
- **WHEN** its session is unresolved or signed out
- **THEN** the header displays no count badge
- **AND** the Cart control remains available under its existing sign-in rule

<!-- trace:scenario id=g10.site-page-shell.SC-z8c rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-51 - Signing out clears the previous member's count
**Serves:** grade10-site-site-page-shell-US-08 - Collector sees the cart count without opening the drawer

- **GIVEN** a signed-in member whose header displays `2` active lines
- **WHEN** they sign out
- **THEN** the badge disappears immediately
- **AND** a late basket response from that signed-in session cannot restore it

<!-- trace:scenario id=g10.site-page-shell.SC-kfr rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-52 - Another member never inherits a count
**Serves:** grade10-site-site-page-shell-US-08 - Collector sees the cart count without opening the drawer

- **GIVEN** member A's header showed `2` active lines and their review is pending
- **WHEN** session ownership changes to member B
- **THEN** the header omits the badge until member B's own basket is reviewed
- **AND** a successful review of B's basket with `1` active line displays `1`
- **AND** a late response from A cannot replace B's count before or after that review
