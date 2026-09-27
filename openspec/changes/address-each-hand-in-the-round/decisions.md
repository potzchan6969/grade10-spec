## Goals

- A hand reads one message that is theirs and answers it in a sentence, with
  every fact the answer needs quoted in it.
- QA is asked to review the suite the day it lands, and the walk names that
  review as its input.
- A row lands through the command whichever repository its tests are in, and
  a cited test carries the id it is credited for.
- A round's cost is the readings that disagree: readings verified together,
  prose read by the reader of words.
- A gate refuses only what is wrong.

## Non-Goals

- A new message kind or a new Slack surface; the held row and the page
  question are the round's own replies, and QA is told by the message every
  hand gets.
- Changing the eight artifacts or their order.
- Landing the walkthrough's product change (`add-store-cross-sell`), which
  proceeds on its own.
- Rewriting the readers' stance or the eight principles.
- A second verifier where one round summoned one reader.
- Flipping a case to automated on a test outside this store; a case proved
  only in the application repository stays manual, and its Manual row names
  the walk.

## Decisions

| Id | Question | Decision | Instead of |
| --- | --- | --- | --- |
| Q1 | Where does a held row addressed to another hand go? | As the round's own reply in the change's thread, mentioning that hand, keyed on the change, the round and the row so a re-run posts it once; it carries the row, the sentence it would put on the page and the decision rows it touches, quoted - the owner's word (2026-09-22) on the shape, the round's word on the carrier, taking `stage-changes-and-notify-hands`' Q31 recommendation that the round's replies are this capability's; the owner's answer to Q31 governs | A seventh message kind on `change-stages`; one summary addressed to every hand |
| Q2 | When a build round lands a product line on a page, does it reach the product manager as decided or as ❓? | As ❓, with the page's line quoted before and after; a line added quotes nothing before, a line removed quotes nothing after; the routing to a ❓ line is already `run-a-round-on-every-artifact`'s, and what this change adds is the quoting - the owner's word | Decided by the round with an Instead of the product manager may overturn |
| Q3 | Who asks QA to review the suite, and when? | QA is a hand of Specified: the landing of the requirements is a move to QA, told by the turn message every hand gets, naming the suite, its case count and `/tcs-review`; the walk group names the review as its input - the owner's word on the timing, the round's word on the shape, extended in `stage-changes-and-notify-hands`' Hands table, no new kind | QA asked when a build reader trips on a rule; a `review` message kind |
| Q4 | How many questions does the interview ask? | About three, none trivial, each changing what is built and one of them whether to do it now; the defaults the round applies are listed as decided by the round - the owner's word | The whole frontier in one round; a fixed two or three |
| Q5 | Which readers read a task group that lands prose? | The reader of words, QA and the simpler thing; the `apply` block carries `when:` triggers like an artifact's list - the build's four readings on `code`, a changed line in any file that is neither markdown nor a message catalog, the reader of words on `copy`, a catalog's line among them, QA and the simpler thing always - and `code` joins the `when` table and the manual's trigger list - the owner's word | Six readers, four of them code readings, briefed into prose by hand; a `page` trigger beside `copy` |
| Q6 | One verifier per group of findings, or one over the round's readings? | One over the round's readings, so one finding filed by several readers is verified once and no two verdicts disagree unseen; a round of one reader still verifies itself; the three statements in `run-a-round-on-every-artifact`'s delta are moved there, not contradicted beside it - the owner's word | A cross-group dedupe before verify, keeping one verifier per group |
| Q7 | How does a row name a test in the application repository? | Bare, as every path is: the group's repository tag says where its paths live, as the tick already reads it; the landing resolves an application group's paths in the clone it runs beside - `--app-root`, or the clone the store's superproject names - and refuses a path that clone holds no file at, or a landing that reaches no clone - the round's word, on the owner's ask that the row lands through the command | `<repository>:<path>` before each path, and `(unresolved)` where nothing resolves |
| Q8 | Does a landing check that a cited test carries the id it is credited for? | Yes: one grep in `scripts/openspec/lib/`, the id bounded so `SC-1` never matches `SC-12`; a `--tests` path that carries no such scenario id is refused, and a Manual row whose named test resolves in this store and carries no such case id is refused where the suite is validated, skipped where the path is not this store's - the owner's word | Trusting the summary; a substring; a warning |
| Q9 | What does a group whose lane did not run write? | `written, not run` first in its row's stood cell, through `--unrun`; the group's tasks stay unticked and the suite's Manual rows that name the walk stay conditional until the run that ran the lane writes the row that says so; nothing refuses the tick - the owner's word | The walk's coverage in the indicative with a hedge in the preamble; a tick refused from a record clause |
| Q10 | Does the references rule count a proposal that names a new capability? | Yes: the changing set is built from each change's `specs/<capability>/` directories as well as its deltas, where it is built; a directory the archive finds no delta for is refused by the fold as today - the owner's word | The page landing without its `spec:` until the delta exists; a parser over the proposal's prose |
| Q11 | May a written design wait on its frame? | Yes: `awaiting: ui-design` names what is missing inside a written artifact; the branch that refused a wait on a written artifact goes, since a wait naming nothing is already refused where the record is read - the owner's word | The wait as a dated line in the design's prose |
| Q12 | Are deltas compared across in-flight changes on one requirement? | Yes: the overlap rule stops skipping ADDED blocks, so two in-flight deltas that fold one requirement are named to each other whatever their headings, and a person reads the two; a change that extends an in-flight requirement does so in that change's delta - the owner's word | Refusing only two MODIFIED blocks; scenario-by-scenario opposites read through a table of negations |
| Q13 | Where is a suite's Manual table refused? | Where it is written: a `### Manual` outside `## Reconciliation` is refused when a suite carrying a reconciliation is validated, and the fold's strip covers the Manual rows; a scenario id in a reason stays allowed while the change is open, and the out-of-suite header is already owed by coverage - the owner's word | At the fold; three shapes gated on the change's directory |
| Q14 | Does the application repository check a walk's ids? | Yes: `pnpm plan done` reads every bracketed case id in the group's end-to-end files and refuses one whose case is not `actual` in the store clone the registry names, in the pass that already looks for a task's scenario ids - the owner's word | The sentence in the skill alone; a `check-walk` command |
| Q15 | Is a reader or verifier that ran on a fallback model named? | Yes, in the row's perspectives cell as `<name> (fallback)` and in the summary's perspectives line, written from the model the run reports; the fallback is `sonnet` unless the definition already names it; the landing accepts that suffix alone - the owner's word | Nothing said; a `fallback:` key in each definition |
| Q16 | What does the round do with a dispatch the vendor killed? | Retries it once on the fallback; a reader still missing stops the round before the summary and the thread is told which reader it lacks; no row lands short a reader - the round's word (2026-09-22) | Landing with the readers that answered; retrying until the cap |
| Q17 | One change, or the four gates as their own? | One change: the gates were met in the same walkthrough, share its pull request, and each extends a check that exists; they get their own journeys - the round's word | Two changes, the gates first |
| Q18 | Whose is a page a round edits? | The change's product manager, whatever product the page belongs to - the round's word | The page's product's manager, looked up |
| Q19 | Does a task group land while a ❓ the round put on the page is open? | Yes: a page question holds nothing; the line stays ❓ until its product manager answers - the round's word | Held like a decisions row |
| Q20 | What mark does an answered page line carry? | 🚧 until the change that delivers it archives, whose fold takes the mark off - the round's word | None; ❓ kept |
| Q21 | Whom does the requirements' landing address when the record names no QA? | The QA channel, as the turn message already does for an unnamed hand; the walk group names the review as its input still - the round's word | Nobody |
| Q22 | Which walk ids does the tick refuse? | Any whose case is not `actual`: draft, deprecated, or one the suite does not issue - the round's word | Draft alone |
| Q23 | What does a conditional Manual row read, and who rewrites it? | `to be walked in <test>`, in the row's own words; the run that ran the lane rewrites the rows to what the walk reached; the validator reads the rows as prose in both states - the round's word | A key on the row |
| Q24 | Is a hand with no move in a round told the round happened? | No - the round's word, as Told once already says | A message saying nothing is theirs |
| Q25 | May a teammate answer a question addressed to another hand? | No: the reply is refused naming whose word it waits on, as a land is - the round's word | Taken as that hand's |
| Q26 | What does `not now` to the do-it-now question do? | The change stays Proposed with a written wait on its product manager, and nothing is drafted ahead until they lift it - the round's word | Withdrawn; parked in a lane of its own |
| Q27 | When four or more choices change what is built, what is asked? | The ones that change it most, about three, by the round's judgement; a further one the held test holds is a held row in the draft's summary, never a default; the rest applied as defaults and listed so, overturned by one reply - the owner's word | A second interview round; every choice past three a default |
| Q28 | When the sentence leaves nothing else open, is one question asked alone? | Yes: whether to do it now, alone; the round pads nothing - the round's word | Two questions always |
| Q29 | Does a fallback reach the hand? | In the row and in the summary's perspectives line - the round's word | The row alone |
| Q30 | Is a dissenting reader's verdict kept where one finding is verified once? | The verifier's row quotes each reader's fix where they differ; one verdict - the round's word | One verdict, the dissent dropped |
| Q31 | Where does the walk group's rule live in the manual's checks? | Beside the plan's other content-shape rules, in `planned.mjs`, read through the outline - decided by the round | `record.mjs`, whose rules each stand in for a key of the record |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| shared/planning/agent-rounds | Blind pass: When a round adds a line where the page had none, or removes one, what is quoted as before and after? | Q2 |
| shared/planning/agent-rounds | Blind pass: Whose is a page when the change's product manager and the page's differ? | Q18 |
| shared/planning/agent-rounds | Blind pass: Does a task group land while a ❓ the round put on the page is open? | Q19 |
| shared/planning/agent-rounds | Blind pass: What mark does an answered page line carry, and does the group's landing take it off? | Q20 |
| shared/planning/agent-rounds | Blind pass: Whom does the requirements' landing address when the record names no QA? | Q21 |
| shared/planning/agent-rounds | Blind pass: Does the tick refuse a walk id the suite does not issue, or a deprecated one, or only a draft? | Q22 |
| shared/planning/agent-rounds | Blind pass: Does a path with no repository named mean this store, and may one row mix repositories? | Q7 |
| shared/planning/agent-rounds | Blind pass: What does a conditional walk row read, who rewrites it, and does the validator accept both states? | Q23 |
| shared/planning/agent-rounds | Blind pass: Is a hand with no move told the round happened? | Q24 |
| shared/planning/agent-rounds | Blind pass: May a teammate answer a question addressed to another hand? | Q25 |
| shared/planning/agent-rounds | Blind pass: What does `not now` do to the change, the record and the thread? | Q26 |
| shared/planning/agent-rounds | Blind pass: When four or more choices change what is built, which are asked? | Q27 |
| shared/planning/agent-rounds | Blind pass: When nothing else is open, is the do-it-now question asked alone? | Q28 |
| shared/planning/agent-rounds | Blind pass: Does a fallback reach the hand in the summary, or only in the row? | Q29 |
| shared/planning/agent-rounds | Blind pass: Is a dissenting reader's verdict kept where one finding is verified once? | Q30 |
| shared/planning/agent-rounds | Verifier: which system carries the held row and the page question, with `change-stages`' message kinds closed? | Q1 |
| shared/planning/agent-rounds | Verifier: are the four gates their own change? | Q17 |
