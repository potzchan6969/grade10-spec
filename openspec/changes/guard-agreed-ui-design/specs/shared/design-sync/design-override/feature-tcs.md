# shared/design-sync/design-override Test Cases

**Status:** pending-review · 0/19
**Drafts styled:** 2026-09-29, tcs-rules r4

**Out of suite:** shared-design-sync-design-override-SC-11, shared-design-sync-design-override-SC-12, shared-design-sync-design-override-SC-27, shared-design-sync-design-override-SC-32, shared-design-sync-design-override-SC-36, shared-design-sync-design-override-SC-39, shared-design-sync-design-override-SC-44, shared-design-sync-design-override-SC-45, shared-design-sync-design-override-SC-49

## shared-design-sync-design-override-US1: The agreed UI design holds at commit and push

**Walked by:** nobody on their own - only the people building the product
meet it, at commit and push; the designer who inherits its reports walks no
journey here, and its anchors are the feature set's root groups

**As an** admin building the product,
**I want** a commit that would change the agreed UI design stopped until my
person confirms it,
**so that** the agreed look changes only on purpose and the designer hears of
every override.

<!-- trace:case id=g10.shared-design-override.TC-yi5 rev=1 covers=g10.shared-design-override.SC-rls,g10.shared-design-override.SC-l0o,g10.shared-design-override.SC-6go,g10.shared-design-override.SC-qos,g10.shared-design-override.SC-2yb,g10.shared-design-override.SC-22d,g10.shared-design-override.SC-j3z,g10.shared-design-override.SC-2f5,g10.shared-design-override.SC-vtw,g10.shared-design-override.SC-buk,g10.shared-design-override.SC-qc6,g10.shared-design-override.SC-qla -->
### shared-design-sync-design-override-US1-TC1-1: Changes that set no agreed look commit without a stop

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Stopping a look change

**Pre-conditions:**

* admin(engineer, no `design` role in `team.yaml`) is in `<store clone>`, on a branch off the current `main`.
* Hooks are set by `pnpm install` in `<store clone>`.

**Test data:**

| Change | File | Outcome |
| --- | --- | --- |
| A new line setting a class | `<a store block file>` | Commits |
| A new block file | a new file under `packages/ui/src/blocks` | Commits |
| A new story | `<a primitive story file>` | Commits |
| A new token | `packages/design-system/tokens.json` | Commits |
| A function moved unchanged within the file | `<a store block file>` | Commits |
| The file renamed within `packages/ui/src/blocks`, contents unchanged | `<a store block file>` | Commits |
| Lines re-indented, no value changed | `<a primitive file>` | Commits |
| A line setting no look rewritten, such as a handler's name | `<a store block file>` | Commits |
| A class rewritten outside the watched paths | `<a preview file outside apps/preview/src/pages>` | Commits |

**Steps:**

1. In `<store clone>`, make the row's change to the row's file.
2. Stage the change.
3. Commit with a message holding no `Design-Override:` line.

**Expected Results:**

* Step 3 prints no stop.
* The commit is recorded on the branch.

<!-- trace:case id=g10.shared-design-override.TC-l87 rev=1 covers=g10.shared-design-override.SC-rls,g10.shared-design-override.SC-l0o,g10.shared-design-override.SC-6go,g10.shared-design-override.SC-qos,g10.shared-design-override.SC-2yb,g10.shared-design-override.SC-22d,g10.shared-design-override.SC-j3z,g10.shared-design-override.SC-2f5,g10.shared-design-override.SC-vtw,g10.shared-design-override.SC-buk,g10.shared-design-override.SC-qc6,g10.shared-design-override.SC-qla -->
### shared-design-sync-design-override-US1-TC2-1: A rewritten or removed look line stops the commit and names it

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Stopping a look change

**Pre-conditions:**

* admin(engineer, no `design` role in `team.yaml`) is in `<store clone>`, on a branch off the current `main`.
* Hooks are set by `pnpm install` in `<store clone>`.

**Test data:**

