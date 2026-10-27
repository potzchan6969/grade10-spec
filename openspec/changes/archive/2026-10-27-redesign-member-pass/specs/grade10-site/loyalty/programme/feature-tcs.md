# grade10-site/loyalty/programme Test Cases

**Status:** pending-review · 0/6
**Drafts styled:** 2026-10-27, tcs-rules r7

## Background

* The member's surface is `<loyalty>` on the Grade10 site; the member pass is its own section, "Your member pass", and the standalone pass is `<member pass page>` on a phone. A till session serves a member through the loyalty terminal's panel.
* Tiers: Silver, the entry tier; Gold at 500 qualifying points over the rolling twelve months; Black by invitation alone. The pass's skin follows the member's tier.
* A pass's code lives 10 minutes and is used once. The pass counts down and rotates the code out before it lapses.
* No name is collected at registration: the pass identifies the member by the account email.

## g10.loyalty-programme.US4: Member reads two counts and redeems from one surface

**As a** member,
**I want** my tier, balance, and activity on one surface, in the programme's dates,
**so that** I can join, redeem, and never see the operator's reasons behind an entry.

<!-- trace:case id=g10.loyalty-programme.TC-is3 rev=1 covers=g10.loyalty-programme.SC-mp5 -->
### g10.loyalty-programme.US4-TC14: The pass shows the tier's skin, the account email and one scannable code

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-04

**Pre-conditions:**

* customer(`<tier>` member) is signed in with account email `<email>`, and no name is on the account.

**Test data:**

| `<tier>` | `<skin>` | `<email>` |
| --- | --- | --- |
| Silver | silver | `mei.chan@example.com` |
| Gold (500 qualifying points, fixed threshold) | gold | `ho.tin@example.com` |
| Black (granted by invitation) | black | `lau.sze@example.com` |
| Silver | silver | `a.very.long.collector.name.with.many.parts.0123456789abcdef@example.com` (a 59-character local part) |

**Steps:**

1. Open `<loyalty>`.
2. Scroll to the member pass section.

**Expected Results:**

* The pass loads in the `<skin>` skin, carrying the Grade10 mark and the tier badge.
* The header reads `<email>` in full, with no part of the address cut off, and no name appears.
* The body shows one square code with a countdown and a refresh control beneath it.
* No typed code or short code appears beside the square. UI matching loyalty-membership-blocks-memberpass--default

---

<!-- trace:case id=g10.loyalty-programme.TC-od4 rev=1 -->
### g10.loyalty-programme.US4-TC15: [Mobile only] The pass stands alone on its own page and keeps the screen awake

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-loyalty-programme-US-04

**Pre-conditions:**

* customer(Gold member) is signed in on mobile, on `<loyalty>`.
* The phone's screen timeout is `30 seconds` (fixed, shorter than the pass's 10-minute life).

**Steps:**

1. Open the member pass from the member pass section.
2. Leave the phone untouched for `<idle time>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<idle time>` | 2 minutes (range: more than the screen timeout) |

**Expected Results:**

* The pass opens on its own page, with no other membership section around it.
* After `<idle time>` the screen has not dimmed or locked, and the code and countdown are still showing.

---

<!-- trace:case id=g10.loyalty-programme.TC-3zg rev=1 covers=g10.loyalty-programme.SC-mp4 -->
### g10.loyalty-programme.US4-TC16: A fresh code settles in over the old one, never snapping, and at once under reduced motion

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-04

**Pre-conditions:**

* customer(Silver member) is signed in and is on the member pass section of `<loyalty>`.
* The device's reduced-motion setting is `<motion>`.

**Test data:**

| `<motion>` | `<swap>` |
| --- | --- |
| not asked for | The old square fades and eases down out of view and the fresh square settles in; the area is never blank for a moment or replaced in one frame |
| asked for | The fresh square replaces the old one in one frame, with no fade and no easing |

**Steps:**

1. Note the code on the square and the countdown.
2. Select the refresh control in the pass, and read it while the new code is on its way.
3. Watch the square until it settles.

**Expected Results:**

* While the new code is on its way the refresh control shows busy.
* The swap reads as `<swap>`.
* The countdown starts a fresh run, not from where it had reached.
* The new square encodes a different code from the noted one.

---

<!-- trace:case id=g10.loyalty-programme.TC-g4p rev=1 covers=g10.loyalty-programme.SC-mp7 -->
### g10.loyalty-programme.US4-TC18: The pass rotates its code before it lapses and never shows an expired one

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-04

