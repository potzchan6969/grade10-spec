## Purpose

The shared component set a booking surface composes: the service, shop and
time pickers, the details form, the running summary, the confirmation, the
card that manages one booking, and the list of a collector's own. Every brand
imports them from the shared UI package and supplies the copy, the diary's
answers and the callbacks; `grade10-site/appointment/booking` is the first
surface built from them.

## Feature set

- Export contract
  - Named exports: the components and types every booking surface imports, so a change lands once
  - Props-only content: copy, diary answers and state arrive as props, and every choice reports through a callback
- Picking
  - Service and shop pickers: one choice each, reported by id
  - Slot picker: a month of days marked available or not, and the picked day's times in a named zone
  - Steps: where the collector is in the flow, and the way back
- Details
  - Details form: name, email, phone, the service's questions and notes, validated before they are reported
  - Summary: the choice so far, always in view
- Afterwards
  - Confirmation: what was booked and the link that manages it
  - Manage card: one booking, with a move and a confirmed cancel while it is live
  - Own list: upcoming visits, then past ones
- Async regions
  - Honest states: loading, empty and error each say so, with the consumer's words

## ADDED Requirements

### Requirement: The appointment booking exports

The shared UI package SHALL export, from its public entry, exactly these
components for the booking surface: `BookingSteps`, `BookingServicePicker`,
`BookingLocationPicker`, `BookingSlotPicker`, `BookingDetailsForm`,
`BookingSummary`, `BookingConfirmation`, `BookingManageCard` and
`BookingList` — with a `<Name>Props` and a `<Name>Copy` type for each — and
exactly these shared types: `BookingStep`, `BookingService`,
`BookingLocation`, `BookingDay`, `BookingSlot`, `BookingQuestion`,
`BookingAnswers`, `BookingDetailsValues`, `BookingRecord` and
`BookingRecordState`.

#### Scenario: shared-ui-appointment-booking-SC-01 - An application imports the booking surface
**Serves:** Export contract - an application imports the booking surface

- **WHEN** an application imports any export named above from the shared UI package's public entry
- **THEN** the import resolves without error

### Requirement: Every word arrives as copy

Each component SHALL render only the words its `copy` prop supplies and the
values its props carry, and SHALL carry no built-in wording in any language.
Every choice, submission and action SHALL be reported through a callback
prop; no component SHALL fetch, navigate, store or read anything outside its
props.

#### Scenario: shared-ui-appointment-booking-SC-02 - The consumer's words are the only words
**Serves:** Export contract - the consumer's words are the only words

- **WHEN** a consumer renders `BookingDetailsForm` with a `copy` in Traditional Chinese
- **THEN** every label, placeholder, error and button reads that copy and nothing else

### Requirement: The service and shop pickers report a choice

`BookingServicePicker` SHALL render each `BookingService` with its name,
description and duration, and `BookingLocationPicker` each `BookingLocation`
with its name and address; each SHALL mark the selected one and report a
pick by its id.

#### Scenario: shared-ui-appointment-booking-SC-03 - A service pick is reported by id
**Serves:** Picking - a service pick is reported by id

- **GIVEN** two services rendered in `BookingServicePicker`
- **WHEN** the collector activates the second
- **THEN** the picker reports that service's id and marks it selected

#### Scenario: shared-ui-appointment-booking-SC-04 - A shop pick is reported by id
**Serves:** Picking - a shop pick is reported by id

- **GIVEN** two shops rendered in `BookingLocationPicker`
- **WHEN** the collector activates the first
- **THEN** the picker reports that shop's id and marks it selected

### Requirement: The slot picker shows the diary honestly

`BookingSlotPicker` SHALL render one month of days from the `BookingDay`
list it is given, marking a day with nothing free as unavailable and
unpickable, SHALL render the picked day's `BookingSlot` starts as times in
the zone it is given, naming that zone, SHALL report a picked day and a
picked slot, and SHALL step between months within the bounds it is given,
reporting each step.

#### Scenario: shared-ui-appointment-booking-SC-05 - An unavailable day cannot be picked
**Serves:** Picking - an unavailable day cannot be picked

- **GIVEN** a month whose Sundays are marked unavailable
- **WHEN** the collector activates a Sunday
- **THEN** nothing is reported and the day stays unpicked

