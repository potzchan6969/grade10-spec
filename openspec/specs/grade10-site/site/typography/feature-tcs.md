# grade10-site/site/typography Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-22, tcs-rules r3.0

## grade10-site-site-typography-US1: Every surface answers the brand-sans contract

**Walked by:** nobody on their own — a site-wide brand-type contract; every
collector journey under `grade10-site/site/*`, `grade10-site/store/*`,
`grade10-site/auction/*`, `grade10-site/loyalty/*`, and `grade10-site/vault/*`
inherits it when they open a surface.

**As a** customer,
**I want** every page I open on the grade10 site to load and render in the
brand's Gibson sans,
**so that** the type I see matches what the design system already commits
to, not a generic fallback.

### grade10-site-site-typography-US1-TC1-1: Document head requests the Adobe Fonts kit on load

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** One brand sans

**Pre-conditions:**

* None.

**Steps:**

1. Open `<a grade10-site collector page>`.
2. Inspect the requests the document head makes as the page loads.

**Expected Results:**

* The document head requests the stylesheet `https://use.typekit.net/lnk7gwq.css`.
* No other Adobe Fonts kit or brand-sans stylesheet is requested.

---

### grade10-site-site-typography-US1-TC2-1: Body and heading text render in the brand sans

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** One brand sans

**Pre-conditions:**

* None.

**Steps:**

1. Open `<a grade10-site collector page with both body copy and a heading>`.
2. Observe the heading text.
3. Observe a paragraph of body text.

**Expected Results:**

* The heading renders in the site's brand sans, visually distinct from a
  plain default browser sans.
* The body copy renders in the same brand sans as the heading, not a
  different family.

---

### grade10-site-site-typography-US1-TC3-1: Same kit and family load across unrelated products

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
* **Trace:** Site-wide

**Pre-conditions:**

* None.

**Steps:**

1. Open `<a grade10-site page from one product area, e.g. marketing>`.
2. Note the font kit requested and the rendered type family.
3. Separately, open `<a grade10-site page from a different product area, e.g. auction>`.
4. Note the font kit requested and the rendered type family.

**Expected Results:**

* Both pages request the identical Adobe Fonts kit stylesheet.
* Both pages render body and heading text in the identical brand sans.

---

### grade10-site-site-typography-US1-TC4-1: No second brand-sans stylesheet is present

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
* **Trace:** One brand sans

**Pre-conditions:**

* None.

**Steps:**

1. Open `<a grade10-site collector page>`.
2. List every font or typeface stylesheet and embedded font-face request
   the page makes.

**Expected Results:**

* Only the one Adobe Fonts kit stylesheet supplying the brand sans is
  present.
* No second named brand-sans family is loaded anywhere on the page.

---

### grade10-site-site-typography-US1-TC5-1: Blocked kit request falls back without an error surface

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
* **Trace:** One brand sans

**Pre-conditions:**

* The Adobe Fonts kit request is blocked, for example by a network or
  ad-blocking policy denying requests to `use.typekit.net`.

**Steps:**

1. Open `<a grade10-site collector page>` with the kit request blocked.
2. Observe the page as it finishes loading.

**Expected Results:**

* The page renders its full content and layout immediately, with no loading
  spinner, empty state, or error message tied to the missing font.
* Body and heading text render in the browser's default fallback sans
  instead of the brand sans.

## Settled

- Monospace text is unaffected by the family switch — already ruled out by
  `decisions.md`'s non-goals; not this capability's behaviour to state.
- The page's content and layout are otherwise unchanged — general
  regression hygiene, not behaviour specific to this capability's contract.
- Utility surfaces (sign-in, not-found) also load the kit — already covered
  without exception by the WHEN clause on every surface the site answers.

## Reconciliation

**Run:** The blind pass read this capability's `## Purpose` and
`## Feature set` from `spec.md` (never its Requirements), the full
`user-journeys.md`, `decisions.md` (goals, non-goals, Q1, and an empty
`## Raised`), `proposal.md`, `ui-design.md` with its state-to-scenario
dispositions stripped, the store's `openspec/config.yaml` context, and
`PRODUCT.md`'s Gibson fact. It was denied `spec.md`'s Requirements section,
`openspec/changes/archive/`, and every other capability's spec. There was no
prior suite for this capability, so there was no existing suite for id
continuity.

- **Raised, folded into spec** — the blind pass wrote a case for a blocked
  or delayed kit request that no scenario stated. `ui-design.md` already
  commits to "no loading, empty, or error UI" on a blocked kit, but that
  commitment had never become a requirement. Folded under a new
  Requirement. Three of the pass's four raised questions (retry, maximum
  delay, FOIT vs. FOUT) are answered by that same fold and landed as a
  decision.
- **Raised, rejected** — a case asserting monospace text is unaffected by
  the family switch. The change's non-goals already rule mono out of scope;
  the case restated a boundary already settled, not a behaviour this
  capability states. Dropped.
- **Raised, rejected** — a case asserting the page's content and layout are
  otherwise unchanged. General regression hygiene applies to any visual
  change and is not behaviour specific to this capability's contract; each
  surface's own capability and visual tests own its layout. Dropped.
- **Raised, rejected** — a case asserting utility surfaces (sign-in,
  not-found) also load the kit. The kit-load scenario's WHEN clause ("a
  collector opens any address the grade10 site answers") already covers
  every surface without exception; the case duplicated existing cases at a
  narrower scope. Dropped.
- **Raised, escalated** — whether the requirement extends to non-browser
  requesters (crawlers, scrapers, social-preview fetchers): out of this
  capability's remit, `grade10-site/site/crawlable-pages`'s instead.
- **Uncovered anchors** — none; every scenario is reached by at least one
  case above.
- **Contradicted** — none; both readings agreed on every point they both
  stated.
