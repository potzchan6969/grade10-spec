# grade10-site/store/account-profile Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## Background

* The run is on staging, where Grade10 carries the account page.
* `<grade10 profile url>` is `https://grade10-stg.com/profile`; `<zzz profile url>` is the ZZZ site's `/profile` on staging.

## grade10-site-store-account-profile-US1: Collector opens their own profile

**As a** signed-in collector,
**I want** the account page to show my profile even if I have never saved,
**so that** I am not asked to create a record, and nobody else can open mine.

### grade10-site-store-account-profile-US1-TC1-1: Never-saved collector sees a complete profile from sign-in

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-account-profile-US-01

**Pre-conditions:**

* customer(has never saved a profile) is signed in as <signed-in address>, on an account named <account name>.

**Test data:**

| Field | Value |
| --- | --- |
| <signed-in address> | An address the collector signs in with, for example `kit.lam@example.com` |
| <account name> | `Kit Lam` |

| <profile url> |
| --- |
| <grade10 profile url> |
| <zzz profile url> |

**Steps:**

1. Navigate to <profile url>.
2. Read the display name, avatar, bio, email and member-since.

**Expected Results:**

* The profile loads; no form asks to create a profile.
* The display name reads <account name>.
* The avatar shows `K`, the first letter of <account name>.
* The bio shows the line saying what a bio is for.
* The email reads <signed-in address>.
* No member-since date shows, and no error.
* An edit control is offered.

### grade10-site-store-account-profile-US1-TC2-1: Nameless account shows the address before the @ as its name

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-account-profile-US-01

**Pre-conditions:**

* customer(has never saved a profile) is signed in as <signed-in address>, on an account that holds no name.

**Test data:**

| Field | Value |
| --- | --- |
| <signed-in address> | `mika.tan@example.com` |

**Steps:**

1. Navigate to <grade10 profile url>.
2. Read the display name and the avatar.

**Expected Results:**

* The display name reads `mika.tan`, the part of <signed-in address> before the `@`.
* The avatar shows `M`, the first letter of `mika.tan`.

### grade10-site-store-account-profile-US1-TC3-1: Saved profile reads back, member-since at the first save

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-account-profile-US-01

**Pre-conditions:**

* customer first saved a profile on <first save date> and saved it again on <later save date>.
* The profile holds <display name>, <bio> and an avatar of their own.

**Test data:**

| Field | Value |
| --- | --- |
| <first save date> | Any date before <later save date> |
| <later save date> | Any later date |
| <display name> | `Kit Collector` |
| <bio> | `Pokémon since Base Set.` |

**Steps:**

1. Navigate to <grade10 profile url>.
2. Read the display name, avatar, bio, email and member-since.

**Expected Results:**

* The display name reads <display name>, and the bio <bio>.
* The avatar shows the collector's image, not the display name's first letter.
* The email reads the signed-in address.
* Member-since reads <first save date>, not <later save date>.

### grade10-site-store-account-profile-US1-TC4-1: Signed-out visit to the profile asks for sign-in

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-account-profile-US-01

**Pre-conditions:**

* customer is signed out, holding an account they can sign in to.

**Steps:**

1. Navigate to <grade10 profile url>.
2. Sign in as customer.

**Expected Results:**

* Step 1 asks for sign-in.
* Step 1 shows no profile field.
* After step 2, the page shows customer's own profile.

### grade10-site-store-account-profile-US1-TC5-1: Signed-out profile requests are refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-account-profile-US-01

**Pre-conditions:**

* No session is sent with the request.

**Test data:**

| <request> |
| --- |
| Read the profile |
| Save a display name |
| Upload an avatar |

**Steps:**

1. Send <request> to the store.
2. Read the API response.

**Expected Results:**

* The request is refused as signed out.
* No profile is returned or written.

### grade10-site-store-account-profile-US1-TC6-1: Naming another collector reaches only the caller's own profile

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-account-profile-US-01

**Pre-conditions:**

* customer A is signed in; customer B has saved a profile holding <B's name>.

**Test data:**

| Field | Value |
| --- | --- |
| <B's id> | customer B's account id |
| <B's name> | `Collector B` |
| <new name> | `Changed By A` |

| <request> |
| --- |
| Read the profile, with <B's id> added to the request |
| Save <new name>, with <B's id> added to the request |