**Pre-conditions:**

* customer(Gold member) is signed in and is on the member pass section of `<loyalty>`; the pass is left open.

**Test data:**

| Field | Value |
| --- | --- |
| `<code life>` | 10 minutes (fixed) |
| `<wait>` | 12 minutes (range: longer than the code life) |

**Steps:**

1. Note the code on the square and the countdown.
2. Leave the page open for `<wait>`, watching the countdown.

**Expected Results:**

* The countdown reaches the end of its run before `<code life>` has passed, and a fresh code takes the square without any input.
* At no point does the pass show an expired surface, a zero-second hold or a blank square.
* The code showing after `<wait>` differs from the noted one, with the countdown running again.

---

<!-- trace:case id=g10.loyalty-programme.TC-8k0 rev=1 covers=g10.loyalty-programme.SC-mp8 -->
### g10.loyalty-programme.US4-TC19: A code the till takes is answered by the pass rotating quietly

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-loyalty-programme-US-04

**Pre-conditions:**

* customer(Silver member) is signed in on `<phone>` and shows the member pass on `<loyalty>`.
* A till session is open on the loyalty terminal's panel.

**Steps:**

1. Note the code on the member's square.
2. At the till, scan the member's square.
3. Read the member's pass.

**Expected Results:**

* The till identifies the member.
* The member's pass shows a fresh square in place of the noted one, settling in as on a refresh.
* The pass shows no used, frozen or refused surface, and no message about the scan.

---

<!-- trace:case id=g10.loyalty-programme.TC-vm7 rev=1 -->
### g10.loyalty-programme.US4-TC20: The pass reads in the member's language

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-loyalty-programme-US-04

**Pre-conditions:**

* customer(Gold member) is signed in with the site language set to `<language>`.

**Test data:**

| `<language>` |
| --- |
| English |
| Traditional Chinese |
| Simplified Chinese |
| Korean |

**Steps:**

1. Open `<loyalty>`.
2. Scroll to the member pass section.

**Expected Results:**

* The section name, the countdown label and the refresh control read in `<language>`, and none shows a missing-text key or another language.
* The header still reads the account email, unchanged.

---

## Settled

- The pass shows the member's account email in full, never cut off, because staff fall back to the exact email when a till cannot scan
- Refresh does not void the earlier code: it stays alive until used or lapsed, so a refused refresh leaves it showing with its countdown running
- A code the till takes is answered by the pass rotating to the next minted token, with no used, frozen or refused rendering; no timing for that rotation is asserted, the consumer owns how it learns of the scan

## Reconciliation

