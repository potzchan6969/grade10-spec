# shared/ui/auction-listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## shared-ui-auction-listing-US1: The listing surface's rendering contract

**Walked by:** nobody on their own — a component contract; the journeys live in `grade10-site/auction/listing-page`, which composes the blocks

**As an** application composing the shared lot gallery,
**I want** several images to show a left thumbnail rail only when the gallery
is wide enough for that rail beside the main frame,
**so that** a stacked column keeps a clear stage with previous/next and
progress instead of a crowded second rail.

<!-- trace:case id=g10.shared-auction-listing.TC-53e rev=1 covers=g10.shared-auction-listing.SC-as2,g10.shared-auction-listing.SC-9gi -->
### shared-ui-auction-listing-US1-TC11-1: Bid rows read in the supplied locale and time zone

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** regression
* **Layer:** unit
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Bid history

**Decided by:** `packages/ui/src/blocks/auction-listing/listing-bid-history-list.test.ts`

**Pre-conditions:**

* Storybook renders `ListingBidHistoryList` with locale <locale> and time zone <time zone>.
* One row was accepted 5 minutes ago, and one at 2026-09-01T12:00:00Z.

**Test data:**

| Locale | Time zone | Older row reads |
| --- | --- | --- |
| en | Asia/Hong_Kong | 1 Sep 2026, 20:00 |
| en | Asia/Tokyo | 1 Sep 2026, 21:00 |
| zh-Hant | Asia/Tokyo | the 1st of the month, 2026, 21:00 |
| zh-Hant | America/New_York | the 1st of the month, 2026, 08:00 |
| zh-Hant | Pacific/Kiritimati | the 2nd of the month, 2026, 02:00 |

**Steps:**

1. Read the recent row's time.
2. Read the older row's time.

**Expected Results:**

* Step 1: the recent row reads in relative form, in <locale>.
* Step 2: the older row reads <older row reads>; a zh-Hant month's wording is not asserted.
* Step 2: no zone name follows the older row's time.
* Each row keeps its accepted instant as data.

<!-- trace:case id=g10.shared-auction-listing.TC-n6b rev=1 covers=g10.shared-auction-listing.SC-as2,g10.shared-auction-listing.SC-9gi,g10.shared-auction-listing.SC-tzc,g10.shared-auction-listing.SC-acp -->
### shared-ui-auction-listing-US1-TC57-1: A tile's close line takes the supplied locale and zone together

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** regression
* **Layer:** unit
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Bid history

**Decided by:** `packages/ui/src/blocks/auction-listing/auction-card.test.ts`

**Pre-conditions:**

* Storybook renders `AuctionCard` closing at 2027-09-01T12:00:00Z with locale zh-Hant and time zone <viewer zone>.

**Test data:**

| Viewer zone | Local time | Zone name |
| --- | --- | --- |
| Asia/Tokyo | 21:00 | GMT+9 |
| America/New_York | 08:00 | EDT |

**Steps:**

1. Read the close line on the tile.

**Expected Results:**

* The clock reads <local time>, not Hong Kong's 20:00.
* The line names <zone name>, in English though the locale is zh-Hant, and not HKT.

<!-- trace:case id=g10.shared-auction-listing.TC-ae5 rev=1 covers=g10.shared-auction-listing.SC-as2,g10.shared-auction-listing.SC-9gi,g10.shared-auction-listing.SC-tzc,g10.shared-auction-listing.SC-acp -->
### shared-ui-auction-listing-US1-TC58-1: A bid row's display text replaces its formatted time

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** automated
* **Testability:** automation
* **Trace:** Bid history

**Decided by:** `packages/ui/src/blocks/auction-listing/listing-auction-bid-card.stories.tsx`

**Pre-conditions:**

* Storybook renders `ListingBidHistoryList` with locale en and time zone Asia/Hong_Kong.
* One row carries an accepted instant and the display text <display text>.
* One row carries only an accepted instant, 2026-09-01T12:00:00Z.

**Test data:**

| Field | Value |
| --- | --- |
| <display text> | `DISPLAY-TEXT-MARKER`, a string no date formatter could produce |

**Steps:**

1. Read the time of the row that carries the display text.
2. Read the time of the row that carries only an accepted instant.

**Expected Results:**

* Step 1: the row shows <display text> as supplied.
* Step 1: no date, clock or zone name shows beside it.
* Step 2: the row reads 1 Sep 2026, 20:00.

## Settled

- A catalogue tile's Ends, Opens and Closed lines all name the viewer's zone.
- The lot bid card carries a dated collector deadline line beside its countdown, and its closed block names the viewer's zone after a close time that shows a clock; a close shown as a day alone names none.
- An older bid row's time carries no zone name; each row keeps its accepted instant as data, and a supplied display text replaces only the formatted time.
- Activity time reads relative below seven days and as a local moment from seven days.
- A zone name on a tile or a bid card is English in every language: the zone's short name in US English, HKT for Hong Kong, and an offset where US English has none.
- The tile's Ends, Opens and Closed words stay English in every language, and a Chinese month's wording is not asserted by these cases; a month that reads as a bare number goes to the bug lane.

