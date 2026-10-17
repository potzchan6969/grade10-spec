# shared/planning/agent-rounds Specification

## Purpose

How an artifact is written — extended: which raised questions hold
acceptance, and where a question about a look waits.

## Feature set

- Questions
  - One held test: a question raised by a reading or met by the round is held when it moves scope, is costly to undo, needs a fact only a person has, or divides its options by more than a task group of work; a contradiction between the readings is always held
  - Raised rows close: QA2 closes every Raised row the held test does not hold on its recommendation, decided by the round, naming its source
  - A look waits on the designer: a question about a look waits in one designer's change per capability, and the feature ships an interim from the store's existing blocks and tokens

## ADDED Requirements

### Requirement: QA2 closes a raised row the held test does not hold

The blind reading SHALL still raise every point its input did not settle,
each Raised row carrying its options and `recommended: <option>`. QA2 SHALL
close each row the held test in `workflow-round` does not hold on its
recommendation, as a `Decisions` row written `<answer> - decided by the
round` naming its source, with the answer in the suite's `## Settled`; rows
one source settles SHALL share one `Q<n>`. Only a held row SHALL stay open and
hold acceptance, a contradiction between the two readings SHALL always be
held, and `accept-review` SHALL list each closed row with its source.
Acceptance SHALL name each open row with its recommendation and whose answer
it waits on.

<!-- trace:scenario id=g10.shared-agent-rounds.SC-mt4 rev=1 -->
#### Scenario: shared-planning-agent-rounds-SC-126 - A recommendation settles a raised row nobody needs to answer
**Serves:** shared-planning-agent-rounds-US-23 - only a held question waits on a person

- **GIVEN** a blind reading raising one row that moves scope and one a written recommendation settles
- **WHEN** QA2 reconciles the two readings
- **THEN** the second row lands on a `Q<n>` written `<answer> - decided by the round` naming its source
- **AND** only the first stays open, and `accept:preflight` names it with its recommendation

### Requirement: A question about a look waits in one designer's change

A question about a look — a breakpoint, a token, a label, a loading, empty,
error or edge treatment, a frame or a story — SHALL NOT hold a feature's
acceptance. The feature SHALL ship an interim built from the store's existing
blocks and tokens, written as the shipped state in its `ui-design.md`, and the
question SHALL wait in one designer's change per capability, through
`awaiting: ui-design` naming the designer with `hands: design` set and no
`awaiting: specs`; the feature SHALL name no dependency on it.

<!-- trace:scenario id=g10.shared-agent-rounds.SC-mt5 rev=1 -->
#### Scenario: shared-planning-agent-rounds-SC-127 - A look question waits under the designer's name
**Serves:** shared-planning-agent-rounds-US-24 - the engineer builds the interim while the look is open

- **GIVEN** a feature whose empty state's look is unanswered
- **WHEN** its plan is accepted
- **THEN** its `ui-design.md` names the interim empty state built from existing blocks
- **AND** the question waits in the designer's change for that capability, listed under the designer on Pending
