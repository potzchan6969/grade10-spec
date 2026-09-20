# Grade10 Manual

A product manual for the whole platform, served as a web app. PM, designers,
QA, and engineers read the same pages: human-first prose up top, specs,
in-flight changes, and visuals embedded as blocks. Pages are editable in the
browser when the manual is running locally, and every edit lands in git,
because git is the only state this app has. The hosted deployment is
always a plain static build — read-only, nothing more.

The app never restates a fact that lives elsewhere. Requirements come from
`openspec/specs`, progress from `tasks.md` checkboxes, visuals from Figma,
Storybook, and images in the manual's `assets/`. Manual pages add the
narrative that connects them — and a capability's page is its PRD, which is
why the store keeps the manual under `docs/prds/`.

## Roots

The viewer reads from two directories, resolved once at startup
(`src/store/roots.mts`). The **content root** holds the manual — a
directory with `manual.yaml` and the pages beside it, `docs/prds` unless
`MANUAL_DIR` names another (a relative path inside the repository). The
**store root** holds the OpenSpec store — `openspec/specs`,
`openspec/changes`, and `docs/references`. In this repository they are the
same directory and everything behaves as one tree.

Any repository can mount the viewer (it ships in this repo's
`tools/manual`, and this repo ships as a submodule) and bring its own
manual, wherever it keeps it — an engineering manual has no business under
`docs/prds`, so the application repository sets `MANUAL_DIR=manual`. The
content root is found where the command ran — `MANUAL_ROOT`, else the
nearest `<MANUAL_DIR>/manual.yaml` above `INIT_CWD` or the working
directory. The resolved directory rides the snapshot as `manualDir`, so
the app builds every page path from it and names it nowhere. The store is the content repository itself when it carries
`openspec/specs`; otherwise the repository's `openspec/config.yaml` names a
store id and the `openspec` CLI resolves it through the same per-machine
registry `pnpm plan` uses — the registered clone at its own main, never a
pinned submodule. `MANUAL_STORE` overrides that resolution.

What follows from a split: nav taxonomy comes only from what the manual
lists (discovery of unlisted store products is the store repo's own
affordance), page and asset writes land in the content repository, a
proposal still lands in the store's `openspec/changes/`, git history and
commit info merge from both clones, and the checker holds the manual's own
pages to every page rule while leaving store coverage to the store's own
repository (see Checks).

## Content

Pages live at the content root under the manual's directory:

```
docs/prds/
  manual.yaml                 ordering, extra products, external base URLs
  assets/                     images referenced by ::image blocks
  index.md                    home page prose
  products/<product>/index.md          product landing
  products/<product>/<capability>.md   capability page
  platform/<topic>.md                  cross-cutting topics
  guides/<slug>.md                     how-we-work tutorials, personas' start-here paths
```

Disk shape decides taxonomy, `manual.yaml` only orders: a directory under
`openspec/specs` holding `spec.md` directly is a Platform topic; a directory
of capability directories is a Product. `manual.yaml` may add page-only
products (vault) that have no specs yet.

`groups:` and `platform:` take the same two forms — an ordered mapping of
title → ids, or a list of `{ title, products }` / `{ title, topics }` — so
products and topics both carry named nav groups. A bare list of topic ids
still parses, as one group called Cross-cutting; an id listed twice fails
the read, whichever group it sits in.

Guides open with `how-this-manual-works` — what the store is, the loop from
proposal to shipped truth, and how to work with an agent. Content pages carry
no meta prose about reading the manual; that page holds it, and the home
page's first-visit card is its one door.

A page is YAML frontmatter plus a sequence of blocks. Frontmatter fields, in
canonical order: `title` (required), `summary`, `spec` (the spec id this
page documents — `product/capability`, or a bare topic id for platform
pages), `icon` (the glyph beside the title, one name from the vocabulary in
`src/content/icons.ts`), `audience` (`operator` files the page under the
derived Admin group), `order` (nav sort). Any other key is a parse error — the
editor must never silently drop data on save. So is an icon name the
vocabulary does not hold: a typo is a refused page, never a blank row.

### Block grammar

Everything between directives is a `prose` block (GitHub markdown; headings
start at `##`; raw HTML is never rendered). Directives sit at column 0:

- Leaf: `::name{attr="value" attr2="value2"}` on one line.
- Container: `:::name{...}` opens, a bare `:::` closes, body is markdown
  plus optionally LEAF directives — one level, containers never nest.