| Look line | File | Change | Outcome |
| --- | --- | --- | --- |
| Class | `<a store block file>` | A `className` value rewritten, such as `p-4` to `p-6` | Stopped |
| Variant | `<a primitive file>` | A variant's classes removed | Stopped |
| Spacing | `<a preview page file>` under `apps/preview/src/pages` | A spacing value rewritten, such as `gap-2` to `gap-3` | Stopped |
| Motion value | `<a primitive file>` | A transition duration rewritten | Stopped |
| Story title | `<a primitive story file>` | The story's title renamed | Stopped |
| Token changed | `packages/design-system/tokens.json` | A token's value changed | Stopped |
| Token removed | `packages/design-system/tokens.json` | A token removed | Stopped |
| Two files | `<a store block file>` and `packages/design-system/tokens.json` | A class rewritten in one, a token changed in the other | Stopped, both files named |
| Class order | `<a store block file>` | The classes of one class list reordered, none added or removed | Stopped |
| Older copy moved in | `<a preview page file>` to a new file under `packages/ui/src/blocks` | The component removed from the page and added from an older copy lacking two motion lines | Stopped, only the two motion lines named |

**Steps:**

1. In `<store clone>`, make the row's change to the row's file.
2. Stage the change.
3. Commit with a message holding no `Design-Override:` line.

**Expected Results:**

* Step 3 stops; no commit is recorded.
* The stop names each changed file.
* Each look line shows its text before and after.
* Each look line shows who last set it and when, matching its history on `main`.

<!-- trace:case id=g10.shared-design-override.TC-l2j rev=1 covers=g10.shared-design-override.SC-cy5,g10.shared-design-override.SC-l3b,g10.shared-design-override.SC-7on,g10.shared-design-override.SC-re6,g10.shared-design-override.SC-8vy,g10.shared-design-override.SC-vs0 -->
### shared-design-sync-design-override-US1-TC3-1: Merges that keep both sides commit without a stop

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Stopping a lossy merge

**Pre-conditions:**

* admin(engineer, no `design` role in `team.yaml`) is in `<store clone>`, on a branch off the current `main`.
* Hooks are set by `pnpm install` in `<store clone>`.
* `<branch B>` holds the row's commit, which the current branch lacks.

**Test data:**

| `<branch B>` holds | Merge resolved as | Outcome |
| --- | --- | --- |
| A new line setting a class in `<a store block file>` | Git's own merge, no conflict | Commits |
| `<held line>` removed from `<a store block file>`, which the current branch holds unchanged | `<held line>` left out | Commits |
| A new line in `<a docs page>` under `docs/prds` | That line dropped | Commits |

**Steps:**

1. Merge `<branch B>` into the current branch without committing.
2. Resolve the merge as the row says.
3. Commit the merge with no `Design-Override:` line.

**Expected Results:**

* Step 3 prints no stop.
* The merge commit is recorded.

<!-- trace:case id=g10.shared-design-override.TC-32y rev=1 covers=g10.shared-design-override.SC-cy5,g10.shared-design-override.SC-l3b,g10.shared-design-override.SC-7on,g10.shared-design-override.SC-re6,g10.shared-design-override.SC-8vy,g10.shared-design-override.SC-vs0 -->
### shared-design-sync-design-override-US1-TC4-1: A merge that drops one side's line stops, whoever commits it

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Stopping a lossy merge

**Pre-conditions:**

* The row's clone has hooks set by `pnpm install`, and its current branch is off the current `main`.
* `<branch B>` holds a commit adding `<added line>` to the row's file, which the current branch lacks.
* `<held line>` is a line of the row's file that the base, the current branch and `<branch B>` all hold.
* Commits are made as the row's committer.

**Test data:**

| Clone | File | Committer | Resolved as | Dropped | Outcome |
| --- | --- | --- | --- | --- | --- |
| `<store clone>` | `<a store block file>` | `<engineer e-mail>` | The file restored to the current branch's version | `<added line>` | Stopped |
| `<store clone>` | `<a store block file>` | `<designer e-mail>`, the `design` role in `team.yaml` | The file restored to the current branch's version | `<added line>` | Stopped |
| `<application clone>` | `<a site page file>` | `<engineer e-mail>` | The file restored to the current branch's version | `<added line>` | Stopped |
| `<store clone>` | `<a store block file>` | `<engineer e-mail>` | Both sides kept, `<held line>` deleted | `<held line>` | Stopped |

**Steps:**

1. Merge `<branch B>` into the current branch without committing.
2. Resolve the merge as the row says.
3. Commit the merge with no `Design-Override:` line.

**Expected Results:**

* Step 3 stops; no merge commit is recorded.
* The stop names the file and the row's dropped line.

