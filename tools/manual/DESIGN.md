# Grade10 Manual

A product manual for the whole platform, served as a web app: the pages under
`docs/prds/`, rendered. PM, designers, QA, and engineers read the same pages —
human-first prose with design cards, stories, images, flows and worked
examples embedded as blocks. Pages are editable in the browser when the
manual is running locally, and every edit lands in git, because git is the
only state this app has. The hosted deployment is always a plain static
build — read-only, nothing more.

The app never restates a fact that lives elsewhere. Visuals come from Figma,
Storybook, and images in the manual's `assets/`; the store's
`docs/references/` render beside the pages as evidence. A capability's page
is its PRD, which is why the store keeps the manual under `docs/prds/`. The
OpenSpec store is not the manual's to read: its specs and changes are read by
`tools/openspec-store`, for the scripts under `scripts/openspec/`, and a page
links to a spec file on GitHub.

## Roots

The viewer reads from two directories, resolved once at startup
(`src/store/roots.mts`). The **content root** holds the manual — a
directory with `manual.yaml` and the pages beside it, `docs/prds` unless
`MANUAL_DIR` names another (a relative path inside the repository). The
**store root** holds what the pages draw on — `docs/references`, the
workbench Storybook index and the design-sync report. In this repository they
are the same directory and everything behaves as one tree.

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

What follows from a split: page and asset writes land in the content
repository, git history and commit info merge from both clones, and the
checker holds the manual's own pages to every page rule.

## Content

Pages live at the content root under the manual's directory:

```
docs/prds/
  manual.yaml                 ordering, nav groups, external base URLs
  assets/                     images referenced by ::image blocks
  index.md                    home page prose
  products/<product>/index.md          product landing
  products/<product>/<capability>.md   capability page
  platform/<topic>.md                  cross-cutting topics
  guides/<slug>.md                     how-we-work tutorials, personas' start-here paths
```

The pages decide taxonomy, `manual.yaml` only orders: a directory one or two
levels under `products/` holding pages is a Product (`grade10-site/store`),
and a page under `platform/` is a Platform topic, its id the path without
`.md` (`shared/money-amounts`). A product or topic the pages hold and
`manual.yaml` never lists appears under "Not in manual.yaml" rather than
vanishing.

`groups:` and `platform:` take the same two forms — an ordered mapping of
title → ids, or a list of `{ title, products }` / `{ title, topics }` — so
products and topics both carry named nav groups. A bare list of topic ids
still parses, as one group called Cross-cutting; an id listed twice fails
the read, whichever group it sits in.

Guides open with `how-this-manual-works` — what the store is and how to work
with an agent. Content pages carry
no meta prose about reading the manual; that page holds it, and the home
page's first-visit card is its one door.

