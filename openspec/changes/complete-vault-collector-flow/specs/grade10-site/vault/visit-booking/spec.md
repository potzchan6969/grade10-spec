# grade10-site/vault/visit-booking Specification

## Purpose

The shop visit a case is worked at: who may book one and when, how it is moved
and called off, what a missed one costs, what closes it, and what the collector
is given once one stands.

The diary that holds shops and slots is another service's; this capability is
what a vault case is entitled to ask of it and what the case keeps of the
answer. Which statuses exist is `grade10-site/vault/case-lifecycle`.

## Feature set

- When a visit is bookable
  - Every live status but a draft: the shop values remotely and offers before
    the visit, so a case is bookable wherever it stands
  - One visit at a time: a case holds one live booking, and moving it is its
    own act
  - The lead case books: siblings need no visit of their own, because a case
    has never needed one to be vaulted
- Booking, moving, calling off
  - The collector or the counter: either may book, move or cancel, and the
    collector is told either way
  - A slot in the past: refused, because a visit is something somebody is
    coming to
  - Replay, not a second seat: asking again for the slot the case already
    holds changes nothing
- The diary and the copy
  - The diary is the authority: where the two disagree the case's copy is
    repaired and never acted on
  - One writer: a case's visit is moved on the case, so the copy and the diary
    have one author
- Missed and finished visits
  - A missed visit closes a visit: only a case with nothing else holding it
    ends with one
  - Completion on the first counter act: an act after the slot closes the
    visit, an act before it leaves the visit open
  - An ended case's visit: one still ahead is cancelled, and one already past
    on a forfeited case is a no-show
- The booked visit
  - The confirmation: the shop, the slot and what to do before the day — verify
    the identity, bring the item, sign at the counter
  - The calendar file: the visit as a file the collector's own calendar opens,
    served from the case and attached to the visit's own messages
  - One visit, one entry: a moved visit's file replaces the one before it and a
    cancelled visit's is withdrawn, so no stale day is left on a phone
