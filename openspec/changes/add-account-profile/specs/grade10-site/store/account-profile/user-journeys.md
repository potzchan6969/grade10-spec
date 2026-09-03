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
