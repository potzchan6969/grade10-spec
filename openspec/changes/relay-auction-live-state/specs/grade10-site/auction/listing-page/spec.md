# grade10-site/auction/listing-page Specification (delta)

## Purpose

Align and sync countdown, public status, and extended close across browsers and
machines on one auction: the same remaining seconds, the same standing bid and
recorded close, Closing until settle, and the correct won or lost badge after
close.

## ADDED Requirements

### Requirement: Service clock on the auction page

The auction page SHALL count remaining time from the auction service clock.
After device sleep, a live-line reconnect, or the tab becoming visible, the
page SHALL re-probe that clock. A correction under one second SHALL NOT jump
the countdown upward.

#### Scenario: Two collectors share remaining seconds

- **GIVEN** two signed-in collectors have the same live auction open
- **WHEN** each reads Time left
- **THEN** the remaining seconds they show differ by at most about one second

### Requirement: Live standing refresh

While an auction is Active or Closing, an open auction page SHALL refresh the
public standing bid, bid count, and close time when the auction's live room
pushes, without requiring a full navigation. A missed push MAY be caught by
poll.

#### Scenario: Rival sees a raise without reload

- **GIVEN** collector A and collector B have the same live auction open
- **WHEN** A raises and the raise is accepted
- **THEN** B's page shows the new hammer while staying on that auction address

### Requirement: Closing before Ended

While the listing is still published and the recorded close is past, the
auction page SHALL present Closing. It SHALL NOT present Ended from the page
clock alone.

#### Scenario: Clock passes close during settle

- **GIVEN** a published auction whose recorded close is in the past and settle
  has not finished
- **WHEN** a collector's page clock passes that close
- **THEN** the page does not show Ended solely for that reason

### Requirement: Settle badges

After settle closes a sold auction, the winner's page SHALL show Auction won.
A bidder who did not win SHALL see Did not win. A standing that still says
leading for the winner SHALL map to Auction won.

#### Scenario: Equal maxima then raise then close

- **GIVEN** two collectors set the same maximum and the earlier keeps the lead,
  then the leader raises and wins at settle
- **WHEN** both stay on the auction through close
- **THEN** the leader sees Auction won and the other sees Did not win at the
  same winning top

## MODIFIED Requirements

None.
