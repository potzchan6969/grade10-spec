# Watching a lot — delta

## Purpose

How a collector marks an auction lot to come back to without bidding on it. A
watch is a private signal between one collector and one lot: it confers no
standing in the sale, it is visible to nobody else, and it is the trigger the
platform's auction mail fires on.

## ADDED Requirements

### Requirement: A signed-in collector watches and unwatches a lot

A signed-in collector SHALL be able to watch an auction lot, and to unwatch a
lot they watch. Watching SHALL be available wherever a lot is shown to them,
including the catalogue and the lot's own page.

Grade10 SHALL store a watch against the collector and the lot with the instant
it was made. It SHALL NOT hold a watch only in the browser.

Watching SHALL require a signed-in collector. A viewer who is not signed in
SHALL be offered sign-in rather than a watch that cannot be stored.

Watching the same lot again SHALL leave one watch, and SHALL NOT create a
second or change the instant of the first.

#### Scenario: A collector watches a lot

- **GIVEN** a signed-in collector viewing an open lot they do not watch
- **WHEN** they watch it
- **THEN** Grade10 records the watch against that collector and lot
- **AND** the lot shows as watched to them

#### Scenario: A collector unwatches a lot

- **GIVEN** a signed-in collector viewing a lot they watch
- **WHEN** they unwatch it
- **THEN** Grade10 removes the watch
- **AND** the lot shows as not watched to them

#### Scenario: Watching twice leaves one watch

- **GIVEN** a collector who already watches a lot
- **WHEN** a second watch for the same collector and lot is submitted
- **THEN** the collector watches that lot exactly once
- **AND** the instant of the original watch is unchanged

#### Scenario: A signed-out viewer is offered sign-in

- **GIVEN** a viewer who is not signed in, on a lot
- **WHEN** they attempt to watch it
- **THEN** Grade10 does not record a watch
- **AND** the viewer is offered sign-in

#### Scenario: A watch follows the collector, not the browser

- **GIVEN** a collector who watched a lot in one browser
- **WHEN** they sign in on another device and open that lot
- **THEN** it shows as watched

### Requirement: A watch is private and confers nothing

A watch SHALL be visible only to the collector who made it. Grade10 SHALL NOT
disclose to another collector, to an unauthenticated reader, or in any public
listing fact that a lot is watched, who watches it, or how many collectors
watch it.

A watch SHALL confer no standing in the sale. It SHALL NOT affect the current
bid, the leader, bid validity, the close, or any outcome of the auction, and
it SHALL NOT reserve the lot or grant priority.

An authorized operator MAY see how many collectors watch a lot, in order to
judge interest. An operator SHALL NOT be shown a watch as a commitment to buy.

#### Scenario: A watch count is not public

- **GIVEN** a lot watched by several collectors
- **WHEN** any collector or unauthenticated reader reads its public facts
- **THEN** those facts carry no watch count and no watcher identity

#### Scenario: One collector cannot see another's watch

- **GIVEN** two signed-in collectors, one of whom watches a lot
- **WHEN** the other opens that lot
- **THEN** it shows as not watched to them

#### Scenario: Watching does not change the sale

- **GIVEN** an open lot with a current bid and a leader
- **WHEN** a collector watches it
- **THEN** the current bid, the leader, and the close are unchanged
- **AND** no bid validity rule is affected

### Requirement: A collector reads the lots they watch

Grade10 SHALL show a signed-in collector the lots they watch, most recently
watched first. Each entry SHALL carry enough to decide whether to act: the
lot's identity, its current bid, and its close, each in the shape that lot's
own surface uses.

A collector who watches nothing SHALL be shown that they watch nothing, and
SHALL NOT be shown an error or an empty page with no explanation.

Each entry SHALL lead to the lot.

#### Scenario: The list is ordered by when each watch was made

- **GIVEN** a collector who watched lot A, then lot B, then lot C
- **WHEN** they read the lots they watch
- **THEN** the order is C, B, A

#### Scenario: An entry carries the facts needed to act

- **GIVEN** a collector watching an open lot
- **WHEN** they read the lots they watch
- **THEN** that entry shows the lot's identity, its current bid, and its close
- **AND** the close names the time zone it is stated in

#### Scenario: A collector watching nothing

- **GIVEN** a signed-in collector who watches no lot
- **WHEN** they read the lots they watch
- **THEN** they are told they watch nothing
- **AND** no error is shown

#### Scenario: An entry leads to its lot

- **GIVEN** a collector reading the lots they watch
- **WHEN** they open an entry
- **THEN** they arrive at that lot

### Requirement: A watch outlives its lot

A watch SHALL survive its lot's close. A closed lot a collector watches SHALL
remain in the lots they watch, shown as closed, so the collector can see what
became of it.

Grade10 SHALL NOT remove a watch when its lot closes, is called off, or is
won by another collector. A collector MAY still unwatch such a lot.

A lot that has been called off SHALL be shown as called off rather than as
still open.

#### Scenario: A closed lot stays in the list

- **GIVEN** a collector watching a lot that then closes
- **WHEN** they read the lots they watch
- **THEN** that lot is still listed
- **AND** it is shown as closed

#### Scenario: A called-off lot is shown as called off

- **GIVEN** a collector watching a lot an operator then calls off
- **WHEN** they read the lots they watch
- **THEN** that lot is shown as called off, not as open

#### Scenario: A collector unwatches a closed lot

- **GIVEN** a collector watching a closed lot
- **WHEN** they unwatch it
- **THEN** the watch is removed
- **AND** the lot no longer appears in the lots they watch

### Requirement: A watch is keyed by collector and lot

A watch SHALL be keyed by the watching collector's user id and the lot. It
SHALL NOT be keyed by email or by any brand-scoped identifier other than the
user id.

Because both brands sell the same auction lots but sign a collector in per
brand, one lot MAY carry watches from collectors of either brand. A collector
SHALL see only their own watches, and SHALL see them on the brand they signed
in to.

An operator's watch count for a lot SHALL count every watch on that lot,
across both brands, because the lot is one lot.

#### Scenario: A watch belongs to one collector

- **GIVEN** a lot watched by a collector on one brand and by a different collector on the other
- **WHEN** each reads the lots they watch
- **THEN** each sees that lot listed once
- **AND** neither sees the other's watch

#### Scenario: An operator counts every watch on a lot

- **GIVEN** a lot watched by two collectors on one brand and one collector on the other
- **WHEN** an authorized operator reads that lot's watch count
- **THEN** the count is 3

#### Scenario: A watch is keyed by user id

- **WHEN** Grade10 stores a watch
- **THEN** it keys it by the collector's user id and the lot
- **AND** it does not key it by email
