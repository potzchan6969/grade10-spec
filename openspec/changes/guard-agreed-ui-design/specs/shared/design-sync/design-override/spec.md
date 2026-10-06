## Purpose

Stops a commit that would change the agreed UI design, drop either side's UI
work in a merge, or rebuild a store block in site page code, until the person
behind it confirms, and tells the designer of every override that reaches
`main`.

## Feature set

- Stopping a look change
  - Watched paths: the store's blocks, primitives, preview pages and tokens
  - Look lines: a class, a variant, spacing, a motion value, a story title, a token
  - Passing without a stop: additions, moves, formatting, lines that set no look
  - The stop: each file, the line before and after, who last set it and when
- Stopping a lossy merge
  - Both sides kept: a line either parent holds stays unless the other removed it
  - No exemption: the designer's merges are held too
- Refusing a rebuilt block
  - Block-shaped primitives: the design-system blocks site page code does not use
  - Styled-over blocks: a `className` on a store block
  - Listed pages: a page that rebuilds a block on purpose, with its reason
- Confirming an override
  - The line: `Design-Override:` and a reason, as the message's last paragraph
  - The person's word: an agent shows the stop and waits for its person
- Exempting the designer
  - By e-mail: an author, committer or co-author holding the `design` role
- Checking at commit and push
  - At commit: the staged change and its message
  - At push: every commit leaving the machine, on a new branch too
  - Set on install: the hooks, in both repositories and the store's submodule
- Telling the designer
  - On `main`: a mention on each override and each commit that skipped the check
  - Once: a commit already told is not told again

## ADDED Requirements

### Requirement: A commit that changes the agreed look stops

The agreed look is what `main` holds in the store's watched paths. A commit
with one parent that removes or rewrites a line setting that look stops.

**Watched paths** - The look rule SHALL read only these paths, all in the
store:

| Path | Holds |
| --- | --- |
| `packages/ui/src/blocks` | Blocks |
| `packages/design-system/src/components` | Primitives |
| `apps/preview/src/pages` | Preview pages |
| `packages/design-system/tokens.json` | Tokens |

**Look lines** - A removed line in a watched path SHALL stop the commit when
it holds one of these:

| Kind | A removed line that holds |
| --- | --- |
| Class | A class list, or a call that joins class lists |
| Variant | A variant definition, or a variant's key |
| Inline style | A `style=` attribute |
| Motion | A motion key: `initial`, `animate`, `exit`, `transition`, `duration`, `ease` or `delay` |
| Named value | A constant whose name ends `_MS`, `_S`, `_EASE` or `_PX` |
| Story title | A story's `title:` |

Spacing is read from class lists and `_PX` values.

**Rewritten** - A line replaced by another, or whose words or their order
change, SHALL count as removed, and SHALL stop the commit on the same terms.

**Tokens** - `tokens.json` SHALL be compared as parsed tokens, not as lines:
a token path removed, or a token's value changed, SHALL stop the commit. A
line rewritten only because a token was added beside it SHALL NOT.

**Passing without a stop** - A removed line SHALL NOT stop the commit when it
is blank, an import, a type or a comment, or when the same line is added back
unchanged in any watched path in the same commit. A change to whitespace
alone SHALL NOT count as a removal. New lines, new files and new stories
SHALL NOT stop a commit.

**Judged per commit** - Each commit SHALL be judged against its first parent,
never against `main`.

<!-- trace:scenario id=g10.shared-design-override.SC-rls rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-02 - Each look-line kind stops
**Serves:** Stopping a look change - one commit per kind, each removing one such line from a primitive

- **WHEN** a commit removes a line of one kind in the look-line table from a
  file under `packages/design-system/src/components`, one commit per kind
- **THEN** each of those commits stops, naming the removed line

<!-- trace:scenario id=g10.shared-design-override.SC-l0o rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-03 - A block moved in from an older copy stops
**Serves:** Stopping a look change - a banner is moved into the shared blocks from a copy older than the designer's polish

