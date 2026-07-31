# PRDs and OpenSpec: different artifacts, one product record

This repository keeps PRDs and OpenSpec deliberately separate. They are complementary formats, not interchangeable copies of the same document.

## Which format answers which question?

| Dimension | PRD | OpenSpec |
| --- | --- | --- |
| Primary audience | Product managers, designers, reviewers, and consuming-app teams | Engineers and implementation agents |
| Primary question | Why should we build this, for whom, and what experience/outcome is required? | What must change in the system to deliver the approved requirement? |
| Lifespan | Durable feature context; updated as product decisions evolve | Active change record; archived after the implementation ships |
| Canonical location | `docs/prds/<product-area>/<feature>.md` | Current contracts: `openspec/specs/<capability>/spec.md`; active deltas: `openspec/changes/<change-name>/` |
| Typical content | Problem, goals, non-goals, flows, UX states, content, accessibility, analytics, rollout, consuming-app impact | Proposal, technical design, requirement deltas, component/API compatibility, implementation tasks, validation |
| Detail to avoid | App-internal architecture, task breakdowns, and code-level choices | Repeating the entire product narrative, research, or visual rationale |
| Completion signal | The outcome and acceptance criteria are understandable without reading code | The tasks, design, and requirement deltas are implemented, verified, and ready to archive |

## Source-of-truth rule

The PRD is the canonical explanation of the product decision. OpenSpec is the canonical record of an implementation change and the durable requirement contracts it updates.

An OpenSpec proposal must link its PRD. It may summarize the user outcome to orient implementers, but it must not duplicate the PRD section-by-section. Conversely, a PRD may link a change for delivery status but must not become an engineering task tracker.

## When to use each format

| Situation | Update | Reason |
| --- | --- | --- |
| Exploring a new customer problem, workflow, or UI concept | PRD | The team needs outcome, scope, and experience clarity before choosing implementation. |
| The team approves implementation of an existing PRD | OpenSpec change | Engineering needs a bounded proposal, design, deltas, and tasks. |
| A technical refactor changes no product-visible behavior | OpenSpec only | No product decision changed. |
| A code discovery changes user behavior, scope, analytics, content, or accessibility | PRD first, then OpenSpec | The product decision changed and the implementation record must follow it. |
| A requirement becomes a long-lived cross-app contract | `openspec/specs/` and link from the PRD | Consumers need a stable, implementation-readable contract. |
| A change is complete | Sync durable specs, confirm the PRD, then archive the change | The current contract and product record must remain useful after delivery history moves to archive. |

## Maintenance workflow for future agents

### 1. Start with product context

Before proposing or implementing a feature, agents must read:

1. the relevant document in `docs/prds/`;
2. related contracts in `openspec/specs/`;
3. any active changes in `openspec/changes/` that touch the same capability; and
4. the design-system primitives in `packages/design-system/src/components/`, and the component's implementation in the consuming application, when UI is involved.

If no PRD exists and the request changes a user experience or product policy, create one from [`docs/prds/_template.md`](../prds/_template.md). Record assumptions as open questions rather than silently choosing product behavior.

### 2. Maintain the PRD when the product decision changes

Update the PRD whenever a change affects any of the following:

- target user, problem statement, goal, or non-goal;
- user flow, visible state, copy, responsive behavior, or accessibility behavior;
- acceptance criterion, measurement, rollout, or risk;
- reusable UI component contract or the set of consuming applications.

Keep the PRD readable as a standalone decision record. Replace superseded decisions and preserve useful rationale in the Decisions and open questions table; link an archived OpenSpec change for detailed history instead of embedding task logs.

### 3. Create and maintain an OpenSpec change for approved implementation

For implementation work, create `openspec/changes/<kebab-case-name>/` with:

- `proposal.md` — scope, why now, direct PRD link, consumer impact, and non-goals;
- `design.md` — implementation choices, interfaces, compatibility, and validation approach;
- `tasks.md` — small, checkable delivery steps; and
- `specs/` — only requirement deltas from current durable contracts.

An agent must update the active change when it learns an implementation constraint, splits delivery, changes a component export, or adds/removes a validation step. It must update the linked PRD too if that constraint changes the user-facing promise.

### 4. Keep component contracts aligned

When a PRD requires a reusable component, name it in the PRD's UI component contract table. The related OpenSpec change must identify the exact export, the compatibility impact, and the application that implements it. Component source lives in that application; this repository carries the contract and the design-system primitives beneath it.

Any agent changing a public component contract must:

1. preserve compatible props or explicitly document a breaking change;
2. update the PRD if the visible component behavior changed;
3. update the active OpenSpec change's design/tasks and delta spec as appropriate; and
4. land the matching implementation change in the consuming application, with its own checks run there.

### 5. Finish a change without losing context

Before archiving an OpenSpec change:

1. ensure required tasks are complete and validation is recorded;
2. fold accepted requirement deltas into `openspec/specs/`;
3. verify the linked PRD describes the delivered user-visible behavior and consumer impact;
4. archive the change at `openspec/changes/archive/YYYY-MM-DD-<change-name>/`; and
5. leave links between the PRD, durable spec, and archive where they aid future discovery.

Do not archive a change as a substitute for updating the PRD or durable specs. Archives preserve history; the PRD and `openspec/specs/` must describe the current truth.

## Fast decision guide

```text
Does the request change what a user, designer, or consuming app expects?
├─ Yes → create/update the PRD.
│        Is implementation being planned or performed?
│        ├─ Yes → create/update a linked OpenSpec change.
│        └─ No  → PRD only; record open questions and decisions.
└─ No → Does it change a durable engineering contract or delivery plan?
         ├─ Yes → OpenSpec only.
         └─ No  → use normal repository documentation or code comments.
```
