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

- A new Slack surface; the messages go where `stage-changes-and-notify-hands`
  sends them.
- Changing the eight artifacts or their order.
- Landing the walkthrough's product change (`add-store-cross-sell`), which
  proceeds on its own.
- Rewriting the readers' stance or the eight principles.
- A second verifier where one round summoned one reader.

## Decisions

| Id | Question | Decision | Instead of |
| --- | --- | --- | --- |
| Q1 | Is a held row for another hand posted in the round's summary or as its own message? | Its own message to that hand, carrying the row, the sentence it would put on the page and the decision rows it touches quoted - the owner's word (2026-09-22) | One summary addressed to every hand, with a footer telling each to type land |
| Q2 | When a build round lands a product line on a page, does it reach the product manager as decided or as ❓? | As ❓, with the page's line quoted before and after; a page's own hand alone decides a line on it - the owner's word | Decided by the round with an Instead of the product manager may overturn |
| Q3 | Who asks QA to review the suite, and when? | The landing of the requirements addresses QA; the walk group names the review as its input, and the plan's instruction says so - the owner's word | QA asked when a build reader trips on a rule; QA never asked |
| Q4 | How many questions does the interview ask? | Two or three that change what is built, one of them whether to do it now; the defaults the round applies are listed as decided by the round - the owner's word | The whole frontier in one round |
| Q5 | Which readers read a task group that lands prose? | The reader of words and QA, plus the floor; the `apply` block carries `when:` triggers like an artifact's list - the owner's word | Six readers, four of them code readings, briefed into prose by hand |
| Q6 | One verifier per group of findings, or one over the round's readings? | One over the round's readings, so one finding filed by several readers is verified once and no two verdicts disagree unseen; a round of one reader still verifies itself - the owner's word | A cross-group dedupe before verify, keeping one verifier per group |
| Q7 | How does a row name a test in the application repository? | With the repository before the path; the landing resolves a path outside this store through the submodule's pin, and refuses one the pin holds no file at - the owner's word | Rows for application groups written outside the command |
| Q8 | Does a landing check that a cited test carries the id it is credited for? | Yes, for every path in the `--tests` cell and every test a suite's Manual row names - the owner's word | Trusting the summary |
| Q9 | What does a group whose lane did not run write? | `written, not run` first in its row, its tasks unticked, its walk's rows conditional in the suite - the owner's word | The walk's coverage in the indicative with a hedge in the preamble |
| Q10 | Does the references rule count a proposal that names a new capability? | Yes, as the marks rule counts a proposal linking the page - the owner's word | The page landing without its `spec:` until the delta exists |
| Q11 | May a written design wait on its frame? | Yes: `awaiting: ui-design` names what is missing inside a written artifact, and the check refuses only a wait on nothing - the owner's word | The wait as a dated line in the design's prose |
| Q12 | Are scenarios compared across in-flight deltas on one requirement? | Yes: two deltas on one requirement whose scenarios state opposite outcomes for one GIVEN are refused, however each is headed - the owner's word | Refusing only two MODIFIED blocks |
| Q13 | Where is a suite's Manual table refused? | Where it is written: outside `## Reconciliation`, a scenario id as a reason, no `**Out of suite:**` header line - the owner's word | At the fold |
| Q14 | Does the application repository check a walk's ids? | Yes: `pnpm plan` refuses a bracketed case id whose case is still draft, the rule `tcs-to-e2e` states - the owner's word | The sentence in the skill alone |
| Q15 | Is a reader or verifier that ran on a fallback model named? | Yes, in the row's perspectives cell as `<name> (fallback)`; the reader definitions name the fallback - the owner's word | Nothing said |

## Raised

| Capability | What the reading raised | Row |
| --- | --- | --- |
