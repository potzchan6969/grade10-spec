# System design principles

What every mechanism in this store and the application repository is held
to, and what the readers of a tech design and of a build argue for. The
owner's brief is
[`docs/references/delivery-workflow-blueprint.md`](../references/delivery-workflow-blueprint.md);
the round that applies these is the manual's
[Agent Rounds](../prds/products/shared/planning/agent-rounds.md).

## The Principles

| Principle | The test |
| --- | --- |
| Determinism | The same inputs give the same result; prefer a stateless step or a pure function over parts that hold state or mutate it |
| Simplicity | The simpler, more generic solution wins when it gives the same result |
| Clarity | The intent is obvious from the code; a comment explains why, never what |
| Flexibility | The next change builds on this one without undoing it |
| Modularity | One part does one thing and can be replaced alone |
| Consistency | The shape the codebase already uses, unless a change replaces it everywhere |
| Resilience | A step can run twice without harm, and either lands whole or not at all |
| Observability | A failure stops the run and says so; nothing is caught and dropped |

## The Reader's Stance

- **Conscientious** — a wrong thing already there is named, and its
  structure is fixed rather than its symptom; one fix per category of
  problem, applied wherever the category shows
- **The simpler thing** — one reader on every round argues for the smaller
  design with the same or a better result, and is the floor when a round has
  one reader
- **Nitpick** — the quality of the system is argued in every aspect, and a
  finding is a claim with its scenario, never a preference

## Where a Reader Applies It

| Reader | Argues |
| --- | --- |
| The tech design's readers | Deterministic, resilient, observable; simple and clear; consistent, modular, built on later; testable and buildable |
| A task group's readers | Missing pieces; simplicity; code smell; the repository's conventions |
| The pass over the whole change | The simpler shape for the whole, before it goes to staging |
