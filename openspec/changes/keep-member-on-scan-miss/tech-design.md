## Context

A scan at the till runs the same lookup whether or not a member is on
screen. The till shows a working screen, drops its session, and the gateway
client clears the token it held before the call goes out. A miss then lands
on an empty till.

Two counters decide which answer is current: the gateway client's, bumped by
a lookup and by ending a session, and the till's, bumped by a lookup, a
reload and a hand-over. Today the working screen hides every gap between
them, because nothing else can start while it shows. Keeping the member on
screen during a lookup opens those gaps, so the change is about who installs
a session, not about hiding a screen.

## Decisions

1. **A lookup holds nothing until it finds someone.** The gateway client
   sends a lookup with no session header and takes nothing from its answer.
   The till installs the found member's token itself, in the same step it
   switches its own session, so the till and the client never disagree about
   whose session is live. Every call builds its header from the token it
   started with, so a call already on its way when a new member lands still
   speaks for the member it was made for; its rotation and its refusal are
   ignored once another member holds the till.

2. **Over a member, a miss is a sentence on the panel.** No working screen,
   no session change. No match, a used or expired code, paused or throttled
   entry, and no answer each keep the member and show the sentence the same
   lookup shows with nobody on the sale. An outdated till or membership
   switched off still takes the till down.

3. **Over nobody, nothing changes.** The working screen and today's answers
   stay.

4. **A hand-over lets go before it asks the store to end the session.** It
   drops the session and shows the hand-over sentence first, then ends the
   old session; a lookup that lands meanwhile wins.

5. **A reload yields to a lookup.** It no longer takes the lookup's turn, so
   a refresh tap never throws away a member a scan just found and burns that
   member's one-time code.

## Risks / Trade-offs

- **A lookup that finds another member while Apply runs** switches the till
  while the first member's discount may still be going onto the cart. That
  cart then carries the new customer, so the sale does not bind. → Exists
  today in the same shape; deferring a switch and a hand-over until Apply
  finishes is its own change.
- **One notice line.** A late miss sentence replaces an earlier sentence
  from an apply. → Accepted; the apply's outcome is still on the panel.