- **GIVEN** a preview page under `apps/preview/src/pages` holds a banner
  whose motion sets `duration` and `ease`
- **WHEN** a commit removes the banner there and adds it under
  `packages/ui/src/blocks` from an older copy without those two lines
- **THEN** the commit stops, naming both motion lines
- **AND** names none of the lines added back unchanged

<!-- trace:scenario id=g10.shared-design-override.SC-6go rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-04 - A changed or removed token stops
**Serves:** Stopping a look change - a token's value is edited, and another token is deleted

- **WHEN** one commit changes a token's value in `tokens.json`, and another
  removes a token path
- **THEN** each commit stops, naming the token path

<!-- trace:scenario id=g10.shared-design-override.SC-qos rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-05 - An added token passes
**Serves:** Stopping a look change - a new token is appended after the last one in its group

- **WHEN** a commit adds a token to `tokens.json`, rewriting the line before
  it only to add a comma
- **THEN** the commit passes without a stop

<!-- trace:scenario id=g10.shared-design-override.SC-2yb rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-06 - Code moved unchanged passes
**Serves:** Stopping a look change - a component is lifted from a preview page into a block as it is

- **WHEN** a commit removes a component that sets class lists from a preview
  page and adds the same lines unchanged under `packages/ui/src/blocks`
- **THEN** the commit passes without a stop

<!-- trace:scenario id=g10.shared-design-override.SC-22d rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-07 - Formatting passes
**Serves:** Stopping a look change - a formatter rewrites a block's spacing between tokens

- **WHEN** a commit changes only the whitespace in a block's lines
- **THEN** the commit passes without a stop

<!-- trace:scenario id=g10.shared-design-override.SC-j3z rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-08 - Lines that set no look pass
**Serves:** Stopping a look change - a refactor clears imports, types, comments and logic

- **WHEN** a commit in a watched path removes an import, a type, a comment, a
  blank line and a line that sets none of the look-line kinds, and adds a new
  story
- **THEN** the commit passes without a stop

<!-- trace:scenario id=g10.shared-design-override.SC-2f5 rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-09 - A path outside the watched paths passes
**Serves:** Stopping a look change - a script's class list is rewritten

- **WHEN** a commit rewrites a class list in a file under `scripts/`
- **THEN** the commit passes without a stop

<!-- trace:scenario id=g10.shared-design-override.SC-vtw rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-46 - A reordered class list stops
**Serves:** Stopping a look change - a formatter sorts the classes of a block's root

- **WHEN** a commit changes only the order of the classes in one class list
  in a block
- **THEN** the commit stops, naming the line before and after

### Requirement: A stop names every line it stops on

A stop is an instruction the person can answer without opening the diff.

**Grouped by file** - A stop SHALL group its lines by file and show, for each
line:

| Field | Shows |
| --- | --- |
| Before | The removed or dropped line |
| After | The line that replaced it in the same hunk, when there is one |
| Parent | For a merge, the parent that held the dropped line |
| Set by | Who last set the removed line, when, and in which commit, read at the commit's first parent |

**Ending** - A stop SHALL end with what to ask the person and, as its own
last paragraph, the exact line to add: `Design-Override: <what changes and
why>`.

**Refused** - A stop SHALL refuse the commit or the push it is met in.

<!-- trace:scenario id=g10.shared-design-override.SC-buk rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-10 - The stop shows before, after and who set it
**Serves:** Stopping a look change - the person asked reads the stop in place of the diff

- **GIVEN** a class line in a block last set by the designer in a known
  commit on a known date
- **WHEN** an engineer's commit rewrites that line
- **THEN** the stop shows the block's file, the removed line and the line that
  replaced it
- **AND** shows the designer's name, that date and that commit

<!-- trace:scenario id=g10.shared-design-override.SC-qc6 rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-11 - A line removed with nothing in its place
**Serves:** Stopping a look change - a motion line is deleted outright

- **WHEN** a commit removes a motion line and adds nothing in its hunk
- **THEN** the stop shows the removed line and who set it
- **AND** shows no line after it