<!-- trace:case id=g10.shared-design-override.TC-a37 rev=1 covers=g10.shared-design-override.SC-vhk,g10.shared-design-override.SC-4gl,g10.shared-design-override.SC-u2l,g10.shared-design-override.SC-dmc,g10.shared-design-override.SC-1xq,g10.shared-design-override.SC-d4e,g10.shared-design-override.SC-auw -->
### shared-design-sync-design-override-US1-TC5-1: Site page code using store blocks as drawn commits

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Refusing a rebuilt block

**Pre-conditions:**

* admin(engineer, no `design` role in `team.yaml`) is in `<application clone>`, on a branch off the current `main`.
* Hooks are set by `pnpm install` in `<application clone>`.
* `<a listed page>` is listed with its reason in the application's block check.

**Test data:**

| File | Change | Outcome |
| --- | --- | --- |
| `<a site page file>` | A store block used with no `className` | Commits |
| `<a site page file>` | `Text` and `Button` from the design system | Commits |
| `<a listed page>` | A card from the design system | Commits |
| `<an admin frontend page>` | A dialog from the design system | Commits |

**Steps:**

1. In `<application clone>`, make the row's change to the row's file.
2. Stage the change.
3. Commit with a message holding no `Design-Override:` line.

**Expected Results:**

* Step 3 prints no refusal.
* The commit is recorded on the branch.

<!-- trace:case id=g10.shared-design-override.TC-eey rev=1 covers=g10.shared-design-override.SC-vhk,g10.shared-design-override.SC-4gl,g10.shared-design-override.SC-u2l,g10.shared-design-override.SC-dmc,g10.shared-design-override.SC-1xq,g10.shared-design-override.SC-d4e,g10.shared-design-override.SC-auw -->
### shared-design-sync-design-override-US1-TC6-1: Site page code rebuilding a store block is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Refusing a rebuilt block

**Pre-conditions:**

* admin(engineer, no `design` role in `team.yaml`) is in `<application clone>`, on a branch off the current `main`.
* Hooks are set by `pnpm install` in `<application clone>`.
* Neither `<a site page file>` nor `<a site package frontend file>` is listed in the application's block check.

**Test data:**

| File | Change | Message ends with | Outcome |
| --- | --- | --- | --- |
| `<a site page file>` | A card from the design system | Nothing more | Refused |
| `<a site package frontend file>` | A dialog from the design system | Nothing more | Refused |
| `<a site page file>` | A drawer from the design system | Nothing more | Refused |
| `<a site package frontend file>` | Tabs from the design system | Nothing more | Refused |
| `<a site page file>` | A table from the design system | Nothing more | Refused |
| `<a site package frontend file>` | A stepper from the design system | Nothing more | Refused |
| `<a site page file>` | A list from the design system | Nothing more | Refused |
| `<a site package frontend file>` | An empty state from the design system | Nothing more | Refused |
| `<a site page file>` | Pagination from the design system | Nothing more | Refused |
| `<a site package frontend file>` | Breadcrumbs from the design system | Nothing more | Refused |
| `<a site page file>` | A radio card from the design system | Nothing more | Refused |
| `<a site page file>` | A `className` on the third line of a store block's multi-line opening tag | Nothing more | Refused |
| `<a site page file>` | A card from the design system | `Design-Override: <reason>` | Refused |

**Steps:**

1. In `<application clone>`, make the row's change to the row's file.
2. Stage the change.
3. Commit with the row's message ending.

**Expected Results:**

* Step 3 is refused; no commit is recorded.
* The refusal names the file and the primitive or the store block.

<!-- trace:case id=g10.shared-design-override.TC-jig rev=1 covers=g10.shared-design-override.SC-b5w,g10.shared-design-override.SC-wrf,g10.shared-design-override.SC-voi,g10.shared-design-override.SC-l1o -->
### shared-design-sync-design-override-US1-TC7-1: A stopped change commits with a confirmed override line

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Confirming an override

**Pre-conditions:**

* admin(engineer, no `design` role in `team.yaml`) is in `<store clone>`, on a branch off the current `main`.
* Hooks are set by `pnpm install` in `<store clone>`.
* For the merge row, `<branch B>` holds a commit adding `<added line>` to `<a store block file>`, which the current branch lacks.

**Test data:**