A page is YAML frontmatter plus a sequence of blocks. Frontmatter fields, in
canonical order: `title` (required), `summary`, `spec` (the capability this
page documents — `product/capability`, or a bare topic id for platform
pages; what a `[[ref]]` resolves against), `icon` (the glyph beside the title, one name from the vocabulary in
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
| `figma` | `::figma{url="…" title="…" set="…"}` | titled card, embed loads on click, open-in-Figma link, design-sync verdict; optional `set` names the component set an assembly frame is about, validated against the report |
| `story` | `::story{id="blocks-store-cart--default" title="…" height="480"}` | titled card, workbench Storybook iframe loads eagerly |
| `image` | `::image{src="assets/…" alt="…" caption="…"}` | image from `manual/assets/`; missing `alt` is a parse error |
| `children` | `::children` | cards for the child pages of this directory, from their frontmatter |
| `callout` | `:::callout{kind="note"}` … `:::` | kinds: `note`, `decision`, `warning`; a `warning` shows a signature — `author`/`date` when written in, else who last changed it and when, derived from git at build |
| `detail` | `:::detail{for="engineer" title="…"}` … `:::` | collapsed-but-present depth for one audience; searchable, deep-linkable, never hidden from the DOM |
| `flow` | `:::flow{title="Checkout" case="Normal" diagram="assets/…"}` … `:::` | steps read top to bottom, all open; `##` starts a step, `#` groups the steps under it into a phase, and numbering runs straight through; optional SVG drawn at one and a half times its own size — the same magnification whatever the chart's size, centred where that is narrower than the strip — in a strip that pans under the mouse or a swipe, never a scrollbar, holding still while the mouse rests on the box at either end; `pnpm diagrams` pulls each lane band back to the drawing inside it, so a chart with room to spare never pans past its own last node; with one on screen the steps fold behind their count, a part under the mouse lights and tells its step on a card, a click on one opens the list at that step, and a deep link to a step opens it too; a pointed-at row lights its `data-step` elements and the strip pans to show them; neighbouring flows under one title are one flow's cases, picked from a dropdown beside the title, each with its own steps and drawing and its own step ids, and a deep link into any case shows it; `check:manual` refuses a lone flow that names a case, a run where one names none or two name the same, and two same-titled flows sitting apart |
| `example` | `:::example{title="Refund in two parts" tier="Gold" shipping="$30"}` … `:::` | one worked case: the body opens with the cart as a list (`- Gengar single $139`), then a `Step \| Event \| Points \| Balance` table — or `When \| …` for a timeline, days written `2026/01/03` that never run backwards, a blank day sharing the one above — points signed, balance running; an optional `Progress` column carries a second running figure the rows state — a window's total, a term's count — and a last `Period` column names what a run of days is inside — a term, a window — blank to stay in the one above and `—` to close it, drawn as a labelled rail down the left of a timeline, coloured by the block's `periods="Gold=gold"` and blank where a period is named no colour, and refused on a steps ledger; prose after the table is the why; neighbouring examples gather under one `Examples` toggle, open on arrival; `tier` badges the member, `shipping` is the fee on the order; `check:manual` refuses a cart line without a price and a balance the points do not reach |

Unknown directives are a parse error, not a silent pass-through.

Prose may carry inline references: `[[grade10-site/loyalty/programme]]` renders the
current title of the page whose `spec` names that capability, as a deep link,
so a renamed page can never orphan the prose that cites it. An item id
(`…#…-SC-01`) is never a reference target — it renders as a dead link
naming the capability instead. The grammar never sees these — prose stays verbatim —
and `src/content/refs.ts` is the one resolver render and check share. An
unresolvable reference renders as a marked dead link and draws a check
warning, the same rule every other prose pointer has. The
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

A capability page opens the same way on every page, so every role finds
theirs in the same place: what it is, then how it looks (figma, stories).
The editor scaffolds a new capability page with those two paragraphs.

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
  (manual.yaml), `taxonomy` (from the pages), `manualDir`,
  `pages: [{ path, source, lastCommit }]`, `assets`, `references`,
  `referencesReadme`, `history`, `warnings`, and optionally `designSync`.
- `/api/reference/<slug>` — one document from the store's `docs/references/`,
  as written, fetched only by its page; the snapshot lists them without
  their text, so the boot payload does not grow with the evidence file.
- `/api/relay`, `/api/head` — the relay the build was given and the deployed
  head, read by the notice that `main` moved.
- `public/fixture-snapshot.json` — what the shell falls back to where
  nothing serves `/api/snapshot`, and what `?fixture` forces. Generated by
  `pnpm fixture` from `demo-store/` through the same readers the real store
  gets, so a shape the readers have moved past cannot reach the shell as a
  crash; `test/fixture-snapshot.test.ts` holds the committed file to that
  reading.

Search needs no artifact: the client builds a minisearch index lazily over
the snapshot on first use, covering pages (design-card titles included) and
references. Multi-word queries demand every word; when only some match, the
palette says so instead of pretending.

`assets` is every file under the manual's `assets/`; `references` the store's
`docs/references/*.md` — slug, path, title and last commit — with the
README's text beside them as `referencesReadme`; `warnings` the
`check:manual` warnings of the build that produced it — failures never
deploy, so warnings are all it can carry — plus a build-time `design` rule
folded from the design-sync report: each drifting set with its message, each
report key no card shows, and a report more than eight days old. A page's
own warnings render as a strip on that page. `designSync` is the nightly
report itself: `generatedAt`, the Figma `file` key, `sets` (verdict per
component set), `nodes` (node id → the set it belongs to — the map that joins
a `figma` frame to a verdict), and `messages` (a few lines per set saying
what drifted). Every card wears its verdict: `ok` as a quiet checked chip,
drift and a node id missing from the map (a frame deleted or renumbered in
Figma) as loud ones — so a bare card reads as "not checked", never as
"fine".

`history` is the newest 100 commits of the same walk that dates every page,
newest first: `{ sha, date, subject, refs }`, where a ref names what the
commit touched — a page path, or a plain file. A commit that touched no
listed file (a merge) is left out; `refs` are deduped per commit.
Classification is `store/history.mts`, the resolution to a label and a route
is `api/derive.ts`, and nothing is stored: the feed is the log, read.

The snapshot runs ~1.7&nbsp;MB today (~530&nbsp;KB gzipped) over 185 pages,
almost all of it page source.

Manual pages are this app's own: malformed input fails the build. Node-only
readers in `src/store/` (`read-manual.mts`, `read-references.mts`, composed
by `snapshot.mts`) parse them from disk.

Relative markdown links in a page are rewritten at render to the page or
reference that shows the file; one to a store file no page shows — a spec
under `openspec/`, a governance doc — opens on GitHub, and an unresolvable
one renders as a marked dead link.

Two transports, one client code path:

- Dev: a Vite plugin serves the GET endpoints computed from the repo root
  per request, `POST /api/page` and `POST /api/asset` (paths confined to
  the manual's directory), `DELETE /api/page`, and `/api/upstream` and
  `POST /api/pull`, which say what the checkout stands at against `main` and
  fast-forward it.
- Static build: `build-snapshot.mts` writes the artifacts — the snapshot,
  the relay and head, one file per reference under `api/reference/`; the
  hosted site is static files only.

## Editing

The manual is edited locally only: `pnpm dev` runs a Vite plugin that
answers the `/api/*` endpoints above, confined to the manual's directory, and that
presence is the only thing that turns editing on. The built, deployed site
has no dev server behind it, so `useEditorSession` finds no store, and
every editor surface — the Edit button, New page, asset upload —
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
deletePage(path, baseVersion)
```

`version` is a content hash of the file — what turns two concurrent editors
into a rendered conflict diff instead of a silent overwrite. A save writes
the working tree directly; committing it is on the author, same as any other
change to the repo.

Staging validates client-side what the snapshot can prove: canonical
form, image paths against `assets`, and `[[refs]]` against the pages' `spec`
keys. Story ids stay a build-side check — the browser cannot see the Storybook index, and does
not pretend to.

New pages are created from the editor (path picker constrained to the
manual's tree); deleting a page is offered the same way.

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
  pages/                        Home, Product, Capability, Platform, Guide, Design, References, Recent, Page
  shell/                        nav sidebar, header, search, recent bell, theme toggle
test/                           grammar round-trip table, reader fixtures
demo-store/                     the small store the readers are proved against,
                                and the reading the bundled fixture is
```

Routes: `/` home, `/p/<product>`, `/p/<product>/<capability>`,
`/platform/<topic>`, `/guides/<slug>`, `/design`, `/references`,
`/references/<slug>`, `/recent`. These are canonical — a raw manual path
redirects to its canonical route, never renders beside it. `/design` and
`/recent` are pure snapshot derivations: every design card grouped by page
with its nightly verdict, and the commit feed — a flat chronology with day
separators, each row the commit's subject and chips for what it touched.
A store that is not a git checkout says so instead of showing an empty
list.

Deep links reach leaves: every heading and flow step carries an `id`, the
route expands and scrolls to `location.hash`, and each has a copy-link
control.

Navigation is computed from the pages' taxonomy + `manual.yaml` order + page
frontmatter, never hand-listed: group → product → capability, with a
product's landing page's `icon` beside its title, and one section per topic group. The icon slot is kept
whether or not a domain fills it, so one missing glyph never ragged-edges
the titles beside it; `check:manual` warns about the domain that left it
empty. The row of the page being read opens one level further, to that
page's H2s — read from the rendered page and shared with the On this
page column, so the two can never mark different sections; a product row
is a branch of pages and lists none of its own. Home groups products by
audience and gathers the topic groups under one Cross-cutting heading.

The header carries a bell against `/recent`: the badge counts events newer
than the marker this reader last stored, capped at 9+, and a reader with no
marker yet gets the newest date written silently rather than a badge
shouting the whole feed. Browser state is small and named once, in the
`STORAGE` registry (`editor/config.ts`) — the answered first-visit card (`manual.welcome`) and that seen marker
(`manual.recent.seen`). Every read and write of it tolerates storage being
switched off: a reader who cannot remember simply sees the card again and
never sees a badge.

## Checks

`check/check-manual.mjs` beside the app, wired as `check:manual` into
the lint workflow, which runs it whole on every pull request and every push
to main, and into the deploy. It reads the manual's pages and `manual.yaml`,
and nothing under `openspec/` — the store's own scripts hold its specs and
changes. Lint runs its step whatever Biome made of the same job, because a
family enforced only where an unrelated formatting error can starve it is a
family enforced nowhere. The rules:

- every page parses and is canonical
- every reference resolves: `::image` sources on disk, `::story` ids against
  the workbench build's index when available
- every product and platform topic `manual.yaml` lists has its page, every
  product a landing page, every listed guide its page; `manual.yaml` lists
  each id exactly once
- detail blocks whose titles collide fail, and so do flow cases a reader
  could not pick between and example ledgers whose balances do not add up
- the `figma` family asserts the URL's file key and node id against the
  design-sync report and validates `set=` against its keys — warnings,
  since the report mirrors a file someone else owns
- warning: a `[[ref]]` in prose that no page's `spec` names, or that names
  an item rather than a capability, scanned with the grammar's fence
  tracking, inline code skipped
- warning: a page's own prose drawing a ledger — a table headed exactly
  `Step | Event | Points | Balance`, or `When | …` — outside an
  `example`, where nothing holds its balances to their arithmetic; the
  same fence tracking, and an example's own body is never one
- warning: a page denser than `docs/prds/guides/writing-the-manual.md`
  allows, a mark read as words inside a sentence, and a domain with no
  `icon` in the rail
- a malformed Storybook index is contained as a finding, never a crash

Warnings do not live only in CI logs: the build embeds them in the
snapshot and each page shows its own.

## Later, deliberately

A `[[ref]]` picker inside the prose editor (prose authors still type ids),
table grid editing over GFM tables, paste-to-upload images, a topology block
once its data is regenerated by CI rather than committed by hand.
