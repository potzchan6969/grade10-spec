<!-- The change's decided frontier, written by the product manager with the
     `planning-pm` skill, out of the same `grilling` round that produced the
     proposal. It lands before the journeys, the design and the requirements,
     because all three are drawn from what it settles.

     Confirmed decisions only. A question nobody present could settle is a
     deferral, not a decision: it goes under the proposal's open questions
     naming who owes the answer, and as a ❓ row on the capability's PRD.

     A decision learned later lands here first. Drawing the design or refining
     the journeys can show the frontier closed on the wrong answer - revise the
     row in place, by whoever learned it, before the artifact that depends on
     it changes. A conflict between this file and something drawn from it is
     not automatically the other file's error. -->

## Goals

<!-- What this change is for, as outcomes a reader would notice. One line each.
     This is the change's own boundary, not the capability's — the PRD holds
     what the product should be, and the delta spec holds what it does. -->

-

## Non-Goals

<!-- What this change deliberately does not do, so every artifact drawn from
     this one knows its edges. This is their home: the proposal points here
     rather than restating them. Name the thing ruled out, not the reason it
     is hard. -->

-

## Decisions

<!-- Every question the interview settled, one row each, in the order the
     rounds asked them. `Q` is the number the round gave it, so a reader can
     follow a decision back to the question that raised it.

     A decision the round took on the best option is written `<option> -
     decided by the round`, so a later reader knows how firm it is and any
     hand overturns it with one reply; one the author kept against the
     interview's challenge carries the interview's alternative and why it
     lost in `Instead of`.

     A question the interview could not close is written `❓ <role> - <what is
     recommended>` in `Decided`: the ` - ` separator is the grammar the store
     reads the role by, and everything after it is what that role is being
     asked to confirm. A cell that opens ❓ and names no role that way is
     addressed to nobody and reaches no list.

     `Instead of` is what the row buys: the option dropped, and in a few words
     why. Without it the same question is asked again next quarter and answered
     the other way, with nothing to say which reading is newer.

     What belongs elsewhere: a decision a requirement can carry goes in the
     delta spec; one the manual's reader needs goes in the PRD's
     `Product decisions` block; an implementation choice goes in
     `tech-design.md`. What stays here is what the interview closed. -->

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | <!-- what the round asked --> | <!-- what was settled --> | <!-- the option dropped, and why --> |

## Raised

<!-- The blind suite pass's own output, written here by the run that takes the
     two readings: every point the isolated input did not settle, as a question
     for the author, with the capability whose pass raised it.

     Every row lands before the change merges - as a `Decisions` row above, or
     as a ❓ on the capability's PRD naming who owes the answer. There is no
     third resting place, and `pnpm check:manual` refuses a row that names
     neither.

     A row escalated or deferred is also written into the suite's
     `## Reconciliation`, and its answer into `## Settled`: this file archives
     with the change and is folded nowhere, so a row landing only here is
     unreadable by the next blind pass.

     May be empty - empty is a claim on the record that the input settled
     everything. Never a scenario id: this file goes into the next blind pass's
     isolated input whole. -->

| Capability | Raised | Landed |
| --- | --- | --- |
| <!-- the capability whose pass asked --> | <!-- the question --> | <!-- Q<n> above, or ❓ on <page> --> |
