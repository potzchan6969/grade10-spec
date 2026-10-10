---
name: openspec-workflow
description: The OpenSpec product specification workflow - the eight-artifact grade10-planning schema, the PM, design and dev planning hand-offs, acceptance, amendment and archive of a change, and how a PRD line becomes an OpenSpec delta. Use when a product feature needs an OpenSpec change, when writing or reviewing a change's artifacts, or when accepting or archiving one. Not needed to build from a PRD alone.
---

# OpenSpec workflow

Use this when a product feature needs an OpenSpec change. A feature confirmed from its PRD in `docs/prds/` and its design in Storybook can be planned and built without one.

One workflow schema exists under `openspec/schemas/`: `grade10-planning`, the whole lifecycle in eight artifacts. `openspec new change <name>` records it in the change's `.openspec.yaml`. The CLI is `@fission-ai/openspec@1.8.0`; `pnpm openspec …` runs it with no global install.

| # | Artifact | Written by | Skill | Required |
| --- | --- | --- | --- | --- |
| 1 | `proposal.md` | Product manager | `planning-pm` | Always |
| 2 | `decisions.md` | Product manager | `planning-pm` | Always — goals, non-goals, what the interview settled |
| 3 | `specs/<capability>/user-journeys.md` | Product manager | `planning-pm` | Always — a capability nobody walks says so in it |
| 4 | `ui-design.md` | Designer, or the PM with the design | `planning-design` | Optional — from the journeys |
| 5 | `tech-design.md` | Dev in the integrated planning run | `planning-dev` | Every implementation change outside this store — or `design_waived: <why>` |
| 6 | `specs/<capability>/spec.md` | QA1 outline, Dev scenarios | `planning-dev` | Always — anchors first, scenarios after QA1 and tech design |
| 7 | `specs/<capability>/feature-tcs.md` | QA1 cases, QA2 reconciliation | `planning-dev` | Always — blind draft cases before scenarios |
| 8 | `tasks.md` | Dev in the integrated planning run | `planning-dev` | Before acceptance and implementation |

`planning-pm`, `planning-design` and `planning-dev` are current and independently usable. `workflow-*` are next-version wrappers: they may invoke planning skills and add instructions, but planning skills must not depend on them. Keep planning procedures in `planning-*` until adoption.

The PM writes 1 to 3, and a designer adds 4 where needed. One `/planning-dev` invocation takes frozen anchors through fresh QA1 blind cases, independent Dev technical design, scenarios and tasks, then fresh QA2 reconciliation. The same human resolves requirement, design and plan questions. After a ready `accept-review` and a passing `pnpm accept:preflight <change>`, accept once with `pnpm spec:accept <change> --baseline <digest> --reviewed-by <human>`. Acceptance publishes requirements before implementation without marking cases approved or executed. An amendment names `--supersedes <old-fingerprint>` and preserves earlier snapshots. The first claim records its durable baseline; archive reconciles its target scope with the current contract, and semantic differences name evidence. Archive makes no second fold; deployment never waits for it. After deployment, human QA classifies cases with `/tcs-review` and uses `/tcs-run-sheet` for manual execution. Every key the change's `.openspec.yaml` can carry is tabled in [`docs/governance/prd-and-openspec.md`](../../../docs/governance/prd-and-openspec.md#the-changes-record).

The PRD is the exception to teammates. It is the source of truth for what the product should be, so a product detail learned anywhere — a designer's state, an engineer's constraint, a QA case that exposes an unwritten rule, a delta that says more than the PRD — lands on the PRD first, marked 🚧 or ❓, by whoever learned it, before the artifact that depends on it. A product detail is a line the reader would act differently without — a value, a set they meet, an outcome they see, a decision — and one 🚧 line carries an outcome however many scenarios prove it; what each teammate learns beyond that stays in its own artifact, tabled in [`docs/governance/prd-and-openspec.md`](../../../docs/governance/prd-and-openspec.md#what-does-not-go-on-the-prd). The product manager keeps the PRD whole.

The journeys are their own file beside each `spec.md`, never a `## User journeys` section inside it — `pnpm check:manual` refuses a delta that holds one, and the archive copies the file across beside the feature set. Every capability has the file: the journeys, or the one line `**Walked by:** nobody on their own - <why>` for a policy, a package contract, a convention, or a surface only the product's makers reach. That line routes the capability's anchors to its feature set; it does not excuse it a suite.

For a new product feature:

1. Read the capability's PRD in `docs/prds/`, the active OpenSpec changes on its spec, and the capability in `openspec/specs/`.
2. Mark the pages the feature touches: one 🚧 line per outcome, ❓ on what is still open, and the decisions the feature turns on. An active change already folding the same requirement is extended or superseded, never doubled.
3. Write the requirements as an OpenSpec change carrying deltas derived from those lines against `openspec/specs/<product>/<domain>/<capability>/spec.md`, linking every page it marked. Its proposal must identify affected component exports and consumer apps.
4. Use the `prd-authoring` skill when the feature turns on a product judgment the requirement text will not preserve — why this problem, for whom, what was ruled out, what will be measured. It lands in the PRD's `Product decisions` block; skip it when there is no such judgment.
5. Accept and publish the finished contract before implementation. Keep task checkboxes accurate as work lands; after implementation is verified, take the 🚧 marks off delivered outcomes and archive under `openspec/changes/archive/YYYY-MM-DD-<change-name>/`. The archive preserves history and does not fold requirements a second time.

Read [`docs/governance/agent-workflow-example.md`](../../../docs/governance/agent-workflow-example.md) for one feature walked through both repositories, from `openspec new change` to archive.
