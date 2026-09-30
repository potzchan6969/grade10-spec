# grade10-site/auction/auction Specification (delta)

## Purpose

Relay public auction changes after the database commits them, and settle a due
close without leaving open pages on Ended early.

## ADDED Requirements

### Requirement: Live room re-reads before broadcast

After an accepted bid or a settle commits in Postgres, the auction live room
SHALL re-read public auction state and then broadcast. It SHALL NOT broadcast a
frame invented only by the writer. Absent the room binding, pages MAY poll.

#### Scenario: Bid reaches every connected page

- **GIVEN** at least one auction page is connected to the auction live room
- **WHEN** another collector's maximum is accepted
- **THEN** connected pages receive the updated public standing from a room
  re-read

### Requirement: Extended bidding restarts the recorded close

During extended bidding, each accepted bid SHALL set the recorded close to the
extension duration after that bid, unless the extension cap holds the close.
Equal maxima SHALL leave the earlier maximum leading and SHALL still restart
the timer when the second maximum is accepted.

#### Scenario: Equal maximum during extension

- **GIVEN** an auction is in extended bidding and collector A leads with
  maximum M
- **WHEN** collector B sets maximum M
- **THEN** A remains leading at M and the recorded close moves forward by the
  extension duration

### Requirement: Closing and opportunistic settle

When the recorded close is due and the auction is still published, its public
status SHALL be Closing. A public read more than two seconds past that close
MAY settle the auction. The periodic close sweep SHALL remain able to settle
any due auction.

#### Scenario: Late read settles

- **GIVEN** a published auction whose recorded close is more than two seconds
  past
- **WHEN** a public auction read runs
- **THEN** the auction may settle on that path without waiting only for cron

## MODIFIED Requirements

None.
