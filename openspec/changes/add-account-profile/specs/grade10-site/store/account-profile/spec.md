## Purpose

The basic information a signed-in collector holds about themselves in the
Grade10 and ZZZ stores — display name, bio, avatar, and the address they signed
in with — and how they read and edit it on their own account page, which both
brands render the same way. Owner-only: nobody but the collector sees their
profile.

## Feature set

- Owner-only access
  - Session is the key: a signed-out request is refused; no input selects another collector
- Always a profile
  - Session defaults: a collector who has never saved still sees a complete page
- Fields
  - Display name, bio, avatar, email, member-since: email is the signed-in address and is read-only
- Avatar
  - Upload and remove: an upload takes a JPEG, PNG or WebP up to 5 MB; removed, the display name's first letter stands in
- Edits
  - Explicit save: empty display name is refused; a save with no field is refused
  - Limits: display name trimmed, 1 to 80 characters; bio trimmed, at most 500
- Failures
  - Reported: a failed read or save is shown; a failed read offers to try again; a failed save keeps the collector's input

## ADDED Requirements

### Requirement: Only the signed-in collector reads or edits their profile

The system SHALL resolve a profile from the caller's session and no other
input. A profile SHALL be readable and editable by its owner alone, and a
request without a session SHALL be refused. A signed-out visit to the account
page SHALL ask the visitor to sign in.

<!-- trace:scenario id=g10.store-account-profile.SC-02h rev=1 -->
#### Scenario: grade10-site-store-account-profile-SC-01 - Signed-out request is refused
**Serves:** grade10-site-store-account-profile-US-01 - Collector opens their own profile

- **GIVEN** a request carrying no session
- **WHEN** it reads or edits a profile
- **THEN** the system refuses it as unauthenticated and returns no profile data

<!-- trace:scenario id=g10.store-account-profile.SC-yoh rev=1 -->
#### Scenario: grade10-site-store-account-profile-SC-34 - A signed-out visit asks for sign-in
**Serves:** grade10-site-store-account-profile-US-01 - Collector opens their own profile

- **GIVEN** a visitor who is not signed in
- **WHEN** they open `/profile`
- **THEN** the page asks them to sign in and shows no profile
- **AND** once they sign in, the page shows their own profile

<!-- trace:scenario id=g10.store-account-profile.SC-1s9 rev=1 -->
#### Scenario: grade10-site-store-account-profile-SC-02 - A collector cannot address another collector's profile
**Serves:** grade10-site-store-account-profile-US-01 - Collector opens their own profile

- **GIVEN** a signed-in collector
- **WHEN** they read or edit a profile
- **THEN** the profile is the one belonging to their own session, and no input
  they supply can select a different collector's profile

### Requirement: The profile page is never empty

The system SHALL return a complete profile for every signed-in collector,
whether or not they have saved anything. Values the collector has not set SHALL
be defaulted from their signed-in account — display name from the account
name, or, when the account has no name, from the part of the signed-in address
before the `@`; avatar as the display name's first letter. The display name SHALL be the one the till
and the wallet pass show for the member. Reading a profile SHALL NOT create or
modify stored data.

<!-- trace:scenario id=g10.store-account-profile.SC-xen rev=1 -->
#### Scenario: grade10-site-store-account-profile-SC-03 - A collector who has never saved sees a profile
**Serves:** grade10-site-store-account-profile-US-01 - Collector opens their own profile

- **GIVEN** a collector who has never saved their profile
- **WHEN** they open their account page
- **THEN** the page shows their account name as the display name, its first
  letter as the avatar, and in place of a bio the line that says what the bio
  is for
- **AND** the page offers editing, not creation — nothing asks them to create a
  profile first

<!-- trace:scenario id=g10.store-account-profile.SC-zfy rev=1 -->
#### Scenario: grade10-site-store-account-profile-SC-04 - A collector whose session carries no name
**Serves:** grade10-site-store-account-profile-US-01 - Collector opens their own profile

- **GIVEN** a collector who signed in by emailed link or code, whose account
  has no name
- **WHEN** they open their account page
- **THEN** the display name shown is the part of their signed-in address before
  the `@`, and the avatar shows its first letter
- **AND** nothing shows a generated identifier in place of a name

<!-- trace:scenario id=g10.store-account-profile.SC-2jt rev=1 -->
#### Scenario: grade10-site-store-account-profile-SC-05 - A read stores nothing
**Serves:** grade10-site-store-account-profile-US-01 - Collector opens their own profile

