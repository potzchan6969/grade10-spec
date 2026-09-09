---
title: Auction Record Blocks
spec: shared/ui/auction-record
order: 9
---

Six blocks make the account's auction record, written once and composed by
every application that shows it: the two-page frame, the Bidding and
Watching lists, the row that carries one lot's standing, the empty state, and
the watch control that marks a lot wherever it is shown. Each renders on its
own, so a lot page takes the watch control without adopting the frame.

The frame reads Bidding before Watching. A row leads with the lot, then its
current bid and close in their own labelled cells rather than one run of
text, and carries its state as a toned badge. Watching rows carry an email
alerts switch beside Unwatch; a bidding row carries the switch alone.

As everywhere in this package, the blocks hold no product state. What lot,
what standing, what was paid and what was released arrive as props the
application resolved; every string arrives through the copy group — including
the fact labels and the wording of an email-alerts confirmation; a press
is reported through its callback rather than acted on, so watching, muting,
tab changes and retries stay the application's writes. The row announces a
mute only after the application has changed the value it was given, so the
confirmation cannot outrun the write, and one row's switch never moves
another's.

What the record means — the states, the ordering, the privacy — is
[My Auctions](/p/grade10-site/auction/account-record); this capability is
the component contract underneath it.
