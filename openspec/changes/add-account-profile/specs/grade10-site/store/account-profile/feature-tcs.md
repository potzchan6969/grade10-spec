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

<!-- trace:case id=g10.store-account-profile.TC-8jx rev=1 covers=g10.store-account-profile.SC-xen,g10.store-account-profile.SC-h0u,g10.store-account-profile.SC-dzo,g10.store-account-profile.SC-4fv -->
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

<!-- trace:case id=g10.store-account-profile.TC-onn rev=1 covers=g10.store-account-profile.SC-zfy -->
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

<!-- trace:case id=g10.store-account-profile.TC-h3c rev=1 covers=g10.store-account-profile.SC-m0o,g10.store-account-profile.SC-ul5 -->
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

* customer, on an account named <account name>, first saved a profile on <first save date> and saved it again on <later save date>.
* The profile holds <display name>, <bio> and an avatar of their own.

**Test data:**

| Field | Value |
| --- | --- |
| <first save date> | Any date before <later save date> |
| <later save date> | Any later date |
| <account name> | `Kit Lam` |
| <display name> | `Kit Collector` |
| <bio> | `Pokémon since Base Set.` |

**Steps:**

1. Navigate to <grade10 profile url>.
2. Read the display name, avatar, bio, email and member-since.

**Expected Results:**

* The display name reads <display name>, not <account name>, and the bio <bio>.
* The avatar shows the collector's image, not the display name's first letter.
* The email reads the signed-in address.
* Member-since reads <first save date>, not <later save date>.

<!-- trace:case id=g10.store-account-profile.TC-ji1 rev=1 covers=g10.store-account-profile.SC-yoh -->
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

<!-- trace:case id=g10.store-account-profile.TC-3qj rev=1 covers=g10.store-account-profile.SC-02h -->
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

<!-- trace:case id=g10.store-account-profile.TC-hxg rev=1 covers=g10.store-account-profile.SC-1s9 -->
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

<!-- trace:case id=g10.store-account-profile.TC-akz rev=1 covers=g10.store-account-profile.SC-rz7,g10.store-account-profile.SC-9g2 -->
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

<!-- trace:case id=g10.store-account-profile.TC-fwr rev=1 covers=g10.store-account-profile.SC-z3y -->
### grade10-site-store-account-profile-US1-TC8-1: A profile saved before member-since was recorded is dated by its next save

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

* customer(saved a display name before member-since was recorded) is signed in.

**Test data:**

| Field | Value |
| --- | --- |
| <new bio> | `Collecting since 1999` |
| <run date> | The date of the run |

**Steps:**

1. Navigate to <grade10 profile url>.
2. Read member-since.
3. Click the edit control, type <new bio> into the bio, and click the save button.
4. Reload the page and read member-since.

**Expected Results:**

* Step 2 shows no member-since date, and no error.
* Step 4 reads <run date> as member-since.

---

## grade10-site-store-account-profile-US2: Collector edits display name and bio

**As a** signed-in collector,
**I want** to save a trimmed display name and an optional bio,
**so that** an empty or over-length name is refused, and cancelling discards the draft.

<!-- trace:case id=g10.store-account-profile.TC-k08 rev=1 covers=g10.store-account-profile.SC-h0u,g10.store-account-profile.SC-1ku,g10.store-account-profile.SC-6r5,g10.store-account-profile.SC-zu6 -->
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

<!-- trace:case id=g10.store-account-profile.TC-vg5 rev=1 covers=g10.store-account-profile.SC-1ku -->
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

<!-- trace:case id=g10.store-account-profile.TC-9b5 rev=1 covers=g10.store-account-profile.SC-3hb -->
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

<!-- trace:case id=g10.store-account-profile.TC-d5l rev=1 covers=g10.store-account-profile.SC-6r5,g10.store-account-profile.SC-kuq,g10.shared-store-profile.SC-tlq -->
### grade10-site-store-account-profile-US2-TC4-1: Bio saves at its limit and in its lines, and an emptied bio clears

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
| `Graded cards only.`, a line break, then `Trades welcome.` | the same two lines, on two lines |

