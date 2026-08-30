# Grade10 Manual

A product manual for the whole platform, served as a web app. PM, designers,
QA, and engineers read the same pages: human-first prose up top, specs,
in-flight changes, and visuals embedded as blocks. Pages are editable in the
browser; every edit lands in git, because git is the only state this app has.

The app never restates a fact that lives elsewhere. Requirements come from
`openspec/specs`, progress from `tasks.md` checkboxes, visuals from Figma,
Storybook, and images in `manual/assets/`. Manual pages add the narrative
that connects them.

## Content

Pages live at the store root under `manual/`:

```
manual/
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
pages), `order` (nav sort). Any other key is a parse error — the editor must
never silently drop data on save.

### Block grammar

Everything between directives is a `prose` block (GitHub markdown; headings
start at `##`; raw HTML is never rendered). Directives sit at column 0:

- Leaf: `::name{attr="value" attr2="value2"}` on one line.
- Container: `:::name{...}` opens, a bare `:::` closes, body is markdown
  plus optionally LEAF directives — one level, containers never nest.

| Block | Form | Renders |
| --- | --- | --- |
| `spec` | `::spec{id="grade10-store/loyalty"}` | every requirement of that spec as expandable rows |
| `spec` | `::spec{id="…" requirement="…"}` | one requirement with its scenarios; also `scenario="loyalty-SC-04"` or `story="loyalty-US-01"` selectors — prefer these, the ids are permanent |
| `journeys` | `::journeys{id="grade10-store/loyalty"}` | the spec's user journeys, each story with its accepted-by scenarios |
| `cases` | `::cases{id="grade10-store/loyalty"}` | the capability's test-case suite with coverage against its scenarios |
| `changes` | `::changes{spec="grade10-store/loyalty"}` | ribbon of in-flight changes whose deltas touch that spec: status first, then tasks done/total, owners, last-moved age, link |
| `figma` | `::figma{url="…" title="…" set="…"}` | titled card, embed loads on click, open-in-Figma link, design-sync verdict; optional `set` names the component set an assembly frame is about, validated against the report |
| `story` | `::story{id="blocks-store-cart--default" title="…" height="480"}` | titled card, workbench Storybook iframe loads on click |
| `image` | `::image{src="assets/…" alt="…" caption="…"}` | image from `manual/assets/`; missing `alt` is a parse error |
| `children` | `::children` | cards for the child pages of this directory, from their frontmatter |
| `callout` | `:::callout{kind="note"}` … `:::` | kinds: `note`, `decision`, `warning` |
| `detail` | `:::detail{for="engineer" title="…"}` … `:::` | collapsed-but-present depth for one audience; searchable, deep-linkable, never hidden from the DOM |
| `flow` | `:::flow{title="Checkout" diagram="assets/…"}` … `:::` | step player; each `##` in the body starts a step; optional SVG whose `data-step` elements light per step |

Unknown directives are a parse error, not a silent pass-through.

Prose may carry inline references: `[[loyalty-SC-23]]` renders the current
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
→ the contract (spec blocks) → acceptance (journeys, cases) → in flight
→ history. The editor scaffolds a new capability page with that skeleton;
a page with a `spec` but no journeys or cases block draws a warning,
never a failure.

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

The builder emits two static artifacts, both pure functions of git state:

- `/api/snapshot` — boots the app: `generatedAt`, `storeHead`, `config`
  (manual.yaml + derived taxonomy), `pages: [{ path, source, lastCommit }]`,
  `specs`, `changes` (in-flight only), `history`.
- `/api/archive` — archived changes, fetched only by planning/timeline
  views, so years of archive never block first paint.

Search needs no artifact: the client builds a minisearch index lazily over
the snapshot on first use; the archive is searched only where it is already
loaded. The index covers pages (design-card titles included), specs,
test cases, and in-flight delta text — the work that exists only as a
delta is findable, deep-linked to the board. Multi-word queries demand
every word; when only some match, the palette says so instead of
pretending.

Spec entry shape:

```
{ id, title, purpose, featureSet?, lastCommit,
  requirements: [{ name, text,
    scenarios: [{ id?, name, text }] }],
  journeys?:  [{ id, title, text, acceptedBy: [scenarioId] }],
  testCases?: [{ id, title, traces: [scenarioId], status }],
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

The snapshot also carries `assets` (every file under `manual/assets/`),
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
  taskGroups: [{ title, repo, done, total,
    tasks?: [{ text, done, owner? }] }],
  lastMoved,                     last commit touching ANY file of the change
  deltas: [{ spec, kinds,
    requirements: [{ name, kind, to?, text? }] }] }
```

The heavy fields — `tasks` and `requirements[].text` — ride for in-flight
changes only: the archive shares this type, its payload is the planning
board's own fetch, and no reader needs an archived delta's full text.
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