- **GIVEN** a collector who has never saved their profile
- **WHEN** they open their account page any number of times
- **THEN** no profile record is created for them

<!-- trace:scenario id=g10.store-account-profile.SC-rz7 rev=1 -->
#### Scenario: grade10-site-store-account-profile-SC-06 - A display name the collector never chose is not shown as theirs
**Serves:** grade10-site-store-account-profile-US-01 - Collector opens their own profile

- **GIVEN** a collector whose profile record exists because some other part of
  the store wrote it, carrying a display name they never set
- **WHEN** they open their account page
- **THEN** the display name shown is the account name, else the part of the
  signed-in address before the `@`, not the unset placeholder

<!-- trace:scenario id=g10.store-account-profile.SC-m0o rev=1 -->
#### Scenario: grade10-site-store-account-profile-SC-07 - Saved values win over session defaults
**Serves:** grade10-site-store-account-profile-US-01 - Collector opens their own profile

- **GIVEN** a collector who has saved a display name and a bio
- **WHEN** they open their account page
- **THEN** the page shows their saved values, unchanged, and does not fall back
  to the account name

### Requirement: A profile holds display name, bio, avatar, email, and member-since

The account page SHALL present display name, bio, avatar, the email address of
the signed-in session, and the date the collector first saved their profile.
Member-since SHALL be the date of the collector's first save of any of their
fields — display name, bio or avatar — and not the date some other part of the
store created their record. Display name, bio, and avatar SHALL be editable by
the collector; email SHALL NOT.

<!-- trace:scenario id=g10.store-account-profile.SC-ul5 rev=1 -->
#### Scenario: grade10-site-store-account-profile-SC-08 - Every field is present
**Serves:** grade10-site-store-account-profile-US-01 - Collector opens their own profile

- **GIVEN** a signed-in collector with a saved profile
- **WHEN** they open their account page
- **THEN** the page shows their display name, bio, avatar, signed-in email
  address, and the date they first saved their profile

<!-- trace:scenario id=g10.store-account-profile.SC-h0u rev=1 -->
#### Scenario: grade10-site-store-account-profile-SC-09 - Member-since is absent before the first save
**Serves:** grade10-site-store-account-profile-US-01 - Collector opens their own profile

- **GIVEN** a collector who has never saved their profile
- **WHEN** they open their account page
- **THEN** no member-since date is shown, and its absence is not presented as
  an error

<!-- trace:scenario id=g10.store-account-profile.SC-9g2 rev=1 -->
#### Scenario: grade10-site-store-account-profile-SC-10 - A record another part of the store created dates nothing
**Serves:** grade10-site-store-account-profile-US-01 - Collector opens their own profile

- **GIVEN** a collector whose profile record exists because some other part of
  the store wrote it, and who has never saved it themselves
- **WHEN** they open their account page
- **THEN** no member-since date is shown, and that record's creation date is
  not presented as the date they joined

<!-- trace:scenario id=g10.store-account-profile.SC-tb6 rev=1 -->
#### Scenario: grade10-site-store-account-profile-SC-35 - An avatar saved on its own starts member-since
**Serves:** grade10-site-store-account-profile-US-03 - Collector uploads or removes an avatar

- **GIVEN** a collector who has never saved their profile
- **WHEN** they save a new avatar and nothing else
- **THEN** their account page shows the date of that save as member-since
- **AND** a later save of their display name or bio leaves that date unchanged

### Requirement: Email is read-only

The system SHALL show the email address of the signed-in session, while the
collector reads their profile and while they edit it, and SHALL NOT offer any
way to change it from the account page. An edit that carries an email
address SHALL be refused.

<!-- trace:scenario id=g10.store-account-profile.SC-dzo rev=1 -->
#### Scenario: grade10-site-store-account-profile-SC-11 - The address shown is the one signed in with
**Serves:** grade10-site-store-account-profile-US-04 - Collector's email stays the signed-in address

- **GIVEN** a collector signed in as a given address
- **WHEN** they open their account page, and when they edit their profile
- **THEN** that address is shown in both, and no control edits it

<!-- trace:scenario id=g10.store-account-profile.SC-mtr rev=1 -->
#### Scenario: grade10-site-store-account-profile-SC-12 - An edit carrying an email is refused
**Serves:** grade10-site-store-account-profile-US-04 - Collector's email stays the signed-in address

