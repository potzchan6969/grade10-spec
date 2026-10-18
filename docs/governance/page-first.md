# Page First

The product page is the one source of truth. A feature is a change to its
page, built straight from it, proved by the cases the page names. Nothing
else restates it.

## The Three Files

| File | Holds | Owner |
| --- | --- | --- |
| **Page** - `docs/prds/products/<product>/<domain>/<page>.md` | Rules, flows, examples, marks, the Product decisions block | Product manager keeps it whole; anyone lands a detail they learn |
| **Cases** - `docs/cases/<product>/<domain>/<page>.md` | One table row per case the page's examples do not already walk | QA |
| **Stories** - `apps/preview`, `packages/ui` | What a screen or state looks like | Designer |

Engineering notes - architecture, migrations, how a rule is enforced - live in
the application repository's `docs/architecture/`, linked from the page's
`Code map` detail. They never restate a rule.

## Marks

A mark leads its line, bullet or cell. The board reads them:
`pnpm pages:board [prefix]`.

| Mark | Means | Taken off when |
| --- | --- | --- |
| **🚧** | Decided and being built | The build lands and its cases pass |
| **❓** or `TBC` | Nobody has decided | It is decided: the line is rewritten flat, or a Product decisions row records it |
| **🎨** | A screen or state needs a design | A `::story` or `::figma` sits under the line |

An unmarked line runs today. Where the running product and an unmarked line
disagree, either is a bug: fix the code, or fix the page, then say which in
the commit.

## Cases

**On the page** - an `:::example` or a `:::flow` with an `id` is a case:
`:::example{title="Shipping refunded" id="refund-shipping" tier="Gold"}`. The
manual does not show the id. Prefer an example when a ledger, a timeline or a
payload makes the rule obvious to a reader.

**In the cases file** - everything else: negative paths, edge cases, one row
per rule an example does not walk. Sections follow the page's `## ` headings.

```markdown
---
page: grade10-site/loyalty/points
reviewed: 2026-10-18 @qa-handle
---

## Rules

| Id | Given | When | Then | Tags |
| --- | --- | --- | --- | --- |
| earn-rounding | a Gold member | an order of $139 completes | 15 points | smoke |
```

- **Id** - kebab-case, unique across the page and its cases file
- **Cited** - as `<page>#<id>`, for example
  `grade10-site/loyalty/points#earn-rounding`, in the test's name or a comment
  beside it
- **Tags** - optional: `smoke`, `manual`, `building` for a 🚧 line
- **Automated** - worked out, never typed: a case is automated when an
  application test cites it - `pnpm pages:cases <prefix> --cited <app-dir>`
- **Reviewed** - QA's sign-off on the whole file, a date and a handle; `TBC`
  until then

A rule that holds a number holds a worked value. **$139** at **1.2×** =
**15** is a case already; a cases row repeats it only to tag it.

## Open Work

Work a 🚧 line waits on that no code or test closes - an enrolment, a
credential, a bucket, a production gate, a walk on staging by hand - is a
checklist in one collapsed block at the foot of the page, one item per
task, naming what blocks it and who acts.

```markdown
:::detail{title="Open work" for="engineer"}
- [ ] **Apple enrolment** - the Developer Program in the organisation's name; blocked on the account - operations
- [ ] **Walk on staging** - save a pass on each wallet on a real phone and be identified at the counter - QA
:::
```

- **Not here** - code to write (the 🚧 line and its cases say it), a check
  to run, a test to link, a submodule to bump, artwork to draw (a 🎨 line)
- **Ticked, then gone** - an item done is deleted in the push that takes the
  🚧 off its line; the history is git's
- **Read** - `pnpm pages:board [prefix] --work`

## The Work

1. **Mark the page** - one 🚧 line per outcome, ❓ on what is open, 🎨 on what
   needs a design. Use the `prd-authoring` skill. One product decision per push.
2. **Design** - a designer takes `pnpm pages:board --design`, draws the
   story with the `storybook-workbench` skill, and swaps the 🎨 for the
   `::story` line.
3. **Cases** - QA adds the rows the change needs with the `page-cases` skill,
   from the page alone.
4. **Build** - an engineer or an agent takes `pnpm pages:board --build`,
   builds each 🚧 line with the `page-build` skill, and writes tests that cite
   the cases.
5. **Land** - the build takes its 🚧 marks off in the same push as the code
   that delivers them, here or with the application's submodule bump.
6. **Run** - QA prints a run sheet with
   `pnpm pages:cases <prefix> --cited <app-dir> --tsv` and walks the rows
   that print `no`.

## Checks

| Check | Refuses |
| --- | --- |
| `pnpm pages:check` | A case id that is not kebab-case or is used twice on a page, a cases row with no Then, a cases file with no page |
| `pnpm check:manual` | A page that does not parse, a broken link or story, a page that is not canonical |

`pnpm push:main` runs both on what it sends.

## OpenSpec

`openspec/` is frozen. No new change opens there. A change already open may
finish under its own skills, or be folded into its page and archived. The
durable specs stay readable until each capability's page and cases file
carry what the spec holds; that capability's spec, journeys and suites are
then removed in one push. The application repository's citations of
scenario ids move to case ids in the same sweep.