Error containment splits by ownership. `manual/` pages are this app's own:
malformed input fails the build. Specs and changes are other people's
files the manual mirrors: a malformed one becomes
`{ id, error: { file, line, message } }` in the snapshot, renders as a loud
broken card, and `check:manual` fails the PR that introduced it — the
deployed site stays up and points at the break. The split runs one level
deeper than the store: a spec and the suite beside it are separate
channels (`error` vs `testCasesError`), so a broken `test-cases.md`
fails the PR naming its own file while the spec's requirements,
journeys, and delta rules carry on.

Node-only readers in `src/store/` (`read-specs.mts`, `read-changes.mts`,
`read-manual.mts`, composed by `snapshot.mts`) parse the store from disk.
Owners come from `(owner: @handle)` tags; scenario/story/test-case ids
(`<capability>-SC-<n>`, `-US-<n>`, `-TC-<n>`) are captured when present.

Relative markdown links inside spec text (`../../../../docs/prds/…`) are
rewritten at render to store-relative routes; an unresolvable one renders as
a marked dead link.

Two transports, one client code path:

- Dev: a Vite plugin serves the two GET endpoints computed from the repo
  root per request, `POST /api/page` and `POST /api/asset` (paths confined
  to `manual/`), `POST /api/commit` (git add manual/ + commit).
- Static build: `build-snapshot.mts` writes the two artifacts; the hosted
  site is static files only.

## Editing

The editor is block-level, not a rich-text surface. Edit mode turns each
block into a card: prose gets a textarea with live preview, other blocks a
form for their attributes; blocks can be added, reordered, deleted.
Frontmatter is a form. Save serializes to canonical text and hands it to the
active `ContentStore`:

```
read(path)                            -> { source, version }
write(path, source, baseVersion)      -> ok | conflict { current }
                                         dev only: the working tree is the stage
push(files: [{path, source, baseVersion}])
                                      -> ok | conflicts [{path, current}]
                                         hosted: the staged set, one commit
writeBinary(path, bytes, baseVersion?) -> same as write
commit(message)                       -> dev only
propose(files) / withdraw(id)         -> their own atomic commits, never staged
```

`version` is a content hash in dev and the blob SHA on GitHub — it is what
turns two concurrent editors into a rendered conflict diff instead of a
silent overwrite. Asset uploads stay immediate in both transports: a
binary draft has no diff to review and no place in localStorage.

Saving never pushes. Everywhere, a save stages a draft, and a person
decides when everything staged becomes one commit — the same rhythm in
both transports:

- `LocalStore` (dev): a save writes the working tree; the commit bar
  appears once the tree has manual edits and commits them all.
- `GithubStore` (hosted): a save stages the draft in the browser
  (localStorage, keyed by path, holding the canonical text and the blob
  version it was read at — a reload keeps it, and the page renders its
  draft with a visible draft marker). A pending bar lists every staged
  page with discard per page; **Push all** turns the whole set into ONE
  atomic Trees-API commit: read the target head, compare every draft's
  base version against that head's blobs — any page that moved renders
  the existing side-by-side conflict, and nothing at all is written —
  then tree → commit → a non-forced ref move, retried once if the ref
  advanced mid-flight. One push, one deploy.

