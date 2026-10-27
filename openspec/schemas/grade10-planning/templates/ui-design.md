<!-- Screens, Components and States - no other section. Words live in
     packages/i18n or the feature's *-content.ts and flows in click-through
     stories, so a Copy or Flows section here would be a second copy. -->

## Screens

<!-- One subsection per user-facing surface. Link the Figma frame - never describe a screen in prose -->

## Components

<!-- Design-system primitives and packages/ui exports each screen composes,
     named exactly. Flag what does not exist yet as work in this repo: a
     component, a variant, a token, or a word packages/i18n has to answer in
     every language of its layer. Name the export, never its variant, size,
     tone, class or pixel value: the frame carries those to whoever builds
     it. -->


## States

<!-- One ### per screen. One row per state — never three states in one cell.

| State | Shows | Anchor |
| --- | --- | --- |
| Empty catalogue | No tiles; retry control | `g10.store-product-listing.US2` |
| Offline retry | Connectivity banner with retry | `g10.store-product-listing.US2` |

     State is the short name. Shows is what is on screen — controls, copy,
     what is hidden. Anchor is the journey id from user-journeys.md, or a
     ## Feature set root group, copied in backticks from the heading that
     issues it. NEVER a scenario id here — this file is written before the
     scenarios exist, and `pnpm check:manual` refuses an id the store issues
     nowhere.

     Walk the usability categories for every screen — default, loading,
     empty, error, validation, busy, success, not allowed, partial, boundary
     content, narrow, keyboard and focus — and write a row for each one the
     screen can reach. Every row is a story named with its State words, whose
     `play` interaction test asserts what Shows says; a state reached by
     acting is reached by that `play`, from the default.

     The requirements' second pass closes every row on the row itself: replace
     Anchor with the scenario id it became, in backticks, or
     **Out of suite:** naming where the state is stated instead. Nothing else
     closes one, and `pnpm check:manual` names a row that does neither. One
     cell holding three states can be closed by one scenario and look
     complete, which is why the table is one state per row. -->
