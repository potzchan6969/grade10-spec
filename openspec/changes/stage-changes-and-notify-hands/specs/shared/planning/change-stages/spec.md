# shared/planning/change-stages Specification

## Purpose

Where a change stands, who is on it, and how they are told: eight stages read
from the change's files on `main`, one hand per stage whose word moves it, a
closed set of overlays beside the stage, and one message per move pointing at
the change's thread, shown the same on the board, the change page, the page's
ribbon, My turn and Slack.

## Feature set

- Stages read from files
  - One of eight: Proposed, Designed, Specified, Planned, Building, On staging, Released, Archived, each proven by what is on `main`, never set by a key
  - One projection: the four lanes, the stepper, the pip and every message read the same derivation
  - Proposed whole: the proposal, the decisions and the journeys are one stage, with ❓ on what is still open
  - Waivers as written: `ui_waived` and `design_waived` stand for the artifact they name, so Designed needs both designs or their line
  - Tech design first: the tech design is drawn beside the UI design, before the requirements, on every change
- Drafted, landed on a word
  - Agent mark: the five stages from Proposed to Building are drafted by the change's agent and carry the hand's move beside the mark
  - Landed by: `landed_by:` names the hand whose word landed each artifact, written by the landing itself
- Hands and whose turn
  - Hands mapping: `hands:` names one handle per role, written by the product manager, the local manual or the application repository's command, refused when the team map does not know it
  - Whose turn: derived from the stage and the hands, the product manager holding Proposed until the decisions, the journeys and the hands are on `main`
  - Unnamed hand: a stage whose hand is unnamed shows the hand as open and routes to the role's channel
  - Team map: one entry per handle with its Slack member and roles, and a channel per role
- Overlays, a closed set
  - Seven overlays: Waiting, Blocked, Idle, Behind, Suite, Flag and Hotfix, each read from a file and shown beside the stage
  - Idle counts landings: days since the last tick, claim or artifact landing, never since a repository-wide commit; shelved at 30
  - Behind is shown: an artifact whose linked page lines or artifacts before it changed after it was drawn or last read again is marked on the card and the artifact, holds no tick, claim or wait here
  - Open questions: a ❓ decisions row or a ❓ line under a linked section, counted per artifact and listed per hand
- Messages, once per move
  - Your turn: one direct message to the hand a change reaches, keyed by change, stage and role, never sent twice for one move
  - Behind and staging: one message to the hand of an artifact newly behind, and one to QA when a change reaches staging
  - Channel and digest: the post per push names each change's stage; a weekly digest per person lists open questions, idle, behind and waiting
- Surfaces that show the stage
  - Board: eight lanes with the agent mark and the hand's move on five, filters for Mine, Waiting, Idle, Behind and Blocked, and the shelf
  - Change page: the stepper, the Your turn card with the thread and the command, the hands, each artifact fresh or behind with its questions and who landed it, delivery and handoff
  - My turn: the reader's open questions, then the changes on them now, then the ones theirs later
  - Ribbon and pip: a section's in-flight row shows the stage and the hand, and each 🚧 line wears its change's stage
  - Assign: the local manual writes a hand; the hosted manual shows it read-only

