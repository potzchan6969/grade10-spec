## Context

The combined listing history is assembled in `combinedHistory.ts` in `9gag/grade10`. Its same-timestamp tiebreak puts the challenger's public record before the automatic response, which reads as a chronology by arrival. [The capability spec](../../specs/grade10-site/auction/bidding-history/spec.md) now governs bid amount order, higher on top; see [the proposal](proposal.md) for why. The page cursor and whole-decision paging (`SC-14`, `SC-48`) already depend on a stable, total order.

## Goals / Non-Goals

**Goals:**
- One comparison decides the order everywhere the history is built, so pages and cursors agree with a single read
- The order stays total and deterministic

**Non-Goals:**
- The admin Bids tab (#1321), which has its own assembly
- A new event kind, field, or wire change; the auction service already returns every record the history needs

## Decisions

- **Where it changes** - The ordering comparison in `combinedHistory.ts` is the one place. The spec governs what is shown; this file only decides where the change is made. Rejected: reversing the list at render, which would reverse cursor pages and the whole-decision grouping with it.
- **Comparison** - Every record one auction decision wrote sorts at that decision's highest public bid, higher first, so a maximum set sorts with the bid it causes and reads below it even where its own amount is higher. A decision that wrote no public bid, such as a raise, is keyed by its own time and sorts newer above older among the amount-keyed decisions, as `grade10-site-auction-bidding-history-SC-56` states. Within one timestamp group the automatic response sorts above the challenger's record. The comparison reads fields the history already carries (amount, timestamp, record kind); the exact tiebreak keys are the implementer's, because tests assert the order, not the keys. Rejected: a new sort column on the auction record, because the existing fields already decide it.
- **Equal maximum** - The tie keeps both records at the same resolved amount, the earlier leader still leading; the response sorts above the challenger's record by the same rule, so no separate branch exists.
- **Paging** - Order is applied before the cursor is cut, so the cursor walk of `SC-14` and the whole-decision page of `SC-48` read the same sequence. A decision's records stay together on one page.
- **Tests before code** - The ordering test lands as a failing test first, in its own commit; the end-to-end test `apps/frontend/grade10/e2e/tests/auction/bidding-history/bidding-history.spec.ts` decides the walk and its expectation for the challenger-and-response step flips with it.

## Risks / Trade-offs

- **Cursor drift on deploy** - A cursor issued under the old order may meet the new one mid-walk → the history is read-only and a collector reloads; no stored cursor outlives a session, so no migration is owed
- **Amount ties across decisions** - Two decisions at the same amount must not interleave → the auction's stable order breaks the tie and keeps each decision whole