<!-- trace:scenario id=g10.shared-design-override.SC-qla rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-12 - The stop ends with the line to add
**Serves:** Stopping a look change - the committer's agent relays the stop to its person

- **WHEN** a commit stops
- **THEN** the stop's second-to-last paragraph says what to ask the person
- **AND** its last paragraph is `Design-Override: <what changes and why>`
- **AND** the commit is refused

### Requirement: A merge that drops either side's work stops

A commit with two parents is read against its base and both parents, so a
pull that brings only the other side's own removals passes.

**Watched paths** - The merge rule SHALL read the store's watched paths in
the store, and the site page code in the application: the site frontends and
the site packages' `frontend` folders.

**Formatting** - A blank line, a lone bracket, or a change to whitespace
alone SHALL NOT count as a dropped line.

**Dropped** - A line one parent holds and the result drops SHALL stop the
merge, unless the base held it and another parent removed it. A merge of more than
two parents SHALL be read the same way.

**Outside the watched paths** - A line dropped outside the watched paths SHALL
NOT stop a merge.

**Merge rule only** - A merge SHALL NOT be read by the look rule.

<!-- trace:scenario id=g10.shared-design-override.SC-cy5 rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-13 - A merge that keeps an old copy stops
**Serves:** Stopping a lossy merge - `main` is merged into a branch that kept its older product card

- **GIVEN** `main` rewrote lines of a block after a branch left it, and the
  branch changed the same block
- **WHEN** a merge of `main` into the branch keeps the branch's version of
  those lines
- **THEN** the merge stops, naming each of `main`'s lines it dropped

<!-- trace:scenario id=g10.shared-design-override.SC-l3b rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-14 - A clean pull passes
**Serves:** Stopping a lossy merge - a branch pulls `main`, which removed look lines the branch never touched

- **GIVEN** `main` removed class lines from a block after a branch left it,
  and the branch did not touch them
- **WHEN** a merge of `main` into the branch keeps `main`'s removal
- **THEN** the merge passes without a stop

<!-- trace:scenario id=g10.shared-design-override.SC-7on rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-15 - A line both sides hold is removed by the merge
**Serves:** Stopping a lossy merge - a conflict is resolved by deleting a line neither side changed

- **GIVEN** a line in a block that the base and both parents hold
- **WHEN** the merge result leaves it out
- **THEN** the merge stops, naming that line

<!-- trace:scenario id=g10.shared-design-override.SC-re6 rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-16 - The designer's merge is held
**Serves:** Stopping a lossy merge - the designer resolves a pull on her own branch

- **GIVEN** the designer is the merge's author and committer
- **WHEN** the merge result drops a line the other parent added
- **THEN** the merge stops, naming that line

<!-- trace:scenario id=g10.shared-design-override.SC-8vy rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-17 - A merge in the application drops a site page's lines
**Serves:** Stopping a lossy merge - an engineer merges `main` into a site branch

- **GIVEN** `main` in the application added lines to a site page after a
  branch left it
- **WHEN** the merge result leaves those lines out
- **THEN** the merge stops, naming the page and the dropped lines

<!-- trace:scenario id=g10.shared-design-override.SC-vs0 rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-47 - A line dropped outside the watched paths passes
**Serves:** Stopping a lossy merge - a conflict in a manual page is resolved by taking one side

- **WHEN** a merge result drops a line the other parent added to a page under
  `docs/prds`
- **THEN** the merge passes without a stop

### Requirement: Site page code that rebuilds a store block is refused

The application's block check holds site page code to the store's blocks.
The admin frontends are not held.

**Site page code** - The site frontends and the site packages' `frontend`
folders.

**Block-shaped primitives** - Site page code SHALL NOT import these
design-system primitives:

| Primitive | Names held |
| --- | --- |
| Card | `card` |
| Dialog | `dialog`, `dialog-header` |
| Drawer | `drawer` |
| Tabs | `tabs` |
| Table | `table` and every name starting `table` |
| Stepper | `stepper` and every name starting `step` |
| List | `list` |
| Empty state | `empty-state` |
| Pagination | `pagination` and every name starting `pagination` |
| Breadcrumbs | every name starting `breadcrumb` |
| Radio card | `radio-card` |

