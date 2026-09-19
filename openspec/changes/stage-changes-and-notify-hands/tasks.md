# Tasks

Every group lands its tests in their own commit before its code, and its readers run before its landing summary, as [Agent Rounds · The Walk](../../../docs/prds/products/shared/planning/agent-rounds.md#the-walk) asks. Groups 1 to 3 have no screen: a group's demonstration is its tests. Group 7 is the application repository's, kept here so both boards read it.

## 1. The record's keys, the team map and the schema (grade10-spec)

- [ ] 1.1 Add `Role`, `Stage`, `OpenQuestion`, `BehindArtifact` and `TeamMap` to the manual's types, and the fields `hands`, `landedBy`, `reviewed`, `thread`, `uiWaived`, `releasedIn`, `lastLanded`, `questions` and `behind` to the change entry
- [ ] 1.2 Read `hands:`, `landed_by:`, `reviewed:`, `thread:`, `ui_waived:` and `released_in:` in the store's change reader, and count a waived design as written - makes `shared-planning-change-stages-SC-07`, `shared-planning-change-stages-SC-08`, `shared-planning-change-stages-SC-11`, `shared-planning-change-stages-SC-13` and `shared-planning-change-stages-SC-27` readable
- [ ] 1.3 Read `docs/prds/team.yaml` - one entry per handle with its Slack member and roles, one channel per role - through a store module every surface and script shares, and write the first map - `shared-planning-change-stages-SC-18`
- [ ] 1.4 Move `tech-design` above `specs` in the planning schema and set its `requires` to `decisions` and `user-journeys`; keep the worklist derivation right for a change that owes it - `shared-planning-change-stages-SC-09`
- [ ] 1.5 Read the open questions: a `## Decisions` row whose decision opens with ❓ and names a role, and a ❓ line under a page section the proposal links, each with the hand it is addressed to - `shared-planning-change-stages-SC-32`, `shared-planning-change-stages-SC-33`, `shared-planning-change-stages-SC-34`
- [ ] 1.6 Read `lastLanded` from git: the last commit that ticked a task, claimed a group or added a schema artifact, never a commit that only touched the directory - `shared-planning-change-stages-SC-22`, `shared-planning-change-stages-SC-23`
- [ ] 1.7 Tests for every key, malformed and absent, and for the team map, in the manual's test suite; the record table in `docs/governance/prd-and-openspec.md` gains every key

## 2. The stage, the hand and what is behind (grade10-spec)

- [ ] 2.1 `stageOf`: the eight stages and the ladder, an unreadable record as Proposed with hands open - `shared-planning-change-stages-SC-01`, `shared-planning-change-stages-SC-02`, `shared-planning-change-stages-SC-03`, `shared-planning-change-stages-SC-06`
- [ ] 2.2 The four lanes as a projection of the stage, so `laneOf` cannot disagree with it - `shared-planning-change-stages-SC-04`
- [ ] 2.3 `handOf`: whose turn per stage, the Proposed split once the decisions, the journeys and `hands:` are on `main`, an unnamed hand as open - `shared-planning-change-stages-SC-15`, `shared-planning-change-stages-SC-16`, `shared-planning-change-stages-SC-17`
- [ ] 2.4 The mark and the move for the five drafted stages, as one table every surface renders - `shared-planning-change-stages-SC-10`
- [ ] 2.5 The seven overlays, read from the record, the suite, the tasks headings and the hotfix branches; idle from `lastLanded` in whole UTC days, shown from the seventh and shelved from the thirtieth - `shared-planning-change-stages-SC-19`, `shared-planning-change-stages-SC-20`, `shared-planning-change-stages-SC-21`, `shared-planning-change-stages-SC-24`
- [ ] 2.6 The content id and the upstream set of an artifact - the linked page sections, then the artifacts before it in the schema's order, whitespace collapsed, the record never upstream, a waived artifact fresh - and `behindOf` with the commit-date fallback when no `reviewed:` line exists - `shared-planning-change-stages-SC-25`, `shared-planning-change-stages-SC-26`, `shared-planning-change-stages-SC-27`, `shared-planning-change-stages-SC-28`, `shared-planning-change-stages-SC-29`
- [ ] 2.7 Derivation tests, one fixture per stage and per boundary, one per overlay, and the content id against a hand-computed value

## 3. The record's rules and the archive gate (grade10-spec)

- [ ] 3.1 Rule `hands`: an unknown role, a handle the team map does not know, a value that is not one handle - `shared-planning-change-stages-SC-14`
- [ ] 3.2 Rule `landed_by`: a handle the team map does not know, an artifact id the schema does not issue - `shared-planning-change-stages-SC-12`
- [ ] 3.3 `archive:preflight` refuses a behind delta and names what changed before it - `shared-planning-change-stages-SC-31`
- [ ] 3.4 The tick, the claim and the wait stay accepted while an artifact is behind, proven by the plan and archive preflights' tests - `shared-planning-change-stages-SC-30`
- [ ] 3.5 `docs/prds/guides/working-a-change.md` carries the stage table in place of the turn table, and the blueprint's stage row for Planned reads `tasks.md; promoted_by`

## 4. The board and the change page (grade10-spec)

- [ ] 4.1 Eight lanes from the stage table, each heading with its count, its open hands and, on the first five, the mark and the move; an empty lane collapsed; an empty board - `shared-planning-change-stages-SC-10`, `shared-planning-change-stages-SC-51`, `shared-planning-change-stages-SC-52`, `shared-planning-change-stages-SC-53`
- [ ] 4.2 The filters Mine, Waiting, Idle, Behind and Blocked as URL search params, Mine asking for a handle, and the shelf - `shared-planning-change-stages-SC-54`, `shared-planning-change-stages-SC-55`, `shared-planning-change-stages-SC-56`
- [ ] 4.3 The card: the hand or the open role, the age, the overlay chips as the table says, Behind naming the earliest behind artifact and its hand, the wait as written - `shared-planning-change-stages-SC-17`, `shared-planning-change-stages-SC-19`, `shared-planning-change-stages-SC-21`, `shared-planning-change-stages-SC-26`
- [ ] 4.4 The change page's stepper with the mark and the move, the Your turn card with the thread link and the command, and the hands table - `shared-planning-change-stages-SC-05`, `shared-planning-change-stages-SC-57`, `shared-planning-change-stages-SC-58`
- [ ] 4.5 The artifact rows - fresh, behind naming what changed, not owed - with the question count and who landed each; the delivery and handoff rows - `shared-planning-change-stages-SC-11`, `shared-planning-change-stages-SC-25`, `shared-planning-change-stages-SC-34`, `shared-planning-change-stages-SC-35`, `shared-planning-change-stages-SC-59`
- [ ] 4.6 The next action per stage in place of the four-lane one, and the page eyebrow naming the stage
- [ ] 4.7 Component tests for every state `ui-design.md` lists for the board and the change page

## 5. My turn, the page's ribbon and the pip, and Assign (grade10-spec)

- [ ] 5.1 `/my-turn`: the handle chosen once per browser and remembered, asked for before anything lists, an unknown handle reported - `shared-planning-change-stages-SC-62`, `shared-planning-change-stages-SC-63`, `shared-planning-change-stages-SC-64`
- [ ] 5.2 The page's order: open questions, then the changes on the reader now, then theirs later, and the empty page - `shared-planning-change-stages-SC-60`, `shared-planning-change-stages-SC-61`
- [ ] 5.3 A section's in-flight row shows the stage and the hand, and each 🚧 line wears the pip of its change's stage: none once archived, the further stage when two changes deliver it - `shared-planning-change-stages-SC-65`, `shared-planning-change-stages-SC-66`, `shared-planning-change-stages-SC-67`
- [ ] 5.4 Assign on the locally run manual: the dev server writes `hands:` in one commit behind the same confinement as a proposal; the hosted manual shows it read-only - `shared-planning-change-stages-SC-68`, `shared-planning-change-stages-SC-69`
- [ ] 5.5 Component tests for every state `ui-design.md` lists for My turn, the ribbon, the pip and Assign

## 6. The messages (grade10-spec)

- [ ] 6.1 `changed-changes.mjs --stages`: read the store at the push's base and head through the one reader, compute each moved change's stage, hands and behind set on both, and add the stage to the channel post - `shared-planning-change-stages-SC-40`, `shared-planning-change-stages-SC-47`
- [ ] 6.2 One direct message per new hand, the role's channel for an unnamed or removed hand, the thread link or the change page, the command as text - `shared-planning-change-stages-SC-41`, `shared-planning-change-stages-SC-42`, `shared-planning-change-stages-SC-43`
- [ ] 6.3 The Behind message to the hand of the earliest newly behind artifact, and the Staging message to QA with the run tab or without one - `shared-planning-change-stages-SC-44`, `shared-planning-change-stages-SC-45`, `shared-planning-change-stages-SC-46`
- [ ] 6.4 Keys `<change>:<stage>:<role>` and `<change>:behind:<artifact>`, kept across runs so a re-run sends nothing twice and a re-entered stage sends again; the script sends through the Slack API when told to - `shared-planning-change-stages-SC-36`, `shared-planning-change-stages-SC-37`, `shared-planning-change-stages-SC-38`, `shared-planning-change-stages-SC-39`
- [ ] 6.5 The push workflow: `docs/prds/**` in its paths, the sent-key cache, the bot token, and a repository variable that turns the direct messages off
- [ ] 6.6 The digest: one direct message per person with a line to say, Monday 09:00 Hong Kong, listing open questions, idle, behind after seven days, waiting and freed changes; nothing sent to a person with nothing to say - `shared-planning-change-stages-SC-48`, `shared-planning-change-stages-SC-49`, `shared-planning-change-stages-SC-50`
- [ ] 6.7 Script tests over two fixture trees for every message kind, every key and the digest

## 7. The application repository (grade10)

- [ ] 7.1 `pnpm plan hand <change> <role> @handle` writes `hands:` on the store's `main` as `claim` writes an owner - `shared-planning-change-stages-SC-13`
- [ ] 7.2 The board there prints each change's stage from the same derivation - `shared-planning-change-stages-SC-05`
