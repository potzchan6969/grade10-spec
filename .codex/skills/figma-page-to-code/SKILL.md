---
name: figma-page-to-code
description: Turn a page or screen drafted in Figma into code composed from existing blocks, primitives, and tokens. Use when asked to implement, build, or convert a Figma page, screen, or flow into code — before any get_design_context call on a page-level frame.
---

# Figma page to code

Use this skill when the unit of work is a **page-level frame** — a whole screen or flow a designer drafted — rather than a component set. For a component set, use the `design-system-components` skill instead; this skill will send you there the moment a section turns out to be a new component.

The premise: **a page is composition, not invention.** Everything on a well-formed page frame is an instance of a published component, a layout frame, or a token binding — each of which already has a translation rail in this repository. Your job is to ride those rails and to *stop* on anything that has no rail, because an unmatched section is a product decision (a new block, a new variant, a new token), not something a page conversion absorbs into bespoke markup.

Read [`docs/governance/figma-component-to-code.md`](../../../docs/governance/figma-component-to-code.md) for what each Figma construct becomes in code — the auto-layout and gap tables there are the layout half of this skill — and [`docs/governance/ui-component-contracts.md`](../../../docs/governance/ui-component-contracts.md) for the contract rules any new block must satisfy.

## Where the code lands

This repository is not an application. Route the output by what it is:

| The frame contains | It becomes | Where |
| --- | --- | --- |
| Instances of existing blocks and primitives, arranged | Page composition | The **consuming application**, never here |
| A reusable compound section no block covers | A new block, behind an OpenSpec change | `packages/ui/src/blocks/<capability>/` |
| A widget no primitive covers | A new primitive, via the `design-system-components` skill | `packages/design-system/src/components/` |
| A value no token names | A `tokens.json` conversation with the designer | Not your call to hardcode |

Working in this repository, the deliverable is therefore at most new or changed blocks plus their specs — plus a composition snippet the application will paste. Working in a consuming application checkout, the deliverable is the page itself, importing from `@grade10/ui` and `@grade10/design-system` only.

## Where a new block lands

`packages/ui/src/blocks/` is namespaced **by capability, never by page**. The page you are converting does not get a directory — its sections belong to the capabilities they express. For each section that becomes a block, ask: *which capability spec names, or will name, this export?*

- **The capability's directory exists** → add files there.
- **A spec exists but no directory** → create one.
- **No spec** → the section is unmatched; a `pm-planning` change mints the capability first. Never mint a directory ahead of its spec.