A primitive outside this set SHALL NOT be refused.

**Styled-over blocks** - Site page code SHALL NOT give an element imported
from `@grade10/ui` a `className` anywhere inside its opening tag, a tag
spanning several lines included.

**Listed pages** - A page SHALL pass both rules, for every primitive and
every block it uses, only when the block check lists it with its reason.
Today's rebuilt pages, among them `AuctionWinnerOrderPage.tsx`,
`OrderDetailsPage.tsx` and `AccountAuctionRecordPage.tsx`, SHALL be
listed that way. A listing with an empty reason, or naming a page that no
longer exists or no longer rebuilds a block, SHALL fail the check.

**At commit and push** - The application's commit and push hooks SHALL run
the block check and refuse on a finding, as the application's checks on
`main` do.

<!-- trace:scenario id=g10.shared-design-override.SC-vhk rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-18 - A site page imports a dialog primitive
**Serves:** Refusing a rebuilt block - an engineer composes a dialog by hand on a site page

- **WHEN** a commit adds an import of the design system's `dialog` primitive
  to a site page that is not listed
- **THEN** the commit is refused, naming the page and the primitive

<!-- trace:scenario id=g10.shared-design-override.SC-4gl rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-19 - A store block given a class across lines
**Serves:** Refusing a rebuilt block - a site page restyles a shared block through its props

- **WHEN** a commit adds a `className` on the third line of a multi-line
  opening tag of an element imported from `@grade10/ui`, on a site page that
  is not listed
- **THEN** the commit is refused, naming the page and the element

<!-- trace:scenario id=g10.shared-design-override.SC-u2l rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-20 - A listed page passes
**Serves:** Refusing a rebuilt block - a page kept on purpose is edited

- **GIVEN** `AuctionWinnerOrderPage.tsx` is listed with its reason
- **WHEN** a commit edits the page's use of the `card` primitive
- **THEN** the commit passes the block check

<!-- trace:scenario id=g10.shared-design-override.SC-dmc rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-21 - A primitive outside the set passes
**Serves:** Refusing a rebuilt block - a site page lays out text and a button

- **WHEN** a commit adds imports of the `text` and `button` primitives to a
  site page
- **THEN** the commit passes the block check

<!-- trace:scenario id=g10.shared-design-override.SC-1xq rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-22 - The admin frontends are not held
**Serves:** Refusing a rebuilt block - an operator screen is built from primitives

- **WHEN** a commit adds an import of the `dialog` primitive to an admin
  frontend page
- **THEN** the commit passes the block check

<!-- trace:scenario id=g10.shared-design-override.SC-d4e rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-23 - The override line does not pass a rebuilt block
**Serves:** Refusing a rebuilt block - an agent tries the commit line where the page belongs on the list

- **WHEN** a commit that adds a `drawer` import to an unlisted site page ends
  with `Design-Override: keep the page's own drawer`
- **THEN** the commit is still refused

<!-- trace:scenario id=g10.shared-design-override.SC-auw rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-48 - A listing that outlived its page fails
**Serves:** Refusing a rebuilt block - a rebuilt page is moved onto the store's blocks and its listing is left behind

- **GIVEN** a page listed with its reason that no longer imports any
  block-shaped primitive nor styles a store block
- **WHEN** the block check runs
- **THEN** it fails, naming the listing to remove

### Requirement: A stopped commit passes on its person's word

The person the committer works for decides; nobody else stands between a
commit and `main`.

**The line** - A commit SHALL pass the look rule's and the merge rule's stops,
never the block check's, when its message's last paragraph carries a
`Design-Override:` trailer, its reason taken as written. One line SHALL cover
every stop in the commit.

**Empty reason** - A line whose reason is empty after trimming SHALL be
refused, and the commit SHALL stop as if it carried no line.