The hosted store needs a fine-grained PAT pasted in settings and
verified before it counts: saving calls `/user` and a contents read of
the repo, and the session stays read-only until both pass — each failure
names its real cause, the unapproved-org-token 404 included. The verdict
(login, expiry from GitHub's own header, warned within a week) is cached
keyed to a fingerprint of the token, so a reload does not re-probe, and
the first 401 tears it up. Read-only without one — but the propose
control stays visible, wearing a lock and pointing at settings: hiding
it hid the whole loop from the people who had not started it. Two modes,
chosen in settings:

- `main` (default): reads the base branch, and Push all lands on it —
  the deploy listens on push, so the batch is live in about a minute.
  Needs `contents:write` only; `actions:read` additionally lets the
  header show the last deploy's conclusion. A push refused by branch
  protection surfaces the refusal and suggests PR mode, never a silent
  fallback.
- `branch + PR`: Push all lands one commit on a `manual/<login>` branch
  and keeps its PR open, so edits never rot on an unopened branch. Also
  needs `pull_requests:write`.

The mode picks the ref for read and write together — the editor never
loads one branch while claiming to edit another. Raw HTML stays off in
the renderer — that is the XSS line that makes a stored PAT tolerable
until a GitHub App replaces it; main mode is why the deploy workflow
notifies on failure and the header shows deployed `storeHead` against
live main with the last deploy's conclusion, so a frozen site is
visible in the tool itself.

Others' pushes reach you, not just your push failing: while the tab is
visible the app re-asks the live head on an interval and on every
return of focus (with a token; tokenless readers ask only on focus —
unauthenticated rate limits are 60 an hour). When the head moves, the
health strip says so, and every staged draft is checked against the
moved head — a page that changed under your draft is marked on the
pending bar before you ever push, not discovered inside the conflict.
Polling stops while the tab is hidden; nothing notifies a tab nobody
is looking at.

Staging validates client-side what the snapshot can prove: canonical
form, spec and scenario ids, image paths against `assets`, and that the
batch does not drop a durable spec's last page reference — judged over
the whole staged set, not one file at a time. Story ids stay a
build-side check — the browser cannot see the Storybook index, and does
not pretend to.

New pages are created from the editor (path picker constrained to the
`manual/` tree); deleting a page is a dev-mode-only action.

Any requirement row or page header can propose a change: the browser
drafts `openspec/changes/<slug>/` with exactly what the pm-planning
schema needs and nothing that misfiles it — `.openspec.yaml`
(`schema: pm-planning`), `proposal.md` with the author line and the
proposer's own words under `## Why`, citing the requirement and scenario
ids the row knows. No delta and no tasks.md: the delta is what
discussion is for, and a tasks.md would make the board read a thought as
ready to implement. With no deltas the proposal flips no capability
status, badges no row, and bumps no nav count — it lands in the
planning page's "Proposed" lane (the `proposed` lane of the four-lane
derivation: no deltas yet), and the capabilities its `## References`
cite can show it as a proposal before any delta exists. The write is one
atomic commit (Trees API on GitHub, a confined
endpoint in dev) behind an exact path allowlist that admits only a new
change directory's own files — never `archive`, never an existing slug,
never a durable spec — and the proposer can withdraw their own proposal
from the browser.

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
  editor/                       block editor, ContentStore port + adapters
  pages/                        Home, Product, Capability, Planning, Guide, Recent, Page
  shell/                        nav sidebar, header, search, recent bell, theme toggle
test/                           grammar round-trip table, reader fixtures
```

Routes: `/` home, `/p/<product>`, `/p/<product>/<capability>`,
`/platform/<topic>`, `/guides/<slug>`, `/planning`, `/qa`, `/design`,
`/recent`. These are canonical — a raw manual path redirects to its
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

Deep links reach leaves: every rendered requirement row, scenario, journey,
and flow step carries `id` (the store's permanent id where one exists), the
route expands and scrolls to `location.hash`, and each row has a copy-link
control.

Navigation is computed from disk taxonomy + `manual.yaml` order + page
frontmatter, never hand-listed: group → product → capability, with a
product's in-flight change count as a badge, and one section per topic
group. A product or topic on disk that `manual.yaml` never lists appears
under "Not in manual.yaml" rather than vanishing. Home groups products by
audience, gathers the topic groups under one Cross-cutting heading, and
shows a what's-moving strip. Capability pages end with an archived-changes
timeline derived from the archive artifact.

The header carries a bell against `/recent`: the badge counts events newer
than the marker this reader last stored, capped at 9+, and a reader with no
marker yet gets the newest date written silently rather than a badge
shouting the whole feed. Browser state is small and named once, in the
`STORAGE` registry (`editor/config.ts`) — the token and its verdict, the
write mode and PR, the staged drafts, the propose handle, the answered
first-visit card (`manual.welcome`) and that seen marker
(`manual.recent.seen`). Every read and write of it tolerates storage being
switched off: a reader who cannot remember simply sees the card again and
never sees a badge.

## Checks

`scripts/check-manual.mjs` at the store root, wired as `check:manual` into
the lint workflow and run before every deploy of the manual:

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
- warning: a delta carrying `## User journeys` or `## Feature set` — the
  fold discards both, so the archive workflow must carry them into the
  durable spec by hand
- warning: a page whose embedded specs changed after the page's last
  commit is flagged stale, naming which requirements changed (spec blob
  at the page's commit versus head, one `git cat-file --batch` pass); a
  spec moved since that commit is reported as moved, never as an
  everything-changed diff; a page with no commit yet is skipped
- warning: a capability page with a `spec` but no journeys or cases block
  is missing its acceptance shelf
- warning: a `[[ref]]` in prose that resolves to nothing or to more than
  one thing, scanned with the grammar's fence tracking, inline code
  skipped
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
rather than committed by hand, porting the openspec-viewer board
derivations (idle claims), `(verified: @qa)` acceptance tags,
GitHub App auth replacing PATs, rename-proof deep links for requirements
(needs permanent requirement ids, which archive's exact heading match
rules out — page selectors get the fuse rule; raw copied links stay
mortal).