| Stopped change | `<reason>` | Outcome |
| --- | --- | --- |
| A `className` value rewritten in `<a store block file>`, staged | `Card padding p-4 to p-6, as drawn for the listing page` (any reason a teammate can read) | Commits |
| `<branch B>` merged without committing, `<a store block file>` restored to the current branch's version | `Keeps the listing card as drawn, dropping the branch's extra class` (any reason a teammate can read) | Commits |
| A `className` value rewritten in `<a store block file>`, staged, the last paragraph also holding `Co-authored-by: <engineer e-mail>` above the line | `Card padding p-4 to p-6, as drawn for the listing page` (any reason a teammate can read) | Commits |

**Steps:**

1. In `<store clone>`, make the row's stopped change.
2. Commit with `Design-Override: <reason>` as the message's last paragraph.

**Expected Results:**

* Step 2 prints no stop.
* The commit is recorded, its message ending with `Design-Override: <reason>`.

<!-- trace:case id=g10.shared-design-override.TC-6c4 rev=1 covers=g10.shared-design-override.SC-b5w,g10.shared-design-override.SC-wrf,g10.shared-design-override.SC-voi,g10.shared-design-override.SC-l1o -->
### shared-design-sync-design-override-US1-TC8-1: An empty or misplaced override line leaves the commit stopped

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Confirming an override

**Pre-conditions:**

* admin(engineer, no `design` role in `team.yaml`) is in `<store clone>`, on a branch off the current `main`.
* Hooks are set by `pnpm install` in `<store clone>`.

**Test data:**

| Message ends with | Outcome |
| --- | --- |
| `Design-Override:` and nothing after it | Stopped |
| `Design-Override:` and only spaces after it | Stopped |
| `Design-Override: <reason>`, then a paragraph of prose | Stopped |

**Steps:**

1. In `<store clone>`, rewrite a `className` value in `<a store block file>`.
2. Stage the change.
3. Commit with the row's message ending.

**Expected Results:**

* Step 3 stops; no commit is recorded.

<!-- trace:case id=g10.shared-design-override.TC-8c3 rev=1 covers=g10.shared-design-override.SC-b5w,g10.shared-design-override.SC-wrf,g10.shared-design-override.SC-voi,g10.shared-design-override.SC-l1o -->
### shared-design-sync-design-override-US1-TC9-1: An agent shows the stop and waits for its person

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** Confirming an override

**Pre-conditions:**

* admin(engineer working through a coding agent) has the agent open in `<store clone>`, on a branch off the current `main`.
* Hooks are set by `pnpm install` in `<store clone>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<reason>` | `Card padding p-4 to p-6, as drawn for the listing page` (any reason a teammate can read) |

**Steps:**

1. Ask the agent to rewrite a `className` value in `<a store block file>` and commit it.
2. Read what the agent shows when the commit stops.
3. Reply to the agent with `<reason>`.

**Expected Results:**

* Step 1's commit stops; no commit is recorded.
* Step 2 shows the stop's lines and asks the person.
* Before step 3, the agent adds no `Design-Override:` line.
* Before step 3, the agent does not commit with the check skipped.
* After step 3, the commit is recorded ending `Design-Override: <reason>`.

<!-- trace:case id=g10.shared-design-override.TC-xfm rev=1 covers=g10.shared-design-override.SC-wss,g10.shared-design-override.SC-ab0,g10.shared-design-override.SC-8ji,g10.shared-design-override.SC-akl -->
### shared-design-sync-design-override-US1-TC10-1: A look change the designer made commits without a stop

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Exempting the designer

**Pre-conditions:**

* `<store clone>` is on a branch off the current `main`, hooks set by `pnpm install`.
* `<designer e-mail>` holds the `design` role in `docs/prds/team.yaml`.
* `<engineer e-mail>` holds a role other than `design` there.

**Test data:**

| Author | Committer | `Co-authored-by` | Outcome |
| --- | --- | --- | --- |
| `<designer e-mail>` | `<designer e-mail>` | None | Commits |
| `<engineer e-mail>` | `<designer e-mail>` | None | Commits |
| `Claude <noreply@anthropic.com>` | `Claude <noreply@anthropic.com>` | `<designer e-mail>` | Commits |

**Steps:**

1. In `<store clone>`, rewrite a `className` value in `<a store block file>`.
2. Stage the change.
3. Commit as the row's author and committer, with the row's co-author and no `Design-Override:` line.

**Expected Results:**

* Step 3 prints no stop.
* The commit is recorded on the branch.

<!-- trace:case id=g10.shared-design-override.TC-i9o rev=1 covers=g10.shared-design-override.SC-wss,g10.shared-design-override.SC-ab0,g10.shared-design-override.SC-8ji,g10.shared-design-override.SC-akl -->
### shared-design-sync-design-override-US1-TC11-1: A look change without the designer on it is not exempt

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Exempting the designer

**Pre-conditions:**

* `<store clone>` is on a branch off the current `main`, hooks set by `pnpm install`.
* `<engineer e-mail>` holds a role other than `design` in `docs/prds/team.yaml`.
* `<unknown e-mail>` is in no entry of `docs/prds/team.yaml`.

**Test data:**

| Author and committer | `Co-authored-by` | Outcome |
| --- | --- | --- |
| `<engineer e-mail>` | None | Stopped |
| `Cursor Agent <unknown e-mail>` | None | Stopped |
| `Claude <noreply@anthropic.com>` | `<engineer e-mail>` | Stopped |

**Steps:**

1. In `<store clone>`, rewrite a `className` value in `<a store block file>`.
2. Stage the change.
3. Commit as the row's author and committer, with the row's co-author and no `Design-Override:` line.

**Expected Results:**

* Step 3 stops; no commit is recorded.

<!-- trace:case id=g10.shared-design-override.TC-4uh rev=1 covers=g10.shared-design-override.SC-r0e,g10.shared-design-override.SC-0f1,g10.shared-design-override.SC-jct,g10.shared-design-override.SC-pri,g10.shared-design-override.SC-zcy,g10.shared-design-override.SC-wgf,g10.shared-design-override.SC-5gs,g10.shared-design-override.SC-v77,g10.shared-design-override.SC-iv0 -->
### shared-design-sync-design-override-US1-TC12-1: Only the staged change is checked at commit

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Checking at commit and push

**Pre-conditions:**

* admin(engineer, no `design` role in `team.yaml`) is in `<store clone>`, on a branch off the current `main`.
* Hooks are set by `pnpm install` in `<store clone>`.
* The working tree holds an unstaged `className` rewrite in `<a store block file>`.

**Steps:**

1. Rewrite a line setting no look in `<another store block file>`.
2. Stage only `<another store block file>`.
3. Commit with a message holding no `Design-Override:` line.

**Expected Results:**

* Step 3 prints no stop.
* The commit is recorded, holding only `<another store block file>`.
* The unstaged rewrite is still in the working tree.

<!-- trace:case id=g10.shared-design-override.TC-5ed rev=1 covers=g10.shared-design-override.SC-r0e,g10.shared-design-override.SC-0f1,g10.shared-design-override.SC-jct,g10.shared-design-override.SC-pri,g10.shared-design-override.SC-zcy,g10.shared-design-override.SC-wgf,g10.shared-design-override.SC-5gs,g10.shared-design-override.SC-v77,g10.shared-design-override.SC-iv0 -->
### shared-design-sync-design-override-US1-TC13-1: A new branch pushes without stopping on main's history

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Checking at commit and push

**Pre-conditions:**

* admin(engineer, no `design` role in `team.yaml`) is in `<store clone>`, hooks set by `pnpm install`.
* `<new branch>` exists only locally, off the current `main`.
* `<new branch>` holds a commit changing no look, then a `className` rewrite ending `Design-Override: <reason>`.

**Steps:**

1. Push `<new branch>` to `origin`.

**Expected Results:**

* The push prints no stop.
* `<new branch>` is on `origin` with both commits.

<!-- trace:case id=g10.shared-design-override.TC-c3t rev=1 covers=g10.shared-design-override.SC-r0e,g10.shared-design-override.SC-0f1,g10.shared-design-override.SC-jct,g10.shared-design-override.SC-pri,g10.shared-design-override.SC-zcy,g10.shared-design-override.SC-wgf,g10.shared-design-override.SC-5gs,g10.shared-design-override.SC-v77,g10.shared-design-override.SC-iv0 -->
### shared-design-sync-design-override-US1-TC14-1: A push is refused for a stopping commit that went unchecked

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Checking at commit and push

**Pre-conditions:**

* admin(engineer, no `design` role in `team.yaml`) is in `<store clone>`, hooks set by `pnpm install`.
* The row's branch holds the row's commit, with no `Design-Override:` line.

**Test data:**

| Branch | The commit | Outcome |
| --- | --- | --- |
| `<pushed branch>`, already on `origin` | A `className` rewrite committed with the commit check skipped | Refused |
| `<new branch>`, only local | The second of three commits, a token changed with the commit check skipped | Refused |
| `<pushed branch>`, already on `origin` | Rebased onto `main`, a conflict resolved by rewriting a `className` | Refused |
| `<pushed branch>`, already on `origin` | Cherry-picked from a branch where it was committed with the check skipped | Refused |

**Steps:**

1. Push the row's branch to `origin`.

**Expected Results:**

* The push is refused.
* The stop names the row's commit and its look lines.
* `origin` holds the branch as before, or not at all for `<new branch>`.

<!-- trace:case id=g10.shared-design-override.TC-dtb rev=1 covers=g10.shared-design-override.SC-r0e,g10.shared-design-override.SC-0f1,g10.shared-design-override.SC-jct,g10.shared-design-override.SC-pri,g10.shared-design-override.SC-zcy,g10.shared-design-override.SC-wgf,g10.shared-design-override.SC-5gs,g10.shared-design-override.SC-v77,g10.shared-design-override.SC-iv0 -->
### shared-design-sync-design-override-US1-TC15-1: Installing sets both checks in both repositories and the store's submodule

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Checking at commit and push

**Pre-conditions:**

* admin(engineer, no `design` role in `team.yaml`) has a fresh clone of the row's repository, its submodules checked out, `pnpm install` not yet run.
* The repository the row commits in is on a branch off the current `main`.

**Test data:**

| Where | Install in | Change | Outcome |
| --- | --- | --- | --- |
| The store | `<store clone>` | A `className` rewrite in `<a store block file>` | Stopped at commit and push |
| The application | `<application clone>` | A card from the design system in `<a site page file>` | Refused at commit and push |
| The store's submodule | `<application clone>`, then committing inside `external/grade10-spec` | A `className` rewrite in a store block file | Stopped at commit and push |

**Steps:**

1. Run `pnpm install` where the row says.
2. Make the row's change.
3. Commit with no `Design-Override:` line.
4. Commit the same change with the commit check skipped.
5. Push the branch to `origin`.

**Expected Results:**

* Step 3 stops; no commit is recorded.
* Step 5 is refused; `origin` does not receive the branch.

<!-- trace:case id=g10.shared-design-override.TC-pz4 rev=1 covers=g10.shared-design-override.SC-kwf,g10.shared-design-override.SC-0l1,g10.shared-design-override.SC-0kk,g10.shared-design-override.SC-yua,g10.shared-design-override.SC-3wm,g10.shared-design-override.SC-qzc -->
### shared-design-sync-design-override-US1-TC16-1: An override reaching main mentions the designer once

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Telling the designer

**Pre-conditions:**

* admin(engineer, no `design` role in `team.yaml`) can push to `main` of the row's repository, hooks set by `pnpm install`.
* `<designer handle>` is the GitHub handle of the `design` role in `docs/prds/team.yaml`.

**Test data:**

| Repository | Override commit | Outcome |
| --- | --- | --- |
| The store | A `className` rewrite in `<a store block file>`, ending `Design-Override: <reason>` | Mentioned once |
| The application | A merge dropping `<added line>` from `<a site page file>`, ending `Design-Override: <reason>` | Mentioned once |

**Steps:**

1. Commit the row's override commit on `main`.
2. Push `main` to `origin`.
3. Open the commit on GitHub.
4. Re-run the report on `main` for the same push.
5. Reopen the commit on GitHub.

**Expected Results:**

* Step 3 shows a comment mentioning `@<designer handle>`.
* The comment lists the lines the commit changed.
* Step 5 still shows exactly one mention of `@<designer handle>`.

<!-- trace:case id=g10.shared-design-override.TC-b3y rev=1 covers=g10.shared-design-override.SC-kwf,g10.shared-design-override.SC-0l1,g10.shared-design-override.SC-0kk,g10.shared-design-override.SC-yua,g10.shared-design-override.SC-3wm,g10.shared-design-override.SC-qzc -->
### shared-design-sync-design-override-US1-TC17-1: A stopping commit that skipped both checks is reported on main

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Telling the designer

**Pre-conditions:**

* admin(engineer, no `design` role in `team.yaml`) can push to `main` of the store, in `<store clone>`, hooks set by `pnpm install`.
* `<designer handle>` is the GitHub handle of the `design` role in `docs/prds/team.yaml`.

**Steps:**

1. Rewrite a `className` value in `<a store block file>`.
2. Commit on `main` with the commit check skipped and no `Design-Override:` line.
3. Push `main` to `origin` with the push check skipped.
4. Open the commit on GitHub.

**Expected Results:**

* Step 4 shows a comment mentioning `@<designer handle>`.
* The comment lists the lines the commit changed.
* The commit stays on `main`; no revert follows it.

<!-- trace:case id=g10.shared-design-override.TC-lxb rev=1 covers=g10.shared-design-override.SC-kwf,g10.shared-design-override.SC-0l1,g10.shared-design-override.SC-0kk,g10.shared-design-override.SC-yua,g10.shared-design-override.SC-3wm,g10.shared-design-override.SC-qzc -->
### shared-design-sync-design-override-US1-TC18-1: Commits that need no word reach main without a mention

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Telling the designer

**Pre-conditions:**

* `<store clone>` has hooks set by `pnpm install`, with push rights to `origin`.
* `<designer e-mail>` holds the `design` role in `docs/prds/team.yaml`, with `<designer handle>`.

**Test data:**

| Commit | Pushed to | Outcome |
| --- | --- | --- |
| A line setting no look rewritten, both checks skipped | `main` | No mention |
| A `className` rewrite authored by `<designer e-mail>`, no `Design-Override:` line | `main` | No mention |
| A `className` rewrite ending `Design-Override: <reason>` | `<pushed branch>`, not `main` | No mention |

**Steps:**

1. In `<store clone>`, make the row's commit.
2. Push it to the row's branch on `origin`.
3. Open the commit on GitHub.

**Expected Results:**

* Step 3 shows no comment mentioning `@<designer handle>`.

<!-- trace:case id=g10.shared-design-override.TC-xh3 rev=1 covers=g10.shared-design-override.SC-vhk,g10.shared-design-override.SC-4gl,g10.shared-design-override.SC-u2l,g10.shared-design-override.SC-dmc,g10.shared-design-override.SC-1xq,g10.shared-design-override.SC-d4e,g10.shared-design-override.SC-auw -->
### shared-design-sync-design-override-US1-TC19-1: A listing that no longer holds fails the block check

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Refusing a rebuilt block

**Pre-conditions:**

* admin(engineer, no `design` role in `team.yaml`) is in `<application clone>`, on a branch off the current `main`.
* Hooks are set by `pnpm install` in `<application clone>`.
* `<a listed page>` is listed with its reason in the application's block check.

**Test data:**

| Change | Outcome |
| --- | --- |
| The listing's reason emptied | Refused, naming the listing |
| `<a listed page>` deleted, its listing kept | Refused, naming the listing |
| `<a listed page>` moved onto the store's blocks, its listing kept | Refused, naming the listing |

**Steps:**

1. In `<application clone>`, make the row's change.
2. Stage the change.
3. Commit with a message holding no `Design-Override:` line.

**Expected Results:**

* Step 3 is refused; no commit is recorded.
* The refusal names `<a listed page>`'s listing.

## Settled

- Only whitespace is formatting: a reordered class list, and a line moved out of the watched paths, are changes to the agreed look.
- A commit carrying `Design-Override:` that stops on nothing is not reported on `main`.
- The designer's exemption and the `Design-Override:` line never pass a rebuilt block; only a listed page with its reason does.

## Reconciliation

**Run:** The blind pass read this capability's `## Purpose` and
`## Feature set`, its `user-journeys.md` (nobody walks it), the change's
`decisions.md` (goals, non-goals, Q1 to Q11, an empty `## Raised`), the
manual page `design-override`, the rulebook, the conventions, and two
suites for shape only (`shared/ui/auction-record`,
`grade10-site/site/typography`). It was denied `spec.md`'s Requirements,
the change's `tech-design.md`, `openspec/changes/` and its archive, and every
other spec; no `proposal.md`, `ui-design.md`, domain suite or prior suite was
in the bundle, so no case is `acceptance`. The capability has only makers as
users, so cases name the nearest class the conventions allow,
`admin(<engineer or designer, with the role that matters>)`.

