## Goals

- A commit that would change the agreed look stops until its person confirms
- An agent never confirms an override on its own
- The designer learns of every override that reaches `main`
- Site pages use the store's blocks rather than rebuilding them

## Non-Goals

- An approval step, or anyone but the committer's person, standing between a
  commit and `main`
- Pull requests, branch protection or required reviews
- Screenshot comparison of stories
- The admin frontends
- Reverting a commit on `main`

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Where is the guard enforced? | At commit and at push, on the committer's machine; `main` only reports | Branch protection and review: the team is moving to direct pushes. A red `main` with a pin gate: later than the author wants |
| Q2 | What lets a stopped commit through? | `Design-Override: <what changes and why>` in the message, after the agent's person confirms | The designer approving: a bottleneck, and the author wants no block |
| Q3 | What is the agreed look? | What `main` holds in the store's blocks, primitives, preview pages and tokens - decided by the round | The lines the designer wrote: history cannot say who, with about 90 UI commits in September authored as `Cursor Agent` |
| Q4 | Which lines stop a commit? | A removed or rewritten line setting a class, a variant, spacing, a motion value or a story title, and a removed or changed token - decided by the round | Any removed line in those paths: 216 of 256 non-designer commits in September would stop, and a stop that always fires gets confirmed without reading. The look lines alone stop 107, about 5 a day across the team |
| Q5 | Who is exempt? | The `design` role in `team.yaml`, by author, committer or `Co-authored-by` e-mail; a commit whose people `team.yaml` does not know is never exempt - decided by the round | The committer alone: agents commit as `Claude <noreply@anthropic.com>` for a person, and the designer's Cursor agents commit as `Cursor Agent` |
| Q6 | Is a merge exempt for the designer? | No - a merge that drops either side's work stops for everyone - decided by the round | The role exemption: the designer's `Merge branch 'main' into sync-product-list` (`c865b8565`) dropped 45 of an engineer's lines, which #33 put right |
| Q7 | Which application code is held, and on what? | Site page code, on a card, dialog, drawer, tabs, table, stepper, list, empty state, pagination, breadcrumbs or radio card from the design system, and on a `className` given to a store block; admin is not held - decided by the round | Any primitive outside `layout/`: 89 of 265 site files use `Text` or `Button`, and 50 September commits added one. The block-shaped set is added by 24, about 1 a day, and names the pages that drifted |
| Q8 | How does a page rebuild a block on purpose? | Listed with its reason in the application's block check, which the hooks run - decided by the round | The `Design-Override` line: the page keeps rebuilding the block after that commit, so the reason belongs with the page |
| Q9 | Both repositories now, or the store first? | Both at once | The store first: the author wants the application's rebuilt pages covered too |
| Q10 | How is the designer told? | A mention of her GitHub handle on the commit - decided by the round | Slack: `team.yaml` holds no Slack member id for anyone yet |
| Q11 | Where do agents learn the rule? | Once in each repository's `AGENTS.md`, named by the build, bug-fix and frontend skills - decided by the round | Only the check's message: an agent meets it after the work is done |
| Q12 | Where may the `Design-Override:` line sit, and what reason passes? | In the message's last paragraph, beside other trailers in any order; any reason not empty after trimming - decided by the round | Its own paragraph: agents end every message with `Co-authored-by:`, so a separate paragraph would be refused as not last |
| Q13 | Which commits on `main` are reported? | Only a commit that stops, with or without the line; a commit carrying the line that stops on nothing is not - decided by the round | Every commit carrying the line: a line written out of caution would mention the designer on nothing |
| Q14 | What counts as formatting? | Whitespace alone; a reordered class list, and a line moved out of the watched paths, change the look; a line added back at a new indent passes - decided by the round | Any reordering of classes: order sets which class wins in Tailwind merges, so a sort can change the look |
| Q15 | What is a commit judged against? | Its first parent, never `main`; undoing an unpushed look change stops too - decided by the round | `main`: the answer would change as `main` moves, and commit, push and report would disagree |
| Q16 | How far does a page's listing reach, and when does it lapse? | The whole page, for both block rules; a listing with an empty reason, or naming a page that is gone or rebuilds nothing, fails the check - decided by the round | Per primitive: a longer list for no gain, since the reason is about the page |
| Q17 | Does the designer's exemption pass a rebuilt block? | No; that rule runs at commit, at push and in the application's checks on `main` - decided by the round | Exempt her too: the rule is about the page's code, not the look she sets, and a listed reason stays with the page |
| Q18 | What happens when the check cannot read what it needs? | It refuses the commit or the push, saying what it could not read - decided by the round | Passing quietly: a broken clone would lose the guard with nobody told |
| Q19 | What if `team.yaml` holds no designer, or several? | None: nobody is exempt and nobody is mentioned. Several: all are exempt and all are mentioned - decided by the round | Refusing to run without a designer: the check still has value as a stop |
| Q20 | Where does the report run? | On `main` in both repositories - decided by the round | The store only: the application's merge rule would then never be reported |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| shared/design-sync/design-override | Blind pass: May the override line share its paragraph with `Co-authored-by:`, and does any reason pass? | Q12 |
| shared/design-sync/design-override | Blind pass: Is a commit carrying the line reported on `main` when it stops on nothing? | Q13 |
| shared/design-sync/design-override | Blind pass: Is a reordered class list formatting? Is a block moved out of the watched paths a removal? | Q14 |
| shared/design-sync/design-override | Blind pass: Is a commit judged against its parent or against `main`? | Q15 |
| shared/design-sync/design-override | Blind pass: Does a listed page pass for every primitive, and what fails a listing? | Q16 |
| shared/design-sync/design-override | Blind pass: Does the designer's exemption pass a rebuilt block, and does that rule run at push? | Q17 |
| shared/design-sync/design-override | Blind pass: What does the check do when `team.yaml` or history cannot be read? | Q18 |
| shared/design-sync/design-override | Blind pass: Who is exempt and mentioned with no designer, or several? | Q19 |
| shared/design-sync/design-override | Blind pass: Does the report run in the application too? | Q20 |
| shared/design-sync/design-override | Blind pass: Is an agent committing as `Cursor Agent` for the designer exempt? | Q5 |
| shared/design-sync/design-override | Blind pass: Can the override line pass a rebuilt block? | Q8 |
