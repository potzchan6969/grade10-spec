# shared/planning/agent-rounds Specification

## Purpose

How an artifact is written — extended: how a journey, scenario or case id is
issued once across every open change.

## Feature set

- Ids
  - Issued by a command: the next journey, scenario or case id, or the next letter beside one, is printed by `spec:issue` from the branch and the fetched `main`
  - Moved by a command: a branch's ids `main` already holds move above it with `spec:issue move`, every citation inside the change with them
  - Cases at every level: the `issued` check holds a case number at every suite level, by its readable id and its trace id
  - Acceptance reads main: acceptance refuses an id the fetched `main` holds before a fingerprint names it
  - One trace id per record: a scenario or case copied into a second change keeps the trace id it holds

## ADDED Requirements

### Requirement: An id is issued by a command from the branch and the fetched main

`pnpm run spec:issue` SHALL print the next journey `US-<n>` or scenario `SC-<n>`
of a capability's prefix, the next case `TC<m>` of a journey at any suite
level, or the next unused letter beside a named id, reading the branch's tree
and the fetched `main` together and printing the commit of `main` it read.
`spec:issue move <change>` SHALL move each id the change issues that `main` as
the branch would leave it already holds — a journey or scenario its delta adds
under `## ADDED`, or a case under another trace id — above every id of its
kind and prefix, journeys first so a journey's cases move with it, rewriting
every spelling of each moved id inside the change and nothing outside it.

<!-- trace:scenario id=g10.shared-agent-rounds.SC-mv8 rev=1 -->
#### Scenario: shared-planning-agent-rounds-SC-121 - The next id is one past what the branch and main issue
**Serves:** shared-planning-agent-rounds-US-20 - the hand takes an id neither the branch nor main holds

- **GIVEN** a capability whose scenarios on the branch and on `main` end at scenario 12
- **WHEN** `pnpm run spec:issue <prefix> SC` runs
- **THEN** it prints scenario 13 of that prefix and the commit of `main` it read

<!-- trace:scenario id=g10.shared-agent-rounds.SC-mv9 rev=1 -->
#### Scenario: shared-planning-agent-rounds-SC-122 - A branch landing second moves its own ids
**Serves:** shared-planning-agent-rounds-US-21 - the second branch renumbers a draft nothing else cites

- **GIVEN** `main` holds a change issuing scenario 1, journey 1 and case 1 of journey 1 of a capability
- **WHEN** a branch's change issuing the same three runs `pnpm run spec:issue move <change>`
- **THEN** its scenario becomes scenario 2, its journey journey 2 and its case case 1 of journey 2
- **AND** every citation inside the change, its tasks and its suite's `**Trace:**` lines among them, names the new ids
- **AND** the change on `main` is untouched

### Requirement: The issued check holds cases and names the command that moves ids

The `issued` check SHALL refuse a case number another place issues under
another trace id, at every suite level, comparing the readable id with its
`<v>` stripped; a case carried with its own trace id SHALL pass. Every
`issued` refusal SHALL name `pnpm run spec:issue move <change>`.

<!-- trace:scenario id=g10.shared-agent-rounds.SC-mt1 rev=1 -->
#### Scenario: shared-planning-agent-rounds-SC-123 - A case number issued twice is refused
**Serves:** shared-planning-agent-rounds-US-21 - the landing names the id main holds and the command that moves it

- **GIVEN** two open changes each issuing the same case number of one journey, one in a feature suite and one in a domain suite, under two trace ids
- **WHEN** `pnpm check:manual` runs
- **THEN** it refuses the case, naming the other change and `pnpm run spec:issue move <change>`
- **AND** a case carried into a second change under its own trace id is not refused

### Requirement: Acceptance reads the fetched main

`pnpm run accept:preflight` and `pnpm run spec:accept` SHALL refuse a change
that issues an id the fetched `main` holds elsewhere, naming the id, who holds
it and `pnpm run spec:issue move <change>`, before a fingerprint is written.

<!-- trace:scenario id=g10.shared-agent-rounds.SC-mt2 rev=1 -->
#### Scenario: shared-planning-agent-rounds-SC-124 - An id another change landed first refuses acceptance
**Serves:** shared-planning-agent-rounds-US-21 - an acceptance never names an id somebody else took

- **GIVEN** a change accepted on its branch whose scenario id another change has landed on `main`
- **WHEN** `spec:accept` runs
- **THEN** it refuses, naming the id and the change holding it on `main`, and writes no acceptance

### Requirement: A carried record keeps its trace id

`trace init` on a scenario or case SHALL reuse the trace id its readable id
already holds in the durable specs or an open change, matched on the readable
id with a case's `<v>` stripped and never on the heading's text, and SHALL
refuse one whose readable id is held elsewhere with no marker or under more
than one.

<!-- trace:scenario id=g10.shared-agent-rounds.SC-mt3 rev=1 -->
#### Scenario: shared-planning-agent-rounds-SC-125 - A copied case keeps its trace id
**Serves:** shared-planning-agent-rounds-US-22 - a test that accepts the case goes on accepting it

- **GIVEN** a durable case at revision 1 under a trace id
- **WHEN** its revised copy at revision 2 in an open change is initialised
- **THEN** its marker carries the durable case's trace id