**Steps:**

1. Navigate to <grade10 profile url>.
2. Click the edit control.
3. Replace the bio with <typed bio>.
4. Click the save button.
5. Reload the page.

**Expected Results:**

* Step 4 returns to the read view.
* After step 5, the bio shows the row's outcome.

<!-- trace:case id=g10.store-account-profile.TC-gd4 rev=1 covers=g10.store-account-profile.SC-pve,g10.store-account-profile.SC-d7k -->
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

<!-- trace:case id=g10.store-account-profile.TC-p9l rev=1 covers=g10.store-account-profile.SC-3hb,g10.store-account-profile.SC-pve,g10.store-account-profile.SC-d7k,g10.store-account-profile.SC-cll -->
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

<!-- trace:case id=g10.store-account-profile.TC-5ip rev=1 covers=g10.store-account-profile.SC-akq -->
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

<!-- trace:case id=g10.store-account-profile.TC-hx6 rev=1 covers=g10.store-account-profile.SC-plw -->
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

<!-- trace:case id=g10.store-account-profile.TC-ouz rev=1 covers=g10.store-account-profile.SC-1ku,g10.store-account-profile.SC-pve,g10.store-account-profile.SC-6r5 -->
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

<!-- trace:case id=g10.store-account-profile.TC-n7t rev=1 covers=g10.store-account-profile.SC-oj6 -->
### grade10-site-store-account-profile-US2-TC10-1: A first save that changes no field starts member-since

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

* customer(has never saved a profile, holds no bio) is signed in, on an account named <account name>.

**Test data:**

| Field | Value |
| --- | --- |
| <account name> | `Kit Lam` |
| <run date> | The date of the run |

**Steps:**

1. Send a profile save carrying only an empty bio in the collector's session.
2. Read the API response.
3. Read the profile.

**Expected Results:**

* Step 2 accepts the save.
* Step 3 reads <account name> as the display name and no bio.
* Step 3 reads <run date> as member-since.

<!-- trace:case id=g10.store-account-profile.TC-48c rev=1 covers=g10.store-account-profile.SC-w9n -->
### grade10-site-store-account-profile-US2-TC11-1: Saving a bio beside the default name keeps the name following the account

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
* **Trace:** grade10-site-store-account-profile-US-02

**Pre-conditions:**

* customer(has never saved a profile) is signed in, on an account named <account name>.

**Test data:**

| Field | Value |
| --- | --- |
| <account name> | `Kit Lam` |
| <new account name> | `Kit Lam Tai-man` |
| <new bio> | `Collecting since 1999` |

**Steps:**

1. Navigate to <grade10 profile url>.
2. Click the edit control.
3. Type <new bio> into the bio, leave the display name as shown, and click the save button.
4. Change the account's name to <new account name> where the account is managed.
5. Sign out, sign in again, and navigate to <grade10 profile url>.

**Expected Results:**

* Step 3 returns to the read view showing <account name> and <new bio>.
* Step 5 shows <new account name> as the display name and <new bio> as the bio.

---

## grade10-site-store-account-profile-US3: Collector uploads or removes an avatar

**As a** signed-in collector,
**I want** an accepted image as my avatar and a remove that restores my display name's first letter,
**so that** a bad file is refused and the letter follows the display name I actually have.

<!-- trace:case id=g10.store-account-profile.TC-hdw rev=1 covers=g10.store-account-profile.SC-tbm -->
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

<!-- trace:case id=g10.store-account-profile.TC-bst rev=1 covers=g10.store-account-profile.SC-f4k -->
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

<!-- trace:case id=g10.store-account-profile.TC-5zw rev=1 covers=g10.store-account-profile.SC-ps1,g10.store-account-profile.SC-el0 -->
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
| `@kitlam` | `K` |
| `🃏🃏` | `?` |

**Steps:**

