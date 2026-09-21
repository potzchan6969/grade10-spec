---
name: dev-help
description: "Print the delivery line and the design-to-code router, then suggest the next skill from this session. Invoke with /dev-help. Does not run the suggested skill."
disable-model-invocation: true
---

# Dev help

Kept until the team has adopted the line commands (`Q84` of
`run-a-round-on-every-artifact`). The tables below are the pre-workflow
line, printed as they stood; the line today is `/workflow-plan` to
`/workflow-land`, tabled in `AGENTS.md`.

Print both tables below as-is, then suggest the next skill from this session.
Do **not** run, attach, or start the suggested skill. The contributor
invokes it.

## Workflow

The delivery line, in order. Skip a step that does not apply. `Invoke` names
the skill in the application repository; `Here` names it in this one, where the
OpenSpec skills carry the same steps under different names. A row whose example
is a bare slash command only starts that way — that skill does not answer a
sentence.

| Invoke | When | Here | Example |
| --- | --- | --- | --- |
| `/planning-pm` | Proposal, the journeys beside each capability, and the spec outline that fixes the anchor set. Where every change starts. Stop there — a change with no `tasks.md` is not ready to `/implement`. | Same. | "Write the proposal and journeys for watchlist notifications — specs only, no tasks." |
| `/planning-qa` | The two readings of that anchor set — the blind `feature-tcs.md` and the scenarios — their reconciliation, review with `/tcs-review`, plus the domain, product and platform suites. | Same. | "Derive the test cases for `add-auction-watchlist`." |
| `/planning-design` | `ui-design.md`: screens to Figma frames, exports named exactly, states tied to scenarios. | Same. | "Write the UI design for the watchlist drawer." |
| `/planning-dev` | `tech-design.md` and `tasks.md` on a change somebody else specified, or one you author yourself. | Same. | "Plan delivery for `auction-auto-bidding`; I am implementing it." |
| `/implement` | A change with tasks, or tickets with no OpenSpec store. Runs through `/tdd`. Stops at the group boundary. | `/openspec-apply-change`. | "Implement the tasks in `auction-auto-bidding`." |
| `/implement-then-review` | Same as `/implement`, then `/review-changes` when the last slice is green. | No equivalent; `/openspec-apply-change`, then review by hand. | `/implement-then-review auction-auto-bidding` |
| `/tdd` | The red → green loop. `/implement` already runs the work through it; invoke when you want the loop on its own. | Same. | "Build the bid-increment helper test-first." |
| `/reconcile-figma-annotations` | Interactive, evidence-pinned review of spec-owned Figma annotation drift, selective acceptance, verification, and optional local commit. | Same. | "Review spec-owned Figma annotation drift." |
| `/commit` | Local commits, `type(domain):`. Only when invoked. Chain `/pr-push` in the same message to publish. | Same. | `/commit` |
| `/pr-push` | Create a `<type>/<short-description>` branch (`feat/`, `fix/`, `build/`, etc.) when publishable work is on `main`, then push it and ensure an open PR. Commits dirty files that belong on the PR; irrelevant dirty files do not block. Push updated submodules before this repo. Only when invoked. Re-run; rewrite the description only when this session changed code. | Same. | `/commit` then `/pr-push`, one message |
| `/spec-push` | Land the branch here: rebase onto `main`, settle conflicts by reading the change, merge the PR. A change reaches the application repo only once it is on `main`. | Same. | `/spec-push` |
| `/review-changes` | Two-axis review (Standards and Spec) since a fixed point. | No equivalent; review by hand. | `/review-changes` since the branch point |
| `/archive-change` | The change shipped (deployed, not merely merged). Fold specs in the planning store. | `/openspec-archive-change`. | "The proxy-bidding change is deployed — archive it." |

## Design to code

Off the delivery line, and not a sequence — pick by what you are touching. All four sit on the boundary with Figma; only `/page-from-figma` treats that side as the source, and the rest keep both live, so a genuine disagreement becomes an OpenSpec change rather than an edit. Each one ends by handing back to the line above, usually at `/implement`.

| Invoke | When | Example |
| --- | --- | --- |
| `/page-from-figma` | A page or screen drafted in Figma becomes code composed from existing blocks, primitives, and tokens. Invoke it *before* any `get_design_context` on a page-level frame. | "Implement this Figma screen: figma.com/design/…?node-id=42-118" |
| `/design-system-primitives` | A primitive's variants, sizes, or states, or its Code Connect template. The Figma component set is the contract; a component may not offer a rung the design does not define. | "Add a `destructive` variant to Button." |
| `/design-tokens` | A token value moved — pull a designer's change in, rebuild the theme CSS, push values back. Never hand-edit the generated CSS. | "Design moved the primary colour — pull it in and rebuild the theme CSS." |
| `/design-sync-check` | `design-sync:check` failed, the nightly reported drift, or Dev Mode is emitting something wrong. Triage what it printed. | "`design-sync:check` is failing — triage what it printed." |

## Email

| Invoke | When | Example |
| --- | --- | --- |
| `/email-templating` | Compose or revise a React Email template, shared email component, preheader, CTA, or email-safe styling. | "Draft the outbid email for the auction notification." |

A contract change found this way is still an OpenSpec change: name the exact exports and the consuming applications, then rejoin at `/planning-pm`.

## Suggest

After the note, one recommendation:

1. Read the session: what the user asked, which skills already ran, where
   the work stopped. Either table is in play — a session that has been
   editing a primitive or a token wants the design skill, not the next
   step on the line.
2. A dirty tree, unpushed commits, or an OpenSpec change still being
   planned is enough extra signal. Do not interrogate the repo past that.
3. Name **one** next skill and one sentence why. Name a second only when
   the first is a chain (`/commit` then `/pr-push`).
4. **Stop.** Do not invoke the suggested skill. Do not continue into it
   "to save a round."
