# shared/planning/change-stages Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-20, tcs-rules r3.0

## shared-planning-change-stages-US10: Hand with a page open learns that `main` moved

**As a** hand with a change page open,
**I want** to be told when `main` moves and to see what landed without reloading by hand,
**so that** I answer on what the store holds rather than on what the page held when I opened it.

### shared-planning-change-stages-US10-TC1-1: An open page names what landed on `main`

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-planning-change-stages-US-10

**Pre-conditions:**
admin(tech PIC) has <change A> open at <manual change page url> on the hosted manual, which was built from the commit `main` is on.

**Steps:**

1. Land <a commit whose subject names the change> on `main`.
2. Read the top of <manual change page url> without reloading it.

**Expected Results:**

* One banner sits between the header and the page heading.
* It names the landed commit's subject and how long ago it landed.
* It says the site rebuilds and refreshes on its own, and offers Refresh now.

### shared-planning-change-stages-US10-TC2-1: The page shows what landed once the site has caught up

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-planning-change-stages-US-10

**Pre-conditions:**
admin(tech PIC) has <change A> open at <manual change page url>, the banner is up, and the hosted site has not yet rebuilt.

**Steps:**

1. Wait for the hosted site to finish rebuilding from the landed commit.
2. Read <manual change page url> without reloading it.

**Expected Results:**

* The page shows <change A> as the landed commit left it.
* The banner is gone, and no second notice replaces it.
* The reading position and every open section are where the reader left them.

### shared-planning-change-stages-US10-TC3-1: Nothing reloads while the reader is typing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-planning-change-stages-US-10

**Pre-conditions:**
admin(product manager) has the banner up at <manual change page url> and is typing in the header's search field.

**Steps:**

1. Let the hosted site finish rebuilding while the search field still has focus.
2. Read the field and the banner.
3. Click outside the field and read the page again.

**Expected Results:**

* What was typed is still in the field, and the page has not moved.
* The banner is still up while the field has focus.
* Step 3 leaves the page showing what landed, with the banner gone.

### shared-planning-change-stages-US10-TC4-1: Two landings before the site catches up

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
* **Trace:** shared-planning-change-stages-US-10

**Pre-conditions:**
admin(engineer) has <manual board url> open on the hosted manual, built from the commit `main` is on.

**Steps:**

1. Land two commits on `main`, one after the other.
2. Read the banner.
3. Wait for the hosted site to finish rebuilding.

**Expected Results:**

* One banner, naming the later commit's subject.
* The board shows both landings after step 3.
* The page is taken through one refresh, not two.

### shared-planning-change-stages-US10-TC5-1: No relay, no banner

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
* **Trace:** shared-planning-change-stages-US-10

**Pre-conditions:**
The hosted manual is built with no relay origin set, and admin(engineer) has <manual board url> open.

**Steps:**

1. Land a commit on `main`.
2. Read the top of <manual board url> without reloading it.

**Expected Results:**

* No banner is shown.
* The page reads exactly as it did before the landing.
* Nothing on the page reports an error.

---

## shared-planning-change-stages-US11: Teammate on the locally run manual pulls what landed

**As a** teammate reading the manual from a checkout,
**I want** to see how many commits behind `main` the checkout is and to pull it in one click,
**so that** I read what landed without leaving the page to work out which command to run.

### shared-planning-change-stages-US11-TC1-1: A checkout behind `main` names the count and pulls

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-planning-change-stages-US-11

**Pre-conditions:**

* admin(designer) is on <locally run manual url>, run from a checkout whose tree is clean.
* `main` holds 3 commits the checkout does not.

**Steps:**

1. Read the top of <locally run manual url>.
2. Click Pull.

**Expected Results:**

* The banner says the checkout is 3 commits behind `main`.
* Step 2 leaves the page showing what those commits landed.
* The banner is gone, and no count is shown.

### shared-planning-change-stages-US11-TC2-1: Pull is refused with the reason

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-planning-change-stages-US-11

**Pre-conditions:**
admin(designer) is on <locally run manual url>, run from a checkout 3 commits behind `main`.

