---
name: specs-help
description: "Print the grade10-spec workflow-skill map and suggest the next relevant skill. Use when working on OpenSpec requirements, delivery plans, applications, or archives in this repository. Does not run the suggested skill."
disable-model-invocation: true
---

# Specs help

Print the note below as-is, then suggest the next skill from this session.
Do **not** run, attach, or start the suggested skill. The contributor
invokes it.

## Workflow

The delivery line, in order. Skip a step that does not apply.

| Invoke | When |
| --- | --- |
| `/prd-authoring` | Create or revise a versioned product requirement document. |
| `/openspec-propose` | Choose the planning lane for a new OpenSpec change. |
| `/pm-planning` | Draft requirements only: proposal and spec deltas, no design or tasks. |
| `/full-planning` | Delivery plan: design, ui, and tasks. Promote a pm-planning change, or plan one you will apply. A change with no `tasks.md` is not ready to `/openspec-apply-change`. |
| `/openspec-apply-change` | Implement the tasks in an approved OpenSpec change. |
| `/commit` | Local commits, `type(domain):`. Only when invoked. Chain `/pr-push` in the same message to publish. |
| `/pr-push` | Create a `<type>/<short-description>` branch (`feat/`, `fix/`, `build/`, etc.) when publishable work is on `main`, then push it and ensure an open PR. Commits dirty files that belong on the PR; irrelevant dirty files do not block. Push updated submodules before this repo. Only when invoked. Re-run; rewrite the description only when this session changed code. |
| `/openspec-archive-change` | Finalize a completed OpenSpec change and preserve its decision history. |

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
