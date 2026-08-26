---
name: dev-help
description: "Print the workflow-skill map and suggest the next skill from this session. Invoke with /dev-help. Does not run the suggested skill."
disable-model-invocation: true
---

# Dev help

Print the note below as-is, then suggest the next skill from this session.
Do **not** run, attach, or start the suggested skill. The contributor
invokes it.

## Workflow

The delivery line, in order. Skip a step that does not apply.

| Invoke | When |
| --- | --- |
| `/pm-planning` | Requirements only: proposal and spec deltas. No design, no tasks. |
| `/full-planning` | Delivery plan: design, ui, tasks. Promote a pm-planning change, or plan one you will implement. A change with no `tasks.md` is not ready to `/implement`. |
| `/implement` | A change with tasks, or tickets with no OpenSpec store. Runs through `/tdd`. Stops at the group boundary. |
| `/parallel` | Independent implementation groups or tickets delegated to separate task worktrees with a chosen model and effort, committed atomically, then integrated and validated once. |
| `/implement-then-review` | Same as `/implement`, then `/review-changes` when the last slice is green. |
| `/tdd` | The red → green loop. `/implement` already runs the work through it; invoke when you want the loop on its own. |
| `/commit` | Local commits, `type(domain):`. Only when invoked. Chain `/pr-push` in the same message to publish. |
| `/pr-push` | Create a `<type>/<short-description>` branch (`feat/`, `fix/`, `build/`, etc.) when publishable work is on `main`, then push it and ensure an open PR. Commits dirty files that belong on the PR; irrelevant dirty files do not block. Push updated submodules before this repo. Only when invoked. Re-run; rewrite the description only when this session changed code. |
| `/review-changes` | Two-axis review (Standards and Spec) since a fixed point. |
| `/archive-change` | The change shipped (deployed, not merely merged). Fold specs in the planning store. |

## Suggest

After the note, one recommendation:

1. Read the session: what the user asked, which skills already ran, where
   the work stopped.
2. A dirty tree, unpushed commits, or an OpenSpec change still being
   planned is enough extra signal. Do not interrogate the repo past that.
3. Name **one** next skill and one sentence why. Name a second only when
   the first is a chain (`/commit` then `/pr-push`).
4. **Stop.** Do not invoke the suggested skill. Do not continue into it
   "to save a round."
