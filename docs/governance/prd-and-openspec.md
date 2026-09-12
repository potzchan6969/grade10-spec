# PRDs and OpenSpec: the PRD first, the spec as what runs

A capability's PRD under `docs/prds/` is written first. It holds everything the product should be — what runs, what is confirmed and being built, and what nobody has confirmed — each told apart by its mark. `openspec/specs/` is the production shape: every checkable requirement of what runs today, rewritten only when a change archives. An engineer in a consuming application builds from the spec alone.

## The rule

A PRD is `docs/prds/products/<product>/<capability>.md` — the page the manual renders for that capability, and the same file for a product's landing at `docs/prds/products/<product>/index.md`. Its prose states the shape of the product in the reader's words and pictures, and never restates a requirement. Three kinds of line sit on it:

- **Unmarked** — what runs. The spec holds the checkable form of the same fact.
- **🚧** — confirmed and being built. An active change on the page's spec is delivering it, and the mark comes off when that change archives.
- **❓**, or `TBC` — what nobody has confirmed. Nothing is built from it. A long draft behind it lives under `docs/references/`, and the line cites it.

What a requirement cannot carry — who it is for, what was deliberately excluded, what will be measured, the decisions made and why, the risks — sits on the same page in a `:::detail{title="Product decisions" for="pm"}` block: collapsed under the prose, never hidden from search or a deep link. The page names its spec in its frontmatter, so the requirements sit beside the record rather than duplicated into it.

Every checkable requirement and every cross-repository contract lives in `openspec/specs/<product>/<domain>/<capability>/spec.md`, and reaches it only through a change's delta folding at archive. If a statement is testable, it belongs there; the page states the outcome in its own words and links the capability. If removing every testable statement leaves nothing worth a product-decisions block, the page needs none — write the change and the spec instead.

## Which artifact answers which question?

| Dimension | PRD (`docs/prds/`) | `openspec/changes/` | `openspec/specs/` |
| --- | --- | --- | --- |
| Primary question | What is this, what should it be, why, for whom, and what did we rule out? | What is changing, and how will it be delivered? | What runs today, checkably? |
| Primary audience | Everyone who reads the manual; the decisions block is for product managers, designers, reviewers | Whoever is delivering the change | Engineers and implementation agents in consuming applications |
| Authority | Canonical for what the product should be; its marks say which lines are not yet running. Never restates a requirement. | Canonical for the in-flight delta only, until archived | Canonical for what runs. Wins any conflict with an unmarked line. |
| Lifespan | Durable; written first, edited as intent changes, marks taken off at archive | Archived after delivery | Durable; rewritten by the fold at archive |
| Typical content | The shape in prose with its marks, journeys and cases, visuals; then users and jobs, non-goals, measurement, decisions, risks | Proposal, design, requirement deltas, journeys, suites, tasks | Requirements, scenarios, state behavior, accessibility obligations, content ownership, named component exports |
| Content to keep out | Anything testable; today's gap and the intended fix, which belong to the proposal; a long draft, which belongs under `docs/references/` | The full product narrative | Class, hook, or library names — those are `tech-design.md`'s job |

Public component exports are the exception to "no names in a spec": the export name *is* the contract between this repository and the application that implements it, so specs name it. Internal structure still belongs in `tech-design.md`.

Source material behind a decision — an owner's draft, competitor research, a vendor-integration reference — lives in [`docs/references/`](../references/README.md), which the manual renders under References; a page cites it as evidence and never defers to it.

## When to use each

| Situation | Update | Reason |
| --- | --- | --- |
| A new problem, workflow, or idea is being explored | The page: ❓ lines and rows in its decisions block, a draft under `docs/references/` | Intent is on record before anything is confirmed |
| A change is confirmed | The pages it touches first, each outcome a 🚧 line in the reader's words; then the change, whose deltas derive from those lines | The page is the roadmap the deltas are read against |
| A requirement, state behavior, accessibility obligation, or export contract changes | The page's 🚧 line, then the delta in the change | The spec moves only at archive |
| Another active change already folds the same requirement | That change is extended or superseded, never doubled | Whichever archives second reverts the first |
| A technical refactor changes no product-visible behavior | Change only, with no delta and no page edit | Nothing the product should be has changed |
| The rationale for a decision changes but the behavior does not | The page's product-decisions block | Nothing testable moved |
| A change is complete | Fold the deltas into `openspec/specs/`, take the 🚧 marks off the page, then archive | The spec must describe what runs once delivery history moves to archive |