**Steps:**

1. Send <request> in customer A's session.
2. Read the API response.
3. Read customer B's profile in customer B's session.

**Expected Results:**

* Step 2 answers with customer A's profile, or refuses; never customer B's.
* Step 3 still reads <B's name>.

### grade10-site-store-account-profile-US1-TC7-1: A record the store wrote gives no name and no member-since

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-account-profile-US-01

**Pre-conditions:**

* customer(has never saved a profile) is signed in, on an account named <account name>.
* The store holds a profile record for customer: <record>.

**Test data:**

| Field | Value |
| --- | --- |
| <account name> | `Kit Lam` |

| <record> |
| --- |
| Written when customer joined the membership at a store's till |
| Written before this change shipped, holding the placeholder name earlier records carry |

**Steps:**

1. Navigate to <grade10 profile url>.
2. Read the display name and member-since.

**Expected Results:**

* The display name reads <account name>, never the placeholder name.
* No member-since date shows, and no error.

---

## grade10-site-store-account-profile-US2: Collector edits display name and bio

**As a** signed-in collector,
**I want** to save a trimmed display name and an optional bio,
**so that** an empty or over-length name is refused, and cancelling discards the draft.

### grade10-site-store-account-profile-US2-TC1-1: First save stores a trimmed name and bio and starts member-since

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-account-profile-US-02

**Pre-conditions:**

* customer(has never saved a profile) is signed in.

**Test data:**

| Field | Value |
| --- | --- |
| <typed name> | `  Kit Collector  `, two spaces either side |
| <typed bio> | `  Pokémon since Base Set.  `, two spaces either side |
| <save date> | The date of the run |

| <profile url> |
| --- |
| <grade10 profile url> |
| <zzz profile url> |

**Steps:**

1. Navigate to <profile url>.
2. Click the edit control.
3. Replace the display name with <typed name>.
4. Replace the bio with <typed bio>.
5. Click the save button.
6. Reload the page.

**Expected Results:**

* Step 5 returns to the read view.
* The display name reads `Kit Collector`, no surrounding spaces.
* The bio reads `Pokémon since Base Set.`, no surrounding spaces.
* Member-since reads <save date>.
* After step 6, the same name, bio and member-since show.

### grade10-site-store-account-profile-US2-TC2-1: Display name saves at its limits

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-account-profile-US-02

**Pre-conditions:**

* customer is signed in and has saved a profile.

**Test data:**

| <typed name> | Saved as |
| --- | --- |
| `K`, 1 character | `K` |
| 80 Latin characters | the same 80 characters |
| 80 Chinese characters, such as `陳` 80 times | the same 80 characters |
| 40 emoji, such as `🃏` 40 times, 80 code units | the same 40 emoji |

**Steps:**

1. Navigate to <grade10 profile url>.
2. Click the edit control.
3. Replace the display name with <typed name>.
4. Click the save button.
5. Reload the page.

**Expected Results:**

* Step 4 returns to the read view.
* After step 5, the display name reads the row's saved value.

### grade10-site-store-account-profile-US2-TC3-1: Empty display name is refused and the input kept

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-account-profile-US-02

**Pre-conditions:**

* customer is signed in and has saved a profile holding <stored name>.

**Test data:**

| Field | Value |
| --- | --- |
| <stored name> | `Kit Collector` |
| <typed bio> | `New bio` |

| <typed name> |
| --- |
| Nothing: the field emptied |
| Three spaces |

**Steps:**

1. Navigate to <grade10 profile url>.
2. Click the edit control.
3. Replace the display name with <typed name>.
4. Replace the bio with <typed bio>.
5. Click the save button.
6. Reload the page.

**Expected Results:**

* Step 5 shows why the save was refused, and the form stays open.
* The form still holds <typed name> and <typed bio>.
* After step 6, the display name reads <stored name>, and the bio is the one stored before.

### grade10-site-store-account-profile-US2-TC4-1: Bio saves at its limit, and an emptied bio clears

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-account-profile-US-02

**Pre-conditions:**

* customer is signed in and has saved a profile holding a bio.

**Test data:**

