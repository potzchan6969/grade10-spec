## Purpose

The basic information a signed-in collector holds about themselves in the
Grade10 store — display name, bio, avatar, and the address they signed in with
— and how they read and edit it on their own account page. Owner-only: nobody
but the collector sees their profile.

## Feature set

- Owner-only access
  - Session is the key: a signed-out request is refused; no input selects another collector
- Always a profile
  - Session defaults: a collector who has never saved still sees a complete page
- Fields
  - Display name, bio, avatar, email, member-since: email is the signed-in address and is read-only
- Edits
  - Explicit save: empty display name is refused; a save with no field is refused
- Failures
  - Reported: a failed read or save is shown; a failed save keeps the collector's input

## User journeys

### account-profile-US-01: Collector opens their own profile

**As a** signed-in collector,
**I want** the account page to show my profile even if I have never saved,
**so that** I am not asked to create a record, and nobody else can open mine.

**Accepted by:**

- `account-profile-SC-01` — Signed-out request is refused
- `account-profile-SC-02` — A collector cannot address another collector's profile
- `account-profile-SC-03` — A collector who has never saved sees a profile
- `account-profile-SC-04` — A collector whose session carries no name
- `account-profile-SC-05` — A read stores nothing
- `account-profile-SC-06` — A display name the collector never chose is not shown as theirs
- `account-profile-SC-07` — Saved values win over session defaults
- `account-profile-SC-08` — Every field is present
- `account-profile-SC-09` — Member-since is absent before the first save
- `account-profile-SC-10` — A record another part of the store created dates nothing

### account-profile-US-02: Collector edits display name and bio

**As a** signed-in collector,
**I want** to save a trimmed display name and an optional bio,
**so that** an empty or over-length name is refused, and cancelling discards the draft.

**Accepted by:**

- `account-profile-SC-13` — Whitespace is trimmed before saving
- `account-profile-SC-14` — An empty display name is refused
- `account-profile-SC-15` — An over-length display name is refused
- `account-profile-SC-16` — Two collectors may hold the same display name
- `account-profile-SC-17` — A bio within the limit is saved
- `account-profile-SC-18` — An over-length bio is refused
- `account-profile-SC-19` — A bio is cleared
- `account-profile-SC-27` — A save persists and is reflected immediately
- `account-profile-SC-28` — Cancelling discards edits
- `account-profile-SC-29` — A save with no field is refused

### account-profile-US-03: Collector uploads or removes an avatar

**As a** signed-in collector,
**I want** an accepted image as my avatar and a remove that restores initials,
**so that** a bad file is refused and initials follow the display name I actually have.

**Accepted by:**

- `account-profile-SC-20` — An accepted upload becomes the avatar
- `account-profile-SC-21` — An unsupported image type is refused
- `account-profile-SC-22` — An oversized image is refused
- `account-profile-SC-23` — A new upload replaces the previous avatar
- `account-profile-SC-24` — Removing an avatar restores the initials
- `account-profile-SC-25` — A collector who never uploaded sees initials
- `account-profile-SC-26` — Initials follow the display name
- `account-profile-SC-30` — An accepted avatar stands when the text save is refused

### account-profile-US-04: Collector's email stays the signed-in address

**As a** signed-in collector,
**I want** the address on the page to be the one I signed in with, and an edit that carries an email to be refused,
**so that** I cannot change how I sign in from this page.

**Accepted by:**

- `account-profile-SC-11` — The address shown is the one signed in with
- `account-profile-SC-12` — An edit carrying an email is refused

### account-profile-US-05: Collector is told when a read or save fails

**As a** signed-in collector,
**I want** a failed read reported and a failed save to keep what I typed,
**so that** a network miss does not look like an empty profile or a successful save.

**Accepted by:**

- `account-profile-SC-31` — A failed read is reported
- `account-profile-SC-32` — A failed save keeps the collector's input

## ADDED Requirements

### Requirement: Only the signed-in collector reads or edits their profile

The system SHALL resolve a profile from the caller's session and no other
input. A profile SHALL be readable and editable by its owner alone, and a
request without a session SHALL be refused.

#### Scenario: account-profile-SC-01 - Signed-out request is refused

- **GIVEN** a request carrying no session
- **WHEN** it reads or edits a profile
- **THEN** the system refuses it as unauthenticated and returns no profile data

#### Scenario: account-profile-SC-02 - A collector cannot address another collector's profile

- **GIVEN** a signed-in collector
- **WHEN** they read or edit a profile
- **THEN** the profile is the one belonging to their own session, and no input
  they supply can select a different collector's profile

### Requirement: The profile page is never empty

The system SHALL return a complete profile for every signed-in collector,
whether or not they have saved anything. Values the collector has not set SHALL
be defaulted from their signed-in session — display name from the session name,
or, when the session carries no name, from the part of the signed-in address
before the `@`; avatar as initials. Reading a profile SHALL NOT create or
modify stored data; the collector's profile record is created when they first
save.

