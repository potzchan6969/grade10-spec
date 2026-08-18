## Purpose

The account-profile components every store application renders: the card that
frames the surface, the read view of a collector's basic information, and the
form that edits it. The components display what they are given and report what
the collector did; what is stored, what is valid, and every string on screen
belong to the application.

## ADDED Requirements

### Requirement: The profile surface exports

The shared UI package SHALL export, from its public entry, exactly these
components for the profile surface — `ProfileCard`, `ProfileDetails`, and
`ProfileForm` — and exactly these types: `ProfileCardProps`,
`ProfileDetailsProps`, `ProfileFormProps`, and `ProfileFormValues`.

`ProfileDetails` and `ProfileForm` SHALL each be renderable on their own,
outside `ProfileCard`.

#### Scenario: An application imports the surface

- **WHEN** an application imports each name above from the shared UI package's public entry
- **THEN** every import resolves
- **AND** no other component or type is exported for this surface

#### Scenario: A part is reused alone

- **WHEN** an application renders the read view or the form without the card
- **THEN** it renders and behaves as specified, with no missing-context error
  and no requirement to supply card props

### Requirement: The read view shows avatar, display name, email, bio, and meta

`ProfileDetails` SHALL display the supplied avatar, display name, email
address, bio, and meta line, and SHALL supply a default for none of them. It
SHALL show the way into the form only when the application supplies both an
edit label and an edit handler.

#### Scenario: Every supplied value is displayed

- **WHEN** the read view is rendered with an avatar, display name, email, bio, and meta line
- **THEN** all five are displayed

#### Scenario: An omitted value is absent, not defaulted

- **WHEN** the read view is rendered without a bio, an email, or a meta line
- **THEN** nothing stands in for the omitted value — no placeholder text of the
  component's own

#### Scenario: A read-only view offers no edit

- **WHEN** the read view is rendered without an edit label and edit handler
- **THEN** no control invites editing

### Requirement: The avatar falls back when there is no image to show

`ProfileDetails` and `ProfileForm` SHALL display the supplied fallback content
in place of the avatar image whenever no image source is supplied, and whenever
a supplied image fails to load. The application supplies the fallback content;
the components SHALL NOT derive it.

#### Scenario: No image source

- **WHEN** the avatar is rendered with no image source
- **THEN** the supplied fallback content is displayed in the avatar's place

#### Scenario: An image that fails to load

- **GIVEN** an avatar rendered with an image source
- **WHEN** the image fails to load
- **THEN** the supplied fallback content is displayed instead, and no broken
  image is shown

### Requirement: The form edits the avatar alongside the text fields

`ProfileForm` SHALL let the collector choose a replacement avatar image and
remove the current one, and SHALL preview the chosen image before submission.
`ProfileFormValues` SHALL report the collector's avatar intent as one of three
outcomes — unchanged, removed, or a chosen image file — alongside the trimmed
display name and bio.

The form SHALL NOT validate a chosen file, and SHALL NOT upload it: the
application decides what is acceptable and what to do with it, and reports any
refusal back through the form's error content.

#### Scenario: A chosen image is previewed and reported

- **WHEN** the collector chooses an image file and submits
- **THEN** the form previews that image in place of the current avatar before
  submission
- **AND** the submitted values report the chosen file

#### Scenario: A removal is reported

- **GIVEN** a form rendered with a current avatar
- **WHEN** the collector removes it and submits
- **THEN** the form displays the fallback content in the avatar's place
- **AND** the submitted values report the avatar as removed

#### Scenario: An untouched avatar is reported as unchanged

- **WHEN** the collector submits without touching the avatar
- **THEN** the submitted values report the avatar as unchanged, whether or not
  one is currently set

#### Scenario: The form judges no file

- **WHEN** the collector chooses a file of any type or size
- **THEN** the form reports it without refusing it, and displays only the error
  content the application supplies

### Requirement: Every string on the surface is supplied by the application

The profile components SHALL render no built-in user-facing copy. Every label,
including the avatar's choose and remove controls, SHALL come from the
application.

#### Scenario: A control has no copy of its own

- **WHEN** the surface is rendered
- **THEN** every visible string is one the application supplied, and no
  component substitutes wording of its own