| <typed bio> | The bio then shows |
| --- | --- |
| 500 characters | the same 500 characters |
| Nothing: the field emptied | the line saying what a bio is for |
| Three spaces | the line saying what a bio is for |

**Steps:**

1. Navigate to <grade10 profile url>.
2. Click the edit control.
3. Replace the bio with <typed bio>.
4. Click the save button.
5. Reload the page.

**Expected Results:**

* Step 4 returns to the read view.
* After step 5, the bio shows the row's outcome.

### grade10-site-store-account-profile-US2-TC5-1: Name and bio fields take nothing past their limits

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-account-profile-US-02

**Pre-conditions:**

* customer is signed in and has saved a profile.

**Test data:**

| <field> | <typed text> | <limit> |
| --- | --- | --- |
| Display name | 81 Latin characters | 80 characters |
| Display name | 41 emoji, such as `🃏` 41 times, 82 code units | 40 emoji, 80 code units |
| Bio | 501 Latin characters | 500 characters |

**Steps:**

1. Navigate to <grade10 profile url>.
2. Click the edit control.
3. Type <typed text> into <field>.
4. Click the save button.
5. Reload the page.

**Expected Results:**

* Step 3 leaves <field> holding <limit>, never more.
* After step 5, <field> reads no more than <limit>.

### grade10-site-store-account-profile-US2-TC6-1: Store refuses an over-limit, empty or fieldless save

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-account-profile-US-02

**Pre-conditions:**

* customer is signed in and has saved a profile holding <stored name> and <stored bio>.

**Test data:**

| Field | Value |
| --- | --- |
| <stored name> | `Kit Collector` |
| <stored bio> | `Pokémon since Base Set.` |

| <save> | Refused for |
| --- | --- |
| A display name of 81 Latin characters | the 80-character limit |
| A display name of 41 emoji, 82 code units | the 80-character limit |
| A display name of three spaces | a display name is required |
| A bio of 501 characters | the 500-character limit |
| No field at all | nothing to save |

**Steps:**

1. Send a profile save carrying <save> in the collector's session.
2. Read the API response.
3. Read the profile.

**Expected Results:**

* Step 2 refuses the save, naming the row's reason.
* Step 3 still reads <stored name> and <stored bio>.

### grade10-site-store-account-profile-US2-TC7-1: Cancel discards the draft

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-account-profile-US-02

**Pre-conditions:**

* customer is signed in and has saved a profile holding <stored name>, <stored bio> and an avatar of their own.

**Test data:**

| Field | Value |
| --- | --- |
| <stored name> | `Kit Collector` |
| <stored bio> | `Pokémon since Base Set.` |
| <typed name> | `Someone Else` |
| <typed bio> | `Draft bio` |
| <new image> | A JPEG of about 1 MB |

**Steps:**

1. Navigate to <grade10 profile url>.
2. Click the edit control.
3. Replace the display name with <typed name>.
4. Replace the bio with <typed bio>.
5. Choose <new image> with the avatar control.
6. Click the cancel control.
7. Click the edit control.

**Expected Results:**

* Step 6 returns to the read view showing <stored name>, <stored bio> and the stored avatar.
* Step 7 opens the form holding <stored name> and <stored bio>, with the stored avatar.

### grade10-site-store-account-profile-US2-TC8-1: Two collectors save the same display name

**Classification:**

* **Severity:** normal
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-account-profile-US-02

**Pre-conditions:**

* customer A has saved the display name <shared name>.
* customer B is signed in and has saved a different display name.

**Test data:**

| Field | Value |
| --- | --- |
| <shared name> | `Kit Collector` |

**Steps:**

1. Navigate to <grade10 profile url> as customer B.
2. Click the edit control.
3. Replace the display name with <shared name>.
4. Click the save button.
5. Reload the page.
6. Read customer A's profile in customer A's session.

**Expected Results:**

* Step 4 returns to the read view, with no refusal.
* After step 5, customer B's display name reads <shared name>.
* Step 6 still reads <shared name>.

### grade10-site-store-account-profile-US2-TC9-1: Store trims a value before it measures the limit

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-account-profile-US-02

**Pre-conditions:**

* customer is signed in and has saved a profile.

**Test data:**

| <save> | Saved as |
| --- | --- |
| A display name of 80 Latin characters, a space either side | the 80 characters, no spaces |
| A bio of 500 Latin characters, a space either side | the 500 characters, no spaces |