**Run:** 2026-09-29. Both readings were taken from this capability's
`## Purpose` and `## Feature set`: the suite blind, the scenarios without the
suite, then joined on the feature set's root groups.

| Spec scenario | Suite coverage |
| --- | --- |
| `shared-design-sync-design-override-SC-02`, `shared-design-sync-design-override-SC-03`, `shared-design-sync-design-override-SC-04`, `shared-design-sync-design-override-SC-10`, `shared-design-sync-design-override-SC-46` | `shared-design-sync-design-override-US1-TC2-1` |
| `shared-design-sync-design-override-SC-05`, `shared-design-sync-design-override-SC-06`, `shared-design-sync-design-override-SC-07`, `shared-design-sync-design-override-SC-08`, `shared-design-sync-design-override-SC-09` | `shared-design-sync-design-override-US1-TC1-1` |
| `shared-design-sync-design-override-SC-13`, `shared-design-sync-design-override-SC-15`, `shared-design-sync-design-override-SC-16`, `shared-design-sync-design-override-SC-17` | `shared-design-sync-design-override-US1-TC4-1` |
| `shared-design-sync-design-override-SC-14`, `shared-design-sync-design-override-SC-47` | `shared-design-sync-design-override-US1-TC3-1` |
| `shared-design-sync-design-override-SC-18`, `shared-design-sync-design-override-SC-19`, `shared-design-sync-design-override-SC-23` | `shared-design-sync-design-override-US1-TC6-1` |
| `shared-design-sync-design-override-SC-20`, `shared-design-sync-design-override-SC-21`, `shared-design-sync-design-override-SC-22` | `shared-design-sync-design-override-US1-TC5-1` |
| `shared-design-sync-design-override-SC-48` | `shared-design-sync-design-override-US1-TC19-1` |
| `shared-design-sync-design-override-SC-24`, `shared-design-sync-design-override-SC-34` | `shared-design-sync-design-override-US1-TC7-1` |
| `shared-design-sync-design-override-SC-25`, `shared-design-sync-design-override-SC-26` | `shared-design-sync-design-override-US1-TC8-1` |
| `shared-design-sync-design-override-SC-28`, `shared-design-sync-design-override-SC-29`, `shared-design-sync-design-override-SC-30` | `shared-design-sync-design-override-US1-TC10-1` |
| `shared-design-sync-design-override-SC-31` | `shared-design-sync-design-override-US1-TC11-1` |
| `shared-design-sync-design-override-SC-33` | `shared-design-sync-design-override-US1-TC14-1` |
| `shared-design-sync-design-override-SC-35` | `shared-design-sync-design-override-US1-TC13-1` |
| `shared-design-sync-design-override-SC-37`, `shared-design-sync-design-override-SC-38` | `shared-design-sync-design-override-US1-TC15-1` |
| `shared-design-sync-design-override-SC-40`, `shared-design-sync-design-override-SC-43` | `shared-design-sync-design-override-US1-TC16-1` |
| `shared-design-sync-design-override-SC-41` | `shared-design-sync-design-override-US1-TC17-1` |
| `shared-design-sync-design-override-SC-42` | `shared-design-sync-design-override-US1-TC18-1` |
| Uncovered scenarios | None |
| Contradicted readings | None |

