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
| Q8 | How does a page rebuild a block on purpose? | Listed with its reason in the application's layer check, which the hook runs - decided by the round | The `Design-Override` line: the page keeps rebuilding the block after that commit, so the reason belongs with the page |
| Q9 | Both repositories now, or the store first? | Both at once | The store first: the author wants the application's rebuilt pages covered too |
| Q10 | How is the designer told? | A mention of her GitHub handle on the commit - decided by the round | Slack: `team.yaml` holds no Slack member id for anyone yet |
| Q11 | Where do agents learn the rule? | Once in each repository's `AGENTS.md`, named by the build, bug-fix and frontend skills - decided by the round | Only the check's message: an agent meets it after the work is done |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