**Steps:**

1. Send a profile save carrying <save> in the collector's session.
2. Read the API response.
3. Read the profile.

**Expected Results:**

* Step 2 accepts the save.
* Step 3 reads the row's saved value.

---

## grade10-site-store-account-profile-US3: Collector uploads or removes an avatar

**As a** signed-in collector,
**I want** an accepted image as my avatar and a remove that restores my display name's first letter,
**so that** a bad file is refused and the letter follows the display name I actually have.

### grade10-site-store-account-profile-US3-TC1-1: Chosen image becomes the avatar, square

Runs once for each <image> row on each <profile url>.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-account-profile-US-03

**Pre-conditions:**

* customer is signed in and has no avatar.

**Test data:**

| <image> |
| --- |
| A landscape JPEG of about 1 MB |
| A portrait PNG of about 1 MB |
| A square WebP of about 1 MB |

| <profile url> |
| --- |
| <grade10 profile url> |
| <zzz profile url> |

**Steps:**

1. Navigate to <profile url>.
2. Click the edit control.
3. Choose <image> with the avatar control.
4. Click the save button.
5. Reload the page.
6. Open the avatar's image on its own.

**Expected Results:**

* Step 3 previews <image> in the avatar's place.
* Step 4 returns to the read view showing <image> as the avatar.
* After step 5, the same avatar shows.
* Step 6 shows a square image, 512 by 512 pixels.

### grade10-site-store-account-profile-US3-TC2-1: Removing the avatar restores the display name's first letter

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-account-profile-US-03

**Pre-conditions:**

* customer is signed in with an avatar of their own and the display name <stored name>.

**Test data:**

| Field | Value |
| --- | --- |
| <stored name> | `Kit Collector` |

**Steps:**

1. Navigate to <grade10 profile url>.
2. Click the edit control.
3. Click the remove control on the avatar.
4. Click the save button.
5. Reload the page.

**Expected Results:**

* Step 3 shows `K`, the first letter of <stored name>, in the avatar's place.
* Step 4 returns to the read view showing `K`.
* After step 5, `K` still shows.

### grade10-site-store-account-profile-US3-TC3-1: The letter follows a newly saved display name

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-account-profile-US-03

**Pre-conditions:**

* customer is signed in with no avatar and the display name <stored name>.

**Test data:**

| Field | Value |
| --- | --- |
| <stored name> | `Kit Collector` |

| <new name> | The avatar shows |
| --- | --- |
| `Mika Tan` | `M` |
| `陳大文` | `陳` |
| `ångström` | `Å` |
| `#1 Fan` | `1` |
| `🃏🃏` | `?` |

**Steps:**

1. Navigate to <grade10 profile url>.
2. Click the edit control.
3. Replace the display name with <new name>.
4. Click the save button.

**Expected Results:**

* Step 4 shows the row's letter in the avatar's place, not `K`.

### grade10-site-store-account-profile-US3-TC4-1: A file that is not an image is refused

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-account-profile-US-03

**Pre-conditions:**

* customer is signed in with an avatar of their own.

**Test data:**

| Field | Value |
| --- | --- |
| <not an image> | A PDF of about 100 KB |

**Steps:**

1. Navigate to <grade10 profile url>.
2. Click the edit control.
3. Choose <not an image> with the avatar control.
4. Click the save button.
5. Reload the page.

**Expected Results:**

* By step 4, <not an image> is refused with a reason shown.
* After step 5, the stored avatar still shows.

### grade10-site-store-account-profile-US3-TC5-1: Store refuses an avatar upload outside its type and size

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-account-profile-US-03

**Pre-conditions:**

* customer is signed in with an avatar of their own.

**Test data:**

| <upload> | Refused for |
| --- | --- |
| A GIF of about 100 KB | the accepted types: JPEG, PNG and WebP |
| A JPEG of 5242881b (5MiB plus one byte, ~5.24MB) | the 5 MB limit |

**Steps:**

1. Send an avatar upload of <upload> in the collector's session.
2. Read the API response.
3. Read the profile.

**Expected Results:**

* Step 2 refuses the upload, naming the row's reason.
* Step 3 still carries the stored avatar.

