# User journeys - auction

## Added

### Service announces a bid or close to open pages

After Postgres commits an accepted bid or a settle, the auction's live room
re-reads public state and pushes it to every connected auction page. The
catalogue hub pushes a card summary for that auction. A page that misses the
push reads the public auction on its next poll.

## Changed

### Close past the recorded end

When the recorded close is due, the auction enters Closing while still
published. Settle may close it or restart extended bidding. A late public read
two seconds past the deadline may settle; the five-minute cron remains the net.

## Retired

None.

## Relied on

- Absolute auction, extension, and auto-bidding from Bidding
- Public listing read contract
