## Context

A scan at the till runs the same lookup whether or not a member is on
screen. The till shows a working screen, drops its session, and the gateway
client clears the token it held before the call goes out. A miss then lands
on an empty till.

Today the working screen hides every race between a lookup, a reload, a
hand-over and a call already on its way, because nothing else can start
while it shows. Keeping the member on screen during a lookup opens those
races, so the change is about who installs a session and what yields to it,
not about hiding a screen.

## Decisions

1. **A lookup holds nothing until it finds someone.** The gateway client
   sends a lookup with no session header and takes nothing from its answer.
   The till installs the found member's token itself, in the same step it
   switches its own session, so the till and the client never disagree about
   whose session is live. A call already on its way when a new member lands
   still speaks for the member it was made for, and its rotation and its
   refusal are ignored, by the client and the till alike, once another member
   holds the till. A call that waited on the host for its own token presents
   the session as rotated meanwhile, since the store keeps one step back.

2. **Over a member, a miss is a sentence on the panel.** No working screen,
   no session change. No match, a used or expired code, paused or throttled
   entry, and no answer each keep the member and show the sentence the same
   lookup shows with nobody on the sale. An outdated till or membership
   switched off still takes the till down.

3. **Over nobody, nothing changes.** The working screen and today's answers
   stay.

4. **A hand-over lets go before it asks the store to end the session.** It
   drops the session and shows the hand-over sentence first, then ends the
   old session. A member found meanwhile, by a lookup started before or after
   the hand-over, takes the till; the modal closing meanwhile stops the till
   reading the newcomer.

5. **The till keeps two marks.** One orders lookups: a lookup yields only to
   a lookup started after it. The other marks the session: it moves when a
   session is installed or let go of, never on a lookup that has found nobody
   yet. A resume, a reload, a found member's attach, a miss's sentence and
   the hand-over's follow-through each yield if the session moved while they
   waited, so a refresh tap never throws away a member a scan just found, and
   a miss never hides one.

## Risks / Trade-offs

- **A lookup that finds another member while Apply runs** switches the till
  while the first member's discount may still be going onto the cart. That
  cart then carries the new customer, so the sale does not bind. → Exists
  today in the same shape; deferring a switch and a hand-over until Apply
  finishes is its own change.
- **One notice line.** A late miss sentence replaces an earlier sentence
  from an apply. → Accepted; the apply's outcome is still on the panel.