**Test data:**

| The checkout | The banner says |
| --- | --- |
| Holds an uncommitted edit to a page | the checkout is 3 commits behind `main`, and names the uncommitted work |
| Holds 1 commit `main` does not | the checkout is 3 commits behind `main`, and names the commit `main` does not hold |

**Steps:**

1. Read the top of <locally run manual url>.
2. Look for Pull.

**Expected Results:**

* The banner reads as the row states.
* Pull is not offered.
* The checkout is untouched: nothing is committed, stashed, merged or rebased.

### shared-planning-change-stages-US11-TC3-1: A checkout with nothing to count says nothing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-planning-change-stages-US-11

**Pre-conditions:**
admin(designer) is on <locally run manual url>, run from <the checkout>.

**Test data:**

| The checkout |
| --- |
| A clean clone of `main`'s own head |
| A clean checkout with no remote at all |

**Steps:**

1. Read the top of <locally run manual url>.

**Expected Results:**

* No banner, and no count.
* No Pull control is offered.
* Nothing on the page reports an error.

## Settled

None yet - the first blind pass on these two journeys.

## Reconciliation

Run: 2026-09-20, blind pass over the isolated input: `user-journeys.md`, `proposal.md`, `decisions.md` with its goals and non-goals, `ui-design.md`, the Change Stages page and the Planning index, the store's context. No `## Purpose` or `## Feature set` was written for this delta, and no requirement existed when the cases were drawn; `openspec/specs/` and `openspec/changes/archive/` were not read. The same hand wrote `tech-design.md` before this pass, which the bundle does not include, so the cases were drawn from the outcomes rather than from the design's endpoints.

### Folded

- `shared-planning-change-stages-US10-TC4-1`, two landings before the page catches up leaving one notice on the later commit and one refresh -> `shared-planning-change-stages-SC-72`
- `shared-planning-change-stages-US11-TC3-1`, a checkout with no remote saying nothing rather than reporting a failed fetch -> `shared-planning-change-stages-SC-73`

### Rejected

- No case was dropped. Every reading of the input turned out to be behaviour the requirements state or a question the rounds answered.

### Escalated

- Does Refresh now reload while the site is still rebuilding? -> `Q5`
- What does the locally run manual show with no remote, or after a fetch that fails? -> `Q6`
- A push to `main` that touches nothing the hosted site rebuilds on -> `Q7`
- Which text fields hold the refresh? -> `Q8`

`Q7` changed a case: `shared-planning-change-stages-US10-TC1-1` reads the banner's promise that the site rebuilds on its own, which the deploy's path filter made false on a push touching none of the paths it watched.

### Anchors no case reaches

Every journey is walked. The delta carries no `## Feature set` of its own, so no root group is an anchor here.

### Manual

Nothing is built yet, so every case is manual. What a person drives, per case:

| Manual | Why |
| --- | --- |
| `shared-planning-change-stages-US10-TC1-1` | A commit landing on `main` and a page left open across it; no test in this store pushes to `main` |
| `shared-planning-change-stages-US10-TC2-1` | The hosted deploy finishing, which is a workflow run rather than anything a test drives |
| `shared-planning-change-stages-US10-TC3-1` | A reader's focus in a text field while the snapshot changes under it; group 5's walk drives the banner off stubbed endpoints and not the focus, so the case stays whole and manual |
| `shared-planning-change-stages-US10-TC4-1` | Two pushes to `main` inside one deploy's window |
| `shared-planning-change-stages-US10-TC5-1` | A build of the hosted site with no relay origin set, deployed |
| `shared-planning-change-stages-US11-TC1-1` | A checkout with a remote ahead of it, and the pull that moves it; group 3's endpoint tests decide the counts and the fast-forward over a bare remote, not the page's own click |
| `shared-planning-change-stages-US11-TC2-1` | The two refusals over a dirty and an ahead checkout, read on the rendered page; group 3's tests decide the refusals themselves |
| `shared-planning-change-stages-US11-TC3-1` | A checkout with no remote at all, read on the rendered page |
