# shared/console/blocks Specification

## Purpose
The admin console block package: the one home for the surfaces every
operator console shares and no product owns — table furniture, async status,
form dialog, section header, identity strip, status badge, figure list, and
cursor pager. It lives in the application repository, because admin surfaces
carry no brand design; this capability governs what the package is, what it
exports, and how its blocks behave, so nine consoles stop rebuilding the same
shapes and drifting apart.
## Feature set

- One shared implementation
  - Single source: each recurring console shape ships once from the console package, and every console renders it from there
  - Exports contract: the package's public entry is the cross-repo contract consoles import against
  - Out of shared UI: the shared UI package carries no admin-only component, so the home is never ambiguous
- Built on the design system
  - Unbranded composition: blocks compose design-system primitives and carry no brand; the consuming app's stylesheet themes them
  - Props-only content: product state, copy, and behavior arrive as props, and every interaction reports through a callback
- Honest async status
  - Three distinct states: loading, failed, and empty never collapse into one another
  - Failure reads as failure: a refused read renders in the error tone, never as an empty queue
- Deliberate confirmations
  - Dialog confirmations: an irreversible move confirms in a dialog the surface renders, never the browser's native confirm
- Legible selection
  - Panel switching: a control that switches the visible panel announces tab semantics
  - Dataset narrowing: a filter over rows is a segmented choice whose selected option is announced
- Tables tell the truth
  - Currency named: a tabular amount is minor units plus an ISO 4217 code, rendered naming the code
  - Queues are walkable: a queue longer than its page offers the way to the next page and back
## Requirements
### Requirement: Console shapes ship once, from the console package

Each shared console shape — data table, async status, form dialog, section
header, operator identity strip, status badge, key-value figure list, and
cursor pager — SHALL be provided by the console package, and an admin console
surface SHALL render these shapes from the package rather than maintaining a
local implementation of them.

#### Scenario: shared-console-blocks-SC-01 - Two consoles render one source

- **GIVEN** two admin surfaces that render the same console shape
- **WHEN** each surface renders it
- **THEN** both render the same block source from the console package
- **AND** every difference between the two renderings is produced by the props and theme each surface supplies, not by diverging copies

#### Scenario: shared-console-blocks-SC-02 - A contract change lands once

- **WHEN** a requirement of a shared console shape changes
- **THEN** one implementation change in the console package satisfies it for every console
- **AND** each console adapts only the props and callbacks it supplies

### Requirement: The console package exports

The console package SHALL export, from its public entry, exactly these
components for the shared console shapes: `Table`, `Row`, `Cell`, `At`,
`Money`, `Status`, `FormDialog`, `SectionHeader`, `StatusBadge`, `Figure`,
`OperatorIdentity`, and `CursorPager` — with a props type for each component
that takes props, named after it — together with its existing utility
exports for debounced input and for keeping a command's refusal with the
command.

#### Scenario: shared-console-blocks-SC-03 - A console imports the blocks

- **WHEN** an admin surface imports any export named above from the console package's public entry
- **THEN** the import resolves without error

### Requirement: Admin console shapes are not shared UI exports

The shared UI package SHALL NOT export a component that only admin consoles
render. A component serving customer surfaces as well — signing in,
two-factor enrollment — stays a shared UI export even when an admin
application also renders it.

#### Scenario: shared-console-blocks-SC-04 - The shared UI entry offers no admin-only component

- **WHEN** an application inspects the shared UI package's public entry
- **THEN** no admin-only console component is offered there
- **AND** the two-factor components remain offered

### Requirement: Blocks carry no brand and no product state

A console block SHALL compose design-system primitives, SHALL receive all
product state, copy, and dates through props already resolved by the console,
and SHALL report every interaction through a callback. It SHALL NOT fetch,
persist, navigate, or import an application. A block SHALL carry no brand:
what distinguishes one brand's console from another's is the theme its
application supplies.

#### Scenario: shared-console-blocks-SC-12 - Two brands theme one block

- **GIVEN** the two brands' admin applications rendering the same block with the same props
- **WHEN** each renders it under its own stylesheet
- **THEN** every visual difference between the two comes from theme tokens
- **AND** neither rendering fetched, persisted, or navigated from inside the block

### Requirement: The three async states never collapse

A console surface that reads data SHALL render three distinguishable states:
one while the read is in flight, one when the read is refused, and one when
the read succeeds with no rows. The refused state SHALL render in the error
tone, distinct from the tone of secondary or empty text.

#### Scenario: shared-console-blocks-SC-05 - A read is in flight

- **WHEN** a console surface's read has not yet resolved
- **THEN** the surface says it is loading, and offers no rows and no empty message

#### Scenario: shared-console-blocks-SC-06 - A read is refused

- **WHEN** a console surface's read fails
- **THEN** the failure renders in the error tone
- **AND** the rendering is distinguishable from the empty state at a glance

#### Scenario: shared-console-blocks-SC-07 - A read returns no rows

- **WHEN** a console surface's read succeeds with nothing to show
- **THEN** the surface says there is nothing, in the secondary tone, and renders no error

### Requirement: An irreversible move confirms in a dialog

An operator move that cannot be undone SHALL confirm through a dialog the
surface renders — naming the move in words the console supplies, and
offering cancel — and SHALL NOT use the platform's native confirmation.

#### Scenario: shared-console-blocks-SC-08 - An operator cancels a confirmation

- **WHEN** an operator opens a confirmation for an irreversible move and cancels it
- **THEN** the move is not reported to the console
- **AND** the surface returns to where the operator was

#### Scenario: shared-console-blocks-SC-09 - No move uses the native confirm

- **WHEN** any console surface asks an operator to confirm a move
- **THEN** the confirmation is a dialog the surface renders
- **AND** the platform's native confirmation is never invoked

### Requirement: Panel switching announces tab semantics

A control that switches which panel of a surface is visible SHALL announce
tab semantics: the group is announced as tabs, and the active panel's control
is announced as selected.

#### Scenario: shared-console-blocks-SC-10 - A panel switch is announced as tabs

- **WHEN** an operator moves through a panel-switching control with assistive technology
- **THEN** the control group is announced as tabs
- **AND** the control for the visible panel is announced as selected

### Requirement: Narrowing a dataset is a segmented, announced choice

A control that narrows which rows a surface shows SHALL present its options
as one segmented choice whose selected option is announced, rather than as
independent buttons distinguished only by styling.

#### Scenario: shared-console-blocks-SC-11 - A filter announces its selected option

- **WHEN** an operator reaches a row filter with assistive technology
- **THEN** the options are announced as one choice
- **AND** the selected option is announced as selected

### Requirement: A tabular amount names its currency

An amount a console table renders SHALL arrive as an integer count of minor
units plus an ISO 4217 currency code, and SHALL render naming that code
rather than a symbol two currencies could share.

#### Scenario: shared-console-blocks-SC-13 - Two currencies share a column

- **WHEN** a table column renders amounts in two different currencies
- **THEN** each amount names its own ISO 4217 code
- **AND** no two amounts are distinguishable only by a shared symbol

### Requirement: A longer queue is walkable

When more rows exist than a console surface's page shows, the surface SHALL
offer moving to the next page and back, rather than only saying more rows
exist.

#### Scenario: shared-console-blocks-SC-14 - A queue exceeds its page

- **WHEN** a console queue holds more rows than one page shows
- **THEN** the surface offers moving to the older rows
- **AND** from an older page, offers returning toward the newest