### grade10-site-store-account-profile-US3-TC6-1: A refused name keeps the newly accepted avatar

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-account-profile-US-03

**Pre-conditions:**

* customer is signed in with no avatar and the display name <stored name>.

**Test data:**

| Field | Value |
| --- | --- |
| <stored name> | `Kit Collector` |
| <new image> | A JPEG of about 1 MB |

**Steps:**

1. Navigate to <grade10 profile url>.
2. Click the edit control.
3. Choose <new image> with the avatar control.
4. Empty the display name.
5. Click the save button.
6. Reload the page.

**Expected Results:**

* Step 5 shows why the name was refused, the emptied name still in the form.
* Step 5 shows <new image> as the avatar.
* After step 6, the avatar is <new image> and the display name reads <stored name>.

### grade10-site-store-account-profile-US3-TC7-1: An avatar that fails to load shows the display name's first letter

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-account-profile-US-03

**Pre-conditions:**

* customer is signed in with an avatar of their own and the display name <stored name>.
* Network conditions are manipulated to block the avatar's image.

**Test data:**

| Field | Value |
| --- | --- |
| <stored name> | `Kit Collector` |

**Steps:**

1. Navigate to <grade10 profile url>.
2. Click the edit control.

**Expected Results:**

* Step 1 shows `K`, the first letter of <stored name>, in the avatar's place, no broken image.
* Step 2 shows the same `K` in the form's avatar.

### grade10-site-store-account-profile-US3-TC8-1: An avatar's old address stops answering once it is replaced or removed

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-account-profile-US-03

**Pre-conditions:**

* customer is signed in with an avatar of their own, its image address recorded as <old address>.

**Test data:**

| <change> |
| --- |
| Click the remove control on the avatar |
| Choose a JPEG of about 1 MB with the avatar control |

**Steps:**

1. Navigate to <grade10 profile url>.
2. Click the edit control.
3. <change>.
4. Click the save button.
5. Request <old address> in the collector's session from a browser with no cached copy.

**Expected Results:**

* Step 4 returns to the read view without the old image.
* For the chosen-image row, the new avatar's address differs from <old address>.
* Step 5 returns no image.

### grade10-site-store-account-profile-US3-TC9-1: Store accepts an avatar upload at the 5 MB limit

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-account-profile-US-03

**Pre-conditions:**

* customer is signed in and has no avatar.

**Test data:**

| Field | Value |
| --- | --- |
| <upload> | A JPEG of 5242880b (5MiB, ~5.24MB) |

**Steps:**

1. Send an avatar upload of <upload> in the collector's session.
2. Read the API response.
3. Read the profile.

**Expected Results:**

* Step 2 accepts the upload.
* Step 3 carries an avatar.

### grade10-site-store-account-profile-US3-TC10-1: An avatar saved on its own starts member-since

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-account-profile-US-03

**Pre-conditions:**

* customer is signed in, in the <starting state> of the row.

**Test data:**

| Field | Value |
| --- | --- |
| <new image> | A JPEG of about 1 MB |
| <earlier date> | Any date before the run |
| <run date> | The date of the run |

| <starting state> | <edit> | Member-since then reads |
| --- | --- | --- |
| Never saved a profile, no avatar | Choose <new image> with the avatar control | <run date> |
| First saved on <earlier date>, with an avatar and nothing else | Replace the display name with `Kit Collector` | <earlier date> |

**Steps:**

1. Navigate to <grade10 profile url>.
2. Click the edit control.
3. <edit>.
4. Click the save button.
5. Reload the page.

**Expected Results:**

* Step 4 returns to the read view showing the edit.
* After step 5, member-since reads the row's date.

--- | --- |
| <new image> | A JPEG of about 1 MB |
| <save date> | The date of the run |
| <typed name> | `Kit Collector` |

**Steps:**

1. Navigate to <grade10 profile url>.
2. Click the edit control.
3. Choose <new image> with the avatar control.
4. Click the save button.
5. Reload the page.
6. Click the edit control.
7. Replace the display name with <typed name>.
8. Click the save button.

**Expected Results:**

* Step 4 returns to the read view showing <new image> as the avatar.
* After step 5, member-since reads <save date>.
* Step 8 shows <typed name>, and member-since still reads <save date>.

---

