## Goals

- A rule names the walk it sits on, wherever that walk lives.
- A raised question cannot reach `main` without a landing.
- A designed state reaches the requirements by the route the suite reached it by.
- Each new rule finds nothing on the store today, so it is a guard on new work rather than a register nobody can clear.

## Non-Goals

- Sweeping the 492 durable and 222 in-flight `**Serves:**` lines whose prose restates the scenario heading.
- Re-anchoring any capability but `grade10-site/auction/order-status`.
- Moving the five durable suites' `## Raised` sections, which have nowhere to move to.
- A `**Trace:**` that names another capability's journey.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Whether a scenario serving only a foreign journey still owes a local anchor | No — it is reached by no case in this suite, so it is listed under `**Out of suite:**` naming the suite that walks it | Requiring a local anchor beside the foreign one, which would put a group anchor back on the rule the qualified form exists to take it off |
| Q2 | How hard to enforce "a group anchor is for a rule with no actor" | Prose only — no check can tell an actor from a derivation, and a rule stated once is cheaper than a heuristic that is wrong | A check guessing from the scenario body, which would be wrong on the derivations this store is full of |
| Q3 | Whether prose restating the scenario heading fails, warns or neither | Neither, for now — 714 lines write it today, and a warning that large buries the check's other findings | Warning on it now, which is the same sweep dressed as a register |
| Q4 | What gates the three new rules, so `main` stays green | The change carrying a `decisions.md`, the marker `decided` already uses | A date, which says nothing about whether the change was planned under these rules |
| Q5 | Whether moving `## Raised` out of the suite bumps `tcs_rules_rev` | No — no case's wording moved and no existing file is rejected, which is the test the rulebook sets | A minor bump, which would put every suite on `tcs:stale` for a section that is not a case |

## Raised

<!-- Empty: this change carries no delta, so no blind pass ran on it. -->

| Capability | Raised | Landed |
| --- | --- | --- |
