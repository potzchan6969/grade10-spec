# Tasks

Group 1 lands in **grade10-spec** and the submodule bump is the boundary:
group 7 cannot start until it has shipped. Group 2 is the rule every other
backend group reads. Group 6 ships and drains before group 7 changes what the
member's card derives.

Design decisions and the invariant they rest on: [`tech-design.md`](tech-design.md).
Screens and states: [`ui-design.md`](ui-design.md).

## 1. Member and operator words (grade10-spec)

- [x] 1.1 Replace the expiring-soon keys with one expiry line in every language the programme speaks — the plain line, the line inside the last thirty days, and the line on the day itself
- [x] 1.2 Give `MembershipSummary` the expiry line and tone, and take the expiring-soon and points-active-until props off it
- [x] 1.3 Add the four stories the design record names — later, soon, today, and no points
- [x] 1.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run test:stories:ui`

## 2. One date for every credit (grade10)

- [x] 2.1 Add the operator-credit helper: settle what is dead, take the balance's date where there is one, otherwise start the window from the credit's own day, so *Operator points to an empty balance start the window* and *A backdated grant joins the window already running* pass
- [x] 2.2 Route the campaign grant and the correction credit through it, so *A campaign grant does not keep the balance alive* and *A correction does not extend the balance's life* pass
- [x] 2.3 Move the forwards-only rule into the clock write itself, so no caller can pull a clock back
- [x] 2.4 Assert the invariant in the ledger invariants: a member holding a balance has one effective expiry date across their live lots
- [x] 2.5 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`

## 3. The operator restart (grade10)

- [x] 3.1 Add the service: settle first, run the window again from today, forwards only, reason digested into the fingerprint, the date answered as a string
- [x] 3.2 Expose it on the console router behind the permission that moves points, so *An operator restarts the window*, *A restart revives nothing*, *A restart never shortens a window* and *A restart moves no points* pass
- [x] 3.3 Answer the last restart on the member's operator view, read by reference from the mutation record
- [x] 3.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`, `pnpm --dir packages/api-docs run generate` with the output committed

## 4. Two siblings of the same bug (grade10)

- [x] 4.1 Widen the redemption's channel to the whole set and stamp a reward handed over outright as internal, so *Handing over a reward is not the member's activity* passes and the counter-share number stops counting operator grants as online sales
- [x] 4.2 Reset the window only for a channel that sold something
- [x] 4.3 Skip a lot whose date has passed when restoring what a debit took, and answer with what it could not return, so *A reversal into a lapsed balance returns nothing spendable* passes
- [x] 4.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`

## 5. The summary's one date (grade10)

- [x] 5.1 Derive the expiring-soon figure from the balance and the one date, and drop its query
- [x] 5.2 Make the field optional on the wire, with a comment naming the change that removes it, and stop every consumer reading it
- [x] 5.3 Collapse the two readers of the balance's date — the member's latest and the operator list's earliest — into one repository function
- [x] 5.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`

## 6. Moving the dates that already exist (grade10)

- [x] 6.1 Add the repair pass: per member under the member lock, settle to zero, read the balance's date, advance the clock to it; a state predicate with no cursor
- [x] 6.2 Run it ahead of the expiry sweep in the nightly pass
- [ ] 6.3 Report the points carried further and the largest single move, before the pass first runs, for the decision the Points page holds open — **dropped**: the platform runs staging alone, on play data, so the move costs nothing anybody owns. The pass reports both numbers on every run, for a production database that does not exist yet
- [ ] 6.4 Back the database up before the first run; the pass overwrites the only copy of each member's previous date — **dropped**: the only date the pass overwrote was staging's, on play data. The nightly backup is red, and is scheduled at 03:17, after the 03:00 pass it was meant to precede
- [ ] 6.5 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test:backend`, and the pass drained on two consecutive nightly runs — **checks done** on the change's pull request; **the drain dropped**: a backlog that stops draining holds up play data only, and the nightly pass already alarms on one through `raisedClocks`

## 7. What the member and the operator read (grade10)

Starts after group 1 has shipped and the submodule SHA has moved, and after
group 6 has drained.

- [x] 7.1 Say one expiry line on the membership card, with the tone decided from the page's own clock, so *The summary names one expiry line* passes
- [x] 7.2 Name the date the points will carry on the form that adds points, read at submit, so *The form names the date before the points are written* passes
- [x] 7.3 Add the restart dialog, saying the day it lands on — including for a member holding nothing live, whose later credits take that day — and its note that no ledger row follows
- [x] 7.4 Take the expiring-soon figure off the operator's standing card and put the time left and the last restart in its note
- [x] 7.5 Label the till's date as when the member's points go
- [x] 7.6 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run check:submodules`

## 8. End to end (grade10)

- [x] 8.1 Walk the whole rule in one demo: earn, grant, restart, lapse — and show one date throughout
- [x] 8.2 Verify: the walk runs in the end-to-end lane as a guardrail on later work
