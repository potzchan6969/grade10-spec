---
name: dev-help
description: "Print the delivery line and the design-to-code router, then suggest the next skill from this session. Invoke with /dev-help. Does not run the suggested skill."
disable-model-invocation: true
---

# Dev help

Print both tables below as-is, then suggest the next skill from this session.
Do **not** run, attach, or start the suggested skill. The contributor
invokes it.

## Workflow

The delivery line, in order. Skip a step that does not apply.

| Invoke | When |
| --- | --- |
| `/pm-planning` | Requirements only: proposal and spec deltas. No design, no tasks. |
| `/full-planning` | Delivery plan: design, ui, tasks. Promote a pm-planning change, or plan one you will implement. A change with no `tasks.md` is not ready to `/implement`. |
| `/implement` | A change with tasks, or tickets with no OpenSpec store. Runs through `/tdd`. Stops at the group boundary. |
| `/implement-then-review` | Same as `/implement`, then `/review-changes` when the last slice is green. |
| `/tdd` | The red → green loop. `/implement` already runs the work through it; invoke when you want the loop on its own. |
| `/commit` | Local commits, `type(domain):`. Only when invoked. Chain `/pr-push` in the same message to publish. |
| `/pr-push` | Create a `<type>/<short-description>` branch (`feat/`, `fix/`, `build/`, etc.) when publishable work is on `main`, then push it and ensure an open PR. Commits dirty files that belong on the PR; irrelevant dirty files do not block. Push updated submodules before this repo. Only when invoked. Re-run; rewrite the description only when this session changed code. |
| `/spec-push` | Land the branch here: rebase onto `main`, settle conflicts by reading the change, merge the PR. A change reaches the application repo only once it is on `main`. |
| `/review-changes` | Two-axis review (Standards and Spec) since a fixed point. |
| `/archive-change` | The change shipped (deployed, not merely merged). Fold specs in the planning store. |

## Design to code

Off the delivery line, and not a sequence — pick by what you are touching. All four sit on the boundary with Figma; only `/page-from-figma` treats that side as the source, and the rest keep both live, so a genuine disagreement becomes an OpenSpec change rather than an edit. Each one ends by handing back to the line above, usually at `/implement`.

| Invoke | When |
| --- | --- |
| `/page-from-figma` | A page or screen drafted in Figma becomes code composed from existing blocks, primitives, and tokens. Invoke it *before* any `get_design_context` on a page-level frame. |
| `/design-system-primitives` | A primitive's variants, sizes, or states, or its Code Connect template. The Figma component set is the contract; a component may not offer a rung the design does not define. |
| `/design-tokens` | A token value moved — pull a designer's change in, rebuild the theme CSS, push values back. Never hand-edit the generated CSS. |
| `/design-sync-check` | `design-sync:check` failed, the nightly reported drift, or Dev Mode is emitting something wrong. Triage what it printed. |

A contract change found this way is still an OpenSpec change: name the exact exports and the consuming applications, then rejoin at `/full-planning`.

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
