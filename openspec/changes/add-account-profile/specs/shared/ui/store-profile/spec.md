## Purpose

The account-profile components every store application renders: the card that
frames the surface, the read view of a collector's basic information, and the
form that edits it. The components display what they are given and report what
the collector did; what is stored, what is valid, and every string on screen
belong to the application.

## Feature set

- Surface exports
  - Named components: card, read view, and form from the package entry
  - Reusable parts: details and form render without the card
- Card states
  - Loading, empty, failed, ready: the application selects which body to show
- Read view
  - Supplied fields: avatar, display name, email, bio, and meta, with no component defaults
- Form
  - Reported save: the form reports values; validity belongs to the application

## ADDED Requirements

### Requirement: The profile surface exports

The shared UI package SHALL export, from its public entry, exactly these
components for the profile surface — `ProfileCard`, `ProfileDetails`, and
`ProfileForm` — and exactly these types: `ProfileCardProps`, `ProfileCardCopy`,
`ProfileDetailsProps`, `ProfileDetailsCopy`, `ProfileFormProps`,
`ProfileFormCopy`, and `ProfileFormValues`.

`ProfileDetails` and `ProfileForm` SHALL each be renderable on their own,
outside `ProfileCard`.

#### Scenario: shared-ui-store-profile-SC-01 - An application imports the surface
**Serves:** Surface exports - an application imports the surface

- **WHEN** an application imports each name above from the shared UI package's public entry
- **THEN** every import resolves
- **AND** no other component or type is exported for this surface

#### Scenario: shared-ui-store-profile-SC-02 - A part is reused alone
**Serves:** Surface exports - a part is reused alone

- **WHEN** an application renders the read view or the form without the card
- **THEN** it renders and behaves as specified, with no missing-context error
  and no requirement to supply card props

### Requirement: The card frames a body the application supplies

`ProfileCard` SHALL render a titled card whose body is whichever of four states
the application selects — loading, empty, failed, or ready — and in the ready
state SHALL render the element the application supplied. The card SHALL NOT
hold or decide whether the collector is reading or editing.

#### Scenario: shared-ui-store-profile-SC-03 - The ready body is the application's
**Serves:** Card states - the ready body is the application's

- **WHEN** the card is rendered ready with a read view, a form, or both
- **THEN** it renders exactly what was supplied, inside the card's frame

#### Scenario: shared-ui-store-profile-SC-04 - A loading card shows no profile fields
**Serves:** Card states - a loading card shows no profile fields

- **WHEN** the card is rendered loading
- **THEN** it shows a loading placeholder and none of the profile's fields

#### Scenario: shared-ui-store-profile-SC-05 - A failed card states what happened
**Serves:** Card states - a failed card states what happened

- **WHEN** the card is rendered failed with a message and an action
- **THEN** it displays that message and that action, and no profile fields

### Requirement: The read view shows avatar, display name, email, bio, and meta

`ProfileDetails` SHALL display the supplied avatar, display name, email
address, bio, and meta line, and SHALL supply a default for none of them. It
SHALL show the way into the form only when the application supplies both an
edit label and an edit handler.

#### Scenario: shared-ui-store-profile-SC-06 - Every supplied value is displayed
**Serves:** Read view - every supplied value is displayed

- **WHEN** the read view is rendered with an avatar, display name, email, bio, and meta line
- **THEN** all five are displayed

#### Scenario: shared-ui-store-profile-SC-07 - An omitted value is absent, not defaulted
**Serves:** Read view - an omitted value is absent, not defaulted

- **WHEN** the read view is rendered without a bio, an email, or a meta line
- **THEN** nothing stands in for the omitted value — no placeholder text of the
  component's own

#### Scenario: shared-ui-store-profile-SC-08 - A read-only view offers no edit
**Serves:** Read view - a read-only view offers no edit

- **WHEN** the read view is rendered without an edit label and edit handler
- **THEN** no control invites editing

### Requirement: The avatar falls back when there is no image to show

`ProfileDetails` and `ProfileForm` SHALL display the supplied fallback content
in place of the avatar image whenever no image source is supplied, and whenever
a supplied image fails to load. The application supplies the fallback content
and the image's accessible name; the components SHALL NOT derive either.

#### Scenario: shared-ui-store-profile-SC-09 - No image source
**Serves:** Read view - no image source

- **WHEN** the avatar is rendered with no image source
- **THEN** the supplied fallback content is displayed in the avatar's place

#### Scenario: shared-ui-store-profile-SC-10 - An image that fails to load
**Serves:** Read view - an image that fails to load

- **GIVEN** an avatar rendered with an image source
- **WHEN** the image fails to load
- **THEN** the supplied fallback content is displayed instead, and no broken
  image is shown

#### Scenario: shared-ui-store-profile-SC-11 - The image is named by the application
**Serves:** Read view - the image is named by the application

- **WHEN** the avatar is rendered with an image source
- **THEN** the image carries the accessible name the application supplied, and
  the components substitute no name of their own

### Requirement: The form edits the avatar alongside the text fields

`ProfileForm` SHALL let the collector choose a replacement avatar image and
remove the current one, and SHALL preview the chosen image before submission.
`ProfileFormValues` SHALL report the collector's avatar intent as one of three
outcomes — unchanged, removed, or a chosen image file — alongside the trimmed
display name and bio.

The form SHALL NOT validate a chosen file, and SHALL NOT upload it: the
application decides what is acceptable and what to do with it, and reports any
refusal back through the form's error content.

#### Scenario: shared-ui-store-profile-SC-12 - A chosen image is previewed and reported
**Serves:** Form - a chosen image is previewed and reported

- **WHEN** the collector chooses an image file and submits
- **THEN** the form previews that image in place of the current avatar before
  submission
- **AND** the submitted values report the chosen file

#### Scenario: shared-ui-store-profile-SC-13 - A removal is reported
**Serves:** Form - a removal is reported

- **GIVEN** a form rendered with a current avatar
- **WHEN** the collector removes it and submits
- **THEN** the form displays the fallback content in the avatar's place
- **AND** the submitted values report the avatar as removed

#### Scenario: shared-ui-store-profile-SC-14 - An untouched avatar is reported as unchanged
**Serves:** Form - an untouched avatar is reported as unchanged

- **WHEN** the collector submits without touching the avatar
- **THEN** the submitted values report the avatar as unchanged, whether or not
  one is currently set

#### Scenario: shared-ui-store-profile-SC-15 - The form judges no file
**Serves:** Form - the form judges no file

- **WHEN** the collector chooses a file of any type or size
- **THEN** the form reports it without refusing it, and displays only the error
  content the application supplies

### Requirement: Every word on the surface arrives in the component's copy group

The profile components SHALL render no built-in user-facing copy. Each
component SHALL take every word it renders in its own `copy` prop, whose type
it exports under its own name, per `shared/ui/component-package`. The avatar's
choose and remove labels SHALL belong to `ProfileFormCopy`.

#### Scenario: shared-ui-store-profile-SC-16 - A control has no copy of its own
**Serves:** Surface exports - a control has no copy of its own

- **WHEN** the surface is rendered
- **THEN** every visible string is one the application supplied through a
  `copy` prop, and no component substitutes wording of its own

#### Scenario: shared-ui-store-profile-SC-17 - The avatar controls are named by the form's copy
**Serves:** Surface exports - the avatar controls are named by the form's copy

- **WHEN** an engineer opens `ProfileFormCopy`
- **THEN** it names the choose and remove labels alongside the form's other
  words, and the form renders no label the type does not carry
