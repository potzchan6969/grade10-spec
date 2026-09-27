# Cross-Sell Walkthrough

One feature — the cards shown under a card in the store, `add-store-cross-sell`
— walked through every role of the planning workflow on 2026-09-21 and 22, with
an agent standing in for each hand and the run collecting what each step cost
and where it caught. The illustrated version is the
[walkthrough page](https://claude.ai/artifact/RRrhtNCREemYurRHHmcmjv); this
document is the text of record. The change it led to is
`address-each-hand-in-the-round`; the product change proceeds on its own.

## Where the Feature Stood

- **Rounds** — 14, one row each in the change's `rounds.md`.
- **Decision rows** — 44, nine held for a hand, the rest decided by the round.
- **Findings** — about 330 across the run, about half stood.
- **Agents** — about 90 dispatched: readers, verifiers, blind passes, eight
  hand reads.
- **Groups 1 to 4** — built and ticked, the rail block in the store and the
  rule, the read and the page in the application repository.
- **Group 5** — the manual pages ticked; the suite's Manual table waits for the
  walk to run.
- **Group 6** — the walk written, one test per case the fixture reaches, not
  run: its lane needs a Docker daemon the environment lacked.
- **Group 7** — waits on the frame from design.
- **Nothing landed on `main`** — the owner merges; every round's row was
  written through the library rather than `plan:land`.

## Each Role

**Product manager.** Ten questions in one round, three confirming the
obvious, two contradicting each other, one asserting a wrong fact with
"accept as is". The guide's worked example was the feature being planned with
the answers given. Nobody asked whether to do the feature at all. Decided rows
were mostly right; four were not the round's (when to ship, a product judgment
a reader itself flagged, the journey split, a row that bought component work).
Addressed too late: rounds 10 to 14 edited the pages without a word to the
product manager, and a build round landed a product line as decided by the
round. Two to fifteen minutes per read; eighty for the 30-scenario spec beside
a 24-case suite.

**Designer.** A design record with no frame is an inventory; four readers and
four verifiers argued layout nobody had drawn, then asked the designer to
approve it. The wait on a frame is the one line the check refuses once the
file exists. The Components table earned its round. Five minutes on the
summary, thirty checking components the round could have checked.

**Tech PIC.** Could not build from the file alone: a wire type named that did
not exist as named, a card's facets with no source, an unnamed call. A reader
that never opens the repository finds naming problems, not type problems —
proved twice more in the build. Five readers is two too many: four of five
filed the same finding. Forty minutes, thirty checking three sentences.

**QA.** The blind pass raised eight questions, seven the scenarios had not
answered, and exposed a contract widening that forced two more capabilities
into the change. Nobody addressed QA for six rounds after the suite went
pending-review; the first row came from build readers tripping on a rule in
the application repository, and asked QA to consent to the engineer's tick
rather than to start the review. Twenty-five minutes, fifteen cross-reading
tests against cases.

**Engineer.** Five of 44 plan findings earned their cost. The walk's manual
shape is forced by a validator no engineer will guess. The summary must carry
the resulting shape quoted, the contract changes separated from the round's
log, the cost of each recommendation, the files touched outside the group and
the branch state; it must not carry counts where the test asserts a list, a
menu of another hand's moves, or a `corrected` no commit holds. The group 6
read found two helper defects six readers and six verifiers missed. Twenty to
thirty minutes per group.

**The run.** Per build group: six readers, six verifiers, one hand read, 48 to
60 findings, about an hour of wall clock, ten to twenty minutes for the fix
pass. The cost sits in the overlap, and one verifier per group means nobody
reconciles two verifiers' opposite verdicts but the run, which decided twelve
splits. A fresh clone could not install (SSH submodules), a container restart
killed three readers, a spend cap killed five verifiers and a model outage
five re-dispatches; three verdicts came from a fallback model the row could
not name.

## What the Readers Caught

- **A test proving the converse of its scenario** — the comment cited the id,
  the assertion proved the neighbouring bullet; four readers caught it from the
  GIVEN alone.
- **The picks identifier folded into the shared product fragment** — every
  listing read carried the complementary list, the thing the design rejected
  by name; one reader opened the query file whole.
- **A held copy that never refreshed** — an optional call did not evaluate its
  argument, so a card-serving isolate froze.
- **A committed API document drifted** — the per-package verify could not see
  it; the lane, not the package, is the verify.
- **Two crossed test citations** — in the suite's Manual table and a round's
  tests cell, written from memory of which lane proved what.
- **The fold's mechanics** — a Manual table outside the reconciliation is never
  read by the archive's preflight; an out-of-suite line counts only in the
  header; scenario ids in reasons are stripped at archive.
- **Missing-seed skips** — the fixture is the tree's own and the picks are one
  metafield on it, so the picks journey walks in lane.

## What Refused

| Where | What happened | Workaround |
| --- | --- | --- |
| References resolve | A page-first landing for a new capability fails: no delta yet. | The page landed without `spec:`. |
| `awaiting: ui-design` | The guide says write the wait and the file; the check refuses a wait on a written artifact. | A dated line in the design's prose. |
| Two prefixes on one capability | Another change issues short-form ids on a spec whose durable ids are long-form. | None; recorded. |
| MODIFIED collision | Two in-flight changes modifying one requirement. | Widenings written as ADDED; the scenarios still contradicted, unread by any check. |
| Journey vocabulary | The validator refuses the store's own role "stock keeper". | "stock keeper on the shop's staff". |
| The walk's flip | A Decided-by path cannot resolve outside the store. | Every case stays manual with a Manual row. |
| `plan:land --tests` | Refuses a path the store holds no file at. | Rows written through the library. |
| Verify lines | The plan named lanes the backend does not define. | Corrected at the first claim. |
| Reader dispatch on prose | Every `apply` perspective is `always`. | Briefs translated each reading. |
| A shared checkout | A reader restored three files under the other readers. | Tree restored; briefs pin a commit. |

## What Changed and What Followed

Applied on the day: the round's conduct in
[Round Summary and Landing](../governance/round-summary.md), pointed at from
the round skill, the build skill and the verifier. Everything else — a QA step,
the pages as the product manager's own artifact, `when:` triggers on the apply
block, the gates corrected, the record's application paths, one verifier per
round, the walk's ids checked — is `address-each-hand-in-the-round`.

## Cost

| Step | Readers | Verifiers | Findings | Hand minutes |
| --- | --- | --- | --- | --- |
| PM artifacts | reader, simpler | per group | ~20 | 17 |
| Design | 4 | 3 to 4 | ~25 | 35 |
| Tech design | 5 | 5 | 50 | 40 |
| Requirements | two blind readings | reconciliation | 8 raised | 80 |
| Plan | 4 | 4 | 44 | 30 |
| Build, per group (×6) | 6 | 6 | 48 to 60 | 20 to 30 |

Hand minutes are the simulated teammates' own estimates. ❓ The numbers are
one walkthrough's; a second change through the workflow confirms or moves
them.