**Last paragraph** - A `Design-Override:` line anywhere but the message's
last paragraph SHALL NOT pass the commit. In that paragraph it MAY sit with
other trailers, such as `Co-authored-by:`, in any order.


<!-- trace:scenario id=g10.shared-design-override.SC-b5w rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-24 - The line passes every stop in a commit
**Serves:** Confirming an override - the person agrees to a padding change across two blocks

- **GIVEN** a commit that rewrites class lines in two blocks
- **WHEN** its message ends with a paragraph holding `Co-authored-by:` and
  then `Design-Override: tighter padding on both alerts, agreed with the
  designer`
- **THEN** the commit passes

<!-- trace:scenario id=g10.shared-design-override.SC-wrf rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-25 - An empty reason is refused
**Serves:** Confirming an override - an agent adds the line with nothing after it

- **WHEN** a commit that stops ends with the paragraph `Design-Override:`
  followed only by spaces
- **THEN** the commit stops, naming the same lines as with no line

<!-- trace:scenario id=g10.shared-design-override.SC-voi rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-26 - The line outside the last paragraph does not count
**Serves:** Confirming an override - the line is written in the message's body

- **WHEN** a commit that stops carries `Design-Override: <a reason>` in its
  first paragraph and another paragraph after it
- **THEN** the commit stops

### Requirement: Agents learn the rule before they work

The rule is written once in each repository's instructions, so an agent
meets it before its work is done.

**Instructions** - Each repository's `AGENTS.md` SHALL carry the rule under
the heading `Design Override`:

- **Agreed look** - implementation keeps it
- **Missing state or variant** - the designer's, never a local addition
- **A stop** - shown to the person; the `Design-Override:` line, or a listed
  page's reason, is written only on their yes
- **Skipping the check** - `--no-verify` is never used

**Linked, not restated** - The store's `workflow-build` and `fix-bug` skills
and the application's `frontend-structure` skill SHALL link that heading
rather than restate it.

<!-- trace:scenario id=g10.shared-design-override.SC-l1o rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-27 - The rule is in both repositories' instructions
**Serves:** Confirming an override - an agent reads its instructions before building a block or a page

- **WHEN** the store's and the application's `AGENTS.md` are read
- **THEN** each carries the heading `Design Override` with the four rules
- **AND** `workflow-build`, `fix-bug` and `frontend-structure` each link that
  heading and restate none of it

### Requirement: The designer's own commits are exempt from the look rule

The designer's commits set the agreed look, so the look rule does not hold
them.

**By e-mail** - A commit SHALL be exempt from the look rule when its author
e-mail, its committer e-mail or an e-mail on a `Co-authored-by:` line
matches, ignoring case, the e-mail of a handle holding the `design` role in
`docs/prds/team.yaml`.

**Unknown people** - An e-mail `team.yaml` does not hold SHALL NOT make a
commit exempt; a commit none of whose people `team.yaml` knows SHALL be held.

**Look rule only** - The exemption SHALL NOT pass the merge rule or a rebuilt
block.

**No designer** - When no handle holds the `design` role, no commit SHALL be
exempt.

<!-- trace:scenario id=g10.shared-design-override.SC-wss rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-28 - The designer as author
**Serves:** Exempting the designer - the designer polishes a block herself

- **WHEN** a commit authored with the designer's e-mail rewrites a class line
  in a block
- **THEN** the commit passes without a stop

<!-- trace:scenario id=g10.shared-design-override.SC-ab0 rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-29 - An agent authors, the designer commits
**Serves:** Exempting the designer - the designer's agent writes the commit and she makes it

- **WHEN** a commit authored as `Cursor Agent` and committed with the
  designer's e-mail rewrites a motion line in a block
- **THEN** the commit passes without a stop

<!-- trace:scenario id=g10.shared-design-override.SC-8ji rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-30 - The designer as co-author
**Serves:** Exempting the designer - an agent commits for her under its own name

- **GIVEN** a commit authored and committed as `Claude <noreply@anthropic.com>`
- **WHEN** its message carries a `Co-authored-by:` line with the designer's
  e-mail in capitals, and it rewrites a class line in a block
