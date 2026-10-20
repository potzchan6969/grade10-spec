# Page First

The product page is the only spec. A feature is a change to its page, built
straight from it, proved by tests that cite the page's ids. Nothing else
restates it.

## What Exists

| Thing | Where | Holds | Owner |
| --- | --- | --- | --- |
| **Page** | `docs/prds/products/<product>/<domain>/<page>.md` | The job and no-gos, a values table, flows in the order a person meets them, `## Always`, `## Later`, worked examples, marks, the Product decisions block, the `Code map` | Product manager keeps it whole; anyone lands a detail they learn |
| **Tests** | The application repository; stories for a block | The proof. Each cites `<page>#<id>` in its title | Engineer or agent |
| **Cases** | `docs/cases/<product>/<domain>/<page>.md` | Only cases no page example walks: abuse, boundaries, another tab, a slow or failed answer, a record in flight at launch, a walk by hand | QA |
| **Stories** | `apps/preview`, `packages/ui` | What a screen or state looks like, cited with `::story` under its line | Designer |

Engineering notes - how a rule is enforced, a migration, a cutover and its
rollback - live in the application repository's `docs/architecture/`, linked
from the page's `Code map` detail. They never restate a rule.

## The Page

- **Job and no-gos** - the Product decisions block: who it is for, what it is
  for, what it will never do, what will be measured
- **Values** - a `## Rules` table; each number is named once and carries its
  worked value: **$139** at **1.2×** = **15 points**
- **Flows** - one `## ` section per flow, in the order a person meets them
- **`## Always`** - what holds whatever the flow: one account per person, a
  link used once, the server's clock, a tab that follows another. An edge
  case that would hurt a person or the business if it broke is an Always
  rule, not a Later one
- **`## Later`** - parked enhancements, each with why it waits. Nothing in it
  is built or tested
- **One home per fact** - a rule another page needs is linked as
  `page#id`, never restated

## Ids

Every rule a test should prove carries an explicit id at the end of its
line, bullet or table row: `{#earn-once}`. Examples and flows keep their
`id="refund-shipping"` attribute. The manual hides the id and makes it the
line's anchor.

```markdown
- **Earned once** - an order earns the first time it completes, and never
  again {#earn-once}
```

- **Form** - kebab-case, unique across the page, its examples and its cases
  file
- **Cited** - as `<page>#<id>` in the test's title, for example
  `grade10-site/loyalty/points#earn-once`
- **Never reused** - an id names one promise. Change what an unmarked rule
  promises and it takes a new id; a copy fix keeps it. `pnpm pages:check`
  warns on unmarked rule text that changed under the same id, and on an id
  that vanished while a test may still cite it

## Marks

| Mark | Means | Taken off when |
| --- | --- | --- |
| **🚧** | Decided, not yet live in production | A release carries it and every id on the line passes |
| **❓** or `TBC` | Nobody has decided | It is decided: the line is rewritten flat, or a decisions row records it |

- **Unmarked** - runs in production. Where the running product and an
  unmarked line disagree, either is a bug: fix the code or the page, and say
  which in the commit
- **Assumed** - `❓ Assumed: <what we build on>` lets the build go on before
  the answer, except on money, security and `## Always` rules
- **Design** - not a mark. The board lists each 🚧 line with the story under
  it or `none`; the designer reads the `none` lines

## Cases

A cases file holds only what no page example walks, in the page's own
sections. It never restates a page value: a row that only repeats the
Rounding row is deleted.

```markdown
---
page: grade10-site/loyalty/points
reviewed: TBC
---

## Always

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| earn-twice-race | an order completing in two deliveries at once | both land | one earn | smoke |
```

- **Tags** - optional: `smoke`, `manual` for a walk by hand
- **Automated** - worked out, never typed: `pnpm pages:cases <prefix>
  --cited <app-dir>`
- **Reviewed** - QA's sign-off on the whole file, a date and a handle; `TBC`
  until then

## Open Work

Work a 🚧 line waits on that no code or test closes - an enrolment, a
credential, a production gate, a walk on staging by hand - is a checklist in
one collapsed block at the foot of the page, one item per task, naming its
blocker and who acts.

```markdown
:::detail{title="Open work" for="engineer"}
- [ ] **Apple enrolment** - the Developer Program in the organisation's name; blocked on the account - operations
:::
```

An item done is deleted in the push that takes the 🚧 off its line. Read
them with `pnpm pages:board [prefix] --work`.

## The Work

1. **Mark the page** - one 🚧 line per outcome with its id, ❓ on what is
   open, a decisions row for a choice a reader would reopen. Use the
   `prd-authoring` skill. One product decision per push.
2. **Read it fresh** - before a build, a fresh agent reads the touched
   sections alone and asks what they leave out. Its answers become tests or
   cases rows; its gaps become ❓ lines. Use the `page-cases` skill.
3. **Design** - a designer takes the `none` lines of
   `pnpm pages:board --design` and draws the story with the
   `storybook-workbench` skill.
4. **Build** - an engineer or an agent takes `pnpm pages:board --build` and
   builds each 🚧 line with the `page-build` skill: tests titled with the
   ids first, then code.
5. **Release** - once a release carries a 🚧 line and its ids pass, the 🚧
   comes off in its own push here.
6. **Run** - QA prints a run sheet with
   `pnpm pages:cases <prefix> --cited <app-dir> --tsv` and walks the rows
   that print `no`.

Launch is a page with no 🚧 and no ❓ left in its flows and `## Always`.

## Checks

| Check | Where | Refuses |
| --- | --- | --- |
| `pnpm pages:check` | Here, on push | A malformed id, an id used twice on a page, a cases row with no Then, a cases file with no page |
| `pnpm pages:check` | Here, on push | Warns: an id that vanished, an unmarked rule whose text changed under the same id |
| `pnpm check:manual` | Here, on push | A page that does not parse, a broken link or story |
| `pages.mjs gate <app-dir>` | The application's CI, over the pinned submodule | A test citing an id no page holds; an `## Always` id no running test cites, less a shrinking allowlist |
| `pnpm pages:check` | Here, on push | An `openspec/retired.tsv` row or `retired-changes.tsv` page that names what no page holds |

## OpenSpec

`openspec/` is frozen. No new change opens there. A change already open
runs its legacy round, or is folded into its page and closed; the board
prints `Open OpenSpec change` under each page one names.

- **Retired ids** - `openspec/retired.tsv` maps each retired scenario and
  case id to the page id that now holds it, or `dropped:` and why.
  `pnpm run trace validate` lists a test still citing one as retired, not
  broken, and names the id to cite
- **Retired changes** - `openspec/retired-changes.tsv` names the pages each
  folded change now lives on; `retired-tasks.tsv` names the 🚧 line or Open
  work item each unticked task became. The planning and workflow skills carry on there when given
  its name
- **Adopting the gate** - `pages.mjs gate <app-dir> --seed > allow.txt`
  writes the first allowlist: every `## Always` id no test cites yet. It
  only shrinks

The durable specs stay readable until each capability's page carries what
the spec holds; that capability's spec, journeys and suites are then removed
in one push, its ids land in `openspec/retired.tsv`, and the application's
citations of scenario ids move to page ids in the same sweep.
