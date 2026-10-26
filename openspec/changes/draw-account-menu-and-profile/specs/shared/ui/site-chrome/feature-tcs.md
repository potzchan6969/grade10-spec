# shared/ui/site-chrome Test Cases

**Status:** pending-review · 0/2
**Drafts styled:** 2026-10-26, tcs-rules r7

## Background

* Every outcome the header's account menu shows a collector is walked in the Page Shell suite, `grade10-site/site/page-shell`; these cases hold the variants no page renders, walked in the shared UI Storybook.
* `<storybook>` is the Grade10 Storybook, served by `pnpm storybook:ui`; the account menu's stories sit under Site Page Shell / Blocks / SiteHeader / Auction & Store / Account menu. A story's Controls panel changes the props it passes to the header.
* A story named in a case opens the account menu on the lines the case's pre-conditions describe.

## g10.shared-site-chrome.US1: The header draws the account menu from what the page supplies

**Walked by:** nobody on their own - a component contract; the journeys live in `grade10-site/site/page-shell`, which composes the header and footer
**As a** collector reading a page that composes the shared header,
**I want** the account menu to show my image where the page supplies one and my initial where it does not,
**so that** the menu names me the same way on every page, whatever the page can supply.

<!-- trace:case id=g10.shared-site-chrome.TC-hel rev=1 covers=g10.shared-site-chrome.SC-hhb,g10.shared-site-chrome.SC-zpd -->
### g10.shared-site-chrome.US1-TC1: The menu avatar shows the supplied image, else the initial

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Header controls

**Pre-conditions:**

* The header is open in Storybook as the row's **Story**, signed in, with the sign-in email `collector@example.com` supplied.

**Test data:**

| Story | Image supplied | Image served | Avatar shows |
| --- | --- | --- | --- |
| Account menu, with profile image | yes | loads | the supplied image, with no initial over it |
| Account menu, with broken profile image | yes | fails to load | the initial `C`, with no broken-image icon |
| Account menu, with the image control cleared | no | not applicable | the initial `C` |

**Steps:**

1. Navigate to the **Story** at `<storybook>`.
2. Select the account control, and read the menu.
3. Inspect the avatar above the sign-in email.

**Expected Results:**

* Step 2 shows the avatar above `collector@example.com`, both above the menu's items.
* Step 3 shows what the row's **Avatar shows** says, in the small avatar size.

<!-- trace:case id=g10.shared-site-chrome.TC-35p rev=1 covers=g10.shared-site-chrome.SC-kar -->
### g10.shared-site-chrome.US1-TC2: Without a sign-in email the menu shows its label and no avatar

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Header controls

**Pre-conditions:**

* The header is open in Storybook as the Account menu, with profile image story, signed in.

**Test data:**

| Sign-in email | Image supplied |
| --- | --- |
| cleared in the Controls panel | no |
| cleared in the Controls panel | yes |

**Steps:**

1. Navigate to the story at `<storybook>`.
2. Set the **Sign-in email** and **Image supplied** controls for this run.
3. Select the account control, and read the menu.

**Expected Results:**

* Step 3 shows the account menu's label above the items and no avatar, whether or not an image is supplied.

## Reconciliation

**Run:** 2026-10-26. Cases drafted from the delta's `shared-ui-site-chrome-SC-34`, `SC-49` and `SC-50` and the Page Shell suite's US3-TC6 and US3-TC7; the case dispositions follow.

| Source in `spec.md` | Walked by |
| --- | --- |
| `shared-ui-site-chrome-SC-34` (`SC-hhb`) | `g10.site-page-shell.US3-TC6` on the site, where a collector with no profile image sees the initial avatar above the sign-in email; `g10.shared-site-chrome.US1-TC1` repeats the no-image row in Storybook beside the image rows, so the three avatar states sit in one place |
| `shared-ui-site-chrome-SC-49` (`SC-zpd`) | `g10.site-page-shell.US3-TC7` walks the image in place of the initial; `g10.shared-site-chrome.US1-TC1` walks that and the image that fails to load, which no screen of the site can make happen |
| `shared-ui-site-chrome-SC-50` (`SC-kar`) | `g10.shared-site-chrome.US1-TC2` alone: the site never signs a collector in without an email, so only Storybook's controls reach the label alone and the supplied image that draws nothing |

- **Not duplicated** - the site-level walks of the initial and of the image stay in the Page Shell suite; this suite holds the component-only variants, the failed load and the missing email.
- **Anchor** - both cases trace the Header controls group of the Feature set, whose Account menu avatar line these scenarios modify, since the journeys file names no journey of its own.
- **Uncovered scenarios** - none.
- **Lifecycle** - both cases remain draft and manual; no test has run in this planning pass.