- **WHEN** an edit request carries an email address
- **THEN** the system refuses the request and changes nothing

### Requirement: Display name is required, trimmed, and at most 80 characters

The system SHALL trim leading and trailing whitespace from a submitted display
name and SHALL require the result to be between 1 and 80 characters. A display
name SHALL NOT be required to be unique. Length SHALL be counted in UTF-16
code units, as the field and the store both count it.

<!-- trace:scenario id=g10.store-account-profile.SC-1ku rev=1 -->
#### Scenario: grade10-site-store-account-profile-SC-13 - Whitespace is trimmed before saving
**Serves:** grade10-site-store-account-profile-US-02 - Collector edits display name and bio

- **WHEN** a collector saves a display name with leading or trailing whitespace
- **THEN** the saved and returned display name has that whitespace removed

<!-- trace:scenario id=g10.store-account-profile.SC-3hb rev=1 -->
#### Scenario: grade10-site-store-account-profile-SC-14 - An empty display name is refused
**Serves:** grade10-site-store-account-profile-US-02 - Collector edits display name and bio

- **WHEN** a collector saves a display name that is empty or only whitespace
- **THEN** the system refuses the edit, states that a display name is required,
  and changes nothing

<!-- trace:scenario id=g10.store-account-profile.SC-pve rev=1 -->
#### Scenario: grade10-site-store-account-profile-SC-15 - An over-length display name is refused
**Serves:** grade10-site-store-account-profile-US-02 - Collector edits display name and bio

- **WHEN** a collector saves a display name longer than 80 characters after
  trimming
- **THEN** the system refuses the edit, states the 80-character limit, and
  changes nothing

<!-- trace:scenario id=g10.store-account-profile.SC-plw rev=1 -->
#### Scenario: grade10-site-store-account-profile-SC-16 - Two collectors may hold the same display name
**Serves:** grade10-site-store-account-profile-US-02 - Collector edits display name and bio

- **GIVEN** a display name already saved by another collector
- **WHEN** a collector saves that same display name
- **THEN** the system accepts it

### Requirement: Bio is optional, trimmed, and at most 500 characters

The system SHALL trim a submitted bio, SHALL accept up to 500 characters,
counted the same way, and SHALL let a collector clear it.

<!-- trace:scenario id=g10.store-account-profile.SC-6r5 rev=1 -->
#### Scenario: grade10-site-store-account-profile-SC-17 - A bio within the limit is saved
**Serves:** grade10-site-store-account-profile-US-02 - Collector edits display name and bio

- **WHEN** a collector saves a bio of 500 characters or fewer after trimming
- **THEN** the system stores it and the page shows it

<!-- trace:scenario id=g10.store-account-profile.SC-d7k rev=1 -->
#### Scenario: grade10-site-store-account-profile-SC-18 - An over-length bio is refused
**Serves:** grade10-site-store-account-profile-US-02 - Collector edits display name and bio

- **WHEN** a collector saves a bio longer than 500 characters after trimming
- **THEN** the system refuses the edit, states the 500-character limit, and
  changes nothing

<!-- trace:scenario id=g10.store-account-profile.SC-kuq rev=1 -->
#### Scenario: grade10-site-store-account-profile-SC-19 - A bio is cleared
**Serves:** grade10-site-store-account-profile-US-02 - Collector edits display name and bio

- **GIVEN** a collector with a saved bio
- **WHEN** they clear it and save
- **THEN** the profile holds no bio, and the page shows the line that says what
  the bio is for, never the previous text

### Requirement: A collector uploads an avatar image

The system SHALL store a collector's avatar square, at 512 by 512 pixels. An
avatar upload SHALL carry a JPEG, PNG, or WebP image of at most 5 MB
(5,242,880 bytes), and the system SHALL refuse any other upload, whoever sends
it. An upload SHALL replace whatever avatar the collector had. Each profile's
image SHALL have an address of its own, which changes whenever the image does.
An image SHALL answer at its address only while its profile holds it. The
storage sweep SHALL delete an image its profile no longer holds once it is at
least a day old, so an upload still in flight is never deleted. A copy already held in a cache outside the
system MAY answer the replaced image's address until that cache expires. A
rejected upload SHALL leave the previous avatar in place and SHALL state why
it was rejected.

<!-- trace:scenario id=g10.store-account-profile.SC-tbm rev=1 -->
#### Scenario: grade10-site-store-account-profile-SC-20 - An accepted upload becomes the avatar
**Serves:** grade10-site-store-account-profile-US-03 - Collector uploads or removes an avatar

