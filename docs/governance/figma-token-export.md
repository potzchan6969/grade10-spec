# Exporting tokens from Figma

How to get the variables out of the Figma file and into `tokens.json`, using the dump plugin in [`scripts/tokens-sync/figma-plugins/plugin-src/dump/`](../../scripts/tokens-sync/figma-plugins/plugin-src/dump/).

This is the design → code leg of the token pipeline, and step 5 of [`figma-component-to-code.md`](figma-component-to-code.md#the-route-step-by-step). [`packages/design-system/DESIGN.md`](../../packages/design-system/DESIGN.md) covers the pipeline as a whole and the other two legs; this document is the procedure for this one.

## Why a plugin and not an API call

`GET /v1/files/:key/variables/local` requires the `file_variables:read` scope, which Figma gates to Enterprise. On this plan the token request is rejected outright — `403 Invalid scope(s)` — so `pull.mjs` has no REST path at all.

The Plugin API has no such gate. The dump plugin reads the same variables through `figma.variables.getLocalVariablesAsync()` and hands back the exact `{ meta }` shape REST would have returned, which is why `pull.mjs` can treat the two as interchangeable and why nothing downstream knows the difference.

The cost is that **every export needs a human with the file open**. There is no unattended or CI path for token values, by constraint rather than by choice.

## One-time setup

The built plugin folder is gitignored (`.gitignore:32`), so each person builds their own. From `packages/design-system`:

```bash
pnpm tokens:plugin dump          # -> scripts/tokens-sync/figma-plugins/build/dump/
```

That writes `code.js`, `ui.html`, and a generated `manifest.json`. Then in the Figma desktop app: **Plugins → Development → Import plugin from manifest…** → `scripts/tokens-sync/figma-plugins/build/dump/manifest.json`. It appears as **DS Token Dump**.

You only rebuild when the plugin source itself changes. Unlike `tokens:plugin push` and `seed`, which wrap a generated script with token values baked in, the dump bakes in no data — `build-plugin.mjs` copies the hand-written source verbatim and only generates the manifest. A dump plugin imported months ago is not stale.

## Exporting

1. Open the Figma file you want to read. **The plugin runs against whichever file is open** — nothing selects a file over the network, and `tokens.config.json → figmaFile` does not route this. Confirm you are in the right file yourself.
2. **Plugins → Development → DS Token Dump.**
3. Read the summary at the top of the window before doing anything else. It lists every local collection as `Foundation — 204 vars, modes: Mode 1`, then a component count. If a collection you expected is missing or a mode is named differently than you remember, stop here — that is the failure the next section describes, and it is cheaper to see now than after the pull.
4. Click **Download figma-dump.json**. It lands in your Downloads folder.

**If Download does nothing** (some plugin-window configurations block the blob download), use **Copy** and paste into a file yourself. The button uses `document.execCommand` on a selection rather than the Clipboard API, which is blocked inside the plugin iframe.

## Landing it in the repository

```bash
FIGMA_DUMP=/absolute/path/to/figma-dump.json pnpm run tokens:pull   # import + build
git diff packages/design-system/tokens.json                          # what design changed
```

`tokens:pull` is `tokens:import && tokens:build`: the dump becomes `tokens.json`, and `tokens.json` is projected to `src/theme.css` and `src/themes/grade10.css`. Review the `tokens.json` diff — that is the designer's change in reviewable form — and **commit the regenerated CSS with it**. Never hand-edit either generated file.

**Use an absolute path.** `pull.mjs` resolves `FIGMA_DUMP` against the repository root, not your shell's working directory, so a relative path silently looks in the wrong place. `FIGMA_DUMP=~/Downloads/figma-dump.json` works unquoted because the shell expands the tilde before Node sees it; quote it and it will not.

Every leg is a root script (`scripts/tokens-sync/`), so all of them run from anywhere in the repository. The Figma legs still need a human driving a plugin inside Figma; only `tokens:build` runs unattended.

## The same dump also feeds the component checker

`meta.components` is additive: the plugin walks every page and records each component set with its `componentPropertyDefinitions`. `pull.mjs` reads only `.variables` and `.variableCollections` and ignores it entirely.

```bash
FIGMA_DUMP=/absolute/path/to/figma-dump.json pnpm run design-system:check
```

This is the **fallback** path, not the normal one. `design-system:check` prefers `FIGMA_TOKEN`, which needs only `files:read` — the Enterprise gate applies to variables, not to component definitions, so that check runs unattended in CI even though the token pull cannot. A dump carries no variant nodes, so colours and geometry go unchecked; the run says so rather than reporting clean:

> `dump …/figma-dump.json carries no variant nodes, so colours and geometry went unchecked. Use FIGMA_TOKEN for the value checks.`

## What is and is not exported

The plugin dumps **every** local collection. `pull.mjs` then reads only the ones named in `tokens.config.json` — each entry of `primitiveCollections` plus `semanticCollection`, currently `Foundation`, `Typography` and `Semantic`.

| In the dump file | Reaches `tokens.json`? |
| --- | --- |
| `Foundation`, default mode | Yes → `primitives` |
| `Typography`, default mode | Yes → `typography` |
| `Semantic`, the mode named per theme in `tokens.config.json` | Yes → `themes.<name>.tokens` |
| `Motion`, `Sizing` | **No.** Silently ignored. |
| Any other collection | **No.** Silently ignored. |
| A second mode of a configured collection | **No.** One Figma mode per configured theme. |
| Variable descriptions | Yes → `$description`, omitted when blank |
| `meta.components` | Not by the pull; read by `design-system:check` |

`Sizing` is the notable absence. It models modes as *size variants* (`default`/`sm`/`xs`) that must coexist on one page, which the config's one-selector-per-mode theme model cannot express. Wiring it up is tracked separately — **a green `tokens:pull` does not mean the whole file landed.**

`src/themes/default.css` is stock shadcn, hand-maintained and deliberately outside this pipeline entirely.

## When it fails

Every one of these exits non-zero and writes nothing, so a failed pull leaves `tokens.json` untouched.

| Message | Cause | Fix |
| --- | --- | --- |
| `No dump given. Set FIGMA_DUMP=<file.json>` | Ran `tokens:import`/`tokens:pull` with no dump | Export one, or pass an absolute path |
| `Collection not found. Available: …` | A collection was renamed in Figma, or you dumped the wrong file | Match `tokens.config.json` to the listed names, or re-dump the right file |
| `theme "grade10": Figma mode "…" not found` | A designer renamed a Semantic mode | Update `themes.<name>.modes`, or rename it back |
| `Name collision in Semantic / …: "Base/card" and "Sidebar/card" both normalize to "card"` | Two grouped Figma names normalize to one token key — `key()` drops the group prefix | Rename one in Figma |
| `Dangling alias -> VariableID:…` | A variable aliases one that is not in the dump | Usually a cross-file alias; make the target local |
| `This dump has no meta.components — it predates component support` | A dump taken before the plugin recorded components | `pnpm tokens:plugin dump` and re-export |

The renamed-mode case is a hard failure on purpose. It used to warn and exit 0, which wrote `themes: {}`; `tokens:build` then *skipped* rewriting the theme CSS, leaving a stale file on disk pointing at primitives the same run had just renamed. That builds and lints clean and only shows up in a browser.

## Changing the plugin

The source is hand-written and lives at `scripts/tokens-sync/figma-plugins/plugin-src/dump/` — `code.js` (the export) and `ui.html` (the window). There is nothing in `tokens.json` from which a *read* could be derived, which is why this one is not generated.

Edit the source, then `pnpm tokens:plugin dump` to copy it into `build/dump/`; `build-plugin.mjs` runs a `new Function(...)` parse check on the way, so a syntax error surfaces at the terminal rather than inside Figma. Figma picks up the rebuilt file on the next run — no re-import needed. Keep the output shaped like the REST `{ meta }` response; that equivalence is the only reason `pull.mjs` needs no second code path.

Note that the manifest sets `documentAccess: "dynamic-page"`, so pages load lazily and the component walk must `await page.loadAsync()` before traversing. Dropping that returns an empty component list rather than an error.

## Related reading

- [`packages/design-system/DESIGN.md`](../../packages/design-system/DESIGN.md) — the whole token pipeline: `tokens:import`, `tokens:build`, `tokens:push`, the ownership boundary, and round-trip guarantees.
- [`figma-component-to-code.md`](figma-component-to-code.md) — where this step sits in the component handover.
- [`design-code-sync.md`](design-code-sync.md) — what `design-system:check` enforces once the tokens have landed.
