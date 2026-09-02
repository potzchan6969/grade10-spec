# Design-system workflows: which rail, which command, which owner

A router. Nine questions people actually arrive with — about tokens, primitives, blocks, pages, auditing, and who does what — each answered with the command that does it, the skill that walks it, and the document that governs it.

Nothing here restates a rule. Every row points at the document that owns it, and where this page and that document disagree, the other one is correct. Read [`figma-component-to-code.md`](figma-component-to-code.md) for the component route end to end, [`design-code-sync.md`](design-code-sync.md) for the rule book beneath it, and [`packages/design-system/DESIGN.md`](../../packages/design-system/DESIGN.md) for the token pipeline.

## Pick your row


| You want to                                                      | Go to                                                   |
| ---------------------------------------------------------------- | ------------------------------------------------------- |
| Add or change a theme, a mode, a token value                     | [Tokens](#tokens)                                       |
| Move values between Figma and the repository                     | [Tokens](#tokens)                                       |
| Know whether a thing is a primitive                              | [Primitives](#primitives)                               |
| Implement a Figma component set as code                          | [Primitives](#primitives)                               |
| Decide where a component or a view lives                         | [Blocks and views](#blocks-and-views)                   |
| Turn a page frame into code                                      | [A page from Figma](#a-page-from-figma)                 |
| Check the built UI against the design, or triage a failing check | [Auditing](#auditing)                                   |
| Know whose call something is                                     | [Who owns what](#who-owns-what)                         |
| Fix what an audit found, and close it out                        | [Following up on a finding](#following-up-on-a-finding) |


Run every command below **from the repository root**. The token and design-sync scripts live under `scripts/`, not in a package, and will not resolve from inside `packages/design-system`.

## Tokens



### Themes and modes

A theme is a **mode of the Figma `Semantic` collection**, and it becomes a CSS selector through the projection rules in [`packages/design-system/tokens.config.json`](../../packages/design-system/tokens.config.json):

```jsonc
"themes": {
  "grade10": { "out": "src/themes/grade10.css", "modes": { "Grade10": ".theme-grade10" } }
}
```

Adding a theme is therefore two edits and no new machinery: a mode in the Figma Semantic collection, and a key here naming its output file and its selector. `Foundation` and `Typography` are mode-independent and are listed under `primitiveCollections` instead.

Two things routinely surprise people, and both are recorded in that file's own notes: `default` is stock shadcn, hand-maintained in `src/themes/default.css` and deliberately outside the pipeline; and an unmapped slot does not fall back to nothing — `index.css` imports `default.css` first, so a theme inherits default's **light-mode** value for anything it does not define.

**A component's variants, sizes, and states are not tokens.** They are the Figma component set's axes, and they travel on a different rail — see [Primitives](#primitives).

### Moving values


| What moved                                                                  | Command                               | Needs a human in Figma          |
| --------------------------------------------------------------------------- | ------------------------------------- | ------------------------------- |
| A designer changed variables in Figma                                       | `pnpm tokens:pull`                    | Yes — runs the dump plugin      |
| `tokens.json` or `tokens.config.json` changed in the repository             | `pnpm tokens:build`                   | No — the only unattended leg    |
| Repository values need to reach a Figma file, or a fresh file needs seeding | `pnpm tokens:push`                    | Yes — runs the generated script |
| The plugin bundles need rebuilding                                          | `pnpm tokens:plugin <dump\|push\|seed>` | —                               |


The pull is `pnpm tokens:plugin dump` → import the manifest in the Figma desktop app → run **DS Token Dump** → download `figma-dump.json` → `FIGMA_DUMP=/absolute/path pnpm run tokens:pull`. Use an absolute path: `pull.mjs` resolves it against the repository root, not your shell's working directory.

Skill: `.cursor/skills/design-tokens/SKILL.md`. Procedure and failure table: [`figma-token-export.md`](figma-token-export.md).

- **There is no REST path in.** `GET /v1/files/:key/variables/local` needs `file_variables:read`, which Figma gates to Enterprise; the request is rejected `403 Invalid scope(s)`. Every export needs a human with the file open, by constraint rather than by choice.
- **Never hand-edit `src/theme.css` or `src/themes/grade10.css`.** They are generated; an edit there survives until the next `tokens:build` and then vanishes.
- **A green pull is not a whole file.** `pull.mjs` reads only the collections named in `tokens.config.json`; `Motion` and `Sizing` are in the Figma file and are silently ignored. Say what was skipped rather than reporting a clean sync.
- Commit the regenerated CSS **with** the `tokens.json` diff. The two are one change.



## Primitives



### Which components are primitives

Everything under `packages/design-system/src/components/{display,forms,layout,overlays,providers}/`. One primitive is one Figma component set and one basename in four files — `<name>.tsx`, `<name>.figma.ts`, `<name>.stories.tsx`, plus the published set — and the basename match is load-bearing, because the checker resolves a Figma set to code by normalizing its name and looking for `src/components/**/<name>.tsx`.

The assignment test is the three-layer table in [`ui-component-contracts.md`, "Which layer a component belongs to"](ui-component-contracts.md#which-layer-a-component-belongs-to). Two halves of it get missed:

- **"Is it compound?" is not the test.** A composite can be a primitive. `Nav` and `Footer` stay in the design system because they are store chrome, not a product item; a Figma set named `Product / …` is a block regardless of how display-ready its props are.
- **A primitive ships no store's content.** No default, fallback, or built-in value for any prop carrying a store's brand, navigation, catalog, locale, copy, or corporate attribution — those props are required, so omitting one fails type checking. A default for a variant, size, layout, or accessible name is fine.



### Implementing one

1. Designer publishes the set and says so — a Figma edit raises no event in this repository.
2. `pnpm tokens:pull` if the design introduced values, and confirm they exist in `src/themes/grade10.css`.
3. Write `<name>.tsx`, one cva option per Figma variant option and nothing more.
4. Write `<name>.figma.ts` with a `getEnum` covering **every** option of every VARIANT property.
5. Write `<name>.stories.tsx`, a story per variant plus every state the contract has.
6. `pnpm run design-sync:check` to zero errors and zero unexplained warnings.
7. `FIGMA_ACCESS_TOKEN=figd_… pnpm run code-connect:publish:design-system`.

Skill: `.cursor/skills/design-system-primitives/SKILL.md`. Ready-to-paste agent prompt for steps 3–7: [`prompts/implement-primitive-from-figma.md`](prompts/implement-primitive-from-figma.md). Rules: [`design-code-sync.md`](design-code-sync.md). Preview: `pnpm run storybook:design-system`.

`code-connect:publish:design-system` and `code-connect:publish:ui` are two commands and there is deliberately no combined one — each writes to a shared Figma file and cannot be undone, so which templates you are publishing is a thing to state rather than to inherit from a script name.

The operative rule, from the ownership table: **a component may not offer a variant or size the design does not define.** A code-only rung is a contract a consumer will ship that no designer ever drew.

## Blocks and views

Three homes, and the first that fits is the answer:


| It is                                                 | Home                                                     | Preview                                                      |
| ----------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------ |
| A primitive                                           | `packages/design-system/src/components/<group>/`         | `pnpm run storybook:design-system`                           |
| A compound block a capability spec names              | `packages/ui/src/blocks/<product-context>-<capability>/` | `pnpm run storybook:ui`                                      |
| An assembly — a page, put together once for one route | The **consuming application**                            | `apps/preview/src/pages`, via `pnpm run storybook:workbench` |


`packages/ui/src/blocks/` is one flat level of **capability** directories. The namespace is the capability, never the page: a page is an assembly, so its sections belong to the capabilities they express and the page itself never gets a directory. If the capability's directory exists, the block joins it; if the spec exists but no directory does, create one; if no spec exists, the spec comes first.

The filing conventions — the `<product-context>-<capability>` slug, the capability prefix on component names, basename-shared satellites, the per-directory `audit.json`, and the spec-named barrel group in `src/index.ts` — are in [`ui-component-contracts.md`, "Where a block lives and what it is named"](ui-component-contracts.md#where-a-block-lives-and-what-it-is-named). A page story in `apps/preview` is an example, never a contract; anything testable belongs in the capability spec.

## A page from Figma

Skill: `.cursor/skills/page-from-figma/SKILL.md`, loaded **before** any `get_design_context` call on a page-level frame. It gates on `figma:figma-design-to-code`, which ships with the official Figma plugin rather than with this repository. Prompt: [`prompts/implement-page-from-figma.md`](prompts/implement-page-from-figma.md). Layout translation tables: [`figma-component-to-code.md`, "What an auto-layout frame becomes"](figma-component-to-code.md#what-an-auto-layout-frame-becomes).

The premise is that **a page is composition, not invention**, and the mechanism is an inventory gate before any code: classify every section as **Block**, **Primitive**, **Layout**, or **Unmatched**, report the table, and wait for a go-ahead. An unmatched row is a product decision — a new block behind a `pm-planning` change, a new primitive, or a `tokens.json` conversation — never something a page conversion absorbs into bespoke markup.

Conversion-readiness defects are reported, not compensated for: a detached instance, a fill or gap bound to no variable, a non-auto-layout frame, an instance overridden into a state its set does not define, a `Frame 427` name.

Where the output lands depends on the checkout. In a consuming application it is the page. **In this repository it is at most new or changed blocks plus a composition snippet the application pastes** — pages are not implemented here.

## Auditing



### Two rails, and both are needed

```bash
FIGMA_TOKEN=figd_… pnpm run design-sync:check                    # variant sets: Figma axes ↔ cva ↔ Code Connect
FIGMA_TOKEN=figd_… pnpm run design-sync:audit --all-blocks       # arbitrary nodes, against each directory's audit.json
FIGMA_TOKEN=figd_… pnpm run design-sync:audit -- --map packages/ui/src/blocks/<capability>/audit.json
FIGMA_TOKEN=figd_… pnpm run design-sync:audit --node <figma-url> # dump one node's resolved values
```

`design-sync:check` walks both package trees and diffs the component set's axes, the `cva()` config, and the Code Connect template between them. It takes no arguments and cannot be scoped to one component.

`design-sync:audit` covers what has no set to diff — blocks, and primitives with no variant axes. Its input is the element↔node mapping the converting agent emits as a per-directory `audit.json` (`[{ "label": "hero/cta", "node": "<figma url>", "classes": "…" }, …]`), which exists because that mapping lives only in the head of whoever did the conversion and evaporates afterwards. A directory with no `audit.json` is listed as **uncovered**, not passed. Changing a class in a block means updating its audit entry in the same edit — a freshness test in the package suite fails when the two diverge.

CI: **Actions → Design sync**, nightly at 01:00 UTC. That is the run that matters, because a Figma edit raises no event here; push and pull-request runs only catch drift a code change happens to walk into. Re-check on demand with **Run workflow**.

Skill, including a symptom-to-cause triage table for every message either script emits: `.cursor/skills/design-sync-check/SKILL.md`.

### What a clean run does not say

Recorded so they are not mistaken for coverage. The full lists are in [`design-code-sync.md`, "Known gaps"](design-code-sync.md#known-gaps) and the header comment of `scripts/design-sync/audit-node.mjs`.

- **Base states only.** Hover, disabled, and loading values are never compared. An opacity-based disabled state is doubly invisible — the `bg-*` token this compares is unchanged by it.
- **The variant's own box only.** Label colour, icon size, borders, and anything inside the component are unchecked.
- **Classes, not rendered pixels.** Values come from the utility classes the code declares, not from a rendered page. Nothing here is a visual-regression rail.
- **Values, not names.** REST resolves every variable binding before it serializes, so a *wrong token that resolves to the right value passes*. Variable names need `file_variables:read`, which is Enterprise-gated — the in-session `get_variable_defs` audit remains the stronger check, and the class-audit table and the script deliberately check different halves.
- **`✗ No Figma source` is exit 1 with nothing checked**, not a degraded run. Never report a component verified off a run that never reached Figma. `FIGMA_DUMP=` is the manual fallback and carries no variant nodes: names only, no colour or geometry.
- **A skipped CI run is not a passing run.** Forks and Dependabot cannot read secrets and emit a warning annotation.
- **The prop check is textual containment, not type resolution**, and descriptions are compared by first sentence only.
- **Design-system stories are smoke-only.** The whole suite once passed with `{children}` deleted from the component. `packages/ui` stories do use `play` functions; adopting that in the design system is still open.

`FIGMA_TOKEN` (scope `files:read`) is not `FIGMA_ACCESS_TOKEN` (Code Connect publishing, different scope). Neither substitutes for the other; see `.env.example`.

## Who owns what


| Decision                                | Owner               | Recorded in             |
| --------------------------------------- | ------------------- | ----------------------- |
| Which variants, states, and sizes exist | Designer            | The Figma component set |
| What the values are                     | Designer            | `tokens.json`           |
| How the contract is implemented         | Designer / Engineer | `<name>.tsx`            |
| The name mapping between the two        | Designer / Engineer | `<name>.figma.ts`       |
| Proof each contract state renders       | Designer / Engineer | `<name>.stories.tsx`    |
| The projection rules                    | Engineer            | `tokens.config.json`    |


Each artifact is the sole authority over exactly one thing and no artifact owns two — the table in [`design-code-sync.md`, "Ownership"](design-code-sync.md#ownership), with the designer's pre-flight checklist at ["For designers: before you create or change a component"](design-code-sync.md#for-designers-before-you-create-or-change-a-component).

On the specification side the split is a handoff, not a hierarchy. **A PM or designer writes the proposal and the specs and stops there** — `openspec new change <name> --schema pm-planning`, skill `.cursor/skills/pm-planning/SKILL.md`. `design.md`, `ui.md`, and `tasks.md` belong to the engineer planning the delivery, who **promotes** the change by setting `schema: full-planning` and adding those files (skill `.cursor/skills/full-planning/SKILL.md`, after `pnpm run plan:preflight <change-id>`). Promotion is the only route, because engineering never opens a change in the application repository.

Owners are claimed at pickup, never assigned at planning time: `pnpm plan claim` / `unclaim` / `done` / `undone` run from the application repository and write through to this store. A checkmark goes in after the code is pushed, not when it is written. Format, the who-writes-what table, and the silent parser failures: [`task-ownership.md`](task-ownership.md).

## Following up on a finding

**Settle which side is right before editing either.** A value row is not automatically a code bug; the code may be right and the Figma file stale.


| The finding                                                              | What closes it                                                             |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| Code drifted from what Figma already draws                               | A plain commit reconciling the code                                        |
| Figma is wrong                                                           | A message to the designer — never a code edit that hides it                |
| An option renamed or dropped, or a mismatch you are deliberately keeping | An OpenSpec change naming the exact exports and the consuming applications |


Never resolve a mismatch by editing the `.figma.ts` template to agree with the code. The template maps names; papering over a disagreement there deletes the only evidence of it. A warning you intend to keep belongs in a change with a reason, not in the run log.

Then the normal loop: if the statement is testable it belongs in `openspec/specs/<product>/<capability>/spec.md`, reached through an `openspec/changes/` delta; if it explains a product judgment that outlives the change, it belongs in the capability page's `Product decisions` block ([`prd-and-openspec.md`, "Fast decision guide"](prd-and-openspec.md#fast-decision-guide)). Implement with `.cursor/skills/openspec-apply-change/SKILL.md`, keep the checkboxes honest, derive QA coverage with `/spec-to-tcs` and `/tcs-review` ([`specs-to-test-cases.md`](specs-to-test-cases.md)), and close out with `.cursor/skills/openspec-archive-change/SKILL.md` into `openspec/changes/archive/YYYY-MM-DD-<change-name>/`.

Before handing off:

```bash
pnpm run design-sync:check        # after a primitive or a block changed
pnpm run design-sync:audit --all-blocks
pnpm run tokens:build             # after tokens.json or tokens.config.json changed
pnpm run lint
pnpm run typecheck
pnpm run test:stories
pnpm run agent:check-parity       # after agent instructions, rules, or skills changed
```



## Related reading

- [`figma-component-to-code.md`](figma-component-to-code.md) — the component route, step by step, with the owner of each step.
- [`design-code-sync.md`](design-code-sync.md) — the rule book: ownership, what the checker enforces, the designer's checklist, known gaps.
- [`ui-component-contracts.md`](ui-component-contracts.md) — layers, block filing and naming, contract design.
- [`figma-token-export.md`](figma-token-export.md) — the token pull, its setup, and its failure table.
- [`prd-and-openspec.md`](prd-and-openspec.md) and [`task-ownership.md`](task-ownership.md) — where a requirement lives, and who is on it.
- [`agent-workflow-example.md`](agent-workflow-example.md) — one feature walked through both repositories, end to end.

