# Auction email notification base

**Author:** @web3-app-cursor8 - 2026-08-20

Product context: [Auction notifications](../../../docs/prds/auction/notifications.md).

## Why

Collectors who watch or bid on a listing hear nothing about the moments that
change whether they should come back — open bidding in 24 hours, open bidding
started, close in 24 hours, extended bidding started, a new bid on a lot they
already bid on — except an hour-before-close reminder for watchers and the
bid-state receipts (outbid, you lead, you won). The original auction change
deferred those letters on purpose. Without a shared letter and a send that
retries a temporary failure and stops on a permanent one, each new event
would grow its own layout and its own retry story.

**Metric:** share of owed start / close-in-24h / extended-bidding / new-bid
letters confirmed sent while the statement they make is still true. **Noise
cap:** new-bid letters per bidder per listing stay near one per sweep pass
during an extension, not one per increment.

## What Changes

- A Grade10 auction notifications capability: who is owed which listing
  letter, when the statement would be false, and how delivery fails.
- Four listing-lifecycle letters from the product event table: open bidding
  starts in 24 hours (watchers), open bidding has started (watchers), open
  bidding closes in 24 hours (watchers or participants), extended bidding has
  started (watchers or participants).
- One bid-activity letter the receipts do not cover: the lot you bid on
  received a new bid. Outbid already ships; this change only keeps it from
  doubling as “new bid”.
- Every auction letter, old and new, keeps one layout: heading, body, listing
  button, footer, and an unsubscribe control only when stopping the letter
  actually stops further mail.
- Provider sends classify a temporary failure (retry) against a permanent one
  (stop). No in-process sleep on the worker.

## Capabilities

### New Capabilities

- `grade10-auction/notifications`: listing-lifecycle and bid-activity email,
  shared letter shape, audience, unsubscribe, and bounded at-least-once
  delivery.

### Modified Capabilities

- None. Close times in mail already follow `dates-and-times`; amounts already
  follow `money-amounts`. Start times in the new letters inherit those rules
  without changing them.

## Impact

- Grade10 auction service: new kinds on the shared mail/push vocabulary,
  watcher (and participant) work lists beside the existing ending-soon
  fanout, coalesced new-bid list beside the existing outbid list, copy
  branches on the one auction letter.
- Shared email package: provider error class so every sender — login and
  auction — retries and parks the same way.
- Auction contracts: new kind names on the shared vocabulary. Device push
  for those kinds is out of this change; the claim must name them so a
  follow-on does not rename them.
- Grade10 storefront: no new page. Watch-driven mail keeps linking at
  `/profile/alerts`.
- ZZZ: none.

## Non-goals

- Push, SMS, in-app toasts, notification preferences, `/profile/alerts`.
- Replacing existing bid-state receipts or the one-hour closing-soon
  reminder.
- Auto-bidding, cross-listing digests, bidder locale, one-click unsubscribe.
- A second auction letter template per kind.

## Compatibility and migration

Additive kinds, additive stamps, additive work lists. Existing outbid /
ending-soon behaviour stays. Watch-driven unsubscribe stays a signed-in
page, not one-click. Every amount in a letter remains minor units plus an
ISO 4217 code.

## Validation

- Feature tests for each event’s audience, the drop when the statement would
  be false, coalesced new-bid vs outbid, and provider temporary vs permanent
  failure.
- Render coverage stays driven from the kind union, so a new kind cannot
  ship without its words.
- `openspec validate auction-email-notification-base --strict` before
  implementation.
