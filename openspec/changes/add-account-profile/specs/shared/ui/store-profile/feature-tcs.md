# shared/ui/store-profile Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## shared-ui-store-profile-US1: The profile card, read view and form contract

**Walked by:** nobody on their own — a component contract; the journeys live in `grade10-site/store/account-profile`, which composes the surface

**As a** signed-in collector on either brand's account page,
**I want** the profile blocks to show what they are given and report what I did,
**so that** both brands read and edit a profile the same way.

<!-- trace:case id=g10.shared-store-profile.TC-1yv rev=1 covers=g10.shared-store-profile.SC-n3z,g10.shared-store-profile.SC-kr5 -->
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

<!-- trace:case id=g10.shared-store-profile.TC-ghq rev=1 covers=g10.shared-store-profile.SC-ln9,g10.shared-store-profile.SC-mzb,g10.shared-store-profile.SC-d8w,g10.shared-store-profile.SC-z3a -->
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

<!-- trace:case id=g10.shared-store-profile.TC-r9t rev=1 covers=g10.shared-store-profile.SC-7fw,g10.shared-store-profile.SC-ozv,g10.shared-store-profile.SC-4f1 -->
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

<!-- trace:case id=g10.shared-store-profile.TC-cev rev=1 covers=g10.shared-store-profile.SC-67q,g10.shared-store-profile.SC-2r8 -->
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

<!-- trace:case id=g10.shared-store-profile.TC-g2v rev=1 covers=g10.shared-store-profile.SC-tnt -->
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

<!-- trace:case id=g10.shared-store-profile.TC-5j0 rev=1 covers=g10.shared-store-profile.SC-mc2,g10.shared-store-profile.SC-eqc,g10.shared-store-profile.SC-v9c -->
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

<!-- trace:case id=g10.shared-store-profile.TC-y5b rev=1 covers=g10.shared-store-profile.SC-83g,g10.shared-store-profile.SC-67a -->
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

<!-- trace:case id=g10.shared-store-profile.TC-v8k rev=1 covers=g10.shared-store-profile.SC-cxo -->
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

<!-- trace:case id=g10.shared-store-profile.TC-w3h rev=1 covers=g10.shared-store-profile.SC-at4 -->
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

<!-- trace:case id=g10.shared-store-profile.TC-bns rev=1 covers=g10.shared-store-profile.SC-bba -->
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

<!-- trace:case id=g10.shared-store-profile.TC-chc rev=1 covers=g10.shared-store-profile.SC-0du -->
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

<!-- trace:case id=g10.shared-store-profile.TC-1fi rev=1 covers=g10.shared-store-profile.SC-4f1,g10.shared-store-profile.SC-y6u -->
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

<!-- trace:case id=g10.shared-store-profile.TC-d6b rev=1 covers=g10.shared-store-profile.SC-7y6 -->
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

* `ProfileForm` is given a display name, a bio, an avatar source, a save handler, a cancel handler, and <cancel label> as the cancel label.

**Test data:**

| Field | Value |
| --- | --- |
| <typed name> | `Kit Lam` |
| <chosen file> | A PNG of about 1 MB |
| <cancel label> | `Discard changes` |

| <cancel props> |
| --- |
| The cancel handler and no cancel label |
| <cancel label> and no cancel handler |
| Neither |

**Steps:**

1. Render `ProfileForm`.
2. Replace the display name with <typed name>.
3. Choose <chosen file> with the avatar control.
4. Click the control labelled <cancel label>.
5. Render `ProfileForm` again with each of <cancel props>.

**Expected Results:**

* Step 4 calls the cancel handler once.
* Step 4 reports no values to the save handler.
* Step 5 shows no cancel control for any of <cancel props>.

<!-- trace:case id=g10.shared-store-profile.TC-5zz rev=1 covers=g10.shared-store-profile.SC-tlq -->
### shared-ui-store-profile-US1-TC14-1: Bio keeps its line breaks from the form to the read view

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
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
| <first line> | `Graded cards only.` |
| <second line> | `Trades welcome.` |