1. Navigate to <grade10 profile url>.
2. Click the edit control.
3. Replace the display name with <new name>.
4. Click the save button.

**Expected Results:**

* Step 4 shows the row's letter in the avatar's place, not `K`.

<!-- trace:case id=g10.store-account-profile.TC-quh rev=1 covers=g10.store-account-profile.SC-vu5 -->
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

* By step 4, <not an image> is refused as an unsupported type, and no upload is sent.
* After step 5, the stored avatar still shows.

<!-- trace:case id=g10.store-account-profile.TC-b0n rev=1 covers=g10.store-account-profile.SC-5wx,g10.store-account-profile.SC-31a -->
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
| A JPEG of 5242881 bytes (5 MiB + 1 byte) | the 5 MB limit |

**Steps:**

1. Send an avatar upload of <upload> in the collector's session.
2. Read the API response.
3. Read the profile.

**Expected Results:**

* Step 2 refuses the upload, naming the row's reason.
* Step 3 still carries the stored avatar.

<!-- trace:case id=g10.store-account-profile.TC-l56 rev=1 covers=g10.store-account-profile.SC-q8y -->
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

<!-- trace:case id=g10.store-account-profile.TC-cny rev=1 covers=g10.shared-store-profile.SC-2r8 -->
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

<!-- trace:case id=g10.store-account-profile.TC-n6h rev=1 covers=g10.store-account-profile.SC-xy9,g10.store-account-profile.SC-f4k -->
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
5. Request <old address> from a browser with no cached copy, once in the collector's session and once with no session.

**Expected Results:**

* Step 4 returns to the read view without the old image.
* For the chosen-image row, the new avatar's address differs from <old address>.
* Step 5 returns no image, in either request.

<!-- trace:case id=g10.store-account-profile.TC-ln4 rev=1 covers=g10.store-account-profile.SC-31a -->
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
| <upload> | A JPEG of 5242880 bytes (5 MiB), at the limit |

**Steps:**

1. Send an avatar upload of <upload> in the collector's session.
2. Read the API response.
3. Read the profile.

**Expected Results:**

* Step 2 accepts the upload.
* Step 3 carries an avatar.

<!-- trace:case id=g10.store-account-profile.TC-ld5 rev=1 covers=g10.store-account-profile.SC-tb6 -->
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

<!-- trace:case id=g10.store-account-profile.TC-7o9 rev=1 covers=g10.store-account-profile.SC-hjj -->
### grade10-site-store-account-profile-US3-TC11-1: Two collectors with the same image each hold their own address

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

* customer A and customer B are each signed in on their own browser, with no avatar.

**Test data:**

| Field | Value |
| --- | --- |
| <same image> | One JPEG file of about 1 MB, used by both |

**Steps:**

1. As customer A, choose <same image> with the avatar control and save.
2. As customer B, choose <same image> with the avatar control and save.
3. Record each avatar's image address.
4. As customer A, remove the avatar and save.
5. Request customer B's image address in customer B's session, from a browser with no cached copy.

**Expected Results:**

* Step 3 records two different addresses.
* Step 5 returns customer B's image.

<!-- trace:case id=g10.store-account-profile.TC-a8t rev=1 covers=g10.store-account-profile.SC-8r3 -->
### grade10-site-store-account-profile-US3-TC12-1: A large photo or another image type becomes the avatar, square

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

* customer is signed in and has no avatar.

**Test data:**

| <image> |
| --- |
| A JPEG phone photo of about 12 MB |
| A GIF of about 1 MB |

**Steps:**

1. Navigate to <grade10 profile url>.
2. Click the edit control.
3. Choose <image> with the avatar control.
4. Click the save button.
5. Open the avatar's image on its own.

**Expected Results:**

* Step 4 returns to the read view showing <image> as the avatar, with no refusal.
* Step 5 shows a square image, 512 by 512 pixels.

<!-- trace:case id=g10.store-account-profile.TC-izn rev=1 covers=g10.store-account-profile.SC-ykg -->
### grade10-site-store-account-profile-US3-TC13-1: The account's own picture does not stand in for the avatar

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

