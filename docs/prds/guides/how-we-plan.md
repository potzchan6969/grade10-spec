---
title: How we plan
summary: Durable specs say what is true, changes say what is moving, git says what is done.
order: 3
---

Four artifacts, and nothing else to keep in sync.

**PRDs** say what the product should be, in the reader's words. One page per
capability under `docs/prds/`: unmarked where it runs, 🚧 where a change is
delivering it, ❓ where nobody has confirmed it. A PRD is written first and
moves first — whoever learns a product detail writes it there before the spec,
the design or the code that depends on it — and the PM keeps it whole.

**Durable specs** say what the platform does today. One file per capability,
written as requirements a person can check, each with the scenarios that accept
it. A spec is present tense: if it says a member's points expire, that is a
claim about the running system, not a plan.

**Changes** say what is moving. A change carries why it is worth doing and a
delta against each spec it touches — the requirements it adds, modifies or
removes — never a rewritten copy of the whole file. That is what lets several
changes touch one capability without any of them silently reverting another.

**Tasks** are a checklist inside the change, and a task is done when its box is
ticked in git. There is no board. It is also why this manual can be honest
about progress without anybody updating it: a PRD shows the changes
whose deltas touch its spec, with tasks done over total, read straight out of
the store.

A change is archived only once it has actually shipped — its delta folded into
the durable specs, the change filed under the archive. Merging a pull request
deploys nothing, so archiving asks the application repository whether the code
is live, not whether the branch is closed.

One change passes through four teammates. A PM writes the proposal, the specs,
the journeys and the feature test cases derived from them, and stops; QA
reviews those suites and owns the wider ones; a designer maps the screens;
the engineer who picks the work up adds the tech design and the tasks — to the
same change, never a second one. [Working a change](/guides/working-a-change)
walks one feature through all four.

## The rules themselves

- [PRDs and OpenSpec](https://github.com/9gag/grade10-spec/blob/main/docs/governance/prd-and-openspec.md)
  — where a product brief stops and a spec starts.
- [Task ownership](https://github.com/9gag/grade10-spec/blob/main/docs/governance/task-ownership.md)
  — who claims what, and what a stale claim looks like.
- [Specs to test cases](https://github.com/9gag/grade10-spec/blob/main/docs/governance/specs-to-test-cases.md)
  — how a scenario becomes something QA can run.
- [Worktree development](https://github.com/9gag/grade10-spec/blob/main/docs/governance/worktree-development.md)
  — running several changes at once without them colliding.
- [An agent workflow, end to end](https://github.com/9gag/grade10-spec/blob/main/docs/governance/agent-workflow-example.md)
  — the whole loop worked through once.

[In Flight](/in-flight) is the live view of all of it.
