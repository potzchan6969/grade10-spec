# Prompt: implement a page from a Figma frame

A ready-to-paste prompt for asking an AI agent to turn a page-level Figma frame into code composed from the existing blocks, primitives, and tokens — the page-level counterpart of [`implement-primitive-from-figma.md`](implement-primitive-from-figma.md).

It works in two places, and the deliverable differs:

- **In a consuming application checkout**, the deliverable is the page itself.
- **In this repository**, the deliverable is at most new or changed blocks plus a composition snippet — pages are not implemented here.

Copy the block, replace `<FIGMA_FRAME_URL>` and `<TARGET>` (an app path, or "this repository" when the point is new blocks), and paste it whole. Read the [notes](#why-it-is-shaped-this-way) before trimming it.

## The prompt

```text
Use the figma-page-to-code skill if it is available in this workspace; the
rules below restate it either way.

Implement the page at <FIGMA_FRAME_URL> in <TARGET>.

FIRST, before writing any code:
- Load the figma-design-to-code skill (required before get_design_context).
- Walk the frame and classify EVERY section into exactly one of:
  block (an instance of a published @grade10/ui block — name it),
  primitive (an instance of a published design-system set — name it),
  layout (a plain auto-layout frame), or
  UNMATCHED (detached instance, hand-drawn section, unpublished component).
- Also list conversion-readiness defects: detached instances, fills or gaps
  bound to no variable, non-auto-layout frames, instances overridden into
  states their component set does not define, default frame names.
- Report the inventory as a table and WAIT for my go-ahead. Do not write
  code for a page whose inventory has UNMATCHED rows — each one is either a
  design-side fix or a new-block proposal, and I decide which.

THEN compose, under these rules, none of them negotiable:
- Import only from @grade10/design-system and @grade10/ui.
- Use the Code Connect snippet for every block and primitive instance; never
  reimplement a component the inventory already named.
- Translate auto-layout frames through the layout primitives (VStack,
  HStack, Center) per docs/governance/figma-component-to-code.md, reading
  each gap from the variable the designer bound, never from measured pixels.
- Never hardcode a value a token names, and never use a variant or size the
  Figma component set does not define. If the page needs one, STOP and
  propose an OpenSpec change on the component instead.
- All content through props or the app's i18n wiring; nothing in
  packages/ui imports the message catalogs or the application.

VERIFY, and paste the real output of each:
- pnpm run lint && pnpm run typecheck
- pnpm run test:stories        (when a block was added or changed)
- Render the result, screenshot it, and compare against get_screenshot of
  the Figma frame. List the differences; do not assert a match.

STOP THERE. Do not run code-connect:publish — it writes to a shared Figma
file. Report: the final inventory table, the readiness defects for the
designer, and anything you could not verify.
```

## Variant: preflight only, run by the designer

For checking a frame's conversion readiness before handing it over — no checkout, no code:

```text
Audit the Figma frame at <FIGMA_FRAME_URL> for conversion readiness. List,
with node names: detached instances, fills/gaps/radii bound to no variable,
frames without auto-layout, instances overridden into states their component
set does not define, and frames still carrying default names. Write nothing;
this is a report for me to fix in Figma.
```

Fixing these in Figma is far cheaper than compensating for them in code, and every one of them degrades what the MCP server can tell an agent: a detached instance loses its Code Connect mapping, an unbound value loses its token, and a non-auto-layout frame loses its layout translation.

## Why it is shaped this way

**The inventory gate, before any code.** A page conversion that starts generating markup resolves every ambiguity silently — and the expensive failure is not ugly code but a private reimplementation of an existing block, off-contract and invisible to the design-sync checker, which only walks `packages/design-system`. Forcing the classification first makes "no rail exists for this section" a reported decision rather than an absorbed one.

**UNMATCHED stops the run.** A section no block covers is a product decision — a new capability spec and block, or a design-side fix — not a gap for an agent to fill with bespoke divs. This is the page-level restatement of the operative rule in [`design-code-sync.md`](../design-code-sync.md): code may not offer what design does not define, and a page may not use what no component defines.

**Publishing is carved out**, for the same reason as the primitive prompt: `code-connect:publish` writes to a shared Figma file and has no undo.

**"List the differences; do not assert a match."** A screenshot comparison summarized as "matches the design" hides exactly the drift it exists to catch. Requiring the difference list makes an empty list a claim the reviewer can spot-check.

## Keeping it current

This prompt restates rules that live in [`figma-component-to-code.md`](../figma-component-to-code.md), [`ui-component-contracts.md`](../ui-component-contracts.md), and the [`figma-page-to-code` skill](../../../.cursor/skills/figma-page-to-code/SKILL.md). Those are authoritative; this file is a convenience for pasting into an agent that has none of them loaded. When a rule changes there, update or delete the restated line — do not let the two drift and leave an agent following the stale copy.