## grade10-site-store-account-profile-US4: Collector's email stays the signed-in address

**As a** signed-in collector,
**I want** the address on the page to be the one I signed in with, and an edit that carries an email to be refused,
**so that** I cannot change how I sign in from this page.

### grade10-site-store-account-profile-US4-TC1-1: Email shows read-only in the read view and the form

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-account-profile-US-04

**Pre-conditions:**

* customer is signed in as <signed-in address> and has saved a profile.

**Test data:**

| Field | Value |
| --- | --- |
| <signed-in address> | `kit.lam@example.com` |

| <profile url> |
| --- |
| <grade10 profile url> |
| <zzz profile url> |

**Steps:**

1. Navigate to <profile url>.
2. Read the email.
3. Click the edit control.
4. Click the email in the form and type `x`.

**Expected Results:**

* Step 2 reads <signed-in address>.
* Step 3 shows <signed-in address> in the form.
* Step 4 changes nothing: the email still reads <signed-in address>.

### grade10-site-store-account-profile-US4-TC2-1: A save carrying an email is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-account-profile-US-04

**Pre-conditions:**

* customer is signed in as <signed-in address> and has saved a profile holding <stored name>.

**Test data:**

| Field | Value |
| --- | --- |
| <signed-in address> | `kit.lam@example.com` |
| <stored name> | `Kit Collector` |
| <other address> | `someone.else@example.com` |

| <save> |
| --- |
| An email of <other address> alone |
| An email of <other address> with a display name of `New Name` |

**Steps:**

1. Send a profile save carrying <save> in the collector's session.
2. Read the API response.
3. Read the profile.

**Expected Results:**

* Step 2 refuses the save.
* Step 3 reads <signed-in address> as the email and <stored name> as the display name.

---

## grade10-site-store-account-profile-US5: Collector is told when a read or save fails

**As a** signed-in collector,
**I want** a failed read reported and a failed save to keep what I typed,
**so that** a network miss does not look like an empty profile or a successful save.

### grade10-site-store-account-profile-US5-TC1-1: Failed read says the profile could not be read, not an empty profile

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-account-profile-US-05

**Pre-conditions:**

* customer is signed in and has saved a profile holding <stored name>.
* The profile read is mocked to fail.

**Test data:**

| Field | Value |
| --- | --- |
| <stored name> | `Kit Collector` |

**Steps:**

1. Navigate to <grade10 profile url>.

**Expected Results:**

* Step 1 shows that the profile could not be read.
* Step 1 shows no profile field, not <stored name>, and no edit control.

### grade10-site-store-account-profile-US5-TC2-1: Failed save keeps what was typed and stores nothing

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-account-profile-US-05

**Pre-conditions:**

* customer is signed in and has saved a profile holding <stored name> and <stored bio>.
* The profile save is mocked to fail.

**Test data:**

| Field | Value |
| --- | --- |
| <stored name> | `Kit Collector` |
| <stored bio> | `Pokémon since Base Set.` |
| <typed name> | `Kit Lam` |
| <typed bio> | `Graded cards only.` |

**Steps:**

1. Navigate to <grade10 profile url>.
2. Click the edit control.
3. Replace the display name with <typed name>.
4. Replace the bio with <typed bio>.
5. Click the save button.
6. Restore the profile save and reload the page.

**Expected Results:**

* Step 5 shows that the save failed, and the form stays open.
* The form still holds <typed name> and <typed bio>.
* After step 6, the profile reads <stored name> and <stored bio>.

### grade10-site-store-account-profile-US5-TC3-1: A failed or refused avatar saves nothing else and keeps both

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-account-profile-US-05

**Pre-conditions:**

* customer is signed in with an avatar of their own and has saved a profile holding <stored name>.
* The avatar upload is mocked to answer <upload answer>.

**Test data:**

| Field | Value |
| --- | --- |
| <stored name> | `Kit Collector` |
| <typed name> | `Kit Lam` |
| <new image> | A JPEG of about 1 MB |

| <upload answer> |
| --- |
| A failure: no answer reaches the page |
| A refusal of the image |

**Steps:**

1. Navigate to <grade10 profile url>.
2. Click the edit control.
3. Choose <new image> with the avatar control.
4. Replace the display name with <typed name>.
5. Click the save button.
6. Open <grade10 profile url> in a second tab.
7. Restore the avatar upload.
8. Click the save button in the first tab.

