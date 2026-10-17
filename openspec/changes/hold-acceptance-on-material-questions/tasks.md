# Tasks

Built in one pass from the landed proposal and decisions; no `/planning-dev`
run (`Q13`).

## 1. The rule, once (grade10-spec)

- [x] 1.1 `workflow-round`'s held test is the one test for every question, raised or asked, and holds a contradiction between the two readings; `AGENTS.md` links it - `shared-planning-agent-rounds-SC-126`
- [x] 1.2 `planning-dev`'s QA2 closes each Raised row the held test does not hold on its recommendation, decided by the round, naming its source, with the answer in `## Settled` and one `Q<n>` per source; `spec-to-tcs` raises every point with its options and recommendation; `accept-review` lists the closed rows - `shared-planning-agent-rounds-SC-126`
- [x] 1.3 `docs/governance/specs-to-test-cases.md` Raised, the `decisions.md` template's note and `docs/governance/round-summary.md` say the same
- [x] 1.4 A question about a look: `planning-design`'s Product detail line and `docs/governance/prd-and-openspec.md`'s waiting section send it to one designer's change per capability through `awaiting: ui-design` - `shared-planning-agent-rounds-SC-127`

## 2. Acceptance names what stays open (grade10-spec)

- [x] 2.1 `scripts/openspec/lib/acceptance.mjs` names each open Raised row with its capability, its recommendation and whose answer it waits on, and names no closed row - `shared-planning-change-stages-SC-79`
- [x] 2.2 Test in `scripts/openspec/acceptance.test.mjs`
- [x] 2.3 Verify: `pnpm run test:openspec`, `pnpm check:manual`

## 3. The walk (grade10-spec)

- [ ] 3.1 Walk the journeys once by hand: a designer finds a look question under their name on Pending, and an engineer builds the interim it names — blocked: a walk by the human designer and engineer on a real change; the acceptance refusal is proved by `acceptance.test.mjs`
