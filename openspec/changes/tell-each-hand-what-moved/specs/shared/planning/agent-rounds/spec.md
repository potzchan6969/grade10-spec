# shared/planning/agent-rounds Specification

## Purpose

How an artifact is read again — extended: what a hand is told moved before
their artifact, which moves hold the next landing, and what makes an artifact
fresh.

## Feature set

- Read again
  - What moved, quoted: each hand a landing reaches is told what moved before their artifact, unit by unit, before and after
  - One message per person: one message per person per landing lists every artifact of theirs it reached and which of them it holds
  - Major holds, small is told: a major move holds every landing drawn from it until its hand reads it again; a small one holds only the fold and stays on the hand's list
  - Fresh is a hand's word: an artifact is fresh because its hand landed or read it, never because a later commit touched the file
  - A taken recommendation is no move: an answer that takes the recommendation moves nothing; one that overturns it is major
  - Behind on the surfaces: Told now, the chip and My turn quote what moved and say whether it holds

## ADDED Requirements

### Requirement: What moved is quoted to every hand it reaches

When a landing moves something before an artifact, each hand whose artifact it
reaches SHALL be told what moved, quoted before and after, one unit at a time:
a `## Decisions` row by its `Q<n>`, a `### Requirement:` block, a case under
its id, each `##` section less those, and the preamble before the first
heading; a text whose units cannot be told apart, or whose before cannot be
recovered, SHALL be told as one whole move. Each person SHALL receive one
message per landing listing every artifact of theirs it reached, and which of
them it holds; a role the change names nobody for SHALL be told in its
channel.

<!-- trace:scenario id=g10.shared-agent-rounds.SC-mv1 rev=1 -->
#### Scenario: shared-planning-agent-rounds-SC-114 - The message quotes the decision before and after
**Serves:** shared-planning-agent-rounds-US-17 - the designer reads the moved decision in the message

- **GIVEN** a designer whose `ui-design.md` was read again against `decisions.md`
- **WHEN** a landing rewrites the Decided cell of `Q3` in `decisions.md`
- **THEN** the designer's message names `decisions` `Q3` with its Decided cell before and after
- **AND** no other unit of `decisions.md` is quoted

<!-- trace:scenario id=g10.shared-agent-rounds.SC-mv2 rev=1 -->
#### Scenario: shared-planning-agent-rounds-SC-115 - One message per person, listing every artifact it reached
**Serves:** shared-planning-agent-rounds-US-17 - a hand of two artifacts is told once

- **GIVEN** one handle is the designer and the engineer of a change
- **WHEN** a landing moves a decision both `ui-design.md` and `tasks.md` are drawn from
- **THEN** that handle receives one message naming both artifacts
- **AND** the moved unit is quoted once
- **AND** a re-run of the same push sends nothing twice

### Requirement: A major move holds, a small one is told

A move SHALL be major unless it sits in the small set: the proposal's `## Why`
section, a decision row's Asked and Instead of cells, the ❓ wrapper put on
around a recommendation, and punctuation not touching a digit. A major move
SHALL hold every landing drawn from it until the hand of the behind artifact
lands it or reads it again; a small move SHALL hold no landing, SHALL hold the
fold, and SHALL stay on the hand's My turn and in the digest until read.

<!-- trace:scenario id=g10.shared-agent-rounds.SC-mv3 rev=1 -->
#### Scenario: shared-planning-agent-rounds-SC-116 - A small move lets the next landing through
**Serves:** shared-planning-agent-rounds-US-18 - the engineer lands past a reworded Why

- **GIVEN** an engineer whose `tasks.md` was read again against the proposal
- **WHEN** the proposal's `## Why` is reworded and the engineer lands a task group
- **THEN** the landing is not refused
- **AND** `tasks.md` is listed on the engineer's My turn as a small move until read
- **AND** `archive:preflight` refuses while it stays behind