* customer(signed up with Google, whose account holds a picture) is signed in, with no avatar, on an account named <account name>.

**Test data:**

| Field | Value |
| --- | --- |
| <account name> | `Kit Lam` |

**Steps:**

1. Navigate to <grade10 profile url>.
2. Read the avatar.

**Expected Results:**

* The avatar shows `K`, the first letter of <account name>.
* The account's own picture shows nowhere on the page.

<!-- trace:case id=g10.store-account-profile.TC-q2w rev=1 covers=g10.store-account-profile.SC-b6e -->
### grade10-site-store-account-profile-US3-TC14-1: Anyone holding an avatar's address opens the image with no sign-in

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-account-profile-US-03

**Pre-conditions:**

* customer is signed in with an avatar of their own, and a second browser holds no session.

**Steps:**

1. Navigate to <grade10 profile url>.
2. Record the avatar's image address.
3. In the second browser, request that address with no session.

**Expected Results:**

* Step 3 returns the customer's image.

---

## grade10-site-store-account-profile-US4: Collector's email stays the signed-in address

**As a** signed-in collector,
**I want** the address on the page to be the one I signed in with, and an edit that carries an email to be refused,
**so that** I cannot change how I sign in from this page.

<!-- trace:case id=g10.store-account-profile.TC-b6f rev=1 covers=g10.store-account-profile.SC-dzo -->
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

<!-- trace:case id=g10.store-account-profile.TC-ta1 rev=1 covers=g10.store-account-profile.SC-mtr -->
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

<!-- trace:case id=g10.store-account-profile.TC-1k8 rev=1 covers=g10.store-account-profile.SC-tvg -->
### grade10-site-store-account-profile-US5-TC1-1: Failed read says the profile could not be read, and a retry reads it

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
2. Restore the profile read.
3. Click the retry control.

**Expected Results:**

* Step 1 shows that the profile could not be read, and a retry control.
* Step 1 shows no profile field, not <stored name>, and no edit control.
* Step 3 shows the profile holding <stored name>.

<!-- trace:case id=g10.store-account-profile.TC-2i3 rev=1 covers=g10.store-account-profile.SC-7oe -->
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

<!-- trace:case id=g10.store-account-profile.TC-hqp rev=1 covers=g10.store-account-profile.SC-zxs -->
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
- The fallback letter reads the display name whole, so `@kitlam` shows `K`.
- The page takes any image the browser can read, whatever its type or size, and sends it square at 512 px; the upload alone holds the three types and 5 MB.
- A profile saved before member-since was recorded shows no date until its next save.
- A save that leaves the default display name as shown keeps no name as the collector's.
- The account's own picture never stands in for the avatar; the letter does.
- Anyone holding an avatar's address opens the image with no sign-in; the address cannot be worked out from the image and only its owner learns it.

## Reconciliation

**Run:** 2026-10-07, ninth QA2 reconciliation, in a fresh context, after product settled Q1: the avatar's address opens for anyone holding it, which `grade10-site-store-account-profile-SC-44` states and US3-TC14 walks; US3-TC8 requests the old address with no session as well, and no other case moved. Before it, the eighth, after product settled Q10, Q11, Q12 and Q16: every case and scenario joined again on the anchors. US3-TC4 moves to `grade10-site-store-account-profile-SC-43`, below; no other case moved. Before it, the seventh, over the same reading as the sixth: no case moved; US3-TC5 and US3-TC9 write their byte counts as the store's other suites do. Before it, the sixth, after the third accept review: each profile's image gains an address of its own, the fallback letter reads the display name whole, and a save that repeats the stored values still starts member-since. US3-TC8 is unmoved, US3-TC3 gains the `@kitlam` row, and US2-TC10 and US3-TC11 are new, below. Before it, the fifth, in a fresh context, over the same reading plus the store's `main`, where `omit-profile-account-menu` then decided the account menu never offers Profile, a question its review has since reopened as its Q1; two cases moved, and no case rests on the menu. Before it, the fourth, after the second accept review dropped the requirement's claim that the first save makes the record, which US1-TC7's record written by the store already contradicted; no case moved. Before it, the third reconciliation in a fresh context, after the accept review gave a failed read its retry, settled the bio's field and added the page's lines on length, `?` and a replaced image. Read: this suite, the capability's `spec.md` and `user-journeys.md`, `proposal.md`, `decisions.md`, `tech-design.md`, `ui-design.md`, `tasks.md`, the domain suite `grade10-site/store/domain-tcs.md` in this change, the Profile and Profile Blocks pages, and the application repository's profile router, `memberName` and `avatarInitial` for what is built. The blind pass recorded no Run line of its own, so its bundle is not stated here.

