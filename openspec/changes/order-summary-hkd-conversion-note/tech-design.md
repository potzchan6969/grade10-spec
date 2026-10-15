## Context

The proposal holds the motive. This file holds how the work lands.

- **One block, one store** — `AuctionWinnerOrder` in `packages/ui` renders the
  summary from props. `grade10` composes it on the Winner Order page;
  `apps/preview` holds the fixtures and stories.
- **The note slot already exists** — `summary.total.footnote` renders a muted
  line under the Order Total row. It predates this change and is the exact
  surface the note needs.
- **The contract to shed is unshipped** — `summary.currencyToggle` and the
  `subtext`-swap behaviour landed only on this branch for the retracted
  `collapse-order-summary-usd-recap`; removing them restores the committed
  contract, and `lines[].subtext` keeps rendering under its value as before.

## Goals / Non-Goals

**Goals:**

- The HKD summary reads one currency, with the note naming the USD figure
  converted and the fixed rate under the total.
- No contract change: the note rides `summary.total.footnote`; the block
  drops the toggle prop it gained for the retracted design.

**Non-Goals:**

- Speccing `footnote` itself; it is generic contract coverage, not this
  change's decision.
- Changing what `subtext` does where it still renders; consumers that supply
  no toggle see it under the value as before.

## Decisions

The specs govern the rules. These rows record how they are built.

### Where the note lives

- **Spec governs** — `grade10-site/auction/winner-order`, "The Order Summary
  reads the settlement currency".
- **The total's `footnote`** — the consumer supplies the composed note text,
  e.g. `Converted from US$131.21 at 1 USD = 7.85 HKD`. The block renders it
  under the total row; it owns no conversion math and holds no state.
- **Copy is the consumer's** — the figure inside the note is the converted
  lines' USD total, per decisions Q3; the block only prints what it is given.
- **Rejected: a dedicated prop** — `conversionNote` would duplicate
  `footnote` one row lower; the generic slot already reads as intended.
