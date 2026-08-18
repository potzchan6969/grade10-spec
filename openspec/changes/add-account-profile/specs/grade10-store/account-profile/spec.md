## Purpose

The basic information a signed-in collector holds about themselves in the
Grade10 store — display name, bio, avatar, and the address they signed in with
— and how they read and edit it on their own account page. Owner-only: nobody
but the collector sees their profile.

## ADDED Requirements

### Requirement: Only the signed-in collector reads or edits their profile

The system SHALL resolve a profile from the caller's session and no other
input. A profile SHALL be readable and editable by its owner alone, and a
request without a session SHALL be refused.

#### Scenario: Signed-out request is refused

- **GIVEN** a request carrying no session
- **WHEN** it reads or edits a profile
- **THEN** the system refuses it as unauthenticated and returns no profile data

#### Scenario: A collector cannot address another collector's profile

- **GIVEN** a signed-in collector
- **WHEN** they read or edit a profile
- **THEN** the profile is the one belonging to their own session, and no input
  they supply can select a different collector's profile

### Requirement: The profile page is never empty

The system SHALL return a complete profile for every signed-in collector,
whether or not they have saved anything. Values the collector has not set SHALL
be defaulted from their signed-in session — display name from the session name,
avatar as initials. Reading a profile SHALL NOT create or modify stored data;
the collector's profile record is created when they first save.

#### Scenario: A collector who has never saved sees a profile

- **GIVEN** a collector who has never saved their profile
- **WHEN** they open their account page
- **THEN** the page shows their session name as the display name, an initials
  avatar, and an empty bio
- **AND** the page offers editing, not creation — nothing asks them to create a
  profile first

#### Scenario: A read stores nothing

- **GIVEN** a collector who has never saved their profile
- **WHEN** they open their account page any number of times
- **THEN** no profile record is created for them

#### Scenario: A display name the collector never chose is not shown as theirs

- **GIVEN** a collector whose profile record exists because some other part of
  the store wrote it, carrying a display name they never set
- **WHEN** they open their account page
- **THEN** the display name shown is the one from their session, not the
  unset placeholder

#### Scenario: Saved values win over session defaults

- **GIVEN** a collector who has saved a display name and a bio
- **WHEN** they open their account page
- **THEN** the page shows their saved values, unchanged, and does not fall back
  to session values

### Requirement: A profile holds display name, bio, avatar, email, and member-since

The system SHALL present exactly these fields on the account page: display
name, bio, avatar, the email address of the signed-in session, and the date the
collector's profile record was first created. Display name, bio, and avatar
SHALL be editable by the collector; email SHALL NOT.

#### Scenario: Every field is present

- **GIVEN** a signed-in collector with a saved profile
- **WHEN** they open their account page
- **THEN** the page shows their display name, bio, avatar, signed-in email
  address, and the date their profile record was first created

#### Scenario: Member-since is absent before the first save

- **GIVEN** a collector who has never saved their profile
- **WHEN** they open their account page
- **THEN** no member-since date is shown, and its absence is not presented as
  an error

### Requirement: Email is read-only

The system SHALL show the email address of the signed-in session and SHALL NOT
offer any way to change it from the account page. An edit that carries an email
address SHALL be refused.

#### Scenario: The address shown is the one signed in with

- **GIVEN** a collector signed in as a given address
- **WHEN** they open their account page
- **THEN** that address is shown, and no control edits it

#### Scenario: An edit carrying an email is refused

- **WHEN** an edit request carries an email address
- **THEN** the system refuses the request and changes nothing

### Requirement: Display name is required, trimmed, and at most 80 characters

The system SHALL trim leading and trailing whitespace from a submitted display
name and SHALL require the result to be between 1 and 80 characters. A display
name SHALL NOT be required to be unique.

#### Scenario: Whitespace is trimmed before saving

- **WHEN** a collector saves a display name with leading or trailing whitespace
- **THEN** the saved and returned display name has that whitespace removed

#### Scenario: An empty display name is refused

- **WHEN** a collector saves a display name that is empty or only whitespace
- **THEN** the system refuses the edit, states that a display name is required,
  and changes nothing

#### Scenario: An over-length display name is refused

- **WHEN** a collector saves a display name longer than 80 characters after
  trimming
