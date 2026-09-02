# PRDs and OpenSpec: one source of truth, one product record

`openspec/specs/` is the single source of truth for what this product requires. A PRD is the capability's page in the manual under `docs/prds/`: it explains the product and the decisions behind it, and never restates a requirement.

## The rule

Every checkable requirement and every cross-repository contract lives in `openspec/specs/<product>/<domain>/<capability>/spec.md`. An engineer in a consuming application builds from that spec alone, without reading a PRD first.

A PRD is `docs/prds/products/<product>/<capability>.md` — the page the manual renders for that capability, and the same file for a product's landing at `docs/prds/products/<product>/index.md`. Its prose states the shape of the product in plain words and pictures. What a requirement cannot carry — who it is for, what was deliberately excluded, what will be measured, the decisions made and why, the risks — sits on the same page in a `:::detail{title="Product decisions" for="pm"}` block: collapsed under the prose, never hidden from search or a deep link. The page names its spec in its frontmatter, so the requirements are embedded beside the record rather than duplicated into it.

If a statement is testable, it belongs in the spec. If removing every testable statement leaves nothing worth a product-decisions block, the page needs none — write the change and the spec instead.

## Which artifact answers which question?

| Dimension | `openspec/specs/` | PRD (`docs/prds/` page) | `openspec/changes/` |
| --- | --- | --- | --- |
| Primary question | What must be true of the product today? | What is this, why did we decide it, for whom, and what did we rule out? | What is changing, and how will it be delivered? |
| Primary audience | Engineers and implementation agents in consuming applications | Everyone who reads the manual; the decisions block is for product managers, designers, reviewers | Whoever is delivering the change |
| Authority | Canonical. Wins any conflict. | Explanatory. Never authoritative over a requirement. | Canonical for the in-flight delta only, until archived. |
| Lifespan | Durable; edited in place as the product changes | Durable; edited when the product or the decision changes | Archived after delivery |
| Typical content | Requirements, scenarios, state behavior, accessibility obligations, content ownership, named component exports | The shape in prose, journeys and cases embedded from the spec, visuals; then users and jobs, non-goals, measurement, decisions, risks | Proposal, design, requirement deltas, tasks |
| Content to keep out | Class, hook, or library names — those are `design.md`'s job | Anything testable; today's gap and the intended fix, which belong to the proposal | The full product narrative |

Public component exports are the exception to "no names in a spec": the export name *is* the contract between this repository and the application that implements it, so specs name it. Internal structure still belongs in `design.md`.

Source material behind a decision — an owner's draft, competitor research, a vendor-integration reference — lives in [`docs/references/`](../references/README.md), which the manual renders under References; a page cites it as evidence and never defers to it.

## When to use each

| Situation | Update | Reason |
| --- | --- | --- |
| Exploring a new customer problem, workflow, or UI concept | The capability page's product-decisions block | The team needs outcome, scope, and rationale before choosing implementation. |
| A requirement, state behavior, accessibility obligation, or export contract changes | `openspec/specs/`, through a change | This is the source of truth; nothing else records it. |
| The team approves implementation | An `openspec/changes/` change carrying requirement deltas | Delivery needs a bounded proposal, design, deltas, and tasks. |
| A technical refactor changes no product-visible behavior | Change only, with no spec delta | No requirement and no product decision changed. |
| A discovery changes user behavior, scope, analytics, content, or accessibility | Spec delta first; update the page if the *decision* changed | The requirement is what implementers read. |
| The rationale for a decision changes but the behavior does not | The page's product-decisions block | Nothing testable moved. |
| A change is complete | Fold deltas into `openspec/specs/`, bring the page to the shipped story, then archive | The spec must describe current truth once delivery history moves to archive. |

## Maintenance workflow for future agents

### 1. Start with the spec

Before proposing or implementing a feature, read in this order:

1. the relevant capability in `openspec/specs/`;
2. any active change in `openspec/changes/` touching that capability;
3. the capability's page in `docs/prds/`, for the shape and the rationale behind what the spec requires; and
4. the design-system primitives in `packages/design-system/src/components/`, plus the component's implementation in the consuming application, when UI is involved.

