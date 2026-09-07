---
title: Bidding History
spec: grade10-site/auction/bidding-history
order: 9
---

The account keeps one retained record of everything bidding did, so an
auditable money decision stays explainable without a support ticket. It lives
at the account's bids address and belongs to the storefront account alone —
no input a collector supplies reads anyone else's record, and there is no
control to delete or hide an entry, because the record is the audit.

In My Auctions, this is the Bidding tab. The [auction
record](/p/grade10-site/auction/account-record) owns the surrounding account
navigation, the Watching tab, and its account-level presentation; this
capability owns the Bidding index and the detailed story behind each listing.

## The index

Every listing the account bid on — by hand or through an auto-bid — appears
exactly once, ordered by its latest activity, carrying the listing's
identity, its current or final price, and the collector's standing: pending,
leading, outbid, won, lost, canceled, or failed-only, which means every
attempt was refused and nothing was accepted. An Active filter keeps what is
still running; Completed keeps what is done.

## One listing's story

An entry opens into a single chronological explanation of that listing.
Every server-evaluated action the collector took leaves a private event — a
bid accepted, a bid refused and why, a private maximum set or raised —
interleaved with the public movements that changed their standing. Private
facts stay private: another bidder's maximum never appears, only the public
consequence that displaced them.

## Journeys
