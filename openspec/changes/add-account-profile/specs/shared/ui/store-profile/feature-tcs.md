# shared/ui/store-profile Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## shared-ui-store-profile-US1: The profile card, read view and form contract

**Walked by:** nobody on their own — a component contract; the journeys live in `grade10-site/store/account-profile`, which composes the surface

**As a** signed-in collector on either brand's account page,
**I want** the profile blocks to show what they are given and report what I did,
**so that** both brands read and edit a profile the same way.

### shared-ui-store-profile-US1-TC1-1: Card, read view and form import and render apart

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Surface exports

**Pre-conditions:**

* None.

**Steps:**

1. Import `ProfileCard`, `ProfileDetails` and `ProfileForm` from the `@grade10/ui` entry.
2. Render `ProfileDetails` alone, with supplied props.
3. Render `ProfileForm` alone, with supplied props.

**Expected Results:**

* Step 1 resolves all three, and the seven types `ProfileCardProps`, `ProfileCardCopy`, `ProfileDetailsProps`, `ProfileDetailsCopy`, `ProfileFormProps`, `ProfileFormCopy` and `ProfileFormValues`.
* The entry exports no other component or type for the profile surface.
* Step 2 renders the read view with no card around it.
* Step 3 renders the form with no card around it.

### shared-ui-store-profile-US1-TC2-1: Card shows the body the application selects

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Card states

**Pre-conditions:**

* `ProfileCard` is given a title.

**Test data:**

| <state> | The card shows |
| --- | --- |
| Loading | a loading placeholder and no profile field |
| Empty, with a message and an action | the supplied message and action, and no profile field |
| Failed, with a message and an action | the supplied message and action, and no profile field |
| Failed, with a message and no action | the supplied message, no action and no profile field |
| Ready, with a body element | the supplied body element |

**Steps:**

1. Render `ProfileCard` in <state>.

**Expected Results:**

* Step 1 shows the title and the row's outcome.

### shared-ui-store-profile-US1-TC3-1: Read view shows the fields it is given and defaults none

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Read view

**Pre-conditions:**

* `ProfileDetails` is given <supplied>.

**Test data:**

| <supplied> | The read view shows |
| --- | --- |
| An avatar source, a display name, an email, a bio and a meta line | each of the five as given |
| A display name alone, with the email, bio and meta left out | the name, and no text for the email, the bio or the meta |

**Steps:**

1. Render `ProfileDetails`.
2. Read every text the read view shows.

**Expected Results:**

* Step 1 shows the row's outcome.
* Step 2 finds no word the props did not supply.

### shared-ui-store-profile-US1-TC4-1: Read view and form show the supplied fallback for a missing or broken avatar

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** usability
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Read view

**Pre-conditions:**

* <component> is given the fallback content <fallback> and <avatar source>.

**Test data:**

| Field | Value |
| --- | --- |
| <fallback> | `KC` |

| <component> | <avatar source> |
| --- | --- |
| `ProfileDetails` | None |
| `ProfileDetails` | An address whose image fails to load |
| `ProfileForm` | None |
| `ProfileForm` | An address whose image fails to load |

**Steps:**

1. Render <component>.

**Expected Results:**

* <fallback> shows in the avatar's place, no broken image.

### shared-ui-store-profile-US1-TC5-1: Read view offers editing only with both an edit label and a handler

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Read view

**Pre-conditions:**

* `ProfileDetails` is given <edit props>.

**Test data:**

| <edit props> | An edit control shows |
| --- | --- |
| An edit label and an edit handler | yes |
| An edit label alone | no |
| An edit handler alone | no |
| Neither | no |

**Steps:**

1. Render `ProfileDetails`.
2. Click the edit control, where one shows.

**Expected Results:**

* Step 1 shows the row's outcome.
* Step 2 calls the edit handler once.

### shared-ui-store-profile-US1-TC6-1: Form reports the values entered and the avatar outcome

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Form

**Pre-conditions:**

* `ProfileForm` is given <current avatar>, fallback content <fallback>, a display name and a bio.

**Test data:**

| Field | Value |
| --- | --- |
| <fallback> | `KC` |
| <typed name> | `Kit Lam` |
| <typed bio> | `Graded cards only.` |
| <chosen file> | A PNG of about 1 MB |