## Maintenance workflow for future agents

### 1. Start with the PRD

Before proposing or implementing a feature, read in this order:

1. the capability's PRD in `docs/prds/`, for what runs, what is coming, and the rationale;
2. any active change in `openspec/changes/` touching that capability — every 🚧 line on the page belongs to one;
3. the capability in `openspec/specs/`, for the checkable form of what runs; and
4. the design-system primitives in `packages/design-system/src/components/`, plus the component's implementation in the consuming application, when UI is involved.

If an unmarked line and the spec disagree, the spec is right about what runs: fix the line, or mark it 🚧 or ❓ if it was stating intent.

### 2. Mark the PRD

A change starts on the pages it touches. For each, add one 🚧 line per outcome, in the reader's words and in the section the outcome belongs to; add a ❓ line or row for what the author left open; add or update the rows of the decisions block the change turns on. Then link every section the change marked from the proposal's `## References`, as `[Points · Rules](../../../docs/prds/products/grade10-site/loyalty/points.md#rules)`: the manual shows the change under that heading, and `pnpm check:manual` refuses a link to a section that does not exist. It also refuses a change carrying deltas whose links reach no 🚧 line at all; `page_waived: <why>` in the change's `.openspec.yaml` stands in for the mark. The deltas are then derived from the 🚧 lines, so a delta promising what no line marks is the delta's error.

### 3. Write requirements into the change's delta

A capability spec at `openspec/specs/<product>/<domain>/<capability>/spec.md` contains:

- a `## Purpose` naming what the capability is for and linking its page, when one exists;
- `### Requirement:` entries written so an engineer in another repository can implement them without a follow-up question; and
- `#### Scenario:` entries beneath each, every one checkable by a test or a manual pass.

The change's delta carries the same shape, and the fold at archive writes it into the spec. Do not name a class, hook, function, table, or library. Do name the public component exports a consuming application must provide, and keep them in one requirement so a contract change is easy to spot.

### 4. Record a product decision only when there is one to explain

Add or update the page's `Product decisions` block when a change turns on a product judgment that the requirement text will not preserve: why this problem, for whom, what was ruled out, what will be measured, what the risks are. The `prd-authoring` skill writes the block; the page grammar is in the manual's own guide, `docs/prds/guides/writing-the-manual.md`. Record assumptions as open items, marked ❓, rather than silently choosing product behavior.

Update the block when the target user, problem, non-goal, measurement, risk, or a recorded decision changes. Do not update it merely because a requirement changed — that is the delta's job.

Keep the block readable as a standalone decision record. Replace superseded decisions and preserve the useful rationale in its decisions table; link an archived change for detailed history rather than embedding task logs.

### 5. Create and maintain a change for approved implementation

For implementation work, create `openspec/changes/<kebab-case-name>/` with:

- `proposal.md` — scope, why now, consumer impact, non-goals, and under `## References` a link to every page section the change marked;
- `specs/<capability>/spec.md` — only the requirement deltas against `openspec/specs/`;
- `specs/<capability>/user-journeys.md` — the stories those requirements accept, or the one line `**Walked by:** nobody on their own - <why>` when no end user reaches the capability;
- `specs/<capability>/feature-tcs.md` — the suite derived from those journeys, beside every capability whose journeys file holds a story;
- `ui-design.md` — screens, exports and states, when the change alters something a user sees;
- `tech-design.md` — implementation choices, interfaces, compatibility, and validation approach; and
- `tasks.md` — small, checkable delivery steps.

Update the active change when you learn an implementation constraint, split delivery, change a component export, or add or remove a validation step. Update the page too when that constraint changed an outcome or a recorded product decision.

Only the first three are always written. A change is finished as far as its author is concerned once the requirements and their journeys are right; the engineer who picks it up adds `ui-design.md`, `tech-design.md` and `tasks.md` **to that same change**, and adds `promoted_by: @handle` to its `.openspec.yaml` so the board names them. `tech-design.md` is owed by every change carrying a task group outside this store — the repository tag on the group heading says where the work lands, and an untagged group counts; `design_waived: <why>` in the manifest stands in for it, and `pnpm check:manual` refuses a change with neither. The proposal and the deltas carry over untouched — never send them back to their author for a task list.

