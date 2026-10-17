# Tasks

Built in one pass from the landed proposal, decisions, journeys and tech
design; no `/planning-dev` run (`Q11`).

## 1. What moved, read and classed (grade10-spec)

- [x] 1.1 `movedOf`, `decidedOf`, `holdsOf` and `whole` in `tools/manual/src/api/moved.ts`: the units (a `## Decisions` row by `Q<n>`, a `### Requirement:` block, a case by its id, each `##` section less those, the preamble), a repeated key read whole, and the class table - whitespace none, punctuation not touching a digit small, a Decided cell compared without its ❓ wrapper and attribution, the Asked and Instead of cells small, the proposal's `## Why` small, everything else major - `shared-planning-agent-rounds-SC-120`
- [x] 1.2 `GitIndex` gains `writerOf` (the commit that wrote a `reviewed:` line) and `showAt`; `upstreamOf` reads the before at that commit, checks it hashes to the line's id, and writes `moved` unit by unit, keyed per capability for a `specs/**` item; the dated `newer` and `firstNewerOn` retire - `shared-planning-agent-rounds-SC-114`
- [x] 1.3 `behindOf`: fresh only where the line holds today's id; no line, or a before that cannot be recovered, behind whole and major; `holds` on any major move - `shared-planning-agent-rounds-SC-116`, `shared-planning-agent-rounds-SC-117`
- [x] 1.4 Tests: `tools/manual/test/moved.test.ts` for the class table, and `behind.test.ts` over a real history for a moved linked section, a reworded Why and a taken and an overturned recommendation

## 2. The landing (grade10-spec)

- [x] 2.1 `plan:land` refuses only on a major move before the target, naming the artifact, the moved units and the hand; a small move says so and lands - `shared-planning-agent-rounds-SC-116`, `shared-planning-agent-rounds-SC-117`
- [x] 2.2 Every artifact landing writes its own `reviewed:` line, read over `MAIN` with what it carries laid over it; `reviewedAfterDecisions` is deleted, so no answer marks a draft read - `shared-planning-agent-rounds-SC-118`, `shared-planning-agent-rounds-SC-120`
- [x] 2.3 `--reviewed` resolves and checks the hand as any landing does; a wake with no sender lands nothing - `shared-planning-agent-rounds-SC-119`
- [x] 2.4 A shallow clone is deepened before the landing reads what moved
- [x] 2.5 The relay's `checkReviewed` takes `checkWord`'s word and hand checks beside its record-only check, the room resolving the sender for both kinds - `shared-planning-agent-rounds-SC-119`
- [x] 2.6 Tests: `round-scripts.test.mjs` and `plan-land-relay.test.mjs` over a fixture whose record carries every artifact's line, `tools/relay/test/land.test.ts` and `room.test.ts`

## 3. What a hand is told (grade10-spec)

- [x] 3.1 `toldOf` in `tools/manual/src/api/told.ts`: one entry per person, every artifact of theirs a new unit reached; `toldBetween` replaces `newlyBehind` in `lib/moves.mjs` and the re-read matrix - `shared-planning-agent-rounds-SC-115`
- [x] 3.2 `movedText` and `behindLabelOf` in `lib/wording.mjs`: each unit quoted once with its class, and which artifacts it holds; the message key `<change>:behind:<handle or role>` - `shared-planning-agent-rounds-SC-114`, `shared-planning-agent-rounds-SC-128`
- [x] 3.3 Told now, the chip, My turn's To read again and the digest's behind lines read every behind artifact of the person, small moves included - `shared-planning-agent-rounds-SC-128`
- [x] 3.4 Tests: `moves.test.mjs`, `wording.test.mjs`, `changed-changes.test.mjs`, `digest.test.mjs`, `told-now.test.tsx` and `my-turn-page.test.tsx`

## 4. The backfill and the page (grade10-spec)

- [x] 4.1 `scripts/openspec/backfill-reviewed.mjs` writes today's id for every in-flight, written, unwaived artifact with no line that the retired date comparison does not name behind (`Q9`); run on the store and, with `--all`, on the manual's demo store, in a commit that touches only `reviewed:` keys
- [ ] 4.2 Rerun the backfill on the store's `main` just before this lands, then delete the script - blocked: it runs on the integrated `main`, after the coordinator merges
- [x] 4.3 The planning pages say the rule once: what moved quoted, major holds and small is told, fresh is a hand's word
- [x] 4.4 Verify: `pnpm run test:openspec`, `pnpm --dir tools/manual test`, `pnpm --dir tools/relay test`, `pnpm check:manual`
