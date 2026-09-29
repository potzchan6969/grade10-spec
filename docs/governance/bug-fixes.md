# Bug Fixes

## Bug or Change

A bug is code that does not do what is already settled. What its fix moves decides the lane, never its size.

| The fix | Lane |
| --- | --- |
| Restores what the spec, the page, the Figma design or a component's contract already says | Bug fix |
| Restores what nobody would decide otherwise - a crash, a cropped or overlapping control, a layout that breaks at one width, a focus ring cut short, a typo | Bug fix |
| Picks between outcomes a reader would notice, where nothing settled says which, or where two settled sources disagree | Change, with the page's ❓ line first |
| Moves a requirement, a scenario, a public export or a page line | Change |
| Keeps the code and corrects a spec that says otherwise | Change, whose delta is the correction |

| Report | Lane | Why |
| --- | --- | --- |
| The top of Google's button ring is cut off in the sign-in dialog | Bug fix | A focus ring is drawn whole; nobody decides otherwise |
| A price shows `$1,000.0` where the spec shows two decimals | Bug fix | The spec already says it |
| An empty cart opens a blank drawer, and nothing says what it shows | Change | Somebody decides what the empty state says |
| The spec lists five roles and the code enforces six | Change | The delta corrects the spec |

## Rounds

A bug fix is a `fix` commit with a regression test and nothing else: no OpenSpec change, no delta, no page edit, no suite edit and no `pnpm plan` write. It runs six rounds, each posted on the report. The readers of rounds 2 and 5 are the schema's `bug:` block, read by `node scripts/openspec/bug-readers.mjs`; each reader is its own call and never sees another's findings, and the verifier rules on all of them.

| Round | Who | Done when |
| --- | --- | --- |
| 1. Diagnose | One agent, changing no file | The diagnosis fills the template below |
| 2. Challenge | The diagnosis round's readers, then the verifier | Nothing stands |
| 3. Red | One agent, writing the test alone | The diagnosis's test command fails on the unfixed tree |
| 4. Green | One agent, writing the fix | The test passes, the repository's checks pass, the test is untouched and no protected path moved |
| 5. Review | The fix round's readers, then the verifier | Nothing stands |
| 6. Verify | One agent, walking the report's own steps | It answers `Verified: yes` with its evidence |

- **Stands** - the finding goes back to the round it came from, and that round runs again
- **Asks** - the run stops, and the question waits on the report for the person it names
- **Test name** - a scenario the spec already names gives the regression test its id
- **Round cap** - 3 runs of round 2, and of round 5, before the run stops as `unsettled`
- **Protected paths** - CI, manifests and lockfiles, agent instructions, `openspec/`, `docs/prds/` and a submodule's pin. A fix that needs one is not a bug fix run unattended

## Diagnosis

The four keyed lines lead, then the sections. `scripts/bug-fix/run.mjs` refuses a diagnosis missing any keyed line.

```markdown
Lane: bug
Lands in: here
Test: `<command that runs the regression test alone>`
Commit: fix(<domain>): <outcome>

## Symptom
## Root Cause
## Siblings
## Evidence
## Plan
## Screens
```

- **Lane** - `bug`, or `change` by the table above, which ends the run
- **Lands in** - `here`, or the `owner/repo` whose code is wrong, which ends the run as `moved`
- **Siblings** - each path the same mechanism reaches, and whether this fix covers it or it is its own bug
- **Screens** - only where a reader sees the symptom: the widths, states and themes it shows at. It summons the design reader in rounds 2 and 5

## Outcomes

| Outcome | Next |
| --- | --- |
| `fixed` | A draft pull request, `fix(<domain>): <outcome>`, labelled `bug`, that closes the report. A person reviews and merges it |
| `change` | The report goes to planning, per Turning Into a Change |
| `moved` | The report is filed in the repository the diagnosis names |
| `asks`, `unsettled` | A person answers the question or the standing findings, then labels the report again |
| `no-red`, `no-green`, `unverified`, `unreadable`, `agent-failed` | A person reads the posted rounds; the run left nothing on `main` |

## Running It

- **From a report** - the `agent-fix` label, added by whoever confirms it reads as a bug, runs `scripts/bug-fix/run.mjs` in the repository's `Bug fix` workflow and posts each round
- **In a session** - `/fix-bug` runs the same rounds and the same gates, dispatching each reader itself
- **By hand** - `node scripts/bug-fix/run.mjs --report <file> --agent scripts/bug-fix/claude-agent.sh --out <dir>`, or `cursor-agent.sh`: the agent is any command called as `<cmd> <read|write> <prompt-file>`

## Choosing the Repository

- **A primitive, a block, a token or a message catalog** - this store, by pull request. The application then moves its submodule pin to a `main` commit that holds the fix
- **Arrangement, data or behaviour of the application** - the application repository
- **Both** - the store first; the application's pull request carries its own part and the new pin

## Turning Into a Change

Stop coding at the first sign the fix would move something settled. Write the open question as a ❓ line on the capability's page, start the change with `/workflow-plan`, and link the change from the report.
