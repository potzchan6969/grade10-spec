# Design: automatic bidding

Requirements are in
[`specs/grade10-auction/proxy-bidding/spec.md`](specs/grade10-auction/proxy-bidding/spec.md).
Motivation is in [`proposal.md`](proposal.md). This file records the decisions
behind the approach and the alternatives rejected.

## Context

`add-grade10-auction` delivered a serialized bid decision per listing: bids are
evaluated in one order, the current bid is the highest valid accepted amount,
and a card authorization is obtained per bidder per listing before a bid is
accepted. Late bids move the close, repeatedly, up to an optional per-listing
extension cap. Increments are configured per listing by an operator.

Everything below fits inside that decision. Automatic bidding does not add a
second place where a bid is accepted.

## Decisions

### The stored fact is the maximum; the current bid is derived

A bid record stores the bidder's committed maximum and the instant Grade10
accepted it. The current bid and the leader are derived from the two highest
maximums by the rule in the spec, then persisted alongside the listing so
reads stay cheap and no reader re-derives them.

*Alternative rejected — store the current bid as the primary fact and keep the
maximum beside it.* The maximum is what the bidder authorized and what the
card hold covers; the current bid is a consequence. Making the consequence
primary means two writers can disagree about which is true.

### The card hold covers the maximum

Committing 50000 minor units authorizes 50000, even while the current bid is
22500. This is the decision with the largest product consequence, so the
alternatives are recorded in full.

*Alternative rejected — authorize the current bid and re-authorize on each
proxy step.* A step happens without the bidder present, so an authorization
that fails there drops them out of an auction they believed they were winning,
silently, with no way to intervene. That converts an issuer decline into a lost
lot and a support ticket. It also multiplies authorization traffic by the
number of steps.

*Alternative rejected — authorize the current bid and top up in bands.* Fewer
checks than per-step, but it keeps the same failure mode at every band
boundary while adding a threshold nobody can explain to a bidder.

The accepted cost is that a bidder's money is held above what they are likely
to pay, which discourages high maximums — exactly the behaviour the feature
wants to encourage. Recorded as a risk below.

### A challenger at or below the leader's maximum sets the current bid to their own maximum

Not to their maximum plus an increment. This follows the worked example in the
source document: a challenger bidding 22500 against a hidden 50000 makes the
current bid 22500, not 25000.

*Alternative rejected — the common marketplace rule, where the current bid
becomes the lesser of the challenger's maximum plus one increment and the
leader's maximum.* It extracts slightly more per lot, but it was not what the
product asked for, and it makes the displayed price a number no bidder
actually named. Revisit only as a deliberate pricing change.

### Automatic bidding runs in the extension window and moves the close

A bid Grade10 places is a bid. It counts, it is recorded, and it extends.

*Alternative rejected — only a manual bid moves the close.* A bidder whose
maximum still had room would lose to the clock while their commitment was
willing to go higher, which is the opposite of what committing a maximum is
for. *Alternative rejected — automatic bidding stops when the extension window
opens.* Same objection, more bluntly: the collector who set a maximum and left
is exactly the person the feature exists for.

The cost is that two live maximums can trade automatic bids and hold a listing
open. The per-listing extension cap already delivered is the bound on that,
and this change adds no new one.

### A maximum cannot be lowered

Other bidders have already bid against a commitment; withdrawing it would
retroactively change a price they responded to. Raising re-commits and
re-authorizes.

*Alternative rejected — allow lowering while the bidder does not lead.* The
leader is a function of the maximums, so "not leading" is not stable enough to
key a permission on: a concurrent commitment can make a bidder the leader
between the check and the write.

## Risks and trade-offs

| Risk | Mitigation |
| --- | --- |
| Holding the maximum discourages high maximums, blunting the feature | The bid surface must state plainly that the hold is the maximum and the bidder usually pays less. Measure committed maximum against final price. |
| A card issuer declines a large authorization, so a bidder cannot commit at all | The raise is refused explicitly and the previous commitment stands. The spec requires the failure to change nothing. |
| Two maximums extend a listing for a long time | The per-listing extension cap already exists; operators should set one on high-value listings. |
| A bidder misreads the maximum as the price and commits far too much | Confirmation on the bid control; copy is named in `ui.md` as work. |
| Deriving the leader concurrently could produce two leaders | The derivation happens inside the existing serialized per-listing decision. No second decision path is introduced. |

## Migration plan

Listings already open when this ships hold accepted bids that are amounts, not
maximums. Each such bid becomes a committed maximum equal to its amount, which
preserves the leader and the current bid exactly: a bidder who bid 30000
manually behaves as one who committed a maximum of 30000 and is immediately at
their limit.

Existing card authorizations already cover those amounts, so no
re-authorization is needed at migration. The first raise after the change
follows the new rule.

## Open questions

These can be answered after implementation begins without changing the specs,
the approach, or the task breakdown.

- Whether the admin bid history filters to show only bids a bidder placed
  themselves. An operator can already see both.
- Whether the bid surface offers preset maximum amounts alongside free entry.
  Presentation only; the committed value is unaffected.