#### Scenario: shared-ui-appointment-booking-SC-06 - A picked day lists its times and reports the picked one
**Serves:** Picking - a picked day lists its times and reports the picked one

- **GIVEN** a picked day with starts at 10:00 and 10:15 in `Asia/Hong_Kong`
- **WHEN** the collector activates 10:15
- **THEN** the picker reports that slot
- **AND** both times read in Hong Kong time with the zone named

#### Scenario: shared-ui-appointment-booking-SC-07 - Months step within their bounds
**Serves:** Picking - months step within their bounds

- **GIVEN** a picker bounded to this month and the next
- **WHEN** the collector steps forward once and then again
- **THEN** the first step reports next month and the second is not offered

### Requirement: The details form validates before reporting

`BookingDetailsForm` SHALL ask for a name, an email address, a phone number,
the `BookingQuestion` list in order and notes, SHALL refuse to report while
the name, the address or a required answer is missing or the address is
malformed, naming each, and SHALL report `BookingDetailsValues` with every
text trimmed and answers keyed by question id. While `pending` it SHALL
disable submission, and it SHALL show the `error` it is given.

#### Scenario: shared-ui-appointment-booking-SC-08 - Missing details are named and nothing is reported
**Serves:** Details - missing details are named and nothing is reported

- **GIVEN** a form with one required `choice` question
- **WHEN** the collector submits with no address and no answer
- **THEN** the form names the address and the question as missing
- **AND** reports nothing

#### Scenario: shared-ui-appointment-booking-SC-09 - Values are reported trimmed and keyed
**Serves:** Details - values are reported trimmed and keyed

- **WHEN** the collector submits `  Ada  ` as their name, a valid address, and `Slabbed` for question `format`
- **THEN** the form reports the name `Ada` and the answers `{ format: "Slabbed" }`

#### Scenario: shared-ui-appointment-booking-SC-10 - Pending disables submission and the error is shown
**Serves:** Details - pending disables submission and the error is shown

- **WHEN** the form renders with `pending` and an `error` saying the time was taken
- **THEN** the submit control is disabled and the error is visible

### Requirement: The manage card confirms before cancelling

`BookingManageCard` SHALL render one `BookingRecord` with its service, shop,
address, start in the given zone and state; while the record is live it
SHALL offer a move and a cancel, and SHALL report the cancel only after the
collector confirms it in a dialog; a closed record SHALL show its state and
offer nothing.

#### Scenario: shared-ui-appointment-booking-SC-11 - A cancel is confirmed first
**Serves:** Afterwards - a cancel is confirmed first

- **GIVEN** a live record in `BookingManageCard`
- **WHEN** the collector activates cancel and then confirms
- **THEN** the cancel is reported once, after the confirmation

#### Scenario: shared-ui-appointment-booking-SC-12 - A closed record offers nothing
**Serves:** Afterwards - a closed record offers nothing

- **WHEN** a record in `cancelled` renders in `BookingManageCard`
- **THEN** the card shows it as cancelled and renders no move and no cancel

### Requirement: The list splits upcoming from past

`BookingList` SHALL render the `BookingRecord` list it is given as upcoming
visits, soonest first, then past or closed ones, latest first, each
reporting its open action, and SHALL render the empty copy when the list is
empty.

#### Scenario: shared-ui-appointment-booking-SC-13 - Upcoming come first
**Serves:** Afterwards - upcoming come first

- **GIVEN** a live record tomorrow, a live record next week and a completed record last week
- **WHEN** `BookingList` renders them
- **THEN** the order is tomorrow, next week, then last week

### Requirement: Async regions state their condition

`BookingServicePicker`, `BookingLocationPicker`, `BookingSlotPicker` and
`BookingList` SHALL each take an `AsyncState` and SHALL render its loading,
empty and error conditions distinctly, each with the consumer's message and
optional action.

#### Scenario: shared-ui-appointment-booking-SC-14 - Error is not empty
**Serves:** Async regions - error is not empty

- **WHEN** `BookingSlotPicker` renders an `error` state with a retry action
- **THEN** the error message and the retry control are visible
- **AND** nothing reads as a day with nothing free