That is how the work reaches an engineer. The application repository has no planning shape of its own — its `openspec/` is config-only and resolves to this store — so nobody opens a change there, and a change with no `tasks.md` shows on the engineer's board as still being planned. A change whose requirements are finished but which nobody picks up is therefore invisible as ready work, however complete its specs are.

### The change's record

`.openspec.yaml` in the change directory is the record the boards and the checks read. Every key it can hold, who writes it, and what reads it:

| Key | Written by | When | Read by |
| --- | --- | --- | --- |
| `schema` | The CLI, at `openspec new change` | Always | Every reader |
| `created` | The CLI, at `openspec new change` | Always | The boards, for the planning age |
| `skip_specs: true` | The author | A change altering no product behaviour | `openspec validate` |
| `promoted_by: @handle` | The engineer picking the change up | Before `tech-design.md` and `tasks.md` | The boards |
| `page_waived: "<why>"` | The author | A change carrying deltas whose page is unmarked | `pnpm check:manual`, rule `unmarked` |
| `design_waived: "<why>"` | The engineer planning delivery | A change with work outside this store and no `tech-design.md` | `pnpm check:manual`, rule `design` |
| `deployed_at`, `deployed_env` | `pnpm plan shipped` in the application repository | At archive | `pnpm check:manual`, rule `archived` |
| `deploy_waived: "<who, why>"` | The owner, through `archive:preflight --deploy-waived` | At archive, in place of the deploy record | `pnpm check:manual`, rule `archived` |
| `tasks_waived: "<who, why>"` | The owner, through `archive:preflight --tasks-waived` | At archive, with tasks still unchecked | `archive:preflight` |
| `target`, `owner`, `owners`, `depends_on` | ❓ The manual reads them; no document says who writes them | ❓ | The boards |

A waiver is a line of text naming the decision, never `true`. A key read as absent would waive the rule it answers to, so `pnpm check:manual` refuses a record key holding anything but text.

### 6. Keep component contracts aligned

A capability spec names the exact exports a consuming application must provide. The change that alters one must:

1. preserve compatible props or explicitly document a breaking change;
2. carry the requirement delta against the capability spec;
3. name every consuming application that must adapt; and
4. land the matching implementation change in that application, with its own checks run there.

Component source lives in the application. This repository carries the contract and the design-system primitives beneath it.

### 7. Finish a change without losing context

Before archiving:

1. ensure required tasks are complete and validation is recorded — `pnpm run archive:preflight` refuses while a task is unchecked, unless `tasks_waived: <who, why>` names the decision;
2. record the deploy: `pnpm plan shipped <change-id>` in the application repository writes `deployed_at` and `deployed_env` into the change's `.openspec.yaml`. `pnpm check:manual` fails an archive dated 2026-09-12 or later that carries neither those nor `deploy_waived: <who, why>`; a change whose task groups are all tagged `(grade10-spec)` deploys nothing and owes no record;
3. fold accepted requirement deltas into `openspec/specs/`;
4. take the 🚧 marks off every line this change delivered — the line stays, flat — in the same commit as the fold, then run `pnpm check:manual`: a 🚧 line left on a page no in-flight change touches fails it, and a durable spec whose requirements changed meaning after its page was last committed warns on that page until the page catches up — by the edit it needs, or by `reviewed: <date>` in its frontmatter when it already reads right;
5. archive at `openspec/changes/archive/YYYY-MM-DD-<change-name>/`; and
6. leave links between the spec, the page, and the archive where they aid discovery.

Do not archive a change as a substitute for updating `openspec/specs/`. Archives preserve history; the spec must describe what runs.

## Fast decision guide

```text
Is it what the product should be, in the reader's words?
├─ Yes → the PRD — 🚧 where a change delivers it, ❓ where nobody has confirmed it.
└─ No  → Is the statement testable — could a test or a manual pass decide it?
         ├─ Yes → the delta in openspec/changes/, folded into
         │        openspec/specs/<product>/<domain>/<capability>/spec.md at archive.
         └─ No  → Does it explain a product judgment that outlives this change?
                  ├─ Yes → the PRD's Product decisions block.
                  └─ No  → normal repository documentation or code comments.
```