- **THEN** the system refuses the edit, states the 80-character limit, and
  changes nothing

#### Scenario: Two collectors may hold the same display name

- **GIVEN** a display name already saved by another collector
- **WHEN** a collector saves that same display name
- **THEN** the system accepts it

### Requirement: Bio is optional, trimmed, and at most 500 characters

The system SHALL trim a submitted bio, SHALL accept up to 500 characters, and
SHALL let a collector clear it.

#### Scenario: A bio within the limit is saved

- **WHEN** a collector saves a bio of 500 characters or fewer after trimming
- **THEN** the system stores it and the page shows it

#### Scenario: An over-length bio is refused

- **WHEN** a collector saves a bio longer than 500 characters after trimming
- **THEN** the system refuses the edit, states the 500-character limit, and
  changes nothing

#### Scenario: A bio is cleared

- **GIVEN** a collector with a saved bio
- **WHEN** they clear it and save
- **THEN** the profile holds no bio and the page shows the empty-bio state, not
  the previous text

### Requirement: A collector uploads an avatar image

The system SHALL accept a JPEG, PNG, or WebP image of at most 5 MB as the
collector's avatar, presented square. An upload SHALL replace whatever avatar
the collector had. A rejected upload SHALL leave the previous avatar in place
and SHALL state why it was rejected.

#### Scenario: An accepted upload becomes the avatar

- **WHEN** a collector uploads a JPEG, PNG, or WebP image of at most 5 MB
- **THEN** the system stores it, and their account page shows that image as
  their avatar on this and every later visit

#### Scenario: An unsupported image type is refused

- **WHEN** a collector uploads a file that is not a JPEG, PNG, or WebP image
- **THEN** the system refuses it, states the accepted types, and the previous
  avatar is unchanged

#### Scenario: An oversized image is refused

- **WHEN** a collector uploads an image larger than 5 MB
- **THEN** the system refuses it, states the 5 MB limit, and the previous
  avatar is unchanged

#### Scenario: A new upload replaces the previous avatar

- **GIVEN** a collector with an avatar
- **WHEN** they upload another accepted image
- **THEN** the page shows the new image, and the previous one is no longer
  served

### Requirement: A collector removes their avatar and falls back to initials

The system SHALL let a collector remove their avatar, and SHALL show initials
derived from the display name whenever no avatar is set.

#### Scenario: Removing an avatar restores the initials

- **GIVEN** a collector with an avatar
- **WHEN** they remove it
- **THEN** the page shows initials derived from their display name, and the
  removed image is no longer served

#### Scenario: A collector who never uploaded sees initials

- **GIVEN** a collector with no avatar
- **WHEN** they open their account page
- **THEN** the page shows initials derived from their display name

#### Scenario: Initials follow the display name

- **GIVEN** a collector with no avatar
- **WHEN** they change their display name
- **THEN** the initials shown are derived from the new display name

### Requirement: Editing is explicit, and a save that changes nothing is refused

The system SHALL let a collector edit their profile and either save or cancel.
Cancelling SHALL discard the edits and leave the stored profile untouched. A
save SHALL persist every changed field together and return the updated profile.
A save carrying no change SHALL be refused.

#### Scenario: A save persists and is reflected immediately

- **WHEN** a collector saves changed profile fields
- **THEN** the system stores them and the page shows the updated profile
  without needing a reload

#### Scenario: Cancelling discards edits

- **GIVEN** a collector who has edited fields without saving
- **WHEN** they cancel
- **THEN** the page shows the stored profile again and nothing was stored

#### Scenario: A save with no change is refused

- **WHEN** a save request carries no editable field
- **THEN** the system refuses it, stating that at least one field must change,
  and stores nothing

### Requirement: A failed read or save is reported, never hidden

The system SHALL tell the collector when their profile could not be loaded or
saved, and SHALL NOT present a partially loaded profile as if it were complete.

#### Scenario: A failed read is reported

- **WHEN** the profile cannot be loaded
- **THEN** the page states that the profile could not be loaded and shows no
  profile fields

#### Scenario: A failed save keeps the collector's input

- **WHEN** a save fails
- **THEN** the page states that the save failed, keeps the collector's entered
  values so they can retry, and the stored profile is unchanged
