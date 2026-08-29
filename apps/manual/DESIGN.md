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
  testCases?: [{ id, title, traces: [scenarioId] }] }
```

Change entry shape:

```
{ id, schema, status, owners, created, title, why,
  taskGroups: [{ title, repo, done, total }],
  lastMoved,                     last commit touching its tasks.md
  deltas: [{ spec, kinds }] }
```

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
- `GithubStore` (hosted): a fine-grained PAT (`contents:write` +
  `pull_requests:write`) pasted in settings, held in localStorage; first
  write creates or reuses a `manual/<login>` branch AND its PR, so edits
  never rot on an unopened branch. Read-only without a token. Raw HTML
  stays off in the renderer — that is the XSS line that makes a stored PAT
  tolerable until a GitHub App replaces it.

New pages are created from the editor (path picker constrained to the
`manual/` tree); deleting a page is a dev-mode-only action.

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
- warning: a page whose embedded specs changed after the page's last
  commit is flagged stale

## Later, deliberately

Hosted deploy workflow (mirror `storybook.yml`), `[[ref]]` link syntax with
an editor picker, table grid editing over GFM tables, paste-to-upload
images, flow diagrams lighting the handbook's topology, porting the
openspec-viewer board derivations (idle claims, collisions),
`(verified: @qa)` acceptance tags, GitHub App auth replacing PATs.
