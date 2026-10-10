# Planning and Review Efficiency

Accepted by @htonyl on 2026-10-09 after the Claude Code review of
`add-auction-internal-bid`. These rules retain independent readings and the
acceptance gates while reducing repeated discovery.

## Review Scope

- **First review** - Use an independent reader and cover every acceptance
  check. Read changed requirements beside affected durable rules, including
  unchanged rules that consume the changed outcome.
- **Rerun** - A fresh reader is independent of the authors, not obliged to
  repeat unchanged work. Pass the prior ledger, its reviewed revision, the
  repair diff and affected dependencies. Verify open findings and changed
  dependencies; carry unchanged verified findings with their source revision.
- **Full review** - Review in full when no usable prior ledger or revision
  exists, the scope changes beyond recorded coverage, or dependencies cannot
  be bounded. Record the reason. A wording repair alone does not require it.
- **Expansion** - Use the manifest's scoped source expansions. Missing page
  metadata expands verified linked pages for that capability and uses the
  bounded owner search below; it never invents a canonical page path. An overlap expands
  the shared requirement and its owners. A global indexing failure retains
  full-source fallback. Older manifests without scoped entries use
  `expandToFullSources` conservatively.
- **Related contracts** - Review rules that create orders, send letters,
  release stock or derive outcomes from a changed fact, even when those files
  are outside the delta. A narrow rerun must still follow changed dependencies.

## Evidence and Gates

| Evidence | Owner | Reuse Boundary |
| --- | --- | --- |
| Review manifest and strict structural check | Dev before QA2; reviewer when stale or absent | Exact indexed source state and durable baseline |
| Case and scenario dispositions | QA2 | Frozen anchors and reconciled source state |
| Acceptance preflight | Planning coordinator before review | Exact plan, durable baseline and overlapping work |
| Current-tree manual check | Planning coordinator before review | Exact checked tree |
| Acceptance baseline | Planning coordinator before acceptance | Refresh if inputs or baseline changed |

- **Receipts** - Save command, exit status, source identity, baseline identity
  and output path. Reuse only when all relevant inputs match. A commit SHA
  alone is insufficient for a dirty tree; missing identity means run the gate.
  The manifest's `sourceIdentity` covers review indexing inputs only. It is
  not a cache key for acceptance or manual gates, which read additional
  sources and checker code.
- **Outputs** - Capture each command once and filter the saved output. The
  current-tree manual check and the acceptance preflight's folded-tree manual
  check cover different states; neither replaces the other.
- **QA2 handoff** - Return anchor coverage, case/scenario dispositions,
  uncovered items, raised decisions and draft status with source locations.
  Acceptance review checks this evidence and changed or unresolved items;
  it does not repeat every settled pairwise reconciliation. Missing or
  inconsistent evidence expands the affected suite.
- **No early verdict** - A blocked preflight stops review. A reused receipt
  never supplies a Ready verdict; the independent reader owns that judgment.

## Planning Restarts

- **Freeze** - Record the content digest and input paths for each capability's
  journey set and feature-set roots. Record shared decisions, design inputs
  and domain-suite dependencies beside them.
- **Affected readings** - An anchor edit restarts both QA1 and Dev in fresh
  contexts for the changed capability and dependent capabilities or higher
  suites. Preserve unchanged readings only when their full input identities
  and independence evidence still match. Uncertain dependencies restart the
  whole run.
- **Blind inputs** - Give QA1 a separate snapshot containing only the inputs
  allowed by [Specs to Test Cases](specs-to-test-cases.md#the-isolated-input).
  Strip reconciliation, scenarios and design dispositions before dispatch.
  Use read restrictions when the worker harness supports them. A working
  directory or prompt is not an access restriction. Discard a reading that
  opens excluded sources and rerun it from the clean snapshot.
- **Integration** - QA2 reconciles changed readings and their affected
  dependencies against the complete anchor set. Preserve settled answers;
  batch repair requests by source owner before the next review.

## Searches and Handoffs

- **Review packet** - Gather changed requirements, corresponding durable
  sections, linked page sections, overlap ownership and QA2 evidence together.
  Keep source paths and revisions so the reader can expand a disputed fact.
  Batch independent reads; do not dump unrelated full files to save a call.
- **Find the owner** - Run one grouped search across affected durable specs,
  linked PRDs and overlapping changes. Inspect implementation once only when
  it changes the finding or repair. If ownership remains undefined, record
  the missing contract instead of repeating broader searches. A new concrete
  dependency justifies another targeted read.
- **Coordinator state** - Carry decisions, current revisions, receipts,
  ownership and remaining findings. At about 40 model calls, and each 20
  thereafter, replace broad history with a compact handoff at a stable stage
  boundary. Prefer completion notifications to fixed polling. Do not replace
  a user-owned chat without authorization.
- **Dispatch** - Give each worker its role, source snapshot, owned outputs and
  remaining decisions. Link the owning skill instead of copying its procedure.
  Rebase and settle the source revision before dispatching a reviewer.

## Evidence and Evaluation

The sampled session contained 2 completed acceptance reviews and 1 aborted
attempt: 103 unique assistant calls and 15.73 million recorded input tokens,
including 15.26 million cache reads. The latest review used about 7m 50s of
active time; its 3h 59m elapsed time included a session-limit interruption.
Worker output usage was incomplete, so it is excluded. These are recorded
context-traffic counts, not billing amounts or predicted savings.

- **Correctness benchmark** - Replay the reviewed repair revision
  `111fa74448aca560bee81e7b262c45b465fe4d92`. The reviewer must still detect that
  the house-win rule suppresses an order while the durable winner-order
  contract creates one. Also test an unchanged ledger, a local wording repair,
  missing page metadata and a changed cross-capability dependency.
- **Measurements** - Compare unique model calls, recorded input and cache
  traffic, active time, elapsed time and findings against the same source
  revision. Separate quota waits from execution. No runtime savings are
  claimed until a comparable replay passes the correctness benchmark.
- **Automation boundary** - Scoped expansion is emitted by review preflight.
  Receipt reuse, dependency selection, packet assembly and compact handoffs
  are coordinator procedures. Automatic receipt caching, dependency graphs
  and harness-enforced QA1 access remain automation work; do not describe
  these instructions as enforcement supplied by the repository.
