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
| `figma` | `::figma{url="…" title="…"}` | titled card, embed loads on click, open-in-Figma link |
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
  `specs`, `changes` (in-flight only).
- `/api/archive` — archived changes, fetched only by planning/timeline
  views, so years of archive never block first paint.

Search needs no artifact: the client builds a minisearch index lazily over
the snapshot on first use; the archive is searched only where it is already
loaded.

Spec entry shape:

```
{ id, title, purpose, featureSet?, lastCommit,
  requirements: [{ name, text,
    scenarios: [{ id?, name, text }] }],
  journeys?:  [{ id, title, text, acceptedBy: [scenarioId] }],
  testCases?: [{ id, title, traces: [scenarioId], status }],
  testCasesStatus? }
```

Test cases follow `docs/governance/specs-to-test-cases.md`: a case is
`draft`, `actual`, or `deprecated`, the suite file `pending-review` or
`approved`, and the cases block renders both — a draft must never wear an
approved suite's authority.

The snapshot also carries `assets` (every file under `manual/assets/`),
`warnings` (the `check:manual` warnings of the build that produced it —
failures never deploy, so warnings are all it can carry), and optionally
`designSync`, the nightly design-sync check's verdict per component set.
The planning page renders the warnings as a maintenance list; `figma` and
`story` cards badge a component set the report marks as drifting.

Change entry shape:

```
{ id, schema, status, owners, created, title, why,
  taskGroups: [{ title, repo, done, total }],
  lastMoved,                     last commit touching its tasks.md
  deltas: [{ spec, kinds,
    requirements: [{ name, kind }] }] }
```

A delta's `requirements` are the `### Requirement:` headings under its
ADDED/MODIFIED/REMOVED/RENAMED sections — group headings (`### <name>`
without the prefix) are legal in deltas and are never requirements. A
rename is recorded under its FROM name, the row that exists until the
change archives. The spec block badges a requirement row an in-flight
change touches (title, tasks done/total, link to planning), and a
capability's status is derived, never stored: `changing` when an
in-flight non-draft delta touches it, `incubating` when its spec exists
only as a delta or the page has no spec, else `stable`.

Error containment splits by ownership. `manual/` pages are this app's own:
malformed input fails the build. Specs and changes are other people's
files the manual mirrors: a malformed one becomes
`{ id, error: { file, line, message } }` in the snapshot, renders as a loud
broken card, and `check:manual` fails the PR that introduced it — the
deployed site stays up and points at the break.

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
read(path)                          -> { source, version }
write(path, source, baseVersion)    -> ok | conflict { current }
writeBinary(path, bytes, baseVersion?) -> same
commit(message)                     -> dev only
```

`version` is a content hash in dev and the blob SHA on GitHub — the GitHub
contents API requires it, and it is what turns two concurrent editors into a
rendered conflict diff instead of a silent overwrite.

- `LocalStore` (dev): posts to the Vite plugin; a commit bar appears once
  the working tree has manual edits.
- `GithubStore` (hosted): a fine-grained PAT pasted in settings, held in
  localStorage; read-only without one. Two modes, chosen in settings:
  - `main` (default): reads and writes the base branch directly — the
    deploy listens on push, so a save is live in about a minute. Needs
    `contents:write` only. Before a save the editor compares live main
    against the snapshot's `storeHead` and warns when the page it loaded
    is behind; a push refused by branch protection surfaces the refusal
    and suggests PR mode, never a silent fallback.
  - `branch + PR`: first write creates or reuses a `manual/<login>`
    branch AND its PR, so edits never rot on an unopened branch. Also
    needs `pull_requests:write`.
  The mode picks the ref for read and write together — the editor never
  loads one branch while claiming to edit another. Raw HTML stays off in
  the renderer — that is the XSS line that makes a stored PAT tolerable
  until a GitHub App replaces it; main mode is why the deploy workflow
  notifies on failure and the header shows deployed `storeHead` against
  live main with the last deploy's conclusion, so a frozen site is
  visible in the tool itself.

Saving validates client-side what the snapshot can prove: canonical form,
spec and scenario ids, image paths against `assets`, and that the save
does not drop a durable spec's last page reference. Story ids stay a
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
status, badges no row, and bumps no nav count — it simply appears on the
planning page, whose "Proposed" lane collects every change without task
groups. The write is one atomic commit (Trees API on GitHub, a confined
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
  pages/                        Home, Product, Capability, Planning, Guide, Page
  shell/                        nav sidebar, header, search, theme toggle
test/                           grammar round-trip table, reader fixtures
```

Routes: `/` home, `/p/<product>`, `/p/<product>/<capability>`,
`/platform/<topic>`, `/guides/<slug>`, `/planning`. These are canonical —
a raw manual path redirects to its canonical route, never renders beside
it.

Deep links reach leaves: every rendered requirement row, scenario, journey,
and flow step carries `id` (the store's permanent id where one exists), the
route expands and scrolls to `location.hash`, and each row has a copy-link
control.

Navigation is computed from disk taxonomy + `manual.yaml` order + page
frontmatter, never hand-listed: group → product → capability, with a
product's in-flight change count as a badge. Home groups products by
audience and shows a what's-moving strip. Capability pages end with an
archived-changes timeline derived from the archive artifact.

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
- an in-flight MODIFIED/REMOVED delta heading must resolve byte-for-byte
  to a durable requirement heading, so an archive can never fail at the
  fold on a heading that drifted
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

Warnings do not live only in CI logs: the build embeds them in the
snapshot and the planning page renders them as a maintenance list.

## Later, deliberately

A `[[ref]]` picker inside the prose editor (the propose dialog has one;
prose authors still type ids), table grid editing over GFM tables,
paste-to-upload images, per-block staleness via blame (page-level resets
on any edit today), a topology block once its data is regenerated by CI
rather than committed by hand, porting the openspec-viewer board
derivations (idle claims, collisions), `(verified: @qa)` acceptance tags,
GitHub App auth replacing PATs.