#### Scenario: account-profile-SC-03 - A collector who has never saved sees a profile

- **GIVEN** a collector who has never saved their profile
- **WHEN** they open their account page
- **THEN** the page shows their session name as the display name, an initials
  avatar, and an empty bio
- **AND** the page offers editing, not creation — nothing asks them to create a
  profile first

#### Scenario: account-profile-SC-04 - A collector whose session carries no name

- **GIVEN** a collector who signed in by emailed link or code, whose session
  carries no name
- **WHEN** they open their account page
- **THEN** the display name shown is the part of their signed-in address before
  the `@`, and the avatar shows initials derived from it
- **AND** nothing shows a generated identifier in place of a name

#### Scenario: account-profile-SC-05 - A read stores nothing

- **GIVEN** a collector who has never saved their profile
- **WHEN** they open their account page any number of times
- **THEN** no profile record is created for them

#### Scenario: account-profile-SC-06 - A display name the collector never chose is not shown as theirs

- **GIVEN** a collector whose profile record exists because some other part of
  the store wrote it, carrying a display name they never set
- **WHEN** they open their account page
- **THEN** the display name shown is the one from their session, not the
  unset placeholder

#### Scenario: account-profile-SC-07 - Saved values win over session defaults

- **GIVEN** a collector who has saved a display name and a bio
- **WHEN** they open their account page
- **THEN** the page shows their saved values, unchanged, and does not fall back
  to session values

### Requirement: A profile holds display name, bio, avatar, email, and member-since

The system SHALL present exactly these fields on the account page: display
name, bio, avatar, the email address of the signed-in session, and the date the
collector first saved their profile. Member-since SHALL be that date and not
the date some other part of the store created their record. Display name, bio,
and avatar SHALL be editable by the collector; email SHALL NOT.

#### Scenario: account-profile-SC-08 - Every field is present

- **GIVEN** a signed-in collector with a saved profile
- **WHEN** they open their account page
- **THEN** the page shows their display name, bio, avatar, signed-in email
  address, and the date they first saved their profile

#### Scenario: account-profile-SC-09 - Member-since is absent before the first save

- **GIVEN** a collector who has never saved their profile
- **WHEN** they open their account page
- **THEN** no member-since date is shown, and its absence is not presented as
  an error

#### Scenario: account-profile-SC-10 - A record another part of the store created dates nothing

- **GIVEN** a collector whose profile record exists because some other part of
  the store wrote it, and who has never saved it themselves
- **WHEN** they open their account page
- **THEN** no member-since date is shown, and that record's creation date is
  not presented as the date they joined

### Requirement: Email is read-only

The system SHALL show the email address of the signed-in session and SHALL NOT
offer any way to change it from the account page. An edit that carries an email
address SHALL be refused.

#### Scenario: account-profile-SC-11 - The address shown is the one signed in with

- **GIVEN** a collector signed in as a given address
- **WHEN** they open their account page
- **THEN** that address is shown, and no control edits it

#### Scenario: account-profile-SC-12 - An edit carrying an email is refused

- **WHEN** an edit request carries an email address
- **THEN** the system refuses the request and changes nothing

### Requirement: Display name is required, trimmed, and at most 80 characters

The system SHALL trim leading and trailing whitespace from a submitted display
name and SHALL require the result to be between 1 and 80 characters. A display
name SHALL NOT be required to be unique.

#### Scenario: account-profile-SC-13 - Whitespace is trimmed before saving

- **WHEN** a collector saves a display name with leading or trailing whitespace
- **THEN** the saved and returned display name has that whitespace removed

#### Scenario: account-profile-SC-14 - An empty display name is refused

- **WHEN** a collector saves a display name that is empty or only whitespace
- **THEN** the system refuses the edit, states that a display name is required,
  and changes nothing

#### Scenario: account-profile-SC-15 - An over-length display name is refused

- **WHEN** a collector saves a display name longer than 80 characters after
  trimming
- **THEN** the system refuses the edit, states the 80-character limit, and
  changes nothing

#### Scenario: account-profile-SC-16 - Two collectors may hold the same display name

- **GIVEN** a display name already saved by another collector
- **WHEN** a collector saves that same display name
- **THEN** the system accepts it

### Requirement: Bio is optional, trimmed, and at most 500 characters

The system SHALL trim a submitted bio, SHALL accept up to 500 characters, and
SHALL let a collector clear it.

#### Scenario: account-profile-SC-17 - A bio within the limit is saved

- **WHEN** a collector saves a bio of 500 characters or fewer after trimming
- **THEN** the system stores it and the page shows it

#### Scenario: account-profile-SC-18 - An over-length bio is refused