**Steps:**

1. Render `ProfileForm`.
2. Type <first line> into the bio, press Enter, and type <second line>.
3. Click the save button.
4. Render `ProfileDetails` with the bio step 3 reported.

**Expected Results:**

* Step 2 shows <first line> and <second line> on two lines in the bio field.
* Step 3 reports a bio holding <first line>, a line break and <second line>.
* Step 4 shows <first line> and <second line> on two lines.

## Reconciliation

**Run:** 2026-10-06, sixth QA2 reconciliation, in a fresh context, over the same reading: US1-TC13 gains the handler alone and the label alone, which US1-TC5 already walks for the edit control. Before it, the fifth, after the third accept review wrote down the form's cancel, which the block already ships: US1-TC13 now traces `shared-ui-store-profile-SC-24` and gains the form with no cancel. Before it, the fourth, after the second accept review added the empty card's scenario and the bio's line breaks; US1-TC2 now reaches the empty card, and US1-TC14 is new. Read: this suite, the capability's `spec.md` and `user-journeys.md`, `proposal.md`, `decisions.md`, `tech-design.md`, `ui-design.md`, `tasks.md`, the Profile Blocks and Profile pages, and the block as it ships in `packages/ui/src/blocks/store-profile/`. The blind pass recorded no Run line of its own, so its bundle is not stated here.

- **Raised** - nothing by the blind pass. The accept review's design questions are settled as Q5, this change's interim, handed to draw-account-menu-and-profile: the avatar, its controls and the email row are built from the requirements with no frames, which no case asserts; and save stays enabled on an empty display name with the application's refusal, as US1-TC7 asserts. The bio's field is settled as the design system's `Textarea` (Q14), and no case asserts its look
- **Rewritten to the spec** - US1-TC1 asserts the seven types and nothing else exported (`shared-ui-store-profile-SC-01`); US1-TC2's empty and failed rows supply a message and an action and expect both shown, where the failed row expected no action (`shared-ui-store-profile-SC-05`; the page's failed read supplies a retry, `grade10-site-store-account-profile-SC-31`), and a failed row with no action is kept; US1-TC3's second row leaves the email out too (`shared-ui-store-profile-SC-07`); US1-TC4 runs on the form as well as the read view (`shared-ui-store-profile-SC-09`, `shared-ui-store-profile-SC-10` name both); US1-TC6 adds a form with no current avatar (`shared-ui-store-profile-SC-14`, "whether or not one is currently set")
- **Rewritten in the spec** - `shared-ui-store-profile-SC-08` and `shared-ui-store-profile-SC-24` read "without the label and the handler", which a handler given alone also meets; both now name the handler alone, the label alone and neither, as their requirements and US1-TC5 do. The block shows its edit and cancel buttons on the handler alone, with no label, so tasks 1.2 and 1.8 now change that rather than verify it
- **Added to the spec** - US1-TC13, a cancel that reports no values, was folded from `grade10-site-store-account-profile-SC-28` while no scenario here stated it. `shared-ui-store-profile-SC-24` now states the cancel the block ships, `onCancel` with `copy.cancel`, and US1-TC13 traces it, naming the supplied label and a form given neither
- **Rejected** - none
- **Contradicted** - none left: US1-TC2's failed row was the only one, rewritten above
- **Cases added after the reconciliation** - US1-TC11 (`shared-ui-store-profile-SC-11`), US1-TC12 (`shared-ui-store-profile-SC-16`, `shared-ui-store-profile-SC-17`), US1-TC14 (`shared-ui-store-profile-SC-23`): written from the scenarios the blind pass left unreached, so they are not blind
- **Uncovered** - none

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
| `shared-ui-store-profile-SC-22` | US1-TC2 |
| `shared-ui-store-profile-SC-23` | US1-TC14 |
| `shared-ui-store-profile-SC-24` | US1-TC13 |
