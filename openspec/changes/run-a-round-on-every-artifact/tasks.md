# Tasks

Every group lands its tests in their own commit before its code, and its readers run before its landing summary, as [Agent Rounds · The Walk](../../../docs/prds/products/shared/planning/agent-rounds.md#the-walk) asks. Depends on `stage-changes-and-notify-hands` groups 1 to 3 for the reader, the derivation and the record's rules. Group 6 is the application repository's, kept here so both boards read it.

## 1. The principles, the perspectives and the readers (grade10-spec)

- [ ] 1.1 `perspectives:` per artifact in the planning schema beside `teammate:` - name, `when` and the reader it dispatches - for the page and the three product artifacts, the UI design, the tech design, the requirements, the plan and a task group; the store's schema reader carries it and the CLI still renders the instructions - `shared-planning-agent-rounds-SC-28`, `shared-planning-agent-rounds-SC-29`
- [ ] 1.2 One challenger definition per perspective under `.claude/agents/`, each given the draft and what is before it and nothing else, and one verifier definition given a group of findings and the draft; the tech design's and the build's readers cite `docs/governance/system-design.md` and name a principle per finding - `shared-planning-agent-rounds-SC-30`, `shared-planning-agent-rounds-SC-31`
- [ ] 1.3 Tests: the schema's perspectives parse, every `agent` path exists, every entry has a `when` the table names, and the CLI renders every artifact's instructions

## 2. The round and the line commands (grade10-spec)

- [ ] 2.1 The `round` skill: the six steps, the diff classified against the `when` set, the simpler-thing reader always, one reader verifying itself, the thread summary and the numbered questions, the moves, and the landing on the hand's word - `shared-planning-agent-rounds-SC-01`, `shared-planning-agent-rounds-SC-02`, `shared-planning-agent-rounds-SC-03`, `shared-planning-agent-rounds-SC-08`, `shared-planning-agent-rounds-SC-09`, `shared-planning-agent-rounds-SC-10`
- [ ] 2.2 The moves in the skill: `Q<n>: answer`, `Q<n>` alone, a remark applied as written and re-read narrowly, a remark settling a question, a reply the round cannot apply, a remark on a page's marked lines, a hand's own push - `shared-planning-agent-rounds-SC-11`, `shared-planning-agent-rounds-SC-12`, `shared-planning-agent-rounds-SC-13`, `shared-planning-agent-rounds-SC-14`, `shared-planning-agent-rounds-SC-15`, `shared-planning-agent-rounds-SC-16`
- [ ] 2.3 Questions in the skill: a preference or a product decision as the next unused `Q<n>` row with `❓ <role> - recommended:`, a product detail as a ❓ page line, a finding routed to the artifact it belongs to, a draft that waits for a frame or a value - `shared-planning-agent-rounds-SC-20`, `shared-planning-agent-rounds-SC-21`, `shared-planning-agent-rounds-SC-22`, `shared-planning-agent-rounds-SC-23`, `shared-planning-agent-rounds-SC-24`, `shared-planning-agent-rounds-SC-25`
- [ ] 2.4 The re-read in the skill: read what follows a landing oldest first, write `reviewed:` and say so when nothing changes, open a round and stop at the first edit, refuse a landing while anything before it is behind, ask the product manager on a moved goal and act on each answer - `shared-planning-agent-rounds-SC-39`, `shared-planning-agent-rounds-SC-40`, `shared-planning-agent-rounds-SC-41`, `shared-planning-agent-rounds-SC-42`, `shared-planning-agent-rounds-SC-43`, `shared-planning-agent-rounds-SC-45`, `shared-planning-agent-rounds-SC-46`, `shared-planning-agent-rounds-SC-47`, `shared-planning-agent-rounds-SC-48`
- [ ] 2.5 `/plan` (a sentence opens a change, a later message joins the one it names, an asker the map does not know), `/design`, `/tech`, `/specify` (the two readings as its challenge, the reconciliation as its verify, the tech design read, the dated wait on the tech PIC), `/tasks`, `/build` and `/land`, each naming its artifact and calling `/round` - `shared-planning-agent-rounds-SC-06`, `shared-planning-agent-rounds-SC-07`, `shared-planning-agent-rounds-SC-17`, `shared-planning-agent-rounds-SC-18`, `shared-planning-agent-rounds-SC-19`, `shared-planning-agent-rounds-SC-49`, `shared-planning-agent-rounds-SC-50`, `shared-planning-agent-rounds-SC-65`
- [ ] 2.6 `AGENTS.md` maps the line commands; `docs/prds/guides/working-a-change.md` describes the round; `planning-qa` reads `tech-design.md`; parity synced

## 3. The content id, the landing step and the record (grade10-spec)

- [ ] 3.1 `pnpm run reviewed <change> [artifact…]` computes each artifact's content id from the tree and writes the `reviewed:` lines the re-read lands - `shared-planning-agent-rounds-SC-32`, `shared-planning-agent-rounds-SC-33`, `shared-planning-agent-rounds-SC-34`, `shared-planning-agent-rounds-SC-35`, `shared-planning-agent-rounds-SC-36`
- [ ] 3.2 Read `rounds.md` into the change entry and the change document, absent until the first round - `shared-planning-agent-rounds-SC-53`
- [ ] 3.3 `pnpm run round:row <change>` appends one row - the round's number, the artifact or group, the perspectives, what stood, the question ids, the tests per scenario - and the archive copies the file across - `shared-planning-agent-rounds-SC-51`, `shared-planning-agent-rounds-SC-52`
- [ ] 3.4 `check:manual` rule `round`: a landed artifact from the proposal to the plan or a ticked group with no row, and a row leaving a column empty, refused on a change created on or after the rule's day - `shared-planning-agent-rounds-SC-54`, `shared-planning-agent-rounds-SC-55`, `shared-planning-agent-rounds-SC-56`
- [ ] 3.5 `pnpm run land <change> <artifact|group> @handle`: rebase on `main`, run the gate the checks run, refuse while anything before the artifact is behind and name it, write `landed_by:` and the round row in one commit, push with a lease, and say so and stop when the lease is lost - `shared-planning-agent-rounds-SC-04`, `shared-planning-agent-rounds-SC-05`, `shared-planning-agent-rounds-SC-37`, `shared-planning-agent-rounds-SC-38`, `shared-planning-agent-rounds-SC-43`, `shared-planning-agent-rounds-SC-44`, `shared-planning-agent-rounds-SC-69`
- [ ] 3.6 Script tests over fixture changes for the content id, the row, the rule and every refusal of the landing step

## 4. The surfaces and the run sheet (grade10-spec)

- [ ] 4.1 The change page's Rounds row, the question ids on each artifact row, the thread link on My turn's questions, and the automated count on the delivery row - `shared-planning-agent-rounds-SC-26`, `shared-planning-agent-rounds-SC-27`, `shared-planning-agent-rounds-SC-51`
- [ ] 4.2 `run-sheet.mjs --include-automated`, off by default, saying how many automated cases it left out - `shared-planning-agent-rounds-SC-61`
- [ ] 4.3 `pnpm run tcs:automated <case…>` flips a case's automation status to automated, for the walk's commit - `shared-planning-agent-rounds-SC-59`
- [ ] 4.4 Component and script tests for each of the four

## 5. The thread and the runner (grade10-spec)

- [ ] 5.1 The push workflow writes `thread:` once, from the first channel post about a change, in a commit of its own - `shared-planning-agent-rounds-SC-64`
- [ ] 5.2 The re-read job: after the messages, one job per change whose behind set at head is not empty, `concurrency: cascade-<change>` without cancelling, running the vendor's action with `/round reread <change>` on the full checkout, behind a repository variable - `shared-planning-agent-rounds-SC-66`, `shared-planning-agent-rounds-SC-67`, `shared-planning-agent-rounds-SC-68`
- [ ] 5.3 `docs/references/agent-runner.md`: what the Slack app and the action need from Operations - the plan, the pairing, the app's repository access, the secret's home, the variables - with the ❓ rows the page keeps

## 6. The application repository (grade10)

- [ ] 6.1 `/build` there calls the same round against a task group: the tests named by the group's scenario ids in their own commit, then the code, then its readers, then the landing summary in the thread - `shared-planning-agent-rounds-SC-57`, `shared-planning-agent-rounds-SC-58`
- [ ] 6.2 `pnpm plan done` refuses a tick whose task names no scenario id or one no test in the tree cites - `shared-planning-agent-rounds-SC-63`
- [ ] 6.3 The last group's walk: the journeys in a browser, the end-to-end suite left behind, its cases flipped to automated in its commit, one reader over the whole change - `shared-planning-agent-rounds-SC-59`, `shared-planning-agent-rounds-SC-60`
- [ ] 6.4 The suite on every push to `main`, its smoke cases on every staging deploy and every cut - `shared-planning-agent-rounds-SC-62`
