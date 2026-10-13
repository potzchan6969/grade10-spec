# shared/ui/store-profile Specification

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
  - Reported save: the form reports values; validity and length limits belong to the application
  - Reported cancel: offered only when the application names it and handles it, and reports no values
  - Read-only email: the form shows the address it is given and edits nothing of it
  - Pending save: a save in flight cannot be sent again

## Requirements

### Requirement: The profile surface exports

The shared UI package SHALL export, from its public entry, exactly these
components for the profile surface — `ProfileCard`, `ProfileDetails`, and
`ProfileForm` — and exactly these types: `ProfileCardProps`, `ProfileCardCopy`,
`ProfileDetailsProps`, `ProfileDetailsCopy`, `ProfileFormProps`,
`ProfileFormCopy`, and `ProfileFormValues`.

`ProfileDetails` and `ProfileForm` SHALL each be renderable on their own,
outside `ProfileCard`.

<!-- trace:scenario id=g10.shared-store-profile.SC-n3z rev=1 -->
#### Scenario: shared-ui-store-profile-SC-01 - An application imports the surface
**Serves:** Surface exports - an application imports the surface

- **WHEN** an application imports each name above from the shared UI package's public entry
- **THEN** every import resolves
- **AND** no other component or type is exported for this surface

<!-- trace:scenario id=g10.shared-store-profile.SC-kr5 rev=1 -->
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

<!-- trace:scenario id=g10.shared-store-profile.SC-ln9 rev=1 -->
#### Scenario: shared-ui-store-profile-SC-03 - The ready body is the application's
**Serves:** Card states - the ready body is the application's

- **WHEN** the card is rendered ready with a read view, a form, or both
- **THEN** it renders exactly what was supplied, inside the card's frame

<!-- trace:scenario id=g10.shared-store-profile.SC-mzb rev=1 -->
#### Scenario: shared-ui-store-profile-SC-04 - A loading card shows no profile fields
**Serves:** Card states - a loading card shows no profile fields

- **WHEN** the card is rendered loading
- **THEN** it shows a loading placeholder and none of the profile's fields

<!-- trace:scenario id=g10.shared-store-profile.SC-d8w rev=1 -->
#### Scenario: shared-ui-store-profile-SC-05 - A failed card states what happened
**Serves:** Card states - a failed card states what happened

- **WHEN** the card is rendered failed with a message and an action
- **THEN** it displays that message and that action, and no profile fields

<!-- trace:scenario id=g10.shared-store-profile.SC-z3a rev=1 -->
#### Scenario: shared-ui-store-profile-SC-22 - An empty card states what the application supplies
**Serves:** Card states - an empty card states what the application supplies

- **WHEN** the card is rendered empty with a message and an action
- **THEN** it displays that message and that action, and no profile fields

### Requirement: The read view shows avatar, display name, email, bio, and meta

`ProfileDetails` SHALL display the supplied avatar, display name, email
address, bio, and meta line, and SHALL supply a default for none of them. It
SHALL show the way into the form only when the application supplies both an
edit label and an edit handler.

<!-- trace:scenario id=g10.shared-store-profile.SC-7fw rev=1 -->
#### Scenario: shared-ui-store-profile-SC-06 - Every supplied value is displayed
**Serves:** Read view - every supplied value is displayed

- **WHEN** the read view is rendered with an avatar, display name, email, bio, and meta line
- **THEN** all five are displayed

<!-- trace:scenario id=g10.shared-store-profile.SC-ozv rev=1 -->
#### Scenario: shared-ui-store-profile-SC-07 - An omitted value is absent, not defaulted
**Serves:** Read view - an omitted value is absent, not defaulted

- **WHEN** the read view is rendered without a bio, an email, or a meta line
- **THEN** nothing stands in for the omitted value — no placeholder text of the
  component's own

<!-- trace:scenario id=g10.shared-store-profile.SC-tnt rev=1 -->
#### Scenario: shared-ui-store-profile-SC-08 - A read-only view offers no edit
**Serves:** Read view - a read-only view offers no edit

- **WHEN** the read view is rendered with an edit handler and no edit label,
  an edit label and no handler, or neither
- **THEN** no control invites editing

### Requirement: The form offers a cancel the application names

`ProfileForm` SHALL offer a cancel only when the application supplies both a
cancel label in `ProfileFormCopy` and a cancel handler. A cancel SHALL report
to that handler and SHALL report no values to the submit handler.

<!-- trace:scenario id=g10.shared-store-profile.SC-7y6 rev=1 -->
#### Scenario: shared-ui-store-profile-SC-24 - A cancel reports no values
**Serves:** Form - a cancel reports no values

- **GIVEN** a form rendered with a cancel label and a cancel handler
- **WHEN** the collector edits the fields, chooses an image and cancels
- **THEN** the cancel handler is called once, under the supplied label
- **AND** no values are reported to the submit handler
- **AND** a form rendered with the handler and no label, the label and no
  handler, or neither offers no cancel

### Requirement: The bio keeps the lines the collector typed

`ProfileForm` SHALL edit the bio in a field of several lines, and
`ProfileDetails` SHALL show the bio's line breaks as typed.

<!-- trace:scenario id=g10.shared-store-profile.SC-tlq rev=1 -->
#### Scenario: shared-ui-store-profile-SC-23 - A bio's line breaks are kept
**Serves:** Form - a bio's line breaks are kept

- **WHEN** the collector types a bio over two lines in the form and submits
- **THEN** the submitted bio carries both lines and the break between them
- **AND** the read view rendered with that bio shows it on two lines

### Requirement: The avatar falls back when there is no image to show

