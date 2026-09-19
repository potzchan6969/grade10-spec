---
name: tech
description: Run a round on a change's tech-design.md - the decisions, the data model, the contracts and the risks - before the requirements are drawn from it. Use when an engineer picks a change up. Invoke as /tech <change>.
---

# The Engineer's Design Round

**The artifact:** `tech-design.md`, drawn from the page sections the change
links, the proposal, the decisions and the journeys. It is drawn before the
requirements, and the requirements are drawn from it.

**The rules:** `planning-dev` - what the file holds and what stays out of it -
plus:

```bash
openspec instructions tech-design --change <change>
```

Then follow `round`: it holds the six steps, the readers, the questions, the
landing and the re-read.

## What the Round Adds Here

- **One reader, four readings** — deterministic, resilient and observable;
  simple and clear; consistent, modular and built on later; testable and
  buildable, argued together by the one dispatch of `tech.md`. Each finding
  names one of the eight principles in
  [`docs/governance/system-design.md`](../../../docs/governance/system-design.md),
  and a finding that names none is not carried
- **The rejected option, every time** — a decision says what it was chosen
  over; a reader argues the option it dropped
- **A mechanism is the home of a mechanism** — a finding naming one lands here,
  not in the requirement drawn from it; a product detail lands on the page
  first
- **`design_waived: <why>`** — a change whose task groups all land in this
  store may waive the file, and nothing after it waits on a waived artifact
