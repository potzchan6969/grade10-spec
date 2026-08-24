# Design: auction email notifications

Requirements are in
[`specs/grade10-auction/notifications/spec.md`](specs/grade10-auction/notifications/spec.md).
Motivation is in [`proposal.md`](proposal.md).

## Context

Two platform rules already govern the content of these messages and are not
restated here: `money-amounts` requires a sent message to render money in
English independent of the reader's locale, and `dates-and-times` requires a
close in an auction email to name its zone and to state the same instant as
the page.

A lot's close moves. The extension rule pushes it back for every late bid, up
to an optional per-listing cap. Any message keyed to "before the close" has to
choose which close it means.

## Decisions

### The auction service decides who is enrolled; the store service sends

The service that owns the lot knows who watches it and who has bid on it, and
already sees every accepted bid and every state change. It emits an event
naming the recipients. The brand's store service renders and sends, because it
owns the collector's registered address.

*Alternative rejected — let the sender work out recipients.* It would need to
read watches and bids across both brands, duplicating the ownership the
auction service already has, and it would put the deduplication rule in two
places.

### The closing warning is keyed to the scheduled close, not the effective one

A "closes in 24 hours" message measured against a close that moves would be
recomputed every time a late bid landed, and could fire more than once or
never fire at all. The scheduled close is fixed at publish, so the point is
computable once.

*Alternative rejected — key it to the effective close.* Late bids arrive
inside the final 30 minutes, so the effective close rarely moves more than
hours; the warning would either be sent late or be cancelled and rescheduled
repeatedly. *Alternative rejected — send it against the effective close and
suppress duplicates.* Same complexity, and the collector receives a warning
that no longer matches the deadline they will actually face, since extended
bidding announces itself separately anyway.

The accepted cost: on a lot extended by hours, the 24-hour warning is more
than 24 hours before the real end. Extended bidding has its own message, which
is the one that matters at that point.

### Deduplication is per collector, per lot, per message

A record of what was sent is kept, and it is what makes "once per lot per
collector" and the outbid-beats-new-bid rule true. It is also the operator's
answer to "I was never told".

*Alternative rejected — derive it from enrolment at send time.* A collector's
enrolment changes; a sent message does not. Deriving means a collector who
unwatches and re-watches receives the opening message twice.

### The outbid message wins over the new-bid message

One accepted bid can qualify a collector for both. Being outbid is the
stronger and more actionable fact, so it is the one sent.

*Alternative rejected — send both.* Two messages about one event, arriving
together, reading as if two things happened.

### A bid Grade10 places on a collector's behalf is that collector's own bid

So it never triggers their own new-bid message. This matters only once
automatic bidding ships, and is specified now so the rule does not have to be
retrofitted.

## Risks and trade-offs

| Risk | Mitigation |
| --- | --- |
| A proxy-bidding war generates a message per step, flooding both bidders | The outbid message is sent when a collector *stops leading*, not per bid, so a bidder receives one per lead change rather than one per step. Monitor volume once automatic bidding ships. |
| A collector reads transactional mail as marketing and marks it spam | Every message is about a lot the collector watched or bid on; none recommends another lot. |
| Mail is sent about a lot an operator has just called off | The spec suppresses everything from the moment of call-off. |
| The 24-hour warning misleads on a heavily extended lot | Extended bidding sends its own message; the warning does not claim to be the final word. |
| A send failure silently loses a message a collector needed | The sent record distinguishes sent from attempted, so an operator can see the difference. |

## Migration plan

None. No auction mail is sent today and no stored data changes shape.
Collectors already enrolled by having bid on an open lot begin receiving
bid-activity mail at release; that is the intent, not a migration.

## Open questions

Answerable later without changing the specs, the approach, or the tasks.

- Whether an operator sees sent messages on the listing's admin page or in a
  separate view. The record and its contents are specified either way.
- How long the sent record is retained.
- Whether the new-bid message states the new current bid or only that a bid
  arrived. The outbid message's contents are specified; this one's are not
  constrained by any scenario.