**Expected Results:**

* Step 5 shows why the image was not saved, and the form stays open.
* The form still holds <typed name> and previews <new image>.
* Step 6 reads <stored name> with the stored avatar.
* Step 8 returns to the read view showing <typed name> and <new image>.

## Settled

- The avatar's fallback is one character: the display name's first letter or digit in any script, upper-cased, as the account menu draws it, and `?` for a display name with neither.
- A length counts as the field counts it, in UTF-16 code units: a Chinese character counts one, and an emoji can count two.
- The avatar's 5 MB is 5,242,880 bytes, the reading the grading photo limit uses.
- An edit whose image is refused or fails saves no text; the form keeps the typed text and the chosen image, so one retry sends both.
- Member-since is the first save of any field, an avatar saved on its own included.

## Reconciliation

**Run:** 2026-10-06, second QA2 reconciliation in a fresh context, after the round added `grade10-site-store-account-profile-SC-35` and `grade10-site-store-account-profile-SC-36` and moved the avatar requirement onto the storage sweep. Read: this suite, the capability's `spec.md` and `user-journeys.md`, `proposal.md`, `decisions.md`, `tech-design.md`, `ui-design.md`, `tasks.md`, the domain suite `grade10-site/store/domain-tcs.md` in this change, the Profile and Profile Blocks pages, and the application repository's profile router, `memberName` and `avatarInitial` for what is built. The blind pass recorded no Run line of its own, so its bundle is not stated here.