- **WHEN** a collector chooses an image and saves
- **THEN** the system stores it square at 512 by 512 pixels, and their account
  page shows it as their avatar on this and every later visit

<!-- trace:scenario id=g10.store-account-profile.SC-5wx rev=1 -->
#### Scenario: grade10-site-store-account-profile-SC-21 - An unsupported image type is refused
**Serves:** grade10-site-store-account-profile-US-03 - Collector uploads or removes an avatar

- **WHEN** an avatar upload carries a file that is not a JPEG, PNG, or WebP
  image
- **THEN** the system refuses it, states the accepted types, and the previous
  avatar is unchanged

<!-- trace:scenario id=g10.store-account-profile.SC-31a rev=1 -->
#### Scenario: grade10-site-store-account-profile-SC-22 - An oversized image is refused
**Serves:** grade10-site-store-account-profile-US-03 - Collector uploads or removes an avatar

- **WHEN** an avatar upload carries an image larger than 5 MB
- **THEN** the system refuses it, states the 5 MB limit, and the previous
  avatar is unchanged

<!-- trace:scenario id=g10.store-account-profile.SC-xy9 rev=1 -->
#### Scenario: grade10-site-store-account-profile-SC-23 - A new upload replaces the previous avatar
**Serves:** grade10-site-store-account-profile-US-03 - Collector uploads or removes an avatar

- **GIVEN** a collector with an avatar
- **WHEN** they upload another accepted image
- **THEN** the page shows the new image at a different address, the previous
  image stops answering at its address, and the storage sweep deletes it once
  it is a day old

<!-- trace:scenario id=g10.store-account-profile.SC-hjj rev=1 -->
#### Scenario: grade10-site-store-account-profile-SC-38 - Two collectors with the same image each hold their own
**Serves:** grade10-site-store-account-profile-US-03 - Collector uploads or removes an avatar

- **GIVEN** two collectors who upload the same image as their avatars
- **WHEN** one of them removes theirs
- **THEN** the two avatars had different addresses
- **AND** the other collector's image still answers at its address

### Requirement: A collector removes their avatar and falls back to the display name's first letter

The system SHALL let a collector remove their avatar, and SHALL treat the
removed image as it treats a replaced one. Whenever no avatar is set, the
system SHALL show the display name's first letter in its place: one character,
the first letter or digit in any script, read from the whole display name and
upper-cased, as the account menu draws it, and `?` for a display name with
neither.

<!-- trace:scenario id=g10.store-account-profile.SC-f4k rev=1 -->
#### Scenario: grade10-site-store-account-profile-SC-24 - Removing an avatar restores the letter
**Serves:** grade10-site-store-account-profile-US-03 - Collector uploads or removes an avatar

- **GIVEN** a collector with an avatar
- **WHEN** they remove it
- **THEN** the page shows their display name's first letter, the removed
  image stops answering at its address, and the storage sweep deletes it once
  it is a day old

<!-- trace:scenario id=g10.store-account-profile.SC-4fv rev=1 -->
#### Scenario: grade10-site-store-account-profile-SC-25 - A collector who never uploaded sees the letter
**Serves:** grade10-site-store-account-profile-US-03 - Collector uploads or removes an avatar

- **GIVEN** a collector with no avatar
- **WHEN** they open their account page
- **THEN** the page shows their display name's first letter

<!-- trace:scenario id=g10.store-account-profile.SC-ps1 rev=1 -->
#### Scenario: grade10-site-store-account-profile-SC-26 - The letter follows the display name
**Serves:** grade10-site-store-account-profile-US-03 - Collector uploads or removes an avatar

- **GIVEN** a collector with no avatar
- **WHEN** they change their display name
- **THEN** the letter shown is the new display name's first letter

<!-- trace:scenario id=g10.store-account-profile.SC-el0 rev=1 -->
#### Scenario: grade10-site-store-account-profile-SC-36 - The letter is read in any script
**Serves:** grade10-site-store-account-profile-US-03 - Collector uploads or removes an avatar

- **GIVEN** a collector with no avatar
- **WHEN** their display name is `陳大文`, `ångström`, `@kitlam` or `🃏🃏`
- **THEN** the page shows `陳`, `Å`, `K` or `?` in the avatar's place

### Requirement: Editing is explicit, and a save carrying no field is refused