- **THEN** the commit passes without a stop

<!-- trace:scenario id=g10.shared-design-override.SC-akl rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-31 - An agent with no known person is held
**Serves:** Exempting the designer - an agent commits under a name nobody on the team holds

- **WHEN** a commit authored and committed as `Cursor Agent`, with no
  `Co-authored-by:` line, rewrites a class line in a block
- **THEN** the commit stops

### Requirement: The check runs at commit and again at push

One evaluation reads a commit's diff, its message and its people, and gives
the same answer at commit, at push and on `main`.

**At commit** - The commit-message hook SHALL check the staged change with the
message being written and the author and committer the commit will carry,
and, while a merge is in progress, SHALL read the commit as that merge.

**At push** - The pre-push hook SHALL check every commit each pushed ref would
send, from its parents, diff, message, author and committer, and SHALL refuse
the push on a stop. A rebased, cherry-picked or amended commit is checked
there before it leaves the machine.

**New branch** - A ref new to the remote SHALL be checked over the commits not
on any remote branch this clone knows.

**Deleted branch** - A ref being deleted SHALL be skipped.

**Cannot run** - When the check cannot read `team.yaml` or the history a
commit needs, it SHALL refuse the commit or the push and say what it could
not read.

<!-- trace:scenario id=g10.shared-design-override.SC-r0e rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-32 - The same answer at commit, push and main
**Serves:** Checking at commit and push - one commit is read at each of the three places

- **GIVEN** a commit that stops, and a commit that passes
- **WHEN** each is read at commit, at push and by the report on `main`
- **THEN** each place names the same stops for the first and none for the
  second

<!-- trace:scenario id=g10.shared-design-override.SC-0f1 rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-33 - A rebased commit is checked at push
**Serves:** Checking at commit and push - a branch is rebased, replaying commits without the commit hook

- **GIVEN** a commit that rewrites a class line in a block, replayed by a
  rebase with no commit hook run
- **WHEN** the branch is pushed
- **THEN** the push is refused, naming that commit and the line

<!-- trace:scenario id=g10.shared-design-override.SC-jct rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-34 - A merge is checked at commit
**Serves:** Checking at commit and push - a conflicted merge is concluded with a commit

- **GIVEN** a merge in progress whose result drops a line the other parent
  added to a block
- **WHEN** the merge is committed
- **THEN** the commit stops, naming that line

<!-- trace:scenario id=g10.shared-design-override.SC-pri rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-35 - A new branch is checked over its own commits
**Serves:** Checking at commit and push - a first push of a branch cut from `main`

- **GIVEN** the remote's `main` holds a commit that would stop
- **WHEN** a new branch from `main` adds one commit that passes and is pushed
- **THEN** the push passes

<!-- trace:scenario id=g10.shared-design-override.SC-zcy rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-36 - Deleting a branch checks nothing
**Serves:** Checking at commit and push - a finished branch is removed from the remote

- **GIVEN** a remote branch holding a commit that would stop
- **WHEN** a push deletes that branch
- **THEN** the push passes

<!-- trace:scenario id=g10.shared-design-override.SC-wgf rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-49 - The check refuses when it cannot read the team
**Serves:** Checking at commit and push - a clone whose `team.yaml` was removed

- **GIVEN** `docs/prds/team.yaml` cannot be read
- **WHEN** a commit rewrites a class line in a block
- **THEN** the commit is refused, naming the file it could not read

### Requirement: The hooks are set on install

Nobody sets the hooks by hand, and an application hook with no check to call
fails rather than passes.

**Store** - Installing the store SHALL set git's hooks path to `.githooks`,
which holds `commit-msg` and `pre-push`.

**Application** - Installing the application SHALL set its hooks path to its
`.githooks`, and the store's inside its `external/grade10-spec` submodule.

**Missing check** - When the check is missing under `external/grade10-spec`,
the application's hooks SHALL fail and name the command that fetches the
submodule.

