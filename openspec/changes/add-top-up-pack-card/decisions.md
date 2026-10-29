## Goals

- The pack card a member picks with is a shared export, spec-anchored like
  the membership surface's blocks.
- All its words arrive through a `copy` prop; every value arrives through
  props.

## Non-Goals

- The top-up capability's product spec — packs, limits, Stripe, review —
  still has no capability spec; this change anchors the component contract
  only.
- The rest of the top-up wireframe: the dialog shell, the result page and
  Top-Up History stay preview surfaces until their design lands.
- Terms acceptance before checkout. Open on the PRD, marked against the
  "told before paying" decision.
