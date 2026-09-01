# admin-console/visual-standard Specification

## Purpose

What an operator console looks like: the one component vocabulary every admin
surface renders, how a brand's identity reaches surfaces that carry no brand
design of their own, and the terms a third-party runtime is held to when it
sits under a production surface. It governs appearance and the vocabulary that
produces it, never what an operator may do — that is the products' own
capabilities.

## Feature set

- One vocabulary, admin-wide
  - Single supplier: every admin surface renders one component vocabulary, and no surface mixes two
  - Shared surfaces unforked: a component customers also see keeps one definition
- Brand identity survives
  - One theming mechanism: a brand's identity reaches admin surfaces through one stated mechanism
  - Two brands, one console: the same console under two brands differs only by that mechanism
- Nothing already won is lost
  - Semantics preserved: the async, confirmation, and selection semantics hold after the swap
  - Operator-visible parity: what an operator can read and reach does not regress
- The runtime is held to terms
  - Stated floor: the runtime's version discipline is fixed rather than left to a range
  - A way back: reverting is a described route, not a rediscovery

## User journeys

### visual-standard-US-01: Operator moves between consoles in one shift

**As an** operator,
**I want** every console I open to arrange the same kinds of fact the same way,
**so that** moving between nine of them costs me no re-reading.

**Accepted by:**

- `visual-standard-SC-01` — Two consoles render one vocabulary
- `visual-standard-SC-03` — A shared surface appears as its console does
- `visual-standard-SC-06` — An operator reads the same states after the swap

### visual-standard-US-02: Operator recognises which brand they are administering

**As an** operator who administers both brands,
**I want** each console to look like the brand it belongs to,
**so that** I never act on one brand's data believing it is the other's.

**Accepted by:**

- `visual-standard-SC-04` — Two brands render one console
- `visual-standard-SC-05` — A brand's identity has one source

## ADDED Requirements

### Requirement: Every admin surface renders one component vocabulary

Admin surfaces SHALL render their components from a single vocabulary, and an
admin surface SHALL NOT compose components from two vocabularies. The
vocabulary is Astryx: the console package's blocks compose it, the product
console surfaces compose those blocks, and both application shells are built
from it. Where a needed component has no counterpart in that vocabulary, the
console package SHALL provide it composed from what the vocabulary does offer,
so a gap never becomes a second supplier.

#### Scenario: visual-standard-SC-01 - Two consoles render one vocabulary

- **WHEN** two admin consoles render the same kind of control
- **THEN** both render it from the same vocabulary
- **AND THEN** no admin surface renders a component from a second vocabulary

#### Scenario: visual-standard-SC-02 - A vocabulary gap is filled once

- **WHEN** an admin surface needs a control the vocabulary does not offer
- **THEN** the console package provides it, composed from that vocabulary
- **AND THEN** no surface reaches outside the vocabulary for it

### Requirement: A surface customers also see keeps one definition

A component rendered by both an admin application and a customer surface SHALL
keep one definition serving both. It SHALL NOT be forked so that each side
renders its own vocabulary. Where such a component appears inside an admin
surface, that appearance SHALL be stated by this capability rather than left to
whichever vocabulary the component happens to be written in.

#### Scenario: visual-standard-SC-03 - A shared surface appears as its console does

- **WHEN** an admin console renders a component that customer surfaces also render
- **THEN** one definition serves both
- **AND THEN** the admin rendering is not visibly foreign to the console around it

### Requirement: One mechanism carries a brand's identity into the admin

A brand's identity SHALL reach admin surfaces through exactly one stated
mechanism, and an admin application SHALL NOT carry two mechanisms that both
claim to set the same visual value. Admin blocks SHALL remain brand-neutral:
what distinguishes one brand's console from another's is what that mechanism
supplies, never a value written into a block.

#### Scenario: visual-standard-SC-04 - Two brands render one console

- **GIVEN** the two brands' admin applications rendering the same console
- **WHEN** each renders it
- **THEN** every visual difference between the two comes from the brand mechanism
- **AND THEN** neither rendering carries a brand value written into a block

#### Scenario: visual-standard-SC-05 - A brand's identity has one source

- **WHEN** an admin application sets a brand's visual value
- **THEN** exactly one mechanism sets it
- **AND THEN** no second mechanism sets the same value to a different result

### Requirement: The console semantics survive the change of vocabulary

Every operator-facing semantic the console blocks already guarantee SHALL hold
after the vocabulary changes: three distinguishable async states with a refused
read in the error tone, an irreversible move confirmed in a dialog the surface
renders rather than the platform's own, a panel switch announced as tabs, a row
filter announced as one segmented choice with its selected option announced, a
tabular amount naming its ISO 4217 code, and a queue longer than its page
offering the way on and back.

#### Scenario: visual-standard-SC-06 - An operator reads the same states after the swap

- **WHEN** an admin surface's read is refused after the vocabulary changed
- **THEN** the failure renders in the error tone, distinguishable from the empty state
- **AND THEN** the loading, refused, and empty states remain three distinguishable answers

#### Scenario: visual-standard-SC-07 - Announced selection survives the swap

- **WHEN** an operator reaches a panel switch or a row filter with assistive technology
- **THEN** the panel switch is announced as tabs and the filter as one choice
- **AND THEN** the active panel and the selected option are announced as selected

#### Scenario: visual-standard-SC-08 - A confirmation stays a rendered dialog

- **WHEN** an operator confirms an irreversible move after the vocabulary changed
- **THEN** the confirmation is a dialog the surface renders
- **AND THEN** the platform's native confirmation is not invoked

### Requirement: The admin runtime is pinned and its upgrades are deliberate

The admin's component runtime SHALL be depended on at a fixed version rather
than a range that admits an unreviewed upgrade, and moving that version SHALL
be a deliberate change that re-establishes this capability's scenarios before
it lands. Where the runtime's own versioning does not promise compatibility
between releases, the admin SHALL treat every upgrade as breaking.

#### Scenario: visual-standard-SC-09 - An upgrade is not silent

- **WHEN** the admin runtime publishes a new version
- **THEN** no admin application takes it without a change that re-establishes this capability's scenarios
- **AND THEN** a version that has not been through that is not what an operator is served

### Requirement: Reverting the runtime is a described route

This capability SHALL state what reverting to the previous vocabulary requires
and what it costs, and that statement SHALL be true when written rather than
derived later under pressure. A surface SHALL NOT depend on the runtime in a
way that makes the described route impossible.

#### Scenario: visual-standard-SC-10 - The way back is known before it is needed

- **WHEN** the admin runtime becomes unusable — abandoned, relicensed, or broken beyond an upgrade
- **THEN** the route back to the previous vocabulary is already described
- **AND THEN** no admin surface has taken a dependency that route cannot undo
