# 001 — Add a 1px press translate to Pagination controls

- **Status**: DONE
- **Commit**: `057d2a5` (working tree also has uncommitted Pagination edits; if the excerpts below do not match the file you open, STOP and report)
- **Severity**: LOW
- **Category**: Missed opportunities (press feedback) / Physicality
- **Estimated scope**: 1 file, ~3 class-string edits

## Problem

Clickable Pagination controls (page numbers, previous, next) confirm press only with `active:bg-accent`. There is no physical press. Figma’s pressed variants bind `Opacity/opacity-80`; that treatment was rejected — pressed must not change opacity. Button and Icon Button already confirm press with a 1px downward translate.

`packages/design-system/src/components/display/pagination.tsx:28-32` — current:

```tsx
const paginationControlClassName =
  "inline-flex size-10 shrink-0 items-center justify-center rounded-(--radius-md) text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:text-disabled-foreground disabled:opacity-50 aria-disabled:pointer-events-none";

const paginationIdleClassName =
  "cursor-pointer border border-border text-foreground hover:bg-accent active:bg-accent";
```

`paginationIdleClassName` is the clickable surface: `PaginationLink` when `isActive` is false (`pagination.tsx:49-51`), `PaginationPrevious` (`pagination.tsx:139-142`), and `PaginationNext` (`pagination.tsx:176-179`). The current page is a `<span>` and does **not** get `paginationIdleClassName`.

Disabled controls already have `disabled:pointer-events-none`, so they will not receive `:active` from a pointer.

## Target

Match Button’s press language, not AUDIT.md’s `scale(0.97)` recipe. Button (`packages/design-system/src/components/forms/button.tsx:14`) uses:

```
active:not-aria-[haspopup]:translate-y-px
```

Pagination has no `aria-haspopup`; keep the same selector anyway so the press recipe stays identical.

Do **not** copy Button’s `transition-all`. Animate only color + transform.

Exact end state on **clickable** controls (`paginationIdleClassName` only):

```tsx
const paginationIdleClassName =
  "cursor-pointer border border-border text-foreground transition-[background-color,border-color,color,transform] duration-150 ease-out hover:bg-accent active:bg-accent active:not-aria-[haspopup]:translate-y-px motion-reduce:transition-[background-color,border-color,color] motion-reduce:active:translate-y-0";
```

Values (do not approximate):

| Property | Value | Why |
| --- | --- | --- |
| Press transform | `translate-y-px` (1px down) | Same utility as Button / Icon Button |
| Press duration | `150ms` (`duration-150`) | Inside the 100–160ms press budget; same as Tailwind’s default duration that Button already uses |
| Press easing | `ease-out` | Press feedback uses ease-out |
| Press fill | `active:bg-accent` (unchanged) | Color, not opacity |
| Press opacity | **none** | Do not add `active:opacity-*` |
| Reduced motion | drop the translate (`motion-reduce:active:translate-y-0`), keep the fill (`motion-reduce:transition-[background-color,border-color,color]`) | Movement off, comprehension on |

Leave `paginationControlClassName` with `transition-colors` for the current-page `<span>`. `cn(paginationControlClassName, paginationIdleClassName)` puts the idle transition second, so tailwind-merge will replace `transition-colors` on clickable buttons. That is intended.

Do not add `translate-y-px` to the current-page branch (`isActive` → `<span>` at `pagination.tsx:55-66`). That control is not clickable.

Do not change disabled opacity (`disabled:opacity-50` on the shared class). That is the disabled token, not press.

## Repo conventions to follow

- Press recipe lives on Button and Icon Button as `active:not-aria-[haspopup]:translate-y-px`. Imitate that utility, not a scale.
- Button exemplar: `packages/design-system/src/components/forms/button.tsx:14` — `… transition-all … active:not-aria-[haspopup]:translate-y-px …`
- Icon Button exemplar: `packages/design-system/src/components/forms/icon-button.tsx:12` — same `active:not-aria-[haspopup]:translate-y-px`
- This package has no `--ease-out` / `--duration-*` motion tokens in `theme.preamble.css`. Do not invent a token for this one control. Use Tailwind `duration-150` and `ease-out`.
- Pagination already uses two shared class strings. Put press on `paginationIdleClassName` so previous, next, and inactive page links stay in lockstep.

## Steps

1. In `packages/design-system/src/components/display/pagination.tsx`, replace `paginationIdleClassName` with the target string in **Target**. Do not add opacity utilities. Do not touch `paginationControlClassName` except if a comment still describes pressed as an opacity change — update that comment to: pressed is the hover accent fill plus a 1px translate matching Button, with no opacity change.

2. Confirm `PaginationLink` still applies `paginationIdleClassName` only when `isActive` is false. Do not add the idle class to the `<span>`.

3. Do not edit `pagination.figma.ts`, `pagination-*.figma.ts`, stories, ProductBrowse, Button, or Icon Button.

## Boundaries

- Do NOT touch `packages/design-system/src/components/forms/button.tsx` or `icon-button.tsx`.
- Do NOT touch `packages/ui/src/blocks/store-product-listing/`.
- Do NOT change markup (keep the current-page `<span>`, keep `<button>` for clickable controls).
- Do NOT add `active:opacity-*` or `active:scale-*`.
- Do NOT switch press to `scale(0.97)` even though AUDIT.md lists that as the generic press recipe — this plan matches Button’s 1px translate.
- Do NOT add `transition-all`.
- Do NOT add motion tokens to `theme.preamble.css` / `tokens.json`.
- Do NOT add dependencies.
- If `paginationIdleClassName` no longer exists or already contains `translate-y-px`, STOP and report.

## Verification

- **Mechanical**: from the repo root,
  - `pnpm --filter @grade10/design-system run typecheck`
  - `pnpm run lint`
  - `pnpm run test:stories:design-system`
  Expected: all pass. Lint warnings on unrelated `flex-col` stacks are pre-existing; do not “fix” them.
- **Feel check**: `pnpm run storybook:design-system`, open **Components/Pagination → Default** (switch Theme toolbar to **Grade10**):
  - Press page **2**, **3**, **10**, and **Next**. Each control must drop **1px** on press and return on release. Fill may go to accent; **opacity must not change**.
  - Press the current page **1** (a span). It must **not** translate.
  - Press disabled **Previous**. It must **not** translate (pointer-events none).
  - Spam press/release on **Next**. The 1px must retarget from the current position (CSS transition), not restart from rest via keyframes.
  - In DevTools Animations panel, set playback to 10%: the translate lasts ~150ms and eases out (fast start). The control never fades.
  - Rendering panel → emulate `prefers-reduced-motion: reduce`: press still changes fill to accent; the 1px translate is gone.
- **Done when**: clickable page / prev / next buttons use `active:not-aria-[haspopup]:translate-y-px` and `duration-150 ease-out`; no `active:opacity-*` on those strings; current page and disabled controls do not move; reduced-motion drops only the translate.
