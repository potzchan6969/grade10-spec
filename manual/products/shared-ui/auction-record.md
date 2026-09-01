---
title: Auction Record Blocks
spec: shared-ui/auction-record
order: 9
---

Six blocks make the account's auction record, written once and composed by
every application that shows it: the two-page frame, the Watching and
Bidding lists, the row that carries one lot's standing, the empty state, and
the watch control that marks a lot wherever it is shown. Each renders on its
own, so a lot page takes the watch control without adopting the frame.

As everywhere in this package, the blocks hold no product state. What lot,
what standing, what was paid and what was released arrive as props the
application resolved; every string arrives through the copy group; a press
is reported through its callback rather than acted on, so watching, tab
changes and retries stay the application's writes.

What the record means — the states, the ordering, the privacy — is
[My Auctions](/p/grade10-auction/account-auction-record); this capability is
the component contract underneath it.