- **Folded into the spec** - a line dropped outside the watched paths passes a
  merge (TC3), as `shared-design-sync-design-override-SC-47`; a reordered class list stops (the scenarios' own
  reading, with a TC2 row added), as `shared-design-sync-design-override-SC-46`
- **Cases added** - TC2's older-copy row for `shared-design-sync-design-override-SC-03`, TC4's deleted
  `<held line>` row for `shared-design-sync-design-override-SC-15`, TC5's admin row for `shared-design-sync-design-override-SC-22`, TC7's
  co-author row for the trailer's placement, and TC19 for `shared-design-sync-design-override-SC-48`
- **Settled by the round** - what the blind pass raised landed as Q5, Q8 and
  Q12 to Q20 in `decisions.md`; the answers that shape a case are under
  `## Settled`
- **Kept without a scenario** - TC9, the agent waiting for its person, walks
  the `AGENTS.md` rule's **A stop** bullet, which only a person running an
  agent can check; TC12, only the staged change checked, is the requirement's
  **At commit** rule and is decided by the engine's tests
- **Out of suite** - `shared-design-sync-design-override-SC-11`, `shared-design-sync-design-override-SC-12`, `shared-design-sync-design-override-SC-32`, `shared-design-sync-design-override-SC-36`, `shared-design-sync-design-override-SC-39`, `shared-design-sync-design-override-SC-44`,
  `shared-design-sync-design-override-SC-45` and `shared-design-sync-design-override-SC-49` are decided by the check's tests in
  `scripts/design-override/`, in this store, and the application's hook
  tests; `shared-design-sync-design-override-SC-27` by the build round's reading of both `AGENTS.md` files
