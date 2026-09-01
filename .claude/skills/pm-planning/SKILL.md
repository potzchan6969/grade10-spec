---
name: pm-planning
description: Draft an OpenSpec change that ends at the requirements - proposal and specs, no delivery plan. Use when a PM, designer, or anyone whose work finishes when the specs are right is writing a change.
---

# Draft a pm-planning change

`pm-planning` is the lane for a change that is **finished when its requirements
are**. You write the proposal and the spec deltas and stop; the engineer who
picks the work up promotes it to `full-planning` and writes the delivery plan.

## Confirm the lane first

Take this lane when your work ends at the specs. Take `full-planning` instead
when you are planning delivery now — you will write `design.md` and `tasks.md`
yourself. If that is you, stop here and use the `full-planning` skill.

When unsure, take this one. Promotion is cheap and carries the proposal and
deltas over untouched; a delivery plan invented ahead of the person who will
execute it is not.

## Steps

1. **Read from an up-to-date main.** `git fetch origin` first; when
   `git log --oneline HEAD..origin/main` is not empty, update before reading. A
   MODIFIED block copied from a stale spec silently reverts whatever landed in
   between, and an overlap scan against a stale `openspec/changes/` finds
   nothing. Then read: the capability under
   `openspec/specs/<product>/<capability>/`, every active change in
   `openspec/changes/` for overlap, and the PRD under `docs/prds/` when one
   exists. Find facts yourself — bring only decisions to the author.
2. **Interview the author.** Run the `grilling` skill's round-based frontier
   interview before drafting. Do not write the proposal until the frontier is
   empty and the author confirms shared understanding. The interview scales
   with the open questions, not the change's size: if reading left nothing
   open, say so and proceed.
3. **Create the change through the CLI.**

   ```bash
   openspec new change <change-name> --schema pm-planning
   ```

   Kebab-case. This is the step that records the schema in the change's
   `.openspec.yaml`. A directory made by hand records nothing and silently
   takes the default in `openspec/config.yaml` — which is `full-planning`.
   That is the most common way a change ends up in the wrong lane.
4. **Read the enriched instructions for each artifact as you reach it.**

   ```bash
   openspec instructions proposal --change <change-name>
   openspec instructions specs --change <change-name>
   ```

   These carry this store's own rules — the ones in `openspec/config.yaml` —
   on top of the schema's. Read them rather than working from memory.
5. **Write `proposal.md`.** Author line first
   (`**Author:** @handle - YYYY-MM-DD`, ask for the handle). Open with the
   collector problem and the evidence, not the solution. Carry a metric that
   would move if this works, and always list Non-Goals. The **Capabilities**
   section is the contract with the specs phase: every capability named there
   needs a delta file, and nothing else gets one.
6. **Write the delta specs**, one per capability the proposal named, at
   `specs/<capability-path>/spec.md` using the exact existing path for a
   modified capability.
7. **Stop.** No `design.md`, no `tasks.md`, no `ui.md`.
   `openspec status --change <change-name>` should show proposal and specs
   complete and expect nothing further.
8. **Validate.**

   ```bash
   openspec validate <change-name> --strict
   ```
9. **Generate the QA suite — this is part of finishing the lane, not a later
   favour.** Run `/spec-to-tcs <change-name>` (the `spec-to-tcs` skill) now,
   so a `test-cases.md` lands beside each delta with every case `draft`.
   `docs/governance/specs-to-test-cases.md` defines the derivation; a change
   with `skip_specs: true` has nothing to generate. Without this step the
   suite silently never exists, and QA finds out at archive day.
10. **Hand off by saying it needs promoting.** Both boards render a change
    with no `tasks.md` as "still being planned", so it is indistinguishable
    from an unfinished plan until an engineer promotes it. A promotion, not a
    message, is what puts the work in front of someone — and the suite from
    step 9 is already on `/qa`'s in-flight list for a reviewer.

## Writing the deltas

- `### Requirement: <name>` with SHALL or MUST — never should or may.
- `#### Scenario: <name>` in WHEN/THEN form. **Exactly four hashes.** Three
  hashes or a bullet fails silently: the scenario is simply not seen.
- Every requirement carries at least one scenario, and every scenario is
  checkable by a test or a manual pass.
- A **new** capability's delta opens with `## Purpose` — one or two sentences,
  50+ characters. Archive copies it into the main spec. A delta for an
  **existing** capability must not have one; it is ignored, and the capability's
  Purpose is edited in `openspec/specs/` directly.
- Never name a class, function, hook, table, or library. That is design's job.
  Public component exports are the one exception — the export name is the
  cross-repo contract, so name it, and keep the set in one requirement.
- `## MODIFIED Requirements` needs the **entire** requirement block copied from
  the main spec and then edited. Partial content loses detail at archive. When
  you are adding a concern rather than changing existing behavior, use `ADDED`.
- Money is an integer count of minor units plus an ISO 4217 code, never a float.

## Where a statement belongs

| Statement | Home |
| --- | --- |
| Anything testable | The delta spec, and nowhere else |
| Why this problem, for whom, what was ruled out, what will be measured | The PRD (`prd-authoring` skill) |
| How it will be built | Not this lane — `design.md` at promotion |
| The human story of the shipped capability | Its manual page (`manual/` in this store) — the in-flight change surfaces there automatically; the page itself is updated when the change ships |

A testable statement left in a PRD or a proposal is the failure this lane
exists to prevent: `docs/governance/prd-and-openspec.md` draws the boundary.

## Related

- `full-planning` — the other lane, and where this change goes when promoted.
- `openspec-propose` — routes between the two when the lane is not obvious.
- `prd-authoring` — for the product judgment a requirement will not preserve.
- `grilling` — the interview that precedes the proposal.