| Block | Form | Renders |
| --- | --- | --- |
| `spec` | `::spec{id="grade10-store/loyalty"}` | every requirement of that spec as expandable rows |
| `spec` | `::spec{id="…" requirement="…"}` | one requirement with its scenarios; also `scenario="grade10-site-loyalty-programme-SC-04"` or `story="grade10-site-loyalty-programme-US-01"` selectors — prefer these, the ids are permanent |
| `cases` | `::cases{id="grade10-store/loyalty"}` | the capability's test-case suite with coverage against its scenarios |
| `changes` | `::changes{spec="grade10-store/loyalty"}` | ribbon of in-flight changes whose deltas touch that spec: status first, then tasks done/total, owners, last-moved age, link |
| `next` | `::next{spec="grade10-store/loyalty"}` | the `## Follow-on changes` bullets of every change about that spec — one whose delta touches it, one whose `## References` cite it, in flight and archived alike — each run of bullets under the change that wrote it and dated by it, live intent first and shipped newest-first behind it; the archive rides its own artifact, so the shipped ones fill in after the page paints |
| `figma` | `::figma{url="…" title="…" set="…"}` | titled card, embed loads on click, open-in-Figma link, design-sync verdict; optional `set` names the component set an assembly frame is about, validated against the report |
| `story` | `::story{id="blocks-store-cart--default" title="…" height="480"}` | titled card, workbench Storybook iframe loads eagerly |
| `image` | `::image{src="assets/…" alt="…" caption="…"}` | image from `manual/assets/`; missing `alt` is a parse error |
| `children` | `::children` | cards for the child pages of this directory, from their frontmatter |
| `callout` | `:::callout{kind="note"}` … `:::` | kinds: `note`, `decision`, `warning`; a `warning` shows a signature — `author`/`date` when written in, else who last changed it and when, derived from git at build |
| `detail` | `:::detail{for="engineer" title="…"}` … `:::` | collapsed-but-present depth for one audience; searchable, deep-linkable, never hidden from the DOM |
| `flow` | `:::flow{title="Checkout" case="Normal" diagram="assets/…"}` … `:::` | steps read top to bottom, all open; `##` starts a step, `#` groups the steps under it into a phase, and numbering runs straight through; optional SVG drawn at one and a half times its own size — the same magnification whatever the chart's size, centred where that is narrower than the strip — in a strip that pans under the mouse or a swipe, never a scrollbar, holding still while the mouse rests on the box at either end; `pnpm diagrams` pulls each lane band back to the drawing inside it, so a chart with room to spare never pans past its own last node; with one on screen the steps fold behind their count, a part under the mouse lights and tells its step on a card, a click on one opens the list at that step, and a deep link to a step opens it too; a pointed-at row lights its `data-step` elements and the strip pans to show them; neighbouring flows under one title are one flow's cases, picked from a dropdown beside the title, each with its own steps and drawing and its own step ids, and a deep link into any case shows it; `check:manual` refuses a lone flow that names a case, a run where one names none or two name the same, and two same-titled flows sitting apart |
| `example` | `:::example{title="Refund in two parts" tier="Gold" shipping="$30"}` … `:::` | one worked case: the body opens with the cart as a list (`- Gengar single $139`), then a `Step \| Event \| Points \| Balance` table — or `When \| …` for a timeline, days written `2026/01/03` that never run backwards, a blank day sharing the one above — points signed, balance running; an optional `Progress` column carries a second running figure the rows state — a window's total, a term's count — and a last `Period` column names what a run of days is inside — a term, a window — blank to stay in the one above and `—` to close it, drawn as a labelled rail down the left of a timeline, coloured by the block's `periods="Gold=gold"` and blank where a period is named no colour, and refused on a steps ledger; prose after the table is the why; neighbouring examples gather under one `Examples` toggle, open on arrival; `tier` badges the member, `shipping` is the fee on the order; `check:manual` refuses a cart line without a price and a balance the points do not reach |

Unknown directives are a parse error, not a silent pass-through.

Prose may carry inline references: `[[grade10-site-loyalty-programme-SC-23]]` renders the current
title of the scenario, story, or test case it names as a deep link, so a
renamed heading can never orphan the prose that cites it. A bare id
resolves inside the page's own `spec:`; one that could mean two things
must qualify as `[[spec-id#item-id]]`; `[[product/capability]]` links the
capability page. The grammar never sees these — prose stays verbatim —
and `src/content/refs.ts` is the one resolver render and check share. An
unresolvable or ambiguous reference renders as a marked dead link and
draws a check warning, the same rule every other prose pointer has. The
check scans prose with the grammar's fence tracking and skips inline
code; the editor's picker inserts ids so nobody hand-types them.