<!-- trace:scenario id=g10.shared-agent-rounds.SC-mv4 rev=1 -->
#### Scenario: shared-planning-agent-rounds-SC-117 - A major move holds until it is read
**Serves:** shared-planning-agent-rounds-US-19 - nothing is built on an unread decision

- **GIVEN** `ui-design.md` was read again against `decisions.md`
- **WHEN** a decision row's Decided cell changes and a later artifact's landing runs
- **THEN** `plan:land` refuses it, naming `ui-design`, the moved `decisions` `Q<n>` and the designer
- **AND** once the designer reads it again with `plan:land <change> ui-design --reviewed`, the landing goes through

### Requirement: Fresh is a hand's landing or read

An artifact SHALL be fresh when its `reviewed:` line holds the content id of
what is before it now, and every artifact landing SHALL write that line on the
hand's word; a tick SHALL NOT write it. An artifact with no line SHALL be read
as behind everything before it, whole and major; a commit date SHALL NOT make
an artifact fresh or behind. `plan:land --reviewed` SHALL land on the
artifact's hand's word, as any landing does, and SHALL refuse a read again
said by anybody but that hand.

<!-- trace:scenario id=g10.shared-agent-rounds.SC-mv5 rev=1 -->
#### Scenario: shared-planning-agent-rounds-SC-118 - An artifact landing writes its own line
**Serves:** shared-planning-agent-rounds-US-19 - the hand's landing is the hand's read

- **GIVEN** a designer lands `ui-design.md` on their word
- **WHEN** the landing commit is cut
- **THEN** the record carries `reviewed: ui-design: <id>` with the content id of what is before it on `main` with the landing laid over it
- **AND** no other artifact's line is written

<!-- trace:scenario id=g10.shared-agent-rounds.SC-mv6 rev=2 -->
#### Scenario: shared-planning-agent-rounds-SC-119 - A read again is its hand's word
**Serves:** shared-planning-agent-rounds-US-19 - a read again is said by the hand

- **GIVEN** a committer who is not the artifact's hand
- **WHEN** it asks to land a read again
- **THEN** `plan:land` refuses it, naming whose word it waits on

### Requirement: An answer that takes the recommendation is no move

A Decided cell SHALL be compared without its ❓ wrapper, its `recommended:`
and its attribution from the closed set `decided by the round`, `the round's
word` and `<role>'s word`; an answer that takes the recommendation SHALL move
nothing, and one that overturns it SHALL be major. No answer SHALL mark any
draft read on its own.

<!-- trace:scenario id=g10.shared-agent-rounds.SC-mv7 rev=1 -->
#### Scenario: shared-planning-agent-rounds-SC-120 - A taken recommendation moves nothing, an overturned one holds
**Serves:** shared-planning-agent-rounds-US-19 - an overturned recommendation is read before it is built on

- **GIVEN** `Q1` held at `❓ pm - recommended: Every hand` and every draft read again against it
- **WHEN** `Q1` is answered `Every hand - the owner's word`
- **THEN** nothing is behind
- **AND** when it is answered `One hand - the owner's word` instead, every artifact drawn from the decisions is behind, major, quoting `Q1` before and after

### Requirement: The surfaces say what moved and whether it holds

The Behind message SHALL be keyed `<change>:behind:<handle or role>`; Told now
SHALL show the same message, the Behind chip SHALL name what moved and whether
it holds the next landing, and My turn SHALL list each of the reader's behind
artifacts under To read again until they land it or read it again.

<!-- trace:scenario id=g10.shared-agent-rounds.SC-ts1 rev=1 -->
#### Scenario: shared-planning-agent-rounds-SC-128 - The chip and My turn say whether a move holds
**Serves:** shared-planning-agent-rounds-US-18 - the hand sees what is waiting on their read

- **GIVEN** a change whose `tasks.md` is behind a reworded `## Why` and whose `ui-design.md` is behind a changed decision
- **WHEN** the change page and My turn are read
- **THEN** the `tasks.md` chip says the move is small and holds only the fold
- **AND** the `ui-design.md` chip says it holds the next landing
- **AND** both are listed under To read again on their hands' My turn