`ProfileDetails` and `ProfileForm` SHALL display the supplied fallback content
in place of the avatar image whenever no image source is supplied, and whenever
a supplied image fails to load. The application supplies the fallback content
and the image's accessible name; the components SHALL NOT derive either.

<!-- trace:scenario id=g10.shared-store-profile.SC-67q rev=1 -->
#### Scenario: shared-ui-store-profile-SC-09 - No image source
**Serves:** Read view - no image source

- **WHEN** the avatar is rendered with no image source
- **THEN** the supplied fallback content is displayed in the avatar's place

<!-- trace:scenario id=g10.shared-store-profile.SC-2r8 rev=1 -->
#### Scenario: shared-ui-store-profile-SC-10 - An image that fails to load
**Serves:** Read view - an image that fails to load

- **GIVEN** an avatar rendered with an image source
- **WHEN** the image fails to load
- **THEN** the supplied fallback content is displayed instead, and no broken
  image is shown

<!-- trace:scenario id=g10.shared-store-profile.SC-0du rev=1 -->
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

<!-- trace:scenario id=g10.shared-store-profile.SC-mc2 rev=1 -->
#### Scenario: shared-ui-store-profile-SC-12 - A chosen image is previewed and reported
**Serves:** Form - a chosen image is previewed and reported

- **WHEN** the collector chooses an image file and submits
- **THEN** the form previews that image in place of the current avatar before
  submission
- **AND** the submitted values report the chosen file

<!-- trace:scenario id=g10.shared-store-profile.SC-eqc rev=1 -->
#### Scenario: shared-ui-store-profile-SC-13 - A removal is reported
**Serves:** Form - a removal is reported

- **GIVEN** a form rendered with a current avatar
- **WHEN** the collector removes it and submits
- **THEN** the form displays the fallback content in the avatar's place
- **AND** the submitted values report the avatar as removed

<!-- trace:scenario id=g10.shared-store-profile.SC-v9c rev=1 -->
#### Scenario: shared-ui-store-profile-SC-14 - An untouched avatar is reported as unchanged
**Serves:** Form - an untouched avatar is reported as unchanged

- **WHEN** the collector submits without touching the avatar
- **THEN** the submitted values report the avatar as unchanged, whether or not
  one is currently set

<!-- trace:scenario id=g10.shared-store-profile.SC-83g rev=1 -->
#### Scenario: shared-ui-store-profile-SC-15 - The form judges no file
**Serves:** Form - the form judges no file

- **WHEN** the collector chooses a file of any type or size
- **THEN** the form reports it without refusing it, and displays only the error
  content the application supplies

### Requirement: Every word on the surface arrives in the component's copy group

The profile components SHALL render no built-in user-facing copy. Each
component SHALL take every word it renders in its own `copy` prop, whose type
it exports under its own name, per `shared/ui/component-package`. The avatar's
choose and remove labels SHALL belong to `ProfileFormCopy`. The avatar's
accessible name and fallback content are the collector's content, not copy:
they arrive as props beside the image source, as the display name and the
email do.

<!-- trace:scenario id=g10.shared-store-profile.SC-4f1 rev=1 -->
#### Scenario: shared-ui-store-profile-SC-16 - A control has no copy of its own
**Serves:** Surface exports - a control has no copy of its own

- **WHEN** the surface is rendered
- **THEN** every visible string is one the application supplied, through a
  `copy` prop or as the collector's content, and no component substitutes
  wording of its own

<!-- trace:scenario id=g10.shared-store-profile.SC-y6u rev=1 -->
#### Scenario: shared-ui-store-profile-SC-17 - The avatar controls are named by the form's copy
**Serves:** Surface exports - the avatar controls are named by the form's copy

- **WHEN** an engineer opens `ProfileFormCopy`
- **THEN** it names the choose and remove labels alongside the form's other
  words, and the form renders no label the type does not carry

### Requirement: The form applies the application's limits and refuses nothing itself

`ProfileForm` SHALL apply only the display-name and bio length limits the
application passes, and SHALL hold no limit of its own. It SHALL refuse no
submission itself, an empty display name included: the application judges the
submitted values and reports a refusal through the form's error content. The
form SHALL show the email address it is given, read-only. While the
application reports a save pending, the form's submit SHALL show busy and SHALL
NOT submit again.

<!-- trace:scenario id=g10.shared-store-profile.SC-cxo rev=1 -->
#### Scenario: shared-ui-store-profile-SC-18 - The limits are the application's
**Serves:** Form - the limits are the application's

- **WHEN** the form is rendered with a display-name limit and a bio limit
- **THEN** each field accepts no more characters than the limit passed for it
- **AND** a form rendered without them does not compile

<!-- trace:scenario id=g10.shared-store-profile.SC-67a rev=1 -->
#### Scenario: shared-ui-store-profile-SC-19 - An empty display name reaches the application
**Serves:** Form - an empty display name reaches the application

- **WHEN** the collector clears the display name and submits
- **THEN** the form reports the empty display name to the application
- **AND** shows only the error content the application supplies in return

<!-- trace:scenario id=g10.shared-store-profile.SC-at4 rev=1 -->
#### Scenario: shared-ui-store-profile-SC-20 - The email is shown and not edited
**Serves:** Form - the email is shown and not edited

- **WHEN** the form is rendered with an email address
- **THEN** it displays that address, no control edits it, and the submitted
  values carry no email

<!-- trace:scenario id=g10.shared-store-profile.SC-bba rev=1 -->
#### Scenario: shared-ui-store-profile-SC-21 - A pending save cannot be sent twice
**Serves:** Form - a pending save cannot be sent twice

- **GIVEN** a form the application reports as saving
- **WHEN** the collector submits again
- **THEN** the submit shows busy and nothing further is reported