| <current avatar> | <avatar action> | The avatar shows | The save reports the avatar as |
| --- | --- | --- | --- |
| An avatar source | None | the current image | unchanged |
| No avatar source | None | <fallback> | unchanged |
| An avatar source | Click the remove control | <fallback> | removed |
| An avatar source | Choose <chosen file> | a preview of <chosen file> | <chosen file> |

**Steps:**

1. Render `ProfileForm`.
2. Replace the display name with <typed name>.
3. Replace the bio with <typed bio>.
4. Take <avatar action>.
5. Click the save button.

**Expected Results:**

* Step 4 shows the row's avatar.
* Step 5 reports <typed name>, <typed bio> and the row's avatar outcome, once.

### shared-ui-store-profile-US1-TC7-1: Form refuses nothing itself and shows the application's error

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Form

**Pre-conditions:**

* `ProfileForm` is given a display name and a save handler.

**Test data:**

| Field | Value |
| --- | --- |
| <not an image> | A PDF of about 100 KB |
| <error> | `Display name is required` |

**Steps:**

1. Render `ProfileForm`.
2. Empty the display name.
3. Choose <not an image> with the avatar control.
4. Click the save button.
5. Render `ProfileForm` again with <error> supplied as its error.

**Expected Results:**

* Step 4 reports the empty name and <not an image>, with no message of the form's own.
* Step 5 shows <error> and keeps the entered values.

### shared-ui-store-profile-US1-TC8-1: Form holds each field to the limit it is given

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Form

**Pre-conditions:**

* `ProfileForm` is given a display name limit of 10 and a bio limit of 20.

**Test data:**

| <field> | <typed text> | <field> then holds |
| --- | --- | --- |
| Display name | 11 characters | the first 10 |
| Bio | 21 characters | the first 20 |

**Steps:**

1. Render `ProfileForm`.
2. Type <typed text> into <field>.
3. Type-check a render of `ProfileForm` with either limit left out.

**Expected Results:**

* Step 2 leaves <field> holding the row's outcome.
* Step 3 fails the type check, naming the missing limit.

### shared-ui-store-profile-US1-TC9-1: Form shows the email it is given and edits none of it

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Form

**Pre-conditions:**

* `ProfileForm` is given the email <email>.

**Test data:**

| Field | Value |
| --- | --- |
| <email> | `kit.lam@example.com` |

**Steps:**

1. Render `ProfileForm`.
2. Click the email and type `x`.
3. Click the save button.

**Expected Results:**

* Step 1 shows <email>.
* Step 2 changes nothing: <email> still shows.
* Step 3 reports no email.

### shared-ui-store-profile-US1-TC10-1: A save in flight cannot be sent again

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Form

**Pre-conditions:**

* `ProfileForm` is rendered with its save pending.

**Steps:**

1. Read the save button.
2. Click the save button twice.

**Expected Results:**

* Step 1 shows the save button busy.
* Step 2 reports nothing.

### shared-ui-store-profile-US1-TC11-1: The avatar image carries the name the application gives it

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Read view

**Pre-conditions:**

* <component> is given an avatar source, the accessible name <image name> and the display name <display name>.

**Test data:**

| Field | Value |
| --- | --- |
| <image name> | `Profile photo` |
| <display name> | `Kit Lam` |

| <component> |
| --- |
| `ProfileDetails` |
| `ProfileForm` |

**Steps:**

1. Render <component>.
2. Read the avatar image's accessible name.

**Expected Results:**

* Step 2 reads <image name>, never <display name> or a name of the component's own.

### shared-ui-store-profile-US1-TC12-1: Every word on the surface comes from its copy

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Surface exports

**Pre-conditions:**

* Each component's `copy` prop holds a distinct marker for every word, such as `[form.save]`, and every value prop holds a known value.

**Steps:**

1. Render `ProfileCard` in each of its states, `ProfileDetails` with an edit label and handler, and `ProfileForm` with a current avatar.
2. Read every visible string and every control's label.
3. Type-check a `ProfileFormCopy` left without the choose label, and one left without the remove label.

**Expected Results:**

* Step 2 finds only markers and supplied values, the avatar's choose and remove controls named by their `ProfileFormCopy` markers.
* Step 3 fails the type check, naming the missing label.

