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

## Fixing a Bug

A bug fix is a `fix` commit with a regression test and nothing else: no OpenSpec change, no delta, no page edit, no suite edit and no `pnpm plan` write.

1. **Report** - an issue in the repository whose code is wrong, or the pull request itself when the bug is found and fixed in one sitting
2. **Root cause** - the mechanism that produces the symptom. Where a symptom shows is not always where its defect lives
3. **Siblings** - every other place the same mechanism reaches. One that shares the root cause is fixed in the same pull request; one with its own root cause is reported as its own bug
4. **Regression test** - written first and failing on `main` for the reported reason, then turned green by the fix. A scenario the spec already names gives the test its id
5. **Pull request** - `fix(<domain>): <outcome>`, labelled `bug`, naming the symptom, the root cause, the siblings and the test, with a before and after image for anything a reader sees

## Choosing the Repository

- **A primitive, a block, a token or a message catalog** - this store, by pull request. The application then moves its submodule pin to a `main` commit that holds the fix
- **Arrangement, data or behaviour of the application** - the application repository
- **Both** - the store first; the application's pull request carries its own part and the new pin

## Turning Into a Change

Stop coding at the first sign the fix would move something settled. Write the open question as a ❓ line on the capability's page, start the change with `/workflow-plan`, and link the change from the report.
