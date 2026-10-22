## Goals

- A winner matches a receipt link to the PDF it opens and to the ID a
  letter quotes, without asking Grade10 which is which.
- The issue date sits in the label — not a column.

## Non-Goals

- Changing the receipt PDF, the receipt ID scheme
  (`RC-[CODE][INVOICE_SEQ]P[RECEIPT_SEQ]`), or historical receipt IDs.
- Reordering the row; oldest issued first already holds.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What does the link read? | `Receipt #<receipt ID> (<issue date>)`; `Receipt` when the record carries no ID — decided by @tangconst, 2026-10-22 | `Receipt · P1` ordinals, or the issue date alone — the ID is the cross-reference the PDF and support letters use |
| Q2 | Does the label drop the `RC-` prefix? | No — the PDF and the ready emails print `RC-LK7P2Q01P1`; the label keeps it so all three match character for character | `Receipt #LK7P2Q01P1`, shorter but off the document's string |
| Q3 | Where does the issue date go? | In the label after the ID — no hover hint; the label already carries the date — revised by @tangconst, 2026-10-22 | A hover hint as well — dropped once the label carried the same fact |
| Q4 | Which zone does the label's date read in? | The viewer's local zone, day-only, as the other day-only dates on Winner Order — the agent took the recommended option while repairing the review; @tangconst to confirm | `Asia/Hong_Kong` as the PDF prints it, which would put the label off the viewer's other dates |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-site/auction/winner-order | A record that carries an issue date but no receipt ID — the rare fallback — does its link still name the date, `Receipt (22 Sep 2026)`, or read `Receipt` alone? | Q1 |
