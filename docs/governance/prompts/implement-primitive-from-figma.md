# Prompt: implement a primitive from a Figma component set

A ready-to-paste prompt for asking an AI agent to carry out steps 3–7 of ["Creating a component"](../design-code-sync.md#creating-a-component) — write the implementation, the Code Connect template, and the stories, then verify.

Copy the block, replace `<FIGMA_URL>` and `<group>`, and paste it whole. Read the [notes](#why-it-is-shaped-this-way) before trimming it.

## The prompt

```text
Use the design-system-components skill.

Implement the Figma component set at <FIGMA_URL> as a primitive in
packages/design-system. It is published to the team library.

FIRST, before writing any code:
- Load the figma-design-to-code skill (required before get_design_context).
- Read the set's VARIANT properties and every option of each, plus its TEXT
  and INSTANCE_SWAP component properties.
- Report the axes back to me as a table (Figma property -> options -> the cva
  axis and option keys you intend) and WAIT for my go-ahead. Do not guess an
  axis from a screenshot.

THEN build, in this order (docs/governance/design-code-sync.md, "Creating a
component"):
3. src/components/<group>/<name>.tsx — one cva option per Figma option and
   nothing more. Basename must match the normalized Figma set name; the
   checker resolves a set to code by that name alone. Open its JSDoc with
   the SET's Figma description (never a variant's); if it is empty or only
   library search keywords, write a real one and say so in your report.
4. <name>.figma.ts — a getEnum covering EVERY option of EVERY variant
   property. An unmapped option resolves to undefined and emits broken code.
   Axis names need not match; the checker infers them through the mapping.
   Omit props that are the cva default from the emitted snippet.
5. <name>.stories.tsx — a story per cva option, plus disabled, loading, and
   every other contract state. An argTypes entry does not count as coverage.

RULES, none of them negotiable:
- Never offer a variant or size the Figma set does not define.
- Never hand-edit src/theme.css or src/themes/grade10.css. If a token is
  missing, edit tokens.json and run pnpm run tokens:build.
- If a Custom/* token is used, add a derived baseline to default.css in both
  :root and .dark, or it renders unstyled outside .theme-grade10.
- If Figma and code genuinely disagree, STOP and propose an OpenSpec change.
  Never resolve a mismatch inside the .figma.ts template.

VERIFY, and paste the real output of each:
- FIGMA_TOKEN=… pnpm run check:design-system   (zero errors, zero
  unexplained warnings; a warning you intend to keep needs a stated reason)
- pnpm run test:stories:design-system
- pnpm run lint && pnpm run typecheck

STOP THERE. Do not run code-connect:publish — it writes to a shared Figma
file. Tell me it is ready and I will decide.

Report: the final Figma->cva axis table, any warning left standing with its
reason, and anything you could not verify.
```

## Variant: the component already exists

For steps 5–6 alone, when `<name>.tsx` and `<name>.figma.ts` are already written:

```text
Use the design-system-components skill. <ComponentName> already has
<name>.tsx and <name>.figma.ts. Add <name>.stories.tsx with a story per cva
option plus every contract state, then run pnpm run test:stories:design-system
and FIGMA_TOKEN=… pnpm run check:design-system to zero errors and zero
unexplained warnings. Paste real output. Do not publish Code Connect.
```

## Why it is shaped this way

Three parts are load-bearing. Trim them and the prompt stops guarding the failures this repository has actually had.

**The axis table gate, before any code.** Putting a value on the wrong axis is the defect the whole checker exists to catch, and it is cheapest to catch in one sentence rather than after three files are written. It also forces the agent to read the component *properties* rather than infer a variant list from a screenshot, which is how a state gets mistaken for a type.

**Publishing is carved out.** `code-connect:publish` writes to a shared Figma file and has no undo, which is why [`design-code-sync.md`](../design-code-sync.md#publishing-code-connect) frames it as a deliberate step rather than something a merge triggers. An agent should hand that decision back, not take it.

**"Paste the real output."** `check:design-system` skips with a warning annotation when `FIGMA_TOKEN` is unavailable, and a plugin dump reaches the end of the run while checking names only. Both look like success in a summary. Requiring the output makes the difference visible.

## Keeping it current

This prompt restates rules that live in [`design-code-sync.md`](../design-code-sync.md) and in the [`design-system-components` skill](../../../.cursor/skills/design-system-components/SKILL.md). Those two are authoritative; this file is a convenience. When a rule changes there, either update the paste block or delete the restated line and let the skill carry it — do not let the two drift and leave an agent following the stale copy.
