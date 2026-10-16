# Decisions - gallery-lens-zoom

## Goals

- A collector inspects detail without leaving the gallery: magnification
  happens in place, under the pointer.
- One magnifier contract across both galleries — `ListingLotGallery` and
  `ListingGallery` — and every surface that composes them.
- Magnification is reachable by keyboard: the lens group focuses, arrows
  move it, Escape hides it.
- Magnified copy stays out of the accessibility tree.

## Non-Goals

- No zoom dialog and no full-screen view. The Ballmac reference itself
  points full-screen viewing at a dialog; this change deliberately offers
  in-place inspection only.
- No touch magnification: a coarse or touch pointer never raises the lens,
  and no fallback dialog replaces the removed one.
- No new copy keys the consumer cannot see — `zoomInstructions` is the only
  slot added.
- No video magnification.

## Decisions

| Question | Options | Decided | Chosen Option | Rationale |
|----------|---------|---------|---------------|-----------|
| Q1: What happens to the magnifier button and zoom dialog? | Remove them entirely; keep the dialog for touch only | 2026-10-16, by constancetang | Remove them entirely | One gesture opens detail in place; a second zoom path would carry two conventions on one surface. The Ballmac lens ignores touch pointers by design, so a dialog kept only for touch would still sit idle on desktop |
| Q2: What does a touch pointer do? | Raise the lens anyway; nothing | 2026-10-16, by constancetang | Nothing | Following the Ballmac lens exactly — touch pointers are ignored so scroll and swipe keep working. Loses touch magnification; accepted as the price of dropping the dialog |
| Q3: How is the lens magnifier exposed to assistive technology? | Invisible group; focusable group named by copy | 2026-10-16, during implementation | Focusable group named by copy | Keyboard users need a focusable target; the consumer's `zoom` names it and optional `zoomInstructions` teach arrows and Escape. The magnified duplicate inside is `aria-hidden` and inert so it is not announced twice |
| Q4: Where does the magnified view come from? | Reuse the main `src`; keep `zoomSrc` | 2026-10-16, during implementation | Keep `zoomSrc` | The slot already carries a larger asset at every consumer; the lens renders it and falls back to `src`, so sources keep their existing meaning |
| Q5: Which package owns the lens? | `packages/ui` beside the galleries; `packages/design-system` as a primitive | 2026-10-16, during implementation | `packages/design-system` as a primitive | It has no product semantics — pointer tracking, keyboard steps and a magnified slot — and is exported for reuse; the galleries compose it |
| Q6: Order — spec first or code first? | Spec first; code first, spec after | 2026-10-16, by constancetang | Code first, spec after | The component landed as agreed before this record was written; this change documents the shipped contract |

## Raised

None. The touch limitation and the dropped dialog were settled before
implementation; every other question is decided above.
