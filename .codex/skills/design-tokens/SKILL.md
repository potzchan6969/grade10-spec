---
name: design-tokens
description: Move design token values between Figma and the repository - pull a designer's variable changes in, rebuild the theme CSS, or push token values back to a Figma file. Use when design changed a colour, radius, or spacing value, when the theme CSS is stale or wrong, when `tokens.json` or `tokens.config.json` is edited, when seeding a fresh Figma file, when running `tokens:pull`, `tokens:build`, `tokens:push`, or `tokens:plugin`, or when landing a `figma-dump.json` export. For a component's variants, sizes, or states, use `design-system-components` instead.
---

# Design tokens

`packages/design-system/tokens.json` is the source of truth for token **values** and is designer-owned. `tokens.config.json` holds the engineer-owned projection rules. Figma and the theme CSS are both *projections* of `tokens.json`, never sources.

Read [`packages/design-system/DESIGN.md`](../../../packages/design-system/DESIGN.md) for the pipeline as a whole and [`docs/governance/figma-token-export.md`](../../../docs/governance/figma-token-export.md) for the pull procedure and its failure table. Nothing below restates either — this skill says which leg you are on and what goes wrong on it.

**Never hand-edit `src/theme.css` or `src/themes/grade10.css`.** They are generated. A change made there survives until the next `tokens:build` and then vanishes, which is a worse failure than not making it. `src/themes/default.css` is stock shadcn, hand-maintained, and outside this pipeline entirely.

## Pick the leg first

| What moved | Leg | Needs a human in Figma |
| --- | --- | --- |
| A designer changed variables in Figma | `pnpm tokens:pull` | Yes — runs the dump plugin |
| `tokens.json` or `tokens.config.json` changed in the repo | `pnpm tokens:build` | No — the only unattended leg |
| Token values in the repo need to reach a Figma file, or a fresh file needs seeding | `pnpm tokens:push` | Yes — runs the generated script |
| A component gained a variant, size, or state | Not this skill — `design-system-components` | — |

Conflating these is the usual confusion. Publishing a component set moves no values, the token sync adds no variants, and `tokens:import` on its own leaves the CSS stale.

Run every leg **from the repository root**. They are root scripts under `scripts/tokens-sync/`, not package scripts, and will not resolve from inside `packages/design-system`.

## Pulling designer edits in

There is no REST path. `GET /v1/files/:key/variables/local` needs `file_variables:read`, which Figma gates to Enterprise and this org does not have — the request is rejected `403 Invalid scope(s)`. Do not go looking for an API route; `pull.mjs` deliberately has none. The cost is that **every export needs a human with the file open**, by constraint rather than by choice.

1. **Confirm which file.** The plugin runs against whichever file is open. Nothing selects a file over the network, and `tokens.config.json → figmaFile` is documentation, not routing.
2. **`pnpm tokens:plugin dump`**, then in the Figma desktop app: Plugins → Development → Import plugin from manifest… → `scripts/tokens-sync/figma-plugins/build/dump/manifest.json`. One-time per person — the build directory is gitignored. The dump bakes in no data, so an import from months ago is not stale; `push` and `seed` do bake values and must be rebuilt whenever `tokens.json` changes.
3. **Run DS Token Dump and read the collection summary before clicking anything.** A missing collection or an unfamiliar mode name is the failure the next section describes, and it is far cheaper to see here than after the pull.
4. **Download `figma-dump.json`.** If Download does nothing, use Copy and paste into a file — some plugin windows block the blob download.
5. **`FIGMA_DUMP=/absolute/path pnpm run tokens:pull`**. Use an absolute path: `pull.mjs` resolves it against the repository root, not your shell's working directory, so a relative path silently reads the wrong file. An unquoted `~` works because the shell expands it first; quote it and it will not.
6. **`git diff packages/design-system/tokens.json`** is the designer's change in reviewable form. Read it before committing, and **commit the regenerated CSS with it** — the two are one change.

**A green pull does not mean the whole file landed.** `pull.mjs` reads only the collections named in `tokens.config.json`. `Motion` and `Sizing` are in the Figma file and are silently ignored; `Sizing` models modes as size variants that must coexist on one page, which the one-selector-per-mode theme model cannot express. Wiring it up is tracked separately. Say what was skipped rather than reporting a clean sync.

## Pushing values back

`pnpm tokens:push` writes `scripts/tokens-sync/figma-plugins/build/push.gen.js`; a human runs it inside Figma. Prefer `pnpm tokens:plugin push` and import the manifest over driving it through `use_figma` — the MCP bridge executes against whichever file the Figma plugin is bound to, which is not always the one you asked for, and an imported plugin runs in the file you have open with no binding to get wrong. Open Plugins → Development → Open console first: the headline lands in a toast, the full JSON in the console.

Push matches live variables by normalized name and **updates in place**, so a round trip is lossless and the primitive→semantic alias graph survives. It creates whatever is missing, which is why the same command also seeds an empty file. It creates only COLOR and FLOAT variables — a new STRING token is reported as unconvertible rather than guessed at, so add those in Figma by hand.

This is a write to a shared file. Confirm the target before running it, not after.

## Failures that have already cost something here

- **A renamed Figma mode exits 1 on purpose.** It used to warn and exit 0, writing `themes: {}`; the build then *skipped* rewriting the theme CSS, leaving a stale file pointing at primitives the same run had just renamed. That builds and lints clean and only shows up in a browser. Fix `themes.<name>.modes` or rename the mode back — do not route around the failure. A failed pull leaves `tokens.json` untouched.
- **A key collision across collections is a hard failure naming both.** `Size/size-4` and `Typeset/size-4` normalize to the same key and share one `:root`, so the pull stops rather than picking a winner. Rename one in Figma.
- **`FIGMA_TOKEN` is not `FIGMA_ACCESS_TOKEN`.** The first is `design-system:check` and needs `files:read`; the second is Code Connect publishing and needs Code Connect write. **Neither is used by the token pull**, which reads a dump file. A token in the environment is not a substitute for the plugin run.
- **A token that exists only in `.theme-grade10`** — the `Custom/*` extensions — renders as an undefined custom property under the baseline theme. When a component adopts one, add a derived baseline value to `default.css` in both `:root` and `.dark`.
- **Never sync from a `.pen` file.** A Pencil flow predated this pipeline and diverged; the `designs/` directory was removed in August 2026 and Figma is the only design source. A `.pen` pull would revert the Figma work.

## The ownership boundary

Designers own values in Figma and land them through `tokens:pull` → PR. Engineers own `tokens.config.json` — the `slotMap`, the selectors, the collection names — and any code-only theme. `tokens.json` is the git merge point: two people editing the same token is a normal PR conflict for a human to resolve, and there is no automatic value merge.

A token change is values only. If the work also moves a component's axes or options, that is a contract change — hand off to `design-system-components` and read [`docs/governance/design-code-sync.md`](../../../docs/governance/design-code-sync.md) for what the checker enforces.