Grammar edge rules (each has a test):

- Attribute values are double-quoted; a `"` inside a value is a parse error,
  and block forms reject it on input.
- The scanner tracks fenced code blocks; `::` or `:::` inside a fence is
  text.
- Serialize omits defaults (`order` when unset, `height` when default).
- Parse trims leading/trailing blank lines of prose (never trailing
  spaces); an all-whitespace prose block between directives is dropped.
- A page with a `spec` frontmatter field renders its `changes` ribbon and
  archived-changes timeline automatically; it only authors `::changes` to
  show another spec's.

A capability page keeps one shelf order, so every role finds theirs in
the same place on every page: what it is → how it looks (figma, stories)
→ the contract (spec blocks) → acceptance (cases) → in flight → history.
The editor scaffolds a new capability page with that skeleton; a page
with a `spec` but no `cases` block draws a warning, never a failure.
User journeys stay in each capability's `user-journeys.md` — derivative
of the page's own content, so the page never re-embeds them.

### Canonical form

`src/content/grammar.ts` owns `parsePage` and `serializePage`, pure and
isomorphic. Round-trip laws, enforced by tests and `check:manual`:

- `serializePage(parsePage(text))` is the canonical text; committed pages
  must already be canonical.
- `parsePage(serializePage(ast))` equals the ast, for any ast that came
  from `parsePage` — the editor proves a hand-built draft round-trips
  before offering it to a store.

Canonical form: frontmatter keys in declared order; one blank line between
blocks; directives exactly as the grammar prints them, attributes in the
block's declared order; prose kept verbatim inside its trimmed bounds.

## Data

The builder emits static artifacts, all pure functions of git state:

- `/api/snapshot` — boots the app: `generatedAt`, `storeHead`, `config`
  (manual.yaml + derived taxonomy), `pages: [{ path, source, lastCommit }]`,
  `specs`, `changes` (in-flight only), `history`.
- `/api/archive` — archived changes, fetched only by planning/timeline
  views, so years of archive never block first paint.
- `/api/change/<id>` — one in-flight change's files, fetched only by its
  page (Change document, below), so the snapshot stays the size of the
  board.
- `/api/reference/<slug>` — one document from the store's `docs/references/`,
  as written, fetched only by its page; the snapshot lists them without
  their text, so the boot payload does not grow with the evidence file.
- `public/fixture-snapshot.json` — what the shell falls back to where
  nothing serves `/api/snapshot`, and what `?fixture` forces. Generated by
  `pnpm fixture` from `demo-store/` through the same readers the real store
  gets, so a shape the readers have moved past cannot reach the shell as a
  crash; `test/fixture-snapshot.test.ts` holds the committed file to that
  reading.

Search needs no artifact: the client builds a minisearch index lazily over
the snapshot on first use; the archive is searched only where it is already
loaded. The index covers pages (design-card titles included), specs,
test cases, and in-flight delta text — the work that exists only as a
delta is findable, deep-linked to the board. Multi-word queries demand
every word; when only some match, the palette says so instead of
pretending.

Spec entry shape:

```
{ id, title, purpose, featureSet?, featureGroups?, lastCommit,
  requirements: [{ name, text,
    scenarios: [{ id?, name, text, serves? }] }],   serves: the anchor
  journeys?:  [{ id, title, text }],                names no scenario
  testCases?: [{ id, title, traces: [anchor], status }],
  testCasesStatus?,
  testCaseCitations?: [{ id, title }],   the suite's **Covers:** quotes
  outOfSuite?: [scenarioId],             deliberately uncovered, named
  issuedThrough?: { sc?, us?, tc? } }
```

Test cases follow `docs/governance/specs-to-test-cases.md`: a case is
`draft`, `actual`, or `deprecated`, the suite file `pending-review` or
`approved`, and the cases block renders both — a draft must never wear an
approved suite's authority, and the check now enforces that instead of
asserting it. `issuedThrough` is the highest permanent id per kind,
counted over durable text, every in-flight delta, and the archive —
keyed by the id token, so two capabilities sharing a prefix (both
`navigation`s) share one ceiling, which is the only answer that stops a
new id colliding.

