# demo-product/alpha Specification

## Purpose
Alpha does one thing, and this fixture is what proves the reader sees it.

## Feature set

- Doing the thing
  - Once only: the thing happens exactly once
  - Written down: the thing leaves a record

## Requirements
### Requirement: The thing happens once

The system SHALL do the thing exactly once and SHALL refuse a second ask.

#### Scenario: alpha-SC-01 - The thing happens
**Serves:** alpha-US-01 - Reader follows the thing end to end

- **WHEN** a reader asks for the thing
- **THEN** the thing happens

#### Scenario: alpha-SC-02 - The thing is refused a second time
**Serves:** alpha-US-01 - Reader follows the thing end to end

- **GIVEN** the thing already happened
- **WHEN** a reader asks again
- **THEN** nothing happens and the record is unchanged

### Requirement: The thing is written down

The system SHALL record the thing.

#### Scenario: A scenario that predates permanent ids

- **WHEN** a spec omits the scenario id
- **THEN** the reader still carries the scenario, without one
