# User journeys - listing-page

## Added

### Collector watches one auction with another collector

Two signed-in collectors open the same live auction. Each sets a private
maximum. When the maxima are equal, the earlier maximum stays leading and both
pages show the shared hammer. A later raise on one page updates the standing
bid on the other without a full navigation.

### Collector stays through extended bidding and settle

An auction is already in extended bidding. An accepted bid restarts the close
timer and keeps the Time left (extended) label. When the timer runs out with
no new bid, settle closes the auction: the leader sees Auction won; everyone
else who bid sees Did not win. Neither page shows Ended only because its clock
passed the recorded close.

## Changed

### Countdown on the auction page

The remaining time follows the auction service clock so browsers and machines
on the same auction stay aligned. After the device sleeps, the live line
reconnects, or the tab becomes visible again, the page re-probes the service
clock and corrects drift without jumping the countdown up for a sub-second
skew.

## Retired

None.

## Relied on

- Extended bidding and auto-bidding rules from Bidding
- Auction address and served standing from listing-page