If the spec and the page disagree, the spec is correct and the page is stale — fix the page.

### 2. Write requirements into the capability spec

A capability spec at `openspec/specs/<product>/<domain>/<capability>/spec.md` contains:

- a `## Purpose` naming what the capability is for and linking its page, when one exists;
- `### Requirement:` entries written so an engineer in another repository can implement them without a follow-up question; and
- `#### Scenario:` entries beneath each, every one checkable by a test or a manual pass.

Do not name a class, hook, function, table, or library. Do name the public component exports a consuming application must provide, and keep them in one requirement so a contract change is easy to spot.

### 3. Record a product decision only when there is one to explain

Add or update the page's `Product decisions` block when a change turns on a product judgment that the requirement text will not preserve: why this problem, for whom, what was ruled out, what will be measured, what the risks are. The `prd-authoring` skill writes the block; the page grammar is in the manual's own guide, `docs/prds/guides/writing-the-manual.md`. Record assumptions as open items, marked ❓, rather than silently choosing product behavior.

Update the block when the target user, problem, non-goal, measurement, risk, or a recorded decision changes. Do not update it merely because a requirement changed — that is the spec's job.

Keep the block readable as a standalone decision record. Replace superseded decisions and preserve the useful rationale in its decisions table; link an archived change for detailed history rather than embedding task logs.

### 4. Create and maintain a change for approved implementation

For implementation work, create `openspec/changes/<kebab-case-name>/` with:

- `proposal.md` — scope, why now, consumer impact, non-goals, and a link to the capability's page when one exists;
- `design.md` — implementation choices, interfaces, compatibility, and validation approach;
- `tasks.md` — small, checkable delivery steps; and
- `specs/` — only the requirement deltas against `openspec/specs/`.

Update the active change when you learn an implementation constraint, split delivery, change a component export, or add or remove a validation step. Update the page too only if that constraint changed a recorded product decision.

A change created with `--schema pm-planning` carries only `proposal.md` and `specs/`, for planning that is complete once the requirements are. It is **promoted** to `full-planning` when someone is ready to build it: set `schema: full-planning` in the change's `.openspec.yaml`, then add `design.md`, `tasks.md`, and `ui.md` when the change alters something a user sees. The proposal and the deltas carry over untouched.

Promotion is how the work reaches an engineer. The application repository has no planning shape of its own — its `openspec/` is config-only and resolves to this store — so nobody opens a change there, and a change with no `tasks.md` shows on the engineer's board as still being planned. A finished pm-planning change that is never promoted is therefore invisible as ready work, however complete its specs are.

### 5. Keep component contracts aligned

A capability spec names the exact exports a consuming application must provide. The change that alters one must:

1. preserve compatible props or explicitly document a breaking change;
2. carry the requirement delta against the capability spec;
3. name every consuming application that must adapt; and
4. land the matching implementation change in that application, with its own checks run there.

Component source lives in the application. This repository carries the contract and the design-system primitives beneath it.

### 6. Finish a change without losing context

Before archiving:

1. ensure required tasks are complete and validation is recorded;
2. fold accepted requirement deltas into `openspec/specs/`;
3. bring the capability's page to the shipped story and confirm its decisions block still describes the decision accurately, then run `pnpm check:manual`;
4. archive at `openspec/changes/archive/YYYY-MM-DD-<change-name>/`; and
5. leave links between the spec, the page, and the archive where they aid discovery.

Do not archive a change as a substitute for updating `openspec/specs/`. Archives preserve history; the spec must describe the current truth.

## Fast decision guide

```text
Is the statement testable — could a test or a manual pass decide it?
├─ Yes → it belongs in openspec/specs/<product>/<domain>/<capability>/spec.md,
│        reached through an openspec/changes/ delta.
└─ No  → Does it explain a product judgment that outlives this change?
         ├─ Yes → record it in the capability page's Product decisions block.
         └─ No  → use normal repository documentation or code comments.
```