- **Raised, settled by the round** - how the fallback letter is drawn (Q17: one character, the first letter or digit in any script; US1-TC1, US1-TC2, US3-TC2, US3-TC3 and US3-TC7 assert the letter); how a character is counted (Q18: UTF-16 code units, as the input and the store already count); what 5 MB is (Q19: 5,242,880 bytes, US3-TC5 and US3-TC9 either side of it); a failed avatar in a combined save (Q20: `grade10-site-store-account-profile-SC-33`, walked by US5-TC3); a name with no letter or digit (Q23: `grade10-site-store-account-profile-SC-36`, US3-TC3's `🃏🃏` row); an avatar saved on its own (Q24: `grade10-site-store-account-profile-SC-35`, walked by US3-TC10)
- **Raised for the human, settled by the product owner** - Q1: anyone holding an avatar's address opens it with no sign-in, walked by US3-TC14, and US3-TC8 requests the old address with no session as well as in the owner's; US3-TC11 requests it in its owner's session, which still holds; Q10: any image the browser reads, walked by US3-TC12, and US3-TC4 still refuses a PDF, now at the page, before anything is sent; Q11: no date until the next save, walked by US1-TC8; Q12: the default name stays the account's, walked by US2-TC11; Q16: the letter, never the account's picture, walked by US3-TC13; Q13: Profile in the account menu wherever the page is carried, which no case here walks, since US1-TC4 opens the page by address
- **Raised for the designer, settled as the interim** - Q5: save stays enabled on an emptied display name, as US2-TC3 and US3-TC6 click it; handed to draw-account-menu-and-profile, where the designer confirms or redraws it. No case asserts the bio's several lines, whose look rides Q5
- **Added to the spec** - US3-TC4 chooses a PDF on the page, which Q10 now refuses before anything is sent; it traced `grade10-site-store-account-profile-SC-21`, an upload the store refuses, which the page no longer sends. The requirement's clause on a file the browser cannot read had no scenario: `grade10-site-store-account-profile-SC-43` now states it, US3-TC4 traces it and asserts that no upload is sent, and US3-TC5's GIF row still reaches `grade10-site-store-account-profile-SC-21` through the API
- **Rewritten to the spec** - US1-TC3 names an account name apart from the saved name and expects the saved one (`grade10-site-store-account-profile-SC-07`), where the two could not be told apart; US1-TC4 signs in after the prompt and reads the collector's own profile (`grade10-site-store-account-profile-SC-34`); US2-TC6 and US3-TC5 assert that a refusal names its reason (`grade10-site-store-account-profile-SC-14`, `grade10-site-store-account-profile-SC-15`, `grade10-site-store-account-profile-SC-18`, `grade10-site-store-account-profile-SC-21`, `grade10-site-store-account-profile-SC-22`, `grade10-site-store-account-profile-SC-29`); US3-TC8 asserts the replacement's new address (`grade10-site-store-account-profile-SC-23`); US3-TC3 gains the `🃏🃏` row and the `@kitlam` row, read whole as `K` (`grade10-site-store-account-profile-SC-36`); US5-TC1 restores the read and retries it (`grade10-site-store-account-profile-SC-31`, which gained the retry the page's failed-read story shows)
- **Unmoved by the accept review** - `?` for `🃏🃏` and the counted length are what US3-TC3, US2-TC2 and US2-TC5 assert, and a replaced or removed image stops answering, as US3-TC8 walks. The third review dropped the requirement's clause that a replaced image kept answering while another profile held the same image: each profile's image now has an address of its own, and US3-TC8 requests one collector's old address, which holds as written
- **Repaired** - US3-TC10 held a second, headless Steps and Expected Results block after its own; it is removed, and the case's two rows walk `grade10-site-store-account-profile-SC-35` whole
- **Folded from another capability** - US3-TC7, an avatar that fails to load: no scenario here states it; the rule is `shared-ui-store-profile-SC-10`, and the case walks it on the page the application composes; US2-TC4's two-line row, a bio kept in its lines: the rule is `shared-ui-store-profile-SC-23`, and the row walks it through the store and back, as the Profile page's Bio field line states
- **Folded from the design** - none
- **Rejected** - none
- **Contradicted** - none: no case and scenario state opposite outcomes
- **Cases added after the reconciliation** - US1-TC7 (`grade10-site-store-account-profile-SC-06`, `grade10-site-store-account-profile-SC-10`), US2-TC8 (`grade10-site-store-account-profile-SC-16`), US5-TC3 (`grade10-site-store-account-profile-SC-33`), US3-TC10 (`grade10-site-store-account-profile-SC-35`), US2-TC10 (`grade10-site-store-account-profile-SC-37`), US3-TC11 (`grade10-site-store-account-profile-SC-38`): written from the scenarios the blind pass left unreached, so they are not blind; US1-TC8 (`grade10-site-store-account-profile-SC-40`), US2-TC11 (`grade10-site-store-account-profile-SC-39`), US3-TC12 (`grade10-site-store-account-profile-SC-41`), US3-TC13 (`grade10-site-store-account-profile-SC-42`), US3-TC14 (`grade10-site-store-account-profile-SC-44`): written from the product owner's answers to Q10, Q11, Q12, Q16 and Q1, so they are not blind
- **Uncovered** - `grade10-site-store-account-profile-SC-05`, and the storage sweep's deletion in `grade10-site-store-account-profile-SC-23` and `grade10-site-store-account-profile-SC-24`: out of suite, below
- **Left to the domain** - nothing: `grade10-site-store-e2e-US9-TC1-1` passes through a save, and the feature cases still assert it

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
| `grade10-site-store-account-profile-SC-21` | US3-TC5 |
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
| `grade10-site-store-account-profile-SC-37` | US2-TC10 |
| `grade10-site-store-account-profile-SC-38` | US3-TC11 |
| `grade10-site-store-account-profile-SC-39` | US2-TC11 |
| `grade10-site-store-account-profile-SC-40` | US1-TC8 |
| `grade10-site-store-account-profile-SC-41` | US3-TC12 |
| `grade10-site-store-account-profile-SC-42` | US3-TC13 |
| `grade10-site-store-account-profile-SC-43` | US3-TC4 |
| `grade10-site-store-account-profile-SC-44` | US3-TC14 |

### Out of suite

* `grade10-site-store-account-profile-SC-05` - a read stores nothing: no walk can see a row that was not written. Its verifier, in the application repository: the profile router's test, `apps/backend/grade10/store/test/db/profileRouter.spec.ts` ("get shows a signed-in user who never saved a profile, creating no row"), and its ZZZ twin, `apps/backend/zzz/store/test/db/profileRouter.spec.ts`.
* `grade10-site-store-account-profile-SC-23`, `grade10-site-store-account-profile-SC-24` - the storage sweep deletes a replaced or removed image once it is a day old: no walk waits a day on a bucket it cannot list. US3-TC8 walks the rest of both scenarios. Its verifier is the backend lane task 4.14 names for task 4.9, over the store cron's `deleteOrphanedObjects` run on the `avatars` area.