### shared-ui-store-profile-US1-TC13-1: Form reports a cancel and no values

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Form

**Pre-conditions:**

* `ProfileForm` is given a display name, a bio, an avatar source, a save handler and a cancel handler.

**Test data:**

| Field | Value |
| --- | --- |
| <typed name> | `Kit Lam` |
| <chosen file> | A PNG of about 1 MB |

**Steps:**

1. Render `ProfileForm`.
2. Replace the display name with <typed name>.
3. Choose <chosen file> with the avatar control.
4. Click the cancel control.

**Expected Results:**

* Step 4 calls the cancel handler once.
* Step 4 reports no values to the save handler.

## Reconciliation

**Run:** 2026-10-06, second QA2 reconciliation in a fresh context. Read: this suite, the capability's `spec.md` and `user-journeys.md`, `proposal.md`, `decisions.md`, `tech-design.md`, `ui-design.md`, `tasks.md`, the Profile Blocks and Profile pages, and the block as it ships in `packages/ui/src/blocks/store-profile/`. The blind pass recorded no Run line of its own, so its bundle is not stated here.

- **Raised** — nothing by the blind pass. The two design questions the accept review raised stay with the designer: frames for the avatar, its controls and the email row (Q5), and the one-line bio (Q14); no case asserts either look
- **Rewritten to the spec** — US1-TC1 asserts the seven types and nothing else exported (`shared-ui-store-profile-SC-01`); US1-TC2's empty and failed rows supply a message and an action and expect both shown, where the failed row expected no action (`shared-ui-store-profile-SC-05`; the page's failed read showing no action is the application's choice, `grade10-site-store-account-profile-SC-31`), and a failed row with no action is kept; US1-TC3's second row leaves the email out too (`shared-ui-store-profile-SC-07`); US1-TC4 runs on the form as well as the read view (`shared-ui-store-profile-SC-09`, `shared-ui-store-profile-SC-10` name both); US1-TC6 adds a form with no current avatar (`shared-ui-store-profile-SC-14`, "whether or not one is currently set")
- **Folded from another capability** — US1-TC13, a cancel that reports no values: no scenario here states it; the rule is `grade10-site-store-account-profile-SC-28`, and the case holds the block's half of it, the `onCancel` the form already ships
- **Rejected** — none
- **Contradicted** — none left: US1-TC2's failed row was the only one, rewritten above
- **Cases added after the reconciliation** — US1-TC11 (`shared-ui-store-profile-SC-11`), US1-TC12 (`shared-ui-store-profile-SC-16`, `shared-ui-store-profile-SC-17`): written from the scenarios the blind pass left unreached, so they are not blind
- **Uncovered** — none

| Scenario | Reached by |
| --- | --- |
| `shared-ui-store-profile-SC-01` | US1-TC1 |
| `shared-ui-store-profile-SC-02` | US1-TC1 |
| `shared-ui-store-profile-SC-03` | US1-TC2 |
| `shared-ui-store-profile-SC-04` | US1-TC2 |
| `shared-ui-store-profile-SC-05` | US1-TC2 |
| `shared-ui-store-profile-SC-06` | US1-TC3 |
| `shared-ui-store-profile-SC-07` | US1-TC3 |
| `shared-ui-store-profile-SC-08` | US1-TC5 |
| `shared-ui-store-profile-SC-09` | US1-TC4 |
| `shared-ui-store-profile-SC-10` | US1-TC4 |
| `shared-ui-store-profile-SC-11` | US1-TC11 |
| `shared-ui-store-profile-SC-12` | US1-TC6 |
| `shared-ui-store-profile-SC-13` | US1-TC6 |
| `shared-ui-store-profile-SC-14` | US1-TC6 |
| `shared-ui-store-profile-SC-15` | US1-TC7 |
| `shared-ui-store-profile-SC-16` | US1-TC12, US1-TC3 |
| `shared-ui-store-profile-SC-17` | US1-TC12 |
| `shared-ui-store-profile-SC-18` | US1-TC8 |
| `shared-ui-store-profile-SC-19` | US1-TC7 |
| `shared-ui-store-profile-SC-20` | US1-TC9 |
| `shared-ui-store-profile-SC-21` | US1-TC10 |