## Reconciliation

**Run:** QA2 re-run, 2026-10-06, for change `align-collector-times-to-local-zone`, in a fresh context, after the final accept-review's blocker was fixed in the `shared/dates-and-times` delta (a scenario narrowed, decisions Q20 and Q21, the tech design, the tasks and the PRD pages aligned with it) and after decisions Q28, which the planning owner settled by default and the human has not yet answered (a grading letter's shop-hours line keeps its own wording, a recorded non-goal). No new blind reading ran, and QA1 and Dev were not run again: no anchor changed after they read them, so both readings stand. It joined three readings on the anchors: QA1's blind cases from the first run, Dev's delta `spec.md`, `tech-design.md` and `tasks.md` as the editor revised them, and the human's answers (decisions Q5 to Q27, with the Q28 default) as the editor applied them to the proposal, the specs, the design, the tasks, the suites and the PRD pages. QA1, as its run recorded, read the rulebook, the `spec-to-tcs` skill, `writing.md`, `test-traceability.md` and `tcs-conventions.md`, and a bundle of the change's `proposal.md`, `decisions.md` with `## Raised`, `openspec/config.yaml`'s `context`, each capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, its PRD page and the durable suite with its `## Reconciliation` stripped; it was denied every `## Requirements` section and scenario, `tech-design.md`, `tasks.md`, every other suite, application code and every validator. Dev, as its run recorded, was denied every `feature-tcs.md`, every domain suite, every reconciliation and QA1's output. This pass was not blind and wrote no case. It read the planning skill and the rulebooks whole (`specs-to-test-cases.md`, `tcs-conventions.md`, `test-traceability.md`, `writing.md`, `task-ownership.md`), the change's artifacts, the durable spec and suite this change folds into, the touched PRD pages as a diff against `HEAD`, the store's `packages/ui` formatter, tile and bid card closed-block code, stories and tests and, read-only, searches of the application for callers of `AuctionCard`, `formatListing*` and `formatCollectorDeadline`. It re-derived the clocks the cases state (Hong Kong, Tokyo, New York and Kiritimati, and the tile's zone names) from Node's `Intl` and found them as written, and checked that no other open change issues the new scenario or the two new case ids of this capability. It ran `pnpm run tcs:validate` on this scope, plain and with `--strict`, with no findings; `pnpm run trace validate` on the working tree and on a clean `git archive HEAD` export, where the only new issues are the delta-against-durable duplicate-id pairs (the `shared-ui-auction-listing-US1-TC11-1` case); `openspec validate --strict`; `pnpm check:manual`, with no failures and no warning naming this change; `accept-preflight`; a fold of all three deltas in a scratch copy of the store, read against the durable files (every kept marker byte-identical but for revision 2 on `shared-dates-and-times-SC-11` to `shared-dates-and-times-SC-14`, every durable heading verbatim, `tcs:validate --require-suites` clean on the folded copy); and the store's node-lane tests for the formatter, PDF and `AuctionCard` files (39 pass) and the `@grade10/ui` type check. It ran none of the application's tests and did not run the story lane. It changed this line and no other in this file. No domain, product or platform suite sits above this capability (the proposal records no domain and no platform impact), so no scenario is covered at domain. It is a statement, not proof.

| Finding | Disposition |
| --- | --- |
| TC11: bid rows read in the supplied locale and time zone (durable draft, restated by QA1 with one new result, no zone name after the older time) | **Agreed:** `shared-ui-auction-listing-SC-13` and the requirement's `timeZone` thread; the added result follows `shared-dates-and-times-SC-23`. QA2 restyled `1 September 2026` to `1 Sep 2026` (the requirement states `DD Mon YYYY, HH:MM`) and took in the rows of QA1's `shared/dates-and-times` TC5 (Traditional Chinese with New York, with Kiritimati, English with Tokyo): the same steps on the same block with other values. **Restyled after clarification:** the Traditional Chinese rows asserted a month "worded in zh-Hant", which the built formatter does not draw (it prints a bare month number); decisions Q15 leaves that wording out of this change, so those rows now assert the day, the year and the clock only. The case keeps its id, its revision and its marker: it is a draft nobody has reviewed and no test accepts, and the rules keep a draft's revision when a result joins it |
| TC56: a lot's tile and bid card state one deadline in Hong Kong and New York | **Dropped:** its tile step repeats durable `shared-ui-auction-listing-US1-TC55-1` (Hong Kong `HKT`, New York `EDT`); its bid card step moved to the `shared/dates-and-times` suite, whose scenario states it. QA1's acceptance duty passes to that case and to durable TC55 |
| TC57: a tile's close line takes the supplied locale and zone together | **Agreed:** `shared-ui-auction-listing-SC-55` with the requirement's `locale` and `timeZone`. **Trimmed:** the result "the line is worded in the locale": no scenario states what the tile's words are in another locale, and the built line keeps its English prefix and prints the month of a Chinese locale as a bare number; decisions Q15 leaves both out. **Result added after clarification:** the zone's name is English in a Traditional Chinese tile, `GMT+9` for Tokyo and `EDT` for New York (decisions Q5) |
| TC58: a bid row in a non-timestamp state shows its supplied display text | **Folded in:** `shared-ui-auction-listing-SC-57`, for the requirement's "unless `timeOverride` is set" and the PRD's display text; Dev wrote none because this change does not move it, and the clause is cheap to hold now. The case stays draft and covers it |
| `shared-ui-auction-listing-SC-55`: a catalogue tile's close follows the viewer | **Agreed:** durable `shared-ui-auction-listing-US1-TC55-1` already walks it and this change does not rewrite it; it is not carried here |
| Raised: which tile states show a dated line that names a zone, and whether Closed names one | **Rejected** for the tile: the requirement says the Ends, Opens and Closed line names the viewer's zone. For the lot bid card's closed block, which named no zone, **landed:** decisions Q6. The requirement now says the closed lot's close time names the zone, `shared-dates-and-times-SC-14` states it, and `shared-dates-and-times-US1-TC11-1` walks the block |
| Raised: does the lot bid card show a dated deadline, and does it name the zone | **Rejected:** the requirement has the bid card thread `timeZone` to a collector deadline line, and the open lot's line names the zone; the closed block is the row above |
| Raised: does an older bid row state its zone | **Rejected:** the local-moment requirement and the PRD say no zone suffix |
| Raised: what a row shows with neither an accepted instant nor display text | **Rejected:** the PRD says each row keeps its accepted instant as data, and the row type requires it; the display text replaces only the formatted time |
| Raised: does a tile's zone name follow a Traditional Chinese locale | **Landed:** decisions Q5, restated by decisions Q18 as the zone's short name in US English, `HKT` for Hong Kong, an English offset where it has none. The name is English in every locale, which TC57 reads |
| Raised: are the tile's Ends, Opens and Closed words English in every language, and may a Chinese month read as a bare number | **Landed:** decisions Q15, left out of this change; no scenario and no result asserts either. The bare month number goes to the bug lane |
| Raised: at what age a recent bid row becomes a local moment | **Rejected:** the activity-time requirement says seven days |
| Second re-run: the display-text scenario and case named the row by its state ("no timestamp"), while the requirement and durable `auction-listing-SC-22` name the supplied `timeOverride` on a row that still carries its accepted instant | **Restyled:** `shared-ui-auction-listing-SC-57` names `timeOverride`; `shared-ui-auction-listing-US1-TC58-1` says the row carries both an accepted instant and a display text and drops the timestamp wording. Ids, revisions and markers kept |
| Raised: does the lot bid card's closed block name a zone when it shows the close day alone (decisions Q20) | **Landed:** decisions Q20, narrowed by Q21. The requirement says a close that shows a clock names the viewer's zone and a close shown as a day alone names none; the clock form is read by `shared-dates-and-times-US1-TC11-1` and the day-only form by `shared-dates-and-times-US1-TC18-1`, and no case here asserts either |
| Accept-review: the delta's journey statement was older than the durable one, so the fold would have replaced the statement an earlier change folded in | **Restated:** the delta suite carries the durable `Walked by` line and journey statement word for word, so the fold changes neither |
| Accept-review: the requirement's bid card and tile sentences named only `HKT` and `EDT`, while `shared-ui-auction-listing-US1-TC57-1` reads `GMT+9` | **Restated:** both sentences point at the dates rule, and a closing sentence says the viewer's zone is named as `shared/dates-and-times` names it: its short name in US English, or its offset in English where US English has none, whatever the locale |
| Contradictions between QA1's cases and Dev's scenarios | **Contradicted:** none. QA1's TC58 premise, a row with no timestamp, is the display-text override on a row that still carries its accepted instant, and TC57's "worded in the locale" is not a claim any scenario makes |
| tech-design.md decision 3: require `locale` on `AuctionCard` | **Joined:** the requirement already says `AuctionCard` requires `locale` and `timeZone`, and the built tile defaults `locale` to English, so task 2.3 closes the gap; TC57 supplies `locale` in every row. No case or scenario moves |
| `shared-ui-auction-listing-SC-13` for the personal bidding dialog's rows | **Out of suite:** the dialog (`ListingUserBidHistory`) takes the same required `locale` and `timeZone`; the store's type check holds the props and `listing-user-bid-history.stories.tsx` renders it. The scenario names a bid card only |

**Uncovered anchors:** none for `Localized activity`.

### Manual

| Manual | Why |
| --- | --- |
| `shared-ui-auction-listing-US1-TC11-1` | A person reads each locale's older row in Storybook beside the time zone control, to be walked in task 5.1's walk; no test reads a Chinese or Korean row yet |
| `shared-ui-auction-listing-US1-TC57-1` | A person reads the tile's close line in Storybook with the locale set to Traditional Chinese and the time zone control on Tokyo and on New York, to be walked in task 5.1's walk; the store test (task 2.1) is to decide the rendered string, not what a reader sees in a Chinese Storybook |