- **WHEN** a collector saves a bio longer than 500 characters after trimming
- **THEN** the system refuses the edit, states the 500-character limit, and
  changes nothing

#### Scenario: account-profile-SC-19 - A bio is cleared

- **GIVEN** a collector with a saved bio
- **WHEN** they clear it and save
- **THEN** the profile holds no bio and the page shows the empty-bio state, not
  the previous text

### Requirement: A collector uploads an avatar image

The system SHALL accept a JPEG, PNG, or WebP image of at most 5 MB as the
collector's avatar, presented square. An upload SHALL replace whatever avatar
the collector had, and the replaced image SHALL be deleted from storage and
SHALL be served from a different address than its replacement. A copy already
held in a cache outside the system MAY answer the replaced image's address
until that cache expires. A rejected upload SHALL leave the previous avatar in
place and SHALL state why it was rejected.

#### Scenario: account-profile-SC-20 - An accepted upload becomes the avatar

- **WHEN** a collector uploads a JPEG, PNG, or WebP image of at most 5 MB
- **THEN** the system stores it, and their account page shows that image as
  their avatar on this and every later visit

#### Scenario: account-profile-SC-21 - An unsupported image type is refused

- **WHEN** a collector uploads a file that is not a JPEG, PNG, or WebP image
- **THEN** the system refuses it, states the accepted types, and the previous
  avatar is unchanged

#### Scenario: account-profile-SC-22 - An oversized image is refused

- **WHEN** a collector uploads an image larger than 5 MB
- **THEN** the system refuses it, states the 5 MB limit, and the previous
  avatar is unchanged

#### Scenario: account-profile-SC-23 - A new upload replaces the previous avatar

- **GIVEN** a collector with an avatar
- **WHEN** they upload another accepted image
- **THEN** the page shows the new image at a different address, and the
  previous image is deleted from storage

### Requirement: A collector removes their avatar and falls back to initials

The system SHALL let a collector remove their avatar and SHALL delete the
removed image from storage, and SHALL show initials derived from the display
name whenever no avatar is set.

#### Scenario: account-profile-SC-24 - Removing an avatar restores the initials

- **GIVEN** a collector with an avatar
- **WHEN** they remove it
- **THEN** the page shows initials derived from their display name, and the
  removed image is deleted from storage

#### Scenario: account-profile-SC-25 - A collector who never uploaded sees initials

- **GIVEN** a collector with no avatar
- **WHEN** they open their account page
- **THEN** the page shows initials derived from their display name

#### Scenario: account-profile-SC-26 - Initials follow the display name

- **GIVEN** a collector with no avatar
- **WHEN** they change their display name
- **THEN** the initials shown are derived from the new display name

### Requirement: Editing is explicit, and a save carrying no field is refused

The system SHALL let a collector edit their profile and either save or cancel.
Cancelling SHALL discard the edits and leave the stored profile untouched. A
save SHALL persist the display name and bio it carries together — both or
neither — and SHALL return the updated profile. A save carrying no editable
field SHALL be refused; a save repeating the stored values SHALL be accepted
and change nothing.

An avatar is set and removed on its own, so an edit touching both the avatar
and the text fields SHALL report each outcome and SHALL NOT present a refused
text save as having undone an accepted avatar change.

#### Scenario: account-profile-SC-27 - A save persists and is reflected immediately

- **WHEN** a collector saves changed profile fields
- **THEN** the system stores them and the page shows the updated profile
  without needing a reload

#### Scenario: account-profile-SC-28 - Cancelling discards edits

- **GIVEN** a collector who has edited fields without saving
- **WHEN** they cancel
- **THEN** the page shows the stored profile again and nothing was stored

#### Scenario: account-profile-SC-29 - A save with no field is refused

- **WHEN** a save request carries no editable field
- **THEN** the system refuses it, stating that it carried nothing to save, and
  stores nothing

#### Scenario: account-profile-SC-30 - An accepted avatar stands when the text save is refused

- **GIVEN** a collector who changes their avatar and their display name in one
  edit
- **WHEN** the avatar is accepted and the display name is refused
- **THEN** the page shows the new avatar, states why the display name was
  refused, and keeps the collector's entered text so they can retry
- **AND** the stored display name and bio are unchanged

### Requirement: A failed read or save is reported, never hidden

The system SHALL tell the collector when their profile could not be loaded or
saved, and SHALL NOT present a partially loaded profile as if it were complete.

#### Scenario: account-profile-SC-31 - A failed read is reported

- **WHEN** the profile cannot be loaded
- **THEN** the page states that the profile could not be loaded and shows no
  profile fields

#### Scenario: account-profile-SC-32 - A failed save keeps the collector's input

- **WHEN** a save fails
- **THEN** the page states that the save failed, keeps the collector's entered
  values so they can retry, and the stored profile is unchanged