- **Raised, settled by the round** — how the fallback letter is drawn (Q17: one character, the first letter or digit in any script; US1-TC1, US1-TC2, US3-TC2, US3-TC3 and US3-TC7 assert the letter); how a character is counted (Q18: UTF-16 code units, as the input and the store already count); what 5 MB is (Q19: 5,242,880 bytes, US3-TC5 and US3-TC9 either side of it); a failed avatar in a combined save (Q20: `grade10-site-store-account-profile-SC-33`, walked by US5-TC3); a name with no letter or digit (Q23: `grade10-site-store-account-profile-SC-36`, US3-TC3's `🃏🃏` row); an avatar saved on its own (Q24: `grade10-site-store-account-profile-SC-35`, walked by US3-TC10)
- **Raised for the human, held open** — Q1: US3-TC8 requests the old address in the collector's session, which holds under either answer; answered as recommended, a request with no session reaches the image too, and the case gains that row. Q10: US3-TC4 refuses a PDF under either answer; no case meets a limit on the picked file. Q11 and Q12: no case walks a profile saved before member-since was recorded, or a save that leaves the prefilled name untouched. Q16: US1-TC1 expects the letter for an account that may hold a picture of its own; answered yes, it gains a pre-condition that the account holds none
- **Rewritten to the spec** — US1-TC4 signs in after the prompt and reads the collector's own profile (`grade10-site-store-account-profile-SC-34`); US2-TC6 and US3-TC5 assert that a refusal names its reason (`grade10-site-store-account-profile-SC-14`, `grade10-site-store-account-profile-SC-15`, `grade10-site-store-account-profile-SC-18`, `grade10-site-store-account-profile-SC-21`, `grade10-site-store-account-profile-SC-22`, `grade10-site-store-account-profile-SC-29`); US3-TC8 asserts the replacement's new address (`grade10-site-store-account-profile-SC-23`); US3-TC3 gains the `🃏🃏` row (`grade10-site-store-account-profile-SC-36`)
- **Folded from another capability** — US3-TC7, an avatar that fails to load: no scenario here states it; the rule is `shared-ui-store-profile-SC-10`, and the case walks it on the page the application composes
- **Folded from the design** — none
- **Rejected** — none
- **Contradicted** — none: no case and scenario state opposite outcomes
- **Cases added after the reconciliation** — US1-TC7 (`grade10-site-store-account-profile-SC-06`, `grade10-site-store-account-profile-SC-10`), US2-TC8 (`grade10-site-store-account-profile-SC-16`), US5-TC3 (`grade10-site-store-account-profile-SC-33`), US3-TC10 (`grade10-site-store-account-profile-SC-35`): written from the scenarios the blind pass left unreached, so they are not blind
- **Uncovered** — `grade10-site-store-account-profile-SC-05`, and the storage sweep's deletion in `grade10-site-store-account-profile-SC-23` and `grade10-site-store-account-profile-SC-24`: out of suite, below
- **Left to the domain** — nothing: `grade10-site-store-e2e-US7-TC1-1` passes through a save, and the feature cases still assert it

| Scenario | Reached by |
| --- | --- |
| `grade10-site-store-account-profile-SC-01` | US1-TC5 |
| `grade10-site-store-account-profile-SC-02` | US1-TC6 |
| `grade10-site-store-account-profile-SC-03` | US1-TC1 |
| `grade10-site-store-account-profile-SC-04` | US1-TC2 |
| `grade10-site-store-account-profile-SC-05` | out of suite |
| `grade10-site-store-account-profile-SC-06` | US1-TC7 |
| `grade10-site-store-account-profile-SC-07` | US1-TC3 |
| `grade10-site-store-account-profile-SC-08` | US1-TC3 |
| `grade10-site-store-account-profile-SC-09` | US1-TC1, US2-TC1 |
| `grade10-site-store-account-profile-SC-10` | US1-TC7 |
| `grade10-site-store-account-profile-SC-11` | US4-TC1, US1-TC1 |
| `grade10-site-store-account-profile-SC-12` | US4-TC2 |
| `grade10-site-store-account-profile-SC-13` | US2-TC1, US2-TC2, US2-TC9 |
| `grade10-site-store-account-profile-SC-14` | US2-TC3, US2-TC6 |
| `grade10-site-store-account-profile-SC-15` | US2-TC5, US2-TC6, US2-TC9 |
| `grade10-site-store-account-profile-SC-16` | US2-TC8 |
| `grade10-site-store-account-profile-SC-17` | US2-TC1, US2-TC4, US2-TC9 |
| `grade10-site-store-account-profile-SC-18` | US2-TC5, US2-TC6 |
| `grade10-site-store-account-profile-SC-19` | US2-TC4 |
| `grade10-site-store-account-profile-SC-20` | US3-TC1 |
| `grade10-site-store-account-profile-SC-21` | US3-TC4, US3-TC5 |
| `grade10-site-store-account-profile-SC-22` | US3-TC5, US3-TC9 |
| `grade10-site-store-account-profile-SC-23` | US3-TC8; the sweep, out of suite |
| `grade10-site-store-account-profile-SC-24` | US3-TC2, US3-TC8; the sweep, out of suite |
| `grade10-site-store-account-profile-SC-25` | US1-TC1 |
| `grade10-site-store-account-profile-SC-26` | US3-TC3 |
| `grade10-site-store-account-profile-SC-27` | US2-TC1 |
| `grade10-site-store-account-profile-SC-28` | US2-TC7 |
| `grade10-site-store-account-profile-SC-29` | US2-TC6 |
| `grade10-site-store-account-profile-SC-30` | US3-TC6 |
| `grade10-site-store-account-profile-SC-31` | US5-TC1 |
| `grade10-site-store-account-profile-SC-32` | US5-TC2 |
| `grade10-site-store-account-profile-SC-33` | US5-TC3 |
| `grade10-site-store-account-profile-SC-34` | US1-TC4 |
| `grade10-site-store-account-profile-SC-35` | US3-TC10 |
| `grade10-site-store-account-profile-SC-36` | US3-TC3 |

### Out of suite

* `grade10-site-store-account-profile-SC-05` - a read stores nothing: no walk can see a row that was not written. Its verifier, in the application repository: the profile router's test, `apps/backend/grade10/store/test/db/profileRouter.spec.ts` ("get shows a signed-in user who never saved a profile, creating no row"), and its ZZZ twin, `apps/backend/zzz/store/test/db/profileRouter.spec.ts`.
* `grade10-site-store-account-profile-SC-23`, `grade10-site-store-account-profile-SC-24` - the storage sweep deletes a replaced or removed image once it is a day old: no walk waits a day on a bucket it cannot list. US3-TC8 walks the rest of both scenarios. Its verifier is the backend lane task 4.14 names for task 4.9, over the store cron's `deleteOrphanedObjects` run on the `avatars` area.
