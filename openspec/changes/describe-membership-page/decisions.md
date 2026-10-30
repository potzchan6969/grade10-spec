## Goals

- One surface for standing and action: the rail names sections, the title
  row owns the two actions (the pass, the top-up), and the page never
  asks the member to leave for either.
- The ledger is the member's only history — top-up transactions appear as
  ledger entries, with the receipt on the credited entry.

## Non-Goals

- The top-up picker's own contract and refusal states — they belong to
  the top-up surface's spec work, not this page record.
- Motion, spacing and token choices — implementation detail, not a
  requirement.
- Top-Up History as a page — removed by design; nothing was charged and
  no points moved on a declined top-up, so no member-facing surface
  remains to describe.

## Settled

- The top-up entrance is a secondary button beside Member Pass — one
  header zone holds both actions, and the rail stays pure navigation.
- The result is a toast, not a modal — the outcome is a readout on the
  page the member never left; only the confirming wait is a modal,
  because it must not be dismissed.
- The rail deep-links through `?tab=` so a held top-up's toast lands on
  Points History rather than the overview.
- Declined top-ups produce no ledger row — nothing was charged and no
  points moved.
