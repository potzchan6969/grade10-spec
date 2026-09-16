## Feature set

- Auto-bid as a bid
  - Counted and recorded: a bid Grade10 places counts in the bid count and
    history as placed on that bidder's behalf
  - Extended bidding: a maximum committed before the close counts toward entry,
    an auto bid during extended bidding restarts the timer as a manual bid
    would, and standing maxima do not keep bidding

## MODIFIED Requirements

### Requirement: A bid Grade10 places counts as a bid

Each accepted commitment SHALL cause one resolution. A resolution computes the
two-maximum result and records the accepted action and any automatic response
required by that result. A result that leaves the current bid unchanged still
records both ordered actions in the equal-maximum case. Grade10 SHALL NOT then
place further bids until another commitment is accepted. It SHALL NOT step
through intermediate increments. Standing maxima SHALL NOT generate bids on a
timer or a schedule.

Worked example. Starting price 20000, increment 2500.

1. You commit a maximum of 50000. Grade10 resolves once: you lead at
   20000. It does not then raise 22500, 25000, 27500 toward 50000.
2. They commit a maximum of 80000. Grade10 resolves once: they lead at
   52500 (your 50000 plus one increment). It does not then raise 55000,
   57500 toward 80000.
3. Neither commits again. The price stays 52500. Grade10 places no bid
   on a timer.
4. You raise your maximum to 90000. That is a new commitment. Grade10
   resolves once: you lead at 82500 (their 80000 plus one increment).
   Done until the next commitment.

A bid Grade10 places on a bidder's behalf SHALL be treated as an accepted
bid in every respect: it SHALL count toward the listing's bid count,
appear in bid history identified as placed on that bidder's behalf, count
toward whether the listing enters extended bidding at its scheduled close,
and move the listing's close under the same extended-bidding rule and cap
that `grade10-site/auction/auction` already governs a manual bid with.

Auto bidding SHALL remain active during extended bidding. A bid Grade10
places during extended bidding SHALL move the close exactly as a manual bid
placed at the same moment would. A bid Grade10 places before the scheduled
close SHALL NOT move the close, as a manual bid would not. Two standing
maxima SHALL NOT keep extending the close on their own.

Scenario `grade10-site-auction-auto-bidding-SC-22` keeps its title with its id.
The title is historical: its extension window is now extended bidding.

#### Scenario: grade10-site-auction-auto-bidding-SC-22 - An auto bid in the extension window extends once
**Serves:** grade10-site-auction-auto-bidding-US-05 - Collector's auto-bid counts as a bid

- **GIVEN** a listing in extended bidding, and a leader whose committed maximum has room left
- **WHEN** a challenger's commitment causes Grade10 to raise the leader's bid on their behalf
- **THEN** that bid moves the listing's close exactly as a manual bid at that moment would
- **AND** the listing does not close while that extension stands
- **AND** Grade10 places no further bid until another commitment is accepted

#### Scenario: grade10-site-auction-auto-bidding-SC-23 - An auto bid is counted and recorded
**Serves:** grade10-site-auction-auto-bidding-US-05 - Collector's auto-bid counts as a bid

- **GIVEN** Grade10 raises a bidder's bid on their behalf
- **WHEN** a collector reads the listing's bid count and history
- **THEN** the bid count includes that bid
- **AND** the history shows it as placed on that bidder's behalf, not as a manual bid

#### Scenario: grade10-site-auction-auto-bidding-SC-24 - Standing maxima do not keep bidding
**Serves:** grade10-site-auction-auto-bidding-US-05 - Collector's auto-bid counts as a bid

- **GIVEN** two bidders have committed maxima and the listing has been resolved to the two-maximum price
- **WHEN** no further commitment is accepted
- **THEN** Grade10 places no further bid on either bidder's behalf
- **AND** the current bid is unchanged

#### Scenario: grade10-site-auction-auto-bidding-SC-25 - A maximum committed before the close counts toward extended bidding
**Serves:** grade10-site-auction-auto-bidding-US-05 - Collector's auto-bid counts as a bid

- **GIVEN** an open listing whose only bidder committed a maximum before its
  scheduled close and leads at the starting price
- **WHEN** the scheduled close arrives
- **THEN** the listing enters extended bidding