<!-- trace:scenario id=g10.shared-design-override.SC-5gs rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-37 - Install sets the hooks everywhere
**Serves:** Checking at commit and push - a teammate installs a fresh clone of each repository

- **WHEN** `pnpm install` runs in a fresh clone of the store, and in a fresh
  clone of the application with its submodule
- **THEN** the store, the application and `external/grade10-spec` each have
  their hooks path set to their own `.githooks`

<!-- trace:scenario id=g10.shared-design-override.SC-v77 rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-38 - A commit inside the store submodule is checked
**Serves:** Checking at commit and push - an engineer edits a block from the application's copy of the store

- **WHEN** a commit made inside `external/grade10-spec` rewrites a class line
  in a block
- **THEN** the commit stops

<!-- trace:scenario id=g10.shared-design-override.SC-iv0 rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-39 - The application's hook with no check fails
**Serves:** Checking at commit and push - a clone whose submodule was never fetched

- **GIVEN** the application with nothing under `external/grade10-spec`
- **WHEN** a commit is made in the application
- **THEN** the commit is refused
- **AND** the message names the command that fetches the submodule

### Requirement: The designer is told on main

`main` never blocks and never reverts; it tells the designer.

**Read** - On every push to `main`, in each repository, the report SHALL read
every commit the push brought with the same evaluation as the hooks.

**Told** - The report SHALL post a comment on each commit that stops,
whether or not it carries a `Design-Override:` line, mentioning every handle
holding the `design` role and listing the lines.

**Not told** - A commit that stops on nothing, an exempt commit and one
carrying the line included, SHALL NOT get a comment.

**Once** - Each comment SHALL carry the marker `<!-- design-override -->`,
and a commit that already carries one SHALL be skipped.

**New branch** - A push that creates the branch SHALL read only its last
commit, against that commit's first parent.

**Failure** - A comment that cannot be posted SHALL fail the job.

**Never reverted** - The report SHALL NOT revert a commit or block `main`.

<!-- trace:scenario id=g10.shared-design-override.SC-kwf rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-40 - An override reaching main is told
**Serves:** Telling the designer - a confirmed override is pushed to `main`

- **WHEN** a commit that stops, whose message ends with a `Design-Override:`
  line, reaches `main`
- **THEN** a comment on that commit mentions every `design` handle and lists
  the lines it changed

<!-- trace:scenario id=g10.shared-design-override.SC-0l1 rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-41 - A commit that skipped the check is told
**Serves:** Telling the designer - a commit is pushed with the hooks skipped

- **WHEN** a commit that stops, with no `Design-Override:` line, reaches `main`
- **THEN** a comment on that commit mentions every `design` handle and lists
  the lines it stops on
- **AND** the commit stays on `main`

<!-- trace:scenario id=g10.shared-design-override.SC-0kk rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-42 - A passing or exempt commit is not told
**Serves:** Telling the designer - an ordinary push and the designer's own push

- **WHEN** a commit that stops on nothing, a commit exempt as the
  designer's, and a commit carrying the line that stops on nothing reach
  `main`
- **THEN** none gets a comment

<!-- trace:scenario id=g10.shared-design-override.SC-yua rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-43 - A re-run posts nothing twice
**Serves:** Telling the designer - the report job is run again for the same push

- **GIVEN** a commit that already carries a comment with the marker
  `<!-- design-override -->`
- **WHEN** the report runs again over the same push
- **THEN** no second comment is posted on it

<!-- trace:scenario id=g10.shared-design-override.SC-3wm rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-44 - A comment that cannot be posted fails the job
**Serves:** Telling the designer - the job is refused permission to comment

- **WHEN** posting a comment on a commit that must be told fails
- **THEN** the report job fails

<!-- trace:scenario id=g10.shared-design-override.SC-qzc rev=1 -->
#### Scenario: shared-design-sync-design-override-SC-45 - A push that creates the branch
**Serves:** Telling the designer - the first push to a new `main`

- **GIVEN** a push that creates `main`, so no earlier commit is known
- **WHEN** the report runs
- **THEN** it reads only the pushed commit, against its first parent
