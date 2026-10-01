## Feature set

- **Watching a listing**
  - Watch and unwatch: lets a collector mark interest before they are ready to
    bid, from wherever the listing is shown.
  - Private by default: a watch says nothing to anyone but its owner, so
    marking interest costs nothing.
  - Watch limit: keeps the list a considered one and the read bounded.
- **The Watching page**
  - Four listing states: answers whether a listing is open and how soon it
    closes, and refuses to answer more than that.
  - Ordering and the bid marker: puts the next close first and hands a listing
    the collector already bid on over to the Bidding page.
- **The Bidding page**
  - Tab boundary: provides the account entry point and account-level groups;
    the detailed index, filters, and listing story come from
    `grade10-site/auction/bidding-history`.
  - Standing while open: says whether the collector still leads, and what the
    next valid bid must clear when they do not.
  - Auction's price: a bidding row shows the auction's current price, or its
    final price once it closes, never the collector's own bid.
  - Three groups: separates the listings that still need the collector from
    the ones that are finished.
- **After a close**
  - Result from the record: Your Standing reads Won or Didn't win from the
    recorded result, never from the page's own clock.
  - Overdue Status: a won lot whose setup or payment window has passed reads
    Setup Overdue or Payment Overdue
  - Payment Verifying: a won lot whose payment proof waits for an operator reads Payment Verifying
  - Winner's payment and shipment: lets a winner follow their own listing to
    delivery without contacting Grade10.
  - Losing bidder's card hold: says what happened to their authorization, so a
    pending hold is not read as a charge.
- **Reaching the record**
  - Ownership: resolves the record from the session and nothing else.
  - Landing, empty, and failed reads: makes an unused record and a broken one
    tell the collector different things.
- **Tabs by bidding window**
  - Active, Upcoming, Ended: every row sits in the tab its bidding window names.
  - Landing: My Auctions opens on Active; the title count stays the total.
- **Row actions**
  - Ended alerts: Email alerts show disabled on a closed lot.
  - Won entry: a Won row opens its auction order.