The filing and naming conventions — the `<product-context>-<capability>` directory slug, the capability prefix on component names, basename-shared satellite files, the spec-named barrel group, and `shared/` earned on a second consumer — are recorded in [`ui-component-contracts.md`, "Where a block lives and what it is named"](../../../docs/governance/ui-component-contracts.md#where-a-block-lives-and-what-it-is-named). Follow that section; do not improvise a layout mid-conversion — the per-page directory it prohibits is exactly the one that feels natural here.

## The inventory gate — before any code

1. Load the `figma-design-to-code` skill (mandatory before `get_design_context`), then read the frame with `get_metadata` and `get_design_context`.
2. Classify **every** section of the frame into exactly one row:
   - **Block** — an instance of a published `packages/ui` block. Code Connect names it; use the emitted snippet's component and props.
   - **Primitive** — an instance of a published design-system set. Same rule.
   - **Layout** — a plain auto-layout frame. Translate through the layout-primitive tables in `figma-component-to-code.md`: `VStack`/`HStack`/`Center`, gap read from the **bound variable**, never measured in pixels.
   - **Unmatched** — anything else: a detached instance, a hand-drawn section, a component with no published counterpart.
3. Report the table back — section name → classification → the component or primitive you intend — and **wait for a go-ahead**. Do not start coding a page whose inventory has unmatched rows; each one is either a design-side fix (reattach the instance) or a scoped proposal (a new block via `pm-planning`/OpenSpec), decided by a human.

The gate is the skill. Skipping it is how a page ships with three private reimplementations of `ProductCard`, each subtly off-contract, none reachable by the design-sync checker.

## Conversion-readiness defects — report, never absorb

While walking the frame, list these rather than compensating for them. Each is invisible in the rendered page and expensive later:

- **A detached instance.** Code Connect resolves only instances; a detached copy reads as anonymous frames and will tempt you into bespoke markup that drifts from the real component on its next change.
- **A fill, gap, or radius bound to no variable.** The same rule as off-token colours everywhere else in this repository: drift to raise with the designer, not a `gap-[13px]` to hardcode.
- **A non-auto-layout frame** (absolute positioning). It has no layout-primitive translation; confirm with the designer whether it is intentional (a genuine overlay) before reaching for raw positioning classes.
- **An instance overridden into a state its component set does not define.** A page cannot smuggle in a variant; that is the operative rule from `design-code-sync.md`, applied one level up. If the page genuinely needs the rung, that is an OpenSpec change on the component, made first.
- **Default frame names** (`Frame 427`). Names become section and component names; ask for semantic ones rather than inventing them.

## Composition rules

- Import from `@grade10/design-system` and `@grade10/ui` only. No app imports inside anything that lands in `packages/ui`.
- Layout goes through the layout primitives. A raw `flex flex-col` in `packages/ui` is a missed translation, and the `use-layout-primitives` lint plugin warns on it; the known legitimate fallbacks (breakpoint-dependent direction, real grids, absolute positioning) keep their raw classes under a `biome-ignore` with a stated reason.
- All content through props. A block never imports the message catalogs; in this repository, stories supply the content, and the consuming application wires `@grade10/i18n`.
- Never resolve a page to a component variant that does not exist, and never hand-edit generated theme CSS. Missing token → `tokens.json` + `pnpm run tokens:build`, with the designer in the loop.

## Verify

- **Produce a class-audit table before anything else**: for every element you styled, each visual utility applied → the token it resolves to → the variable Figma binds on the corresponding node (`get_variable_defs`) → match or drift. Every visual class must trace to a bound variable. One that traces to nothing is either a readiness defect (unbound in Figma — the designer's fix) or a hardcode (yours). Do this **now, not later**: you are the only party that ever holds the element↔node mapping — `check:design-system` never reaches `packages/ui`, and after the conversion the mapping evaporates. The audit is the one classname verification a block will ever get against Figma.
- **Save the mapping and machine-check the values.** The unit of audit is the **block**: each new or changed block gets one `audit.json` in its capability directory — `[{"label", "node", "classes"}, …]`, labels as `component/element` — covering the elements its conversion styled. Run `FIGMA_TOKEN=… pnpm run figma:audit -- --map <block>/audit.json` and paste its real output. It resolves each class through `tokens.json` with the same machinery as `check:design-system`, diffs against the node's REST-resolved values, exits 1 on drift, and lists what it could not check. Values, not names: a wrong token resolving to the right value passes the script but not your `get_variable_defs` column — the table and the script check different halves, so produce both. Commit `audit.json` with the block: the nightly design-sync run sweeps every block's (`figma:audit --all-blocks`), so a designer-side edit to the block's source nodes keeps surfacing long after you are gone, and a block without one shows as uncovered. Do not put page-assembly glue in a block's `audit.json` — an assembly lives in the consuming application, and its verification does too.
- For a new or changed block: stories per contract state, then `pnpm run test:stories`, `pnpm run lint`, `pnpm run typecheck`. `pnpm run check:design-system` only reaches `packages/design-system` — nothing scans block templates, so say what was not machine-checked.
- Render the result — Storybook for a block, the app dev server for a page — screenshot it, and compare against `get_screenshot` of the Figma frame. List the differences instead of asserting a match.
- Do **not** run `code-connect:publish`. It writes to a shared Figma file; hand that decision back.