**Run:** 2026-10-27, QA1 blind pass; read the programme `## Purpose` and `## Feature set` (absent from the change's delta), the change's user-journeys, proposal, decisions, the Membership PRD page, the durable programme suite without its Reconciliation, and no domain suite (loyalty has none); denied every requirement and scenario, tasks and designs.

**Run (QA2):** 2026-10-27, in a fresh context, after Dev's delta and tasks; joined QA1's cases TC14 to TC20 to the delta's scenarios on their anchors, with `proposal.md`, `decisions.md`, the Membership PRD page and the durable programme suite (no case there shows the pass, and no domain suite exists above it). Edited only this file and `decisions.md`; `spec.md` was out of reach, so every fold below is owed to Dev. It is a statement, not proof.

| Case | Disposition | Where it went / why |
| --- | --- | --- |
| `g10.loyalty-programme.US4-TC14` | Covered, edge added | `grade10-site-loyalty-programme-SC-mp5`. A long-address row and a "never cut off" result were added: the email is the till's fallback (decisions Q8). Reaches the skin half of `grade10-site-loyalty-programme-SC-mp3` and the no-typed-code half of `grade10-site-loyalty-programme-SC-mp2` but not their second halves, so neither is linked |
| `g10.loyalty-programme.US4-TC15` | Real, no scenario | Real per the PRD and decisions Q5 and Q10 (the pass section opens the standalone page on a phone; its route is the consumer app's to name), but no scenario states the wake lock or the standalone page. Kept `draft`; not linked |
| `g10.loyalty-programme.US4-TC16` | Covered, merged | Absorbs `g10.loyalty-programme.US4-TC17`: same steps, other data, so one case with a `<motion>` row each. Asserts both THEN halves of `grade10-site-loyalty-programme-SC-mp4` and shows the busy control that opens `grade10-site-loyalty-programme-SC-mp6`. The refresh control's busy state was added as a result, the same route. "From the code's full life" became "a fresh run", the countdown running to the next rotation (decisions Q9) |
| `g10.loyalty-programme.US4-TC17` | Dropped, merged into TC16 | A draft duplicate of TC16 with other data; nothing was lost, and the id is left unused |
| `g10.loyalty-programme.US4-TC18` | Covered | `grade10-site-loyalty-programme-SC-mp7`: the countdown runs to the next rotation (decisions Q9) and no expired code is drawn |
| `g10.loyalty-programme.US4-TC19` | Covered | `grade10-site-loyalty-programme-SC-mp8`: a taken code is answered by the next token. Needs a till and a consumer app that rotates; no time bound is asserted (Settled, decisions Q12) |
| `g10.loyalty-programme.US4-TC20` | Real, no scenario | The catalog's four-language rename (proposal, task 2.5) has no scenario. Fold owed to Dev; not linked |

- **New, not an extension** - g10.loyalty-programme.US4-TC14 - the durable US4 cases read the tier card's summary, the expiry line, activity, dates, coupons and the menu; none opens the pass, whose header, skin and code area are a section of their own, so no live route shows these results
- **New, not an extension** - g10.loyalty-programme.US4-TC15 - no live case opens a standalone page or holds the screen; the route is new
- **New, not an extension** - g10.loyalty-programme.US4-TC16 - a refresh swap is on the pass alone, and no live case selects its refresh control
- **New, not an extension** - g10.loyalty-programme.US4-TC18 - the countdown run over 12 minutes is not shown by any live case, which reads dates and counts, not a running code
- **New, not an extension** - g10.loyalty-programme.US4-TC19 - the only live case with a till session is the redemption at US3, which spends points and reads no pass
- **New, not an extension** - g10.loyalty-programme.US4-TC20 - no live case varies the language, and its result is the pass's own words; TC14 varies tier and email, not language

### Raised

- Decided by the human: Q7 the consumer renders the pass only once it holds a token; Q9 the countdown runs to the next rotation; Q10 the pass section opens the standalone page on a phone, its route the consumer's
- Decided by the round: Q8 a long email shows in full; Q11 Refresh leaves the earlier code alive and on show; Q12 no rotation time asserted after a scan. Their answers are in Settled

### Uncovered scenarios

- `grade10-site-loyalty-programme-SC-mp2` - TC14 and TC19 reach the square and no typed code, and the till scan shows it identifies, but nobody can observe that the pass never mints, persists or substitutes; no product user reaches that half. Dev and the reviewer choose between the workbench story `PassNeverMintsItsCode` as a manual row and listing it out of suite as `unit`
- `grade10-site-loyalty-programme-SC-mp3` - TC14 shows the skin following the tier on the site, which is the consumer's mapping; "the skin never follows the tier name the consumer words" needs a workbench story whose tier name and `variant` differ. Owed a case on the story route
- `grade10-site-loyalty-programme-SC-125` - the delta restates it unchanged; no case in this suite reaches "every count, date, state and word arrived through props" for the pass. Out of suite as `unit` is a candidate, Dev's call
- `grade10-site-loyalty-programme-SC-mp1` - no product user reaches a pass without a token, since the consumer renders it only once it holds one. Dev's call
- `grade10-site-loyalty-programme-SC-mp6` - TC16 reaches the busy control; the refusal toast, once per refusal, and the earlier code staying on show need a consumer that refuses, and no case reaches it. Dev's call
- `grade10-site-store-membership-SC-09` - amended to drop the member-side mirror. No case here walks it, and the store's cases live in `docs/prds/products/grade10-site/store/tests/`, out of this suite

### Over-claimed cases

- `g10.loyalty-programme.US4-TC14` claims the skin follows the tier; the scenario says it is taken from `variant`, which a site run cannot show, so it is not linked to `grade10-site-loyalty-programme-SC-mp3`
- `g10.loyalty-programme.US4-TC19` expects the member's pass to rotate on a scan; the requirement states the consequence and not who tells the pass, so the case rests on a consumer that does, and it asserts no timing
- `g10.loyalty-programme.US4-TC20` asserts the countdown label and refresh control read in each language; the scenarios name no key, so it checks the rendered words only

### Contradictions

None between the readings. The one wording gap (decisions Q9) is closed: the requirement now counts down to the next rotation, as the `refreshesIn` copy reads.