The snapshot also carries `assets` (every file under the manual's `assets/`),
`references` (the store's `docs/references/*.md` — slug, path, title and
last commit — with the README's text beside them as `referencesReadme`),
`warnings` (the `check:manual` warnings of the build that produced it —
failures never deploy, so warnings are all it can carry — plus a
build-time `design` rule folded from the design-sync report: each
drifting set with its message, each report key no card shows, and a
report more than eight days old), and optionally `designSync`, the
nightly report itself: `generatedAt`, the Figma `file` key, `sets`
(verdict per component set), `nodes` (node id → the set it belongs to —
the map that joins a `figma` frame to a verdict), and `messages` (a few
lines per set saying what drifted). The planning page renders the
warnings as a maintenance list. Every card wears its verdict: `ok` as a
quiet checked chip, drift and a node id missing from the map (a frame
deleted or renumbered in Figma) as loud ones — so a bare card reads as
"not checked", never as "fine".

`history` is the newest 100 commits of the same walk that dates every page,
newest first: `{ sha, date, subject, refs }`, where a ref names what the
commit touched — a page path, a spec id, a change id in flight or archived,
or a plain file. A commit that touched no listed file (a merge) is left out;
`refs` are deduped per commit. Classification is `store/history.mts`, the
resolution to a label and a route is `api/derive.ts`, and nothing is stored:
the feed is the log, read.

The snapshot runs ~995&nbsp;KB today (~250&nbsp;KB gzipped), most of the
growth being in-flight delta text; past ~1&nbsp;MB the lever is shipping
delta text as its own lazy artifact beside `/api/archive`, not trimming
what it says.

Change entry shape:

```
{ id, schema, status, owners, author?, created, title, why,
  target?,                       .openspec.yaml target: date
  dependsOn?: [changeId],        .openspec.yaml depends_on:
  cites?: [id],                  the proposal's ## References, read back
  taskGroups: [{ num, title, repo, done, total,
    tasks?: [{ text, done, owner? }],
    idle?: { since, days, source } }],   how long the claim has sat still
  lastMoved,                     last commit touching ANY file of the change
  deltas: [{ spec, kinds,
    requirements: [{ name, kind, to?, text? }] }] }
```

A change on the store's main has its `tasks.md` read there — `origin/HEAD`,
else `origin/main`, as the clone last fetched — because `pnpm plan` records
every claim and checkmark on main and never writes a checkout. A change
only this checkout holds reads its own copy and says it is not on main; one
whose other files differ from main says so too. A clone with no main
refuses to build rather than show one branch's claims. The checker alone
reads the checkout, because it judges the files a pull request changes.

A group's `idle` is the one thing on a change that no file states: the
later of when the current owner's unbroken hold began and the newest
commit that raised its checked count, read from that `tasks.md`'s history
on main, or on HEAD for a change only the checkout has. The store can say
@dana owns group 5; it cannot say the claim landed nine days ago and nothing has been checked off since, which
is the failure claim-at-pickup exists to prevent — a name on idle work
reads as covered. The inference is not ours: `openspec-viewer` derives it
for its own board and publishes it as `lib/store`, and `store/idle.mts`
reads it from there rather than keeping a second implementation to
disagree with the tool engineers already run. It arrives through the
submodule at `tools/openspec-viewer`, pinned to a release tag, because
the hosted build has no registry credentials and the submodule is already
how this repository consumes the viewer. Absent is a normal answer, and
never fatal: an unclaimed or finished group, a history that cannot
account for the owner, a store that is not a git checkout, and a clone
with no submodule initialised all render a group with no age against it.
In-flight only — an archived change is finished, and its groups are the
record of who did the work rather than a claim anyone still holds. Groups
are keyed by `num` because the convention makes the number the address:
an owner is recorded against a group number and a checkmark against a
task id under it.

The heavy fields — `tasks` and `requirements[].text` — ride for in-flight
changes only: the archive shares this type, its payload is the planning
board's own fetch, and no reader needs an archived delta's full text.

Change document shape (`/api/change/<id>`, in-flight only):

```
{ id, dir, schema, schemaKnown,
  artifacts: [{ name, kind: doc | specs | tasks, path?, present,
                text?, lastCommit? }],
  deltas: [{ spec, path, text, title?, purpose?, featureSet?,
             journeys?, sections: [{ kind, requirements, renames? }],
             suite?: { status, cases, outOfSuite? }, suiteError?,
             lastCommit?, error? }] }
```

The artifacts are the schema's, in the order it declares them — read from
`openspec/schemas/<name>/schema.yaml`, `id` and `generates` per entry —
each flagged present or not, and markdown files the schema never named
come last. `kind` follows what the artifact generates, never its name:
`specs/**` is the delta directory, `tasks.md` the checklist, anything else
prose, which is the only kind that ships its text (tasks ride the entry).
A schema the store does not define (`spec-driven` lives inside the CLI)
sets `schemaKnown: false`: the files are listed in the usual order and
nothing claims one is missing. Each delta is read twice over — its text as
written, and the contract it proposes: the `# ` title, Purpose, Feature
set, the journeys it issues, and each delta section's requirements with
their scenarios, parsed by the same readers as a durable spec. A delta the
reader cannot parse keeps its text and carries `error`; the suite beside it
is its own channel, as it is durably.
Owners come from `.openspec.yaml` first, task tags appended; `to` is a
rename's destination heading. A change's lane is derived, never stored:
`proposed` (no deltas) → `specified` (deltas, no task list) →
`in-progress` (open tasks) → `complete` (done === total > 0, waiting on
the archive). Dependencies resolve at derivation to blocking (in
flight), satisfied (archived), or missing (a lie worth surfacing).

A delta's `requirements` are the `### Requirement:` headings under its
ADDED/MODIFIED/REMOVED/RENAMED sections. A group heading (`### <name>`
without the prefix) inside a delta section is a check failure — the fold
copies it through verbatim and either aborts or corrupts the durable
spec — and so is any `##` heading that is not a delta heading, Purpose,
User journeys, or Feature set, because it silently ends the section and
drops every requirement after it. A rename is recorded under its FROM
name, the row that exists until the change archives. The spec block badges a requirement row an in-flight
change touches (title, tasks done/total, link to planning), and a
capability's status is derived, never stored: `changing` when an
in-flight delta touches it, `incubating` when its spec exists
only as a delta or the page has no spec, else `stable`.

Error containment splits by ownership. Manual pages are this app's own:
malformed input fails the build. Specs and changes are other people's
files the manual mirrors: a malformed one becomes
`{ id, error: { file, line, message } }` in the snapshot, renders as a loud
broken card, and `check:manual` fails the PR that introduced it — the
deployed site stays up and points at the break. The split runs one level
deeper than the store: a spec and the suite beside it are separate
channels (`error` vs `testCasesError`), so a broken `feature-tcs.md`
fails the PR naming its own file while the spec's requirements,
journeys, and delta rules carry on.

Node-only readers in `src/store/` (`read-specs.mts`, `read-changes.mts`,
`read-manual.mts`, `read-references.mts`, composed by `snapshot.mts`) parse
the store from disk.
Owners come from `(owner: @handle)` tags; scenario/story/test-case ids
(`<capability>-SC-<n>`, `-US-<n>`, `<capability>-US<n>-TC<m>-<v>`) are captured when present.

Relative markdown links inside spec text (`../../../../docs/prds/…`) are
rewritten at render to the page or reference that shows the file; one to a
store file no page shows opens on GitHub, and an unresolvable one renders as
a marked dead link.

Two transports, one client code path:

- Dev: a Vite plugin serves the GET endpoints computed from the repo root
  per request, `POST /api/page` and `POST /api/asset` (paths confined to
  the manual's directory), `POST /api/commit` (git add of that directory +
  commit).
- Static build: `build-snapshot.mts` writes the artifacts — one file per
  change under `api/change/`, one per reference under `api/reference/`; the
  hosted site is static files only.
- The OpenSpec viewer rides along under `dist/openspec/`, written by
  `scripts/openspec-viewer/snapshot.sh` from the pinned submodule after the
  manual's own build: the same page `pnpm spec:view` serves, with every
  answer it would give filed as JSON where the page will ask for it, and its
  search run in the browser over the text it ships. It is the viewer's page,
  not the manual's — its own bundle, its own design system — reached from the
  header's `OpenSpec viewer` link and nothing else. The dev server mounts it
  live at the same address (`store/viewer-mount.mts`): the viewer's own
  handler serves its built page and answers the snapshot's paths from the
  working copy per request, so a saved spec shows on the next reload rather
  than on the next build.

## Editing

The manual is edited locally only: `pnpm dev` runs a Vite plugin that
answers the `/api/*` endpoints above, confined to the manual's directory, and that
presence is the only thing that turns editing on. The built, deployed site
has no dev server behind it, so `useEditorSession` finds no store, and
every editor surface — the Edit button, Propose, New page, asset upload —
hides itself rather than rendering read-only. Nothing about the hosted
site changes for this: it is a static build of the store, same as it was
before any of this existed.

The editor is block-level, not a rich-text surface. Edit mode turns each
block into a card: prose gets a textarea with live preview, other blocks a
form for their attributes; blocks can be added, reordered, deleted.
Frontmatter is a form. Save serializes to canonical text and hands it to
the one `ContentStore`, `LocalStore`:

```
read(path)                            -> { source, version }
write(path, source, baseVersion)      -> ok | conflict { current }
writeBinary(path, bytes, baseVersion?) -> same as write
propose(files) / withdraw(id)         -> their own atomic commits, never staged
```

`version` is a content hash of the file — what turns two concurrent editors
into a rendered conflict diff instead of a silent overwrite. A save writes
the working tree directly; committing it is on the author, same as any other
change to the repo.

Staging validates client-side what the snapshot can prove: canonical
form, spec and scenario ids, image paths against `assets`, and that a
save does not drop a durable spec's last page reference. Story ids stay a
build-side check — the browser cannot see the Storybook index, and does
not pretend to.

New pages are created from the editor (path picker constrained to the
manual's tree); deleting a page is offered the same way.

Any requirement row or page header can propose a change: the browser
drafts `openspec/changes/<slug>/` with exactly what a proposal
schema needs and nothing that misfiles it — `.openspec.yaml`
(`schema: grade10-planning`), `proposal.md` with the author line and the
proposer's own words under `## Why`, citing the requirement and scenario
ids the row knows. No delta and no tasks.md: the delta is what
discussion is for, and a tasks.md would make the board read a thought as
ready to implement. With no deltas the proposal flips no capability
status, badges no row, and bumps no nav count — it lands in the
planning page's "Proposed" lane (the `proposed` lane of the four-lane
derivation: no deltas yet), and the capabilities its `## References`
cite can show it as a proposal before any delta exists. The write is one
atomic commit through the dev server's confined endpoint, behind an
exact path allowlist that admits only a new change directory's own files
— never `archive`, never an existing slug, never a durable spec — and
the proposer can withdraw their own proposal from the browser.

## App

`@grade10/manual`, Vite + React + TS, Tailwind 4 with
`@grade10/design-system` theme.css and components, `@grade10/ui` blocks
where one fits. React Router v7.

```
src/
  main.tsx, app.tsx, routes.tsx
  content/grammar.ts            block AST, parse, serialize (isomorphic)
  store/*.mts                   node-only store readers + vite plugin
  api/                          artifact fetch + types + derivations
  blocks/                       one component per block type, registry
  editor/                       block editor, ContentStore port + LocalStore
  pages/                        Home, Product, Capability, Planning, Change, Guide, References, Recent, Page
  shell/                        nav sidebar, header, search, recent bell, theme toggle
test/                           grammar round-trip table, reader fixtures
demo-store/                     the small store the readers are proved against,
                                and the reading the bundled fixture is
```

Routes: `/` home, `/p/<product>`, `/p/<product>/<capability>`,
`/platform/<topic>`, `/guides/<slug>`, `/planning`, `/planning/<change>`,
`/qa`, `/design`, `/recent`. These are canonical — a raw manual path redirects to its
canonical route, never renders beside it. `/qa`, `/design` and `/recent`
are pure snapshot derivations: a review worklist (drafts, uncovered
scenarios, suite errors, worst first), every design card grouped by page
with its nightly verdict, and the commit feed — a flat chronology with day
separators, each row the commit's subject and chips for what it touched.
A store that is not a git checkout says so instead of showing an empty
list.

Planning is a board of four lanes, not a product index: Proposed (a
reason and its citations), Specified (deltas written — the queue a lead
promotes), In progress, Complete (waiting on the archive). A card is the
change detail: open task lines shown by name (done ones behind a
toggle), owners stated honestly (`unclaimed`, never blank), target date,
dependencies in three tones (blocking loud, satisfied quiet, missing
destructive), and each delta requirement expandable — ADDED as the
readable requirement it is, MODIFIED as a client-side diff against the
durable block so a retyped block that drops content is reviewable,
RENAMED saying what it becomes. Warnings render where they can be acted
on: a page's own warnings as a strip on that page, store-file warnings
in maintenance. Nav admits work that has no capability yet — delta-only
capabilities appear as incubating rows linking to the change that
introduces them.

A change's page (`/planning/<change>`) is the change read as its files.
The head carries the card's facts — lane, target, owners, dependencies,
main state, suites, progress, next action — and the Artifacts strip
follows straight after, saying which of the schema's artifacts exist and
naming the ones still to write, in writing order. The why is read once,
in the Product tab where the proposal that carries it is: repeating it
in the head put a screen of prose between the facts and the strip. Files
the page cannot read are the exception — the why goes in the body there,
because no tab can open to carry it. Each present artifact is a tab,
labelled for who reads it: Product (the PM-driven proposal), Requirements
(the deltas — the detailed illustration of the proposal), Tech Design (the
technical implementation's high-level design), UI (the visual plan), Tasks
(the agent-driven implementation plan); an artifact a schema adds beyond
these is labelled from its id. The open tab lives in `?tab=`, so a link
carries the file it was written about, and a hash naming a permanent id —
scenario, story, row, case — opens the requirements whatever tab the link
was copied from. Prose tabs render the file with its leading `# ` title
dropped and headings anchored under the artifact's name; a relative link
to another of the change's files lands on that tab, one to a durable spec
on its capability page, and one to `docs/` or a store file no page shows
on GitHub. The Tasks tab is the groups with their open lines. The
Requirements tab reads every delta three ways, switched at the top:
Contract — purpose, feature set, journeys with the scenarios that accept
them, then each delta section's rows, ADDED opening to prose and
scenarios, MODIFIED offering the diff against the durable block, REMOVED
showing what goes, RENAMED as FROM → TO pairs; Full — the file as
written; Test plan — the suite beside the delta traced against the
delta's own scenarios, or the `/spec-to-tcs` command that writes one. The
rail lists a tab's H2s with its H3s one step in, and re-reads when the
tab changes.

Deep links reach leaves: every rendered requirement row, scenario, journey,
and flow step carries `id` (the store's permanent id where one exists), the
route expands and scrolls to `location.hash`, and each row has a copy-link
control.

Navigation is computed from disk taxonomy + `manual.yaml` order + page
frontmatter, never hand-listed: group → product → capability, with a
product's in-flight change count as a badge, its landing page's `icon`
beside its title, and one section per topic group. The icon slot is kept
whether or not a domain fills it, so one missing glyph never ragged-edges
the titles beside it; `check:manual` warns about the domain that left it
empty. The row of the page being read opens one level further, to that
page's H2s — read from the rendered page and shared with the On this
page column, so the two can never mark different sections; a product row
is a branch of pages and lists none of its own. A product or topic on
disk that `manual.yaml` never lists appears under "Not in manual.yaml"
rather than vanishing. Home groups products by audience, gathers the
topic groups under one Cross-cutting heading, and shows a what's-moving
strip. Capability pages end with an archived-changes timeline derived
from the archive artifact.

A product page ends with two derived sections its pages each carry a slice
of: In flight, the changes whose deltas touch one of its specs, and Pending
spec — every line its pages mark ❓ or `TBC`, linked to the section that
carries it, and then the `::next` reading pooled over every capability the
taxonomy gives it, each change named once with the capabilities it was about,
because a change about two of them wrote its follow-ons once. Neither is
authored and neither draws a heading over nothing.

The header carries a bell against `/recent`: the badge counts events newer
than the marker this reader last stored, capped at 9+, and a reader with no
marker yet gets the newest date written silently rather than a badge
shouting the whole feed. Browser state is small and named once, in the
`STORAGE` registry (`editor/config.ts`) — the propose handle, the answered
first-visit card (`manual.welcome`) and that seen marker
(`manual.recent.seen`). Every read and write of it tolerates storage being
switched off: a reader who cannot remember simply sees the card again and
never sees a badge.

## Checks

`check/check-manual.mjs` beside the app, wired as `check:manual` into
the lint workflow, which runs it whole on every pull request and every push
to main. Which rules run follows who can fix what they find: page rules run
against any manual; the store families — coverage, suites, deltas, the fold
— run only where the manual and the store share a repository, because a
manual mounted elsewhere can neither cause nor fix a hole in the store.

The deploy runs `--pages`, the page families alone (`check:manual:pages`).
Error containment says a break in a spec or a change is somebody else's file
the manual mirrors: it renders as a loud broken card and the deployed site
stays up and points at it. A gate that refused to publish over one would say
the opposite, and would hand a store conflict the power to stop every later
page from reaching the site. Lint has already failed the pull request that
wrote it — its step runs whatever Biome made of the same job, because a
family enforced only where an unrelated formatting error can starve it is a
family enforced nowhere. The rules:

- every page parses and is canonical
- every reference resolves: `spec` ids to a durable spec, `changes` ids to
  a durable spec or one an in-flight delta touches (a ribbon may point at a
  capability that is still being introduced), `requirement=` against the
  spec's actual headings, `scenario=`/`story=`/`cases` ids, `::image`
  sources on disk, `::story` ids against the workbench build's index when
  available
- every durable spec is referenced by at least one page; every product and
  platform topic (by disk shape) has its page; `manual.yaml` lists each
  product exactly once
- no spec or change entry in the snapshot carries an `error`
- a durable spec refuses a non-`Requirement:` `###` heading under
  `## Requirements` — `openspec archive` absorbs a mid-section group
  heading into the preceding requirement's text, and this rule catches
  that at PR time instead of breaking the readers after the fold
- an in-flight MODIFIED/REMOVED delta heading (and a RENAMED FROM) must
  resolve byte-for-byte to a durable requirement heading, an ADDED name
  the durable spec already holds fails, and a MODIFIED block missing
  scenarios the durable requirement currently carries fails naming them —
  the same comparisons the fold makes, made while the delta is a delta
- a delta refuses a group heading inside its sections and any `##`
  heading that would silently end them (the fold aborts, corrupts, or
  drops requirements on each)
- two in-flight changes folding the same spec + requirement fail both
  files — archiving them in sequence is a silent revert
- permanent ids are issued once, ever: the universe is durable specs,
  every in-flight delta, and every archived delta (the fold discards
  journey sections, so archived ids stay reserved even when no durable
  spec holds them)
- a page selector naming a requirement an in-flight REMOVED delta deletes
  or a RENAMED delta moves fails now, offering the new name — never
  "archive green, main red"
- a manifest's `depends_on` must name a change that exists, in flight or
  archived — a board drawing edges from a lie would be worse than none
- the `figma` family asserts the URL's file key and node id against the
  design-sync report and validates `set=` against its keys — warnings,
  since the report mirrors a file someone else owns
- a delta's `## User journeys` and `## Feature set` are not a rule here:
  every well-formed delta carries them, and `archive:preflight` refuses
  the archive until they reach the durable spec
- warning: a page whose embedded specs changed after the page's last
  commit is flagged stale, naming which requirements changed (spec blob
  at the page's commit versus head, one `git cat-file --batch` pass); a
  spec moved since that commit is reported as moved, never as an
  everything-changed diff; a page with no commit yet is skipped
- warning: a `[[ref]]` in prose that resolves to nothing or to more than
  one thing, scanned with the grammar's fence tracking, inline code
  skipped
- warning: a page's own prose drawing a ledger — a table headed exactly
  `Step | Event | Points | Balance`, or `When | …` — outside an
  `example`, where nothing holds its balances to their arithmetic; the
  same fence tracking, and an example's own body is never one
- QA rules, asked of the spec directory and never of a page: a case
  tracing a scenario the spec does not issue (fail), an `approved` suite
  holding a `draft` case (fail), a journey accepted by a scenario its
  own spec does not issue (fail); warnings for a suite no page shows,
  scenarios no case traces minus the suite's `**Out of suite:**` list,
  and a `**Covers:**` quote the spec's heading has moved away from
- `manual.yaml` validation covers `platform:` as well as products, and a
  malformed Storybook index is contained as a finding, never a crash

Warnings do not live only in CI logs: the build embeds them in the
snapshot and the planning page renders them as a maintenance list.

## Later, deliberately

A `[[ref]]` picker inside the prose editor (the propose dialog has one;
prose authors still type ids), table grid editing over GFM tables,
paste-to-upload images, per-block staleness via blame (page-level resets
on any edit today), a topology block once its data is regenerated by CI
rather than committed by hand, `(verified: @qa)` acceptance tags,
rename-proof deep links for requirements
(needs permanent requirement ids, which archive's exact heading match
rules out — page selectors get the fuse rule; raw copied links stay
mortal).