The system SHALL let a collector edit their profile and either save or cancel.
Cancelling SHALL discard the edits and leave the stored profile untouched. A
save SHALL persist the display name and bio it carries together — both or
neither — and SHALL return the updated profile. A save carrying no editable
field SHALL be refused; a save repeating the stored values SHALL be accepted
and change no field.

An avatar is set and removed on its own, so an edit touching both the avatar
and the text fields SHALL report each outcome and SHALL NOT present a refused
text save as having undone an accepted avatar change. An edit whose avatar is
refused SHALL save none of its text fields.

<!-- trace:scenario id=g10.store-account-profile.SC-zu6 rev=1 -->
#### Scenario: grade10-site-store-account-profile-SC-27 - A save persists and is reflected immediately
**Serves:** grade10-site-store-account-profile-US-02 - Collector edits display name and bio

- **WHEN** a collector saves changed profile fields
- **THEN** the system stores them and the page shows the updated profile
  without needing a reload

<!-- trace:scenario id=g10.store-account-profile.SC-akq rev=1 -->
#### Scenario: grade10-site-store-account-profile-SC-28 - Cancelling discards edits
**Serves:** grade10-site-store-account-profile-US-02 - Collector edits display name and bio

- **GIVEN** a collector who has edited fields without saving
- **WHEN** they cancel
- **THEN** the page shows the stored profile again and nothing was stored

<!-- trace:scenario id=g10.store-account-profile.SC-cll rev=1 -->
#### Scenario: grade10-site-store-account-profile-SC-29 - A save with no field is refused
**Serves:** grade10-site-store-account-profile-US-02 - Collector edits display name and bio

- **WHEN** a save request carries no editable field
- **THEN** the system refuses it, stating that it carried nothing to save, and
  stores nothing

<!-- trace:scenario id=g10.store-account-profile.SC-oj6 rev=1 -->
#### Scenario: grade10-site-store-account-profile-SC-37 - A first save that repeats the stored values starts member-since
**Serves:** grade10-site-store-account-profile-US-02 - Collector edits display name and bio

- **GIVEN** a collector who has never saved their profile, and who holds no bio
- **WHEN** their first save carries only an empty bio
- **THEN** no stored field changes
- **AND** their account page shows the date of that save as member-since

<!-- trace:scenario id=g10.store-account-profile.SC-q8y rev=1 -->
#### Scenario: grade10-site-store-account-profile-SC-30 - An accepted avatar stands when the text save is refused
**Serves:** grade10-site-store-account-profile-US-03 - Collector uploads or removes an avatar

- **GIVEN** a collector who changes their avatar and their display name in one
  edit
- **WHEN** the avatar is accepted and the display name is refused
- **THEN** the page shows the new avatar, states why the display name was
  refused, and keeps the collector's entered text so they can retry
- **AND** the stored display name and bio are unchanged

<!-- trace:scenario id=g10.store-account-profile.SC-zxs rev=1 -->
#### Scenario: grade10-site-store-account-profile-SC-33 - A refused avatar saves nothing else
**Serves:** grade10-site-store-account-profile-US-05 - Collector is told when a read or save fails

- **GIVEN** a collector who changes their avatar and their display name in one
  edit
- **WHEN** the avatar is refused or cannot be saved
- **THEN** the page states why, keeps the entered text and the chosen image so
  they can retry, and the stored profile is unchanged

### Requirement: A failed read or save is reported, never hidden

The system SHALL tell the collector when their profile could not be loaded or
saved, and SHALL NOT present a partially loaded profile as if it were complete.
A failed read SHALL offer to try again.

<!-- trace:scenario id=g10.store-account-profile.SC-tvg rev=1 -->
#### Scenario: grade10-site-store-account-profile-SC-31 - A failed read is reported
**Serves:** grade10-site-store-account-profile-US-05 - Collector is told when a read or save fails

- **WHEN** the profile cannot be loaded
- **THEN** the page states that the profile could not be loaded, shows no
  profile fields, and offers to try again
- **AND** trying again once the profile can be loaded shows it

<!-- trace:scenario id=g10.store-account-profile.SC-7oe rev=1 -->
#### Scenario: grade10-site-store-account-profile-SC-32 - A failed save keeps the collector's input
**Serves:** grade10-site-store-account-profile-US-05 - Collector is told when a read or save fails

- **WHEN** a save fails
- **THEN** the page states that the save failed, keeps the collector's entered
  values so they can retry, and the stored profile is unchanged
